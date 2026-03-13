import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DataMigrationService {
  private readonly logger = new Logger(DataMigrationService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Helpers ──────────────────────────────────────────────
  private toDateOrNull(val: any): Date | null {
    if (!val || val === '' || val === 'N/A') return null;
    // Handle DD-MMM-YYYY format (e.g., "28-Dec-2023")
    const ddMmmYyyy = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/;
    const match = val.match?.(ddMmmYyyy);
    if (match) {
      const d = new Date(`${match[2]} ${match[1]}, ${match[3]}`);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  private toDecimalOrNull(val: any): number | null {
    if (val === undefined || val === null || val === '' || val === 'N/A') return null;
    const cleaned = String(val).replace(/,/g, '');
    const n = Number(cleaned);
    return isNaN(n) ? null : n;
  }

  private cleanStr(val: any): string | null {
    if (!val || val === '' || val === 'N/A' || val === 'null') return null;
    return String(val).trim();
  }

  // ─── 1. Import Clients ────────────────────────────────────
  async importClients(rows: any[], userId: string) {
    this.logger.log(`Importing ${rows.length} clients...`);

    const results = { created: 0, skipped: 0, errors: [] as string[] };

    // Get existing client names to skip duplicates
    const existing = await this.prisma.insuranceClient.findMany({
      select: { name: true },
    });
    const existingNames = new Set(existing.map((c) => c.name?.toUpperCase()));

    // Get the last client code number
    const lastClient = await this.prisma.insuranceClient.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { clientCode: true },
    });
    let nextNum = 1;
    if (lastClient?.clientCode) {
      const m = lastClient.clientCode.match(/TIB-CLT-(\d+)/);
      if (m) nextNum = parseInt(m[1], 10) + 1;
    }

    for (const row of rows) {
      try {
        const name = this.cleanStr(row.name || row.Name || row['Insured Name']);
        if (!name) {
          results.skipped++;
          continue;
        }

        if (existingNames.has(name.toUpperCase())) {
          results.skipped++;
          continue;
        }

        const clientCode = `TIB-CLT-${String(nextNum).padStart(5, '0')}`;
        nextNum++;

        await this.prisma.insuranceClient.create({
          data: {
            clientCode,
            name,
            phone: this.cleanStr(row.mobile || row.MobileNo || row.phone || row['Mobile Number']),
            email: this.cleanStr(row.email || row.Email || row['Email Id']),
            groupHeadName: this.cleanStr(row.groupHead || row['Group Head']),
            city: this.cleanStr(row.city || row.City),
            createdBy: userId,
          },
        });

        existingNames.add(name.toUpperCase());
        results.created++;
      } catch (err) {
        results.errors.push(`Row ${results.created + results.skipped + results.errors.length + 1}: ${err.message}`);
      }
    }

    this.logger.log(`Client import complete: ${results.created} created, ${results.skipped} skipped, ${results.errors.length} errors`);
    return results;
  }

  // ─── 2. Import MIS Entries (Policy Register) ─────────────
  async importPolicyRegister(rows: any[], userId: string) {
    this.logger.log(`Importing ${rows.length} policy register entries...`);

    const results = { created: 0, skipped: 0, errors: [] as string[] };

    // Get existing policy numbers to skip duplicates
    const existing = await this.prisma.mISEntry.findMany({
      select: { policyNumber: true },
      where: { policyNumber: { not: null } },
    });
    const existingPolicies = new Set(existing.map((e) => e.policyNumber?.toUpperCase()));

    for (const row of rows) {
      try {
        const policyNo = this.cleanStr(row.policyNo || row['Policy No'] || row.policyNumber);
        const customerName = this.cleanStr(row.insuredName || row['Insured Name'] || row.customerName);

        if (!customerName) {
          results.skipped++;
          continue;
        }

        if (policyNo && existingPolicies.has(policyNo.toUpperCase())) {
          results.skipped++;
          continue;
        }

        // Determine LOB from Insurance Type
        const insType = (row.insuranceType || row['Insurance Type'] || '').toUpperCase();
        let lob = 'OTHER';
        if (insType.includes('MOTOR') || insType.includes('TWO WHEELER') || insType.includes('FOUR WHEELER') || insType.includes('COMMERCIAL')) {
          if (insType.includes('TWO')) lob = 'MOTOR_TWO_WHEELER';
          else if (insType.includes('COMMERCIAL') || insType.includes('GCV') || insType.includes('PCV')) lob = 'MOTOR_COMMERCIAL';
          else lob = 'MOTOR_FOUR_WHEELER';
        } else if (insType.includes('HEALTH')) {
          lob = 'HEALTH_INDIVIDUAL';
        } else if (insType.includes('FIRE')) {
          lob = 'FIRE';
        } else if (insType.includes('MARINE')) {
          lob = 'MARINE';
        } else if (insType.includes('BURGLARY') || insType.includes('MISC')) {
          lob = 'OTHER';
        } else if (insType.includes('PA') || insType.includes('PERSONAL ACCIDENT')) {
          lob = 'PERSONAL_ACCIDENT';
        }

        const now = new Date();
        const date = now.toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(10000 + Math.random() * 90000);
        const misCode = `MIS-VJ-${date}-${rand}`;

        const entryDate = this.toDateOrNull(row.from || row.From || row['Policy Start Date']);

        await this.prisma.mISEntry.create({
          data: {
            misCode,
            customerName,
            policyNumber: policyNo,
            insurerName: this.cleanStr(row.company || row.Company || row['Company Name']),
            lob,
            sourceType: 'VJ_INFOSOFT_IMPORT',
            entryDate: entryDate || new Date(),
            entryMonth: this.getEntryMonth(entryDate),
            policyStartDate: this.toDateOrNull(row.from || row.From || row['Policy Start Date'] || row['Risk Start']),
            policyEndDate: this.toDateOrNull(row.to || row.To || row['Policy End Date'] || row['End Date']),
            pospName: this.cleanStr(row.posName || row['POS Name']),
            branchName: this.cleanStr(row.branchName || row['Branch Name']),
            sumInsured: this.toDecimalOrNull(row.sumInsured || row['Sum Insured'] || row.SA),
            odPremium: this.toDecimalOrNull(row.basicOdPremium || row['Basic/OD Premium'] || row['Basic/OD'] || row['OD Premium']),
            tpPremium: this.toDecimalOrNull(row.tpPremium || row['TP Premium'] || row.TP),
            netPremium: this.toDecimalOrNull(row.netPremium || row.NetPremium || row['Net Premium']),
            gstAmount: this.toDecimalOrNull(row.gst || row.GST),
            grossPremium: this.toDecimalOrNull(row.finalPremium || row['Final Premium'] || row['Gross Premium'] || row.Total),
            vehicleRegNo: this.cleanStr(row.regNo || row['Reg No'] || row['Reg. No']),
            vehicleMake: this.cleanStr(row.make || row.Make),
            policyType: this.cleanStr(row.policyType || row['Policy Type'] || row['Insurance Type']),
            status: 'VERIFIED',
            makerId: userId,
          },
        });

        if (policyNo) existingPolicies.add(policyNo.toUpperCase());
        results.created++;
      } catch (err) {
        results.errors.push(`Row ${results.created + results.skipped + results.errors.length + 1}: ${err.message}`);
      }
    }

    this.logger.log(`Policy import complete: ${results.created} created, ${results.skipped} skipped`);
    return results;
  }

  // ─── 3. Import POS Payout / Commission Data ──────────────
  async importPayoutData(rows: any[], userId: string) {
    this.logger.log(`Importing ${rows.length} payout records as MIS entries...`);

    const results = { created: 0, skipped: 0, updated: 0, errors: [] as string[] };

    for (const row of rows) {
      try {
        const policyNo = this.cleanStr(row.policyNo || row['Policy No']);
        const customerName = this.cleanStr(row.customerName || row['Customer Name']);

        if (!customerName && !policyNo) {
          results.skipped++;
          continue;
        }

        // Check if a MIS entry with this policy number already exists
        if (policyNo) {
          const existing = await this.prisma.mISEntry.findFirst({
            where: { policyNumber: { equals: policyNo, mode: 'insensitive' } },
          });

          if (existing) {
            // Update with commission data
            await this.prisma.mISEntry.update({
              where: { id: existing.id },
              data: {
                commissionAmount: this.toDecimalOrNull(row['POS Payable Amount'] || row.posPayableAmount),
                pospName: this.cleanStr(row['POS Name'] || row.posName) || existing.pospName,
                referredBy: this.cleanStr(row['RM Name'] || row.rmName) || existing.referredBy,
              },
            });
            results.updated++;
            continue;
          }
        }

        // Create new MIS entry from payout data
        const insType = (row['Insurance Type'] || row.insuranceType || '').toUpperCase();
        let lob = 'OTHER';
        if (insType.includes('MOTOR')) lob = 'MOTOR_FOUR_WHEELER';
        else if (insType.includes('HEALTH')) lob = 'HEALTH_INDIVIDUAL';
        else if (insType.includes('FIRE')) lob = 'FIRE';
        else if (insType.includes('MARINE')) lob = 'MARINE';

        const now = new Date();
        const date = now.toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(10000 + Math.random() * 90000);

        await this.prisma.mISEntry.create({
          data: {
            misCode: `MIS-VJ-${date}-${rand}`,
            customerName: customerName || 'Unknown',
            policyNumber: policyNo,
            insurerName: this.cleanStr(row['Company Name'] || row.companyName),
            lob,
            sourceType: 'VJ_INFOSOFT_IMPORT',
            entryDate: this.toDateOrNull(row['Login Date'] || row.loginDate) || new Date(),
            entryMonth: this.getEntryMonth(this.toDateOrNull(row['Login Date'] || row.loginDate)),
            policyStartDate: this.toDateOrNull(row['Policy Start Date'] || row.policyStartDate),
            policyEndDate: this.toDateOrNull(row['Policy End Date'] || row.policyEndDate),
            pospName: this.cleanStr(row['POS Name'] || row.posName),
            branchName: this.cleanStr(row['Branch Name'] || row.branchName),
            sumInsured: this.toDecimalOrNull(row['Sum Insured'] || row.sumInsured),
            odPremium: this.toDecimalOrNull(row['OD Premium'] || row.odPremium),
            tpPremium: this.toDecimalOrNull(row['TP Premium'] || row.tpPremium),
            netPremium: this.toDecimalOrNull(row['Net Premium'] || row.netPremium),
            grossPremium: this.toDecimalOrNull(row['Gross Premium'] || row.grossPremium),
            commissionAmount: this.toDecimalOrNull(row['POS Payable Amount'] || row.posPayableAmount),
            vehicleRegNo: this.cleanStr(row['Reg No'] || row.regNo),
            vehicleMake: this.cleanStr(row.Make || row.make),
            policyType: this.cleanStr(row['Policy Type'] || row.policyType),
            referredBy: this.cleanStr(row['RM Name'] || row.rmName),
            status: 'VERIFIED',
            makerId: userId,
          },
        });

        results.created++;
      } catch (err) {
        results.errors.push(`Row ${results.created + results.skipped + results.errors.length + 1}: ${err.message}`);
      }
    }

    this.logger.log(`Payout import complete: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`);
    return results;
  }

  // ─── 4. Import Renewal Due Data ───────────────────────────
  async importRenewalDue(rows: any[], userId: string) {
    this.logger.log(`Importing ${rows.length} renewal due records...`);

    const results = { created: 0, skipped: 0, updated: 0, errors: [] as string[] };

    for (const row of rows) {
      try {
        const policyNo = this.cleanStr(row.policyNo || row['Policy No']);
        const insuredName = this.cleanStr(row.insuredName || row['Insured Name']);

        if (!insuredName && !policyNo) {
          results.skipped++;
          continue;
        }

        // Check if policy already exists as MIS entry
        if (policyNo) {
          const existing = await this.prisma.mISEntry.findFirst({
            where: { policyNumber: { equals: policyNo.replace(/^\*/, ''), mode: 'insensitive' } },
          });

          if (existing) {
            // Update with renewal info
            await this.prisma.mISEntry.update({
              where: { id: existing.id },
              data: {
                isRenewal: true,
                customerPhone: this.cleanStr(row.ContNo || row.contNo) || existing.customerPhone,
                customerEmail: this.cleanStr(row.Email || row.email) || existing.customerEmail,
              },
            });
            results.updated++;
            continue;
          }
        }

        // Create as new MIS entry for renewal tracking
        const insType = (row['Insurance Type'] || row.insuranceType || '').toUpperCase();
        let lob = 'OTHER';
        if (insType.includes('MOTOR')) lob = 'MOTOR_FOUR_WHEELER';
        else if (insType.includes('HEALTH')) lob = 'HEALTH_INDIVIDUAL';
        else if (insType.includes('FIRE')) lob = 'FIRE';

        const now = new Date();
        const date = now.toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(10000 + Math.random() * 90000);

        await this.prisma.mISEntry.create({
          data: {
            misCode: `MIS-VJ-${date}-${rand}`,
            customerName: insuredName || 'Unknown',
            customerPhone: this.cleanStr(row.ContNo || row.contNo),
            customerEmail: this.cleanStr(row.Email || row.email),
            policyNumber: policyNo ? policyNo.replace(/^\*/, '') : null,
            insurerName: this.cleanStr(row['Ins. Co.'] || row.insCo),
            lob,
            sourceType: 'VJ_INFOSOFT_IMPORT',
            entryDate: this.toDateOrNull(row['Login Date'] || row.loginDate) || new Date(),
            entryMonth: this.getEntryMonth(this.toDateOrNull(row['Login Date'] || row.loginDate)),
            policyStartDate: this.toDateOrNull(row['Risk Start'] || row.riskStart),
            policyEndDate: this.toDateOrNull(row['End Date'] || row.endDate),
            pospName: this.cleanStr(row['POS Name'] || row.posName),
            branchName: this.cleanStr(row['Branch Name'] || row.branchName),
            sumInsured: this.toDecimalOrNull(row.SA || row.sa),
            odPremium: this.toDecimalOrNull(row['Basic/OD'] || row.basicOd),
            tpPremium: this.toDecimalOrNull(row.TP || row.tp),
            netPremium: this.toDecimalOrNull(row['Net Premium'] || row.netPremium),
            gstAmount: this.toDecimalOrNull(row.GST || row.gst),
            grossPremium: this.toDecimalOrNull(row.Total || row.total),
            vehicleRegNo: this.cleanStr(row['Reg. No'] || row.regNo),
            vehicleMake: this.cleanStr(row.Make || row.make),
            policyType: this.cleanStr(row['Product Name'] || row.productName),
            referredBy: this.cleanStr(row['RM Name'] || row.rmName),
            isRenewal: true,
            status: 'VERIFIED',
            makerId: userId,
          },
        });

        results.created++;
      } catch (err) {
        results.errors.push(`Row ${results.created + results.skipped + results.errors.length + 1}: ${err.message}`);
      }
    }

    this.logger.log(`Renewal import complete: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`);
    return results;
  }

  // ─── 5. Get migration status ──────────────────────────────
  async getMigrationStatus() {
    const [totalClients, totalMIS, importedMIS, importedClients] = await Promise.all([
      this.prisma.insuranceClient.count(),
      this.prisma.mISEntry.count(),
      this.prisma.mISEntry.count({ where: { sourceType: 'VJ_INFOSOFT_IMPORT' } }),
      this.prisma.insuranceClient.count(),
    ]);

    return {
      totalClients,
      totalMISEntries: totalMIS,
      importedFromVJ: importedMIS,
      importedClients,
    };
  }

  // ─── Helper: entry month ──────────────────────────────────
  private getEntryMonth(date?: Date | null): string {
    const d = date || new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { POSPService } from './posp.service';
import * as XLSX from 'xlsx';

/**
 * POSP Export Service
 * Generates Excel (XLSX) and CSV exports of POSP data
 * Respects hierarchy-scoped data access (RM sees their POSPs, CDM sees team, admin sees all)
 */
@Injectable()
export class POSPExportService {
  private readonly logger = new Logger('POSPExportService');

  constructor(private pospService: POSPService) {}

  /**
   * Export POSPs to Excel (XLSX) buffer
   */
  async exportToExcel(
    userId: string,
    userRole: UserRole,
    filters: { status?: any; category?: any; search?: string },
  ): Promise<Buffer> {
    const posps = await this.pospService.getAllForExport(userId, userRole, filters);
    const rows = this.transformToRows(posps);

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 18 }, // Agent Code
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 20 }, // Status
      { wch: 15 }, // Category
      { wch: 15 }, // Branch
      { wch: 15 }, // City
      { wch: 15 }, // State
      { wch: 12 }, // Policies Sold
      { wch: 18 }, // Premium Generated
      { wch: 18 }, // Commission Earned
      { wch: 12 }, // Active Policies
      { wch: 12 }, // Renewal Rate
      { wch: 20 }, // Created At
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'POSP Agents');

    // Add a summary sheet
    const summaryData = this.getSummaryData(posps);
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    this.logger.log(`Exported ${posps.length} POSPs to Excel for user ${userId}`);
    return buffer;
  }

  /**
   * Export POSPs to CSV buffer
   */
  async exportToCSV(
    userId: string,
    userRole: UserRole,
    filters: { status?: any; category?: any; search?: string },
  ): Promise<Buffer> {
    const posps = await this.pospService.getAllForExport(userId, userRole, filters);
    const rows = this.transformToRows(posps);

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    this.logger.log(`Exported ${posps.length} POSPs to CSV for user ${userId}`);
    return Buffer.from(csv, 'utf-8');
  }

  /**
   * Transform POSP records to flat export rows
   */
  private transformToRows(posps: any[]): any[] {
    return posps.map((posp, index) => ({
      'Sl. No.': index + 1,
      'Agent Code': posp.agentCode,
      'Name': `${posp.firstName} ${posp.lastName}`,
      'Email': posp.email,
      'Phone': posp.phone,
      'Status': this.formatStatus(posp.status),
      'Category': posp.category,
      'Branch ID': posp.branchId || '-',
      'City': posp.city || '-',
      'State': posp.state || '-',
      'Policies Sold': posp.totalPoliciesSold || 0,
      'Premium Generated': Number(posp.totalPremiumGenerated || 0).toFixed(2),
      'Commission Earned': Number(posp.totalCommissionEarned || 0).toFixed(2),
      'Active Policies': posp.activePolicies || 0,
      'Renewal Rate (%)': Number(posp.renewalRate || 0).toFixed(2),
      'IRDAI License': posp.irdaiLicenseNumber || '-',
      'Certificate No.': posp.certificateNumber || '-',
      'Created At': posp.createdAt ? new Date(posp.createdAt).toLocaleDateString('en-IN') : '-',
    }));
  }

  /**
   * Generate summary statistics
   */
  private getSummaryData(posps: any[]): any[] {
    const statusCounts: Record<string, number> = {};
    let totalPremium = 0;
    let totalCommission = 0;
    let totalPolicies = 0;

    posps.forEach((p) => {
      const status = this.formatStatus(p.status);
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      totalPremium += Number(p.totalPremiumGenerated || 0);
      totalCommission += Number(p.totalCommissionEarned || 0);
      totalPolicies += p.totalPoliciesSold || 0;
    });

    const summary: any[] = [
      { Metric: 'Total POSP Agents', Value: posps.length },
      { Metric: 'Total Policies Sold', Value: totalPolicies },
      { Metric: 'Total Premium Generated', Value: totalPremium.toFixed(2) },
      { Metric: 'Total Commission Earned', Value: totalCommission.toFixed(2) },
      { Metric: '---', Value: '---' },
      { Metric: 'Status Breakdown', Value: '' },
    ];

    Object.entries(statusCounts).forEach(([status, count]) => {
      summary.push({ Metric: `  ${status}`, Value: count });
    });

    summary.push(
      { Metric: '---', Value: '---' },
      { Metric: 'Report Generated', Value: new Date().toLocaleString('en-IN') },
    );

    return summary;
  }

  /**
   * Format POSP status to human-readable text
   */
  private formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      APPLICATION_RECEIVED: 'Application Received',
      TRAINING_IN_PROGRESS: 'Training In Progress',
      TRAINING_COMPLETED: 'Training Completed',
      EXAM_SCHEDULED: 'Exam Scheduled',
      EXAM_PASSED: 'Exam Passed',
      EXAM_FAILED: 'Exam Failed',
      CERTIFICATE_ISSUED: 'Certificate Issued',
      ACTIVE: 'Active',
      SUSPENDED: 'Suspended',
      TERMINATED: 'Terminated',
    };
    return statusMap[status] || status;
  }
}

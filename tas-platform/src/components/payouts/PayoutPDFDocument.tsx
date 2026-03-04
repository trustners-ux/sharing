import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';
import {
  type Category,
  type LOB,
  type ProductEntry,
  LOB_CONFIG,
  LOB_TERMS,
  calculateAgentPayout,
} from '@/data/posp-payout-data';

// --- Types ---
interface PayoutPDFProps {
  pospName: string;
  pospCode: string;
  giCategory: Category;
  liCategory: Category;
  hiCategory: Category;
  generatedDate: string;
}

// --- Styles ---
const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 30,
    fontSize: 7.5,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  // Header
  headerBand: {
    backgroundColor: '#0A1628',
    padding: 16,
    borderRadius: 4,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  companySubtitle: {
    fontSize: 8,
    color: '#93c5fd',
    textAlign: 'center',
    marginTop: 3,
  },
  scheduleTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  // POSP Info Box
  infoBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  infoCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  infoCellLast: {
    flex: 1,
    padding: 8,
  },
  infoLabel: {
    fontSize: 6.5,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  // LOB Section
  lobBanner: {
    padding: 8,
    borderRadius: 3,
    marginBottom: 6,
    marginTop: 8,
  },
  lobBannerText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  lobSubtext: {
    fontSize: 7,
    color: '#e2e8f0',
    textAlign: 'center',
    marginTop: 2,
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3.5,
    paddingHorizontal: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 3.5,
    paddingHorizontal: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  productGroupRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: '#e0f2fe',
    borderBottomWidth: 0.5,
    borderBottomColor: '#bae6fd',
  },
  productGroupText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#0c4a6e',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  // Column widths
  colNum:     { width: '5%', textAlign: 'center' as const },
  colProduct: { width: '32%', paddingRight: 4 },
  colInsurer: { width: '22%', textAlign: 'center' as const },
  colPayout:  { width: '15%', textAlign: 'center' as const },
  colBasis:   { width: '26%', textAlign: 'center' as const },
  // Cell text
  cellText: {
    fontSize: 7,
    color: '#334155',
  },
  cellTextBold: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#15803d',
  },
  cellTextMuted: {
    fontSize: 6.5,
    color: '#64748b',
  },
  // Terms
  termsBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fffbeb',
    borderWidth: 0.5,
    borderColor: '#fde68a',
    borderRadius: 3,
  },
  termsTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#92400e',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  termsText: {
    fontSize: 6.5,
    color: '#78350f',
    marginBottom: 2,
    lineHeight: 1.4,
  },
  // Disclaimer
  disclaimerBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
  },
  disclaimerText: {
    fontSize: 6,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 6,
    color: '#94a3b8',
  },
  footerCenter: {
    fontSize: 6,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

// --- Helper: Render LOB Table ---
function LOBSection({
  lob,
  category,
  data,
  lobConfig,
}: {
  lob: LOB;
  category: Category;
  data: ProductEntry[];
  lobConfig: { fullName: string; color: string };
}) {
  let serial = 0;
  let currentProductLine = '';

  return (
    <View>
      {/* LOB Banner */}
      <View style={[styles.lobBanner, { backgroundColor: lobConfig.color }]} wrap={false}>
        <Text style={styles.lobBannerText}>{lobConfig.fullName.toUpperCase()}</Text>
        <Text style={styles.lobSubtext}>
          Category {category} | {data.length} Products | FY 2025-26
        </Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader} wrap={false}>
        <View style={styles.colNum}><Text style={styles.tableHeaderText}>#</Text></View>
        <View style={styles.colProduct}><Text style={styles.tableHeaderText}>Product</Text></View>
        <View style={styles.colInsurer}><Text style={styles.tableHeaderText}>Insurer</Text></View>
        <View style={styles.colPayout}><Text style={styles.tableHeaderText}>Your Payout</Text></View>
        <View style={styles.colBasis}><Text style={styles.tableHeaderText}>Calculated On</Text></View>
      </View>

      {/* Table Rows */}
      {data.map((entry, idx) => {
        const result = calculateAgentPayout(entry.trustnerCommission, category);
        const isNewGroup = entry.productLine !== currentProductLine;
        if (isNewGroup) currentProductLine = entry.productLine;
        serial++;
        const isAlt = serial % 2 === 0;

        return (
          <View key={idx}>
            {isNewGroup && (
              <View style={styles.productGroupRow} wrap={false}>
                <Text style={styles.productGroupText}>{entry.productLine}</Text>
              </View>
            )}
            <View style={isAlt ? styles.tableRowAlt : styles.tableRow} wrap={false}>
              <View style={styles.colNum}>
                <Text style={styles.cellText}>{serial}</Text>
              </View>
              <View style={styles.colProduct}>
                <Text style={styles.cellText}>{entry.product}</Text>
              </View>
              <View style={styles.colInsurer}>
                <Text style={styles.cellTextMuted}>{entry.insurer}</Text>
              </View>
              <View style={styles.colPayout}>
                <Text style={styles.cellTextBold}>{result.agentPayout.toFixed(2)}%</Text>
              </View>
              <View style={styles.colBasis}>
                <Text style={styles.cellTextMuted}>{entry.basis}</Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* Terms & Conditions */}
      <View style={styles.termsBox} wrap={false}>
        <Text style={styles.termsTitle}>Terms & Conditions - {lobConfig.fullName}</Text>
        {LOB_TERMS[lob].map((term, i) => (
          <Text key={i} style={styles.termsText}>{i + 1}. {term}</Text>
        ))}
      </View>
    </View>
  );
}

// --- Main PDF Document ---
export default function PayoutPDFDocument({
  pospName,
  pospCode,
  giCategory,
  liCategory,
  hiCategory,
  generatedDate,
}: PayoutPDFProps) {
  const lobs: { lob: LOB; category: Category }[] = [
    { lob: 'GI', category: giCategory },
    { lob: 'LI', category: liCategory },
    { lob: 'HI', category: hiCategory },
  ];

  return (
    <Document
      title={`Trustner POSP Payout Schedule - ${pospName}`}
      author="Trustner Insurance Brokers Private Limited"
      subject="POSP Commission Payout Schedule"
      creator="Trustner Payout Generator"
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.headerBand} fixed>
          <Text style={styles.companyName}>TRUSTNER INSURANCE BROKERS</Text>
          <Text style={styles.companySubtitle}>
            Private Limited | IRDAI Licensed Broker | License No. 1067
          </Text>
          <Text style={styles.scheduleTitle}>POSP COMMISSION PAYOUT SCHEDULE</Text>
        </View>

        {/* POSP Info */}
        <View style={styles.infoBox}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>Agent Name</Text>
            <Text style={styles.infoValue}>{pospName}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>POSP Code</Text>
            <Text style={styles.infoValue}>{pospCode}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>Categories</Text>
            <Text style={styles.infoValue}>
              GI: {giCategory} | LI: {liCategory} | HI: {hiCategory}
            </Text>
          </View>
          <View style={styles.infoCellLast}>
            <Text style={styles.infoLabel}>Date Issued</Text>
            <Text style={styles.infoValue}>{generatedDate}</Text>
          </View>
        </View>

        {/* LOB Sections */}
        {lobs.map(({ lob, category }) => (
          <LOBSection
            key={lob}
            lob={lob}
            category={category}
            data={LOB_CONFIG[lob].data}
            lobConfig={LOB_CONFIG[lob]}
          />
        ))}

        {/* Final Disclaimer */}
        <View style={styles.disclaimerBox} wrap={false}>
          <Text style={styles.disclaimerText}>
            This payout schedule is issued by Trustner Insurance Brokers Private Limited
            (IRDAI License No. 1067 | CIN: U66220AS2024PTC025948) and is confidential.
            Commission rates are indicative and subject to revision. Payouts are processed
            after premium realization. Insurance is the subject matter of solicitation.
            For queries: operations@trustner.in | +91-6003903737
          </Text>
        </View>

        {/* Page Footer (fixed on every page) */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Trustner Insurance Brokers Pvt. Ltd.</Text>
          <Text
            style={styles.footerCenter}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
          <Text style={styles.footerText}>Confidential - For POSP Use Only</Text>
        </View>
      </Page>
    </Document>
  );
}

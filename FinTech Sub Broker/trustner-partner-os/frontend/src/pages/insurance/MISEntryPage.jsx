import React, { useState, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  FileSpreadsheet,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import misAPI from '../../services/mis';

const LOB_OPTIONS = [
  { value: 'MOTOR_TWO_WHEELER', label: 'Motor - Two Wheeler' },
  { value: 'MOTOR_FOUR_WHEELER', label: 'Motor - Four Wheeler' },
  { value: 'MOTOR_COMMERCIAL', label: 'Motor - Commercial' },
  { value: 'HEALTH_INDIVIDUAL', label: 'Health - Individual' },
  { value: 'HEALTH_FAMILY_FLOATER', label: 'Health - Family Floater' },
  { value: 'HEALTH_GROUP', label: 'Health - Group' },
  { value: 'HEALTH_CRITICAL_ILLNESS', label: 'Health - Critical Illness' },
  { value: 'HEALTH_TOP_UP', label: 'Health - Top Up' },
  { value: 'LIFE_TERM', label: 'Life - Term' },
  { value: 'LIFE_ENDOWMENT', label: 'Life - Endowment' },
  { value: 'LIFE_ULIP', label: 'Life - ULIP' },
  { value: 'LIFE_WHOLE_LIFE', label: 'Life - Whole Life' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'HOME', label: 'Home' },
  { value: 'FIRE', label: 'Fire' },
  { value: 'MARINE', label: 'Marine' },
  { value: 'LIABILITY', label: 'Liability' },
  { value: 'PA_PERSONAL_ACCIDENT', label: 'Personal Accident' },
  { value: 'CYBER', label: 'Cyber' },
];

const POLICY_TYPE_OPTIONS = [
  { value: 'Motor', label: 'Motor' },
  { value: 'Health', label: 'Health' },
  { value: 'Life', label: 'Life' },
  { value: 'Fire', label: 'Fire' },
  { value: 'Marine', label: 'Marine' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Liability', label: 'Liability' },
  { value: 'Personal Accident', label: 'Personal Accident' },
  { value: 'Cyber', label: 'Cyber' },
  { value: 'Home', label: 'Home' },
  { value: 'Other', label: 'Other' },
];

const MOTOR_POLICY_TYPE_OPTIONS = [
  { value: 'Comprehensive', label: 'Comprehensive' },
  { value: 'Third Party Only', label: 'Third Party (TP) Only' },
  { value: 'Standalone OD', label: 'Standalone OD' },
  { value: 'Bundled', label: 'Bundled (Package)' },
];

const POLICY_CATEGORY_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'RENEWAL', label: 'Renewal' },
];

const PAYMENT_MODE_OPTIONS = [
  { value: 'Online', label: 'Online' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'NEFT', label: 'NEFT/RTGS' },
  { value: 'Card', label: 'Debit/Credit Card' },
];

const MONTH_OPTIONS = (() => {
  const months = [];
  const now = new Date();
  for (let i = -3; i <= 1; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    months.push({
      value: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return months;
})();

const INITIAL_FORM = {
  // Entry Metadata
  entryDate: new Date().toISOString().slice(0, 10),
  entryMonth: '',
  // Customer Details
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  insurerName: '',
  // Policy Details
  policyNumber: '',
  productName: '',
  lob: '',
  policyType: '',
  motorPolicyType: '',
  policyCategory: 'NEW',
  sumInsured: '',
  // Policy Dates
  policyStartDate: '',
  policyEndDate: '',
  issuedDate: '',
  // Premium Breakdown
  odPremium: '',
  tpPremium: '',
  grossPremium: '',
  netPremium: '',
  gstAmount: '',
  newPremium: '',
  // Commission Splits
  netPremium100: '',
  netPremium70: '',
  netPremium30: '',
  renewalPremium50: '',
  commissionAmount: '',
  // Business Source
  referredBy: '',
  businessClosedBy: '',
  agencyBroker: '',
  // POSP
  pospName: '',
  pospCode: '',
  // Location
  employeeLocation: '',
  branchName: '',
  isRenewal: false,
  isNewCustomer: false,
  // Motor-specific
  vehicleRegNo: '',
  vehicleMake: '',
  rtoLocation: '',
  // Payment
  paymentMode: '',
  paymentReference: '',
  // Remarks
  makerRemarks: '',
};

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const sectionClass = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6';

const MISEntryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'upload' ? 'upload' : 'manual';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    motor: false,
    payment: false,
  });

  // File upload state
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Determine if motor LOB is selected
  const isMotorLOB = useMemo(() => {
    return formData.lob?.startsWith('MOTOR_') || formData.policyType === 'Motor';
  }, [formData.lob, formData.policyType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // Auto-set policyCategory when isRenewal changes
      if (name === 'isRenewal') {
        updated.policyCategory = checked ? 'RENEWAL' : 'NEW';
      }
      // Auto-expand motor section when motor LOB selected
      if (name === 'lob' && value.startsWith('MOTOR_')) {
        setExpandedSections((s) => ({ ...s, motor: true }));
      }
      return updated;
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const payload = { ...formData };
      // Convert numeric fields
      const numericFields = [
        'sumInsured', 'grossPremium', 'netPremium', 'commissionAmount',
        'odPremium', 'tpPremium', 'gstAmount', 'newPremium',
        'netPremium100', 'netPremium70', 'netPremium30', 'renewalPremium50',
      ];
      numericFields.forEach((f) => {
        payload[f] = payload[f] ? parseFloat(payload[f]) : undefined;
      });
      // Remove empty string fields
      Object.keys(payload).forEach((key) => {
        if (payload[key] === '') delete payload[key];
      });
      await misAPI.createEntry(payload);
      setSuccess('MIS entry created successfully');
      setFormData({ ...INITIAL_FORM });
      setTimeout(() => {
        navigate('/insurance/mis');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create MIS entry');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError('Please upload an Excel (.xlsx, .xls) or CSV (.csv) file');
      return;
    }
    setUploadedFile(file);
    setError(null);

    try {
      setUploading(true);
      const formPayload = new FormData();
      formPayload.append('file', file);
      const res = await misAPI.uploadFile(formPayload);
      const rows = res.data?.rows || res.data || [];
      setParsedRows(rows.map((row, idx) => ({ ...row, _idx: idx, _editing: false })));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to parse uploaded file');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRowFieldChange = (idx, field, value) => {
    setParsedRows((prev) =>
      prev.map((row) => (row._idx === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmitAll = async () => {
    try {
      setUploading(true);
      setError(null);
      const payload = parsedRows.map(({ _idx, _editing, ...row }) => row);
      await misAPI.createEntry({ entries: payload, bulk: true });
      setSuccess(`${payload.length} entries submitted successfully`);
      setParsedRows([]);
      setUploadedFile(null);
      setTimeout(() => navigate('/insurance/mis'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit entries');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'slNo', 'entryDate', 'entryMonth', 'customerName', 'customerPhone', 'customerEmail',
      'insurerName', 'policyNumber', 'lob', 'policyType', 'motorPolicyType', 'policyCategory',
      'policyStartDate', 'policyEndDate', 'issuedDate',
      'odPremium', 'tpPremium', 'grossPremium', 'netPremium', 'gstAmount', 'newPremium',
      'netPremium100', 'netPremium70', 'netPremium30', 'renewalPremium50', 'commissionAmount',
      'referredBy', 'businessClosedBy', 'agencyBroker',
      'pospName', 'pospCode', 'employeeLocation', 'branchName',
      'isRenewal', 'isNewCustomer',
      'vehicleRegNo', 'vehicleMake', 'rtoLocation',
      'paymentMode', 'paymentReference', 'makerRemarks',
    ];
    const csv = headers.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mis_entry_template.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const hasGaps = (row) => {
    return !row.customerName || !row.policyNumber || !row.lob || !row.grossPremium;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">New MIS Entry</h1>
        <p className="text-gray-600 mt-2">Add insurance policy data manually or upload a file</p>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'manual'
              ? 'bg-white text-teal-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Manual Entry
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-teal-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          File Upload
        </button>
      </div>

      {/* Manual Entry Tab */}
      {activeTab === 'manual' && (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Entry Metadata */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Entry Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Entry Date *</label>
                <input type="date" name="entryDate" value={formData.entryDate} onChange={handleChange}
                  className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Month</label>
                <select name="entryMonth" value={formData.entryMonth} onChange={handleChange} className={inputClass}>
                  <option value="">Auto-detect</option>
                  {MONTH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Status (New / Renewal) *</label>
                <select name="policyCategory" value={formData.policyCategory} onChange={handleChange} className={inputClass}>
                  {POLICY_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Customer Details */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Name *</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                  className={inputClass} required placeholder="Customer full name" />
              </div>
              <div>
                <label className={labelClass}>Contact No.</label>
                <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange}
                  className={inputClass} placeholder="Mobile number" />
              </div>
              <div>
                <label className={labelClass}>Email ID</label>
                <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange}
                  className={inputClass} placeholder="Email address" />
              </div>
            </div>
          </div>

          {/* Section 3: Policy Details */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Policy Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Policy Number (P/No)</label>
                <input type="text" name="policyNumber" value={formData.policyNumber} onChange={handleChange}
                  className={inputClass} placeholder="Policy number" />
              </div>
              <div>
                <label className={labelClass}>Company (Insurer) *</label>
                <input type="text" name="insurerName" value={formData.insurerName} onChange={handleChange}
                  className={inputClass} placeholder="Insurance company name" />
              </div>
              <div>
                <label className={labelClass}>Line of Business *</label>
                <select name="lob" value={formData.lob} onChange={handleChange}
                  className={inputClass} required>
                  <option value="">Select LOB</option>
                  {LOB_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Policy Type</label>
                <select name="policyType" value={formData.policyType} onChange={handleChange} className={inputClass}>
                  <option value="">Select Type</option>
                  {POLICY_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {isMotorLOB && (
                <div>
                  <label className={labelClass}>Type of Motor Policy</label>
                  <select name="motorPolicyType" value={formData.motorPolicyType} onChange={handleChange} className={inputClass}>
                    <option value="">Select Motor Type</option>
                    {MOTOR_POLICY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className={labelClass}>Product Name</label>
                <input type="text" name="productName" value={formData.productName} onChange={handleChange}
                  className={inputClass} placeholder="Product name" />
              </div>
              <div>
                <label className={labelClass}>Sum Insured</label>
                <input type="number" name="sumInsured" value={formData.sumInsured} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Section 4: Policy Dates */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Policy Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>From (Start Date)</label>
                <input type="date" name="policyStartDate" value={formData.policyStartDate} onChange={handleChange}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>To (End Date)</label>
                <input type="date" name="policyEndDate" value={formData.policyEndDate} onChange={handleChange}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Issued Date</label>
                <input type="date" name="issuedDate" value={formData.issuedDate} onChange={handleChange}
                  className={inputClass} />
              </div>
            </div>
          </div>

          {/* Section 5: Premium Breakdown */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Premium Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {isMotorLOB && (
                <>
                  <div>
                    <label className={labelClass}>OD Premium</label>
                    <input type="number" name="odPremium" value={formData.odPremium} onChange={handleChange}
                      className={inputClass} min="0" step="0.01" placeholder="0.00" />
                  </div>
                  <div>
                    <label className={labelClass}>TP Premium</label>
                    <input type="number" name="tpPremium" value={formData.tpPremium} onChange={handleChange}
                      className={inputClass} min="0" step="0.01" placeholder="0.00" />
                  </div>
                </>
              )}
              <div>
                <label className={labelClass}>Gross Premium</label>
                <input type="number" name="grossPremium" value={formData.grossPremium} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Net Premium (Without GST) *</label>
                <input type="number" name="netPremium" value={formData.netPremium} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" required />
              </div>
              <div>
                <label className={labelClass}>GST Amount</label>
                <input type="number" name="gstAmount" value={formData.gstAmount} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>New Premium</label>
                <input type="number" name="newPremium" value={formData.newPremium} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Section 6: Commission Splits */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Commission Splits</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className={labelClass}>Net Premium 100%</label>
                <input type="number" name="netPremium100" value={formData.netPremium100} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Net Premium 70%</label>
                <input type="number" name="netPremium70" value={formData.netPremium70} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Net Premium 30%</label>
                <input type="number" name="netPremium30" value={formData.netPremium30} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Renewal Premium 50%</label>
                <input type="number" name="renewalPremium50" value={formData.renewalPremium50} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Commission Amount</label>
                <input type="number" name="commissionAmount" value={formData.commissionAmount} onChange={handleChange}
                  className={inputClass} min="0" step="0.01" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Section 7: Business Source & Sales */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Business Source & Sales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Referred By</label>
                <input type="text" name="referredBy" value={formData.referredBy} onChange={handleChange}
                  className={inputClass} placeholder="Who referred this business?" />
              </div>
              <div>
                <label className={labelClass}>Business Closed By</label>
                <input type="text" name="businessClosedBy" value={formData.businessClosedBy} onChange={handleChange}
                  className={inputClass} placeholder="Who closed this deal?" />
              </div>
              <div>
                <label className={labelClass}>Agency / Broker</label>
                <input type="text" name="agencyBroker" value={formData.agencyBroker} onChange={handleChange}
                  className={inputClass} placeholder="Agency or broker name" />
              </div>
            </div>
          </div>

          {/* Section 8: POSP & Location */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">POSP & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>POSP Name</label>
                <input type="text" name="pospName" value={formData.pospName} onChange={handleChange}
                  className={inputClass} placeholder="POSP agent name" />
              </div>
              <div>
                <label className={labelClass}>POSP Code</label>
                <input type="text" name="pospCode" value={formData.pospCode} onChange={handleChange}
                  className={inputClass} placeholder="POSP code" />
              </div>
              <div>
                <label className={labelClass}>Employee Location</label>
                <input type="text" name="employeeLocation" value={formData.employeeLocation} onChange={handleChange}
                  className={inputClass} placeholder="Location of employee" />
              </div>
              <div>
                <label className={labelClass}>Branch Name</label>
                <input type="text" name="branchName" value={formData.branchName} onChange={handleChange}
                  className={inputClass} placeholder="Branch office" />
              </div>
            </div>
          </div>

          {/* Section 9: Motor Vehicle Details (Collapsible) */}
          {isMotorLOB && (
            <div className={sectionClass}>
              <button type="button" onClick={() => toggleSection('motor')}
                className="flex items-center justify-between w-full text-left">
                <h3 className="text-lg font-bold text-gray-900">Motor Vehicle Details</h3>
                {expandedSections.motor ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedSections.motor && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className={labelClass}>Vehicle Registration No.</label>
                    <input type="text" name="vehicleRegNo" value={formData.vehicleRegNo} onChange={handleChange}
                      className={inputClass} placeholder="AS-01-AB-1234" />
                  </div>
                  <div>
                    <label className={labelClass}>Vehicle Make / Model</label>
                    <input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleChange}
                      className={inputClass} placeholder="e.g., Maruti Swift" />
                  </div>
                  <div>
                    <label className={labelClass}>RTO Location</label>
                    <input type="text" name="rtoLocation" value={formData.rtoLocation} onChange={handleChange}
                      className={inputClass} placeholder="e.g., Guwahati RTO" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 10: Payment Details (Collapsible) */}
          <div className={sectionClass}>
            <button type="button" onClick={() => toggleSection('payment')}
              className="flex items-center justify-between w-full text-left">
              <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
              {expandedSections.payment ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSections.payment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelClass}>Payment Mode</label>
                  <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className={inputClass}>
                    <option value="">Select Payment Mode</option>
                    {PAYMENT_MODE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Payment Reference / UTR</label>
                  <input type="text" name="paymentReference" value={formData.paymentReference} onChange={handleChange}
                    className={inputClass} placeholder="UTR / Transaction Reference" />
                </div>
              </div>
            )}
          </div>

          {/* Section 11: Additional Flags & Remarks */}
          <div className={sectionClass}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
            <div className="flex flex-wrap gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isRenewal" checked={formData.isRenewal} onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                <span className="text-sm text-gray-700">Is Renewal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isNewCustomer" checked={formData.isNewCustomer} onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                <span className="text-sm text-gray-700">New Customer</span>
              </label>
            </div>
            <div>
              <label className={labelClass}>Maker Remarks</label>
              <textarea name="makerRemarks" value={formData.makerRemarks} onChange={handleChange} rows={3}
                className={inputClass}
                placeholder="Any additional notes..." />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/insurance/mis')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit Entry'}
            </button>
          </div>
        </form>
      )}

      {/* File Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className={sectionClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Upload MIS File</h3>
              <button onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700">
                {uploadedFile ? uploadedFile.name : 'Drag & drop your file here'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports Excel (.xlsx, .xls) and CSV (.csv) files
              </p>
              {uploadedFile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                    setParsedRows([]);
                  }}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove file
                </button>
              )}
            </div>
          </div>

          {/* Uploading state */}
          {uploading && (
            <div className={`${sectionClass} text-center`}>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing file...</p>
            </div>
          )}

          {/* Preview Table */}
          {parsedRows.length > 0 && !uploading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Parsed Entries Preview</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {parsedRows.length} rows parsed.{' '}
                      {parsedRows.filter(hasGaps).length > 0 && (
                        <span className="text-red-600 font-medium">
                          {parsedRows.filter(hasGaps).length} rows have missing data.
                        </span>
                      )}
                    </p>
                  </div>
                  <button onClick={handleSubmitAll} disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                    <CheckCircle className="w-4 h-4" />
                    Submit All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">#</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">P/No</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">Company</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">LOB</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-900">Net Premium</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">POSP</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">Location</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row) => {
                      const rowHasGaps = hasGaps(row);
                      return (
                        <tr key={row._idx} className={`border-t border-gray-200 ${rowHasGaps ? 'bg-red-50' : ''}`}>
                          <td className="px-4 py-3 text-gray-600">{row._idx + 1}</td>
                          <td className="px-4 py-3">
                            {rowHasGaps && !row.customerName ? (
                              <input type="text" value={row.customerName || ''} placeholder="Required"
                                onChange={(e) => handleRowFieldChange(row._idx, 'customerName', e.target.value)}
                                className="w-full px-2 py-1 border border-red-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            ) : (
                              <span className="text-gray-900">{row.customerName}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {rowHasGaps && !row.policyNumber ? (
                              <input type="text" value={row.policyNumber || ''} placeholder="Required"
                                onChange={(e) => handleRowFieldChange(row._idx, 'policyNumber', e.target.value)}
                                className="w-full px-2 py-1 border border-red-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            ) : (
                              <span className="text-gray-900">{row.policyNumber}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{row.insurerName || row.company || '-'}</td>
                          <td className="px-4 py-3">
                            {rowHasGaps && !row.lob ? (
                              <select value={row.lob || ''}
                                onChange={(e) => handleRowFieldChange(row._idx, 'lob', e.target.value)}
                                className="w-full px-2 py-1 border border-red-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500">
                                <option value="">Select</option>
                                {LOB_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-900">{row.lob}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {rowHasGaps && !row.grossPremium ? (
                              <input type="number" value={row.grossPremium || ''} placeholder="Required"
                                onChange={(e) => handleRowFieldChange(row._idx, 'grossPremium', e.target.value)}
                                className="w-full px-2 py-1 border border-red-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-teal-500" />
                            ) : (
                              <span className="text-gray-900 font-medium">{row.netPremium || row.grossPremium}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{row.pospName || '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{row.employeeLocation || '-'}</td>
                          <td className="px-4 py-3">
                            {rowHasGaps ? (
                              <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                                <AlertTriangle className="w-3 h-3" /> Gaps
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                <CheckCircle className="w-3 h-3" /> Ready
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MISEntryPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Shield,
  DollarSign,
  FileText,
  AlertTriangle,
  MessageSquare,
  MapPin,
  Briefcase,
  Car,
  CreditCard,
  Users,
} from 'lucide-react';
import misAPI from '../../services/mis';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

const LOB_LABELS = {
  MOTOR_TWO_WHEELER: 'Motor - Two Wheeler',
  MOTOR_FOUR_WHEELER: 'Motor - Four Wheeler',
  MOTOR_COMMERCIAL: 'Motor - Commercial',
  HEALTH_INDIVIDUAL: 'Health - Individual',
  HEALTH_FAMILY_FLOATER: 'Health - Family Floater',
  HEALTH_GROUP: 'Health - Group',
  HEALTH_CRITICAL_ILLNESS: 'Health - Critical Illness',
  HEALTH_TOP_UP: 'Health - Top Up',
  LIFE_TERM: 'Life - Term',
  LIFE_ENDOWMENT: 'Life - Endowment',
  LIFE_ULIP: 'Life - ULIP',
  LIFE_WHOLE_LIFE: 'Life - Whole Life',
  TRAVEL: 'Travel',
  HOME: 'Home',
  FIRE: 'Fire',
  MARINE: 'Marine',
  LIABILITY: 'Liability',
  PA_PERSONAL_ACCIDENT: 'Personal Accident',
  CYBER: 'Cyber',
};

const STATUS_CONFIG = {
  DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Draft' },
  PENDING_VERIFICATION: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Verification' },
  VERIFIED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Verified' },
  REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
  AMENDMENT_REQUESTED: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle, label: 'Amendment Requested' },
};

const EDITABLE_STATUSES = ['DRAFT', 'REJECTED', 'AMENDMENT_REQUESTED'];

const DetailRow = ({ label, value, bold, color }) => (
  <div className="flex justify-between py-1">
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`text-sm font-${bold ? 'bold' : 'medium'} ${color || 'text-gray-900'}`}>
      {value || '-'}
    </span>
  </div>
);

const MISEntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntryDetail();
  }, [id]);

  const fetchEntryDetail = async () => {
    try {
      setLoading(true);
      const [entryRes, historyRes] = await Promise.all([
        misAPI.getEntry(id),
        misAPI.getVerificationHistory(id),
      ]);
      setEntry(entryRes.data);
      setVerificationHistory(historyRes.data || []);
    } catch (err) {
      setError('Failed to load entry details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canEdit = entry && EDITABLE_STATUSES.includes(entry.status);
  const isMotor = entry?.lob?.startsWith('MOTOR_');

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading entry details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="font-medium text-red-900">{error || 'Entry not found'}</h3>
          <button
            onClick={() => navigate('/insurance/mis')}
            className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Back to MIS Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[entry.status] || STATUS_CONFIG.DRAFT;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {entry.misCode || 'MIS Entry'}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </span>
              {entry.policyCategory && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  entry.policyCategory === 'RENEWAL' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {entry.policyCategory}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              {entry.entryMonth && <span className="mr-3">{entry.entryMonth}</span>}
              Created {formatDateTime(entry.createdAt)}
            </p>
          </div>
        </div>
        {canEdit && (
          <button
            onClick={() => navigate(`/insurance/mis/entry?edit=${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Entry
          </button>
        )}
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">Customer Details</h3>
          </div>
          <div className="space-y-2">
            <DetailRow label="Name" value={entry.customerName} />
            <DetailRow label="Contact No." value={entry.customerPhone} />
            <DetailRow label="Email" value={entry.customerEmail} />
            <DetailRow label="New Customer" value={entry.isNewCustomer ? 'Yes' : 'No'}
              color={entry.isNewCustomer ? 'text-green-600' : undefined} />
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">Policy Details</h3>
          </div>
          <div className="space-y-2">
            <DetailRow label="Policy Number" value={entry.policyNumber} />
            <DetailRow label="Company (Insurer)" value={entry.insurerName} />
            <DetailRow label="LOB" value={LOB_LABELS[entry.lob] || entry.lob} />
            <DetailRow label="Policy Type" value={entry.policyType} />
            {isMotor && <DetailRow label="Motor Policy Type" value={entry.motorPolicyType} />}
            <DetailRow label="Product" value={entry.productName} />
            <DetailRow label="Sum Insured" value={formatCurrency(entry.sumInsured)} />
            <DetailRow label="New / Renewal" value={entry.policyCategory}
              color={entry.policyCategory === 'RENEWAL' ? 'text-blue-600' : 'text-green-600'} />
          </div>
        </div>

        {/* Policy Dates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">Policy Dates</h3>
          </div>
          <div className="space-y-2">
            <DetailRow label="Entry Date" value={formatDate(entry.entryDate)} />
            <DetailRow label="Month" value={entry.entryMonth} />
            <DetailRow label="From (Start)" value={formatDate(entry.policyStartDate)} />
            <DetailRow label="To (End)" value={formatDate(entry.policyEndDate)} />
            <DetailRow label="Issued Date" value={formatDate(entry.issuedDate)} />
          </div>
        </div>

        {/* Premium Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">Premium Details</h3>
          </div>
          <div className="space-y-2">
            {isMotor && (
              <>
                <DetailRow label="OD Premium" value={formatCurrency(entry.odPremium)} />
                <DetailRow label="TP Premium" value={formatCurrency(entry.tpPremium)} />
              </>
            )}
            <DetailRow label="Gross Premium" value={formatCurrency(entry.grossPremium)} bold color="text-teal-600" />
            <DetailRow label="Net Premium (Without GST)" value={formatCurrency(entry.netPremium)} bold />
            <DetailRow label="GST Amount" value={formatCurrency(entry.gstAmount)} />
            <DetailRow label="New Premium" value={formatCurrency(entry.newPremium)} />
          </div>
        </div>

        {/* Commission Splits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Commission Splits</h3>
          </div>
          <div className="space-y-2">
            <DetailRow label="Net Premium 100%" value={formatCurrency(entry.netPremium100)} />
            <DetailRow label="Net Premium 70%" value={formatCurrency(entry.netPremium70)} />
            <DetailRow label="Net Premium 30%" value={formatCurrency(entry.netPremium30)} />
            <DetailRow label="Renewal Premium 50%" value={formatCurrency(entry.renewalPremium50)} />
            <DetailRow label="Commission Amount" value={formatCurrency(entry.commissionAmount)} bold color="text-green-600" />
          </div>
        </div>

        {/* Business Source & Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">Business Source & Sales</h3>
          </div>
          <div className="space-y-2">
            <DetailRow label="Referred By" value={entry.referredBy} />
            <DetailRow label="Business Closed By" value={entry.businessClosedBy} />
            <DetailRow label="Agency / Broker" value={entry.agencyBroker} />
          </div>
        </div>

        {/* POSP & Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">POSP & Location</h3>
          </div>
          <div className="space-y-2">
            <DetailRow label="POSP Name" value={entry.pospName} />
            <DetailRow label="POSP Code" value={entry.pospCode} />
            <DetailRow label="Employee Location" value={entry.employeeLocation} />
            <DetailRow label="Branch" value={entry.branchName} />
          </div>
        </div>

        {/* Motor Vehicle Details (if applicable) */}
        {isMotor && (entry.vehicleRegNo || entry.vehicleMake || entry.rtoLocation) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-bold text-gray-900">Motor Vehicle Details</h3>
            </div>
            <div className="space-y-2">
              <DetailRow label="Registration No." value={entry.vehicleRegNo} />
              <DetailRow label="Make / Model" value={entry.vehicleMake} />
              <DetailRow label="RTO Location" value={entry.rtoLocation} />
            </div>
          </div>
        )}

        {/* Payment Info (if available) */}
        {(entry.paymentMode || entry.paymentReference) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
            </div>
            <div className="space-y-2">
              <DetailRow label="Payment Mode" value={entry.paymentMode} />
              <DetailRow label="Reference / UTR" value={entry.paymentReference} />
            </div>
          </div>
        )}
      </div>

      {/* Maker Remarks */}
      {entry.makerRemarks && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-bold text-gray-900">Maker Remarks</h3>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4">{entry.makerRemarks}</p>
        </div>
      )}

      {/* Verification Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Verification Timeline</h3>
        {verificationHistory.length > 0 ? (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {verificationHistory.map((action, idx) => {
                let iconBg = 'bg-gray-100';
                let IconComponent = Clock;
                if (action.action === 'APPROVE' || action.action === 'VERIFIED') {
                  iconBg = 'bg-green-100';
                  IconComponent = CheckCircle;
                } else if (action.action === 'REJECT' || action.action === 'REJECTED') {
                  iconBg = 'bg-red-100';
                  IconComponent = XCircle;
                } else if (action.action === 'REQUEST_AMENDMENT' || action.action === 'AMENDMENT_REQUESTED') {
                  iconBg = 'bg-orange-100';
                  IconComponent = AlertTriangle;
                }

                return (
                  <div key={idx} className="relative pl-12">
                    <div className={`absolute left-2 w-5 h-5 rounded-full ${iconBg} flex items-center justify-center`}>
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {action.action?.replace(/_/g, ' ') || 'Action'}
                        </p>
                        <p className="text-xs text-gray-500">{formatDateTime(action.createdAt || action.timestamp)}</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        By: {action.checkerName || action.userName || 'System'}
                      </p>
                      {action.remarks && (
                        <p className="text-sm text-gray-700 mt-2 border-t border-gray-200 pt-2">
                          {action.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No verification actions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MISEntryDetail;

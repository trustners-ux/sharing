import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, CheckCircle, AlertCircle, X,
  FileText, ClipboardList, IndianRupee, Send, Save, Plus, Trash2,
  Building2, Calendar, User, ChevronRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import api from '../../services/api';

const ENDORSEMENT_TYPES = [
  { value: 'NAME_CORRECTION', label: 'Name Correction' },
  { value: 'ADDRESS_CHANGE', label: 'Address Change' },
  { value: 'NOMINEE_CHANGE', label: 'Nominee Change' },
  { value: 'SUM_INSURED_CHANGE', label: 'Sum Insured Change (Enhancement/Reduction)' },
  { value: 'VEHICLE_TRANSFER', label: 'Transfer of Vehicle Ownership' },
  { value: 'VEHICLE_HYPOTHECATION', label: 'Hypothecation Addition/Deletion' },
  { value: 'COVER_NOTE_TO_POLICY', label: 'Cover Note to Policy Conversion' },
  { value: 'ADD_ON_ADDITION', label: 'Add-On Addition' },
  { value: 'ADD_ON_DELETION', label: 'Add-On Deletion' },
  { value: 'MEMBER_ADDITION', label: 'Member Addition (Health)' },
  { value: 'MEMBER_DELETION', label: 'Member Deletion (Health)' },
  { value: 'PREMIUM_ADJUSTMENT', label: 'Premium Adjustment' },
  { value: 'CANCELLATION', label: 'Policy Cancellation' },
  { value: 'OTHER', label: 'Other Endorsement' },
];

const PRIORITY_LEVELS = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700' },
];

const EndorsementEntryForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=Search Policy, 2=Endorsement Details, 3=Review
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Policy search
  const [policySearch, setPolicySearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [searching, setSearching] = useState(false);

  // Endorsement form
  const [form, setForm] = useState({
    endorsementType: '',
    priority: 'MEDIUM',
    description: '',
    requestedChanges: [{ field: '', oldValue: '', newValue: '' }],
    premiumDifference: '',
    additionalPremium: '',
    refundAmount: '',
    effectiveDate: '',
    customerRemarks: '',
  });

  const searchPolicies = async () => {
    if (!policySearch || policySearch.length < 3) return;
    setSearching(true);
    try {
      const res = await api.get('/insurance/policies', {
        params: { search: policySearch, take: 10 },
      });
      setSearchResults(res.data || res || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectPolicy = (policy) => {
    setSelectedPolicy(policy);
    setStep(2);
  };

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const addChange = () => {
    setForm(prev => ({
      ...prev,
      requestedChanges: [...prev.requestedChanges, { field: '', oldValue: '', newValue: '' }],
    }));
  };

  const updateChange = (idx, key, value) => {
    setForm(prev => {
      const changes = [...prev.requestedChanges];
      changes[idx] = { ...changes[idx], [key]: value };
      return { ...prev, requestedChanges: changes };
    });
  };

  const removeChange = (idx) => {
    if (form.requestedChanges.length <= 1) return;
    setForm(prev => ({
      ...prev,
      requestedChanges: prev.requestedChanges.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (isDraft = false) => {
    if (!selectedPolicy) {
      setNotification({ type: 'error', msg: 'Please select a policy first' });
      return;
    }
    if (!form.endorsementType) {
      setNotification({ type: 'error', msg: 'Please select endorsement type' });
      return;
    }
    setSaving(true);
    try {
      const data = {
        policyId: selectedPolicy.id,
        endorsementType: form.endorsementType,
        priority: form.priority,
        description: form.description,
        requestedChanges: form.requestedChanges.filter(c => c.field),
        premiumDifference: Number(form.premiumDifference) || 0,
        additionalPremium: Number(form.additionalPremium) || 0,
        refundAmount: Number(form.refundAmount) || 0,
        effectiveDate: form.effectiveDate || null,
        customerRemarks: form.customerRemarks,
        status: isDraft ? 'DRAFT' : 'REQUESTED',
      };
      await api.post('/insurance/endorsements', data);
      setNotification({ type: 'success', msg: isDraft ? 'Endorsement saved as draft' : 'Endorsement request submitted!' });
      setTimeout(() => navigate('/insurance/endorsements'), 1500);
    } catch (err) {
      setNotification({ type: 'error', msg: err?.response?.data?.message || 'Failed to create endorsement' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.msg}</span>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4 ml-2" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/insurance/endorsements')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Endorsement Request</h1>
          <p className="text-sm text-gray-500">Request policy modifications with approval workflow</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-4">
        {[
          { id: 1, label: 'Find Policy' },
          { id: 2, label: 'Endorsement Details' },
          { id: 3, label: 'Review & Submit' },
        ].map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.id ? '✓' : s.id}
              </div>
              <span className={`text-sm font-medium ${step === s.id ? 'text-teal-700' : 'text-gray-500'}`}>{s.label}</span>
            </div>
            {idx < 2 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Search Policy */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-600" /> Find Policy
          </h2>
          <div className="flex gap-3">
            <input type="text" value={policySearch} onChange={e => setPolicySearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchPolicies()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Search by policy number, customer name, or phone..." />
            <button onClick={searchPolicies} disabled={searching}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm disabled:opacity-50">
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {(Array.isArray(searchResults) ? searchResults : searchResults.data || []).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Results ({(Array.isArray(searchResults) ? searchResults : searchResults.data || []).length})</h3>
              {(Array.isArray(searchResults) ? searchResults : searchResults.data || []).map(policy => (
                <button key={policy.id} onClick={() => selectPolicy(policy)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">{policy.policyNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          policy.status === 'POLICY_ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>{policy.status?.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-sm text-gray-600">{policy.customerName} | {policy.lob?.replace(/_/g, ' ')} | {policy.company?.companyName || policy.insurerName || '-'}</p>
                      <p className="text-xs text-gray-500">
                        {policy.startDate ? new Date(policy.startDate).toLocaleDateString('en-IN') : ''} - {policy.endDate ? new Date(policy.endDate).toLocaleDateString('en-IN') : ''} | Premium: {formatCurrency(policy.totalPremium)}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {policySearch.length >= 3 && (Array.isArray(searchResults) ? searchResults : searchResults.data || []).length === 0 && !searching && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No policies found. Try a different search term.</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Endorsement Details */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Selected policy summary */}
          {selectedPolicy && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-teal-800">{selectedPolicy.policyNumber}</p>
                  <p className="text-sm text-teal-600">{selectedPolicy.customerName} | {selectedPolicy.lob?.replace(/_/g, ' ')} | Premium: {formatCurrency(selectedPolicy.totalPremium)}</p>
                </div>
                <button onClick={() => { setSelectedPolicy(null); setStep(1); }} className="text-xs text-teal-600 hover:underline">Change</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-600" /> Endorsement Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endorsement Type *</label>
                <select value={form.endorsementType} onChange={e => updateForm('endorsementType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm" required>
                  <option value="">Select Type</option>
                  {ENDORSEMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="flex gap-2">
                  {PRIORITY_LEVELS.map(p => (
                    <button key={p.value} onClick={() => updateForm('priority', p.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        form.priority === p.value ? `${p.color} border-current ring-2 ring-offset-1` : 'bg-gray-50 border-gray-300 text-gray-600'
                      }`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => updateForm('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                  rows="3" placeholder="Describe what needs to be changed and why..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                <input type="date" value={form.effectiveDate} onChange={e => updateForm('effectiveDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm" />
              </div>
            </div>

            {/* Changes */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Requested Changes</h3>
                <button onClick={addChange} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
                  <Plus className="w-3 h-3" /> Add Change
                </button>
              </div>
              {form.requestedChanges.map((change, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-3 items-end bg-gray-50 p-3 rounded-lg">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Field</label>
                    <input type="text" value={change.field} onChange={e => updateChange(idx, 'field', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="e.g. Customer Name" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Current Value</label>
                    <input type="text" value={change.oldValue} onChange={e => updateChange(idx, 'oldValue', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="Old value" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">New Value</label>
                    <input type="text" value={change.newValue} onChange={e => updateChange(idx, 'newValue', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="New value" />
                  </div>
                  <button onClick={() => removeChange(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" disabled={form.requestedChanges.length <= 1}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Premium impact */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Premium Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Premium Difference</label>
                  <input type="number" value={form.premiumDifference} onChange={e => updateForm('premiumDifference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Premium</label>
                  <input type="number" value={form.additionalPremium} onChange={e => updateForm('additionalPremium', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Amount to collect" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
                  <input type="number" value={form.refundAmount} onChange={e => updateForm('refundAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Amount to refund" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Remarks</label>
              <textarea value={form.customerRemarks} onChange={e => updateForm('customerRemarks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows="2" placeholder="Any specific customer instructions..." />
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Change Policy
              </button>
              <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
                Review & Submit <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" /> Review Endorsement Request
            </h2>

            {/* Policy */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Policy</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><p className="text-xs text-gray-500">Policy No</p><p className="text-sm font-medium">{selectedPolicy?.policyNumber}</p></div>
                <div><p className="text-xs text-gray-500">Customer</p><p className="text-sm font-medium">{selectedPolicy?.customerName}</p></div>
                <div><p className="text-xs text-gray-500">LOB</p><p className="text-sm font-medium">{selectedPolicy?.lob?.replace(/_/g, ' ')}</p></div>
                <div><p className="text-xs text-gray-500">Current Premium</p><p className="text-sm font-medium">{formatCurrency(selectedPolicy?.totalPremium)}</p></div>
              </div>
            </div>

            {/* Endorsement */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Endorsement</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><p className="text-xs text-gray-500">Type</p><p className="text-sm font-medium">{ENDORSEMENT_TYPES.find(t => t.value === form.endorsementType)?.label}</p></div>
                <div><p className="text-xs text-gray-500">Priority</p><p className="text-sm font-medium">{form.priority}</p></div>
                <div><p className="text-xs text-gray-500">Effective Date</p><p className="text-sm font-medium">{form.effectiveDate || 'Not specified'}</p></div>
                <div><p className="text-xs text-gray-500">Description</p><p className="text-sm font-medium">{form.description || '-'}</p></div>
              </div>
            </div>

            {/* Changes */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Changes</h3>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50"><th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Field</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Current</th><th className="px-3 py-2 text-left text-xs font-medium text-gray-500">New</th></tr></thead>
                <tbody>
                  {form.requestedChanges.filter(c => c.field).map((c, i) => (
                    <tr key={i} className="border-b border-gray-100"><td className="px-3 py-2 font-medium">{c.field}</td><td className="px-3 py-2 text-red-600 line-through">{c.oldValue}</td><td className="px-3 py-2 text-green-600 font-medium">{c.newValue}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Premium Impact */}
            {(form.additionalPremium || form.refundAmount) && (
              <div className="pb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Premium Impact</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Difference</p><p className="text-sm font-bold">{formatCurrency(form.premiumDifference)}</p></div>
                  <div className="bg-orange-50 rounded-lg p-3"><p className="text-xs text-orange-600">Additional</p><p className="text-sm font-bold text-orange-700">{formatCurrency(form.additionalPremium)}</p></div>
                  <div className="bg-green-50 rounded-lg p-3"><p className="text-xs text-green-600">Refund</p><p className="text-sm font-bold text-green-700">{formatCurrency(form.refundAmount)}</p></div>
                </div>
              </div>
            )}
          </div>

          {/* Workflow note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            <strong>Workflow:</strong> This endorsement will follow the approval path: Requested → Assigned → Processed → Approved → Issued
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-3">
              <button onClick={() => handleSubmit(true)} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-medium text-sm disabled:opacity-50">
                <Save className="w-4 h-4" /> Save Draft
              </button>
              <button onClick={() => handleSubmit(false)} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm disabled:opacity-50">
                <Send className="w-4 h-4" /> {saving ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndorsementEntryForm;

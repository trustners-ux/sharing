import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car, Heart, Search, Plus, X, ChevronRight, CheckCircle, AlertCircle,
  Building2, IndianRupee, Shield, Calendar, User, Phone, Mail, MapPin,
  FileText, Trash2, ArrowLeft, Copy, Star,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';

const MOTOR_TYPES = [
  { value: 'MOTOR_2WHEELER', label: '2 Wheeler' },
  { value: 'MOTOR_4WHEELER_PVT', label: '4 Wheeler (Private)' },
  { value: 'MOTOR_4WHEELER_COMM', label: '4 Wheeler (Commercial)' },
  { value: 'MOTOR_CV', label: 'Commercial Vehicle' },
];

const HEALTH_TYPES = [
  { value: 'HEALTH_INDIVIDUAL', label: 'Individual' },
  { value: 'HEALTH_FAMILY', label: 'Family Floater' },
  { value: 'HEALTH_GROUP', label: 'Group Health' },
  { value: 'HEALTH_TOP_UP', label: 'Super Top-Up' },
  { value: 'HEALTH_CRITICAL_ILLNESS', label: 'Critical Illness' },
];

const POLICY_TYPES = [
  { value: 'NEW', label: 'New Policy' },
  { value: 'RENEWAL', label: 'Renewal' },
  { value: 'ROLLOVER', label: 'Rollover (Port)' },
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG'];

const INSURERS = [
  'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz', 'New India Assurance',
  'United India', 'National Insurance', 'Oriental Insurance', 'Tata AIG',
  'SBI General', 'Reliance General', 'Go Digit', 'Acko', 'Star Health',
  'Care Health', 'Niva Bupa', 'ManipalCigna', 'Aditya Birla Health',
  'Cholamandalam MS', 'Future Generali', 'Iffco Tokio', 'Kotak General',
  'Liberty General', 'Magma HDI', 'Royal Sundaram', 'Shriram General',
];

const MOTOR_ADDONS = [
  'Zero Depreciation', 'Engine Protector', 'RSA (Roadside Assistance)',
  'Consumables Cover', 'Return to Invoice', 'Key Replacement',
  'Tyre Cover', 'NCB Protection', 'Passenger Cover', 'PA Cover for Owner',
];

const HEALTH_ADDONS = [
  'Maternity Cover', 'OPD Cover', 'Dental Cover', 'Day Care Treatment',
  'AYUSH Treatment', 'Air Ambulance', 'Restoration Benefit',
  'Personal Accident', 'International Coverage', 'Daily Cash Allowance',
];

const QuotationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('MOTOR');
  const [step, setStep] = useState(1); // 1=Customer, 2=Vehicle/Health, 3=Quotes
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLeadSearch, setShowLeadSearch] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Customer form
  const [customer, setCustomer] = useState({
    customerName: '', customerPhone: '', customerEmail: '',
    customerCity: '', dateOfBirth: '',
  });

  // Motor form
  const [motor, setMotor] = useState({
    lob: 'MOTOR_4WHEELER_PVT', policyType: 'NEW',
    vehicleRegNumber: '', vehicleMake: '', vehicleModel: '',
    vehicleVariant: '', vehicleYear: '', vehicleFuelType: 'Petrol',
    previousInsurer: '', previousPolicyExpiry: '',
    ncbPercentage: 0, idv: '',
    selectedAddOns: [],
  });

  // Health form
  const [health, setHealth] = useState({
    lob: 'HEALTH_INDIVIDUAL',
    membersCount: 1, membersDetails: [{ name: '', age: '', relation: 'Self', gender: 'Male' }],
    sumInsuredRequired: '', preExistingConditions: '',
    selectedAddOns: [],
  });

  // Quote entry form
  const [quoteForm, setQuoteForm] = useState({
    insurerName: '', productName: '', sumInsured: '',
    premium: '', gst: '', totalPremium: '',
    coverageDetails: '', addOns: '', quoteRefId: '', validTill: '',
  });

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchLeads();
    }
  }, [searchTerm]);

  const searchLeads = async () => {
    try {
      const res = await api.get('/insurance/leads', { params: { search: searchTerm, take: 10 } });
      setLeads(res.data || res || []);
    } catch (err) {
      console.error('Error searching leads:', err);
    }
  };

  const selectLead = (lead) => {
    setSelectedLead(lead);
    setCustomer({
      customerName: lead.customerName || '',
      customerPhone: lead.customerPhone || '',
      customerEmail: lead.customerEmail || '',
      customerCity: lead.customerCity || '',
      dateOfBirth: lead.dateOfBirth ? lead.dateOfBirth.split('T')[0] : '',
    });
    if (lead.vehicleRegNumber) {
      setActiveTab('MOTOR');
      setMotor(prev => ({
        ...prev,
        lob: lead.lob || prev.lob,
        vehicleRegNumber: lead.vehicleRegNumber || '',
        vehicleMake: lead.vehicleMake || '',
        vehicleModel: lead.vehicleModel || '',
        vehicleVariant: lead.vehicleVariant || '',
        vehicleYear: lead.vehicleYear || '',
        vehicleFuelType: lead.vehicleFuelType || 'Petrol',
        previousInsurer: lead.previousInsurer || '',
        ncbPercentage: lead.ncbPercentage || 0,
        idv: lead.idv || '',
      }));
    }
    if (lead.membersCount) {
      setActiveTab('HEALTH');
      setHealth(prev => ({
        ...prev,
        lob: lead.lob || prev.lob,
        membersCount: lead.membersCount || 1,
        membersDetails: lead.membersDetails || prev.membersDetails,
        sumInsuredRequired: lead.sumInsuredRequired || '',
      }));
    }
    if (lead.quotes && lead.quotes.length > 0) {
      setQuotes(lead.quotes);
    }
    setShowLeadSearch(false);
    setStep(2);
  };

  const createLeadAndProceed = async () => {
    if (!customer.customerName || !customer.customerPhone) {
      setNotification({ type: 'error', msg: 'Name and Phone are required' });
      return;
    }
    setSaving(true);
    try {
      const leadData = {
        ...customer,
        lob: activeTab === 'MOTOR' ? motor.lob : health.lob,
        source: 'WALK_IN',
        ...(activeTab === 'MOTOR' ? {
          vehicleRegNumber: motor.vehicleRegNumber,
          vehicleMake: motor.vehicleMake,
          vehicleModel: motor.vehicleModel,
          vehicleVariant: motor.vehicleVariant,
          vehicleYear: motor.vehicleYear,
          vehicleFuelType: motor.vehicleFuelType,
          previousInsurer: motor.previousInsurer,
          ncbPercentage: motor.ncbPercentage,
          idv: motor.idv,
          isRenewal: motor.policyType === 'RENEWAL',
        } : {
          membersCount: health.membersCount,
          membersDetails: health.membersDetails,
          sumInsuredRequired: health.sumInsuredRequired,
        }),
      };
      const res = await api.post('/insurance/leads', leadData);
      setSelectedLead(res);
      setStep(2);
      setNotification({ type: 'success', msg: 'Lead created successfully' });
    } catch (err) {
      setNotification({ type: 'error', msg: 'Failed to create lead' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuote = async (e) => {
    e.preventDefault();
    if (!selectedLead?.id) {
      setNotification({ type: 'error', msg: 'Please create or select a lead first' });
      return;
    }
    setSaving(true);
    try {
      const premium = Number(quoteForm.premium) || 0;
      const gst = quoteForm.gst ? Number(quoteForm.gst) : Math.round(premium * 0.18);
      const total = quoteForm.totalPremium ? Number(quoteForm.totalPremium) : premium + gst;

      const data = {
        insurerName: quoteForm.insurerName,
        productName: quoteForm.productName,
        sumInsured: Number(quoteForm.sumInsured) || 0,
        premium,
        gst,
        totalPremium: total,
        coverageDetails: quoteForm.coverageDetails ? { details: quoteForm.coverageDetails } : null,
        addOns: quoteForm.addOns ? { items: quoteForm.addOns.split(',').map(s => s.trim()) } : null,
        quoteRefId: quoteForm.quoteRefId || null,
        validTill: quoteForm.validTill || null,
      };

      const res = await api.post(`/insurance/leads/${selectedLead.id}/quotes`, data);
      setQuotes([...quotes, res]);
      setShowQuoteForm(false);
      resetQuoteForm();
      setNotification({ type: 'success', msg: `Quote from ${data.insurerName} added` });
    } catch (err) {
      setNotification({ type: 'error', msg: 'Failed to add quote' });
    } finally {
      setSaving(false);
    }
  };

  const handleSelectQuote = async (quoteId) => {
    if (!selectedLead?.id) return;
    try {
      await api.post(`/insurance/leads/${selectedLead.id}/quotes/${quoteId}/select`);
      setQuotes(quotes.map(q => ({ ...q, isSelected: q.id === quoteId })));
      setNotification({ type: 'success', msg: 'Quote selected for proposal' });
    } catch (err) {
      setNotification({ type: 'error', msg: 'Failed to select quote' });
    }
  };

  const handleConvertToPolicy = async () => {
    if (!selectedLead?.id) return;
    setSaving(true);
    try {
      await api.post(`/insurance/leads/${selectedLead.id}/convert-to-policy`);
      setNotification({ type: 'success', msg: 'Lead converted to policy!' });
      setTimeout(() => navigate('/insurance/policies'), 1500);
    } catch (err) {
      setNotification({ type: 'error', msg: 'Failed to convert' });
    } finally {
      setSaving(false);
    }
  };

  const resetQuoteForm = () => {
    setQuoteForm({
      insurerName: '', productName: '', sumInsured: '',
      premium: '', gst: '', totalPremium: '',
      coverageDetails: '', addOns: '', quoteRefId: '', validTill: '',
    });
  };

  const toggleAddOn = (addon, type) => {
    if (type === 'MOTOR') {
      setMotor(prev => ({
        ...prev,
        selectedAddOns: prev.selectedAddOns.includes(addon)
          ? prev.selectedAddOns.filter(a => a !== addon)
          : [...prev.selectedAddOns, addon],
      }));
    } else {
      setHealth(prev => ({
        ...prev,
        selectedAddOns: prev.selectedAddOns.includes(addon)
          ? prev.selectedAddOns.filter(a => a !== addon)
          : [...prev.selectedAddOns, addon],
      }));
    }
  };

  const addHealthMember = () => {
    setHealth(prev => ({
      ...prev,
      membersCount: prev.membersCount + 1,
      membersDetails: [...prev.membersDetails, { name: '', age: '', relation: '', gender: 'Male' }],
    }));
  };

  const updateHealthMember = (idx, field, value) => {
    setHealth(prev => {
      const members = [...prev.membersDetails];
      members[idx] = { ...members[idx], [field]: value };
      return { ...prev, membersDetails: members };
    });
  };

  const removeHealthMember = (idx) => {
    if (health.membersDetails.length <= 1) return;
    setHealth(prev => ({
      ...prev,
      membersCount: prev.membersCount - 1,
      membersDetails: prev.membersDetails.filter((_, i) => i !== idx),
    }));
  };

  const autoCalcGST = () => {
    const premium = Number(quoteForm.premium) || 0;
    const gst = Math.round(premium * 0.18);
    setQuoteForm(prev => ({
      ...prev,
      gst: String(gst),
      totalPremium: String(premium + gst),
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.msg}</span>
          <button onClick={() => setNotification(null)} className="ml-2"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotation Builder</h1>
          <p className="text-sm text-gray-500 mt-1">Create and compare insurance quotes for Motor & Health</p>
        </div>
        <button onClick={() => setShowLeadSearch(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
          <Search className="w-4 h-4" /> Load from Lead
        </button>
      </div>

      {/* Tab Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('MOTOR')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'MOTOR' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Car className="w-4 h-4" /> Motor Insurance
        </button>
        <button
          onClick={() => setActiveTab('HEALTH')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'HEALTH' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Heart className="w-4 h-4" /> Health Insurance
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        {['Customer Details', activeTab === 'MOTOR' ? 'Vehicle Details' : 'Health Details', 'Quotes & Comparison'].map((label, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > idx + 1 ? '✓' : idx + 1}
            </div>
            <span className={`text-sm font-medium ${step === idx + 1 ? 'text-teal-700' : 'text-gray-500'}`}>{label}</span>
            {idx < 2 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          </div>
        ))}
      </div>

      {/* Step 1: Customer Details */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" /> Customer Information
          </h2>
          {selectedLead && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-teal-700">Loaded from lead: <strong>{selectedLead.leadCode}</strong></span>
              <button onClick={() => { setSelectedLead(null); setCustomer({ customerName: '', customerPhone: '', customerEmail: '', customerCity: '', dateOfBirth: '' }); }} className="text-xs text-teal-600 hover:underline">Clear</button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="text" value={customer.customerName} onChange={e => setCustomer({...customer, customerName: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Customer name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="tel" value={customer.customerPhone} onChange={e => setCustomer({...customer, customerPhone: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="10-digit mobile" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="email" value={customer.customerEmail} onChange={e => setCustomer({...customer, customerEmail: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="text" value={customer.customerCity} onChange={e => setCustomer({...customer, customerCity: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="City" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" value={customer.dateOfBirth} onChange={e => setCustomer({...customer, dateOfBirth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {!selectedLead ? (
              <button onClick={createLeadAndProceed} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Lead & Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Vehicle/Health Details */}
      {step === 2 && activeTab === 'MOTOR' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Car className="w-5 h-5 text-teal-600" /> Vehicle & Policy Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select value={motor.lob} onChange={e => setMotor({...motor, lob: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {MOTOR_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Policy Type</label>
              <select value={motor.policyType} onChange={e => setMotor({...motor, policyType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {POLICY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
              <input type="text" value={motor.vehicleRegNumber} onChange={e => setMotor({...motor, vehicleRegNumber: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="MH 01 AB 1234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input type="text" value={motor.vehicleMake} onChange={e => setMotor({...motor, vehicleMake: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Maruti, Hyundai" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input type="text" value={motor.vehicleModel} onChange={e => setMotor({...motor, vehicleModel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Swift, i20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
              <input type="text" value={motor.vehicleVariant} onChange={e => setMotor({...motor, vehicleVariant: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. VXi, Sportz" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year of Manufacture</label>
              <input type="number" value={motor.vehicleYear} onChange={e => setMotor({...motor, vehicleYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="2024" min="2000" max="2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select value={motor.vehicleFuelType} onChange={e => setMotor({...motor, vehicleFuelType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IDV (Insured Declared Value)</label>
              <input type="number" value={motor.idv} onChange={e => setMotor({...motor, idv: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 450000" />
            </div>
          </div>

          {motor.policyType !== 'NEW' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Insurer</label>
                <select value={motor.previousInsurer} onChange={e => setMotor({...motor, previousInsurer: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select</option>
                  {INSURERS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Policy Expiry</label>
                <input type="date" value={motor.previousPolicyExpiry} onChange={e => setMotor({...motor, previousPolicyExpiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NCB %</label>
                <select value={motor.ncbPercentage} onChange={e => setMotor({...motor, ncbPercentage: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  {[0, 20, 25, 35, 45, 50].map(n => <option key={n} value={n}>{n}%</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Add-ons */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Add-On Covers</h3>
            <div className="flex flex-wrap gap-2">
              {MOTOR_ADDONS.map(addon => (
                <button key={addon} onClick={() => toggleAddOn(addon, 'MOTOR')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    motor.selectedAddOns.includes(addon) ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}>
                  {addon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
              Proceed to Quotes <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && activeTab === 'HEALTH' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-teal-600" /> Health Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Health Plan Type</label>
              <select value={health.lob} onChange={e => setHealth({...health, lob: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {HEALTH_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured Required</label>
              <input type="number" value={health.sumInsuredRequired} onChange={e => setHealth({...health, sumInsuredRequired: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 500000" />
            </div>
          </div>

          {/* Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Members to Insure ({health.membersDetails.length})</h3>
              <button onClick={addHealthMember} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
                <Plus className="w-3 h-3" /> Add Member
              </button>
            </div>
            {health.membersDetails.map((member, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-3 items-end bg-gray-50 p-3 rounded-lg">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <input type="text" value={member.name} onChange={e => updateHealthMember(idx, 'name', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="Name" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Age</label>
                  <input type="number" value={member.age} onChange={e => updateHealthMember(idx, 'age', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" placeholder="Age" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Relation</label>
                  <select value={member.relation} onChange={e => updateHealthMember(idx, 'relation', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                    {['Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Father-in-Law', 'Mother-in-Law'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Gender</label>
                  <select value={member.gender} onChange={e => updateHealthMember(idx, 'gender', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <button onClick={() => removeHealthMember(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" disabled={health.membersDetails.length <= 1}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pre-existing Conditions</label>
            <textarea value={health.preExistingConditions} onChange={e => setHealth({...health, preExistingConditions: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="2" placeholder="Diabetes, Hypertension, etc." />
          </div>

          {/* Add-ons */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Preferred Add-Ons</h3>
            <div className="flex flex-wrap gap-2">
              {HEALTH_ADDONS.map(addon => (
                <button key={addon} onClick={() => toggleAddOn(addon, 'HEALTH')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    health.selectedAddOns.includes(addon) ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}>
                  {addon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
              Proceed to Quotes <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Quotes Comparison */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Customer summary bar */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-semibold text-teal-800">{customer.customerName}</span>
              <span className="text-teal-600">{customer.customerPhone}</span>
              <span className="text-teal-600">{activeTab === 'MOTOR' ? `${motor.vehicleMake} ${motor.vehicleModel} (${motor.vehicleRegNumber})` : `${health.lob.replace('HEALTH_', '')} - ${health.membersCount} member(s)`}</span>
              {selectedLead && <span className="px-2 py-0.5 bg-teal-200 text-teal-700 rounded text-xs font-medium">{selectedLead.leadCode}</span>}
            </div>
            <button onClick={() => setStep(2)} className="text-xs text-teal-600 hover:underline font-medium">Edit Details</button>
          </div>

          {/* Quotes */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Quotes ({quotes.length})</h2>
            <button onClick={() => setShowQuoteForm(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Quote
            </button>
          </div>

          {quotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotes.map((quote) => (
                <div key={quote.id} className={`bg-white rounded-xl border-2 p-5 space-y-4 transition-all ${
                  quote.isSelected ? 'border-green-500 shadow-lg ring-2 ring-green-200' : 'border-gray-200 hover:border-teal-300'
                }`}>
                  {quote.isSelected && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" /> SELECTED FOR PROPOSAL
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{quote.insurerName}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{quote.productName || '-'}</p>
                    </div>
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Sum Insured</p>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(quote.sumInsured)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Premium</p>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(quote.premium)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">GST</p>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(quote.gst)}</p>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-2">
                      <p className="text-xs text-teal-600">Total Premium</p>
                      <p className="text-sm font-bold text-teal-700">{formatCurrency(quote.totalPremium)}</p>
                    </div>
                  </div>

                  {quote.quoteRefId && (
                    <p className="text-xs text-gray-500">Ref: {quote.quoteRefId}</p>
                  )}
                  {quote.validTill && (
                    <p className="text-xs text-gray-500">Valid till: {new Date(quote.validTill).toLocaleDateString('en-IN')}</p>
                  )}

                  {!quote.isSelected && (
                    <button onClick={() => handleSelectQuote(quote.id)}
                      className="w-full py-2 text-sm font-medium text-teal-600 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors">
                      Select This Quote
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-700">No quotes yet</h3>
              <p className="text-sm text-gray-500 mt-1">Click "Add Quote" to add quotes from different insurers</p>
            </div>
          )}

          {/* Convert button */}
          {quotes.some(q => q.isSelected) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-green-800">Ready to convert!</h3>
                <p className="text-sm text-green-600 mt-1">Selected quote: {quotes.find(q => q.isSelected)?.insurerName} - {formatCurrency(quotes.find(q => q.isSelected)?.totalPremium)}</p>
              </div>
              <button onClick={handleConvertToPolicy} disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm disabled:opacity-50">
                {saving ? 'Converting...' : 'Convert to Policy'}
              </button>
            </div>
          )}

          <div className="flex justify-start pt-2">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Details
            </button>
          </div>
        </div>
      )}

      {/* Lead Search Modal */}
      {showLeadSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[70vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Search Lead</h3>
              <button onClick={() => setShowLeadSearch(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Search by name, phone, or lead code..." autoFocus />
            </div>
            <div className="max-h-80 overflow-y-auto px-4 pb-4 space-y-2">
              {(Array.isArray(leads) ? leads : leads.data || []).map(lead => (
                <button key={lead.id} onClick={() => selectLead(lead)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{lead.customerName}</p>
                      <p className="text-xs text-gray-500">{lead.customerPhone} | {lead.lob} | {lead.leadCode}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'CONVERTED' ? 'bg-green-100 text-green-700' : lead.status === 'LOST' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{lead.status}</span>
                  </div>
                </button>
              ))}
              {searchTerm.length >= 2 && (Array.isArray(leads) ? leads : leads.data || []).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No leads found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Quote Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Add Insurance Quote</h3>
              <button onClick={() => { setShowQuoteForm(false); resetQuoteForm(); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddQuote} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company *</label>
                <select value={quoteForm.insurerName} onChange={e => setQuoteForm({...quoteForm, insurerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select Insurer</option>
                  {INSURERS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" value={quoteForm.productName} onChange={e => setQuoteForm({...quoteForm, productName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Motor Comprehensive, Star Family Health" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sum Insured *</label>
                  <input type="number" value={quoteForm.sumInsured} onChange={e => setQuoteForm({...quoteForm, sumInsured: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="500000" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Premium *</label>
                  <input type="number" value={quoteForm.premium} onChange={e => setQuoteForm({...quoteForm, premium: e.target.value})}
                    onBlur={autoCalcGST}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="12000" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST (18%)</label>
                  <input type="number" value={quoteForm.gst} onChange={e => setQuoteForm({...quoteForm, gst: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" placeholder="Auto-calculated" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Premium</label>
                  <input type="number" value={quoteForm.totalPremium} onChange={e => setQuoteForm({...quoteForm, totalPremium: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-bold" placeholder="Auto-calculated" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Details</label>
                <textarea value={quoteForm.coverageDetails} onChange={e => setQuoteForm({...quoteForm, coverageDetails: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="2" placeholder="OD Cover, TP Cover, NCB Discount, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add-Ons (comma separated)</label>
                <input type="text" value={quoteForm.addOns} onChange={e => setQuoteForm({...quoteForm, addOns: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Zero Dep, RSA, Engine Protector" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote Reference ID</label>
                  <input type="text" value={quoteForm.quoteRefId} onChange={e => setQuoteForm({...quoteForm, quoteRefId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="ICICI-QT-123456" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
                  <input type="date" value={quoteForm.validTill} onChange={e => setQuoteForm({...quoteForm, validTill: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => { setShowQuoteForm(false); resetQuoteForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationPage;

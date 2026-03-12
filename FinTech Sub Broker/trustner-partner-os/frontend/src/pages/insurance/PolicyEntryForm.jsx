import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, CheckCircle, AlertCircle, X,
  User, Phone, Mail, MapPin, Calendar, Car, Heart, Shield,
  FileText, Building2, IndianRupee, Save, Send,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';

const STEPS = [
  { id: 1, label: 'Customer', icon: User },
  { id: 2, label: 'Policy Info', icon: FileText },
  { id: 3, label: 'Premium', icon: IndianRupee },
  { id: 4, label: 'Review', icon: CheckCircle },
];

const LOB_OPTIONS = [
  { value: 'MOTOR_2WHEELER', label: 'Motor - 2 Wheeler' },
  { value: 'MOTOR_4WHEELER_PVT', label: 'Motor - 4 Wheeler (Private)' },
  { value: 'MOTOR_4WHEELER_COMM', label: 'Motor - 4 Wheeler (Commercial)' },
  { value: 'MOTOR_CV', label: 'Motor - Commercial Vehicle' },
  { value: 'HEALTH_INDIVIDUAL', label: 'Health - Individual' },
  { value: 'HEALTH_FAMILY', label: 'Health - Family Floater' },
  { value: 'HEALTH_GROUP', label: 'Health - Group Health' },
  { value: 'HEALTH_TOP_UP', label: 'Health - Super Top-Up' },
  { value: 'HEALTH_CRITICAL_ILLNESS', label: 'Health - Critical Illness' },
  { value: 'LIFE_TERM', label: 'Life - Term Insurance' },
  { value: 'LIFE_ENDOWMENT', label: 'Life - Endowment' },
  { value: 'LIFE_ULIP', label: 'Life - ULIP' },
  { value: 'FIRE', label: 'Fire Insurance' },
  { value: 'MARINE', label: 'Marine Insurance' },
  { value: 'LIABILITY', label: 'Liability Insurance' },
  { value: 'TRAVEL', label: 'Travel Insurance' },
  { value: 'PA', label: 'Personal Accident' },
];

const INSURERS = [
  'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz', 'New India Assurance',
  'United India', 'National Insurance', 'Oriental Insurance', 'Tata AIG',
  'SBI General', 'Reliance General', 'Go Digit', 'Acko', 'Star Health',
  'Care Health', 'Niva Bupa', 'ManipalCigna', 'Aditya Birla Health',
  'LIC of India', 'HDFC Life', 'ICICI Pru Life', 'SBI Life', 'Max Life',
  'Bajaj Allianz Life', 'Tata AIA Life', 'Kotak Life', 'PNB MetLife',
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG'];

const PolicyEntryForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    // Customer
    customerName: '', customerPhone: '', customerEmail: '',
    customerCity: '', customerState: '', customerPincode: '',
    dateOfBirth: '', panNumber: '', aadharNumber: '',
    // Policy
    lob: 'MOTOR_4WHEELER_PVT', policyNumber: '',
    insurerName: '', productName: '',
    startDate: '', endDate: '',
    // Motor specific
    vehicleRegNumber: '', vehicleMake: '', vehicleModel: '',
    vehicleVariant: '', vehicleYear: '', vehicleFuelType: 'Petrol',
    chassisNumber: '', engineNumber: '',
    ncbPercentage: 0, idv: '',
    previousInsurer: '', previousPolicyNumber: '',
    // Health specific
    membersCount: 1, preExistingConditions: '',
    waitingPeriod: '', roomRentLimit: '',
    // Life specific
    nomineeName: '', nomineeRelation: '', nomineeAge: '',
    coverAmount: '', policyTerm: '',
    // Premium
    sumInsured: '', basePremium: '', odPremium: '', tpPremium: '',
    gstAmount: '', totalPremium: '', netPremium: '',
    stampDuty: '', addOnPremium: '',
    // Payment
    paymentMode: 'ONLINE', paymentRef: '', paymentDate: '',
    // Notes
    remarks: '',
  });

  const isMotor = form.lob.startsWith('MOTOR');
  const isHealth = form.lob.startsWith('HEALTH');
  const isLife = form.lob.startsWith('LIFE');

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const autoCalcPremium = () => {
    const base = Number(form.basePremium) || 0;
    const od = Number(form.odPremium) || 0;
    const tp = Number(form.tpPremium) || 0;
    const addon = Number(form.addOnPremium) || 0;
    const stamp = Number(form.stampDuty) || 0;
    const net = isMotor ? (od + tp + addon) : base + addon;
    const gst = Math.round(net * 0.18);
    const total = net + gst + stamp;
    setForm(prev => ({
      ...prev,
      netPremium: String(net),
      gstAmount: String(gst),
      totalPremium: String(total),
    }));
  };

  const handleSave = async (isDraft = false) => {
    if (!form.customerName || !form.policyNumber || !form.insurerName) {
      setNotification({ type: 'error', msg: 'Customer name, Policy number, and Insurer are required' });
      return;
    }
    setSaving(true);
    try {
      const policyData = {
        policyNumber: form.policyNumber,
        internalRefCode: `TIBPL-POL-${Date.now()}`,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        lob: form.lob,
        companyId: '', // Would be resolved by backend
        productId: '',
        sumInsured: Number(form.sumInsured) || 0,
        basePremium: Number(form.basePremium) || 0,
        gstAmount: Number(form.gstAmount) || 0,
        totalPremium: Number(form.totalPremium) || 0,
        netPremium: Number(form.netPremium) || 0,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        status: isDraft ? 'DRAFT' : 'POLICY_ACTIVE',
        // Motor
        ...(isMotor && {
          vehicleRegNumber: form.vehicleRegNumber,
          vehicleMake: form.vehicleMake,
          vehicleModel: form.vehicleModel,
          vehicleYear: form.vehicleYear ? Number(form.vehicleYear) : null,
          chassisNumber: form.chassisNumber,
          engineNumber: form.engineNumber,
          ncbPercentage: Number(form.ncbPercentage) || 0,
          idv: Number(form.idv) || 0,
        }),
        // Health
        ...(isHealth && {
          membersCount: Number(form.membersCount) || 1,
          preExistingConditions: form.preExistingConditions,
          waitingPeriod: form.waitingPeriod,
        }),
        // Life
        ...(isLife && {
          nomineeName: form.nomineeName,
          nomineeRelation: form.nomineeRelation,
          coverAmount: Number(form.coverAmount) || 0,
          policyTerm: Number(form.policyTerm) || 0,
        }),
      };
      await api.post('/insurance/policies', policyData);
      setNotification({ type: 'success', msg: isDraft ? 'Policy saved as draft' : 'Policy created successfully!' });
      setTimeout(() => navigate('/insurance/policies'), 1500);
    } catch (err) {
      setNotification({ type: 'error', msg: err?.response?.data?.message || 'Failed to create policy' });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label, field, type = 'text', opts = {}) => (
    <div className={opts.className || ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {opts.required && '*'}</label>
      {type === 'select' ? (
        <select value={form[field]} onChange={e => updateForm(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm">
          {opts.options?.map(o => typeof o === 'string'
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>
          )}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={form[field]} onChange={e => updateForm(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          rows={opts.rows || 2} placeholder={opts.placeholder || ''} />
      ) : (
        <input type={type} value={form[field]} onChange={e => updateForm(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          placeholder={opts.placeholder || ''} min={opts.min} max={opts.max} onBlur={opts.onBlur} />
      )}
    </div>
  );

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/insurance/policies')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Policy Entry</h1>
            <p className="text-sm text-gray-500">Enter offline policy details manually</p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={s.id}>
              <button onClick={() => setStep(s.id)} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.id ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === s.id ? 'text-teal-700' : 'text-gray-500'}`}>{s.label}</span>
              </button>
              {idx < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step > s.id ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Customer */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" /> Customer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField('Full Name', 'customerName', 'text', { required: true, placeholder: 'Policy holder name' })}
            {renderField('Phone', 'customerPhone', 'tel', { placeholder: '10-digit mobile' })}
            {renderField('Email', 'customerEmail', 'email', { placeholder: 'email@example.com' })}
            {renderField('City', 'customerCity', 'text', { placeholder: 'City' })}
            {renderField('State', 'customerState', 'text', { placeholder: 'State' })}
            {renderField('Pincode', 'customerPincode', 'text', { placeholder: '400001' })}
            {renderField('Date of Birth', 'dateOfBirth', 'date')}
            {renderField('PAN Number', 'panNumber', 'text', { placeholder: 'ABCDE1234F' })}
            {renderField('Aadhar Number', 'aadharNumber', 'text', { placeholder: '1234 5678 9012' })}
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
              Next: Policy Info <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Policy Info */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" /> Policy Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField('Line of Business', 'lob', 'select', { required: true, options: LOB_OPTIONS })}
            {renderField('Policy Number', 'policyNumber', 'text', { required: true, placeholder: 'INS/POL/12345' })}
            {renderField('Insurance Company', 'insurerName', 'select', { required: true, options: [{ value: '', label: 'Select' }, ...INSURERS.map(i => ({ value: i, label: i }))] })}
            {renderField('Product Name', 'productName', 'text', { placeholder: 'Comprehensive, TP Only, etc.' })}
            {renderField('Policy Start Date', 'startDate', 'date')}
            {renderField('Policy End Date', 'endDate', 'date')}
          </div>

          {/* Motor specific */}
          {isMotor && (
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <Car className="w-4 h-4 text-teal-600" /> Vehicle Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField('Registration Number', 'vehicleRegNumber', 'text', { placeholder: 'MH 01 AB 1234' })}
                {renderField('Make', 'vehicleMake', 'text', { placeholder: 'Maruti, Hyundai' })}
                {renderField('Model', 'vehicleModel', 'text', { placeholder: 'Swift, i20' })}
                {renderField('Variant', 'vehicleVariant', 'text', { placeholder: 'VXi, Sportz' })}
                {renderField('Year', 'vehicleYear', 'number', { placeholder: '2024', min: '2000', max: '2026' })}
                {renderField('Fuel Type', 'vehicleFuelType', 'select', { options: FUEL_TYPES })}
                {renderField('Chassis Number', 'chassisNumber', 'text', { placeholder: '17 character chassis no' })}
                {renderField('Engine Number', 'engineNumber', 'text', { placeholder: 'Engine number' })}
                {renderField('IDV', 'idv', 'number', { placeholder: 'e.g. 450000' })}
                {renderField('NCB %', 'ncbPercentage', 'select', { options: [0, 20, 25, 35, 45, 50].map(n => ({ value: String(n), label: `${n}%` })) })}
                {renderField('Previous Insurer', 'previousInsurer', 'text', { placeholder: 'If renewal/rollover' })}
                {renderField('Previous Policy No', 'previousPolicyNumber', 'text', { placeholder: 'Old policy number' })}
              </div>
            </div>
          )}

          {/* Health specific */}
          {isHealth && (
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-600" /> Health Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField('Members Count', 'membersCount', 'number', { min: '1', max: '20' })}
                {renderField('Waiting Period', 'waitingPeriod', 'text', { placeholder: '30 days / 2 years' })}
                {renderField('Room Rent Limit', 'roomRentLimit', 'text', { placeholder: 'No limit / 1% SI' })}
              </div>
              {renderField('Pre-existing Conditions', 'preExistingConditions', 'textarea', { placeholder: 'Diabetes, Hypertension, etc.' })}
            </div>
          )}

          {/* Life specific */}
          {isLife && (
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" /> Life Insurance Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField('Nominee Name', 'nomineeName', 'text', { placeholder: 'Nominee full name' })}
                {renderField('Nominee Relation', 'nomineeRelation', 'select', { options: ['', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Other'].map(r => ({ value: r, label: r || 'Select' })) })}
                {renderField('Nominee Age', 'nomineeAge', 'number', { placeholder: 'Age' })}
                {renderField('Cover Amount', 'coverAmount', 'number', { placeholder: 'e.g. 10000000' })}
                {renderField('Policy Term (years)', 'policyTerm', 'number', { placeholder: 'e.g. 20' })}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
              Next: Premium <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Premium */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-teal-600" /> Premium & Payment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField('Sum Insured', 'sumInsured', 'number', { placeholder: 'e.g. 500000' })}
            {isMotor && renderField('OD Premium', 'odPremium', 'number', { placeholder: 'Own Damage', onBlur: autoCalcPremium })}
            {isMotor && renderField('TP Premium', 'tpPremium', 'number', { placeholder: 'Third Party', onBlur: autoCalcPremium })}
            {!isMotor && renderField('Base Premium', 'basePremium', 'number', { placeholder: 'Base premium', onBlur: autoCalcPremium })}
            {renderField('Add-On Premium', 'addOnPremium', 'number', { placeholder: '0', onBlur: autoCalcPremium })}
            {renderField('Stamp Duty', 'stampDuty', 'number', { placeholder: '0', onBlur: autoCalcPremium })}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Premium</label>
              <input type="number" value={form.netPremium} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-semibold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST (18%)</label>
              <input type="number" value={form.gstAmount} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Premium</label>
              <input type="number" value={form.totalPremium} readOnly className="w-full px-3 py-2 border border-teal-500 rounded-lg bg-teal-50 text-sm font-bold text-teal-700" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderField('Payment Mode', 'paymentMode', 'select', { options: ['ONLINE', 'CHEQUE', 'NEFT', 'RTGS', 'CASH', 'UPI'].map(m => ({ value: m, label: m })) })}
              {renderField('Payment Reference', 'paymentRef', 'text', { placeholder: 'UTR / Cheque No' })}
              {renderField('Payment Date', 'paymentDate', 'date')}
            </div>
          </div>
          {renderField('Remarks / Notes', 'remarks', 'textarea', { placeholder: 'Any additional notes about this policy...' })}

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(4)} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
              Next: Review <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" /> Review Policy Details
            </h2>

            {/* Summary sections */}
            {[
              { title: 'Customer', items: [
                ['Name', form.customerName], ['Phone', form.customerPhone], ['Email', form.customerEmail],
                ['City', form.customerCity], ['DOB', form.dateOfBirth], ['PAN', form.panNumber],
              ]},
              { title: 'Policy', items: [
                ['LOB', LOB_OPTIONS.find(l => l.value === form.lob)?.label], ['Policy No', form.policyNumber],
                ['Insurer', form.insurerName], ['Product', form.productName],
                ['Start', form.startDate], ['End', form.endDate],
              ]},
              ...(isMotor ? [{ title: 'Vehicle', items: [
                ['Reg No', form.vehicleRegNumber], ['Make/Model', `${form.vehicleMake} ${form.vehicleModel}`],
                ['Year', form.vehicleYear], ['Fuel', form.vehicleFuelType],
                ['Chassis', form.chassisNumber], ['Engine', form.engineNumber],
                ['IDV', form.idv ? formatCurrency(form.idv) : '-'], ['NCB', `${form.ncbPercentage}%`],
              ]}] : []),
              ...(isHealth ? [{ title: 'Health', items: [
                ['Members', form.membersCount], ['Waiting Period', form.waitingPeriod],
                ['Pre-existing', form.preExistingConditions || 'None'],
              ]}] : []),
              ...(isLife ? [{ title: 'Life', items: [
                ['Nominee', form.nomineeName], ['Relation', form.nomineeRelation],
                ['Cover', formatCurrency(form.coverAmount)], ['Term', `${form.policyTerm} years`],
              ]}] : []),
              { title: 'Premium', items: [
                ['Sum Insured', formatCurrency(form.sumInsured)],
                ...(isMotor ? [['OD', formatCurrency(form.odPremium)], ['TP', formatCurrency(form.tpPremium)]] : [['Base', formatCurrency(form.basePremium)]]),
                ['Add-On', formatCurrency(form.addOnPremium)], ['Net', formatCurrency(form.netPremium)],
                ['GST', formatCurrency(form.gstAmount)], ['Total', formatCurrency(form.totalPremium)],
              ]},
            ].map((section, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{section.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {section.items.map(([label, value], i) => (
                    <div key={i}>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-3">
              <button onClick={() => handleSave(true)} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-medium text-sm disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm disabled:opacity-50">
                <Send className="w-4 h-4" /> {saving ? 'Submitting...' : 'Submit Policy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyEntryForm;

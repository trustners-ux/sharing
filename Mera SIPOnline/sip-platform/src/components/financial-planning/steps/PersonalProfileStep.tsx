'use client';

import { useMemo } from 'react';
import { User, MapPin, Home } from 'lucide-react';
import RadioCards from '@/components/financial-planning/inputs/RadioCards';
import SelectInput from '@/components/financial-planning/inputs/SelectInput';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PersonalProfileData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  dependents: number;
  spouseAge: number | null;
  childrenAges: number[];
  city: string;
  cityTier: string;
  residentialStatus: string;
}

interface Props {
  data: PersonalProfileData;
  onUpdate: (updates: Partial<PersonalProfileData>) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INPUT_CLASS =
  'w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male', icon: '👨' },
  { value: 'female', label: 'Female', icon: '👩' },
  { value: 'other', label: 'Other', icon: '🧑' },
];

const MARITAL_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

const CITY_OPTIONS = [
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Delhi', label: 'Delhi / NCR' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Kolkata', label: 'Kolkata' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Ahmedabad', label: 'Ahmedabad' },
  { value: 'Jaipur', label: 'Jaipur' },
  { value: 'Lucknow', label: 'Lucknow' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Indore', label: 'Indore' },
  { value: 'Kochi', label: 'Kochi' },
  { value: 'Coimbatore', label: 'Coimbatore' },
  { value: 'Nagpur', label: 'Nagpur' },
  { value: 'other', label: 'Other' },
];

const CITY_TIER_OPTIONS = [
  {
    value: 'metro',
    label: 'Metro',
    description: 'Mumbai, Delhi, Bangalore, etc.',
  },
  {
    value: 'tier1',
    label: 'Tier-1',
    description: 'Pune, Ahmedabad, Jaipur, etc.',
  },
  {
    value: 'tier2',
    label: 'Tier-2',
    description: 'Indore, Coimbatore, Nagpur, etc.',
  },
  {
    value: 'tier3',
    label: 'Tier-3',
    description: 'Smaller towns & rural areas',
  },
];

const RESIDENTIAL_OPTIONS = [
  {
    value: 'own',
    label: 'Own Home',
    description: 'Fully owned or home loan running',
  },
  {
    value: 'rent',
    label: 'Rented',
    description: 'Paying monthly rent',
  },
  {
    value: 'family',
    label: 'Living with Family',
    description: 'No separate housing cost',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PersonalProfileStep({ data, onUpdate }: Props) {
  const isMarried = data.maritalStatus === 'married';
  const hasDependents = data.dependents > 0;

  // Today's date string for the date max attribute
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // ---- Handlers for children ages ----
  const addChild = () => {
    onUpdate({ childrenAges: [...data.childrenAges, 0] });
  };

  const removeChild = (index: number) => {
    const updated = data.childrenAges.filter((_, i) => i !== index);
    onUpdate({ childrenAges: updated });
  };

  const updateChildAge = (index: number, age: number) => {
    const updated = [...data.childrenAges];
    updated[index] = age;
    onUpdate({ childrenAges: updated });
  };

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------- */}
      {/* Section: Identity */}
      {/* ---------------------------------------------------------- */}
      <div className="flex items-center gap-2 mb-1">
        <User className="w-4 h-4 text-brand-600" />
        <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide">
          Basic Details
        </h3>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">
          Full Name <span className="text-negative ml-0.5">*</span>
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => onUpdate({ fullName: e.target.value })}
          placeholder="Enter your full name"
          className={INPUT_CLASS}
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">
          Date of Birth <span className="text-negative ml-0.5">*</span>
        </label>
        <input
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
          max={today}
          className={INPUT_CLASS}
        />
      </div>

      {/* Gender */}
      <RadioCards
        label="Gender"
        value={data.gender}
        onChange={(val) => onUpdate({ gender: val })}
        options={GENDER_OPTIONS}
        columns={3}
      />

      {/* Marital Status */}
      <RadioCards
        label="Marital Status"
        value={data.maritalStatus}
        onChange={(val) => onUpdate({ maritalStatus: val })}
        options={MARITAL_OPTIONS}
        columns={4}
      />

      {/* ------ Conditional: Married fields ------ */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isMarried
            ? 'max-h-[200px] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        {isMarried && (
          <div>
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">
              Spouse&apos;s Age
            </label>
            <input
              type="number"
              value={data.spouseAge ?? ''}
              onChange={(e) =>
                onUpdate({
                  spouseAge: e.target.value ? Number(e.target.value) : null,
                })
              }
              min={18}
              max={100}
              placeholder="e.g. 32"
              className={INPUT_CLASS}
            />
          </div>
        )}
      </div>

      {/* Number of Dependents — show if married OR if dependents already > 0 */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isMarried || hasDependents
            ? 'max-h-[200px] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        {(isMarried || hasDependents) && (
          <div>
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">
              Number of Dependents
            </label>
            <input
              type="number"
              value={data.dependents}
              onChange={(e) => {
                const val = Math.min(10, Math.max(0, Number(e.target.value)));
                onUpdate({ dependents: val });
              }}
              min={0}
              max={10}
              placeholder="0"
              className={INPUT_CLASS}
            />
            <p className="text-xs text-slate-400 mt-1">
              Include children, elderly parents, or anyone financially dependent on you.
            </p>
          </div>
        )}
      </div>

      {/* ------ Conditional: Children Ages (dynamic list) ------ */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          hasDependents
            ? 'max-h-[600px] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        {hasDependents && (
          <div>
            <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">
              Children&apos;s Ages
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Add each child&apos;s current age (if applicable).
            </p>

            <div className="space-y-2">
              {data.childrenAges.map((age, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-16 shrink-0">
                    Child {index + 1}
                  </span>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) =>
                      updateChildAge(index, Math.max(0, Number(e.target.value)))
                    }
                    min={0}
                    max={30}
                    placeholder="Age"
                    className={`${INPUT_CLASS} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeChild(index)}
                    className="text-negative/70 hover:text-negative text-xs font-medium px-2 py-1 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addChild}
              className="mt-2 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1"
            >
              <span className="text-lg leading-none">+</span> Add Child
            </button>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Section: Location */}
      {/* ---------------------------------------------------------- */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide">
            Location
          </h3>
        </div>

        {/* City of Residence */}
        <div className="mb-5">
          <SelectInput
            label="City of Residence"
            value={data.city}
            onChange={(val) => onUpdate({ city: val })}
            options={CITY_OPTIONS}
            placeholder="Select your city"
          />
        </div>

        {/* City Tier */}
        <RadioCards
          label="City Tier"
          value={data.cityTier}
          onChange={(val) => onUpdate({ cityTier: val })}
          options={CITY_TIER_OPTIONS}
          columns={4}
        />
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Section: Housing */}
      {/* ---------------------------------------------------------- */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide">
            Housing
          </h3>
        </div>

        <RadioCards
          label="Residential Status"
          value={data.residentialStatus}
          onChange={(val) => onUpdate({ residentialStatus: val })}
          options={RESIDENTIAL_OPTIONS}
          columns={3}
        />
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Building2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  COMPLIANCE_ADMIN: 'Compliance Admin',
  FINANCE_ADMIN: 'Finance Admin',
  REGIONAL_HEAD: 'Regional Head',
  SUB_BROKER: 'Sub Broker',
  CLIENT: 'Client',
  POSP: 'POSP Agent',
  PRINCIPAL_OFFICER: 'Principal Officer',
  MIS_MANAGER: 'MIS Manager',
  MIS_CHECKER: 'MIS Checker',
  MIS_ENTRY_OPERATOR: 'MIS Entry Operator',
  RELATIONSHIP_MANAGER: 'Relationship Manager',
  CLUSTER_DEVELOPMENT_MANAGER: 'Cluster Development Manager',
  TRAINER: 'Trainer',
};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

const ProfilePage = () => {
  const { user: authUser, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    firstName: '',
    lastName: '',
    displayName: '',
    dateOfBirth: '',
    gender: '',
    avatarUrl: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [profileMeta, setProfileMeta] = useState({
    email: '',
    role: '',
    createdAt: '',
    lastLoginAt: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get('/auth/profile');

      setProfileMeta({
        email: data.email || '',
        role: data.role || '',
        createdAt: data.createdAt || '',
        lastLoginAt: data.lastLoginAt || '',
      });

      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        firstName: data.profile?.firstName || '',
        lastName: data.profile?.lastName || '',
        displayName: data.profile?.displayName || '',
        dateOfBirth: data.profile?.dateOfBirth
          ? new Date(data.profile.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: data.profile?.gender || '',
        avatarUrl: data.profile?.avatarUrl || '',
        addressLine1: data.profile?.addressLine1 || '',
        addressLine2: data.profile?.addressLine2 || '',
        city: data.profile?.city || '',
        state: data.profile?.state || '',
        pincode: data.profile?.pincode || '',
      });
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 500KB)
    if (file.size > 512000) {
      setError('Image must be under 500KB. Please choose a smaller image.');
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      // Resize and compress image to a max of 200x200
      const resizedBase64 = await resizeImage(file, 200, 200);

      // Upload to backend
      const result = await api.post('/auth/profile/avatar', { avatarUrl: resizedBase64 });

      setFormData((prev) => ({ ...prev, avatarUrl: result.avatarUrl }));

      // Update auth context so sidebar/header update immediately
      updateUser({ avatarUrl: result.avatarUrl });

      setSuccess('Profile photo updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload photo. Please try a smaller image.');
      console.error('Avatar upload error:', err);
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with quality 0.8 for smaller size
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      await api.post('/auth/profile/avatar', { avatarUrl: '' });
      setFormData((prev) => ({ ...prev, avatarUrl: '' }));
      updateUser({ avatarUrl: null });
      setSuccess('Profile photo removed.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to remove photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await api.patch('/auth/profile', formData);

      // Update auth context with new name/phone
      updateUser({
        name: formData.name,
        phone: formData.phone,
        avatarUrl: result.profile?.avatarUrl || formData.avatarUrl,
      });

      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Profile save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const getAvatarSrc = () => {
    if (formData.avatarUrl && formData.avatarUrl.startsWith('data:image/')) {
      return formData.avatarUrl;
    }
    if (formData.avatarUrl) {
      return formData.avatarUrl;
    }
    // Default DiceBear avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name || authUser?.email || 'User')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
      </div>

      {/* Success / Error Alerts */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 relative"></div>

        {/* Avatar + Name */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                {uploadingAvatar ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <img
                    src={getAvatarSrc()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Camera Overlay */}
              <button
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
                className="absolute bottom-1 right-1 w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors disabled:opacity-50"
                title="Change photo"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Name & Role */}
            <div className="flex-1 sm:pb-1">
              <h2 className="text-xl font-bold text-gray-900">{formData.name || authUser?.email}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3" />
                  {ROLE_LABELS[profileMeta.role] || profileMeta.role}
                </span>
                <span className="text-sm text-gray-500">{profileMeta.email}</span>
              </div>
            </div>

            {/* Remove Photo Button */}
            {formData.avatarUrl && (
              <button
                onClick={handleRemoveAvatar}
                disabled={uploadingAvatar}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Photo
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900 truncate">{profileMeta.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-medium text-gray-900">{ROLE_LABELS[profileMeta.role] || profileMeta.role}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(profileMeta.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Login</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(profileMeta.lastLoginAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'personal', label: 'Personal Info', icon: User },
          { id: 'address', label: 'Address', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Display Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-3.5 h-3.5 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileMeta.email}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact admin if needed.</p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Address Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Address Line 1 */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Street address, apartment, suite, unit"
                />
              </div>

              {/* Address Line 2 */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Landmark, area (optional)"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

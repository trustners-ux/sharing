import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'

const MIS_ROLES = ['PRINCIPAL_OFFICER', 'MIS_MANAGER', 'MIS_CHECKER', 'MIS_ENTRY_OPERATOR']
const ADMIN_ROLES = ['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'FINANCE_ADMIN']

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await login(email, password)

      // Check if user must change password on first login
      if (user.mustChangePassword === true) {
        navigate('/change-password')
        return
      }

      // Role-based redirect
      if (MIS_ROLES.includes(user.role)) {
        navigate('/insurance/mis')
      } else if (ADMIN_ROLES.includes(user.role)) {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || ''
      if (message.toLowerCase().includes('locked')) {
        setError('Your account has been locked. Please contact your administrator.')
      } else if (message.toLowerCase().includes('pending') || message.toLowerCase().includes('approval')) {
        setError('Your account is pending approval. Please wait for admin activation.')
      } else if (message.toLowerCase().includes('invalid') || message.toLowerCase().includes('credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else {
        setError(message || 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Trustner</h1>
          </div>
          <p className="text-slate-400 text-sm ml-[52px]">Insurance Broking</p>
        </div>

        <div className="relative z-10">
          <p className="text-xl font-light text-slate-200 mb-10 leading-relaxed">
            Comprehensive Management Information System for insurance operations, compliance, and reporting.
          </p>
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">Premium & Policy Tracking</p>
                <p className="text-sm text-slate-400">Real-time MIS entry and verification workflow</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">Multi-level Verification</p>
                <p className="text-sm text-slate-400">Maker-checker process with audit trails</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">IRDAI Compliance</p>
                <p className="text-sm text-slate-400">Built-in regulatory reporting and EOM tracking</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">Contest & Hierarchy Management</p>
                <p className="text-sm text-slate-400">Agent incentives and organizational structure</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-500">
            Trust Now Insurance Brokers Pvt Ltd | IRDAI License Pending
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 bg-slate-50">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Trustner</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Trustner Insurance Broking</h2>
            <p className="text-teal-600 font-medium mt-1">MIS Portal</p>
            <p className="text-slate-500 text-sm mt-2">Sign in with your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@trustner.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-100 disabled:cursor-not-allowed bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-11 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-100 disabled:cursor-not-allowed bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400">
              Powered by <span className="font-semibold text-slate-600">Trustner Asset Services Pvt Ltd</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

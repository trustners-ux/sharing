import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const C = {
  navy: '#1B3A6B', navyDim: '#2E5299', navyPale: '#E8EEF8',
  green: '#0A7C4E', greenPale: '#F0FAF5',
  red: '#B91C1C', redPale: '#FEF2F2',
  amber: '#92400E', amberPale: '#FFFBEB',
  violet: '#5B21B6', violetPale: '#F5F3FF',
  ink: '#111827', muted: '#6B7280', border: '#D1D5DB',
  bg0: '#FFFFFF', bg1: '#FAFBFC', bg2: '#F4F6F9',
}

export default function LoginPage() {
  const [mode, setMode] = useState('password') // 'password' | 'otp'
  const [step, setStep] = useState('email') // for OTP: 'email' | 'verify'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, verifyOTP, loginWithPassword } = useAuth()
  const navigate = useNavigate()

  const handlePasswordLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      await loginWithPassword(email, password)
      navigate('/advisor')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async () => {
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await login(email)
      setStep('verify')
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) return
    setLoading(true)
    setError('')
    try {
      await verifyOTP(email, otp)
      navigate('/advisor')
    } catch (err) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setStep('email')
    setError('')
    setOtp('')
    setPassword('')
    setShowPassword(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    color: C.ink,
    background: C.bg0,
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: C.muted,
    display: 'block',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }

  const primaryBtnEnabled = mode === 'password' ? (email && password) : (step === 'email' ? email : otp)

  const primaryBtnStyle = {
    width: '100%',
    marginTop: 20,
    padding: '13px',
    background: primaryBtnEnabled ? C.navy : C.border,
    color: C.bg0,
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: primaryBtnEnabled && !loading ? 'pointer' : 'not-allowed',
    transition: 'background 0.2s',
    letterSpacing: '0.3px',
  }

  const linkBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: C.navyDim,
    fontSize: 13,
    cursor: 'pointer',
    padding: '8px 0',
    fontWeight: 500,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg1, display: 'flex', flexDirection: 'column' }}>
      {/* Navy gradient header */}
      <header style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDim} 100%)`,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: C.bg0,
            fontWeight: 800,
            fontSize: 22,
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.5px',
          }}>
            MeraSIP
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11,
            marginTop: 2,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            S.M.A.R.T Platform
          </div>
        </div>
      </header>

      {/* Centered login card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{
          background: C.bg0,
          borderRadius: 12,
          padding: '36px 32px 28px',
          border: `1px solid ${C.border}`,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 4px 24px rgba(27,58,107,0.08)',
        }}>
          {/* Card header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              fontSize: 22,
              fontWeight: 800,
              color: C.navy,
              fontFamily: 'Georgia, serif',
            }}>
              {mode === 'password' ? 'Sign In' : 'OTP Login'}
            </div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>
              Access your advisor dashboard
            </div>
          </div>

          {/* === PASSWORD MODE === */}
          {mode === 'password' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && document.getElementById('pwd-input')?.focus()}
                  placeholder="you@trustner.in"
                  style={inputStyle}
                  autoComplete="email"
                />
              </div>

              <div style={{ marginBottom: 4 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="pwd-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePasswordLogin()}
                    placeholder="Enter your password"
                    style={{ ...inputStyle, paddingRight: 44 }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: C.muted,
                      fontSize: 13,
                      fontWeight: 500,
                      padding: '4px 6px',
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <button
                onClick={handlePasswordLogin}
                disabled={!email || !password || loading}
                style={primaryBtnStyle}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button onClick={() => switchMode('otp')} style={linkBtnStyle}>
                  Login with OTP instead
                </button>
              </div>
            </div>
          )}

          {/* === OTP MODE: EMAIL STEP === */}
          {mode === 'otp' && step === 'email' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                  placeholder="you@trustner.in"
                  style={inputStyle}
                  autoComplete="email"
                />
              </div>

              <button
                onClick={handleSendOTP}
                disabled={!email || loading}
                style={primaryBtnStyle}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button onClick={() => switchMode('password')} style={linkBtnStyle}>
                  Login with password instead
                </button>
              </div>
            </div>
          )}

          {/* === OTP MODE: VERIFY STEP === */}
          {mode === 'otp' && step === 'verify' && (
            <div>
              <div style={{
                fontSize: 13,
                color: C.muted,
                marginBottom: 20,
                textAlign: 'center',
                padding: '10px 16px',
                background: C.navyPale,
                borderRadius: 8,
              }}>
                OTP sent to <strong style={{ color: C.navy }}>{email}</strong>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                  placeholder="000000"
                  maxLength={6}
                  style={{
                    ...inputStyle,
                    fontSize: 22,
                    textAlign: 'center',
                    letterSpacing: 10,
                    fontWeight: 700,
                  }}
                  autoComplete="one-time-code"
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={!otp || loading}
                style={primaryBtnStyle}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14 }}>
                <button
                  onClick={() => { setStep('email'); setOtp('') }}
                  style={linkBtnStyle}
                >
                  Change email
                </button>
                <button onClick={() => switchMode('password')} style={linkBtnStyle}>
                  Use password
                </button>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div style={{
              marginTop: 16,
              padding: '11px 14px',
              background: C.redPale,
              border: '1px solid #FECACA',
              borderRadius: 8,
              color: C.red,
              fontSize: 13,
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Help text */}
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid ${C.border}`,
            textAlign: 'center',
            color: C.muted,
            fontSize: 12,
            lineHeight: 1.6,
          }}>
            Forgot password? Contact your administrator.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '16px 24px',
        color: C.muted,
        fontSize: 11,
        borderTop: `1px solid ${C.border}`,
        background: C.bg0,
        letterSpacing: '0.3px',
      }}>
        Trustner Asset Services Pvt. Ltd. | ARN-286886
      </footer>
    </div>
  )
}

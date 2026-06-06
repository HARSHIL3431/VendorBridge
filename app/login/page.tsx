'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, GitCompareArrows, Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth, AuthProvider } from '@/lib/auth-context'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

const DEMO_ACCOUNTS = [
  { label: 'Admin', role: 'ADMIN', email: 'admin@vendorbridge.com', password: 'admin123', color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' },
  { label: 'Officer', role: 'PROCUREMENT_OFFICER', email: 'officer@vendorbridge.com', password: 'officer123', color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
  { label: 'Manager', role: 'MANAGER', email: 'manager@vendorbridge.com', password: 'manager123', color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
  { label: 'Vendor', role: 'VENDOR', email: 'vendor1@test.com', password: 'vendor123', color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' },
]

function LoginPageInner() {
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDemoMode(localStorage.getItem('vendorbridge_demo') === 'true')
    }
  }, [])

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  const toggleDemoMode = () => {
    const next = !demoMode
    setDemoMode(next)
    if (next) {
      localStorage.setItem('vendorbridge_demo', 'true')
      toast.success('Offline Demo Mode enabled — no backend required')
    } else {
      localStorage.removeItem('vendorbridge_demo')
      toast.info('Demo Mode disabled')
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true)
    try {
      await login(data.email, data.password)
      if (data.rememberMe) localStorage.setItem('vendorbridge_remember', data.email)
      toast.success('Welcome back to VendorBridge!')
      router.replace('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemo = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
    toast.info('Credentials filled — click Sign In')
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingReset(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success(`Password reset link sent to ${forgotEmail}`)
    setForgotOpen(false)
    setForgotEmail('')
    setSendingReset(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-secondary/6 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-card rounded-3xl shadow-2xl border border-border/60 overflow-hidden">

          {/* Header strip */}
          <div className="bg-primary px-8 pt-10 pb-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, oklch(0.8 0.16 80) 0%, transparent 60%)' }} />
            <div className="relative">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg">
                  <GitCompareArrows className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-heading text-xl font-extrabold text-primary-foreground tracking-tight">VendorBridge</span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-primary-foreground leading-tight">Welcome back</h1>
              <p className="mt-1 text-primary-foreground/70 text-sm">Sign in to your procurement workspace</p>
            </div>
          </div>

          <div className="px-8 py-8">
            {/* Demo mode banner */}
            <div className={`mb-6 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-xs transition-all duration-300 ${
              demoMode ? 'border-accent/40 bg-accent/8' : 'border-border bg-muted/50'
            }`}>
              <div>
                <p className={`font-semibold ${demoMode ? 'text-accent' : 'text-foreground'}`}>
                  💡 Offline Demo Mode
                </p>
                <p className="text-muted-foreground mt-0.5">Test all features without a backend server</p>
              </div>
              <button
                type="button"
                onClick={toggleDemoMode}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                  demoMode
                    ? 'bg-accent text-white shadow-sm shadow-accent/30'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
                }`}
              >
                {demoMode ? '✓ On' : 'Enable'}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@vendorbridge.com"
                    className={`w-full h-11 rounded-xl border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                      ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-border'}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' }
                    })}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-xs font-semibold text-accent hover:text-accent/80 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full h-11 rounded-xl border bg-card pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                      ${errors.password ? 'border-red-400 focus:ring-red-200' : 'border-border'}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">⚠ {errors.password.message}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-accent text-white font-bold text-sm tracking-wide
                  hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-accent/25
                  disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Sign In</>
                )}
              </button>
            </form>

            {/* Quick Demo Login */}
            <div className="mt-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick demo login</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(d => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => fillDemo(d.email, d.password)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all duration-150 ${d.color}`}
                  >
                    <span className="block font-bold">{d.label}</span>
                    <span className="block font-normal opacity-70 truncate">{d.email}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-accent hover:underline transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          © 2026 VendorBridge · Procurement Management Platform
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="font-heading text-xl font-bold text-foreground mb-1">Reset Password</h2>
            <p className="text-sm text-muted-foreground mb-5">Enter your email to receive a reset link.</p>
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full h-11 rounded-xl border border-border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="flex-1 h-10 rounded-xl border border-border bg-muted text-sm font-semibold hover:bg-muted/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReset}
                  className="flex-1 h-10 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {sendingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginPageInner />
    </AuthProvider>
  )
}

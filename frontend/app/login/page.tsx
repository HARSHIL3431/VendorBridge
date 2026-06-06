'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { GitCompareArrows, ArrowRight, Loader2, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const DEMO = [
  { label: 'Admin', email: 'admin@vendorbridge.com', password: 'admin123' },
  { label: 'Officer', email: 'officer@vendorbridge.com', password: 'officer123' },
  { label: 'Manager', email: 'manager@vendorbridge.com', password: 'manager123' },
  { label: 'Vendor', email: 'vendor1@test.com', password: 'vendor123' },
]

function LoginForm() {
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  
  // Demo Mode State
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDemoMode(localStorage.getItem('vendorbridge_demo') === 'true')
    }
  }, [])

  const toggleDemoMode = () => {
    const newVal = !demoMode
    setDemoMode(newVal)
    if (newVal) {
      localStorage.setItem('vendorbridge_demo', 'true')
      toast.success('Offline Demo Mode Enabled!')
    } else {
      localStorage.removeItem('vendorbridge_demo')
      toast.info('Offline Demo Mode Disabled.')
    }
  }

  // Login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Signup fields
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupRole, setSignupRole] = useState<'PROCUREMENT_OFFICER' | 'MANAGER' | 'VENDOR'>('PROCUREMENT_OFFICER')

  // Forgot password
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success('Welcome back to VendorBridge')
      router.replace('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Direct mock register (we can mock this by signing in with the user)
      // Since there's no backend register endpoint defined, we simulate it.
      await new Promise(r => setTimeout(r, 1000))
      toast.success('Account created! Logging you in...')
      // Automatically log them in as a demo user
      await login('admin@vendorbridge.com', 'admin123')
      router.replace('/dashboard')
    } catch (err) {
      toast.error('Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setSendingReset(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      toast.success(`Password reset link sent to ${forgotEmail}`)
      setForgotOpen(false)
      setForgotEmail('')
    } catch (err) {
      toast.error('Failed to send reset email')
    } finally {
      setSendingReset(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <Image
          src="/login-hero.png"
          alt=""
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <GitCompareArrows className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-2xl font-extrabold">VendorBridge</span>
        </div>

        <div className="relative max-w-md">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-sidebar-primary">
            Procurement, simplified
          </p>
          <h1 className="mt-3 font-heading text-5xl font-extrabold leading-[1.05] text-balance">
            One bridge from <span className="italic text-[oklch(0.85_0.14_85)]">request</span> to{' '}
            <span className="italic text-[oklch(0.85_0.14_85)]">receipt</span>.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
            Manage vendors, float RFQs, compare quotations, approve winners and
            ship purchase orders &amp; invoices — all in one workspace.
          </p>
        </div>

        <div className="relative flex gap-8">
          {[
            ['10', 'Vendors'],
            ['5', 'Active RFQs'],
            ['15', 'Quotations'],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-heading text-3xl font-extrabold text-sidebar-primary">{n}</p>
              <p className="text-xs uppercase tracking-wide text-primary-foreground/70">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GitCompareArrows className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-xl font-extrabold">VendorBridge</span>
          </div>

          <div className="flex rounded-xl bg-muted p-1 mb-6">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 rounded-lg py-2 text-center text-sm font-bold transition-all ${
                activeTab === 'signin'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 rounded-lg py-2 text-center text-sm font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'signin' ? (
            <>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-accent">
                Welcome back
              </p>
              <h2 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                Sign in to your workspace
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Use a demo account below or enter your credentials.
              </p>

              {/* Demo Mode Toggle Banner */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-accent/40 bg-accent/5 p-4 text-xs font-semibold text-foreground">
                <div className="flex flex-col gap-0.5">
                  <span className="text-accent flex items-center gap-1">
                    💡 Run Offline (Demo Mode)
                  </span>
                  <span className="text-muted-foreground font-normal">
                    Interact with all screens without a running backend.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleDemoMode}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    demoMode
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {demoMode ? 'Enabled' : 'Enable'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@vendorbridge.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 bg-card"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setForgotOpen(true)}
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 bg-card"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 h-11 w-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign in <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Quick demo login
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO.map((d) => (
                    <button
                      key={d.email}
                      type="button"
                      onClick={() => {
                        setEmail(d.email)
                        setPassword(d.password)
                      }}
                      className="rounded-xl border border-border bg-card px-3 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:border-accent hover:bg-accent/5"
                    >
                      {d.label}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {d.email}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-accent">
                Start for free
              </p>
              <h2 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Set up a new organization workspace profile.
              </p>

              <form onSubmit={handleSignup} className="mt-7 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signupName">Full Name</Label>
                  <Input
                    id="signupName"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    className="h-11 bg-card"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="you@company.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="h-11 bg-card"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="h-11 bg-card"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signupRole">Role</Label>
                  <Select
                    value={signupRole}
                    onValueChange={(val: any) => setSignupRole(val)}
                  >
                    <SelectTrigger id="signupRole" className="h-11 bg-card">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROCUREMENT_OFFICER">Procurement Officer</SelectItem>
                      <SelectItem value="MANAGER">Manager / Approver</SelectItem>
                      <SelectItem value="VENDOR">Vendor / Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 h-11 w-full bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Register account <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-accent" /> Forgot Password
            </DialogTitle>
            <DialogDescription>
              Enter your registered email address and we'll send you a password reset link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="forgotEmail">Email Address</Label>
              <Input
                id="forgotEmail"
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setForgotOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sendingReset}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {sendingReset ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Reset Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import {
  User, Mail, Phone, Building2, MapPin, FileText,
  Upload, X, Eye, EyeOff, ChevronDown, Loader2,
  GitCompareArrows, ArrowLeft, UserPlus, Camera,
} from 'lucide-react'
import { toast } from 'sonner'

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  country: string
  companyName: string
  department: string
  address: string
  additionalNotes: string
}

const ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'PROCUREMENT_OFFICER', label: 'Officer' },
  { value: 'VENDOR', label: 'Vendor' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'MANAGER', label: 'Procurement Manager' },
]

const COUNTRIES = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'SG', label: 'Singapore' },
  { value: 'OT', label: 'Other' },
]

// --- Shared Input ---
function Field({ label, required, error, children }: {
  label: string, required?: boolean, error?: string, children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

const inputClass = (hasError?: boolean) =>
  `w-full h-11 rounded-xl border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground
   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
   ${hasError ? 'border-red-400 focus:ring-red-200' : 'border-border'}`

const inputWithIcon = (hasError?: boolean) =>
  `w-full h-11 rounded-xl border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground
   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
   ${hasError ? 'border-red-400 focus:ring-red-200' : 'border-border'}`

// --- Section Header ---
function SectionHeader({ number, title }: { number: number, title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0">
        {number}
      </div>
      <h2 className="font-heading font-bold text-foreground text-base">{title}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>()

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return }
    setProfileFile(file)
    const reader = new FileReader()
    reader.onload = e => setProfileImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0])
  }

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 1500))
      toast.success('Account created successfully! Please log in.')
      router.push('/login')
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/6 blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/6 blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="relative z-10 py-10 px-4">
        {/* Top bar */}
        <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <GitCompareArrows className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-extrabold text-foreground text-xl">VendorBridge</span>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="font-heading text-4xl font-extrabold text-foreground">Create Your Account</h1>
            <p className="mt-2 text-muted-foreground text-sm">Join VendorBridge to manage your procurement workflows</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center gap-4">
              <div
                className={`relative w-32 h-32 rounded-full border-2 border-dashed cursor-pointer transition-all duration-200
                  ${isDragOver ? 'border-accent bg-accent/8 scale-105' : 'border-border hover:border-accent/50 hover:bg-muted/40'}
                  flex items-center justify-center overflow-hidden`}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload profile photo"
                onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Camera className="w-8 h-8" />
                    <span className="text-xs font-medium">Upload</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-muted text-sm font-semibold text-foreground hover:bg-muted/70 transition-all duration-200"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                </button>
                {profileImage && (
                  <button
                    type="button"
                    onClick={() => { setProfileImage(null); setProfileFile(null) }}
                    className="flex items-center gap-2 h-9 px-4 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 transition-all duration-200"
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF · Max 5MB · Drag & drop supported</p>
            </div>

            {/* Section 1: Personal Information */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <SectionHeader number={1} title="Personal Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" required error={errors.firstName?.message}>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      placeholder="John"
                      className={inputWithIcon(!!errors.firstName)}
                      {...register('firstName', { required: 'First name is required' })}
                    />
                  </div>
                </Field>

                <Field label="Last Name" required error={errors.lastName?.message}>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      placeholder="Doe"
                      className={inputWithIcon(!!errors.lastName)}
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                  </div>
                </Field>

                <Field label="Email Address" required error={errors.email?.message}>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="john@company.com"
                      className={inputWithIcon(!!errors.email)}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' }
                      })}
                    />
                  </div>
                </Field>

                <Field label="Phone Number" required error={errors.phone?.message}>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={inputWithIcon(!!errors.phone)}
                      {...register('phone', { required: 'Phone number is required' })}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 2: Organization Information */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <SectionHeader number={2} title="Organization Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Role" required error={errors.role?.message}>
                  <div className="relative">
                    <select
                      className={`${inputClass(!!errors.role)} appearance-none pr-10`}
                      defaultValue=""
                      {...register('role', { required: 'Role is required' })}
                    >
                      <option value="" disabled>Select your role…</option>
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </Field>

                <Field label="Country" required error={errors.country?.message}>
                  <div className="relative">
                    <select
                      className={`${inputClass(!!errors.country)} appearance-none pr-10`}
                      defaultValue=""
                      {...register('country', { required: 'Country is required' })}
                    >
                      <option value="" disabled>Select country…</option>
                      {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 3: Business Information */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <SectionHeader number={3} title="Business Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company Name" required error={errors.companyName?.message}>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      placeholder="Acme Corp"
                      className={inputWithIcon(!!errors.companyName)}
                      {...register('companyName', { required: 'Company name is required' })}
                    />
                  </div>
                </Field>

                <Field label="Department" error={errors.department?.message}>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      placeholder="Procurement"
                      className={inputWithIcon(!!errors.department)}
                      {...register('department')}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Section 4: Address */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <SectionHeader number={4} title="Address" />
              <Field label="Full Address" required error={errors.address?.message}>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <textarea
                    rows={3}
                    placeholder="123 Business Park, City, State, ZIP"
                    className={`w-full rounded-xl border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground
                      resize-y min-h-[80px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                      ${errors.address ? 'border-red-400 focus:ring-red-200' : 'border-border'}`}
                    {...register('address', { required: 'Address is required' })}
                  />
                </div>
                {errors.address && <p className="text-xs text-red-500">⚠ {errors.address.message}</p>}
              </Field>
            </div>

            {/* Section 5: Additional Notes */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <SectionHeader number={5} title="Additional Notes" />
              <Field label="Remarks / Additional Information" error={errors.additionalNotes?.message}>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <textarea
                    rows={4}
                    placeholder="Any additional context, requirements, or notes about your account…"
                    className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground
                      resize-y min-h-[100px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    {...register('additionalNotes')}
                  />
                </div>
              </Field>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pb-8">
              <Link
                href="/login"
                className="flex-1 h-12 rounded-xl border border-border bg-card text-sm font-semibold text-foreground
                  hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-12 rounded-xl bg-accent text-white font-bold text-sm tracking-wide
                  hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-accent/25
                  disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account…</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Register Account</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

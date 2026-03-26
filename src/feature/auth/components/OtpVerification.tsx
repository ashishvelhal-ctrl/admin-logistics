import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useVerifyOTP } from '../hooks/useVerifyOtp'
import { tokenAtom } from '../state/token'

import { authAtom } from '@/atoms/authAtom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { apiClient } from '@/lib/api'
import { toastService } from '@/lib/toast'

const schema = z.object({
  otp_code: z.string().regex(/^\d{6}$/),
  phone_number: z.string().regex(/^[6-9]\d{9}$/),
})

type FormData = z.infer<typeof schema>

const allowedRoles = [
  'admin',
  'banner-manager',
  'crop-catalogue-manager',
  'asset-catalogue-manager',
  'area-catalogue-manager',
]

interface Props {
  phone: string
}

export const OtpVerification = ({ phone }: Props) => {
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(12)
  const [resendLoading, setResendLoading] = useState(false)

  const canResend = timer === 0

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone_number: phone, otp_code: '' },
  })

  const verifyOTP = useVerifyOTP()
  const setToken = useSetAtom(tokenAtom)
  const setAuth = useSetAtom(authAtom)
  const navigate = useNavigate()

  const resetAuth = () => setToken({ access: '', refresh: '' })

  useEffect(() => {
    if (!timer) return
    const id = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer])

  const onOtpChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 6)
    setOtp(clean)
    form.setValue('otp_code', clean)
  }

  const fetchUser = async (tokens: any) => {
    try {
      setToken(tokens)

      const res: any = await apiClient.get('/auth/me')
      const user = res.data?.data || res.data

      if (!user?.roles?.some((r: string) => allowedRoles.includes(r))) {
        toastService.error('Unauthorized access')
        resetAuth()
        return
      }

      setAuth({
        token: tokens.access,
        user: user.name || user.username || user.phone_number || phone,
        roles: user.roles || [],
      })

      toastService.success('Login successful')
      navigate({ to: '/dashboard' })
    } catch {
      toastService.error('Login failed')
      resetAuth()
    }
  }

  const onSubmit = (data: FormData) => {
    verifyOTP.mutate(data, {
      onSuccess: (res: any) =>
        fetchUser({
          access: res.data.access_token,
          refresh: res.data.refresh_token,
        }),
      onError: () => toastService.error('OTP Verification Failed'),
    })
  }

  const handleResend = async () => {
    if (!canResend) return
    try {
      setResendLoading(true)
      await apiClient.post('/auth/resend-otp', { phone_number: phone })
      toastService.success('OTP resent successfully')
      setTimer(12)
    } catch {
      toastService.error('Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-semibold text-heading-color">
          Verify OTP
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your mobile number
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP value={otp} maxLength={6} onChange={onOtpChange}>
              {[0, 3].map((start) => (
                <InputOTPGroup key={start}>
                  {[0, 1, 2].map((i) => (
                    <InputOTPSlot
                      key={i + start}
                      index={i + start}
                      className="h-12 w-12 text-lg border-gray-900 focus:border-icon-1-color focus:ring-1 focus:ring-icon-1-color"
                    />
                  ))}
                </InputOTPGroup>
              ))}
            </InputOTP>
          </div>

          <div className="text-center text-sm">
            {!canResend ? (
              <span>Didn't receive the code? Resend in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-icon-text font-medium hover:underline disabled:opacity-50"
              >
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-icon-1-color hover:bg-icon-1-color text-white"
            disabled={verifyOTP.isPending}
          >
            {verifyOTP.isPending ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default OtpVerification

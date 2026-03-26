import { useState } from 'react'

import { useSendOTP } from '../hooks/useSendOtp'

import { OtpVerification } from './OtpVerification'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const LoginComponent = () => {
  const sendOTP = useSendOTP()

  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone) return

    setError('')

    sendOTP.mutate(
      {
        phone_number: phone,
        hash_code: Math.random().toString(36).slice(2),
      },
      {
        onSuccess: () => {
          setOtpSent(true)
        },
        onError: () => {
          setError('Failed to send OTP')
        },
      },
    )
  }

  if (otpSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <OtpVerification phone={phone} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-heading-color">
            Secure Admin Access
          </CardTitle>

          <CardDescription className="text-#000000">
            Secure access to the Cropnest Admin Panel
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-center">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-text-color">
                Phone Number
              </Label>

              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value
                  setPhone(value)
                }}
                className="h-11 bg-common-bg"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-icon-1-color hover:bg-icon-1-color text-white font-medium py-2"
              disabled={sendOTP.isPending}
            >
              {sendOTP.isPending ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginComponent

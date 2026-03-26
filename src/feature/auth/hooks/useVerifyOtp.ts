import { useMutation } from '@tanstack/react-query'

import { otpVerifyRes } from '../schema/otp'

import { logApiError } from '@/hooks/useApiError'
import { apiClient } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'

const verifyOTPFn = async (phone: string, otp: string) => {
  try {
    const res = await apiClient.post('/auth/verify-otp', {
      phone_number: phone,
      otp_code: otp,
    })
    try {
      return otpVerifyRes.parse(res)
    } catch (parseError) {
      console.error('OTP verify response parse error:', parseError)
      return res // Return raw data if parse fails
    }
  } catch (err) {
    logApiError(err)
    handleApiError(err)
  }
}

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({
      phone_number,
      otp_code,
    }: {
      phone_number: string
      otp_code: string
    }) => verifyOTPFn(phone_number, otp_code),
    mutationKey: ['auth', 'verify-otp'],
    retry: false,
    onError: (error) => {
      console.error('Failed to verify OTP:', error)
    },
  })
}

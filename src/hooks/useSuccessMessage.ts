import { toastService } from '@/lib/toast'

export const useSuccessMessage = () => {
  const showSuccess = (message: string, title: string = 'Success') => {
    toastService.success(title, message)
  }

  const showError = (message: string, title: string = 'Error') => {
    toastService.error(title, message)
  }

  const showInfo = (message: string, title: string = 'Info') => {
    toastService.info(title, message)
  }

  const showWarning = (message: string, title: string = 'Warning') => {
    toastService.warning(title, message)
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
export const SUCCESS_MESSAGES = {
  ADDRESS_SAVED: 'Address saved successfully! All validations passed.',
  ASSET_SAVED: 'Asset saved successfully',
  CROP_SAVED: 'Crop saved successfully.',
  FORM_RESET: 'Form has been reset successfully',
  DATA_UPDATED: 'Data updated successfully',
  DATA_DELETED: 'Data deleted successfully',
} as const

export const ERROR_MESSAGES = {
  SAVE_FAILED: 'Failed to save data',
  VALIDATION_ERROR: 'Please fix the validation errors below',
  NETWORK_ERROR: 'Network error occurred',
  GENERIC_ERROR: 'An error occurred',
} as const

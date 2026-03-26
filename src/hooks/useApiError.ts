import axios from "axios";
import { ZodError } from "zod";

export const logApiError = (error: unknown, context?: string) => {
  if (error instanceof ZodError) {
    console.error("❌ Zod Error", {
      context,
      issues: error.issues,
      formatted: error.format(),
    });
    return;
  }

  if (axios.isAxiosError(error)) {
    console.error("❌ Axios Error", {
      context,
      message: error.message,
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      params: error.config?.params,
      data: error.config?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
    });
    return;
  }

  // --------------------
  // NORMAL JS ERROR
  // --------------------
  if (error instanceof Error) {
    console.error("❌ JS Error", {
      context,
      message: error.message,
      stack: error.stack,
    });
    return;
  }

  // --------------------
  // UNKNOWN THROW
  // --------------------
  console.error("❌ Unknown Error", {
    context,
    error,
  });
};

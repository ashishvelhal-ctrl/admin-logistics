export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

class ToastService {
  private toasts: Toast[] = [];
  private listeners: Array<(toasts: Toast[]) => void> = [];

  addListener(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (toasts: Toast[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  addToast(toast: Omit<Toast, "duration">) {
    const newToast: Toast = {
      ...toast,
      duration: 3000,
    };

    this.toasts.push(newToast);
    this.notifyListeners();

    // Auto remove after duration
    setTimeout(() => {
      this.removeToast(newToast);
    }, newToast.duration);
  }

  removeToast(toastToRemove: Toast) {
    this.toasts = this.toasts.filter((toast) => toast !== toastToRemove);
    this.notifyListeners();
  }

  success(title: string, message?: string) {
    this.addToast({ type: "success", title, message });
  }

  error(title: string, message?: string) {
    this.addToast({ type: "error", title, message });
  }

  info(title: string, message?: string) {
    this.addToast({ type: "info", title, message });
  }

  warning(title: string, message?: string) {
    this.addToast({ type: "warning", title, message });
  }
}

export const toastService = new ToastService();

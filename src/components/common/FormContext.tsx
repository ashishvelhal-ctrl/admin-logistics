import { createContext, useContext } from "react";

import type { ReactNode } from "react";

interface FormContextValue {
  form: any;
}

const FormContext = createContext<FormContextValue | null>(null);

interface FormProviderProps {
  form: any;
  children: ReactNode;
}

export function FormProvider({ form, children }: FormProviderProps) {
  const value: FormContextValue = { form };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext(): any {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return context.form;
}

export { FormContext };

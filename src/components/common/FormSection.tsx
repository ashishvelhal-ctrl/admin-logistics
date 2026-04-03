interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section className={`mt-4 mx-2 ${className}`.trim()}>{children}</section>
  );
}

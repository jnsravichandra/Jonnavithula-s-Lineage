// --- Reusable Form Components (Candidates for shared/components/ui) ---

export interface FormFieldProps {
  label: string;
  name: string;
  value: string | number | undefined | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: React.ChangeEvent<any>) => void;
  type?: string;
  required?: boolean;
  className?: string;
  options?: { label: string; value: string }[];
  rows?: number;
}
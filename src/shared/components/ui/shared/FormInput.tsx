import Label from "./Label";
import type { FormFieldProps } from "./FormFieldProps";

const FormInput = ({ label, name, value, onChange, type = 'text', required = false, className = '' }: FormFieldProps) => (
  <div className={className}>
    <Label htmlFor={name} labelText={label} className="block text-lg font-bold text-text-secondary" />
    <input
      type={type}
      name={name}
      id={name}
      value={value ?? ''}
      onChange={onChange}
      className="mt-sm h-2xl p-sm text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
      required={required}
    />
  </div>
);

export default FormInput;
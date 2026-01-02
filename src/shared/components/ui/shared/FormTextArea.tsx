import Label from "./Label";
import type { FormFieldProps } from "./FormFieldProps";

const FormTextArea = ({ label, name, value, onChange, rows = 3, className = '' }: FormFieldProps) => (
  <div className={className}>
    <Label htmlFor={name} labelText={label} className="block text-lg font-bold text-text-secondary" />
    <textarea
      name={name}
      id={name}
      rows={rows}
      value={value ?? ''}
      onChange={onChange}
      className="mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
    />
  </div>
);

export default FormTextArea;
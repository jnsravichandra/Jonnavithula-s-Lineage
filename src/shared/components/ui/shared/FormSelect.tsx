import Label from "./Label";
import type { FormFieldProps } from "./FormFieldProps";

const FormSelect = ({ label, name, value, onChange, options = [], className = '' }: FormFieldProps) => (
  <div className={className}>
    <Label htmlFor={name} labelText={label} className="block text-lg font-bold text-text-secondary" />
    <select
      name={name}
      id={name}
      value={value ?? ''}
      onChange={onChange}
      className="mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
    >
      {options.map((option) => (
        <option className="bg-background-secondary" key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;
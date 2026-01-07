import Label from "./Label";
import type { FormFieldProps } from "./FormFieldProps";
import type { SelectHTMLAttributes } from "react";

const FormSelect = ({ label, name, value, onChange, options = [], className = '', ...rest }: FormFieldProps & SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className={`${className} pb-2`} >
    <Label htmlFor={name} labelText={label} />
    <select
      name={name}
      id={name}
      value={value ? String(value) : ''}
      onChange={onChange}
      className={`mt-sm p-sm h-2xl text-2xl block w-full 
        rounded-md border border-text-secondary shadow-sm 
        focus:border-accent-primary focus:ring-accent-primary
        bg-background-primary text-text-primary`}
      {...rest}
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
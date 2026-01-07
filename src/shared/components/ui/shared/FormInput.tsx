import Label from "./Label";
import type { FormFieldProps } from "./FormFieldProps";
import type { InputHTMLAttributes } from "react";

const FormInput = ({ label, name, value, onChange, type = 'text', required = false, className = '', ...rest }: FormFieldProps & InputHTMLAttributes<HTMLInputElement>) => (
  <div className={`${className} pb-2`}>
    <Label htmlFor={name} labelText={label}/>
    <input
      type={type}
      name={name}
      id={name}
      value={value ? String(value) : ''}
      onChange={onChange}
      className={`mt-sm h-2xl p-sm text-2xl block w-full 
        rounded-md border border-text-secondary shadow-sm 
        focus:border-accent-primary focus:ring-accent-primary
        bg-background-primary text-text-primary`}
      required={required}
      {...rest}
    />
  </div>
);

export default FormInput;
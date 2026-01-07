import Label from "./Label";
import type { FormFieldProps } from "./FormFieldProps";
import type { TextareaHTMLAttributes } from "react";

const FormTextArea = ({ label, name, value, onChange, rows = 3, className = '', ...rest }: FormFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className={`${className} pb-2`}>
    <Label htmlFor={name} labelText={label} />
    <textarea
      name={name}
      id={name}
      rows={rows}
      value={value ? String(value) : ''}
      onChange={onChange}
      className={`mt-sm p-sm text-2xl block w-full 
        rounded-md border border-text-secondary 
        bg-background-primary text-text-primary
        shadow-sm focus:border-accent-primary focus:ring-accent-primary`}
      {...rest}
    />
  </div>
);

export default FormTextArea;
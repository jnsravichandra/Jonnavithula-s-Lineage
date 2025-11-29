interface TextInputProps {
  name: string;
  id: string;
  value: string;
  className?: string;
  isRequired?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TextInput({ name, id, value, className, isRequired = false, onChange }: TextInputProps) {
  return (
    <input
      type="text"
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      className={
        className
          ? className
          : "mt-sm h-2xl p-sm text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
      }
      {...(isRequired ? { required: true } : {})}
    />
  );
}

export default TextInput;

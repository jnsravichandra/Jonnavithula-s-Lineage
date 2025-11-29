interface DropdownInputProps {
  name: string;
  id: string;
  value: string;
  className?: string;
  isRequired?: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  options: { label: string; value: string; className?: string }[];
}

function DropdownInput({
  name,
  id,
  value,
  className,
  isRequired = false,
  onChange,
  options,
}: DropdownInputProps) {
  return (
    <>
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className={
          className
            ? className
            : "mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        }
        {...(isRequired ? { required: true } : {})}
      >
        {options.map((option) => (
          <option
            className={
              option.className ? option.className : "bg-background-secondary"
            }
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default DropdownInput;
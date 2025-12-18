interface DateInputProps {
  name: string;
  id: string;
  value: string;
  className?: string;
  isRequired?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DateInput({ name, id, value, className, isRequired = false, onChange }: DateInputProps) {
  return (
    <>
      <input
        type="date"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className={
          className
            ? className
            : "mt-sm p-sm h-2xl text-2xl block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        }
        {...(isRequired ? { required: true } : {})}
      />
    </>
  );
}

export default DateInput;

interface TextAreaProps {
  name: string;
  id: string;
  value: string;
  rows: number;
  className?: string;
  isRequired?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextArea({
  name,
  id,
  value,
  rows,
  className,
  isRequired = false,
  onChange,
}: TextAreaProps) {
  return (
    <>
      <textarea
        name={name}
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        className={
          className
            ? className
            : "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        }
        {...(isRequired ? { required: true } : {})}
      />
    </>
  );
}

export default TextArea;

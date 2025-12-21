interface LabelProps {
  htmlFor: string;
  labelText: string;
  className?: string;
}
function Label({ htmlFor, labelText, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        className ? className : "text-lg font-bold text-text-primary"
      }
    >
      {labelText}
    </label>
  );
}

export default Label;

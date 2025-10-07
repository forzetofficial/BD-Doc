import { InputHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextField({ label, ...props }: TextFieldProps) {
  return (
    <div>
      <div className="label">{label}</div>
      <input className="input" {...props} />
    </div>
  );
}

import { InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextField({ label, ...props }: TextFieldProps) {
  return (
    <div>
      <div className={styles.label}>{label}</div>
      <input className={styles.input} {...props} />
    </div>
  );
}

import "../App.css";
import { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="login-page">
      <div className="bg-mesh" aria-hidden="true" />
      <div className="orb violet one" />
      <div className="orb blue two" />
      <div className="orb green three" />
      <div className="orb yellow four" />
      <div className="particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="card">
        <div className="title">{title}</div>
        {children}
      </div>
    </div>
  );
}

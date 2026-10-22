import logo from "@assets/logo.svg";
import { H1 } from "zefpdf-lab/ui/Titles";

export interface HeaderProps {
  title: string;
}

/** Shared document header: logo and title. */
export function Header({ title }: HeaderProps) {
  return (
    <div className="header">
      <img src={logo} alt="" />
      <H1>{title}</H1>
    </div>
  );
}

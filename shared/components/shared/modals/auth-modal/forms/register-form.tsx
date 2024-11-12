import React from "react";

interface Props {
  className?: string;
}

export const RegisterForm: React.FC<Props> = ({ className }) => {
  return <h1 className={className}>Register</h1>;
};

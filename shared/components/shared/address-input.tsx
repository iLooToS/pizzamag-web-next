"use client";

import React from "react";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";

interface Props {
  onChange?: (value?: string) => void;
}

const API_KEY = String(process.env.NEXT_PUBLIC_DADATA_API_KEY);

export const AddressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions
      token={API_KEY}
      onChange={(data) => onChange?.(data?.value)}
      inputProps={{
        className:
          "flex w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-12 text-md",
        placeholder: "Начните вводить адрес, и воспользуйтесь подсказкой",
      }}
    />
  );
};

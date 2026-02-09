
// frontend/src/components/ui/input.tsx
import React from "react";

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="border rounded px-3 py-2 w-full" />
);

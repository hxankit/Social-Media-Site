import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge class names using `clsx` and `twMerge`
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility to convert a file to a Data URL
export const readFileAsDataUrl = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      // Ensure the result is a string
      if (typeof reader.result === 'string') resolve(reader.result);
    };

    // Corrected the method to read the file as Data URL
    reader.readAsDataURL(file);
  });
};

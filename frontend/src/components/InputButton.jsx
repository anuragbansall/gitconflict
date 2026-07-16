import React from "react";
import Button from "./Button";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function InputButton({
  className,
  placeholder,
  buttonText,
  onSubmit,
  onChange,
  value,
  type = "text",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(
        clsx(
          "h-16 md:w-160 max-w-full p-2 rounded-xl border-2 border-zinc-100 flex justify-between items-center focus-within:border-blue-500 duration-200",
          className,
        ),
      )}
    >
      <input
        placeholder={placeholder}
        className="w-full h-full outline-0 border-0 px-4 text-xl"
        type={type}
        onChange={onChange}
        value={value}
      />

      <Button isPrimary={true} className="shrink-0 h-full">
        {buttonText}
      </Button>
    </form>
  );
}

export default InputButton;

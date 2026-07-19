import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

function DropDown({ options = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-zinc-00 dark:border-zinc-700"
        >
          <button
            type="button"
            onClick={() => toggle(index)}
            className="flex w-full items-center justify-between bg-zinc-100/10 px-4 py-3 text-left font-medium transition hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <span>{option.title}</span>

            <FiChevronDown
              className={`transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          {openIndex === index && (
            <div className="border-t border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
              {option.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DropDown;

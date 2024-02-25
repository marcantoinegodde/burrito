import React, { useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
  useInteractions,
  FloatingFocusManager,
  offset,
  flip,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

import Dropdown from "@/components/core/Dropdown";
import Checkbox from "@/components/core/Checkbox";

export interface DateDropdownProps {
  className?: string;
  variant?: "light" | "dark";
  disabled?: boolean;
  selectedSort: "ascending" | "descending" | null;
  setSelectedSort: (sort: "ascending" | "descending" | null) => void;
}

const options: Array<{ value: "ascending" | "descending"; label: string }> = [
  { value: "descending", label: "Recent to old" },
  { value: "ascending", label: "Old to recent" },
];

const DateDropdown: React.FC<DateDropdownProps> = ({
  className,
  variant = "light",
  disabled,
  selectedSort,
  setSelectedSort,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listElementsRef = useRef<Array<HTMLElement | null>>([]);
  const listContentRef = useRef<Array<string | null>>([]);
  const isTypingRef = useRef(false);

  const { refs, floatingStyles, context } = useFloating<HTMLElement>({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip()],
  });

  const click = useClick(context, {
    enabled: !disabled,
    event: "mousedown",
  });
  const listNavigation = useListNavigation(context, {
    enabled: !disabled,
    listRef: listElementsRef,
    activeIndex: activeIndex,
    onNavigate: setActiveIndex,
    selectedIndex: options.findIndex((option) => option.value === selectedSort),
  });
  const typeahead = useTypeahead(context, {
    enabled: !disabled,
    listRef: listContentRef,
    activeIndex: activeIndex,
    selectedIndex: options.findIndex((option) => option.value === selectedSort),
    onMatch: setActiveIndex,
    onTypingChange(isTyping) {
      isTypingRef.current = isTyping;
    },
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "select" });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, listNavigation, typeahead, dismiss, role]
  );

  const handleSelect = (sort: "ascending" | "descending") => {
    setSelectedSort(selectedSort === sort ? null : sort);
  };

  const styles = {
    light: `bg-nuances-white
      text-primary-600
      shadow-light`,
    dark: `bg-nuances-black
      text-nuances-300
      shadow-dark`,
  };

  return (
    <>
      <Dropdown
        className={className}
        label="Date"
        filled={selectedSort !== null}
        disabled={disabled}
        variant={variant}
        ref={refs.setReference}
        {...getReferenceProps()}
      />
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={twMerge(
                `overflow-y-auto
                rounded-lg
                outline-none
                px-4
                py-2`,
                styles[variant]
              )}
              {...getFloatingProps()}
            >
              <span className="font-semibold">Date</span>
              <hr
                className={`
                  h-[1px]
                  w-auto
                  -mx-4
                  my-2
                  ${
                    variant === "light"
                      ? "border-primary-600"
                      : "border-nuances-300"
                  }
                `}
              />
              <div className="flex flex-col gap-1">
                {options.map(({ value, label }, index) => (
                  <Checkbox
                    key={value}
                    role="option"
                    variant={variant}
                    label={label}
                    checked={selectedSort === value}
                    readOnly
                    tabIndex={activeIndex === index ? 0 : -1}
                    forwardedRef={(node) => {
                      listElementsRef.current[index] = node;
                      listContentRef.current[index] = label;
                    }}
                    {...getItemProps({
                      onClick() {
                        handleSelect(value);
                      },
                      onKeyDown(event) {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleSelect(value);
                        }

                        if (event.key === " " && !isTypingRef.current) {
                          event.preventDefault();
                          handleSelect(value);
                        }
                      },
                    })}
                  />
                ))}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};

export default DateDropdown;

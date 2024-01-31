import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

import Dropdown from "@/components/core/Dropdown";
import AttemptsDropdown from "@/components/dropdowns/AttemptsDropdown";
import AttemptButton from "@/components/buttons/AttemptButton";
import CopyIcon from "@/assets/icons/CopyIcon";
import DownloadAltIcon from "@/assets/icons/DownloadAltIcon";

import { Layer } from "@/clients/layers/types";

export interface LogsTerminalProps {
  className?: string;
  variant?: "light" | "dark";
  layer: Layer;
}

const LogsTerminal: React.FC<LogsTerminalProps> = ({
  className,
  variant = "light",
  layer: { namespace, name },
}) => {
  const styles = {
    light: `bg-nuances-50
      text-nuances-black
      fill-nuances-black
      border-primary-500`,
    dark: `bg-nuances-400
      text-nuances-50
      fill-nuances-50
      border-nuances-black`,
  };

  const [selectedAttempts, setSelectedAttempts] = useState<number[]>([0]);
  const [activeAttempt, setActiveAttempt] = useState<number>(0);

  const example_logs = {
    // TODO: replace with real logs
    results: [
      "INFO:root:This is a log message\n",
      "WARNING:root:This is a warning message\n",
      "ERROR:root:This is an error message\n",
    ],
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(example_logs.results.join("\n"));
  };

  return (
    <div
      className={twMerge(
        `flex
        flex-col
        rounded-2xl
        ${styles[variant]}`,
        className
      )}
    >
      <div className="flex flex-row justify-between items-center p-4">
        <div className="flex flex-row items-center gap-4">
          <span className="text-lg font-black">{name}</span>
          <span className="text-base font-semibold">{namespace}</span>
          <Dropdown
            className={
              variant === "light"
                ? "bg-primary-300 text-primary-600 fill-primary-600"
                : "bg-nuances-300 text-nuances-400 fill-nuances-400"
            }
            label="Latest attempt"
            variant={variant}
          >
            <AttemptsDropdown
              variant={variant}
              runId="runId" // TODO: replace with real runId
              select={selectedAttempts}
              onChange={setSelectedAttempts}
            />
          </Dropdown>
        </div>
        <div className="flex flex-row items-center gap-4">
          <CopyIcon
            className="cursor-pointer"
            height={30}
            width={30}
            onClick={handleCopy}
          />
          <DownloadAltIcon className="cursor-pointer" height={30} width={30} />
        </div>
      </div>
      <hr
        className={`
          h-[1px]
          w-full
          ${variant === "light" ? "border-primary-600" : "border-nuances-300"}
        `}
      />
      <div className="flex flex-row items-center gap-1 p-4 overflow-auto">
        {selectedAttempts
          .sort((a, b) => b - a)
          .map((attempt) => (
            <AttemptButton
              key={attempt}
              variant={variant}
              attempt={attempt + 1}
              isActive={attempt === activeAttempt}
              onClick={() => setActiveAttempt(attempt)}
              onClose={() => {
                setSelectedAttempts((selectedAttempts) =>
                  selectedAttempts.filter((a) => a !== attempt)
                );
              }}
            />
          ))}
      </div>
      <div className="pb-4 overflow-auto">
        <table>
          <tbody>
            {example_logs.results.map((log, i) => (
              <tr key={i}>
                <td
                  className={`
                    text-sm
                    px-4
                    ${
                      variant === "light"
                        ? "text-primary-600"
                        : "text-nuances-300"
                    }
                  `}
                >
                  {i + 1}
                </td>
                <td>{log}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTerminal;

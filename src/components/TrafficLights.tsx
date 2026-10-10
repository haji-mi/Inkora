import React, { useState } from 'react';
import { closeWindow, minimizeWindow, toggleMaximizeWindow } from '../utils/platform';

interface TrafficLightsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const TrafficLights: React.FC<TrafficLightsProps> = ({
  onClose = closeWindow,
  onMinimize = minimizeWindow,
  onMaximize = toggleMaximizeWindow,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-[8px] px-3 py-2 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-tauri-drag-region="false"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        title="关闭"
        className="w-[12px] h-[12px] rounded-full bg-[#FF5F56] border border-[rgba(0,0,0,0.14)] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-center transition-transform active:scale-95 focus:outline-none"
      >
        <svg
          viewBox="0 0 10 10"
          className={`w-[6px] h-[6px] text-[#4D0000] transition-opacity duration-100 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M2 2L8 8M8 2L2 8" />
        </svg>
      </button>

      {/* Minimize button */}
      <button
        onClick={onMinimize}
        title="最小化"
        className="w-[12px] h-[12px] rounded-full bg-[#FFBD2E] border border-[rgba(0,0,0,0.14)] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-center transition-transform active:scale-95 focus:outline-none"
      >
        <svg
          viewBox="0 0 10 10"
          className={`w-[6px] h-[6px] text-[#5C3B00] transition-opacity duration-100 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M1.5 5H8.5" />
        </svg>
      </button>

      {/* Maximize / Zoom button */}
      <button
        onClick={onMaximize}
        title="缩放 / 全屏"
        className="w-[12px] h-[12px] rounded-full bg-[#27C93F] border border-[rgba(0,0,0,0.14)] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-center transition-transform active:scale-95 focus:outline-none"
      >
        <svg
          viewBox="0 0 10 10"
          className={`w-[6px] h-[6px] text-[#0A4714] transition-opacity duration-100 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          fill="currentColor"
        >
          <path d="M1.5 1.5H5.5L1.5 5.5V1.5Z" />
          <path d="M8.5 8.5H4.5L8.5 4.5V8.5Z" />
        </svg>
      </button>
    </div>
  );
};

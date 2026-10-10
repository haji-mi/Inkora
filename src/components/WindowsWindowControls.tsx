import React, { useState, useEffect } from 'react';
import { closeWindow, minimizeWindow, toggleMaximizeWindow, isTauri } from '../utils/platform';

interface WindowsWindowControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const WindowsWindowControls: React.FC<WindowsWindowControlsProps> = ({
  onClose = closeWindow,
  onMinimize = minimizeWindow,
  onMaximize = toggleMaximizeWindow,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    if (isTauri()) {
      import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
        const appWindow = getCurrentWindow();
        appWindow.isMaximized().then(setIsMaximized).catch(() => {});
        appWindow.onResized(() => {
          appWindow.isMaximized().then(setIsMaximized).catch(() => {});
        }).then((cb) => {
          unlisten = cb;
        }).catch(() => {});
      });
    }

    const handleResize = () => {
      if (document.fullscreenElement) {
        setIsMaximized(true);
      } else {
        setIsMaximized(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (unlisten) unlisten();
    };
  }, []);

  const handleToggleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize();
  };

  return (
    <div className="flex items-center h-full select-none" data-tauri-drag-region="false">
      {/* Minimize */}
      <button
        onClick={onMinimize}
        title="最小化"
        className="w-11 h-full flex items-center justify-center text-mac-text-secondary hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15 transition-colors focus:outline-none"
      >
        <svg viewBox="0 0 10 10" className="w-[10px] h-[10px]" stroke="currentColor" strokeWidth="1">
          <line x1="0" y1="5" x2="10" y2="5" />
        </svg>
      </button>

      {/* Maximize / Restore */}
      <button
        onClick={handleToggleMaximize}
        title={isMaximized ? "向下还原" : "最大化"}
        className="w-11 h-full flex items-center justify-center text-mac-text-secondary hover:text-mac-text-primary dark:hover:text-mac-text-darkPrimary hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15 transition-colors focus:outline-none"
      >
        {isMaximized ? (
          // Dual restore squares
          <svg viewBox="0 0 10 10" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="0" width="8" height="8" rx="0.5" />
            <path d="M0 2.5V10H7.5V7.5" />
          </svg>
        ) : (
          // Single square
          <svg viewBox="0 0 10 10" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="0.5" y="0.5" width="9" height="9" rx="0.5" />
          </svg>
        )}
      </button>

      {/* Close button with Windows crimson hover */}
      <button
        onClick={onClose}
        title="关闭"
        className="w-11 h-full flex items-center justify-center text-mac-text-secondary hover:text-white hover:bg-[#E81123] active:bg-[#C4101F] active:text-white transition-colors focus:outline-none"
      >
        <svg viewBox="0 0 10 10" className="w-[10px] h-[10px]" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
          <path d="M1 1L9 9M9 1L1 9" />
        </svg>
      </button>
    </div>
  );
};

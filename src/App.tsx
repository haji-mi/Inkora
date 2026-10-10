import React from 'react';

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-mac-bg-light dark:bg-mac-bg-dark text-mac-text-primary dark:text-mac-text-darkPrimary select-none">
      <div className="h-10 border-b border-mac-border-light dark:border-mac-border-dark flex items-center px-4">
        <span className="text-xs font-semibold">Inkora Scaffold Ready</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-mac-text-secondary">Ready for editor components</p>
      </div>
    </div>
  );
}

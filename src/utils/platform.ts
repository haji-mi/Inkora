// Platform detection and safe Tauri API wrapper

export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

export async function minimizeWindow() {
  if (isTauri()) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().minimize();
    } catch (e) {
      console.warn('Tauri minimize failed:', e);
    }
  } else {
    console.log('Web environment: minimize simulated');
  }
}

export async function toggleMaximizeWindow() {
  if (isTauri()) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().toggleMaximize();
    } catch (e) {
      console.warn('Tauri toggleMaximize failed:', e);
    }
  } else {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
}

export async function closeWindow() {
  if (isTauri()) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
    } catch (e) {
      console.warn('Tauri close failed:', e);
    }
  } else {
    window.close();
  }
}

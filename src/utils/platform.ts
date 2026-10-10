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

export interface InitialFileResult {
  path: string;
  name: string;
  content: string;
}

export async function getInitialFile(): Promise<InitialFileResult | null> {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<InitialFileResult | null>('get_initial_file');
    } catch (e) {
      console.warn('get_initial_file invoke failed:', e);
      return null;
    }
  }
  return null;
}

export async function saveDiskFile(path: string, content: string): Promise<boolean> {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('save_file', { path, content });
      return true;
    } catch (e) {
      console.error('save_file failed:', e);
      return false;
    }
  }
  return false;
}

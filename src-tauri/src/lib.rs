use std::path::PathBuf;

#[derive(serde::Serialize)]
pub struct InitialFile {
    pub path: String,
    pub name: String,
    pub content: String,
}

#[tauri::command]
fn get_initial_file() -> Option<InitialFile> {
    let args: Vec<String> = std::env::args().collect();
    for arg in args.into_iter().skip(1) {
        if !arg.starts_with("--") {
            let path = PathBuf::from(&arg);
            if path.is_file() {
                if let Ok(content) = std::fs::read_to_string(&path) {
                    let name = path
                        .file_name()
                        .and_then(|n| n.to_str())
                        .unwrap_or("document.md")
                        .to_string();
                    let abs_path = path.to_string_lossy().to_string();
                    return Some(InitialFile {
                        path: abs_path,
                        name,
                        content,
                    });
                }
            }
        }
    }
    None
}

#[tauri::command]
fn save_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(&path, content).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_initial_file, save_file])
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}

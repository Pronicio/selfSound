#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use rustube::{Id, Video};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_stream])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn get_stream(code: String) -> String {
    let id = Id::from_str(&code).unwrap();
    let video = Video::from_id(id.into_owned()).await.unwrap();

    let info = video
        .best_audio()
        .unwrap();

    let link = &info.signature_cipher.url;

    link.as_str().into()
}

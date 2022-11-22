export async function getStream(code) {
    if (window.__TAURI__) {
        const invoke = window.__TAURI__.invoke;
        const url = await invoke('get_stream', { code: code });

        return {
            type: "stream",
            url: url
        }
    }

    return {
        type: "embed",
        url: `https://youtube.com/watch?v=${code}`
    }
}

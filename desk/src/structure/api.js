import axios from 'axios'

export async function getMusic(music) {
    const res = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACK}/youtube/search?music=true`,
        data: {
            query: `${music.title} ${music.artist.name}`
        }
    })

    console.log(res)
}

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

import { fetch, ResponseType } from '@tauri-apps/api/http';
import tough from "tough-cookie"

export class Youtube {
    constructor() {
        this.ytcfg = {}
        this.cookies = new tough.CookieJar()
    }

    async initalize() {
        const response = await fetch('https://music.youtube.com/', {
            method: 'GET',
            timeout: 30,
            responseType: ResponseType.Text,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });

        response.data.split('ytcfg.set(').map(v => {
            try {
                return JSON.parse(v.split(');')[0])
            } catch (_) {}
        }).filter(Boolean).forEach(cfg => (this.ytcfg = Object.assign(cfg, this.ytcfg)))

        console.log(this.ytcfg)
    }

    search(query, categoryName, _pageLimit = 1) {
        //TODO
    }
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

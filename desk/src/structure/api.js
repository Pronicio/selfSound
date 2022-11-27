import { fetch, ResponseType, Body } from '@tauri-apps/api/http';
import tough from "tough-cookie"
import querystring from 'query-string'
import { createApiContext, getCategoryURI } from "./utils.js";

export class Youtube {
    constructor() {
        this.ytcfg = {}
        //this.cookies = new tough.CookieJar()
        this.cookies = ""

        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.5',
        }
    }

    async initalize() {
        const response = await fetch('https://music.youtube.com/', {
            method: 'GET',
            timeout: 30,
            responseType: ResponseType.Text,
            headers: { ...this.headers },
        });

        this.cookies = response.rawHeaders["set-cookie"].join(";")

        response.data.split('ytcfg.set(').map(v => {
            try {
                return JSON.parse(v.split(');')[0])
            } catch (_) {
            }
        }).filter(Boolean).forEach(cfg => (this.ytcfg = Object.assign(cfg, this.ytcfg)))
    }

    async _createApiRequest(endpointName, inputVariables, inputQuery = {}) {
        const headers = Object.assign({
            'x-origin': 'https://music.youtube.com/',
            'X-Goog-Visitor-Id': this.ytcfg.VISITOR_DATA || '',
            'X-YouTube-Client-Name': this.ytcfg.INNERTUBE_CONTEXT_CLIENT_NAME,
            'X-YouTube-Client-Version': this.ytcfg.INNERTUBE_CLIENT_VERSION,
            'X-YouTube-Device': this.ytcfg.DEVICE,
            'X-YouTube-Page-CL': this.ytcfg.PAGE_CL,
            'X-YouTube-Page-Label': this.ytcfg.PAGE_BUILD_LABEL,
            'X-YouTube-Utc-Offset': String(-new Date().getTimezoneOffset()),
            'X-YouTube-Time-Zone': new Intl.DateTimeFormat().resolvedOptions().timeZone,
            'Cookie': this.cookies
        }, this.headers)

        const url = `https://music.youtube.com/youtubei/${this.ytcfg.INNERTUBE_API_VERSION}/${endpointName}?${querystring.stringify(Object.assign({
            alt: 'json',
            key: this.ytcfg.INNERTUBE_API_KEY
        }, inputQuery))}`

        const body = Body.json({
            ...inputVariables,
            ...createApiContext(this.ytcfg)
        })

        console.log(body)

        console.log(url)
        console.log(body)
        console.log(headers)

        const response = await fetch(url, {
            method: 'POST',
            responseType: ResponseType.JSON,
            headers: { ...headers },
            body: body
        });

        console.log("res", response)

        if (response.data.hasOwnProperty('responseContext')) {
            return (response.data)
        }
    }

    async search(query, categoryName, _pageLimit = 1) {
        let result = {}
        const context = await this._createApiRequest('search', {
            query: query,
            params: getCategoryURI(categoryName)
        })

        console.log(context)

        /*
        try {
            switch ((categoryName.toUpperCase()) {
                case 'SONG':
                    result = parsers.parseSongSearchResult(context)
                    break
                case 'VIDEO':
                    result = parsers.parseVideoSearchResult(context)
                    break
                case 'ALBUM':
                    result = parsers.parseAlbumSearchResult(context)
                    break
                case 'ARTIST':
                    result = parsers.parseArtistSearchResult(context)
                    break
                case 'PLAYLIST':
                    result = parsers.parsePlaylistSearchResult(context)
                    break
                default:
                    result = parsers.parseSearchResult(context)
                    break
            }

            return (result)
        } catch (error) {
            console.error(error);
            return ({
                error: error.message
            })
        }

         */
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

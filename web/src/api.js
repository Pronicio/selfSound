import axios from "axios";

export async function getYoutubeVideoFromProvider (data) {
    let req = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACK}/youtube/search?music=true`,
        data: {
            query: `${data.title} ${data.artist.name}`
        }
    })

    return {
        trackId: data.id,
        videoId: req.data.id,
        title: data.title_short ? data.title_short : data.title,
        artist: {
            id: data.artist.id,
            name: data.artist.name,
        },
        album: {
            id: data.album.id,
            cover: {
                big: data.album.cover_big,
                xl: data.album.cover_xl,
            },
        }
    };
}

export function secondsToString (seconds, aff) {
    const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

    if (numhours <= 0) {
        return `${("0" + numminutes).slice(-2)}:${("0" + Math.trunc(numseconds)).slice(-2)}${aff ? 'min' : ''}`;
    }

    return `${("0" + numhours).slice(-2)}:${("0" + numminutes).slice(-2)}:${("0" + Math.trunc(numseconds)).slice(-2)}${aff ? 'h' : ''}`;
}

export function toHumanString(number) {
    const PREFIXES = {
        '24': 'Y',
        '21': 'Z',
        '18': 'E',
        '15': 'P',
        '12': 'T',
        '9': 'G',
        '6': 'M',
        '3': 'k',
        '0': '',
        '-3': 'm',
        '-6': 'µ',
        '-9': 'n',
        '-12': 'p',
        '-15': 'f',
        '-18': 'a',
        '-21': 'z',
        '-24': 'y'
    };

    function _getExponent(n) {
        if (n === 0) {
            return 0;
        }
        return Math.floor(Math.log10(Math.abs(n)));
    }

    function _precise(n) {
        return Number.parseFloat(n.toPrecision(3));
    }

    let n = _precise(Number.parseFloat(number));
    let e = Math.max(Math.min(3 * Math.floor(_getExponent(n) / 3), 24), -24);

    return _precise(n / Math.pow(10, e)).toString() + PREFIXES[e];
}

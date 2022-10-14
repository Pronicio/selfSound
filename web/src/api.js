import axios from "axios";

export async function getYoutubeVideoFromProvider(data) {
    const req = await axios({
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
                big: data.album.cover_big || data.album.cover.big,
                xl: data.album.cover_xl || data.album.cover.xl,
            },
        }
    };
}

export function formatYoutubeVideo(data) {
    return {
        trackId: null,
        videoId: data.id,
        title: data.title,
        artist: {
            id: data.channel.id,
            name: data.channel.name,
        },
        album: {
            id: null,
            cover: {
                big: `https://img.youtube.com/vi/${data.id}/mqdefault.jpg`,
                xl: `https://img.youtube.com/vi/${data.id}/maxresdefault.jpg`,
            },
        }
    };
}

export function secondsToString(seconds, aff) {
    const numHours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const numMinutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const numSeconds = (((seconds % 31536000) % 86400) % 3600) % 60;

    if (numHours <= 0) {
        return `${("0" + numMinutes).slice(-2)}:${("0" + Math.trunc(numSeconds)).slice(-2)}${aff ? 'min' : ''}`;
    }

    return `${("0" + numHours).slice(-2)}:${("0" + numMinutes).slice(-2)}:${("0" + Math.trunc(numSeconds)).slice(-2)}${aff ? 'h' : ''}`;
}

export function toHumanString(number) {
    const form = Intl.NumberFormat(this.store.lang, { notation: 'compact' })
    return form.format(number)
}

export function cleanString(text) {
    const result = text
        .replace(/ *\([^)]*\) */g, "") //Remove brackets
        .replace(/\[.*?]/g, "") //Remove hooks
    //.replace(/[^a-zA-Z0-9 ]/g, ""); //Remove special characters

    return result.trim();
}

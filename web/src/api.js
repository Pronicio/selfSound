import axios from "axios";

export function secondsToString (seconds, aff) {
    const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

    if (numhours <= 0) {
        return `${("0" + numminutes).slice(-2)}:${("0" + Math.trunc(numseconds)).slice(-2)}${aff ? 'min' : ''}`;
    }

    return `${("0" + numhours).slice(-2)}:${("0" + numminutes).slice(-2)}:${("0" + Math.trunc(numseconds)).slice(-2)}${aff ? 'h' : ''}`;
}

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

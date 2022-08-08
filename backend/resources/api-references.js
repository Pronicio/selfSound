// POST : 

const createPlaylist = {
    "action": "createPlaylist",
    "data": {
        "name": "Hard",
        "imageCode": "zk9FVTl" //Imgur image code
    }
}

const addAlbum = {
    "action": "album",
    "data": {
        "id": 9923094
    }
}

const addArtist = {
    "action": "artist",
    "data": {
        "id": 75798
    }
}

const addPlaylistFromProvider = {
    "action": "playlist",
    "data": {
        "providerId": 3110429622
    }
}

const addPlaylistFromYoutube = {
    "action": "playlist",
    "data": {
        "providerId": 3110429622
    }
}

// PUT :

const addLikedYoutube = {
    "action": "liked",
    "data": {
        "youtubeId": "dh01eSOn9_E"
    }
}

const addLikedProvider = {
    "action": "liked",
    "data": {
        "providerId": 764420732
    }
}

const addYoutubeToPlaylist = {
    "action": "playlist",
    "data": {
        "youtubeId": "dh01eSOn9_E",
        "playlistId": "62f0cb57654c251436ddf765"
    }
}

const addTrackToPlaylist = {
    "action": "playlist",
    "data": {
        "providerId": 764420732,
        "playlistId": "62f0cb57654c251436ddf765"
    }
}

// DELETE : 

const deleteLikedProvider = {
    "action": "liked",
    "data": {
        "providerId": 3135556
    }
}

const deleteLikedYoutube = {
    "action": "liked",
    "data": {
        "youtubeId": "dh01eSOn9_E"
    }
}

const deletelbum = {
    "action": "album",
    "data": {
        "id": 9923094
    }
}

const deleteArtist = {
    "action": "artist",
    "data": {
        "id": 75798
    }
}

const deletePlaylistFromProvider = {
    "action": "playlist",
    "data": {
        "providerId": 3110429622
    }
}

const deletePlaylistFromYoutube = {
    "action": "playlist",
    "data": {
        "youtubeId": "PL30hHNrk_dYawSnEs7MYekFlt1bKvjGjX"
    }
}
const Genius = require("genius-lyrics");
const Client = new Genius.Client();

const axios = require("axios");

async function routes(fastify, options) {
  /**
   * Get a music lyrics
   * @body {string} query The title to search
   * @body {string} author The author of the music
   */
  fastify.post("/search", async (req, rep) => {
    const query = req.body.query;
    const author = req.body.author;

    let searches = await Client.songs.search(`${query} ${author}`);

    let songInfo = searches[0];
    let lyrics = await songInfo.lyrics();

    rep.send({
      id: songInfo.id,
      url: songInfo.url,
      image: songInfo.image,
      lyrics: lyrics,
      provider: "Genius",
    });
  });

  /**
   * Get a music lyrics from deezer
   * @body {string} trackId The id of the music
   * @body {string} auth The token to make the request
   */
  fastify.post("/deezer", async (req, rep) => {
    const trackId = req.body.trackId;
    const auth = req.body.auth;

    let res = await axios({
      method: "POST",
      url: "https://pipe.deezer.com/api",
      headers: {
        accept: "*/*",
        "accept-language": "en-GB",
        authorization: `Bearer ${auth}`,
        "content-type": "application/json",
        Referer: "https://www.deezer.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
      },
      data: {
        operationName: "SynchronizedTrackLyrics",
        query:
          "query SynchronizedTrackLyrics($trackId: String!) {\n  track(trackId: $trackId) {\n    ...SynchronizedTrackLyrics\n    __typename\n  }\n}\n\nfragment SynchronizedTrackLyrics on Track {\n  id\n  lyrics {\n    ...Lyrics\n    __typename\n  }\n  album {\n    cover {\n      small: urls(pictureRequest: {width: 100, height: 100})\n      medium: urls(pictureRequest: {width: 264, height: 264})\n      large: urls(pictureRequest: {width: 800, height: 800})\n      explicitStatus\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment Lyrics on Lyrics {\n  id\n  copyright\n  text\n  writers\n  synchronizedLines {\n    ...LyricsSynchronizedLines\n    __typename\n  }\n  __typename\n}\n\nfragment LyricsSynchronizedLines on LyricsSynchronizedLine {\n  lrcTimestamp\n  line\n  lineTranslated\n  milliseconds\n  duration\n  __typename\n}\n",
        variables: {
          trackId: trackId,
        },
      },
    });

    rep.send(res.data.data.track);
  });
}

module.exports = routes;

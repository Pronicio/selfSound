import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => {
        return {
            currentMusic: JSON.parse(localStorage.getItem('track')) || {
                trackId: null,
                videoId: null,
                title: null,
                artist: {
                    id: null,
                    name: null,
                },
                album: {
                    id: null,
                    cover: {
                        big: null,
                        xl: null,
                    },
                }
            },
            controls: {
                volume: localStorage.getItem('volume') || "100",
                repeat_mode: false
            },
            queue: [],
            cache_queue: []
        }
    }
})

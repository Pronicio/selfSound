import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => ({
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
            shuffle: false,
            repeat_mode: false
        },
        queue: [],
        shuffle_cache_queue: [],
        cache_queue: []
    }),
    actions: {
        clearAllQueues() {
            this.queue = [];
            this.cache_queue = [];
            this.shuffle_cache_queue = [];
        },
        shuffleQueue() {
            for (let i = this.queue.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
            }
        }
    }
})

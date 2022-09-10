import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => ({
        lang: localStorage.getItem('lang') || navigator.language.trim().split(/-|_/)[0],
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
            shuffle: localStorage.getItem('shuffle') === 'true' || false,
            repeat_mode: localStorage.getItem('repeat_mode') === 'true' || false
        },
        queue: JSON.parse(localStorage.getItem('queue'))?.queue || [],
        shuffle_cache_queue: [],
        cache_queue: []
    }),
    actions: {
        saveControls() {
            localStorage.setItem('shuffle', this.controls.shuffle)
            localStorage.setItem('repeat_mode', this.controls.repeat_mode)
        },
        saveQueue() {
            const toSave = {
                queue: this.queue
            }
            localStorage.setItem('queue', JSON.stringify(toSave))
        },
        clearAllQueues() {
            this.queue = [];
            this.cache_queue = [];
            this.shuffle_cache_queue = [];
        },
        shuffleQueue() {
            for (let i = this.queue.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [ this.queue[i], this.queue[j] ] = [ this.queue[j], this.queue[i] ];
            }
        }
    }
})

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const constants_1 = require("./constants");
const get_ctx_1 = require("./get-ctx");
class SoundLoader {
    constructor() {
        this.cache = {};
    }
    load(url) {
        const cache = this.cache[url];
        if (cache) {
            return Promise.resolve(cache);
        }
        const ctx = get_ctx_1.getCtx();
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = () => {
                reject(new TypeError('Local request failed'));
            };
            xhr.open('GET', url);
            xhr.send(null);
        })
            .then(res => ctx.decodeAudioData(res))
            .then(audioBuffer => {
            const c0 = audioBuffer.getChannelData(0);
            const c1 = audioBuffer.numberOfChannels === 2
                ? audioBuffer.getChannelData(1)
                : c0;
            const array = new Uint8Array(constants_1.SAMPLE_WIDTH * constants_1.SAMPLE_HEIGHT * 4);
            for (let i = 0; i < c0.length; i++) {
                const off = i * 4;
                if (off + 3 >= array.length) {
                    break;
                }
                const l = c0[i] * 32768 + 32768;
                const r = c1[i] * 32768 + 32768;
                array[off] = l / 256;
                array[off + 1] = l % 256;
                array[off + 2] = r / 256;
                array[off + 3] = r % 256;
            }
            const texture = new THREE.DataTexture(array, constants_1.SAMPLE_WIDTH, constants_1.SAMPLE_HEIGHT, THREE.RGBAFormat);
            texture.needsUpdate = true;
            this.cache[url] = texture;
            return texture;
        });
    }
    unload(url) {
        this.cache[url] = null;
    }
}
exports.default = SoundLoader;
//# sourceMappingURL=sound-loader.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
class VideoLoader {
    constructor() {
        this.cache = {};
    }
    load(name, url, speed) {
        const cache = this.cache[url];
        if (cache) {
            cache.video.playbackRate = speed;
            return cache.texture;
        }
        const video = document.createElement('video');
        document.body.appendChild(video);
        video.classList.add('veda-video-source');
        video.style.position = 'fixed';
        video.style.top = '-99999px';
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playbackRate = speed;
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;
        this.cache[url] = { name, video, texture };
        return texture;
    }
    unload(url) {
        const cache = this.cache[url];
        if (cache) {
            document.body.removeChild(cache.video);
        }
        this.cache[url] = null;
    }
}
exports.default = VideoLoader;
//# sourceMappingURL=video-loader.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
class GifLoader {
    constructor() {
        this.cache = {};
    }
    update() {
        Object.keys(this.cache).forEach(k => {
            const cache = this.cache[k];
            if (cache) {
                cache.texture.needsUpdate = true;
            }
        });
    }
    load(name, url) {
        const cache = this.cache[url];
        if (cache) {
            return cache.texture;
        }
        const img = document.createElement('img');
        document.body.appendChild(img);
        img.classList.add('veda-video-source');
        img.style.position = 'fixed';
        img.style.top = '99.99999%';
        img.style.width = '1px';
        img.style.height = '1px';
        img.src = url;
        const texture = new THREE.Texture(img);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        this.cache[url] = { name, img, texture };
        return texture;
    }
    unload(url) {
        const cache = this.cache[url];
        if (cache) {
            document.body.removeChild(cache.img);
        }
        this.cache[url] = null;
    }
}
exports.default = GifLoader;
//# sourceMappingURL=gif-loader.js.map
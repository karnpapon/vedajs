import * as THREE from 'three';

interface ICache {
    name: string;
    video: HTMLVideoElement;
    texture: THREE.VideoTexture;
}

export default class VideoLoader {
    private cache: { [url: string]: ICache | null } = {};

    load(name: string, url: string, speed: number): THREE.VideoTexture {
        const cache = this.cache[url];
        if (cache) {
            cache.video.playbackRate = speed;
            return cache.texture;
        }

        const video = document.createElement('video');
        (document.body as any).appendChild(video);

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

    unload(url: string): void {
        const cache = this.cache[url];
        if (cache) {
            (document.body as any).removeChild(cache.video);
        }
        this.cache[url] = null;
    }
}

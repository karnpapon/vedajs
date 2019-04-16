import * as THREE from 'three';
export default class VideoLoader {
    private cache;
    load(name: string, url: string, speed: number): THREE.VideoTexture;
    unload(url: string): void;
}

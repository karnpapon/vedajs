import * as THREE from 'three';
export default class GifLoader {
    private cache;
    update(): void;
    load(name: string, url: string): THREE.Texture;
    unload(url: string): void;
}

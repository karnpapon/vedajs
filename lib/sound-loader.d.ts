import * as THREE from 'three';
export default class SoundLoader {
    private cache;
    load(url: string): Promise<THREE.DataTexture>;
    unload(url: string): void;
}

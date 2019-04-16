import * as THREE from 'three';
export default class GamepadLoader {
    texture: THREE.DataTexture;
    isEnabled: boolean;
    private array;
    private isConnected;
    constructor();
    update(): void;
    enable(): void;
    disable(): void;
}

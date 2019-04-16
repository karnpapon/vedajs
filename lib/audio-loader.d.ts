import * as THREE from 'three';
export interface IAudioOptions {
    fftSize?: number;
    fftSmoothingTimeConstant?: number;
}
export default class AudioLoader {
    spectrum: THREE.DataTexture;
    samples: THREE.DataTexture;
    isPlaying: boolean;
    isEnabled: boolean;
    private ctx;
    private gain;
    private analyser;
    private input;
    private spectrumArray;
    private samplesArray;
    private stream;
    private willPlay;
    constructor(rcOpt: IAudioOptions);
    enable(): void;
    disable(): void;
    update(): void;
    getVolume(): number;
    setFftSize(fftSize: number): void;
    setFftSmoothingTimeConstant(fftSmoothingTimeConstant: number): void;
}

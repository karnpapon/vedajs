import { IVedaOptions, UniformType, IShader } from './constants';
export default class Veda {
    private pixelRatio;
    private frameskip;
    private isPlaying;
    private start;
    private frame;
    private isRecording;
    private passes;
    private renderer;
    private canvas;
    private targets;
    private textureLoader;
    private audioLoader;
    private cameraLoader;
    private gamepadLoader;
    private keyLoader;
    private midiLoader;
    private videoLoader;
    private gifLoader;
    private soundLoader;
    private modelLoader;
    private uniforms;
    private soundRenderer;
    private vertexMode;
    constructor(rcOpt: IVedaOptions);
    setPixelRatio(pixelRatio: number): void;
    setFrameskip(frameskip: number): void;
    setVertexCount(count: number): void;
    setVertexMode(mode: string): void;
    setFftSize(fftSize: number): void;
    setFftSmoothingTimeConstant(fftSmoothingTimeConstant: number): void;
    setSoundLength(length: number): void;
    resetTime(): void;
    setCanvas(canvas: HTMLCanvasElement): void;
    private createPlane;
    private createMesh;
    private createRenderPass;
    loadFragmentShader(fs: string): void;
    loadVertexShader(vs: string): void;
    loadShader(shader: IShader): Promise<void>;
    loadTexture(name: string, textureUrl: string, speed?: number): Promise<void>;
    unloadTexture(name: string, textureUrl: string, remove: boolean): void;
    setUniform(name: string, type: UniformType, value: any): void;
    private mousemove;
    private mousedown;
    private mouseup;
    resize: (width: number, height: number) => void;
    animate: () => void;
    loadSoundShader(fs: string): void;
    playSound(): void;
    stopSound(): void;
    play(): void;
    stop(): void;
    private render;
    toggleAudio(flag: boolean): void;
    toggleMidi(flag: boolean): void;
    toggleCamera(flag: boolean): void;
    toggleKeyboard(flag: boolean): void;
    toggleGamepad(flag: boolean): void;
    startRecording(): void;
    stopRecording(): void;
}
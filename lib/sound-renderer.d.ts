import { IUniforms } from './constants';
export default class SoundRenderer {
    private target;
    private scene;
    private camera;
    private renderer;
    private wctx;
    private uniforms;
    private soundUniforms;
    private audioBuffer;
    private ctx;
    private node;
    private soundLength;
    private isPlaying;
    private start;
    private renderingId;
    constructor(uniforms: IUniforms);
    setLength(length: number): void;
    loadShader(fs: string): void;
    play(): void;
    stop(): void;
    render: () => void;
    private createNode;
}

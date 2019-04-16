export declare const DEFAULT_VERTEX_SHADER = "\nprecision mediump float;\nvarying vec2 vUv;\nvarying float vObjectId;\nvarying vec4 v_color;\nvoid main() {\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
export declare const DEFAULT_FRAGMENT_SHADER = "\nprecision mediump float;\nvarying vec2 vUv;\nvarying float vObjectId;\nvarying vec4 v_color;\nvoid main() {\n    gl_FragColor = v_color;\n}\n";
export declare const SAMPLE_WIDTH = 1280;
export declare const SAMPLE_HEIGHT = 720;
export declare type UniformType = '1i' | '1f' | '2f' | '3f' | '1iv' | '3iv' | '1fv' | '2fv' | '3fv' | '4fv' | 'Matrix3fv' | 'Matric4fv' | 'i' | 'f' | 'v2' | 'v3' | 'v4' | 'c' | 'm4' | 't' | 'iv1' | 'iv' | 'fv1' | 'fv' | 'v2v' | 'v3v' | 'v4v' | 'm4v' | 'tv';
export interface IVedaOptions {
    pixelRatio?: number;
    frameskip?: number;
    vertexMode?: string;
    vertexCount?: number;
    fftSize?: number;
    fftSmoothingTimeConstant?: number;
}
export declare const DEFAULT_VEDA_OPTIONS: {
    frameskip: number;
    pixelRatio: number;
    vertexCount: number;
    vertexMode: string;
};
export interface IPassModel {
    PATH: string;
    MATERIAL?: string;
}
export interface IPass {
    MODEL?: IPassModel;
    TARGET?: string;
    vs?: string;
    fs?: string;
    FLOAT?: boolean;
    WIDTH?: string;
    HEIGHT?: string;
    BLEND?: BlendMode;
}
export declare type BlendMode = 'NO' | 'NORMAL' | 'ADD' | 'SUB' | 'MUL';
export declare type IShader = IPass | IPass[];
export interface IUniforms {
    [key: string]: {
        type: string;
        value: any;
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_VERTEX_SHADER = `
precision mediump float;
varying vec2 vUv;
varying float vObjectId;
varying vec4 v_color;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
exports.DEFAULT_FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUv;
varying float vObjectId;
varying vec4 v_color;
void main() {
    gl_FragColor = v_color;
}
`;
exports.SAMPLE_WIDTH = 1280;
exports.SAMPLE_HEIGHT = 720;
exports.DEFAULT_VEDA_OPTIONS = {
    frameskip: 1,
    pixelRatio: 1,
    vertexCount: 3000,
    vertexMode: 'TRIANGLES',
};
//# sourceMappingURL=constants.js.map
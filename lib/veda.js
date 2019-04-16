"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const audio_loader_1 = require("./audio-loader");
const camera_loader_1 = require("./camera-loader");
const gamepad_loader_1 = require("./gamepad-loader");
const gif_loader_1 = require("./gif-loader");
const key_loader_1 = require("./key-loader");
const midi_loader_1 = require("./midi-loader");
const model_loader_1 = require("./model-loader");
const sound_loader_1 = require("./sound-loader");
const sound_renderer_1 = require("./sound-renderer");
const video_loader_1 = require("./video-loader");
const isVideo = require('is-video');
const constants_1 = require("./constants");
const isGif = (file) => file.match(/\.gif$/i);
const isSound = (file) => file.match(/\.(mp3|wav)$/i);
const createTarget = (width, height, textureType) => {
    return new THREE.WebGLRenderTarget(width, height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: textureType,
    });
};
const blendModeToConst = (blend) => {
    switch (blend) {
        case 'NO':
            return THREE.NoBlending;
        case 'NORMAL':
            return THREE.NormalBlending;
        case 'ADD':
            return THREE.AdditiveBlending;
        case 'SUB':
            return THREE.SubtractiveBlending;
        case 'MUL':
            return THREE.MultiplyBlending;
        default:
            return THREE.NormalBlending;
    }
};
class Veda {
    constructor(rcOpt) {
        this.isPlaying = false;
        this.frame = 0;
        this.isRecording = false;
        this.renderer = null;
        this.canvas = null;
        this.mousemove = (e) => {
            if (!this.canvas) {
                return;
            }
            const rect = this.canvas.getBoundingClientRect();
            const root = document.documentElement;
            if (root) {
                const left = rect.top + root.scrollLeft;
                const top = rect.top + root.scrollTop;
                this.uniforms.mouse.value.x =
                    (e.pageX - left) / this.canvas.offsetWidth;
                this.uniforms.mouse.value.y =
                    1 - (e.pageY - top) / this.canvas.offsetHeight;
            }
        };
        this.mousedown = (e) => {
            const b = e.buttons;
            this.uniforms.mouseButtons.value = new THREE.Vector3((b >> 0) & 1, (b >> 1) & 1, (b >> 2) & 1);
        };
        this.mouseup = this.mousedown;
        this.resize = (width, height) => {
            if (!this.renderer) {
                return;
            }
            this.renderer.setSize(width, height);
            const [bufferWidth, bufferHeight] = [
                width / this.pixelRatio,
                height / this.pixelRatio,
            ];
            this.passes.forEach(p => {
                if (p.target) {
                    p.target.targets.forEach(t => t.setSize(bufferWidth, bufferHeight));
                }
            });
            this.targets.forEach(t => t.setSize(bufferWidth, bufferHeight));
            this.uniforms.resolution.value.x = bufferWidth;
            this.uniforms.resolution.value.y = bufferHeight;
        };
        this.animate = () => {
            this.frame++;
            if (!this.isPlaying) {
                return;
            }
            requestAnimationFrame(this.animate);
            if (this.frame % this.frameskip === 0) {
                this.render();
            }
        };
        const rc = Object.assign({}, constants_1.DEFAULT_VEDA_OPTIONS, rcOpt);
        this.pixelRatio = rc.pixelRatio;
        this.frameskip = rc.frameskip;
        this.vertexMode = rc.vertexMode;
        this.passes = [];
        this.targets = [
            new THREE.WebGLRenderTarget(0, 0, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat,
            }),
            new THREE.WebGLRenderTarget(0, 0, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat,
            }),
        ];
        THREE.ImageUtils.crossOrigin = '*';
        this.audioLoader = new audio_loader_1.default(rc);
        this.cameraLoader = new camera_loader_1.default();
        this.gamepadLoader = new gamepad_loader_1.default();
        this.keyLoader = new key_loader_1.default();
        this.midiLoader = new midi_loader_1.default();
        this.videoLoader = new video_loader_1.default();
        this.gifLoader = new gif_loader_1.default();
        this.soundLoader = new sound_loader_1.default();
        this.modelLoader = new model_loader_1.default();
        this.start = Date.now();
        this.uniforms = THREE.UniformsUtils.merge([
            {
                FRAMEINDEX: { type: 'i', value: 0 },
                PASSINDEX: { type: 'i', value: 0 },
                backbuffer: { type: 't', value: new THREE.Texture() },
                mouse: { type: 'v2', value: new THREE.Vector2() },
                mouseButtons: { type: 'v3', value: new THREE.Vector3() },
                resolution: { type: 'v2', value: new THREE.Vector2() },
                time: { type: 'f', value: 0.0 },
                vertexCount: { type: 'f', value: rc.vertexCount },
            },
            THREE.UniformsLib.common,
        ]);
        this.soundRenderer = new sound_renderer_1.default(this.uniforms);
        this.textureLoader = new THREE.TextureLoader();
    }
    setPixelRatio(pixelRatio) {
        if (!this.canvas || !this.renderer) {
            return;
        }
        this.pixelRatio = pixelRatio;
        this.renderer.setPixelRatio(1 / pixelRatio);
        this.resize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    }
    setFrameskip(frameskip) {
        this.frameskip = frameskip;
    }
    setVertexCount(count) {
        this.uniforms.vertexCount.value = count;
    }
    setVertexMode(mode) {
        this.vertexMode = mode;
    }
    setFftSize(fftSize) {
        this.audioLoader.setFftSize(fftSize);
    }
    setFftSmoothingTimeConstant(fftSmoothingTimeConstant) {
        this.audioLoader.setFftSmoothingTimeConstant(fftSmoothingTimeConstant);
    }
    setSoundLength(length) {
        this.soundRenderer.setLength(length);
    }
    resetTime() {
        this.start = Date.now();
        this.uniforms.time.value = 0;
    }
    setCanvas(canvas) {
        if (this.canvas) {
            window.removeEventListener('mousemove', this.mousemove);
            window.removeEventListener('mousedown', this.mousedown);
            window.removeEventListener('mouseup', this.mouseup);
        }
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            preserveDrawingBuffer: true,
        });
        this.renderer.setPixelRatio(1 / this.pixelRatio);
        this.resize(canvas.offsetWidth, canvas.offsetHeight);
        window.addEventListener('mousemove', this.mousemove);
        window.addEventListener('mousedown', this.mousedown);
        window.addEventListener('mouseup', this.mouseup);
        this.frame = 0;
        this.animate();
    }
    createPlane(pass) {
        let plane;
        if (pass.vs) {
            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array(this.uniforms.vertexCount.value * 3);
            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            const vertexCount = this.uniforms.vertexCount.value;
            const vertexIds = new Float32Array(vertexCount);
            vertexIds.forEach((_, i) => {
                vertexIds[i] = i;
            });
            geometry.addAttribute('vertexId', new THREE.BufferAttribute(vertexIds, 1));
            const material = new THREE.RawShaderMaterial({
                vertexShader: pass.vs,
                fragmentShader: pass.fs || constants_1.DEFAULT_FRAGMENT_SHADER,
                blending: blendModeToConst(pass.BLEND),
                depthTest: false,
                transparent: true,
                uniforms: this.uniforms,
            });
            material.side = THREE.DoubleSide;
            material.extensions = {
                derivatives: true,
                drawBuffers: true,
                fragDepth: true,
                shaderTextureLOD: true,
            };
            if (this.vertexMode === 'POINTS') {
                plane = new THREE.Points(geometry, material);
            }
            else if (this.vertexMode === 'LINE_LOOP') {
                plane = new THREE.LineLoop(geometry, material);
            }
            else if (this.vertexMode === 'LINE_STRIP') {
                plane = new THREE.Line(geometry, material);
            }
            else if (this.vertexMode === 'LINES') {
                plane = new THREE.LineSegments(geometry, material);
            }
            else if (this.vertexMode === 'TRI_STRIP') {
                plane = new THREE.Mesh(geometry, material);
                plane.setDrawMode(THREE.TriangleStripDrawMode);
            }
            else if (this.vertexMode === 'TRI_FAN') {
                plane = new THREE.Mesh(geometry, material);
                plane.setDrawMode(THREE.TriangleFanDrawMode);
            }
            else {
                plane = new THREE.Mesh(geometry, material);
            }
        }
        else {
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.ShaderMaterial({
                vertexShader: constants_1.DEFAULT_VERTEX_SHADER,
                fragmentShader: pass.fs,
                uniforms: this.uniforms,
            });
            material.extensions = {
                derivatives: true,
                drawBuffers: true,
                fragDepth: true,
                shaderTextureLOD: true,
            };
            plane = new THREE.Mesh(geometry, material);
        }
        return plane;
    }
    createMesh(obj, materialId, vertexIdOffset, pass) {
        let plane;
        if (pass.vs) {
            const geometry = obj.geometry;
            const vertexCount = geometry.getAttribute('position').count;
            const vertexIds = new Float32Array(vertexCount);
            vertexIds.forEach((_, i) => {
                vertexIds[i] = i + vertexIdOffset;
            });
            geometry.addAttribute('vertexId', new THREE.BufferAttribute(vertexIds, 1));
            const material = new THREE.RawShaderMaterial({
                vertexShader: pass.vs,
                fragmentShader: pass.fs || constants_1.DEFAULT_FRAGMENT_SHADER,
                blending: blendModeToConst(pass.BLEND),
                depthTest: true,
                transparent: true,
                uniforms: this.uniforms,
            });
            material.side = THREE.DoubleSide;
            material.extensions = {
                derivatives: true,
                drawBuffers: true,
                fragDepth: true,
                shaderTextureLOD: true,
            };
            const objectIds = new Float32Array(vertexCount);
            objectIds.fill(materialId);
            geometry.addAttribute('objectId', new THREE.BufferAttribute(objectIds, 1));
            if (this.vertexMode === 'POINTS') {
                plane = new THREE.Points(geometry, material);
            }
            else if (this.vertexMode === 'LINE_LOOP') {
                plane = new THREE.LineLoop(geometry, material);
            }
            else if (this.vertexMode === 'LINE_STRIP') {
                plane = new THREE.Line(geometry, material);
            }
            else if (this.vertexMode === 'LINES') {
                plane = new THREE.LineSegments(geometry, material);
            }
            else if (this.vertexMode === 'TRI_STRIP') {
                plane = new THREE.Mesh(geometry, material);
                plane.setDrawMode(THREE.TriangleStripDrawMode);
            }
            else if (this.vertexMode === 'TRI_FAN') {
                plane = new THREE.Mesh(geometry, material);
                plane.setDrawMode(THREE.TriangleFanDrawMode);
            }
            else {
                plane = new THREE.Mesh(geometry, material);
            }
        }
        else {
            const geometry = obj.geometry;
            const material = new THREE.ShaderMaterial({
                vertexShader: constants_1.DEFAULT_VERTEX_SHADER,
                fragmentShader: pass.fs,
                uniforms: this.uniforms,
            });
            material.extensions = {
                derivatives: true,
                drawBuffers: true,
                fragDepth: true,
                shaderTextureLOD: true,
            };
            plane = new THREE.Mesh(geometry, material);
        }
        return plane;
    }
    createRenderPass(pass) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canvas) {
                throw new Error('Call setCanvas() before loading shaders');
            }
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
            camera.position.set(0, 0, 1);
            camera.lookAt(scene.position);
            const materials = [];
            if (pass.MODEL && pass.MODEL.PATH) {
                const obj = yield this.modelLoader.load(pass.MODEL);
                let materialId = 0;
                let vertexId = 0;
                obj.traverse(o => {
                    if (o instanceof THREE.Mesh &&
                        o.geometry instanceof THREE.BufferGeometry) {
                        const mesh = this.createMesh(o, materialId, vertexId, pass);
                        scene.add(mesh);
                        if (o.material && o.material.map) {
                            materials[materialId] = o.material.map;
                        }
                        materialId++;
                        vertexId += mesh.geometry.attributes.vertexId
                            .length;
                    }
                });
            }
            else {
                const plane = this.createPlane(pass);
                scene.add(plane);
            }
            let target = null;
            if (pass.TARGET) {
                const targetName = pass.TARGET;
                const textureType = pass.FLOAT
                    ? THREE.FloatType
                    : THREE.UnsignedByteType;
                let getWidth = ($WIDTH, _) => $WIDTH;
                let getHeight = (_, $HEIGHT) => $HEIGHT;
                if (pass.WIDTH) {
                    try {
                        getWidth = new Function('$WIDTH', '$HEIGHT', `return ${pass.WIDTH}`);
                    }
                    catch (e) { }
                }
                if (pass.HEIGHT) {
                    try {
                        getHeight = new Function('$WIDTH', '$HEIGHT', `return ${pass.HEIGHT}`);
                    }
                    catch (e) { }
                }
                const w = this.canvas.offsetWidth / this.pixelRatio;
                const h = this.canvas.offsetHeight / this.pixelRatio;
                target = {
                    name: targetName,
                    getWidth,
                    getHeight,
                    targets: [
                        createTarget(w, h, textureType),
                        createTarget(w, h, textureType),
                    ],
                };
                this.uniforms[targetName] = {
                    type: 't',
                    value: target.targets[0].texture,
                };
            }
            return { scene, camera, target, materials };
        });
    }
    loadFragmentShader(fs) {
        this.loadShader([{ fs }]);
    }
    loadVertexShader(vs) {
        this.loadShader([{ vs }]);
    }
    loadShader(shader) {
        return __awaiter(this, void 0, void 0, function* () {
            let passes;
            if (shader instanceof Array) {
                passes = shader;
            }
            else {
                passes = [shader];
            }
            this.passes.forEach(pass => {
                const target = pass.target;
                if (target) {
                    target.targets[0].texture.dispose();
                    target.targets[1].texture.dispose();
                }
            });
            this.passes = yield Promise.all(passes.map(pass => {
                if (!pass.fs && !pass.vs) {
                    throw new TypeError('Veda.loadShader: Invalid argument. Shaders must have fs or vs property.');
                }
                return this.createRenderPass(pass);
            }));
            this.uniforms.FRAMEINDEX.value = 0;
        });
    }
    loadTexture(name, textureUrl, speed = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let texture;
            if (isVideo(textureUrl)) {
                texture = this.videoLoader.load(name, textureUrl, speed);
            }
            else if (isGif(textureUrl)) {
                texture = this.gifLoader.load(name, textureUrl);
            }
            else if (isSound(textureUrl)) {
                texture = yield this.soundLoader.load(textureUrl);
            }
            else {
                texture = this.textureLoader.load(textureUrl);
            }
            this.uniforms[name] = {
                type: 't',
                value: texture,
            };
        });
    }
    unloadTexture(name, textureUrl, remove) {
        const texture = this.uniforms[name];
        texture.value.dispose();
        if (remove && isVideo(textureUrl)) {
            this.videoLoader.unload(textureUrl);
        }
        if (remove && isGif(textureUrl)) {
            this.gifLoader.unload(textureUrl);
        }
        if (remove && isSound(textureUrl)) {
            this.soundLoader.unload(textureUrl);
        }
    }
    setUniform(name, type, value) {
        this.uniforms[name] = { type, value };
    }
    loadSoundShader(fs) {
        this.soundRenderer.loadShader(fs);
    }
    playSound() {
        this.soundRenderer.play();
    }
    stopSound() {
        this.soundRenderer.stop();
    }
    play() {
        this.isPlaying = true;
        this.animate();
    }
    stop() {
        this.isPlaying = false;
        this.audioLoader.disable();
        this.cameraLoader.disable();
        this.keyLoader.disable();
        this.midiLoader.disable();
        this.gamepadLoader.disable();
    }
    render() {
        if (!this.canvas || !this.renderer) {
            return;
        }
        const canvas = this.canvas;
        const renderer = this.renderer;
        if (this.isRecording) {
            const dt = (1 / 60) * this.frameskip;
            const relTime = this.uniforms.time.value + dt;
            this.uniforms.time.value = relTime;
            this.start = Date.now() - relTime * 1000;
        }
        else {
            this.uniforms.time.value = (Date.now() - this.start) / 1000;
        }
        this.targets = [this.targets[1], this.targets[0]];
        this.uniforms.backbuffer.value = this.targets[0].texture;
        this.gifLoader.update();
        if (this.audioLoader.isEnabled) {
            this.audioLoader.update();
            this.uniforms.volume.value = this.audioLoader.getVolume();
        }
        if (this.gamepadLoader.isEnabled) {
            this.gamepadLoader.update();
        }
        this.passes.forEach((pass, i) => {
            this.uniforms.PASSINDEX.value = i;
            pass.materials.forEach((m, objectId) => {
                if (m) {
                    this.uniforms[`material${objectId}`] = {
                        type: 't',
                        value: m,
                    };
                    m.needsUpdate = true;
                }
            });
            const target = pass.target;
            if (target) {
                const $width = canvas.offsetWidth / this.pixelRatio;
                const $height = canvas.offsetHeight / this.pixelRatio;
                target.targets[1].setSize(target.getWidth($width, $height), target.getHeight($width, $height));
                renderer.render(pass.scene, pass.camera, target.targets[1], true);
                target.targets = [target.targets[1], target.targets[0]];
                this.uniforms[target.name].value = target.targets[0].texture;
            }
            else {
                renderer.render(pass.scene, pass.camera, undefined);
            }
        });
        const lastPass = this.passes[this.passes.length - 1];
        if (lastPass) {
            if (lastPass.target) {
                renderer.render(lastPass.scene, lastPass.camera, undefined);
            }
            renderer.render(lastPass.scene, lastPass.camera, this.targets[1], true);
        }
        this.uniforms.FRAMEINDEX.value++;
    }
    toggleAudio(flag) {
        if (flag) {
            this.audioLoader.enable();
            this.uniforms = Object.assign({}, this.uniforms, { volume: { type: 'f', value: 0 }, spectrum: { type: 't', value: this.audioLoader.spectrum }, samples: { type: 't', value: this.audioLoader.samples } });
        }
        else if (this.uniforms.spectrum) {
            this.uniforms.spectrum.value.dispose();
            this.uniforms.samples.value.dispose();
            this.audioLoader.disable();
        }
    }
    toggleMidi(flag) {
        if (flag) {
            this.midiLoader.enable();
            this.uniforms = Object.assign({}, this.uniforms, { midi: { type: 't', value: this.midiLoader.midiTexture }, note: { type: 't', value: this.midiLoader.noteTexture } });
        }
        else if (this.uniforms.midi) {
            this.uniforms.midi.value.dispose();
            this.uniforms.note.value.dispose();
            this.midiLoader.disable();
        }
    }
    toggleCamera(flag) {
        if (flag) {
            this.cameraLoader.enable();
            this.uniforms = Object.assign({}, this.uniforms, { camera: { type: 't', value: this.cameraLoader.texture } });
        }
        else {
            this.cameraLoader.disable();
        }
    }
    toggleKeyboard(flag) {
        if (flag) {
            this.keyLoader.enable();
            this.uniforms = Object.assign({}, this.uniforms, { key: { type: 't', value: this.keyLoader.texture } });
        }
        else {
            this.keyLoader.disable();
        }
    }
    toggleGamepad(flag) {
        if (flag) {
            this.gamepadLoader.enable();
            this.uniforms = Object.assign({}, this.uniforms, { gamepad: { type: 't', value: this.gamepadLoader.texture } });
        }
        else {
            this.gamepadLoader.disable();
        }
    }
    startRecording() {
        this.isRecording = true;
    }
    stopRecording() {
        this.isRecording = false;
    }
}
exports.default = Veda;
//# sourceMappingURL=veda.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const get_ctx_1 = require("./get-ctx");
const DEFAULT_AUDIO_OPTIONS = {
    fftSize: 2048,
    fftSmoothingTimeConstant: 0.8,
};
class AudioLoader {
    constructor(rcOpt) {
        this.isPlaying = false;
        this.isEnabled = false;
        this.input = null;
        this.willPlay = null;
        const rc = Object.assign({}, DEFAULT_AUDIO_OPTIONS, rcOpt);
        this.ctx = get_ctx_1.getCtx();
        this.gain = this.ctx.createGain();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.connect(this.gain);
        this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.gain.connect(this.ctx.destination);
        this.analyser.fftSize = rc.fftSize;
        this.analyser.smoothingTimeConstant = rc.fftSmoothingTimeConstant;
        this.spectrumArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.samplesArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.spectrum = new THREE.DataTexture(this.spectrumArray, this.analyser.frequencyBinCount, 1, THREE.LuminanceFormat, THREE.UnsignedByteType);
        this.samples = new THREE.DataTexture(this.samplesArray, this.analyser.frequencyBinCount, 1, THREE.LuminanceFormat, THREE.UnsignedByteType);
    }
    enable() {
        this.willPlay = new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                this.stream = stream;
                this.input = this.ctx.createMediaStreamSource(stream);
                this.input.connect(this.analyser);
                this.isEnabled = true;
                resolve();
            }, err => {
                console.error(err);
                reject();
            });
        });
    }
    disable() {
        if (this.isEnabled && this.willPlay) {
            this.willPlay.then(() => {
                this.isEnabled = false;
                this.input && this.input.disconnect();
                this.stream
                    .getTracks()
                    .forEach((t) => t.stop());
            });
        }
    }
    update() {
        this.analyser.getByteFrequencyData(this.spectrumArray);
        this.analyser.getByteTimeDomainData(this.samplesArray);
        this.spectrum.needsUpdate = true;
        this.samples.needsUpdate = true;
    }
    getVolume() {
        let v = 0;
        this.samplesArray.forEach(x => {
            v += Math.pow(x / 128 - 1, 2);
        });
        return Math.sqrt(v / this.samplesArray.length);
    }
    setFftSize(fftSize) {
        this.analyser.fftSize = fftSize;
        this.spectrumArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.samplesArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.spectrum.image.data = this.spectrumArray;
        this.spectrum.image.width = this.analyser.frequencyBinCount;
        this.samples.image.data = this.samplesArray;
        this.samples.image.width = this.analyser.frequencyBinCount;
    }
    setFftSmoothingTimeConstant(fftSmoothingTimeConstant) {
        this.analyser.smoothingTimeConstant = fftSmoothingTimeConstant;
    }
}
exports.default = AudioLoader;
//# sourceMappingURL=audio-loader.js.map
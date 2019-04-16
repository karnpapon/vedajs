"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
class CameraLoader {
    constructor() {
        this.willPlay = null;
        this.video = document.createElement('video');
        this.video.classList.add('veda-video-source');
        this.video.loop = true;
        this.video.muted = true;
        this.video.style.position = 'fixed';
        this.video.style.top = '99.9%';
        this.video.style.width = '1px';
        this.video.style.height = '1px';
        document.body.appendChild(this.video);
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.format = THREE.RGBFormat;
    }
    enable() {
        this.willPlay = new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                this.stream = stream;
                this.video.srcObject = stream;
                this.video.play();
                resolve();
            }, err => {
                console.error(err);
                reject();
            });
        });
    }
    disable() {
        this.texture.dispose();
        if (this.willPlay) {
            this.willPlay.then(() => {
                this.stream
                    .getTracks()
                    .forEach((t) => t.stop());
            });
        }
    }
}
exports.default = CameraLoader;
//# sourceMappingURL=camera-loader.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
class KeyLoader {
    constructor() {
        this.onKeyDown = (e) => {
            if (e.keyCode === 27) {
                this.array.fill(0);
            }
            else {
                this.array[e.keyCode] = 255;
            }
            this.texture.needsUpdate = true;
        };
        this.onKeyUp = (e) => {
            this.array[e.keyCode] = 0;
            this.texture.needsUpdate = true;
        };
        this.array = new Uint8Array(256);
        this.texture = new THREE.DataTexture(this.array, 256, 1, THREE.LuminanceFormat, THREE.UnsignedByteType);
    }
    enable() {
        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    }
    disable() {
        this.texture.dispose();
        document.body.removeEventListener('keydown', this.onKeyDown);
        document.body.removeEventListener('keyup', this.onKeyUp);
    }
}
exports.default = KeyLoader;
//# sourceMappingURL=key-loader.js.map
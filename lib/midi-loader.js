"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
class MidiLoader {
    constructor() {
        this.isEnabled = false;
        this.onstatechange = (access) => {
            access.inputs.forEach(i => {
                i.onmidimessage = (m) => this.onmidimessage(m.data);
            });
        };
        this.onmidimessage = (midi) => {
            if (!this.isEnabled) {
                return;
            }
            const offset = midi[0] + midi[1] * 256;
            this.midiArray[offset] = midi[2];
            this.midiTexture.needsUpdate = true;
            if (0x90 <= midi[0] && midi[0] < 0xa0) {
                this.noteArray[midi[1]] = midi[2] * 2;
                this.noteTexture.needsUpdate = true;
            }
            if (0x80 <= midi[0] && midi[0] < 0x90) {
                this.noteArray[midi[1]] = 0;
                this.noteTexture.needsUpdate = true;
            }
        };
        this.midiArray = new Uint8Array(256 * 128);
        this.noteArray = new Uint8Array(128);
        this.midiTexture = new THREE.DataTexture(this.midiArray, 256, 128, THREE.LuminanceFormat, THREE.UnsignedByteType);
        this.noteTexture = new THREE.DataTexture(this.noteArray, 128, 1, THREE.LuminanceFormat, THREE.UnsignedByteType);
    }
    enable() {
        this.isEnabled = true;
        if (!navigator.requestMIDIAccess) {
            console.error("[VEDA] This browser doesn't support Web MIDI API.");
            return;
        }
        navigator
            .requestMIDIAccess({ sysex: false })
            .then((access) => {
            this.onstatechange(access);
            access.onstatechange = () => this.onstatechange(access);
        })
            .catch((e) => console.log('Failed to load MIDI API', e));
    }
    disable() {
        this.isEnabled = false;
    }
}
exports.default = MidiLoader;
//# sourceMappingURL=midi-loader.js.map
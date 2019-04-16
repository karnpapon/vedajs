/// <reference types="webmidi" />
import * as THREE from 'three';
export default class MidiLoader {
    midiTexture: THREE.DataTexture;
    noteTexture: THREE.DataTexture;
    private midiArray;
    private noteArray;
    private isEnabled;
    constructor();
    onstatechange: (access: WebMidi.MIDIAccess) => void;
    onmidimessage: (midi: number[]) => void;
    enable(): void;
    disable(): void;
}

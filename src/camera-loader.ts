import * as THREE from 'three';

export default class CameraLoader {
    texture: THREE.VideoTexture;
    private video: HTMLVideoElement;
    private stream: any;
    private willPlay: Promise<any> | null = null;

    constructor() {
        this.video = document.createElement('video');
        this.video.classList.add('veda-video-source');
        this.video.loop = true;
        this.video.muted = true;
        this.video.style.position = 'fixed';
        this.video.style.top = '99.9%';
        this.video.style.width = '1px';
        this.video.style.height = '1px';

        (document.body as any).appendChild(this.video);

        this.texture = new THREE.VideoTexture(this.video);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.format = THREE.RGBFormat;
    }

    enable() {
        this.willPlay = new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({ video: true }).then(
                (stream: MediaStream) => {
                    this.stream = stream;
                    this.video.srcObject = stream;
                    this.video.play();
                    resolve();
                },
                err => {
                    console.error(err);
                    reject();
                },
            );
        });
    }

    disable() {
        this.texture.dispose();
        if (this.willPlay) {
            this.willPlay.then(() => {
                this.stream
                    .getTracks()
                    .forEach((t: MediaStreamTrack) => t.stop());
            });
        }
    }
}

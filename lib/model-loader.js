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
require('three-obj-loader')(THREE);
const MTLLoader = require('three-mtl-loader');
const extractPaths = (url) => {
    const match = url.match(/^(.*\\)(.*)$/) || url.match(/^(.*\/)(.*)\/?$/);
    if (!match) {
        return null;
    }
    return {
        path: match[1],
        basename: match[2],
    };
};
class ModelLoader {
    constructor() {
        this.cache = {};
        this.objLoader = new THREE.OBJLoader();
        this.mtlLoader = new MTLLoader();
        this.objectLoader = new THREE.ObjectLoader();
        this.jsonLoader = new THREE.JSONLoader();
    }
    load(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = model.PATH;
            const key = `${model.PATH}:${model.MATERIAL || '_'}`;
            const cache = this.cache[key];
            if (cache) {
                return Promise.resolve(cache.obj);
            }
            let obj;
            if (/\.obj\/?$/.test(url)) {
                obj = yield this.loadObjAndMtl(model);
            }
            else if (/\.js(on)?\/?$/.test(url)) {
                obj = yield this.loadJson(model);
            }
            else {
                throw new TypeError('Unsupported model URL: ' + url);
            }
            obj = this.fixObj(obj);
            this.cache[url] = { url, obj };
            return obj;
        });
    }
    loadJson(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield Promise.race([
                new Promise((resolve, reject) => {
                    this.jsonLoader.load(model.PATH, (geometry, materials) => {
                        if (materials && Array.isArray(materials)) {
                            resolve(new THREE.Mesh(geometry, materials[0]));
                        }
                        else {
                            resolve(new THREE.Mesh(geometry));
                        }
                    }, undefined, reject);
                }),
                new Promise((resolve, reject) => {
                    this.objectLoader.load(model.PATH, resolve, undefined, reject);
                }),
                new Promise((_resolve, reject) => {
                    setTimeout(() => reject('Request Timeout'), 50000);
                }),
            ]);
            if (obj instanceof THREE.Mesh &&
                obj.geometry instanceof THREE.Geometry) {
                obj.geometry = new THREE.BufferGeometry().fromGeometry(obj.geometry);
            }
            const group = new THREE.Group();
            group.add(obj);
            return group;
        });
    }
    loadObjAndMtl(model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model.MATERIAL) {
                const materials = yield this.loadMtl(model.MATERIAL);
                materials.preload();
                this.objLoader.setMaterials(materials);
            }
            else {
                this.objLoader.setMaterials(null);
            }
            return this.loadObj(model.PATH);
        });
    }
    loadMtl(url) {
        const paths = extractPaths(url);
        if (paths === null) {
            return Promise.reject(new TypeError('Invalid URL: ' + url));
        }
        this.mtlLoader.setPath(paths.path);
        return new Promise((resolve, reject) => {
            this.mtlLoader.load(paths.basename, resolve, undefined, reject);
        });
    }
    loadObj(url) {
        return new Promise((resolve, reject) => {
            this.objLoader.load(url, resolve, undefined, reject);
        });
    }
    fixObj(obj) {
        let box = null;
        obj.traverse(o => {
            if (o instanceof THREE.Mesh &&
                o.geometry instanceof THREE.BufferGeometry) {
                o.geometry.computeBoundingBox();
                if (box === null) {
                    box = o.geometry.boundingBox;
                }
                else {
                    box.union(o.geometry.boundingBox);
                }
            }
        });
        if (box === null) {
            return obj;
        }
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);
        const scale = 1 / sphere.radius;
        const offset = sphere.center;
        obj.traverse(o => {
            if (o instanceof THREE.Mesh &&
                o.geometry instanceof THREE.BufferGeometry) {
                o.geometry.translate(-offset.x, -offset.y, -offset.z);
                o.geometry.scale(scale, scale, scale);
                o.updateMatrix();
            }
        });
        return obj;
    }
}
exports.default = ModelLoader;
//# sourceMappingURL=model-loader.js.map
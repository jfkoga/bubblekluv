
import * as THREE from './three.module.js';

/**
 * GLTFLoader
 * Adapted from three.js/examples/jsm/loaders/GLTFLoader.js
 */

class GLTFLoader extends THREE.Loader {
  constructor(manager) {
    super(manager);
    this.dracoLoader = null;
  }

  load(url, onLoad, onProgress, onError) {
    const scope = this;
    const loader = new THREE.FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType('arraybuffer');
    loader.setWithCredentials(this.withCredentials);

    loader.load(
      url,
      function (data) {
        try {
          scope.parse(data, url, onLoad, onError);
        } catch (e) {
          if (onError) {
            onError(e);
          } else {
            console.error(e);
          }

          scope.manager.itemError(url);
        }
      },
      onProgress,
      onError
    );
  }

  parse(data, path, onLoad, onError) {
    const magic = new Uint8Array(data, 0, 4);

    if (
      magic[0] === 0x67 &&
      magic[1] === 0x6c &&
      magic[2] === 0x54 &&
      magic[3] === 0x46
    ) {
      this.parseBinary(data, path, onLoad, onError);
    } else {
      this.parseJSON(data, path, onLoad, onError);
    }
  }

  parseBinary(data, path, onLoad, onError) {
    try {
      const textDecoder = new TextDecoder();
      const headerView = new DataView(data, 0, 12);
      const jsonChunkLength = new DataView(data, 12, 4).getUint32(0, true);
      const jsonChunkOffset = 20;
      const jsonChunk = new Uint8Array(data, jsonChunkOffset, jsonChunkLength);
      const jsonText = textDecoder.decode(jsonChunk);
      const json = JSON.parse(jsonText);
      const gltf = { json: json, path: path };
      onLoad({ scene: new THREE.Group(), asset: gltf });
    } catch (error) {
      if (onError) onError(error);
    }
  }

  parseJSON(data, path, onLoad, onError) {
    try {
      const textDecoder = new TextDecoder();
      const jsonText = textDecoder.decode(new Uint8Array(data));
      const json = JSON.parse(jsonText);
      const gltf = { json: json, path: path };
      onLoad({ scene: new THREE.Group(), asset: gltf });
    } catch (error) {
      if (onError) onError(error);
    }
  }

  setDRACOLoader(dracoLoader) {
    this.dracoLoader = dracoLoader;
    return this;
  }
}

export { GLTFLoader };
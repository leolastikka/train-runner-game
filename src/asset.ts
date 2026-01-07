import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/Addons.js';
import type { LevelData } from './level';

export class Asset {
  private static loadingManager: THREE.LoadingManager;

  private static defaultMaterial: THREE.Material;
  private static geometries: Map<string, THREE.BufferGeometry>;
  private static levelDatas: Map<string, LevelData>;

  static init(
    onLoad: () => void,
    onProgress: (url: string, loaded: number, total: number) => void,
    onError: (url: string) => void
  ) {
    this.loadingManager = new THREE.LoadingManager(
      onLoad,
      onProgress,
      onError
    );
    this.defaultMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff
    });
    this.geometries = new Map();
    this.levelDatas = new Map();

    const objLoader = new OBJLoader(this.loadingManager);
    objLoader.load('models.obj', this.parseGeometries.bind(this));
    const texLoader = new THREE.TextureLoader(this.loadingManager);
    texLoader.load('colors.png', this.parseTexture.bind(this));
    const fileLoader = new THREE.FileLoader(this.loadingManager);
    fileLoader.load('levels/1.json', this.parseLevel.bind(this));
    fileLoader.load('levels/2.json', this.parseLevel.bind(this));
  }

  public static getDefaultMaterial(): THREE.Material {
    return this.defaultMaterial;
  }

  public static getGeometry(name: string): THREE.BufferGeometry | null {
    const geometry = this.geometries.get(name);
    if (geometry) {
      return geometry;
    }
    return null;
  }

  public static getLevelData(name: string): LevelData | null {
    const levelData = this.levelDatas.get(name);
    if (levelData) {
      return levelData;
    }
    return null;
  }

  public static getLevelNames(): string[] {
    return Array.from(this.levelDatas.keys());
  }

  private static parseGeometries(data: THREE.Group<THREE.Object3DEventMap>) {
    for (let child of data.children) {
      let mesh = child as THREE.Mesh;
      this.geometries.set(mesh.name, mesh.geometry);
    }
  }

  private static parseTexture(data: THREE.Texture<HTMLImageElement>) {
    this.defaultMaterial = new THREE.MeshBasicMaterial({
      map: data
    });
  }

  private static parseLevel(data: string | ArrayBuffer) {
    if (typeof data === 'string') {
      const levelData = JSON.parse(data);
      this.levelDatas.set(levelData.name, levelData);
    }
  }
}
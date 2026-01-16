import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';
import { MODEL_DISTANCE, PLAYER_RADIUS, RAIL, RAIL_DISTANCE, TEXT_HEIGHT } from './constant';
import { Asset } from './asset';
import type { Player } from './player';

const GROUND_MATERIAL = new THREE.MeshBasicMaterial({color: 0x00c18e});
const RAIL_MATERIAL = new THREE.MeshBasicMaterial({color: 0x929292});

export interface LevelData {
  name: string,
  modifiers: LevelModifierData[]
}

export interface LevelModifierData {
  type: string,
  operator: string,
  value: number,
  leftPositions: number[],
  middlePositions: number[],
  rightPositions: number[]
}

export class Level {
  public name: string;
  public group: THREE.Group;
  public rails: Map<RAIL, THREE.Mesh[]>

  constructor(levelData: LevelData) {
    this.name = levelData.name;
    this.group = new THREE.Group();
    this.rails = new Map();
    this.rails.set(RAIL.LEFT, []);
    this.rails.set(RAIL.MIDDLE, []);
    this.rails.set(RAIL.RIGHT, []);

    this.createGround();
    this.createRails();
    this.createPoints(levelData.modifiers);
  }

  public destructor() {
    this.group.clear();
    this.rails.clear();
  }

  public checkCollisions(score: number, player: Player): number {
    let railPoints: THREE.Mesh[] | undefined = this.rails.get(player.rail);
    if (!railPoints) {
      return score;
    }

    // player collision range
    let minZ = player.group.position.z - PLAYER_RADIUS;
    let maxZ = player.group.position.z + PLAYER_RADIUS;

    // loop points from smallest z value so that score is calculated in order
    for (let point of railPoints) {
      let posZ = point.position.z;
      let userData = point.userData;

      if (userData.taken) {
        continue;
      }

      if (!(posZ >= minZ && posZ <= maxZ)) {
        continue;
      }

      if (userData.operator === '+') {
        score += userData.value;
      }
      else if (userData.operator === '-') {
        score -= userData.value;
      }
      else if (userData.operator === '*') {
        score *= userData.value;
      }
      else if (userData.operator === '/') {
        score = Math.floor(score / userData.value);
      }

      userData.taken = true;
      this.group.remove(point);
    }

    return score;
  }

  private createGround() {
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const ground = new THREE.Mesh(groundGeometry, GROUND_MATERIAL);
    ground.rotation.x = -Math.PI / 2;
    this.group.add(ground);
  }

  private createRails() {
    const railGeometry = new THREE.BoxGeometry(0.1, 0.2, 1000);

    // place rail pairs for left, middle, right
    const positions = [-RAIL_DISTANCE, 0, RAIL_DISTANCE];
    const merged: THREE.BufferGeometry[] = [];
    for (const p of positions) {
      merged.push(railGeometry.clone().translate(p - 0.5, 0, 0));
      merged.push(railGeometry.clone().translate(p + 0.5, 0, 0));
    }

    const railGeometries = BufferGeometryUtils.mergeGeometries(merged, false);
    const rail = new THREE.Mesh(railGeometries, RAIL_MATERIAL);
    this.group.add(rail);
  }

  private createPoints(levelPointDatas: LevelModifierData[]) {
    for (let pointData of levelPointDatas) {
      if (pointData.leftPositions) {
        for (let z of pointData.leftPositions) {
          this.createPoint(
            z,
            RAIL.LEFT,
            pointData.type,
            pointData.value,
            pointData.operator
          );
        }
      }
      if (pointData.middlePositions) {
        for (let z of pointData.middlePositions) {
          this.createPoint(
            z,
            RAIL.MIDDLE,
            pointData.type,
            pointData.value,
            pointData.operator
          );
        }
      }
      if (pointData.rightPositions) {
        for (let z of pointData.rightPositions) {
          this.createPoint(
            z,
            RAIL.RIGHT,
            pointData.type,
            pointData.value,
            pointData.operator
          );
        }
      }
    }
  }

  private createPoint(z: number, rail: RAIL, type: string, value: number, operator: string) {
    let material: THREE.Material = Asset.getDefaultMaterial();
    let textMaterial: THREE.Material = Asset.blueMaterial;
    let mesh: THREE.Mesh | null = null;
    let textMesh: THREE.Mesh | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let textGeometry: THREE.BufferGeometry | null = null;

    // forward is -z
    z = -z;

    // select geometry based on type and operator
    if (operator === '+' || operator === '*') {
      geometry = Asset.getGeometry(`${type}-pos`);
    }
    else {
      geometry = Asset.getGeometry(`${type}-neg`);
      textMaterial = Asset.redMaterial;
    }
    textGeometry = Asset.getTextGeometry(`${operator}${value}`);

    if (!geometry || !textGeometry) {
      return;
    }
    mesh = new THREE.Mesh(geometry, material);
    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // position and offsets
    mesh.position.z = z;
    mesh.position.x += MODEL_DISTANCE;
    textMesh.position.x -= MODEL_DISTANCE;
    textMesh.position.y = TEXT_HEIGHT;

    if (rail === RAIL.LEFT) {
      mesh.position.x -= RAIL_DISTANCE;
    }
    else if (rail === RAIL.RIGHT) {
      mesh.position.x += RAIL_DISTANCE;
    }

    mesh.userData.operator = operator;
    mesh.userData.value = value;
    mesh.userData.taken = false;
    mesh.add(textMesh);

    this.rails.get(rail)?.push(mesh);
    this.group.add(mesh);
  }
}

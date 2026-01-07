import * as THREE from 'three';
import { RAIL, RAIL_DISTANCE } from './constant';
import { Time } from './time';
import { Asset } from './asset';

enum MOVE_STATE {
  MOVING,
  JUMPING,
  STOPPED
}

export class Player {
  public group: THREE.Group;
  public train: THREE.Mesh;
  public rail: RAIL = RAIL.MIDDLE;
  public speed: number = 4.0;

  private state: MOVE_STATE = MOVE_STATE.MOVING;

  private jumpDuration: number = 0.5;
  private jumpHeight: number = 2.0;
  private jumpEndTime: number = 0;
  private jumpStartX: number = 0;
  private jumpEndX: number = 0;
  private jumpDirection: number = 0;

  public isMoving(): boolean {
    return this.state === MOVE_STATE.MOVING;
  }

  constructor() {
    this.group = new THREE.Group();
    let trainGeometry = Asset.getGeometry('train')
    if (!trainGeometry) {
      trainGeometry = new THREE.BoxGeometry();
    }
    this.train = new THREE.Mesh(
      trainGeometry,
      Asset.getDefaultMaterial()
    );
    this.train.position.y = 1.2;
    this.group.add(this.train);
  }

  public update() {
    if (this.state === MOVE_STATE.STOPPED) {
      return;
    }

    const time = Time.getTotalTime();
    const delta = Time.getDeltaTime();

    this.group.position.z -= this.speed * delta;
    if (this.state !== MOVE_STATE.JUMPING) {
      return;
    }

    const progress = Math.max(
      Math.min(
        (this.jumpDuration - (this.jumpEndTime - time)) / this.jumpDuration,
        1.0),
      0.0
    );

    const x = THREE.MathUtils.lerp(
      this.jumpStartX,
      this.jumpEndX,
      progress
    );

    const rotZ = THREE.MathUtils.lerp(
      0,
      360 * this.jumpDirection,
      progress
    );

    this.train.rotation.z = THREE.MathUtils.degToRad(rotZ);
    this.group.position.x = x;
    this.group.position.y = this.getJumpHeight(progress);

    if (progress == 1.0) {
      this.state = MOVE_STATE.MOVING;
    }
  }

  public stop() {
    this.state = MOVE_STATE.STOPPED;
  }

  public moveLeft() {
    const time = Time.getTotalTime();
    if (this.state !== MOVE_STATE.MOVING) {
      return;
    }
    if (this.rail === RAIL.LEFT) {
      return;
    }
    this.rail--;
    this.state = MOVE_STATE.JUMPING;
    this.jumpEndTime = time + this.jumpDuration;
    this.jumpStartX = this.group.position.x;
    this.jumpEndX = this.jumpStartX - RAIL_DISTANCE;
    this.jumpDirection = 1;
  }

  public moveRight() {
    const time = Time.getTotalTime();
    if (this.state !== MOVE_STATE.MOVING) {
      return;
    }
    if (this.rail === RAIL.RIGHT) {
      return;
    }
    this.rail++;
    this.state = MOVE_STATE.JUMPING;
    this.jumpEndTime = time + this.jumpDuration;
    this.jumpStartX = this.group.position.x;
    this.jumpEndX = this.jumpStartX + RAIL_DISTANCE;
    this.jumpDirection = -1;
  }

  private getJumpHeight(time: number): number {
    return Math.sin(Math.PI * time) * this.jumpHeight;
  }
}

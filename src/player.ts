import * as THREE from 'three';
import { RAIL, RAIL_DISTANCE } from './constant';

enum MOVE_STATE {
  MOVING = 0,
  JUMPING = 1
}

export class Player {
  public group: THREE.Group;
  public train: THREE.Mesh;
  public rail: RAIL = RAIL.MIDDLE;
  public state: MOVE_STATE = MOVE_STATE.MOVING;
  public speed: number = 5.0;

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
    this.train = this.createTrain();

    this.group.add(this.train);
  }

  public update(time: number) {
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

  public moveLeft(time: number) {
    if (this.state === MOVE_STATE.JUMPING) {
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

  public moveRight(time: number) {
    if (this.state === MOVE_STATE.JUMPING) {
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

  private createTrain(): THREE.Mesh {
    const trainMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
    const trainGeometry = new THREE.BoxGeometry(2, 2, 2);
    const train = new THREE.Mesh(trainGeometry, trainMaterial);
    train.position.y = 1;
    return train;
  }

  private getJumpHeight(time: number): number {
    return Math.sin(Math.PI * time) * this.jumpHeight;
  }
}

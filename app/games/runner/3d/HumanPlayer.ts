import * as THREE from 'three';
import { AnimationController } from './AnimationController.js';
import { HORIZONTAL_SPEED, PLAYER_DEFAULTS } from './Constants.js';
import { buildMannequin } from './MannequinBuilder.js';
import { AnimationState, PlayerConfig, SkeletalJoints } from './Types.js';
import { clamp, lerp } from './Utility.js';

export class HumanPlayer {
  public mesh: THREE.Group;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public currentLane = 0;
  public targetLane = 0;
  public isJumping = false;
  public isSliding = false;
  public isMovingLeft = false;
  public isMovingRight = false;
  public config: PlayerConfig;
  private joints!: SkeletalJoints;
  private animController!: AnimationController;
  private slideTimer = 0;

  constructor(scene: THREE.Scene, customConfig?: Partial<PlayerConfig>) {
    this.config = {
      ...PLAYER_DEFAULTS,
      ...customConfig,
      colors: { ...PLAYER_DEFAULTS.colors, ...customConfig?.colors },
    };
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.mesh = new THREE.Group();
    this.mesh.castShadow = this.mesh.receiveShadow = true;
    scene.add(this.mesh);

    // Assemble visual body and retrieve joints maps
    this.joints = buildMannequin(this.mesh, this.config);
    this.animController = new AnimationController(this.joints, this.config);
    this.mesh.rotation.y = Math.PI; // Face negative Z (forward running direction)
    this.playAnimation('RUN');
  }

  jump() {
    if (this.isJumping || this.isSliding) return;
    this.isJumping = true;
    this.velocity.y = Math.sqrt(2 * this.config.gravity * this.config.jumpHeight);
    this.animController.setState('JUMP');
  }

  slide() {
    if (this.isSliding || this.isJumping) return;
    this.isSliding = true;
    this.slideTimer = this.config.slideDuration;
    this.animController.setState('SLIDE');
  }

  moveLeft() {
    if (this.targetLane <= -1) return;
    this.targetLane -= 1;
    this.isMovingLeft = true;
    this.isMovingRight = false;
    this.animController.setState('MOVE_LEFT');
  }

  moveRight() {
    if (this.targetLane >= 1) return;
    this.targetLane += 1;
    this.isMovingRight = true;
    this.isMovingLeft = false;
    this.animController.setState('MOVE_RIGHT');
  }

  setLane(laneIndex: number) {
    this.targetLane = clamp(laneIndex, -1, 1);
    this.currentLane = this.targetLane;
    this.position.x = this.targetLane * this.config.laneWidth;
    this.mesh.position.x = this.position.x;
  }

  playAnimation(state: AnimationState) {
    this.animController.setState(state);
  }

  reset() {
    this.position.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
    this.currentLane = 0;
    this.targetLane = 0;
    this.isJumping = this.isSliding = this.isMovingLeft = this.isMovingRight = false;
    this.mesh.position.set(0, 0, 0);
    this.joints.torso.position.y = 0.95;
    this.playAnimation('RUN');
  }

  update(delta: number) {
    if (this.isJumping) {
      this.velocity.y -= this.config.gravity * delta;
      this.position.y += this.velocity.y * delta;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocity.y = 0;
        this.isJumping = false;
        this.animController.setState(this.isSliding ? 'SLIDE' : 'RUN');
      }
    }
    if (this.isSliding) {
      this.slideTimer -= delta * 1000;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
        this.slideTimer = 0;
        if (!this.isJumping) this.animController.setState('RUN');
      }
    }
    const targetX = this.targetLane * this.config.laneWidth;
    if (Math.abs(this.position.x - targetX) > 0.01) {
      this.position.x = lerp(this.position.x, targetX, HORIZONTAL_SPEED * delta);
      this.isMovingRight = this.position.x < targetX;
      this.isMovingLeft = !this.isMovingRight;
    } else {
      this.position.x = targetX;
      if (this.isMovingLeft || this.isMovingRight) {
        this.isMovingLeft = this.isMovingRight = false;
        if (!this.isJumping && !this.isSliding) this.animController.setState('RUN');
      }
    }
    this.mesh.position.copy(this.position);
    this.animController.update(delta, this.isJumping, this.isSliding, this.position.y);
  }
}

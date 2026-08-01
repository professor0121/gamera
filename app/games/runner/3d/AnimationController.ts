import * as THREE from 'three';
import { AnimationState, SkeletalJoints, PlayerConfig } from './Types.js';
import { ANIMS, BLEND_SPEED } from './Constants.js';
import { lerp } from './Utility.js';

interface JointRotationState {
  x: number;
  y: number;
  z: number;
}

export class AnimationController {
  private joints: SkeletalJoints;
  private config: PlayerConfig;
  private currentState: AnimationState = 'IDLE';
  private targetState: AnimationState = 'IDLE';
  private time = 0;
  private slideElapsed = 0;

  // Cached target rotations for all joints to avoid allocations
  private targets: Map<keyof SkeletalJoints, JointRotationState> = new Map();
  private targetTorsoY = 0;

  constructor(joints: SkeletalJoints, config: PlayerConfig) {
    this.joints = joints;
    this.config = config;

    // Initialize target map
    const jointKeys = Object.keys(joints) as Array<keyof SkeletalJoints>;
    jointKeys.forEach((key) => {
      this.targets.set(key, { x: 0, y: 0, z: 0 });
    });
  }

  setState(state: AnimationState) {
    this.targetState = state;
    if (state === 'SLIDE') {
      this.slideElapsed = 0;
    }
  }

  getState(): AnimationState {
    return this.currentState;
  }

  update(delta: number, isJumping: boolean, isSliding: boolean, yPos: number) {
    this.time += delta * this.config.animationSpeed * 6.0;
    
    // Smooth state blending
    if (this.currentState !== this.targetState) {
      this.currentState = this.targetState;
    }

    // Reset all target rotations to zero
    this.targets.forEach((rot) => {
      rot.x = 0;
      rot.y = 0;
      rot.z = 0;
    });
    this.targetTorsoY = 0;

    // Calculate targets based on active state
    switch (this.currentState) {
      case 'IDLE':
        this.computeIdleTargets();
        break;
      case 'RUN':
        this.computeRunTargets();
        break;
      case 'JUMP':
        this.computeJumpTargets();
        break;
      case 'SLIDE':
        this.slideElapsed += delta * 1000;
        this.computeSlideTargets();
        break;
      case 'MOVE_LEFT':
        this.computeMoveTargets(-1);
        break;
      case 'MOVE_RIGHT':
        this.computeMoveTargets(1);
        break;
    }

    // Blend actual joint rotations towards target rotations
    this.targets.forEach((targetRot, key) => {
      const joint = this.joints[key];
      joint.rotation.x = lerp(joint.rotation.x, targetRot.x, BLEND_SPEED);
      joint.rotation.y = lerp(joint.rotation.y, targetRot.y, BLEND_SPEED);
      joint.rotation.z = lerp(joint.rotation.z, targetRot.z, BLEND_SPEED);
    });

    // Blend torso vertical height offset visually (excluding physical jump height Y)
    this.joints.torso.position.y = lerp(
      this.joints.torso.position.y,
      0.95 + this.targetTorsoY,
      BLEND_SPEED
    );
  }

  private computeIdleTargets() {
    const breathe = Math.sin(this.time * 0.4);
    
    // Torso breathing breathing
    this.targetTorsoY = breathe * 0.02;

    // Arms hanging loosely, breathing slightly
    const leftArm = this.targets.get('leftShoulder')!;
    leftArm.z = Math.PI / 16 + breathe * 0.02;
    leftArm.x = breathe * 0.05;

    const rightArm = this.targets.get('rightShoulder')!;
    rightArm.z = -Math.PI / 16 - breathe * 0.02;
    rightArm.x = -breathe * 0.05;

    // Head remains stable
    const head = this.targets.get('head')!;
    head.x = -breathe * 0.01;
  }

  private computeRunTargets() {
    const cycle = this.time;
    const swingX = Math.sin(cycle);
    
    // Slight body bounce running rhythm
    this.targetTorsoY = -Math.abs(Math.sin(cycle * 2)) * ANIMS.BODY_BOUNCE;

    // Torso rotations (shoulders rotate opposite to hips)
    const torso = this.targets.get('torso')!;
    torso.y = swingX * 0.08; // Swivel spine

    // Arms swing opposite (Left arm forward when Right leg forward)
    const leftArm = this.targets.get('leftShoulder')!;
    leftArm.x = swingX * ANIMS.ARM_SWING;
    leftArm.z = 0.15; // Hold slightly away from body

    const rightArm = this.targets.get('rightShoulder')!;
    rightArm.x = -swingX * ANIMS.ARM_SWING;
    rightArm.z = -0.15;

    // Elbows bend slightly at back of swing
    const leftElbow = this.targets.get('leftElbow')!;
    leftElbow.x = (swingX > 0 ? swingX : 0) * 0.5 + 0.2;

    const rightElbow = this.targets.get('rightElbow')!;
    rightElbow.x = (swingX < 0 ? -swingX : 0) * 0.5 + 0.2;

    // Legs swing opposite
    const leftLeg = this.targets.get('leftHip')!;
    leftLeg.x = -swingX * ANIMS.LEG_SWING;

    const rightLeg = this.targets.get('rightHip')!;
    rightLeg.x = swingX * ANIMS.LEG_SWING;

    // Knees bend on backward swing for running kicks
    const leftKnee = this.targets.get('leftKnee')!;
    leftKnee.x = (swingX > 0 ? swingX : 0) * ANIMS.KNEE_BEND_FACTOR;

    const rightKnee = this.targets.get('rightKnee')!;
    rightKnee.x = (swingX < 0 ? -swingX : 0) * ANIMS.KNEE_BEND_FACTOR;
  }

  private computeJumpTargets() {
    // Arms raise upward and outward
    const leftArm = this.targets.get('leftShoulder')!;
    leftArm.x = ANIMS.JUMP_ARM_X;
    leftArm.z = -Math.PI / 6;

    const rightArm = this.targets.get('rightShoulder')!;
    rightArm.x = ANIMS.JUMP_ARM_X;
    rightArm.z = Math.PI / 6;

    // Legs extend and bend slightly backwards
    const leftLeg = this.targets.get('leftHip')!;
    leftLeg.x = ANIMS.JUMP_LEG_X;
    const rightLeg = this.targets.get('rightHip')!;
    rightLeg.x = ANIMS.JUMP_LEG_X;

    const leftKnee = this.targets.get('leftKnee')!;
    leftKnee.x = ANIMS.JUMP_KNEE_X;
    const rightKnee = this.targets.get('rightKnee')!;
    rightKnee.x = ANIMS.JUMP_KNEE_X;
  }

  private computeSlideTargets() {
    // Body lowers and leans forward
    this.targetTorsoY = ANIMS.SLIDE_BODY_Y;

    const torso = this.targets.get('torso')!;
    torso.x = ANIMS.SLIDE_BODY_X_ROT;

    // Head tilted up to look forward while sliding
    const head = this.targets.get('head')!;
    head.x = ANIMS.SLIDE_HEAD_X_ROT;

    // Arms swing back
    const leftArm = this.targets.get('leftShoulder')!;
    leftArm.x = ANIMS.SLIDE_ARM_X_ROT;
    leftArm.z = 0.1;

    const rightArm = this.targets.get('rightShoulder')!;
    rightArm.x = ANIMS.SLIDE_ARM_X_ROT;
    rightArm.z = -0.1;

    // Legs tuck up under body
    const leftLeg = this.targets.get('leftHip')!;
    leftLeg.x = ANIMS.SLIDE_LEG_X_ROT;
    leftLeg.z = 0.1;

    const rightLeg = this.targets.get('rightHip')!;
    rightLeg.x = ANIMS.SLIDE_LEG_X_ROT;
    rightLeg.z = -0.1;

    // Knees bent deeply
    const leftKnee = this.targets.get('leftKnee')!;
    leftKnee.x = ANIMS.SLIDE_KNEE_X_ROT;
    
    const rightKnee = this.targets.get('rightKnee')!;
    rightKnee.x = ANIMS.SLIDE_KNEE_X_ROT;
  }

  private computeMoveTargets(direction: -1 | 1) {
    // Runs cycle while turning
    this.computeRunTargets();

    // Add lateral body lean in the direction of movement
    const torso = this.targets.get('torso')!;
    torso.z = -direction * ANIMS.LEAN_ANGLE;
    torso.y = direction * 0.1; // Rotate torso slightly into turn
  }
}

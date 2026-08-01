import * as THREE from 'three';

export type AnimationState = 'IDLE' | 'RUN' | 'JUMP' | 'SLIDE' | 'MOVE_LEFT' | 'MOVE_RIGHT';

export type WeatherState = 'DAY' | 'NIGHT' | 'RAIN' | 'SNOW';

export type PowerUpType = 'SHIELD' | 'MAGNET' | 'BOOST';

export interface PlayerConfig {
  runSpeed: number;
  jumpHeight: number;
  slideDuration: number;
  laneWidth: number;
  gravity: number;
  animationSpeed: number;
  colors: {
    skin: number;
    shirt: number;
    pants: number;
    shoes: number;
    eyes: number;
    hair: number;
  };
}

export interface SkeletalJoints {
  torso: THREE.Group;
  head: THREE.Group;
  leftShoulder: THREE.Group;
  leftElbow: THREE.Group;
  rightShoulder: THREE.Group;
  rightElbow: THREE.Group;
  leftHip: THREE.Group;
  leftKnee: THREE.Group;
  rightHip: THREE.Group;
  rightKnee: THREE.Group;
}

export interface ActiveObject {
  type: string;
  mesh: THREE.Group;
  lane: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  active: boolean;
  angleSpeed?: number;
  bounceOffset?: number;
  speedZ?: number;
}

export interface EnvironmentChunk {
  mesh: THREE.Group;
  z: number;
  active: boolean;
}

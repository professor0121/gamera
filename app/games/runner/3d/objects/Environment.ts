import * as THREE from 'three';
import { GeometryManager } from '../GeometryManager.js';
import { MaterialManager } from '../MaterialManager.js';
import { CHUNK_SIZE } from '../Constants.js';

// 1. RoadTile Chunk (Endless Terrain block containing lanes and sidewalks)
export class RoadTile {
  public mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Road slab (Base)
    const roadMat = MaterialManager.getMaterial(0x181824, 0.9, 0.0);
    const roadMesh = new THREE.Mesh(GeometryManager.getBox(6.4, 0.1, CHUNK_SIZE), roadMat);
    roadMesh.position.y = -0.05;
    roadMesh.receiveShadow = true;
    this.mesh.add(roadMesh);

    // Left Sidewalk
    const curbMat = MaterialManager.getMaterial(0x2d323f, 0.7, 0.1);
    const leftCurb = new THREE.Mesh(GeometryManager.getBox(1.5, 0.2, CHUNK_SIZE), curbMat);
    leftCurb.position.set(-3.95, 0.05, 0);
    leftCurb.receiveShadow = true;
    this.mesh.add(leftCurb);

    // Right Sidewalk
    const rightCurb = leftCurb.clone();
    rightCurb.position.x = 3.95;
    this.mesh.add(rightCurb);

    // Lane division markings (Neon lines)
    const lineMat = MaterialManager.getMaterial(0x00f5ff, 0.2, 0.9);
    for (let i = 0; i < 3; i++) {
      const zOffset = -CHUNK_SIZE / 2 + (i * CHUNK_SIZE) / 2.5 + 2.5;
      
      const line1 = new THREE.Mesh(GeometryManager.getBox(0.08, 0.11, 2.5), lineMat);
      line1.position.set(-1.0, 0.01, zOffset);
      
      const line2 = line1.clone();
      line2.position.x = 1.0;

      this.mesh.add(line1, line2);
    }
  }
}

// 2. StreetLamp (Futuristic curved light pole)
export class StreetLamp {
  public mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
    const ironMat = MaterialManager.getMaterial(0x2a2a2a, 0.5, 0.6);

    // Main pole
    const pole = new THREE.Mesh(GeometryManager.getCylinder(0.05, 0.07, 3.2, 8), ironMat);
    pole.position.y = 1.6;
    pole.castShadow = true;
    this.mesh.add(pole);

    // Bent light head
    const arm = new THREE.Mesh(GeometryManager.getBox(0.6, 0.08, 0.12), ironMat);
    arm.position.set(0.3, 3.2, 0);
    this.mesh.add(arm);

    // Lamp bulb (emissive box)
    const emissiveMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 3.0,
    });
    const bulb = new THREE.Mesh(GeometryManager.getBox(0.3, 0.06, 0.2), emissiveMat);
    bulb.position.set(0.5, 3.15, 0);
    this.mesh.add(bulb);
  }
}

// 3. Skyscraper Apartment / Building
export class Skyscraper {
  public mesh: THREE.Group;

  constructor(height: number, color: number) {
    this.mesh = new THREE.Group();
    
    // Main building block
    const buildMat = MaterialManager.getMaterial(color, 0.7, 0.2);
    const body = new THREE.Mesh(GeometryManager.getBox(3.5, height, 3.5), buildMat);
    body.position.y = height / 2;
    body.castShadow = body.receiveShadow = true;
    this.mesh.add(body);

    // Add glowing yellow window plates procedurally
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xffea00,
      emissive: 0xffea00,
      emissiveIntensity: 1.5,
    });

    const windowGeo = GeometryManager.getBox(0.2, 0.35, 0.02);
    const floors = Math.floor(height / 1.5) - 2;

    for (let f = 0; f < floors; f++) {
      const yOffset = 1.8 + f * 1.3;
      // 4 windows per floor on front face
      for (let w = 0; w < 3; w++) {
        const xOffset = -1.0 + w * 1.0;
        const win = new THREE.Mesh(windowGeo, windowMat);
        win.position.set(xOffset, yOffset, 1.76); // offset forward
        this.mesh.add(win);
      }
    }
  }
}

// 4. Low-Poly Tree (Futuristic geometrical foliage)
export class Tree {
  public mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Trunk
    const trunkMat = MaterialManager.getMaterial(0x5a3d28, 0.9, 0.0);
    const trunk = new THREE.Mesh(GeometryManager.getCylinder(0.08, 0.12, 0.8, 8), trunkMat);
    trunk.position.y = 0.4;
    trunk.castShadow = true;
    this.mesh.add(trunk);

    // Leaves (Stacked cones)
    const leavesMat = MaterialManager.getMaterial(0x00b894, 0.8, 0.0);
    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.9, 6), leavesMat);
    cone1.position.y = 1.1;
    cone1.castShadow = true;
    
    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 6), leavesMat);
    cone2.position.y = 1.6;
    cone2.castShadow = true;

    this.mesh.add(cone1, cone2);
  }
}

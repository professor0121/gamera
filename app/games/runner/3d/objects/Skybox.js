import * as THREE from 'three';
import { GeometryManager } from '../GeometryManager.js';
import { MaterialManager } from '../MaterialManager.js';
// 1. SkyDome (Large hemisphere wrapper)
export class SkyDome {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const skyMat = new THREE.MeshBasicMaterial({
            color: 0x050510,
            side: THREE.BackSide, // Render inner faces only
        });
        const sky = new THREE.Mesh(new THREE.SphereGeometry(70, 16, 16), skyMat);
        this.mesh.add(sky);
    }
}
// 2. SunMesh (Celestial glowing body)
export class SunMesh {
    mesh;
    constructor() {
        const sunMat = new THREE.MeshBasicMaterial({
            color: 0xffea00,
        });
        this.mesh = new THREE.Mesh(GeometryManager.getSphere(3.2, 12, 12), sunMat);
        this.mesh.position.set(-15, 30, -50);
    }
}
// 3. MoonMesh (Lunar silver crescent/dome)
export class MoonMesh {
    mesh;
    constructor() {
        const moonMat = new THREE.MeshBasicMaterial({
            color: 0xe2eaf5,
        });
        this.mesh = new THREE.Mesh(GeometryManager.getSphere(2.5, 12, 12), moonMat);
        this.mesh.position.set(15, 25, -50);
    }
}
// 4. CitySkyline (Stacked low-poly city skyscrapers silhouette)
export class CitySkyline {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const silColor = 0x090918;
        const silhouetteMat = MaterialManager.getMaterial(silColor, 1.0, 0.0);
        // Spawn 15 skyscrapers of different heights in the background
        for (let i = 0; i < 15; i++) {
            const width = 4.0 + Math.random() * 4.0;
            const height = 12.0 + Math.random() * 15.0;
            const depth = 4.0;
            const tower = new THREE.Mesh(GeometryManager.getBox(width, height, depth), silhouetteMat);
            // Arrange left-to-right along background plane
            const xPos = -40 + i * 5.8 + (Math.random() - 0.5) * 1.5;
            tower.position.set(xPos, height / 2 - 2, -45); // Kept back
            this.mesh.add(tower);
        }
    }
}

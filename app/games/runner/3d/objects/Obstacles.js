import * as THREE from 'three';
import { GeometryManager } from '../GeometryManager.js';
import { MaterialManager } from '../MaterialManager.js';
// 1. Crate (Wooden block with contrast cross planks)
export class Crate {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const woodMat = MaterialManager.getMaterial(0xb06c42, 0.9, 0.0);
        const darkWoodMat = MaterialManager.getMaterial(0x784421, 0.9, 0.0);
        // Main box
        const body = new THREE.Mesh(GeometryManager.getBox(0.8, 0.8, 0.8), woodMat);
        body.position.y = 0.4;
        body.castShadow = body.receiveShadow = true;
        this.mesh.add(body);
        // Cross X planks
        const plankX1 = new THREE.Mesh(GeometryManager.getBox(0.82, 0.1, 0.04), darkWoodMat);
        plankX1.position.set(0, 0.4, 0.4);
        plankX1.rotation.z = Math.PI / 4;
        const plankX2 = plankX1.clone();
        plankX2.rotation.z = -Math.PI / 4;
        this.mesh.add(plankX1, plankX2);
    }
}
// 2. Road Barrier (Striped orange/white panels on legs)
export class Barrier {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const orangeMat = MaterialManager.getMaterial(0xff7675, 0.5, 0.1);
        const whiteMat = MaterialManager.getMaterial(0xffffff, 0.5, 0.1);
        const metalMat = MaterialManager.getMaterial(0x555555, 0.6, 0.7);
        // Support stand legs
        const legL = new THREE.Mesh(GeometryManager.getBox(0.06, 0.9, 0.35), metalMat);
        legL.position.set(-0.6, 0.45, 0);
        legL.castShadow = true;
        const legR = legL.clone();
        legR.position.x = 0.6;
        this.mesh.add(legL, legR);
        // Main cross barrier panels
        const panelGeo = GeometryManager.getBox(1.3, 0.14, 0.06);
        const panelTop = new THREE.Mesh(panelGeo, orangeMat);
        panelTop.position.set(0, 0.72, 0);
        panelTop.castShadow = true;
        const panelBottom = new THREE.Mesh(panelGeo, orangeMat);
        panelBottom.position.set(0, 0.42, 0);
        panelBottom.castShadow = true;
        // Small white stripes decals
        const stripeGeo = GeometryManager.getBox(0.12, 0.15, 0.07);
        for (let i = 0; i < 3; i++) {
            const xOffset = -0.4 + i * 0.4;
            const stripeT = new THREE.Mesh(stripeGeo, whiteMat);
            stripeT.position.set(xOffset, 0.72, 0);
            const stripeB = stripeT.clone();
            stripeB.position.y = 0.42;
            this.mesh.add(stripeT, stripeB);
        }
        this.mesh.add(panelTop, panelBottom);
    }
}
// 3. Oil Drum (Ribbed orange cylindrical barrel)
export class OilDrum {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const drumMat = MaterialManager.getMaterial(0xd63031, 0.5, 0.4);
        const blackMat = MaterialManager.getMaterial(0x222222, 0.8, 0.1);
        // Drum cylinder
        const body = new THREE.Mesh(GeometryManager.getCylinder(0.32, 0.32, 0.95, 12), drumMat);
        body.position.y = 0.475;
        body.castShadow = body.receiveShadow = true;
        this.mesh.add(body);
        // Top/Bottom metal caps
        const capGeo = GeometryManager.getCylinder(0.325, 0.325, 0.04, 12);
        const capTop = new THREE.Mesh(capGeo, blackMat);
        capTop.position.y = 0.96;
        const capBottom = capTop.clone();
        capBottom.position.y = 0.02;
        // Rib bands wrapping body
        const ribGeo = GeometryManager.getCylinder(0.34, 0.34, 0.05, 12);
        const rib1 = new THREE.Mesh(ribGeo, blackMat);
        rib1.position.y = 0.65;
        const rib2 = rib1.clone();
        rib2.position.y = 0.3;
        this.mesh.add(capTop, capBottom, rib1, rib2);
    }
}
// 4. Laser Gate (High barrier requiring players to slide underneath)
export class LaserGate {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const darkMat = MaterialManager.getMaterial(0x2d3436, 0.4, 0.5);
        // Left support tower
        const towerL = new THREE.Mesh(GeometryManager.getBox(0.12, 1.8, 0.12), darkMat);
        towerL.position.set(-0.85, 0.9, 0);
        towerL.castShadow = true;
        // Right support tower
        const towerR = towerL.clone();
        towerR.position.x = 0.85;
        this.mesh.add(towerL, towerR);
        // Neon laser beam mesh
        const laserMat = new THREE.MeshStandardMaterial({
            color: 0xff0055,
            emissive: 0xff0055,
            emissiveIntensity: 2.5,
        });
        // Positioned high up (Y=1.2), player must slide to pass
        const beam = new THREE.Mesh(GeometryManager.getCylinder(0.04, 0.04, 1.8, 8), laserMat);
        beam.rotation.z = Math.PI / 2;
        beam.position.set(0, 1.35, 0);
        this.mesh.add(beam);
    }
}

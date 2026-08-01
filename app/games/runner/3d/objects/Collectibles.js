import * as THREE from 'three';
import { GeometryManager } from '../GeometryManager.js';
import { MaterialManager } from '../MaterialManager.js';
// 1. Coin (Golden metallic spinning disc)
export class Coin {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const goldMat = MaterialManager.getMaterial(0xffd700, 0.2, 0.9); // Shiny gold metallic
        const coinMesh = new THREE.Mesh(GeometryManager.getCylinder(0.24, 0.24, 0.05, 12), goldMat);
        coinMesh.rotation.x = Math.PI / 2; // Face forward
        coinMesh.castShadow = true;
        this.mesh.add(coinMesh);
        // Inner ridge details
        const innerMesh = new THREE.Mesh(GeometryManager.getCylinder(0.14, 0.14, 0.06, 8), goldMat);
        innerMesh.rotation.x = Math.PI / 2;
        this.mesh.add(innerMesh);
    }
}
// 2. Crystal (Neon cyan glowing octahedron)
export class Crystal {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const cryMat = new THREE.MeshStandardMaterial({
            color: 0x00f5ff,
            emissive: 0x00f5ff,
            emissiveIntensity: 2.0,
            roughness: 0.1,
            metalness: 0.8,
        });
        // Double cones to form a stylized diamond
        const top = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.28, 4), cryMat);
        top.position.y = 0.14;
        const bottom = top.clone();
        bottom.rotation.x = Math.PI;
        bottom.position.y = -0.14;
        this.mesh.add(top, bottom);
    }
}
// 3. Magnet PowerUp (Classic red/silver U-magnet shape)
export class MagnetPowerUp {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const redMat = MaterialManager.getMaterial(0xd63031, 0.4, 0.5);
        const metalMat = MaterialManager.getMaterial(0xdfe6e9, 0.3, 0.8);
        // Base segment
        const base = new THREE.Mesh(GeometryManager.getBox(0.35, 0.1, 0.1), redMat);
        base.position.y = 0.1;
        this.mesh.add(base);
        // Left arm
        const leftArm = new THREE.Mesh(GeometryManager.getBox(0.1, 0.25, 0.1), redMat);
        leftArm.position.set(-0.125, 0.225, 0);
        // Right arm
        const rightArm = leftArm.clone();
        rightArm.position.x = 0.125;
        // Silver magnetic tips
        const tipL = new THREE.Mesh(GeometryManager.getBox(0.1, 0.08, 0.1), metalMat);
        tipL.position.set(-0.125, 0.365, 0);
        const tipR = tipL.clone();
        tipR.position.x = 0.125;
        this.mesh.add(leftArm, rightArm, tipL, tipR);
    }
}
// 4. Shield PowerUp (Metallic shield plate with central star)
export class ShieldPowerUp {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const blueMat = MaterialManager.getMaterial(0x0984e3, 0.3, 0.6);
        const goldMat = MaterialManager.getMaterial(0xffd700, 0.2, 0.8);
        // Main shield backing
        const back = new THREE.Mesh(GeometryManager.getCylinder(0.24, 0.24, 0.05, 6), blueMat);
        back.rotation.x = Math.PI / 2;
        back.castShadow = true;
        this.mesh.add(back);
        // Central golden core
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0xffea00,
            emissive: 0xffea00,
            emissiveIntensity: 1.5,
        });
        const core = new THREE.Mesh(GeometryManager.getSphere(0.11, 8, 8), coreMat);
        core.position.z = 0.04;
        this.mesh.add(core);
        const border = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 6, 12), goldMat);
        border.position.z = 0.02;
        this.mesh.add(border);
    }
}
// 5. Jetpack PowerUp (Dual booster cylinders with fire nozzles)
export class JetpackPowerUp {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const metalMat = MaterialManager.getMaterial(0x2d3436, 0.3, 0.8);
        const strapMat = MaterialManager.getMaterial(0x1e272e, 0.8, 0.0);
        const glowMat = new THREE.MeshStandardMaterial({
            color: 0xff3f34,
            emissive: 0xff3f34,
            emissiveIntensity: 2.0,
        });
        // Left thruster tank
        const tankL = new THREE.Mesh(GeometryManager.getCylinder(0.08, 0.08, 0.45, 8), metalMat);
        tankL.position.set(-0.11, 0.22, 0);
        // Right thruster tank
        const tankR = tankL.clone();
        tankR.position.x = 0.11;
        // Connecting belt strap
        const strap = new THREE.Mesh(GeometryManager.getBox(0.24, 0.08, 0.05), strapMat);
        strap.position.set(0, 0.22, 0.045);
        // Nozzles
        const nozzleGeo = GeometryManager.getCylinder(0.06, 0.045, 0.08, 8);
        const nozzleL = new THREE.Mesh(nozzleGeo, glowMat);
        nozzleL.position.set(-0.11, -0.05, 0);
        const nozzleR = nozzleL.clone();
        nozzleR.position.x = 0.11;
        this.mesh.add(tankL, tankR, strap, nozzleL, nozzleR);
    }
}

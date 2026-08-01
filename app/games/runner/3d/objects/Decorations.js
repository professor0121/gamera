import * as THREE from 'three';
import { GeometryManager } from '../GeometryManager.js';
import { MaterialManager } from '../MaterialManager.js';
// 1. Cloud (Grouped low-poly puffball spheres)
export class Cloud {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const cloudMat = MaterialManager.getMaterial(0xffffff, 0.9, 0.0);
        // Central core sphere
        const center = new THREE.Mesh(GeometryManager.getSphere(0.65, 8, 8), cloudMat);
        center.position.set(0, 0, 0);
        // Flanking puffballs
        const left = new THREE.Mesh(GeometryManager.getSphere(0.48, 8, 8), cloudMat);
        left.position.set(-0.55, -0.1, 0);
        const right = new THREE.Mesh(GeometryManager.getSphere(0.45, 8, 8), cloudMat);
        right.position.set(0.55, -0.12, 0);
        const top = new THREE.Mesh(GeometryManager.getSphere(0.4, 8, 8), cloudMat);
        top.position.set(0.1, 0.35, 0.05);
        this.mesh.add(center, left, right, top);
    }
}
// 2. Billboard Advertisement (Cyberpunk digital screen display)
export class Billboard {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const ironMat = MaterialManager.getMaterial(0x2d3436, 0.6, 0.5);
        // Pillar base pole
        const base = new THREE.Mesh(GeometryManager.getCylinder(0.06, 0.08, 1.4, 8), ironMat);
        base.position.y = 0.7;
        base.castShadow = true;
        this.mesh.add(base);
        // Screen frame
        const frame = new THREE.Mesh(GeometryManager.getBox(1.5, 0.8, 0.12), ironMat);
        frame.position.set(0, 1.7, 0);
        frame.castShadow = true;
        this.mesh.add(frame);
        // Neon emissive screen display panel
        const screenMat = new THREE.MeshStandardMaterial({
            color: 0xff007f, // Cyber Magenta
            emissive: 0xff007f,
            emissiveIntensity: 1.5,
        });
        const screen = new THREE.Mesh(GeometryManager.getBox(1.38, 0.68, 0.04), screenMat);
        screen.position.set(0, 1.7, 0.05);
        this.mesh.add(screen);
    }
}
// 3. Fire Hydrant (Red sidewalk hydrant with nozzle ports)
export class FireHydrant {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const redMat = MaterialManager.getMaterial(0xd63031, 0.5, 0.2);
        const metalMat = MaterialManager.getMaterial(0x636e72, 0.4, 0.8);
        // Main column
        const body = new THREE.Mesh(GeometryManager.getCylinder(0.12, 0.12, 0.45, 8), redMat);
        body.position.y = 0.225;
        body.castShadow = true;
        this.mesh.add(body);
        // Top cap dome
        const cap = new THREE.Mesh(GeometryManager.getSphere(0.12, 8, 8), redMat);
        cap.position.y = 0.45;
        this.mesh.add(cap);
        // Small nozzle connector plugs
        const plugGeo = GeometryManager.getCylinder(0.05, 0.05, 0.08, 8);
        const plugL = new THREE.Mesh(plugGeo, metalMat);
        plugL.rotation.z = Math.PI / 2;
        plugL.position.set(-0.13, 0.3, 0);
        const plugR = plugL.clone();
        plugR.position.x = 0.13;
        const plugF = new THREE.Mesh(GeometryManager.getCylinder(0.04, 0.04, 0.08, 8), metalMat);
        plugF.rotation.x = Math.PI / 2;
        plugF.position.set(0, 0.26, 0.13);
        this.mesh.add(plugL, plugR, plugF);
    }
}
// 4. Bench (Sidewalk bench with backrest slats)
export class Bench {
    mesh;
    constructor() {
        this.mesh = new THREE.Group();
        const woodMat = MaterialManager.getMaterial(0xcd853f, 0.9, 0.0);
        const ironMat = MaterialManager.getMaterial(0x2f3640, 0.5, 0.7);
        // Support frames legs
        const legGeo = GeometryManager.getBox(0.05, 0.4, 0.35);
        const legL = new THREE.Mesh(legGeo, ironMat);
        legL.position.set(-0.45, 0.2, 0);
        legL.castShadow = true;
        const legR = legL.clone();
        legR.position.x = 0.45;
        this.mesh.add(legL, legR);
        // Seat plank
        const seat = new THREE.Mesh(GeometryManager.getBox(1.0, 0.04, 0.36), woodMat);
        seat.position.set(0, 0.4, 0);
        seat.castShadow = true;
        this.mesh.add(seat);
        // Backrest supports
        const supportL = new THREE.Mesh(GeometryManager.getBox(0.04, 0.36, 0.04), ironMat);
        supportL.position.set(-0.45, 0.58, -0.16);
        supportL.rotation.x = -Math.PI / 12;
        const supportR = supportL.clone();
        supportR.position.x = 0.45;
        this.mesh.add(supportL, supportR);
        // Backrest slats
        const slat = new THREE.Mesh(GeometryManager.getBox(1.0, 0.15, 0.04), woodMat);
        slat.position.set(0, 0.66, -0.18);
        slat.rotation.x = -Math.PI / 12;
        slat.castShadow = true;
        this.mesh.add(slat);
    }
}

import * as THREE from 'three';
import { MaterialFactory, GeometryFactory } from './Utility.js';
export function buildMannequin(mesh, config) {
    const c = config.colors;
    const shirtMat = MaterialFactory.getMaterial(c.shirt, 0.4, 0.1);
    const skinMat = MaterialFactory.getMaterial(c.skin, 0.6, 0.0);
    const pantsMat = MaterialFactory.getMaterial(c.pants, 0.6, 0.0);
    const shoeMat = MaterialFactory.getMaterial(c.shoes, 0.5, 0.1);
    const whiteMat = MaterialFactory.getMaterial(0xffffff, 0.7, 0.0);
    const blackMat = MaterialFactory.getMaterial(0x111111, 0.9, 0.0);
    // 1. Torso Group (Hips/lower spine pivot)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.95;
    mesh.add(torsoGroup);
    // Abdomen Waist mesh
    const waist = new THREE.Mesh(GeometryFactory.getBox(0.24, 0.24, 0.18), shirtMat);
    waist.position.y = 0.08;
    waist.castShadow = true;
    torsoGroup.add(waist);
    // Pelvis/Hips Mesh (Pants upper region)
    const pelvis = new THREE.Mesh(GeometryFactory.getBox(0.28, 0.15, 0.2), pantsMat);
    pelvis.position.y = -0.06;
    pelvis.castShadow = true;
    torsoGroup.add(pelvis);
    // Contrast Belt
    const belt = new THREE.Mesh(GeometryFactory.getBox(0.29, 0.04, 0.21), blackMat);
    belt.position.y = 0.01;
    torsoGroup.add(belt);
    // Chest Mesh
    const chest = new THREE.Mesh(GeometryFactory.getBox(0.34, 0.30, 0.22), shirtMat);
    chest.position.y = 0.26;
    chest.castShadow = true;
    torsoGroup.add(chest);
    // 2. Neck & Head
    const neck = new THREE.Mesh(GeometryFactory.getCapsule(0.045, 0.12, 4, 8), skinMat);
    neck.position.set(0, 0.41, 0);
    torsoGroup.add(neck);
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.52, 0);
    torsoGroup.add(headGroup);
    const headMesh = new THREE.Mesh(GeometryFactory.getSphere(0.14, 12, 12), skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);
    // Glowing Neon Cyber-Visor
    const visorMat = new THREE.MeshStandardMaterial({
        color: 0x00f5ff,
        emissive: 0x00f5ff,
        emissiveIntensity: 1.8,
        roughness: 0.1,
        metalness: 0.9,
    });
    const visor = new THREE.Mesh(GeometryFactory.getBox(0.22, 0.05, 0.08), visorMat);
    visor.position.set(0, 0.03, 0.11);
    headGroup.add(visor);
    // Nose
    const nose = new THREE.Mesh(GeometryFactory.getBox(0.03, 0.05, 0.04), skinMat);
    nose.position.set(0, -0.01, 0.14);
    headGroup.add(nose);
    // Ears
    const leftEar = new THREE.Mesh(GeometryFactory.getSphere(0.03, 8, 8), skinMat);
    leftEar.position.set(-0.14, 0, 0);
    const rightEar = leftEar.clone();
    rightEar.position.x = 0.14;
    headGroup.add(leftEar, rightEar);
    // Backwards Baseball Cap
    const capDome = new THREE.Mesh(GeometryFactory.getSphere(0.148, 12, 12), shoeMat);
    capDome.position.y = 0.035;
    headGroup.add(capDome);
    const capBrim = new THREE.Mesh(GeometryFactory.getBox(0.13, 0.018, 0.12), shoeMat);
    capBrim.position.set(0, 0.045, -0.13);
    capBrim.rotation.x = 0.08;
    headGroup.add(capBrim);
    // Helper to assemble arms
    const makeArm = (isLeft) => {
        const dir = isLeft ? -1 : 1;
        const shoulder = new THREE.Group();
        shoulder.position.set(dir * 0.22, 0.32, 0);
        torsoGroup.add(shoulder);
        const shoulderBall = new THREE.Mesh(GeometryFactory.getSphere(0.06, 8, 8), shirtMat);
        shoulder.add(shoulderBall);
        const sleeveMesh = new THREE.Mesh(GeometryFactory.getCapsule(0.055, 0.12, 4, 8), shirtMat);
        sleeveMesh.position.y = -0.06;
        sleeveMesh.castShadow = true;
        shoulder.add(sleeveMesh);
        const bareUpperArm = new THREE.Mesh(GeometryFactory.getCapsule(0.05, 0.12, 4, 8), skinMat);
        bareUpperArm.position.y = -0.17;
        bareUpperArm.castShadow = true;
        shoulder.add(bareUpperArm);
        const elbow = new THREE.Group();
        elbow.position.set(0, -0.24, 0);
        shoulder.add(elbow);
        const elbowBall = new THREE.Mesh(GeometryFactory.getSphere(0.045, 8, 8), skinMat);
        elbow.add(elbowBall);
        const lowerArmGeo = GeometryFactory.getCapsule(0.04, 0.2, 4, 8);
        const lowerArm = new THREE.Mesh(lowerArmGeo, skinMat);
        lowerArm.position.y = -0.1;
        lowerArm.castShadow = true;
        elbow.add(lowerArm);
        if (isLeft) {
            const watch = new THREE.Mesh(GeometryFactory.getBox(0.055, 0.04, 0.055), MaterialFactory.getMaterial(0x00f5ff, 0.2, 0.8));
            watch.position.y = -0.17;
            elbow.add(watch);
        }
        const hand = new THREE.Mesh(GeometryFactory.getBox(0.04, 0.07, 0.04), skinMat);
        hand.position.y = -0.21;
        elbow.add(hand);
        return { shoulder, elbow };
    };
    // Helper to assemble legs
    const makeLeg = (isLeft) => {
        const dir = isLeft ? -1 : 1;
        const hip = new THREE.Group();
        hip.position.set(dir * 0.11, -0.08, 0);
        torsoGroup.add(hip);
        const hipBall = new THREE.Mesh(GeometryFactory.getSphere(0.07, 8, 8), pantsMat);
        hip.add(hipBall);
        const upperLegGeo = GeometryFactory.getCapsule(0.07, 0.32, 4, 8);
        const upperLeg = new THREE.Mesh(upperLegGeo, pantsMat);
        upperLeg.position.y = -0.16;
        upperLeg.castShadow = true;
        hip.add(upperLeg);
        const knee = new THREE.Group();
        knee.position.set(0, -0.32, 0);
        hip.add(knee);
        const kneeBall = new THREE.Mesh(GeometryFactory.getSphere(0.06, 8, 8), pantsMat);
        knee.add(kneeBall);
        const lowerPants = new THREE.Mesh(GeometryFactory.getCapsule(0.052, 0.16, 4, 8), pantsMat);
        lowerPants.position.y = -0.08;
        lowerPants.castShadow = true;
        knee.add(lowerPants);
        const sock = new THREE.Mesh(GeometryFactory.getCapsule(0.048, 0.14, 4, 8), whiteMat);
        sock.position.y = -0.22;
        sock.castShadow = true;
        knee.add(sock);
        const sneakerUpper = new THREE.Mesh(GeometryFactory.getBox(0.07, 0.05, 0.15), shoeMat);
        sneakerUpper.position.set(0, -0.30, 0.04);
        sneakerUpper.castShadow = true;
        knee.add(sneakerUpper);
        const sole = new THREE.Mesh(GeometryFactory.getBox(0.08, 0.02, 0.17), whiteMat);
        sole.position.set(0, -0.335, 0.04);
        sole.castShadow = true;
        knee.add(sole);
        return { hip, knee };
    };
    const leftArm = makeArm(true);
    const rightArm = makeArm(false);
    const leftLeg = makeLeg(true);
    const rightLeg = makeLeg(false);
    return {
        torso: torsoGroup,
        head: headGroup,
        leftShoulder: leftArm.shoulder,
        leftElbow: leftArm.elbow,
        rightShoulder: rightArm.shoulder,
        rightElbow: rightArm.elbow,
        leftHip: leftLeg.hip,
        leftKnee: leftLeg.knee,
        rightHip: rightLeg.hip,
        rightKnee: rightLeg.knee,
    };
}

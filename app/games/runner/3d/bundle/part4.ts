export const part4 = `
    // --- 9. ENVIRONMENTAL OBJECTS ---
    class RoadTile {
      constructor() {
        this.mesh = new THREE.Group();
        const roadMesh = new THREE.Mesh(GeometryManager.getBox(6.4, 0.1, CHUNK_SIZE), MaterialManager.getMaterial(0x181824, 0.9, 0.0));
        roadMesh.position.y = -0.05; roadMesh.receiveShadow = true; this.mesh.add(roadMesh);

        const leftCurb = new THREE.Mesh(GeometryManager.getBox(1.5, 0.2, CHUNK_SIZE), MaterialManager.getMaterial(0x2d323f, 0.7, 0.1));
        leftCurb.position.set(-3.95, 0.05, 0); leftCurb.receiveShadow = true; this.mesh.add(leftCurb);
        const rightCurb = leftCurb.clone(); rightCurb.position.x = 3.95; this.mesh.add(rightCurb);

        const lineMat = MaterialManager.getMaterial(0x00f5ff, 0.2, 0.9);
        for (let i = 0; i < 3; i++) {
          const zOffset = -CHUNK_SIZE / 2 + (i * CHUNK_SIZE) / 2.5 + 2.5;
          const line1 = new THREE.Mesh(GeometryManager.getBox(0.08, 0.11, 2.5), lineMat);
          line1.position.set(-1.0, 0.01, zOffset);
          const line2 = line1.clone(); line2.position.x = 1.0;
          this.mesh.add(line1, line2);
        }
      }
    }

    class StreetLamp {
      constructor() {
        this.mesh = new THREE.Group();
        const ironMat = MaterialManager.getMaterial(0x2a2a2a, 0.5, 0.6);
        const pole = new THREE.Mesh(GeometryManager.getCylinder(0.05, 0.07, 3.2, 8), ironMat);
        pole.position.y = 1.6; pole.castShadow = true; this.mesh.add(pole);
        const arm = new THREE.Mesh(GeometryManager.getBox(0.6, 0.08, 0.12), ironMat);
        arm.position.set(0.3, 3.2, 0); this.mesh.add(arm);

        const bulb = new THREE.Mesh(GeometryManager.getBox(0.3, 0.06, 0.2), new THREE.MeshStandardMaterial({ color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 3.0 }));
        bulb.position.set(0.5, 3.15, 0); this.mesh.add(bulb);
      }
    }

    class Skyscraper {
      constructor(height, color) {
        this.mesh = new THREE.Group();
        const body = new THREE.Mesh(GeometryManager.getBox(3.5, height, 3.5), MaterialManager.getMaterial(color, 0.7, 0.2));
        body.position.y = height / 2; body.castShadow = body.receiveShadow = true; this.mesh.add(body);

        const windowGeo = GeometryManager.getBox(0.2, 0.35, 0.02);
        const windowMat = new THREE.MeshStandardMaterial({ color: 0xffea00, emissive: 0xffea00, emissiveIntensity: 1.5 });
        const floors = Math.floor(height / 1.5) - 2;
        for (let f = 0; f < floors; f++) {
          const yOffset = 1.8 + f * 1.3;
          for (let w = 0; w < 3; w++) {
            const win = new THREE.Mesh(windowGeo, windowMat);
            win.position.set(-1.0 + w * 1.0, yOffset, 1.76);
            this.mesh.add(win);
          }
        }
      }
    }

    class Tree {
      constructor() {
        this.mesh = new THREE.Group();
        const trunk = new THREE.Mesh(GeometryManager.getCylinder(0.08, 0.12, 0.8, 8), MaterialManager.getMaterial(0x5a3d28, 0.9, 0.0));
        trunk.position.y = 0.4; trunk.castShadow = true; this.mesh.add(trunk);

        const leavesMat = MaterialManager.getMaterial(0x00b894, 0.8, 0.0);
        const cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.9, 6), leavesMat); cone1.position.y = 1.1; cone1.castShadow = true;
        const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 6), leavesMat); cone2.position.y = 1.6; cone2.castShadow = true;
        this.mesh.add(cone1, cone2);
      }
    }

    // --- 10. OBSTACLES, COLLECTIBLES & DECORATIONS ---
    class Crate {
      constructor() {
        this.mesh = new THREE.Group();
        const body = new THREE.Mesh(GeometryManager.getBox(0.8, 0.8, 0.8), MaterialManager.getMaterial(0xb06c42, 0.9, 0.0));
        body.position.y = 0.4; body.castShadow = body.receiveShadow = true; this.mesh.add(body);

        const plankX1 = new THREE.Mesh(GeometryManager.getBox(0.82, 0.1, 0.04), MaterialManager.getMaterial(0x784421, 0.9, 0.0));
        plankX1.position.set(0, 0.4, 0.4); plankX1.rotation.z = Math.PI / 4;
        const plankX2 = plankX1.clone(); plankX2.rotation.z = -Math.PI / 4;
        this.mesh.add(plankX1, plankX2);
      }
    }

    class Barrier {
      constructor() {
        this.mesh = new THREE.Group();
        const orangeMat = MaterialManager.getMaterial(0xff7675, 0.5, 0.1);
        const whiteMat = MaterialManager.getMaterial(0xffffff, 0.5, 0.1);
        const metalMat = MaterialManager.getMaterial(0x555555, 0.6, 0.7);

        const legL = new THREE.Mesh(GeometryManager.getBox(0.06, 0.9, 0.35), metalMat);
        legL.position.set(-0.6, 0.45, 0); legL.castShadow = true;
        const legR = legL.clone(); legR.position.x = 0.6;
        this.mesh.add(legL, legR);

        const panelTop = new THREE.Mesh(GeometryManager.getBox(1.3, 0.14, 0.06), orangeMat); panelTop.position.set(0, 0.72, 0); panelTop.castShadow = true;
        const panelBottom = new THREE.Mesh(GeometryManager.getBox(1.3, 0.14, 0.06), orangeMat); panelBottom.position.set(0, 0.42, 0); panelBottom.castShadow = true;

        const stripeGeo = GeometryManager.getBox(0.12, 0.15, 0.07);
        for (let i = 0; i < 3; i++) {
          const stripeT = new THREE.Mesh(stripeGeo, whiteMat); stripeT.position.set(-0.4 + i * 0.4, 0.72, 0);
          const stripeB = stripeT.clone(); stripeB.position.y = 0.42;
          this.mesh.add(stripeT, stripeB);
        }
        this.mesh.add(panelTop, panelBottom);
      }
    }

    class OilDrum {
      constructor() {
        this.mesh = new THREE.Group();
        const drumMat = MaterialManager.getMaterial(0xd63031, 0.5, 0.4);
        const blackMat = MaterialManager.getMaterial(0x222222, 0.8, 0.1);

        const body = new THREE.Mesh(GeometryManager.getCylinder(0.32, 0.32, 0.95, 12), drumMat);
        body.position.y = 0.475; body.castShadow = body.receiveShadow = true; this.mesh.add(body);

        const capTop = new THREE.Mesh(GeometryManager.getCylinder(0.325, 0.325, 0.04, 12), blackMat); capTop.position.y = 0.96;
        const capBottom = capTop.clone(); capBottom.position.y = 0.02;

        const rib1 = new THREE.Mesh(GeometryManager.getCylinder(0.34, 0.34, 0.05, 12), blackMat); rib1.position.y = 0.65;
        const rib2 = rib1.clone(); rib2.position.y = 0.3;
        this.mesh.add(capTop, capBottom, rib1, rib2);
      }
    }

    class LaserGate {
      constructor() {
        this.mesh = new THREE.Group();
        const darkMat = MaterialManager.getMaterial(0x2d3436, 0.4, 0.5);
        const towerL = new THREE.Mesh(GeometryManager.getBox(0.12, 1.8, 0.12), darkMat);
        towerL.position.set(-0.85, 0.9, 0); towerL.castShadow = true;
        const towerR = towerL.clone(); towerR.position.x = 0.85;
        this.mesh.add(towerL, towerR);

        const beam = new THREE.Mesh(GeometryManager.getCylinder(0.04, 0.04, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 2.5 }));
        beam.rotation.z = Math.PI / 2; beam.position.set(0, 1.35, 0); this.mesh.add(beam);
      }
    }

    class Coin {
      constructor() {
        this.mesh = new THREE.Group();
        const goldMat = MaterialManager.getMaterial(0xffd700, 0.2, 0.9);
        const coinMesh = new THREE.Mesh(GeometryManager.getCylinder(0.24, 0.24, 0.05, 12), goldMat);
        coinMesh.rotation.x = Math.PI / 2; coinMesh.castShadow = true; this.mesh.add(coinMesh);
        const innerMesh = new THREE.Mesh(GeometryManager.getCylinder(0.14, 0.14, 0.06, 8), goldMat);
        innerMesh.rotation.x = Math.PI / 2; this.mesh.add(innerMesh);
      }
    }

    class Crystal {
      constructor() {
        this.mesh = new THREE.Group();
        const cryMat = new THREE.MeshStandardMaterial({ color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.8 });
        const top = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.28, 4), cryMat); top.position.y = 0.14;
        const bottom = top.clone(); bottom.rotation.x = Math.PI; bottom.position.y = -0.14;
        this.mesh.add(top, bottom);
      }
    }

    class MagnetPowerUp {
      constructor() {
        this.mesh = new THREE.Group();
        const redMat = MaterialManager.getMaterial(0xd63031, 0.4, 0.5);
        const metalMat = MaterialManager.getMaterial(0xdfe6e9, 0.3, 0.8);
        const base = new THREE.Mesh(GeometryManager.getBox(0.35, 0.1, 0.1), redMat); base.position.y = 0.1; this.mesh.add(base);
        const leftArm = new THREE.Mesh(GeometryManager.getBox(0.1, 0.25, 0.1), redMat); leftArm.position.set(-0.125, 0.225, 0);
        const rightArm = leftArm.clone(); rightArm.position.x = 0.125;
        const tipL = new THREE.Mesh(GeometryManager.getBox(0.1, 0.08, 0.1), metalMat); tipL.position.set(-0.125, 0.365, 0);
        const tipR = tipL.clone(); tipR.position.x = 0.125;
        this.mesh.add(leftArm, rightArm, tipL, tipR);
      }
    }

    class ShieldPowerUp {
      constructor() {
        this.mesh = new THREE.Group();
        const blueMat = MaterialManager.getMaterial(0x0984e3, 0.3, 0.6);
        const goldMat = MaterialManager.getMaterial(0xffd700, 0.2, 0.8);
        const back = new THREE.Mesh(GeometryManager.getCylinder(0.24, 0.24, 0.05, 6), blueMat);
        back.rotation.x = Math.PI / 2; back.castShadow = true; this.mesh.add(back);
        const core = new THREE.Mesh(GeometryManager.getSphere(0.11, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffea00, emissive: 0xffea00, emissiveIntensity: 1.5 }));
        core.position.z = 0.04; this.mesh.add(core);
        const border = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 6, 12), goldMat);
        border.position.z = 0.02; this.mesh.add(border);
      }
    }

    class JetpackPowerUp {
      constructor() {
        this.mesh = new THREE.Group();
        const metalMat = MaterialManager.getMaterial(0x2d3436, 0.3, 0.8);
        const strapMat = MaterialManager.getMaterial(0x1e272e, 0.8, 0.0);
        const glowMat = new THREE.MeshStandardMaterial({ color: 0xff3f34, emissive: 0xff3f34, emissiveIntensity: 2.0 });
        const tankL = new THREE.Mesh(GeometryManager.getCylinder(0.08, 0.08, 0.45, 8), metalMat); tankL.position.set(-0.11, 0.22, 0);
        const tankR = tankL.clone(); tankR.position.x = 0.11;
        const strap = new THREE.Mesh(GeometryManager.getBox(0.24, 0.08, 0.05), strapMat); strap.position.set(0, 0.22, 0.045);
        const nozzleL = new THREE.Mesh(GeometryManager.getCylinder(0.06, 0.045, 0.08, 8), glowMat); nozzleL.position.set(-0.11, -0.05, 0);
        const nozzleR = nozzleL.clone(); nozzleR.position.x = 0.11;
        this.mesh.add(tankL, tankR, strap, nozzleL, nozzleR);
      }
    }

    class SkyDome {
      constructor() {
        this.mesh = new THREE.Group();
        this.mesh.add(new THREE.Mesh(new THREE.SphereGeometry(70, 16, 16), new THREE.MeshBasicMaterial({ color: 0x050510, side: THREE.BackSide })));
      }
    }
    class CitySkyline {
      constructor() {
        this.mesh = new THREE.Group();
        const silhouetteMat = MaterialManager.getMaterial(0x090918, 1.0, 0.0);
        for (let i = 0; i < 15; i++) {
          const width = 4.0 + Math.random() * 4.0; const height = 12.0 + Math.random() * 15.0;
          const tower = new THREE.Mesh(GeometryManager.getBox(width, height, 4.0), silhouetteMat);
          tower.position.set(-40 + i * 5.8 + (Math.random() - 0.5) * 1.5, height / 2 - 2, -45);
          this.mesh.add(tower);
        }
      }
    }
`;

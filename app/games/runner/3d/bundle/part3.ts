export const part3 = `
    // --- 6. MANNEQUIN BUILDER ---
    function buildMannequin(mesh, config) {
      const c = config.colors;
      const shirtMat = MaterialManager.getMaterial(c.shirt, 0.4, 0.1);
      const skinMat = MaterialManager.getMaterial(c.skin, 0.6, 0.0);
      const pantsMat = MaterialManager.getMaterial(c.pants, 0.6, 0.0);
      const shoeMat = MaterialManager.getMaterial(c.shoes, 0.5, 0.1);
      const whiteMat = MaterialManager.getMaterial(0xffffff, 0.7, 0.0);
      const blackMat = MaterialManager.getMaterial(0x111111, 0.9, 0.0);

      const torsoGroup = new THREE.Group();
      torsoGroup.position.y = 0.95;
      mesh.add(torsoGroup);

      const waist = new THREE.Mesh(GeometryManager.getBox(0.24, 0.24, 0.18), shirtMat);
      waist.position.y = 0.08; waist.castShadow = true;
      torsoGroup.add(waist);

      const pelvis = new THREE.Mesh(GeometryManager.getBox(0.28, 0.15, 0.2), pantsMat);
      pelvis.position.y = -0.06; pelvis.castShadow = true;
      torsoGroup.add(pelvis);

      const belt = new THREE.Mesh(GeometryManager.getBox(0.29, 0.04, 0.21), blackMat);
      belt.position.y = 0.01; torsoGroup.add(belt);

      const chest = new THREE.Mesh(GeometryManager.getBox(0.34, 0.30, 0.22), shirtMat);
      chest.position.y = 0.26; chest.castShadow = true;
      torsoGroup.add(chest);

      const neck = new THREE.Mesh(GeometryManager.getCapsule(0.045, 0.12, 4, 8), skinMat);
      neck.position.set(0, 0.41, 0); torsoGroup.add(neck);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.52, 0); torsoGroup.add(headGroup);

      const headMesh = new THREE.Mesh(GeometryManager.getSphere(0.14, 12, 12), skinMat);
      headMesh.castShadow = true; headGroup.add(headMesh);

      const visorMat = new THREE.MeshStandardMaterial({ color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 1.8, roughness: 0.1, metalness: 0.9 });
      const visor = new THREE.Mesh(GeometryManager.getBox(0.22, 0.05, 0.08), visorMat);
      visor.position.set(0, 0.03, 0.11); headGroup.add(visor);

      const nose = new THREE.Mesh(GeometryManager.getBox(0.03, 0.05, 0.04), skinMat);
      nose.position.set(0, -0.01, 0.14); headGroup.add(nose);

      const leftEar = new THREE.Mesh(GeometryManager.getSphere(0.03, 8, 8), skinMat);
      leftEar.position.set(-0.14, 0, 0);
      const rightEar = leftEar.clone(); rightEar.position.x = 0.14;
      headGroup.add(leftEar, rightEar);

      const capDome = new THREE.Mesh(GeometryManager.getSphere(0.148, 12, 12), shoeMat);
      capDome.position.y = 0.035; headGroup.add(capDome);

      const capBrim = new THREE.Mesh(GeometryManager.getBox(0.13, 0.018, 0.12), shoeMat);
      capBrim.position.set(0, 0.045, -0.13); capBrim.rotation.x = 0.08;
      headGroup.add(capBrim);

      const makeArm = (isLeft) => {
        const dir = isLeft ? -1 : 1;
        const shoulder = new THREE.Group();
        shoulder.position.set(dir * 0.22, 0.32, 0); torsoGroup.add(shoulder);
        shoulder.add(new THREE.Mesh(GeometryManager.getSphere(0.06, 8, 8), shirtMat));

        const sleeve = new THREE.Mesh(GeometryManager.getCapsule(0.055, 0.12, 4, 8), shirtMat);
        sleeve.position.y = -0.06; sleeve.castShadow = true; shoulder.add(sleeve);

        const skinArm = new THREE.Mesh(GeometryManager.getCapsule(0.05, 0.12, 4, 8), skinMat);
        skinArm.position.y = -0.17; skinArm.castShadow = true; shoulder.add(skinArm);

        const elbow = new THREE.Group(); elbow.position.set(0, -0.24, 0); shoulder.add(elbow);
        elbow.add(new THREE.Mesh(GeometryManager.getSphere(0.045, 8, 8), skinMat));

        const lowerArm = new THREE.Mesh(GeometryManager.getCapsule(0.04, 0.2, 4, 8), skinMat);
        lowerArm.position.y = -0.1; lowerArm.castShadow = true; elbow.add(lowerArm);

        if (isLeft) {
          const watch = new THREE.Mesh(GeometryManager.getBox(0.055, 0.04, 0.055), MaterialManager.getMaterial(0x00f5ff, 0.2, 0.8));
          watch.position.y = -0.17; elbow.add(watch);
        }
        const hand = new THREE.Mesh(GeometryManager.getBox(0.04, 0.07, 0.04), skinMat);
        hand.position.y = -0.21; elbow.add(hand);
        return { shoulder, elbow };
      };

      const makeLeg = (isLeft) => {
        const dir = isLeft ? -1 : 1;
        const hip = new THREE.Group(); hip.position.set(dir * 0.11, -0.08, 0); torsoGroup.add(hip);
        hip.add(new THREE.Mesh(GeometryManager.getSphere(0.07, 8, 8), pantsMat));

        const upperLeg = new THREE.Mesh(GeometryManager.getCapsule(0.07, 0.32, 4, 8), pantsMat);
        upperLeg.position.y = -0.16; upperLeg.castShadow = true; hip.add(upperLeg);

        const knee = new THREE.Group(); knee.position.set(0, -0.32, 0); hip.add(knee);
        knee.add(new THREE.Mesh(GeometryManager.getSphere(0.06, 8, 8), pantsMat));

        const lowerPants = new THREE.Mesh(GeometryManager.getCapsule(0.052, 0.16, 4, 8), pantsMat);
        lowerPants.position.y = -0.08; lowerPants.castShadow = true; knee.add(lowerPants);

        const sock = new THREE.Mesh(GeometryManager.getCapsule(0.048, 0.14, 4, 8), whiteMat);
        sock.position.y = -0.22; sock.castShadow = true; knee.add(sock);

        const sneaker = new THREE.Mesh(GeometryManager.getBox(0.07, 0.05, 0.15), shoeMat);
        sneaker.position.set(0, -0.30, 0.04); sneaker.castShadow = true; knee.add(sneaker);

        const sole = new THREE.Mesh(GeometryManager.getBox(0.08, 0.02, 0.17), whiteMat);
        sole.position.set(0, -0.335, 0.04); sole.castShadow = true; knee.add(sole);
        return { hip, knee };
      };

      const leftArm = makeArm(true); const rightArm = makeArm(false);
      const leftLeg = makeLeg(true); const rightLeg = makeLeg(false);

      return {
        torso: torsoGroup, head: headGroup, leftShoulder: leftArm.shoulder, leftElbow: leftArm.elbow,
        rightShoulder: rightArm.shoulder, rightElbow: rightArm.elbow,
        leftHip: leftLeg.hip, leftKnee: leftLeg.knee, rightHip: rightLeg.hip, rightKnee: rightLeg.knee
      };
    }

    // --- 7. HUMAN PLAYER ---
    class HumanPlayer {
      constructor(scene, customConfig) {
        this.config = { ...PLAYER_DEFAULTS, ...customConfig, colors: { ...PLAYER_DEFAULTS.colors, ...customConfig?.colors } };
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.mesh = new THREE.Group();
        this.mesh.castShadow = this.mesh.receiveShadow = true;
        scene.add(this.mesh);

        this.currentLane = 0; this.targetLane = 0;
        this.isJumping = this.isSliding = this.isMovingLeft = this.isMovingRight = false;
        this.slideTimer = 0;

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
        this.targetLane -= 1; this.isMovingLeft = true; this.isMovingRight = false;
        this.animController.setState('MOVE_LEFT');
      }
      moveRight() {
        if (this.targetLane >= 1) return;
        this.targetLane += 1; this.isMovingRight = true; this.isMovingLeft = false;
        this.animController.setState('MOVE_RIGHT');
      }
      setLane(laneIndex) {
        this.targetLane = clamp(laneIndex, -1, 1); this.currentLane = this.targetLane;
        this.position.x = this.targetLane * this.config.laneWidth;
        this.mesh.position.x = this.position.x;
      }
      playAnimation(state) { this.animController.setState(state); }
      reset() {
        this.position.set(0, 0, 0); this.velocity.set(0, 0, 0);
        this.currentLane = this.targetLane = 0;
        this.isJumping = this.isSliding = this.isMovingLeft = this.isMovingRight = false;
        this.mesh.position.set(0, 0, 0);
        this.joints.torso.position.y = 0.95;
        this.playAnimation('RUN');
      }
      update(delta) {
        if (this.isJumping) {
          this.velocity.y -= this.config.gravity * delta;
          this.position.y += this.velocity.y * delta;
          if (this.position.y <= 0) {
            this.position.y = 0; this.velocity.y = 0; this.isJumping = false;
            this.animController.setState(this.isSliding ? 'SLIDE' : 'RUN');
          }
        }
        if (this.isSliding) {
          this.slideTimer -= delta * 1000;
          if (this.slideTimer <= 0) {
            this.isSliding = false; this.slideTimer = 0;
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

    // --- 8. POOL MANAGER ---
    class PoolManager {
      constructor(scene) {
        this.scene = scene;
        this.roadTiles = [];
        this.obstaclePools = new Map();
        this.collectiblePools = new Map();

        for (let i = 0; i < 10; i++) {
          const tile = new RoadTile(); tile.mesh.visible = false;
          this.scene.add(tile.mesh); this.roadTiles.push(tile);
        }

        this.initObstaclePool('crate', () => new Crate().mesh, 12, 0.8, 0.8, 0.8);
        this.initObstaclePool('barrier', () => new Barrier().mesh, 8, 1.3, 0.9, 0.35);
        this.initObstaclePool('drum', () => new OilDrum().mesh, 8, 0.65, 0.95, 0.65);
        this.initObstaclePool('laser_gate', () => new LaserGate().mesh, 4, 1.8, 1.8, 0.3);

        this.initCollectiblePool('coin', () => new Coin().mesh, 30, 0.45, 0.45, 0.1);
        this.initCollectiblePool('crystal', () => new Crystal().mesh, 8, 0.36, 0.56, 0.36);
        this.initCollectiblePool('magnet', () => new MagnetPowerUp().mesh, 3, 0.35, 0.45, 0.1);
        this.initCollectiblePool('shield', () => new ShieldPowerUp().mesh, 3, 0.48, 0.48, 0.1);
        this.initCollectiblePool('jetpack', () => new JetpackPowerUp().mesh, 3, 0.3, 0.5, 0.2);
      }

      initObstaclePool(type, builder, count, w, h, d) {
        const list = [];
        for (let i = 0; i < count; i++) {
          const mesh = builder(); mesh.visible = false; this.scene.add(mesh);
          list.push({ type, mesh, lane: 0, z: 0, width: w, height: h, depth: d, active: false });
        }
        this.obstaclePools.set(type, list);
      }

      initCollectiblePool(type, builder, count, w, h, d) {
        const list = [];
        for (let i = 0; i < count; i++) {
          const mesh = builder(); mesh.visible = false; this.scene.add(mesh);
          list.push({ type, mesh, lane: 0, z: 0, width: w, height: h, depth: d, active: false });
        }
        this.collectiblePools.set(type, list);
      }

      borrowRoadTile() {
        const tile = this.roadTiles.find(t => !t.mesh.visible);
        if (tile) { tile.mesh.visible = true; return tile; }
        return null;
      }
      returnRoadTile(tile) {
        tile.mesh.visible = false;
        tile.mesh.position.set(0, -100, 0);
      }
      borrowObstacle(type) {
        const pool = this.obstaclePools.get(type);
        if (!pool) return null;
        const obj = pool.find(o => !o.active);
        if (obj) { obj.active = true; obj.mesh.visible = true; return obj; }
        return null;
      }
      returnObstacle(obj) { obj.active = false; obj.mesh.visible = false; obj.mesh.position.set(0, -1000, 0); }
      
      borrowCollectible(type) {
        const pool = this.collectiblePools.get(type);
        if (!pool) return null;
        const obj = pool.find(o => !o.active);
        if (obj) { obj.active = true; obj.mesh.visible = true; return obj; }
        return null;
      }
      returnCollectible(obj) { obj.active = false; obj.mesh.visible = false; obj.mesh.position.set(0, -1000, 0); }
    }
`;

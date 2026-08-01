export const part2 = `
    // --- 3. GEOMETRY MANAGER ---
    class GeometryManager {
      static geometries = new Map();
      static getBox(width, height, depth) {
        const key = \`box_\${width}_\${height}_\${depth}\`;
        if (this.geometries.has(key)) return this.geometries.get(key);
        const geo = new THREE.BoxGeometry(width, height, depth);
        this.geometries.set(key, geo);
        return geo;
      }
      static getCapsule(radius, length, capSegments, radialSegments) {
        const key = \`capsule_\${radius}_\${length}_\${capSegments}_\${radialSegments}\`;
        if (this.geometries.has(key)) return this.geometries.get(key);
        const geo = new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments);
        this.geometries.set(key, geo);
        return geo;
      }
      static getSphere(radius, widthSegments, heightSegments) {
        const key = \`sphere_\${radius}_\${widthSegments}_\${heightSegments}\`;
        if (this.geometries.has(key)) return this.geometries.get(key);
        const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        this.geometries.set(key, geo);
        return geo;
      }
      static getCylinder(radiusTop, radiusBottom, height, radialSegments) {
        const key = \`cyl_\${radiusTop}_\${radiusBottom}_\${height}_\${radialSegments}\`;
        if (this.geometries.has(key)) return this.geometries.get(key);
        const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        this.geometries.set(key, geo);
        return geo;
      }
    }

    // --- 4. MATERIAL MANAGER ---
    class MaterialManager {
      static materials = new Map();
      static weatherMode = 'DAY';
      static weatherParticles = null;
      static particleGeometry = null;
      static particlePositions = null;
      static particleCount = 500;

      static getMaterial(color, roughness = 0.5, metalness = 0.1, flatShading = true) {
        const key = \`\${color}_\${roughness}_\${metalness}_\${flatShading}\`;
        if (this.materials.has(key)) return this.materials.get(key);
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color), roughness, metalness, flatShading
        });
        this.materials.set(key, mat);
        return mat;
      }

      static setWeatherMode(mode, scene, ambientLight, dirLight) {
        this.weatherMode = mode;
        const preset = WEATHER_PRESETS[mode];
        ambientLight.color.setHex(preset.ambientColor);
        ambientLight.intensity = preset.ambientIntensity;
        dirLight.color.setHex(preset.dirColor);
        dirLight.intensity = preset.dirIntensity;
        scene.background = new THREE.Color(preset.skyColor);
        if (scene.fog && scene.fog instanceof THREE.FogExp2) {
          scene.fog.color.setHex(preset.fogColor);
          scene.fog.density = preset.fogDensity;
        }
        if (this.weatherParticles) scene.remove(this.weatherParticles);
        if (mode === 'RAIN' || mode === 'SNOW') this.createParticles(mode, scene);
      }

      static createParticles(mode, scene) {
        this.particleGeometry = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(this.particleCount * 3);
        for (let i = 0; i < this.particleCount; i++) {
          this.particlePositions[i * 3] = (Math.random() - 0.5) * 20;
          this.particlePositions[i * 3 + 1] = Math.random() * 15;
          this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        const color = mode === 'RAIN' ? 0x00a8ff : 0xffffff;
        const size = mode === 'RAIN' ? 0.05 : 0.12;
        const pMat = new THREE.PointsMaterial({ color: new THREE.Color(color), size, transparent: true, opacity: 0.65, depthWrite: false });
        this.weatherParticles = new THREE.Points(this.particleGeometry, pMat);
        scene.add(this.weatherParticles);
      }

      static updateWeather(delta, playerZ) {
        if (!this.weatherParticles || !this.particlePositions || !this.particleGeometry) return;
        const speed = this.weatherMode === 'RAIN' ? 18.0 : 4.0;
        const positions = this.particleGeometry.attributes.position.array;
        for (let i = 0; i < this.particleCount; i++) {
          positions[i * 3 + 1] -= speed * delta;
          if (this.weatherMode === 'SNOW') {
            positions[i * 3] += Math.sin(positions[i * 3 + 1] * 0.5) * 0.5 * delta;
          }
          if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] = 15.0;
            positions[i * 3] = (Math.random() - 0.5) * 20;
          }
          const relativeZ = positions[i * 3 + 2] - playerZ;
          if (relativeZ < -15) positions[i * 3 + 2] = playerZ + 15;
          else if (relativeZ > 15) positions[i * 3 + 2] = playerZ - 15;
        }
        this.particleGeometry.attributes.position.needsUpdate = true;
      }
    }

    // --- 5. ANIMATION CONTROLLER ---
    class AnimationController {
      constructor(joints, config) {
        this.joints = joints;
        this.config = config;
        this.currentState = 'IDLE';
        this.targetState = 'IDLE';
        this.time = 0;
        this.slideElapsed = 0;
        this.targets = new Map();
        this.targetTorsoY = 0;
        Object.keys(joints).forEach(key => this.targets.set(key, { x: 0, y: 0, z: 0 }));
      }
      setState(state) {
        this.targetState = state;
        if (state === 'SLIDE') this.slideElapsed = 0;
      }
      update(delta, isJumping, isSliding, yPos) {
        this.time += delta * this.config.animationSpeed * 6.0;
        this.currentState = this.targetState;
        this.targets.forEach(rot => { rot.x = 0; rot.y = 0; rot.z = 0; });
        this.targetTorsoY = 0;

        switch (this.currentState) {
          case 'IDLE': this.computeIdleTargets(); break;
          case 'RUN': this.computeRunTargets(); break;
          case 'JUMP': this.computeJumpTargets(); break;
          case 'SLIDE': this.slideElapsed += delta * 1000; this.computeSlideTargets(); break;
          case 'MOVE_LEFT': this.computeMoveTargets(-1); break;
          case 'MOVE_RIGHT': this.computeMoveTargets(1); break;
        }

        this.targets.forEach((targetRot, key) => {
          const joint = this.joints[key];
          joint.rotation.x = lerp(joint.rotation.x, targetRot.x, BLEND_SPEED);
          joint.rotation.y = lerp(joint.rotation.y, targetRot.y, BLEND_SPEED);
          joint.rotation.z = lerp(joint.rotation.z, targetRot.z, BLEND_SPEED);
        });
        this.joints.torso.position.y = lerp(this.joints.torso.position.y, 0.95 + this.targetTorsoY, BLEND_SPEED);
      }

      computeIdleTargets() {
        const breathe = Math.sin(this.time * 0.4);
        this.targetTorsoY = breathe * 0.02;
        const leftArm = this.targets.get('leftShoulder');
        leftArm.z = Math.PI / 16 + breathe * 0.02;
        leftArm.x = breathe * 0.05;
        const rightArm = this.targets.get('rightShoulder');
        rightArm.z = -Math.PI / 16 - breathe * 0.02;
        rightArm.x = -breathe * 0.05;
        this.targets.get('head').x = -breathe * 0.01;
      }

      computeRunTargets() {
        const cycle = this.time;
        const swingX = Math.sin(cycle);
        this.targetTorsoY = -Math.abs(Math.sin(cycle * 2)) * ANIMS.BODY_BOUNCE;
        this.targets.get('torso').y = swingX * 0.08;
        
        const leftArm = this.targets.get('leftShoulder');
        leftArm.x = swingX * ANIMS.ARM_SWING; leftArm.z = 0.15;
        const rightArm = this.targets.get('rightShoulder');
        rightArm.x = -swingX * ANIMS.ARM_SWING; rightArm.z = -0.15;

        this.targets.get('leftElbow').x = (swingX > 0 ? swingX : 0) * 0.5 + 0.2;
        this.targets.get('rightElbow').x = (swingX < 0 ? -swingX : 0) * 0.5 + 0.2;

        this.targets.get('leftHip').x = -swingX * ANIMS.LEG_SWING;
        this.targets.get('rightHip').x = swingX * ANIMS.LEG_SWING;
        this.targets.get('leftKnee').x = (swingX > 0 ? swingX : 0) * ANIMS.KNEE_BEND_FACTOR;
        this.targets.get('rightKnee').x = (swingX < 0 ? -swingX : 0) * ANIMS.KNEE_BEND_FACTOR;
      }

      computeJumpTargets() {
        const leftArm = this.targets.get('leftShoulder');
        leftArm.x = ANIMS.JUMP_ARM_X; leftArm.z = -Math.PI / 6;
        const rightArm = this.targets.get('rightShoulder');
        rightArm.x = ANIMS.JUMP_ARM_X; rightArm.z = Math.PI / 6;

        this.targets.get('leftHip').x = this.targets.get('rightHip').x = ANIMS.JUMP_LEG_X;
        this.targets.get('leftKnee').x = this.targets.get('rightKnee').x = ANIMS.JUMP_KNEE_X;
      }

      computeSlideTargets() {
        this.targetTorsoY = ANIMS.SLIDE_BODY_Y;
        this.targets.get('torso').x = ANIMS.SLIDE_BODY_X_ROT;
        this.targets.get('head').x = ANIMS.SLIDE_HEAD_X_ROT;

        const leftArm = this.targets.get('leftShoulder'); leftArm.x = ANIMS.SLIDE_ARM_X_ROT; leftArm.z = 0.1;
        const rightArm = this.targets.get('rightShoulder'); rightArm.x = ANIMS.SLIDE_ARM_X_ROT; rightArm.z = -0.1;

        const leftLeg = this.targets.get('leftHip'); leftLeg.x = ANIMS.SLIDE_LEG_X_ROT; leftLeg.z = 0.1;
        const rightLeg = this.targets.get('rightHip'); rightLeg.x = ANIMS.SLIDE_LEG_X_ROT; rightLeg.z = -0.1;

        this.targets.get('leftKnee').x = this.targets.get('rightKnee').x = ANIMS.SLIDE_KNEE_X_ROT;
      }

      computeMoveTargets(direction) {
        this.computeRunTargets();
        const torso = this.targets.get('torso');
        torso.z = -direction * ANIMS.LEAN_ANGLE;
        torso.y = direction * 0.1;
      }
    }
`;

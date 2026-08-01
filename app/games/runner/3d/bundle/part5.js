export const part5 = `
    // --- 11. GAME MANAGER ---
    class GameManager {
      constructor(scene, player, pool) {
        this.scene = scene; this.player = player; this.pool = pool;
        this.score = 0; this.coins = 0; this.gameState = 'START'; this.currentSpeed = 0;
        this.activeChunks = []; this.activeObstacles = []; this.activeCollectibles = [];
        this.nextChunkZ = 0; this.shieldTime = 0; this.magnetTime = 0; this.jetpackTime = 0; this.baseSpeed = 14.5;
        this.resetGame();
      }
      resetGame() {
        this.score = 0; this.coins = 0; this.baseSpeed = this.player.config.runSpeed; this.currentSpeed = this.baseSpeed;
        this.shieldTime = 0; this.magnetTime = 0; this.jetpackTime = 0; this.player.reset();

        this.activeChunks.forEach(c => this.pool.returnRoadTile(c)); this.activeChunks = [];
        this.activeObstacles.forEach(o => this.pool.returnObstacle(o)); this.activeObstacles = [];
        this.activeCollectibles.forEach(c => this.pool.returnCollectible(c)); this.activeCollectibles = [];
        this.nextChunkZ = 0;

        for (let i = 0; i < MAX_ACTIVE_CHUNKS; i++) this.spawnChunk(i < 3);
        this.gameState = 'START';
      }
      startGame() { this.resetGame(); this.gameState = 'PLAYING'; this.player.playAnimation('RUN'); }
      
      spawnChunk(isEmpty) {
        const tile = this.pool.borrowRoadTile();
        if (!tile) return;
        const zPos = this.nextChunkZ;
        tile.mesh.position.set(0, 0, zPos);
        this.activeChunks.push({ mesh: tile.mesh, z: zPos, active: true });
        this.nextChunkZ -= CHUNK_SIZE;

        if (!isEmpty) this.spawnEntitiesOnChunk(zPos);
      }

      spawnEntitiesOnChunk(chunkZ) {
        const laneWidth = this.player.config.laneWidth;
        const laneCenters = [-laneWidth, 0, laneWidth];
        const obstacleLane = Math.floor(Math.random() * 3);
        const obstacleZ = chunkZ + (Math.random() - 0.5) * (CHUNK_SIZE - 6);

        const types = ['crate', 'barrier', 'drum', 'laser_gate'];
        const rType = types[Math.floor(Math.random() * types.length)];
        const obs = this.pool.borrowObstacle(rType);
        if (obs) {
          obs.mesh.position.set(laneCenters[obstacleLane], 0.0, obstacleZ);
          obs.lane = obstacleLane - 1; obs.z = obstacleZ;
          this.activeObstacles.push(obs);
        }

        const coinLane = (obstacleLane + 1) % 3;
        for (let i = 0; i < 4; i++) {
          const coinZ = chunkZ - CHUNK_SIZE / 2 + (i * CHUNK_SIZE) / 4;
          const coin = this.pool.borrowCollectible('coin');
          if (coin) {
            coin.mesh.position.set(laneCenters[coinLane], 0.6, coinZ);
            coin.lane = coinLane - 1; coin.z = coinZ;
            this.activeCollectibles.push(coin);
          }
        }

        if (Math.random() < 0.22) {
          const powerLane = (obstacleLane + 2) % 3;
          const powerZ = chunkZ + (Math.random() - 0.5) * (CHUNK_SIZE - 8);
          const items = ['magnet', 'shield', 'jetpack', 'crystal'];
          const rItem = items[Math.floor(Math.random() * items.length)];
          const col = this.pool.borrowCollectible(rItem);
          if (col) {
            col.mesh.position.set(laneCenters[powerLane], 0.7, powerZ);
            col.lane = powerLane - 1; col.z = powerZ;
            this.activeCollectibles.push(col);
          }
        }
      }

      update(delta) {
        if (this.gameState !== 'PLAYING') return;
        this.baseSpeed = Math.min(25.0, this.baseSpeed + delta * 0.12);
        this.currentSpeed = this.jetpackTime > 0 ? this.baseSpeed * 1.8 : this.baseSpeed;
        this.player.position.z -= this.currentSpeed * delta;
        this.player.update(delta);

        if (this.shieldTime > 0) this.shieldTime -= delta;
        if (this.magnetTime > 0) this.magnetTime -= delta;
        if (this.jetpackTime > 0) {
          this.jetpackTime -= delta;
          this.player.position.y = lerp(this.player.position.y, 3.2, 5.0 * delta);
          if (this.jetpackTime <= 0) { this.player.isJumping = true; this.player.velocity.y = 0; }
        }

        this.score += Math.round(this.currentSpeed * delta * 2.5);
        const playerZ = this.player.position.z;

        this.activeChunks.forEach((chunk, index) => {
          if (chunk.mesh.position.z - playerZ > 30.0) {
            this.pool.returnRoadTile(chunk);
            this.activeChunks.splice(index, 1);
            this.spawnChunk(false);
          }
        });

        this.updateCollectibles(delta, playerZ);
        this.updateObstacles(delta, playerZ);
      }

      updateCollectibles(delta, playerZ) {
        for (let i = this.activeCollectibles.length - 1; i >= 0; i--) {
          const col = this.activeCollectibles[i];
          col.mesh.rotation.y += delta * 3.5;
          if (col.mesh.position.z - playerZ > 12.0) {
            this.pool.returnCollectible(col); this.activeCollectibles.splice(i, 1); continue;
          }
          if (this.magnetTime > 0 && col.type === 'coin') {
            const dist = col.mesh.position.distanceTo(this.player.position);
            if (dist < COIN_MAGNET_RANGE) col.mesh.position.lerp(this.player.position, 10.0 * delta);
          }
          const dx = Math.abs(col.mesh.position.x - this.player.position.x);
          const dy = Math.abs(col.mesh.position.y - this.player.position.y);
          const dz = Math.abs(col.mesh.position.z - this.player.position.z);
          if (dx < 0.6 && dy < 1.1 && dz < 0.6) {
            this.handleCollection(col); this.pool.returnCollectible(col); this.activeCollectibles.splice(i, 1);
          }
        }
      }

      handleCollection(col) {
        if (col.type === 'coin') { this.coins += 1; this.score += 50; }
        else if (col.type === 'crystal') { this.coins += 5; this.score += 250; }
        else if (col.type === 'shield') this.shieldTime = POWERUP_DURATION / 1000;
        else if (col.type === 'magnet') this.magnetTime = POWERUP_DURATION / 1000;
        else if (col.type === 'jetpack') this.jetpackTime = POWERUP_DURATION / 1000;
      }

      updateObstacles(delta, playerZ) {
        for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
          const obs = this.activeObstacles[i];
          if (obs.mesh.position.z - playerZ > 12.0) {
            this.pool.returnObstacle(obs); this.activeObstacles.splice(i, 1); continue;
          }
          if (this.jetpackTime > 0) continue;
          const dx = Math.abs(obs.mesh.position.x - this.player.position.x);
          const dy = Math.abs(obs.mesh.position.y - this.player.position.y);
          const dz = Math.abs(obs.mesh.position.z - this.player.position.z);
          const collisionHeight = obs.type === 'laser_gate' ? 1.0 : obs.height;
          const verticalOverlap = obs.type === 'laser_gate' ? (this.player.isSliding ? false : dy < 1.4) : (dy < (collisionHeight + 0.6) / 2);
          if (dx < (obs.width + 0.4) / 2 && verticalOverlap && dz < (obs.depth + 0.5) / 2) {
            if (this.shieldTime > 0) {
              this.shieldTime = 0; this.pool.returnObstacle(obs); this.activeObstacles.splice(i, 1);
            } else {
              this.gameState = 'GAME_OVER';
            }
          }
        }
      }
    }

    // --- 12. MAIN SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfdfff);
    scene.fog = new THREE.FogExp2(0xbfdfff, 0.02);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 150);
    camera.position.set(0, 4.3, 8.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 2.5; controls.maxDistance = 18;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3); scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(-5, 8, -5); dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5; dirLight.shadow.camera.far = 30;
    scene.add(dirLight);

    const player = new HumanPlayer(scene);
    const pool = new PoolManager(scene);
    const game = new GameManager(scene, player, pool);

    // Background Skyline
    scene.add(new SkyDome().mesh);
    scene.add(new CitySkyline().mesh);

    window.setWeather = (mode) => MaterialManager.setWeatherMode(mode, scene, ambientLight, dirLight);
    window.triggerAction = () => {
      if (game.gameState === 'START' || game.gameState === 'GAME_OVER') {
        game.startGame();
        document.getElementById('overlay-screen').style.display = 'none';
      }
    };

    window.setWeather('DAY');

    // Key Inputs
    window.addEventListener('keydown', (e) => {
      if (game.gameState !== 'PLAYING') return;
      const key = e.key.toLowerCase();
      if (key === 'a' || e.keyCode === 37) player.moveLeft();
      else if (key === 'd' || e.keyCode === 39) player.moveRight();
      else if (key === 'w' || key === ' ' || e.keyCode === 38) player.jump();
      else if (key === 's' || e.keyCode === 40) player.slide();
    });

    // Touch Controls
    let touchStartX = 0; let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY;
    });
    window.addEventListener('touchend', (e) => {
      if (game.gameState !== 'PLAYING') return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absX = Math.abs(dx); const absY = Math.abs(dy);

      if (absX < 35 && absY < 35) {
        const tapX = e.changedTouches[0].clientX;
        if (tapX < window.innerWidth * 0.4) player.moveLeft();
        else if (tapX > window.innerWidth * 0.6) player.moveRight();
        return;
      }
      if (absX > absY) {
        if (dx > 0) player.moveRight(); else player.moveLeft();
      } else {
        if (dy > 0) player.slide(); else player.jump();
      }
    });

    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (game.gameState === 'PLAYING') {
        game.update(delta);
        MaterialManager.updateWeather(delta, player.position.z);

        camera.position.set(0, 4.3, player.position.z + 8.2);
        camera.lookAt(0, 0.8, player.position.z - 1.8);

        dirLight.position.set(-5, 8, player.position.z - 5);
        dirLight.target = player.mesh;

        document.getElementById('hud-score').textContent = game.score;
        document.getElementById('hud-coins').textContent = game.coins;
        document.getElementById('hud-speed').textContent = game.currentSpeed.toFixed(1) + ' m/s';

        updatePowerupBar('shield-fill', game.shieldTime);
        updatePowerupBar('magnet-fill', game.magnetTime);
        updatePowerupBar('boost-fill', game.jetpackTime);
      } else if (game.gameState === 'GAME_OVER') {
        document.getElementById('overlay-screen').style.display = 'flex';
        document.getElementById('overlay-title').textContent = 'Crash! Game Over';
        document.getElementById('overlay-desc').innerHTML = \`Final Score: <b>\${game.score}</b><br>Coins: <b>\${game.coins}</b>\`;
        document.getElementById('overlay-btn').textContent = 'Restart Run';
      }

      if (game.gameState !== 'PLAYING') {
        controls.update();
      }
      renderer.render(scene, camera);
    }

    function updatePowerupBar(id, val) {
      const fill = document.getElementById(id);
      if (val > 0) {
        fill.parentElement.style.display = 'block';
        fill.style.width = (val / 9.0) * 100 + '%';
      } else {
        fill.parentElement.style.display = 'none';
      }
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
`;

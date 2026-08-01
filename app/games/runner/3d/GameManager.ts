import * as THREE from 'three';
import { HumanPlayer } from './HumanPlayer.js';
import { PoolManager } from './PoolManager.js';
import { MaterialManager } from './MaterialManager.js';
import { ActiveObject, EnvironmentChunk, WeatherState, PowerUpType } from './Types.js';
import { CHUNK_SIZE, MAX_ACTIVE_CHUNKS, COIN_MAGNET_RANGE, POWERUP_DURATION } from './Constants.js';
import { clamp, lerp } from './Utility.js';

export class GameManager {
  private scene: THREE.Scene;
  private player: HumanPlayer;
  private pool: PoolManager;
  
  // Game states
  public score = 0;
  public coins = 0;
  public gameState: 'START' | 'PLAYING' | 'GAME_OVER' = 'START';
  public currentSpeed = 0;

  // Active entities
  private activeChunks: EnvironmentChunk[] = [];
  private activeObstacles: ActiveObject[] = [];
  private activeCollectibles: ActiveObject[] = [];
  
  // Track chunk offset positions
  private nextChunkZ = 0;

  // Power-up durations (in seconds)
  public shieldTime = 0;
  public magnetTime = 0;
  public jetpackTime = 0;
  private baseSpeed = 14.5;

  constructor(scene: THREE.Scene, player: HumanPlayer, pool: PoolManager) {
    this.scene = scene;
    this.player = player;
    this.pool = pool;
    this.resetGame();
  }

  // Resets scoring metrics and restores player/terrain offsets
  public resetGame() {
    this.score = 0;
    this.coins = 0;
    this.baseSpeed = this.player.config.runSpeed;
    this.currentSpeed = this.baseSpeed;
    this.shieldTime = 0;
    this.magnetTime = 0;
    this.jetpackTime = 0;
    this.player.reset();

    // Recycle all active elements to their respective pools
    this.activeChunks.forEach(c => this.pool.returnRoadTile(c as any));
    this.activeChunks = [];
    
    this.activeObstacles.forEach(o => this.pool.returnObstacle(o));
    this.activeObstacles = [];
    
    this.activeCollectibles.forEach(c => this.pool.returnCollectible(c));
    this.activeCollectibles = [];

    this.nextChunkZ = 0;

    // Spawn initial empty road chunks ahead of player
    for (let i = 0; i < MAX_ACTIVE_CHUNKS; i++) {
      this.spawnChunk(i < 3); // Spawns empty for first 3 chunks to let player start safely
    }
    
    this.gameState = 'START';
  }

  public startGame() {
    this.resetGame();
    this.gameState = 'PLAYING';
    this.player.playAnimation('RUN');
  }

  private spawnChunk(isEmpty: boolean) {
    const tile = this.pool.borrowRoadTile();
    if (!tile) return;

    const zPos = this.nextChunkZ;
    tile.mesh.position.set(0, 0, zPos);
    this.activeChunks.push({ mesh: tile.mesh, z: zPos, active: true });

    this.nextChunkZ -= CHUNK_SIZE;

    // Spawn obstacles/coins pattern if not flagged as empty start zone
    if (!isEmpty) {
      this.spawnEntitiesOnChunk(zPos);
    }
  }

  // Generates obstacles and coins in lanes
  private spawnEntitiesOnChunk(chunkZ: number) {
    const laneWidth = this.player.config.laneWidth;
    const laneCenters = [-laneWidth, 0, laneWidth];

    // Select a random lane for the primary obstacle
    const obstacleLane = Math.floor(Math.random() * 3);
    const obstacleZ = chunkZ + (Math.random() - 0.5) * (CHUNK_SIZE - 6);

    // Randomize obstacle type (Crate, Barrier, Drum, or Slide-required LaserGate)
    const types = ['crate', 'barrier', 'drum', 'laser_gate'];
    const rType = types[Math.floor(Math.random() * types.length)];
    const obs = this.pool.borrowObstacle(rType);
    
    if (obs) {
      const yPos = rType === 'laser_gate' ? 0.0 : 0.0;
      obs.mesh.position.set(laneCenters[obstacleLane], yPos, obstacleZ);
      obs.lane = obstacleLane - 1; // map index to lane offset (-1, 0, 1)
      obs.z = obstacleZ;
      this.activeObstacles.push(obs);
    }

    // Spawn coins/crystals in the remaining lanes
    const coinLane = (obstacleLane + 1) % 3;
    const count = 4;
    for (let i = 0; i < count; i++) {
      const coinZ = chunkZ - CHUNK_SIZE / 2 + (i * CHUNK_SIZE) / count;
      const coin = this.pool.borrowCollectible('coin');
      if (coin) {
        coin.mesh.position.set(laneCenters[coinLane], 0.6, coinZ);
        coin.lane = coinLane - 1;
        coin.z = coinZ;
        this.activeCollectibles.push(coin);
      }
    }

    // Low probability to spawn powerups (Shield, Magnet, Jetpack) or crystals
    if (Math.random() < 0.22) {
      const powerLane = (obstacleLane + 2) % 3;
      const powerZ = chunkZ + (Math.random() - 0.5) * (CHUNK_SIZE - 8);
      const items = ['magnet', 'shield', 'jetpack', 'crystal'];
      const rItem = items[Math.floor(Math.random() * items.length)];
      const col = this.pool.borrowCollectible(rItem);
      if (col) {
        col.mesh.position.set(laneCenters[powerLane], 0.7, powerZ);
        col.lane = powerLane - 1;
        col.z = powerZ;
        this.activeCollectibles.push(col);
      }
    }
  }

  public update(delta: number) {
    if (this.gameState !== 'PLAYING') return;

    // 1. Move player forward (decreasing Z) with progressive difficulty speedup
    this.baseSpeed = Math.min(25.0, this.baseSpeed + delta * 0.12);
    this.currentSpeed = this.jetpackTime > 0 ? this.baseSpeed * 1.8 : this.baseSpeed;
    this.player.position.z -= this.currentSpeed * delta;
    this.player.update(delta);

    // Update powerup duration timers
    if (this.shieldTime > 0) this.shieldTime -= delta;
    if (this.magnetTime > 0) this.magnetTime -= delta;
    if (this.jetpackTime > 0) {
      this.jetpackTime -= delta;
      // Force flying altitude height
      this.player.position.y = lerp(this.player.position.y, 3.2, 5.0 * delta);
      if (this.jetpackTime <= 0) {
        this.player.isJumping = true; // Float down safely
        this.player.velocity.y = 0;
      }
    }

    // Accumulate distance score
    this.score += Math.round(this.currentSpeed * delta * 2.5);

    // 2. Manage road tile recycling
    const playerZ = this.player.position.z;
    this.activeChunks.forEach((chunk, index) => {
      // If chunk falls 30 units behind the player, recycle it ahead
      if (chunk.mesh.position.z - playerZ > 30.0) {
        this.pool.returnRoadTile(chunk as any);
        this.activeChunks.splice(index, 1);
        this.spawnChunk(false);
      }
    });

    // 3. Update collectibles & obstacles (Rotations, scrolling, and recycling)
    this.updateCollectibles(delta, playerZ);
    this.updateObstacles(delta, playerZ);
  }

  private updateCollectibles(delta: number, playerZ: number) {
    for (let i = this.activeCollectibles.length - 1; i >= 0; i--) {
      const col = this.activeCollectibles[i];

      // Rotate/float animations
      col.mesh.rotation.y += delta * 3.5;
      
      // Recycle collectibles left behind
      if (col.mesh.position.z - playerZ > 12.0) {
        this.pool.returnCollectible(col);
        this.activeCollectibles.splice(i, 1);
        continue;
      }

      // Coin Magnet Pull interpolation
      if (this.magnetTime > 0 && col.type === 'coin') {
        const dist = col.mesh.position.distanceTo(this.player.position);
        if (dist < COIN_MAGNET_RANGE) {
          col.mesh.position.lerp(this.player.position, 10.0 * delta);
        }
      }

      // Overlap collection check
      const dx = Math.abs(col.mesh.position.x - this.player.position.x);
      const dy = Math.abs(col.mesh.position.y - this.player.position.y);
      const dz = Math.abs(col.mesh.position.z - this.player.position.z);

      if (dx < 0.6 && dy < 1.1 && dz < 0.6) {
        this.handleCollection(col);
        this.pool.returnCollectible(col);
        this.activeCollectibles.splice(i, 1);
      }
    }
  }

  private handleCollection(col: ActiveObject) {
    if (col.type === 'coin') {
      this.coins += 1;
      this.score += 50;
    } else if (col.type === 'crystal') {
      this.coins += 5;
      this.score += 250;
    } else if (col.type === 'shield') {
      this.shieldTime = POWERUP_DURATION / 1000;
    } else if (col.type === 'magnet') {
      this.magnetTime = POWERUP_DURATION / 1000;
    } else if (col.type === 'jetpack') {
      this.jetpackTime = POWERUP_DURATION / 1000;
    }
  }

  private updateObstacles(delta: number, playerZ: number) {
    for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
      const obs = this.activeObstacles[i];

      // Recycle obstacles left behind
      if (obs.mesh.position.z - playerZ > 12.0) {
        this.pool.returnObstacle(obs);
        this.activeObstacles.splice(i, 1);
        continue;
      }

      // Skip collision calculations if player is flying high with Jetpack
      if (this.jetpackTime > 0) continue;

      // Box Collision Check
      const dx = Math.abs(obs.mesh.position.x - this.player.position.x);
      const dy = Math.abs(obs.mesh.position.y - this.player.position.y);
      const dz = Math.abs(obs.mesh.position.z - this.player.position.z);

      // Slide safety window for LaserGate (laser is placed at Y=1.35)
      const collisionHeight = obs.type === 'laser_gate' ? 1.0 : obs.height;
      const verticalOverlap = obs.type === 'laser_gate' 
        ? (this.player.isSliding ? false : dy < 1.4) 
        : (dy < (collisionHeight + 0.6) / 2);

      if (dx < (obs.width + 0.4) / 2 && verticalOverlap && dz < (obs.depth + 0.5) / 2) {
        if (this.shieldTime > 0) {
          // Shield absorbs crash, breaks invuln shield
          this.shieldTime = 0;
          this.pool.returnObstacle(obs);
          this.activeObstacles.splice(i, 1);
        } else {
          // Crash! Trigger Game Over state
          this.gameState = 'GAME_OVER';
        }
      }
    }
  }
}

import * as THREE from 'three';
import { RoadTile } from './objects/Environment.js';
import { Crate, Barrier, OilDrum, LaserGate } from './objects/Obstacles.js';
import { Coin, Crystal, MagnetPowerUp, ShieldPowerUp, JetpackPowerUp } from './objects/Collectibles.js';
import { ActiveObject } from './Types.js';

export class PoolManager {
  private scene: THREE.Scene;

  // Pools for road tiles
  private roadTiles: RoadTile[] = [];

  // Pools for obstacles
  private obstaclePools: Map<string, ActiveObject[]> = new Map();

  // Pools for collectibles
  private collectiblePools: Map<string, ActiveObject[]> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // 1. Pre-allocate 12 Road Tiles
    for (let i = 0; i < 12; i++) {
      const tile = new RoadTile();
      tile.mesh.visible = false;
      this.scene.add(tile.mesh);
      this.roadTiles.push(tile);
    }

    // 2. Pre-allocate Obstacles (Crates, Barriers, Drums, Gates)
    this.initObstaclePool('crate', () => new Crate().mesh, 15, 0.8, 0.8, 0.8);
    this.initObstaclePool('barrier', () => new Barrier().mesh, 10, 1.3, 0.9, 0.35);
    this.initObstaclePool('drum', () => new OilDrum().mesh, 10, 0.65, 0.95, 0.65);
    this.initObstaclePool('laser_gate', () => new LaserGate().mesh, 6, 1.8, 1.8, 0.3);

    // 3. Pre-allocate Collectibles (Coins, Crystals, Magnets, Shields, Jetpacks)
    this.initCollectiblePool('coin', () => new Coin().mesh, 40, 0.45, 0.45, 0.1);
    this.initCollectiblePool('crystal', () => new Crystal().mesh, 12, 0.36, 0.56, 0.36);
    this.initCollectiblePool('magnet', () => new MagnetPowerUp().mesh, 4, 0.35, 0.45, 0.1);
    this.initCollectiblePool('shield', () => new ShieldPowerUp().mesh, 4, 0.48, 0.48, 0.1);
    this.initCollectiblePool('jetpack', () => new JetpackPowerUp().mesh, 4, 0.3, 0.5, 0.2);
  }

  private initObstaclePool(type: string, builder: () => THREE.Group, count: number, w: number, h: number, d: number) {
    const list: ActiveObject[] = [];
    for (let i = 0; i < count; i++) {
      const mesh = builder();
      mesh.visible = false;
      this.scene.add(mesh);
      list.push({ type, mesh, lane: 0, z: 0, width: w, height: h, depth: d, active: false });
    }
    this.obstaclePools.set(type, list);
  }

  private initCollectiblePool(type: string, builder: () => THREE.Group, count: number, w: number, h: number, d: number) {
    const list: ActiveObject[] = [];
    for (let i = 0; i < count; i++) {
      const mesh = builder();
      mesh.visible = false;
      this.scene.add(mesh);
      list.push({ type, mesh, lane: 0, z: 0, width: w, height: h, depth: d, active: false });
    }
    this.collectiblePools.set(type, list);
  }

  // --- Road Tiles APIs ---
  borrowRoadTile(): RoadTile | null {
    const tile = this.roadTiles.find(t => !t.mesh.visible);
    if (tile) {
      tile.mesh.visible = true;
      return tile;
    }
    return null;
  }

  returnRoadTile(tile: RoadTile) {
    tile.mesh.visible = false;
    tile.mesh.position.set(0, -100, 0); // Hide offscreen
  }

  // --- Obstacles APIs ---
  borrowObstacle(type: string): ActiveObject | null {
    const pool = this.obstaclePools.get(type);
    if (!pool) return null;
    const obj = pool.find(o => !o.active);
    if (obj) {
      obj.active = true;
      obj.mesh.visible = true;
      return obj;
    }
    return null;
  }

  returnObstacle(obj: ActiveObject) {
    obj.active = false;
    obj.mesh.visible = false;
    obj.mesh.position.set(0, -1000, 0); // Hide offscreen
  }

  // --- Collectibles APIs ---
  borrowCollectible(type: string): ActiveObject | null {
    const pool = this.collectiblePools.get(type);
    if (!pool) return null;
    const obj = pool.find(o => !o.active);
    if (obj) {
      obj.active = true;
      obj.mesh.visible = true;
      return obj;
    }
    return null;
  }

  returnCollectible(obj: ActiveObject) {
    obj.active = false;
    obj.mesh.visible = false;
    obj.mesh.position.set(0, -1000, 0); // Hide offscreen
  }

  dispose() {
    this.roadTiles = [];
    this.obstaclePools.clear();
    this.collectiblePools.clear();
  }
}

import * as THREE from 'three';

export const lerp = (start: number, end: number, amt: number): number => {
  return (1 - amt) * start + amt * end;
};

export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};

// Reusable standard meshes materials factory to avoid GC allocations
export class MaterialFactory {
  private static materials: Map<string, THREE.Material> = new Map();

  static getMaterial(color: number, roughness = 0.5, metalness = 0.1): THREE.Material {
    const key = `${color}_${roughness}_${metalness}`;
    if (this.materials.has(key)) {
      return this.materials.get(key)!;
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness,
      metalness,
      flatShading: true, // Stylish low-poly look
    });

    this.materials.set(key, material);
    return material;
  }

  static dispose() {
    this.materials.forEach((material) => material.dispose());
    this.materials.clear();
  }
}

// Reusable geometries factory to avoid recreating geometry objects
export class GeometryFactory {
  private static geometries: Map<string, THREE.BufferGeometry> = new Map();

  static getBox(width: number, height: number, depth: number): THREE.BufferGeometry {
    const key = `box_${width}_${height}_${depth}`;
    if (this.geometries.has(key)) {
      return this.geometries.get(key)!;
    }

    const geo = new THREE.BoxGeometry(width, height, depth);
    this.geometries.set(key, geo);
    return geo;
  }

  static getCapsule(radius: number, length: number, capSegments: number, radialSegments: number): THREE.BufferGeometry {
    const key = `capsule_${radius}_${length}_${capSegments}_${radialSegments}`;
    if (this.geometries.has(key)) {
      return this.geometries.get(key)!;
    }

    const geo = new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments);
    this.geometries.set(key, geo);
    return geo;
  }

  static getSphere(radius: number, widthSegments: number, heightSegments: number): THREE.BufferGeometry {
    const key = `sphere_${radius}_${widthSegments}_${heightSegments}`;
    if (this.geometries.has(key)) {
      return this.geometries.get(key)!;
    }

    const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    this.geometries.set(key, geo);
    return geo;
  }

  static dispose() {
    this.geometries.forEach((geo) => geo.dispose());
    this.geometries.clear();
  }
}

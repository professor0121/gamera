import * as THREE from 'three';

export class GeometryManager {
  private static geometries: Map<string, THREE.BufferGeometry> = new Map();

  static getBox(width: number, height: number, depth: number): THREE.BoxGeometry {
    const key = `box_${width}_${height}_${depth}`;
    if (this.geometries.has(key)) {
      return this.geometries.get(key) as THREE.BoxGeometry;
    }
    const geo = new THREE.BoxGeometry(width, height, depth);
    this.geometries.set(key, geo);
    return geo;
  }

  static getCapsule(radius: number, length: number, capSegments: number, radialSegments: number): THREE.CapsuleGeometry {
    const key = `capsule_${radius}_${length}_${capSegments}_${radialSegments}`;
    if (this.geometries.has(key)) {
      return this.geometries.get(key) as THREE.CapsuleGeometry;
    }
    const geo = new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments);
    this.geometries.set(key, geo);
    return geo;
  }

  static getSphere(radius: number, widthSegments: number, heightSegments: number): THREE.SphereGeometry {
    const key = `sphere_${radius}_${widthSegments}_${heightSegments}`;
    if (this.geometries.has(key)) {
      return this.geometries.get(key) as THREE.SphereGeometry;
    }
    const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    this.geometries.set(key, geo);
    return geo;
  }

  static getCylinder(radiusTop: number, radiusBottom: number, height: number, radialSegments: number): THREE.CylinderGeometry {
    const key = `cyl_${radiusTop}_${radiusBottom}_${height}_${radialSegments}`;
    if (this.geometries.has(key)) {
      return this.geometries.get(key) as THREE.CylinderGeometry;
    }
    const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    this.geometries.set(key, geo);
    return geo;
  }

  static getPlane(width: number, height: number): THREE.PlaneGeometry {
    const key = `plane_${width}_${height}`;
    if (this.geometries.has(key)) {
      return this.geometries.get(key) as THREE.PlaneGeometry;
    }
    const geo = new THREE.PlaneGeometry(width, height);
    this.geometries.set(key, geo);
    return geo;
  }

  static dispose() {
    this.geometries.forEach(geo => geo.dispose());
    this.geometries.clear();
  }
}

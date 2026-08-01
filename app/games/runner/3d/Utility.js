import * as THREE from 'three';
export const lerp = (start, end, amt) => {
    return (1 - amt) * start + amt * end;
};
export const clamp = (val, min, max) => {
    return Math.max(min, Math.min(max, val));
};
// Reusable standard meshes materials factory to avoid GC allocations
export class MaterialFactory {
    static materials = new Map();
    static getMaterial(color, roughness = 0.5, metalness = 0.1) {
        const key = `${color}_${roughness}_${metalness}`;
        if (this.materials.has(key)) {
            return this.materials.get(key);
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
    static geometries = new Map();
    static getBox(width, height, depth) {
        const key = `box_${width}_${height}_${depth}`;
        if (this.geometries.has(key)) {
            return this.geometries.get(key);
        }
        const geo = new THREE.BoxGeometry(width, height, depth);
        this.geometries.set(key, geo);
        return geo;
    }
    static getCapsule(radius, length, capSegments, radialSegments) {
        const key = `capsule_${radius}_${length}_${capSegments}_${radialSegments}`;
        if (this.geometries.has(key)) {
            return this.geometries.get(key);
        }
        const geo = new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments);
        this.geometries.set(key, geo);
        return geo;
    }
    static getSphere(radius, widthSegments, heightSegments) {
        const key = `sphere_${radius}_${widthSegments}_${heightSegments}`;
        if (this.geometries.has(key)) {
            return this.geometries.get(key);
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

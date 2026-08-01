import * as THREE from 'three';
export class GeometryManager {
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
    static getCylinder(radiusTop, radiusBottom, height, radialSegments) {
        const key = `cyl_${radiusTop}_${radiusBottom}_${height}_${radialSegments}`;
        if (this.geometries.has(key)) {
            return this.geometries.get(key);
        }
        const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        this.geometries.set(key, geo);
        return geo;
    }
    static getPlane(width, height) {
        const key = `plane_${width}_${height}`;
        if (this.geometries.has(key)) {
            return this.geometries.get(key);
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

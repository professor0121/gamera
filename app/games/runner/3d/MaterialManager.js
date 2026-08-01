import * as THREE from 'three';
import { WEATHER_PRESETS } from './Constants.js';
export class MaterialManager {
    static materials = new Map();
    static weatherMode = 'DAY';
    // Weather particles elements
    static weatherParticles = null;
    static particleGeometry = null;
    static particlePositions = null;
    static particleCount = 600;
    static getMaterial(color, roughness = 0.5, metalness = 0.1, flatShading = true) {
        const key = `${color}_${roughness}_${metalness}_${flatShading}`;
        if (this.materials.has(key)) {
            return this.materials.get(key);
        }
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness,
            metalness,
            flatShading,
        });
        this.materials.set(key, material);
        return material;
    }
    // Configures active scene lights, fog, and particle layers for day/night weather states
    static setWeatherMode(mode, scene, ambientLight, dirLight) {
        this.weatherMode = mode;
        const preset = WEATHER_PRESETS[mode];
        // 1. Update lighting intensities
        ambientLight.color.setHex(preset.ambientColor);
        ambientLight.intensity = preset.ambientIntensity;
        dirLight.color.setHex(preset.dirColor);
        dirLight.intensity = preset.dirIntensity;
        // 2. Update Scene background and fog
        scene.background = new THREE.Color(preset.skyColor);
        if (scene.fog && scene.fog instanceof THREE.FogExp2) {
            scene.fog.color.setHex(preset.fogColor);
            scene.fog.density = preset.fogDensity;
        }
        // 3. Manage Weather Particles System
        if (this.weatherParticles) {
            scene.remove(this.weatherParticles);
        }
        if (mode === 'RAIN' || mode === 'SNOW') {
            this.createParticles(mode, scene);
        }
    }
    static createParticles(mode, scene) {
        this.particleGeometry = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(this.particleCount * 3);
        for (let i = 0; i < this.particleCount; i++) {
            // Scatter particles in a box around the player camera focus zone
            this.particlePositions[i * 3] = (Math.random() - 0.5) * 20; // X: -10 to 10
            this.particlePositions[i * 3 + 1] = Math.random() * 15; // Y: 0 to 15
            this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30; // Z: -15 to 15
        }
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        // Dynamic coloring/styling of weather drops
        const color = mode === 'RAIN' ? 0x00a8ff : 0xffffff;
        const size = mode === 'RAIN' ? 0.05 : 0.12;
        const pMat = new THREE.PointsMaterial({
            color: new THREE.Color(color),
            size,
            transparent: true,
            opacity: 0.65,
            depthWrite: false,
        });
        this.weatherParticles = new THREE.Points(this.particleGeometry, pMat);
        scene.add(this.weatherParticles);
    }
    // Animates the rain/snow drops falling down the viewport
    static updateWeather(delta, playerZ) {
        if (!this.weatherParticles || !this.particlePositions || !this.particleGeometry)
            return;
        const speed = this.weatherMode === 'RAIN' ? 18.0 : 4.0;
        const positions = this.particleGeometry.attributes.position.array;
        for (let i = 0; i < this.particleCount; i++) {
            // Y movement downward
            positions[i * 3 + 1] -= speed * delta;
            // Wind lateral drift for snow
            if (this.weatherMode === 'SNOW') {
                positions[i * 3] += Math.sin(positions[i * 3 + 1] * 0.5) * 0.5 * delta;
            }
            // If particle hits the floor, recycle it to the top
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 15.0;
                positions[i * 3] = (Math.random() - 0.5) * 20;
            }
            // Keep particles scroll box centered on player's Z coordinate
            const relativeZ = positions[i * 3 + 2] - playerZ;
            if (relativeZ < -15) {
                positions[i * 3 + 2] = playerZ + 15;
            }
            else if (relativeZ > 15) {
                positions[i * 3 + 2] = playerZ - 15;
            }
        }
        this.particleGeometry.attributes.position.needsUpdate = true;
    }
    static dispose() {
        this.materials.forEach(mat => mat.dispose());
        this.materials.clear();
        if (this.particleGeometry) {
            this.particleGeometry.dispose();
        }
        if (this.weatherParticles) {
            this.weatherParticles = null;
        }
    }
}

export const part1 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Cyber Runner 3D</title>
  <style>
    body {
      margin: 0; overflow: hidden; background-color: #030308;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #fff;
      user-select: none; -webkit-user-select: none;
    }
    canvas { display: block; }
    #hud-container {
      position: absolute; top: 15px; left: 15px;
      background: transparent; border: none;
      border-radius: 0px; padding: 0px; pointer-events: none;
      box-shadow: none; min-width: 160px;
    }
    #hud-container h2 {
      font-size: 11px; margin: 0 0 4px 0; color: #ff007f;
      text-transform: uppercase; letter-spacing: 1.5px;
    }
    #hud-container p { font-size: 12px; margin: 3px 0; }
    .val { font-weight: bold; color: #00f5ff; float: right; }
    #overlay-screen {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(4, 4, 8, 0.85); display: flex; flex-direction: column;
      justify-content: center; align-items: center; z-index: 10;
    }
    .btn {
      background: linear-gradient(135deg, #ff007f, #00f5ff); border: none;
      border-radius: 20px; padding: 10px 28px; font-size: 14px; font-weight: bold;
      color: #fff; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;
      box-shadow: 0 0 15px rgba(0, 245, 255, 0.4); margin-top: 15px;
    }
    #weather-controls {
      position: absolute; top: 15px; right: 15px; display: flex; gap: 6px;
    }
    .weather-btn {
      background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px; color: #fff; padding: 5px 10px; font-size: 10px;
      cursor: pointer; font-weight: bold; text-transform: uppercase;
    }
    .weather-btn:hover { background: rgba(0, 245, 255, 0.25); border-color: #00f5ff; }
    .pbar { height: 4px; background: rgba(255, 255, 255, 0.15); margin-top: 2px; border-radius: 2px; overflow: hidden; display: none; }
    .pbar-fill { height: 100%; width: 0%; background: #39ff14; }
  </style>

  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.180.0/build/three.module.js",
        "OrbitControls": "https://unpkg.com/three@0.180.0/examples/jsm/controls/OrbitControls.js"
      }
    }
  </script>
</head>
<body>

  <div id="hud-container">
    <h2>Cyber Runner HUD</h2>
    <p>Score: <span class="val" id="hud-score">0</span></p>
    <p>Coins: <span class="val" id="hud-coins" style="color:#ffd700;">0</span></p>
    <p>Speed: <span class="val" id="hud-speed">0.0 m/s</span></p>
    
    <div style="margin-top: 6px;" id="shield-row">
      <p style="font-size:9px; margin:0; letter-spacing:0.5px;">SHIELD ACTIVE</p>
      <div class="pbar" id="shield-bar" style="display:block;"><div class="pbar-fill" id="shield-fill" style="background:#ff0055;"></div></div>
    </div>
    <div style="margin-top: 4px;" id="magnet-row">
      <p style="font-size:9px; margin:0; letter-spacing:0.5px;">MAGNET ACTIVE</p>
      <div class="pbar" id="magnet-bar" style="display:block;"><div class="pbar-fill" id="magnet-fill" style="background:#00f5ff;"></div></div>
    </div>
    <div style="margin-top: 4px;" id="boost-row">
      <p style="font-size:9px; margin:0; letter-spacing:0.5px;">BOOST ACTIVE</p>
      <div class="pbar" id="boost-bar" style="display:block;"><div class="pbar-fill" id="boost-fill" style="background:#39ff14;"></div></div>
    </div>
  </div>

  <div id="weather-controls">
    <button class="weather-btn" onclick="setWeather('DAY')">Day</button>
    <button class="weather-btn" onclick="setWeather('NIGHT')">Night</button>
    <button class="weather-btn" onclick="setWeather('RAIN')">Rain</button>
    <button class="weather-btn" onclick="setWeather('SNOW')">Snow</button>
  </div>

  <div id="overlay-screen">
    <h1 id="overlay-title" style="margin:0 0 10px 0; font-size:26px; text-transform:uppercase; letter-spacing:2px; color:#ff007f;">Cyber Runner</h1>
    <p id="overlay-desc" style="margin:0 0 15px 0; color:#aaa; font-size:12px; text-align:center;">Swipe or tap left/right sides to change lanes!<br>Swipe up to jump, down to slide.</p>
    <button class="btn" id="overlay-btn" onclick="triggerAction()">Run Now</button>
  </div>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'OrbitControls';

    // --- 1. CONSTANTS ---
    const PLAYER_DEFAULTS = {
      runSpeed: 14.5, jumpHeight: 2.7, slideDuration: 750,
      laneWidth: 2, gravity: 30.0, animationSpeed: 2.4,
      colors: { skin: 0xffd2b3, shirt: 0x3366ff, pants: 0x222222, shoes: 0xff003c, eyes: 0x000000, hair: 0xffa500 }
    };
    const ANIMS = {
      ARM_SWING: 0.6, LEG_SWING: 0.6, BODY_BOUNCE: 0.05, KNEE_BEND_FACTOR: 0.8,
      JUMP_ARM_X: -1.2, JUMP_LEG_X: 0.25, JUMP_KNEE_X: 0.45,
      SLIDE_BODY_Y: -0.5, SLIDE_BODY_X_ROT: 0.5, SLIDE_HEAD_X_ROT: -0.4,
      SLIDE_ARM_X_ROT: 1.0, SLIDE_LEG_X_ROT: -1.1, SLIDE_KNEE_X_ROT: 1.4, LEAN_ANGLE: 0.25
    };
    const BLEND_SPEED = 0.15;
    const HORIZONTAL_SPEED = 18.0;
    const CHUNK_SIZE = 25.0;
    const MAX_ACTIVE_CHUNKS = 8;
    const SPAWN_DISTANCE = 40.0;
    const COIN_MAGNET_RANGE = 6.0;
    const POWERUP_DURATION = 9000;
    const WEATHER_PRESETS = {
      DAY: { skyColor: 0xbfdfff, ambientColor: 0xffffff, ambientIntensity: 1.3, dirColor: 0xffffff, dirIntensity: 1.5, fogColor: 0xbfdfff, fogDensity: 0.02 },
      NIGHT: { skyColor: 0x03030d, ambientColor: 0x111126, ambientIntensity: 0.3, dirColor: 0x5a638a, dirIntensity: 0.6, fogColor: 0x03030d, fogDensity: 0.035 },
      RAIN: { skyColor: 0x222830, ambientColor: 0x334455, ambientIntensity: 0.6, dirColor: 0x556677, dirIntensity: 0.7, fogColor: 0x222830, fogDensity: 0.045 },
      SNOW: { skyColor: 0xe2eaf5, ambientColor: 0x8aa2be, ambientIntensity: 0.9, dirColor: 0xffffff, dirIntensity: 0.9, fogColor: 0xe2eaf5, fogDensity: 0.03 }
    };

    // --- 2. MATH UTILITIES ---
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
`;

export const PLAYER_DEFAULTS = {
    runSpeed: 14.5,
    jumpHeight: 2.7,
    slideDuration: 750, // milliseconds
    laneWidth: 2, // distance between lanes (-2, 0, 2)
    gravity: 30.0, // downward acceleration
    animationSpeed: 2.4,
    colors: {
        skin: 0xffd2b3,
        shirt: 0x3366ff,
        pants: 0x222222,
        shoes: 0xff003c,
        eyes: 0x000000,
        hair: 0xffa500,
    },
};
export const ANIMS = {
    ARM_SWING: 0.6,
    LEG_SWING: 0.6,
    BODY_BOUNCE: 0.05,
    KNEE_BEND_FACTOR: 0.8,
    JUMP_ARM_X: -1.2,
    JUMP_LEG_X: 0.25,
    JUMP_KNEE_X: 0.45,
    SLIDE_BODY_Y: -0.5,
    SLIDE_BODY_X_ROT: 0.5,
    SLIDE_HEAD_X_ROT: -0.4,
    SLIDE_ARM_X_ROT: 1.0,
    SLIDE_LEG_X_ROT: -1.1,
    SLIDE_KNEE_X_ROT: 1.4,
    LEAN_ANGLE: 0.25,
};
export const BLEND_SPEED = 0.15;
export const LANE_LIMITS = {
    LEFT: -2,
    CENTER: 0,
    RIGHT: 2,
};
export const HORIZONTAL_SPEED = 18.0;
// Game & Spawning configurations
export const CHUNK_SIZE = 25.0; // Length of a single environmental chunk
export const MAX_ACTIVE_CHUNKS = 8;
export const SPAWN_DISTANCE = 40.0; // Distance ahead of player to spawn obstacles
export const COIN_MAGNET_RANGE = 6.0;
export const POWERUP_DURATION = 9000; // 9 seconds
// Colors and Intensities for environmental weather states
export const WEATHER_PRESETS = {
    DAY: {
        skyColor: 0xbfdfff,
        ambientColor: 0xffffff,
        ambientIntensity: 1.3,
        dirColor: 0xffffff,
        dirIntensity: 1.5,
        fogColor: 0xbfdfff,
        fogDensity: 0.02,
    },
    NIGHT: {
        skyColor: 0x03030d,
        ambientColor: 0x111126,
        ambientIntensity: 0.3,
        dirColor: 0x5a638a,
        dirIntensity: 0.6,
        fogColor: 0x03030d,
        fogDensity: 0.035,
    },
    RAIN: {
        skyColor: 0x222830,
        ambientColor: 0x334455,
        ambientIntensity: 0.6,
        dirColor: 0x556677,
        dirIntensity: 0.7,
        fogColor: 0x222830,
        fogDensity: 0.045,
    },
    SNOW: {
        skyColor: 0xe2eaf5,
        ambientColor: 0x8aa2be,
        ambientIntensity: 0.9,
        dirColor: 0xffffff,
        dirIntensity: 0.9,
        fogColor: 0xe2eaf5,
        fogDensity: 0.03,
    },
};

/**
 * Game configuration constants matching the Vivid Arcade theme from StitchMCP.
 * All colors, texts, typography, layouts, and physics parameters are defined here
 * to avoid hardcoded/fixed text or numbers in the game file.
 */

export const COLORS = {
  // Theme foundation
  BACKGROUND: '#0A0A0A',
  SURFACE: '#141218',
  SURFACE_CONTAINER: '#211f24',
  SURFACE_CONTAINER_HIGH: '#2b292f',

  // Brand Neon colors
  PRIMARY: '#cfbcff',          // Soft lavender glow
  PRIMARY_GLOW: 'rgba(207, 188, 255, 0.4)',
  SECONDARY: '#cdc0e9',
  TERTIARY: '#e7c365',         // Amber/gold accent
  TERTIARY_GLOW: 'rgba(231, 195, 101, 0.4)',
  ACCENT_CYAN: '#00F5FF',      // Electric Cyan
  ACCENT_CYAN_GLOW: 'rgba(0, 245, 255, 0.4)',

  // Gradients (Electric Sunset)
  GRADIENT_START: '#6750a4',   // Deep Violet
  GRADIENT_END: '#ec4899',     // Neon Pink

  // UI texts
  TEXT_PRIMARY: '#e6e0e9',
  TEXT_MUTED: '#cbc4d2',
  TEXT_ON_PRIMARY: '#381e72',

  // Translucent overlays (Glassmorphism)
  GLASS_FILL: 'rgba(255, 255, 255, 0.05)',
  GLASS_BORDER: 'rgba(255, 255, 255, 0.1)',
  GLASS_GLOW_SHADOW: 'rgba(103, 80, 164, 0.2)', // Purple tint shadow

  // Physics representation
  PIPE_GLOW: '#cfbcff',
};

export const PHYSICS = {
  GRAVITY: 0.7,
  JUMP_VELOCITY: -6.5,
  PIPE_SPEED: -3.5,
  PIPE_GAP: 200,               // Vertical gap between pipes
  PIPE_WIDTH: 65,
  PIPE_MIN_HEIGHT: 60,
  PIPE_SPAWN_SPACING: 250,     // Horizontal spacing between pipes
  BIRD_WIDTH: 40,
  BIRD_HEIGHT: 32,
  BIRD_START_X: 100,
  FLOOR_HEIGHT: 80,
  CEILING_HEIGHT: 10,
};

export const STRINGS = {
  // Game titles & UI strings
  GAME_TITLE: 'FLAPPY NEON',
  GAME_SUBTITLE: 'Vivid Arcade Edition',
  START_INSTRUCTION: 'TAP TO FLAP',
  SCORE_LABEL: 'SCORE',
  BEST_LABEL: 'BEST',
  GAME_OVER: 'GAME OVER',
  PAUSE_TITLE: 'PAUSED',
  RESUME: 'RESUME',
  RESTART: 'RESTART',
  EXIT: 'QUIT',
  CRASHED: 'CRASHED!',
  HIGH_SCORE_STORAGE_KEY: '@flappy_neon_high_score_v1',

  // Home selector text
  PLAY_NOW: 'PLAY',
  CHALLENGE_TITLE: 'Neon Flapping Challenge',
  CHALLENGE_DESC: 'Fly through glowing pipelines in a cyber-punk landscape. Avoid the neon grid!',
};

export const AD_CONSTANTS = {
  TITLE: 'SPATIAL RACER NEON',
  SUBTITLE: 'SPONSORED TRANSMISSION',
  DESCRIPTION: 'Pre-order the ultimate high-speed hover race. Feel the vector draft, escape the grid, and break the light speed barrier.',
  CTA: 'INSTALL NOW',
  COUNTDOWN_DURATION: 3, // seconds before user can close the ad
};

export const DEV_CONSTANTS = {
  ALIAS: 'ABHISHEK KUSHWAHA',
  ROLE: 'CORE NODE ARCHITECT',
  BIO: 'Designing high-fidelity retro-future gaming systems, rigid-body physics pipelines, and state routing stores.',
  GITHUB: 'professor0121',
  EMAIL: 'abhishekkushwahaak0121@gmail.com',
  GITHUB_URL: 'https://github.com/professor0121',
  LINKEDIN_URL: 'https://www.linkedin.com/in/abhishek-kushwaha-5a3a49302/',
  GMAIL_URL: 'mailto:abhishekkushwahaak0121@gmail.com',
  INSTAGRAM_URL: 'https://instagram.com/abhishek_kushwaha_2706',
  SKILLS: [
    { label: 'UI Engineering (React Native)', percentage: 98, color: COLORS.PRIMARY },
    { label: 'Physics Simulation (Matter.js)', percentage: 92, color: COLORS.ACCENT_CYAN },
    { label: 'Application State (Zustand)', percentage: 95, color: COLORS.TERTIARY },
    { label: 'Route Navigation (Expo Router)', percentage: 89, color: COLORS.GRADIENT_END },
  ]
};



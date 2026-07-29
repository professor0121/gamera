import { Dimensions } from 'react-native';
import Matter from 'matter-js';
import { PHYSICS } from '@/constants/gameConfig';
import { Pipe } from './renderers';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PhysicsSystem = (entities: any, { time }: any) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

export const JumpSystem = (entities: any, { touches }: any) => {
  const bird = entities.bird.body;
  const press = touches.find((t: any) => t.type === 'press');
  if (press) {
    Matter.Body.setVelocity(bird, { x: 0, y: PHYSICS.JUMP_VELOCITY });
  }
  return entities;
};

export const ObstacleSystem = (entities: any, { dispatch }: any) => {
  const world = entities.physics.world;
  
  // 1. Move active pipes
  const pipeKeys = Object.keys(entities).filter(key => key.startsWith('pipe'));
  pipeKeys.forEach(key => {
    const entity = entities[key];
    const body = entity.body;
    Matter.Body.setPosition(body, {
      x: body.position.x + PHYSICS.PIPE_SPEED,
      y: body.position.y,
    });
  });

  // 2. Cleanup offscreen pipes
  pipeKeys.forEach(key => {
    const entity = entities[key];
    if (!entity) return;
    const body = entity.body;
    if (body.position.x < -PHYSICS.PIPE_WIDTH) {
      Matter.World.remove(world, body);
      delete entities[key];
    }
  });

  // 3. Spawn new pipes
  let maxX = 0;
  pipeKeys.forEach(key => {
    const entity = entities[key];
    if (!entity) return;
    const body = entity.body;
    if (body.position.x > maxX) {
      maxX = body.position.x;
    }
  });

  if (maxX === 0 || maxX < SCREEN_WIDTH - PHYSICS.PIPE_SPAWN_SPACING) {
    entities.physics.pipeCount = (entities.physics.pipeCount || 0) + 1;
    const pipeId = entities.physics.pipeCount;

    const minHeight = PHYSICS.PIPE_MIN_HEIGHT;
    const maxHeight = SCREEN_HEIGHT - PHYSICS.FLOOR_HEIGHT - PHYSICS.PIPE_GAP - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    const bottomHeight = SCREEN_HEIGHT - PHYSICS.FLOOR_HEIGHT - PHYSICS.PIPE_GAP - topHeight;

    const topPipeBody = Matter.Bodies.rectangle(
      SCREEN_WIDTH + PHYSICS.PIPE_WIDTH / 2,
      topHeight / 2,
      PHYSICS.PIPE_WIDTH,
      topHeight,
      { isStatic: true, label: 'pipe' }
    );

    const bottomPipeBody = Matter.Bodies.rectangle(
      SCREEN_WIDTH + PHYSICS.PIPE_WIDTH / 2,
      SCREEN_HEIGHT - PHYSICS.FLOOR_HEIGHT - bottomHeight / 2,
      PHYSICS.PIPE_WIDTH,
      bottomHeight,
      { isStatic: true, label: 'pipe' }
    );

    Matter.World.add(world, [topPipeBody, bottomPipeBody]);

    entities[`pipeTop_${pipeId}`] = {
      body: topPipeBody,
      size: [PHYSICS.PIPE_WIDTH, topHeight],
      type: 'top',
      scored: false,
      pipeId,
      renderer: Pipe,
    };

    entities[`pipeBottom_${pipeId}`] = {
      body: bottomPipeBody,
      size: [PHYSICS.PIPE_WIDTH, bottomHeight],
      type: 'bottom',
      pipeId,
      renderer: Pipe,
    };
  }

  // 4. Update Score
  const bird = entities.bird.body;
  const topPipes = Object.keys(entities)
    .filter(key => key.startsWith('pipeTop_'))
    .map(key => entities[key]);

  topPipes.forEach(pipe => {
    if (!pipe.scored && pipe.body.position.x < bird.position.x) {
      pipe.scored = true;
      dispatch({ type: 'score' });
    }
  });

  // 5. Collision Checks
  const birdBody = entities.bird.body;
  const floorBody = entities.floor.body;

  if (Matter.Query.collides(birdBody, [floorBody]).length > 0) {
    dispatch({ type: 'game_over' });
  }

  const allPipeBodies = Object.keys(entities)
    .filter(key => key.startsWith('pipe'))
    .map(key => entities[key].body);

  if (Matter.Query.collides(birdBody, allPipeBodies).length > 0) {
    dispatch({ type: 'game_over' });
  }

  return entities;
};

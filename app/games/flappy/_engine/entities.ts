import { Dimensions } from 'react-native';
import Matter from 'matter-js';
import { PHYSICS } from '@/constants/gameConfig';
import { Bird, Floor, Ceiling } from './renderers';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const setupInitialEntities = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.gravity.y = PHYSICS.GRAVITY;

  const birdBody = Matter.Bodies.rectangle(
    PHYSICS.BIRD_START_X,
    SCREEN_HEIGHT / 3,
    PHYSICS.BIRD_WIDTH,
    PHYSICS.BIRD_HEIGHT,
    { label: 'bird' }
  );

  const floorBody = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    SCREEN_HEIGHT - PHYSICS.FLOOR_HEIGHT / 2,
    SCREEN_WIDTH,
    PHYSICS.FLOOR_HEIGHT,
    { isStatic: true, label: 'floor' }
  );

  const ceilingBody = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    PHYSICS.CEILING_HEIGHT / 2,
    SCREEN_WIDTH,
    PHYSICS.CEILING_HEIGHT,
    { isStatic: true, label: 'ceiling' }
  );

  Matter.World.add(world, [birdBody, floorBody, ceilingBody]);

  return {
    physics: { engine, world, pipeCount: 0 },
    bird: { body: birdBody, size: [PHYSICS.BIRD_WIDTH, PHYSICS.BIRD_HEIGHT], renderer: Bird },
    floor: { body: floorBody, size: [SCREEN_WIDTH, PHYSICS.FLOOR_HEIGHT], renderer: Floor },
    ceiling: { body: ceilingBody, size: [SCREEN_WIDTH, PHYSICS.CEILING_HEIGHT], renderer: Ceiling },
  };
};

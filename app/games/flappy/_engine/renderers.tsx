import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/gameConfig';

export const Bird = (props: any) => {
  const { body, size } = props;
  const width = size[0];
  const height = size[1];
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  // Rotation based on downward velocity
  const rotation = Math.min(Math.max(body.velocity.y * 3.5, -25), 70);

  return (
    <View
      style={[
        styles.bird,
        {
          left: x,
          top: y,
          width: width,
          height: height,
          transform: [{ rotate: `${rotation}deg` }],
        },
      ]}
    >
      {/* Eye */}
      <View style={styles.birdEye}>
        <View style={styles.birdPupil} />
      </View>
      {/* Wing */}
      <View style={styles.birdWing} />
    </View>
  );
};

export const Pipe = (props: any) => {
  const { body, size, type } = props;
  const width = size[0];
  const height = size[1];
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={[
        styles.pipe,
        {
          left: x,
          top: y,
          width: width,
          height: height,
        },
      ]}
    >
      {/* Glow cap */}
      <View
        style={[
          styles.pipeCap,
          type === 'top' ? { bottom: 0 } : { top: 0 },
        ]}
      />
    </View>
  );
};

export const Floor = (props: any) => {
  const { body, size } = props;
  const width = size[0];
  const height = size[1];
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={[
        styles.floor,
        {
          left: x,
          top: y,
          width: width,
          height: height,
        },
      ]}
    >
      {/* Grid Pattern Lines */}
      <View style={styles.floorGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={styles.floorGridLine} />
        ))}
      </View>
    </View>
  );
};

export const Ceiling = (props: any) => {
  const { body, size } = props;
  const width = size[0];
  const height = size[1];
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={[
        styles.ceiling,
        {
          left: x,
          top: y,
          width: width,
          height: height,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  bird: {
    position: 'absolute',
    borderRadius: 16,
    backgroundColor: COLORS.GRADIENT_END, // Pink
    borderColor: COLORS.PRIMARY,          // Lavender
    borderWidth: 2,
    shadowColor: COLORS.GRADIENT_END,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  birdEye: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  birdPupil: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#000',
  },
  birdWing: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 14,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.GRADIENT_START, // Violet
    borderColor: COLORS.GLASS_BORDER,
    borderWidth: 1,
  },
  pipe: {
    position: 'absolute',
    backgroundColor: COLORS.SURFACE_CONTAINER,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
    borderRadius: 6,
  },
  pipeCap: {
    position: 'absolute',
    left: -4,
    right: -4,
    height: 24,
    backgroundColor: COLORS.SURFACE_CONTAINER_HIGH,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    borderRadius: 4,
  },
  floor: {
    position: 'absolute',
    backgroundColor: COLORS.SURFACE,
    borderTopColor: COLORS.ACCENT_CYAN,
    borderTopWidth: 3,
    shadowColor: COLORS.ACCENT_CYAN,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  floorGrid: {
    flex: 1,
    flexDirection: 'row',
    opacity: 0.08,
    justifyContent: 'space-around',
  },
  floorGridLine: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.TEXT_PRIMARY,
  },
  ceiling: {
    position: 'absolute',
    backgroundColor: COLORS.SURFACE,
    borderBottomColor: COLORS.GRADIENT_START,
    borderBottomWidth: 1.5,
  },
});

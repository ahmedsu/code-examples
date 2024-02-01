import { Dimensions, StyleSheet, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated from 'react-native-reanimated';

const { interpolateNode, multiply } = Animated;
const width = Math.min(325, Dimensions.get('window').width);
const size = width - 32;
const strokeWidth = 16;
const AnimatedPath = Animated.createAnimatedComponent(Path);
const { PI, cos, sin } = Math;
const r = (size - strokeWidth) / 2;
const cx = size / 2;
const cy = size / 2;
const A = PI - PI * 0.3;
const startAngle = ((30 - 180) * PI) / 180;
const endAngle = ((150 - 180) * PI) / 180;
// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
const x1 = cx - r * cos(startAngle);
const y1 = r * sin(startAngle) + cy;
const x2 = cx - r * cos(endAngle);
const y2 = r * sin(endAngle) + cy;
const d = `M ${x2} ${y2} A ${r} ${r} 0 0 1 ${x1} ${y1}`;

interface ArcProps {
  style?: object;
  progress: number;
  height?: number;
  startLabel: number;
  endLabel: number;
}

export function Arc({ style, progress, height, startLabel, endLabel }: ArcProps) {
  const circumference = r * A;
  const theta = interpolateNode(1 - progress, {
    inputRange: [0, 1],
    outputRange: [0, A],
  });
  const strokeDashoffset = multiply(theta, r);

  return (
    <View style={{ ...styles.container, ...style }}>
      <Svg width={size} height={height ? height : size}>
        <Path
          stroke='#009147'
          strokeOpacity={0.2}
          fill='none'
          strokeLinecap='round'
          strokeDasharray={`${circumference}, ${circumference}`}
          {...{ d, strokeWidth }}
        />
        <AnimatedPath
          stroke='#009147'
          fill='none'
          strokeLinecap={'round'}
          strokeDasharray={`${circumference}, ${circumference}`}
          {...{ d, strokeDashoffset, strokeWidth }}
        />
      </Svg>
      <Text maxFontSizeMultiplier={1.5} style={styles.label}>
        {startLabel}
      </Text>
      <Text maxFontSizeMultiplier={1.5} style={styles.label}>
        {endLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  label: {
    color: '#4D4D4D',
    fontFamily: 'Montserrat',
    fontSize: 13,
    position: 'absolute',
    top: y2 + 16,
    textAlign: 'center',
  },
});

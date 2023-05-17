import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {emojis} from '../../components/EmojiPicker/Emojis';
import {WithLocalSvg} from 'react-native-svg';

interface EmojiAnimationProp {
  index: string;
}

const EmojiAnimation = ({index}: EmojiAnimationProp) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const positionValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // console.log(animateCounter);
    animateEmoji();
  }, []);

  const animateEmoji = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(positionValue, {
        toValue: -100,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(positionValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.emoji,
        {
          opacity: scaleValue,
          transform: [{translateY: positionValue}, {scale: scaleValue}],
        },
      ]}>
      <WithLocalSvg asset={emojis[index]} width={48} height={48} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',
  },
});

export default EmojiAnimation;

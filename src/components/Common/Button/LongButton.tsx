import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface ButtonProps {
  text: string;
}

const LongButton = ({text}: ButtonProps) => {
  return (
    <View style={styles.button}>
      <Text style={styles.font}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 343,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 23,
    backgroundColor: '#B0BDFF',
    borderRadius: 15,
  },
  font: {
    color: '#FFF',
  },
});

export default LongButton;

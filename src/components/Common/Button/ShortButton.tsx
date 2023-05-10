import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface ButtonProps {
  text: string;
}

const ShortButton = ({text}: ButtonProps) => {
  return (
    <View style={styles.button}>
      <Text style={styles.font}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
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

export default ShortButton;

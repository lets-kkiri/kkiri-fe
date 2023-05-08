import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: 'black',
    marginRight: 8,
  },
});

type UserProfileProp = {
  userImg: string;
};

function UserProfile({userImg}: UserProfileProp) {
  return (
    <View>
      <Image
        source={{
          uri: 'https://mblogthumb-phinf.pstatic.net/MjAxNjExMTFfMTY3/MDAxNDc4ODUwNjA4NDg4.YKHi2SWBIK5fmQuMaHnh-seBKFeGEG-in6-8yzq9G50g.2nANEGF9WqlcuVG3xP-5B3-7BHiswPjQQyXAaEBvj44g.JPEG.alclsrorm/Na1469239529977.jpg?type=w800',
        }}
        style={styles.container}
      />
      {/* <View style={styles.container} /> */}
    </View>
  );
}

export default UserProfile;

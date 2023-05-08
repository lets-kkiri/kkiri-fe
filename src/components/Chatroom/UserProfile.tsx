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

const ProfileImg = styled.Image`
  border-radius: 99px;
`;

type UserProfileProp = {
  userImg: string;
};

function UserProfile({userImg, width}: UserProfileProp) {
  return (
    <View>
      <ProfileImg
        source={{
          uri: userImg,
        }}
        style={{width: width, height: width}}
      />
      {/* <View style={styles.container} /> */}
    </View>
  );
}

export default UserProfile;

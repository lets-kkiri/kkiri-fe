import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

// Styled components
const ProfileImg = styled.Image`
  border-radius: 99px;
`;

type UserProfileProp = {
  userImg: string;
  width: number;
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
    </View>
  );
}

export default UserProfile;

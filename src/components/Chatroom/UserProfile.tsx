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
  // console.log('useImg :', userImg);
  return (
    <View>
      {userImg && (
        <ProfileImg
          source={{
            uri: userImg,
          }}
          style={{width: width, height: width}}
        />
      )}
      {userImg === undefined && (
        <View
          style={{
            backgroundColor: '#FFE8E1',
            width: 50,
            height: 50,
            borderRadius: 99,
          }}></View>
      )}
    </View>
  );
}

export default UserProfile;

import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {RootState} from '../../store';

import {Container} from './MemberItem';

// Styled component

const InviteContainer = styled(Container)`
  width: ${({width}) => width / 3}px;
  background-color: ${({theme}) => theme.color.green2};
`;

interface InviteMemberItemProp {
  width: number;
  onPress: () => void;
}

const InviteMemberItem = ({width, onPress}: InviteMemberItemProp) => {
  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  return (
    <InviteContainer width={width} theme={theme} onPress={onPress}>
      <WithLocalSvg
        asset={require('../../assets/icons/moim_invite.svg')}
        style={{marginRight: 12}}
      />
      <Text style={{color: theme.color.text, fontSize: 14}}>초대</Text>
    </InviteContainer>
  );
};

export default InviteMemberItem;

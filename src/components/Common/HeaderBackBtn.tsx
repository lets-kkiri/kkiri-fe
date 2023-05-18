import React from 'react';
import {TouchableOpacity} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';

const HeaderBackBtn = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{width: 44}}>
      <WithLocalSvg
        style={{width: 44, height: 44}}
        asset={require('../../assets/icons/header_left.svg')}
      />
      {/* <Text>뒤로</Text> */}
    </TouchableOpacity>
  );
};

export default HeaderBackBtn;

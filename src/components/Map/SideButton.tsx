import React from 'react';
import {TouchableOpacity} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {useAppDispatch} from '../../store';
import {helpPost} from '../../slices/helpSlice';

import Help from '../../assets/icons/help.svg';
import Info from '../../assets/icons/info.svg';

interface ButtonProps {
  setSideModal: React.Dispatch<React.SetStateAction<boolean>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<string>>;
  moimId: number;
}

const SideButton = ({
  setSideModal,
  setModalVisible,
  setModalType,
  moimId,
}: ButtonProps) => {
  const dispatch = useAppDispatch();

  // 도움 요청 보내는 함수
  function sendHelp() {
    setModalVisible(true);
    setModalType('sendhelp');
    // 임시 데이터
    const postData = {
      chatRoomId: moimId,
    };
    dispatch(helpPost(postData));
  }

  return (
    <>
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 110,
          left: 350,
        }}
        onPress={sendHelp}>
        <WithLocalSvg asset={Help} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 160,
          left: 350,
        }}
        onPress={() => setSideModal(true)}>
        <WithLocalSvg asset={Info} />
      </TouchableOpacity>
    </>
  );
};

export default SideButton;

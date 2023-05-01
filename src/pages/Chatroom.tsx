import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Components
import ChatFlatList from '../components/Chatroom/ChatFlatList';

// Styles
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 99,
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

// types
import {MessageData} from '../types/index';

interface ChatroomProp {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

function Chatroom({route}: ChatroomProp) {
  // 채팅방 id
  const roomId = route.params.roomId;

  // 채팅 메시지 목록
  const data: MessageData[] = [
    {
      id: 0,
      userName: '은지',
      userImg: 'a',
      text: '안녕',
      created: '2023-05-01T00:00:00:0000',
    },
    {
      id: 1,
      userName: '유진',
      userImg: 'a',
      text: '하이',
      created: '2023-05-01T00:00:00:0000',
    },
    {
      id: 2,
      userName: '한별',
      userImg: 'a',
      text: '여어',
      created: '2023-05-01T00:00:00:0000',
    },
  ];
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          {/* 지도 */}
          {/* 채팅 메시지 목록 */}
          <ChatFlatList data={data} />
          {/* 채팅 메시지 입력 인풋 */}
          <View>
            <TextInput
              placeholder="메시지를 입력해주세요"
              style={styles.input}
            />
            <Button title="전송" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Chatroom;

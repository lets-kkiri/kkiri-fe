import React from 'react';
import {Button, View, StyleSheet} from 'react-native';
import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';

function SignIn() {
  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login();
    setResult(JSON.stringify(token));
  };

  const signOutWithKakao = async (): Promise<void> => {
    const message = await logout();
    setResult(message);
  };

  const getKakaoProfile = async (): Promise<void> => {
    const profile: KakaoProfile = await getProfile();
    setResult(JSON.stringify(profile));
  };

  const unlinkKakao = async (): Promise<void> => {
    const message = await unlink();
    setResult(message);
  };

  return (
    <View style={styles.container}>
      <Button
        title="카카오 로그인"
        onPress={() => {
          signInWithKakao();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  button: {
    backgroundColor: '#FEE500',
    borderRadius: 40,
    borderWidth: 1,
    width: 250,
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  text: {
    textAlign: 'center',
  },
});

export default SignIn;

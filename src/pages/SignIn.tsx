import React, {useState, useEffect} from 'react';
import {Button, View, StyleSheet} from 'react-native';
import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';

function SignIn() {
  const [result, setResult] = useState('');
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    console.log(result);
  }, [result]);

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token: KakaoOAuthToken = await login();
      setResult(JSON.stringify(token));
      setIsLoggedin(true);
      // console.log('토큰입니다', token);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const signOutWithKakao = async (): Promise<void> => {
    const message = await logout();
    setResult(message);
    setIsLoggedin(false);
  };

  const getKakaoProfile = async (): Promise<void> => {
    const profile: KakaoProfile = await getProfile();
    console.log('profile', profile);
    setResult(JSON.stringify(profile));
  };

  const unlinkKakao = async (): Promise<void> => {
    const message = await unlink();
    setResult(message);
    setIsLoggedin(false);
  };

  return (
    <View style={styles.container}>
      {isLoggedin === true ? (
        <Button
          title="카카오 로그아웃"
          onPress={() => {
            signOutWithKakao();
          }}
        />
      ) : (
        <Button
          title="카카오 로그인"
          onPress={() => {
            signInWithKakao();
          }}
        />
      )}
      <Button
        title="카카오 프로필 가져오기"
        onPress={() => {
          getKakaoProfile();
        }}
      />
      <Button
        title="카카오 연결 해제"
        onPress={() => {
          unlinkKakao();
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

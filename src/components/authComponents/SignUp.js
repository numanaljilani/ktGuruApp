import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import React, {useRef, useState , useEffect} from 'react';
import Button from '../common/Button';
import GoogleButton from '../common/GoogleButton';
import styless from './commonStyle';
import ErrorMessage from '../common/ErrorMessage';
import Indicator from '../common/Indicator';
import {useGoogleLogInMutation, useMeMutation, useSignUpApiMutation} from '../../redux/api/api';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useDispatch } from 'react-redux';
import { setToken } from "../../redux/slice/tokenSlice";
import { setUser } from "../../redux/slice/userSlice";
import { useNavigation } from '@react-navigation/native';
import { storeToken } from '../../common/ayncStorageGlobal';
import navigationString from '../../constant/navigationString';
import { setNavigation } from '../../redux/slice/navigationSlice';


const SignUp = ({onNext, navigation}) => {

  const dispatch = useDispatch()

  const [show, setShow] = useState(true);
  const [showconf, setShowConf] = useState(true);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState();
  const [signUpApi] = useSignUpApiMutation();
  const [googleLogIn] = useGoogleLogInMutation();
  const [me] = useMeMutation();
  const [error, setError] = useState({
    message: '',
    status: '',
  });

  const [errorBg, setErrorBg] = useState({
    email: false,
    name: false,
    password: false,
  });

  const Ref = useRef({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const conformPass = useRef({conformPassword: ''});

  const handleOnChange = (name, text) => {
    Ref.current[name] = text.trim();
  };

  const handleSignUpPost = async data => {
    dispatch(setNavigation(false))
    if (!data.firstName || !data.lastName) {
      // console.log('all fields are reuired');
      return;
    }
    if (Ref.current.password !== conformPass.current) {
      setErrorBg({...errorBg, password: true});
      // console.log('password does not matched');
      return;
    }
    let response;

    setLoading(true);
    response = await signUpApi(data);
    setLoading(false);

    // console.log(response)
    if(response.data){
      showMessage({message : response.data.message , type : "success"})
      onNext('login');
    }
    if(response.error){
      showMessage({message : response.error.data.message , type : "danger"})
    }
    if (response.error) {
      if (response.error.status == 409) {
        setError({
          message: response.error.data.message,
          status: response.error.status,
        });
        setLoading(false);
      }
      if (response.error.status == 422) {
        setError({
          message: response.error.data.message,
          status: response.error.status,
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "841549574610-kjtf314v4c41ciu39tgdbh774n6d7nsv.apps.googleusercontent.com",
    });
  }, []);

  const register = async () => {
    try {
      setLoading(true);
      const fcm = await AsyncStorage.getItem("fcmToken");
       await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      setLoading({ userInfo });
      if (userInfo) {
        const resp = await googleLogIn({
          body: { user: userInfo.user ,    FCMToken: fcm, },
      
        });
        if (resp.data) {
          dispatch(setToken(resp.data));
          // storeToken(resp.data);
          const user = await me(resp.data.access_token)
          // console.log(user)
          dispatch(setUser(user.data));
          if (user.data.role1 || user.data.role2) {
            setLoading(false);
            navigation.replace(navigationString.DRAWER);
          } else {
            setLoading(false);
            navigation.navigate(navigationString.PROFILEDETAILS);
          }
        }
        if (resp.error) {
          if (resp.error.error) {
            showMessage({ message: resp.error.error.message, type: "danger" });
          } else {
            showMessage({ message: resp.error.data.message, type: "danger" });
          }
        }
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        marginTop: 20,
      }}>
      <Text style={styless.heading}>Sign up</Text>

      <View style={[styles.IputStyle]}>
        <Image
          style={styles.ImgStyle}
          source={require('../../assets/user.png')}
        />
        <TextInput
          placeholder="First name"
          style={{flex: 1}}
          autoCapitalize="none"
          onChangeText={text => handleOnChange('firstName', text)}
          selectTextOnFocus={true}
        />
        <TextInput
          placeholder="Last name"
          style={{flex: 1}}
          autoCapitalize="none"
          onChangeText={text => handleOnChange('lastName', text)}
        />
      </View>
      <View
        style={[styles.IputStyle, error.status === 409 && styless.errorStyle]}>
        <Image
          style={styles.ImgStyle}
          source={require('../../assets/email.png')}
        />
        <TextInput
          placeholder="Email"
          style={[{flex: 1}]}
          autoCapitalize="none"
          textContentType="emailAddress"
          onChangeText={text => handleOnChange('email', text)}
          keyboardType="email-address"
        />
      </View>
      {error.status === 409 && <ErrorMessage title={error.message} />}

      <View style={[styles.IputStyle, errorBg.password && styless.errorStyle]}>
        <Image
          source={require('../../assets/password.png')}
          style={styles.ImgStyle}
        />
        <TextInput
          placeholder="Password"
          style={{flex: 1}}
          textContentType={'password'}
          autoCapitalize="none"
          onChangeText={text => handleOnChange('password', text)}
          secureTextEntry={show ? true : false}
        />
        <TouchableOpacity onPress={() => setShow(!show)}>
          <Image
            source={
              show
                ? require('../../assets/showpassword.png')
                : require('../../assets/hidepassword.png')
            }
            style={[styles.ImgStyle]}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.IputStyle, errorBg.password && styless.errorStyle]}>
        <Image
          source={require('../../assets/password.png')}
          style={styles.ImgStyle}
        />
        <TextInput
          placeholder="Conform Password"
          style={{flex: 1}}
          autoCapitalize="none"
          textContentType="password"
          onChangeText={text => (conformPass.current = text.trim())}
          secureTextEntry={showconf ? true : false}
        />
        <TouchableOpacity onPress={() => setShowConf(!showconf)}>
          <Image
            source={
              showconf
                ? require('../../assets/showpassword.png')
                : require('../../assets/hidepassword.png')
            }
            style={styles.ImgStyle}
          />
        </TouchableOpacity>
      </View>
      {errorBg.password && <ErrorMessage title={'please confirm  password'} />}
      <View
        style={{
          margin: 15,
        }}>
        <Text style={{fontSize: 12, alignSelf: 'center'}}>
          By Signing up you are agree to our
        </Text>
        <Text
          style={{
            color: '#1F67D2',
            fontSize: 12,
            alignSelf: 'center',
          }}>
          Terms & Conditions and Privacy Policy
        </Text>
      </View>

      <Button title="Register" onPress={() => handleSignUpPost(Ref.current)} />

      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 16,
          marginVertical: 10,
        }}>
        Or
      </Text>

      <GoogleButton title="Sign up with Google" onPress={()=>register()} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 15,
        }}>
        <Text>If you already have an account, </Text>
        <TouchableOpacity
          onPress={() => {
            onNext('login');
          }}>
          <Text style={{fontSize: 14, color: '#0153CC'}}>login.</Text>
        </TouchableOpacity>
      </View>
      {loading && <Indicator />}
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  IputStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: '#E8E7EA',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  ImgStyle: {
    tintColor: '#AEAEAE',
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
});

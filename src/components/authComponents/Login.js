import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styless from "./commonStyle";
import Button from "../common/Button";
// import GoogleButton from "../common/GoogleButton";
import navigationString from "../../constant/navigationString";
import ErrorMessage from "../common/ErrorMessage";
import {
  useGoogleLogInMutation,
  useLoginApiMutation,
  useMeMutation,
} from "../../redux/api/api";
import Indicator from "../common/Indicator";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../redux/slice/tokenSlice";
import { setUser } from "../../redux/slice/userSlice";
import { showMessage } from "react-native-flash-message";
import { storeToken } from "../../common/ayncStorageGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { setNavigation } from "../../redux/slice/navigationSlice";

const Login = ({ onNext, navigation }) => {
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(false);
  const [logindata] = useLoginApiMutation();
  const [googleLogIn] = useGoogleLogInMutation();
  const [me] = useMeMutation();

  const Ref = useRef({
    email: "",
    password: "",
    FCMToken: "",
  });
  const [errorBg, setErrorBg] = useState({ error: false, message: "" });
  const [show, setShow] = useState(true);
  const [state, setState] = useState();

  const handleOnChange = (name, text) => {
    Ref.current[name] = text.trim();
  };

  const handleLogIn = async () => {
    setLoding(true);
    dispatch(setNavigation(false))
    const fcm = await await AsyncStorage.getItem("fcmToken");
    Ref.current.FCMToken = fcm;
    let data = Ref.current;
    // console.log(data, "fcm Token");
    var response = await logindata(data);
    // console.log(response,"log in token")
    if (response.data) {
      dispatch(setToken(response.data));
      storeToken(response.data);
      const user = await me(response.data.access_token)
      // console.log(user)
      dispatch(setUser(user.data));
      if (user.data.role1 || user.data.role2) {
        navigation.replace(navigationString.DRAWER);
      } else {
        navigation.navigate(navigationString.PROFILEDETAILS);
      }
    }

    if (response.error) {
      if (response.error.error) {
        if(response.error.error.message){
          showMessage({ message: response.error.error.message, type: "danger" });
        }else{
          showMessage({ message: response.error.error, type: "danger" });
        }
       
      }
      
      else {
        showMessage({ message: response.error.data.message, type: "danger" });
      }
    }

    setLoding(false);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "841549574610-kjtf314v4c41ciu39tgdbh774n6d7nsv.apps.googleusercontent.com",
    });
  }, []);

  const signIn = async () => {
    try {
      setLoding(true);
      const fcm = await AsyncStorage.getItem("fcmToken");
      console.log(fcm ,">>>>>>>>>")
       await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      setState({ userInfo });
      if (userInfo) {
        const resp = await googleLogIn({
          body: { user: userInfo.user ,          FCMToken: fcm,},

        });
        if (resp.data) {
          dispatch(setToken(resp.data));
          storeToken(resp.data);
          const user = await me(resp.data.access_token);
          dispatch(setUser(user.data));
          if (user.data.role1 || user.data.role2) {
            setLoding(false);
            navigation.replace(navigationString.DRAWER);
          } else {
            setLoding(false);
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
      }}
    >
      <Text style={styless.heading}>Login</Text>
      <View style={[styles.IputStyle, errorBg.error && styless.errorStyle]}>
        <Image
          style={styles.ImgStyle}
          source={require("../../assets/email.png")}
        />
        <TextInput
          placeholder="Email"
          style={{ flex: 1 }}
          onChangeText={(text) => handleOnChange("email", text)}
          autoCapitalize="none"
        />
      </View>

      <View style={[styles.IputStyle, errorBg.error && styless.errorStyle]}>
        <Image
          source={require("../../assets/password.png")}
          style={styles.ImgStyle}
        />
        <TextInput
          placeholder="Password"
          style={{ flex: 1 }}
          onChangeText={(text) => handleOnChange("password", text)}
          secureTextEntry={show ? true : false}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShow(!show)}>
          <Image
            source={
              show
                ? require("../../assets/showpassword.png")
                : require("../../assets/hidepassword.png")
            }
            style={styles.ImgStyle}
          />
        </TouchableOpacity>
      </View>
      <ErrorMessage title={errorBg.message} />

      <Text style={styless.textStyle} onPress={() => onNext("forgotPassword")}>
        Forgot password ?
      </Text>

      <Button title="Log in" onPress={() => handleLogIn()} />

      <Text style={styless.or}>Or</Text>

      {/* <GoogleButton onPress={signIn} title="Login with Google" /> */}

      <TouchableOpacity style={styles.gBtn} onPress={signIn}>
        <Image
          source={require("../../assets/google.png")}
          style={styles.ImgStyle}
        />
        <Text style={{ fontWeight: "bold" }}>Login with Google</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 15,
        }}
      >
        <TouchableOpacity onPress={() => onNext("signUp")}>
          <Text>New to KtGuru? </Text>

          <Text style={{ fontSize: 14, color: "#0153CC", alignSelf: "center" }}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
      {loding && <Indicator />}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  IputStyle: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: "#E8E7EA",
    marginBottom: 5,
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  ImgStyle: {
    tintColor: "#AEAEAE",
    width: 30,
    height: 30,
    alignSelf: "center",
  },
  IputStyle: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: "#E8E7EA",
  },
  ImgStyle: {
    width: 40,
    height: 40,
    marginRight: 10,
    alignSelf: "center",
  },
  gBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: "#F1F5F6",
  },
});

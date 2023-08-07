import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Login, SignUp, ForgotPassword, ResetPassword } from "../../components";
const Auth = ({ navigation }) => {
  const [authComp, setAuthComp] = useState("login");

  function onNext(component) {
    setAuthComp(component);
    // console.log(authComp);
  }
  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{marginBottom: 16, marginTop: 30}}>
    <ScrollView
      contentContainerStyle={{ height: "100%", paddingBottom: 10 }}
      // bounces={false}
    >
      <View style={{ height: "100%" }}>
        <Image
          source={require("../../assets/KT_back.png")}
          style={{
            resizeMode: "contain",
            height: "30%",
            width: "100%",
          }}
        />

        {authComp === "signUp" ? (
          <SignUp onNext={onNext} navigation={navigation} />
        ) : authComp === "forgotPassword" ? (
          <ForgotPassword onNext={onNext} navigation={navigation} />
        ) : (
          <Login onNext={onNext} navigation={navigation} />
        )}
      </View>
      {/* {loding && <Indicator />} */}
    </ScrollView>
    // </KeyboardAvoidingView>
  );
};

export default Auth;

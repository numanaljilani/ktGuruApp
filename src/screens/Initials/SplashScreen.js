import { Image, View } from "react-native";
import React, { memo, useEffect } from "react";
import navigationString from "../../constant/navigationString";
import imagePath from "../../constant/imagePath";
import { useDispatch } from "react-redux";
import { useMeMutation } from "../../redux/api/api";
import { setUser } from "../../redux/slice/userSlice";
import { showMessage } from "react-native-flash-message";
import { getToken } from "../../common/ayncStorageGlobal";
import { setNavigation } from "../../redux/slice/navigationSlice";
import { setToken } from "../../redux/slice/tokenSlice";

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [me] = useMeMutation();
  const getCredential = async () => {
    dispatch(setNavigation(false))
    const token = await getToken()
try {
  if(token){
    // crashlytics().log('Splash screen');
    if (JSON.parse(token).access_token) {
      dispatch(setToken(JSON.parse(token)))
      const res = await me(JSON.parse(token).access_token);
      // console.log(typeof(token))
      console.log(res)
  
      if (res.data) {
        dispatch(setUser(res.data));
        if (res.data.role1 || res.data.role2) {
          navigation.replace(navigationString.DRAWER);
        } else {
          navigation.replace(navigationString.PROFILEDETAILS);
        }
      }
      if (res.error) {
        if (res.error.data && res.error.data.message === "unAuthorized") {
          // await crashlytics.setAttributes({
          //   responseError : res.error.data
          // })
          navigation.replace(navigationString.AUTH);
        }
        if(res.error.error){
          showMessage({message: res.error.error , type : "danger"})
          // await crashlytics.setAttributes({
          //   responseError : res.error.error
          // })
        }
        if(res.error.data){
          navigation.replace(navigationString.AUTH);
        }
  
      }
    }
  }
   else {
        navigation.replace(navigationString.AUTH);
      }
} catch (error) {
  navigation.replace(navigationString.AUTH);
}
  };
  useEffect(() => {
    getCredential();
  }, []);



  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <Image
        source={imagePath.imgKt_Logo}
        style={{
          alignItems: "center",
          height: "40%",
          width: "100%",
          resizeMode: "contain",
        }}
      />
    </View>
  );
};

export default memo(SplashScreen);

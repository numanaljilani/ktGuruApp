import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import imagePath from "../../../constant/imagePath";
import Button from "../../../components/common/Button";
import ImagePicker from "react-native-image-crop-picker";
import { androidCameraPermission } from "../../../../androidCameraPermission";
import { useUpdateprofileMutation } from "../../../redux/api/api";
import Indicator from "../../../components/common/Indicator";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { setUser } from "../../../redux/slice/userSlice";
import analytics from "@react-native-firebase/analytics";

const EditProfile = ({ setEditProfile, userProfile }) => {
  const items = useSelector((state) => state.reducer);
  const [updateprofile] = useUpdateprofileMutation();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    avatar: "",
  });



  const onSelectImage = async () => {
    const permissionStatus = await androidCameraPermission();

    if (permissionStatus || Platform.OS == "ios") {
      Alert.alert("profile picture", "chose an option", [
        {
          text: "Camera",
          onPress: () => {
            ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
            }).then((image) => {
              console.log(image);
              setProfile({ ...profile, avatar: image.path });
            });
          },
        },
        {
          text: "Gallery",
          onPress: () => {
            ImagePicker.openPicker({
              width: 300,
              height: 400,
              cropping: true,
            }).then((image) => {
              // console.log(image);
              setProfile({ ...profile, avatar: image.path });
              // Ref.current.imagePath = image.path;
            });
          },
        },
        { text: "Cancel", onPress: () => {} },
      ]);
    }
  };

  const uploadFormData = async () => {
    const inputFormData = new FormData();

    inputFormData.append("avatar", {
      uri:  profile.avatar ? profile.avatar : userProfile.avatar,
      name: "image.png",
      fileName: "image",
      type: "image/png",
    });
    inputFormData.append("firstName", profile.firstName);
    inputFormData.append("lastName", profile.lastName);

    const response = await updateprofile({ inputFormData, token : items.token.token.access_token});
// console.log(response)
    if(response.data){
      dispatch(setUser(response.data))
      showMessage({ message : "Profile update successfull" , type:"success"})
    }else{
      // console.log(response)
      showMessage({ message : response.error , type:"danger"})
    }
    setEditProfile(false);

  };

  return (
    <View style={{ paddingVertical: 20 }}>
      <ScrollView>
        <TouchableOpacity onPress={onSelectImage}>
          <View style={styles.imgContainer}>
            <Image
              source={{
                uri:  profile.avatar ? profile.avatar : userProfile.avatar,
              }}
              style={styles.img}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.nameText}></Text>
        <Text style={styles.emialText}></Text>

        <TextInput
          mode="outlined"
          label={"First Name"}
          value={profile.firstName}
          outlineColor="#0066A2"
          activeOutlineColor="#0066A2"
          placeholderTextColor="#c7c7c7"
          left={<TextInput.Icon icon={imagePath.icProfile} />}
          style={styles.input}
          onChangeText={(text) => setProfile({ ...profile, firstName: text })}
        />
        <TextInput
          mode="outlined"
          label={"Last Name"}
          value={profile.lastName}
          outlineColor="#0066A2"
          activeOutlineColor="#0066A2"
          placeholderTextColor="#c7c7c7"
          left={<TextInput.Icon icon={imagePath.icProfile} />}
          style={styles.input}
          onChangeText={(text) => setProfile({ ...profile, lastName: text })}
        />

        <Button title="Save changes" onPress={uploadFormData} />
      </ScrollView>
      {/* {loading && <Indicator />} */}
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 20,
    paddingHorizontal: 10,
    // backgroundColor: '#E5EFF5',
    borderColor: "#0066A2",
  },
  imgContainer: {
    borderWidth: 4,
    borderColor: "#0066A2",
    width: 125,
    height: 125,
    borderRadius: 100,
    alignSelf: "center",
    overflow: "hidden",
  },
  emialText: {
    fontWeight: 500,
    alignSelf: "center",
    paddingVertical: 5,
    fontSize: 12,
  },
  nameText: { fontWeight: 800, alignSelf: "center", paddingTop: 20 },
  img: {
    flex: 1,
  },
});

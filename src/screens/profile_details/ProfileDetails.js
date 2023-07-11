import { Image, Text, View, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import imagePath from "../../constant/imagePath";
import { RadioButton, TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
import { useUserprofileAPIMutation } from "../../redux/api/api";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import navigationString from "../../constant/navigationString";

const ProfileDetails = () => {
  const [checked, setChecked] = React.useState("Company");
  const [userprofile] = useUserprofileAPIMutation();
  const items = useSelector((state) => state.reducer);
const navigation = useNavigation()
  const companyProfile = useRef({
    websiteUrl: "",
    companyName: "",
    country: "",
  });

  const consaltantRef = useRef({
    country: "",
  });

  const save = async () => {
    if (checked === "Company") {
      const response = await userprofile({
        body: companyProfile.current,
        token: items.token.token.access_token,
      });
      // console.log(response);

      if (response.error) {
        showMessage({ message: response.error.data.message, type: "danger" });
      }
    } else {
      // console.log(consaltantRef.current);
      const response = await userprofile({
        body: consaltantRef.current,
        token: items.token.token.access_token,
      });
      // console.log(response, "response from");
      if (response.error) {
        showMessage({ message: response.error.data.message, type: "danger" });
      }
    }
  };
  return (
    <View
      className=" mx-3 mt-3 bg-white rounded-lg pt-3 px-5 "
      style={{
        shadowColor: "#0066A2",
        elevation: 20,
      }}
    >
      <View className=" flex-row justify-end ">
        <TouchableOpacity onPress={()=> navigation.navigate(navigationString.AUTH)} className="float-right rounded-full px-2 py-2 bg-[#0067a219]  ">
          <Image source={imagePath.icLogout} style={{ tintColor: "#0066A2" }} className="w-9 h-9"/>
        </TouchableOpacity>
      </View>
      <Image
        source={imagePath.imgKt_Logo2}
        className=" h-24 w-24 self-center my-2 "
        resizeMode=""
      />
      <Text className="font-semibold text-black mx-auto">
        Join as a Company or Consaltant
      </Text>
      <View className=" flex-row justify-between mt-3 ">
        <View className="border flex-row items-center py-3 px-4 rounded-lg">
          <RadioButton
            value="Consaltant"
            status={checked === "Consaltant" ? "checked" : "unchecked"}
            onPress={() => setChecked("Consaltant")}
          />
          <Text>Consaltant</Text>
        </View>
        <View className="border flex-row items-center py-3 px-4 ml-2 rounded-lg">
          <RadioButton
            value="Company"
            status={checked === "Company" ? "checked" : "unchecked"}
            onPress={() => setChecked("Company")}
          />
          <Text>Company</Text>
        </View>
      </View>
      <View className="">
        {checked === "Company" && (
          <View>
            <View className="mt-2">
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Company Name"
              />
            </View>
            <View className="mt-2">
              <TextInput
                mode="outlined"
                outlineColor="#0066A2"
                activeOutlineColor="#0066A2"
                placeholder="Website URL"
              />
            </View>
          </View>
        )}

        <View className="mt-2">
          <TextInput
            mode="outlined"
            outlineColor="#0066A2"
            activeOutlineColor="#0066A2"
            placeholder="Country"
            onChangeText={(text) =>
              checked === "Company"
                ? (companyProfile.current.country = text)
                : (consaltantRef.current.country = text)
            }
          />
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={save}
          className="bg-[#0066A2] mx-10 py-2 my-5 rounded-lg"
        >
          <Text className="text-white text-base text-center">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileDetails;

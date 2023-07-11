import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import imagePath from "../constant/imagePath";
import navigationString from "../constant/navigationString";
import { Profile } from "../screens";
import Projects from "../screens/Home/Projects/Projects";
import CustomDrawer from "../components/CustomDrawer";
import BottomTabNavigation from "./BottomTabNavigation";
import InviteAdmin from "../screens/admin/InviteAdmin";


const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerTintColor: "#0066A2",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign : "center",
        headerStyle: {
          height: 70,
        },
        headerLeft : () =>(
          <TouchableOpacity onPress={()=>{
            navigation.toggleDrawer()}}>
            <Image source={imagePath.icMenu} className="w-8 h-8 ml-7" style={{ tintColor:"#0066a2"}}/>
          </TouchableOpacity>
        ),
        drawerPosition: "left",
       
      })}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen screenOptions={(navigation) =>{ headerLeft: () => (
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Image source={imagePath.icBack} className="w-6 h-6 ml-5" style={{ tintColor:"#0066a2"}}/>
          </TouchableOpacity>
        )}} name={navigationString.PROJECTS} component={Projects} />
      <Drawer.Screen options={{headerShown : false}} name={navigationString.PROFILE} component={Profile} />
      <Drawer.Screen options={{headerShown : false}} component={BottomTabNavigation} name={navigationString.BOTTOM_TABS} />
      <Drawer.Screen options={{headerShown : false}} component={InviteAdmin} name={navigationString.INVITE_ADMIN} />
   
    </Drawer.Navigator>
  )
}

export default React.memo(DrawerNavigation)


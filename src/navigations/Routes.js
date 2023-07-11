import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {Home, SplashScreen, Auth} from '../screens';
import navigationString from '../constant/navigationString';
import DrawerNavigation from './DrawerNavigation';
import QuestionDetails from '../screens/BottomTabs/discussion/QuestionDetails';
import ProfileDetails from '../screens/profile_details/ProfileDetails';
import ChatScreen from '../screens/BottomTabs/chats/ChatScreen';
import SubProjectBottomTabs from './SubProjectBottomTabs';
import SubQuestionDetails from '../screens/subProjectScreens/discussion/SubQuestionDetails';
import SingleChat from '../screens/BottomTabs/chats/SingleChat';
import SubSingleChat from '../screens/subProjectScreens/chats/SubSingleChat';
import SubChatScreen from '../screens/subProjectScreens/chats/SubChatScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Indicator from '../components/common/Indicator';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Routes = () => {
  const { loading } = useSelector((state) => state.reducer.navigation);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false , headerTitleAlign : 'center'}}
        initialRouteName={navigationString.SPLASHSCREEN}>
        <Stack.Screen
          component={SplashScreen}
          name={navigationString.SPLASHSCREEN}
        />
        <Stack.Screen component={Auth} name={navigationString.AUTH}  />
        <Stack.Screen component={DrawerNavigation} name={navigationString.DRAWER}/>
        <Stack.Screen component={QuestionDetails} name={navigationString.QUESTION_DETAILS} />
        <Stack.Screen component={ProfileDetails} name={navigationString.PROFILEDETAILS} />
        <Stack.Screen component={ChatScreen} name={navigationString.CHATS_SCREEN} />
        <Stack.Screen component={SubProjectBottomTabs} name={navigationString.SUBPROJECT} />
        <Stack.Screen component={SubQuestionDetails} name={navigationString.SUBPROJECT_QUESTION} />
        <Stack.Screen component={SingleChat} name={navigationString.SINGLE_CHAT} />
        <Stack.Screen component={SubSingleChat} name={navigationString.SUB_PRO_SINGLE_CHAT} />
        <Stack.Screen component={SubChatScreen} name={navigationString.SUB_PRO_CHAT} />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default Routes;



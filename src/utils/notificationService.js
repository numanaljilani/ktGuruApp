import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
       await getFcmToken()
      console.log('Authorization status:', authStatus);
      // getMessaging
    }
  }

  const getFcmToken = async () =>{
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    console.log(fcmToken , "old token");

    if(!fcmToken){
        try {
            const fcmToken = await messaging().getToken();
            if(fcmToken){
                console.log(fcmToken,"new Token generated")
                await AsyncStorage.setItem('fcmToken',fcmToken)
            }
        } catch (error) {
            console.log(error)
            showMessage({message : error.message , type : "danger"})
        }
    }
  }

  export const notificationListner = async () =>{
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      });

      messaging().onMessage(async remoteMessage => {
        console.log(remoteMessage,"recived in for ground");
      })

          // Check whether an initial notification is available
    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
  }
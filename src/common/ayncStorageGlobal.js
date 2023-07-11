import AsyncStorage from '@react-native-async-storage/async-storage';
export const storeToken = async value => {
  try {
    await AsyncStorage.setItem('token', JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
    // saving error
  }
};


export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return false;
  }
};



// export const getSocket = async () => {
//   try {
//     const value = await AsyncStorage.getItem('socket');

//     if (value !== null) {
//       return value;
//     }
//   } catch (e) {
//     return;
//   }
// };

// export const setSocketData = async value => {
//   console.log(value)
//   try {
//     await AsyncStorage.setItem("socket", JSON.stringify(value));
//     return true;
//   } catch (e) {
//     return false;
//   }
// }
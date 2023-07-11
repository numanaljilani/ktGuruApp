import { View, ScrollView } from "react-native";
// import { PersistGate } from "redux-persist/integration/react";
import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import Routes from "./src/navigations/Routes";
import { Provider, useSelector } from "react-redux";
import { store } from "./src/redux/store/store";
import FlashMessage from "react-native-flash-message";
// import { persistStore } from "redux-persist";
import {
  requestUserPermission,
  notificationListner,
} from "./src/utils/notificationService";
import { GestureHandlerRootView, NativeViewGestureHandler } from 'react-native-gesture-handler';
import Indicator from "./src/components/common/Indicator";

// let persistor = persistStore(store);
const App = () => {
  useEffect(() => {
    requestUserPermission();
    notificationListner();
  }, []);


  return (
    <Provider store={store}>
       <GestureHandlerRootView>
      {/* <PersistGate persistor={persistor}> */}
        <View style={{ height: "100%" }}>
          <Routes />

        </View>
        <FlashMessage position="bottom" />
      {/* </PersistGate> */}
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;

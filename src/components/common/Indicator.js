import {StyleSheet, Modal, View, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import { memo } from 'react';

const Indicator = () => {
  const [modalVal, setModalVal] = useState(true);
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={modalVal}
      style={{zIndex: 1100}}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={modalVal}
            size="large"
            color="#0066A2"
          />

          {/* If you want to image set source here */}
          {/* <Image
          source={require('../assets/images/loader.gif')}
          style={{ height: 80, width: 80 }}
          resizeMode="contain"
          resizeMethod="resize"
        /> */}
        </View>
      </View>
    </Modal>
  );
};

export default memo(Indicator);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

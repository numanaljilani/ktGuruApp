import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const ScreenHeaderBtn = ({iconUrl, dimension, onPress}) => {
  return (
    <TouchableOpacity style={styles.btnContainer}>
      <Image
        source={iconUrl}
        resizeMode="cover"
        style={styles.btnImg(dimension)}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;

const styles = StyleSheet.create({
  btnContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F8',
    borderRadius: 12 / 1.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  btnImg: dimension => ({
    width: dimension,
    height: dimension,
    borderRadius: 12 / 1.25,
    tintColor: '#0066A2',
  }),
});

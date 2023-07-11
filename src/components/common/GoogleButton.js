import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const GoogleButton = ({title , onPress}) => {
  return (
    <TouchableOpacity style={styles.gBtn} onPress={onPress} >
      <Image
        source={require('../../assets/google.png')}
        style={styles.ImgStyle}
      />
      <Text style={{fontWeight: 'bold'}}>{title}</Text>
    </TouchableOpacity>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  IputStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: '#E8E7EA',
  },
  ImgStyle: {
    width: 40,
    height: 40,
    marginRight: 10,
    alignSelf: 'center',
  },
  gBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: '#F1F5F6',
  },
});

import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import Button from '../common/Button';

const ResetPassword = ({setAuthComp}) => {
  return (
    <View style={{paddingHorizontal: 20, marginTop: 50}}>
      <Text style={{fontWeight: 'bold', fontSize: 25, color: '#172B4D'}}>
        Reset
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 25, color: '#172B4D'}}>
        Password?
      </Text>

      <View style={styles.IputStyle}>
        <Image
          source={require('../../assets/password.png')}
          style={styles.ImgStyle}
        />
        <TextInput
          placeholder="New Password"
          style={{flex: 1}}
          autoCapitalize="none"
        />
        <Image
          source={require('../../assets/showpassword.png')}
          style={styles.ImgStyle}
        />
      </View>

      <View style={styles.IputStyle}>
        <Image
          source={require('../../assets/password.png')}
          style={styles.ImgStyle}
        />
        <TextInput
          placeholder="Conform New Password"
          style={{flex: 1}}
          autoCapitalize="none"
        />
        <Image
          source={require('../../assets/showpassword.png')}
          style={styles.ImgStyle}
        />
      </View>
      <Button title="Submit" />
    </View>
  );
};

export default ResetPassword;
const styles = StyleSheet.create({
  IputStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: '#E8E7EA',
    marginVertical: 15,
    marginBottom: 20,
  },
  ImgStyle: {
    width: 30,
    height: 30,
    marginRight: 10,
    alignSelf: 'center',
  },
});

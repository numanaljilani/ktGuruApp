import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useRef, useState} from 'react';
import Button from '../common/Button';
import styless from '../../components/authComponents/commonStyle';
import {useResetpasswordMutation} from '../../redux/api/api';
import ErrorMessage from '../common/ErrorMessage';

const ForgotPassword = ({onNext}) => {
  const [resetpassword, {error}] = useResetpasswordMutation();
  const Ref = useRef({
    email: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    message: '',
    status: false,
  });

  const handleReset = async data => {
    // console.log(data);
    var response = await resetpassword({email: data});
    // console.log(response);

    if (response.error) {
      // console.log(response.error.data.message);
      setErrorMessage({message: response.error.data.message, status: true});
    }
  };
  return (
    <View style={{paddingHorizontal: 20, marginTop: 50}}>
      <Text style={{fontWeight: 'bold', fontSize: 25, color: '#172B4D'}}>
        Forgot
      </Text>
      <Text style={{fontWeight: 'bold', fontSize: 25, color: '#172B4D'}}>
        Password?
      </Text>
      <Text style={{marginVertical: 15, lineHeight: 20}}>
        Don't Worry! it happens. Please enter the address associated with your
        account.
      </Text>
      <View style={{marginBottom: 40}}>
        <View
          style={[styles.IputStyle, errorMessage.status && styless.errorStyle]}>
          <Image
            style={styles.ImgStyle}
            source={require('../../assets/email.png')}
          />
          <TextInput
            placeholder="Email"
            style={{flex: 1}}
            onChangeText={text => (Ref.current.email = text.trim())}
          />
        </View>
        {errorMessage.status && <ErrorMessage title={errorMessage.message} />}
      </View>
      <Button title="Submit" onPress={() => handleReset(Ref.current.email)} />

      <Text
        onPress={() => onNext('login')}
        style={{
          margin: 15,
          color: '#1F67D2',
          alignSelf: 'center',
        }}>
        Back to login
      </Text>
    </View>
  );
};

export default ForgotPassword;
const styles = StyleSheet.create({
  IputStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: '#E8E7EA',
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  ImgStyle: {
    width: 30,
    height: 30,
    marginRight: 10,
    alignSelf: 'center',
  },
});

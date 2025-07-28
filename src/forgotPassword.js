import React, {useState} from "react";
import {View, Text, TextInput, Alter, TouchableOpacity} from 'react-native';
import {loginStyle} from './style/loginStyles';
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPassword({ navigation }){
    const[email,setEmail] = useState('');
    const[loading, setLoading] = useState(false);
    const[message, setMessage] = useState('');
    const[error,setError] = useState('');

const handlePassReset = async () =>{
    setError('');
    setMessage('');

    if(!email){
        setError("Please enter your valid email!");
        return;
    }
    setLoading(ture);

    setTimeout(() => {
        setLoading(false);
        if(email == 'test@email.com'){
            setMessage("A password recovery link has been sent to your id!!!");
        }else {
            setError("No associated account was found!!!");
        }
    },1500);
};

return(

    <View style={loginStyle.container}>
        <TouchableOpacity 
        style={{position : 'absolute', top:40, left:20}}    
        onPress={() => navigation.goBack()}>
            
            <Ionicons name = 'arrow-back' size={28} color={'#fff'}/>
        </TouchableOpacity> 
        <View style={loginStyle.topSection}>
            <Text style={loginStyle.title}> Forgot Password</Text>
            <Text style={{color : 'rgba(255,255,255,0.7)', marginTop:10,marginHorizontal: 30, textAlign:'center'}}>
                Enter your eamil address accociated with the account and we will send you the password reset email.
            </Text>
        </View>
        <View style={loginStyle.bottomSection}>

            <TextInput
                style={loginStyle.input}
                placeholder="Email"
                placeholderTextColor='rgba(255,255,255,0.5)'
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {error ? <Text style={loginStyle.errorText}> {error} </Text>  :  null }   
            {message ? <Text style={[loginStyle.errorText, {color : '#44bd32'}]}> {message} </Text>  :  null }               
        </View>
        <TouchableOpacity
            style={loginStyle.button}
            onPress={handlePassReset}
            disabled={loading}
        >
            <Tetx style={loginStyle.buttonText}> 
                {loading? 'sending...' : 'Send Reset Link' }       
            </Tetx>

        </TouchableOpacity>
    </View>
)






}


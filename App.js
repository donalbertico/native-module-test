import { StatusBar } from 'expo-status-bar';
import React from 'react';
import * as Linking from 'expo-linking';
import {encode as btoa} from 'base-64';
import SpotifyWebApi from 'spotify-web-api-js';
import { StyleSheet, Text, View,NativeModules,NativeEventEmitter,TouchableOpacity} from 'react-native';
import {useAuthRequest, makeRedirectUri, getRedirectUrl} from 'expo-auth-session'
import Modulin from './NativeModule'

export default function App() {
  const { DEFAULT_EVENT_NAME } = Modulin.getConstants();
  const discovery = {
    authorizationEndpoint : "https://accounts.spotify.com/authorize",
    tokenEndpoint : 'https://accounts.spotify.com/api/token'
  };
  const redirectUri = makeRedirectUri({useProxy:false,native:"native-modules://redirect"})
  const [token,setToken] = React.useState();
  const [auth,setAuth] = React.useState()
  const [device,setDevice] = React.useState()
  const [authRequest, authResponse, promptAsync] = useAuthRequest({
      clientId: '2e4dab11cd8c42608560c988dbf341ab',
      usePKCE:false,
      scopes:[
        'streaming',
        'user-library-read',
        'user-read-playback-state'
      ],
      redirectUri: redirectUri,
      extraParams:{
        show_dialog:"true"
      }
    },discovery);

  React.useEffect(()=>{
    const eventEmitter = new NativeEventEmitter(Modulin)
    eventEmitter.addListener('ploploEvent',(e)=>{
    })
  },[])


  async function fetchDevices(){
    const client = new SpotifyWebApi();
    client.setAccessToken(token.access_token)
    const result = await client.getMyDevices();
    if(!result)return;
    let devices = result.devices
    for (i in devices){
      console.log(devices[i].type);
      if(devices[i].type == "Smartphone")setDevice(devices[i].id)
    }
  }

  async function play(){
    const client = new SpotifyWebApi();
    client.setAccessToken(token.access_token)
    await client.play({
      uris:['spotify:track:1H7EboPM7h87XxTmHDE6Ug'],
      device_id:device,
      position_ms: 0
    })
  }

  React.useEffect(()=>{
    console.log(device);
    if(device){
      play()
    }
  },[device])

  React.useEffect(()=>{
    const credentials = {
      clientId : '2e4dab11cd8c42608560c988dbf341ab',
      clientSecret : '3a1d0be0efd34d8d8c04bc1bcac49044',
      redirectUri : 'https://auth.expo.io/@donalbertico/native-modules'
    }
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`)
    async function getToken(){
      try {
        const result = await fetch('https://accounts.spotify.com/api/token',{
          method: 'POST',
          headers: {
            Authorization: `Basic ${credsB64}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body : `grant_type=authorization_code&code=${authResponse.params.code}&redirect_uri=${redirectUri}`
        });
        const json = await result.json()
        if(json) setToken(json)

      } catch (e) {
        console.log(e);
      }

    }
    if(authResponse) {
      getToken()
    }
  },[authResponse])

  React.useEffect(()=>{
    if(token){
      fetchDevices()
    }
  },[token])

  callModule = () =>{
    promptAsync()
    Modulin.printi('asdr')
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={callModule}>
        <Text>Open up App.js to start working on your app!</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

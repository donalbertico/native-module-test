package com.donalbertico.nativemodules; // replace com.your-app-name with your app’s name
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.SpotifyAppRemote;
import com.spotify.protocol.client.Subscription;
import com.spotify.protocol.types.PlayerState;
import com.spotify.protocol.types.Track;

import java.util.Map;
import java.util.HashMap;
import android.util.Log;


public class Modulin extends ReactContextBaseJavaModule {
    private static final String CLIENT_ID = "2e4dab11cd8c42608560c988dbf341ab";
    private static final String REDIRECT_URI = "";

    ReactApplicationContext currentContext;
    Modulin(ReactApplicationContext context) {
        super(context);
        currentContext = context;
    }
    @Override
    public String getName(){
        return "Modulin";
    }
    @Override
    public Map<String,Object> getConstants(){
        final Map<String,Object> constants = new HashMap<>();
        constants.put("DEFAULT_EVENT_NAME","New Event");
        return constants;
    }
    @ReactMethod
    public void printi(String msg){
        Log.d("ULALALALALAXXXXXXXX","CONFIRMALOOOOOO"+msg);
        WritableMap params = Arguments.createMap();
        params.putString("eventProperty","pejelo");
        sendEvent(currentContext,"ploploEvent",params);
    }

    private void sendEvent(ReactContext reactContext,String eventName,WritableMap params){
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName,params);
    }

}

package site.nohan.protoprogression.Network.Connectivity;

import android.app.Activity;
import android.util.Log;

import com.android.volley.VolleyError;

import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.ConnectionManager;

public class ConnectionCheckerResponse implements APIListenner {

    Activity activity;

    public ConnectionCheckerResponse(Activity activity) {
        this.activity = activity;
    }

    @Override
    public void onErrorResponse(VolleyError error) {
        if(!ConnectionManager.wasDisconnected()) {
            Log.e("Net" , "La connexion a été perdue \n" + error.toString());
        }
        ConnectionManager.setDisconnected();
    }

    @Override
    public void onResponse(Object response) {
        if(ConnectionManager.wasDisconnected()) {
            ConnectionManager.setConnected();
            Log.e("Net" , "La connexion a été récupérée ");
            ConnectionManager.sync(activity);
        }

    }
}

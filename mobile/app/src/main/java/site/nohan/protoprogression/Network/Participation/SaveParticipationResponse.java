package site.nohan.protoprogression.Network.Participation;

import android.app.Activity;
import android.util.Log;

import com.android.volley.VolleyError;

import java.io.UnsupportedEncodingException;

import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.ConnectionManager;
import site.nohan.protoprogression.Network.DataBase;

public class SaveParticipationResponse implements APIListenner {
    Activity activity;
    TypeEvent typeEvent;
    int data;
    int id;

    public SaveParticipationResponse(Activity activity, TypeEvent typeEvent, int data, int id) {
        this.activity = activity;
        this.typeEvent = typeEvent;
        this.data = data;
        this.id = id;
    }

    @Override
    public void onErrorResponse(VolleyError error) {
        DataBase.addFailEvent(this.id, this.typeEvent, this.data);
        ConnectionManager.setDisconnected();
        Log.e("net/failEvent", error.toString() + "\n" + error.getMessage() );


        String body = "fail";
        if(error.networkResponse != null && error.networkResponse.data != null) {
            try {
                body = new String(error.networkResponse.data,"UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        Log.e("net/SavePartResp/err", body.toString() );
    }

    @Override
    public void onResponse(Object response) {
        Log.e("net/SavePartResp/OK", "event envoyé ");
        DataBase.deleteFailedToSend(this.id, this.typeEvent, this.data);
        DataBase.addNewEvent(this.id, this.typeEvent, this.data);

        /*
        if(ConnectionManager.wasDisconnected()){
            ConnectionManager.sync(this.activity);
        }

        ConnectionManager.setConnected();
         */
    }
}

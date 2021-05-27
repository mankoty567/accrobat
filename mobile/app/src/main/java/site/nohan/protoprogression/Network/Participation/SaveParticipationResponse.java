package site.nohan.protoprogression.Network.Participation;

import android.util.Log;

import com.android.volley.VolleyError;

import java.io.UnsupportedEncodingException;

import site.nohan.protoprogression.Network.APIListenner;

public class SaveParticipationResponse implements APIListenner {

    public SaveParticipationResponse(){}

    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("net/SavePartResp/err", error.toString() );
        String body = "err sur err";
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
        Log.e("net/SavePartResp/OK", response.toString());
    }
}

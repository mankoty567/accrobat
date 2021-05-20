package site.nohan.protoprogression.Network.Participation;

import android.util.Log;

import com.android.volley.VolleyError;

import site.nohan.protoprogression.Network.APIListenner;

public class SaveParticipationResponse implements APIListenner {
    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("net/SavePartResp/err", error.toString());
    }

    @Override
    public void onResponse(Object response) {
        Log.e("net/SavePartResp/OK", response.toString());
    }
}

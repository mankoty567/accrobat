package site.nohan.protoprogression.Network.Map;

import android.util.Log;

import com.android.volley.VolleyError;

import site.nohan.protoprogression.Network.APIListenner;

public class MapResponse implements APIListenner {


    @Override
    public void onErrorResponse(VolleyError error) {

    }

    @Override
    public void onResponse(Object response) {
        Log.e("map", response.toString());
    }
}

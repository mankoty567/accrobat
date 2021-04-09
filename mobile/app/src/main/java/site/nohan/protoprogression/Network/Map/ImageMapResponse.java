package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.graphics.Bitmap;

import com.android.volley.Response;
import com.android.volley.VolleyError;

import site.nohan.protoprogression.Model.Map;


public class ImageMapResponse implements Response.Listener<Bitmap>, Response.ErrorListener {
    Activity activity;

    ImageMapResponse(Activity activity){
        this.activity = activity;
    }

    @Override
    public void onErrorResponse(VolleyError error) {

    }

    @Override
    public void onResponse(Bitmap response) {
        Map.background = response;
    }
}

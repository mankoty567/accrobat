package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.graphics.Bitmap;
import android.util.Log;

import com.android.volley.Response;
import com.android.volley.VolleyError;

import java.util.ArrayList;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.View.ui.home.HomeListChallengesAdapter;

public class AvatarMapResponse implements Response.Listener<Bitmap>, Response.ErrorListener {
    private final ArrayList<Bitmap> bitmaps;
    Activity activity;

    AvatarMapResponse(Activity activity, ArrayList<Bitmap> bitmaps){
        this.activity = activity;
        this.bitmaps = bitmaps;
    }

    @Override
    public void onErrorResponse(VolleyError error) {

    }

    @Override
    public void onResponse(Bitmap response) {
        Log.e("onResponse: ", "bitmap ok");
        HomeListChallengesAdapter.lastInstance.notifyDataSetChanged();
        bitmaps.add(response);
    }
}

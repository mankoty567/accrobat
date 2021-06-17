package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.graphics.Bitmap;
import android.util.Log;
import android.widget.ImageView;

import com.android.volley.AuthFailureError;
import com.android.volley.toolbox.ImageRequest;

import java.util.HashMap;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.DataBase;

public class ImageMapRequest extends ImageRequest {
    public ImageMapRequest(Activity activity, int mapId, Map map) {
        super(
                APIRequestGET.APIURL+"challenge/"+mapId+"/image",
                new ImageMapResponse(activity, map),
                0,
                0,
                ImageView.ScaleType.CENTER_CROP,
                Bitmap.Config.RGB_565,
                new ImageMapResponse(activity, map)
        );
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
    }

    /******************************************
     * Méthode utilisé pour transmettre le token
     ******************************************/
    @Override
    public java.util.Map<String, String> getHeaders() throws AuthFailureError {
        java.util.Map<String,String> headers = new HashMap<>();
        headers.putAll(super.getHeaders());
        if(DataBase.getMoi().getToken() != null && !DataBase.getMoi().getToken().equals("")) {
            //Log.d("TOKEN_OK", DataBase.token_user + "");
            headers.put("Authorization", "Bearer " + DataBase.getMoi().getToken());
        } else {
            Log.e("TOKEN_EMPTY", DataBase.getMoi().getToken() + "");
        }
        return headers;
    }
}

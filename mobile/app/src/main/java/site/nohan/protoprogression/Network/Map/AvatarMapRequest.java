package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.graphics.Bitmap;
import android.util.Log;
import android.widget.ImageView;

import com.android.volley.AuthFailureError;
import com.android.volley.toolbox.ImageRequest;

import java.util.ArrayList;
import java.util.HashMap;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.DataBase;

public class AvatarMapRequest extends ImageRequest {

    public static ArrayList<Bitmap> bitmaps = new ArrayList<>();

    public AvatarMapRequest(Activity activity, int mapId, ArrayList<Bitmap> bitmaps) {
        super(
                APIRequestGET.APIURL+"challenge/"+mapId+"/avatar",
                new AvatarMapResponse(activity, bitmaps),
                0,
                0,
                ImageView.ScaleType.CENTER_CROP,
                Bitmap.Config.RGB_565,
                new AvatarMapResponse(activity, bitmaps)
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
        if(DataBase.getMoi().getToken() != null && DataBase.getMoi().getToken() != "") {
            //Log.d("TOKEN_OK", DataBase.token_user + "");
            headers.put("Authorization", "Bearer " + DataBase.getMoi().getToken());
        } else {
            Log.e("TOKEN_EMPTY", DataBase.getMoi().getToken() + "");
        }
        return headers;
    }
}

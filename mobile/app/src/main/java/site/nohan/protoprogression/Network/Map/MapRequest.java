package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import java.util.HashMap;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.DataBase;

public class MapRequest extends APIRequestGET {
    static String mapURL = "challenge/";

    private Map map;

    public MapRequest(Activity activity,  int mapId, Map map) {
        super(activity, "challenge/"+mapId+"?include=pointsegmentobstacle", new MapResponse(activity, map));
        Log.e("net mapRequest", this.getUrl());
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

package site.nohan.protoprogression.Network.Authenticate.WhoAmI;

import android.app.Activity;
import android.util.Log;

import androidx.fragment.app.Fragment;

import com.android.volley.AuthFailureError;

import java.util.HashMap;
import java.util.Map;

import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.APIRequestPOST;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.ui.home.HomeFragment;

public class WhoAmIRequest extends APIRequestGET {

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public WhoAmIRequest(Activity activity) {
        super(activity, "user/whoami", new WhoAmIResponse(activity));
        Log.d("net", this.getUrl());
        Log.e("err", (APIRequestPOST.queue == null)+"");
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
    }

    /******************************************
     * Méthode utilisé pour transmettre le token
     ******************************************/
    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String,String> headers = new HashMap<>();
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

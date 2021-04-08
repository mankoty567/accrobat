package site.nohan.protoprogression.Network.WhoAmI;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.APIRequestPOST;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Signup.SignupResponse;
import site.nohan.protoprogression.View.ui.home.HomeFragment;
import site.nohan.protoprogression.View.ui.home.SigninFragment;
import site.nohan.protoprogression.View.ui.home.SignupFragment;

public class WhoAmIRequest extends APIRequestGET {

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public WhoAmIRequest(Activity activity, HomeFragment homeFragment) {
        super(activity, "user/whoami", new WhoAmIResponse(activity, homeFragment));
        Log.d("net", this.getUrl());
        APIRequestPOST.queue.add(this);
        APIRequestPOST.queue.start();
    }

    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String,String> headers = new HashMap<>();
        headers.putAll(super.getHeaders());
        if(DataBase.token_user != null && DataBase.token_user != "") {
            //Log.d("TOKEN_OK", DataBase.token_user + "");
            headers.put("Authorization", "Bearer " + DataBase.token_user);
        } else {
            Log.e("TOKEN_EMPTY", DataBase.token_user + "");
        }
        return headers;
    }
}

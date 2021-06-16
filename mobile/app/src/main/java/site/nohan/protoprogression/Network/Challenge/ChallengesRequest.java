package site.nohan.protoprogression.Network.Challenge;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import java.util.HashMap;
import java.util.Map;

import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.ui.home.HomeListChallengesAdapter;

public class ChallengesRequest extends APIRequestGET {

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public ChallengesRequest(Activity activity, HomeListChallengesAdapter homeListChallengesAdapter) {
        super(activity, "challenge", new ChallengesResponse(activity, homeListChallengesAdapter));
        Log.e("net", this.getUrl());
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
        Log.e("net", "demande challenge envoyé");
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

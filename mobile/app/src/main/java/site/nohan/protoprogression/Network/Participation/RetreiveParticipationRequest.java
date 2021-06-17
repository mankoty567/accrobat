package site.nohan.protoprogression.Network.Participation;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import java.util.HashMap;
import java.util.Map;

import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.DataBase;

public class RetreiveParticipationRequest extends APIRequestGET {


    /******************************************
     * Constructeur de la requête
     ******************************************/
    public RetreiveParticipationRequest(Activity activity, int participationId) {
        super(activity, "participation/"+participationId+"/whereiam", new RetreiveParticipationResponse(activity));
        Log.e("net", this.getUrl());
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
        Log.e("net", "Recupération de la progression");
    }

    /******************************************
     * Méthode utilisé pour transmettre le token
     ******************************************/
    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String, String> headers = new HashMap<>();
        headers.putAll(super.getHeaders());
        if (DataBase.getMoi().getToken() != null && DataBase.getMoi().getToken() != "") {
            //Log.d("TOKEN_OK", DataBase.token_user + "");
            headers.put("Authorization", "Bearer " + DataBase.getMoi().getToken());
        } else {
            Log.e("TOKEN_EMPTY", DataBase.getMoi().getToken() + "");
        }
        return headers;
    }
}
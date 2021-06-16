package site.nohan.protoprogression.Network.Challenge;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import site.nohan.protoprogression.Network.APIRequestPOST;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.ui.home.SubscribeFragment;

public class SubscribeRequest extends APIRequestPOST {

    /******************************************
     * Création des varaibles globales
     ******************************************/
    private int challengeID;

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public SubscribeRequest(Activity activity, int challengeID, SubscribeFragment subscribeFragment) {
        super(activity, "participation", new SubscribeResponse(activity, subscribeFragment, challengeID));

        this.challengeID = challengeID;

        Log.d("net", "Inscription au challenge "+challengeID);
        APIRequestPOST.queue.add(this);
        APIRequestPOST.queue.start();
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

    /******************************************
     * Méthode utilisé pour définir le type du BODY de la requête
     ******************************************/
    @Override
    public String getBodyContentType() {
        return "application/json; charset=utf-8";
    }

    /******************************************
     * Méthode utilisé pour définir le BODY de la requête
     ******************************************/
    @Override
    public byte[] getBody() throws AuthFailureError {
        try {
            JSONObject jsonBody = new JSONObject();
            jsonBody.put("ChallengeId", challengeID);
            final String requestBody = jsonBody.toString();
            //Log.i("BODY:", requestBody +"");
            return requestBody == null ? null : requestBody.getBytes("utf-8");
        } catch (Exception e) {
            Log.e("BODY_SUBSCRIBEREQUEST", "Unsupported Encoding while trying to get the bytes of requestBody using utf-8");
            return null;
        }
    }
}

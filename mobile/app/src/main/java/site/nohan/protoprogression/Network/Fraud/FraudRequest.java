package site.nohan.protoprogression.Network.Fraud;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import site.nohan.protoprogression.Network.APIRequestPOST;
import site.nohan.protoprogression.Network.Challenge.SubscribeResponse;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.MapFragment;
import site.nohan.protoprogression.View.ui.home.SubscribeFragment;

public class FraudRequest extends APIRequestPOST {

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public FraudRequest(Activity activity) {
        super(activity, "fraude", new FraudResponse(activity));

        Log.d("net", "Envoie de Fraude");
        APIRequestPOST.queue.add(this);
        APIRequestPOST.queue.start();
    }

    /******************************************
     * Méthode utilisé pour transmettre le token
     ******************************************/
    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String, String> headers = new HashMap<>();
        headers.putAll(super.getHeaders());
        if (DataBase.getMoi().getToken() != null && !DataBase.getMoi().getToken().equals("")) {
            //Log.d("TOKEN_OK", DataBase.token_user + "");
            headers.put("Authorization", "Bearer " + DataBase.getMoi().getToken());
        } else {
            Log.e("TOKEN_EMPTY", DataBase.getMoi().getToken() + "");
        }
        return headers;
    }
}

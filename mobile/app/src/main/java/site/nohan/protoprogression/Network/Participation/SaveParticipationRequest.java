package site.nohan.protoprogression.Network.Participation;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.APIRequestPOST;
import site.nohan.protoprogression.Network.DataBase;

public class SaveParticipationRequest extends APIRequestPOST {

    String type;
    int id;
    int progression;

    /******************************************
     * Constructeur de la requête POST
     *****************************************
     * @param activity
     * @param apiListenner*/
    public SaveParticipationRequest(Activity activity, int progression, int id, String type , APIListenner apiListenner) {
        super(activity, "event/", apiListenner);
        Log.e("update", type );
        this.progression = progression;
        this.id = id;
        this.type = type;
    }

    /******************************************
     * Méthode utilisé pour transmettre le token
     ******************************************/
    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String,String> headers = new HashMap<>();
        headers.putAll(super.getHeaders());
        if(DataBase.getMoi().getToken() != null && DataBase.getMoi().getToken() != "") {
            //Log.d("TOKEN_OK", DataBase.token_user + "");
            headers.put("Authorization", "Bearer " + DataBase.getMoi().getToken());
        } else {
            Log.e("TOKEN_EMPTY", DataBase.getMoi().getToken() + "");
        }
        return headers;
    }

    @Override
    public byte[] getBody() throws AuthFailureError {
        try {
            JSONObject jsonBody = new JSONObject();
            jsonBody.put("data", ""+this.progression);
            jsonBody.put("*ParticipationId", this.id);
            jsonBody.put("*type", this.type);
            final String requestBody = jsonBody.toString();
            //Log.i("BODY:", requestBody +"");
            return requestBody == null ? null : requestBody.getBytes("utf-8");
        } catch (Exception e) {
            Log.e("BODY_SIGNUPREQUEST", "Unsupported Encoding while trying to get the bytes of requestBody using utf-8");
            return null;
        }
    }
}

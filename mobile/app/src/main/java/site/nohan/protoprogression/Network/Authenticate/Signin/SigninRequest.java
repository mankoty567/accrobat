package site.nohan.protoprogression.Network.Authenticate.Signin;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import org.json.JSONObject;

import site.nohan.protoprogression.Network.APIRequestPOST;
import site.nohan.protoprogression.View.ui.home.SigninFragment;

public class SigninRequest extends APIRequestPOST {

    /******************************************
     * Création des varaibles globales
     ******************************************/
    private String username;
    private String password;

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public SigninRequest(Activity activity, String username, String password, SigninFragment signinFragment) {
        super(activity, "user/login", new SigninResponse(activity, signinFragment));

        this.username = username;
        this.password = password;

        Log.d("net", this.getUrl());
        APIRequestPOST.queue.add(this);
        APIRequestPOST.queue.start();
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
            jsonBody.put("username", username);
            jsonBody.put("password", password);
            final String requestBody = jsonBody.toString();
            //Log.i("BODY:", requestBody +"");
            return requestBody == null ? null : requestBody.getBytes("utf-8");
        } catch (Exception e) {
            Log.e("BODY_SIGNUPREQUEST", "Unsupported Encoding while trying to get the bytes of requestBody using utf-8");
            return null;
        }
    }
}

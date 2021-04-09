package site.nohan.protoprogression.Network.Authenticate.Signup;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import org.json.JSONObject;

import site.nohan.protoprogression.Network.APIRequestPOST;
import site.nohan.protoprogression.View.ui.home.SignupFragment;

public class SignupRequest extends APIRequestPOST {

    /******************************************
     * Création des varaibles globales
     ******************************************/
    private String username;
    private String password;
    private String email;

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public SignupRequest(Activity activity, String username, String password, String email, SignupFragment signupFragment) {
        super(activity, "user/register", new SignupResponse(activity, signupFragment));

        this.username = username;
        this.password = password;
        this.email = email;

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
            jsonBody.put("email", email);
            final String requestBody = jsonBody.toString();
            //Log.i("BODY:", requestBody +"");
            return requestBody == null ? null : requestBody.getBytes("utf-8");
        } catch (Exception e) {
            Log.e("BODY_SIGNUPREQUEST", "Unsupported Encoding while trying to get the bytes of requestBody using utf-8");
            return null;
        }
    }

}

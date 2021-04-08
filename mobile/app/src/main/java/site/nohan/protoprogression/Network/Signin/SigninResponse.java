package site.nohan.protoprogression.Network.Signin;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.VolleyError;

import org.json.JSONException;
import org.json.JSONObject;

import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.ui.home.SigninFragment;
import site.nohan.protoprogression.View.ui.home.SignupFragment;

public class SigninResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;
    private SigninFragment signinFragment;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public SigninResponse(Activity activity, SigninFragment signinFragment) {
        this.activity = activity;
        this.signinFragment = signinFragment;
    }

    /******************************************
     * Méthode utilisé pour traiter l'erreur de la requête
     ******************************************/
    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("ERROR_SIGNIN_REQUEST: ", "\n\n\n" + error.networkResponse + "");
        Toast.makeText(activity,"Wrong password !", Toast.LENGTH_SHORT).show();
    }

    /******************************************
     * Méthode utilisé pour traiter la réponse
     ******************************************/
    @Override
    public void onResponse(Object response) {
        //Log.d("theTag",response.toString());

        // Conversion de la réponse en JSON
        try {
            JSONObject json = new JSONObject((String) response);
            DataBase.id_user = json.getInt("id");
            DataBase.username_user = json.getString("username");
            DataBase.email_user = json.getString("email");
            DataBase.permission_user = json.getInt("permission");
            DataBase.level_user = json.getInt("level");
            DataBase.xp_user = json.getInt("xp");
            DataBase.token_user = json.getString("jwt");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        //Passage sur le Fragment de Home
        signinFragment.ShowHomeFragment();
        Toast.makeText(activity,"User successfully connected !", Toast.LENGTH_SHORT).show();
    }
}

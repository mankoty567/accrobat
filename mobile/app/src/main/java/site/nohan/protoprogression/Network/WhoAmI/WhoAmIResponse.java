package site.nohan.protoprogression.Network.WhoAmI;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.VolleyError;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.ui.home.HomeFragment;
import site.nohan.protoprogression.View.ui.home.SigninFragment;

public class WhoAmIResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;
    private HomeFragment homeFragment;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public WhoAmIResponse(Activity activity, HomeFragment homeFragment) {
        this.activity = activity;
        this.homeFragment = homeFragment;
    }

    /******************************************
     * Méthode utilisé pour traiter l'erreur de la requête
     ******************************************/
    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("ERROR_WHOAMI_REQUEST: ", "\n\n\n" + error.networkResponse + "");
        //Retour sur le Fragment de connexion
        DataBase.token_user = null;
        Toast.makeText(activity,"Please try to reconnect !", Toast.LENGTH_SHORT).show();
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
            DataBase.token_last_update = new Date();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        //Toast.makeText(activity,"Token still valid !", Toast.LENGTH_SHORT).show();
    }
}
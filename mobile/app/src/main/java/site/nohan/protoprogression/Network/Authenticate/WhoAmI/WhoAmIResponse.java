package site.nohan.protoprogression.Network.Authenticate.WhoAmI;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.android.volley.VolleyError;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

import site.nohan.protoprogression.Model.Permission;
import site.nohan.protoprogression.Model.User;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.ui.home.HomeFragment;

public class WhoAmIResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public WhoAmIResponse(Activity activity) {
        this.activity = activity;
    }

    /******************************************
     * Méthode utilisé pour traiter l'erreur de la requête
     ******************************************/
    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("ERROR_WHOAMI_REQUEST: ", "\n\n\n" + error.networkResponse + "");
        //Retour sur le Fragment de connexion
        //DataBase.token_user = null;
        User moi = DataBase.getMoi();
        moi.setToken("NULL");
        DataBase.setMoi(moi);
        //Toast.makeText(activity,"Please try to reconnect !", Toast.LENGTH_SHORT).show();
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
            User user = new User();
            user.setId(json.getInt("id"));
            user.setUsername(json.getString("username"));
            user.setEmail(json.getString("email"));
            user.setPermission((int) json.getInt("permission") == 1 ? Permission.ADMIN : Permission.USER);
            //user.setLevel() = json.getInt("level");
            user.setExperience(json.getInt("xp"));
            user.setToken(json.getString("jwt"));
            user.setToken_last_update(new Date());
            DataBase.setMoi(user);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        //Toast.makeText(activity,"Token still valid !", Toast.LENGTH_SHORT).show();
    }
}
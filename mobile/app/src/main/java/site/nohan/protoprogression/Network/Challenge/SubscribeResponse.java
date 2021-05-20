package site.nohan.protoprogression.Network.Challenge;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Permission;
import site.nohan.protoprogression.Model.User;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.HomeListChallengesAdapter;
import site.nohan.protoprogression.View.ui.home.SubscribeFragment;

import static site.nohan.protoprogression.Network.DataBase.getMoi;

public class SubscribeResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;
    private SubscribeFragment subscribeFragment;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public SubscribeResponse(Activity activity, SubscribeFragment subscribeFragment) {
        this.activity = activity;
        this.subscribeFragment = subscribeFragment;
    }

    /******************************************
     * Méthode utilisé pour traiter l'erreur de la requête
     ******************************************/
    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("SUBSCRIBE_REQUEST: ", "\n\n\n" + error.networkResponse + "");
        Toast.makeText(activity,"No challenge founded !", Toast.LENGTH_SHORT).show();
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
            User.challengesSubscribedIDs.add(json.getInt("ChallengeId"));

            subscribeFragment.subscribeToMap(true);

        } catch (JSONException e) {
            e.printStackTrace();
        }

        //Toast.makeText(activity,"Token still valid !", Toast.LENGTH_SHORT).show();
    }
}

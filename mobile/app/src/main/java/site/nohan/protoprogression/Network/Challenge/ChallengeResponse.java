package site.nohan.protoprogression.Network.Challenge;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.ui.home.HomeFragment;

public class ChallengeResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public ChallengeResponse(Activity activity) {
        this.activity = activity;
    }

    /******************************************
     * Méthode utilisé pour traiter l'erreur de la requête
     ******************************************/
    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("CHALLENGES_REQUEST: ", "\n\n\n" + error.networkResponse + "");
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
            JSONArray jsonArray = new JSONArray((String) response);
            //(JSONArray) response;

            DataBase.list_id = new int[jsonArray.length()];
            DataBase.txt_list_title = new String[jsonArray.length()];
            DataBase.txt_list_description = new String[jsonArray.length()];

            for(int i=0; i<jsonArray.length(); i++){
               JSONObject json = jsonArray.getJSONObject(i);
               DataBase.list_id[i] = json.getInt("id");
               DataBase.txt_list_title[i] = json.getString("title");
               DataBase.txt_list_description[i] = json.getString("description");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        //Toast.makeText(activity,"Token still valid !", Toast.LENGTH_SHORT).show();
    }
}

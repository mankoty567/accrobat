package site.nohan.protoprogression.Network.Challenge;

import android.app.Activity;
import android.util.Log;
import android.widget.ListView;
import android.widget.Toast;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import site.nohan.protoprogression.Model.Avatar;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Map.AvatarMapRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.HomeFragment;
import site.nohan.protoprogression.View.ui.home.HomeListChallengesAdapter;

public class ChallengesResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;
    private HomeListChallengesAdapter homeListChallengesAdapter;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public ChallengesResponse(Activity activity, HomeListChallengesAdapter homeListChallengesAdapter) {
        this.activity = activity;
        this.homeListChallengesAdapter = homeListChallengesAdapter;
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

            /*
            Map carte = new Map();
            carte.

            HomeListChallengesAdapter.cartes.add()
            */


            JSONArray jsonArray = new JSONArray((String) response);
            //(JSONArray) response;
            Log.e("info","Reception de "+jsonArray.length()+" map(s)");
            Map.maps = new ArrayList<>();

            for(int i=0; i<jsonArray.length();i++){
                JSONObject jMap = (JSONObject) jsonArray.get(i);
                Map map = new Map();
                map.id = jMap.getInt("id");
                map.libelle = jMap.getString("title");
                map.date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(jMap.getString("createdAt"));
                map.description = jMap.getString("description");
                Log.e("onResponse: ", map.id+"");
                new AvatarMapRequest(activity, map.id);
                Map.maps.add(map);
            }

            homeListChallengesAdapter.notifyDataSetChanged();

        } catch (JSONException | ParseException e) {
            e.printStackTrace();
        }

        //Toast.makeText(activity,"Token still valid !", Toast.LENGTH_SHORT).show();
    }
}

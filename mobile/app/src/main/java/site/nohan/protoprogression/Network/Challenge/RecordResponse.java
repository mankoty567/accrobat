package site.nohan.protoprogression.Network.Challenge;

import android.app.Activity;
import android.provider.ContactsContract;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.View.ui.home.HomeListChallengesAdapter;
import site.nohan.protoprogression.View.ui.home.SubscribeListRecordsAdapter;

public class RecordResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;
    private SubscribeListRecordsAdapter subscribeListRecordsAdapter;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public RecordResponse(Activity activity, SubscribeListRecordsAdapter subscribeListRecordsAdapter) {
        this.activity = activity;
        this.subscribeListRecordsAdapter = subscribeListRecordsAdapter;
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
            Log.e("RECORD_RESPONSE","Reception de "+jsonArray.length()+" record(s)");

            for(int i=0; i<jsonArray.length();i++){
                JSONObject jRecord = (JSONObject) jsonArray.get(i);
                int participationID = jRecord.getInt("id");
                long duration = jRecord.getLong("duration");
                JSONArray jsonArrayUser = jRecord.getJSONArray("user");
                JSONObject jUser = (JSONObject) jsonArrayUser.get(0);
                String username = jUser.getString("username");
                DataBase.addRecord(participationID, duration, username);
            }

            subscribeListRecordsAdapter.notifyDataSetChanged();

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}

package site.nohan.protoprogression.Network.Fraud;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.VolleyError;

import org.json.JSONException;
import org.json.JSONObject;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.User;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.HomeFragment;
import site.nohan.protoprogression.View.ui.home.SubscribeFragment;

public class FraudResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public FraudResponse(Activity activity) {
        this.activity = activity;
    }

    /******************************************
     * Méthode utilisé pour traiter l'erreur de la requête
     ******************************************/
    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("FRAUD_REQUEST: ", "\n\n\n" + error.networkResponse + "");
        Toast.makeText(activity,"Fraud not sended !", Toast.LENGTH_SHORT).show();
    }

    /******************************************
     * Méthode utilisé pour traiter la réponse
     ******************************************/
    @Override
    public void onResponse(Object response) {
        Log.d("net","Fraude envoyée !");
    }
}
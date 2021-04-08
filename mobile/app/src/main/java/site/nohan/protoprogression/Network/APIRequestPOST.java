package site.nohan.protoprogression.Network;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.Nullable;

import com.android.volley.AuthFailureError;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class APIRequestPOST extends StringRequest {

    /******************************************
     * Création des variables
     ******************************************/
    public static RequestQueue queue;
    public static String APIURL = "https://api.acrobat.bigaston.dev/api/";

    /******************************************
     * Constructeur de la requête POST
     ******************************************/
    public APIRequestPOST(Activity activity, String ressource, APIListenner apiListenner){
        super(Method.POST,APIRequestPOST.APIURL+ressource, apiListenner, apiListenner);
        if(APIRequestPOST.queue == null)
            APIRequestPOST.queue = Volley.newRequestQueue(activity);
    }
}

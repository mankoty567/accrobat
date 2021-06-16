package site.nohan.protoprogression.Network;

import android.app.Activity;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

public class APIRequestGET extends StringRequest {

    /******************************************
     * Création des variables
     ******************************************/
    public static RequestQueue queue;
    public static String SERVERURL = "https://api.acrobat.bigaston.dev/";
    public static String APIURL = "https://api.acrobat.bigaston.dev/api/";

    /******************************************
     * Constructeur de la requête GET
     ******************************************/
    public APIRequestGET(Activity activity, String ressource, APIListenner apiListenner){
        super(Method.GET,APIRequestGET.APIURL+ressource, apiListenner, apiListenner);
        if(APIRequestGET.queue == null)
            APIRequestGET.queue = Volley.newRequestQueue(activity);
    }



}

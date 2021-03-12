package site.nohan.protoprogression.Network;

import android.app.Activity;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

public class APIRequest extends StringRequest {

    public static RequestQueue queue;
    public static String APIURL = "https://api.acrobat.bigaston.dev/api/";

    private final Activity activity;


    public APIRequest(Activity activity, String ressource, APIListenner apiListenner){
        super(Method.GET,APIRequest.APIURL+ressource, apiListenner, apiListenner);
        this.activity = activity;
        if(APIRequest.queue == null)
            APIRequest.queue = Volley.newRequestQueue(activity);
    }



}

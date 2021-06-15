package site.nohan.protoprogression.Network.Connectivity;

import android.app.Activity;

import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.APIRequestPOST;

public class ConnectionCheckerRequest extends StringRequest {

    /******************************************
     * Constructeur de la requête GET
     *****************************************
     * @param activity
     * */
    public ConnectionCheckerRequest(Activity activity) {
        super(Method.GET,APIRequestGET.SERVERURL, new ConnectionCheckerResponse(activity), new ConnectionCheckerResponse(activity));
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
    }


}

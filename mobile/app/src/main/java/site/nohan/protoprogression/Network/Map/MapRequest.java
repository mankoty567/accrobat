package site.nohan.protoprogression.Network.Map;

import android.app.Activity;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIRequest;

public class MapRequest extends APIRequest {
    static String mapURL = "challenge/";

    private Map map;


    MapRequest(Activity activity,  int mapId) {
        super(activity, APIRequest.APIURL+"challenge/"+mapId, new MapResponse());
        APIRequest.queue.add(this);
        APIRequest.queue.start();
    }



}

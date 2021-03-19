package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.util.Log;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIRequest;

public class MapRequest extends APIRequest {
    static String mapURL = "challenge/";

    private Map map;

    public MapRequest(Activity activity,  int mapId) {
        super(activity, "challenge/"+mapId+"?include=pointsegment", new MapResponse());
        Log.e("net", this.getUrl());
        APIRequest.queue.add(this);
        APIRequest.queue.start();
    }



}

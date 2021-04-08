package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.util.Log;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIRequestGET;

public class MapRequest extends APIRequestGET {
    static String mapURL = "challenge/";

    private Map map;

    public MapRequest(Activity activity,  int mapId) {
        super(activity, "challenge/"+mapId+"?include=pointsegment", new MapResponse(activity));
        Log.e("net", this.getUrl());
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
    }



}

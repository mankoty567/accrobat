package site.nohan.protoprogression.Network.Challenge;

import android.app.Activity;
import android.util.Log;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.Network.Map.MapResponse;

public class ChallengesRequest extends APIRequestGET {

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public ChallengesRequest(Activity activity) {
        super(activity, "challenge", new ChallengeResponse(activity));
        Log.e("net", this.getUrl());
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
    }
}

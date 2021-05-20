package site.nohan.protoprogression.Network.Challenge;

import android.app.Activity;
import android.util.Log;

import site.nohan.protoprogression.Network.APIRequestGET;
import site.nohan.protoprogression.View.ui.home.HomeListChallengesAdapter;

public class ChallengesRequest extends APIRequestGET {

    /******************************************
     * Constructeur de la requête
     ******************************************/
    public ChallengesRequest(Activity activity, HomeListChallengesAdapter homeListChallengesAdapter) {
        super(activity, "challenge", new ChallengesResponse(activity, homeListChallengesAdapter));
        Log.e("net", this.getUrl());
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
        Log.e("net", "demande challenge envoyé");
    }
}

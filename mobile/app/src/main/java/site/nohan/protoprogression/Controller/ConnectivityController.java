package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.util.Log;

import java.util.TimerTask;

import site.nohan.protoprogression.Network.ConnectionManager;
import site.nohan.protoprogression.Network.Connectivity.ConnectionCheckerRequest;

public class ConnectivityController extends TimerTask {

    private Activity activity;

    public ConnectivityController(Activity activity) {
        this.activity = activity;
    }


    @Override
    public void run() {
        new ConnectionCheckerRequest(activity);
    }
}

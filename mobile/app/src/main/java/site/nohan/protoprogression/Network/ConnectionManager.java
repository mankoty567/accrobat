package site.nohan.protoprogression.Network;

import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkInfo;
import android.util.Log;

import java.util.ArrayList;

import site.nohan.protoprogression.Model.Event;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;

public class ConnectionManager extends ConnectivityManager.NetworkCallback {
    private static boolean isConnected;
    Activity activity;

    public ConnectionManager(Activity activity) {
        this.activity = activity;
    }


    public static void restore(Activity activity) {
        Log.e("NET" , "restauration" );
        ArrayList<Event> events = DataBase.getFailEvents();
        for(Event event : events){
            new SaveParticipationRequest(activity, event.getTypeEvent(), event.getData(), event.getParticipationId(),
                    new SaveParticipationResponse(
                            activity, event.getTypeEvent(), event.getData(), event.getParticipationId()
                    ));
        }
        Log.e("DB", "Restauration de " +events.size() + " events");
        DataBase.clearEvents();
    }

    public static boolean isConnected(Activity activity) {
        ConnectivityManager connectivityManager = (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    public static void tryToRestore(Activity activity) {

        Log.e("NET", "connecté" );
    }

    @Override
    public void onLost(Network network) {
        Log.e("NET" , "déconnecté" );
        isConnected = false;
    }


}

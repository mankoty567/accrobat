package site.nohan.protoprogression.Network;

import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;
import android.widget.Toast;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;

import site.nohan.protoprogression.Model.Event;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;

public class ConnectionManager extends ConnectivityManager.NetworkCallback {
    private static boolean isConnected;
    Activity activity;

    public ConnectionManager(Activity activity) {
        this.activity = activity;
    }


    public static void sync(Activity activity) {

        if(!checkConnexion(activity))
            return;
        ArrayList<Event> events = DataBase.getFailEvents();
        Log.e("NET" , "ReSyncronisation de " + events.size() );
        if(events.size() == 0)
            return;
        for(Event event : events){
            new SaveParticipationRequest(activity, event.getTypeEvent(), event.getData(), event.getParticipationId(),
                    new SaveParticipationResponse(
                            activity, event.getTypeEvent(), event.getData(), event.getParticipationId()
                    ));
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Log.e("InterruptedException", e+"");
                // Restore interrupted state...
                Thread.currentThread().interrupt();
            }
            //DataBase.deleteFailedToSend(event.getParticipationId(), event.getTypeEvent(), event.getData());
        }
        Log.e("DB", "" +events.size() + " events syncronisés ");
        Toast.makeText(activity, events.size() + " évenements ont été syncronisé !" , Toast.LENGTH_LONG).show();

    }

    public static boolean checkConnexion(Activity activity) {
        ConnectivityManager connectivityManager = (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    public static void setConnected() {
        Log.e("net manager", "réactivation des requêtes" );
        isConnected = true;
    }

    public static void setDisconnected(){
        Log.e("net manager", "désactivation des requêtes" );
        isConnected = false;
    }

    public static boolean wasDisconnected(){
        return !isConnected;
    }

}

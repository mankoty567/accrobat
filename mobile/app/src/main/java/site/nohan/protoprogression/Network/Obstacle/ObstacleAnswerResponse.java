package site.nohan.protoprogression.Network.Obstacle;

import android.app.Activity;
import android.content.DialogInterface;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.VolleyError;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

import site.nohan.protoprogression.Controller.ObstacleController;
import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.View.ui.obstacle.ObstacleAlertDialog;

public class ObstacleAnswerResponse implements APIListenner {

    Obstacle obstacle;
    DialogInterface dialogInterface;
    Activity activity;

    public ObstacleAnswerResponse(Activity activity, Obstacle obstacle, DialogInterface dialogInterface){
        this.obstacle = obstacle;
        this.dialogInterface = dialogInterface;
        this.activity = activity;
    }

    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("net obs err", error.toString() );
        String body = "err sur err @ obs";
        if(error.networkResponse != null && error.networkResponse.data != null) {
            try {
                body = new String(error.networkResponse.data,"UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        Log.e("net obs err", body.toString() );
    }

    @Override
    public void onResponse(Object response) {

        boolean isCorrect = false;
        try {
            JSONObject json = new JSONObject((String) response);
            isCorrect = json.getBoolean("good");
        } catch (JSONException jsonException) {
            jsonException.printStackTrace();
        }
        Log.e("net answer", isCorrect ? "OK" : "KO" );

        if(isCorrect){

            Toast toast = Toast.makeText(this.activity.getBaseContext(), "Bonne réponse !", Toast.LENGTH_LONG);
            //toast.setGravity(10,0,0);
            toast.show();
            this.dialogInterface.dismiss();
            obstacle.resolu = true;
            ObstacleAlertDialog.isActive = false;
        }else{
            Toast.makeText(this.activity.getBaseContext(), "Mauvaise réponse", Toast.LENGTH_LONG).show();
            //toast.setGravity(10,0,0);
        }

    }
}

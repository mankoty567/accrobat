package site.nohan.protoprogression.Network.Obstacle;

import android.content.DialogInterface;
import android.util.Log;

import com.android.volley.VolleyError;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

import site.nohan.protoprogression.Controller.ObstacleController;
import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.Network.APIListenner;

public class ObstacleAnswerResponse implements APIListenner {

    Obstacle obstacle;
    DialogInterface dialogInterface;

    public ObstacleAnswerResponse(Obstacle obstacle, DialogInterface dialogInterface){
        this.obstacle = obstacle;
        this.dialogInterface = dialogInterface;
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
        if(isCorrect){
            this.dialogInterface.dismiss();
            ObstacleController.isShown = false;
        }

    }
}

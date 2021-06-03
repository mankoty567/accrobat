package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.content.DialogInterface;
import android.view.View;
import android.widget.EditText;

import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.Network.Obstacle.ObstacleAnswerRequest;
import site.nohan.protoprogression.Network.Obstacle.ObstacleAnswerResponse;

public class ObstacleController implements View.OnClickListener {

    private Activity activity;
    private Obstacle obstacle;
    private EditText input;
    private DialogInterface dialogInterface;

    public ObstacleController(Activity activity, Obstacle obstacle, EditText input, DialogInterface dialogInterface) {
        this.activity = activity;
        this.obstacle = obstacle;
        this.input = input;
        this.dialogInterface = dialogInterface;
    }

    @Override
    public void onClick(View view) {
        // Si la réponse est bonne on ferme la boite
        new ObstacleAnswerRequest(
                this.activity,
                obstacle.id,
                this.input.getText().toString(),
                new ObstacleAnswerResponse(this.activity, obstacle, dialogInterface)
        );
        /*
        obstacle.resolu = true;
        dialogInterface.dismiss();
        ObstacleController.isShown = false;
         */
    }
}

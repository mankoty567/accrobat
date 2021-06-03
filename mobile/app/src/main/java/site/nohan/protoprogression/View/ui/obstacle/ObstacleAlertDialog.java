package site.nohan.protoprogression.View.ui.obstacle;

import android.app.Activity;
import android.app.AlertDialog;
import android.text.InputType;
import android.widget.EditText;

import site.nohan.protoprogression.Controller.ObstacleController;
import site.nohan.protoprogression.Controller.ui.ObstacleAlertDialogListenner;
import site.nohan.protoprogression.Model.Obstacle;

public class ObstacleAlertDialog {
    public static boolean isActive = false;

    Activity activity;
    final EditText input;
    final AlertDialog alertDialog;

    public ObstacleAlertDialog(Activity activity, Obstacle obstacle){
        this.activity = activity;
        input = new EditText(this.activity);
        input.setInputType(InputType.TYPE_CLASS_TEXT);

        alertDialog = new AlertDialog.Builder(this.activity)
                .setView(input)
                .setCancelable(false)
                .setTitle(obstacle.titre)
                .setMessage(obstacle.description)
                .setPositiveButton(android.R.string.ok, null) //Set to null. We override the onclick
                .create();
        alertDialog.setOnShowListener(
                new ObstacleAlertDialogListenner(
                        this.activity,
                        obstacle,
                        input,
                        alertDialog
                )
        );

        if(!ObstacleAlertDialog.isActive)
            alertDialog.show();
        ObstacleAlertDialog.isActive = true;

    }
}

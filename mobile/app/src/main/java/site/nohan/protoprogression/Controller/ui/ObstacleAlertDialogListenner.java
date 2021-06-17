package site.nohan.protoprogression.Controller.ui;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.res.ColorStateList;
import android.widget.Button;
import android.widget.EditText;

import site.nohan.protoprogression.Controller.ObstacleController;
import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.R;

public class ObstacleAlertDialogListenner implements DialogInterface.OnShowListener {

    Activity activity;
    Obstacle obstacle;
    EditText input;
    DialogInterface alertDialog;

    public ObstacleAlertDialogListenner(Activity activity, Obstacle obstacle, EditText input, DialogInterface alertDialog) {
        this.activity = activity;
        this.obstacle = obstacle;
        this.input = input;
        this.alertDialog = alertDialog;
    }

    @Override
    public void onShow(DialogInterface dialogInterface) {
        Button button = ((AlertDialog) alertDialog).getButton(AlertDialog.BUTTON_POSITIVE);
        button.setBackgroundTintList(ColorStateList.valueOf(activity.getResources().getColor(R.color.blue_button, null)));
        button.setOnClickListener(new ObstacleController(activity, obstacle, input, alertDialog));

    }
}

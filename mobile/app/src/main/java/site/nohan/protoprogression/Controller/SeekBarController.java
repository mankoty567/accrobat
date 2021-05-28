package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.res.ColorStateList;
import android.graphics.Point;
import android.text.InputType;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.SeekBar;

import androidx.annotation.Nullable;

import java.text.DateFormat;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.MapFragment;
import site.nohan.protoprogression.View.Toile;

public class SeekBarController implements SeekBar.OnSeekBarChangeListener {
    public static double dernierePositionConnueAPI = 0;

    private final Activity activity;
    private final MapFragment mapFragment;
    private final Toile toile;
    ButtonController buttonController;

    public SeekBarController(MapFragment mapFragment){
        this.mapFragment = mapFragment;
        this.activity = mapFragment.getActivity();
        this.toile = mapFragment.toile;
    }

    public void setButtonController(ButtonController buttonController) {
        this.buttonController = buttonController;
    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
        Button button;

        // Selection du chemin
        LinearLayout linearLayout = this.activity.findViewById(R.id.routeSelect);
        if(Map.mapActuelle.cheminActuel == null)
            return;

        //Log.e("onProgressChanged", Map.mapActuelle.toString() );
        DataBase.saveProgression();

        new SaveParticipationRequest(this.activity, TypeEvent.MARCHE, progress, Map.participationId, new SaveParticipationResponse());
        //Log.e("lele", DataBase.getSubscribed().toString());
        Obstacle obstacle = this.detecterObstacle();
        if(obstacle != null){
            Log.e("seekbar", "obstacle "+obstacle.id );
            new SaveParticipationRequest(
                    this.activity,
                    TypeEvent.OSTACLE,
                    obstacle.id,
                    Map.participationId,
                    new SaveParticipationResponse()
            );

            final EditText input = new EditText(this.activity);

            input.setInputType(InputType.TYPE_CLASS_TEXT);
            final AlertDialog dialog = new AlertDialog.Builder(this.activity)
                    .setView(input)
                    .setCancelable(false)
                    .setTitle(obstacle.titre)
                    .setMessage(obstacle.description)
                    .setPositiveButton(android.R.string.ok, null) //Set to null. We override the onclick
                    .create();

            dialog.setOnShowListener(new DialogInterface.OnShowListener() {

                @Override
                public void onShow(DialogInterface dialogInterface) {

                    Button button = ((AlertDialog) dialog).getButton(AlertDialog.BUTTON_POSITIVE);
                    button.setBackgroundTintList(ColorStateList.valueOf(mapFragment.getResources().getColor(R.color.purple_200, null)));
                    button.setOnClickListener(new ObstacleController(activity, obstacle, input, dialog));

                }
            });
            if(!ObstacleController.isShown)
                dialog.show();
            ObstacleController.isShown = true;

        }
        //new SaveParticipationRequest(this.activity, progress, Map.participationId, "marche", new SaveParticipationResponse());
        if(progress == 100){

            //buttonController.stopPedometerAndGPS();

            if(linearLayout.getChildCount() < 1){
                Log.e("chld", ""+linearLayout.getChildCount());
                //Log.e("suiv",Map.cheminActuel.suivants.get(0).title);

                for(Chemin c : Map.mapActuelle.cheminActuel.objectif.chemins){
                    if(c.objectif == null)
                        break;
                    Log.e("suiv",c.objectif.titre);
                    button = new Button(this.activity);
                    button.setOnClickListener(new DirectionController(c,toile,this.activity));
                    button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.purple_200, null)));
                    button.setText(c.objectif.titre + " par " + c.nom);

                    linearLayout.addView(button);
                }

                if(Map.mapActuelle.cheminActuel.objectif.chemins.get(0).objectif == null){
                    button = new Button(this.activity);
                    button.setOnClickListener(new ArriveeController(this.activity));
                    button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.green, null)));
                    button.setText("Terminer la course");
                    linearLayout.addView(button);
                    Log.e("seekbar", "course terminée");
                }


            }
        }else{
            for(int i=0;i<linearLayout.getChildCount();i++)
            {
                linearLayout.removeAllViews();
            }
        }

        Map.mapActuelle.accompli = (int) Math.floor(((float) progress*Map.mapActuelle.cheminActuel.getLongueur())/100);


    }

    @Nullable
    public Obstacle detecterObstacle(){
        for (Obstacle obstacle : Map.mapActuelle.cheminActuel.obstacles) {
            Log.e("obs", "ods"+ (obstacle.distance*100) + " maci"+ ((Map.mapActuelle.accompli/Map.mapActuelle.cheminActuel.getLongueur())*100) );
            if ((((float) Map.mapActuelle.accompli/Map.mapActuelle.cheminActuel.getLongueur())*100f) > obstacle.distance * 100
                && !obstacle.estResolu()) {
                return obstacle;
                /*
                new AlertDialog.Builder(this.activity)
                        .setTitle("Attention")
                        .setMessage(obstacle.description)
                        .setCancelable(true)
                        .setPositiveButton("J'ai la réponse !", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                obstacle.reponse = "";
                            }
                        }).show();

                 */
            }
        }
        return null;
    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }
}

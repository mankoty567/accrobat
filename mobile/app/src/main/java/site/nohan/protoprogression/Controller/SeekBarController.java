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
import android.widget.TextView;

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
import site.nohan.protoprogression.View.ui.obstacle.ObstacleAlertDialog;

public class SeekBarController implements SeekBar.OnSeekBarChangeListener {
    public static double dernierePositionConnueAPI = 0;

    private final Activity activity;
    private final MapFragment mapFragment;
    private final Toile toile;
    private final TextView tKm;
    private final LinearLayout directionLayout;
    ButtonController buttonController;

    public SeekBarController(MapFragment mapFragment){
        this.mapFragment = mapFragment;
        this.activity = mapFragment.getActivity();
        this.toile = mapFragment.toile;
        this.tKm = this.activity.findViewById(R.id.tKilometres);
        this.directionLayout = this.activity.findViewById(R.id.routeSelect);
    }

    public void setButtonController(ButtonController buttonController) {
        this.buttonController = buttonController;
    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
        // On reserve de la place dans la mémoire pour modifier le bouton que l'on va façonner
        Button button;

        if(Map.mapActuelle.cheminActuel == null)
            return;
        if(ObstacleAlertDialog.isActive)
            return;

        // On affiche la progression a coté de la barre
        tKm.setText(Map.mapActuelle.distanceToM(Map.mapActuelle.getDistanceTotale())+" m ");

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
            new ObstacleAlertDialog(this.activity, obstacle);


        }

        if(progress == 100){
            if(directionLayout.getChildCount() < 1){
                Log.e("chld", ""+directionLayout.getChildCount());

                for(Chemin c : Map.mapActuelle.cheminActuel.objectif.chemins){
                    if(c.objectif == null)
                        break;
                    Log.e("suiv",c.objectif.titre);
                    button = new Button(this.activity);
                    button.setOnClickListener(new DirectionController(c,toile,this.activity));
                    button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.purple_200, null)));
                    button.setText(c.objectif.titre + " par " + c.nom);

                    directionLayout.addView(button);
                }

                if(Map.mapActuelle.cheminActuel.objectif.chemins.get(0).objectif == null){
                    button = new Button(this.activity);
                    button.setOnClickListener(new ArriveeController(this.activity, Map.mapActuelle.cheminActuel.objectif));
                    button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.green, null)));
                    button.setText("Terminer la course");
                    directionLayout.addView(button);
                    Log.e("seekbar", "course terminée");
                }


            }
        }else{
            for(int i=0;i<directionLayout.getChildCount();i++)
            {
                directionLayout.removeAllViews();
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

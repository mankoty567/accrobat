package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Point;
import android.text.InputType;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.SeekBar;

import java.text.DateFormat;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.Model.PointPassage;
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
        // Selection du chemin
        LinearLayout linearLayout = this.activity.findViewById(R.id.routeSelect);
        if(Map.mapActuelle.cheminActuel == null)
            return;

        DataBase.saveProgression();

        Log.e("lele", DataBase.getSubscribed().toString());
        this.detecterObstacle();
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
                    Button button = new Button(this.activity);
                    button.setOnClickListener(new DirectionController(c,toile));
                    button.setText(c.objectif.titre + " - " + c.nom);

                    linearLayout.addView(button);
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

    public void detecterObstacle(){
        for (Obstacle obstacle : Map.mapActuelle.cheminActuel.obstacles) {
            Log.e("obs", "ods"+ (obstacle.distance*100) + " maci"+ ((Map.mapActuelle.accompli/Map.mapActuelle.cheminActuel.getLongueur())*100) );
            if ((((float) Map.mapActuelle.accompli/Map.mapActuelle.cheminActuel.getLongueur())*100f) > obstacle.distance * 100
                && !obstacle.estResolu()) {
                AlertDialog.Builder builder = new AlertDialog.Builder(this.activity);
                builder.setTitle(obstacle.titre);
                builder.setMessage(obstacle.description);

                final EditText input = new EditText(this.activity);

                input.setInputType(InputType.TYPE_CLASS_TEXT);
                builder.setView(input);

                builder.setPositiveButton("Soumettre", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //Log.e("reponse", input.getText().toString());
                        if(input.getText().toString().equals(obstacle.reponse)){
                            obstacle.resolu = true;
                        }else{
                            detecterObstacle();
                        }
                    }
                });

                builder.show();
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

    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }
}

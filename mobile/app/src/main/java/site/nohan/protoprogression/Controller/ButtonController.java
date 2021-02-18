package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.content.Context;
import android.graphics.Point;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;

import java.util.ArrayList;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.Map.MapRequest;
import site.nohan.protoprogression.R;

import static android.content.ContentValues.TAG;
import static android.content.Context.SENSOR_SERVICE;

public class ButtonController implements View.OnClickListener, SensorEventListener, StepListener {

    private final Activity activity;

    private TextView tKilometres;

    private StepDetector simpleStepDetector;
    private SensorManager sensorManager;
    private Sensor accel;
    private boolean isPedometerOn;
    private int numSteps;

    public ButtonController(Activity activity){
        this.activity = activity;
    }

    @Override
    public void onClick(View v) {
        Log.e("controller", Map.chemins.toString());
        if(v.getId() == R.id.bEffacer){
            Map.chemins = new ArrayList<>();
            Chemin c = new Chemin();
            Map.chemins.add(c);
            Map.cheminActuel = c;
            return;
        }


        if(v.getId() == R.id.bPodometre){
            Button bPodometre = activity.findViewById(R.id.bPodometre);
            Button bModePedo = activity.findViewById(R.id.bModePodometre);
            Log.i(TAG, "onCreate: Initializing Sensor Services");
            tKilometres = activity.findViewById(R.id.tKilometres);
            // Get an instance of the SensorManager
            sensorManager = (SensorManager) activity.getSystemService(SENSOR_SERVICE);
            accel = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
            simpleStepDetector = new StepDetector();
            simpleStepDetector.registerListener(this);

            if(!isPedometerOn){
                Log.i(TAG, "onCreate : Registered accelerometer listener");
                numSteps = 0;
                tKilometres.setText(getDistanceRun(numSteps) + " kms");
                sensorManager.registerListener(this, accel, SensorManager.SENSOR_DELAY_FASTEST);

                isPedometerOn = true;
                bPodometre.setText("Désactiver Podomètre");
            }
            else{
                sensorManager.unregisterListener(this);
                tKilometres.setText("--- kms");

                isPedometerOn = false;
                bPodometre.setText("Activer Podomètre");
            }
            return;
        }


        Chemin chemin = new Chemin();

        if(v.getId() == R.id.bAddCurrent){
            Map.cheminActuel.complete = true;

            chemin.origines.add(Map.cheminActuel);
            Map.cheminActuel.suivants.add(chemin);

            if(Map.cheminActuel.origines.size() > 0) {
                for (Chemin sv : Map.cheminActuel.origines.get(0).suivants) {
                    if (sv == Map.cheminActuel)
                        continue;
                    sv.points.add(Map.cheminActuel.lastPoint());
                }
            }
            chemin.points.add(Map.cheminActuel.lastPoint());

        }


        if(v.getId() == R.id.bAddPrev){


            chemin.origines.add(Map.cheminActuel.origines.get(0)); // L'origine sera le premier de la liste
            Map.cheminActuel.origines.get(0).suivants.add(chemin);

            chemin.points.add(Map.cheminActuel.origines.get(0).lastPoint());


        }
        //TODO: Si on ajoute un chemin il faut lier tout les chemins frères au chemin actuel à ce dernier

        Map.chemins.add(chemin);
        Map.cheminActuel = chemin;

    }


    /*****************************************************************
     * Fontions implémentées pour le podomètre
     *****************************************************************/
    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            simpleStepDetector.updateAccel(
                    event.timestamp, event.values[0], event.values[1], event.values[2]);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    public void step(long timeNs) {
        numSteps++;
        float distance = getDistanceRun(numSteps);

        //Mise à jour du nombre de kms
        tKilometres.setText(distance + " kms");
        Log.i(TAG, distance + " kms");

        //Mise à jour de la toile
        float distanceMap = distance * 1000;
        /*Map.accompli = (int) Math.floor(((float) distanceMap*Map.cheminActuel.getLongueur())/100);
        int i=0;
        for(Point p : Map.cheminActuel.points){
            i++;
        }*/

        //Mise à jour de la seekbar
        SeekBar sbProgression = activity.findViewById(R.id.seekBar);
        sbProgression.setProgress((int)distanceMap);
    }

    //Fontion pour déterminer la distance couru en km en utilisant une moyenne de taille de pas
    // pour un sexe et un nombre de steps
    //(78 pour les hommes et 70 pour les femmes)
    public float getDistanceRun(long steps){
        float distance = (float)(steps*74)/(float)100000;
        //On tronque à 3 chiffres après la virgule (en m)
        distance = distance * 1000;
        int tronque = (int)distance;
        distance = (float)tronque / 1000;
        return distance;
    }
}

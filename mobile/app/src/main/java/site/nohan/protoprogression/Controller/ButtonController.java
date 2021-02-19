package site.nohan.protoprogression.Controller;

import android.Manifest;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
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
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

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
    private boolean isGPSOn;
    private int numSteps;
    public static double latitudeGPS;
    public static double longitudeGPS;
    public static double oldLatitudeGPS;
    public static double oldLongitudeGPS;
    private static final int REQUEST_CODE_LOCATION_PERMISSION = 1;

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


        // Get an instance of the SensorManager
        Log.i(TAG, "onCreate: Initializing Sensor Services");
        sensorManager = (SensorManager) activity.getSystemService(SENSOR_SERVICE);
        accel = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        simpleStepDetector = new StepDetector();
        simpleStepDetector.registerListener(this);
        Button bPodometre = activity.findViewById(R.id.bPodometre);
        tKilometres = activity.findViewById(R.id.tKilometres);

        if(v.getId() == R.id.bPodometre){
            if(isGPSOn){
                stopLocationService();
                isGPSOn = false;
            }

            if(!isPedometerOn){
                Log.i(TAG, "onCreate : Registered accelerometer listener");
                numSteps = 0;
                tKilometres.setText(getDistanceRun(numSteps) + " kms");
                sensorManager.registerListener(this, accel, SensorManager.SENSOR_DELAY_FASTEST);

                isPedometerOn = true;
                bPodometre.setText("Stop Podomètre");
            }
            else{
                sensorManager.unregisterListener(this);
                tKilometres.setText("--- kms");

                isPedometerOn = false;
                bPodometre.setText("Start Podomètre");
            }
            return;
        }

        if(v.getId() == R.id.bModePodometre){
            if(isPedometerOn){
                sensorManager.unregisterListener(this);
                //tKilometres.setText("--- kms");
                isPedometerOn = false;
                bPodometre.setText("Start Podomètre");
            }

            if(!isGPSOn){
                if(ContextCompat.checkSelfPermission(activity.getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED){
                    ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_CODE_LOCATION_PERMISSION);
                } else {
                    startLocationService();
                }
                isGPSOn = true;
            }
            else{
                stopLocationService();
                isGPSOn = false;

            }
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

    /************************************************************************
     * Fontions nécessaires pour la localisation (GPS)
     ************************************************************************/
    /*@Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults){
        super.onRequestPermissionsResult(requestCode,permissions,grantResults);
        if(requestCode == REQUEST_CODE_LOCATION_PERMISSION && grantResults.length > 0){
            if(grantResults[0] == PackageManager.PERMISSION_GRANTED){
                startLocationService();
            } else{
                Toast.makeText(activity, "Permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }*/

    private boolean isLocationServiceRunning(){
        ActivityManager activityManager = (ActivityManager) activity.getSystemService(Context.ACTIVITY_SERVICE);
        if(activityManager != null){
            for(ActivityManager.RunningServiceInfo service : activityManager.getRunningServices(Integer.MAX_VALUE)){
                if(LocationService.class.getName().equals(service.service.getClassName())){
                    if(service.foreground){
                        return true;
                    }
                }
            }
            return false;
        }

        return false;
    }

    private void startLocationService(){
        if(!isLocationServiceRunning()){
            Intent intent = new Intent(activity.getApplicationContext(), LocationService.class);
            intent.setAction(Constants.ACTION_START_LOCATION_SERVICE);
            activity.getApplicationContext().startService(intent);
            Toast.makeText(activity.getApplicationContext(), "Location service started", Toast.LENGTH_SHORT).show();
        }
    }

    private void stopLocationService(){
        if(isLocationServiceRunning()){
            Intent intent = new Intent(activity.getApplicationContext(), LocationService.class);
            intent.setAction(Constants.ACTION_STOP_LOCATION_SERVICE);
            activity.getApplicationContext().startService(intent);
            Toast.makeText(activity.getApplicationContext(), "Location service stopped", Toast.LENGTH_SHORT).show();
        }
    }
}

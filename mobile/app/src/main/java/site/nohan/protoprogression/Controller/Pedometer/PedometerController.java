package site.nohan.protoprogression.Controller.Pedometer;

import android.Manifest;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import site.nohan.protoprogression.R;

import static android.content.ContentValues.TAG;
import static android.content.Context.SENSOR_SERVICE;

public class PedometerController implements SensorEventListener, StepListener {

    /*****************************************************************
     * Création des variables globales de la class
     *****************************************************************/
    private Activity activity;

    //Variables d'affichages
    public static TextView tKilometres;
    private Button bPodometre;
    public static SeekBar sbProgression;

    //Variable contenant la distance générale parcourue
    public static int distance = 0;

    private String ACTION_START_LOCATION_SERVICE = "startLocationService";
    private String ACTION_STOP_LOCATION_SERVICE = "stopLocationService";
    private static final int REQUEST_CODE_LOCATION_PERMISSION = 1;
    private StepDetector simpleStepDetector;
    private SensorManager sensorManager;
    private Sensor accel;
    private int numSteps;
    private int oldDistance;
    private boolean isPedometerOn;
    private boolean isGPSOn;
    private int distanceOfPedometer;

    /*****************************************************************
     * Constructeur de la class
     *****************************************************************/
    public PedometerController(Activity activityUsed){
        activity = activityUsed;
        bPodometre = activity.findViewById(R.id.bPodometre);
        tKilometres = activity.findViewById(R.id.tKilometres);
        sbProgression = activity.findViewById(R.id.seekBar);

        //Initialisation des services de mouvements
        Log.i(TAG, "onCreate: Initializing Sensor Services");
        sensorManager = (SensorManager) activity.getSystemService(SENSOR_SERVICE);
        accel = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        simpleStepDetector = new StepDetector();
        simpleStepDetector.registerListener(this);
    }

    /*****************************************************************
     * Méthode de lancement ou d'arrêt du Podomètre
     *****************************************************************/
    public void pedometerAction(){
        //Si le GPS est allumé, on l'arrête
        if(isGPSOn){
            stopLocationService();
            isGPSOn = false;
        }

        //Si le podomètre est éteint, on le lance
        //Sinon, on l'arrête
        if(!isPedometerOn){
            Log.i(TAG, "onCreate : Registered accelerometer listener");
            numSteps = 0;
            distanceOfPedometer = 0;
            oldDistance = distance;
            tKilometres.setText(distance + " ms");
            sensorManager.registerListener(this, accel, SensorManager.SENSOR_DELAY_FASTEST);

            isPedometerOn = true;
            bPodometre.setText("Stop Podomètre");
        }
        else{
            sensorManager.unregisterListener(this);
            tKilometres.setText(distance + " ms");

            isPedometerOn = false;
            bPodometre.setText("Start Podomètre");
        }
    }

    /*****************************************************************
     * Méthode de lancement ou d'arrêt du GPS
     *****************************************************************/
    public void bikeAction(){
        //Si le podomètre est en route, on l'arrête
        if(isPedometerOn){
            sensorManager.unregisterListener(this);
            //tKilometres.setText("--- kms");
            isPedometerOn = false;
            bPodometre.setText("Start Podomètre");
        }

        //Si le GPS est éteint, on le démarre
        //Sinon, on l'arrête
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

    /************************************************************************
     * Méthode implémentant l'interface StepListener pour incrémenter le nombre de pas
     ************************************************************************/
    @Override
    public void step(long timeNs) {
        numSteps++;
        distanceOfPedometer = getDistanceRun(numSteps);

        //Mise à jour du nombre de la distance générale
        distance = distanceOfPedometer + oldDistance;
        tKilometres.setText(distance + " ms");
        Log.i(TAG, distance + " ms");

        //Mise à jour de la seekbar
        float distanceMap = distance * 1;
        sbProgression.setProgress((int)distanceMap);

        //Mise à jour de la toile
        /*Map.accompli = (int) Math.floor(((float) distanceMap*Map.cheminActuel.getLongueur())/100);
        int i=0;
        for(Point p : Map.cheminActuel.points){
            i++;
        }*/
    }

    /************************************************************************
     * Méthode calculant la distance parcouru en fonction du nombre de pas
     ************************************************************************/
    //Fontion pour déterminer la distance couru en km en utilisant une moyenne de taille de pas
    // pour un sexe et un nombre de steps
    //(78 pour les hommes et 70 pour les femmes)
    public int getDistanceRun(long steps){
        float distance = (float)(steps*74)/(float)100000;
        //On tronque à 3 chiffres après la virgule (en m)
        distance = distance * 1000;
        int tronque = (int)distance;
        //distance = (float)tronque / 1000;
        return tronque;
    }

    /************************************************************************
     * Méthode déterminant si la notification permanente est active ou non
     ************************************************************************/
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

    /************************************************************************
     * Méthode permettant de démarrer la notification permanente pour le GPS
     ************************************************************************/
    private void startLocationService(){
        if(!isLocationServiceRunning()){
            Intent intent = new Intent(activity.getApplicationContext(), LocationService.class);
            intent.setAction(ACTION_START_LOCATION_SERVICE);
            activity.getApplicationContext().startService(intent);
            Toast.makeText(activity.getApplicationContext(), "Location service started", Toast.LENGTH_SHORT).show();
        }
    }

    /************************************************************************
     * Méthode d'arrêt de la notification permanente
     ************************************************************************/
    private void stopLocationService(){
        if(isLocationServiceRunning()){
            Intent intent = new Intent(activity.getApplicationContext(), LocationService.class);
            intent.setAction(ACTION_STOP_LOCATION_SERVICE);
            activity.getApplicationContext().startService(intent);
            Toast.makeText(activity.getApplicationContext(), "Location service stopped", Toast.LENGTH_SHORT).show();
        }
    }
}

package site.nohan.protoprogression.Controller.Pedometer;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.Build;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.widget.SeekBar;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;

import java.math.BigDecimal;
import java.math.RoundingMode;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.User;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Fraud.FraudRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.challenge.ChallengeFragment;

import static site.nohan.protoprogression.Controller.Pedometer.PedometerController.distance;
import static site.nohan.protoprogression.Controller.Pedometer.PedometerController.tKilometres;
import static site.nohan.protoprogression.View.ui.home.SigninFragment.hasFrauded;

public class LocationService extends Service {
    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int LOCATION_SERVICE_ID = 175;
    private String ACTION_START_LOCATION_SERVICE = "startLocationService";
    private String ACTION_STOP_LOCATION_SERVICE = "stopLocationService";

    private double oldLatitude = 0;
    private double oldLongitude = 0;
    private double oldAltitude = 0;
    private int kilometres = 0;
    private float metresForSpeed = 0;
    private int oldDistance = distance;
    private long oldDate;

    /************************************************************************
     * Callback de la notification permanente
     ************************************************************************/
    private LocationCallback locationCallback = new LocationCallback() {
        @Override
        public void onLocationResult(LocationResult locationResult) {
            super.onLocationResult(locationResult);
            if (locationResult != null && locationResult.getLastLocation() != null) {
                double lattitude = locationResult.getLastLocation().getLatitude();
                double longitude = locationResult.getLastLocation().getLongitude();
                double altitude = locationResult.getLastLocation().getAltitude();
                long newDate = System.currentTimeMillis();
                //double minSpeed = (newDate.getTime() - oldDate.getTime()) * 4.1;

                Log.d("LOCATION_UPDATE", lattitude + ", " + longitude);
                if (oldLatitude != 0 && oldLongitude != 0) {
                    float[] results = new float[1];
                    float metres = 0;

                    //On calcule la distance entre les 2 coordonnées
                    Location.distanceBetween(
                            oldLatitude,oldLongitude,
                            lattitude, longitude, results);
                    metres = results[0];

                    //Calcul de la vitesse
                    metresForSpeed = metresForSpeed + metres;
                    round(metresForSpeed, 3);
                    float newDistance = metresForSpeed + oldDistance;
                    float dateCalcul = (float) (newDate - oldDate) / 1000;
                    float speedMS = (metres / (dateCalcul));
                    double speed = (double) speedMS * 3.6;
                    Log.e("SPEED", speed+" SPEEDMS :" + speedMS);
                    Log.e("DISTANCE", metres+" DATECALCUL: " + dateCalcul + " NEWDATE:"+newDate+" OLDDATE:"+oldDate);

                    //On règles sur une vitesse moyenne de 15 km/h et on arrondi en mètres
                    if(speed > 15)kilometres = kilometres + (int)metres;
                    round(kilometres,3);

                    //Détection de Fraude en km/h
                    if (speed > 60) {
                        Toast.makeText(getApplicationContext(), "Fraude détectée, course annulée !",Toast.LENGTH_LONG).show();
                        hasFrauded = true;
                        distance = 0;
                        DataBase.pedometerController.bikeStop();
                        new FraudRequest(DataBase.pedometerController.getMapFragment().getActivity());
                        DataBase.pedometerController.getMapFragment().ShowFragment(R.id.navigation_subscribe);
                    }

                    //Mise à jour de la variable globale
                    distance = kilometres + oldDistance;
                    tKilometres.setText(distance + " ms");

                    //Mise à jour de la seekbar
                    int distanceMap = (int) Math.floor(distance*100/ Map.mapActuelle.distanceToM(Map.mapActuelle.cheminActuel.getLongueur()));
                    SeekBar sbProgression = PedometerController.sbProgression;
                    sbProgression.setProgress(distanceMap);



                    //Mise à jour de la toile
                    /*Map.accompli = (int) Math.floor(((float) distanceMap*Map.cheminActuel.getLongueur())/100);
                    int i=0;
                    for(Point p : Map.cheminActuel.points){
                        i++;
                    }*/
                }

                //On met à jour les anciennes coordonnées
                oldLatitude = lattitude;
                oldLongitude = longitude;
                oldAltitude = altitude;
                oldDate = newDate;
                //Toast.makeText(getApplicationContext(), "POSITION : " + lattitude + ", " + longitude, Toast.LENGTH_SHORT).show();
            }
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        throw new UnsupportedOperationException("Not yet implemented");
    }

    /************************************************************************
     * Méthode permettant de démarrer la notification permanente pour le GPS
     ************************************************************************/
    @SuppressLint("MissingPermission")
    private void startLocationService() {
        String channelId = "location_notification_channel";
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        Intent resultIntent = new Intent();
        PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0, resultIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(getApplicationContext(), channelId);
        builder.setSmallIcon(R.mipmap.logo_app_runslike);
        builder.setContentTitle("Location Service");
        builder.setDefaults(NotificationCompat.DEFAULT_ALL);
        builder.setContentText("Cycling...");
        builder.setAutoCancel(false);
        builder.setPriority(NotificationCompat.PRIORITY_MAX);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (notificationManager != null && notificationManager.getNotificationChannel(channelId) == null) {
                NotificationChannel notificationChannel = new NotificationChannel(channelId, "Location Service", NotificationManager.IMPORTANCE_HIGH);
                notificationChannel.setDescription("this channel is used by location service");
                notificationManager.createNotificationChannel(notificationChannel);
            }
        }

        LocationRequest locationRequest = new LocationRequest();
        locationRequest.setInterval(4000);
        locationRequest.setFastestInterval(2000);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

        LocationServices.getFusedLocationProviderClient(this).requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper());
        startForeground(LOCATION_SERVICE_ID, builder.build());
    }


    /************************************************************************
     * Méthode permettant de d'arrêter la notification permanente pour le GPS
     ************************************************************************/
    private void stopLocationService() {
        LocationServices.getFusedLocationProviderClient(this).removeLocationUpdates(locationCallback);
        stopForeground(true);
        stopSelf();
    }


    /************************************************************************
     * Méthode lancée lorsque la notification permanente est démarrée
     ************************************************************************/
    @Override
    public int onStartCommand(Intent intent, int flags, int started) {
        if (intent != null) {
            String action = intent.getAction();
            if (action != null) {
                if (action.equals(ACTION_START_LOCATION_SERVICE)) {
                    oldDate = System.currentTimeMillis();
                    startLocationService();
                } else if (action.equals(ACTION_STOP_LOCATION_SERVICE)) {
                    stopLocationService();
                }
            }
        }
        return super.onStartCommand(intent, flags, started);
    }


    /************************************************************************
     * Méthode permettant d'arrondir la distance calculée
     ************************************************************************/
    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}

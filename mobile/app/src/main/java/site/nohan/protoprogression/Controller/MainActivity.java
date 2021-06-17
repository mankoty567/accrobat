package site.nohan.protoprogression.Controller;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.Timer;

import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.ConnectionManager;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;

public class MainActivity extends AppCompatActivity {

    private static BottomNavigationView navView;
    private Timer checkConnectionTimer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        navView = findViewById(R.id.nav_view);
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.navigation_home, R.id.navigation_challenge, R.id.navigation_user)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
        NavigationUI.setupWithNavController(navView, navController);

        Log.e("mainActivity", "Création du timer");
        checkConnectionTimer = new Timer();
        checkConnectionTimer.scheduleAtFixedRate(new ConnectivityController(this), 5000, 5000);
        Log.e("edf", "resume" );

    }

    public static void setBottomNavigationViewVisibility(int visibility){
        navView.setVisibility(visibility);
    }



    @Override
    protected void onResume() {
        super.onResume();
        // Timer permettant de verifier régulierement si on a récupérer la connexion
        checkConnectionTimer.purge();
        checkConnectionTimer.scheduleAtFixedRate(new ConnectivityController(this), 5000, 5000);

    }


    @Override
    protected void onPause() {
        super.onPause();

        if(Map.mapActuelle != null) {
            new SaveParticipationRequest(this, PedometerController.modeSelected, SeekBarController.progress, Map.participationId,
                    new SaveParticipationResponse(this, PedometerController.modeSelected, SeekBarController.progress, Map.participationId)
            );
        }

    }
}

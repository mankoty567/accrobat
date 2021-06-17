package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.SeekBar;

import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.Toile;

public class DirectionController implements View.OnClickListener {


    private final Chemin direction;
    private Toile toile;
    private Activity activity;
    private boolean reset;


    public DirectionController(Activity activity, Chemin direction, boolean reset){
        this.activity = activity;
        this.direction = direction;
        this.reset = reset;
    }

    public DirectionController(Chemin direction, Toile toile, Activity activity, boolean reset){
        this.direction = direction;
        this.toile = toile;
        this.activity = activity;
        this.reset = reset;
    }

    @Override
    public void onClick(View v) {
        new SaveParticipationRequest(
                this.activity,
                TypeEvent.DEPART,
                this.direction.id,
                Map.participationId,
                new SaveParticipationResponse(
                        this.activity,
                        TypeEvent.DEPART,
                        this.direction.id,
                        Map.participationId
                )
        );

        //Condition vérifiant le mode sélectionné par l'utilisateur
        // et activant ses fonctionnalités
        PedometerController.distance = 0;

        switch (PedometerController.modeSelected) {
            case MARCHE:
                PedometerController.isRunning = false;
                DataBase.pedometerController.pedometerStart();
                break;
            case COURSE:
                PedometerController.isRunning = true;
                DataBase.pedometerController.pedometerStart();
                break;
            case VELO:
                DataBase.pedometerController.bikeStart();
                break;
        }

        Map.mapActuelle.cheminActuel = this.direction;

        if(reset){
            Map.mapActuelle.accompli = 0;
            ((SeekBar) this.activity.findViewById(R.id.seekBar)).setProgress(0);
        }else{
            int progress = Map.mapActuelle.accompli*100/Map.mapActuelle.cheminActuel.getLongueur();
            ((SeekBar) this.activity.findViewById(R.id.seekBar)).setProgress(progress);
        }
        //Map.mapActuelle.accompli = 0;



        SaveParticipationRequest.derniereDistance = 0;

        if(toile != null)
            toile.recentrer();

        LinearLayout linearLayout = this.activity.findViewById(R.id.routeSelect);
        for(int i=0;i<linearLayout.getChildCount();i++)
        {
            linearLayout.removeAllViews();
        }
    }

}

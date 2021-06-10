package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.view.View;
import android.widget.LinearLayout;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.Toile;

public class DirectionController implements View.OnClickListener {


    private final Chemin direction;
    private Toile toile;
    private Activity activity;

    private static SaveParticipationResponse saveParticipationResponse;


    public DirectionController(Activity activity, Chemin direction){
        this.activity = activity;
        this.direction = direction;
        DirectionController.saveParticipationResponse = new SaveParticipationResponse();
    }

    public DirectionController(Chemin direction, Toile toile, Activity activity){
        this.direction = direction;
        this.toile = toile;
        this.activity = activity;
        DirectionController.saveParticipationResponse = new SaveParticipationResponse();
    }

    @Override
    public void onClick(View v) {
        if(Map.mapActuelle.cheminActuel != null) {
            Map.mapActuelle.cheminActuel.complete = true;
            new SaveParticipationRequest(
                    this.activity,
                    TypeEvent.ARIVEE,
                    this.direction.objectif.id,
                    Map.mapActuelle.id,
                    DirectionController.saveParticipationResponse
            );

        }
        new SaveParticipationRequest(
                this.activity,
                TypeEvent.DEPART,
                this.direction.id,
                Map.mapActuelle.id,
                DirectionController.saveParticipationResponse
        );
        Map.mapActuelle.cheminActuel = this.direction;
        Map.mapActuelle.accompli = 0;
        if(toile != null)
            toile.recentrer();

        LinearLayout linearLayout = this.activity.findViewById(R.id.routeSelect);
        for(int i=0;i<linearLayout.getChildCount();i++)
        {
            linearLayout.removeAllViews();
        }
    }

}

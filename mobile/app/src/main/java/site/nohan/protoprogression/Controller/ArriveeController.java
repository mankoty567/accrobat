package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.view.View;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;

public class ArriveeController implements View.OnClickListener{

    private Activity activity;

    public ArriveeController(Activity activity) {
        this.activity = activity;
    }

    @Override
    public void onClick(View v) {
        new SaveParticipationRequest(
                this.activity,
                TypeEvent.ARIVEE,
                Map.mapActuelle.id,
                new SaveParticipationResponse()
        );
        this.activity.setContentView(R.layout.fragment_arrivee);
    }
}

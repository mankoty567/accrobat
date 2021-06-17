package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ArriveeFragment;

public class ArriveeController implements View.OnClickListener{

    private Activity activity;
    private PointPassage direction;
    private Fragment arriveeFragment;

    public ArriveeController(Activity activity, PointPassage direction) {
        this.activity = activity;
        this.direction = direction;
    }

    @Override
    public void onClick(View v) {
        arriveeFragment = new ArriveeFragment();
        new SaveParticipationRequest(
                this.activity,
                TypeEvent.ARIVEE,
                this.direction.id,
                Map.mapActuelle.id,
                new SaveParticipationResponse(
                        this.activity,
                        TypeEvent.ARIVEE,
                        this.direction.id,
                        Map.mapActuelle.id
                )
        );


        Button bFinal = this.activity.findViewById(R.id.bFinal);
        bFinal.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

            }
        });
    }
}

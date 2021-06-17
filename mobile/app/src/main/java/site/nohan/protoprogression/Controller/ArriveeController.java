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
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ArriveeFragment;
import site.nohan.protoprogression.View.MapFragment;

public class ArriveeController implements View.OnClickListener{

    private Activity activity;
    private PointPassage direction;
    private MapFragment mapFragment;

    public ArriveeController(Activity activity, PointPassage direction, MapFragment mapFragment) {
        this.activity = activity;
        this.direction = direction;
        this.mapFragment = mapFragment;
    }

    @Override
    public void onClick(View v) {
        DataBase.terminer(Map.participationId);
        new SaveParticipationRequest(
                this.activity,
                TypeEvent.ARIVEE,
                this.direction.id,
                Map.participationId,
                new SaveParticipationResponse(
                        this.activity,
                        TypeEvent.ARIVEE,
                        this.direction.id,
                        Map.participationId
                )
        );
        mapFragment.ShowFragment(R.id.navigation_challenge_finished);
    }
}

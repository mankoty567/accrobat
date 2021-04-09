package site.nohan.protoprogression.Controller;

import android.view.View;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.PointPassage;

public class DirectionController implements View.OnClickListener {

    private final Chemin direction;

    public DirectionController(Chemin direction){
        this.direction = direction;
    }

    @Override
    public void onClick(View v) {
        if(Map.mapActuelle.cheminActuel != null)
            Map.mapActuelle.cheminActuel.complete = true;
        Map.mapActuelle.cheminActuel = this.direction;
        Map.mapActuelle.accompli = 0;
    }

}

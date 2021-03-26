package site.nohan.protoprogression.Controller;

import android.view.View;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.PointPassage;

public class DirectionController implements View.OnClickListener {


    private final PointPassage direction;

    public DirectionController(PointPassage direction){
        this.direction = direction;
    }

    @Override
    public void onClick(View v) {
        Map.cheminActuel.complete = true;
        Map.cheminActuel = direction.chemins.get(0);
    }



}

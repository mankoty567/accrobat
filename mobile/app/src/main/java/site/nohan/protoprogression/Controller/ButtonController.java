package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.graphics.Point;
import android.graphics.PointF;
import android.util.Log;
import android.view.View;

import java.util.ArrayList;

import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.MapFragment;

public class ButtonController implements View.OnClickListener {

    private final MapFragment mapFragment;

    //Objet permettant l'interaction avec le GPS et l'Accéléromètre
    private PedometerController pedometerController;

    public ButtonController(MapFragment mapFragment){
        this.mapFragment = mapFragment;
    }

    @Override
    public void onClick(View v) {
        //Log.e("controller", Map.chemins.toString());
        // Recentrer la vue
        if(v.getId() == R.id.bRecentrer){
            mapFragment.toile.recentrer();
        }
    }

    public void stopPedometerAndGPS(){
        pedometerController.stopPedometerAndGPS();
    }
}

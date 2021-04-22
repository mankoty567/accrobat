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

        //Initialisation de l'objet permettant l'interaction avec le GPS et l'Accéléromètre
        if(pedometerController == null) pedometerController = new PedometerController(this.mapFragment.getActivity());
        //Bouton qui démarre/arrête le Podomètre
        if(v.getId() == R.id.bPodometre){
            pedometerController.pedometerAction();
            return;
        }

        //Bouton qui démarre/arrête le GPS
        if(v.getId() == R.id.bModePodometre){
            pedometerController.bikeAction();
            return;
        }

        // Recentrer la vue
        if(v.getId() == R.id.bRecentrer){
            PointF delta = new PointF();
            delta.x = -((float) Map.mapActuelle.cheminActuel.points.get(0).x/100f*(mapFragment.toile.getWidth()));
            delta.y = 0 ;// -((float) Map.mapActuelle.cheminActuel.points.get(0).y/100f*mapFragment.toile.getHeight());
            mapFragment.toile.setPosition(delta);
            Log.e("ctrl ", ((float) Map.mapActuelle.cheminActuel.points.get(0).x/100f*mapFragment.toile.getWidth() )+ "" );
            Log.e("ctrl ", mapFragment.toile.getWidth() + " , "  + mapFragment.toile.getHeight() );
            Log.e("ctrl recentrer", "onClick: "+ delta.x + " ," +delta.y);
        }
    }

    public void stopPedometerAndGPS(){
        pedometerController.stopPedometerAndGPS();
    }
}

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
            //delta.x = -((float) Map.mapActuelle.cheminActuel.points.get(0).x/100f*(mapFragment.toile.getWidth())) + (mapFragment.toile.getWidth()/2f);
            //delta.y = -((float) Map.mapActuelle.cheminActuel.points.get(0).y/100f*(mapFragment.toile.getHeight())) + (mapFragment.toile.getHeight()/2f); ;// -((float) Map.mapActuelle.cheminActuel.points.get(0).y/100f*mapFragment.toile.getHeight());

            //delta.x = -((float) Map.mapActuelle.cheminActuel.points.get(0).x/100f*(mapFragment.toile.getWidth()));
            //delta.y = -((float) Map.mapActuelle.cheminActuel.points.get(0).y/100f*(mapFragment.toile.getHeight()));

            Point A = Map.mapActuelle.cheminActuel.getMinPoint();
            Point B = Map.mapActuelle.cheminActuel.getMaxPoint();

            if(A == null || B == null)
                return;
            float zoom = 100f/(float) Chemin.getDistance(A,B);

            A.set(A.x - Math.round((float) A.x*0.01f),A.y - Math.round((float) A.y*0.1f));

            delta.x = -((float) A.x/100f*(mapFragment.toile.getWidth()));
            delta.y = -((float) A.y/100f*(mapFragment.toile.getHeight()));


            mapFragment.toile.setZoom(zoom);




            mapFragment.toile.setPosition(delta);
            Log.e("ctrl ", Chemin.getDistance(A,B)+" distance" );
            Log.e("ctrl ", mapFragment.toile.getWidth() + " , "  + mapFragment.toile.getHeight() );
            Log.e("ctrl recentrer", "onClick: "+ delta.x + " ," +delta.y);
        }
    }

    public void stopPedometerAndGPS(){
        pedometerController.stopPedometerAndGPS();
    }
}

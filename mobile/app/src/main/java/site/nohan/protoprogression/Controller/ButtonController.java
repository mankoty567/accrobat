package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.util.Log;
import android.view.View;

import java.util.ArrayList;

import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.R;

public class ButtonController implements View.OnClickListener {

    private final Activity activity;

    //Objet permettant l'interaction avec le GPS et l'Accéléromètre
    private PedometerController pedometerController;

    public ButtonController(Activity activity){
        this.activity = activity;
    }

    @Override
    public void onClick(View v) {
        //Log.e("controller", Map.chemins.toString());
        if(v.getId() == R.id.bEffacer){
            Map.chemins = new ArrayList<>();
            Chemin c = new Chemin();
            Map.chemins.add(c);
            Map.cheminActuel = c;
            return;
        }

        //Initialisation de l'objet permettant l'interaction avec le GPS et l'Accéléromètre
        if(pedometerController == null) pedometerController = new PedometerController(this.activity);
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

        Chemin chemin = new Chemin();

        if(v.getId() == R.id.bAddCurrent){
            Map.cheminActuel.complete = true;

            chemin.origines.add(Map.cheminActuel);
            Map.cheminActuel.suivants.add(chemin);

            if(Map.cheminActuel.origines.size() > 0) {
                for (Chemin sv : Map.cheminActuel.origines.get(0).suivants) {
                    if (sv == Map.cheminActuel)
                        continue;
                    sv.points.add(Map.cheminActuel.lastPoint());
                }
            }
            chemin.points.add(Map.cheminActuel.lastPoint());

        }


        if(v.getId() == R.id.bAddPrev){


            chemin.origines.add(Map.cheminActuel.origines.get(0)); // L'origine sera le premier de la liste
            Map.cheminActuel.origines.get(0).suivants.add(chemin);

            chemin.points.add(Map.cheminActuel.origines.get(0).lastPoint());


        }
        //TODO: Si on ajoute un chemin il faut lier tout les chemins frères au chemin actuel à ce dernier

        Map.chemins.add(chemin);
        Map.cheminActuel = chemin;

    }

    public void stopPedometerAndGPS(){
        pedometerController.stopPedometerAndGPS();
    }
}

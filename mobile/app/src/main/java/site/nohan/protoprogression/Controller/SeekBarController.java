package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.graphics.Point;
import android.util.Log;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.SeekBar;

import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.R;

public class SeekBarController implements SeekBar.OnSeekBarChangeListener {

    private final Activity activity;
    ButtonController buttonController;

    public SeekBarController(Activity activity){
        this.activity = activity;
    }

    public void setButtonController(ButtonController buttonController) {
        this.buttonController = buttonController;
    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
        // Selection du chemin
        LinearLayout linearLayout = this.activity.findViewById(R.id.routeSelect);
        if(progress == 100){

            //buttonController.stopPedometerAndGPS();

            if(linearLayout.getChildCount() < 1){
                Log.e("chld", ""+linearLayout.getChildCount());
                //Log.e("suiv",Map.cheminActuel.suivants.get(0).title);

                for(Chemin c : Map.cheminActuel.objectif.chemins){
                    if(c.objectif == null)
                        break;
                    Log.e("suiv",c.objectif.titre);
                    Button button = new Button(this.activity);
                    button.setOnClickListener(new DirectionController(c));
                    button.setText(c.objectif.titre + " - " + c.nom);

                    linearLayout.addView(button);
                }


            }
        }else{
            for(int i=0;i<linearLayout.getChildCount();i++)
            {
                linearLayout.removeAllViews();
            }
        }

        Map.accompli = (int) Math.floor(((float) progress*Map.cheminActuel.getLongueur())/100);


    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }
}

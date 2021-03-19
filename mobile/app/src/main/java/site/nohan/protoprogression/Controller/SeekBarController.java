package site.nohan.protoprogression.Controller;

import android.app.Activity;
import android.graphics.Point;
import android.util.Log;
import android.widget.SeekBar;

import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Model.Map;

public class SeekBarController implements SeekBar.OnSeekBarChangeListener {

    ButtonController buttonController;

    public void setButtonController(ButtonController buttonController) {
        this.buttonController = buttonController;
    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {

        if(progress == 100){
            buttonController.stopPedometerAndGPS();
        }

        Map.accompli = (int) Math.floor(((float) progress*Map.cheminActuel.getLongueur())/100);

        Log.e("controller", progress + "% ; "+Map.accompli+" /" +Map.cheminActuel.getLongueur()+ "");
        int i=0;

        for(Point p : Map.cheminActuel.points){
            i++;
            Log.e("p"+i, Map.cheminActuel.getLongueurAt(p)+"");
        }

    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }
}

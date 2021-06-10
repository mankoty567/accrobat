package site.nohan.protoprogression.Controller;

import android.widget.SeekBar;

import site.nohan.protoprogression.View.Toile;

public class ZoomBarController implements SeekBar.OnSeekBarChangeListener {

    Toile toile;

    public ZoomBarController(Toile toile){
        this.toile = toile;
    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
        toile.setZoom(progress);
    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }
}

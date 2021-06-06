package site.nohan.protoprogression.Controller;

import android.graphics.PointF;
import android.view.MotionEvent;
import android.view.View;

import site.nohan.protoprogression.View.Toile;

public class ToileController implements View.OnTouchListener {


    private final Toile toile;

    private PointF downPos;

    public ToileController(Toile toile) {
        this.toile = toile;
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {

        if(event.getAction() == MotionEvent.ACTION_DOWN){
            this.downPos = new PointF(event.getX(), event.getY());
        }
        if(event.getAction() == MotionEvent.ACTION_MOVE){
            this.toile.setDelta(event.getX() - downPos.x, event.getY() - downPos.y);
        }

        if(event.getAction() == MotionEvent.ACTION_UP){
            this.toile.saveDelta();
        }



        return true;
    }

}

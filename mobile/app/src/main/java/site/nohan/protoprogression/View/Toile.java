package site.nohan.protoprogression.View;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.R;

public class Toile extends View {

    Paint stylo;
    Context context;

    Bitmap background;

    public Toile(Context context) {
        super(context);
        this.context = context;
        this.stylo = new Paint();
        this.stylo.setColor(getResources().getColor(R.color.black));
        this.stylo.setAntiAlias(true);
        this.stylo.setStrokeWidth(20);

        Drawable myDrawable = getResources().getDrawable(R.drawable.map);

        background = ((BitmapDrawable) myDrawable).getBitmap();


    }



    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        canvas.drawBitmap(this.background,null, new Rect(0,0,this.getWidth(), this.getHeight()),this.stylo);
        this.dessinerChemins(canvas);
        this.dessinerMapInfos(canvas);

        //Log.e("vue",""+((float) Chemin.points[1].x)/100*canvas.getWidth());
        invalidate();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        float x = event.getX();
        float y = event.getY();
        //Log.e("vue", Chemin.points.toString());
        //Log.e("vue", ""+((SeekBar) this.context.findViewById(R.id.seekBar)).getScrollX());
        Map.cheminActuel.points.add(
                new Point(Math.round(x / this.getWidth() * 100), Math.round(y / this.getHeight() * 100))
        );
        return true;
    }

    private void dessinerMapInfos(Canvas canvas){


        this.stylo.setColor(Color.BLACK);
        this.stylo.setTextSize(100);

        // Titre de la map
        this.stylo.setFakeBoldText(false);
        this.stylo.setColor(Color.BLACK);
        canvas.drawText(Map.libelle == null ? "Indéfinis" : Map.libelle, 100, 100 , this.stylo);

        this.stylo.setFakeBoldText(true);
        this.stylo.setColor(Color.BLACK);
        /*
        if(Map.pointPassages != null && Map.pointPassages.size() > 0){
            for(Chemin c : Map.p){
                // Dessin nom chemin

                if(c.points.size() > 0){
                    canvas.drawText(
                            c.title == null ?
                                    "Indéfinis" : c.title ,
                            ((float) c.points.get(0).x) / 100 * canvas.getWidth(),
                            ((float) c.points.get(0).y) / 100 * canvas.getHeight(),
                            this.stylo
                    );
                }
            }
        }

         */
    }

    private void dessinerChemins(Canvas canvas) throws ArrayIndexOutOfBoundsException{
        if(Map.pointPassages == null || Map.pointPassages.size() == 0)
            return;

        int sOrdinal = 0;

        for(PointPassage pointPassage : Map.pointPassages) {
            for (Chemin c : pointPassage.chemins) {
                // ...

                sOrdinal++;
                this.stylo.setColor(Color.rgb(40 * sOrdinal, 100, 15 * sOrdinal));
                if (c.points.size() == 0)
                    continue;

                for (int i = 0; i < c.points.size() - 1; i++) {
                    if (c.complete) {
                        this.stylo.setStrokeWidth(40);
                    } else {
                        this.stylo.setStrokeWidth(15);
                    }

                    // On dessine la progression uniquement du chemin sur lequel on est
                    if (c == Map.cheminActuel) {

                        if (c.getLongueurAt(c.points.get(i)) < Map.accompli) {
                            this.stylo.setStrokeWidth(40);
                        } else {
                            this.stylo.setStrokeWidth(15);
                        }

                        // Si on est entre deux points
                        if (Map.accompli > c.getLongueurAt(c.points.get(i)) && Map.accompli < c.getLongueurAt(c.points.get(i + 1))) {

                            Point A = c.points.get(i);
                            Point B = c.points.get(i + 1);

                            float rapport = (float) (Map.accompli - c.getLongueurAt(A)) / (c.getLongueurAt(B) - c.getLongueurAt(A));

                            float diffX = B.x - A.x;
                            float diffY = B.y - A.y;
                            int pointsMax = (int) Math.floor(10 * Chemin.getDistance(A, B));
                            int points = Math.round(pointsMax * rapport);

                            float intervalX = diffX / (pointsMax + 1);
                            float intervalY = diffY / (pointsMax + 1);

                            //this.stylo.setColor(Color.rgb(200,0,200));
                            for (int j = 1; j <= points; j++) {
                                canvas.drawCircle(
                                        (A.x + intervalX * j) * canvas.getWidth() / 100,
                                        (A.y + intervalY * j) * canvas.getHeight() / 100,
                                        30,
                                        this.stylo);
                            }
                            this.stylo.setColor(Color.rgb(40 * sOrdinal, 100, 15 * sOrdinal));
                            // continue;
                            this.stylo.setStrokeWidth(15);
                        }
                    }
                    //}
                    canvas.drawCircle(
                            ((float) c.points.get(i).x) / 100 * canvas.getWidth(),
                            ((float) c.points.get(i).y) / 100 * canvas.getHeight(),
                            15,
                            this.stylo
                    );
                    canvas.drawLine(
                            ((float) c.points.get(i).x) / 100 * canvas.getWidth(),
                            ((float) c.points.get(i).y) / 100 * canvas.getHeight(),
                            ((float) c.points.get(i + 1).x) / 100 * canvas.getWidth(),
                            ((float) c.points.get(i + 1).y) / 100 * canvas.getHeight(),
                            this.stylo
                    );


                }
            }
        }
    }
}

package site.nohan.protoprogression.View;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.PointF;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.util.Log;
import android.view.View;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.R;

public class Toile extends View {


    Paint stylo;
    Context context;

    Bitmap background;
    Bitmap flag;
    Bitmap obstacle;

    PointF scale;
    PointF delta;
    PointF position;

    public Toile(Context context) {
        super(context);
        this.context = context;
        this.stylo = new Paint();
        this.stylo.setColor(getResources().getColor(R.color.black));
        this.stylo.setAntiAlias(true);
        this.stylo.setStrokeWidth(20);

        this.scale = new PointF(1,1);
        this.delta = new PointF(0,0);
        this.position = new PointF(0,0);

        //background = ((BitmapDrawable) getResources().getDrawable(R.drawable.map)).getBitmap();
        //Map.mapActuelle.background = ((BitmapDrawable) getResources().getDrawable(R.drawable.map)).getBitmap();
        flag = ((BitmapDrawable) getResources().getDrawable(R.drawable.drapeau)).getBitmap();
        obstacle = ((BitmapDrawable) getResources().getDrawable(R.drawable.obstacle)).getBitmap();

    }

    public void setDelta(float x,float y) {
        this.delta = new PointF(x/scale.x, y/scale.y);
    }

    public void saveDelta() {
        /*
        PointF newPos = new PointF(this.delta.x+this.position.x,this.delta.y+this.position.y);
        if(newPos.x > 0 || newPos.y > 0)
            newPos = new PointF(0f,0f);

        if(newPos.x < getWidth()-(getWidth()*(scale.x)) || newPos.y < getHeight()-(getHeight()*(scale.y)))
            newPos = new PointF(this.position.x,this.position.y);

         */

        PointF checkedMinPos = new PointF(
                Math.min(0,this.delta.x+this.position.x),
                Math.min(0,this.delta.y+this.position.y)
        );

        PointF checkedMinPosMaxPos = new PointF(
                Math.max(getWidth()-(getWidth()*(scale.x)), checkedMinPos.x),
                Math.max(getHeight()-(getHeight()*(scale.y)), checkedMinPos.y)
        );
        Log.e(" s", ""+(this.delta.y+this.position.y));
        Log.e("sortie", getWidth()+"" );
        this.position.set(checkedMinPosMaxPos.x, checkedMinPosMaxPos.y);
        this.delta.set(0,0);
         /*
        Log.e(" s", ""+(this.delta.y+this.position.y));
        Log.e("sortie", getWidth()+"" );
        this.position.set(newPos.x,newPos.y);
        this.delta.set(0,0);
        /*
        this.position.set(this.delta.x+this.position.x, this.delta.y + this.position.y);
        this.delta.set(0,0);

         */
    }

    public void setPosition(PointF position){
        this.position = position;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        this.stylo.setARGB(255,153, 204, 255);
        canvas.drawRect(-1f,-1f,1f+this.getWidth(), 1f+ this.getHeight(),stylo);
        canvas.scale(this.scale.x, this.scale.y);
        canvas.translate(this.position.x + delta.x, this.position.y + delta.y);
        // On ne dessine pas la carte s'il n'y en a pas
        if(Map.mapActuelle == null)
            return;


        if(Map.mapActuelle.background != null) canvas.drawBitmap(Map.mapActuelle.background,null, new Rect(0,0,this.getWidth(), this.getHeight()),this.stylo) ;
        this.dessinerMap(canvas);
        this.dessinerObstacles(canvas);
        this.dessinerMapInfos(canvas);

        //Log.e("vue",""+((float) Chemin.points[1].x)/100*canvas.getWidth());
        invalidate();
    }

    private void dessinerMapInfos(Canvas canvas){


        this.stylo.setColor(Color.BLACK);
        this.stylo.setTextSize(70);

        // Titre de la map
        this.stylo.setFakeBoldText(false);
        this.stylo.setTextSize((1/this.scale.x)*100);
        this.stylo.setColor(Color.WHITE);
        canvas.drawText(Map.mapActuelle.libelle == null ? "Indéfinis" : (Map.mapActuelle.getDistanceTotale()/2f)+" Km au total", 0-(delta.x+position.x), 100-(delta.y+position.y) , this.stylo);
        if(Map.mapActuelle.cheminActuel != null)
            canvas.drawText(Map.mapActuelle.libelle == null ? "Indéfinis" : (Map.mapActuelle.cheminActuel.getLongueur()-Map.mapActuelle.accompli)/2f+" Km restants", 0-(delta.x+position.x), 200-(delta.y+position.y) , this.stylo);


        if(Map.mapActuelle.pointPassages != null && Map.mapActuelle.pointPassages.size() > 0){
            for(PointPassage pointPassage : Map.mapActuelle.pointPassages) {
                if(pointPassage.chemins.size() > 0 && pointPassage.chemins.get(0).points.size() > 0) {


                    this.stylo.setARGB(200, 200, 200, 255);
                    canvas.drawCircle(
                            (((float) pointPassage.chemins.get(0).points.get(0).x) / 100 * canvas.getWidth()),
                            (((float) pointPassage.chemins.get(0).points.get(0).y) / 100 * canvas.getHeight()) ,
                            20,
                            this.stylo
                    );
                    this.stylo.setFakeBoldText(true);
                    this.stylo.setTextSize((1/this.scale.x)*100);
                    this.stylo.setARGB(200,10,10,10);
                    canvas.drawBitmap(
                            this.flag,
                            (((float) pointPassage.chemins.get(0).points.get(0).x) / 100 * canvas.getWidth()),
                            (((float) pointPassage.chemins.get(0).points.get(0).y) / 100 * canvas.getHeight()) - this.flag.getHeight(),
                            this.stylo
                    );

                    this.stylo.setTextSize((1/this.scale.x)*100);
                    this.stylo.setColor(Color.WHITE);
                    canvas.drawText(
                            pointPassage.titre == null ?
                                    "Indéfinis" : pointPassage.titre,
                            ((float) pointPassage.chemins.get(0).points.get(0).x) / 100 * canvas.getWidth() + this.flag.getWidth(),
                            ((float) pointPassage.chemins.get(0).points.get(0).y) / 100 * canvas.getHeight(),
                            this.stylo
                    );
                    this.stylo.setTextSize((1/this.scale.x)*50);
                    // dessin du nom du chemin
                    for(Chemin c : pointPassage.chemins){
                        if(c != null && c.nom !=null) {
                            canvas.drawText(
                                     c.nom,
                                    (((float) c.getMiddlePoint().x) / 100 * canvas.getWidth()) - ((c.nom.length()/ 2f) * this.stylo.getTextSize() ),
                                    ((float) c.getMiddlePoint().y) / 100 * canvas.getHeight(),
                                    this.stylo
                            );
                        }
                    }
                }
            }
        }
        this.stylo.reset();

    }


    private void dessinerMap(Canvas canvas) throws ArrayIndexOutOfBoundsException{
        if(Map.mapActuelle.pointPassages == null || Map.mapActuelle.pointPassages.size() == 0)
            return;

        int sOrdinal = 0;

        for(PointPassage pointPassage : Map.mapActuelle.pointPassages) {
            for (Chemin c : pointPassage.chemins) {
                // ...

                sOrdinal++;
                this.stylo.setColor(Color.rgb(40 * sOrdinal, 100, 15 * sOrdinal));
                if (c.points.size() == 0)
                    continue;

                // Pour tout les points qui composent le chemin
                for (int i = 0; i < c.points.size()-1; i++) {
                    Point A = c.points.get(i);
                    Point B = c.points.get(i+1);

                    if (c.complete || (c.getLongueurAt(c.points.get(i+1)) < Map.mapActuelle.accompli && c == Map.mapActuelle.cheminActuel)) {
                        this.stylo.setStrokeWidth(40);
                    } else {
                        this.stylo.setStrokeWidth(15);
                    }

                    canvas.drawCircle(
                            ((float) A.x) / 100 * canvas.getWidth(),
                            ((float) A.y) / 100 * canvas.getHeight(),
                            15,
                            this.stylo
                    );
                    canvas.drawLine(
                            ((float) A.x) / 100 * canvas.getWidth(),
                            ((float) A.y) / 100 * canvas.getHeight(),
                            ((float) B.x) / 100 * canvas.getWidth(),
                            ((float) B.y) / 100 * canvas.getHeight(),
                            this.stylo
                    );

                    // Dessiner les obstacles



                    // On dessine la progression uniquement du chemin sur lequel on est
                    if (c == Map.mapActuelle.cheminActuel) {

                        this.stylo.setStrokeWidth(15);
                        // Si on est entre deux points
                        if (Map.mapActuelle.accompli <= c.getLongueurAt(B)) {


                            float rapport = (float) (Map.mapActuelle.accompli - c.getLongueurAt(A)) / (c.getLongueurAt(B) - c.getLongueurAt(A));

                            float diffX = B.x - A.x;
                            float diffY = B.y - A.y;
                            int pointsMax = (int) Math.floor(10 * Chemin.getDistance(A, B));
                            int points = Math.round(pointsMax * rapport);

                            float intervalX = diffX / (pointsMax + 1);
                            float intervalY = diffY / (pointsMax + 1);

                            //this.stylo.setColor(Color.rgb(200,0,200));

                            int taille;
                            for (int j = 1; j <= points; j++) {
                                if(j==points) {
                                    taille = (int) Math.round((int) System.currentTimeMillis()%1000 * (1 / 30f));
                                    this.stylo.setARGB(
                                            255,
                                            200,0,255-(taille*2)
                                    );
                                    canvas.drawCircle(
                                            (A.x + intervalX * j) * canvas.getWidth() / 100,
                                            (A.y + intervalY * j) * canvas.getHeight() / 100,
                                            (30-taille)/2f,
                                            this.stylo);

                                    this.stylo.setARGB(
                                            255,
                                            150-(taille*3),100 , 200+(taille*2)
                                    );
                                    canvas.drawCircle(
                                            (A.x + intervalX * j) * canvas.getWidth() / 100,
                                            (A.y + intervalY * j) * canvas.getHeight() / 100,
                                            Math.max(10-(taille/1.5f), 30)/2f,
                                            this.stylo);
                                } else {

                                    this.stylo.setColor(Color.rgb(40 * sOrdinal, 100, 15 * sOrdinal));
                                    canvas.drawCircle(
                                            (A.x + intervalX * j) * canvas.getWidth() / 100,
                                            (A.y + intervalY * j) * canvas.getHeight() / 100,
                                            15,
                                            this.stylo);
                                }
                            }
                            this.stylo.setColor(Color.rgb(40 * sOrdinal, 100, 15 * sOrdinal));
                            // continue;
                            this.stylo.setStrokeWidth(15);
                        }
                    }
                }
            }
        }
    }

    public void dessinerObstacles(Canvas canvas){
        if(Map.mapActuelle.pointPassages == null || Map.mapActuelle.pointPassages.size() == 0)
            return;
        for(PointPassage pointPassage : Map.mapActuelle.pointPassages) {
            for (Chemin c : pointPassage.chemins) {
                for (int i = 0; i < c.points.size()-1; i++) {
                    Point A = c.points.get(i);
                    Point B = c.points.get(i + 1);

                    for(Obstacle obstacle : c.obstacles){

                        if(obstacle.distance*c.getLongueur() > c.getLongueurAt(A) && obstacle.distance*c.getLongueur() <= c.getLongueurAt(B)){
                            float rapport = (float) (Map.mapActuelle.accompli - c.getLongueurAt(A)) / (c.getLongueurAt(B) - c.getLongueurAt(A));

                            float diffX = B.x - A.x;
                            float diffY = B.y - A.y;
                            int pointsMax = (int) Math.round(10 * Chemin.getDistance(A, B));
                            int points = Math.round(pointsMax * rapport);

                            float intervalX = diffX / (pointsMax + 1);
                            float intervalY = diffY / (pointsMax + 1);

                            //obstacle.distance*c.getLongueur()-c.getLongueurAt(A)/c.getLongueurAt(B)-c.getLongueurAt(A);
                            double distance = obstacle.distance*c.getLongueur() - c.getLongueurAt(A);
                            double deltaAB = c.getLongueurAt(B) - c.getLongueurAt(A);
                            int point = (int) Math.round((pointsMax*distance)/deltaAB);
                            //Log.e("point", ""+point );
                            this.stylo.setARGB(
                                    255, 10,10,10
                            );

                            canvas.drawCircle(
                                    (A.x + intervalX * point) * canvas.getWidth() / 100,
                                    (A.y + intervalY * point) * canvas.getHeight() / 100,
                                    25,
                                    this.stylo);
                            canvas.drawBitmap(
                                    this.obstacle,
                                    (A.x + intervalX * point) * (canvas.getWidth()-(this.obstacle.getWidth()+10) ) / 100f,
                                    (A.y + intervalY * point) * (canvas.getHeight()-(this.obstacle.getHeight()-10) )/ 100f,
                                    this.stylo
                            );
                        }
                    }
                }

            }
        }
    }

    public void setZoom(int zoom) {
        this.scale.x = (1 + ((float) zoom/100*2));
        this.scale.y = (1 + ((float) zoom/100*2));
    }

    public void setZoom(float zoom){
        this.scale.x = zoom;
        this.scale.y = zoom;
    }


    public void recentrer(){

        Point A = Map.mapActuelle.cheminActuel.getMinPoint();
        Point B = Map.mapActuelle.cheminActuel.getMaxPoint();



        int recul = 8;

        int deltaABx = Math.abs(B.x-A.x);
        int deltaABy = Math.abs(B.y-A.y);


        A.x = A.x - (deltaABx/recul);
        A.y = A.y - (deltaABy/recul);

        B.x = B.x + (deltaABx/recul);
        B.y = B.y + (deltaABy/recul);

        deltaABx = Math.abs(B.x-A.x);
        deltaABy = Math.abs(B.y-A.y);

        float zoom = 100f/Math.max(deltaABx, deltaABy);
        this.setZoom( zoom );

        this.setPosition(new PointF(
                -(float) A.x / 100f * this.getWidth(),
                -(float) A.y / 100f * this.getHeight()
        ));

    }


/*
    public void recentrer(){
        PointF delta = new PointF();

        Point A = Map.mapActuelle.cheminActuel.getMinPoint();
        Point B = Map.mapActuelle.cheminActuel.getMaxPoint();

        if(A == null || B == null)
            return;
        //float zoom = 100f/(float) Chemin.getDistance(A,B);
        // TODO: attention sortie ecran avec distance 100%
        float zoom = 80f/Math.max(Math.abs(B.x-A.x), Math.abs(B.y - A.y));

        A.set(A.x - Math.round((float) A.x*0.1f),A.y - Math.round((float) A.y*0.1f));

        delta.x = -((float) A.x/100f*(this.getWidth()));
        delta.y = -((float) A.y/100f*(this.getHeight()));


        this.setZoom(zoom*0.9f);

        this.setPosition(delta);
    }
*/
}

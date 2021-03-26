package site.nohan.protoprogression.Model;

import android.graphics.Point;
import android.util.Log;

import java.util.ArrayList;

public class Chemin {
    public int objectifId;

    public boolean complete;
    public ArrayList<Point> points;

    public PointPassage objectif;
    public PointPassage origine;

    public Chemin(ArrayList<Point> points){
        this.points = points;
        this.complete = false;

    }

    public Chemin(){
        this(new ArrayList<>());
    }

    public void clear() {
        points = new ArrayList<>();
    }

    public Point lastPoint(){
        return points.get(points.size()-1);
    }


    // Renvoi la longueur jusqu'au dernier segment
    public int getLongueur(){
        double longueur = 0;
        for(int i=0; i<this.points.size()-2;i++){
            longueur = longueur + Chemin.getDistance(points.get(i), points.get(i+1));
        }
        return (int) Math.floor(longueur);
    }

    // Renvoi la longueur jusqu'au point p
    public int getLongueurAt(Point objectif){
        double distance = 0;
        for(int i=0; i<points.size()-1; i++){
            distance += Chemin.getDistance(points.get(i),points.get(i+1));
            if(points.get(i+1) == objectif)
                return (int) Math.floor(distance);
        }
        if(objectif == points.get(0))
            return 0;

        throw new RuntimeException("Point introuvable");
    }


    public static double getDistance(Point A, Point B){
        return Math.sqrt(Math.pow(B.x-A.x,2) + Math.pow(B.y-A.y,2));
    }

    @Override
    public String toString() {
        return "Chemin{" +
                "\n   points : " + points +
                "\n}";
    }
}

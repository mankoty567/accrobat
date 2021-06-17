package site.nohan.protoprogression.Model;

import android.graphics.Point;
import android.util.Log;

import java.util.ArrayList;

public class Chemin {
    public static final int NO_OJECTIF = -1;

    public int objectifId;

    public boolean complete;
    public ArrayList<Point> points;
    public ArrayList<Obstacle> obstacles;

    public PointPassage objectif;
    public PointPassage origine;

    public int id;
    public String nom;

    public Chemin(ArrayList<Point> points){
        this.obstacles = new ArrayList<>();
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

    public static Chemin findById(Map map, int id){
        for(PointPassage pointPassage : map.pointPassages){
            for(Chemin c : pointPassage.chemins){
                if(c.id == id)
                    return c;
            }
        }
        return null;
    }

    // Renvoi la longueur jusqu'au dernier segment
    public int getLongueur(){
        double longueur = 0;
        for(int i=0; i<this.points.size()-1;i++){
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
        return Math.sqrt(Math.pow((double)B.x-A.x,2) + Math.pow((double)B.y-A.y,2));
    }

    @Override
    public String toString() {
        return "Chemin{" +
                "\n   points : " + points +
                "\n}";
    }

    public Point getMinPoint(){
        Point min = new Point(this.points.get(0));
        for(int i=1; i<this.points.size();i++){
            min.set(
                    Math.min(min.x,this.points.get(i).x),
                    Math.min(min.y,this.points.get(i).y)
            );
        }
       return min;
    }

    public Point getMaxPoint(){
        Point max = new Point(this.points.get(0));
        for(int i=1; i<this.points.size();i++){
            max.set(
                    Math.max(max.x,this.points.get(i).x),
                    Math.max(max.y,this.points.get(i).y)
            );
        }
        return max;
    }



    public Point getMiddlePoint(){
        return this.points.get((int) Math.round((float)this.points.size()/2));
    }


}

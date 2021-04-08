package site.nohan.protoprogression.Model;

import android.graphics.Bitmap;
import android.graphics.Point;
import android.util.Log;

import java.util.ArrayList;

public class Map {
    public static String libelle;
    public static String desc;

    public static int accompli;

    public static PointPassage dernierPointPassage;
    public static Chemin cheminActuel;

    public static ArrayList<PointPassage> pointPassages;

    public static Bitmap background;



    public static int getDistanceTotale(){
        double distance = 0d;
        for(PointPassage pointPassage : Map.pointPassages){
            for(Chemin chemin : pointPassage.chemins){
                if(chemin.complete)
                    distance += chemin.getLongueur(); //TODO: lors de l'implementation de la distance d'un chemin l'ajouter chemin.getKm()
            }
        }
        distance += (double) Map.accompli;
        return (int) Math.round(distance);
    }


    static{
        accompli = 0;
        /*
        Chemin chemin = new Chemin();
        chemin.points = new ArrayList<>();
        chemin.points.add(new Point(20,20));
        chemin.points.add(new Point(50,50));
        chemin.points.add(new Point(60,60));
        chemin.points.add(new Point(80,90));

        Map.chemins = new ArrayList<>();
        cheminActuel = chemin;
        Map.chemins.add(chemin);
        Log.e("static", chemin.getLongueurAt(chemin.points.get(1))+"");

         */
    }

    public static PointPassage getDepart() {
        for(PointPassage p : Map.pointPassages){
            if(p.type == TypePointPassage.DEPART){
                return p;
            }
        }
        throw new RuntimeException("Aucun départ dans la map");
    }

    public static PointPassage getArrivee() {
        for(PointPassage p : Map.pointPassages){
            if(p.type == TypePointPassage.ARRIVEE){
                return p;
            }
        }
        throw new RuntimeException("Aucune arrivée dans la map");
    }

}

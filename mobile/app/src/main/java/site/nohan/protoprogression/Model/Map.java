package site.nohan.protoprogression.Model;

import android.graphics.Point;
import android.util.Log;

import java.util.ArrayList;

public class Map {
    public static String libelle;
    public static String desc;

    public static int accompli;

    public static Chemin cheminActuel;

    public static ArrayList<Chemin> chemins;


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


}

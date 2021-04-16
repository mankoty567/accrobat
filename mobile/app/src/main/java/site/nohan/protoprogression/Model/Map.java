package site.nohan.protoprogression.Model;

import android.graphics.Bitmap;
import android.graphics.Point;
import android.util.Log;

import java.util.ArrayList;
import java.util.Date;

public class Map {
    public static Map mapActuelle;

    public static ArrayList<Map> maps;

    public int id;

    public String libelle;
    public Date date;

    public int accompli;

    public PointPassage dernierPointPassage;
    public Chemin cheminActuel;

    public ArrayList<PointPassage> pointPassages;

    public Bitmap background;



    public int getDistanceTotale(){
        double distance = 0d;
        for(PointPassage pointPassage : this.pointPassages){
            for(Chemin chemin : pointPassage.chemins){
                if(chemin.complete)
                    distance += chemin.getLongueur(); //TODO: lors de l'implementation de la distance d'un chemin l'ajouter chemin.getKm()
            }
        }
        distance += (double) this.accompli;
        return (int) Math.round(distance);
    }

    public PointPassage getDepart() {
        for(PointPassage p : this.pointPassages){
            if(p.type == TypePointPassage.DEPART){
                return p;
            }
        }
        throw new RuntimeException("Aucun départ dans la map");
    }

    public PointPassage getArrivee() {
        for(PointPassage p : this.pointPassages){
            if(p.type == TypePointPassage.ARRIVEE){
                return p;
            }
        }
        throw new RuntimeException("Aucune arrivée dans la map");
    }

}

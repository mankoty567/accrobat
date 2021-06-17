package site.nohan.protoprogression.Model;

import android.graphics.Bitmap;
import android.util.Log;

import java.util.ArrayList;
import java.util.Date;

import site.nohan.protoprogression.Model.Types.TypePointPassage;

public class Map {


    public static int participationId;
    public static Map mapActuelle;

    public static ArrayList<Map> maps = new ArrayList<>();

    public static ArrayList<Map> sauvegardes = new ArrayList<>();

    public int id;

    public String libelle;
    public Date date;
    public String description;

    public int participation;

    public int accompli;

    public PointPassage dernierPointPassage;
    public Chemin cheminActuel;

    public ArrayList<PointPassage> pointPassages;

    public Bitmap background;

    public String dateInscription;
    public String dateDernierePartie;

    public double echelle;



    public int getDistanceTotale(){
        double distance = 0d;
        for(PointPassage pointPassage : this.pointPassages){
            for(Chemin chemin : pointPassage.chemins){
                if(chemin.complete)
                    distance += chemin.getLongueur();
            }
        }
        distance += (double) this.accompli;
        return (int) Math.round(distance);
    }

    public double distanceToM(double distance){
        return (distance/100)*this.echelle;
    }

    public double MToDistance(double M){
        return M/this.echelle;
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


    public static Map findById(int mapId) {
        for(Map map : maps){
            if(map.id == mapId)
                return map;
        }
        return null;
    }

    public static Map findSauvegardeById(int mapId){
        for(Map map : sauvegardes){
            if(map.id == mapId)
                return map;
        }
        return null;
    }


    @Override
    public String toString() {
        return "Map{" +
                "id=" + id +
                ", libelle='" + libelle + '\'' +
                ", date=" + date +
                ", description='" + description + '\'' +
                ", accompli=" + accompli +
                ", dernierPointPassage=" + dernierPointPassage +
                ", cheminActuel=" + cheminActuel +
                ", pointPassages=" + pointPassages +
                ", background=" + background +
                ", dateInscription='" + dateInscription + '\'' +
                ", dateDernierePartie='" + dateDernierePartie + '\'' +
                '}';
    }
}

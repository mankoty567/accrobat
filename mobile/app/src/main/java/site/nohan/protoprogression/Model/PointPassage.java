package site.nohan.protoprogression.Model;

import java.util.ArrayList;

import site.nohan.protoprogression.Model.Types.TypePointPassage;

public class PointPassage {

    public int id;
    public String titre;
    public String desc;
    public TypePointPassage type;

    public ArrayList<Chemin> chemins;

    public static PointPassage getById(int id){
        for(PointPassage pointPassage : Map.mapActuelle.pointPassages){
            if(pointPassage.id == id){
                return pointPassage;
            }
        }
        throw new RuntimeException("Point passage id:"+id +" not found");
    }

    public static boolean exists(int id){
        for(PointPassage pointPassage : Map.mapActuelle.pointPassages){
            if(pointPassage.id == id){
                return true;
            }
        }
        return false;
    }



    @Override
    public String toString() {
        return "PointPassage{" +
                "id=" + id +
                ", titre='" + titre + '\'' +
                ", desc='" + desc + '\'' +
                ", chemins=" + chemins +
                '}';
    }
}

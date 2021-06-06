package site.nohan.protoprogression.Model;

import site.nohan.protoprogression.Model.Types.TypeObstacle;

public class Obstacle {
    public int id;
    public String titre;
    public String description;
    public String reponse = "oui";
    public TypeObstacle type;
    public int position;

    public boolean resolu = false;

    public double distance;

    public boolean estResolu(){
        return resolu;
    }

}

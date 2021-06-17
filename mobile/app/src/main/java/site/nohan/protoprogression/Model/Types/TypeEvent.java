package site.nohan.protoprogression.Model.Types;

public enum TypeEvent {
    MARCHE("marche", "Marche"),
    COURSE("course", "Course"),
    VELO("velo", "Vélo"),
    ARIVEE("pointpassage:arrivee", "Départ"),
    DEPART("pointpassage:depart", "Arrivée"),
    OSTACLE("obstacle:arrivee", "Obstacle");

    String typestr;
    String nom;

    TypeEvent(String typestr, String nom) {
        this.typestr = typestr;
        this.nom = nom;
    }

    public String getNom() {
        return nom;
    }

    public static TypeEvent get(String type) {
        for(TypeEvent typeEvent : TypeEvent.values()){
            if(typeEvent.toString().equals(type))
                return typeEvent;
        }
        throw new RuntimeException("Unknown type :" +type);
    }

    @Override
    public String toString() {
        return this.typestr;
    }
}

package site.nohan.protoprogression.Model.Types;

public enum TypeEvent {
    MARCHE("marche"),
    COURSE("course"),
    VELO("velo"),
    ARIVEE("pointpassage:arrivee"),
    DEPART("pointpassage:depart"),
    OSTACLE("obstacle:arrivee");

    String typestr;

    TypeEvent(String typestr) {
        this.typestr = typestr;
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

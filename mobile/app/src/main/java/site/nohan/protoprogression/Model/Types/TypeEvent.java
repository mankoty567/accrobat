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

    @Override
    public String toString() {
        return this.typestr;
    }
}

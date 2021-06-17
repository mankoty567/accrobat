package site.nohan.protoprogression.Model.Types;

public enum TypeProgression {
    POINT_PASSAGE("PointPassage"),
    SEGMENT("Segment"),
    OBSTACLE("obstacle"),
    ;
    String typestr;

    TypeProgression(String typestr) {
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

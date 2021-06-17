package site.nohan.protoprogression.Model;

public class Progression {
    private Map map;
    private int pariticpationId;
    private int progression;
    private int cheminId;
    private boolean esttermine;

    public Progression(Map map, int pariticpationId, int progression, int cheminId, int esttermine) {
        this.map = map;
        this.pariticpationId = pariticpationId;
        this.progression = progression;
        this.cheminId = cheminId;
        this.esttermine = esttermine != 0;
    }

    public boolean estTermine() {
        return esttermine;
    }

    public Map getMap() {
        return map;
    }

    public int getPariticpationId() {
        return pariticpationId;
    }

    public int getProgression() {
        return progression;
    }

    public int getCheminId() {
        return cheminId;
    }

    @Override
    public String toString() {
        return "Progression{" +
                "map=" + map +
                ", pariticpationId=" + pariticpationId +
                ", progression=" + progression +
                ", cheminId=" + cheminId +
                '}';
    }
}

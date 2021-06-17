package site.nohan.protoprogression.Model;

import site.nohan.protoprogression.Model.Types.TypeEvent;

public class Event {
    private int participationId;
    private TypeEvent typeEvent;
    private int data;
    private String date;

    public Event(int participationId, TypeEvent typeEvent, int data, String date) {
        this.participationId = participationId;
        this.typeEvent = typeEvent;
        this.data = data;
        this.date = date;
    }

    public String getDate() {
        return date;
    }

    public int getParticipationId() {
        return participationId;
    }

    public void setParticipationId(int participationId) {
        this.participationId = participationId;
    }

    public TypeEvent getTypeEvent() {
        return typeEvent;
    }

    public void setTypeEvent(TypeEvent typeEvent) {
        this.typeEvent = typeEvent;
    }

    public int getData() {
        return data;
    }

    public void setData(int data) {
        this.data = data;
    }
}

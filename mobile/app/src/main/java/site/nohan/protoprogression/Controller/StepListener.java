package site.nohan.protoprogression.Controller;

// Will listen to step alerts
public interface StepListener {

    public void step(long timeNs);

}

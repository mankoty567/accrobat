package site.nohan.protoprogression.Controller.Pedometer;

// Will listen to step alerts
public interface StepListener {

    public void step(long timeNs);

}

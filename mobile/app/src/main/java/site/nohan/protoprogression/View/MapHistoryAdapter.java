package site.nohan.protoprogression.View;

import android.app.Activity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Event;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

import static site.nohan.protoprogression.Network.DataBase.getEventsOf;
import static site.nohan.protoprogression.Network.DataBase.getRecordDuration;
import static site.nohan.protoprogression.Network.DataBase.getRecordSize;
import static site.nohan.protoprogression.Network.DataBase.getRecordUsername;

public class MapHistoryAdapter extends ArrayAdapter<String> {

    private final Activity context;

    public MapHistoryAdapter(Activity context) {
        super(context, R.layout.history_list_events, new String[]{"Chargement"} );
        // TODO Auto-generated constructor stub

        //Mise en place des données de la DB
        this.context=context;

    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater=context.getLayoutInflater();
        ArrayList<Event> events = getEventsOf(Map.participationId);
        View rowView=inflater.inflate(R.layout.history_list_events, null,true);

        TextView list_title = (TextView) rowView.findViewById(R.id.txt_list_history);
        Log.e("LIST",getEventsOf(Map.participationId).get(position).getTypeEvent().toString());
        String chaine =  " " + events.get(position).getTypeEvent().getNom() + " - "
                + events.get(position).getDate();

        TypeEvent typeEvent = events.get(position).getTypeEvent();
        if (typeEvent == TypeEvent.ARIVEE){
            chaine = PointPassage.getById(events.get(position).getData()).titre + chaine;
        }
        if (typeEvent == TypeEvent.DEPART){
            chaine = Chemin.findById(Map.mapActuelle, events.get(position).getData()).nom + chaine;
        }

        list_title.setText(
                chaine
        );

        return rowView;
    };

    @Override
    public int getCount() {
        return getEventsOf(Map.participationId).size() != -1 ? getEventsOf(Map.participationId).size() : 0;
    }
}

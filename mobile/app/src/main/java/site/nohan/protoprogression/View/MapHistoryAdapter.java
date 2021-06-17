package site.nohan.protoprogression.View;

import android.app.Activity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.concurrent.TimeUnit;

import site.nohan.protoprogression.Model.Map;
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
        View rowView=inflater.inflate(R.layout.history_list_events, null,true);

        TextView list_title = (TextView) rowView.findViewById(R.id.txt_list_history);
        Log.e("LIST",getEventsOf(Map.participationId).get(position).getTypeEvent().toString());
        list_title.setText(getEventsOf(Map.participationId).get(position).getTypeEvent().toString());

        return rowView;
    };

    @Override
    public int getCount() {
        return getEventsOf(Map.participationId).size() != -1 ? getEventsOf(Map.participationId).size() : 0;
    }
}

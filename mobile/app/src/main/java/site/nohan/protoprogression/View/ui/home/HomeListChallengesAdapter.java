package site.nohan.protoprogression.View.ui.home;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

public class HomeListChallengesAdapter extends ArrayAdapter<String> {

    private final Activity context;

    public HomeListChallengesAdapter(Activity context) {
        super(context, R.layout.home_list_challenges, new String[]{"Chargement"} );
        // TODO Auto-generated constructor stub

        //Mise en place des données de la DB
        this.context=context;

    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater=context.getLayoutInflater();
        View rowView=inflater.inflate(R.layout.home_list_challenges, null,true);

        TextView list_title = (TextView) rowView.findViewById(R.id.txt_list_title);
        TextView list_description = (TextView) rowView.findViewById(R.id.txt_list_description);
        /*TextView list_kilometres = (TextView) rowView.findViewById(R.id.txt_list_kilometres);
        TextView list_date = (TextView) rowView.findViewById(R.id.txt_list_date);
        TextView list_segments = (TextView) rowView.findViewById(R.id.txt_list_segments);
        */
        list_title.setText(Map.maps.get(position).libelle);
        list_description.setText(Map.maps.get(position).desc);
        /*list_kilometres.setText(txt_list_kilometres[position]);
        list_date.setText(txt_list_date[position]);
        list_segments.setText(txt_list_segments[position]);
         */
        return rowView;
    };

    @Override
    public int getCount() {
        return Map.maps != null ? Map.maps.size() : 0;
    }
}

package site.nohan.protoprogression.View.ui.home;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

public class HomeListChallengesAdapter extends ArrayAdapter<String> {

    private final Activity context;
    private final String[] txt_list_title;
    private final String[] txt_list_description;

    private final String[] txt_list_kilometres;
    private final String[] txt_list_date;
    private final String[] txt_list_segments;

    public HomeListChallengesAdapter(Activity context) {
        super(context, R.layout.home_list_challenges, DataBase.txt_list_title);
        // TODO Auto-generated constructor stub

        //Mise en place des données de la DB
        this.context=context;
        this.txt_list_title=DataBase.txt_list_title;
        this.txt_list_description=DataBase.txt_list_description;

        this.txt_list_kilometres=DataBase.txt_list_kilometres;
        this.txt_list_date=DataBase.txt_list_date;
        this.txt_list_segments=DataBase.txt_list_segments;

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
        list_title.setText(txt_list_title[position]);
        list_description.setText(txt_list_description[position]);
        /*list_kilometres.setText(txt_list_kilometres[position]);
        list_date.setText(txt_list_date[position]);
        list_segments.setText(txt_list_segments[position]);
         */
        return rowView;

    };

}

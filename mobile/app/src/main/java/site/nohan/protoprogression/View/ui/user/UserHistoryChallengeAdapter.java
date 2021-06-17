package site.nohan.protoprogression.View.ui.user;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import site.nohan.protoprogression.Model.Avatar;
import site.nohan.protoprogression.Model.Progression;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

import static site.nohan.protoprogression.Network.DataBase.getProgressions;
import static site.nohan.protoprogression.Network.DataBase.getRecordDuration;
import static site.nohan.protoprogression.Network.DataBase.getRecordSize;
import static site.nohan.protoprogression.Network.DataBase.getRecordUsername;

public class UserHistoryChallengeAdapter extends ArrayAdapter<String> {

    private Activity context;
    private ArrayList<Progression> progressions;

    public UserHistoryChallengeAdapter(Activity context) {
        super(context, R.layout.user_history_challenges_list, new String[]{"Chargement"} );
        // TODO Auto-generated constructor stub

        //Mise en place des données de la DB
        this.context=context;
        progressions = getProgressions(true);
    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater=context.getLayoutInflater();
        View rowView=inflater.inflate(R.layout.user_history_challenges_list, null,true);

        TextView list_title = (TextView) rowView.findViewById(R.id.txt_history_name_challenge);
        TextView list_date = (TextView) rowView.findViewById(R.id.txt_history_date_challenge);
        ImageView avatar = rowView.findViewById(R.id.list_history_challenge);

        if(Avatar.getAvatar(getProgressions(true).get(position).getMap().id) != null){
            if(Avatar.getAvatar(progressions.get(position).getMap().id).image != null)
                avatar.setImageBitmap(Avatar.getAvatar(progressions.get(position).getMap().id).image);
        }

        list_title.setText(progressions.get(position).getMap().libelle+"");
        list_date.setText("Terminé le : "+progressions.get(position).getMap().dateDernierePartie);

        return rowView;
    };

    @Override
    public int getCount() {
        return getProgressions(true).size() != -1 ? getProgressions(true).size() : 0;
    }
}

package site.nohan.protoprogression.View.ui.home;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.Image;
import android.os.AsyncTask;
import android.provider.ContactsContract;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import site.nohan.protoprogression.Model.Avatar;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Progression;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Map.AvatarMapRequest;
import site.nohan.protoprogression.R;

public class HomeListChallengesAdapter extends ArrayAdapter<String> {
    public static HomeListChallengesAdapter lastInstance;

    public ArrayList<Bitmap> bitmaps;
    private final Activity context;

    public HomeListChallengesAdapter(Activity context) {
        super(context, R.layout.home_list_challenges, new String[]{"Chargement"} );
        lastInstance = this;
        bitmaps = new ArrayList<>();

        //Mise en place des données de la DB
        this.context=context;

    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater=context.getLayoutInflater();
        View rowView=inflater.inflate(R.layout.home_list_challenges, null,true);

        TextView list_title = (TextView) rowView.findViewById(R.id.txt_list_title);
        TextView list_lastTimeUpdated = (TextView) rowView.findViewById(R.id.txt_list_lastTimeUpdated);
        TextView list_date = (TextView) rowView.findViewById(R.id.txt_list_date);
        ImageView avatar = (ImageView) rowView.findViewById(R.id.list_item_icon);
        ArrayList<Progression> progressions = DataBase.getProgressions(false);

        if(HomeFragment.isOnPrivateChallenges) {

            if(Avatar.getAvatar(progressions.get(position).getMap().id) != null){
                if(Avatar.getAvatar(progressions.get(position).getMap().id).image != null)
                    avatar.setImageBitmap(Avatar.getAvatar(progressions.get(position).getMap().id).image);
            }

            if(position < progressions.size()) {
                //Log.e("DATABASE", DataBase.getSubscribed().get(position).libelle+"");
                list_title.setText(progressions.get(position).getMap().libelle);
                list_date.setVisibility(View.VISIBLE);
                list_lastTimeUpdated.setText("Dernière mise à jour : " + progressions.get(position).getMap().dateDernierePartie);
                list_date.setText("Inscrit le " + DataBase.getSubscribed().get(position).dateInscription);
            }
        } else {
            if(Avatar.size() > position) {
                Log.e("getView: size : ", Map.maps.size()+"" );
                try {
                    avatar.setImageBitmap(Avatar.getAvatar(Map.maps.get(position).id).image);
                }catch (NullPointerException e){
                    Log.e("getView", "Avatar " + Map.maps.get(position).id + " introuvable");
                }
            }
            list_title.setText(Map.maps.get(position).libelle);
            list_lastTimeUpdated.setText("Créé le " + new SimpleDateFormat("dd/MM/yyyy 'à' hh'h'mm").format(Map.maps.get(position).date));
            list_date.setVisibility(View.INVISIBLE);
        }

        return rowView;
    };

    @Override
    public int getCount() {
        ArrayList<Progression> progressions = null;
        if(DataBase.getProgressions(false) != null) progressions = DataBase.getProgressions(false);
        if(HomeFragment.isOnPrivateChallenges) return progressions != null ? progressions.size() : 0;
        else return Map.maps != null ? Map.maps.size() : 0;
    }

}

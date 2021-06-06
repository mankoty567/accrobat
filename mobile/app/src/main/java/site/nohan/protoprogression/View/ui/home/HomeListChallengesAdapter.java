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
        TextView list_lastTimeUpdated = (TextView) rowView.findViewById(R.id.txt_list_lastTimeUpdated);
        TextView list_date = (TextView) rowView.findViewById(R.id.txt_list_date);
        ImageView avatar = (ImageView) rowView.findViewById(R.id.list_item_icon);

        if(HomeFragment.isOnPrivateChallenges) {
            Log.e("POSITION", position+"");
            if(position < DataBase.getSubscribed().size()) {
                //Log.e("DATABASE", DataBase.getSubscribed().get(position).libelle+"");
                list_title.setText(DataBase.getSubscribed().get(position).libelle);
                list_date.setVisibility(View.VISIBLE);
                list_lastTimeUpdated.setText("Dernière mise à jour : " + DataBase.getSubscribed().get(position).dateDernierePartie);
                list_date.setText("Inscrit le " + DataBase.getSubscribed().get(position).dateInscription);
            }
        } else {
            list_title.setText(Map.maps.get(position).libelle);
            list_lastTimeUpdated.setText("Créé le " + new SimpleDateFormat("dd/MM/yyyy 'à' hh'h'mm").format(Map.maps.get(position).date));
            list_date.setVisibility(View.INVISIBLE);
        }
        // show The Image in a ImageView
        new DownloadImageTask(avatar).execute("https://api.acrobat.bigaston.dev/api/challenge/"+position+"/avatar");
        return rowView;
    };

    @Override
    public int getCount() {
        if(HomeFragment.isOnPrivateChallenges) return DataBase.getSubscribed() != null ? DataBase.getSubscribed().size() : 0;
        else return Map.maps != null ? Map.maps.size() : 0;
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView bmImage;

        public DownloadImageTask(ImageView bmImage) {
            this.bmImage = bmImage;
        }

        protected Bitmap doInBackground(String... urls) {
            String urldisplay = urls[0];
            Bitmap mIcon11 = null;
            try {
                InputStream in = new java.net.URL(urldisplay).openStream();
                mIcon11 = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                Log.e("Error", e.getMessage());
                e.printStackTrace();
            }
            return mIcon11;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
    }
}

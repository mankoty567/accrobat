package site.nohan.protoprogression.View.ui.home;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.InputStream;
import java.text.SimpleDateFormat;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.R;

import static site.nohan.protoprogression.Network.DataBase.getMoi;

public class SubscribeListRecordsAdapter extends ArrayAdapter<String> {

    private final Activity context;

    public SubscribeListRecordsAdapter(Activity context) {
        super(context, R.layout.home_list_challenges, new String[]{"Chargement"} );
        // TODO Auto-generated constructor stub

        //Mise en place des données de la DB
        this.context=context;

    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater=context.getLayoutInflater();
        View rowView=inflater.inflate(R.layout.subscribe_list_records, null,true);

        TextView list_title = (TextView) rowView.findViewById(R.id.txt_list_pseudo);
        TextView list_record = (TextView) rowView.findViewById(R.id.txt_list_recordDate);

        list_title.setText(getMoi().getUsername()+"");
        list_record.setText("Hier");

        return rowView;
    };

    @Override
    public int getCount() {
        return Map.maps != null ? Map.maps.size() : 0;
    }
}

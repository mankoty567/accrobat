package site.nohan.protoprogression.View.ui.home;

import android.annotation.SuppressLint;
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
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

import static site.nohan.protoprogression.Network.DataBase.getMoi;
import static site.nohan.protoprogression.Network.DataBase.getRecordDuration;
import static site.nohan.protoprogression.Network.DataBase.getRecordSize;
import static site.nohan.protoprogression.Network.DataBase.getRecordUsername;

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

        //creating Date from millisecond
        long secondes = TimeUnit.MILLISECONDS.toSeconds(getRecordDuration(position)) % 60;
        long minutes = TimeUnit.MILLISECONDS.toMinutes(getRecordDuration(position)) % 60;
        long heures = TimeUnit.MILLISECONDS.toHours(getRecordDuration(position)) % 60;
        long jours = TimeUnit.MILLISECONDS.toDays(getRecordDuration(position)) % 24;

        String date = "";
        if(jours > 0) {
            date += jours+"j, ";
        }
        if(heures > 0){
            date += heures+"h ";
        }
        if(minutes > 0){
            date += minutes+"m ";
        }
        date += secondes+"s";

        list_title.setText(getRecordUsername(position)+"");
        list_record.setText(date);

        return rowView;
    };

    @Override
    public int getCount() {
        return getRecordSize() != -1 ? DataBase.getRecordSize() : 0;
    }
}

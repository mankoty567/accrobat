package site.nohan.protoprogression.Network.Participation;

import android.app.Activity;
import android.content.res.ColorStateList;
import android.util.Log;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.SeekBar;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import site.nohan.protoprogression.Controller.DirectionController;
import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Model.Types.TypeProgression;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

public class RetreiveParticipationResponse implements APIListenner {

    Activity activity;

    public RetreiveParticipationResponse(Activity activity) {
        this.activity = activity;
    }

    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("NET", "onErrorResponse " + error.toString() );
        DataBase.restoreProgression();
    }

    @Override
    public void onResponse(Object response) {
        Log.e("net", "Progression récupérée");
        try{
            // Conversion de la réponse en JSON
            JSONObject json = new JSONObject((String) response);
            Log.e("NET", response.toString() );

            this.restorerSegments(json.getJSONArray("segmentsParcourus"));

            if(json.getString("type").equals(TypeProgression.POINT_PASSAGE)){
                restorePointPassage(json.getJSONObject("entity"));
            }
            if(json.getString("type").equals(TypeProgression.OBSTACLE)){

            }
            if(json.getString("type").equals(TypeProgression.SEGMENT)){
                restoreProgression(
                        json.getDouble("distancePourcentage"),
                        json.getJSONObject("entite").getInt("id")
                );
            }


        }catch (JSONException jsonException){
            jsonException.printStackTrace();
        }
    }

    public void restorePointPassage(JSONObject entity) throws JSONException {
        PointPassage pointPassage = PointPassage.getById(entity.getInt("id"));
        Button button;
        LinearLayout directionLayout = this.activity.findViewById(R.id.routeSelect);

        for(Chemin c : Map.mapActuelle.cheminActuel.objectif.chemins){
            if(c.objectif == null)
                break;
            Log.e("suiv",c.objectif.titre);
            button = new Button(this.activity);
            button.setOnClickListener(new DirectionController(this.activity, c));
            button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.purple_200, null)));
            button.setText(c.objectif.titre + " par " + c.nom);

            directionLayout.addView(button);
        }
    }

    public void restoreObstacle(){

    }

    public void restoreProgression(double distancePourcentage, int idChemin){
        LinearLayout directionLayout = this.activity.findViewById(R.id.routeSelect);
        directionLayout.removeAllViews();
        ((SeekBar) activity.findViewById(R.id.seekBar)).setProgress((int) Math.floor(distancePourcentage));
        Map.mapActuelle.cheminActuel = Chemin.findById(Map.mapActuelle, idChemin);
        Log.e("NET", "Chemin acutel " +  Map.mapActuelle.cheminActuel.id);


    }

    public void restorerSegments(JSONArray segments) throws JSONException{
        Chemin c;
        for(int i=0; i<segments.length(); i++){
            c = Chemin.findById(Map.mapActuelle, segments.getInt(i));
            if(c != null){
                c.complete = true;
            }
        }
    }
}

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
        Log.e("NET", "onErrorResponse Participation" + error.toString() + "\n" + error.getMessage() );
        DataBase.restoreProgression();
    }

    @Override
    public void onResponse(Object response) {
        Log.e("net", "Progression récupérée");
        try{
            SaveParticipationRequest.derniereDistance = 0;
            // Conversion de la réponse en JSON
            JSONObject json = new JSONObject((String) response);
            Log.e("NET", response.toString() );

            this.restorerSegments(json.getJSONArray("segmentsParcourus"));

            if(json.getString("type").equals(TypeProgression.POINT_PASSAGE.toString())){
                restorePointPassage(json.getJSONObject("entity"));
            }
            else if(json.getString("type").equals(TypeProgression.OBSTACLE.toString())){

            }
            else if(json.getString("type").equals(TypeProgression.SEGMENT.toString())){
                restoreProgression(
                        json.getDouble("distancePourcentage")*100,
                        //Map.mapActuelle.MToDistance(json.getDouble("distance")),
                        json.getJSONObject("entity").getInt("id")
                );
            }else{
                Log.e("onResponse: ", "TYPE " + json.getString("type") + " inconnu ");
            }


        }catch (JSONException jsonException){
            jsonException.printStackTrace();
        }
    }

    public void restorePointPassage(JSONObject entity) throws JSONException {
        PointPassage pointPassage = PointPassage.getById(entity.getInt("id"));
        Button button;
        LinearLayout directionLayout = this.activity.findViewById(R.id.routeSelect);

        for(Chemin c : pointPassage.chemins){
            if(c.objectif == null)
                break;
            Log.e("suiv",c.objectif.titre);
            button = new Button(this.activity);
            button.setOnClickListener(new DirectionController(this.activity, c,false));
            button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.blue_button, null)));
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

        int progress = (int) Math.floor(distancePourcentage);
        Map.mapActuelle.accompli = (int) Math.floor(((float) progress*Map.mapActuelle.cheminActuel.getLongueur())/100);
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

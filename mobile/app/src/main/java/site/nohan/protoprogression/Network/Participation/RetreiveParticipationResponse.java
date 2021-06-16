package site.nohan.protoprogression.Network.Participation;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Model.Types.TypeProgression;
import site.nohan.protoprogression.Network.APIListenner;

public class RetreiveParticipationResponse implements APIListenner {

    @Override
    public void onErrorResponse(VolleyError error) {

    }

    @Override
    public void onResponse(Object response) {
        try{
            // Conversion de la réponse en JSON
            JSONObject json = new JSONObject((String) response);

            this.restorerSegments(json.getJSONArray("segmentsParcourus"));

            if(json.getString("type").equals(TypeProgression.POINT_PASSAGE)){
                restorePointPassage(json.getJSONObject("entity"));
            }
            if(json.getString("type").equals(TypeProgression.OBSTACLE)){

            }
            if(json.getString("type").equals(TypeProgression.SEGMENT)){

            }


        }catch (JSONException jsonException){
            jsonException.printStackTrace();
        }
    }

    public void restorePointPassage(JSONObject entity){


    }

    public void restoreObstacle(){

    }

    public void restoreSegment(){

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

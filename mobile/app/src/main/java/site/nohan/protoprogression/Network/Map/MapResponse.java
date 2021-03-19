package site.nohan.protoprogression.Network.Map;

import android.content.Intent;
import android.graphics.Point;
import android.util.Log;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIListenner;

public class MapResponse implements APIListenner {


    @Override
    public void onErrorResponse(VolleyError error) {

    }

    @Override
    public void onResponse(Object response) {

        Log.e("map", response.toString());
        Map.chemins = new ArrayList<>();

        try {

            JSONObject json = new JSONObject((String) response);

            JSONArray pointPassage = json.getJSONArray("PointPassages");
            Map.libelle = json.getString("title");
            Map.desc = json.getString("description");

            for(int i=0; i<pointPassage.length(); i++){
                Log.e("map", "i: "+i);
                Chemin chemin;


                Point premierPoint = new Point(
                        (int) Math.round(((JSONObject) pointPassage.get(i)).getDouble("x")* 100),
                        (int) Math.round(((JSONObject) pointPassage.get(i)).getDouble("y")* 100)
                );



                // On récurperes les points suivants
                JSONArray pointStart  = ((JSONObject) pointPassage.get(i)).getJSONArray("pointStart");
                //Log.e("pstart", pointStart.toString());
                //Log.e("pstart", "len: "+ pointStart.length());
                Log.e("pts", premierPoint.toString());

                // On parcours les points suivant du pp (en tant que chemin)
                for (int j=0; j<pointStart.length();j++){
                    //Log.e("map", "j: "+j);
                    // On ajoute la position du pp en tant que premier point
                    chemin = new Chemin();
                    chemin.points.add(premierPoint);
                    //chemin.title = ((JSONObject) pointPassage.get(i)).getString("title");
                    chemin.title = ((JSONObject) pointPassage.get(i)).getString("id");
                    chemin.desc = ((JSONObject) pointPassage.get(i)).getString("description");
                    JSONArray path = (JSONArray) ((JSONObject) pointStart.get(j)).get("path");
                    // On parcours les points (path qui composent le chemin
                    for(int k=0; k<path.length();k++){
                        Log.e("map", "k: "+k);
                        JSONArray position = (JSONArray) path.get(k);
                        chemin.points.add(
                                new Point(
                                        (int) Math.round( (double) position.get(0)*100),
                                        (int) Math.round( (double) position.get(1)*100)
                                    )
                        );
                    }
                    Log.e("map", chemin.toString());
                    Map.chemins.add(chemin);
                }
            }
            Map.cheminActuel = Map.chemins.get(0);
            Log.e("deb",Map.chemins.toString());
            /*
            //Log.e("deb",json.getJSONArray("PointPassages").toString());
            JSONArray pointPassage = json.getJSONArray("PointPassages");
            Chemin chemin = new Chemin();

            for(int i=0; i<pointPassage.length(); i++){
                int x, y;
                x = Integer.parseInt(((JSONObject) pointPassage.get(i)).get("x")+"");
                y = Integer.parseInt(((JSONObject) pointPassage.get(i)).get("y")+"");

                chemin.points.add(new Point(x,y));

            }

            Map.chemins.add(chemin);
            Map.cheminActuel = chemin;
             */

        } catch (JSONException e) {
            e.printStackTrace();
            Map.chemins = new ArrayList<>();
            Chemin c = new Chemin();
            Map.chemins.add(c);
            Map.cheminActuel = c;
            Log.e("map", "err");
        }


    }
}

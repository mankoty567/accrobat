package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Point;
import android.util.Log;
import android.widget.Button;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import site.nohan.protoprogression.Controller.DirectionController;
import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Network.APIListenner;

public class MapResponse implements APIListenner {

    private final Activity activity;

    public MapResponse(Activity activity){
        this.activity = activity;
    }

    @Override
    public void onErrorResponse(VolleyError error) {

    }


    @Override
    public void onResponse(Object response) {
        Log.e("map", response.toString());


        try{
            // Log de la map
            //Log.e("map", response.toString());

            // Init des chemins
            Map.pointPassages = new ArrayList<>();

            // Conversion de la réponse en JSON
            JSONObject json = new JSONObject((String) response);

            // MAP
            Map.libelle = json.getString("title");

            Map.desc = json.getString("description");

            JSONArray pointsPassage = json.getJSONArray("PointPassages");

            Chemin chemin;
            PointPassage pointPassage;

            // On instantie les chemins
            for (int pointPassagei = 0; pointPassagei <pointsPassage.length() ; pointPassagei++){
                JSONObject jpointPassage = pointsPassage.getJSONObject(pointPassagei);

                pointPassage = new PointPassage();

                Point premierPoint = new Point(
                        (int) Math.round((jpointPassage.getDouble("x")* 100)),
                        100- (int) Math.round((jpointPassage.getDouble("y")* 100) )
                );

                pointPassage.id = jpointPassage.getInt("id");
                pointPassage.titre = jpointPassage.getString("title");
                pointPassage.desc = jpointPassage.getString("description");
                pointPassage.chemins = new ArrayList<>();

                JSONArray jpointsStart = jpointPassage.getJSONArray("pointStart");

                // Si le point de passe n'a pas de path il ne passera pas dans la boucle suivante
                // on ajoute donc son premier point
                // TODO: tout les points de passage doivent avoir un point min
                if(jpointsStart.length() == 0){
                    chemin = new Chemin();
                    // il n'as pas d'objectif
                    chemin.objectifId = Chemin.NO_OJECTIF;
                    chemin.points.add(premierPoint);
                    pointPassage.chemins.add(chemin);
                }

                // Pour tout les chemins
                for(int chemini=0; chemini < jpointsStart.length() ; chemini++){
                    JSONObject jchemin = jpointsStart.getJSONObject(chemini);

                    chemin = new Chemin();
                    chemin.points.add(premierPoint);
                    chemin.objectifId = jchemin.getInt("PointEndId");
                    chemin.origine = pointPassage;
                    chemin.nom = jchemin.getString("name");

                    JSONArray jpath = jchemin.getJSONArray("path");
                    // Pour tout les points qui le composent
                    for(int pathi=0; pathi < jpath.length(); pathi++){
                        JSONArray position = (JSONArray) jpath.get(pathi);
                        // On l'ajoute à sa liste
                        chemin.points.add(
                                new Point(
                                        ((int) Math.round( (double) position.get(0)*100)),
                                        100 - ((int) Math.round( (double) position.get(1)*100))
                                )
                        );
                    }
                    pointPassage.chemins.add(chemin);
                }
                Map.pointPassages.add(pointPassage);
            }

            // On assigne les pointeurs Chemin.objectif en f(x) Chemin.objectifId
            // on le fais mtn il faut tout les pp dans le modele pour avoir tout les id


            for(PointPassage pointPassage1 : Map.pointPassages){
                for(Chemin chemin1 : pointPassage1.chemins){
                    if(chemin1.objectifId != Chemin.NO_OJECTIF) {
                        chemin1.objectif = PointPassage.getById(chemin1.objectifId);
                        // On connecte le chemin à son chemin objectif
                        if (chemin1.objectif.chemins.size() > 0) {
                            Log.e("map", "liaison ! "+ chemin1.origine.titre + " avec "+ chemin1.objectif.titre);
                            chemin1.points.add(chemin1.objectif.chemins.get(0).points.get(0));
                        }else {
                            Log.e("map", chemin1.objectif.id + " n'as pas de chemins");
                        }
                    }
                }
            }
            Log.e("Model", Map.pointPassages.toString());
            Map.dernierPointPassage = Map.pointPassages.get(0);
            Map.cheminActuel = Map.dernierPointPassage.chemins.get(0);


        }catch (JSONException jsonException){
            jsonException.printStackTrace();
            Map.pointPassages = new ArrayList<>();
        }
    }

}

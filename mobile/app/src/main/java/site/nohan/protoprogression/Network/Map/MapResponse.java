package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.content.res.ColorStateList;
import android.graphics.Point;
import android.util.Log;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.SeekBar;

import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import site.nohan.protoprogression.Controller.DirectionController;
import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Obstacle;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Model.Progression;
import site.nohan.protoprogression.Model.Types.TypeObstacle;
import site.nohan.protoprogression.Model.Types.TypePointPassage;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Participation.RetreiveParticipationRequest;
import site.nohan.protoprogression.R;

import static site.nohan.protoprogression.View.ui.challenge.ChallengeFragment.isNotAPreview;

public class MapResponse implements APIListenner {

    private final Activity activity;
    private final Map map;

    public MapResponse(Activity activity, Map map){
        this.map = map;
        this.activity = activity;
    }

    @Override
    public void onErrorResponse(VolleyError error) {

    }


    @Override
    public void onResponse(Object response) {
        Log.e("map", response.toString());

        Map.sauvegardes.add(this.map);
        try{
            // Log de la map
            //Log.e("map", response.toString());
            // Init des chemins
           this.map.pointPassages = new ArrayList<>();

            // Conversion de la réponse en JSON
            JSONObject json = new JSONObject((String) response);

            // MAP
           this.map.libelle = json.getString("title");
           this.map.id = json.getInt("id");
           this.map.description = json.getString("description");
           this.map.echelle = json.getDouble("echelle");


           //this.map.date = new SimpleDateFormat("dd/MM/yyyy").parse(json.getString("createdAt"));

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

                switch (jpointPassage.getString("type")){
                    case "start":
                        pointPassage.type = TypePointPassage.DEPART;
                        break;
                    case "end":
                        pointPassage.type = TypePointPassage.ARRIVEE;
                        break;
                    case "type":
                        pointPassage.type = TypePointPassage.POINT;
                }
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
                    chemin.id = jchemin.getInt("id");

                    JSONArray jpath = jchemin.getJSONArray("path");
                    // Pour tout les points qui le composent
                    for(int pathi=0; pathi < jpath.length(); pathi++){
                        JSONArray position = (JSONArray) jpath.get(pathi);
                        // On l'ajoute à sa liste
                        chemin.points.add(
                                new Point(
                                        ((int) Math.round( (double) position.get(1)*100)),
                                        100-((int) Math.round( (double) position.get(0)*100))
                                )
                        );
                    }

                    // Pour tout les obtacles
                    JSONArray jOstacles = jchemin.getJSONArray("Obstacles");
                    Obstacle obstacle;
                    for(int obstaclei = 0; obstaclei < jOstacles.length(); obstaclei++){
                        obstacle = new Obstacle();
                        obstacle.id =((JSONObject) jOstacles.get(obstaclei)).getInt("id");
                        obstacle.titre =((JSONObject) jOstacles.get(obstaclei)).getString("title");
                        obstacle.description =((JSONObject) jOstacles.get(obstaclei)).getString("description");
                        obstacle.distance = ((JSONObject) jOstacles.get(obstaclei)).getDouble("distance");
                        obstacle.type = TypeObstacle.QUESTION;
                        chemin.obstacles.add(obstacle);
                    }

                    pointPassage.chemins.add(chemin);
                }
               this.map.pointPassages.add(pointPassage);
            }

            // On assigne les pointeurs Chemin.objectif en f(x) Chemin.objectifId
            // on le fais mtn il faut tout les pp dans le modele pour avoir tout les id


            for(PointPassage pointPassage1 :this.map.pointPassages){
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
            Log.e("Model",this.map.pointPassages.toString());

            if(isNotAPreview) this.showDirections();

        }catch (JSONException jsonException){
            jsonException.printStackTrace();
            this.map.pointPassages = new ArrayList<>();
        }

        Log.e("Map", "Chargement terminé");
        //new RetreiveParticipationRequest(activity, Map.participationId);
        DataBase.restoreProgression();

        Button button;
        LinearLayout directionLayout = this.activity.findViewById(R.id.routeSelect);
        if(Map.mapActuelle.cheminActuel != null) {


        }else{
            for (Chemin c : Map.mapActuelle.getDepart().chemins) {
                if (c.objectif == null)
                    break;
                Log.e("suiv", c.objectif.titre);
                button = new Button(this.activity);
                button.setOnClickListener(new DirectionController(this.activity, c, false));
                button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.blue_button, null)));
                button.setText(c.objectif.titre + " par " + c.nom);

                directionLayout.addView(button);
            }
        }
    }

    public void showDirections(){
        Progression progression = DataBase.getProgression(Map.participationId);
        Log.e("showDirections: ", DataBase.getProgression(Map.participationId).getProgression()+"" );
        LinearLayout linearLayout = this.activity.findViewById(R.id.routeSelect);
        SeekBar seekBar = this.activity.findViewById(R.id.seekBar);
        if(progression.getProgression() == 0) {
            /*
            for (Chemin c : this.map.getDepart().chemins) {
                if (c.objectif == null)
                    break;
                Log.e("suiv", c.objectif.titre);
                Button button = new Button(this.activity);
                button.setOnClickListener(new DirectionController(this.activity, c));
                button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.blue_button, null)));
                button.setText(c.objectif.titre + " par " + c.nom);

                linearLayout.addView(button);
            }

             */
        }else{
            Chemin c = Chemin.findById(this.map, progression.getCheminId());
            Button button = new Button(this.activity);
            button.setOnClickListener(new DirectionController(this.activity, c,false));
            button.setBackgroundTintList(ColorStateList.valueOf(this.activity.getResources().getColor(R.color.blue_button, null)));
            button.setText(c.objectif.titre + " par " + c.nom);

            seekBar.setProgress(progression.getProgression());
            linearLayout.addView(button);
        }
    }


}
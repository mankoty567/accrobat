package site.nohan.protoprogression.Network.Participation;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;

import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.APIRequestPOST;
import site.nohan.protoprogression.Network.ConnectionManager;
import site.nohan.protoprogression.Network.DataBase;

public class SaveParticipationRequest extends APIRequestPOST {
    public static long intervalleEnvoiMinimum = 2L*1000L;

    public static double derniereDistance = 0;
    public static long deniereMsEnvoiProgression = 0;

    Activity activity;
    TypeEvent type;
    int id;
    int data;

    /******************************************
     * Constructeur de la requête POST
     *****************************************  @param activity
     * @param data
     * @param apiListenner*/
    public SaveParticipationRequest(Activity activity, TypeEvent type, int data,  int id  , APIListenner apiListenner) {
        super(activity, "event/", apiListenner);

        this.data = data;
        this.id = id;
        this.type = type;
        this.activity = activity;

        if(ConnectionManager.wasDisconnected()){
            Log.e("NET", "La requête de participation ne sera pas envoyée" );
            DataBase.addFailEvent(id, type, data);
            return;
        }

        // Si cela fais longtemps que le deniere Envoi Progression a eu lieu on envoi sinon on ignore
        if(type == TypeEvent.MARCHE || type == TypeEvent.COURSE || type == TypeEvent.VELO) {
            if(site.nohan.protoprogression.Model.Map.mapActuelle == null) {
                Log.e("SavePartReq", "Pas de map actuel sur laquel progresser");
                return;
            }

            if(data < derniereDistance) {
                Log.e("SavePartReq", "Impossible de reculer data: "+data + " , dds:" +derniereDistance);
                return;
            }

            long deltaEnvoi = System.currentTimeMillis() - SaveParticipationRequest.deniereMsEnvoiProgression;
            if (deltaEnvoi < SaveParticipationRequest.intervalleEnvoiMinimum) {
                Log.e("SavePartReq", "Trop tot");
                return;
            }
        }

        APIRequestPOST.queue.add(this);
        APIRequestPOST.queue.start();
    }



    /******************************************
     * Méthode utilisé pour définir le type du BODY de la requête
     ******************************************/
    @Override
    public String getBodyContentType() {
        return "application/json; charset=utf-8";
    }

    /******************************************
     * Méthode utilisé pour transmettre le token
     ******************************************/
    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String,String> headers = new HashMap<>();
        headers.putAll(super.getHeaders());
        if(DataBase.getMoi().getToken() != null && !DataBase.getMoi().getToken().equals("")) {
            //Log.d("TOKEN_OK", DataBase.token_user + "");
            headers.put("Authorization", "Bearer " + DataBase.getMoi().getToken());
        } else {
            Log.e("TOKEN_EMPTY", DataBase.getMoi().getToken() + "");
        }
        return headers;
    }

    @Override
    public byte[] getBody() throws AuthFailureError {
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("type", this.type.toString());

            if(type == TypeEvent.MARCHE || type == TypeEvent.COURSE || type == TypeEvent.VELO) {


                double deltaDistance = site.nohan.protoprogression.Model.Map.mapActuelle.distanceToM(
                        site.nohan.protoprogression.Model.Map.mapActuelle.getDistanceTotale())
                        -
                        site.nohan.protoprogression.Model.Map.mapActuelle.distanceToM(derniereDistance);
                jsonBody.put("data", "" + deltaDistance);
                SaveParticipationRequest.derniereDistance = data;
                /*
                derniereDistance = site.nohan.protoprogression.Model.Map.mapActuelle.distanceToM(
                        site.nohan.protoprogression.Model.Map.mapActuelle.getDistanceTotale()
                );
                 */

            }else if(type == TypeEvent.ARIVEE){
                jsonBody.put("data", data);
            }else if(type == TypeEvent.DEPART){
                jsonBody.put("data", data);
            }else if(type == TypeEvent.OSTACLE){
                jsonBody.put("data", data);
            }
            jsonBody.put("ParticipationId", site.nohan.protoprogression.Model.Map.participationId);


            final String requestBody = jsonBody.toString();
            Log.e("net json", requestBody );
            //Log.i("BODY:", requestBody +"");
            SaveParticipationRequest.deniereMsEnvoiProgression = System.currentTimeMillis();
            return requestBody.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            Log.e("net save.body", "Unsupported Encoding while trying to get the bytes of requestBody using utf-8");
            return null;
        }
    }
}

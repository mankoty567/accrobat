package site.nohan.protoprogression.Network;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import androidx.annotation.Nullable;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Event;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Permission;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Model.Progression;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Model.User;

public class DataBase {
    public static final String DBNAME = "RUNSLIKE";
    public static Context context;
    private static SQLiteDatabase bdd;

    public static PedometerController pedometerController = null;

    /******************************************
     * Création des variables globales
     ******************************************/
    public static boolean isTokenValid(){
        User moi = null;
        try {
            moi = getMoi();
        } catch (NullPointerException e){
            Log.e("TOKEN_VALIDITY", e+"");
            return false;
        }
        if(moi != null) return (moi.getToken() != null && !moi.getToken().equals("NULL"));
        else return false;
    }

    public static boolean isTokenDateValid(Date date){
        boolean res = false;
        User moi = null;
        try {
            moi = getMoi();
        } catch (NullPointerException e){
            Log.e("TOKEN_LAST_UPDATE", e+"");
        }
        if(moi == null) return false;
        else if(moi.getToken_last_update() == null) return false;
        final long diff = (date.getTime() - moi.getToken_last_update().getTime()) / 1000L;
        if(diff <= 7200L) res = true;
        return res;
    }

    public static synchronized void init(Context ctx) {
        DataBase.context = context;

        /*
         * TABLE USER
         */
        bdd = ctx.openOrCreateDatabase(DataBase.DBNAME, android.content.Context.MODE_PRIVATE, null);
        /*bdd.execSQL("DROP TABLE EVENT");
        bdd.execSQL("DROP TABLE PROGRESSION");
        bdd.execSQL("DROP TABLE USER");
        bdd.execSQL("DROP TABLE MOI");
        bdd.execSQL("DROP TABLE ACCOMPLI");*/

        bdd.execSQL("CREATE TABLE IF NOT EXISTS USER(" +
                "ID INTEGER," +
                "USERNAME VARCHAR(255)," +
                "EMAIL VARCHAR(255)," +
                "PERMISSION INTEGER," +
                "XP INTEGER"+
                ");"
        );
        /*
         * TABLE MOI
         */
        bdd.execSQL("CREATE TABLE IF NOT EXISTS MOI(" +
                "ID INTEGER," +
                "USER_ID INTEGER," +
                "TOKEN VARCHAR(255)," +
                "TOKEN_LAST_UPDATE LONG" +
                ");"
        );
        /*
         * TABLE PROGRESSION (afin de pouvoir restaurer la progression sur le segments)
         */
        bdd.execSQL("CREATE TABLE IF NOT EXISTS PROGRESSION(" +
                "CHALLENGE_ID INTEGER," +
                "PARTICIPATION_ID," +
                "CHEMIN_ID INTEGER," + // SEGMENT_ID
                "PROGRESSION INTEGER," +
                "LIBELLE TEXT,"+
                "DESCRIPTION TEXT," +
                "DATE_INSCRIPTION TEXT," +
                "DATE_DERNIEREPARTIE TEXT," +
                "TERMINE INTEGER" +
                ");"
        );

        /*
         * TABLE ACCOMPLI (afin de restaurer les segments (Chemins accomplis)
         */
        bdd.execSQL("CREATE TABLE IF NOT EXISTS ACCOMPLI(" +
                "CHALLENGE_ID INTEGER," +
                "CHEMIN_ID INTEGER," +
                "PARTICIPATION_ID INTEGER" +
                ");");

        /*
         * TABLE RECORDS (afin d'obtenir les meilleurs temps effectués pour un challenge)
         */
        bdd.execSQL("CREATE TABLE IF NOT EXISTS RECORDS(" +
                "PARTICIPATION_ID INTEGER," +
                "DURATION INTEGER," +
                "USERNAME INTEGER" +
                ");");

        bdd.execSQL("CREATE TABLE IF NOT EXISTS EVENT_FAILED_TO_SEND(" +
                "PARTICIPATION_ID INTEGER," +
                "TYPE VARCHAR(25)," +
                "DATA INTEGER," +
                "CREATED_AT DATETIME" +
                ");");

        bdd.execSQL("CREATE TABLE IF NOT EXISTS EVENT(" +
                "PARTICIPATION_ID INTEGER," +
                "TYPE VARCHAR(25)," +
                "DATA INTEGER," +
                "CREATED_AT DATETIME" +
                ");");
        ;

        //Créer la rangée unique
        Cursor resultats = bdd.rawQuery("SELECT * FROM MOI WHERE ID=0",null);
        Log.e("sql","L'utilisateur existe (CODE: "+resultats.getCount()+")");
        if(resultats.getCount() == 0){ // Si il existe pas on le créer
            bdd.execSQL("INSERT INTO MOI VALUES (0, NULL, NULL, 0)");
        }
        resultats.close();
    }

    public static synchronized ArrayList<Map> getSubscribed(){
        ArrayList<Map> maps = new ArrayList<>();
        Map newMap;
        Cursor resultats = bdd.rawQuery("SELECT * FROM PROGRESSION;", null);
        for (resultats.moveToFirst(); !resultats.isAfterLast(); resultats.moveToNext()) {
            newMap = new Map();
            newMap.id = resultats.getInt(resultats.getColumnIndex("CHALLENGE_ID"));
            newMap.participation = resultats.getInt(resultats.getColumnIndex("PARTICIPATION_ID"));
            newMap.libelle =  resultats.getString(resultats.getColumnIndex("LIBELLE"));
            newMap.dateInscription = resultats.getString(resultats.getColumnIndex("DATE_INSCRIPTION"));
            newMap.description = resultats.getString(resultats.getColumnIndex("DESCRIPTION"));
            newMap.dateDernierePartie =  resultats.getString(resultats.getColumnIndex("DATE_DERNIEREPARTIE"));

            maps.add(newMap);
        }


        return maps;
    }

    public static synchronized void newProgression(int participationId, int mapId){
        Map map = Map.findById(mapId);
        bdd.execSQL("INSERT INTO PROGRESSION VALUES(" +
                mapId + ", " +
                participationId + ", " +
                "NULL," +
                "NULL, \"" +
                map.libelle + "\",\"" +
                map.description + " \"," +
                "datetime()," +
                "datetime()," +
                "0" +
                ");"
        );
        Log.e("newProgression: ", "" + Map.participationId);
    }

    public static synchronized void terminer(int participation){
        bdd.execSQL("UPDATE PROGRESSION SET TERMINE=1 WHERE PARTICIPATION_ID="+participation);
    }

    @Nullable
    public static Progression getProgression(int participation){
        Progression progression = null;
        Cursor resultats = bdd.rawQuery("SELECT * FROM PROGRESSION WHERE PARTICIPATION_ID="+participation+";", null);
        resultats.moveToFirst();
        if(resultats.getCount() > 0) {
            progression = new Progression(
                    Map.findById(resultats.getInt(resultats.getColumnIndex("CHALLENGE_ID"))),
                    participation,
                    resultats.getInt(resultats.getColumnIndex("PROGRESSION")),
                    resultats.getInt(resultats.getColumnIndex("CHEMIN_ID")),
                    resultats.getInt(resultats.getColumnIndex("TERMINE"))
            );
            Log.e("getProgression: ", progression.toString());
        }
        resultats.close();
        return progression;
    }



    public static synchronized void saveProgression(){

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String dateAujourdhui = sdf.format(new Date());
        String dateInscription = null;



        Cursor resultats = bdd.rawQuery("SELECT * FROM PROGRESSION WHERE PARTICIPATION_ID="+Map.participationId+";", null);
        resultats.moveToFirst();
        if(resultats.getCount() == 0){
            dateInscription = "" + dateAujourdhui;
        }else{
            dateInscription = resultats.getString(resultats.getColumnIndex("DATE_INSCRIPTION"));
        }
        resultats.close();

        bdd.execSQL("DELETE FROM PROGRESSION WHERE PARTICIPATION_ID="+Map.participationId+ ";");
        bdd.execSQL("INSERT INTO PROGRESSION VALUES(" +
                Map.mapActuelle.id + ", " +
                Map.participationId + ", " +
                Map.mapActuelle.cheminActuel.id +", " +
                Map.mapActuelle.accompli + ", \"" +
                Map.mapActuelle.libelle + "\",\"" +
                Map.mapActuelle.description + " \",'" +
                dateInscription + "','" +
                dateAujourdhui + "'," +
                "0" +
                ");"
        );

        bdd.execSQL("DELETE FROM ACCOMPLI WHERE PARTICIPATION_ID="+Map.participationId+";");
        ArrayList<Integer> completes = new ArrayList<>();
        for (PointPassage pointPassage : Map.mapActuelle.pointPassages){
            for (Chemin chemin : pointPassage.chemins){
                if(chemin.complete){
                    completes.add(chemin.id);
                }
            }
        }
        for( int cheminId : completes ){
            bdd.execSQL("INSERT INTO ACCOMPLI VALUES (" + Map.mapActuelle.id + " ," +  cheminId + " ," + Map.participationId +");");
        }

        //Map.mapActuelle.cheminActuel.id;
    }

    public static synchronized  ArrayList<Progression> getProgressions(boolean termine){
        ArrayList<Progression> progressions = new ArrayList<>();
        Progression progression;
        Cursor eventsCursor = bdd.rawQuery("SELECT * FROM PROGRESSION WHERE TERMINE="+ (termine ? 1+"" : 0+"" )+";", null);
        if(eventsCursor.getCount() == 0){
            return new ArrayList<>();
        }

        for (eventsCursor.moveToFirst(); !eventsCursor.isAfterLast(); eventsCursor.moveToNext()) {
            progression = new Progression(
                    Map.findById(eventsCursor.getInt(eventsCursor.getColumnIndex("CHALLENGE_ID"))),
                    eventsCursor.getInt(eventsCursor.getColumnIndex("PARTICIPATION_ID")),
                    eventsCursor.getInt(eventsCursor.getColumnIndex("PROGRESSION")),
                    eventsCursor.getInt(eventsCursor.getColumnIndex("CHEMIN_ID")),
                    eventsCursor.getInt(eventsCursor.getColumnIndex("TERMINE"))
            );
            progressions.add(progression);
        }
        return progressions;
    }

    public static synchronized void deleteProgression(int mapId){
        bdd.execSQL("DELETE FROM PROGRESSION WHERE CHALLENGE_ID="+mapId+ ";");
        bdd.execSQL("DELETE FROM ACCOMPLI WHERE CHALLENGE_ID="+mapId+";");
    }

    public static synchronized void restoreProgression(){
        Cursor resultats = bdd.rawQuery("SELECT * FROM PROGRESSION WHERE PARTICIPATION_ID="+Map.participationId+" AND CHEMIN_ID IS NOT NULL;", null);
        if(resultats.getCount() == 0){
            Log.e("restoreProgression", "rien à restorer pour la progression");
            return;
        }
        resultats.moveToFirst();
        int participationId = resultats.getInt(1);
        int cheminId  = resultats.getInt(2);
        int progression  = resultats.getInt(3);


        Map.mapActuelle.cheminActuel = Chemin.findById(Map.mapActuelle, cheminId);
        Map.mapActuelle.accompli = progression;
        resultats.close();


        Cursor accomplis = bdd.rawQuery("SELECT * FROM ACCOMPLI WHERE PARTICIPATION_ID="+Map.participationId+" AND CHEMIN_ID IS NOT NULL;", null);
        if(accomplis.getCount() == 0){
            Log.e("restoreProgression", "rien à restorer pour les chemins");
            return;
        }
        for (accomplis.moveToFirst(); !accomplis.isAfterLast(); accomplis.moveToNext()) {
            Chemin c = Chemin.findById(
                    Map.mapActuelle,
                    accomplis.getInt(accomplis.getColumnIndex("CHEMIN_ID"))
            );
            c.complete = true;
            Log.e("restoreProgression", ""+ accomplis.getInt(accomplis.getColumnIndex("CHEMIN_ID")) + " " +c.complete);
        }


        accomplis.close();

    }


    public static synchronized void addUser(User user){
        bdd.execSQL("INSERT INTO USER VALUES(" +
                user.getId()+", '" +
                user.getUsername()+"', '" +
                user.getEmail() + "', '" +
                user.getPermission() + "', '" +
                user.getExperience() + "');"
        );
    }

    public static synchronized void deleteAllUsers(){
        bdd.execSQL("DELETE FROM USER;");
    }

    public static synchronized User getUser(int id){
        Cursor resultats = bdd.rawQuery("SELECT U.ID, U.USERNAME, U.EMAIL, U.PERMISSION, U.XP FROM USER U WHERE U.ID="+id+";",null);
        if(resultats.getCount() == 0)
            return null;
        resultats.moveToFirst();

        String username = resultats.getString(1);
        String email  = resultats.getString(2);
        String permission = resultats.getString(3);
        int xp = resultats.getInt(4);

        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setEmail(email);
        user.setPermission(Permission.fromString(permission));
        user.setExperience(xp);
        resultats.close();
        return user;
    }

    public static synchronized void setMoi(User user){
        bdd.execSQL("DELETE FROM USER WHERE ID="+user.getId());
        bdd.execSQL("INSERT INTO USER VALUES(" +
                user.getId()+", '" +
                user.getUsername()+"', '" +
                user.getEmail() + "', '" +
                user.getPermission() + "' , '" +
                user.getExperience() +"');"
        );
        bdd.execSQL("UPDATE MOI SET USER_ID="+user.getId()+",TOKEN='"+user.getToken()+"'"+",TOKEN_LAST_UPDATE="+user.getToken_last_update().getTime());
    }

    public static synchronized User getMoi(){
        Cursor resultats = bdd.rawQuery("SELECT U.ID, U.USERNAME, U.EMAIL, U.PERMISSION, U.XP, M.TOKEN, M.TOKEN_LAST_UPDATE FROM USER U INNER JOIN MOI M ON U.ID = M.USER_ID LIMIT 1",null);
        if(resultats.getCount() == 0)
            return null;
        resultats.moveToFirst();

        int id = resultats.getInt(0);
        String username = resultats.getString(1);
        String email  = resultats.getString(2);
        int permission = resultats.getInt(3);
        int xp = resultats.getInt(4);
        String token = resultats.getString(5);
        Date token_last_update = new Date(resultats.getLong(6));

        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setEmail(email);
        user.setPermission(Permission.fromInt(permission));
        user.setExperience(xp);
        user.setToken(token);
        user.setToken_last_update(token_last_update);

        resultats.close();
        //Log.e("INITIALIZE",token_last_update+"");
        return user;
    }


    private static ArrayList<Integer> recordsParticipationID = new ArrayList<Integer>();

    public static synchronized void addRecord(int idParticipation, long duration, String username){
        bdd.execSQL("DELETE FROM RECORDS WHERE PARTICIPATION_ID="+idParticipation+ ";");
        bdd.execSQL("INSERT INTO RECORDS VALUES(" +
                idParticipation + ", " +
                duration +", \"" +
                username + "\"" +
                ");"
        );
        recordsParticipationID.add(idParticipation);
    }

    public static synchronized void resetRecords(){
        bdd.execSQL("DELETE FROM RECORDS;");
        recordsParticipationID.clear();
    }

    public static long getRecordDuration(int position){
        int idParticipation = -1;
        if(recordsParticipationID.size() > 0 && recordsParticipationID.size() > position) idParticipation = recordsParticipationID.get(position);

        Cursor resultats = bdd.rawQuery("SELECT DURATION FROM RECORDS WHERE PARTICIPATION_ID="+idParticipation+";",null);
        if(resultats.getCount() == 0)
            return -1;
        resultats.moveToFirst();

        return resultats.getLong(0);
    }

    public static synchronized String getRecordUsername(int position){
        int idParticipation = -1;
        if(recordsParticipationID.size() > 0 && recordsParticipationID.size() > position) idParticipation = recordsParticipationID.get(position);

        Cursor resultats = bdd.rawQuery("SELECT USERNAME FROM RECORDS WHERE PARTICIPATION_ID="+idParticipation+";",null);
        if(resultats.getCount() == 0)
            return null;
        resultats.moveToFirst();

        return resultats.getString(0);
    }

    public static synchronized int getRecordSize(){
        Cursor resultats = bdd.rawQuery("SELECT COUNT (*) FROM RECORDS ;",null);
        if(resultats.getCount() == 0)
            return -1;
        resultats.moveToFirst();
        int size = resultats.getInt(0);
        if(size > 5) size = 5;
        return size;
    }

    public static synchronized void addFailEvent(int participationId, TypeEvent typeEvent, int data){
        Log.e("DB",  "Ajout d'un event faild" + typeEvent.toString());
        bdd.execSQL("INSERT INTO EVENT_FAILED_TO_SEND VALUES(" +
                participationId + ", \"" +
                typeEvent.toString() +"\"," +
                data + "," +
                "datetime()" +
                ");"
        );
    }

    public static synchronized void addNewEvent(int participationId, TypeEvent typeEvent, int data){
        Log.e("DB",  "Ajout d'un event " + typeEvent.toString());
        bdd.execSQL("INSERT INTO EVENT VALUES(" +
                participationId + ", \"" +
                typeEvent.toString() +"\"," +
                data + ", " +
                "datetime()" +
                ");"
        );
    }

    public static synchronized  ArrayList<Event> getFailEvents(){
        ArrayList<Event> events = new ArrayList<>();

        Cursor eventsCursor = bdd.rawQuery("SELECT * FROM EVENT_FAILED_TO_SEND ORDER BY CREATED_AT DESC;", null);
        if(eventsCursor.getCount() == 0){
            return new ArrayList<>();
        }
        Event event;
        for (eventsCursor.moveToFirst(); !eventsCursor.isAfterLast(); eventsCursor.moveToNext()) {
            event = new Event(
                    eventsCursor.getInt(eventsCursor.getColumnIndex("PARTICIPATION_ID")),
                    TypeEvent.get(eventsCursor.getString(eventsCursor.getColumnIndex("TYPE"))),
                    eventsCursor.getInt(eventsCursor.getColumnIndex("DATA")),
                    eventsCursor.getString(eventsCursor.getColumnIndex("CREATED_AT"))
            );
            events.add(event);
        }
        return events;
    }

    public static synchronized  ArrayList<Event> getEventsOf(int participationId){
        ArrayList<Event> events = new ArrayList<>();

        Cursor eventsCursor = bdd.rawQuery("SELECT * FROM EVENT WHERE PARTICIPATION_ID="+participationId+" ORDER BY CREATED_AT DESC;", null);
        if(eventsCursor.getCount() == 0){
            return new ArrayList<>();
        }
        Event event;
        for (eventsCursor.moveToFirst(); !eventsCursor.isAfterLast(); eventsCursor.moveToNext()) {
            event = new Event(
                    eventsCursor.getInt(eventsCursor.getColumnIndex("PARTICIPATION_ID")),
                    TypeEvent.get(eventsCursor.getString(eventsCursor.getColumnIndex("TYPE"))),
                    eventsCursor.getInt(eventsCursor.getColumnIndex("DATA")),
                    eventsCursor.getString(eventsCursor.getColumnIndex("CREATED_AT"))
            );
            events.add(event);
        }
        return events;
    }


    public static synchronized void deleteFailedToSend(int participationId, TypeEvent typeEvent, int data) {
        Log.e("DB", "Suppression d'un event failed" + typeEvent.toString());
        bdd.execSQL("DELETE FROM EVENT_FAILED_TO_SEND WHERE " +
                "PARTICIPATION_ID=" + participationId + " AND " +
                "TYPE like \"" + typeEvent.toString() + "\" AND " +
                "DATA = " + data + "" + ";"
        );
    }

    public static synchronized boolean needToSyncEventWithAPI(){
        return !getFailEvents().isEmpty();
    }

}

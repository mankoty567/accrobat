package site.nohan.protoprogression.Network;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;
import android.view.inputmethod.InlineSuggestionsRequest;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import site.nohan.protoprogression.Model.Chemin;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Permission;
import site.nohan.protoprogression.Model.PointPassage;
import site.nohan.protoprogression.Model.User;

public class DataBase {
    public static final String DBNAME = "RUNSLIKE";
    public static Context context;
    private static SQLiteDatabase bdd;

    /******************************************
     * Création des variables globales
     ******************************************/
    public static boolean isTokenValid(){
        try {
            getMoi().getToken();
        } catch (Exception e){
            Log.e("TOKEN_VALIDITY", e+"");
            return false;
        }
        return (getMoi().getToken() != null && !getMoi().getToken().equals("NULL"));
    }

    public static boolean isTokenDateValid(Date date){
        boolean res = false;
        if(getMoi().getToken_last_update() == null) return false;
        final long diff = (date.getTime() - getMoi().getToken_last_update().getTime()) / 1000L;
        if(diff <= 7200L) res = true;
        return res;
    }

    public static synchronized void init(Context ctx) {
        DataBase.context = context;
        /*
         * TABLE USER
         */
        bdd = ctx.openOrCreateDatabase(DataBase.DBNAME, android.content.Context.MODE_PRIVATE, null);
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
                "CHEMIN_ID INTEGER," + // SEGMENT_ID
                "PROGRESSION INTEGER," +
                "LIBELLE TEXT,"+
                "DESCRIPTION TEXT," +
                "DATE_INSCRIPTION TEXT," +
                "DATE_DERNIEREPARTIE TEXT" +
                ");"
        );

        /*
         * TABLE ACCOMPLI (afin de restaurer les segments (Chemins accomplis)
         */
        bdd.execSQL("CREATE TABLE IF NOT EXISTS ACCOMPLI(" +
                "CHALLENGE_ID," +
                "CHEMIN_ID" +
                ");");

        /*
         * TABLE RECORDS (afin d'obtenir les meilleurs temps effectués pour un challenge)
         */
        bdd.execSQL("CREATE TABLE IF NOT EXISTS RECORDS(" +
                "PARTICIPATION_ID," +
                "DURATION," +
                "USERNAME" +
                ");");

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
            newMap.libelle =  resultats.getString(resultats.getColumnIndex("LIBELLE"));
            newMap.dateInscription = resultats.getString(resultats.getColumnIndex("DATE_INSCRIPTION"));
            newMap.description = resultats.getString(resultats.getColumnIndex("DESCRIPTION"));
            newMap.dateDernierePartie =  resultats.getString(resultats.getColumnIndex("DATE_DERNIEREPARTIE"));

            maps.add(newMap);
        }


        return maps;
    }

    public static synchronized void saveProgression(){

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String dateAujourdhui = sdf.format(new Date());
        String dateInscription = null;



        Cursor resultats = bdd.rawQuery("SELECT * FROM PROGRESSION WHERE CHALLENGE_ID="+Map.mapActuelle.id+";", null);
        resultats.moveToFirst();
        if(resultats.getCount() == 0){
            dateInscription = "" + dateAujourdhui;
        }else{
            dateInscription = resultats.getString(resultats.getColumnIndex("DATE_INSCRIPTION"));
        }
        resultats.close();

        bdd.execSQL("DELETE FROM PROGRESSION WHERE CHALLENGE_ID="+Map.mapActuelle.id+ ";");
        bdd.execSQL("INSERT INTO PROGRESSION VALUES(" +
                Map.mapActuelle.id + ", " +
                Map.mapActuelle.cheminActuel.id +", " +
                Map.mapActuelle.accompli + ", \"" +
                Map.mapActuelle.libelle + "\",\"" +
                Map.mapActuelle.description + " \",'" +
                dateInscription + "','" +
                dateAujourdhui +
                "');"
        );

        bdd.execSQL("DELETE FROM ACCOMPLI WHERE CHALLENGE_ID="+Map.mapActuelle.id+";");
        ArrayList<Integer> completes = new ArrayList<>();
        for (PointPassage pointPassage : Map.mapActuelle.pointPassages){
            for (Chemin chemin : pointPassage.chemins){
                if(chemin.complete){
                    completes.add(chemin.id);
                }
            }
        }
        for( int cheminId : completes ){
            bdd.execSQL("INSERT INTO ACCOMPLI VALUES (" + Map.mapActuelle.id + " ," +  cheminId + ");");
        }

        //Map.mapActuelle.cheminActuel.id;
    }

    public static synchronized void deleteProgression(int mapId){
        bdd.execSQL("DELETE FROM PROGRESSION WHERE CHALLENGE_ID="+mapId+ ";");
        bdd.execSQL("DELETE FROM ACCOMPLI WHERE CHALLENGE_ID="+mapId+";");
    }

    public static synchronized void restoreProgression(){
        Cursor resultats = bdd.rawQuery("SELECT * FROM PROGRESSION WHERE CHALLENGE_ID="+Map.mapActuelle.id+";", null);
        if(resultats.getCount() == 0){
            Log.e("restoreProgression", "rien à restorer pour la progression");
            return;
        }
        resultats.moveToFirst();
        int cheminId  = resultats.getInt(1);
        int progression  = resultats.getInt(2);

        Map.mapActuelle.cheminActuel = Chemin.findById(Map.mapActuelle, cheminId);
        Map.mapActuelle.accompli = progression;
        resultats.close();


        Cursor accomplis = bdd.rawQuery("SELECT * FROM ACCOMPLI WHERE CHALLENGE_ID="+Map.mapActuelle.id+";", null);
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

    public static void addRecord(int idParticipation, long duration, String username){
        bdd.execSQL("DELETE FROM RECORDS WHERE PARTICIPATION_ID="+idParticipation+ ";");
        bdd.execSQL("INSERT INTO RECORDS VALUES(" +
                idParticipation + ", " +
                duration +", \"" +
                username + "\"" +
                ");"
        );
        recordsParticipationID.add(idParticipation);
    }

    public static void resetRecords(){
        bdd.execSQL("DELETE FROM RECORDS;");
        recordsParticipationID.clear();
    }

    public static long getRecordDuration(int position){
        int idParticipation = -1;
        if(recordsParticipationID.size() > 0) idParticipation = recordsParticipationID.get(position);

        Cursor resultats = bdd.rawQuery("SELECT DURATION FROM RECORDS WHERE PARTICIPATION_ID="+idParticipation+";",null);
        if(resultats.getCount() == 0)
            return -1;
        resultats.moveToFirst();

        return resultats.getLong(0);
    }

    public static String getRecordUsername(int position){
        int idParticipation = -1;
        if(recordsParticipationID.size() > 0 && recordsParticipationID.size() > position) idParticipation = recordsParticipationID.get(position);

        Cursor resultats = bdd.rawQuery("SELECT USERNAME FROM RECORDS WHERE PARTICIPATION_ID="+idParticipation+";",null);
        if(resultats.getCount() == 0)
            return null;
        resultats.moveToFirst();

        return resultats.getString(0);
    }

    public static int getRecordSize(){
        Cursor resultats = bdd.rawQuery("SELECT COUNT (*) FROM RECORDS ;",null);
        if(resultats.getCount() == 0)
            return -1;
        resultats.moveToFirst();

        return resultats.getInt(0);
    }
}

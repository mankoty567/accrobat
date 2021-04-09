package site.nohan.protoprogression.Network;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;
import android.view.inputmethod.InlineSuggestionsRequest;

import java.util.Date;

import site.nohan.protoprogression.Model.Permission;
import site.nohan.protoprogression.Model.User;

public class DataBase {
    public static final String DBNAME = "RUNSLIKE";
    public static Context context;
    private static SQLiteDatabase bdd;

    /******************************************
     * Création des variables globales
     ******************************************/

    public static String token_user = "";
    public static Date token_last_update;

    public static boolean isTokenValid(){
        boolean res = true;
        if(token_user == "") res = false;
        return res;
    }

    public static boolean isTokenDateValid(Date date){
        boolean res = false;
        if(token_last_update == null) return false;
        final long diff = (date.getTime() - token_last_update.getTime()) / 1000L;
        if(diff <= 7200L) res = true;
        return res;
    }

    public static synchronized void init(Context ctx) {
        DataBase.context = context;
        bdd = ctx.openOrCreateDatabase(DataBase.DBNAME, android.content.Context.MODE_PRIVATE, null);
        bdd.execSQL("CREATE TABLE IF NOT EXISTS USER(" +
                "ID INTEGER," +
                "USERNAME VARCHAR(255)," +
                "EMAIL VARCHAR(255)," +
                "PERMISSION INTEGER," +
                "XP INTEGER"+
                ");"
        );

        bdd.execSQL("CREATE TABLE IF NOT EXISTS MOI(" +
                "ID INTEGER," +
                "USER_ID INTEGER," +
                "TOKEN VARCHAR(255)" +
                ");"
        );


        //Créer la rangée unique
        Cursor resultats = bdd.rawQuery("SELECT * FROM MOI WHERE ID=0",null);
        Log.e("sql","L'utilisateur existe (CODE: "+resultats.getCount()+")");
        if(resultats.getCount() == 0){ // Si il existe pas on le créer
            bdd.execSQL("INSERT INTO MOI VALUES (0, NULL, NULL)");
        }
    }


    public static synchronized void addUser(User user){
        bdd.execSQL("INSERT INTO USER VALUES(" +
                user.getId()+", " +
                user.getUsername()+", " +
                user.getEmail() + ", " +
                user.getPermission() + ");"
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
        int permission = resultats.getInt(3);
        int xp = resultats.getInt(4);

        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setEmail(email);
        user.setPermission(Permission.fromInt(permission));
        user.setExperience(xp);
        resultats.close();
        return user;
    }

    public static synchronized void setMoi(User user){
        bdd.execSQL("DELETE FROM USER WHERE ID="+user.getId());
        bdd.execSQL("INSERT INTO USER VALUES(" +
                user.getId()+", " +
                user.getUsername()+", " +
                user.getEmail() + ", " +
                user.getPermission() + ");"
        );
        bdd.execSQL("UPDATE MOI SET USER_ID="+user.getId());
    }

    public static synchronized User getMoi(){
        Cursor resultats = bdd.rawQuery("SELECT U.ID, U.USERNAME, U.EMAIL, U.PERMISSION, U.XP, M.TOKEN FROM USER U INNER JOIN MOI M ON U.ID = M.USER_ID LIMIT 1",null);
        if(resultats.getCount() == 0)
            return null;
        resultats.moveToFirst();

        int id = resultats.getInt(0);
        String username = resultats.getString(1);
        String email  = resultats.getString(2);
        int permission = resultats.getInt(3);
        int xp = resultats.getInt(4);

        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setEmail(email);
        user.setPermission(Permission.fromInt(permission));
        user.setExperience(xp);
        resultats.close();
        return user;
    }



}

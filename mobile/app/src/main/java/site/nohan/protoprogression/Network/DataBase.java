package site.nohan.protoprogression.Network;

import android.view.inputmethod.InlineSuggestionsRequest;

import java.util.Date;

public class DataBase {

    /******************************************
     * Création des variables globales
     ******************************************/
    //USER
    public static int id_user = 0;
    public static String username_user = "";
    public static String email_user = "";
    public static int permission_user = 0;
    public static int level_user = 0;
    public static int xp_user = 0;
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

    //CHALLENGES
    public static int[] list_id;
    public static String[] txt_list_title = {"No challenge found"};
    public static String[] txt_list_description = {"No challenge found"};
    public static int id_challenge_request = -1;

    public static String[] txt_list_kilometres;
    public static String[] txt_list_date;
    public static String[] txt_list_segments;

}

package site.nohan.protoprogression.Model;

import android.util.Log;
import android.widget.ArrayAdapter;

import java.util.ArrayList;
import java.util.Date;

public class User {
    private static User acutel;

    private int id;
    private String username;
    private String email;
    private Permission permission;
    private int experience;
    private String token;
    private Date token_last_update;

    public static ArrayList<Integer>challengesSubscribedIDs = new ArrayList<>();

    public User(int id, String username, String email, Permission permission, int experience, String token, Date token_last_update) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.permission = permission;
        this.experience = experience;
        this.token = token;
        this.token_last_update = token_last_update;
    }

    public User(){}

    public static User getAcutel() {
        return acutel;
    }

    public static void setAcutel(User acutel) {
        User.acutel = acutel;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }


    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public String getToken() {
        if(token == null)
            return "NULL";
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getToken_last_update() {
        return token_last_update;
    }

    public void setToken_last_update(Date token_last_update) {
        this.token_last_update = token_last_update;
    }
}

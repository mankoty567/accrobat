package site.nohan.protoprogression.Model;

import android.graphics.Bitmap;
import android.util.Log;

import androidx.annotation.Nullable;

import java.util.ArrayList;

public class Avatar {
    private static ArrayList<Avatar> avatars = new ArrayList<>();

    public int mapId;
    public Bitmap image;

    public Avatar(int mapId, Bitmap image) {
        avatars.add(this);
        this.mapId = mapId;
        this.image = image;
    }

    public static Avatar get(int pos){
        return avatars.get(pos);
    }

    public static void add(Avatar avatar){
        avatars.add(avatar);
    }

    public static ArrayList<Avatar> getListReference(){
        return avatars;
    }

    @Nullable
    public static Avatar getAvatar(int mapId){
        for(Avatar avatar : avatars){
            if (avatar.mapId == mapId)
                return avatar;
        }
        Log.e("getAvatar" , mapId + " introuvable" );
        return null;
    }

    public static int size() {
        return avatars.size();
    }

    @Override
    public String toString() {
        return "Avatar{" +
                "mapId=" + mapId +
                ", image=" + image +
                '}';
    }
}

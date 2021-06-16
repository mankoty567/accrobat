package site.nohan.protoprogression.Model;

import androidx.annotation.Nullable;

public enum  Permission {
    USER(0),
    ADMIN(1);

    int code;

    Permission(int code){
        this.code = code;
    }

    @Nullable
    public static Permission fromInt(int permission) {
        for(Permission p : Permission.values()){
            if(p.code == permission)
                return p;
        }
        return null;
    }

    public static Permission fromString(String permission) {
        if(permission.equals("ADMIN"))
            return Permission.ADMIN;
        return Permission.USER;
    }

    @Override
    public String toString() {
        return code == 0 ? "USER" : "ADMIN";
    }
}

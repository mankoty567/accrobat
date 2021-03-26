package site.nohan.protoprogression.Network.Authenticate;

import android.app.Activity;

import com.android.volley.AuthFailureError;

import java.util.Map;

import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.Network.APIRequest;

public class AuthenticateRequest extends APIRequest {

    public AuthenticateRequest(Activity activity, String ressource, APIListenner apiListenner) {
        super(activity, ressource, apiListenner);
    }

    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        return super.getHeaders();
    }
}

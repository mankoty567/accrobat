package site.nohan.protoprogression.Network.Authenticate.Signup;

import android.app.Activity;
import android.util.Log;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.android.volley.VolleyError;

import kotlinx.coroutines.internal.SystemPropsKt;
import site.nohan.protoprogression.Network.APIListenner;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.SigninFragment;
import site.nohan.protoprogression.View.ui.home.SignupFragment;

public class SignupResponse implements APIListenner {

    /******************************************
     * Création des variables globales
     ******************************************/
    private Activity activity;
    private SignupFragment signupFragment;

    /******************************************
     * Constructeur de la réponse
     ******************************************/
    public SignupResponse(Activity activity, SignupFragment signupFragment) {
        this.activity = activity;
        this.signupFragment = signupFragment;
    }

    /******************************************
     * Méthode utilisé pour traiter l'erreur de la requête
     ******************************************/
    @Override
    public void onErrorResponse(VolleyError error) {
        Log.e("ERROR_SIGNUP_REQUEST: ", "\n\n\n" + error.networkResponse + "");
        Toast.makeText(activity,"Login already used !", Toast.LENGTH_SHORT).show();
    }

    /******************************************
     * Méthode utilisé pour traiter la réponse
     ******************************************/
    @Override
    public void onResponse(Object response) {
        //Log.d("theTag",response.toString());
        //Retour sur le Fragment de connexion
        signupFragment.ShowFragment(R.id.navigation_signin);
        Toast.makeText(activity,"User successfully created !", Toast.LENGTH_SHORT).show();
    }
}

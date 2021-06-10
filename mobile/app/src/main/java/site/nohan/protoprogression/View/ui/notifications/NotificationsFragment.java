package site.nohan.protoprogression.View.ui.notifications;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;

import java.util.Date;

import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.challenge.ChallengeFragment;
import site.nohan.protoprogression.View.ui.home.HomeFragment;
import site.nohan.protoprogression.View.ui.home.SigninFragment;

public class NotificationsFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int signin;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    public View onCreateView(@NonNull LayoutInflater inflater,
            ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_notifications, container, false);

        signin = R.id.navigation_signin;

        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) ShowFragment(signin);
        else {
            Log.i("TOKEN", DataBase.getMoi().getToken()+"");
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.getActivity());
        }

        return root;
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(int fragment) {
        Navigation.findNavController(this.getActivity(),R.id.nav_host_fragment).navigate(fragment);
    }
}
package site.nohan.protoprogression.View.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.navigation.Navigation;

import java.util.Date;

import site.nohan.protoprogression.Controller.ui.MapsAdaptaterListenner;
import site.nohan.protoprogression.Network.Challenge.ChallengesRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.challenge.ChallengeFragment;

public class HomeFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int signin;
    private int challenge;

    private ListView lv_home_challenges;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_home, container, false);

        signin = R.id.navigation_signin;
        challenge = R.id.navigation_challenge;

        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) ShowFragment(signin);
        else {
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.getActivity());
        }

        //Affichage de tous les challenges
        HomeListChallengesAdapter challengesAdapter = new HomeListChallengesAdapter(this.getActivity());
        new ChallengesRequest(this.getActivity(), challengesAdapter);

        lv_home_challenges = (ListView) root.findViewById(R.id.lv_home_challenges);
        lv_home_challenges.setAdapter(challengesAdapter);
        lv_home_challenges.setOnItemClickListener(new MapsAdaptaterListenner(this));

        return root;
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(int fragment) {
        Navigation.findNavController(this.getActivity(),R.id.nav_host_fragment).navigate(fragment);
    }
}
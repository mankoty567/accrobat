package site.nohan.protoprogression.View.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import java.util.Date;

import site.nohan.protoprogression.Network.Challenge.ChallengesRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.challenge.ChallengeFragment;

public class HomeFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private Fragment signin;
    private Fragment challenge;

    private ListView lv_home_challenges;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        signin = SigninFragment.newInstance();
        challenge = ChallengeFragment.newInstance();
    }

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_home, container, false);

        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) ShowFragment(signin);
        else {
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.getActivity());
        }

        //Affichage de tous les challenges
        new ChallengesRequest(this.getActivity());
        HomeListChallengesAdapter challengesAdapter = new HomeListChallengesAdapter(this.getActivity());
        lv_home_challenges = (ListView) root.findViewById(R.id.lv_home_challenges);
        lv_home_challenges.setAdapter(challengesAdapter);
        lv_home_challenges.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                //Sélection du challenge
                if(DataBase.list_id != null) DataBase.id_challenge_request = DataBase.list_id[position];
                ShowFragment(challenge);
            }
        });

        return root;
    }

    /******************************************
     * Méthode utilisé pour créer l'instance HomeFragment
     ******************************************/
    public static HomeFragment newInstance() {
        HomeFragment fragment = new HomeFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(Fragment fragment) {
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.nav_host_fragment, fragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }
}
package site.nohan.protoprogression.View.ui.home;

import android.content.res.ColorStateList;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.navigation.Navigation;

import java.util.Date;

import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Controller.SeekBarController;
import site.nohan.protoprogression.Controller.ui.MapsAdaptaterListenner;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.Challenge.ChallengesRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationRequest;
import site.nohan.protoprogression.Network.Participation.SaveParticipationResponse;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.challenge.ChallengeFragment;

import static site.nohan.protoprogression.View.ui.home.SigninFragment.hasFrauded;

public class HomeFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int signin = R.id.navigation_signin;
    private int challenge = R.id.navigation_challenge;

    private ListView lv_home_challenges;
    private Button btn_allChallenges;
    private Button btn_privateChallenges;
    public static boolean isOnPrivateChallenges = false;
    private HomeListChallengesAdapter challengesAdapter;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_home, container, false);
        DataBase.init(this.getContext());

        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) ShowFragment(signin);
        else {
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.getActivity());
        }

        //Mise en place du menu des challenges
        btn_allChallenges = root.findViewById(R.id.btn_home_allChallenges);
        btn_allChallenges.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isOnPrivateChallenges = false;
                updateViewButtonMenu(btn_allChallenges,btn_privateChallenges);
            }
        });
        btn_privateChallenges = root.findViewById(R.id.btn_home_subscribedChallenges);
        btn_privateChallenges.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isOnPrivateChallenges = true;
                updateViewButtonMenu(btn_privateChallenges,btn_allChallenges);
            }
        });

        hasFrauded = false;

        lv_home_challenges = (ListView) root.findViewById(R.id.lv_home_challenges);
        challengesAdapter = new HomeListChallengesAdapter(this.getActivity());
        lv_home_challenges.setAdapter(challengesAdapter);
        if(!isOnPrivateChallenges) updateViewButtonMenu(btn_allChallenges,btn_privateChallenges);
        else updateViewButtonMenu(btn_privateChallenges,btn_allChallenges);


        return root;
    }

    /******************************************
     * Méthode utilisé pour mettre à jour le menu
     ******************************************/
    public void updateViewButtonMenu(Button buttonClicked, Button buttonErased){
        if(SeekBarController.progress > 0) {
            new SaveParticipationRequest(this.getActivity(), PedometerController.modeSelected, SeekBarController.progress, Map.participationId,
                    new SaveParticipationResponse(this.getActivity(), PedometerController.modeSelected, SeekBarController.progress, Map.participationId)
            );
        }
        //Affichage de tous les challenges
        if(!isOnPrivateChallenges) new ChallengesRequest(this.getActivity(), challengesAdapter);
        else {
            challengesAdapter.notifyDataSetChanged();
        }
        lv_home_challenges.setOnItemClickListener(new MapsAdaptaterListenner(this));
        buttonClicked.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.light_gray_main, null)));
        buttonErased.setBackgroundTintList(ColorStateList.valueOf(getResources().getColor(R.color.bold_gray_main, null)));
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(int fragment) {
        Navigation.findNavController(this.getActivity(),R.id.nav_host_fragment).navigate(fragment);
    }
}
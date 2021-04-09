 package site.nohan.protoprogression.View.ui.challenge;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import java.util.Date;

import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Map.ImageMapRequest;
import site.nohan.protoprogression.Network.Map.MapRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.HomeFragment;
import site.nohan.protoprogression.View.ui.home.SigninFragment;
import site.nohan.protoprogression.View.ui.home.SignupFragment;

 public class ChallengeFragment extends Fragment {

     /************************************************************************
      * Création des variables globales
      ************************************************************************/
     private Fragment signin;

     /************************************************************************
      * Création de la class et de la vue
      ************************************************************************/
     @Override
     public void onCreate(@Nullable Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);
         signin = SigninFragment.newInstance();
     }

     public View onCreateView(@NonNull LayoutInflater inflater,
            ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.progression, container, false);

         //Vérification que l'utilisateur est connecté
         if(!DataBase.isTokenValid()) ShowFragment(signin);
         else {
             if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.getActivity());
         }

        return root;
     }

     @Override
     public void onResume() {
         super.onResume();

         //Récupération du Challenge à afficher
         if(DataBase.isTokenValid() && DataBase.isTokenDateValid(new Date())){
             if (DataBase.id_challenge_request == -1) {
                 new MapRequest(this.getActivity(), 20); //default = 15 bonne = 20
                 new ImageMapRequest(this.getActivity(), 20);

             } else {
                 new MapRequest(this.getActivity(), DataBase.id_challenge_request);
                 new ImageMapRequest(this.getActivity(), DataBase.id_challenge_request);
             }
         }
     }

     /******************************************
      * Méthode utilisé pour créer l'instance ChallengeFragment
      ******************************************/
     public static ChallengeFragment newInstance() {
         ChallengeFragment fragment = new ChallengeFragment();
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
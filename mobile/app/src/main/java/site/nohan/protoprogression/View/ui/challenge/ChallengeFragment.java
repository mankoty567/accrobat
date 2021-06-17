 package site.nohan.protoprogression.View.ui.challenge;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;

import java.util.Date;

import site.nohan.protoprogression.Model.Map;
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
     private int signin;

     public static boolean isNotAPreview;
     private LinearLayout ll_interaction;
     private LinearLayout ll_mode;

     /************************************************************************
      * Création de la class et de la vue
      ************************************************************************/
     public View onCreateView(@NonNull LayoutInflater inflater,
            ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.progression, container, false);

        signin = R.id.navigation_signin;
        ll_interaction = root.findViewById(R.id.ll_zoom);
        ll_mode = root.findViewById(R.id.ll_mode);
        if(!isNotAPreview){
            ll_interaction.setVisibility(View.GONE);
            ll_mode.setVisibility(View.GONE);
        }
        //else ll_interaction.setVisibility(View.VISIBLE);

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
             // TODO: ????
         }
     }

     /******************************************
      * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
      ******************************************/
     public void ShowFragment(int fragment) {
         Navigation.findNavController(this.getActivity(),R.id.nav_host_fragment).navigate(fragment);
     }
}
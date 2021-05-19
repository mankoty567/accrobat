package site.nohan.protoprogression.View.ui.home;

import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import java.text.SimpleDateFormat;
import java.util.Date;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Map.ImageMapRequest;
import site.nohan.protoprogression.Network.Map.MapRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.challenge.ChallengeFragment;

public class SubscribeFragment extends Fragment {
    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int signin = R.id.navigation_signin;;
    private int challenge = R.id.navigation_challenge;

    private Button btn_subscribe;
    private Button btn_preview;
    private TextView tv_title;
    private TextView tv_date;
    private TextView tv_description;

    public static int position;

    private ListView lv_home_challenges;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_subscribe, container, false);

        //Ajout des données du challenge dans la vue
        tv_title = root.findViewById(R.id.txt_challenge_title);
        tv_title.setText(Map.maps.get(position).libelle);
        tv_date = root.findViewById(R.id.txt_challenge_date);
        tv_date.setText("Créé le : " + new SimpleDateFormat("dd/MM/yyyy 'à' hh'h'mm").format(Map.maps.get(position).date));
        tv_description = root.findViewById(R.id.txt_challenge_description);
        tv_description.setMovementMethod(new ScrollingMovementMethod());
        tv_description.setText(Map.maps.get(position).description);

        btn_subscribe = root.findViewById(R.id.btn_challenge_subscribe);
        btn_subscribe.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v){
                subscribeToMap(true);
            }
        });
        btn_preview = root.findViewById(R.id.btn_challenge_preview);
        btn_preview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                subscribeToMap(false);
            }
        });

        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) ShowFragment(signin);
        else {
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.getActivity());
        }

        return root;
    }

    /******************************************
     * Méthode utilisé pour afficher la map à laquelle on s'inscrit / on prévisualise
     ******************************************/
    public void subscribeToMap(boolean subscribe){
        Map.mapActuelle = new Map();
        new MapRequest(this.getActivity(), Map.maps.get(position).id, Map.mapActuelle);
        new ImageMapRequest(this.getActivity(), Map.maps.get(position).id, Map.mapActuelle);
        ChallengeFragment.isNotAPreview = subscribe;
        ShowFragment(challenge);
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(int fragment) {
        Navigation.findNavController(this.getActivity(),R.id.nav_host_fragment).navigate(fragment);
    }

}

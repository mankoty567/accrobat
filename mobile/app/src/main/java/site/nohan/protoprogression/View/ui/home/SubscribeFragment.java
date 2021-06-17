package site.nohan.protoprogression.View.ui.home;

import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import java.text.SimpleDateFormat;
import java.util.Date;

import site.nohan.protoprogression.Controller.MainActivity;
import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Model.Types.TypeEvent;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.Challenge.RecordRequest;
import site.nohan.protoprogression.Network.Challenge.SubscribeRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Map.ImageMapRequest;
import site.nohan.protoprogression.Network.Map.MapRequest;
import site.nohan.protoprogression.Network.Participation.RetreiveParticipationRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.challenge.ChallengeFragment;

import static site.nohan.protoprogression.Network.DataBase.resetRecords;

public class SubscribeFragment extends Fragment {
    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int signin = R.id.navigation_signin;;
    private int challenge = R.id.navigation_challenge;

    private Button btn_back;
    private Button btn_subscribe;
    private Button btn_preview;
    private TextView tv_title;
    private TextView tv_date;
    private WebView wvDescription;

    public static int position;
    private int idChallenge;

    private TextView tv_records;
    private ListView lv_records;

    private LinearLayout ll_subscribe;
    private LinearLayout ll_mode_selection;
    private Button btn_pedometer;
    private Button btn_pedometer_run;
    private Button btn_bike;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_subscribe, container, false);

        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) ShowFragment(signin);
        else {
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.getActivity());
        }

        if(HomeFragment.isOnPrivateChallenges) idChallenge = DataBase.getSubscribed().get(position).id;
        else idChallenge = Map.maps.get(position).id;

        //Ajout des données du challenge dans la vue
        tv_title = root.findViewById(R.id.txt_challenge_title);
        tv_date = root.findViewById(R.id.txt_challenge_date);

        // Chargement du text riche en wv
        wvDescription = root.findViewById(R.id.wvDescription);

        String unencodedHtml;

        //Affichage du mode de déplacement
        ll_mode_selection = root.findViewById(R.id.subscribe_mode_selection);
        ll_mode_selection.setVisibility(View.GONE);
        ll_subscribe = root.findViewById(R.id.ll_signin_button);
        ll_subscribe.setVisibility(View.VISIBLE);
        btn_pedometer = root.findViewById(R.id.bPodometreMarche);
        btn_pedometer_run = root.findViewById(R.id.bPodometreCourse);
        btn_bike = root.findViewById(R.id.bGPSVelo);
        btn_pedometer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PedometerController.modeSelected = TypeEvent.MARCHE;
                Map.participationId = DataBase.getSubscribed().get(position).participation;
                subscribeToMap(true);
            }
        });
        btn_pedometer_run.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PedometerController.modeSelected = TypeEvent.COURSE;
                Map.participationId = DataBase.getSubscribed().get(position).participation;
                subscribeToMap(true);
            }
        });
        btn_bike.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PedometerController.modeSelected = TypeEvent.VELO;
                Map.participationId = DataBase.getSubscribed().get(position).participation;
                subscribeToMap(true);
            }
        });

        if(HomeFragment.isOnPrivateChallenges) {
            tv_title.setText(DataBase.getSubscribed().get(position).libelle);
            unencodedHtml = DataBase.getSubscribed().get(position).description ;
            tv_date.setText("Inscrit le : "+DataBase.getSubscribed().get(position).dateInscription);

        } else {
            tv_title.setText(Map.maps.get(position).libelle);
            tv_date.setText("Créé le : " + new SimpleDateFormat("dd/MM/yyyy 'à' hh'h'mm").format(Map.maps.get(position).date));
            unencodedHtml = Map.maps.get(position).description;
            unencodedHtml = "<div style='background-color : #F2E8C7'>" + unencodedHtml + "</div>";
        }


        String encodedHtml = unencodedHtml!=null ? Base64.encodeToString(unencodedHtml.getBytes(),
                Base64.NO_PADDING) : "";

        wvDescription.loadData(encodedHtml, "text/html", "base64");
        wvDescription.setHorizontalScrollBarEnabled(false);
        wvDescription.getSettings().setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);

        //Ajout du bouton back
        btn_back = root.findViewById(R.id.btn_back);
        btn_back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShowFragment(R.id.navigation_home);
            }
        });

        //Ajout des actions pour les boutons d'inscriptions et de prévisualisation
        btn_subscribe = root.findViewById(R.id.btn_challenge_subscribe);
        btn_subscribe.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v){
                if(HomeFragment.isOnPrivateChallenges){
                    // TODO: Charger la participation participationID
                    ll_mode_selection.setVisibility(View.VISIBLE);
                    ll_subscribe.setVisibility(View.GONE);
                }else{
                    subscribeToChallenge();
                }

            }
        });
        btn_preview = root.findViewById(R.id.btn_challenge_preview);
        btn_preview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                subscribeToMap(false);
            }
        });

        if(HomeFragment.isOnPrivateChallenges) {
            btn_preview.setVisibility(View.GONE);
            btn_subscribe.setText("Lancer");
        } else {
            btn_preview.setVisibility(View.VISIBLE);
            btn_subscribe.setText("S'inscrire");
        }

        //Affichage des records du challenge
        tv_records = root.findViewById(R.id.txt_title_records);
        lv_records = root.findViewById(R.id.lv_subscribe_records);
        resetRecords();
        SubscribeListRecordsAdapter subscribeAdapter = new SubscribeListRecordsAdapter(this.getActivity());
        new RecordRequest(this.getActivity(), idChallenge, subscribeAdapter, this);
        lv_records.setAdapter(subscribeAdapter);

        return root;
    }

    /******************************************
     * Méthode utilisé pour lancer une requête d'inscription à un challenge
     ******************************************/
    public void subscribeToChallenge(){
        new SubscribeRequest(this.getActivity(), idChallenge, this);
    }

    /******************************************
     * Méthode utilisé pour rendre invisible le titre Classement
     ******************************************/
    public void hideTitleRecords(int visibility){
        tv_records.setVisibility(visibility);
    }

    /******************************************
     * Méthode utilisé pour afficher la map à laquelle on s'inscrit / on prévisualise
     ******************************************/
    public void subscribeToMap(boolean subscribe){
        /*
        if(Map.findSauvegardeById(idChallenge) == null) {
            Map.mapActuelle = new Map();
            new MapRequest(this.getActivity(), idChallenge, Map.mapActuelle);
        }else{

            Map.mapActuelle = Map.findSauvegardeById(idChallenge);

            new RetreiveParticipationRequest(this.getActivity(), Map.participationId);
        }
        */

        Map.mapActuelle = new Map();
        new MapRequest(this.getActivity(), idChallenge, Map.mapActuelle);
        //
        new ImageMapRequest(this.getActivity(), idChallenge, Map.mapActuelle);
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

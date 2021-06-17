package site.nohan.protoprogression.View.ui.user;

import android.os.Bundle;
import android.os.UserHandle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import java.util.Date;

import site.nohan.protoprogression.Model.User;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.SigninFragment;

import static site.nohan.protoprogression.Network.DataBase.getMoi;
import static site.nohan.protoprogression.Network.DataBase.setMoi;

public class UserFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int signin;

    private TextView tv_pseudo;
    private TextView tv_email;
    private ListView lv_history;
    private UserHistoryChallengeAdapter historyChallengeAdapter;
    private Button btn_disconnect;
    private boolean isHistoryShown = false;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    public View onCreateView(@NonNull LayoutInflater inflater,
            ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_user, container, false);

        signin = R.id.navigation_signin;

        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) ShowFragment(signin);
        else {
            Log.i("TOKEN", getMoi().getToken()+"");
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.getActivity());
        }

        //Affichage des données de l'utilisateur
        tv_pseudo = root.findViewById(R.id.txt_user_pseudo);
        tv_pseudo.setText(getMoi().getUsername()+"");
        tv_email = root.findViewById(R.id.txt_user_email);
        tv_email.setText(getMoi().getEmail());

        //Affichage des challenges déjà terminés
        lv_history = root.findViewById(R.id.lv_user_history);
        historyChallengeAdapter = new UserHistoryChallengeAdapter(this.getActivity());
        lv_history.setAdapter(historyChallengeAdapter);

        //Mise en place du bouton de déconnexion
        btn_disconnect = root.findViewById(R.id.btn_disconnect);
        btn_disconnect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                User moi = getMoi();
                moi.setToken("NULL");
                setMoi(moi);
                ShowFragment(R.id.navigation_home);
            }
        });

        return root;
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(int fragment) {
        Navigation.findNavController(this.getActivity(),R.id.nav_host_fragment).navigate(fragment);
    }
}
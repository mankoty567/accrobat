package site.nohan.protoprogression.View.ui.home;

import android.os.Bundle;
import android.transition.Visibility;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.navigation.Navigation;

import com.google.android.material.bottomnavigation.BottomNavigationMenu;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import site.nohan.protoprogression.Controller.MainActivity;
import site.nohan.protoprogression.Network.Authenticate.Signin.SigninRequest;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

public class SigninFragment extends Fragment{
    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int signup;
    private int home;

    public static boolean hasFrauded = false;

    private TextView txt_inscription;
    private Button btn_connection;
    private EditText et_login;
    private EditText et_password;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_user_signin, container, false);

        signup = R.id.navigation_signup;
        home = R.id.navigation_home;
        MainActivity.setBottomNavigationViewVisibility(4);

        Log.i("FRAUDED",hasFrauded+"");
        if(hasFrauded) root.findViewById(R.id.txt_signin_message).setVisibility(View.VISIBLE);
        else root.findViewById(R.id.txt_signin_message).setVisibility(View.GONE);

        //Initialisation du bouton d'inscritption
        txt_inscription = root.findViewById(R.id.txt_signin_inscription);
        txt_inscription.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShowFragment(signup);
            }
        });

        //Initialisation des boîtes textuelles
        et_login = root.findViewById(R.id.et_signin_login);
        et_password = root.findViewById(R.id.et_signin_password);

        //Initialisation du bouton de connexion
        btn_connection = root.findViewById(R.id.btn_signin_connection);
        btn_connection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendConnection();
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

    /******************************************
     * Méthode utilisé pour lancer une requête de connexion
     ******************************************/
    private void sendConnection(){
        boolean ok = false;
        if(!et_login.getText().toString().isEmpty()&&!et_password.getText().toString().isEmpty()){
            ok = true;
        }
        else{
            Toast.makeText(getContext(),"Veuillez remplir tous les champs !", Toast.LENGTH_LONG).show();
        }

        if(ok){
            //Lancement de la requête de connexion
            new SigninRequest(getActivity(), et_login.getText()+"", et_password.getText()+"",this);
        }
    }
}

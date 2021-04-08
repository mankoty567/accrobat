package site.nohan.protoprogression.View.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import site.nohan.protoprogression.Network.Authenticate.Signin.SigninRequest;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

public class SigninFragment extends Fragment{
    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private Fragment signup;
    private Fragment home;

    private Button btn_inscription;
    private Button btn_connection;
    private EditText et_login;
    private EditText et_password;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        signup = SignupFragment.newInstance();
        home = HomeFragment.newInstance();
    }

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_user_signin, container, false);

        //Initialisation du bouton d'inscritption
        btn_inscription = root.findViewById(R.id.btn_signin_inscription);
        btn_inscription.setOnClickListener(new View.OnClickListener() {
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
     * Méthode utilisé pour créer l'instance HomeFragment
     ******************************************/
    public static SigninFragment newInstance() {
        SigninFragment fragment = new SigninFragment();
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

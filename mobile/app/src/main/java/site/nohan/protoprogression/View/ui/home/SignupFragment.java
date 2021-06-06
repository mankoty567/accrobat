package site.nohan.protoprogression.View.ui.home;


import android.os.Bundle;

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

import site.nohan.protoprogression.Network.Authenticate.Signup.SignupRequest;
import site.nohan.protoprogression.R;

public class SignupFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private int signin;

    private TextView txt_signup_back_to_connection;
    private Button btn_send_inscription;
    private EditText et_login;
    private EditText et_password;
    private EditText et_confirm_password;
    private EditText et_email;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_user_signup, container, false);

        signin = R.id.navigation_signin;

        //Initialisation du bouton de retour à la connexion
        txt_signup_back_to_connection = root.findViewById(R.id.txt_signup_back_to_connection);
        txt_signup_back_to_connection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShowFragment(signin);
            }
        });

        //Initialisation des boîtes textuelles
        et_login = root.findViewById(R.id.et_signup_login);
        et_password = root.findViewById(R.id.et_signup_password);
        et_confirm_password = root.findViewById(R.id.et_signup_password_confirmation);
        et_email = root.findViewById(R.id.et_signup_mail);

        //Initialisation du bouton d'inscription
        btn_send_inscription = root.findViewById(R.id.btn_signup_send_inscription);
        btn_send_inscription.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendInscription();
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
     * Méthode utilisé pour lancer une requête d'inscription
     ******************************************/
    private void sendInscription(){
        boolean ok = false;
        if(!et_login.getText().toString().isEmpty()&&!et_password.getText().toString().isEmpty()&&
                !et_confirm_password.getText().toString().isEmpty()&&!et_email.getText().toString().isEmpty()){
            ok = true;
        }
        else{
            Toast.makeText(getContext(),"Veuillez remplir tous les champs !", Toast.LENGTH_LONG).show();
        }
        if(!et_password.getText().toString().equals(et_confirm_password.getText().toString())){
            ok = false;
            Toast.makeText(getContext(),"Les mots de passe ne correspondent pas !",Toast.LENGTH_LONG).show();
        }

        if(ok){
            //Lancement de la requête d'inscription
            new SignupRequest(getActivity(), et_login.getText()+"", et_password.getText()+"", et_email.getText()+"",this);
        }
    }
}

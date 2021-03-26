package site.nohan.protoprogression.View.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import site.nohan.protoprogression.R;

public class HomeFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private Fragment signup;
    private Button inscription;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        signup = SignupFragment.newInstance();
    }

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_user_signin, container, false);

        //Initialisation du bouton d'inscritption
        inscription = root.findViewById(R.id.btn_val_inscription);
        inscription.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShowSignupFragment();
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
     * Méthode utilisé pour afficher le fragment Signup dans le framelayout
     ******************************************/
    public void ShowSignupFragment() {
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.nav_host_fragment, signup);
        transaction.addToBackStack(null);
        transaction.commit();
    }
}
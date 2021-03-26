package site.nohan.protoprogression.View.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import site.nohan.protoprogression.R;

public class SignupFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private Fragment signin;
    private Button backToConnection;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        signin = HomeFragment.newInstance();
    }

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_user_signup, container, false);

        //Initialisation du bouton d'inscritption
        backToConnection = root.findViewById(R.id.btn_val_back_to_connection);
        backToConnection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShowHomeFragment();
            }
        });

        return root;
    }

    /******************************************
     * Méthode utilisé pour créer l'instance SignupFragment
     ******************************************/
    public static SignupFragment newInstance() {
        SignupFragment fragment = new SignupFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment Home dans le framelayout
     ******************************************/
    public void ShowHomeFragment() {
        FragmentTransaction transaction = getFragmentManager().beginTransaction();
        transaction.replace(R.id.nav_host_fragment, signin);
        transaction.addToBackStack(null);
        transaction.commit();
    }
}

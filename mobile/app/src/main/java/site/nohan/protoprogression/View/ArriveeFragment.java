package site.nohan.protoprogression.View;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.HomeListChallengesAdapter;

public class ArriveeFragment extends Fragment {

    /************************************************************************
     * Création des variables globales
     ************************************************************************/
    private Button btn_continue;

    /************************************************************************
     * Création de la class et de la vue
     ************************************************************************/
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_arrivee, container, false);

        btn_continue = root.findViewById(R.id.btn_continue);
        btn_continue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ShowFragment(R.id.navigation_home);
            }
        });

        return root;

    }


    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(int fragment) {
        Navigation.findNavController(this.getActivity(), R.id.nav_host_fragment).navigate(fragment);
    }
}

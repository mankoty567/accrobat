package site.nohan.protoprogression.View;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.SeekBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import site.nohan.protoprogression.Controller.ButtonController;
import site.nohan.protoprogression.Controller.Pedometer.PedometerController;
import site.nohan.protoprogression.Controller.SeekBarController;
import site.nohan.protoprogression.Controller.ToileController;
import site.nohan.protoprogression.Controller.ZoomBarController;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

public class MapFragment extends Fragment {

    public Toile toile;

    SeekBar seekBar;
    SeekBar zoomBar;
    Button bRecentrer;
    Button bVelo;
    Button bMarche;
    Button bCourse;
    Button bAddPrev;
    Button bAddCurrent;
    SeekBarController seekBarController;
    ButtonController buttonController;
    ZoomBarController zoomBarController;


    public MapFragment() {
        super();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        toile = new Toile(this.getContext());
        toile.setOnTouchListener(new ToileController(toile));

        if(DataBase.pedometerController == null) DataBase.pedometerController = new PedometerController(this.getActivity(),this);

        seekBarController = new SeekBarController(this);
        buttonController = new ButtonController(this);
        seekBarController.setButtonController(buttonController);
        zoomBarController = new ZoomBarController(toile);

        return toile;
    }

    @Override
    public void onResume() {
        super.onResume();
        seekBar = getActivity().findViewById(R.id.seekBar);
        seekBar.setOnSeekBarChangeListener(seekBarController);
        bRecentrer = getActivity().findViewById(R.id.bRecentrer);
        bRecentrer.setOnClickListener(buttonController);
        zoomBar = getActivity().findViewById(R.id.zoombar);
        zoomBar.setOnSeekBarChangeListener(zoomBarController);

        //Affichage du mode sélectionné
        ImageView img_mode_selected = getActivity().findViewById(R.id.img_mode_selected);
        switch (DataBase.pedometerModeSelected){
            case 0:
                img_mode_selected.setBackgroundResource(R.drawable.walking_green);
                break;
            case 1:
                img_mode_selected.setBackgroundResource(R.drawable.running_green);
                break;
            case 2:
                img_mode_selected.setBackgroundResource(R.drawable.cycling_green);
                break;
        }
        /*
        bAddPrev = getActivity().findViewById(R.id.bAddPrev);
        bAddPrev.setOnClickListener(buttonController);
        bAddCurrent = getActivity().findViewById(R.id.bAddCurrent);
        bAddCurrent.setOnClickListener(buttonController);

         */
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(int fragment) {
        Navigation.findNavController(this.getActivity(),R.id.nav_host_fragment).navigate(fragment);
    }
}

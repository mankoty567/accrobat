package site.nohan.protoprogression.View;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.SeekBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import site.nohan.protoprogression.Controller.ButtonController;
import site.nohan.protoprogression.Controller.SeekBarController;
import site.nohan.protoprogression.Controller.ToileController;
import site.nohan.protoprogression.Controller.ZoomBarController;
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
        bVelo = getActivity().findViewById(R.id.bGPSVelo);
        bVelo.setOnClickListener(buttonController);
        bMarche = getActivity().findViewById(R.id.bPodometreMarche);
        bMarche.setOnClickListener(buttonController);
        bCourse = getActivity().findViewById(R.id.bPodometreCourse);
        bCourse.setOnClickListener(buttonController);
        zoomBar = getActivity().findViewById(R.id.zoombar);
        zoomBar.setOnSeekBarChangeListener(zoomBarController);
        /*
        bAddPrev = getActivity().findViewById(R.id.bAddPrev);
        bAddPrev.setOnClickListener(buttonController);
        bAddCurrent = getActivity().findViewById(R.id.bAddCurrent);
        bAddCurrent.setOnClickListener(buttonController);

         */
    }
}

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
import site.nohan.protoprogression.R;

public class MapFragment extends Fragment {

    Toile toile;

    SeekBar seekBar;
    Button bPodometre;
    Button bVelo;
    Button bEtape;
    Button bAddPrev;
    Button bAddCurrent;
    SeekBarController seekBarController;
    ButtonController buttonController;

    public MapFragment() {
        super();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        toile = new Toile(this.getContext());
        seekBarController = new SeekBarController();
        buttonController = new ButtonController(this.getActivity());
        return toile;
    }

    @Override
    public void onResume() {
        super.onResume();
        seekBar = getActivity().findViewById(R.id.seekBar);
        seekBar.setOnSeekBarChangeListener(seekBarController);
        bPodometre = getActivity().findViewById(R.id.bEffacer);
        bPodometre.setOnClickListener(buttonController);
        bVelo = getActivity().findViewById(R.id.bModePodometre);
        bVelo.setOnClickListener(buttonController);
        bEtape = getActivity().findViewById(R.id.bPodometre);
        bEtape.setOnClickListener(buttonController);
        bAddPrev = getActivity().findViewById(R.id.bAddPrev);
        bAddPrev.setOnClickListener(buttonController);
        bAddCurrent = getActivity().findViewById(R.id.bAddCurrent);
        bAddCurrent.setOnClickListener(buttonController);
    }
}

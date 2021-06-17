package site.nohan.protoprogression.View;

import android.net.UrlQuerySanitizer;
import android.os.Bundle;
import android.util.Log;
import android.util.proto.ProtoOutputStream;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Adapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
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
import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.R;

public class MapFragment extends Fragment {

    public Toile toile;

    SeekBar seekBar;
    SeekBar zoomBar;
    Button bRecentrer;
    SeekBarController seekBarController;
    ButtonController buttonController;
    ZoomBarController zoomBarController;
    Button btn_history;
    LinearLayout ll_history_events;
    ListView lv_history_events;
    MapHistoryAdapter mapHistoryAdapter;
    public static Boolean historyON = false;


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

        mapHistoryAdapter = new MapHistoryAdapter(this.getActivity());

        return toile;
    }

    @Override
    public void onResume() {
        super.onResume();
        seekBar = getActivity().findViewById(R.id.seekBar);
        seekBar.setOnSeekBarChangeListener(seekBarController);
        PedometerController.sbProgression = seekBar;
        bRecentrer = getActivity().findViewById(R.id.bRecentrer);
        bRecentrer.setOnClickListener(buttonController);
        zoomBar = getActivity().findViewById(R.id.zoombar);
        zoomBar.setOnSeekBarChangeListener(zoomBarController);
        btn_history = getActivity().findViewById(R.id.btn_history);
        btn_history.setOnClickListener(buttonController);
        ll_history_events = getActivity().findViewById(R.id.ll_history_events);
        lv_history_events = getActivity().findViewById(R.id.lv_history_events);
        lv_history_events.setAdapter(mapHistoryAdapter);


        //Affichage du mode sélectionné
        ImageView img_mode_selected = getActivity().findViewById(R.id.img_mode_selected);
        switch (PedometerController.modeSelected){
            case MARCHE:
                img_mode_selected.setBackgroundResource(R.drawable.walking_green);
                break;
            case COURSE:
                img_mode_selected.setBackgroundResource(R.drawable.running_green);
                break;
            case VELO:
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
     * Méthode utilisé pour afficher la liste de l'historique des events
     ******************************************/
    public void updateHistory(){
        Log.e("LIST",DataBase.getEventsOf(Map.participationId).size()+"");
        if(historyON){
            mapHistoryAdapter.notifyDataSetChanged();
            ll_history_events.setVisibility(View.VISIBLE);
        } else {
            ll_history_events.setVisibility(View.GONE);
        }
    }

    /******************************************
     * Méthode utilisé pour afficher le fragment @param fragment dans le framelayout
     ******************************************/
    public void ShowFragment(int fragment) {
        Navigation.findNavController(this.getActivity(),R.id.nav_host_fragment).navigate(fragment);
    }
}

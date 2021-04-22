package site.nohan.protoprogression.Controller.ui;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageView;

import java.io.InputStream;
import java.util.Date;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Map.ImageMapRequest;
import site.nohan.protoprogression.Network.Map.MapRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.HomeFragment;

public class MapsAdaptaterListenner implements AdapterView.OnItemClickListener{
    HomeFragment homeFragment;

    public MapsAdaptaterListenner(HomeFragment homeFragment){
        this.homeFragment = homeFragment;
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) homeFragment.ShowFragment(R.id.navigation_signin);
        else {
            Log.e("charg", "Chargement des maps");
            Map.mapActuelle = new Map();
            new MapRequest(this.homeFragment.getActivity(), Map.maps.get(position).id, Map.mapActuelle);
            new ImageMapRequest(this.homeFragment.getActivity(), Map.maps.get(position).id, Map.mapActuelle);
            homeFragment.ShowFragment(R.id.navigation_challenge);
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.homeFragment.getActivity());
        }

    }
}

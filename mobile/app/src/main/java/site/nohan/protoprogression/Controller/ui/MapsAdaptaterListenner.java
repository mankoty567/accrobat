package site.nohan.protoprogression.Controller.ui;

import android.util.Base64;
import android.view.View;
import android.webkit.WebView;
import android.widget.AdapterView;

import java.util.Date;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.Authenticate.WhoAmI.WhoAmIRequest;
import site.nohan.protoprogression.Network.DataBase;
import site.nohan.protoprogression.Network.Map.ImageMapRequest;
import site.nohan.protoprogression.Network.Map.MapRequest;
import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.ui.home.HomeFragment;
import site.nohan.protoprogression.View.ui.home.SubscribeFragment;

public class MapsAdaptaterListenner implements AdapterView.OnItemClickListener{
    HomeFragment homeFragment;
    WebView webView;

    public MapsAdaptaterListenner(HomeFragment homeFragment){
        this.homeFragment = homeFragment;
    }

    //Devnir le Onclick des boutons PREVIEW ET INSCRIPTION
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        //Vérification que l'utilisateur est connecté
        if(!DataBase.isTokenValid()) homeFragment.ShowFragment(R.id.navigation_signin);
        else {
            //Log.e("charg", "Chargement des maps");
            SubscribeFragment.position = position;
            homeFragment.ShowFragment(R.id.navigation_subscribe);
            if(!DataBase.isTokenDateValid(new Date())) new WhoAmIRequest(this.homeFragment.getActivity());
        }

    }
}

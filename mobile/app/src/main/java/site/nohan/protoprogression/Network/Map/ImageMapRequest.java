package site.nohan.protoprogression.Network.Map;

import android.app.Activity;
import android.graphics.Bitmap;
import android.widget.ImageView;

import com.android.volley.toolbox.ImageRequest;

import site.nohan.protoprogression.Model.Map;
import site.nohan.protoprogression.Network.APIRequestGET;

public class ImageMapRequest extends ImageRequest {
    public ImageMapRequest(Activity activity, int mapId, Map map) {
        super(
                APIRequestGET.APIURL+"challenge/"+mapId+"/image",
                new ImageMapResponse(activity, map),
                0,
                0,
                ImageView.ScaleType.CENTER_CROP,
                Bitmap.Config.RGB_565,
                new ImageMapResponse(activity, map)
        );
        APIRequestGET.queue.add(this);
        APIRequestGET.queue.start();
    }
}

package site.nohan.protoprogression.Controller;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import site.nohan.protoprogression.R;
import site.nohan.protoprogression.View.Toile;


public class MainActivity extends AppCompatActivity {


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.progression);
    }

    @Override
    protected void onResume() {
        super.onResume();
    }


}

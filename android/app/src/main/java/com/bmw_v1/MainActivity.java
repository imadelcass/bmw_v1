package com.bmw_v1;
import android.content.Intent;
import android.content.res.Configuration;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
    @Override
   public void onConfigurationChanged(Configuration newConfig) {
       super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
       this.sendBroadcast(intent);
   }
  protected String getMainComponentName() {
    return "bmw_v1";
  }
}

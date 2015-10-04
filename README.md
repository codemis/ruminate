Ruminate
--------

Android & iOS App for mulling over Scripture.  Dig deeper into the Bible by ruminating on a piece of Scripture throughout the day.

Push Notification Gotcha's
--------------------------

Android
=======

1. Create the a MainApplication.java file in `platforms/android/src/com/johnathanpulos/ruminate`

```
package com.johnathanpulos.ruminate;

import android.app.Application;
import org.apache.cordova.*;
import org.apache.cordova.core.ParsePlugin;

public class MainApplication extends Application {
 
    @Override
    public void onCreate() {
        super.onCreate();
        ParsePlugin.initializeParseWithApplication(this);
    }
}

```
2. Download the Android Parse SDK,  Unzip, and move the bolts.android file into `platforms/android/libs/`
3. In the Android manifest file,  add a `android:name="MainApplication"` to the application tag, and make sure the activity `android:name="CordovaApp"` is set in the activity tag.

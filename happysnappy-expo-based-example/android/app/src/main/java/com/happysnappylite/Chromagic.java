package com.happysnappylite;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ColorSpace;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;

public class Chromagic extends ReactContextBaseJavaModule {
    static {
        System.loadLibrary("ChromaKey");
    }
    public native void chroma(int width, int height, ByteBuffer rawData);

    public Chromagic(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Chromagic";
    }

    @ReactMethod
    public void chromaTheImage(String imageURI, ReadableMap options, Promise promise) {
        if (imageURI.contains("file:///")) {
            imageURI = imageURI.replace("file:///", "/");
        }

        // Load the image that wants to be chroma-fied
        Bitmap imageBitmap = BitmapFactory.decodeFile(imageURI);
        int width = imageBitmap.getWidth();
        int height = imageBitmap.getHeight();
        int bytesPerPixel = 4;
        int bytesPerRow = bytesPerPixel * width;
        ByteBuffer rawData = ByteBuffer.allocate(height * width * 4);

        imageBitmap.copyPixelsToBuffer(rawData);

        // Actually chroma the image
        this.chroma(width, height, rawData);

        // Write the data buffer to a byte array
        byte[] bytes = rawData.array();

        // Create the new image
        final Bitmap bmp = BitmapFactory.decodeByteArray(bytes,0, bytes.length);

        // Update the filename to include timestamp for uniqueness and new extension as PNG
        CharSequence oldExtension = ".jpg";
        Long tsLong = System.currentTimeMillis() / 1000;
        String ts = tsLong.toString();
        CharSequence newExtension = String.format("-%s%s", ts, ".png");
        String fileName = imageURI.replace(oldExtension, newExtension);

        // Actually output the new file and resolve or reject the promise for React Native Bridge
        try (FileOutputStream out = new FileOutputStream(fileName)) {
            // PNG is a lossless format, the compression factor (100) is ignored
            bmp.compress(Bitmap.CompressFormat.PNG, 100, out);
            promise.resolve(imageURI);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }
}

<h1>Squash Compressor</h1>
<h2>
  About
</h2>
The Squash Compressor is a real-time audio compression software that can act as both a standalone application and as a VST3 plugin. This is intended as a companion plugin to the <a href="https://github.com/Logan-Cannady/CS598-Senior-Design-Project-Audio-Processing-">lullo-fi</a> plugin, but can also be used on its own. As a VST3 plugin, Squash Compressor is able to be utilized within digital audio workstations that support VST3 including Ableton Live, FL Studio, Cubase, and more.

![Screenshot 2025-04-20 232318](https://github.com/user-attachments/assets/e4c57ee1-7196-4dfc-bf18-2afaea5d99c6)

<h2>
  Features
</h2>
Squash Compressor allows users to control essential parameters related to audio compression including the following:
<ul>
  <li>
    Attack
    <ul>
      <li>
         Controls the amount of time it takes for the compressor to start to compress the audio.
      </li>
    </ul>
  </li>
  <li>
    Release
    <ul>
        <li>
            Controls the amount of time it takes for the compressor to stop compressing the audio after being compressed.
        </li>
    </ul>
  </li>
  <li>
    Ratio
    <ul>
        <li>
            Controls the ratio or amount that the audio is compressed. A higher ratio results in more heavily compressed audio.
        </li>
    </ul>
  </li>
  <li>
    Threshold
    <ul>
        <li>
           Sets a decibel level relative to the incoming audio, where any audio above that value is compressed.
        </li>
    </ul>
  </li>
  <li>
    Gain
    <ul>
      <li>
         Controls the makeup gain or "loudness" after the compression.
      </li>
    </ul>
  </li>
  <li>
    Dry/Wet Mixing
    <ul>
      <li>
          Controls the mix of the processed audio signal with orignal pre-processed audio. 100% "wet" means that the effects are fully being applied.
      </li>
    </ul>
  </li>
</ul>
The processed audio is visualized utilizing two 3D meshes. The "ring" represents the raw unprocessed audio, while the inner low polygon object represents the processed, compressed audio. This visualization makes it easy to quickly see how much the audio has been compressed. 

<h2>
  Project Structure
</h2>

This project is built utilizing the C++ framework <a href="https://juce.com/">JUCE</a> and the framework's ability to render web components in the native application window. These web components consist of a web application built on React with TypeScript and React Three Fiber to render responsive 3D models within the application. The JUCE project is built and compiled using CMAKE and the React files are built and compiled by Vite. These compiled files are served to JUCE and displayed in the native output window (for both the standalone application and the VST3 plugin window).
<br/>
<br/>
The main JUCE logic and implementation is contained within the PluginEditor and PluginProcessor cpp files, along with their corresponding header files. The PluginProcessor file handles preparing the digital signal chain for processing the audio and processing blocks of audio data. The PluginEditor file deals with configuring the rendered window and the components that exist within it. Since this project utilizes JUCE WebViews, the configuration to communicate between the web components and the JUCE backend are also in this file.
<br/>
<br/>
The user interface was developed utilizing React and leveraging the Mantine component library. This library provided UI components and hooks that were essential for creating the functionality 

<h2>
  Download
</h2>

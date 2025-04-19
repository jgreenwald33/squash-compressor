#pragma once

#include "SquashCompressorPlugin/PluginProcessor.h"
#include <juce_gui_extra/juce_gui_extra.h>

namespace webview_plugin {
    class AudioPluginAudioProcessorEditor final : public juce::AudioProcessorEditor, private juce::Timer
    {
    public:
        AudioPluginAudioProcessor& audioProcessor;
        explicit AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor&);
        ~AudioPluginAudioProcessorEditor() override;
    
        //==============================================================================
        void resized() override;

        // will be used to incrementally send events to the browser
        void timerCallback() override;
    
    private:
    using Resource = juce::WebBrowserComponent::Resource;
    std::optional<Resource> getResource(const juce::String& url);
    
    void nativeFunction(const juce::Array<juce::var>& args, 
        juce::WebBrowserComponent::NativeFunctionCompletion completion);

        // This reference is provided as a quick way for your editor to
        // access the processor object that created it.
        AudioPluginAudioProcessor& processorRef;
        
        // this component will not be used in the final design and is just used to verify the connection of the backend and front end
        juce::TextButton runJavascriptButton{"Run some JavaScript"};
        juce::TextButton emitJavascriptEventButton{"Emit JavaScript event"};
        juce::Label labelUpdatedFromJavaScript{"label", "To be updated from JavaScript"};
        juce::WebBrowserComponent webView;

        JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (AudioPluginAudioProcessorEditor)
    };
}


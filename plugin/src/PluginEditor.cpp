#include "SquashCompressorPlugin/PluginProcessor.h"
#include "SquashCompressorPlugin/PluginEditor.h"

namespace webview_plugin {
AudioPluginAudioProcessorEditor::AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor& p)
    : AudioProcessorEditor (&p), processorRef (p),
    webView{juce::WebBrowserComponent::Options{}.withBackend(juce::WebBrowserComponent::Options::Backend::webview2)}
{
    juce::ignoreUnused (processorRef);
    addAndMakeVisible(webView);

    auto screenSize = juce::Desktop::getInstance().getDisplays().getPrimaryDisplay();
    int width = screenSize->userArea.getWidth() / 2;
    int height = screenSize->userArea.getHeight() / 2;
    setResizable(true,true);

    // temporary rendering of preexisting site
    webView.goToURL("https://google.com");

    setSize (width, height);
}

AudioPluginAudioProcessorEditor::~AudioPluginAudioProcessorEditor()
{
}


void AudioPluginAudioProcessorEditor::resized()
{
    webView.setBounds(getLocalBounds());
}
}
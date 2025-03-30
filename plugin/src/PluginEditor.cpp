#include "SquashCompressorPlugin/PluginProcessor.h"
#include "SquashCompressorPlugin/PluginEditor.h"

namespace webview_plugin {
AudioPluginAudioProcessorEditor::AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor& p)
    : AudioProcessorEditor (&p), processorRef (p),
    webView{juce::WebBrowserComponent::Options{}.withBackend(juce::WebBrowserComponent::Options::Backend::webview2)
    .withWinWebView2Options(juce::WebBrowserComponent::Options::WinWebView2{}.withUserDataFolder
    (juce::File::getSpecialLocation(juce::File::tempDirectory)))}
{
    juce::ignoreUnused (processorRef);
    addAndMakeVisible(webView);

    auto screenSize = juce::Desktop::getInstance().getDisplays().getPrimaryDisplay();
    int width = screenSize->userArea.getWidth() / 2;
    int height = screenSize->userArea.getHeight() / 2;
    setResizable(true,true);

    // temporary rendering of preexisting site
    webView.goToURL("http://localhost:5173/");

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
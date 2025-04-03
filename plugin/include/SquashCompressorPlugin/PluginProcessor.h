#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_dsp/juce_dsp.h>

struct ChainSettings {
    float attack {0.0f};
    float release {0.0f};
    float ratio {1.0f};
    float threshold{0.0f};
    float makeupGain{0.0f};
    float dryWetPercentage{1.0f};
};

enum ChainOrder {
    COMPRESSOR,
    GAIN
};

namespace webview_plugin {
    class AudioPluginAudioProcessor final : public juce::AudioProcessor
    {
    public:
        //==============================================================================
        AudioPluginAudioProcessor();
        ~AudioPluginAudioProcessor() override;
    
        //==============================================================================
        void prepareToPlay (double sampleRate, int samplesPerBlock) override;
        void releaseResources() override;
    
        bool isBusesLayoutSupported (const BusesLayout& layouts) const override;
    
        void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;
        using AudioProcessor::processBlock;
    
        //==============================================================================
        juce::AudioProcessorEditor* createEditor() override;
        bool hasEditor() const override;
    
        //==============================================================================
        const juce::String getName() const override;
    
        bool acceptsMidi() const override;
        bool producesMidi() const override;
        bool isMidiEffect() const override;
        double getTailLengthSeconds() const override;
    
        //==============================================================================
        int getNumPrograms() override;
        int getCurrentProgram() override;
        void setCurrentProgram (int index) override;
        const juce::String getProgramName (int index) override;
        void changeProgramName (int index, const juce::String& newName) override;
    
        //==============================================================================
        void getStateInformation (juce::MemoryBlock& destData) override;
        void setStateInformation (const void* data, int sizeInBytes) override;

        static juce::AudioProcessorValueTreeState::ParameterLayout createParamLayout();
        juce::AudioProcessorValueTreeState processorTree{ *this, nullptr, "Parameters", createParamLayout() };
        ChainSettings GetChainSettings(juce::AudioProcessorValueTreeState& treeState);
    
    private:
        //==============================================================================
        JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (AudioPluginAudioProcessor)
        using Gain = juce::dsp::Gain<float>;
        using DryWet = juce::dsp::DryWetMixer<float>;
        using Compressor = juce::dsp::Compressor<float>;
        using Mono = juce::dsp::ProcessorChain<Compressor,Gain>;

        Mono leftChannel, rightChannel;
        DryWet dryWetMixer;
        juce::AudioBuffer<float> drySignal;
    };
}


#include "SquashCompressorPlugin/PluginProcessor.h"
#include "SquashCompressorPlugin/PluginEditor.h"

namespace webview_plugin {
    AudioPluginAudioProcessor::AudioPluginAudioProcessor()
        : AudioProcessor (BusesProperties()
                        #if ! JucePlugin_IsMidiEffect
                        #if ! JucePlugin_IsSynth
                        .withInput  ("Input",  juce::AudioChannelSet::stereo(), true)
                        #endif
                        .withOutput ("Output", juce::AudioChannelSet::stereo(), true)
                        #endif
                        )
    {
    }

    AudioPluginAudioProcessor::~AudioPluginAudioProcessor()
    {
    }

    //==============================================================================
    const juce::String AudioPluginAudioProcessor::getName() const
    {
        return JucePlugin_Name;
    }

    bool AudioPluginAudioProcessor::acceptsMidi() const
    {
    #if JucePlugin_WantsMidiInput
        return true;
    #else
        return false;
    #endif
    }

    bool AudioPluginAudioProcessor::producesMidi() const
    {
    #if JucePlugin_ProducesMidiOutput
        return true;
    #else
        return false;
    #endif
    }

    bool AudioPluginAudioProcessor::isMidiEffect() const
    {
    #if JucePlugin_IsMidiEffect
        return true;
    #else
        return false;
    #endif
    }

    double AudioPluginAudioProcessor::getTailLengthSeconds() const
    {
        return 0.0;
    }

    int AudioPluginAudioProcessor::getNumPrograms()
    {
        return 1;   // NB: some hosts don't cope very well if you tell them there are 0 programs,
                    // so this should be at least 1, even if you're not really implementing programs.
    }

    int AudioPluginAudioProcessor::getCurrentProgram()
    {
        return 0;
    }

    void AudioPluginAudioProcessor::setCurrentProgram (int index)
    {
        juce::ignoreUnused (index);
    }

    const juce::String AudioPluginAudioProcessor::getProgramName (int index)
    {
        juce::ignoreUnused (index);
        return {};
    }

    void AudioPluginAudioProcessor::changeProgramName (int index, const juce::String& newName)
    {
        juce::ignoreUnused (index, newName);
    }

    //==============================================================================
    void AudioPluginAudioProcessor::prepareToPlay (double sampleRate, int samplesPerBlock)
    {
        juce::dsp::ProcessSpec spec;
        spec.maximumBlockSize = samplesPerBlock;
        spec.numChannels = 1;
        spec.sampleRate = sampleRate;

        juce::dsp::ProcessSpec dryWetSpec;
        dryWetSpec.maximumBlockSize = samplesPerBlock;
        dryWetSpec.numChannels = juce::jmax(getTotalNumInputChannels(), getTotalNumOutputChannels());
        dryWetSpec.sampleRate = sampleRate;

        rightChannel.prepare(spec);
        leftChannel.prepare(spec);

        auto chainSettings = GetChainSettings(processorTree);

        leftChannel.get<COMPRESSOR>().setAttack(chainSettings.attack);
        leftChannel.get<COMPRESSOR>().setRelease(chainSettings.release);
        leftChannel.get<COMPRESSOR>().setRatio(chainSettings.ratio);
        leftChannel.get<COMPRESSOR>().setThreshold(chainSettings.threshold);

        leftChannel.get<GAIN>().setGainDecibels(chainSettings.makeupGain);

        rightChannel.get<COMPRESSOR>().setAttack(chainSettings.attack);
        rightChannel.get<COMPRESSOR>().setRelease(chainSettings.release);
        rightChannel.get<COMPRESSOR>().setRatio(chainSettings.ratio);
        rightChannel.get<COMPRESSOR>().setThreshold(chainSettings.threshold);

        rightChannel.get<GAIN>().setGainDecibels(chainSettings.makeupGain);

        dryWetMixer.setWetMixProportion(chainSettings.dryWetPercentage); 
        dryWetMixer.prepare(dryWetSpec);
    }

    void AudioPluginAudioProcessor::releaseResources()
    {
        // When playback stops, you can use this as an opportunity to free up any
        // spare memory, etc.
    }

    bool AudioPluginAudioProcessor::isBusesLayoutSupported (const BusesLayout& layouts) const
    {
    #if JucePlugin_IsMidiEffect
        juce::ignoreUnused (layouts);
        return true;
    #else
        // This is the place where you check if the layout is supported.
        // In this template code we only support mono or stereo.
        // Some plugin hosts, such as certain GarageBand versions, will only
        // load plugins that support stereo bus layouts.
        if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::mono()
        && layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
            return false;

        // This checks if the input layout matches the output layout
    #if ! JucePlugin_IsSynth
        if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
            return false;
    #endif

        return true;
    #endif
    }

    void AudioPluginAudioProcessor::processBlock (juce::AudioBuffer<float>& buffer,
                                                juce::MidiBuffer& midiMessages)
    {
        juce::ScopedNoDenormals noDenormals;
        auto totalNumInputChannels  = getTotalNumInputChannels();
        auto totalNumOutputChannels = getTotalNumOutputChannels();

        for (auto i = totalNumInputChannels; i < totalNumOutputChannels; ++i)
            buffer.clear (i, 0, buffer.getNumSamples());
        
        juce::dsp::AudioBlock<float> block(buffer);
        drySignal.makeCopyOf(buffer);

        float preMaxLevel = 0.0f;

        for (int ch = 0; ch < drySignal.getNumChannels(); ++ch)
        {
            const float* channelData = drySignal.getReadPointer(ch);
            for (int i = 0; i < drySignal.getNumSamples(); ++i)
            {
                float absSample = std::abs(channelData[i]);
                if (absSample > preMaxLevel)
                    preMaxLevel = absSample;
            }
        }

        // Store the preprocessed peak level
        preprocessedAmplitudeData.store(preMaxLevel);

        juce::dsp::AudioBlock<const float> dryBlock(drySignal);
        dryWetMixer.pushDrySamples(dryBlock);

        auto chainSettings = GetChainSettings(processorTree);

        leftChannel.get<COMPRESSOR>().setAttack(chainSettings.attack);
        leftChannel.get<COMPRESSOR>().setRelease(chainSettings.release);
        leftChannel.get<COMPRESSOR>().setRatio(chainSettings.ratio);
        leftChannel.get<COMPRESSOR>().setThreshold(chainSettings.threshold);

        leftChannel.get<GAIN>().setGainDecibels(chainSettings.makeupGain);

        rightChannel.get<COMPRESSOR>().setAttack(chainSettings.attack);
        rightChannel.get<COMPRESSOR>().setRelease(chainSettings.release);
        rightChannel.get<COMPRESSOR>().setRatio(chainSettings.ratio);
        rightChannel.get<COMPRESSOR>().setThreshold(chainSettings.threshold);

        rightChannel.get<GAIN>().setGainDecibels(chainSettings.makeupGain);
        
        dryWetMixer.setWetMixProportion(chainSettings.dryWetPercentage);
        for (int channel = 0; channel < totalNumInputChannels; ++channel)
        {
            auto channelBlock = block.getSingleChannelBlock(channel);
            juce::dsp::ProcessContextReplacing<float> context(channelBlock);
            if (channel == 0) {
                leftChannel.process(context);
            }
    
            else if (channel == 1) {
                rightChannel.process(context);
            }
    
        }
    
        // Mix wet/dry signals and update visualizer
        dryWetMixer.mixWetSamples(block);

        // output right here
        // Measure peak output level after processing
        float maxLevel = 0.0f;

        for (int ch = 0; ch < buffer.getNumChannels(); ++ch)
        {
            const float* channelData = buffer.getReadPointer(ch);
            for (int i = 0; i < buffer.getNumSamples(); ++i)
            {
                float absSample = std::abs(channelData[i]);
                if (absSample > maxLevel)
                    maxLevel = absSample;
            }
        }

        amplitudeData.store(maxLevel);
    }

    //==============================================================================
    bool AudioPluginAudioProcessor::hasEditor() const
    {
        return true; // (change this to false if you choose to not supply an editor)
    }

    juce::AudioProcessorEditor* AudioPluginAudioProcessor::createEditor()
    {
        // remove and replace with generic editor for effect debugging
        // return new juce::GenericAudioProcessorEditor(*this);
        return new AudioPluginAudioProcessorEditor (*this);
    }

    //==============================================================================
    void AudioPluginAudioProcessor::getStateInformation (juce::MemoryBlock& destData)
    {
        // You should use this method to store your parameters in the memory block.
        // You could do that either as raw data, or use the XML or ValueTree classes
        // as intermediaries to make it easy to save and load complex data.
        juce::ignoreUnused (destData);
    }


    void AudioPluginAudioProcessor::setStateInformation (const void* data, int sizeInBytes)
    {
        // You should use this method to restore your parameters from this memory block,
        // whose contents will have been created by the getStateInformation() call.
        juce::ignoreUnused (data, sizeInBytes);
    }
    // get values held within the ValueStateTree
    ChainSettings AudioPluginAudioProcessor::GetChainSettings(juce::AudioProcessorValueTreeState& treeState) {
        ChainSettings settings;
        settings.attack = treeState.getRawParameterValue("Attack")->load();
        settings.release = treeState.getRawParameterValue("Release")->load();
        settings.ratio = treeState.getRawParameterValue("Ratio")->load();
        settings.threshold = treeState.getRawParameterValue("Threshold")->load();
        settings.makeupGain = treeState.getRawParameterValue("Makeup Gain")->load();
        settings.dryWetPercentage = treeState.getRawParameterValue("Dry/Wet")->load();

        return settings;
    }

    juce::AudioProcessorValueTreeState::ParameterLayout AudioPluginAudioProcessor::createParamLayout() {
        juce::AudioProcessorValueTreeState::ParameterLayout layout;

        // items to keep track of 
        layout.add(std::make_unique<juce::AudioParameterFloat>("Attack","Attack", juce::NormalisableRange<float>(0.01f, 1000.0f, 0.01f),0.01f));
        layout.add(std::make_unique<juce::AudioParameterFloat>("Release","Release", juce::NormalisableRange<float>(1.0f, 3000.0f, 0.5f),1.0f));
        layout.add(std::make_unique<juce::AudioParameterFloat>("Ratio","Ratio", juce::NormalisableRange<float>(1.0f, 10.0f, 0.5f),1.0f));
        layout.add(std::make_unique<juce::AudioParameterFloat>("Threshold","Threshold", juce::NormalisableRange<float>(-60.0f, 0.0f, 0.01f),0.0f));
        layout.add(std::make_unique<juce::AudioParameterFloat>("Makeup Gain","Makeup Gain", juce::NormalisableRange<float>(-12.0f, 12.0f, 0.5f),0.0f));
        layout.add(std::make_unique<juce::AudioParameterFloat>("Dry/Wet", "Dry/Wet", juce::NormalisableRange<float>(0.0f, 1.0f, 0.01f), 1.0f));

        return layout;
    }
}


//==============================================================================
// This creates new instances of the plugin..
juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new  webview_plugin::AudioPluginAudioProcessor();
}

juce_add_plugin(SquashCompressorPlugin
    COMPANY_NAME "lullo-fi audio"
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT FALSE
    NEEDS_MIDI_OUTPUT FALSE
    PLUGIN_MANUFACTURER_CODE LOFI
    PLUGIN_CODE SC
    FORMATS AU VST3 Standalone
    NEEDS_WEBVIEW2 TRUE
)

target_sources(SquashCompressorPlugin
    PRIVATE src/PluginEditor.cpp src/PluginProcessor.cpp
)

target_include_directories(SquashCompressorPlugin PRIVATE include)

target_link_libraries(SquashCompressorPlugin
    PRIVATE
        juce::juce_audio_utils
        juce::juce_dsp
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags
    )

target_compile_definitions(SquashCompressorPlugin
PUBLIC
    JUCE_WEB_BROWSER=1
    JUCE_USE_CURL=0
    JUCE_VST_CAN_REPLACE_VST2=0
    JUCE_USE_WIN_WEBVIEW2_WITH_STATIC_LINKING=1)

file(COPY "${CMAKE_CURRENT_SOURCE_DIR}/../libs/juce/modules/juce_gui_extra/native/javascript/" DESTINATION "${CMAKE_CURRENT_SOURCE_DIR}/ui/squash-ui/src/juce/")
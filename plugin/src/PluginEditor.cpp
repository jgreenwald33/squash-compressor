#include "SquashCompressorPlugin/PluginProcessor.h"
#include "SquashCompressorPlugin/PluginEditor.h"

namespace webview_plugin {
    namespace {
        using namespace juce;
        auto streamToVector (InputStream& stream) {
            std::vector<std::byte> result ((size_t) stream.getTotalLength());
            stream.setPosition (0);
            [[maybe_unused]] const auto bytesRead = stream.read (result.data(), result.size());
            jassert (bytesRead == (ssize_t) result.size());
            return result;
        }

        const char* getMimeForExtension (const juce::String& extension) {
            using namespace juce;
    static const std::unordered_map<juce::String, const char*> mimeMap =
    {
        { { "htm"   },  "text/html"                },
        { { "html"  },  "text/html"                },
        { { "txt"   },  "text/plain"               },
        { { "jpg"   },  "image/jpeg"               },
        { { "jpeg"  },  "image/jpeg"               },
        { { "svg"   },  "image/svg+xml"            },
        { { "ico"   },  "image/vnd.microsoft.icon" },
        { { "json"  },  "application/json"         },
        { { "png"   },  "image/png"                },
        { { "css"   },  "text/css"                 },
        { { "map"   },  "application/json"         },
        { { "js"    },  "text/javascript"          },
        { { "woff2" },  "font/woff2"               }
    };

    if (const auto it = mimeMap.find (extension.toLowerCase()); it != mimeMap.end())
        return it->second;

    jassertfalse;
    return "";
}
    }

AudioPluginAudioProcessorEditor::AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor& p)
    : AudioProcessorEditor (&p), audioProcessor(p), processorRef (p),
    webView{juce::WebBrowserComponent::Options{}.withBackend(juce::WebBrowserComponent::Options::Backend::webview2)
    .withWinWebView2Options(juce::WebBrowserComponent::Options::WinWebView2{}.withUserDataFolder
    (juce::File::getSpecialLocation(juce::File::tempDirectory)))
    .withResourceProvider([this](const auto& url){return getResource(url);})
    .withNativeIntegrationEnabled()
    .withEventListener("ratioUpdate",
    [this](juce::var ratioObject) {
        *audioProcessor.processorTree.getRawParameterValue("Ratio") = ratioObject.getProperty("ratioVal",1.0f);
    })
    // Might be able to condense these event listeners into a single event later, with an effect name param
    .withEventListener("gainUpdate",
        [this](juce::var gainObject) {
            *audioProcessor.processorTree.getRawParameterValue("Makeup Gain") = gainObject.getProperty("gainVal",0.0f);
        })
    .withEventListener("thresholdUpdate",
        [this](juce::var thresholdObject) {
            *audioProcessor.processorTree.getRawParameterValue("Threshold") = thresholdObject.getProperty("thresholdVal",0.0f);
        })
    .withEventListener("attackUpdate",
        [this](juce::var attackObject) {
            *audioProcessor.processorTree.getRawParameterValue("Attack") = attackObject.getProperty("attackVal",0.01f);
        })
    .withEventListener("releaseUpdate",
        [this](juce::var releaseObject) {
            *audioProcessor.processorTree.getRawParameterValue("Release") = releaseObject.getProperty("releaseVal",1.0f);
        })
    .withEventListener("dryWetUpdate",
        [this](juce::var dryWetObject) {
            *audioProcessor.processorTree.getRawParameterValue("Dry/Wet") = dryWetObject.getProperty("dryWetVal",1.0f);
        })
    }
{
    juce::ignoreUnused (processorRef);
    addAndMakeVisible(webView);

    auto screenSize = juce::Desktop::getInstance().getDisplays().getPrimaryDisplay();
    int width = int(std::round(screenSize->userArea.getWidth() * 0.75));
    int height = int(std::round(screenSize->userArea.getHeight() * 0.75));

    // temporary rendering of preexisting site
    webView.goToURL("http://localhost:5173/");

    // will need this for distribution
    // webView.goToURL(webView.getResourceProviderRoot());

    setSize (width, height);

    // make calls every 60 miliseconds
    // this will trigger the timer callback function
    startTimer(60);
}

AudioPluginAudioProcessorEditor::~AudioPluginAudioProcessorEditor()
{
}

void AudioPluginAudioProcessorEditor::timerCallback() {
    float amplitudeData = processorRef.amplitudeData.load();
    webView.emitEventIfBrowserIsVisible("getAmplitudeData", amplitudeData);
}


void AudioPluginAudioProcessorEditor::resized()
{
    auto bounds =  getLocalBounds();
    webView.setBounds(bounds);
}
auto AudioPluginAudioProcessorEditor::getResource(const juce::String& url) -> std::optional<Resource> {
    static const auto resourceFileRoot = juce::File{R"(plugin\ui\squash-ui)"};

    const auto resourceToRetrieve = url == "/" ?  "index.html" : url.fromFirstOccurrenceOf("/", false, false);

    const auto resource = resourceFileRoot.getChildFile(resourceToRetrieve).createInputStream();

    if (resource) {
        const auto extension = resourceToRetrieve.fromLastOccurrenceOf(".", false, false);
        return Resource(streamToVector(*resource), getMimeForExtension(extension));
    }

    return std::nullopt;
}

void AudioPluginAudioProcessorEditor::nativeFunction(const juce::Array<juce::var>& args, 
    juce::WebBrowserComponent::NativeFunctionCompletion completion) {
        juce::String concatenatedArgs;

        for (const auto& arg : args) {
            concatenatedArgs += arg.toString();
        }

        labelUpdatedFromJavaScript.setText("Native function called with args: " + concatenatedArgs,
        juce::dontSendNotification);

        completion("nativefunction callback All OK!");
    }

}

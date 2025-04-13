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
    : AudioProcessorEditor (&p), processorRef (p),
    webView{juce::WebBrowserComponent::Options{}.withBackend(juce::WebBrowserComponent::Options::Backend::webview2)
    .withWinWebView2Options(juce::WebBrowserComponent::Options::WinWebView2{}.withUserDataFolder
    (juce::File::getSpecialLocation(juce::File::tempDirectory)))
    .withResourceProvider([this](const auto& url){return getResource(url);})
    .withNativeIntegrationEnabled()
    .withEventListener("ratioUpdate",
    [this](juce::var ratioObject) {
        labelUpdatedFromJavaScript.setText("Ratio value: " + ratioObject.getProperty("ratioVal",0).toString(),
        juce::dontSendNotification);
    })
    .withEventListener("gainUpdate",
        [this](juce::var gainObject) {
            labelUpdatedFromJavaScript.setText("Gain value: " + gainObject.getProperty("gainVal",0).toString(),
            juce::dontSendNotification);
        })
    .withEventListener("thresholdUpdate",
        [this](juce::var thresholdObject) {
            labelUpdatedFromJavaScript.setText("Threshold value: " + thresholdObject.getProperty("thresholdVal",0).toString(),
            juce::dontSendNotification);
        })
    .withEventListener("attackUpdate",
        [this](juce::var ratioObject) {
            labelUpdatedFromJavaScript.setText("Attack value: " + ratioObject.getProperty("attackVal",0).toString(),
            juce::dontSendNotification);
        })
    .withEventListener("releaseUpdate",
        [this](juce::var ratioObject) {
            labelUpdatedFromJavaScript.setText("Release value: " + ratioObject.getProperty("releaseVal",0).toString(),
            juce::dontSendNotification);
        })
    .withEventListener("dryWetUpdate",
        [this](juce::var ratioObject) {
            labelUpdatedFromJavaScript.setText("Dry/Wet value: " + ratioObject.getProperty("dryWetVal",0).toString(),
            juce::dontSendNotification);
        })
    }
{
    juce::ignoreUnused (processorRef);
    addAndMakeVisible(webView);
    addAndMakeVisible(runJavascriptButton);

    emitJavascriptEventButton.onClick = [this] {
        static const juce::Identifier EVENT_ID("exampleEvent");
        webView.emitEventIfBrowserIsVisible(EVENT_ID, 42.0);
    };

    addAndMakeVisible(emitJavascriptEventButton);

    auto screenSize = juce::Desktop::getInstance().getDisplays().getPrimaryDisplay();
    int width = int(std::round(screenSize->userArea.getWidth() * 0.75));
    int height = int(std::round(screenSize->userArea.getHeight() * 0.75));

    addAndMakeVisible(labelUpdatedFromJavaScript);

    // temporary rendering of preexisting site
    webView.goToURL("http://localhost:5173/");

    // will need this for distribution
    // webView.goToURL(webView.getResourceProviderRoot());

    setSize (width, height);
}

AudioPluginAudioProcessorEditor::~AudioPluginAudioProcessorEditor()
{
}


void AudioPluginAudioProcessorEditor::resized()
{
    auto bounds =  getLocalBounds();
    webView.setBounds(bounds.removeFromRight(getWidth() / 2));
    runJavascriptButton.setBounds(bounds.removeFromTop(50).reduced(5));
    emitJavascriptEventButton.setBounds(bounds.removeFromTop(50).reduced(5));
    labelUpdatedFromJavaScript.setBounds(bounds.removeFromTop(50).reduced(5));
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
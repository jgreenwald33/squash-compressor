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
    .withResourceProvider([this](const auto& url){return getResource(url);})}
{
    juce::ignoreUnused (processorRef);
    addAndMakeVisible(webView);

    auto screenSize = juce::Desktop::getInstance().getDisplays().getPrimaryDisplay();
    int width = int(std::round(screenSize->userArea.getWidth() * 0.75));
    int height = int(std::round(screenSize->userArea.getHeight() * 0.75));

    // temporary rendering of preexisting site
    // webView.goToURL("http://localhost:5173/");
    webView.goToURL(webView.getResourceProviderRoot());

    setSize (width, height);
}

AudioPluginAudioProcessorEditor::~AudioPluginAudioProcessorEditor()
{
}


void AudioPluginAudioProcessorEditor::resized()
{
    webView.setBounds(getLocalBounds());
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

}
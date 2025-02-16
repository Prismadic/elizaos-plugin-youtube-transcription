// src/actions/youtubeTranscription.ts
import {
  elizaLogger
} from "@elizaos/core";

// src/services/youtubeTranscriptionService.ts
import { Service, ServiceType } from "@elizaos/core";
import { getSubtitles } from "youtube-captions-scraper";
var YouTubeTranscriptionService = class _YouTubeTranscriptionService extends Service {
  async initialize() {
  }
  getInstance() {
    return _YouTubeTranscriptionService.getInstance();
  }
  static get serviceType() {
    return ServiceType.TRANSCRIPTION;
  }
  async getTranscription(videoUrl) {
    try {
      const videoId = this.extractVideoId(videoUrl);
      const captions = await getSubtitles({ videoID: videoId });
      return captions.map((caption) => caption.text).join(" ");
    } catch (error) {
      console.error("YouTube transcription error:", error);
      throw new Error(
        `Failed to fetch transcription: ${error.message}`
      );
    }
  }
  extractVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*v=([^&]+)/) || url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/);
    if (!match) {
      throw new Error("Invalid YouTube URL");
    }
    return match[1];
  }
};

// src/actions/youtubeTranscription.ts
var youtubeTranscription = {
  name: "YOUTUBE_TRANSCRIPTION",
  similes: [
    "YT_TRANSCRIBE",
    "TRANSCRIBE_VIDEO",
    "GET_CAPTIONS",
    "FETCH_YOUTUBE_CAPTIONS"
  ],
  suppressInitialMessage: true,
  description: "Fetch and transcribe captions from a YouTube video.",
  validate: async (runtime, message) => {
    const content = message.content.text;
    return !!content && /(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)/.test(content);
  },
  handler: async (runtime, message, state, options, callback) => {
    try {
      elizaLogger.log("Composing state for message:", message);
      state = await runtime.composeState(message);
      const videoUrl = message.content.text;
      elizaLogger.log("YouTube video URL received:", videoUrl);
      const transcriptionService = new YouTubeTranscriptionService();
      const transcription = await transcriptionService.getTranscription(
        videoUrl
      );
      const previewLength = 300;
      const preview = transcription.length > previewLength ? transcription.slice(0, previewLength) + "..." : transcription;
      callback({
        text: `Here's a preview of the transcription:

${preview}

You can request the full transcription if needed.`
      });
    } catch (error) {
      elizaLogger.error("YouTube transcription error:", error.message);
      callback({
        text: "Sorry, I couldn't fetch the transcription for this video."
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Transcribe the captions for this video: https://www.youtube.com/watch?v=VIDEO_ID"
        }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here is the transcription preview for the video:",
          action: "YOUTUBE_TRANSCRIPTION"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Can you get the captions for https://youtu.be/VIDEO_ID?"
        }
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here is the transcription preview for the video:",
          action: "YOUTUBE_TRANSCRIPTION"
        }
      }
    ]
  ]
};

// src/index.ts
var youtubeTranscriptionPlugin = {
  name: "youtubeTranscription",
  description: "Fetch and transcribe YouTube captions",
  actions: [youtubeTranscription],
  evaluators: [],
  providers: [],
  services: [new YouTubeTranscriptionService()],
  clients: []
};
var index_default = youtubeTranscriptionPlugin;
export {
  index_default as default,
  youtubeTranscriptionPlugin
};
//# sourceMappingURL=index.js.map
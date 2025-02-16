# YouTube Transcription Plugin

The YouTube Transcription Plugin enables seamless integration with YouTube videos to fetch and transcribe captions. It provides transcription previews and allows controlled access to full transcriptions, ensuring a concise and efficient user experience.

## Features

- Extracts captions from YouTube videos.
- Provides a preview of the transcription (first 300 characters by default).
- Allows optional access to the full transcription if needed.
- Validates YouTube URLs to ensure proper processing.
- Simple integration with ElizaOS runtime and services.

---

## Installation

To include the YouTube Transcription Plugin in your project, follow these steps:

1. Install the required dependency for caption scraping:

   ```bash
   npm install youtube-captions-scraper
   ```

2. Include the `YouTubeTranscriptionService` and `youtubeTranscription` action in your project as described below.

---

## Usage

### Service: `YouTubeTranscriptionService`

The service is responsible for extracting captions from YouTube videos using the `youtube-captions-scraper` library.

#### Methods:

- **`getTranscription(videoUrl: string): Promise<string>`**
  - Fetches the transcription for the given YouTube video URL.
  - Extracts captions and joins them into a single string.

- **`extractVideoId(url: string): string`**
  - Extracts the YouTube video ID from a valid URL.

### Action: `youtubeTranscription`

The action manages the client interaction, including:

1. Validating the YouTube URL.
2. Fetching the transcription using the service.
3. Returning a preview (first 300 characters) to the client.

#### Key Properties:

- **Name:** `YOUTUBE_TRANSCRIPTION`
- **Similes:**
  - `YT_TRANSCRIBE`
  - `TRANSCRIBE_VIDEO`
  - `GET_CAPTIONS`
  - `FETCH_YOUTUBE_CAPTIONS`
- **Description:** Fetch and transcribe captions from a YouTube video.
- **Examples:** Includes sample user-agent interactions for testing.

#### Validation Logic:

The plugin checks if the user input contains a valid YouTube URL:

```typescript
return (
    !!content &&
    /(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)/.test(content)
);
```

#### Response Logic:

- Returns a **transcription preview** (300 characters by default).
- Provides an option to request the **full transcription** if needed.

---

## Example Integration

### Initialize Service

```typescript
import { YouTubeTranscriptionService } from "../services/youtubeTranscriptionService";

const transcriptionService = new YouTubeTranscriptionService();
await transcriptionService.initialize();
```

### Use in Action Handler

```typescript
const transcription = await transcriptionService.getTranscription(videoUrl);
const previewLength = 300;
const preview =
    transcription.length > previewLength
        ? transcription.slice(0, previewLength) + "..."
        : transcription;

callback({
    text: `Here's a preview of the transcription:\n\n${preview}\n\nYou can request the full transcription if needed.`,
});
```

---

## Environment Variables

This plugin does not require additional API keys or environment variables.

---

## Error Handling

- **Invalid YouTube URL**: Throws an error if the provided URL is not valid.
- **Transcription Fetch Failure**: Handles errors gracefully and logs the issue for debugging.

```typescript
catch (error) {
    elizaLogger.error("YouTube transcription error:", error.message);
    callback({
        text: "Sorry, I couldn't fetch the transcription for this video.",
    });
}
```

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## License

This plugin is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For questions or support, reach out to the maintainers through the project's issue tracker.


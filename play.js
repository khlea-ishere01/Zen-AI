module.exports = {
  config: {
    name: "play",
    version: "1.0",
    author: "Mark S.",
    countDown: 5,
    role: 0,
    category: "music"
  },

  onStart: async ({ api, event }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("@distube/ytdl-core");

    // Get the song name from the input
    const input = event.body;
    const song = input.substring(10).trim();

    if (!song) {
      return api.sendMessage("Please put a song", event.threadID);
    }

    try {
      // Use YouTube API to search for the song
      let Send = await api.sendMessage("🕰️ | Searching for your song...", event.threadID);

      // Example URL for searching by query string, replace with your actual YouTube API endpoint and key
      const apiKey = 'YOUR_YOUTUBE_API_KEY';
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(song)}&key=${apiKey}`;
      
      const response = await axios.get(apiUrl);
      const videos = response.data.items;
      
      if (!videos.length) {
        return api.sendMessage("😔 | Sorry, song not found...", event.threadID, event.messageID);
      }
      
      // Get the first video result
      const { id: { videoId }, snippet: { title, channelTitle } } = videos[0];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Download the audio stream of the video
      // Use the lowest quality format available
      const stream = ytdl(videoUrl, { quality: 'lowestaudio' });

      // Create a file name and path for the audio
      const fileName = `music.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      // Save the audio stream to the file
      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${channelTitle}`);
      });

      stream.on('end', async () => {
        console.info('[DOWNLOADER] Downloaded');
        await api.unsendMessage(Send.messageID);

        // Check the file size and create an attachment
        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const attachment = fs.createReadStream(filePath);

        // Get the lyrics for the song from the lyrist API using the video title
        // Use a regular expression to extract only the song name and the main artist from the video title
        const regex = /^(.+?)\s*-\s*(.+?)(?:\s*\(|\[|$)/;
        const match = title.match(regex);
        if (!match) {
          api.sendMessage("Sorry, could not parse the video title!", event.threadID, event.messageID);
          return;
        }
        const [, artist, songName] = match;
        const lyricApiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(artist + " - " + songName)}`;
        
        try {
          const { data } = await axios.get(lyricApiUrl);
          const lyrics = data.lyrics;

          if (!lyrics) {
            const message = {
              body: `🎵 | Title: ${title}\n🎤 | Artist/Studio: ${channelTitle}\n\n😔 | Sorry, lyrics not found...`,
              attachment: attachment
            };
            api.sendMessage(message, event.threadID, () => {
              fs.unlinkSync(filePath);
            });
            return;
          }

          const message = {
            body: `🎵 | Title: ${title}\n🎤 | Artist: ${channelTitle}\n\n${lyrics}`,
            attachment: attachment
          };
          api.sendMessage(message, event.threadID, () => {
            fs.unlinkSync(filePath);
          });
        } catch (error) {
          console.error('[LYRICS ERROR]', error);
          api.sendMessage('An error occurred while fetching lyrics.', event.threadID);
        }
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while processing the command.', event.threadID);
    }
  }
};
const { Rudhra , mode , getBuffer, getJson, isUrl } = require("../lib");
const fetch = require("node-fetch");
const config = require("../config");
Rudhra({
    pattern: 'spotify ?(.*)',
    fromMe: mode,
    desc: 'Spotify Download',
    type: 'downloader'
}, async (message, match, client) => {
    const query = match || message.reply_message.text;

    if (!query) {
        return await message.reply('Please provide a Spotify URL.');
    }

    const apiUrl = `https://itzpire.com/download/aio?url=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.status === "success") {
            const audioUrl = result.data.download;
            const title = result.data.title;
            const artist = result.data.artist;
            const thumbnailUrl = result.data.image;

            await client.sendMessage(message.jid, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                ptt: false, 
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        body: artist,
                        mediaUrl: audioUrl,
                        mediaType: 2, // 2 for audio
                        thumbnailUrl: thumbnailUrl,
                        sourceUrl: query,
                    }
                }
            }, { quoted: message.data });
        } else {
            await message.reply('Failed to retrieve download link.');
        }
    } catch (error) {
        await message.reply('An error occurred while fetching the download link.');
    }
});
 Rudhra(
  {
    pattern: "sps ?(.*)",
    fromMe: mode,
    desc: "Search Spotify tracks",
    type: "downloader",
  },
  async (message, match, m) => {
    try {
      match = match || message.reply_message.text;

      if (!match) {
        await message.reply("Please provide a search query to find Spotify tracks.\nExample: `.sps I Wanna Be Yours`");
        return;
      }

      const response = await getJson(`https://api.maher-zubair.tech/search/spotify?q=${encodeURIComponent(match)}`);

      if (!response || response.result.length === 0) {
        await message.reply("Sorry, no Spotify tracks found for your search query.");
        return;
      }

      // Format the response into a readable message
      const formattedMessage = formatSpotifyMessage(response.result);

      // Send the formatted message
      await message.client.sendMessage(message.jid, {
    document: {
        url: "https://www.mediafire.com/file/n1qjfxjgvt0ovm2/IMG-20240211-WA0086_%25281%2529.pdf/file"
    },
    fileName: config.OWNER_NAME,
    mimetype: "application/pdf", // Changed to correct MIME type for PDF
    fileLength: "999999950",
    contextInfo: {
        externalAdReply: {
            title: config.BOT_NAME,
            body: "",
            sourceUrl: "",
            mediaUrl: "",
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: false,
            thumbnailUrl: "https://eypzgod-api.onrender.com/image"
        }
    },
    caption: formattedMessage// Assuming 'text' is a variable holding your caption text
});

    } catch (error) {
      console.error("Error fetching Spotify tracks:", error);
      await message.reply("Error fetching Spotify tracks. Please try again later.");
    }
  }
);

function formatSpotifyMessage(tracks) {
  let message = "*Spotify Search Results:*\n\n";

  tracks.forEach((track, index) => {
    message += `${index + 1}. *Title:* ${track.title}\n   *Artist:* ${track.artist}\n   *Duration:* ${formatDuration(track.duration)}\n   *Popularity:* ${track.popularity}\n   *Link:* ${track.url}\n\n`;
  });

  return message;
}

function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
}

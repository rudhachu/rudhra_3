const config = require("../config");
const { Rudhra, mode, toAudio,webp2mp4 } = require("../lib/");
Rudhra(
  {
    pattern: "sticker",
    fromMe: mode,
    desc: "Converts Photo/video/text to sticker",
    type: "converter",
  },
  async (message, match, client) => {
    if (
      !(
        message.reply_message.video ||
        message.reply_message.image ||
        message.reply_message.text
      )
    )
      return await message.reply("Reply to photo/video/text");

    let buff = await message.quoted.download("buffer");
    message.sendMessage(
      message.jid,
      buff,
      { packname: config.STICKER_DATA.split(";")[0], author: config.STICKER_DATA.split(";")[1], },
      "sticker"
    );
  }
);

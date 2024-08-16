const { Rudhra,mode,PREFIX} = require("../lib");
const config = require("../config");

Rudhra(
  {
    pattern: "mode ?(.*)",
    fromeMe: true,
    desc: "Change work type",
    type: "user",
  },
  async (message, match) => {
if (mode) {
type = "ᴘʀɪᴠᴀᴛᴇ"
} else {
type = "ᴘᴜʙʟɪᴄ"
}
let link = `${config.MENU_URL}`;
let url = await message.ParseButtonMedia(link)
    let data = {
      jid: message.jid,
      button: [
       {
          type: "reply",
          params: {
            display_text: "PUBLIC",
            id:  `${PREFIX}setvar MODE:public`,
          },
        },
       {
          type: "reply",
          params: {
            display_text: "PRIVATE",
            id:  `${PREFIX}setvar MODE:private`,
          },
        },
      ],
      header: {
        title: `${config.BOT_NAME}`,
        subtitle: "",
        hasMediaAttachment: true
      },
      footer: {
        text: "𝗠𝗢𝗗𝗘 : " + type,
      },
      body: {
        text: "",
      },
    };
     if (link.endsWith(".mp4")) {
    data.header.videoMessage = url;
  } else {
    data.header.imageMessage = url;   
  }
    return await message.sendMessage(message.jid, data, {}, "interactive");
  }
);

const { Rudhra, mode ,sendMenu, sendSegMenu } = require("../lib/");
Rudhra({
    pattern: "menu ?(.*)",
    desc: "Rudhra user manual",
    fromMe: mode,
    type: "user",
}, async (message, match) => {
    await sendMenu(message, match);
});
const pluginTypes = ['AnimeImage', 'downloader', 'info', 'whatsapp', 'group', 'media', 'AnimeVideo', 'user', 'generator'];

pluginTypes.forEach((type) => {
    Rudhra({
        pattern: `.${type}$`,
        fromMe: mode,
        dontAddCommandList: true,
    }, async (message, match) => {
        await sendSegMenu(message, match,type);
    });
});

const { PREFIX, mode, commands } = require("./events");
const version = require("../package.json").version;
const { getJson } = require("./utils");
const config = require("../config");

async function sendMenu(message, match) {
    try {
        if (match) {
            for (let i of commands) {
                if (i.pattern instanceof RegExp && i.pattern.test(`${PREFIX}` + match)) {
                    const cmdName = i.pattern.toString().split(/\W+/)[1];
                    await message.reply(`\`\`\`🤖Command: ${PREFIX}${cmdName.trim()}\nDescription: ${i.desc}\`\`\``);
                    return; // Exit after finding the match
                }
            }
        } else {
            const link = config.MENU_URL;
            const hrs = new Date().getHours({ timeZone: 'Asia/Kolkata' });
            const type = mode ? "Private" : "Public";

            let wish = '';
            if (hrs < 12) wish = '⛅𝗚𝗼𝗼𝗱 𝗠𝗼𝗿𝗻𝗶𝗻𝗴 ';
            else if (hrs >= 12 && hrs <= 16) wish = '🌞𝗚𝗼𝗼𝗱 𝗔𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻';
            else if (hrs >= 16 && hrs <= 20) wish = '🔆𝗚𝗼𝗼𝗱 𝗘𝘃𝗲𝗻𝗶𝗻𝗴';
            else if (hrs >= 20 && hrs <= 24) wish = '🌙𝗚𝗼𝗼𝗱 𝗡𝗶𝗴𝗵𝘁';

            const url = await message.ParseButtonMedia(link);
            let buttonArray = [
                { type: "reply", params: { display_text: "DOWNLOADER", id: `${PREFIX}.downloader` } },
                { type: "reply", params: { display_text: "INFO", id: `${PREFIX}.info` } },
                { type: "reply", params: { display_text: "MEDIA", id: `${PREFIX}.media` } },
                { type: "reply", params: { display_text: "⦙☰  ALL MENU", id: `${PREFIX}help` } },
                { type: "reply", params: { display_text: "USER", id: `${PREFIX}.user` } },
            ];

            const taxt = `╭───────────────────
│        ${wish.replace(/[\r\n]+/gm, "")}
│     *Hey*  ${message.pushName}
│〄  *Bot Name* : ${config.BOT_NAME} 
│〄  *Version*  : ${version}
│〄  *Developer* : ${config.OWNER_NAME}
│〄  *Date*  : ${new Date().toLocaleDateString("en-IN", { timeZone: 'Asia/Kolkata' })}
│〄  *Mode*  : ${type}
│〄  *Prefix*  : ${PREFIX}
│〄  *Commands*  :  ${commands.length}
│          
│         █║▌║▌║║▌║ █
│          ʀ   ᴜ   ᴅ   ʜ   ʀ   ᴀ
│      
╰────────────────────`;

            // Sort the buttons alphabetically by display_text
            buttonArray.sort((a, b) => a.params.display_text.localeCompare(b.params.display_text));

            let data = {
                jid: message.jid,
                button: buttonArray,
                header: {
                    title: taxt,
                    subtitle: taxt,
                    hasMediaAttachment: true,
                },
                footer: {
                    text: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴜᴅʜʀᴀ`,
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
    } catch (error) {
        console.error('Error in sendMenu:', error);
        await message.reply('There was an error processing your request.');
    }
}

async function sendSegMenu(message, match, type) {
    try {
        let msg = ' *HERE ARE THE AVAILABLE COMMANDS:* \n\n';
        let no = 1;

        commands.map((command) => {
            if (command.type === type && !command.dontAddCommandList && command.pattern) {
                const commandName = command.pattern.toString().match(/(\W*)([A-Za-z0-9_ğüşiö ç]*)/)[2].trim();
                msg += `╭─────────┈•\n`;
                msg += `│  *${no++}. ${commandName}*\n`;
                msg += `├──•\n`;
                msg += `│ ${command.desc}\n`;
                msg += `╰─────────────┈◉\n\n`;
            }
        });

        await message.reply(msg.trim());
    } catch (error) {
        console.error('Error in sendSegMenu:', error);
        await message.reply('There was an error processing your request.');
    }
}

module.exports = { sendMenu, sendSegMenu };

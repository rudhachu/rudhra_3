const { Rudhra, mode} = require('../lib/');

Rudhra({
	pattern: 'reboot',
	fromMe: mode,
	desc: 'Rudhra restart',
	type: 'system'
}, async (message, match, client) => {
await message.send("_rebooting_");
return require('pm2').restart('index.js');
});
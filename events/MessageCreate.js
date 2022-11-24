const { Events, message, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');

let locked = [];

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;
        fs.readFile('./other/levels.json', (err, data) => {
            if (err) throw err;
            let xp = JSON.parse(data);
            if (!xp[message.author.id]) {
                xp[message.author.id] = {
                    xp: 0,
                    level: 1
                };
            }
            let curxp = xp[message.author.id].xp;
            let curlvl = xp[message.author.id].level;
            let nxtLvl = curlvl * 70;

            // check if the user is locked
            if (locked.includes(message.author.id)) return;

            if (curxp >= nxtLvl) {
                if (curlvl === 100) {
                    return;
                }
                curlvl += 1;
                curxp = 0;
                xp[message.author.id].level = curlvl;
                xp[message.author.id].xp = curxp;
                //message.channel.send(`${message.author} has leveled up to level ${curlvl}!`);
                var embed = new EmbedBuilder()
                .setTitle(`<a:lvlup:1044325953431678986>You leveled up`)
                .setDescription(`${message.author} are now ${curlvl}!`)
                .setColor("Aqua")
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
                // reply to the message with the embed
            } else {
                curxp += 1;
                xp[message.author.id].xp = curxp;
                // lock user from gaining xp for 5 seconds
                //locked.push(message.author.id);
                //setTimeout(() => {
                  //  locked.splice(locked.indexOf(message.author.id), 1);
           //     }, 2000);
            }
            fs.writeFile('./other/levels.json', JSON.stringify(xp), (err) => {
                if (err) console.log(err);
            });
        });
    },
};
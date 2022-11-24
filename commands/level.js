const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Shows your level and xp')
        .addUserOption(option => option.setName('user').setDescription('The user to show the level of')),
	async execute(interaction) {

        let user = interaction.options.getUser('user');

        if (!user) {
            user = interaction.user;
        }

        let dir = './other/levels.json';
        fs.readFile(dir, async (err, data) => {
            // show the user their level and xp
            if (err) throw err;
            let xp = JSON.parse(data);
            if (!xp[user.id]) {
                xp[user.id] = {
                    xp: 0,
                    level: 1
                };
            }
            let curxp = xp[user.id].xp;
            let curlvl = xp[user.id].level;
            let nxtLvl = curlvl * 70;

            var embed = new EmbedBuilder()
            .setTitle(`<a:lvlup:1044325953431678986>Level`)
            .setDescription(`You are level ${curlvl} and have ${curxp}/${nxtLvl} xp!`)
            .setColor("Aqua")
            interaction.reply({ embeds: [embed] })
        });
	},
};
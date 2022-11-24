const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows the leaderboard'),
    async execute(interaction) {
        // read the levels.json file and sort it by level
        fs.readFile('./other/levels.json', (err, data) => {
            if (err) throw err;
            let xp = JSON.parse(data);
            let sorted = Object.keys(xp).sort((a, b) => xp[b].level - xp[a].level);
            let top10 = sorted.splice(0, 10);
            let embed = new EmbedBuilder()
            .setTitle(`Leaderboard`)
            .setColor("Aqua")
            .setDescription(top10.map((u, i) => `**${i + 1}.** <@${u}> - Level ${xp[u].level}`).join('\n'))
            .setFooter({ text: `Requested by ${interaction.user.username}`});
            // send requested by user\
            interaction.reply({ embeds: [embed] });
        });
    }
}
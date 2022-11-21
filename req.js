const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./other/config.json');
const fs = require('node:fs');
require('dotenv').config();
const token = process.env.TOKEN;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
        // delete a command if it doesn't exist in the commands folder
        data.forEach(async (command) => {
            if (!commandFiles.includes(`${command.name}.js`)) {
                await rest.delete(Routes.applicationGuildCommand(clientId, guildId, command.id));
            }
        });
        // if command is global delete it
        const globalCommands = await rest.get(Routes.applicationCommands(clientId));
        globalCommands.forEach(async (command) => {
            await rest.delete(Routes.applicationCommand(clientId, command.id));
        });
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
require('dotenv').config()
const { Client, Intents } = require('discord.js')
const { Manager} = require('erela.js')

const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] })

client.login(process.env.DISCORD_BOT_TOKEN)

client.on('ready', () =>
{
    console.log('Discord Bot has logged in.')
})
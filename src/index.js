require('dotenv').config()
const { Client, Intents } = require('discord.js')
const { Manager } = require('erela.js')

// const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] })
const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.manager = new Manager({
    nodes: [{
        host: 'localhost',
        port: 9000,
        password: 'pass'
    }],
    send(id, payload)
    {
        const guild = client.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)
    }
    
})
    .on("nodeConnect", (node) =>
        console.log(`Node ${node.options.identifier} connected`)
    )
    .on("nodeError", (node, error) =>
        console.log(
        `Node ${node.options.identifier} had an error: ${error.message}`
    )
    )
    .on("trackStart", (player, track) => {
        client.channels.cache
        .get(player.textChannel)
        .send(`Now playing: ${track.title}`);
    })
    .on("queueEnd", (player) => {
        client.channels.cache.get(player.textChannel).send("Queue has ended.");
        player.destroy();
    });

client.login(process.env.DISCORD_BOT_TOKEN)

client.on('ready', () =>
{
    console.log('Discord Bot has logged in.')
    client.manager.init(client.user.id)
})

client.on("raw", (d) => client.manager.updateVoiceState(d))

client.on("messageCreate", async (message) =>
{
    if (message.content.startsWith("$sing"))
    {
        const res = await client.manager.search(
            message.content.slice(6),
            message.author
        )

        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id
        })

        player.connect()

        player.queue.add(res.tracks[0])
        message.channel.send(`\`\`\`C'est bon DJ fais pété le son ${res.tracks[0].title}\`\`\``)

        if (!player.playing && !player.paused && !player.queue.size) player.play()
    }

})

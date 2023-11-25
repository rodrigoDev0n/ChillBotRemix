import { playMusic } from './commands/play.js';

import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} from 'discord.js';


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel
    ]
})

client.commands = new Collection();

client.on('ready', () => {
    console.log('El bot esta preparado para funcionar.....');
})

const prefix = '-';

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix+'play')) {
        playMusic(message, client);
    }
})

client.login('MTE3Nzg0NDk3MjU4MjYwODk4Ng.GkuJRK.5NDSfCZub3JnESwSQUqRzjr9v5Jl8Je-2knNrg');

/* TOKEN:MTE3Nzg0NDk3MjU4MjYwODk4Ng.GkuJRK.5NDSfCZub3JnESwSQUqRzjr9v5Jl8Je-2knNrg*/
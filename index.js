import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { Intents } from 'oceanic.js';
import { playMusic } from './commands/play.js';
import { playMusicList } from './commands/playlist.js';

import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} from 'discord.js';

/* GuildVoiceStates = permite que se reproduczca audio en un canal */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Channel
    ],
})

client.commands = new Collection();

client.on('ready', () => {
    console.log('El bot esta preparado para funcionar.....');
})

const prefix = '-';

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + 'play')) {
        playMusic(message);
    }

    if (message.content.startsWith(prefix + 'dolist')) {
        playMusicList(message);
    }
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenvConfig({ path: `${__dirname}/.env` });

const loginToken = process.env.TOKEN;

client.login(loginToken);

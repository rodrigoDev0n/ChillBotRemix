import {
    joinVoiceChannel,
} from "@discordjs/voice";

import { playNextSong } from "./playNext.js";

export const playMusicList = async (message) => {

    let commandOriginal = message.content;
    let textoEliminado = "-dolist";

    let url = commandOriginal.split(textoEliminado);
    let urlSearch = url.join("").trim();
    let songs = urlSearch.split(',');

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    });
    
    playNextSong(songs, 0, connection, message);
};


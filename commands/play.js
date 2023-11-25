import ytdl from "ytdl-core";
import {
    joinVoiceChannel,
    createAudioResource,
    createAudioPlayer,
} from "@discordjs/voice";

export const playMusic = async (message) => {
    let commandOriginal = message.content;
    let textoEliminado = "-play";

    let url = commandOriginal.split(textoEliminado);
    let urlSearch = url.join("").trim();

    console.log(urlSearch);

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    });

    const stream = await ytdl(
        urlSearch,
        {
            filter: 'audioonly',
            highWaterMark: 1 << 25,
            quality: 'highestaudio'
        });

    const resource = createAudioResource(await stream);

    const player = createAudioPlayer();

    player.on("stateChange", (oldState, newState) => {
        console.log(oldState.status, newState.status);
    })

    connection.subscribe(player);

    player.play(resource);

    message.channel.send("Reproduciendo...");
};
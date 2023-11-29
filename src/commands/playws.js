import { search } from "yt-search";
import ytdl from "ytdl-core";

import {
    ComponentType,
} from "discord.js";

import {
    joinVoiceChannel,
    createAudioResource,
    createAudioPlayer,
} from "@discordjs/voice";

import { calculateTime } from "../common/calculateTime.js";
import { createAndAttachCollector, cleanupCollectors } from "../common/collectors.js";
import { playerButtons } from "../buttons/playerButtons.js";
import { infoCard } from "../components/infoCard.js";

export const playws = async (message) => {

    const filter = (interaction) => {
        return interaction.customId === 'Back' ||
            interaction.customId === 'Stop' ||
            interaction.customId === 'loop' ||
            interaction.customId === 'Next';
    }

    const command = message.content;
    const song = command.replace(/^-ws/, '');

    const result = await search(song);

    if (result.videos.length === 0) {
        message.channel.send("No se pudo encontrar la cancion");
    }

    const video = result.videos[0].url;

    const { row } = playerButtons(0, video);

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    })

    if (video.length !== 0) {
        const info = await ytdl.getInfo(video);
        const title = info.videoDetails.title;
        const duration = info.videoDetails.lengthSeconds;
        const author = info.videoDetails.author.name;
        const thumbnail = info.videoDetails.thumbnails[0].url;

        const { minutes, seconds } = calculateTime(duration);

        const info_song = {
            title,
            author,
            thumbnail,
            duration: `${minutes}:${seconds}`,
        }

        const { card } = infoCard(message, info_song);

        if (ytdl.validateURL(video)) {
            const stream = ytdl(video, {
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                quality: 'highestaudio'
            })
        
            const resource = createAudioResource(stream)
            const player = createAudioPlayer();
        
            connection.subscribe(player);
        
            connection.subscribe(player);
            player.play(resource);
        }

        const messageResponse = await message.reply({
            embeds: [card],
            components: [row],
            ephemeral: true
        })

        const confirmationCollector = await messageResponse.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            time: 3000
        })

        const onCollect = async (interaction) => {
            await interaction.deferUpdate();

            if (interaction.customId === 'Stop') {
                connection.destroy();
                return;
            }

            if (interaction.customId === 'loop') {
                console.log("loop");
            }
        }

        confirmationCollector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                console.log("time");
            }

            if (reason === 'idle') {
                console.log("idle");
            }
        })

        const onEnd = async () => {
            await cleanupCollectors();
        }

        await createAndAttachCollector(messageResponse, filter, onCollect, onEnd);
    }
}

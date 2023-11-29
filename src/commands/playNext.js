import ytdl from "ytdl-core";

import {
    ComponentType,
} from "discord.js";

import {
    createAudioResource,
    createAudioPlayer,
} from "@discordjs/voice";

import { calculateTime } from "../common/calculateTime.js";
import { createAndAttachCollector, cleanupCollectors } from "../common/collectors.js";
import { playerButtons } from "../buttons/playerButtons.js";
import { infoCard } from "../components/infoCard.js";

export const playNextSong = async (songs, index, connection, message) => {
  

    const { row } = playerButtons(index, songs);

    const filter = (interaction) => {
        return interaction.customId === 'Back' ||
            interaction.customId === 'Stop' ||
            interaction.customId === 'loop' ||
            interaction.customId === 'Next';
    };

    if (index < songs.length) {

        const selectedSong = songs[index];

        const info = await ytdl.getInfo(selectedSong);
        const title = info.videoDetails.title;
        const duration = info.videoDetails.lengthSeconds;
        const author = info.videoDetails.author.name;
        const thumbnail = info.videoDetails.thumbnails[0].url;

        const { minutes, seconds } = calculateTime(duration);

        const songInfo = {
            title,
            author,
            thumbnail,
            duration: `${minutes}:${seconds}`,
        }

        const { card } = infoCard(message, songInfo);

        if (ytdl.validateURL(selectedSong)) {
            const stream = await ytdl(selectedSong, {
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                quality: 'highestaudio',
            });

            if (!stream) {
                message.channel.send("No se pudo encontrar la canción");
            }

            const resource = createAudioResource(stream);
            const player = createAudioPlayer();

            player.on("stateChange", (oldState, newState) => {
                console.log(oldState.status, newState.status);
                if (newState.status === "idle") {
                    playNextSong(songs, index + 1, connection, message);
                }
            });

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

            if (interaction.customId === 'Back') {
                if (index === 0) {
                    playNextSong(songs, songs.length - 1, connection, message);
                } else {
                    playNextSong(songs, index - 1, connection, message);
                }
            }

            if (interaction.customId === 'loop') {
                console.log("loop");
            }

            if (interaction.customId === 'Next') {
                if (index === songs.length - 1) {
                    playNextSong(songs, 0, connection, message);
                } else {
                    playNextSong(songs, index + 1, connection, message);
                }
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
};


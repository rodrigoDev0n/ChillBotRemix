import ytdl from "ytdl-core";

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} from "discord.js";

import {
    joinVoiceChannel,
    createAudioResource,
    createAudioPlayer,
} from "@discordjs/voice";

export const playNextSong = async (songs, index, connection, message) => {

    const row = new ActionRowBuilder()
    row.addComponents(
        new ButtonBuilder()
            .setCustomId('Back')
            .setLabel('Atras')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏮')
            .setDisabled(index === 0),
    )

    row.addComponents(
        new ButtonBuilder()
            .setCustomId("Stop")
            .setLabel("Parar")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("⏹"),
    )

    row.addComponents(
        new ButtonBuilder()
            .setCustomId("Next")
            .setLabel("Siguiente")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("⏭"),
    )

    row.addComponents(
        new ButtonBuilder()
            .setCustomId("loop")
            .setLabel("Repetir")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🔁"),
    )

    const messageResponse = await message.reply({
        components: [row],
        ephemeral: true,
    });

    const filter = (interaction) => {
        return interaction.customId === 'Back' ||
               interaction.customId === 'Stop' ||
               interaction.customId === 'loop' ||
               interaction.customId === 'Next';
    };

    const confirmationCollector = await messageResponse.createMessageComponentCollector({
        filter,
        componentType: ComponentType.Button,
        time: 60000
    })

    confirmationCollector.on('collect', async confirmationCollector => {
        confirmationCollector.deferUpdate();

        const { customId } = confirmationCollector;

        if (customId === 'Stop') {
            connection.destroy();
            return;
        }

        if (customId === 'Back') {
            playNextSong(songs, index - 1, connection, message);
        }

        if (customId === 'loop') {
            console.log("loop");
        }

        if (customId === 'Next') {
            playNextSong(songs, index + 1, connection, message);
        }
    })

    confirmationCollector.on('end', async (collected, reason) => {
        if (reason === 'time') {
            console.log("time");
        }

        if (reason === 'idle') {
            console.log("idle");
        }
    })

    row.addComponents(
        new ButtonBuilder()
            .setCustomId("Next")
            .setLabel("Siguiente")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⏭")
            .setDisabled(index === songs.length - 1),
    )

    if (index < songs.length) {

        const selectedSong = songs[index];

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
            message.channel.send(`Reproduciendo: ${selectedSong}`);
        }
    }
};

/* 
// Llamada inicial
playNextSong(songs, 0, connection); */

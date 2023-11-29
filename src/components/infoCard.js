import { ActionRowBuilder, EmbedBuilder } from 'discord.js';
export const infoCard = (message, songInfo) => {

    const card = new EmbedBuilder();
  
    card
        .setColor('#0099ff')
        .setTitle('Datos de la canción')
        .setDescription(
            `**${songInfo.title}**`
            + '\n'
            + songInfo.author
            + '\n'
            + songInfo.duration
        )
        .setImage(songInfo.thumbnail, {
            height: 300,
            width: 300,
        })
        .setFooter({
            iconURL: message.author.displayAvatarURL(),
            text: `Requested by ${message.author.username}`,
        })

    return { card };
}


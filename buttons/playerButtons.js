import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} from "discord.js";

export const playerButtons = (index, songs) => {
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
            .setEmoji("⏭")
            .setDisabled(index === songs.length - 1),
    )

    row.addComponents(
        new ButtonBuilder()
            .setCustomId("loop")
            .setLabel("Repetir")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🔁"),
    )

    return {
        row
    }
}
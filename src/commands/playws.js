import { search } from "yt-search";
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

export const playws = async (message) => {

    const command = message.content;
    const song = command.replace(/^ws-/, '');

    console.log(song);
    console.log('Esto es un texto')

    // TODO: Testear que el comando funcione de manera correcta

    /* let commandOriginal = message.content;
    let textoEliminado = "-playws";

    let url = commandOriginal.split(textoEliminado);
    let urlSearch = url.join("").trim();

    console.log(urlSearch);

    const result = await search(urlSearch);

    if (result.videos.length === 0) {
        message.channel.send("No se pudo encontrar la cancion");
    }

    const video = result.videos[0].url;
    console.log(video); */
}

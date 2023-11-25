
import {
    ComponentType,
} from "discord.js";

// En algún lugar de tu código, puedes definir un mapa para almacenar los colectores
export const collectorsMap = new Map();

export const createAndAttachCollector = async (message, filter, onCollect, onEnd) => {
    const collector = await message.createMessageComponentCollector({
        filter,
        componentType: ComponentType.Button,
        time: 60000,
    });

    collector.on('collect', onCollect);
    collector.on('end', onEnd);

    // Almacena el colector en el mapa usando el ID del mensaje como clave
    collectorsMap.set(message.id, collector);
};

export const cleanupCollectors = () => {
    // Limpia todos los colectores almacenados en el mapa
    collectorsMap.forEach((collector) => {
        collector.stop();
    });

    // Limpia el mapa después de detener todos los colectores
    collectorsMap.clear();
};
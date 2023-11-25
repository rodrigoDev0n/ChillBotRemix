// Calcula los minutos y los segundos de una canción o video
export const calculateTime = ( seconds ) => {

    let minutes = Math.floor(seconds / 60);
    let seconds_remaining = seconds % 60; 

    if(seconds_remaining < 10) {
        seconds_remaining = `0${seconds_remaining}`
    }

    if(minutes < 10) {
        minutes = `0${minutes}`
    }

    if(minutes === 0) {
        return {
            minutes: '00',
            seconds: seconds_remaining
        }
    }

    if(seconds_remaining === 0) {
        return {
            minutes: minutes,
            seconds: '00'
        }
    }

    return {
        minutes: minutes,
        seconds: seconds_remaining
    }
}

function play(name) {
    const audio = new Audio(`assets/audio/${name}`)
    audio.play()
}

const audioService = {
    play
}

export default audioService
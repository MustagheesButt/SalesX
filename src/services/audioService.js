
function play(name) {
    const audio = new Audio(`assets/audio/${name}`)
    audio.play()
}

export default {
    play
}
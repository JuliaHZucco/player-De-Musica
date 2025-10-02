const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const play = document.getElementById("play");
const cover = document.getElementById("cover");
const next = document.getElementById("next");
const previous= document.getElementById("previous");
const currentProgress = document.getElementById("current-progress")
const progressContainer = document.getElementById("progress-container")

const millionReasons = {
    songName : "Million Reasons",
    artist : "Lady Gaga",
    file : "million_reasons"
}

const badRomance = {
    songName : "Bad Romance",
    artist : "Lady Gaga",
    file : "bad_romance"
}

const justDance = {
    songName : "Just Dance",
    artist : "Lady Gaga",
    file : "just_dance"
}

let isPlaying = false;
const playlist = [millionReasons, badRomance, justDance];
let index = 0;

function playsong(){
    //recupera o ícone de play, remove o play e aciona a visão do botão de pause
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pausesong(){
    //recupera o ícone de play, remove o pause e aciona a visão do botão de play
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if (isPlaying === true){
        pausesong();
    } else {
        playsong();
    }
}

function initializeSong(){
    cover.src = `imagens/${playlist[index].file}.jpg`;
    song.src = `songs/${playlist[index].file}.mp3`;
    songName.innerText = playlist[index].songName;
    bandName.innerText = playlist[index].artist;

}

function previousSong(){
    if(index === 0){
        index = playlist.length -1;
    } else {
        index -= 1;
    }
    initializeSong();
    playsong();
}

function nextSong(){
    if(index === 0){
        index = 0;
    } else {
        index += 1;
    }
    initializeSong();
    playsong();
}

function updateProgressBar(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`);
}

function jumpTo(){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)*song.duration;
    song.currentTime =  jumpToTime;
}

initializeSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener(`timeupdate`, updateProgressBar);
progressContainer.addEventListener("click", jumpTo);
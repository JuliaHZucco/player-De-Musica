const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const play = document.getElementById("play");
const cover = document.getElementById("cover");
const next = document.getElementById("next");
const previous= document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");

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
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = [millionReasons, badRomance, justDance];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playsong(){
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pausesong(){
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
    cover.src = `imagens/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    } else {
        index -= 1;
    }
    initializeSong();
    playsong();
}

function nextSong(){
    if(index === sortedPlaylist.length - 1){
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

function shuffleArray(preShuffleArray){
    const shuffledArray = [...preShuffleArray];  
    const size = shuffledArray.length;  
    let currentIndex = size - 1;

    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * (currentIndex + 1));  
        let aux = shuffledArray[currentIndex];
        shuffledArray[currentIndex] = shuffledArray[randomIndex];
        shuffledArray[randomIndex] = aux;
        currentIndex -= 1;
    }

    return shuffledArray;
}

function shuffleButtonClicked(){
    if (isShuffled === false) {
        isShuffled = true;
        sortedPlaylist = shuffleArray([...sortedPlaylist]);  
        shuffleButton.classList.add("button-active");
        index = 0; 
    } else {
        isShuffled = false;
        shuffleButton.classList.remove("button-active");
    }
    initializeSong();  
}

function repeatButtonClicked(){
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add("button-active");
    } else {
        repeatOn = false;
        repeatButton.classList.remove("button-active");
    }
}

function nextOrRepeat(){
    if (repeatOn === false){
        nextSong();
    } else {
        song.currentTime = 0; 
        playsong(); 
    }
}

song.addEventListener('ended', () => {
    if (repeatOn) {
        song.currentTime = 0;  
        playsong(); 
    }
});

initializeSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextOrRepeat);  // Usando nextOrRepeat para controlar repetição
song.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
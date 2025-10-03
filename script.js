// sintaxe da declaração de variáveis com jQuery: const $nomeVariavel = $("#idDoElemento");
// o cifrão ($) no início do nome da variável indica que é um elemento jQuery
const $songName = $("#song-name");
const $bandName = $("#band-name");
const $song = $("#audio");
const $play = $("#play");
const $cover = $("#cover");
const $next = $("#next");
const $previous = $("#previous");
const $currentProgress = $("#current-progress");
const $progressContainer = $("#progress-container");
const $shuffleButton = $("#shuffle");
const $repeatButton = $("#repeat");
const $songTime = $("#song-time");
const $totalTime = $("#total-time");
const $likeButton = $("#like");


//estes objetos Js permanecem inalterados mesmo com o uso do jQuery pois não são elementos HTML
$(document).ready(function () { // garante que DOM esteja carregado antes de executar o script 
    let isPlaying = false;
    let isShuffled = false;
    let repeatOn = false;

    const millionReasons = {
        songName: "Million Reasons",
        artist: "Lady Gaga",
        file: "million_reasons",
        liked: false
    };

    const badRomance = {
        songName: "Bad Romance",
        artist: "Lady Gaga",
        file: "bad_romance",
        liked: false
    };

    const justDance = {
        songName: "Just Dance",
        artist: "Lady Gaga",
        file: "just_dance",
        liked: false
    };

    const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [millionReasons, badRomance, justDance];
    let sortedPlaylist = [...originalPlaylist];
    let index = 0;

// segundo a documentação do jQuery, se meu site tem muitas páginas, posso colocar as funções dentro de um arquivo js separado

// função para tocar música - Sintaxe jQuery: $("selector").método()
function playsong(){
    $play.find(".bi").removeClass("bi-play-circle-fill").addClass("bi-pause-circle-fill");
    $song[0].play(); //$("#audio")[0].play(); ou $song.trigger("play");
    isPlaying = true;
}

// função para pausar música - Sintaxe jQuery: $("selector").método()
function pausesong(){
    $play.find(".bi").removeClass("bi-pause-circle-fill").addClass("bi-play-circle-fill");
    $song[0].pause(); //$("#audio")[0].pause(); ou $song.trigger("pause");
    isPlaying = false;
}

// função para tocar música ou pausar música dependendo do estado atual
function playPauseDecider(){
    isPlaying ? pausesong() : playsong();
}

// função para renderizar o botão de like
function likeButtonRender(){
    if (sortedPlaylist[index].liked){
        $("#like .bi").removeClass("bi-heart").addClass("bi-heart-fill"); //deixei diferente do else para fins de comparação
        $("#like").addClass("button-active"); //$("#like") pode ser substituido por $likeButton
    } else {
        $likeButton.find(".bi").removeClass("bi-heart-fill").addClass("bi-heart");
        $likeButton.removeClass("button-active"); 
    }
}

// função para inicializar a música atual - para atributos HTML: $(selector).attr(attributeName, value);
// para texto: $(selector).text(value);
function initializeSong(){
    //animar a capa do disco ao mudar de múisica - testar jQuery animate
    $cover.fadeOut(200, function() {
        $cover.attr("src", `imagens/${sortedPlaylist[index].file}.jpg`);
        $cover.fadeIn(500);
    });
    $song.attr("src", `songs/${sortedPlaylist[index].file}.mp3`);
    $songName.text(sortedPlaylist[index].songName);
    $bandName.text(sortedPlaylist[index].artist);
    likeButtonRender();
}

//animação quando o mouse passa por cima da capa do disco 
$cover.hover(
    function() { //mouse entra
        $(this).animate({width: "500px", opacity: 0.8}, 300);
    },
    function() { //mouse sai 
        $(this).animate({width: "400px", opacity: 1}, 300);
    }
)

// função para ir para a música anterior
function previousSong(){
    index = (index === 0) ? sortedPlaylist.length - 1 : index - 1;
        initializeSong();
        playsong();
}

// função para ir para a próxima música
function nextSong(){
    index = (index === sortedPlaylist.length - 1) ? 0 : index + 1;
    initializeSong();
    playsong();
}

// função para atualizar a barra de progresso
function updateProgress(){
    const song = $song[0]; //$("#audio")[0]
    const barWidth = (song.currentTime / song.duration) * 100;
    $currentProgress.css("--progress", `${barWidth}%`); //$(selector).css(propertyName, value) - altera propriedade CSS
    $songTime.text(formatTime(song.currentTime));
}

// função para pular para uma posição específica na música
function jumpTo(e){
    const song = $song[0]; //[0] acessa elemento DOM puro, não o objeto jQuery
    const width = $(this).width();
    const clickPosition = e.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime; 
}

// função para embaralhar o array
function shuffleArray(preShuffleArray){
    const shuffledArray = [...preShuffleArray];
    let currentIndex = shuffledArray.length - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[currentIndex]];
        currentIndex--;
    }
    return shuffledArray;
}

// função para lidar com o clique no botão de embaralhar
function shuffleButtonClicked(){
    if (!isShuffled) {
        isShuffled = true;
        sortedPlaylist = shuffleArray([...sortedPlaylist]);
        $shuffleButton.addClass("button-active");
        index = 0;
    } else {
        isShuffled = false;
        $shuffleButton.removeClass("button-active");
    }
    initializeSong();
    playsong();
}

// função para lidar com o clique no botão de repetir
function repeatButtonClicked() {
    repeatOn = !repeatOn;
    $repeatButton.toggleClass("button-active", repeatOn); //toggleClass(className, state) adiciona ou remove a classe dependendo do boolean state
}

// função para ir para a próxima música ou repetir a atual dependendo do estado do botão de repetir
function nextOrRepeat() {
    if (repeatOn) {
        $song[0].currentTime = 0;
        playsong();
    } else {
        nextSong();
    }
}

// função para formatar o tempo em segundos para o formato HH:MM:SS ou MM:SS
function formatTime(timeInSeconds) {
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds % 3600) / 60);
    let seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    }
}

// função para atualizar o tempo total da música
function updateTotalTime(){
    $totalTime.text(formatTime($song[0].duration));
    
}

// função para lidar com o clique no botão de like
function likeButtonClicked(){
    sortedPlaylist[index].liked = !sortedPlaylist[index].liked;
        likeButtonRender();
        localStorage.setItem("playlist", JSON.stringify(originalPlaylist)); 
}

initializeSong();


// eventos - Sintaxe jQuery: $(selector).on(event, function);
$play.on("click", playPauseDecider); //também da para fazer assim $("#play").click(playPauseDecider);
$previous.on("click", previousSong);
$next.on("click", nextOrRepeat);
$song.on("timeupdate", updateProgress);
$song.on("ended", nextOrRepeat);
$song.on("loadedmetadata", updateTotalTime);
$progressContainer.on("click", jumpTo);
$shuffleButton.on("click", shuffleButtonClicked);
$repeatButton.on("click", repeatButtonClicked);
$likeButton.on("click", likeButtonClicked);

});
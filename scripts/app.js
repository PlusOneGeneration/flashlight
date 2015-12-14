// fork getUserMedia for multiple browser versions, for those
// that need prefixes

navigator.getUserMedia = (navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia);

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var stream;

// grab the mute button to use below

var mute = document.getElementById("mute");

//set up the different audio nodes we will use for the app

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var gainNode = audioCtx.createGain();

// set up canvas context for visualizer

var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");
var biquadFilter = audioCtx.createBiquadFilter();

biquadFilter.type = "lowshelf";
biquadFilter.frequency.value = 200;
biquadFilter.gain.value = 25;

var convolver = audioCtx.createConvolver();

var clearCanvas = function () {
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = "black";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
};

var intendedWidth = document.querySelector('.wrapper').clientWidth;

canvas.setAttribute('width', intendedWidth);

var visualSelect = document.getElementById("visual");

var drawVisual;

//main block for doing the audio recording

if (navigator.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.getUserMedia(
        // constraints - only audio needed for this app
        {
            audio: true
        },

        // Success callback
        function (stream) {
            source = audioCtx.createMediaStreamSource(stream);
            //source.connect(gainNode);
            source.connect(analyser);
            biquadFilter.connect(convolver);
            convolver.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            visualize();
        },

        // Error callback
        function (err) {
            console.log('The following gUM error occured: ' + err);
        }
    );
} else {
    console.log('getUserMedia not supported on your browser!');
}

function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;


    var visualSetting = visualSelect.value;

    if (visualSetting == "frequencybars") {
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        console.log('bufferLength', bufferLength);
        var dataArray = new Uint8Array(bufferLength);
        console.log('data', dataArray)

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        var prev = 0;

        function draw() {
            drawVisual = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            var c = dataArray;
            //var color = 'rgb('+c[6]+','+c[6]+' ,'+ c[6]+')';
            //var diff = c[1] - prev;
            var diff = c[c.length - 1] - c[0];
            diff = diff >= 0 ? diff : -diff;
            diff *= 2;

            //diff *= 8;
            //diff = diff >= 256 ? 256 : diff;
            //diff = diff >= 90 ? diff : 0;

            //var color = 'rgb(' + diff + ',' + diff + ' ,' + diff + ')';
            var color = 'rgb(' + diff + ' , ' + diff + ', ' + diff + ')';
            prev = c[0];

            //console.log(prev, diff);


            $('body').css({
                'background-color': color
            });

            canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            var barWidth = (WIDTH / bufferLength) * 2.5;
            var barHeight;
            var x = 0;

            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                x += barWidth + 1;
            }
        };

        draw();

    }

    if (visualSetting == "off") {
        clearCanvas();
    }

}


// event listeners to change visualize

visualSelect.onchange = function () {
    window.cancelAnimationFrame(drawVisual);
    visualize();
};


mute.onclick = muteSound;

function muteSound() {
    if (mute.id == "") {
        clearCanvas();
        gainNode.gain.value = 0;
        console.log(gainNode.gain.value)
        mute.id = "activated";
        mute.innerHTML = "Unmute";
    } else {
        gainNode.gain.value = 1;
        console.log(gainNode.gain.value)
        mute.id = "";
        mute.innerHTML = "Mute";
    }
}


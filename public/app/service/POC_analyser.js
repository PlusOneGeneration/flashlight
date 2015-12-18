function POC_analyser(emit) {

    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source;
    var stream;

    var analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    var gainNode = audioCtx.createGain();


    var highcutFilter = audioCtx.createBiquadFilter();
    highcutFilter.type = "lowpass";
    highcutFilter.frequency.value = 120;
    highcutFilter.Q = 15;

    var lowcutFilter = audioCtx.createBiquadFilter();
    lowcutFilter.type = "highpass";
    lowcutFilter.frequency.value = 40;
    lowcutFilter.Q = 15;

    var convolver = audioCtx.createConvolver();

    var drawVisual;

    if (navigator.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.getUserMedia(
            {
                audio: true
            },
            function (stream) {
                source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);
                highcutFilter.connect(convolver);
                lowcutFilter.connect(convolver);
                convolver.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                draw()

            },
            function (err) {
                console.log('The following getUserMedia error occured: ' + err);
            }
        );
    } else {
        console.log('getUserMedia not supported on your browser!');
    }

    function draw() {
        drawVisual = requestAnimationFrame(draw);
        analyser.fftSize = 128;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        var c = dataArray;

        var diff = c[c.length - 1] - c[0];
        diff = diff >= 0 ? diff : -diff;
        diff *= 1;

        diff = diff >= 256 ? 256 : diff;
        diff = parseInt(diff);

        emit(diff);
    }

}
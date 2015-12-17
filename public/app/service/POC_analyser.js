function POC_analyser(emit) {
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

    var highcutFilter = audioCtx.createBiquadFilter();
    highcutFilter.type = "lowpass";
    highcutFilter.frequency.value = 120;
    highcutFilter.Q = 15;

    var lowcutFilter = audioCtx.createBiquadFilter();
    lowcutFilter.type = "highpass";
    lowcutFilter.frequency.value = 40;
    lowcutFilter.Q = 15;

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
                highcutFilter.connect(convolver);
                lowcutFilter.connect(convolver);
                convolver.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                visualize();
            },

            // Error callback
            function (err) {
                console.log('The following getUserMedia error occured: ' + err);
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
            analyser.fftSize = 4096;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            var prev = 0;

            function draw() {
                drawVisual = requestAnimationFrame(draw);

                analyser.getByteFrequencyData(dataArray);

                //console.log(analyser.getByteFrequencyData(dataArray))

                var c = dataArray;
                process(c);

                //var color = 'rgb('+c[6]+','+c[6]+' ,'+ c[6]+')';
                //var diff = c[1] - prev;
                var diff = c[c.length - 1] - c[0];
                diff = diff >= 0 ? diff : -diff;
                diff *= 2;

                //diff *= 8;
                diff = diff >= 256 ? 256 : diff;
                //diff = diff >= 90 ? diff : 0;

                //var color = 'rgb(' + diff + ',' + diff + ' ,' + diff + ')';
                var color = 'rgb(' + diff + ' , ' + diff + ', ' + diff + ')';
                var colorBorder = 'rgb(' + 255-diff + ', ' + 255-diff + ', ' + 255-diff + ')';

                emit(diff);

                //function invert(r, g, b){r = 255-r, g = 255-g, b=255-b; return {'r':r,'g':g,'b':b}}

                var color1 = 'rgb(' + diff + ', 0, 0)';
                var color2 = 'rgb(' + diff + ',' + diff + ', 0)';
                var color3 = 'rgb(' + diff + ',0, ' + diff + ')';
                var color4 = 'rgb(0,0, ' + diff + ')';
                prev = c[0];

                //console.log(prev, diff);

                //
                //$('body .strobe').css({
                //    'background-color': color,
                //    'border-color': colorBorder
                //});
                //
                //$('body .strobe1').css({
                //    'background-color': color1
                //});
                //$('body .strobe2').css({
                //    'background-color': color2
                //});
                //$('body .strobe3').css({
                //    'background-color': color3
                //});
                //$('body .strobe4').css({
                //    'background-color': color4
                //});



                canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                var barWidth = (WIDTH / bufferLength) * 2.5;
                //var barWidth = (WIDTH / bufferLength);
                var barHeight;
                var x = 0;

                for (var i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];

                    canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                    x += barWidth + 1;
                }
            }

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
            mute.id = "activated";
            mute.innerHTML = "Unmute";
        } else {
            mute.id = "";
            mute.innerHTML = "Mute";
        }
    }
//------------------------------------------------------------------------------


//audio_file.onchange = function() {
//    var file = this.files[0];
//    var reader = new FileReader();
//    var context = new(window.AudioContext || window.webkitAudioContext)();
//    reader.onload = function() {
//        context.decodeAudioData(reader.result, function(buffer) {
//            prepare(buffer);
//        });
//    };
//    reader.readAsArrayBuffer(file);
//};

//function prepare(buffer) {
//    var offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
//    var source = offlineContext.createBufferSource();
//    source.buffer = buffer;
//    var filter = offlineContext.createBiquadFilter();
//    filter.type = "lowpass";
//    source.connect(filter);
//    filter.connect(offlineContext.destination);
//    source.start(0);
//    offlineContext.startRendering();
//    offlineContext.oncomplete = function(e) {
//        process(e);
//    };
//}

    function process(e) {
        var data = e;
        //If you want to analyze both channels, use the other channel later
        //var data = filteredBuffer.getChannelData(0);
        var max = arrayMax(data);
        var min = arrayMin(data);
        var threshold = min + (max - min) * 0.98;
        //console.log('threshold', threshold)
        var peaks = getPeaksAtThreshold(data, threshold);
        //console.log('peaks',peaks)
        var intervalCounts = countIntervalsBetweenNearbyPeaks(peaks);
        //console.log('intervalCounts', intervalCounts)
        var tempoCounts = groupNeighborsByTempo(intervalCounts);
        //console.log('tempoCounts', tempoCounts)
        tempoCounts.sort(function (a, b) {
            return b.count - a.count;
        });
        //if (tempoCounts.length) {
        //    output.innerHTML = tempoCounts[0].tempo;
        //}
    }

    function getPeaksAtThreshold(data, threshold) {
        var peaksArray = [];
        for (var i = 0; i < data.length;) {
            if (data[i] > threshold) {
                peaksArray.push(i);
                // Skip forward ~ 1/4s to get past this peak.
                i += 10000;
            }
            i++;
        }
        return peaksArray;
    }

    function countIntervalsBetweenNearbyPeaks(peaks) {
        var intervalCounts = [];
        peaks.forEach(function (peak, index) {
            for (var i = 0; i < 10; i++) {
                var interval = peaks[index + i] - peak;

                var foundInterval = intervalCounts.some(
                    function (intervalCount) {
                        if (intervalCount.interval === interval) {
                            return intervalCount.count++;
                        }
                    }
                );

                //Additional checks to avoid infinite loops in later processing
                if (!isNaN(interval) && interval !== 0 && !foundInterval) {
                    intervalCounts.push({
                        interval: interval,
                        count: 1
                    });
                }
            }
        });
        return intervalCounts;
    }

    function groupNeighborsByTempo(intervalCounts) {
        var tempoCounts = [];
        intervalCounts.forEach(function (intervalCount) {
            //Convert an interval to tempo
            var theoreticalTempo = 60 / (intervalCount.interval / 44100);
            theoreticalTempo = Math.round(theoreticalTempo);
            if (theoreticalTempo === 0) {
                return;
            }
            // Adjust the tempo to fit within the 90-180 BPM range
            while (theoreticalTempo < 90) theoreticalTempo *= 2;
            while (theoreticalTempo > 180) theoreticalTempo /= 2;

            var foundTempo = tempoCounts.some(function (tempoCount) {
                if (tempoCount.tempo === theoreticalTempo) return tempoCount.count += intervalCount.count;
            });
            if (!foundTempo) {
                tempoCounts.push({
                    tempo: theoreticalTempo,
                    count: intervalCount.count
                });
            }
        });
        return tempoCounts;
    }

    function arrayMin(arr) {
        var len = arr.length,
            min = Infinity;
        while (len--) {
            if (arr[len] < min) {
                min = arr[len];
            }
        }
        return min;
    }

    function arrayMax(arr) {
        var len = arr.length,
            max = -Infinity;
        while (len--) {
            if (arr[len] > max) {
                max = arr[len];
            }
        }
        return max;
    }


}
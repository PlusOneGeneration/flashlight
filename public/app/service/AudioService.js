angular.module('Flashlight')

    .service('AudioService', function ($q) {

        var deferred = $q.defer();

        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || msGetUserMedia;

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var compressor;

        var source;
        var analyser;
        var drawVisual;

        var createAndSetupAnalyser = function () {
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyser.minDecibels = -60;
            analyser.maxDecibels = -10;
            analyser.smoothingTimeConstant = 0.5;
        };

        var createAndSetupCompressor = function () {
            compressor = audioCtx.createDynamicsCompressor();
            compressor.knee.value = 40;
            compressor.threshold.value = -5;
            compressor.ratio.value = 10;
            compressor.reduction.value = 30;
            compressor.release.value = 0.1;
        };

        createAndSetupAnalyser();
        createAndSetupCompressor();

        var addFilter = function (type, frequency, Qfactor) {
            var filter = audioCtx.createBiquadFilter();
            filter.type = type;
            filter.frequency.value = frequency;
            filter.Q = Qfactor;

            return filter;
        };

        var lowcutFilter = addFilter('highpass', 50, 500);
        var highcutFilter = addFilter('lowpass', 100, 500);

        var theStream;

        var getAudioStream = function () {
            navigator.getUserMedia({audio: true},
                function (stream) {
                    source = audioCtx.createMediaStreamSource(stream);
                    source.connect(lowcutFilter);
                    lowcutFilter.connect(highcutFilter);
                    highcutFilter.connect(compressor);
                    compressor.connect(analyser);
                    deferred.resolve(stream);
                    theStream = stream;
                },
                function errorCallback(error) {
                    console.log('navigator.getUserMedia error: ', error);
                    deferred.reject(error);
                }
            );

            return deferred.promise;
        };

        var stopped = false;

        var listen = function (emit) {
            stopped = false;
            var fps = 5;

            var draw = function () {
                if(stopped) return;
                drawVisual = requestAnimationFrame(draw, 1000/fps);
                //drawVisual = requestAnimationFrame(draw);

                var bufferLength = analyser.frequencyBinCount;
                var dataArray = new Uint8Array(bufferLength);

                analyser.getByteFrequencyData(dataArray);

                var diff = dataArray[dataArray.length - 1] - dataArray[0];
                diff = diff >= 0 ? diff : -diff;
                diff *= 1.5;

                diff = diff >= 256 ? 256 : diff;
                diff = parseInt(diff);
                emit(diff);
            };

            getAudioStream().then(function () {
                draw();
            });
        };

        return {
            stop: function () {
                _.isFunction(theStream.stop) && theStream.stop();

                if(_.isFunction(theStream.getAudioTracks)){
                    _.each(theStream.getAudioTracks(), function (track) {
                        track.stop();
                    });
                }

                stopped = true;
            },
            addFilter: addFilter,
            listen: listen
        }
    })
;
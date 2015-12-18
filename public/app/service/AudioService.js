angular.module('Flashlight')

    .service('AudioService', ['$q', function ($q) {

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
            analyser.smoothingTimeConstant = 0.82;
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

        var getAudioStream = function () {
            navigator.getUserMedia({audio: true},
                function (stream) {
                    source = audioCtx.createMediaStreamSource(stream);
                    source.connect(lowcutFilter);
                    lowcutFilter.connect(highcutFilter);
                    highcutFilter.connect(compressor);
                    compressor.connect(analyser);
                    deferred.resolve(stream);
                },
                function errorCallback(error) {
                    console.log('navigator.getUserMedia error: ', error);
                    deferred.reject(error);
                }
            );

            return deferred.promise;
        };

        var listen = function (emit) {
            var draw = function () {
                drawVisual = requestAnimationFrame(draw);
                var bufferLength = analyser.frequencyBinCount;
                var dataArray = new Uint8Array(bufferLength);

                analyser.getByteFrequencyData(dataArray);

                var diff = dataArray[dataArray.length - 1] - dataArray[0];
                diff = diff >= 0 ? diff : -diff;
                diff *= 1.7;

                diff = diff >= 256 ? 256 : diff;
                diff = parseInt(diff);
                emit(diff);
            };

            getAudioStream().then(function () {
                draw();
            });
        };

        return {
            addFilter: addFilter,
            listen: listen
        }
    }])
;
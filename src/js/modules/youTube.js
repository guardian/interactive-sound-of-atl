var playerHelpers = require('../modules/playerHelpers.js');
var enhance = require('../modules/enhance.js');

var youTubePlayer, throttle = true;

module.exports =  {
    init: function() {
        var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubePlayerAPIReady = function() {
          this.createPlayer();
        }.bind(this);
    },

    play: function(url) {
        if (playerHelpers.isPlaying()) {
            this.pauseVideo();
        } else {
            this.playVideo(url);
        }
    },

    createPlayer: function() {
        youTubePlayer = new YT.Player('uit-player__video', {
            height: '270',
            width: '480',
            playerVars: {
                'controls': 0,
                'rel': 0,
                'showinfo': 0,
                'modestbranding': 1,
                'playsinline': 1
            },
            events: {
                'onStateChange': this.onStateChange,
                'onReady': enhance.init
            }
        });
    },

    getId: function(url) {
        return url.split('?v=')[1];
    },

    onStateChange: function(event) {
        var state = event.data;

        // ended
        if (state === 0) {
            if (throttle == true) {
                playerHelpers.hasEnded();
                throttle = false;
                setTimeout(function() {
                    throttle = true;
                }, 5000);
            }
        }

        // playing
        if (state === 1) {
            playerHelpers.updatePlayingStatus(true);
        }

        // paused
        if (state === 2) {
            playerHelpers.updatePlayingStatus(false);
        }
    },

    playVideo: function(url) {
        if (youTubePlayer.getVideoData().video_id) {
            if (this.getId(url) === youTubePlayer.getVideoData().video_id) {
                youTubePlayer.playVideo();
            } else {
                youTubePlayer.loadVideoById(this.getId(url));
                // youTubePlayer.loadVideoById({videoId: this.getId(url), startSeconds: 10, endSeconds: 15});
            }
        } else {
            youTubePlayer.loadVideoById(this.getId(url));
        }
    },

    pauseVideo: function() {
        youTubePlayer.pauseVideo();
    },

    stopVideo: function() {
        if (youTubePlayer !== undefined) {
            playerHelpers.updatePlayingStatus(false);
        }
    }
};

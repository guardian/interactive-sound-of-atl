var youTube = require('../modules/youTube.js');
var playerHelpers = require('../modules/playerHelpers.js');
var toggles = require('../modules/toggles.js');

var scrollTop = 0, isScrolling = false;

module.exports =  {
    init: function() {
        this.bindings();
        youTube.init();
    },

    bindings: function() {
        $('.uit-track__button').click(function(el) {
            this.play($(el.currentTarget).parent().parent().parent());
        }.bind(this));
        $('.uit-player__button--play').click(function() {
            this.play($('.is-current'));
        }.bind(this));
        $('.uit-player__button--previous').click(function() {
            this.playPreviousTrack();
        }.bind(this));
        $('.uit-player__button--next').click(function() {
            this.playNextTrack();
        }.bind(this));
        $(window).scroll(function() {
            this.scrolling();
        }.bind(this));
        $('.uit-player').hover(function() {
            this.hover();
        }.bind(this));
        $('.uit-player').click(function() {
            this.hover();
        }.bind(this));
        $('.uit-player').mouseleave(function() {
            this.mouseout();
        }.bind(this));
    },

    play: function(el) {
        $('.uit-player').addClass('is-full');
        $('.uit-player').removeClass('is-mini');
        var platform = $(el).attr('data-platform');

        if (this.isNewTrack(el)) {
            youTube.stopVideo();
            this.newTrack(el);
            toggles.expand(el);
        }

        this.updatePlayerInfo(el);

        if (platform === 'youtube') {
            youTube.play($(el).attr('data-youtube'));
        }
    },

    updatePlayerInfo: function(el) {
        $('.is-current').removeClass('is-current');
        $(el).addClass('is-current');

        $('.uit-player__info-artist').text($(el).attr('data-artist'));
        $('.uit-player__info-track').text($(el).attr('data-track'));
    },

    isNewTrack: function(el) {
        return (!$(el).hasClass('is-current'));
    },

    newTrack: function(el) {
        $(el).on('ended', function() {
            this.playNextTrack();
        }.bind(this));
    },

    playNextTrack: function() {
        var target = $('.is-current').next().length ? $('.is-current').next() : $('.uit-track:first-of-type');
        toggles.collapse($('.is-current'));
        this.play(target);
        this.scrollTo();
    },

    playPreviousTrack: function() {
        var target = $('.is-current').prev().length ? $('.is-current').prev() : $('.uit-track:last-of-type');
        toggles.collapse($('.is-current'));
        this.play(target);
        this.scrollTo();
    },

    scrollTo: function(el) {
        setTimeout(function() {
            $('html, body').animate({
                scrollTop: $('.is-current').offset().top
            }, {
                duration: 1000,
                start: function() {
                    isScrolling = true;
                },
                complete: function() {
                    isScrolling = false;
                    scrollTop = $(window).scrollTop();
                }
            });
        }, 400);
    },

    scrolling: function() {
        var newScrollTop = $(window).scrollTop();
        if (isScrolling === false) {
            if (newScrollTop > scrollTop + 100 || newScrollTop < scrollTop - 100) {
                scrollTop = newScrollTop;
                if ($('.uit-player').hasClass('is-full')) {
                    $('.uit-player').removeClass('is-full');
                    $('.uit-player').addClass('is-mini');
                }
            }
        }
    },

    hover: function() {
        if ($('.uit-player').hasClass('is-mini')) {
            $('.uit-player').removeClass('is-mini');
            $('.uit-player').addClass('is-full');
        }
    },

    mouseout: function() {
        if ($('.uit-player').hasClass('is-full') && playerHelpers.isPlaying() !== true) {
            $('.uit-player').removeClass('is-full');
            $('.uit-player').addClass('is-mini');
        }
    }
};

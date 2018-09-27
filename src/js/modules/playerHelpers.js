module.exports = {
    updatePlayingStatus: function(isPlaying) {
        if (isPlaying) {
            $('.uit').attr('data-playing', 'true');
        } else {
            $('.uit').attr('data-playing', 'false');
        }
    },

    isPlaying: function() {
        return ($('.uit').attr('data-playing') == 'true');
    },

    hasEnded: function() {
        $('.is-current').trigger('ended');
    }
}
module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.uit-track__expand-button').click(function(el) {
            this.toggle($(el.currentTarget).parent().parent());
        }.bind(this));
    },

    expand: function(el) {
        $(el).addClass('is-expanded');
        $(el).removeClass('is-closed');
    },

    collapse: function(el) {
        $(el).removeClass('is-expanded');
        $(el).addClass('is-closed');
    },

    toggle: function(el) {
        if ($(el).hasClass('is-expanded')) {
            this.collapse(el);
        } else {
            this.expand(el);
        }
    }
};

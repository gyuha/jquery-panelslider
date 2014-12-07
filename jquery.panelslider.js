/*
 * jQuery Panel Slider plugin v0.1.1
 * branch by : https://github.com/eduardomb/jquery-panelslider
 */
(function($) {
    'use strict';

    var $body = $('body'),
        _sliding = false,
        _fullWidth = false,
        _screenWidth = 0,
        _screenHeight = 0;

    function updateContainerSize()
    {
        document.body.style.overflow = "hidden";
        var $win = $(window);
        _screenWidth = $win.width();
        _screenHeight = $win.height();
        console.log(_screenWidth);
        $("#container").css({width:_screenWidth, height: _screenHeight});
        document.body.style.overflow = "";
    }

    function _slideIn(panel, options) {
        var active = $('.ps-active-panel');
        var panelWidth = options.fullWidth?_screenWidth:panel.outerWidth(true),
            bodyAnimation = {},
            panelAnimation = {};

        if(panel.is(':visible') || _sliding) {
            return;
        }

        _sliding = true;
        panel.addClass('ps-active-panel').css({
            position: 'fixed',
            top: 0,
            height: '100%',
            'z-index': 999999
        });
        panel.data(options);

        switch (options.side) {
            case 'left':
                panel.css({
                    left: '-' + panelWidth + 'px',
                    right: 'auto',
                    width: panelWidth
                });
                bodyAnimation['margin-left'] = '+=' + panelWidth;
                panelAnimation.left = '+=' + panelWidth;
                break;

            case 'right':
                panel.css({
                    left: 'auto',
                    right: '-' + panelWidth + 'px',
                    width: panelWidth
                });
                bodyAnimation['margin-left'] = '-=' + panelWidth;
                panelAnimation.right = '+=' + panelWidth;
                break;
        }

        $body.animate(bodyAnimation, options.duration);
        panel.show().animate(panelAnimation, options.duration, function() {
            _sliding = false;

            if(typeof options.onOpen == 'function') {
                options.onOpen();
            }
        });
    }

    $.panelslider = function(element, options) {
        var active = $('.ps-active-panel');
        var defaults = {
            side: 'left',     // panel side: left or right
            duration: 200,    // Transition duration in miliseconds
            clickClose: true, // If true closes panel when clicking outside it
            onOpen: null,      // When supplied, function is called after the panel opens
            fullWidth: false   // full width size panel open
        };

        options = $.extend({}, defaults, options);
        _fullWidth = options.fullWidth;
        updateContainerSize();
        // If another panel is opened, close it before opening the new one
        if(active.is(':visible') && active[0] != element[0]) {
            $.panelslider.close(function() {
                _slideIn(element, options);
            });
        } else if(!active.length || active.is(':hidden')) {
            _slideIn(element, options);
        }
    };

    $.panelslider.close = function(callback) {
        var active = $('.ps-active-panel'),
            duration = active.data('duration'),
            panelWidth = _fullWidth?_screenWidth:active.outerWidth(true),
            bodyAnimation = {},
            panelAnimation = {};

        if(!active.length || active.is(':hidden') || _sliding) {
            return;
        }

        _sliding = true;

        switch(active.data('side')) {
            case 'left':
                bodyAnimation['margin-left'] = '-=' + panelWidth;
                panelAnimation.left = '-=' + panelWidth;
                break;

            case 'right':
                bodyAnimation['margin-left'] = '+=' + panelWidth;
                panelAnimation.right = '-=' + panelWidth;
                break;
        }

        active.animate(panelAnimation, duration);
        $body.animate(bodyAnimation, duration, function() {
            active.hide();
            active.removeClass('ps-active-panel');
            _sliding = false;

            if(callback) {
                callback();
            }
        });
    };

    // Bind click outside panel and ESC key to close panel if clickClose is true
    $(document).bind('click keyup', function(e) {
        var active = $('.ps-active-panel');

        if(e.type == 'keyup' && e.keyCode != 27) {
            return;
        }

        if(active.is(':visible') && active.data('clickClose')) {
            $.panelslider.close();
        }
    });

    // Resize Event
    $(window).on('resize', function(){
        updateContainerSize();
    });

    // Prevent click on panel to close it
    $(document).on('click', '.ps-active-panel', function(e) {
        e.stopPropagation();
    });

    $.fn.panelslider = function(options) {
        this.click(function(e) {
            var active = $('.ps-active-panel'),
                panel = $(this.getAttribute('href'));

            // Close panel if it is already opened otherwise open it
            if (active.is(':visible') && panel[0] == active[0]) {
                $.panelslider.close();
            } else {
                $.panelslider(panel, options);
            }

            e.preventDefault();
            e.stopPropagation();
        });

        return this;
    };

    updateContainerSize();
})(jQuery);

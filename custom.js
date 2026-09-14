var resizeId;
var openedSidePanel;
var bodyHasResponsiveNavigation = 0;

(function($){
    "use strict";

    // 1. Page Preloader (Updated for jQuery 4.0)
    $(window).on('load', function(){
        $('.fade-in').css({ position: 'relative', opacity: 0, top: -14 });
        setTimeout(function(){
            $('#preload-content').fadeOut(400, function(){
                $('#preload').fadeOut(800);
                setTimeout(function(){
                    $('.fade-in').each(function(index) {
                        $(this).delay(400 * index).animate({ top : 0, opacity: 1 }, 800);
                    });
                }, 800);
            });
        }, 400);
    }); 
    
    // 2. Modal windows & Side panel
    if( $(".tse-scrollable").length && $.fn.TrackpadScrollEmulator ){
        $(".tse-scrollable").TrackpadScrollEmulator();
    }

    $(".open-side-panel, [data-toggle=modal], [data-bs-toggle=modal]").on("click", function(e){
        e.preventDefault();
        var target = $(this).attr("href");
        if(target && target !== '#') {
            $("body").addClass("show-panel");
            $(target).addClass("show-it");
            $(this).addClass("is-active");
            openedSidePanel = $(target);
        }
    });

    $(".backdrop, .modal-backdrop, .modal .close, .close-panel").on("click", function(e){
        $(".open-side-panel").removeClass("is-active");
        if( $("body").hasClass("show-panel") ){
            $("body").removeClass("show-panel");
            if(openedSidePanel) {
                openedSidePanel.removeClass("show-it");
            }
        }
    });

    $(document).on("keydown", function(e) {
        if (e.key === "Escape" || e.which === 27) { // ESC key
            $(".close-panel").trigger("click");
        }
    });

    $(".modal").on("hide.bs.modal", function (e) {
        if( $("body").hasClass("show-panel") ){
            $("body").removeClass("show-panel");
        }
    });

    $(".nav-btn").on("click", function(e){
        $(".nav-btn-only").toggleClass("show-nav");
    });
    
    // 3. Count Down
    if( $(".count-down").length && $.fn.countdown ){
        var seconds = $(".count-down").attr("data-countdown-seconds");
        $(".count-down").countdown({ until: seconds, padZeroes: true, onExpiry: liftOff });
        function liftOff() { window.location.href = 'https://www.myetv.tv'; }
    }
    
    // 4. Validate subscribe form
    if ($('#subscribe-form').length && $.fn.validate) {
        $('<div class="loading"><span class="bounce1"></span><span class="bounce2"></span><span class="bounce3"></span></div>').hide().appendTo('.form-wrap');
        $('<div class="success"></div>').hide().appendTo('.form-wrap');
        $('#subscribe-form').validate({
            rules: {
                subscribe_email: { required: true, email: true }
            },
            messages: {
                subscribe_email: {
                    required: 'Email address is required',
                    email: 'Email address is not valid'
                }
            },
            errorElement: 'span',
            errorPlacement: function(error, element){
                error.appendTo(element.parent());
            },
            submitHandler: function(form){
                $(form).hide();
                $('#subscribe .loading').css({ opacity: 0 }).show().animate({ opacity: 1 });
                $.post($(form).attr('action'), $(form).serialize(), function(data){
                    $('#subscribe .loading').animate({opacity: 0}, function(){
                        $(this).hide();
                        $('#subscribe .success').show().html('<p>Thank you for subscribing!</p>').animate({opacity: 1});
                    });
                });
                return false;
            }
        });
    }

})(jQuery);

$(document).ready(function() {
    "use strict";

    // 5. Responsive Video Scaling
    if ($(".video").length > 0 && $.fn.fitVids) {
        $(".video").fitVids(); // Fixed bug: was $(this).fitVids() inside ready wrapper
    }

    // 6. Magnific Popup
    if ($('.image-popup').length > 0 && $.fn.magnificPopup) {
        $('.image-popup').magnificPopup({
            type:'image',
            removalDelay: 300,
            mainClass: 'mfp-fade',
            overflowY: 'scroll'
        });
    }

    if( $("body").hasClass("nav-btn-only") ){
        bodyHasResponsiveNavigation = 1;
    }

    responsiveNavigation();
});

// FIXED: jQuery 4.0 removed $(window).load(fn). Must use $(window).on('load', fn)
$(window).on('load', function(){
    "use strict";
    $(".animate").addClass("in");
});

// FIXED: jQuery 4.0 removed $(window).resize(fn). Must use $(window).on('resize', fn)
$(window).on('resize', function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 250);
});

// 7. Do after resize
function doneResizing(){
    responsiveNavigation();
    if ($.fn.TrackpadScrollEmulator) {
        $(".tse-scrollable").TrackpadScrollEmulator("recalculate");
    }
}

function responsiveNavigation(){
    if( bodyHasResponsiveNavigation === 0 ){
        if( typeof viewport !== "undefined" && !viewport.is('lg') ){
            $("body").addClass("nav-btn-only");
        }
        else {
            $("body").removeClass("nav-btn-only");
        }
    }
}

var viewport = (function() {
    var viewPorts = ['xs', 'sm', 'md', 'lg'];

    var viewPortSize = function() {
        return window.getComputedStyle(document.body, ':before').content.replace(/"/g, '');
    };

    var is = function(size) {
        if ( viewPorts.indexOf(size) === -1 ) throw "no valid viewport name given";
        return viewPortSize() === size;
    };

    var isEqualOrGreaterThan = function(size) {
        if ( viewPorts.indexOf(size) === -1 ) throw "no valid viewport name given";
        return viewPorts.indexOf(viewPortSize()) >= viewPorts.indexOf(size);
    };

    return {
        is: is,
        isEqualOrGreaterThan: isEqualOrGreaterThan
    };
})();

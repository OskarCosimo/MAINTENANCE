
var resizeId;
var openedSidePanel;
var bodyHasResponsiveNavigation = 0;

(function($){
	"use strict"

// 1. Page Preloader //
		$(window).on('load', function(){
		$('.fade-in').css({ position: 'relative', opacity: 0, top: -14 });
		setTimeout(function(){
			$('#preload-content').fadeOut(400, function(){
				$('#preload').fadeOut(800);
				setTimeout(function(){
					$('.fade-in').each(function(index) {
						$(this).delay(400*index).animate({ top : 0, opacity: 1 }, 800);
					});
				}, 800);
			});
		}, 400);
	});	
	
//  2. Modal windows //	
	 if( $(".tse-scrollable").length ){
        $(".tse-scrollable").TrackpadScrollEmulator();
    }

    $(".open-side-panel, [data-toggle=modal]").on("click", function(e){
        e.preventDefault();
        $("body").addClass("show-panel");
        $( $(this).attr("href") ).addClass("show-it");
        $(this).addClass("is-active");
        openedSidePanel = $( $(this).attr("href") );
    });

    $(".backdrop, .modal-backdrop, .modal .close, .close-panel").on("click", function(e){
        $(".open-side-panel").removeClass("is-active");
        if( $("body").hasClass("show-panel") ){
            $("body").removeClass("show-panel");
            openedSidePanel.removeClass("show-it");
        }
    });

    $(document).keydown(function(e) {
        switch(e.which) {
            case 27: // ESC
                $(".close-panel").trigger("click");
                break;
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
	
	
// 3. Count Down //
    if( $(".count-down").length ){
        var year = parseInt( $(".count-down").attr("data-countdown-year"), 10 );
        var month = parseInt( $(".count-down").attr("data-countdown-month"), 10 ) - 1;
        var day = parseInt($(".count-down").attr("data-countdown-day"), 10);
        var seconds = $(".count-down").attr("data-countdown-seconds");
        $(".count-down").countdown({ until: seconds, padZeroes: true, onExpiry: liftOff });
        function liftOff() { self.location = 'https://www.myetv.tv'; }
        //$(".count-down").countdown({until: new Date(year, month, day), padZeroes: true});
    }
	
	
// 4. Validate subscribe form //
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

})(jQuery);

$(document).ready(function($) {
"use strict"

// 5. Responsive Video Scaling //
    if ($(".video").length > 0) {
        $(this).fitVids();
    }

// 6. Magnific Popup //
    if ($('.image-popup').length > 0) {
        $('.image-popup').magnificPopup({
            type:'image',
            removalDelay: 300,
            mainClass: 'mfp-fade',
            overflowY: 'scroll'
        });
    }

    if ($('.video-popup').length > 0) {
        $('.video-popup').magnificPopup({
            type:'iframe',
            removalDelay: 300,
            mainClass: 'mfp-fade',
            overflowY: 'scroll',
            iframe: {
                markup: '<div class="mfp-iframe-scaler">'+
                    '<div class="mfp-close"></div>'+
                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                    '</div>',
                patterns: {
                    youtube: {
                        index: 'youtube.com/',
                        id: 'v=',
                        src: 'http://youtube.com/embed/%id%?autoplay=1'
                    },
                    vimeo: {
                        index: 'vimeo.com/',
                        id: '/',
                        src: 'http://player.vimeo.com/video/%id%?autoplay=1'
                    }
                },
                srcAction: 'iframe_src'
            }
        });
    }

    if( $(".count-down").length ){
        var year = parseInt( $(".count-down").attr("data-countdown-year"), 10 );
        var month = parseInt( $(".count-down").attr("data-countdown-month"), 10 ) - 1;
        var day = parseInt($(".count-down").attr("data-countdown-day"), 10);
        var seconds = $(".count-down").attr("data-countdown-seconds");
        $(".count-down").countdown({ until: seconds, padZeroes: true, onExpiry: liftOff2 });
        function liftOff2() { self.location = 'https://www.myetv.tv'; }
        //$(".count-down").countdown({until: new Date(year, month, day), padZeroes: true});
    }



    $(".bg-transfer").each(function() {
        $(this).css("background-image", "url("+ $(this).find("img").attr("src") +")" );
    });

    if( $("body").hasClass("nav-btn-only") ){
        bodyHasResponsiveNavigation = 1;
    }

    responsiveNavigation();
    initializeOwl();

});


$(window).load(function(){
    $(".animate").addClass("in");

});

$(window).resize(function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 250);
});



// 7. Do after resize //
function doneResizing(){
    responsiveNavigation();
    $(".tse-scrollable").TrackpadScrollEmulator("recalculate");
}


// 8. Owl-Carousel //
function initializeOwl(){
    if( $(".owl-carousel").length ){
        $(".owl-carousel").each(function() {

            var items = parseInt( $(this).attr("data-owl-items"), 10);
            if( !items ) items = 1;

            var nav = parseInt( $(this).attr("data-owl-nav"), 2);
            if( !nav ) nav = 0;

            var dots = parseInt( $(this).attr("data-owl-dots"), 2);
            if( !dots ) dots = 0;

            var center = parseInt( $(this).attr("data-owl-center"), 2);
            if( !center ) center = 0;

            var loop = parseInt( $(this).attr("data-owl-loop"), 2);
            if( !loop ) loop = 0;

            var margin = parseInt( $(this).attr("data-owl-margin"), 2);
            if( !margin ) margin = 0;

            var autoWidth = parseInt( $(this).attr("data-owl-auto-width"), 2);
            if( !autoWidth ) autoWidth = 0;

            var navContainer = $(this).attr("data-owl-nav-container");
            if( !navContainer ) navContainer = 0;

            var autoplay = $(this).attr("data-owl-autoplay");
            if( !autoplay ) autoplay = 0;

            var fadeOut = $(this).attr("data-owl-fadeout");
            if( !fadeOut ) fadeOut = 0;
            else fadeOut = "fadeOut";

            $(this).owlCarousel({
                navContainer: navContainer,
                animateOut: fadeOut,
                autoplaySpeed: 2000,
                autoplay: autoplay,
                autoheight: 1,
                center: center,
                loop: loop,
                margin: margin,
                autoWidth: autoWidth,
                items: items,
                nav: nav,
                dots: dots,
                autoHeight: true,
                navText: []
            });
        });

    }
}

function responsiveNavigation(){

    if( bodyHasResponsiveNavigation == 0 ){
        if( !viewport.is('lg') ){
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
        if ( viewPorts.indexOf(size) == -1 ) throw "no valid viewport name given";
        return viewPortSize() == size;
    };

    var isEqualOrGreaterThan = function(size) {
        if ( viewPorts.indexOf(size) == -1 ) throw "no valid viewport name given";
        return viewPorts.indexOf(viewPortSize()) >= viewPorts.indexOf(size);
    };

    return {
        is: is,
        isEqualOrGreaterThan: isEqualOrGreaterThan
    }
	
})(jQuery);
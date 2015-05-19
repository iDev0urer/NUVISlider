(function ($) {
    var NUVISlider = function (element, options) {
        var elem = $(element);
        var obj = this;

        var defaults = {
            slideElement        : '.slide',
            anchor              : '.slide-link',
            activeClass         : 'active',
            elementsToShow      : 1,
            autoPlay            : true,
            direction           : 'ltr',
            pauseOnHover        : true,
            timing: 5000,
            slideTransition     : {
                easing          : 'easeIn',
                duration        : 500
            }
        };

        var config = $.extend(defaults, options || {});
        
        var slides, slideCount, sections, anchors, anchorCount, width;
        
        slides = $(elem).find(config.slideElement);
        slideCount = slides.length;
        sections = slideCount/config.elementsToShow;
        anchors = $('body').find(config.anchor);
        anchorCount = anchors.length;
        width = $('body').width();
        var active = false;
        var direction = config.direction === null ? 'rtl' : config.direction;
        
        // Initialize the slider
        var init = function() {
            obj.buildSlides();
            if (config.autoPlay) {
                obj.startAutoPlay();
            }
        };
        
        // Add event listener for when the anchor is clicked
        $(config.anchor).on('click', function(e) {
            e.preventDefault();
            var slideId = $(this).attr('href');
            var slide = elem.find(slideId).index();
            if (active === false) {
                obj.gotoSlide(slide);
                
                if (config.autoPlay === true) {
                    obj.stopAutoPlay();
                    obj.startAutoPlay();
                }
            }
        });
        
        if (config.pauseOnHover === true && config.autoPlay === true) {
            $(config.slideElement).parent().on("mouseenter", function() { obj.stopAutoPlay(); console.log('paused'); } );
            $(config.slideElement).parent().on("mouseleave", function() { obj.startAutoPlay(); console.log('playing'); } );
        }
        
        // Build out the slides
        this.buildSlides = function() {
            
            var slide, i;
            
            for (i=0;i<slideCount; i++) {
                slide = slides[i];
                
                if (direction === 'rtl') {
                    if (i === 0) {
                        $(slide).css( 'left', '0px' ).addClass(config.activeClass);
                    } else {
                        $(slide).css({ left: width }).removeClass(config.activeClass);
                    }
                }
                else if (direction === 'ltr') {
                    if (i === 0) {
                        $(slide).css( 'left', '0px' ).addClass(config.activeClass);
                    } else {
                        $(slide).css({ left: -width }).removeClass(config.activeClass);
                    }
                }
                
            }
            
        };
        
        // Go to a particular slide
        this.gotoSlide = function(slide) {
            var toSlide, fromSlide;
            active = true;
            toSlide = $(slides[slide]).index();
            fromSlide = $(config.slideElement + '.'+config.activeClass).index();
            
            if (direction === 'rtl') {
                $(slides[toSlide]).animate({ left: '0px' }, config.slideTransition.duration).addClass(config.activeClass);
                $(slides[fromSlide]).animate({ left: -width }, config.slideTransition.duration, function() {
                    $(this).removeClass(config.activeClass);
                    $(this).css({ left: width });
                    active = false;
                });
            }
            else if (direction === 'ltr') {
                $(slides[toSlide]).animate({ left: '0px' }, config.slideTransition.duration).addClass(config.activeClass);
                $(slides[fromSlide]).animate({ left: width }, config.slideTransition.duration, function() {
                    $(this).removeClass(config.activeClass);
                    $(this).css({ left: -width });
                    active = false;
                });
            }
            
        };
        
        this.gotoNext = function() {
            var currentSlide, nextSlide;
            
            currentSlide = $(config.slideElement + '.'+config.activeClass).index();
            nextSlide = currentSlide + 1;
            if (nextSlide < slideCount) {
                nextSlide = currentSlide + 1;
            } else {
                nextSlide = 0;
            }
            
            obj.gotoSlide(nextSlide);
        };
        
        var interval;
        this.startAutoPlay = function() {
            interval = setInterval(function() { 
                obj.gotoNext(); 
            }, config.timing);
        };

        this.stopAutoPlay = function() {
            clearInterval(interval);
        };
        
        
        init();

    };

    $.fn.nuvislider = function (options) {
        return this.each(function () {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('nuvislider')) {
                return;
            }

            // pass options to plugin constructor
            var nuvislider = new NUVISlider(this, options);

            // Store plugin object in this element's data
            element.data('nuvislider', nuvislider);
        });
    };
})(jQuery);
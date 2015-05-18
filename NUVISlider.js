/*!
 * slideMe jQuery Plugin
 * Original author: @iDev0urer
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

        // Create the defaults
        var pluginName = 'NUVISlider',
            defaults = {
                slideElement    : '.slide',
                anchor          : '.slide-link',
                activeClass     : 'active',
                elementsToShow  : 1,
                automatic       : false,
                pauseOnHover    : true,
                timing          : 5000,
                slideTransition : {
                    easing      : 'easeIn',
                    duration    : 1500
                }
            };

        function Plugin( element, options ) {
            this.element = element;

            // jQuery has an extend method that merges the 
            // contents of two or more objects, storing the 
            // result in the first object. The first object 
            // is generally empty because we don't want to alter 
            // the default options for future instances of the plugin
            this.options = $.extend( {}, defaults, options) ;

            this._defaults = defaults;
            this._name = pluginName;

            this.init();
        }

        Plugin.prototype.init = function () {

        var options, self, slide, slides, slideCount, anchors, anchorCount, href, thisSlide, pos, index,i, firstEl, width, currentSlide, paused;

        options = this.options;
        self = this.element;
        slides = $(self).find(options.slideElement);
        slideCount = slides.length;
        sections = slideCount/options.elementsToShow;
        anchors = $('body').find(options.anchor);
        anchorCount = anchors.length;
        width = $('body').width();
            
        function init() {
            position_slides();
            $(options.anchor + ':first-child').addClass(options.activeClass);
            
            if (options.automatic == true) {
                paused = false;
                playSlider();
            }
            
            if (options.pauseOnHover == true) {
                $(options.slideElement).parent().on("mouseenter", function() { paused = true; console.log('paused'); } );
                $(options.slideElement).parent().on("mouseleave", function() { paused = false; console.log('playing'); } );
            }
            
            console.log($(options.slideElement).parent());
        }
            
        function position_slides() {
            
            for (i=0;i<slideCount; i++) {
                slide = slides[i];
                
                if (i!=0) {
                    $(slide).css({ left: width, opacity: 0 }).removeClass(options.activeClass);
                } else {
                    $(slide).css( 'left', '0px' ).addClass(options.activeClass);
                }
            }
            
        }
            
        $(options.anchor).on('click', function(e) {
            e.preventDefault();
            href = $(this).attr('href');
            href = $(href).index();
            
            $(this).addClass(options.activeClass);
            slideTo(href);
        });
            
        function playSlider() {
            timing = options.timing;
                setTimeout (function() {
                    if (paused == false) {
                        slideToNext();                
                    }
                    playSlider();
                }, timing);
        }
            
        function slideToNext() {
            currentSlide = $(options.slideElement + '.'+options.activeClass).index();
            var nextSlide = currentSlide + 1;
            if (nextSlide < slideCount) {
                nextSlide = currentSlide + 1;
            } else {
                nextSlide = 0;
            }
            
            slideTo(nextSlide);
        };
            
        function slideTo(index) {
            nextSlide = $(slides[index]);
            pos = nextSlide.css('left');
            currentAnchor = $('a[href="#' + nextSlide.attr('id') + '"]');
            
            
            $.each($(options.anchor), function(i,el) {
                $(el).removeClass(options.activeClass);
            });
            
            currentAnchor.addClass(options.activeClass);
            
            for  (i=0; i<slideCount; i++) {
                
                slide = slides[i];

                if ( i == nextSlide.index() ) {
                    
                    $(slide).css({ opacity: 1 }).animate({ left: '0px' }, options.slideTransition.duration).addClass(options.activeClass);
                    
                } else {
                    $(slides[i]).animate({ left: -width }, options.slideTransition.duration, function(e) {
                        $(this).css({ left: width, opacity: 0 }).removeClass(options.activeClass);
                    });
                }
            }
        }
            
        init();

        };

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[pluginName] = function ( options ) {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, 
                    new Plugin( this, options ));
                }
            });
        };

})( jQuery, window, document );
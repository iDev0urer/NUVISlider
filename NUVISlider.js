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
                elementsToShow  : 1,
                automatic       : false,
                slideTransition : {
                    transition  : 'linear',
                    duration    : '.5s'
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

        var options, self, slide, slides, slideCount, anchors, anchorCount, href, thisSlide, pos, index,i, firstEl, width, currentSlide;

        options = this.options;
        self = this.element;
        slides = $(self).find(options.slideElement);
        slideCount = slides.length;
        anchors = $('body').find(options.anchor);
        anchorCount = anchors.length;
        width = $('body').width();
            
        function init() {
            position_slides();
        }
            
        function position_slides() {
            
            for (i=0;i<slideCount; i++) {
                slide = slides[i];
                
                if (i!=0) {
                    $(slide).css( 'left', width );
                } else {
                    $(slide).css( 'left', '0px' );
                }
            }
            
        }
            
        $(options.anchor).on('click', function(e) {
            e.preventDefault();
            href = $(this).attr('href');
            // window.location.hash = href;
            slideTo(href);
        });
            
        function slideTo(element) {
            nextSlide = $(element);
            pos = nextSlide.css('left');
            
            for  (i=0; i<slideCount; i++) {
                
                slide = slides[i];

                if ( i == nextSlide.index() ) {
                    
                    $(slide).animate({ left: '0px' });
                    
                } else {
                    $(slides[i]).animate({ left: -width, opacity: 0 }, 500, function(e) {
                        $(this).css({ left: width, opacity: 1 });
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
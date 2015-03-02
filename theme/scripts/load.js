// save the original function object
var _superScrollSpy = $.fn.scrollspy;

// add a array of id's that need to be excluded
$.extend( _superScrollSpy.defaults, {
    excluded_ids : []
});

// create a new constructor
var ScrollSpy = function(element, options) {
    _superScrollSpy.Constructor.apply( this, arguments )
}

// extend prototypes and add a super function
ScrollSpy.prototype = $.extend({}, _superScrollSpy.Constructor.prototype, {
    constructor: ScrollSpy
    , _super: function() {
        var args = $.makeArray(arguments)
        // call bootstrap core
        _superScrollSpy.Constructor.prototype[args.shift()].apply(this, args)
    }
    , activate: function (target) {
        //if target is on our exclusion list, prevent the scrollspy to activate
        if ($.inArray(target, this.options.excluded_ids)>-1) {
            return
        }
        this._super('activate', target)
    }
});

// override the old initialization with the new constructor
$.fn.scrollspy = $.extend(function(option) {
    var args = $.makeArray(arguments),
    option = args.shift()

    //this runs everytime element.scrollspy() is called
    return this.each(function() {
        var $this = $(this)
        var data = $this.data('scrollspy'),
            options = $.extend({}, _superScrollSpy.defaults, $this.data(), typeof option == 'object' && option)

        if (!data) {
            $this.data('scrollspy', (data = new ScrollSpy(this, options)))
        }
        if (typeof option == 'string') {
            data[option].apply( data, args )
        }
    });
}, $.fn.scrollspy);

/* Google Maps API */
if (typeof google != 'undefined')
{
	var map_latlng = new google.maps.LatLng(-6.155611,106.875333);
	var map_options = {
		zoom: 1,
		center: map_latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: false,
		scaleControl: false,
		mapTypeControl: false,
		disableDefaultUI: true,
		styles: [
			{
				stylers: [
	            	{ saturation: -100 },
	        		//{ hue: "#ffffff" }
	            ]
			},
			{
			    elementType: "labels.text.fill",
			    stylers: [{ color: themerPrimaryColor }]
			}
		]
	};
	
	var markerIconDefault_image = new google.maps.MarkerImage("theme/images/marker.png",
			// This marker is 44 pixels wide by 56 pixels tall.
			new google.maps.Size(44, 56),
			// The origin for this image is 0,0.
			new google.maps.Point(0, 0),
			// The anchor for this image is the base of the flagpole at 0,32.
			new google.maps.Point(22, 56));

	var markerIconDefault_shadow = new google.maps.MarkerImage("theme/images/marker_shadow.png",
			// This marker is 44 pixels wide by 56 pixels tall.
			new google.maps.Size(37, 21),
			// The origin for this image is 0,0.
			new google.maps.Point(0,0),
			// The anchor for this image is the base of the flagpole at 0,32.
			new google.maps.Point(20, 10));

	var markerIconDefault_shape = {
			coord: [1, 1, 1, 52, 42, 52, 42 , 1],
			type: 'poly'
	};

}

function initializeMap(el, options)
{
	if (typeof google == 'undefined') 
		return false;
	
	var map = new google.maps.Map(document.getElementById(el), options);
	var marker = new google.maps.Marker({
	    position: map_latlng,
	    title: 'My Location',
	    shadow: markerIconDefault_shadow,
	    icon: markerIconDefault_image,
	    map: map
	});
}

function scrollTo(id)
{
	if ($(id).length)
		$('html,body').animate({scrollTop: $(id).offset().top},'slow');
}

$(function()
{
	$("[data-spy='scroll']").scrollspy({
	    excluded_ids : ['#themer'],
	    offset : 150
	});
	
	$('#menu a').not('[data-toggle]').click(function(e)
	{
		e.preventDefault();
		scrollTo($(this).attr('href'));
	});
	
	$('.gallery').on('mouseenter', 'ul li .thumb', function(){
		$(this).find('.hover').stop().fadeIn(150);
	}).on('mouseleave', 'ul li .thumb', function(){
		$(this).find('.hover').stop().fadeOut(150);
	}).find('.hover').hide();
	
	$('.blog').on('mouseenter', 'ul li .item', function(){
		$(this).find('.hover').stop(true).animate({ height: $(this).outerHeight() });
	}).on('mouseleave', 'ul li .item', function(){
		$(this).find('.hover').stop(true).animate({ height: '40' });
	})
	
	// main menu -> submenus
	$('#menu .collapse').on('show', function()
	{
		$(this).parents('.hasSubmenu:first').addClass('active');
	})
	.on('hidden', function()
	{
		$(this).parents('.hasSubmenu:first').removeClass('active');
	});
	
	$('.navbar.main #menu > li').on('mouseleave', function()
	{
		$('#menu .menu').not('.hide').addClass('hide');
	});
	
	// main menu visibility toggle
	$('.btn-navbar.main').click(function()
	{
		$('.container:first').toggleClass('menu-hidden');
		$('#menu').toggleClass('hidden-phone');
		
		if (typeof masonryGallery != 'undefined') 
			masonryGallery();
	});
	
	// tooltips
	$('[data-toggle="tooltip"]').tooltip();
	
	$(window).resize(function()
	{
		if (!$('#menu').is(':visible') && !$('.container:first').is('menu-hidden'))
			$('.container:first').addClass('menu-hidden');
	});
	
	$(window).resize();
	
	function initGallery(filters, no_quicksand)
	{
		if (!$('#portfolio-list-temp').length)
			$('body').append('<ul id="portfolio-list-temp" class="hidden"></ul>');
		else
			$('#portfolio-list-temp').empty();
		
		var filter_selector = '#portfolio-list-master li'; // all
		
		if (filters)
			filter_selector += '[data-type*="' + filters + '"]';
		
		$(filter_selector).clone().appendTo('#portfolio-list-temp');
		
		if (!no_quicksand) 
		{
			$('.gallery ul').quicksand($('#portfolio-list-temp li'), {
				duration: 0,
				useScaling: false,
				adjustHeight : false
			}, 
			function()
			{
				if ($('.prettyPhoto').size() > 0) $(".prettyPhoto ul a").lightBox({ maxWidth: $(document).width()-40 });
				masonryGallery();
			});
		}
		else
		{
			$('.gallery ul').empty().append($('#portfolio-list-temp li'));
			masonryGallery();
		}
		
		// PrettyPhoto
		if ($('.prettyPhoto').size() > 0) $(".prettyPhoto ul a").lightBox({ maxWidth: $(document).width()-40 });
	}
	
	if (!$('#portfolio-list-master').length) 
	{
		// Auto-set data-id for each list item as index / required by quicksand
		$('.gallery ul li').each(function(index) {
			$(this).attr('data-id', index);
		});
	
		// Create master list if there is none to assist with filtering and pagination
		$('body').append('<ul id="portfolio-list-master" class="hidden"></ul>');
		$('.gallery ul li').clone().appendTo('#portfolio-list-master');

		// init portfolio
		initGallery(false);
	}
	
	// Category filter click
	$('.nav-gallery-filter li').click(function()
	{
		// update active filter
		$('.nav-gallery-filter li').removeClass('active');
		$(this).addClass('active');
		
		// Update gallery to match filter, return to page 1
		initGallery($(this).attr('data-type'), true);
	});
	
	var layout = $.cookie('layout') ? $.cookie('layout') : 'fixed';
	
	if (layout == 'fixed' && !$('.container-fluid:first').is('.fixed'))
		$('.container-fluid:first').addClass('fixed');
	
	if (layout == 'fluid' && $('.container-fluid:first').is('.fixed'))
		$('.container-fluid:first').removeClass('fixed');
	
	$('#footer [data-toggle="layout"]').not('[data-layout="'+layout+'"]').parent().removeClass('active');
	$('#footer [data-toggle="layout"][data-layout="'+layout+'"]').parent().addClass('active');
	
	$('#footer [data-toggle="layout"]').click(function()
	{
		if ($(this).parent().is('.active'))
			return;
		
		$('#footer [data-toggle="layout"]').not(this).parent().removeClass('active');
		$(this).parent().addClass('active');
		
		if ($(this).attr('data-layout') == 'fixed')
			$('.container-fluid:first').addClass('fixed');
		else
			$('.container-fluid:first').removeClass('fixed');
			
		$.cookie('layout', $(this).attr('data-layout'));
		
		if (typeof masonryGallery != 'undefined') 
			masonryGallery();
			
	});
	
	// Contact Page Google Maps
	if ($('#contact_gmap').size() > 0 && typeof google != 'undefined')
	{
		map_options.zoom = 15;
		initializeMap('contact_gmap', map_options);
	}

});
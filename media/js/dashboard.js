

// =============================================
// Constants (update to make simple changes)
// ============================================

// This variable sets the API endpoint
// If you change the endpoint on the backend, this variable is all you need to update in this script
var endpoint = "posts";

// Dictionary of categories. Used to validate hash navigation and provide an abstraction between hash and category.
// If you add additional categories, all you need to do is add an entry here
// It maps the URL hash to the "classification" property returned by the API

var hashNav = {
	'#athletes' : 'athletes',
	'#tips' : 'tips',
	'#science' : 'science',
	'#results' : 'results'
}

// =============================================

var page=1; // counter for paginating AJAX calls

$(document).ready(function(){
	setCategory();
	getPosts();
	$('#loadMore').click(function(event){
		event.preventDefault();
		$.get(endpoint, {'page' : page}, function(response){
			appendPosts(response.data);
			handleStatus(response.status.status);
			page++;
		}, 'json');
	});
	$('.post').fancybox({
		'transitionIn' : 'none',
		'transitionOut' : 'none',
		'type' : 'iframe',
		'maxWidth':820,
		'maxHeight':500
	 });
	$(window).bind('hashchange', function() {
		setCategory();
		$('.post').removeClass('hide');
		if (typeof(visibleCategory) != 'undefined'){
			$('.post').hide();
			$('.post.' + visibleCategory).show();	
		}else{
			$('.post').show();
		}
		$('#posts').masonry( 'reload' );
	});
});

function getPosts(){
	$.get(endpoint, {'page' : page}, function(response){
		displayPosts(response.data);
		handleStatus(response.status.status);
	}, 'json');
	page++;
}

function displayPosts(entries){
	// Function adds returned post data to the DOM
	
	$('#posts').empty();
	$.each(entries, function(key, entry){
		var postHTML = makePostHTML(entry);

		$(postHTML).appendTo('#posts').css({width : entry.image.width}).data({'url' : entry.link, 'category': entry.classification}).children('.leadImage').css({width: entry.image.width, height: entry.image.height});
	});
	$('#posts').masonry({
		itemSelector: '.post:visible',
		columnWidth: 20,
		isAnimated : true,
		animationOptions: {
	    	duration: 400
	  	},
	isFitWidth: true
	})
}

function handleStatus(status){
	// Hide or show "load more" based on response status
	if (status == 1){
		$('#loadMore').show();
	}else{
		$('#loadMore').hide();
	}
}

function appendPosts(entries){
	// Appends data to the masonry layout and animates
	
	$.each(entries, function(key, entry){
	var postHTML = makePostHTML(entry);
	$(postHTML).appendTo('#posts').css({width : entry.image.width, opacity: 0}).addClass('appended').data({'url' : entry.link, 'category': entry.classification}).children('.leadImage').css({width: entry.image.width, height: entry.image.height});
	});
	var newPosts = $('.appended');
	newPosts.removeClass('appended').animate({opacity : 1});
	$('#posts').masonry( 'appended', newPosts, true); 
}

function makePostHTML(entry){
	// Take JSON entry and returns pretty div for masonry layout
	
	if (typeof(visibleCategory) != 'undefined' && entry.classification != visibleCategory){
		entry.display = 'hide';
	}else{
		entry.display = '';
	}
	var postHTML = '<a href="' + entry.link + '" class="post ' + entry.classification + ' ' + entry.display + '"><img class="leadImage" src="' + entry.image.url + '" /><div class="title">' + entry.titleText + '</div><div class="bodyText">' + entry.bodyText + '</div></a>';
	return postHTML;
}


function setCategory(){
	// Hide and show content based on category
	
	visibleCategory = hashNav[window.location.hash];
	$('.header .nav a.text').removeClass('active');
	$('.header .nav a.text.' + visibleCategory).addClass('active');
}



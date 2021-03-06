var pages = {
	1 : 'type',
	2 : 'level',
	3 : 'plans',
	4 : 'billing',
	5 : 'account'
}

var curPage = 1;

function advanceSlide(subClass){
	$('.game .' + pages[curPage]).hide();
	$('.breadcrumbs .' + pages[curPage]).removeClass('active').addClass('completed');
	$('.breadcrumbs .' + pages[curPage] + ' .checkmark').fadeIn();
	curPage ++;
	$('.breadcrumbs .' + pages[curPage]).addClass('active');
	if (subClass){
		var slide = pages[curPage] + '.' + subClass;
	}else{
		var slide = pages[curPage];
	}
	$('.game .' + slide).fadeIn();
}

$(document).ready(function(){
	$('.game .type a').click(function(event){
		event.preventDefault();
		if ($(this).hasClass('race')){
			advanceSlide('race');
			$('.game > h3').html('What\'s your experience level?');
		}else if ($(this).hasClass('cardio')){
			advanceSlide('cardio');
			$('.game > h3').html('How often do you train?');	
		}
	})
	$('.game .level a').click(function(event){
		event.preventDefault();
		advanceSlide();
		$('.game > h3').html('Subscription structure');	
	})
	$('.game .plans a').click(function(event){
		event.preventDefault();
		advanceSlide();
		$('.game > h3').hide();
		planID = $(this).children('.planID').val(); // planID is the variable to post to the checkout
		$('.selectedPlan .yourSubscription').html($(this).children('.planName').val());
		$('.selectedPlan .price').html($(this).children('.planCost').val());
	})
	$('.game .billing .proceed').click(function(event){
		event.preventDefault();
		advanceSlide();
		 //HERE: Add credit card authentication
		// selected plan is stored in planID 
	})
	$('.game .billing .back').click(function(event){
		event.preventDefault();
		curPage--;
		$('.slide.billing').hide();
		$('.slide.plans').fadeIn();
		$('.game > h3').html('Subscription structure').fadeIn();	
	})
	$('.game .account .back').click(function(event){
		event.preventDefault();
		curPage--;
		$('.slide.account').hide();
		$('.slide.billing').fadeIn();
	})
});
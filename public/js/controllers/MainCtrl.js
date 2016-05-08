angular.module('MainCtrl', []).controller('MainController', function($scope, $window) {
	var baseHost = window.location.protocol + '//' + window.location.host;

	$scope.soundOn = true;
	$scope.soundOnOrOff = function ($event) {

		$scope.playAudio();

		var element = angular.element($event.currentTarget);
		if ($scope.soundOn) {
			$scope.soundOn = false;
		}
		else {
			$scope.soundOn = true;
		}

		if ($scope.soundOn) {
			$scope.playAudio;
		}
		else {
			$scope.stopAudio();
		}
	}

	$scope.trigger = {
		loader_two: new Date().toString()
	};

	$scope.slider_trigger = {
		loader_three: new Date().toString()
	};

	$scope.slider_first_trigger = {
		loader_one: new Date().toString()
	};

	$scope.playAudio = function () {
		$('#audio')[0].play();
	}

	$scope.stopAudio = function () {
		$('#audio')[0].pause();
	}

	$scope.body_class = 'body-loading';

	$scope.init = function() {
		$('#content-body-main').find('.section, .loading-content').height($(window).height());
		$('.section-container').height($(window).height());
	}

	var parts = {
		'part1':  {
			'msg': "我已成功筹集1元基金，为孩子送去营养和安味。一起来行动，支持美好未来。",
			'icon': baseHost + '/misc/images/s1main.png',
		},
		'part2': {
			'msg': "我已成功筹集1元基金，为宝贝送去营养和安味。一起来行动，助力健康成长。",
			'icon': baseHost + '/misc/images/s1main.png',
		},
		'part3': {
			'msg': "我已成功筹集1元基金，为老人送去营养和安味，一起来行动，为她们“骨”劲。",
			'icon': baseHost + '/misc/images/s1main.png',
		},
		'part4': {
			'msg': '我已成功筹集1元基金，一起来行动，送去更多营养与“安”味',
			'icon': baseHost + '/misc/images/s1main.png',
		}
	};

	$scope.selectedPart = 'part1';
	$scope.selectThisPart = function (index, $event) {
		var $self = $($event.currentTarget);
		$scope.selectedPart = 'part' + index;

		if (index == 4) {
			$('.part4-popup')
				.css('opacity', 0)
				.removeClass('hideme')
				.animate({
					opacity: 1
				});
		}
	}

	$scope.sendAnwei = function () {

		//TODO:: API Call

		$scope.hidePart4Form();
		$('.share-me-popup')
			.css('opacity', 0)
			.removeClass('hideme')
			.animate({
				opacity: 1
			});
	}

	$scope.hidePart4Form = function () {
			$('.part4-popup')
				.animate({
					opacity: 0
				}, {
					duration: 800,
					complete: function (){
						$('.part4-popup').addClass('hideme');
					}
				});
	}

});
function slide(element, cb) {
	cb || (cb = function () {});

	var $el = $(element);
	$el.hide();

	var plists = $el.find('.p').css({
		opacity: 0
	});
	$el.show();
	var maxIndex = plists.size() - 1;
	var crtIndex = maxIndex;
	function showNext() {
		if (crtIndex < 0) {
			cb.apply(this);
			return ;
		}
		plists.eq(crtIndex).animate({
			opacity: 1
		}, {
			duration: 1500,
			easing: 'easeInOutCubic',
			complete: function () {
				crtIndex --;
				showNext();

			}
		});
	}
	// 开始淡入淡出
	showNext();
}

angular.module('MainDirective', [])

.directive('slideFromRightToLeft', function() {

	return function (scope, element, attrs) {
		slide(element);
	}
})

.directive('fadeOut', function () {
	return function (scope, element, attrs) {
		var $el = $(element);

		$el.css({opacity: 0});

		$el.parents('.section').bind('visible', function () {
			$el.animate({
				opacity: 1
			}, {
				duration: 800,
				easing: 'easeInOutCubic'
			});
		});
	}
})

.directive('autoOrSlideToNextSection', function ($location) {
	var queue = new createjs.LoadQueue();
	queue.installPlugin(createjs.Sound);

	var resources = [
		"/misc/images/bg.png",
		"/misc/images/sound-on.png",
		"/misc/images/sound-off.png",
		"/misc/images/loading_bg.png",
		"/misc/images/loading_icon.png",
		"/misc/images/s1main.png",
		"/misc/images/s2main.png",
		"/misc/images/s2bimg.png",
		"/misc/images/s3main.png",
		"/misc/images/s4main.png",
		"/misc/images/s4bimg.png",
		"/misc/images/s5main.png",
		"/misc/images/s6main.png",
		"/misc/images/s6bimg.png",
		"/misc/audio/music.mp3"
	];


	return function (scope, element, attrs) {
		$sections = $(element).find('.section');

		// 初始化
		$sections.each(function () {
			if ( $(this).index() == 0 ) {
				$(this).css({
					position: 'absolute',
					left:0,
					right: 0,
					width: '100%'
				});
			}
			else {
				$(this).css({
					display: 'none',
					position: 'absolute',
					width: '100%',
					left: 0,
					top: 0
				});
			}

			// 绑定事件
			$(this).find('.next-section-hot-click').click(function () {
				var crtIndex = /\d+/.exec($(this).parents('.section').attr('class'))[0];
				crtIndex *= 1;

				slideFromTo(crtIndex - 1, crtIndex);
			});
		});

		// 滑动到下一个页面
		function slideFromTo(from_index, to_index) {
			if ($sections.size() <= to_index) return ;

			scope.body_class = 'body-section-' + to_index;

			if (to_index >= 6) {
				// 把quesiton icon 显示出来
				$('.icon-question')
					.removeClass('hideme')
					.siblings()
					.addClass('hideme');
			}

			$sections
				.eq(from_index).css({display: 'block', 'opacity': 1}).animate({opacity: 0}, {duration: 300, always: function () {
					$(this).css({
						display: 'none',
						opacity: 0
					});
				}})
				.end()
				.eq(to_index).css({display: 'block', 'opacity': 0});

			$sections.eq(to_index).animate({
				opacity: 1
			}, {
				duration: 800,
				complete: function() {
					//TODO::
				},
				always:function () {

					// 滑动文字
					slide($(this).find('.words'), function () {

						// 文字滑动结束后 2s后 自动切换到下一页
						if (to_index % 2 != 0 && to_index < 7) {
							setTimeout(function () {
								slideFromTo(to_index, to_index + 1);
							}, 1000 * 2);
						}
					});

					if (to_index == 0) {
						scope.slider_first_trigger = {
							loader_one: new Date().toString()
						};
						scope.$digest();
					}

					// 第三个section  重新绘制 点击 laoder
					if (to_index == 2) {
						scope.trigger = {
							loader_two: new Date().toString()
						};
						scope.$digest();
					}
					// 第五个section  重新绘制 点击 loader
					else if (to_index == 4) {
						scope.slider_trigger = {
							loader_three: new Date().toString()
						};
						scope.$digest();
					}

					// 触发visible 事件
					$(this).trigger('visible');
				}
			});
		}

		for (var i = 0; i < resources.length; i++ ) {
			queue.loadFile(resources[i]);
		}

		// 图片 音乐加载完毕
		queue.on('complete', function() {
			$('.loading-content').animate({
				opacity: 0
			}, {
				duration: 800,
				always: function() {
					$(this).hide();
					var params = $location.search();
					if (params['page'] == 'success_share') {
						slideFromTo('false', 8);
					}
					else if (params['page'] == 'success_people') {
						slideFromTo('false', 9);
					}
					else {
						slideFromTo('false', 0);
					}
				}
			});
		}, this);

		// btn-for-love 
		$('#btn-for-love').click(function () {
			slideFromTo(6, 7);
		});

	}
})

.directive('createLoaderThree', function () {
	var lib = {
		createShape: function (type) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill('#b9dbb3').drawCircle(14, 14, 14);
			circle.graphics.beginFill('#ebe9e7').drawCircle(14, 14, 12);
			circle.graphics.beginFill('#b1d8ab').drawCircle(14, 14, 9);
			circle.graphics.beginFill('#2eb320').drawCircle(14, 14, 5);

			circle.x = 0;
			circle.y = 0;

			return circle;
		}
	};

	function createLoadThree(element, attrs) {
		var type = attrs['id'];
		var $parent = $(element).parent();
		var s_x = 260,
			s_y = 229;
		var s_w = 402,
			s_h = 529;

		var $img = $parent.siblings('img');

		var d_w = $img.width(),
			d_h = $img.height();

		var ratio = d_w / s_w;
		var d_x = ratio * s_x;
		var d_y = ratio * s_y;

		$parent.css({
			left: d_x,
			top: d_y
		}).show();

		var stage = new createjs.Stage(type);

		var circle = lib.createShape();

		stage.addChild(circle);

		createjs.Tween.get(circle, {loop: true})
			.to({alpha: .3}, 1000, createjs.Ease.getPowInOut(2))
			.to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4));

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick' ,stage);
	}

	var isFirstTime = true;
	return function (scope, element, attrs) {
		scope.$watch('slider_trigger.loader_three', function () {
			if (isFirstTime) {
				isFirstTime = false;
				return ;
			}
			createLoadThree(element, attrs);
		});
	}
})

.directive('createLoaderTwo', function () {
	var lib = {
		createShape: function (type) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill('#b7c6d5').drawCircle(14, 14, 14);
			circle.graphics.beginFill('#eae7e5').drawCircle(14, 14, 12);
			circle.graphics.beginFill('#b4c5d5').drawCircle(14, 14, 9);
			circle.graphics.beginFill('#2c6aa6').drawCircle(14, 14, 4);

			circle.x = 0;
			circle.y = 0;

			return circle;
		}
	};

	function createLoadTwo(element, attrs) {
		var type = attrs['id'];
		var $parent = $(element).parent();
		var s_x = 236,
			s_y = 381;
		var s_w = 579,
			s_h = 488;

		var $img = $parent.siblings('img');

		var d_w = $img.width(),
			d_h = $img.height();

		var ratio = d_w / s_w;
		var d_x = ratio * s_x;
		var d_y = ratio * s_y;

		$parent.css({
			left: d_x,
			top: d_y
		}).show();

		var stage = new createjs.Stage(type);

		var circle = lib.createShape();

		stage.addChild(circle);

		createjs.Tween.get(circle, {loop: true})
			.to({alpha: .3}, 1000, createjs.Ease.getPowInOut(2))
			.to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4));

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick' ,stage);
	}

	var isFirstTime = true;
	return function (scope, element, attrs) {
		scope.$watch('trigger.loader_two', function () {
			if (isFirstTime) {
				isFirstTime = false;
				return ;
			}
			createLoadTwo(element, attrs);
		});
	}
})

.directive('createLoaderOne', function () {
	var lib = {
		createShape: function (type) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill('#e4cecf').drawCircle(14, 14, 14);
			circle.graphics.beginFill('#eceae8').drawCircle(14, 14, 12);
			circle.graphics.beginFill('#dcacb2').drawCircle(14, 14, 9);
			circle.graphics.beginFill('#b2172f').drawCircle(14, 14, 4);

			circle.x = 0;
			circle.y = 0;

			return circle;
		}
	};

	function createLoadOne(element, attrs) {
		var type = attrs['id'];
		var $parent = $(element).parent();
		var s_x = 275,
			s_y = 250;
		var s_w = 598,
			s_h = 519;

		var $img = $parent.siblings('img');

		var d_w = $img.width(),
			d_h = $img.height();

		var ratio = d_w / s_w;
		var d_x = ratio * s_x;
		var d_y = ratio * s_y;

		$parent.css({
			left: d_x,
			top: d_y
		}).show();

		var stage = new createjs.Stage(type);

		var circle = lib.createShape();

		stage.addChild(circle);

		createjs.Tween.get(circle, {loop: true})
			.to({alpha: .3}, 1000, createjs.Ease.getPowInOut(2))
			.to({alpha: 1}, 1000, createjs.Ease.getPowInOut(4));

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick' ,stage);
	}

	var isFirstTime = true;
	return function (scope, element, attrs) {
		scope.$watch('slider_first_trigger.loader_one', function () {
			if (isFirstTime) {
				isFirstTime = false;
				return ;
			}
			createLoadOne(element, attrs);
		});
	}
})

.directive('fadeOutTwo', function () {
	return function (scope, element, attrs) {
		$(element)
			.find('.title-word')
			.css({opacity: 0})
			.end()
			.find('.body-word span')
			.css({opacity: 0});

		setTimeout(function () {
			$(element).parents('.section').bind('visible', function () {
				$(element).find('.title-word').animate({
					opacity: 1
				}, {
					duration: 800,
					always: function () {
						$(element).find('.body-word span:eq(0), .body-word span:eq(1)').animate({
							opacity: 1
						}, {
							duration: 800,
							always: function () {
								$(element).find('.body-word span:eq(2), .body-word span:eq(3)').animate({
									opacity: 1
								}, {
									duration: 800
								});
							}
						});
					}
				});
			});
		}, 800);

	}
});
/* jshint undef: false, unused: false, newcap: false, latedef: nofunc */

$(document).ready(function(){

    $.ajaxSetup({
           async: false
       });

    /* A couple of selections. */
    $body = $(document.body);
    $window = $(window);
    $html = $(document.documentElement);
    $cover = $(document).find('#canvas');
    $posts = $('section.work article');
    $browser_height = $(window).height();
    $scrolled = false;

    var coverShowing = true;
    var $scrollLimit = 600;
    var $scrolledPast = false;
    var buttonChanged = false;
    var sliders = [];
    var prevVideo;
    var imgLoad = imagesLoaded( $body );

    /* Some functions */
    function initCover(){
        if(!coverShowing){
            Background();
            coverShowing = true;
        } else {
            return;
        }
    }

    function scrollEvent(){
        var $top = $($window).scrollTop();
        var $num = 1 - (($top - ($browser_height * 0.15)) / ($browser_height * 0.8));
        var t = $('#scroll','nav.bottom');
        $scrolledPast = ($top > $scrollLimit ? true : false);

        $('#slide .scroll #canvas').css({'opacity': $num, 'transform': 'scale(' + $num + ')'});

        if ( $top < $scrollLimit && t.hasClass('one') || $top > $scrollLimit && $top < 3000 && t.hasClass('two') || $top > 3000 && t.hasClass('three') ) return;

        $($window).unbind('scroll');
        t.stop(true,true);

        if ( $top < $scrollLimit ){
           changeBottomButton(t, 'Work', 'middle', 'one');
       } else {
           if ($top > 3000){
               changeBottomButton(t, 'Top', 'slide', 'three');
           } else {
               changeBottomButton(t, 'Swipe to navigate projects >>>', 'slide', 'two');
           }
       }
    }

    function changeBottomButton(el, text, scrollPoint, c){
        el.removeAttr('class')
          .addClass('hide')
          .unbind('click')
          .on('click', function(){scrollToPlace(scrollPoint);})
          .delay(500)
          .queue(function(){
              $(this).addClass(c).text(text).removeClass('hide').dequeue();
              $($window).scroll(scrollEvent).dequeue();
              if ($scrolledPast === true){
                  if(coverShowing){
                      $cover.removeClass('on').find('canvas').remove();
                      Background.prototype.removeScene();
                      coverShowing = false;
                  }
              } else {
                  if($cover.length && $html.hasClass('desktop')){
                      initCover();
                  }
              }
          });
    }

    function onAlways( instance ) {
        changeBottomButton($('#scroll','nav.bottom'), 'Work', 'middle', 'one');
    }

    function getData(post){
        $.getJSON('/json/post_'+ post +'.json', function(d){
            con = d;
        });
        return con;
    }

    function linkToBlogOverlay(num){
        var a = num;
        var result = numPosts + a;
        return result;
    }

    function showLatestBlogTitles () {
        var i = 0, j = 0, el = $('section.posts .last'),con;
        //Change i for desired num of posts
        for (i; i < 3; i++){
            j++;var p = numPosts - j;var post,title,date,excerpt;
            post = $('<article>').attr('id',p);
            title = $('<a>').text(getData(p).title);
            date = $('<span>').attr('class','date').text(getData(p).date);
            excerpt = getData(p).excerpt;
            post.append(date,title,excerpt).appendTo(el);
        }
    }

    function scrollToPlace($el, $slide, $pos){
        $($window).unbind('scroll');
        if ($slide){
            $slide.royalSlider('goTo', $pos);
        }
        $('html, body').animate({
            scrollTop: $('#' + $el).offset().top
        }, 400, function(){ $($window).scroll(scrollEvent);scrollEvent(); });
    }

    function lockScrollDesktop(){
        //if ($html.hasClass('desktop')){
        $body.css({ overflow: 'hidden' }).find('.dark').fadeIn('fast');
        //}
    }

    if (!Array.prototype.last){
        Array.prototype.last = function(){
            return this[this.length - 1];
        };
    }

    function initMobile(){
        $body.find('#slide .scroll p').css({
            background: '#333',
            textAlign: 'center',
            height: '300px',
            borderRadius: '50%'
        });
    }

/************ Time for the show! ***********/

    imgLoad.on( 'always', onAlways );

    if($cover.length && $html.hasClass('desktop')){
        coverShowing = false;
        initCover();
    } else {
        initMobile();
    }

    if($('.imgs').length){
        $('.imgs a').fluidbox();
    }

    jQuery.rsCSS3Easing.easeOutBack = 'cubic-bezier(0, 0.44999, 0, 1.03)';

    $('.royalSlider').each(function(i){
        sliders[i] = $(this).royalSlider({
            addActiveClass: true,
            arrowsNav: true,
            arrowsNavAutoHide:false,
            navigateByClick: false,
            sliderDrag: false,
            easeInOut: 'easeOutBack',
            easeOut: 'easeOutBack',
            controlNavigation: 'none',
            autoScaleSlider: true,
            autoScaleSliderWidth: 960,
            autoScaleSliderHeight: 640,
            loop: true,
            fadeinLoadedSlide: false,
            globalCaption: false,
            keyboardNavEnabled: false,
            globalCaptionInside: false,

            visibleNearby: {
              enabled: true,
              centerArea: 0.5,
              center: true,
              breakpoint: 650,
              breakpointCenterArea: 0.8,
              navigateByCenterClick: true
            }
        });
      });

    $.each(sliders, function(){
        $(this).data('royalSlider').ev.on('rsAfterSlideChange', function(){
            var thisvideo = this.currSlide.content.find('video');
            if(prevVideo){
                prevVideo.pause();
            }
            if(thisvideo.length) {
                prevVideo = thisvideo[0];
                prevVideo.play();
                thisvideo.on('click', function(){
                    $(this)[0].load();
                    $(this)[0].play();
                });
            } else {
                prevVideo = null;
            }
        });
    });

    $($posts).each(function(){
        var t = $(this).find('ul li.update a.button');
        if (t.length !== 0){
            var id = parseInt(t.attr('href'));
            id = numPosts - id;
            t.attr('href','#' + id);
        }
    });

    //showLatestBlogTitles();

    /*$('#index').on('click', function(event) {
        event.preventDefault();
        $('.index').addClass('open');
    });*/

    if(window.location.hash){
        lockScrollDesktop();
        ArticleAnimator.load();
        $body.find('.blog').addClass('open');
    }

    $('#about').on('click', function(event) {
        event.preventDefault();
        scrollToPlace('about-slide', sliders.last(), 0);
    });

    $('#contact').on('click', function(event) {
        event.preventDefault();
        scrollToPlace('about-slide',sliders.last(), 2);
    });

    $('section.work article ul li.update p a.post').on('click', function(event){
        event.preventDefault();
        var $target = $(this);
        var $id = $target.attr('href');
        history.pushState( '', '', $id);
        lockScrollDesktop();
        ArticleAnimator.load();
    });

    $($window).scroll(scrollEvent);

    $('#blog').on('click', function(event) {
        event.preventDefault();
        lockScrollDesktop();
        ArticleAnimator.load();
    });

    $('.dark, h3.logo').on('click', function(event) {
        event.preventDefault();
        $body.css({
            overflow: 'auto'
        });
        $('div.blog').removeClass('open').find('h3.logo').removeClass('down');
        $('div.dark').fadeOut('fast');
        $('.page.current, .page.next').remove();
        history.pushState( '', '', ' ');
    });
});

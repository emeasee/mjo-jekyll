/* jshint undef: false, unused: false */

$(document).ready(function(){

    $.ajaxSetup({
           async: false
       });

    /* A couple of selections. */
    $body = $(document.body);
    $window = $(window);
    $html = $(document.documentElement);
    $cover = $(document).find('#canvas');
    $browser_height = $(window).height();
    $scrolled = false;

    var coverShowing = false;
    var $scrollLimit = 600;

    /* Some functions */
    function showLatestBlogTitles (num) {
        var i = 0, j = 0, el = $('section.posts .last'),con;
        //Change i for desired num of posts
        function getData(post){
            $.getJSON('/json/post_'+ post +'.json', function(d){
                con = d;
            });
            return con;
        }
        for (i; i < 3; i++){
            j++;var p = num - j;var post,title,date,excerpt;
            post = $('<article>').attr('id',p);
            title = $('<a>').text(getData(p).title);
            date = $('<span>').attr('class','date').text(getData(p).date);
            excerpt = getData(p).excerpt;
            post.append(date,title,excerpt).appendTo(el);
            //console.log(getData(p));
        }
    }

    function scrollToPlace($el){
        $('html, body').animate({
            scrollTop: $('#' + $el).offset().top
        }, 400);
    }

    function lockScrollDesktop(){
        //if ($html.hasClass('desktop')){
          $body.css({ overflow: 'hidden' }).find('.dark').fadeIn('fast');
        //}
    }

    function initCover(){
        if(!coverShowing){
            background();
            coverShowing = true;
        } else {
            return;
        }
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
    if($cover.length && $html.hasClass('desktop')){
        initCover();
    } else {
        initMobile();
    }

    if($('.imgs').length){
        $('.imgs a').fluidbox();
    }

    $('.slider').royalSlider({
            addActiveClass: true,
            arrowsNav: true,
            arrowsNavAutoHide:false,
            navigateByClick: false,
            sliderDrag: false,
            controlNavigation: 'none',
            autoScaleSlider: true,
            autoScaleSliderWidth: 960,
            autoScaleSliderHeight: 640,
            loop: true,
            fadeinLoadedSlide: false,
            globalCaption: false,
            keyboardNavEnabled: false,
            globalCaptionInside: false,

             video: {
                 autoHideArrows:true,
                 autoHideControlNav:false,
                 autoHideBlocks: true
             },

            visibleNearby: {
              enabled: true,
              centerArea: 0.5,
              center: true,
              breakpoint: 650,
              breakpointCenterArea: 0.8,
              navigateByCenterClick: true
            }
    });

    showLatestBlogTitles(numPosts);

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
        $('section.about').addClass('open');
    });

    $('.close,section').on('click', function(event) {
        event.preventDefault();
        $(this).parent().removeClass('open');
    });

    $('section.posts .last article').on('click', function(event){
        var $target = $(this);
        var $id = $target.attr('id');
        history.pushState( '', '', '#' + $id);
        lockScrollDesktop();
        ArticleAnimator.load();
    });

    $(window).scroll(function(){
        var $top = $($window).scrollTop(), $scrolledPast = ($top > $scrollLimit ? true : false);
        var $num = 1 - (($top - ($browser_height * 0.15)) / ($browser_height * 0.8));
        $('#slide .scroll #canvas').css({'opacity': $num, 'transform': 'scale(' + $num + ')'});
        if ($scrolledPast === false){
            $('#scroll','nav.bottom').unbind('click').text('Work').on('click', function(){scrollToPlace('middle');});
            $('#slide p').html('M-JO<br><span>Mac Oosthuizen<br/>Interaction Designer</span>');
            if($cover.length && $html.hasClass('desktop')){
                initCover();
            }
        } else if ($scrolledPast === true ){
            $('#scroll','nav.bottom').unbind('click').text('Top').on('click', function(){scrollToPlace('slide');});
            $('#slide p').html('<<<<span>Swipe the images to view the slideshow</span>');
            if(coverShowing){
                $cover.find('canvas').remove();
                coverShowing = false;
            }
        }
    });

    $('#blog').on('click', function(event) {
        event.preventDefault();
        lockScrollDesktop();
        ArticleAnimator.load();
    });

    $('.dark').on('click', function(event) {
        event.preventDefault();
        $body.css({
            overflow: 'auto'
        });
        $('div.blog').removeClass('open');
        $('div.dark').fadeOut('fast');
        $('.page.current, .page.next').remove();
        history.pushState( '', '', ' ');
    });
});

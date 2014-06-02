/* jshint undef: false, unused: false */

$(document).ready(function(){

    $.ajaxSetup({
           async: false
       });

    /* A couple of selections. */
    $body = $(document.body);
    $window = $(window);
    $html = $(document.documentElement);
    $browser_height = $(window).height();

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



/************ Time for the show! ***********/
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

    //TODO: Change to read URL simply. This does not work
    if(window.location.hash){
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
        ArticleAnimator.load();
    });

    $(window).scroll(function(){
        var $top = $($window).scrollTop();
        var $num = 1 - (($top - ($browser_height * 0.15)) / ($browser_height * 0.8));
        $('#slide .scroll p').css({'opacity': $num, 'transform': 'scale(' + $num + ')'});
    });

    $('#blog').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
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

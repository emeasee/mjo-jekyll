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
        var i = 0, j = 0, el = $('section.posts article'),con;
        //Change i for desired num of posts
        function getData(post){
            $.getJSON('/json/post_'+ post +'.json', function(d){
                con = d.title;
            });
            return con;
        }
        for (i; i < 5; i++){
            j++;var p = num - j;
            $('<a>').attr('href','/blog/#'+ p).text(getData(p)).appendTo(el);
        }
    }

    /* Time for the show! */
    if($('.imgs').length){
        $('.imgs a').fluidbox();
    }
    if($('article.proj').length){
        $('article.proj').each(function(index){
            var d = $(this);
            d.find('h1').pin({containerSelector: d});
        });
        $('section.posts h1').pin({containerSelector: 'section.posts'});
    }

    showLatestBlogTitles(numPosts);

    $('#info').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        $(".cover").addClass('open');
    });

    $(window).scroll(function(){
        var $top = $($window).scrollTop();

        $('#slide .scroll').css("opacity", 1 - (($top - ($browser_height * .25)) / ($browser_height * .8)));
    });
});
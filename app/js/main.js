/* jshint undef: false, unused: false */

$(document).ready(function(){

    $.ajaxSetup({
           async: false
       });

    /* A couple of selections. */
    $body = $(document.body);
    $window = $(window);
    $html = $(document.documentElement);

    /* Some functions */
    function showLatestBlogTitles (num) {
        var i = 0, j = 0, el = $('section.posts article');
        //Change i for desired num of posts
        for (i; i < 5; i++){
            j++;var p = num - j, con;
            $.getJSON('/json/post_'+ p +'.json', function(d){
                con = d.title;
            });
            $('<a>').attr('href','/blog/#'+ p).text(con).appendTo(el);
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
});
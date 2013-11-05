
$(document).ready(function(){

    /* A couple of selections. */
    $body         = $(document.body);
    $window       = $(window);
    $html         = $(document.documentElement);

    $('#top .scroll').scroll(function(){
            var scrollTop = $(this).scrollTop();
            var iheight = $(this).innerHeight();
            var sheight = this.scrollHeight;
            var text = '';
            if (scrollTop >= sheight-iheight) {
                $('#top').css('display','none');
                $('div.middle').css('position','relative');
            }
        });

});
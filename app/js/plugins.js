// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.


/*    
      jQuery Setup                                                           
************************************************************************/ 
jQuery.ajaxSetup({
  cache: false
})

/*    
      ArticleAnimator Object                                                           
************************************************************************/ 
var ArticleAnimator = ArticleAnimator || {
  canScroll:          true,
  initialLoad:        true,
  animationDuration:  500,
  postCount:          numPosts,
  currentPostIndex:   numPosts,
  postCache:          {},
  pageTemplate:       null,
};

ArticleAnimator.load = function(){
  this.currentPostIndex = getURLIndex();
  this.makeSelections();

  $body.append( this.$current )
  $body.append( this.$next )

  var self = this;
  this.createPost({ type: 'current' }, function(){
    self.createPost({ type: 'next' }, function(){

      /* Selections. */
      self.refreshCurrentAndNextSelection();

      /* Push initial on to stack */
      history.pushState(pageState(), "", "#" + self.currentPostIndex)

      /* Bind to some events. */
      self.bindGotoNextClick();
      self.bindPopstate();
      self.bindWindowScroll();
    })
  })
}

ArticleAnimator.makeSelections = function(){
  this.$page         = $('.page');
  this.pageTemplate  = elementToTemplate( this.$page.clone() );
  this.$current      = this.currentElementClone();
  this.$next         = this.nextElementClone();
}

ArticleAnimator.getPost = function(index, callback){
  callback = callback || $.noop;

  if ( this.postCache[index] ){
    callback( this.postCache[index] );
    return;
  }

  var self = this;
  $.getJSON('/json/post_'+ index +'.json', function(d){
    self.postCache[index] = d;
    callback(d)
  });
} 

ArticleAnimator.nextPostIndex = function(index){
  return (index === 1) ? this.postCount : index - 1 
}

ArticleAnimator.createPost = function(opts, callback){
  opts      = opts || {};
  var self  = this;
  var type  = opts['type'] || 'next';

  if ( opts['fromTemplate'] ){
    $body.append( this.nextElementClone() );
    this['$' + type] = $('.' + type)
  }

  var index = (type == 'next') ? this.nextPostIndex( this.currentPostIndex) : this.currentPostIndex;
  this.getPost(index, function(d){
    self.contentizeElement(self['$' + type], d);
    callback && callback();
  });

}

ArticleAnimator.contentizeElement = function($el, d){
  $el.find('.big-image').css({ backgroundImage: "url(" + d.image + ")" });
  $el.find('h1.title').html(d.title);
  $el.find('h2.description').html(d.title_secondary);
  $el.find('.content .text').html(d.content);
  $el.find('h3.byline time').html(d.date);
  $el.find('h3.byline .author').html(d.author);
}

ArticleAnimator.animatePage = function(callback){
  var self              = this;
  var translationValue  = this.$next.get(0).getBoundingClientRect().top;
  this.canScroll        = false;

  this.$current.addClass('fade-up-out');

  this.$next.removeClass('content-hidden next')
       .addClass('easing-upward')
       .css({ "transform": "translate3d(0, -"+ translationValue +"px, 0)" });

  setTimeout(function(){
      scrollTop();
      self.$next.removeClass('easing-upward')
      self.$current.remove();

      self.$next.css({ "transform": "" });
      self.$current = self.$next.addClass('current');
      
      self.canScroll = true;
      self.currentPostIndex = self.nextPostIndex( self.currentPostIndex );

      callback();
  }, self.animationDuration );
}

ArticleAnimator.bindGotoNextClick = function(){
  var self  = this;
  var e     = 'ontouchstart' in window ? 'touchstart' : 'click';

  this.$next.find('.big-image').on(e, function(e){
    e.preventDefault();
    $(this).unbind(e);

    self.animatePage(function(){
      self.createPost({ fromTemplate: true, type: 'next' });
      self.bindGotoNextClick();
      history.pushState( pageState(), '', "#" + self.currentPostIndex);
    });
  });
}

ArticleAnimator.bindPopstate = function(){
  var self = this;
  $window.on('popstate', function(e){
    
    if( !history.state || self.initialLoad ){
      self.initialLoad = false;
      return;
    }

    self.currentPostIndex = history.state.index;
    self.$current.replaceWith( history.state.current );
    self.$next.replaceWith( history.state.next );

    self.refreshCurrentAndNextSelection();
    self.createPost({ type: 'next' });
    self.bindGotoNextClick();
  });
}

ArticleAnimator.bindWindowScroll = function(){
  var self = this;
  $window.on('mousewheel', function(ev){
    if ( !self.canScroll ) 
      ev.preventDefault()
  })
}

ArticleAnimator.refreshCurrentAndNextSelection = function(){
  this.$current      = $('.page.current');
  this.$next         = $('.page.next');
}

ArticleAnimator.nextElementClone = function(){
  return this.$page.clone().removeClass('hidden').addClass('next content-hidden');
}

ArticleAnimator.currentElementClone = function(){
  return this.$page.clone().removeClass('hidden').addClass('current');
}

/*    
      Helper Functions.                                                      
************************************************************************/ 
function elementToTemplate($element){
  return $element.get(0).outerHTML;
}

function scrollTop(){
  $body.add($html).scrollTop(0);
}

function pageState(){
  return { index: ArticleAnimator.currentPostIndex, current: elementToTemplate(ArticleAnimator.$current), next: elementToTemplate(ArticleAnimator.$next) }
}

function getURLIndex(){
  return parseInt( (history.state && history.state.index) ||window.location.hash.replace('#', "") || ArticleAnimator.currentPostIndex );
}
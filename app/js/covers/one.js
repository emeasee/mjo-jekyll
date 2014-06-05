/*jshint ignore:start*/
var background = function() {

  ///////////////////////////////////////

  // values
  var i, j, k;
  var ww, wh;
  var renderer, scene, camera, canvas, ctx;
  var container = '#canvas';

  var t = 0;
  var bt = 0;
  var lt = 0;

  var tx = 0;
  var ty = 0;
  var mx = 0; // mouse x
  var my = 0; // mouse y

  var config = {
      color: [ 0, 128, 255 ],
      speed1: 0.06,
      level:  0.02,
      var1: 0.35,
      var2: 0.01,
      speed2: 0.02,
      random: function(){
          config.color[0] = Math.random() * 255;
          config.color[1] = Math.random() * 255;
          config.color[2] = Math.random() * 255;
          config.level = Math.random();
          config.var1 = Math.random();
          config.var2 = Math.random();
          config.speed1 = Math.random() * 0.2;
          config.speed2 = Math.random() * 0.2;
      }
  };

  var ball;
  var ballGeometry;
  var light;
  var ballVertices;
  var ballMaterial;

  var light;

  var values = [],
    	total = 0;
  var mousePos = {
    x: 0,
    y: 0
  };
  var cameraMode = true;
  var debugMode = false;
  var defaultCamera = 'manual';
  var ch, gh;
  var range = 1500;


  ///////////////////////////////////////
  // constructor
  var constructor = function() {
    $(function() {
      threeSetup();
      setResizeHandler();
    });
  };

  var threeSetup = function() {
    $(container).css({visibility: 'hidden'});

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 15000);
    //camera.up = { x:0, y:0, z:1 };
    camera.lookAt(scene.position);

    //debug(window.WebGLRenderingContext);

    // WebGL
    if (window.WebGLRenderingContext && getBrowser() != 'safari') {
      renderer = new THREE.WebGLRenderer();
      ballGeometry = new THREE.SphereGeometry(100, 40, 40);
    }
    // CANVAS
    else {
      renderer = new THREE.CanvasRenderer();
      ballGeometry = new THREE.SphereGeometry(100, 14, 7);

      //if (isSmartDevice()) {}
    }

    // setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf9f9f9, 1.0);
    $(container)[0].appendChild(renderer.domElement);
    canvas = $(container + ' > canvas');
    ctx = (canvas[0].getContext) ? canvas[0].getContext('2d') : 'undefined';

    setupBeater();
    renderStart();
};

  var setResizeHandler = function() {
    resize();
    $(window).bind('resize', function(e) {
      resize(e);
    });
};

  var resize = function(e) {
    ww = $(window).width();
    wh = $(window).height();

    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
};

  var setupBeater = function() {
    ballMaterial = new THREE.MeshPhongMaterial({ambient: 0xffffff, color: 0xffffff})
    ball = new THREE.Mesh(ballGeometry, ballMaterial);

    ball.castShadow = true;
    ball.receiveShadow = true;
    ballVertices = ball.geometry.vertices;
    var vertex;
    for(var i = 0, len = ballVertices.length; i < len; i++) {
        vertex = ballVertices[i];
        vertex.ox = vertex.x;
        vertex.oy = vertex.y;
        vertex.oz = vertex.z;
    }

    var ambient = new THREE.AmbientLight(0xffffff);

    light = new THREE.DirectionalLight( 0x999999 );
    light.castShadow = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.shadowCameraLeft = -500;
    light.shadowCameraRight = 500;
    light.shadowCameraTop = 500;
    light.shadowCameraBottom = -500;
    light.shadowCameraFar = 3500;

    scene.add(ball);
    scene.add(ambient);
    scene.add( light );
    scene.fog = new THREE.FogExp2( 0xff0000, 0.003);

    camera.position.y = 100;
    camera.position.z = 300;
  }

  var setupKeydown = function() {
    $(window).bind('keydown', function(e) {
      keydownHandler(e);
    });
  }

  var keydownHandler = function(e) {
    var key = e.keyCode;
    debug(key);
    if (key == 32) {
      debugMode = (debugMode) ? false : true;
      updateDebugMode();
    }
    return false;
  }

  var updateDebugMode = function() {

    if (debugMode) {
      //ch.visible = true;
      gh.visible = true;
    } else {
      //ch.visible = false;
      gh.visible = false;
    }

  }

  var renderStart = function() {

    // debug
    //ch = new THREE.CameraHelper(camera);
    gh = new THREE.GridHelper(1000, 100);
    //scene.add(ch);
    scene.add(gh);

    updateDebugMode();

    // kerydown setup
    setupKeydown();

    // event
    $(window).bind('mousemove', mousemove);

    // render
    cameraMode = defaultCamera;
    render();

    setTimeout( function(){
      $(container + ' > canvas').css({visibility: 'visible'});
      $(container).css({visibility: 'visible', display: 'none'});
      $(container).fadeIn(3000);
    }, 2000 );
};

  var mousemove = function(e) {
    tx = e.clientX / ww * 2 - 1;
    ty = e.clientY / wh * 2 - 1;
};

  var render = function() {

    requestAnimationFrame(render);

    mx += (tx - mx) * .05;
    my += (ty - my) * .05;

    t += config.speed1;
    bt += config.speed2;
    lt += 0.02;
    var vertex;
    var scale;
    var level = (config.level / mx) / 2;
    var multiplyRatio = config.multiplyRatio;
    var var1 = config.var1;
    var var2 = config.var2;

    for(var i = 0, len = ballVertices.length; i < len; i++) {
        vertex = ballVertices[i];
        scale = Math.sin(t + i * ((1 + i)/(1 + i * var2)) * var1/40) * Math.sin(bt + i/ len) * level;
        vertex.x = vertex.ox + vertex.ox * scale;
        vertex.y = vertex.oy + vertex.oy * scale;
        vertex.z = vertex.oz + vertex.oz * scale;
    }

    ball.geometry.verticesNeedUpdate = true;
    ball.geometry.normalsNeedUpdate = true;

    light.position.set( Math.cos(lt) * 200, Math.sin(lt) * 200, 50 );

    ballMaterial.ambient.r = ballMaterial.color.r = config.color[0] / 255;
    ballMaterial.ambient.g = ballMaterial.color.g = config.color[1] / 255;
    ballMaterial.ambient.b = ballMaterial.color.b = config.color[2] / 255;

    camera.position.x = mx * 300;
    camera.position.y = my * 200;

    camera.lookAt(ball.position);
    renderer.render(scene, camera);
};

  ///////////////////////////////////////
  // getter
  background.prototype.get = function() {
    return _;
  };

  ///////////////////////////////////////
  // setter
  background.prototype.setTotalFFT = function(val) {
    total = val;
  };

  background.prototype.setFFT = function(val) {
    values = val;
  };

  constructor();
};
/*jshint ignore:end*/

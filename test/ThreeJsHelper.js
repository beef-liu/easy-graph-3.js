/**
 * 
 * @param args {
 *      container:Dom Node,     //required. dom node which contains canvas
 *      renderer:               //optional. (default: THREE.WebGLRenderer, or THREE.CanvasRenderer if browser does not support WebGL.) 
 *      bgColor:int,            //optional. (default: 0xffffff) background color
 *      width:int,              //optional. (default: window.innerWidth) width of canvas
 *      height:int,             //optional. (default: window.innerHeight) height of canvas
 *      camera:THREE.Camera,    //optional. (default: THREE.WebGLRenderer or THREE.CanvasRenderer).
 *      light:THREE.Light,      //optional. (default: THREE.DirectionalLight(0xFF0000, 1.0, 0))
 *      enableStats:boolean     //optional. (default: true) 
 * }
 * 
 */
ThreeJsHelper = function(args) {
    // this.newId = function() {
        // return "ThreeJsHelper_" + (_ThreeJsHelper_idSeq++);  
    // };
// 
    // this.id = this.newId();
    // window[this.id] = this;
    
    this.container = args.container;
    
    if(args.bgColor == undefined) {
        this.bgColor = 0xffffff;
    } else {
        this.bgColor = args.bgColor;
    }
    
    if(args.width == undefined) {
        this.width = window.innerWidth;
    } else {
        this.width = args.width;
    }
    
    if(args.height == undefined) {
        this.height = window.innerHeight;
    } else {
        this.height = args.height;
    }
    
    if(args.renderer == undefined) {
        if(Detector.webgl) {
            this.renderer = new THREE.WebGLRenderer({
                antialias : true
            });
        } else {
            this.renderer = new THREE.CanvasRenderer();
        }
    } else {
        this.renderer = args.renderer;
    }

    //set WebGL renderer into canvas 
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(this.bgColor, 1.0);
    this.container.appendChild(this.renderer.domElement);

    //scene ----------------
    this.scene = new THREE.Scene();

    //camera --------------------
    if(args.camera == undefined) {
        this.camera = new THREE.PerspectiveCamera(90, this.width / this.height, 0.1, 100000);
        this.camera.position.set(0, 0, 1000);
        //_camera.up.set(0, 0, 1);
        //_camera.lookAt(_scene.position);
        this.camera.lookAt({x:0, y:0, z:0});
    } else {
        this.camera = args.camera;
    }

    //light -------------------------
    if(args.light == undefined) {
        this.light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        this.light.position.set(100, 100, 200);
    } else {
        this.light = args.light;        
    }
    this.scene.add(this.light);
    
    if(args.enableStats == undefined) {
        this.enableStats = true; 
    } else {
        this.enableStats = args.enableStats; 
    }
    
    this.keyboard = new THREEx.KeyboardState();
    this.clock = new THREE.Clock();
    this.controls = null; 
    this.stats = null;
    
    this.axesObj = {
        axes: null,
        gridXZ: null,
        gridXY: null,
        gridYZ: null,
    };

    //init axes ----------------
    {
        //axes -----------
        var step = 2000;
        var size = step * 5;
        
        var gridOrigin = new THREE.Vector3(-size, -size, -size);

        this.axesObj.axes = new THREE.AxisHelper(size);
        this.axesObj.axes.position.set(0, 0, 0);
        this.scene.add(this.axesObj.axes);
        
        this.axesObj.gridXZ = new THREE.GridHelper(size, step);
        this.axesObj.gridXZ.setColors(new THREE.Color(0x006600), new THREE.Color(0x006600));
        this.axesObj.gridXZ.position.set(gridOrigin.x + size, gridOrigin.y, gridOrigin.z + size);
        this.scene.add(this.axesObj.gridXZ);
        
        this.axesObj.gridXY = new THREE.GridHelper(size, step);
        this.axesObj.gridXY.position.set(gridOrigin.x + size, gridOrigin.y + size, gridOrigin.z);
        this.axesObj.gridXY.rotation.x = Math.PI/2;
        this.axesObj.gridXY.setColors(new THREE.Color(0x000066), new THREE.Color(0x000066));
        this.scene.add(this.axesObj.gridXY);
    
        this.axesObj.gridYZ = new THREE.GridHelper(size, step);
        this.axesObj.gridYZ.position.set(gridOrigin.x, gridOrigin.y + size, gridOrigin.z + size);
        this.axesObj.gridYZ.rotation.z = Math.PI/2;
        this.axesObj.gridYZ.setColors(new THREE.Color(0x660000), new THREE.Color(0x660000));
        this.scene.add(this.axesObj.gridYZ);
    }
    
    //init controls and events ------------------------------
    {
        // EVENTS
        THREEx.WindowResize(this.renderer, this.camera);
        THREEx.FullScreen.bindKey({charCode : 'm'.charCodeAt(0) });
        
        // CONTROLS
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        
        // STATS
        if(this.enableStats) {
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.bottom = '0px';
            this.stats.domElement.style.zIndex = 1000000;
            this.container.appendChild(this.stats.domElement);
        }
    }
    
};


ThreeJsHelper.prototype = {
    redraw: function() {
        this.renderer.render(this.scene, this.camera);
        
        //controls
        if(this.controls) {
            if (this.keyboard.pressed("z") ) {
                // do something   
            }
            this.controls.update();
        }
        
        //stats
        if(this.stats) {
            this.stats.update();
        }
    },
    
    visibleStats: function(isToShow) {
        if(isToShow == undefined) {
            return (this.stats.domElement.style.display != "none");
        } else {
            if(isToShow) {
                this.stats.domElement.style.display = "block";
            } else {
                this.stats.domElement.style.display = "none";
            }
        }
    },
    
    visibleAxes: function(isToShow) {
        if(isToShow == undefined) {
            return this.axesObj.axes.visible;
        } else {
            this.axesObj.axes.visible = isToShow;
            this.axesObj.gridXZ.visible = isToShow;
            this.axesObj.gridXY.visible = isToShow;
            this.axesObj.gridYZ.visible = isToShow;
        }
    },
    
};

/**
 * 
 * @param {container:Dom Node, bgColor:int, width:int, height:int, renderer:THREE.WebGLRenderer | THREE.CanvasRenderer, camera:THREE.Camera, light:THREE.Light} args
 * container:   dom node which contains canvas
 * bgColor:     (default 0xffffff) background color
 * width:       (default window.innerWidth) width of canvas
 * height:      (default window.innerHeight) height of canvas
 * renderer:    (default THREE.WebGLRenderer or THREE.CanvasRenderer).
 * camera:
 * light: 
 */
EG3.ThreeJsHelper = function(args) {
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
    
    
    var keyboard = new THREEx.KeyboardState();
    var clock = new THREE.Clock();
    var controls, stats;

    function init() {
        //init controls and events
        initControlAndEvents();
    }
};

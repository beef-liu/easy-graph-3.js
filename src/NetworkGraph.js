EG3.GraphEdge = function(srcId, destId) {
    this.srcId = srcId;
    this.destId = destId;
};

EG3.Graph = function(srcId, destIdList) {
    this.position = null;
     
    this.srcId = srcId;

    if (destIdList) {
        this.destIdList = destIdList;
    } else {
        this.destIdList = [];
    }

    /**
     * add Neighbours
     * @param destIds String[]
     */
    this.addDestIds = function(destIds) {
        var destArray;
        if ( typeof destIds == "string") {
            destArray = destIds.split(",");
        } else if ( typeof destIds.forEach == "function") {
            destArray = destIds;
        }

        destArray.forEach(function(e) {
            if (e && e.length > 0) {
                this.destIdList.push(e);
            }
        });
    };

    /**
     * @param edges GraphEdge[]
     */
    this.addEdges = function(edges) {
        edges.forEach(function(e) {
            this.destIdList.push(e.destId);
        });
    };

};

/**
 * @param {scene: THREE.Scene, gridWidth:float, ballRadius:float, lineColor:int, ballColor:int, ballRadius:float, isDrawLines:boolean,}
 */
EG3.NetworkGraph = function(args) {
    this.scene = scene;
    this.isDrawLines = true;
    
    this.ballColor = 0xff0000;
    this.lineColor = 0x0;
    
    this.center = new THREE.Vector3(0, 0, 0);
    
    this.gridWidth = 200;
    this.ballRadius = 50;

    //internal variables -----
    var _ballDist = new BallDistribution(this.gridWidth, this.ballRadius);
    
    var _unRenderedMap = new EG3.Map();
    var _renderedMap = new EG3.Map();
    
    var _o3dPointCloud;
    var _o3dLine;
    var _geomPoints;
    var _geomEdges;
    
    
    //functions ----------------
    this.redraw = function() {
        
    };

    /**
     * Clear all graph objects, but only redraw when invoking redraw
     */
    this.clear = function() {
        _unRenderedMap.clear();
        _renderedMap.clear();
        
        delete _geomPoints;
        delete _geomEdges;
        delete _o3dPointCloud;
        delete _o3dLine;
    };
    
    /**
     * clear and load graphs
     * @param graphs Graph[] 
     */
    this.reloadGraphs = function(graphs) {
        this.clear();

        //init vars        
        _geomPoints = new THREE.Geometry()
        _geomEdges = new THREE.Geometry();
        
        //sort by edge count
        graphs.sort(function(v1, v2) {
            return v2.destIdList.length - v1.destIdList.length;
        });
        
        //load to map
        graphs.forEach(function(graph){
            _unRenderedMap.set(graph.srcId, graph);
        });
        
        graphs.forEach(function(graph){
            makeGraphGeom(graph);
        });
    };
    
    
    //internal functions ----------------------------
    function makeGraphGeom(graph) {
        if(_renderedMap.size() == 0) {
            //first position is origin point
            graph.position = THREE.Vector3(0, 0, 0);
        } else {
            
        }
    };
    
    
    BallDistribution = function(cellWidth, ballRadius) {
        var _ballCnt = -1;

        var _ballRadius = 50;
        var _cellWidth = 200;
        var _preCalculatedCells = [];
        
        if(ballRadius) {
            _ballRadius = ballRadius;
        }
        if(cellWidth) {
            _cellWidth = cellWidth;
        }
        
        preCalculatCells(100000);
        
        this.newBall = function() {
            _ballCnt++;
            
            var x, y, z;
            var cellPos = _preCalculatedCells[_ballCnt];
            
            var diverseStep = _cellWidth / 2;
             
            x = cellPos.x + diverseStep * (Math.random() - 0.5);  
            y = cellPos.y + diverseStep * (Math.random() - 0.5);
            z = cellPos.z + diverseStep * (Math.random() - 0.5);  

            var color = nextColor();
            
            var mat = new THREE.MeshBasicMaterial({color: color});
            var geom = new THREE.SphereGeometry(_ballRadius);
            var ball = new THREE.Mesh(geom, mat);
            
            ball.position.set(x, y, z);
            
            return ball;
        };
        
        function nextColor() {
            var alpha, beta;
            var splitCnt = 12;
            var radianUnit = Math.PI * 2 / splitCnt;
            alpha = Math.floor(_ballCnt / splitCnt);
            beta = _ballCnt - alpha * splitCnt;
            
            var color = (0xff * Math.cos(radianUnit * _ballCnt) << 16) | (0xff * Math.cos(radianUnit * alpha) << 8) | (0xff * Math.cos(radianUnit * beta));
            return color;
        }
        
        function preCalculatCells(count) {
            var center = new THREE.Vector3(0, 0, 0);
            _preCalculatedCells = [center];
            
            var d = 0;
            var i;
            var step = _cellWidth;
            var x, y, z;
            var arrayTmp = [];
            var index;
        
            x = center.x;
            y = center.y;
            z = center.z;
            while(_preCalculatedCells.length <= count) {
                d += 2;
                
                arrayTmp.splice(0, arrayTmp.length);
        
                //1st point 
                x += step;
                y -= step;
                arrayTmp.push(new THREE.Vector3(x, y, z));
                
                //up
                for(i = 1; i <= d; i++) {
                    y += step;
                    arrayTmp.push(new THREE.Vector3(x, y, z));
                }
        
                //left
                for(i = 1; i <= d; i++) {
                    x -= step;
                    arrayTmp.push(new THREE.Vector3(x, y, z));
                }
        
                //down
                for(i = 1; i <= d; i++) {
                    y -= step;
                    arrayTmp.push(new THREE.Vector3(x, y, z));
                }
                
                //right
                for(i = 1; i <= d; i++) {
                    x += step;
                    if(i != d) {
                        arrayTmp.push(new THREE.Vector3(x, y, z));
                    }
                }
                
                //add into array in random order
                while(arrayTmp.length > 0) {
                    index = Math.min(Math.ceil(Math.random() * arrayTmp.length), arrayTmp.length - 1);
                    _preCalculatedCells.push(arrayTmp.splice(index, 1)[0]);
                }
            }
        }
        
    };
    
};


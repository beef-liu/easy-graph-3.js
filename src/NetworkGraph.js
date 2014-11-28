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

/*
EG3.GridPositionDistribution = function(gridWidth) {
    this.gridWidth = 100;
    
    if(gridWidth != undefined) {
        this.gridWidth = gridWidth;
    }
    
    var _ballCnt = -1;
    var _preCalculatedGrids = [];
    preCalculatGrids(this.gridWidth, 100000);
    
    this.reset = function() {
        _ballCnt = -1;
    };

    
    this.nextPosition = function() {
        _ballCnt++;
        
        //position of grid
        var x, y, z;
        var gridPos = _preCalculatedGrids[_ballCnt];
        
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
    
    function preCalculatGrids(gridWidth, count) {
        var center = new THREE.Vector3(0, 0, 0);
        _preCalculatedGrids = [center];
        
        var d = 0;
        var i;
        var step = gridWidth;
        var x, y, z;
        var arrayTmp = [];
        var index;
    
        x = center.x;
        y = center.y;
        z = center.z;
        while(_preCalculatedGrids.length <= count) {
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
                _preCalculatedGrids.push(arrayTmp.splice(index, 1)[0]);
            }
        }
    }
    
};
*/

EG3.GridPositionDistribution = function(gridWidth) {
    this.gridWidth = 100;
    
    if(gridWidth != undefined) {
        this.gridWidth = gridWidth;
    }
    
    //var _ballIndex; 
    var _gridCellCount, _roundEndPos;
    var _curRoundGrids = [];
    
    this.reset = function() {
        //_ballIndex = -1;
        _gridCellCount = 0;
        
        _curRoundGrids.splice(0, _curRoundGrids.length);
        _curRoundGrids.push({x: 0, y: 0, z: 0});
        
        _roundEndPos = {x: 0, y: 0, z: 0};
    };

    this.reset();
    
    this.nextPosition = function() {
        //_ballIndex ++;
        
        //position of grid
        var x, y, z;

        if(_curRoundGrids.length == 0) {
            //create positions of this round
            _gridCellCount += 2;
            
            createRoundPositions(_gridCellCount, this.gridWidth);
        }     
        
        var randIndex = Math.min(Math.max(Math.floor(Math.random() * _curRoundGrids.length), _curRoundGrids.length - 1), 0);
        var pos = _curRoundGrids.splice(randIndex, 1)[0];
        
        return pos;
    };
    
    function createRoundPositions(d, step) {
        var x = _roundEndPos.x;
        var y = _roundEndPos.y;
        var z = _roundEndPos.z;
        
        //1st point
        x += step;
        y -= step;
        _curRoundGrids.push({x: x, y: y, z: z});
        
        _roundEndPos.x = x;
        _roundEndPos.y = y;
        _roundEndPos.z = z;
        
        //up
        for(i = 1; i <= d; i++) {
            y += step;
            _curRoundGrids.push({x: x, y: y, z: z});
        }

        //left
        for(i = 1; i <= d; i++) {
            x -= step;
            _curRoundGrids.push({x: x, y: y, z: z});
        }

        //down
        for(i = 1; i <= d; i++) {
            y -= step;
            _curRoundGrids.push({x: x, y: y, z: z});
        }
        
        //right
        for(i = 1; i <= d; i++) {
            x += step;
            if(i != d) {
                _curRoundGrids.push({x: x, y: y, z: z});
            }
        }
    }
};

/**
 * @param originPoint: {x: float, y: float, z: float}   //origin point
 * @param direction: {x: float, y: float, z: float}     //direction of axis
 * @param maxCount: int
 * @param space: int                                    //space between 2 points
 */
EG3.QuaterSpherePositionDistribution = function(originPoint, direction, maxCount, space, fov) {
    var FloorPI = 3;

    this.fov = 90;
    if(fov != undefined) {
        this.fov = fov;
    }

    this.originPoint = originPoint;
    this.direction = direction;
    this.maxCount = maxCount;
    this.space = space;

    var _fovRad = Math.PI * (this.fov / 180);
    
    var _vector3Tmp = new THREE.Vector3(0, 0, 0);
    var _roundIndex;
    var _curRoundPositions = [];
    var _quaternionForRotate = new THREE.Quaternion();
    
    this.radius = null;
    this.axisUnitVector = null;
    this.axisEndPoint = null;
    
    this.reset = function() {
        //init radius ----------------
        this.radius = calcuRadius(maxCount, this.space, _fovRad);

        //init axis ------------------    
        var axisVectorLength = Math.pow(this.direction.x * this.direction.x + this.direction.y * this.direction.y + this.direction.z * this.direction.z, 0.5);
        this.axisUnitVector = new THREE.Vector3(
            this.direction.x / axisVectorLength, 
            this.direction.y / axisVectorLength, 
            this.direction.z / axisVectorLength
            );
        this.axisEndPoint = {
            x: originPoint.x + this.radius * this.axisUnitVector.x, 
            y: originPoint.y + this.radius * this.axisUnitVector.y, 
            z: originPoint.z + this.radius * this.axisUnitVector.z
            };
        
        //init rotation matrix -------
        var vZ = new THREE.Vector3(0, 0, 1);
        var angle = 0;
        if(!this.axisUnitVector.equals(vZ)) {
            var triangle = new THREE.Triangle(new THREE.Vector3(0, 0, 0), vZ, this.axisUnitVector);
            var vNormal = triangle.normal();
            angle = Math.acos(vZ.dot(this.axisUnitVector));
            _quaternionForRotate.setFromAxisAngle(vNormal, angle);
        } else {
            _quaternionForRotate = null;
        }
        
        
        
        //init vars for round        
        _roundIndex = 0;
        _curRoundPositions.splice(0, _curRoundPositions.length);
        _curRoundPositions.push({x: this.axisEndPoint.x, y: this.axisEndPoint.y, z: this.axisEndPoint.z});
    };

    this.reset();
    
    this.nextPosition = function() {
        var x, y, z;
        
        if(_curRoundPositions.length == 0) {
            //create positions of this round
            _roundIndex ++;
            
            var roundPointCount = 2 * FloorPI * _roundIndex;    
            createRoundPositions(this.radius, this.space * _roundIndex, roundPointCount);
        }        
        
        var randIndex = Math.min(Math.max(Math.floor(Math.random() * _curRoundPositions.length), _curRoundPositions.length - 1), 0);
        var pos = _curRoundPositions.splice(randIndex, 1)[0];
        
        //rotate by axis
        if(_quaternionForRotate) {
            _vector3Tmp.set(pos.x, pos.y, pos.z);
            _vector3Tmp.applyQuaternion(_quaternionForRotate);
            
            pos.x = _vector3Tmp.x;
            pos.y = _vector3Tmp.y;
            pos.z = _vector3Tmp.z;
        }
        
        return pos;
    };
    
    function calcuRadius(maxCount, space, fovRad) {
        var roundCnt = Math.ceil(Math.pow(maxCount / FloorPI + 0.25, 0.5) - 0.5);
        var faceRadius = space * roundCnt;
        var radius = faceRadius / (fovRad / 2);
        
        return radius;
    }
    
    function createRoundPositions(R, r, splitCount) {
        var alphaUnit = Math.PI * 2 / splitCount;
        var i;
        var alpha = 0;
        for(i = 0; i < splitCount; i++) {
            _curRoundPositions.push({
                x: r * Math.cos(alpha),
                y: r * Math.sin(alpha),
                z: Math.pow(R*R - r*r, 0.5),
            });
            
            alpha += alphaUnit;
        }
    }
};

/**
 * @param args {
 *      scene: THREE.Scene,         //required. 
 *      center: THREE.Vector3,      //optional. (default: (0, 0, 0))
 *      gridWidth: float,           //optional. (default: 200)
 *      lineColor: int,             //optional. (default: 0x0) 
 *      pointColor: int,            //optional. (default: 0xff0000)
 *      pointRadius: float,         //optional. (default: 50) It is just a minimal for these graph whose count of edges is 0 or 1. 
 *      isDrawLines: boolean,       //optional. (default: true)
 *      isDrawNeighbours: boolean,  //optional. (default: true)
 * }
 * 
 * There are 2 type of elements shown in canvas, point and line. 
 * Lines are presentations for edges, and points for vertices of the network graph.
 * 
 */
EG3.NetworkGraph = function(args) {
    this.scene = scene;
    this.center = new THREE.Vector3(0, 0, 0);
    this.gridWidth = 200;

    this.lineColor = 0x0;
    
    this.pointColor = 0xfd5a5a;
    this.pointRadius = 50;
    
    
    this.isDrawLines = true;
    this.isDrawNeighbours = true;
    
    if(args.center != undefined) {
        this.center = args.center;
    }
    if(args.gridWidth != undefined) {
        this.gridWidth = args.gridWidth;
    }

    if(args.lineColor != undefined) {
        this.lineColor = args.lineColor;
    }
    if(args.pointColor != undefined) {
        this.pointColor = args.pointColor;
    }
    if(args.pointRadius != undefined) {
        this.pointRadius = args.pointRadius;
    }

    if(args.isDrawLines != undefined) {
        this.isDrawLines = args.isDrawLines; 
    }
    if(args.isDrawNeighbours != undefined) {
        this.isDrawNeighbours = args.isDrawNeighbours; 
    }
    

    //internal variables -----
    var _pointDist = new GridPositionDistribution(this.gridWidth);
    
    //key: srcId    value: Object3D(.userData is Grpah type)
    var _ballMap = new EG3.Map();
    
    var _matPoint;
    var _matLine;
    var _o3dContainer = new THREE.Object3D();
    var _o3dPoints;
    var _geomLines;
    
    
    //functions ----------------
    this.redraw = function() {
        
    };

    /**
     * Clear all graph objects, but only redraw when invoking redraw
     */
    this.clear = function() {
        _ballMap.clear();
        
        _o3dContainer.remove(_o3dPoints);
        _o3dContainer.remove(_o3dLines);
        
        delete _o3dPoints;
        delete _o3dLines;
        
        _pointDist.reset();
    };
    
    /**
     * clear and load graphs
     * @param graphs Graph[] 
     */
    this.reloadGraphs = function(graphs) {
        this.clear();

        //init vars        
        _matPoint = new THREE.MeshBasicMaterial({color: this.pointColor});
        _pointDist.ballMat = _matPoint;
        
        _matLine = new THREE.LineBasicMaterial({color: this.lineColor});
        
        _o3dPoints = new THREE.Object3D()
        _geomLines = new THREE.Geometry();
        
        //sort by edge count
        /*
        graphs.sort(function(v1, v2) {
            return v2.destIdList.length - v1.destIdList.length;
        });
        */

        
        //iterate every one to make ball
        graphs.forEach(function(graph){
            makeGraph(graph);
        });
        
        //iterate every one to make neighbours
        if(this.isDrawNeighbours) {
            graphs.forEach(function(graph){
                makeGraphOfNeighbours(graph);
            });
        }
        
    };
    
    
    //internal functions ----------------------------
    function makeGraph(graph) {
        var ratio = Math.pow(Math.max(graph.destIdList.length, 1), 0.33);
        var radius = this.pointRadius * ratio;
        
        var x, y, z;
        var gridPos = _pointDist.nextPosition(radius);
        //random diverse            
        var diverseStep = this.gridWidth / 2;
        x = gridPos.x + diverseStep * (Math.random() - 0.5);  
        y = gridPos.y + diverseStep * (Math.random() - 0.5);
        z = gridPos.z + diverseStep * (Math.random() - 0.5);  

        //var color = nextColor();
        // var mat = new THREE.MeshBasicMaterial({color: color});
        var geom = new THREE.SphereGeometry(radius);
        var ball = new THREE.Mesh(geom, _matPoint);
        ball.position.set(x, y, z);

        ball.userData = graph;
        _o3dPoints.add(ball);
        
        _ballMap.set(graph.srcId, ball);
    }
    
    function makeGraphOfNeighbours(graph) {
        var ratio = Math.pow(Math.max(graph.destIdList.length, 1), 0.33);
        var radius = this.pointRadius * ratio;
        graph.destIdList.forEach(function(destId) {
            
        });
    };
};


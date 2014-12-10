EG3 = {
    REVISION : '1'
}; 

//make Array.forEach for browsers such as IE8
( function() {
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callBack, thisArg) {
            if (!this) {
                throw new TypeError("this is undefined");
            }
            if (!callBack) {
                throw new TypeError("callBack is undefined");
            }

            var obj = Object(this);
            var len = obj.length >>> 0;
            //convert obj.length to UInt32

            if ( typeof callBack != "function") {
                throw new TypeError(callBack + " is not a function");
            }

            var T;
            if (thisArg) {
                T = thisArg;
            }

            var i = 0;
            while (i < len) {
                var e;
                if ( i in obj) {
                    e = obj[i];
                    callBack.call(T, e, i, obj);
                }

                i++;
            }
        };
    }
}());

EG3.Map = function() {
    var _indexMap = {};
    var _entryArray = [];
    var _size = 0;
    
    this.del = function(key) {
        var index = _indexMap[key];
        if(index != undefined) {
            delete _indexMap[key];
            delete _entryArray[index];
            
            _size --;
            
            return true;
        } else {
            return false;
        }
    };
    
    this.clear = function() {
        delete _indexMap;
        _indexMap = {};
        
        delete _entryArray;
        _entryArray = [];
        
        _size = 0;
    };
    
    this.size = function() {
        return _size;  
    };
    
    this.set = function(key, value) {
        if(key == undefined) {
            throw new TypeError("key is undefined");
        }
        
        var index = _indexMap[key];
        if(index == undefined) {
            _indexMap[key] = _entryArray.length;
            _entryArray.push({key: key, value: value});

            _size ++;
            
            return true;
        } else {
            _entryArray[index].value = value;
            return false;
        }
    };
    
    this.add = function(obj) {
        var cnt = 0;
        
        for(var key in obj) {
            if(this.set(key, obj[key])) {
                cnt ++;
            }
        }
        
        return cnt;
    };
    
    this.get = function(key) {
        var index = _indexMap[key];
        if(index == undefined) {
            return null;
        } else {
            return _entryArray[index].value;
        }
    };
    
    
    /**
     * @param sortby function(v1, v2), v1,v2 are type of {key:, value:}
     */
    this.sort = function(sortby) {
        if(sortby) {
            _entryArray.sort(sortby);
            rebuildIndexMap();
        } else {
            this.sortByKey();
        }
    };
    
    /**
     * @param isAsc true: sort in ascending order
     */
    this.sortByKey = function(isAsc) {
        var asc = true;
        if(isAsc != undefined) {
            asc = isAsc;
        }
        
        _entryArray.sort(function(v1, v2){
            if(v1.key == v2.key) {
                return 0;
            } else if((v1.key < v2.key) == asc) {
                return -1;
            } else {
                return 1;
            }
        });
        
        rebuildIndexMap();
    };
    
    /**
     * @param isAsc true: sort in ascending order
     */
    this.sortByValue = function(isAsc) {
        var asc = true;
        if(isAsc != undefined) {
            asc = isAsc;
        }
        
        _entryArray.sort(function(v1, v2){
            if(v1.value == v2.value) {
                return 0;
            } else if((v1.value < v2.value) == asc) {
                return -1;
            } else {
                return 1;
            }
        });
        
        rebuildIndexMap();
    };

    function rebuildIndexMap() {
        var entry;
        for(var i = 0; i < _entryArray.length; i++) {
            entry = _entryArray[i];
            _indexMap[entry.key] = i;
        }
    }
    
    /**
     * @param callBack function({key:, value:}, index, this of EG3.Map)
     */
    this.forEach = function(callBack, thisArg) {
        var T;
        if (thisArg) {
            T = thisArg;
        }
        
        for(var i = 0; i < _entryArray.length; i++) {
            if(_entryArray[i] != undefined) {
                callBack.call(T, _entryArray[i], i, this);    
            }
        }
    };
    
};

EG3.Map.prototype = {
    /**
     * output console log
     */
    log: function(msg) {
        if(msg) {
            console.log("EG3.Map " + msg + " -----");    
        } else {
            console.log("EG3.Map -----");
        }
        
        this.forEach(function(v){
            console.log(v);
        }); 
    },
};
/*
EG3.GraphEdge = function(srcId, destId) {
    this.srcId = srcId;
    this.destId = destId;
};
*/

/**
 * @param vid ID of this vertex
 */
EG3.GraphNode = function(vid, vtype) {
    //this.position = null;
    this.vid = null;
    if(vid != undefined) {
        this.vid = vid;
    }
    
    this.vtype = null;
    if(vtype != undefined) {
        this.vtype = vtype;
    }
    
    /**
     * String[] ID list of parents
     */
    this.parents = [];
    
    /**
     * String[] ID list of children
     */
    this.children = [];

    /*
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

    this.addEdges = function(edges) {
        edges.forEach(function(e) {
            this.destIdList.push(e.destId);
        });
    };
    */
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
    var _gridWidth = this.gridWidth;
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

        var i;        
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
EG3.SpherePositionDistribution = function(originPoint, direction, maxCount, space, fov) {
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

EG3.GridSpherePositionDistribution = function(gridWidth, center, surfaceCenter) {
    this.gridWidth = gridWidth;
    this.center = new THREE.Vector3(center.x, center.y, center.z);
    this.surfaceCenter = new THREE.Vector3(surfaceCenter.x, surfaceCenter.y, surfaceCenter.z);
    this.radius = this.surfaceCenter.clone().sub(center).length();
    
    //var _ballIndex;
    var _gridWidth = this.gridWidth;
    var _center = this.center; 
    var _gridCellCount;
    var _curRoundGrids = [];
    
    var _quaternionForRotate = new THREE.Quaternion();
    var _angleStep;
    var _angleX, _angleY;
    var _eulerTmp = new THREE.Euler(0, 0, 0, 'YXZ');
    var _centerVector;
    
    this.reset = function() {
        _gridCellCount = 0;
        
        _curRoundGrids.splice(0, _curRoundGrids.length);
        _curRoundGrids.push(this.surfaceCenter);
        
        //_roundEndVector = new THREE.Vector3(this.surfaceCenter.x - this.center.x, this.surfaceCenter.y - this.center.y, this.surfaceCenter.z - this.center.z);
        
        _angleStep = this.gridWidth / this.radius;

        _angleX = 0;
        _angleY = 0;

        //init rotation matrix -------
        {
            var vZ = new THREE.Vector3(0, 0, 1);
            var axisUnitVector = this.surfaceCenter.clone().sub(this.center).normalize();
            var angle = 0;
            if(!axisUnitVector.equals(vZ)) {
                var triangle = new THREE.Triangle(new THREE.Vector3(0, 0, 0), vZ, axisUnitVector);
                var vNormal = triangle.normal();
                angle = Math.acos(vZ.dot(axisUnitVector));
                _quaternionForRotate.setFromAxisAngle(vNormal, angle);
            } else {
                _quaternionForRotate = null;
            }
        }
        
        _centerVector = new THREE.Vector3(0, 0, this.radius);

        // _quaternionForRotateUp.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -_angleStep);
        // _quaternionForRotateDown.setFromAxisAngle(new THREE.Vector3(1, 0, 0), _angleStep);
                
        // _eulerRightDown = new THREE.Euler(_angleStep, _angleStep, 0, 'XYZ' );
        // _eulerRight = new THREE.Euler(0, _angleStep, 0, 'XYZ' );
        // _eulerLeft = new THREE.Euler(0, -_angleStep, 0, 'XYZ' );
        // _eulerUp = new THREE.Euler(-_angleStep, 0, 0, 'XYZ' );
        // _eulerDown = new THREE.Euler(_angleStep, 0, 0, 'XYZ' );
         
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

        //var randIndex = Math.min(Math.max(Math.floor(Math.random() * _curRoundGrids.length), _curRoundGrids.length - 1), 0);
        var randIndex = 0;
        var pos = _curRoundGrids.splice(randIndex, 1)[0];
        
        return pos;
    };
    
    function createRoundPositions(d, angleStep) {
        //1st point
        _angleY += _angleStep;
        _angleX += _angleStep;
        _curRoundGrids.push(positionRotateFromCenterVector());
        
        //_roundEndVector = vectorTmp.clone();
        
        //up
        for(i = 1; i <= d; i++) {
            _angleX -= _angleStep;
            _curRoundGrids.push(positionRotateFromCenterVector());
        }

        //left
        for(i = 1; i <= d; i++) {
            _angleY -= _angleStep;
            _curRoundGrids.push(positionRotateFromCenterVector());
        }

        //down
        for(i = 1; i <= d; i++) {
            _angleX += _angleStep;
            _curRoundGrids.push(positionRotateFromCenterVector());
        }
        
        //right
        for(i = 1; i <= d; i++) {
            _angleY += _angleStep;
            if(i != d) {
                _curRoundGrids.push(positionRotateFromCenterVector());
            }
        }
    }
    
    function positionRotateFromCenterVector() {
        _eulerTmp.set(_angleX, _angleY, 0, 'YXZ');
        var vectorTmp = _centerVector.clone().applyEuler(_eulerTmp);
        
        //rotate and translate
        if(_quaternionForRotate) {
            vectorTmp.applyQuaternion(_quaternionForRotate);
        }
        return vectorTmp.add(_center);
    }    

    function rotateLeft(vector, angle) {
        var quaternionForRotate = new THREE.Quaternion();
        quaternionForRotate.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -_angleStep);
    }
    
    function vectorToPosition(vector) {
        return new THREE.Vector3(vector.x + _center.x, vector.y + _center.y, vector.z + _center.z);
    }
};


/**
 * @param args {
 *      scene: THREE.Scene,                                             //required. 
 *      center: THREE.Vector3,                                          //optional. (default: (0, 0, 0))
 *      gridWidth: float,                                               //optional. (default: 200)
 *      gridRadianMax: float                                            //optional. (default: Math.PI / 2)
 *      lineColor: int,                                                 //optional. (default: 0x0)
 *      lineArrowLength: float                                          //optional. (default: 100)
 *      lineArrowWidth: float                                           //optional. (default: 15) 
 *      pointColor: int,                                                //optional. (default: 0xff0000)
 *      pointRadius: float,                                             //optional. (default: 50) It is just a minimal for these graph whose count of edges is 0 or 1. 
 *      isDrawLines: boolean,                                           //optional. (default: true)
 *      isDrawNeighbours: boolean,                                      //optional. (default: true)
 *      callbackAfterPointAdded: function(THREE.Object3d, GraphNode){}  //optional.
 * }
 * 
 * There are 2 type of elements shown in canvas, point and line. 
 * Lines are presentations for edges, and points for vertices of the network graph.
 * 
 */
EG3.NetworkGraph = function(args) {
    this.scene = args.scene;
    this.center = new THREE.Vector3(0, 0, 0);
    this.gridWidth = 100;
    this.gridRadianMax = Math.PI / 2;

    this.lineColor = 0x1010ff;
    this.lineArrowLength = 100;
    this.lineArrowWidth = 15;
    
    this.pointColor = 0xfd5a5a;
    this.pointRadius = 8;
    this.pointRadiusMax = this.pointRadius * 10;
        
    
    this.isDrawLines = true;
    this.isDrawNeighbours = true;
    
    if(args.center != undefined) {
        this.center = args.center;
    }
    if(args.gridWidth != undefined) {
        this.gridWidth = args.gridWidth;
    }
    if(args.gridRadianMax != undefined) {
        this.gridRadianMax = args.gridRadianMax;
    }

    if(args.lineColor != undefined) {
        this.lineColor = args.lineColor;
    }
    if(args.lineArrowLength != undefined) {
        this.lineArrowLength = args.lineArrowLength;
    }
    if(args.lineArrowWidth != undefined) {
        this.lineArrowWidth = args.lineArrowWidth;
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
    
    var _callbackAfterPointAdded = args.callbackAfterPointAdded;
    
    this.o3dPoints = undefined;
    this.o3dLines = undefined;
    

    //internal variables -----
    var _center = this.center;
    var _gridWidth = this.gridWidth;
    var _gridRadianMax = this.gridRadianMax;
    var _lineColor = this.lineColor;
    var _lineArrowLength = this.lineArrowLength;
    var _lineArrowWidth = this.lineArrowWidth;
    var _pointColor = this.pointColor;
    var _pointRadius = this.pointRadius;
    var _pointRadiusMax = this.pointRadiusMax;
    var _isDrawLines = this.isDrawLines;
    var _isDrawNeighbours = this.isDrawNeighbours;
    
    
    //var _sphereDistFov = 90;
    //var _rootNodeDist;
    
    //key: srcId    value: Object3D(.userData is Grpah type)
    var _ballMap = new EG3.Map();
    
    //var _matPoint;
    //var _matLine;
    var _o3dContainer;
    var _o3dPoints;
    var _o3dLines;
    var _geomLines;
    
    //var _rootGridSphereCenter;
    var _childrenFocusPosition;
    
    
    //functions ----------------
    /**
     * Clear all graph objects, but only redraw when invoking redraw
     */
    this.clear = function() {
        _ballMap.clear();
        
        if(_o3dContainer) {
            this.scene.remove(_o3dContainer);
        }
        
        delete _o3dPoints;
        delete _o3dLines;
        delete _o3dContainer;
    };
    
    /**
     * clear and load graphNodes
     * @param graphs GraphNode[] 
     */
    this.reloadGraphNodes = function(graphNodes) {
        this.clear();

        //init vars
        //_matPoint = new THREE.MeshBasicMaterial({color: this.pointColor});
        //_matLine = new THREE.LineBasicMaterial({color: this.lineColor});
        
        _o3dPoints = new THREE.Object3D()
        _o3dLines = new THREE.Object3D();
        _geomLines = new THREE.Geometry();
        
        this.o3dPoints = _o3dPoints;
        this.o3dLines = _o3dLines;

        _o3dContainer = new THREE.Object3D();
        _o3dContainer.add(_o3dPoints);
        _o3dContainer.add(_o3dLines);
        this.scene.add(_o3dContainer);
        
        //sort by edge count
        /*
        graphs.sort(function(v1, v2) {
            return v2.destIdList.length - v1.destIdList.length;
        });

        //calculate the radius of biggest ball
        if(graphs[0].destIdList.length > 0) {
            var maxCount = graphs[0].destIdList.length;
            var sphereOrigin = {x:0, y:0, z:0};
            var sphereDir = {x:0, y:0, z:1};
            var sphereDist = makeSphereDistribution(sphereOrigin, sphereDir, maxCount);
            _rootNodeDist.gridWidth = sphereDist.radius * Math.sin(Math.PI * (_sphereDistFov / 2) / 180) * 2;
        } 
        
        //iterate every one to make balls
        graphs.forEach(function(graph){
            makeGraphSrcNode(graph);
        });
        
        //iterate every one to make neighbours
        if(this.isDrawNeighbours) {
            graphs.forEach(function(graph){
                //makeGraphOfNeighbours(graph);
            });
        }
        */
       
       //var gridSphereRadius = Math.max(makeGridSphereRadius(graphNodes.length), 1000);
       var gridSphereCenter = new THREE.Vector3(this.center.x, this.center.y, this.center.z - 800); 
       // _rootNodeDist = new EG3.GridSpherePositionDistribution(this.gridWidth, gridSphereCenter, this.center);
       //_rootGridSphereCenter = gridSphereCenter;
       _childrenFocusPosition = new THREE.Vector3(gridSphereCenter.x, gridSphereCenter.y, gridSphereCenter.z - 500);
       makeGraphNodesNoRecursion(graphNodes, gridSphereCenter);
    };
    
    //internal functions ----------------------------
    function makeGridSphereRadius(maxCount, gridWidth, gridRadianMax) {
        return gridWidth * Math.pow(maxCount, 0.5) / gridRadianMax;
    }
    function getBallRadiusOfGraph(childrenCount, pointRadius) {
        if(childrenCount == 0) {
            return pointRadius;
        } else {
            return pointRadius * Math.log(childrenCount) * 2;
        }
    }
    
    function addLine(startPoint, endPoint) {
        if(!_isDrawLines) {
            return;
        }
        
        var p2 = endPoint.clone();
        var lineVec = p2.sub(startPoint);
        var lineLen = lineVec.length();
        
        var headLength = _lineArrowLength;
        var headWidth = _lineArrowWidth;

        var obj3Line = new THREE.ArrowHelper(lineVec.normalize(), startPoint, lineLen, _lineColor, headLength, headWidth);
        
        _o3dLines.add(obj3Line);
    }
    
    /* old solution (Grid)
    function makeGraph(graph) {
        var ratio = Math.pow(Math.max(graph.destIdList.length, 1), 0.33);
        var radius = this.pointRadius * ratio;
        
        var x, y, z;
        var gridPos = _rootNodeDist.nextPosition(radius);
        //random diverse            
        var diverseStep = this.gridWidth / 2;
        x = gridPos.x + diverseStep * (Math.random() - 0.5);  
        y = gridPos.y + diverseStep * (Math.random() - 0.5);
        z = gridPos.z + diverseStep * (Math.random() - 0.5);  

        //var color = nextColor();
        // var mat = new THREE.MeshBasicMaterial({color: color});
        var ballR = getBallRadiusOfGraph(graph);
        var geom = new THREE.SphereGeometry(ballR);
        var ball = new THREE.Mesh(geom, _matPoint);
        ball.position.set(x, y, z);

        ball.userData = graph;
        _o3dPoints.add(ball);
        
        //save to map
        _ballMap.set(graph.srcId, ball);
    }
    */

    function makeGraphNodesNoRecursion(graphNodes, gridSphereCenter) {
        var graphNodesPackageBuffer = [];
        var graphNodesPackageBuffer2 = [];
        var allGraphNodesMap = new EG3.Map();
        var unrenderedGraphNodesMap = new EG3.Map();
        var renderedNodePosMap = new EG3.Map();

        //save in buffer and filter root nodes
        var nodesPackage = {isFakeParent:true, parentPos: gridSphereCenter, children:[]};
        graphNodes.forEach(function(graphNode) {
            if(graphNode.vid != undefined && graphNode.vid.length > 0) {
                unrenderedGraphNodesMap.set(graphNode.vid, graphNode);
                allGraphNodesMap.set(graphNode.vid, graphNode);
                
                if(graphNode.parents.length == 0) {
                    nodesPackage.children.unshift(graphNode);
                }
            }
        });
        if(nodesPackage.children.length == 0) {
            graphNodes.sort(function(v1, v2){
                return v2.children.length - v1.children.length;
            });
            
            nodesPackage.children = graphNodes.splice(0, 1000);
        }
        
        graphNodesPackageBuffer.unshift(nodesPackage);

        var newGridSphereCenter;
        while(graphNodesPackageBuffer.length != 0) {
            //draw balls for this level -----------
            var nodesPackage;
            while((nodesPackage = graphNodesPackageBuffer.pop())) {
                //position distribution
                var posDist;
                {
                    newGridSphereCenter = nodesPackage.parentPos;  
                    var newGridSphereRadius = Math.max(
                        makeGridSphereRadius(nodesPackage.children.length, _gridWidth, _gridRadianMax), 
                        _gridWidth * 2);
                    var newGridSphereSurfaceCenterDir = newGridSphereCenter.clone().sub(_childrenFocusPosition).normalize();
                    var newGridSphereSurfaceCenter = newGridSphereSurfaceCenterDir.multiplyScalar(newGridSphereRadius).add(newGridSphereCenter);
                    posDist = new EG3.GridSpherePositionDistribution(_gridWidth, newGridSphereCenter, newGridSphereSurfaceCenter);
                }
    
                var graph;
                while((graph = nodesPackage.children.pop())) {
                    if(unrenderedGraphNodesMap.get(graph.vid) == undefined) {
                        continue;
                    }
                    unrenderedGraphNodesMap.del(graph.vid);
                    
                    var thisPos = renderedNodePosMap.get(graph.vid); 
                    if(thisPos == undefined) {
                        thisPos = posDist.nextPosition();
                        renderedNodePosMap.set(graph.vid, thisPos);
                        
                        //create ball ------------                        
                        var ballR = getBallRadiusOfGraph(graph.children.length, _pointRadius);
                        var geom = new THREE.SphereGeometry(ballR);
                        //var ball = new THREE.Mesh(geom, _matPoint);
                        var ball = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({color: _pointColor}));
                        ball.position.set(thisPos.x, thisPos.y, thisPos.z);
                
                        //ball.userData = graph;
                        _o3dPoints.add(ball);
        
                        //callback                    
                        if(_callbackAfterPointAdded) {
                            _callbackAfterPointAdded(ball, graph);
                        }
                    }
                    //add line
                    if(!nodesPackage.isFakeParent) {
                        addLine(newGridSphereCenter, thisPos);    
                    }
                    
                    
                    //children
                    if(graph.children.length > 0) {
                        var newNodesPackage = {parentPos: thisPos.clone(), children:[]}; 
                        graph.children.forEach(function(childId) {
                            var node = allGraphNodesMap.get(childId);
                            if(node != undefined) {
                                newNodesPackage.children.unshift(node);    
                            }
                        });
                        graphNodesPackageBuffer2.unshift(newNodesPackage);
                    }
                }
            }
            
            //for deeper level
            graphNodesPackageBuffer = graphNodesPackageBuffer2.splice(0, graphNodesPackageBuffer2.length);
        }
        
        //possibly some nodes do not connect to 1st level node.
        if(unrenderedGraphNodesMap.size() > 0) {
            var newGraphNodes = [];
            unrenderedGraphNodesMap.forEach(function(node) {
                newGraphNodes.push(node);
            });
            
            makeGraphNodesNoRecursion(newGraphNodes, newGridSphereCenter);
        }
    }
   
   /* 
    function makeGraphNodes(graphNodes, gridSphereCenter, gridSphereSurfaceCenter) {
        var posDist = new EG3.GridSpherePositionDistribution(this.gridWidth, gridSphereCenter, gridSphereSurfaceCenter);
        
        graphNodes.forEach(function(graph) {
            var thisPos = posDist.nextPosition();   
        
            var ballR = getBallRadiusOfGraph(graph.children.length, this.pointRadius);
            var geom = new THREE.SphereGeometry(ballR);
            var ball = new THREE.Mesh(geom, _matPoint);
            ball.position.set(thisPos.x, thisPos.y, thisPos.z);
    
            //ball.userData = graph;
            _o3dPoints.add(ball);
            
            //recurse children
            if(graph.children.length > 0) {
               var newGridSphereRadius = Math.min(makeGridSphereRadius(graph.children.length), this.gridWidth * 2);
               var newGridSphereCenter = thisPos.clone();
               var newGridSphereSurfaceCenter = gridSphereCenter.clone().sub(_childrenFocusPosition);
               var length = gridSphereSurfaceCenter.length();
               var scalar = (length + gridSphereRadius) / length;
               newGridSphereSurfaceCenter.multiplyScalar(scalar);
               // _rootNodeDist = new EG3.GridSpherePositionDistribution(this.gridWidth, gridSphereCenter, this.center);
               
               //no recursion, deeper visiting move to invoker method
               makeGraphNodes(graph.children, newGridSphereCenter, newGridSphereSurfaceCenter);
            }
        });
    }
    */
   
    /*
    function makeNeighboursGraph(graph, ) {
        //sphere distribution        
        var childrenCount = graph.destIdList.length;
        if(childrenCount > 0) {
            var sphereOrigin = {x:0, y:0, z:0};
            var sphereDir;
            if(parentPosition == undefined) {
                sphereDir = {x:0, y:0, z:1};
            } else {
                sphereDir = {x:position.x - parentPosition.x, y:position.y - parentPosition.y, z:position.z - parentPosition.z};
            }
            var sphereDist = makeSphereDistribution(sphereOrigin, sphereDir, childrenCount, this.pointRadiusMax);
        }

        graph.destIdList.forEach(function(destId) {
            
        });
    };
    function makeSphereDistribution(originPoint, direction, maxCount, space) {
        return new EG3.SpherePositionDistribution(originPoint, direction, maxCount, space, _sphereDistFov);
    }
    */
};


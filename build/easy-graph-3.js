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
    
    this.del = function(key) {
        var index = _indexMap[key];
        if(index != undefined) {
            delete _indexMap[key];
            delete _entryArray.splice(index, 1);
        }
    };
    
    this.clear = function() {
        delete _indexMap;
        _indexMap = {};
        
        delete _entryArray.splice(0, _entryArray.length);
    };
    
    this.size = function() {
        return _entryArray.length;  
    };
    
    this.set = function(key, value) {
        if(key == undefined) {
            throw new TypeError("key is undefined");
        }
        
        var index = _indexMap[key];
        if(index == undefined) {
            _indexMap[key] = _entryArray.length;
            _entryArray.push({key: key, value: value});
        } else {
            _entryArray[index].value = value;
        }
    };
    
    this.add = function(obj) {
      for(var key in obj) {
          this.set(key, obj[key]);
      }
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
            callBack.call(T, _entryArray[i], i, this);
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
EG3.GraphEdge = function(srcId, destId) {
    this.srcId = srcId;
    this.destId = destId;
};

EG3.Graph = function(srcId, destIdList) {
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

EG3.NetworkGraph = function(scene) {
    this.scene = scene;
    this.enableDrawLines = true;
    
    this.pointColor = 0xff0000;
    this.lineColor = 0x0;
    
    this.center = new THREE.Vector3(0, 0, 0);

    //internal variables -----
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
        
        //load to map
        graphs.forEach(function(graph){
            _unRenderedMap.set(graph.srcId, graph);
        });
        
        var position = this.center;

                
        //makeGraphGeom(position, );
    };
    
    
    //internal functions ----------------------------
    function makeGraphGeom(position, graph) {
          
    };
    
};


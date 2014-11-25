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

                
        makeGraphGeom(position, );
    };
    
    
    //internal functions ----------------------------
    function makeGraphGeom(position, graph) {
          
    };
    
};


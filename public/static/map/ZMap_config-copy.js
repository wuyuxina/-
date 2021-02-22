var map;
var vectorLayer;
var PROJECTION_4326 = "EPSG:4326";
var PROJECTION_3857 = "EPSG:3857";
var IDENTIFY_LAYER_OPTION_ALL = "all"
var IDENTIFY_LAYER_OPTION_TOP = "top"
var IDENTIFY_LAYER_OPTION_VISIBLE = "visible";
var styleMap;
var freeHandCircle;

var vectorLayer;
var modifyTool = null;
var vectorenit = null;
var attributesenit = null;

proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");

/**
 * 地图初始化
 * @method 方法名

 * @param {object} map 地图对象
 * @param {String} mapid 地图容器
 * @param {json} data 地图各项参数
 * 
 * @return {返回值类型} 返回值说明

 */
function initMap(mapid,data) {
	 console.log("-----initMap==");

	var maptype = "geoserver"; //地图类型 默认geoserver
	if (data.gis_type) {
		maptype = data.gis_type;;
	}

	var mapUrl_dt = ""; //底图ip
	if (data.gis_dtip) {
		mapUrl_dt = data.gis_dtip;
	}
	var mapUrl_bz = ""; //标注ip
	if (data.gis_bzip) {
		mapUrl_bz = data.gis_bzip;
	}

	var layerName = "";//图层名称
	if (data.gis_layerName) {
		layerName = data.gis_layerName;
	}

	var fullExtent = [];//全图范围
	if (data.gis_fullExtent) {
		fullExtent = data.gis_fullExtent;
	}

	var origin = [-400.0, 400.0];//始点
	if (data.gis_origin) {
		origin = data.gis_origin;
	}

	var center = [];//中心点
	if (data.gis_center) {
		center = data.gis_center;
	}

	var resolutions = [];//分辨率
	if (data.gis_resolutions) {
		resolutions = data.gis_resolutions;
	}

	var zoom = 0;//当前级别
	if (data.gis_zoom) {
		zoom = data.gis_zoom;
	}

	var minZoom = 0;//最小级
	if (data.gis_minZoom) {
		minZoom = data.gis_minZoom;
	}
	var maxZoom = data.gis_maxZoom;//最大级
	if (data.gis_maxZoom) {
		maxZoom = data.gis_maxZoom;
	}

	var projID = 4326;//坐标系标识ID
	if (data.gis_projID) {
		projID = data.gis_projID;
	}

	var projection = ol.proj.get('EPSG:4326');

	switch (projID) {
		case 4326:
			projection = ol.proj.get('EPSG:4326');
			break;
		case 4490:
			projection = ol.proj.get('EPSG:4490');
			// projection = new ol.proj.Projection({
   //        code: 'EPSG:4490',
   //        units: 'degrees',
   //        axisOrientation: 'neu',
   //        global: true
   //    });
	} 

	
  var backgroundColor = "#FFFFFF"; //背景色
	if (data.backgroundColor) {
		backgroundColor = data.backgroundColor;
	}

	var zoomBarVisible = false; //导航条
	if (data.zoomBarVisible) {
		zoomBarVisible = data.zoomBarVisible;
	}

	var scaleBarVisible = false;//比例尺
	if (data.scaleBarVisible) {
		scaleBarVisible = data.scaleBarVisible;
	}

	var mousePositionVisible = false;//拾取坐标
	if (data.mousePositionVisible) {
		mousePositionVisible = data.mousePositionVisible;
	}

	if (maptype == 'arcgis') {
		map = new gis.ZMap({
			target : mapid,
			backgroundColor: backgroundColor,
			baseLayers : [],
			projection : projection,
			resolutions : resolutions,   
			center:center,
            minZoom : minZoom,           
			maxZoom : maxZoom,          
			zoom :zoom,               			
			extent:fullExtent,
			scaleBarVisible: scaleBarVisible,
			zoomBarVisible: zoomBarVisible,
			mousePositionVisible: mousePositionVisible,
			zoomChange : function() {
				//zoomChangeCallBack();
				if(typeof mapZoomChange === "function"){
					//mapZoomChange(map.getZoom());
				}
			},
			initComplete : function(cMap) {
					map = cMap; 
					// 初始化底图
					var layerOption = { 
						name: layerName,
						url: mapUrl_dt,
						projection : projection,
						origin : origin,
						resolutions : resolutions,
						extent : fullExtent
					};
					var baseLayer = cMap.getArcgisTileLayer(layerOption); 
					map.getOLMap().addLayer(baseLayer); 
				} 
		});
		
	}else if (maptype == 'supermap') {
		map = new gis.ZMap({
			target : mapid,
			backgroundColor: backgroundColor,
			baseLayers : [],
			projection : projection,
			center:center,
			minZoom : minZoom,           
			maxZoom : maxZoom,          
			zoom : zoom,               
			extent:fullExtent,
			scaleBarVisible: scaleBarVisible,
			zoomBarVisible: zoomBarVisible,
			mousePositionVisible: mousePositionVisible,
			zoomChange : function() {
				//zoomChangeCallBack();
				if(typeof mapZoomChange === "function"){
					mapZoomChange(map.getZoom());
				}
			},
			initComplete : function(cMap) {
					map = cMap; 
					var baseLayer = new ol.layer.Tile({
						name : 'baselayer',
						source : new ol.source.TileSuperMapRest({ // 超图需要引用的组件
							wrapX : true,
							url : mapUrl
						})
					});
					map.getOLMap().addLayer(baseLayer);
			}
		});
	}else if (maptype == 'geoserver') {
		
	}else if (maptype =='tianditu'){

		map = new gis.ZMap({
			target : mapid,
			backgroundColor: backgroundColor,
			baseLayers : [],
			projection : projection,
			center:center,
			minZoom: minZoom,           
			maxZoom: maxZoom,          
			zoom: zoom,             
			scaleBarVisible: scaleBarVisible,
			zoomBarVisible: zoomBarVisible,
			mousePositionVisible: mousePositionVisible,
			zoomChange : function() {
				//zoomChangeCallBack();
				if(typeof mapZoomChange === "function"){
					//mapZoomChange(map.getZoom());
				}
			},

		initComplete : function(cMap) {
				map = cMap;
				var VEC_W = new ol.layer.Tile({
					name: "VEC_W",
					groupKey:"TDT_VECTOR",
					source:new ol.source.XYZ({
						url:mapUrl_dt
		      			// url:"http://t{1-6}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a64782b550587d3367380beec20779df"
					})
				});
				var CVA_W = new ol.layer.Tile({
					name: "CVA_W",
					groupKey:"TDT_VECTOR",
					source:new ol.source.XYZ({
						url:mapUrl_bz
		      			// url:"http://t{1-6}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a64782b550587d3367380beec20779df"
					})
				});
				map.getOLMap().addLayer(VEC_W);
				map.getOLMap().addLayer(CVA_W);

				//setStyleByMap();
				if(typeof mapOver === "function"){
					//mapOver();
					console.log("mapOver")
				}

			}
		});

	}else if (maptype =='BaiDu'){

		map = new gis.ZMap({
			target : mapid,
			backgroundColor: backgroundColor,
			baseLayers : [],
			projection : projection,
			center:center,
			minZoom: minZoom,           
			maxZoom: maxZoom,          
			zoom: zoom,             
			scaleBarVisible: scaleBarVisible,
			zoomBarVisible: zoomBarVisible,
			mousePositionVisible: mousePositionVisible,
			zoomChange : function() {
				//zoomChangeCallBack();
				if(typeof mapZoomChange === "function"){
					//mapZoomChange(map.getZoom());
				}
			},

			initComplete : function(cMap) {
	      		map = cMap;
      			var baseLayer = new ol.layer.Tile({
					source:new BaiduMap({url:'http://maponline0.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&udt=20200120&scaler=2&p=0'},true)
      			});
      			map.getOLMap().addLayer(baseLayer);

			}
		});

	}else if (maptype == 'zhejiangDZ'){
		projection.setExtent([-180,-90,180,90]);
		var projectionExtent = projection.getExtent();
		var size = 360/ 256; //Extent.getWidth();
		var resolutions = new Array(20);
		var matrixIds = new Array(20);
		for (var z = 0; z < 20; ++z) {
			// generate resolutions and matrixIds arrays for this WMTS
			resolutions[z] = size / Math.pow(2, z);
			matrixIds[z] = z;
		}
		map = new gis.ZMap({
			target : mapid,
			backgroundColor: backgroundColor,
			baseLayers : [],
			projection : projection,
			resolutions : resolutions,
			center:center,
			minZoom: 5,           
			maxZoom: 18,          
			zoom: zoom,             
			//extent:fullExtent,
			scaleBarVisible: scaleBarVisible,
			zoomBarVisible: zoomBarVisible,
			mousePositionVisible: mousePositionVisible,
			zoomChange : function() {
				//zoomChangeCallBack();
				if(typeof mapZoomChange === "function"){
					mapZoomChange(map.getZoom());
				}
			},

			initComplete : function(cMap) {
				map = cMap;
				var VEC_W = new ol.layer.Tile({
					name: "VEC_W",
					groupKey:"TDT_VECTOR",
					source:new ol.source.XYZ({
						url:mapUrl
						// url:"http://t{1-6}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a64782b550587d3367380beec20779df"
					})
				});
				var CVA_W = new ol.layer.Tile({
					name: "CVA_W",
					groupKey:"TDT_VECTOR",
					source:new ol.source.XYZ({
						url:mapUrlzj
						// url:"http://t{1-6}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a64782b550587d3367380beec20779df"
					})
				});

				var VEC_ZJ = new ol.layer.Tile({
					name: "VEC_ZJ",
					source: new ol.source.WMTS({
						url:'http://ditu.zjzwfw.gov.cn/mapserver/vmap/WMTS/1.0/zjvmap/zjlwdt',
						layer: 'zjvmap',
						matrixSet: 'EPSG:4490',
						format: 'image/png',
						projection: projection,
						tileGrid: new ol.tilegrid.WMTS({
							origin: [-180,90],
							resolutions: resolutions,
							matrixIds: matrixIds
						}),
						style: 'default',
						wrapX: true
					})
				});
				var CVA_ZJ = new ol.layer.Tile({
					name: "CVA_ZJ",
					source: new ol.source.WMTS({
						url:'https://ditu.zjzwfw.gov.cn/mapserver/label/WMTS/1.0/zjvmap/zjlwdt',
						layer: 'zjvmap',
						matrixSet: 'EPSG:4490',
						format: 'image/png',
						projection: projection,
						tileGrid: new ol.tilegrid.WMTS({
							origin: [-180,90],
							resolutions: resolutions,
							matrixIds: matrixIds
						}),
						style: 'default',
						wrapX: true
					})
				});

				var IMG_ZJ = new ol.layer.Tile({
                        //opacity: 0.7,
                        visible:false,
                        name:"IMG_ZJ",
                        source: new ol.source.WMTS({
                         // url:'http://ditu.zjzwfw.gov.cn/mapserver/vmap/WMTS/1.0/zjvmap/tdt_biaozhunyangshi_2017'
                          url:'http://ditu.zjzwfw.gov.cn/services/wmts/imgmap/2019/oss',
                          layer: 'zjvmap',
                          matrixSet: 'EPSG:4490',
                          format: 'image/png',
                          projection: projection,
                          tileGrid: new ol.tilegrid.WMTS({
                            origin: [-180,90],
                            resolutions: resolutions,
                            matrixIds: matrixIds
                          }),
                          style: 'default',
                          wrapX: true
                        })
                      });
				map.getOLMap().addLayer(VEC_W);
				map.getOLMap().addLayer(CVA_W);
				map.getOLMap().addLayer(VEC_ZJ);
				map.getOLMap().addLayer(CVA_ZJ);
				map.getOLMap().addLayer(IMG_ZJ);

			
				if(typeof mapOver === "function"){
					mapOver();
					console.log("mapOver")
				}

			}
		});
	}

	setStyleByMap();
}

function setStyleByMap() {
	// --全局图片样式
	styleMap = {
		// --sxx
		"icon_sxx_1" : map.getIconStyle({
			src : "mapimg/1.png",
			opacity : 1,
			anchor : [ 0.5, 0.5 ]
		}),
		"icon_sxx_2" : map.getIconStyle({
			src : "mapimg/2.png",
			opacity : 1,
			anchor : [ 0.5, 0.5 ]
		}),
		"icon_sxx_3" : map.getIconStyle({
			src : "mapimg/3.png",
			opacity : 1,
			anchor : [ 0.5, 0.5 ]
		}),
		"icon_sxx_4" : map.getIconStyle({
			src : "mapimg/4.png",
			opacity : 1,
			anchor : [ 0.5, 0.5 ]
		}),

		//抽析图标
		"icon_chouxi" : map.getIconStyle({
			src : "/develop/images/dark-blue/map/chouxiBg.png",
			opacity : 1,
			anchor : [ 0.5, 0.5 ]
		}),

		"circle_green" : map.getCircleStyle({
			radius : 5,
			fillColor : "#18B42D",
			borderWidth : 1,
			borderColor : "#FF0000",
			textAlign : "center",
			textOffsetY : 15
		}),
		"circle_orange" : map.getCircleStyle({
			radius : 5,
			fillColor : "#FF9600",
			borderWidth : 1,
			borderColor : "#FF0000",
			textAlign : "center",
			textOffsetX : 15
		}),
		"circle_red" : map.getCircleStyle({
			radius : 5,
			fillColor : "#EA4A56",
			borderWidth : 1,
			borderColor : "#FF0000",
			textAlign : "center",
			textOffsetX : 15
		}),
		"circle_blue" : map.getCircleStyle({
			radius : 5,
			fillColor : "#007FC8",
			borderWidth : 1,
			borderColor : "#FF0000",
			textAlign : "center",
			textOffsetX : 15
		}),

		"icon_bg" : map.getIconStyle({
			src : "./mapimg/Circle_72.png",
			opacity : 1,
			anchor : [ 0.5, 0.5 ]
		}),
		"icon_green" : map.getIconStyle({
			src : "./mapimg/hong.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"icon_orange" : map.getIconStyle({
			src : "./mapimg/orange.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"icon_red" : map.getIconStyle({
			src : "./mapimg/red.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"icon_blue" : map.getIconStyle({
			src : "./mapimg/huang.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		// 站点图标/images/biaozhu/emergency/center.png
		"icon_zd" : map.getIconStyle({
			src : "/images/biaozhu/emergency/center.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		// 大众坡图标
		"icon_po" : map.getIconStyle({
			src : "/images/biaozhu/facility/vd.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"icon_zd" : map.getIconStyle({
			src : "/images/biaozhu/emergency/center.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"icon_transparent" : map.getIconStyle({
			src : "./mapimg/transparent.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"not_set" : map.getIconStyle({
			src : "./mapimg/hong.jpg",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),

		"1A" : map.getIconStyle({
			src : "/images/yddw/1A.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"1B" : map.getIconStyle({
			src : "/images/yddw/1B.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"1C" : map.getIconStyle({
			src : "/images/yddw/1C.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"1D" : map.getIconStyle({
			src : "/images/yddw/1D.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"1E" : map.getIconStyle({
			src : "/images/yddw/1E.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),

		"2A" : map.getIconStyle({
			src : "/images/yddw/2A.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"2B" : map.getIconStyle({
			src : "/images/yddw/2B.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"2C" : map.getIconStyle({
			src : "/images/yddw/2C.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"2D" : map.getIconStyle({
			src : "/images/yddw/2D.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"2E" : map.getIconStyle({
			src : "/images/yddw/2E.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),

		"3A" : map.getIconStyle({
			src : "/images/yddw/3A.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"3B" : map.getIconStyle({
			src : "/images/yddw/3B.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"3C" : map.getIconStyle({
			src : "/images/yddw/3C.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"3D" : map.getIconStyle({
			src : "/images/yddw/3D.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"3E" : map.getIconStyle({
			src : "/images/yddw/3E.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),

		"4A" : map.getIconStyle({
			src : "/images/yddw/4A.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"4B" : map.getIconStyle({
			src : "/images/yddw/4B.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"4C" : map.getIconStyle({
			src : "/images/yddw/4C.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"4D" : map.getIconStyle({
			src : "/images/yddw/4D.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"4E" : map.getIconStyle({
			src : "/images/yddw/4E.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),

		"5A" : map.getIconStyle({
			src : "/images/yddw/5A.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"5B" : map.getIconStyle({
			src : "/images/yddw/5B.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"5C" : map.getIconStyle({
			src : "/images/yddw/5C.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"5D" : map.getIconStyle({
			src : "/images/yddw/5D.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),
		"5E" : map.getIconStyle({
			src : "/images/yddw/5E.png",
			opacity : 1,
			anchor : [ 0.5, 0.8 ]
		}),

		"line_green" : map.getLineStyle({
			color : "#FF0000",
			width : 4
		}),
		"line_blue" : map.getLineStyle({
			color : "#3333FF",
			width : 5
		}),
		"icon_chouxi" : map.getIconStyle({ src : "/map/zgis/mapimg/chouxiBg.png", opacity : 1, anchor : [ 0.5, 0.5 ] }),

		"polygon_red" : map.getPolygonStyle({fillColor:"rgba(243, 14, 8, 0.5)",borderWidth:3,borderColor:"rgba(243, 14, 8, 0.9)"}),
		"polygon_orange" : map.getPolygonStyle({fillColor:"rgba(249, 150, 10, 0.5)",borderWidth:3,borderColor:"rgba(249, 150, 10, 0.9)"}),
		"polygon_yellow" : map.getPolygonStyle({fillColor:"rgba(250, 253, 2, 0.5)",borderWidth:3,borderColor:"rgba(250, 253, 2, 0.9)"}),
		"polygon_blue" : map.getPolygonStyle({fillColor:"rgba(22,125, 243, 0.5)",borderWidth:3,borderColor:"rgba(22,125, 243, 0.9)"}),
		"polygon_green" : map.getPolygonStyle({fillColor:"rgba(255, 255, 12, 0.3)",borderWidth:3,borderColor:"#FF0000"}),

//			路政事件
		"polygon_1" : map.getPolygonStyle({fillColor:"rgba(248, 194, 34, 0.5)",borderWidth:3,borderColor:"rgba(248, 194, 34, 0.9)"}),
//			养护事件
		"polygon_2" : map.getPolygonStyle({fillColor:"rgba(243, 107, 109, 0.5)",borderWidth:3,borderColor:"rgba(243, 107, 109, 0.9)"}),
//			路网事件
		"polygon_3" : map.getPolygonStyle({fillColor:"rgba(27, 169, 197, 0.5)",borderWidth:3,borderColor:"rgba(27, 169, 197, 0.9)"}),
//			应急事件
		"polygon_4" : map.getPolygonStyle({fillColor:"rgba(9, 65, 148, 0.5)",borderWidth:3,borderColor:"rgba(9, 65, 148, 0.9)"}),

		"point_green" : map.getCircleStyle({radius : 5, fillColor : "rgba(255, 255, 12, 0.3)", borderWidth : 1, borderColor : "#FF0000", textAlign : "center", textOffsetY : 15 }),
		"point_blue" : map.getCircleStyle({radius : 5, fillColor : "rgba(255, 255, 12, 0.3)", borderWidth : 1, borderColor : "#3333FF", textAlign : "center", textOffsetX : 15 })

	};
}

// 获取样式
function getSymbolStyle(styleKey) {
	return styleMap[styleKey];
}

/**
 * 从图层里移除单个（点线面）
 */
function rmDraw(layername, id) {
	rmPoints(layername, [id]);
};
/**
 * 从图层里移除图形（点、线、面）对象
 * 
 * @param {String}
 *            layername 图层名称.
 * @param {Array}
 *            ids 对象值数组.
 */
function rmPoints(layername, ids) {
	var vectorLayer = map.getLayer(layername);
	if (vectorLayer == null) {
		return;
	}

	if (!ids || ids.length == 0) {
		return;
	}

	for (var i = 0; i < ids.length; i++) {
		var feature_attributes_key = "id";
		var feature_attributes_value = ids[i];
		var feature = map.getLayerFeature(vectorLayer, feature_attributes_key,
				feature_attributes_value);
		if (feature == null) {
			return;
		}
		map.removeFeature(vectorLayer, feature);
	}

	map.infoWindowHide();
}

/**
 * 根据ID定位弹出窗口【目前只支持单个】
 * 
 * @param {String}
 *            layername 图层名称.
 * @param {String}
 *            id 对象id属性值.
 * @param {Boolean}
 *            isCenter 是否居中.
 */
function showPopupWindowByID(layername, id, isCenter) {
	var vectorLayer = map.getLayer(layername);
	if (vectorLayer == null) {
		return;
	}

	var feature_attributes_key = "id";
	var feature_attributes_value = id;
	var feature = map.getLayerFeature(vectorLayer, feature_attributes_key,
			feature_attributes_value);
	if (feature == null) {
		return;
	}

	var geom = feature.getGeometry();
	var center_coordinates = map.getGeometryCenter(geom);
	var attributes = feature.get("attributes");

	var infoWindowWidth = "400px";
	if (attributes && attributes.infoWindowWidth) {
		infoWindowWidth = attributes.infoWindowWidth;
	}

	if (attributes && attributes.infoWindowContent) {
		map.infoWindowShow(center_coordinates, attributes.infoWindowContent,
				infoWindowWidth); // 显示信息框
		if (isCenter === undefined || isCenter == true) {
			map.setCenter(center_coordinates);
		}
	}

}

/**
 * 聚合标注点【单个或多个】
 *
 * @param {String}
 *            layername 图层名称.
 * @param {Boolean}
 *            isclearlayer 是否清空图层之后再标注.
 * @param {[]}
 *            data 数据.
 * @param {Number}
 *            distance 屏幕距离.
 */
function clusterMark(layername,isclearlayer,data, icon, distance){

	distance = distance == undefined ? 40 : distance;
	distance = parseFloat(distance);

	addPoints(layername, isclearlayer, data);
	var vectorLayer = map.getLayer(layername);
	var markerLayerSource = vectorLayer.getSource();
	var styleCache = {};
	var ClusterIconPath = icon;
	var cluterIcon = new ol.style.Icon({
		opacity: 1,
		color: '#fff',//透明色
		src: ClusterIconPath
	});
	var clusterDistance = distance;
	var clusterSource = new ol.source.Cluster({
		distance: clusterDistance,
		source: markerLayerSource
	});
	vectorLayer.setSource(clusterSource);
	vectorLayer.setStyle(function(feature) {
		var features = feature.get('features');
		var size = features.length;
		if (size == 1) {
			var myStyle = features[0].getStyle();
			return myStyle;
		} else {
			var style = styleCache[size];
			if (!style) {
				style = new ol.style.Style({
					image: cluterIcon,
					text: new ol.style.Text({
						text: size.toString(),
						offsetX: 10,
						offsetY: 3,
						font: '12px sans-serif',

						fill: new ol.style.Fill({
							color: '#fff'
						})
					})
				});
				styleCache[size] = style;
			}
			return style;
		}
	});
}

/**
 * 按类别聚合标注点【单个或多个】
 *
 * @param {String}
 *            layername 图层名称.
 * @param {Boolean}
 *            isclearlayer 是否清空图层之后再标注.
 * @param {[]}
 *            data 数据.
 * @param {Number}
 *            distance 屏幕距离.
 */
function clusterMarkCategorical(layername, isclearlayer, data, icon, distance) {
  distance = distance == undefined ? 40 : distance;
  distance = parseFloat(distance);

  addPoints(layername, isclearlayer, data);
  var vectorLayer = map.getLayer(layername);
  var markerLayerSource = vectorLayer.getSource();
  var ClusterIconPath = icon;
  var cluterIcon = new ol.style.Icon({
    opacity: 1,
    color: '#fff', //透明色
    src: ClusterIconPath,
  });
  var clusterDistance = distance;
  var clusterSource = new ol.source.Cluster({
    distance: clusterDistance,
    source: markerLayerSource,
  });
  vectorLayer.setSource(clusterSource);
  vectorLayer.setStyle(function (feature) {
    var features = feature.get('features');
    var size = features.length;
    if (size == 1) {
      var myStyle = features[0].getStyle();
      return myStyle;
    } else {
        var arrayStyle = [];  
        var type = {};
        for (var i = 0; i < size; i++) {
          var attributes = features[i].get('attributes');
          if (type.hasOwnProperty(attributes.type)) {
            type[attributes.type] += 1;
          } else {
            type[attributes.type] = 1;
          }
        }
        console.log(JSON.stringify(type));

        var style = new ol.style.Style({
          	image: cluterIcon
          });
        arrayStyle.push(style);
        for (var key in type) {
          console.log(key);
          if(key=="yjwz"){
	          style = new ol.style.Style({
	            text: new ol.style.Text({
	              text: type[key].toString(),
	              offsetX: 0,
	              offsetY: 3,
	              font: '12px sans-serif',

	              fill: new ol.style.Fill({
	                color: '#fff',
	              }),
	            }),
	          });
	      }else if(key=="yjsb"){
	      	 style = new ol.style.Style({
	            text: new ol.style.Text({
	              text: type[key].toString(),
	              offsetX: 15,
	              offsetY: 3,
	              font: '12px sans-serif',

	              fill: new ol.style.Fill({
	                color: '#fff',
	              }),
	            }),
	          });
	     }
          arrayStyle.push(style);
      	}

      return arrayStyle;
    }
  });
}


/**
 * 标注点【单个或多个】
 *
 * @param {String}
 *            layername 图层名称.
 * @param {Boolean}
 *            isclearlayer 是否清空图层之后再标注.
 * @param {[]}
 *            data 数据.
 */
function addPoints(layername, isclearlayer, data) {
	var vectorLayer = map.getLayer(layername);
	if (vectorLayer == null) {
		var layer_option = {
			labelEnable : false,
			name : layername
			// 图层唯一标识
		};
		vectorLayer = map.addVectorLayer(layer_option); // 添加矢量图层
	} else if (isclearlayer == true) {
		map.clearVectorLayer(vectorLayer);
	}

	var len = data.length;
	var points = [];
	for (var i = 0; i < len; i++) {
		var item = data[i];
		var p = map.createPoint(item.point);

		var attributes = {};
		if (item.attributes) {
			attributes = item.attributes;
		}

		var defaultStyle = [];
		if (item.style && item.style.length > 0) {
			defaultStyle.push(this.getSymbolStyle(item.style[0]));
		} else {
			if (item.icons && item.icons.length > 0) {
				for (var k = 0; k < item.icons.length; k++) {
					var iconObj = item.icons[k];
					var anchor = [ 0.5, 0.5 ];
					if (iconObj.anchor) {
						anchor = iconObj.anchor;
					}
					var size=null;
					if (iconObj.size) {
						size = iconObj.size;
					}

					var offset=[0,0];
					if (iconObj.offset) {
						offset=iconObj.offset;
					}
					var iconStyle;
					if(size!=null){
						iconStyle = map.getIconStyle({
							src : iconObj.src,
							size: size,
							offset: offset,
							opacity : 1,
							anchor : anchor
						});
					}else{
						iconStyle = map.getIconStyle({
							src : iconObj.src,
							offset: offset,
							opacity : 1,
							anchor : anchor
						});
					}
					defaultStyle.push(iconStyle);
				}
			}
		}

		if (item.labels && item.labels.length > 0) {
			for (var k = 0; k < item.labels.length; k++) {
				var tipStyle = map.getLabelStyle(item.labels[k]);
				defaultStyle.push(tipStyle);
			}
		}

		attributes.defaultStyle = defaultStyle;

		// --
		if (item.style && item.style.length > 1) {
			attributes.overStyle = this.getSymbolStyle(item.style[1]);
		}

		var g = this.map.createFeature(p, attributes, defaultStyle);
		this.map.addLayerFeature(vectorLayer, g);
	}
}

/**
 * 修改标注点【单个或多个】
 *
 * @param {String}
 *            layername 图层名称.
 * @param {[]}
 *            data 数据.
 */
function updatePoints(layername, data) {
	var vectorLayer = map.getLayer(layername);
	if (vectorLayer == null) {
		return;
	}

	var len = data.length;
	var points = [];
	var feature=null;
	for (var i = 0; i < len; i++) {
		var item = data[i];
		if (item.id) {
			feature = map.getLayerFeature(vectorLayer, "id", item.id);
			if (feature == null) {
				continue;
			}
		}

		var p = null;
		if (item.point) {
			var p = map.createPoint(item.point);
		}

		var attributes = {};
		var defaultStyle = [];
		if (item.style && item.style.length > 0) {
			defaultStyle.push(this.getSymbolStyle(item.style[0]));
		} else {
			if (item.icons && item.icons.length > 0) {
				for (var k = 0; k < item.icons.length; k++) {
					var iconObj = item.icons[k];
					var anchor = [0.5, 0.5];
					if (iconObj.anchor) {
						anchor = iconObj.anchor;
					}
					var iconStyle = map.getIconStyle({
						src: iconObj.src,
						opacity: 1,
						anchor: anchor
					});
					defaultStyle.push(iconStyle);
				}
			}
		}

		if (item.labels && item.labels.length > 0) {
			for (var k = 0; k < item.labels.length; k++) {
				var tipStyle = map.getLabelStyle(item.labels[k]);
				defaultStyle.push(tipStyle);
			}
		}

		attributes.defaultStyle = defaultStyle;

		// --
		if (item.style && item.style.length > 1) {
			attributes.overStyle = this.getSymbolStyle(item.style[1]);
		}


		//修改图形
		if(p){
			feature.setGeometry(p);
		}
		//修改样式
		if (defaultStyle !== undefined && defaultStyle.length>0) {
			feature.setStyle(defaultStyle);
		}

		var tooltip = goog.isDef(attributes.tooltip) ? attributes.tooltip : null;
		//修改tooltip
		if (tooltip) {
			feature.set('tooltip', tooltip);
		}
		//修改属性
		if (item.attributes) {
			feature.set('attributes', attributes);
		}

	}
}




/**
 * 标注点【单个或多个】
 *
 * @param {String}
 *            layername 图层名称.
 * @param {Boolean}
 *            isclearlayer 是否清空图层之后再标注.
 * @param {[]}
 *            data 数据.
 */
function addPointsByStyle(layername, isclearlayer, data) {
	var vectorLayer = map.getLayer(layername);
	if (vectorLayer == null) {
		var layer_option = {
			labelEnable : false,
			name : layername
			// 图层唯一标识
		};
		vectorLayer = map.addVectorLayer(layer_option); // 添加矢量图层
	} else if (isclearlayer == true) {
		map.clearVectorLayer(vectorLayer);
	}

	var len = data.length;
	var points = [];
	for (var i = 0; i < len; i++) {
		var item = data[i];
		var p = map.createPoint(item.point);

		var attributes = {};
		if (item.attributes) {
			attributes = item.attributes;
		}

		var defaultStyle = [];
		if (item.style && item.style.length > 0) {
			// defaultStyle.push(this.getSymbolStyle(item.style[0]));
			defaultStyle.push(item.style[0]);
		} else {
			if (item.icons && item.icons.length > 0) {
				for (var k = 0; k < item.icons.length; k++) {
					var iconObj = item.icons[k];
					var anchor = [ 0.5, 0.5 ];
					if (iconObj.anchor) {
						anchor = iconObj.anchor;
					}
					var iconStyle = map.getIconStyle({
						src : iconObj.src,
						opacity : 1,
						anchor : anchor
					});
					defaultStyle.push(iconStyle);
				}
			}
		}

		if (item.labels && item.labels.length > 0) {
			for (var k = 0; k < item.labels.length; k++) {
				var tipStyle = map.getLabelStyle(item.labels[k]);
				defaultStyle.push(tipStyle);
			}
		}

		attributes.defaultStyle = defaultStyle;

		// --
		if (item.style && item.style.length > 1) {
			attributes.overStyle = this.getSymbolStyle(item.style[1]);
		}

		var g = this.map.createFeature(p, attributes, defaultStyle);
		this.map.addLayerFeature(vectorLayer, g);
	}
}



/**
 * 根据图层名称以及属性键值对,修改图元样式
 *
 * @param {String}
 *            layername 图层名称.
 * @param {String}
 *            key 属性名称.
 * @param {String}
 *            value 属性值.
 * @param {Object}
 *            iconObj 样式对象.
 */
function updateStyleByID(layername, key,value, iconObj){
	var vectorLayer = map.getLayer(layername);
	var featrue = map.getLayerFeature(vectorLayer, key, value);

	var anchor = [0.5, 0.5];
	if (iconObj.anchor) {
		anchor = iconObj.anchor;
	}
	var iconStyle = map.getIconStyle({
		src: iconObj.src,
		opacity: 1,
		anchor: anchor
	});
	featrue.setStyle(iconStyle);
}

/**
 * 根据图层名称以及属性键值对,修改属性值
 *
 * @param {String}
 *            layername 图层名称.
 * @param {String}
 *            key 属性名称.
 * @param {String}
 *            value 属性值.
 * @param {String}
 *            updateKey 被修改的属性名称.
 * @param {Object}
 *            updateValue 被修改的属性值.
 */
function updateAttributeByID(layername, key, value, updateKey,updateValue) {
	var vectorLayer = map.getLayer(layername);
	var feature = map.getLayerFeature(vectorLayer, key, value);
	feature.set(updateKey, updateValue);
}



/**
 * 标注线【单个或多个】
 * 
 * @param {String}
 *            layername 图层名称.
 * @param {Boolean}
 *            isclearlayer 是否清空图层之后再标注.
 * @param {[]}
 *            data 数据.
 */
function addLines(layername, isclearlayer, data) {
	var vectorLayer = map.getLayer(layername);
	if (vectorLayer == null) {
		var layer_option = {
			labelEnable : false,
			name : layername
		// 图层唯一标识
		};
		vectorLayer = map.addVectorLayer(layer_option); // 添加矢量图层
	} else if (isclearlayer == true) {
		map.clearVectorLayer(vectorLayer);
	}

	var len = data.length;
	var lines = [];
	for (var i = 0; i < len; i++) {
		var item = data[i];
		var points = item.points;
		var line = map.createLine(points);

		var attributes = {};
		if (item.attributes) {
			attributes = item.attributes;
		}

		var defaultStyle = [];
		if (item.style && item.style.length > 0) {
			defaultStyle.push(this.getSymbolStyle(item.style[0]));
		}
		attributes.defaultStyle = defaultStyle;
		// --
		if (item.style && item.style.length > 1) {
			attributes.overStyle = this.getSymbolStyle(item.style[1]);
		}

		var feature_line = map.createFeature(line, attributes, defaultStyle);
		map.addLayerFeature(vectorLayer, feature_line);
	}
}

function addPolygon() {

}

/**
 * ArcGis要素信息查询（点选）
 * 
 * @param url
 * @param x
 * @param y
 * @param options
 * @param callBackFunction
 * @returns
 */
function queryArcIdentifyTask(url, x, y, options, callBackFunction) {

	if (url.lastIndexOf('/identify') == -1) {
		url = url + '/identify';
	}
	var geometry = {
		"x" : x,
		"y" : y
	};

	var identifyParams = {};
	identifyParams.f = "json";
	identifyParams.geometryType = "esriGeometryPoint";
	identifyParams.sr = 4490;
	identifyParams.geometry = JSON.stringify(geometry);

	var layerOption = IDENTIFY_LAYER_OPTION_VISIBLE;
	if (options.layerOption) {
		layerOption = options.layerOption;
	}

	if (!options.layerIds) {
		alert("缺少参数【layerIds】");
		return;
	}

	identifyParams.layers = layerOption + ":" + options.layerIds;

	if (options.layerDefs) {
		identifyParams.layerDefs = JSON.stringify(options.layerDefs);
	}

	var tolerance = 10;
	if (options.tolerance) {
		tolerance = options.tolerance;
	}
	identifyParams.tolerance = tolerance;

	var returnGeometry = true;
	if (options.returnGeometry) {
		returnGeometry = options.returnGeometry;
	}
	identifyParams.returnGeometry = returnGeometry;

	var returnFieldName = false;
	if (options.returnFieldName) {
		returnFieldName = options.returnFieldName;
	}
	identifyParams.returnFieldName = returnFieldName;

	var size = map.getOLMap().getSize();
	var mapExtent = map.getOLMap().getView().calculateExtent(size);
	var imageDisplay = size.join(",") + ",96";
	identifyParams.imageDisplay = imageDisplay;
	identifyParams.mapExtent = mapExtent.join(",");

	$.ajax({
		type : "POST",
		cache : false,
		async : true,
		url : url,
		data : identifyParams,
		dataType : 'json',
		contentType : 'application/x-www-form-urlencoded',
		success : function(data) {
			if (callBackFunction) {
				callBackFunction(data, "请求要素数据正常！");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (callBackFunction) {
				callBackFunction([], "请求要素数据异常！");
			}
		}
	});

}

/**
 * ArcGis服务缓冲区查询
 * 
 * @param x
 *            中心点经度
 * @param y
 *            中心点维度
 * @param radius
 *            半径（米）
 * @param options
 *            查询参数配置项
 * @param callBackFunction
 *            回调函数
 * @returns []
 */
function queryArcWFS(x, y, radius, options, callBackFunction) {
	var wfsUrl = goog.isDef(options.wfsUrl) ? options.wfsUrl : null;
	if (!wfsUrl) {
		alert("缺少参数【wfsUrl】");
		return;
	}
	// --添加半径缓冲区
	var centerLon = x;
	var centerLat = y;
	var srs = 4326;
	var circle_geom = map.createCircle(centerLon, centerLat, radius, srs);
	var bufferGeometry = circle_geom.clone();

	var geom_type = circle_geom.getType();
	var py = ol.geom.Polygon.fromCircle(circle_geom, 64);
	var points = py.getCoordinates()[0];

	var rings = [];
	var ring = [];
	for (var i = 0; i < points.length; i++) {
		ring.push(points[i]);
	}
	rings.push(ring);

	var esriGeometryPolygon = {
		"spatialReference" : {
			"wkid" : 4490,
			"latestWkid" : 4490
		},
		"rings" : rings
	};

	var request = {};
	request.f = "json";
	request.returnGeometry = true;

	request.spatialRel = "esriSpatialRelIntersects";
	request.geometry = JSON.stringify(esriGeometryPolygon);
	request.geometryType = "esriGeometryPolygon";
	request.inSR = 4490;

	request.outSR = 4490;

	var outFields = goog.isDef(options.outFields) ? options.outFields : null;

	var where = goog.isDef(options.where) ? options.where : "1=1";

	if (outFields) {
		request.outFields = outFields;
	}

	if (where) {
		request.where = encodeURIComponent(where);
	}

	$.ajax({
		type : "POST",
		cache : false,
		async : true,
		url : wfsUrl,
		data : request,//
		dataType : 'json',
		contentType : 'application/x-www-form-urlencoded',
		success : function(data) {
			if (callBackFunction) {
				callBackFunction(data, bufferGeometry, "请求缓冲区数据正常！");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (callBackFunction) {
				callBackFunction(null, bufferGeometry, "请求缓冲区数据异常！");
			}
		}
	});

}

/**
 * Ogc服务缓冲区查询
 * 
 * @param x
 *            中心点经度
 * @param y
 *            中心点维度
 * @param radius
 *            半径（米）
 * @param options
 *            查询参数配置项
 * @param callBackFunction
 *            回调函数
 * @returns []
 */
function queryOgcWFS(x, y, radius, options, callBackFunction) {
	var wfsUrl = goog.isDef(options.wfsUrl) ? options.wfsUrl : null;
	// --添加半径缓冲区
	var centerLon = x;
	var centerLat = y;
	var srs = 4326;
	var circle_geom = map.createCircle(centerLon, centerLat, radius, srs);
	var geom_type = circle_geom.getType();

	var py = ol.geom.Polygon.fromCircle(circle_geom, 64);
	var points = py.getCoordinates()[0];

	var circleCoordinate = [];
	for (var i = 0; i < points.length; i++) {
		var coordinate = points[i];
		circleCoordinate.push(coordinate[0] + "," + coordinate[1]);
	}

	var coordinates = circleCoordinate.join(" ");
	options.coordinates = coordinates;
	var wfsBody = map.getWFSPostXml(options);
	// console.log('-wfsBody==' + wfsBody);
	if (!wfsBody || !wfsUrl) {
		if (callBackFunction) {
			callBackFunction([], "缺少参数【wfsBody、wfsUrl】");
		}
	}

	$.ajax({
		type : "POST",
		cache : false,
		async : true,
		url : wfsUrl,
		data : encodeURIComponent(wfsBody),
		dataType : 'xml',
		contentType : "text/xml",
		success : function(data) {
			var features = new ol.format.GML2().readFeatures(data);
			if (callBackFunction) {
				callBackFunction(features, "数据请求正常！");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (callBackFunction) {
				callBackFunction([], "请求缓冲区数据异常！");
			}
		}
	});

}

/**
 * 地图画圆
 * 
 * @param x
 *            中心点经度
 * @param y
 *            中心点维度
 * @param radius
 *            半径（米）
 * @param rgba
 *            颜色 格式 rgba(255, 255, 12, 0.3)
 * @param bodercolor
 *            边框颜色 #009933
 * @returns []
 */
function createCircle(x, y, radius, rgba, bodercolor) {
	var centerLon = x;
	var centerLat = y;
	var srs = 4326;
	var circle_geom = map.createCircle(centerLon, centerLat, radius, srs);

	// 声明缓冲区图层
	var bufferLayer = map.getLayer("CircleLayer");
	if (bufferLayer == null) {
		var layer_option = {
			name : "CircleLayer"
		};
		bufferLayer = map.addVectorLayer(layer_option);
	}
	// --清空图层
	map.clearVectorLayer(bufferLayer);

	var circle_attributes = {};
	var circle_style = map.getPolygonStyle({
		fillColor : rgba,
		borderWidth : 1,
		borderColor : bodercolor
	});
	var circle_feature = map.createFeature(circle_geom, circle_attributes,
			circle_style);
	circle_feature.set("mouseover", false);
	map.addLayerFeature(bufferLayer, circle_feature);
	map.setLayerZIndex("CircleLayer", 1);

}

// --清空图层
function clearLayerByMap(layerName) {
	var bufferLayer = map.getLayer(layerName);
	if (bufferLayer != null) {
		map.clearVectorLayer(bufferLayer);
	}
}

/**
 * wfs查询
 * 
 * @param x
 *            中心点经度
 * @param y
 *            中心点维度
 * @param radius
 *            半径（米）
 * @param requestUrl
 *            地图服务请求地址
 * @param proxyUrl
 *            服务是否跨域（没有就不设置代理）
 * @returns _outFields 所要查询的列
 * @returns _where where 条件
 */

function zmapqueryArcWFS(x, y, radius, requestUrl, proxyUrl, _outFields, _where) {
	var wfsUrl = proxyUrl + map.base64Encode(requestUrl);
	var filterOption = {
		wfsUrl : wfsUrl, // --服务请求地址
		outFields : _outFields,
		where : _where
	};

	queryArcWFS(x, y, radius, filterOption,
			function(data, bufferGeometry, msg) {
				if (data && data.features && data.features.length > 0) {
					// console.log("--features==" + data.features.length
					// 		+ ";msg==" + msg);
					// --解析结果数据
					var fields = data.fields;
					var features = data.features;
					var geometryType = data.geometryType;
					//
					renderBufferCircleGraphic(bufferGeometry);
					renderBufferResultGraphics(features);
				}
			});

}

function renderBufferCircleGraphic(bufferGeometry) {
	// 声明缓冲区图层
	var bufferLayer = map.getLayer("buffer_vectorLayer");
	if (bufferLayer == null) {
		var layer_option = {
			name : "buffer_vectorLayer"
		};
		bufferLayer = map.addVectorLayer(layer_option);
	}
	// --清空图层
	map.clearVectorLayer(bufferLayer);

	var circle_attributes = {};
	var circle_style = map.getPolygonStyle({
		fillColor : "rgba(255, 255, 12, 0.3)",
		borderWidth : 1,
		borderColor : "#009933"
	});
	var circle_feature = map.createFeature(bufferGeometry, circle_attributes,
			circle_style);
	circle_feature.set("mouseover", false);
	map.addLayerFeature(bufferLayer, circle_feature);

}

function renderBufferResultGraphics(features) {

	var data = [];
	for (var i = 0; i < features.length; i++) {
		var feature = features[i];

		var attributes = feature.attributes;
		attributes.id = attributes.FID;// --设置图形唯一标识

		// --信息框设置（考虑性能，这里用回调弹出信息框）
		attributes.infoWindowCallBack = function(zMap, coordinate, f) {
			var attributes2 = f.get("attributes");
			var title = "桥梁";
			var items = [];
			items.push({
				code : "QLBM",
				name : "编码"
			});
			items.push({
				code : "QLBH",
				name : "编号"
			});
			items.push({
				code : "QLMC",
				name : "名称"
			});

			var html = [];
			html.push('<table width="100%">');
			html.push('<tr><td colspan="2"><h3>' + title + '属性</h3></td></tr>');
			for (var i = 0; i < items.length; i++) {
				var code = items[i].code;
				var name = items[i].name;
				var text = attributes2[code];
				html.push('<tr>');
				html
						.push(' <td width="40%" align="right" style="font-size:120%;padding:7px;">'
								+ name + '：</td>');
				html.push(' <td style="padding:7px;">' + text + '</td>');
				html.push('</tr>');
			}
			html.push('<tr><td colspan="2" style="height:5px;"></td></tr>');
			html.push('</table>');

			var infoWindowWidth = "300px"; // 信息框宽度
			zMap.infoWindowShow(coordinate, html.join(""), infoWindowWidth); // 显示信息框
		};

		var geometry = feature.geometry;
		var graphic = {
			point : [ geometry.x, geometry.y ],
			attributes : attributes,
			style : [ 'circle_green', "circle_blue" ]
		};

		data.push(graphic);
	}

	addPoints("query_graphicsLayer", true, data);
}

/**
 * wms 条件查询
 * 
 * @param layername
 *            图层名称
 * @param _url
 *            服务地址
 * @param _where
 *            条件
 * @param _layerIds
 *            图层ID
 */

function addArcImageLayer(layername, _url, _where, _layerIds) {
	var imageLayer = map.getLayer(layername);
	if (imageLayer) {
		map.removeLayer(layername);
	}
	imageLayer = new ol.layer.Image({
		name : layername,
		source : new ol.source.ImageArcGISRest({
			ratio : 1,
			params : {
				layerDefs : _where,
				// --查询图层
				layers : _layerIds
			},
			url : _url
		})
	});
	map.getOLMap().addLayer(imageLayer);
}

function delArcImageLayer(layername) {
	var imageLayer = map.getLayer(layername);
	if (imageLayer) {
		imageLayer.setVisible(false);
	}
	;

};

/*******************************************************************************
 * wms地图点选
 ******************************************************************************/

function mapClickArcIdentify(_url, _where, _layerIds) {
	map.getMapClickCoordinate(function(coordinate, component) {
		var x = coordinate[0];
		var y = coordinate[1];
		var url = _url;
		var options = {
			tolerance : 10,
			layerOption : IDENTIFY_LAYER_OPTION_VISIBLE,
			// --图层过滤条件 【 layerId:条件语句】
			layerDefs : _where,
			layerIds : _layerIds
		};
		queryArcIdentifyTask(url, x, y, options, function(data, msg) {
			if (data && data.results) {
				// console.log("--results==" + data.results.length + ";msg=="
				// 		+ msg);
				if (data.results.length > 0) {
					var result = data.results[0];
					// 判断对象类型
					if (result.geometryType === "esriGeometryPoint") {
						renderPointGraphic(result);
					} else if (result.geometryType === "esriGeometryPolyline") {
						renderPolylineGraphic(result);
					}
				}
			}
		});

	});
}

function renderPointGraphic(result) {
	var title = "";
	var items = [];
	var layerId = result.layerId;
	if (layerId == 0) {
		title = "桥梁";
		items.push({
			code : "QLBM",
			name : "编码"
		});
		items.push({
			code : "QLBH",
			name : "编号"
		});
		items.push({
			code : "QLMC",
			name : "名称"
		});
	} else if (layerId == 1) {
		title = "乡镇";
		items.push({
			code : "XZBM",
			name : "编码"
		});
		items.push({
			code : "XZRK",
			name : "人口"
		});
		items.push({
			code : "XZMC",
			name : "名称"
		});
	} else if (layerId == 2) {
		title = "建制村";
		items.push({
			code : "JZCBM",
			name : "编码"
		});
		items.push({
			code : "JZCRK",
			name : "人口"
		});
		items.push({
			code : "JZCMC",
			name : "名称"
		});
	}

	var attributes = result.attributes;
	attributes.id = attributes.FID;// --设置图形唯一标识

	// --信息框设置
	var html = "";
	html += '<table width="100%">';
	html += '<tr><td colspan="2"><h3>' + title + '属性</h3></td></tr>';
	for (var i = 0; i < items.length; i++) {
		var code = items[i].code;
		var name = items[i].name;
		var text = attributes[code];
		html += '<tr>';
		html += '	<td width="40%" align="right" style="font-size:120%;padding:7px;">'
				+ name + '：</td>';
		html += '	<td style="padding:7px;">' + text + '</td>';
		html += '</tr>';
	}
	html += '<tr><td colspan="2" style="height:5px;"></td></tr>';
	html += '</table>';

	attributes.infoWindowWidth = "300px";
	attributes.infoWindowContent = html;

	var geometry = result.geometry;
	var graphic = {
		point : [ geometry.x, geometry.y ],
		attributes : attributes,
		style : [ 'circle_red' ]
	};

	addPoints("pointlayer", true, [ graphic ]);
	// 显示信息框
	var id = attributes.id;
	var isCenter = false;
	showPopupWindowByID("pointlayer", id, isCenter);
}

function renderPolylineGraphic(result) {
	var title = "";
	var items = [];
	var layerId = result.layerId;
	if (layerId == 3) {
		title = "路段";
		items.push({
			code : "LXBM",
			name : "路线编码"
		});
		items.push({
			code : "LXMC",
			name : "路线名称"
		});
		items.push({
			code : "LDBM",
			name : "路段编码"
		});
		items.push({
			code : "QDZH",
			name : "起点桩号"
		});
		items.push({
			code : "QDMC",
			name : "起点名称"
		});
		items.push({
			code : "ZDZH",
			name : "止点桩号"
		});
		items.push({
			code : "ZDMC",
			name : "止点名称"
		});
	}

	var attributes = result.attributes;
	attributes.id = attributes.FID;// --设置图形唯一标识

	// --信息框设置
	var html = "";
	html += '<table width="100%">';
	html += '<tr><td colspan="2"><h3>' + title + '属性</h3></td></tr>';
	for (var i = 0; i < items.length; i++) {
		var code = items[i].code;
		var name = items[i].name;
		var text = attributes[code];
		html += '<tr>';
		html += '	<td width="40%" align="right" style="font-size:120%;padding:7px;">'
				+ name + '：</td>';
		html += '	<td style="padding:7px;">' + text + '</td>';
		html += '</tr>';
	}
	html += '<tr><td colspan="2" style="height:5px;"></td></tr>';
	html += '</table>';

	attributes.infoWindowWidth = "300px";
	attributes.infoWindowContent = html;

	var geometry = result.geometry;
	var points = geometry.paths[0];
	var graphic = {
		points : points,
		attributes : attributes,
		style : [ 'line_green', 'line_blue' ]
	};

	addLines("line_vectorLayer", true, [ graphic ]);
	// 显示信息框
	var id = attributes.id;
	var isCenter = true;
	showPopupWindowByID("line_vectorLayer", id, isCenter);
}

function cancelMapClickArcIdentify() {
	map.getMapClickCoordinate(null);
}

/**
 * 经纬度转屏幕坐标
 * 
 * @param lon
 * @param lat
 * @returns [x,y]
 */
function getPixelFromLonLat(lon, lat) {
	var px = map.getOLMap().getPixelFromCoordinate([ lon, lat ]);
	return px;
}

function getLonLatFromPixel(x, y) {
	var lonlat = map.getCoordinateFromPixel([ x, y ]);
	return lonlat;
}

function clearMap() {

	map.clearMap();
}

/**
 * 通过图层名称移除图层
 * 
 * @param layername
 */
function removeFeatureByLayerName(layerName) {
	map.removeLayer(layerName);

}

function infoWindowHide() {
	map.infoWindowHide();
}

/**
 * 通过x,y弹出窗口
 * 
 * @param lon
 * @param lat
 * @returns [x,y]
 */
function showPopupWindowByXY(layername, isclearlayer, isCenter, data) {
	var vectorLayer = map.getLayer(layername);
	if (vectorLayer == null) {
		var layer_option = {
			labelEnable : false,
			name : layername
		// 图层唯一标识
		};
		vectorLayer = map.addVectorLayer(layer_option); // 添加矢量图层
	} else if (isclearlayer == true) {
		map.clearVectorLayer(vectorLayer);
	}

	var item = data;
	var p = map.createPoint(item.point);

	var attributes = {};
	if (item.attributes) {
		attributes = item.attributes;
	}
	var defaultStyle = [];
	if (item.style && item.style.length > 0) {
		defaultStyle.push(this.getSymbolStyle(item.style[0]));
	}
	if (item.labels && item.labels.length > 0) {
		for (var k = 0; k < item.labels.length; k++) {
			var tipStyle = map.getToolTipStyle(item.labels[k]);
			defaultStyle.push(tipStyle);
		}
	}
	attributes.defaultStyle = defaultStyle;
	if (item.style && item.style.length > 1) {
		attributes.overStyle = this.getSymbolStyle(item.style[1]);
	}
	var feature = this.map.createFeature(p, attributes, defaultStyle);
	this.map.addLayerFeature(vectorLayer, feature);

	var geom = feature.getGeometry();
	var center_coordinates = map.getGeometryCenter(geom);
	var attributes = feature.get("attributes");

	var infoWindowWidth = "400px";
	if (attributes && attributes.infoWindowWidth) {
		infoWindowWidth = attributes.infoWindowWidth;
	}

	if (attributes && attributes.infoWindowContent) {
		map.infoWindowShow(center_coordinates, attributes.infoWindowContent,
				infoWindowWidth); // 显示信息框
		if (isCenter === undefined || isCenter == true) {
			map.setCenter(center_coordinates);
		}
	}

}

/**
 * 标绘闪烁
 * @param {Array} points 对象值数组.
 */
var flashMaker = [];
//var flashMaker=null;
function drawFlash(points){
	flashMaker.push(new FlashMarker(map.getOLMap(), points));
  //flashMaker = new FlashMarker(map.getOLMap(), points);
}
/**
 * 删除闪烁
 * @param {Array} points 对象值数组.
 */
function clearFlash(){
	for (var i=0,len=flashMaker.length; i<len; i++) {
		flashMaker[i].myclear();
	}
	delete flashMaker;
	flashMaker = [];
  //if(flashMaker != null) flashMaker.myclear();
}

/**
 * 绘制方法
 * @param modeltype
 * @param params json数据
 * params.modeltype  //LineString 画线  // MultiPoint 画点   //Polygon画面
 * params.strokeWidth 线宽
 * params.strokeColor 区域填充色
 * params.layerName 图层名称
 * params.id 业务id
 * params.infoWindowContent 弹窗
 * params.infoWindowWidth  弹窗宽度
 */
function saveDraw(modeltype, params){
	var model = params.modeltype;//"LineString";  // MultiPoint   Polygon
	var style = {
		radius:6,
		strokeWidth:params.strokeWidth,
		strokeColor:params.strokeColor		//线颜色
	};
	var l = map.getLayer(params.layerName);
	if(l == null){
		var layer_option = { name:params.layerName };
		l = map.addVectorLayer(layer_option);
	}
	var popupAttributes = {};
	popupAttributes.id = params.id;

	popupAttributes.infoWindowContent = params.infoWindowContent;
	popupAttributes.infoWindowWidth = params.infoWindowWidth;

	map.draw(l,model,style,popupAttributes,drawCallBack);
	var select_style = {
		strokeWidth:0.7,
		strokeColor:"#000"
	};
	map.initSelectStyle(select_style);
}

var wkt = null;
function drawCallBack(geom){
	var PROJECTION_4326 = "EPSG:4326";
	var PROJECTION_3857 = "EPSG:3857";

	if(geom){
		var wkt_gom = geom.clone();
		var py = geom.clone();
		var format = new ol.format.WKT();
		var grid_extent = py.getExtent();
		var grid_center = ol.extent.getCenter(grid_extent);
		var returnParam = {};
		returnParam.llatng = py.A;
		returnParam.extend = grid_extent;
		returnParam.center = grid_center;
		wkt = format.writeGeometry(py);
		returnParam.wktoriginal = wkt;

		queryDataByWKT(returnParam,geom);

	};

};

//通过此WKT去调用后台的服务查询相关的关联数据  	/在zmap_config.js中新增此方法
function queryDataByWKT(returnParam,geom){
	var query_wkt = returnParam.wktoriginal;
	if(wkt.indexOf('MULTIPOINT')!=-1){
		var view = map.getOLMap().getView();
		var resolution = view.getResolution();
		var projection = view.getProjection();
		var size = [101, 101];//ol.source.ImageWMS.GETFEATUREINFO_IMAGE_SIZE_
		var coordinate = map.getGeometryCenter(geom);
		var extent = this.map.getForViewAndSize(coordinate,resolution,0,size);   //kjf
		query_wkt = "POLYGON(("+extent[0]+" "+extent[1]+","+extent[0]+" "+extent[3]+","+extent[2]+" "+extent[3]+","+extent[2]+" "+extent[1]+","+extent[0]+" "+extent[1]+"))";
//		console.log(query_wkt);

	}
//	console.log("查业务数据吧"+query_wkt);
	$.post("/map/queryList", {wktstr:query_wkt}, function(data) {
		returnParam.wktstr = data;
		getAlterMapData(returnParam);

	}, "json");
}




//标注WKT
var defaultStyle = [];
function showWKT(layername,isclearlayer,data){

	var vectorLayer = map.getLayer(layername);
	if(vectorLayer == null){
		var layer_option = {
			labelEnable:false,
			name: layername //图层唯一标识
		};
		vectorLayer = map.addVectorLayer(layer_option);   //添加矢量图层
	}
	if (isclearlayer ==  true){
		map.clearVectorLayer(vectorLayer);
	}
	var len = data.length;
	for(var i=0;i<len;i++) {
		defaultStyle = [];
		var item = data[i];
		var _wkt = item.wkt;
		var _geo = map.getGeometryFromWKT(_wkt);

		var attributes = {};
		if(item.attributes) {
			attributes = item.attributes;
		}

		if (item.style && item.style.length > 0) {
			defaultStyle.push(this.getSymbolStyle(item.style[0]));
		}
		attributes.defaultStyle = defaultStyle;
		if(item.style && item.style.length > 1) {
			attributes.overStyle = this.getSymbolStyle(item.style[1]);
		}
		var _feature = map.createFeature(_geo,attributes, defaultStyle);
		map.addLayerFeature(vectorLayer,_feature);

	}

}

function showWKTByColor(layername,isclearlayer,data){

	var vectorLayer = map.getLayer(layername);
	if(vectorLayer == null){
		var layer_option = {
			labelEnable:false,
			name: layername //图层唯一标识
		};
		vectorLayer = map.addVectorLayer(layer_option);   //添加矢量图层
	}
	if (isclearlayer ==  true){
		map.clearVectorLayer(vectorLayer);
	}
	var len = data.length;
	for(var i=0;i<len;i++) {
		defaultStyle = [];
		var item = data[i];
		var _wkt = item.wkt;
		var _geo = map.getGeometryFromWKT(_wkt);

		var flg = true;
		if(_wkt.indexOf("MULTIPOINT") > -1) flg = false;
		var attributes = {};
		if(item.attributes) {
			attributes = item.attributes;
		}

		var dash = false;
		if(item.hasOwnProperty("dash")) {
			if(item.dash == true) dash = true;
		}

		if (item.style && item.style.length > 0) {
			if(flg) defaultStyle.push(this.getSymbolStyleByPolys(item.style[0], dash));
			else  defaultStyle.push(this.getSymbolStyleByPoint(item.style[0]));
		}
		attributes.defaultStyle = defaultStyle;
		if(item.style && item.style.length > 1) {
			if(flg) attributes.overStyle = this.getSymbolStyleByPolys(item.style[1], dash);
			else attributes.overStyle = this.getSymbolStyleByPoint(item.style[1]);
		}
		var _feature = map.createFeature(_geo,attributes, defaultStyle);
		map.addLayerFeature(vectorLayer,_feature);

	}

}

// 获取样式(面/线)
function getSymbolStyleByPolys(styleKey, dash) {
	return map.getPolygonStyle({fillColor: styleKey, borderWidth:3,borderColor: styleKey, borderDash: dash});
}

//获取样式(点)
function getSymbolStyleByPoint(styleKey) {
	return map.getCircleStyle({radius : 5, fillColor : styleKey, borderWidth : 1, borderColor : styleKey, textAlign : "center", textOffsetY : 15 })
}


function queryWMSLayer(_layername,_layers,_layerurl,_proxyurl,_propertyStr,_maptype){
    var wmsLayer = map.getLayer(_layername);
	   if(wmsLayer){
		   map.removeLayer(wmsLayer);
		   // console.log(map.getLayer(_layername))
		   map.getOLMap().removeLayer(wmsLayer);
	   }
	   if(_propertyStr != ""){
			var _params = {
				    'VERSION': '1.1.1',
					LAYERS:_layers,	
					CQL_FILTER:_propertyStr
			}
	   }else{
			var _params = {
				    'VERSION': '1.1.1',
					LAYERS:_layers
			}
	   }

		wmsLayer = new ol.layer.Image({
			name: _layername,
		    source: new ol.source.ImageWMS({
		    	
		        url: _layerurl,
		        params: _params,
		        serverType: 'geoserver'
		    })
		});
		
		map.getOLMap().addLayer(wmsLayer);
		map.refreshLayer(wmsLayer);
	}


function queryWFSLayer(_layername,_layers,_layerurl,_proxyurl,_propertyStr,_maptype){
	 var  layerOption = {
		name: _layername,
		layers: _layers,
       url: _layerurl,
       visible:false
   };

	var dmLayer = map.addWMSLayer(layerOption);
	map.setProxyUrl(_proxyurl);
	
	var propertyStr = _propertyStr;
	
	//map.getWMSLayerFeature(dmLayer,propertyStr,queryWMSLayerCallBack);
	map.getWFSLayerFeatureByCql(dmLayer,propertyStr,queryWFSLayerCallBack);
}

//查询WMS图层回调函数
function queryWFSLayerCallBack(features,zMap){
	// console.log('--features.length11111121212=='+features.length);
	var style_line = map.getLineStyle({color:"#FF0000",width:3});

	//--添加矢量图层
	var dm_vectorLayer = map.getLayer("vectorLayer_dm");
	if(!dm_vectorLayer){
		var dm_vectorLayer_option = {
			name: "vectorLayer_dm" //图层唯一标识
		};
		dm_vectorLayer = map.addVectorLayer(dm_vectorLayer_option);
	} else {
		//--清空图层
		map.clearVectorLayer(dm_vectorLayer);
	}

	if(features.length > 0){
		$.each(features,function(n,feature){
			//feature.getGeometry().transform('EPSG:4326', 'EPSG:900913');
			var attributes = feature.get("attributes");
			//--
			var objectId = attributes.objectId;
			var objectName = attributes.objectName;
			// console.log('--objectId='+objectId+",objectName="+objectName);
			attributes.id = objectId;
			//
			attributes.tooltip = attributes.name;	//显示tooltip
			//attributes.infoWindowCallBack = showPopupWindow;	//属性信息框弹出回调函数
			attributes.infoWindowWidth = "300px";
			attributes.infoWindowContent = "<p>"+attributes.LXMC+"</p>";

			//--其它属性
			// console.log('--name='+attributes.name);
			feature.setStyle(style_line);
			zMap.addLayerFeature(dm_vectorLayer,feature);
		});
		
		map.zoomToVectorLayer(dm_vectorLayer);
	}
}
//地图点击
function WMSLayerGetFeatureInfo(layername,layers,url,InfoCallBack){
	var wmsLayer = map.getLayer(layername);
	if(!wmsLayer){
		var option = {
			name: layername,
			layers: layers,
			url: url
		};
		wmsLayer = map.addWMSLayer(option);
	}
	map.setProxyEnable(false);//查询返回最大记录数
	var featureCount = 1; 
	map.getFeatureInfoLayers([wmsLayer],featureCount,"geoserver",InfoCallBack);
}

function featureInfoCallBack2(features,ttMap,coordinate){
	if(features.length > 0){
		var feature = features[0];
		var attributes = feature.get("attributes");
		// console.log('--id=='+attributes.ROAD_CODE);
		// console.log('--taz=='+attributes.ROAD_NAME);
		

	}
}
//取消
function CancelGetFeatureInfo(){
	map.clearFeatureInfoLayers();
}

/**
 * 添加面(单个)
 * @param wkt
 * @param layername
 */
function showWktByOne(wkt,layername){
	var fromProjection = "EPSG:4326";
	var toProjection = "EPSG:900913";

	var _wkt = wkt
	var _layername = layername;


	//var _geo = map.getGeometryFromWKT(wkt,fromProjection,toProjection);
	var _geo = map.getGeometryFromWKT(_wkt);
	var style_geo = map.getPolygonStyle({fillColor:"rgba(255, 255, 12, 0.3)",borderWidth:3,borderColor:"#009933"});
	var layer = map.getLayer(_layername);

	if(!layer){
		var layer_option = {
			name: _layername //图层唯一标识
		};
		layer = map.addVectorLayer(layer_option);
	}

	map.clearVectorLayer(layer);
	var feature_geo = map.createFeature(_geo,{},style_geo);

	map.addLayerFeature(layer,feature_geo);

}
/**
 * 根据ID删除WKT
 * @param layername 图层名
 * @param ids 删除的图形id [id]
 */
function deleteWktByID(layername,ids) {
//	console.log(layername+"123@"+ids); //ids 是字符串，不是对象
	rmPoints(layername,ids);
//	if(vectorenit) map.getOLMap().removeLayer(vectorenit);
	map.featureDrawResetHandler_3();
};


//ZMap_config.js

function updateWktByID(layername,ids){

	//debugger
	var vectorLayer = map.getLayer(layername);
	if(vectorLayer == null) return;
	if(!ids) return;

	var feature_attributes_key = "id";
	var feature_attributes_value = ids;
	var feature = map.getLayerFeature(vectorLayer,feature_attributes_key,feature_attributes_value);

	//删除之前标注的
	rmPoints(layername,ids);
	if(!feature) return;

	var geom = feature.getGeometry();
	var attributes = feature.get("attributes");
	attributesenit = attributes;

	var style_polygon = map.getPolygonStyle({fillColor:"rgba(255, 255, 12, 0.5)",borderWidth:3,borderColor:"#009933"});
	var _feature = map.createFeature(geom,{},style_polygon);

	var source = new ol.source.Vector({ features: [_feature] });
	vectorenit = new ol.layer.Vector({ source: source });
	map.getOLMap().addLayer(vectorenit);
	if(!modifyTool){
		modifyTool = new ol.interaction.Modify({source: source});
		map.getOLMap().addInteraction(modifyTool);
	}
};

/**
 * 修改添加类型的点面线修改
 * @param layername
 * @param ids
 */
function queryUpdateWktByID(layername, ids) {

	var vectorLayer = map.getLayer(layername);
	if(vectorLayer == null) return;
	if(!ids) return;

	var feature_attributes_key = "id";
	var feature_attributes_value = ids;
	var feature = map.getLayerFeature(vectorLayer,feature_attributes_key,feature_attributes_value);
	var vect = map.getLayer(layername);
	if(!feature) return;

	var geom = feature.getGeometry();
	var attributes = feature.get("attributes");

	var wkt_gom = geom.clone();
	var py = geom.clone();

	var format = new ol.format.WKT();
	wkt = format.writeGeometry(py);
//	console.log('--wkt 修改后的值='+wkt);

	var wkt_gom = geom.clone();
	var py = geom.clone();
	var format = new ol.format.WKT();
	var grid_extent = py.getExtent();
	var grid_center = ol.extent.getCenter(grid_extent);
	var returnParam = {};
	returnParam.llatng = py.A;
	returnParam.extend = grid_extent;
	returnParam.center = grid_center;
	wkt = format.writeGeometry(py);
	returnParam.wktoriginal = wkt;


	//删除编辑的，换成正常的
	deleteWktByID(layername,ids);
	if(vectorenit) map.getOLMap().removeLayer(vectorenit);

	var _feature = map.createFeature(geom,attributesenit,defaultStyle);
	map.addLayerFeature(vectorLayer,feature);
	map.getOLMap().removeInteraction(modifyTool);
	modifyTool = null;

	return returnParam;
};



function mapRemoveLayer(layerName){
	var l = map.getLayer(layerName);
	if(l == null){return;}
	map.removeLayer(layerName);
}

//获取样式
function getSymbolStyle(styleKey){
	return styleMap[styleKey];
}

/**
 * 根据ID定位弹出窗口【目前只支持单个】
 * @param {String} layername 图层名称.
 * @param {String} id 对象id属性值.
 * @param {Boolean} isCenter 是否居中.
 */
function showPopupWindowByID(layername,id,isCenter){
	var vectorLayer = map.getLayer(layername);
	if(vectorLayer == null){
		return;
	}

	var feature_attributes_key = "id";
	var feature_attributes_value = id;
	var feature = map.getLayerFeature(vectorLayer,feature_attributes_key,feature_attributes_value);
	if(feature == null){return;}

	var geom = feature.getGeometry();
	var center_coordinates = map.getGeometryCenter(geom);
	var attributes = feature.get("attributes");

	var infoWindowWidth = "400px";
	if(attributes && attributes.infoWindowWidth){
		infoWindowWidth = attributes.infoWindowWidth;
	}

	if(attributes && attributes.infoWindowContent){
		map.infoWindowShow(center_coordinates,attributes.infoWindowContent,infoWindowWidth); //显示信息框
		if(isCenter === undefined || isCenter == true){
			map.setCenter(center_coordinates);
		}
	}

}



function queryUpdateDrawByID(layername,ids){

	var vectorLayer = map.getLayer(layername);
	if (vectorLayer == null) {
		return;
	}
	if (!ids) {
		return;
	}
	var feature_attributes_key = "id";
	var feature_attributes_value = ids;
	var feature = map.getLayerFeature(vectorLayer, feature_attributes_key,feature_attributes_value);
	if (!feature) {
		return;
	}
	var geom = feature.getGeometry();
	var attributes = feature.get("attributes");
	var wkt_gom = geom.clone();
	var py = geom.clone();
	var format = new ol.format.WKT();
	wkt = format.writeGeometry(py);
	console.log('--wkt 修改后的值=' + wkt);
}

function deleteDrawByID(layername, ids) {
	rmPoints(layername, ids);
	map.featureDrawResetHandler_3()
}









/**
 *  展示折线图
 *  attrNames---展示数据项集合
 deptCode---区域编码
 deptName----区域名称
 latitude----区域中心坐标x
 longitude---区域中心坐标y
 xAxisData-----柱图每项的第一种值，例如设备在线值
 yAxisData-----柱图每项的第二种值，例如设备离线值
 colors-----柱图每项的第一种值的颜色
 baseColorData----柱图每项的第二种值的颜色
 barNames---柱图每项提示值

 json = [
 {
     "attrNames": ["交调","情报板","车辆","视频"],
     "deptCode": "361000",
     "deptName": "抚州",
     "longitude": "114.2365",
     "latitude": "28.9281",
     "xAxisData": ["1","3","4","7"],
     "yAxisData": ["1","3","4","7"],
     "colors":['#000000','#ff0000','#0000ff','#000000'],
     "barNames": ["交调","情报板","车辆","视频"],
     "baseColorData":['#000000','#ff0000','#0000ff','#000000']

 },
 {
     "attrNames": ["交调","情报板","车辆","视频"],
     "deptCode": "361100",
     "deptName": "上饶",
     "longitude": "117.49897",
     "latitude": "28.574398",
     "xAxisData": ["1","3","4","7"],
     "yAxisData": ["1","3","4","7"],
     "colors":['#000000','#ff0000','#0000ff','#000000'],
     "barNames": ["交调","情报板","车辆","视频"],
     "baseColorData":['#000000','#ff0000','#0000ff','#000000']
 }
 ];
 */
function showLineCharts(json){
	for (var i in json) {
		if(i == "remove" || i == "in_array"){
			continue;
		}
		var attrNames_;	//图例名称集合
		var xAxisData_;	//数据集合1
		var yAxisData_;	//数据集合2
		var deptCode_;	//机构编号
		var deptName_;	//机构名称
		var latitude_;	//坐标x
		var longitude_;	//坐标y
		var color_;//第一项柱状图颜色
		var barName_;//提示名称集合
		var baseColorData_;//第二项柱状图颜色
		var functionName;//点击触发函数
		for ( var data in json[i]) {
			if (data == 'attrNames'){
				attrNames_ = json[i][data];
			}else if (data == 'xAxisData'){
				xAxisData_ = json[i][data];
			}else if (data == 'yAxisData'){
				yAxisData_ = json[i][data];
			}else if (data == 'deptCode'){
				deptCode_ = json[i][data];
			}else if (data == 'deptName'){
				deptName_ = json[i][data];
			}else if (data == 'latitude'){
				latitude_ = json[i][data];
			}else if (data == 'longitude'){
				longitude_ = json[i][data];
			}else if (data == 'colors'){
				color_ = json[i][data];
			}else if (data == 'barNames'){
				barName_ = json[i][data];
			}else if (data == 'baseColorData'){
				baseColorData_ = json[i][data];
			}
			else if (data == 'functionName'){
				functionName = json[i][data];
			}
		}
		createLineOverlay(longitude_, latitude_, deptCode_);
		createLineCharts(deptName_,deptCode_,attrNames_,xAxisData_,yAxisData_,color_,barName_,baseColorData_,functionName);
	}
}
/**
 * 创建折线图标注符号
 * tempLongitude：标注符号位置 经度
 * tempLatitude：标注符号位置 纬度
 * tempCode:机构编号,例：360000
 */
function createLineOverlay(tempLongitude, tempLatitude, tempCode) {
	var container = document.createElement('div');
	container.id = 'lineDiv_' + tempCode;
	container.className = 'lineDiv_';
	var lineOverlay = new ol.Overlay({
		position : [ tempLongitude, tempLatitude ],
		//positioning: 'center-center',
		offset : [-50, -50],
		element : container
	});
	map.getOLMap().addOverlay(lineOverlay);
}

/**
 * 创建折线图
 * deptName:区域名称,例：南昌市公路局
 * deptCode：区域编码
 * attrNames:x轴数据，例：["交调","情报板","车辆","视频"]
 * xAxisData：在线数数据，例：[320, 132, 101, 134]
 * yAxisData：离线数数据，例：[320, 132, 101, 134]
 * colorData：柱图每项第一种颜色 例如在线颜色
 * barName：柱图提示值
 * baseColorData:柱图每项第二种颜色 例如离线颜色
 */
function createLineCharts(deptName,deptCode,attrNames,xAxisData,yAxisData,colorData,barName,baseColorData,functionName){
	//容器属性设置
	var mainContainer = document.getElementById('lineDiv_' + deptCode);
	mainContainer.style.width = '100px';
	mainContainer.style.height = '100px';
	//柱状图设置
	var option = {

		/*title: {
		 text: deptName,
		 textStyle: {
		 fontSize: 0,
		 // color: '#0c1431',
		 Opacity:0
		 },
		 padding: 0,
		 left: "center"
		 },*/
		color:colorData,
		tooltip : {
			trigger: 'axis',
			axisPointer : {
				type : 'shadow'
			},
			formatter: function(params) {
				//console.log(barName[params[0].dataIndex]);
				//return '<p>'+barName[params[0].dataIndex]+'</p>'+ '\n'+'<div><p style="color:#fff">在线数量：' + params[0].value+'</p></div>'  + '\n'+'<div><p style="color:#fff">离线数量：' + params[1].value+'</p></div>';
				return '<p>'+barName[params[0].dataIndex]+'</p>'+ '\n'+'<div><p style="color:#fff">数量：' + params[0].value+'</p></div>'  + '\n';
			},
			textStyle: {
				fontSize: 10
			}
		},
		grid: {
			left: '1%',
			right: '1%',
			top: '1%',
			bottom: '1%',
			containLabel: true
		},
		xAxis:  {
			type: 'category',
			data: attrNames,
			axisLabel: {
				show: false,
				textStyle: {
					fontSize: 8,
					color: '#fff'
				},
				interval: 0,
				rotate: 40
			},
			axisTick:{       //y轴刻度线
				show:false
			},
			axisLine:{
				show:false,
			} ,
			splitLine: {show: false},
			axisLabel: {
				show: false,
			}
		},
		yAxis: {
			//y轴线隐藏
			axisTick:{       //y轴刻度线
				show:false
			},
			axisLine:{
				show:false,
			} ,
			splitLine: {show: false},
			axisLabel: {
				show: false,
			}
		},
		series: [
			{
				name: '在线数',
				type: 'line',
				barWidth: 10,
				stack: '总量',
				label: {
					normal: {
						show: false,
						position: 'inside',
						textStyle: {
							fontSize: 10
						},
						rotate: 90
					}
				},
				itemStyle:{
					normal:{
						color: function (params){
							var colorList = colorData;
							return colorList[params.dataIndex];
						}
					}
				},
				data: xAxisData//[320, 302, 301, 334]
			},
			{
				name: '离线数',
				type: 'line',
				barWidth: 10,
				stack: '总量',
				barGap: 0,
				label: {
					normal: {
						show: false,
						position: 'inside',
						textStyle: {
							fontSize: 10
						},
						rotate: 90
					}
				},
				itemStyle:{
					normal:{
						color: function (params){
							var colorList =baseColorData;
							return colorList[params.dataIndex];
						}
					}
				},
				data: yAxisData//[320, 132, 101, 134]
			}
		]
	};

	var lineChart = echarts.init(mainContainer);
	lineChart.setOption(option);

}

/**
 * 调用展示柱图示例(供业务人员查看)
 */
function testShowBarCharts(){

//    attrNames---展示数据项集合
//    deptCode---区域编码
//    deptName----区域名称
//    latitude----区域中心坐标x
//    longitude---区域中心坐标y
//    xAxisData-----柱图每项的第一种值，例如设备在线值
//    yAxisData-----柱图每项的第二种值，例如设备离线值
//    colors-----柱图每项的第一种值的颜色
//    baseColorData----柱图每项的第二种值的颜色
//    barNames---柱图每项提示值

	var json = [
		{
			"attrNames": ["交调","情报板","车辆","视频"],
			"deptCode": "361000",
			"deptName": "抚州",
			"longitude": "114.2365",
			"latitude": "28.9281",
			"xAxisData": ["1","3","4","7"],
			"yAxisData": ["1","3","4","7"],
			"colors":['#000000','#ff0000','#0000ff','#000000'],
			"barNames": ["交调","情报板","车辆","视频"],
			"baseColorData":['#000000','#ff0000','#0000ff','#000000']

		},
		{
			"attrNames": ["交调","情报板","车辆","视频"],
			"deptCode": "361100",
			"deptName": "上饶",
			"longitude": "117.49897",
			"latitude": "28.574398",
			"xAxisData": ["1","3","4","7"],
			"yAxisData": ["1","3","4","7"],
			"colors":['#000000','#ff0000','#0000ff','#000000'],
			"barNames": ["交调","情报板","车辆","视频"],
			"baseColorData":['#000000','#ff0000','#0000ff','#000000']
		}
	];
	showBarCharts(json);
}
/**
 *  展示柱图
 *  attrNames---展示数据项集合
 deptCode---区域编码
 deptName----区域名称
 latitude----区域中心坐标x
 longitude---区域中心坐标y
 xAxisData-----柱图每项的第一种值，例如设备在线值
 yAxisData-----柱图每项的第二种值，例如设备离线值
 colors-----柱图每项的第一种值的颜色
 baseColorData----柱图每项的第二种值的颜色
 barNames---柱图每项提示值

 json = [
 {
     "attrNames": ["交调","情报板","车辆","视频"],
     "deptCode": "361000",
     "deptName": "抚州",
     "longitude": "114.2365",
     "latitude": "28.9281",
     "xAxisData": ["1","3","4","7"],
     "yAxisData": ["1","3","4","7"],
     "colors":['#000000','#ff0000','#0000ff','#000000'],
     "barNames": ["交调","情报板","车辆","视频"],
     "baseColorData":['#000000','#ff0000','#0000ff','#000000']

 },
 {
     "attrNames": ["交调","情报板","车辆","视频"],
     "deptCode": "361100",
     "deptName": "上饶",
     "longitude": "117.49897",
     "latitude": "28.574398",
     "xAxisData": ["1","3","4","7"],
     "yAxisData": ["1","3","4","7"],
     "colors":['#000000','#ff0000','#0000ff','#000000'],
     "barNames": ["交调","情报板","车辆","视频"],
     "baseColorData":['#000000','#ff0000','#0000ff','#000000']
 }
 ];
 */
function showBarCharts(json){
	for (var i in json) {
		if(i == "remove" || i == "in_array"){
			continue;
		}
		var attrNames_;	//图例名称集合
		var xAxisData_;	//数据集合1
		var yAxisData_;	//数据集合2
		var deptCode_;	//机构编号
		var deptName_;	//机构名称
		var latitude_;	//坐标x
		var longitude_;	//坐标y
		var color_;//第一项柱状图颜色
		var barName_;//提示名称集合
		var baseColorData_;//第二项柱状图颜色
		var functionName;//点击触发函数
		for ( var data in json[i]) {
			if (data == 'attrNames'){
				attrNames_ = json[i][data];
			}else if (data == 'xAxisData'){
				xAxisData_ = json[i][data];
			}else if (data == 'yAxisData'){
				yAxisData_ = json[i][data];
			}else if (data == 'deptCode'){
				deptCode_ = json[i][data];
			}else if (data == 'deptName'){
				deptName_ = json[i][data];
			}else if (data == 'latitude'){
				latitude_ = json[i][data];
			}else if (data == 'longitude'){
				longitude_ = json[i][data];
			}else if (data == 'colors'){
				color_ = json[i][data];
			}else if (data == 'barNames'){
				barName_ = json[i][data];
			}else if (data == 'baseColorData'){
				baseColorData_ = json[i][data];
			}
			else if (data == 'functionName'){
				functionName = json[i][data];
			}
		}
		createBarOverlay(longitude_, latitude_, deptCode_);
		createBarCharts(deptName_,deptCode_,attrNames_,xAxisData_,yAxisData_,color_,barName_,baseColorData_,functionName);
	}
}
/**
 * 创建柱图标注符号
 * tempLongitude：标注符号位置 经度
 * tempLatitude：标注符号位置 纬度
 * tempCode:机构编号,例：360000
 */
function createBarOverlay(tempLongitude, tempLatitude, tempCode) {
	var container = document.createElement('div');
	container.id = 'barDiv_' + tempCode;
	container.className = 'barDiv_';
	var barOverlay = new ol.Overlay({
		position : [ tempLongitude, tempLatitude ],
		//positioning: 'center-center',
		offset : [-50, -50],
		element : container
	});
	map.getOLMap().addOverlay(barOverlay);
}

/**
 * 创建柱状图
 * deptName:区域名称,例：南昌市公路局
 * deptCode：区域编码
 * attrNames:x轴数据，例：["交调","情报板","车辆","视频"]
 * xAxisData：在线数数据，例：[320, 132, 101, 134]
 * yAxisData：离线数数据，例：[320, 132, 101, 134]
 * colorData：柱图每项第一种颜色 例如在线颜色
 * barName：柱图提示值
 * baseColorData:柱图每项第二种颜色 例如离线颜色
 */
function createBarCharts(deptName,deptCode,attrNames,xAxisData,yAxisData,colorData,barName,baseColorData,functionName){
	//容器属性设置
	var mainContainer = document.getElementById('barDiv_' + deptCode);
	mainContainer.style.width = '100px';
	mainContainer.style.height = '100px';
	//柱状图设置
	var option = {

		/*title: {
		 text: deptName,
		 textStyle: {
		 fontSize: 0,
		 // color: '#0c1431',
		 Opacity:0
		 },
		 padding: 0,
		 left: "center"
		 },*/
		color:colorData,
		tooltip : {
			trigger: 'axis',
			axisPointer : {
				type : 'shadow'
			},
			formatter: function(params) {
				//console.log(barName[params[0].dataIndex]);
				//return '<p>'+barName[params[0].dataIndex]+'</p>'+ '\n'+'<div><p style="color:#fff">在线数量：' + params[0].value+'</p></div>'  + '\n'+'<div><p style="color:#fff">离线数量：' + params[1].value+'</p></div>';
				return '<p>'+barName[params[0].dataIndex]+'</p>'+ '\n'+'<div><p style="color:#fff">里程数：' + params[0].value+'</p></div>'  + '\n';
			},
			textStyle: {
				fontSize: 10
			}
		},
		grid: {
			left: '1%',
			right: '1%',
			top: '1%',
			bottom: '1%',
			containLabel: true
		},
		xAxis:  {
			type: 'category',
			data: attrNames,
			axisLabel: {
				show: false,
				textStyle: {
					fontSize: 8,
					color: '#fff'
				},
				interval: 0,
				rotate: 40
			},
			axisTick:{       //y轴刻度线
				show:false
			},
			axisLine:{
				show:false,
			} ,
			splitLine: {show: false},
			axisLabel: {
				show: false,
			}
		},
		yAxis: {
			//y轴线隐藏
			axisTick:{       //y轴刻度线
				show:false
			},
			axisLine:{
				show:false,
			} ,
			splitLine: {show: false},
			axisLabel: {
				show: false,
			}
		},
		series: [
			{
				name: '在线数',
				type: 'bar',
				barWidth: 10,
				stack: '总量',
				label: {
					normal: {
						show: false,
						position: 'inside',
						textStyle: {
							fontSize: 10
						},
						rotate: 90
					}
				},
				itemStyle:{
					normal:{
						color: function (params){
							var colorList = colorData;
							return colorList[params.dataIndex];
						}
					}
				},
				data: xAxisData//[320, 302, 301, 334]
			},
			{
				name: '离线数',
				type: 'bar',
				barWidth: 10,
				stack: '总量',
				barGap: 0,
				label: {
					normal: {
						show: false,
						position: 'inside',
						textStyle: {
							fontSize: 10
						},
						rotate: 90
					}
				},
				itemStyle:{
					normal:{
						color: function (params){
							var colorList =baseColorData;
							return colorList[params.dataIndex];
						}
					}
				},
				data: yAxisData//[320, 132, 101, 134]
			}
		]
	};

	var barChart = echarts.init(mainContainer);
	barChart.setOption(option);

}
/**
 * 调用展示饼图示例(供业务人员查看)
 */
function testShowPieCharts(){
//    seriesData---数据集合
//    deptCode---地区编码
//    deptName----机构名称
//    latitude----坐标x
//    longitude---坐标y
//    colors-----饼图各项颜色
//    pieRadius---饼图的半径。可以为如下类型：数组的第一项是内半径，第二项是外半径。
	var json = [
		{
			"seriesData":[{name:'第一类',value:20},{name:'第二类',value:23},{name:'第三类',value:45},{name:'第四类',value:34},{name:'第五类',value:14}],
			"deptCode": "361000",
			"deptName": "抚州",
			"longitude": "114.2365",
			"latitude": "28.9281",
			"colors":['#000000','#ff0000','#0000ff','#000000','#000000'],
			"pieRadius":[0,'70%']

		},
		{
			"seriesData": [{name:'第一类',value:20},{name:'第二类',value:23},{name:'第三类',value:45},{name:'第四类',value:34},{name:'第五类',value:14}],
			"deptCode": "361100",
			"deptName": "上饶",
			"longitude": "117.49897",
			"latitude": "28.574398",
			"colors":['#000000','#ff0000','#0000ff','#000000','#000000'],
			"pieRadius":['30%','70%']
		}
	];
	showPieCharts(json);
}
/**
 *  展示饼图
 *  seriesData---数据集合
 deptCode---地区编码
 deptName----机构名称
 latitude----坐标x
 longitude---坐标y
 colors-----饼图各项颜色
 pieRadius---饼图的半径。可以为如下类型：数组的第一项是内半径，第二项是外半径。

 json = [
 {
     "seriesData":[{name:'第一类',value:20},{name:'第二类',value:23},{name:'第三类',value:45},{name:'第四类',value:34},{name:'第五类',value:14}],
     "deptCode": "361000",
     "deptName": "抚州",
     "longitude": "114.2365",
     "latitude": "28.9281",
     "colors":['#000000','#ff0000','#0000ff','#000000','#000000'],
     "pieRadius":[0,'70%']

 },
 {
     "seriesData": [{name:'第一类',value:20},{name:'第二类',value:23},{name:'第三类',value:45},{name:'第四类',value:34},{name:'第五类',value:14}],
     "deptCode": "361100",
     "deptName": "上饶",
     "longitude": "117.49897",
     "latitude": "28.574398",
     "colors":['#000000','#ff0000','#0000ff','#000000','#000000'],
     "pieRadius":['30%','70%']
 }
 ]
 */
function showPieCharts(json){
	for(var i in json){
		if(i == "remove" || i == "in_array"){
			continue;
		}
		var seriesData;	//数据集合
		var deptCode;	//机构编号
		var deptName;	//机构名称
		var latitude;	//坐标x
		var longitude;	//坐标y
		var colors; //饼图各项颜色
		var pieRadius; //饼图的半径。可以为如下类型：数组的第一项是内半径，第二项是外半径。
		var functionName;//函数名

		for ( var data in json[i]) {
			if (data == 'seriesData'){
				seriesData = json[i][data];
			}else if (data == 'deptCode'){
				deptCode = json[i][data];
			}else if (data == 'deptName'){
				deptName = json[i][data];
			}else if (data == 'latitude'){
				latitude = json[i][data];
			}else if (data == 'longitude'){
				longitude = json[i][data];
			}else if (data == 'colors'){
				colors = json[i][data];
			}else if (data == 'pieRadius'){
				pieRadius = json[i][data];
			}else if (data == 'functionName'){
				functionName = json[i][data];
			}
		}

		createPieOverlay(longitude, latitude, deptCode);
		createPieCharts(deptName,deptCode,seriesData,colors,pieRadius,functionName);
	}
}
/**
 * 创建饼图标注符号
 * tempLongitude：标注符号位置 经度
 * tempLatitude：标注符号位置 纬度
 * tempCode:机构编号,例：360000
 */
function createPieOverlay(tempLongitude, tempLatitude, tempCode){
	var containers = document.createElement('div');
	containers.id = 'pieDiv_' + tempCode;
	containers.className = 'pieDiv_';
	var pieOverlay = new ol.Overlay({
		position : [ tempLongitude, tempLatitude ],
		positioning: 'center-center',
		element : containers
	});
	map.getOLMap().addOverlay(pieOverlay);
}

/**
 * 创建饼图
 * deptName:机构名称,例：南昌市公路局
 * deptCode:机构编号,例：360000
 * seriesData：饼图数据，例：[{value:3, name:'DUTY'},{value:0, name:'soft'},{value:234, name:'dev'}]
 * pieColor：饼图颜色值
 * pieRadius：饼图半径 半径大于0 则为环饼图
 * functionName：回调函数名
 */
function createPieCharts(deptName,deptCode,seriesData,pieColor,pieRadius,functionName){

	//容器属性设置
	var mainContainer = document.getElementById('pieDiv_' + deptCode);
	mainContainer.style.width = '110px';
	mainContainer.style.height = '110px';
	//饼图设置
	option = {
		color:pieColor,
		tooltip : {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		series : [
			{
				name: deptName,
				type: 'pie',
				radius : pieRadius,
				label: {
					normal: {
						show: false
					},
					emphasis: {
						show: false
					}
				},
				data:seriesData,//数据
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};

	var pieChart = echarts.init(mainContainer);
	pieChart.setOption(option);
}
/**
 * 统计专题图清空
 */
function clearCharts(){
	map.getOLMap().getOverlays().clear();
}
/**
 * 调用热力图(供业务人员查看)
 */
function testCreateHeatMap(){
	var heatMapData={"type":"FeatureCollection","features":[
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.483565,29.705062]},"properties":{"NAME":"吴兴区","ADMINCODE":"330502","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.744766,29.590453]},"properties":{"NAME":"桐乡市","ADMINCODE":"330483","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.608185,29.645636]},"properties":{"NAME":"南浔区","ADMINCODE":"330503","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.243175,29.790542]},"properties":{"NAME":"长兴县","ADMINCODE":"330522","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.482527,29.777743]},"properties":{"NAME":"长兴县","ADMINCODE":"330522","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.800086,29.621383]},"properties":{"NAME":"秀洲区","ADMINCODE":"330411","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.072365,29.820396]},"properties":{"NAME":"嘉善县","ADMINCODE":"330421","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.322636,29.644311]},"properties":{"NAME":"嵊泗县","ADMINCODE":"330922","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.217472,29.869902]},"properties":{"NAME":"嘉善县","ADMINCODE":"330421","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.254184,29.840086]},"properties":{"NAME":"嘉善县","ADMINCODE":"330421","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.253219,29.798341]},"properties":{"NAME":"嘉善县","ADMINCODE":"330421","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.260647,29.730996]},"properties":{"NAME":"嘉善县","ADMINCODE":"330421","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.255094,29.769442]},"properties":{"NAME":"嘉善县","ADMINCODE":"330421","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.265952,29.696156]},"properties":{"NAME":"嘉善县","ADMINCODE":"330421","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.496914,29.611995]},"properties":{"NAME":"平湖市","ADMINCODE":"330482","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.400334,29.626433]},"properties":{"NAME":"平湖市","ADMINCODE":"330482","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.565255,29.535604]},"properties":{"NAME":"平湖市","ADMINCODE":"330482","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.401008,29.512786]},"properties":{"NAME":"诸暨市","ADMINCODE":"330681","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.422285,29.63696]},"properties":{"NAME":"越城区","ADMINCODE":"330602","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.091316,29.572291]},"properties":{"NAME":"南湖区","ADMINCODE":"330402","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.702717,29.478227]},"properties":{"NAME":"柯桥区","ADMINCODE":"330603","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.494878,29.732818]},"properties":{"NAME":"滨江区","ADMINCODE":"330108","weight":100}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.482527,29.777743]},"properties":{"NAME":"上城区","ADMINCODE":"330102","weight":100}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.243175,29.790542]},"properties":{"NAME":"桐乡市","ADMINCODE":"330483","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.476194,29.560175]},"properties":{"NAME":"南浔区","ADMINCODE":"330503","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.826141,28.438726]},"properties":{"NAME":"桐庐县","ADMINCODE":"330122","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.488913,29.85575]},"properties":{"NAME":"下城区","ADMINCODE":"330103","weight":100}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.461223,29.889842]},"properties":{"NAME":"拱墅区","ADMINCODE":"330105","weight":100}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.300309,29.933326]},"properties":{"NAME":"余杭区","ADMINCODE":"330110","weight":100}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.255881,29.600251]},"properties":{"NAME":"吴兴区","ADMINCODE":"330502","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.532216,29.441367]},"properties":{"NAME":"平湖市","ADMINCODE":"330482","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.824131,28.167442]},"properties":{"NAME":"建德市","ADMINCODE":"330182","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.550522,29.854623]},"properties":{"NAME":"江干区","ADMINCODE":"330104","weight":100}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.982605,29.784872]},"properties":{"NAME":"长兴县","ADMINCODE":"330522","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.300309,29.933326]},"properties":{"NAME":"安吉县","ADMINCODE":"330523","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.870313,29.823467]},"properties":{"NAME":"萧山区","ADMINCODE":"330109","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.391346,29.752083]},"properties":{"NAME":"海盐县","ADMINCODE":"330424","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.148946,29.546312]},"properties":{"NAME":"富阳市","ADMINCODE":"330183","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.322636,29.644311]},"properties":{"NAME":"德清县","ADMINCODE":"330521","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.681736,29.766447]},"properties":{"NAME":"海宁市","ADMINCODE":"330481","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.391346,29.752083]},"properties":{"NAME":"秀洲区","ADMINCODE":"330411","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.172021,29.742838]},"properties":{"NAME":"嘉善县","ADMINCODE":"330421","weight":20}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.521164,27.863792]},"properties":{"NAME":"临安市","ADMINCODE":"330185","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.391346,29.752083]},"properties":{"NAME":"上虞区","ADMINCODE":"330604","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.391346,29.752083]},"properties":{"NAME":"西湖区","ADMINCODE":"330106","weight":100}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.411464,28.035258]},"properties":{"NAME":"婺城区","ADMINCODE":"330702","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.8374,28.113272]},"properties":{"NAME":"路桥区","ADMINCODE":"331004","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.255881,29.600251]},"properties":{"NAME":"浦江县","ADMINCODE":"330726","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.135793,28.205385]},"properties":{"NAME":"青田县","ADMINCODE":"331121","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.838768,28.444298]},"properties":{"NAME":"莲都区","ADMINCODE":"331102","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.260647,29.730996]},"properties":{"NAME":"鄞州区","ADMINCODE":"330212","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.514658,29.943675]},"properties":{"NAME":"天台县","ADMINCODE":"331023","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.051034,29.653014]},"properties":{"NAME":"嵊泗县","ADMINCODE":"330922","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.75129,28.033726]},"properties":{"NAME":"泰顺县","ADMINCODE":"330329","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.401008,29.512786]},"properties":{"NAME":"北仑区","ADMINCODE":"330206","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.096407,29.836045]},"properties":{"NAME":"磐安县","ADMINCODE":"330727","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.132448,29.652293]},"properties":{"NAME":"镇海区","ADMINCODE":"330211","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.911583,28.379042]},"properties":{"NAME":"乐清市","ADMINCODE":"330382","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.798841,27.88644]},"properties":{"NAME":"兰溪市","ADMINCODE":"330781","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.642054,28.15691]},"properties":{"NAME":"三门县","ADMINCODE":"331022","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.400334,29.626433]},"properties":{"NAME":"岱山县","ADMINCODE":"330921","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.530857,28.414878]},"properties":{"NAME":"洞头县","ADMINCODE":"330322","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.61797,28.283915]},"properties":{"NAME":"玉环县","ADMINCODE":"331021","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.16288,28.348054]},"properties":{"NAME":"龙游县","ADMINCODE":"330825","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.429618,28.408698]},"properties":{"NAME":"松阳县","ADMINCODE":"331124","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.466116,29.7355]},"properties":{"NAME":"定海区","ADMINCODE":"330902","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.378382,29.615906]},"properties":{"NAME":"普陀区","ADMINCODE":"330903","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.45081,28.203241]},"properties":{"NAME":"鹿城区","ADMINCODE":"330302","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.186333,29.651482]},"properties":{"NAME":"嵊州市","ADMINCODE":"330683","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.466116,29.7355]},"properties":{"NAME":"东阳市","ADMINCODE":"330783","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.826094,28.155912]},"properties":{"NAME":"龙泉市","ADMINCODE":"331181","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.743931,28.032452]},"properties":{"NAME":"龙湾区","ADMINCODE":"330303","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.443674,28.107394]},"properties":{"NAME":"瓯海区","ADMINCODE":"330304","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.31503,28.328725]},"properties":{"NAME":"瑞安市","ADMINCODE":"330381","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.468538,29.684133]},"properties":{"NAME":"奉化市","ADMINCODE":"330283","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.255094,29.769442]},"properties":{"NAME":"新昌县","ADMINCODE":"330624","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.79669,28.190423]},"properties":{"NAME":"庆元县","ADMINCODE":"331126","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.607953,27.893098]},"properties":{"NAME":"景宁畲族自治县","ADMINCODE":"331127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.398197,28.275948]},"properties":{"NAME":"平阳县","ADMINCODE":"330326","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.650739,29.67102]},"properties":{"NAME":"临海市","ADMINCODE":"331082","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.530293,28.128426]},"properties":{"NAME":"云和县","ADMINCODE":"331125","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.777521,28.349844]},"properties":{"NAME":"柯城区","ADMINCODE":"330802","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.063825,28.416949]},"properties":{"NAME":"象山县","ADMINCODE":"330225","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.322636,29.644311]},"properties":{"NAME":"宁海县","ADMINCODE":"330226","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.899404,28.092243]},"properties":{"NAME":"衢江区","ADMINCODE":"330803","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.053546,27.876701]},"properties":{"NAME":"遂昌县","ADMINCODE":"331123","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.076964,29.518467]},"properties":{"NAME":"江东区","ADMINCODE":"330204","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.169688,29.530936]},"properties":{"NAME":"仙居县","ADMINCODE":"331024","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.337158,27.983099]},"properties":{"NAME":"苍南县","ADMINCODE":"330327","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.96164,28.357064]},"properties":{"NAME":"义乌市","ADMINCODE":"330782","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.952421,28.258321]},"properties":{"NAME":"金东区","ADMINCODE":"330703","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.492298,28.325274]},"properties":{"NAME":"武义县","ADMINCODE":"330723","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.003108,27.991011]},"properties":{"NAME":"永康市","ADMINCODE":"330784","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.511921,28.324822]},"properties":{"NAME":"常山县","ADMINCODE":"330822","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.726209,28.36685]},"properties":{"NAME":"开化县","ADMINCODE":"330824","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.916169,28.324794]},"properties":{"NAME":"淳安县","ADMINCODE":"330127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.326073,29.952951]},"properties":{"NAME":"慈溪市","ADMINCODE":"330282","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.270282,29.708434]},"properties":{"NAME":"余姚市","ADMINCODE":"330281","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.963717,28.217454]},"properties":{"NAME":"缙云县","ADMINCODE":"331122","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.391346,29.752083]},"properties":{"NAME":"黄岩区","ADMINCODE":"331003","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.894877,28.310085]},"properties":{"NAME":"文成县","ADMINCODE":"330328","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.553894,28.471434]},"properties":{"NAME":"永嘉县","ADMINCODE":"330324","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.468538,29.684133]},"properties":{"NAME":"江北区","ADMINCODE":"330205","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.571384,27.933226]},"properties":{"NAME":"江山市","ADMINCODE":"330881","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.974965,28.019003]},"properties":{"NAME":"温岭市","ADMINCODE":"331081","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[121.510798,29.594812]},"properties":{"NAME":"海曙区","ADMINCODE":"330203","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.539185,28.22722]},"properties":{"NAME":"","ADMINCODE":"","weight":0}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.555786,30.115193]},"properties":{"NAME":"三门县","ADMINCODE":"331022","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.829901,30.283077]},"properties":{"NAME":"淳安县","ADMINCODE":"330127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.739826,30.114195]},"properties":{"NAME":"龙泉市","ADMINCODE":"331181","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.444589,30.373161]},"properties":{"NAME":"洞头县","ADMINCODE":"330322","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.357406,30.065677]},"properties":{"NAME":"瓯海区","ADMINCODE":"330304","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.076612,30.306337]},"properties":{"NAME":"龙游县","ADMINCODE":"330825","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.364542,30.161523]},"properties":{"NAME":"鹿城区","ADMINCODE":"330302","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.977557,30.375232]},"properties":{"NAME":"象山县","ADMINCODE":"330225","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.710422,30.148705]},"properties":{"NAME":"庆元县","ADMINCODE":"331126","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.485116,29.891509]},"properties":{"NAME":"江山市","ADMINCODE":"330881","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.049525,30.163668]},"properties":{"NAME":"青田县","ADMINCODE":"331121","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.7525,30.402581]},"properties":{"NAME":"莲都区","ADMINCODE":"331102","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.657663,29.990735]},"properties":{"NAME":"龙湾区","ADMINCODE":"330303","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.751133,30.071555]},"properties":{"NAME":"路桥区","ADMINCODE":"331004","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.739873,30.397008]},"properties":{"NAME":"桐庐县","ADMINCODE":"330122","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.521685,29.851381]},"properties":{"NAME":"景宁畲族自治县","ADMINCODE":"331127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.866153,30.216604]},"properties":{"NAME":"金东区","ADMINCODE":"330703","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.25089,29.941382]},"properties":{"NAME":"苍南县","ADMINCODE":"330327","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.737863,30.125724]},"properties":{"NAME":"建德市","ADMINCODE":"330182","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.91684,29.949294]},"properties":{"NAME":"永康市","ADMINCODE":"330784","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.228762,30.287007]},"properties":{"NAME":"瑞安市","ADMINCODE":"330381","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.665022,29.992009]},"properties":{"NAME":"泰顺县","ADMINCODE":"330329","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.875372,30.315347]},"properties":{"NAME":"义乌市","ADMINCODE":"330782","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.877449,30.175737]},"properties":{"NAME":"缙云县","ADMINCODE":"331122","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.434896,29.822074]},"properties":{"NAME":"临安市","ADMINCODE":"330185","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.712573,29.844723]},"properties":{"NAME":"兰溪市","ADMINCODE":"330781","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.813136,30.050526]},"properties":{"NAME":"衢江区","ADMINCODE":"330803","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.325196,29.99354]},"properties":{"NAME":"婺城区","ADMINCODE":"330702","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.639941,30.325133]},"properties":{"NAME":"开化县","ADMINCODE":"330824","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.452918,30.185503]},"properties":{"NAME":"","ADMINCODE":"","weight":0}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.34335,30.366981]},"properties":{"NAME":"松阳县","ADMINCODE":"331124","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.311929,30.234231]},"properties":{"NAME":"平阳县","ADMINCODE":"330326","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.691253,30.308127]},"properties":{"NAME":"柯城区","ADMINCODE":"330802","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.406031,30.283557]},"properties":{"NAME":"武义县","ADMINCODE":"330723","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.444025,30.086708]},"properties":{"NAME":"云和县","ADMINCODE":"331125","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.425653,30.283105]},"properties":{"NAME":"常山县","ADMINCODE":"330822","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.825315,30.337324]},"properties":{"NAME":"乐清市","ADMINCODE":"330382","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.467626,30.429716]},"properties":{"NAME":"永嘉县","ADMINCODE":"330324","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.531702,30.242197]},"properties":{"NAME":"玉环县","ADMINCODE":"331021","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.808609,30.268368]},"properties":{"NAME":"文成县","ADMINCODE":"330328","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.829901,30.283077]},"properties":{"NAME":"淳安县","ADMINCODE":"330127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.739826,30.114195]},"properties":{"NAME":"龙泉市","ADMINCODE":"331181","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.710422,30.148705]},"properties":{"NAME":"庆元县","ADMINCODE":"331126","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.7525,30.402581]},"properties":{"NAME":"莲都区","ADMINCODE":"331102","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.739873,30.397008]},"properties":{"NAME":"桐庐县","ADMINCODE":"330122","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.866153,30.216604]},"properties":{"NAME":"金东区","ADMINCODE":"330703","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.737863,30.125724]},"properties":{"NAME":"建德市","ADMINCODE":"330182","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.875372,30.315347]},"properties":{"NAME":"义乌市","ADMINCODE":"330782","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.877449,30.175737]},"properties":{"NAME":"缙云县","ADMINCODE":"331122","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.639941,30.325133]},"properties":{"NAME":"开化县","ADMINCODE":"330824","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.691253,30.308127]},"properties":{"NAME":"柯城区","ADMINCODE":"330802","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.825315,30.337324]},"properties":{"NAME":"乐清市","ADMINCODE":"330382","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.808609,30.268368]},"properties":{"NAME":"文成县","ADMINCODE":"330328","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.313564,29.981834]},"properties":{"NAME":"淳安县","ADMINCODE":"330127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.123603,30.02389]},"properties":{"NAME":"开化县","ADMINCODE":"330824","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.292272,29.967125]},"properties":{"NAME":"文成县","ADMINCODE":"330328","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.349816,29.915361]},"properties":{"NAME":"金东区","ADMINCODE":"330703","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.308978,30.036082]},"properties":{"NAME":"乐清市","ADMINCODE":"330382","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.174916,30.006885]},"properties":{"NAME":"柯城区","ADMINCODE":"330802","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.313564,29.981834]},"properties":{"NAME":"淳安县","ADMINCODE":"330127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.123603,30.02389]},"properties":{"NAME":"开化县","ADMINCODE":"330824","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.308978,30.036082]},"properties":{"NAME":"乐清市","ADMINCODE":"330382","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.359034,30.014104]},"properties":{"NAME":"义乌市","ADMINCODE":"330782","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.349816,29.915361]},"properties":{"NAME":"金东区","ADMINCODE":"330703","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.359034,30.014104]},"properties":{"NAME":"义乌市","ADMINCODE":"330782","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.292272,29.967125]},"properties":{"NAME":"文成县","ADMINCODE":"330328","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.174916,30.006885]},"properties":{"NAME":"柯城区","ADMINCODE":"330802","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.090591,29.917533]},"properties":{"NAME":"开化县","ADMINCODE":"330824","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.316804,29.809004]},"properties":{"NAME":"金东区","ADMINCODE":"330703","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.275966,29.929725]},"properties":{"NAME":"乐清市","ADMINCODE":"330382","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.141904,29.900527]},"properties":{"NAME":"柯城区","ADMINCODE":"330802","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.280552,29.875477]},"properties":{"NAME":"淳安县","ADMINCODE":"330127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.141904,29.900527]},"properties":{"NAME":"柯城区","ADMINCODE":"330802","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.090591,29.917533]},"properties":{"NAME":"开化县","ADMINCODE":"330824","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.326023,29.907747]},"properties":{"NAME":"义乌市","ADMINCODE":"330782","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.316804,29.809004]},"properties":{"NAME":"金东区","ADMINCODE":"330703","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.280552,29.875477]},"properties":{"NAME":"淳安县","ADMINCODE":"330127","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.326023,29.907747]},"properties":{"NAME":"义乌市","ADMINCODE":"330782","weight":60}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.25926,29.860768]},"properties":{"NAME":"文成县","ADMINCODE":"330328","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.275966,29.929725]},"properties":{"NAME":"乐清市","ADMINCODE":"330382","weight":10}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[120.25926,29.860768]},"properties":{"NAME":"文成县","ADMINCODE":"330328","weight":85}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.251254,30.076534]},"properties":{"NAME":"遂昌县","ADMINCODE":"331123","weight":70}},
		{"type":"Feature","geometry":{"type":"Point","coordinates":[119.146793,30.063553]},"properties":{"NAME":"温岭市","ADMINCODE":"331081","weight":85}}
	]};
	heatMapData={"type":"FeatureCollection","features":[
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.296587,39.317853]},"properties":{"NAME":"温岭市","ADMINCODE":"331081","weight":1}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.296426,39.317738]},"properties":{"weight":10}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.737726,39.329566]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.737702,39.329396]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.322152,39.823749]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.322119,39.823542]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.040207,39.48691]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.040319,39.486744]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.659697,38.404637]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.046262,40.014096]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.046982,40.01432]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.180438,39.794769]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.177523,39.795916]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.397759,39.845283]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.402956,39.84609]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.786506,39.761441]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.784882,39.761192]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.63398,39.871747]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.750263,40.024904]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.750158,40.025053]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.337389,39.93148]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.337361,39.931292]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.900517,39.916109]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.900543,39.915932]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.002892,39.795155]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.776121,40.842148]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.77593,40.842159]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.720635,41.211783]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.721373,41.211879]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.93805,41.467306]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.938252,41.467204]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.732904,39.026032]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.565681,39.071323]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.565631,39.070682]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.17014,39.084896]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.501995,38.099592]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.742331,39.129418]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.469362,38.109719]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.906191,38.234958]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.414078,38.234607]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.364578,38.299475]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.903726,38.000179]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.19684,38.023471]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.701233,38.672601]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.70112,38.672471]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.233024,38.422005]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.232972,38.421859]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.853726,38.643842]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.024352,38.088672]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.422967,37.943533]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.059173,37.98732]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.934522,37.668335]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.756919,37.081352]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.296535,37.35925]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.366633,38.130599]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.366875,38.130317]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.577394,38.208062]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.577347,38.208307]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.348184,36.333704]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[113.69535,36.566819]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.868846,36.40398]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[113.929742,36.629437]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.765029,39.963512]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.594754,39.828858]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.993619,40.127651]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.722952,40.720603]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.724197,40.721007]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.178602,41.047877]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.940113,40.40129]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.939978,40.401]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.687677,40.923025]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.685395,40.922277]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.103035,37.094778]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.103227,37.095413]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.333608,37.025978]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.333202,37.02539]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.768632,36.972619]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.245893,36.967188]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.687087,36.885185]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.728243,38.23967]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.581845,37.914495]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.426897,37.593958]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.490135,39.536969]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.490259,39.537056]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.598837,39.239177]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.598993,39.239181]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.526373,38.82686]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.526445,38.826903]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[113.729385,36.595157]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.772003,38.227032]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.753176,37.966516]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.755448,37.9652]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.658997,37.733848]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.661158,37.73318]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.423065,36.384797]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.57371,37.199332]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.573893,37.199212]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.547029,36.86559]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.547258,36.86556]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.495669,38.755236]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.495988,38.754964]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.667908,38.980613]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.669421,38.981553]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.81967,39.217846]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.818369,39.216422]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.219305,38.663794]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.031524,39.466324]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.029565,39.462445]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.904673,38.443387]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.126494,36.228816]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.126269,36.228647]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.192762,36.727801]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.191796,36.726549]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.307644,36.930904]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.456331,37.131295]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.308751,36.931645]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.457462,37.131972]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.905103,38.607762]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.904847,38.607349]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.237754,39.011422]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.238035,39.010849]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.931524,41.049633]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.933842,41.0492]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.468606,40.846724]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.091132,41.431555]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.090998,41.43155]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.765185,38.460395]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.76525,38.45986]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.175452,38.855239]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.175123,38.85486]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.285108,39.275568]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.285229,39.273841]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.746955,37.762526]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.748813,37.761283]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.561783,37.344394]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.561651,37.33932]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.691887,37.568144]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.692031,37.567935]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.637907,38.17142]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.63819,38.171487]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.665489,38.063821]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.665711,38.063907]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.527787,38.506521]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.527608,38.506731]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.44853,38.331449]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.448727,38.331221]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.665545,39.401193]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.665281,39.40132]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.10407,36.79855]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.16887,36.800465]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.293293,40.50778]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.744845,40.734412]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.743972,40.734408]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.601082,40.74286]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.601166,40.742632]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.254503,40.688265]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.254813,40.68797]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.671106,40.34592]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.954215,40.581801]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.953852,40.58148]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.353639,40.406198]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.353478,40.405979]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.647687,40.388848]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.648247,40.389012]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.412728,39.736423]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.627818,39.485162]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.412603,39.736336]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.627731,39.485033]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.954973,40.744852]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.955323,40.744768]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.25631,40.93938]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.243373,40.93044]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.47961,41.354527]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.700863,41.555371]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.704613,41.55683]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.479738,41.355813]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.237394,40.313474]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.360482,40.092345]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.237663,40.313345]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.35927,40.088653]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.59873,41.206556]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.59903,41.206393]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.606167,41.384893]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.904268,41.376693]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.15986,41.54718]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.158719,41.547314]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.606142,41.384652]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.947498,41.560373]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.94844,41.560309]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.423052,41.453898]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.174482,41.26151]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.423248,41.453903]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.905929,41.375929]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.17495,41.261143]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.47169,39.472548]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.207465,39.39157]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.001886,39.86771]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.00198,39.86761]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.020269,40.522489]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.021687,40.524358]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.692329,40.314795]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.688288,40.313749]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.115075,40.065393]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.110879,40.064127]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.272562,39.569158]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.172366,37.546499]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.172491,37.546625]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.226701,39.584548]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.552871,37.47198]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.345169,36.618938]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.594862,37.803342]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.429847,37.667667]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.614627,39.890455]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.435239,40.584248]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.313719,39.251881]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.9459,41.794403]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.945642,41.794363]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.646832,39.305233]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.646845,39.305315]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.265132,40.046013]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.264909,40.046004]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.149248,40.253038]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.861633,40.410443]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.861522,40.410248]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[119.149283,40.251612]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.069543,37.515458]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[116.069652,37.515285]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.210063,40.796885]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.573598,40.604497]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[118.575027,40.604077]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.765037,36.612582]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[115.196835,36.578823]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.583473,38.070207]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.583675,38.070294]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.598163,37.783145]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[114.598355,37.783157]},"properties":{"weight":0}},
{"type":"Feature","geometry":{"type":"Point","coordinates":[117.771298,40.092922]},"properties":{"weight":0}}
]};
	for(var i=0,l=heatMapData.features.length;i<l;i++){
		var weight;
		if(i<200)
			weight = parseInt(Math.random()*30);
		else
			weight = 70+parseInt(Math.random()*20);
		console.log(weight);
		heatMapData.features[i].properties.weight=weight;
	}
	console.log(heatMapData.features.length);
	var blur=20;
	var radius=10;
	createHeatMap(heatMapData,blur,radius);
}

/**
 * 创建热力图
 * heatData:热力图数据
 * blur:单元大小
 * radius:设置光圈的半径大小
 *
 */
function createHeatMap(heatData,blur,radius){
	//矢量图层 获取geojson数据
	var vectorSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON()).readFeatures(heatData,{
			dataProjection:'EPSG:4326',
			featureProjection:'EPSG:4326'
		})
	});
	// Heatmap热力图             
	var vector = new ol.layer.Heatmap({
		source: vectorSource,
		blur: blur,
		radius:radius
	});
	map.getOLMap().addLayer(vector);
}
/**
 * 清空热力图
 */
function clearHeatMap(){
	//清除所有的类型为heatmap的layer的source
	map.getOLMap().getLayers().forEach(function(layer) {

		if(layer instanceof ol.layer.Heatmap){

			layer.getSource().clear(true);

		}
	});
}
/**
 * 展示箭标
 */
function showPlot(){
	var features=[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[121.12315741960818,30.064589605294742],[121.14802807657549,30.150316532375136],[121.14802807657549,30.150316532375136],[121.14928288191578,30.147558878778472],[121.15027991716677,30.162436590158023],[121.14125796404187,30.150564575291238],[121.14401561763853,30.151819380631522],[121.14401561763853,30.151819380631522],[121.10667792742068,30.071456060372867],[121.11853597202709,30.077683338571486],[121.12315741960818,30.064589605294742]]]},"properties":{"type":"TailedAttackArrow","style":{"fill":{"fillColor":"rgba(226,0,0,0.4)","opacity":0.4},"stroke":{"strokeColor":"rgba(226,0,0,1)","strokeWidth":2,"strokeLineDash":null},"image":{"type":"","image":{"fill":{"fillColor":"rgba(255,204,51,1)"},"points":null,"radius":7,"angle":0,"stroke":null,"rotateWithView":false,"snapToPixel":true}},"text":null},"points":[[121.10667792742068,30.071456060372867],[121.12315741960818,30.064589605294742],[121.15027991716677,30.162436590158023]]}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[121.33601752703005,30.177886114083805],[121.29404384973196,30.188179408432],[121.28986299479017,30.189160050601686],[121.28571516542439,30.190043318241127],[121.28160036163463,30.190829211350312],[121.27751858342094,30.19151772992925],[121.27346983078321,30.192108873977922],[121.26945410372151,30.19260264349635],[121.26547140223587,30.192999038484523],[121.26152172632622,30.193298058942442],[121.25760507599261,30.193499704870103],[121.25372145123502,30.19360397626751],[121.24987085205346,30.193610873134674],[121.2460532784479,30.193520395471577],[121.24226873041839,30.193332543278224],[121.23851720796488,30.19304731655462],[121.2347987110874,30.192664715300765],[121.23111323978594,30.19218473951665],[121.2274607940605,30.19160738920229],[121.22384137391109,30.190932664357675],[121.22025497933771,30.1901605649828],[121.18133304824678,30.18010947937516],[121.18133304824678,30.18010947937516],[121.18401619059586,30.183993647347158],[121.16332618181521,30.173422918283023],[121.1864182418417,30.170859026705017],[121.1825340738697,30.173542169054095],[121.1825340738697,30.173542169054095],[121.22023758690622,30.177401896276976],[121.22372250548041,30.177615792187297],[121.22724683600953,30.177735508584526],[121.23081057849362,30.17776104546867],[121.23441373293265,30.177692402839725],[121.23805629932664,30.177529580697694],[121.24173827767562,30.17727257904258],[121.24545966797953,30.17692139787438],[121.24922047023841,30.176476037193094],[121.25302068445224,30.17593649699872],[121.25686031062105,30.175302777291257],[121.26073934874479,30.174574878070715],[121.2646577988235,30.173752799337077],[121.26861566085715,30.172836541090355],[121.2726129348458,30.171826103330552],[121.27664962078939,30.170721486057662],[121.2807257186879,30.16952268927168],[121.28484122854141,30.16822971297261],[121.28899615034987,30.16684255716046],[121.2931904841133,30.16536122183522],[121.33533088152224,30.1500769710174],[121.31838483661372,30.16923892169693],[121.33601752703005,30.177886114083805]]]},"properties":{"type":"TailedAttackArrow","style":{"fill":{"fillColor":"rgba(226,0,0,0.4)","opacity":0.4},"stroke":{"strokeColor":"rgba(226,0,0,1)","strokeWidth":2,"strokeLineDash":null},"image":{"type":"","image":{"fill":{"fillColor":"rgba(255,204,51,1)"},"points":null,"radius":7,"angle":0,"stroke":null,"rotateWithView":false,"snapToPixel":true}},"text":null},"points":[[121.33601752703005,30.177886114083805],[121.33533088152224,30.1500769710174],[121.25156012956911,30.189559087716617],[121.16332618181521,30.173422918283023]]}}];
	var plot = new olPlot(map.getOLMap(), {
		zoomToExtent: true
	});
	var plot1=[features[0]];
	var plot2=[features[1]];
	setTimeout(function timer(){plot.plotUtils.addFeatures(plot1)},1000);
	setTimeout(function timer(){plot.plotUtils.addFeatures(plot2)},2000);
}

/**
 * 展示影响范围
 */
function showYXFW(){
	var features=[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[121.0986328125,30.19677587890625],[121.0931396484375,30.19677587890625],[121.09039306640625,30.19677587890625],[121.08489990234375,30.19677587890625],[121.0821533203125,30.194029296875],[121.07666015625,30.19128271484375],[121.07391357421875,30.1885361328125],[121.05194091796875,30.18029638671875],[121.043701171875,30.1775498046875],[121.043701171875,30.17480322265625],[121.03546142578125,30.172056640625],[121.03546142578125,30.16931005859375],[121.02996826171875,30.16931005859375],[121.0272216796875,30.1665634765625],[121.02447509765625,30.16381689453125],[121.021728515625,30.1610703125],[121.01898193359375,30.15832373046875],[121.0162353515625,30.1555771484375],[121.01348876953125,30.15283056640625],[121.0107421875,30.150083984375],[121.00799560546875,30.14733740234375],[121.00250244140625,30.1445908203125],[120.999755859375,30.1445908203125],[120.99700927734375,30.13635107421875],[120.9942626953125,30.1336044921875],[120.98876953125,30.13085791015625],[120.98602294921875,30.128111328125],[120.9832763671875,30.12536474609375],[120.9832763671875,30.1226181640625],[120.98052978515625,30.11987158203125],[120.977783203125,30.11987158203125],[120.977783203125,30.117125],[120.97503662109375,30.11437841796875],[120.9722900390625,30.1116318359375],[120.96954345703125,30.10888525390625],[120.966796875,30.106138671875],[120.966796875,30.10339208984375],[120.96405029296875,30.10339208984375],[120.96405029296875,30.1006455078125],[120.9613037109375,30.09789892578125],[120.95855712890625,30.09515234375],[120.955810546875,30.0896591796875],[120.95306396484375,30.0896591796875],[120.9503173828125,30.084166015625],[120.9503173828125,30.08141943359375],[120.94757080078125,30.0786728515625],[120.94482421875,30.07592626953125],[120.94207763671875,30.0731796875],[120.9393310546875,30.07043310546875],[120.93658447265625,30.07043310546875],[120.93109130859375,30.062193359375],[120.9283447265625,30.062193359375],[120.9228515625,30.0567001953125],[120.9173583984375,30.05395361328125],[120.91461181640625,30.05395361328125],[120.91461181640625,30.05120703125],[120.911865234375,30.05120703125],[120.90911865234375,30.04846044921875],[120.90911865234375,30.0457138671875],[120.9063720703125,30.04296728515625],[120.90362548828125,30.040220703125],[120.90087890625,30.03747412109375],[120.90087890625,30.029234375],[120.90087890625,30.02648779296875],[120.8953857421875,30.02099462890625],[120.8953857421875,30.018248046875],[120.8953857421875,30.01550146484375],[120.8953857421875,30.0127548828125],[120.89263916015625,30.01000830078125],[120.89263916015625,30.00451513671875],[120.89263916015625,30.0017685546875],[120.89263916015625,29.99902197265625],[120.889892578125,29.996275390625],[120.88714599609375,29.99352880859375],[120.88714599609375,29.9907822265625],[120.88714599609375,29.9852890625],[120.88714599609375,29.98254248046875],[120.8843994140625,29.9797958984375],[120.8843994140625,29.97155615234375],[120.87890625,29.9578232421875],[120.8734130859375,29.91937109375],[120.867919921875,29.90563818359375],[120.867919921875,29.9028916015625],[120.867919921875,29.90014501953125],[120.867919921875,29.8973984375],[120.867919921875,29.89465185546875],[120.867919921875,29.8919052734375],[120.867919921875,29.88915869140625],[120.867919921875,29.886412109375],[120.867919921875,29.88366552734375],[120.867919921875,29.8809189453125],[120.87066650390625,29.87817236328125],[120.87066650390625,29.87542578125],[120.87066650390625,29.8699326171875],[120.87066650390625,29.86718603515625],[120.8734130859375,29.864439453125],[120.8734130859375,29.86169287109375],[120.8734130859375,29.8589462890625],[120.8734130859375,29.85619970703125],[120.8734130859375,29.853453125],[120.8734130859375,29.85070654296875],[120.8734130859375,29.8479599609375],[120.8734130859375,29.8369736328125],[120.86517333984375,29.82324072265625],[120.86517333984375,29.8095078125],[120.85693359375,29.78753515625],[120.85418701171875,29.77929541015625],[120.84869384765625,29.75732275390625],[120.84869384765625,29.754576171875],[120.84869384765625,29.75182958984375],[120.84869384765625,29.7490830078125],[120.84869384765625,29.74633642578125],[120.845947265625,29.74633642578125],[120.845947265625,29.74358984375],[120.845947265625,29.74084326171875],[120.845947265625,29.7380966796875],[120.845947265625,29.73535009765625],[120.845947265625,29.72985693359375],[120.84869384765625,29.72436376953125],[120.84869384765625,29.71887060546875],[120.84869384765625,29.70239111328125],[120.84869384765625,29.6941513671875],[120.8514404296875,29.688658203125],[120.8514404296875,29.67492529296875],[120.85418701171875,29.66943212890625],[120.85418701171875,29.666685546875],[120.85693359375,29.66393896484375],[120.85693359375,29.6611923828125],[120.85693359375,29.65844580078125],[120.85693359375,29.65569921875],[120.85968017578125,29.65295263671875],[120.85968017578125,29.6502060546875],[120.8624267578125,29.64745947265625],[120.86517333984375,29.644712890625],[120.86517333984375,29.64196630859375],[120.867919921875,29.6392197265625],[120.87066650390625,29.6392197265625],[120.87066650390625,29.63647314453125],[120.87615966796875,29.63097998046875],[120.87890625,29.6282333984375],[120.87890625,29.62548681640625],[120.88165283203125,29.622740234375],[120.8843994140625,29.61999365234375],[120.8843994140625,29.6172470703125],[120.88714599609375,29.61450048828125],[120.88714599609375,29.61175390625],[120.889892578125,29.60900732421875],[120.8953857421875,29.60351416015625],[120.8953857421875,29.600767578125],[120.89813232421875,29.600767578125],[120.89813232421875,29.59802099609375],[120.90087890625,29.5952744140625],[120.90087890625,29.59252783203125],[120.90362548828125,29.58978125],[120.9063720703125,29.5842880859375],[120.90911865234375,29.578794921875],[120.911865234375,29.57604833984375],[120.91461181640625,29.5733017578125],[120.91461181640625,29.56780859375],[120.92010498046875,29.5623154296875],[120.92010498046875,29.55956884765625],[120.9228515625,29.556822265625],[120.92559814453125,29.55407568359375],[120.9283447265625,29.54858251953125],[120.93109130859375,29.54858251953125],[120.93109130859375,29.5458359375],[120.933837890625,29.54308935546875],[120.933837890625,29.5403427734375],[120.93658447265625,29.5403427734375],[120.9393310546875,29.5403427734375],[120.94207763671875,29.53759619140625],[120.94482421875,29.534849609375],[120.94757080078125,29.53210302734375],[120.95306396484375,29.53210302734375],[120.955810546875,29.5293564453125],[120.95855712890625,29.52660986328125],[120.9613037109375,29.52660986328125],[120.96405029296875,29.52386328125],[120.96405029296875,29.52111669921875],[120.966796875,29.52111669921875],[120.96954345703125,29.5183701171875],[120.9722900390625,29.5183701171875],[120.9722900390625,29.51562353515625],[120.977783203125,29.51562353515625],[120.977783203125,29.512876953125],[120.98052978515625,29.512876953125],[120.98602294921875,29.51013037109375],[120.98876953125,29.5073837890625],[120.9942626953125,29.5073837890625],[120.9942626953125,29.50463720703125],[120.999755859375,29.501890625],[121.0052490234375,29.49914404296875],[121.00799560546875,29.49914404296875],[121.0107421875,29.49914404296875],[121.01348876953125,29.4963974609375],[121.0162353515625,29.4963974609375],[121.021728515625,29.4963974609375],[121.02996826171875,29.490904296875],[121.03546142578125,29.4854111328125],[121.0382080078125,29.4854111328125],[121.04095458984375,29.4854111328125],[121.043701171875,29.4854111328125],[121.04644775390625,29.48266455078125],[121.0491943359375,29.48266455078125],[121.05194091796875,29.48266455078125],[121.0546875,29.48266455078125],[121.05743408203125,29.48266455078125],[121.0601806640625,29.48266455078125],[121.06292724609375,29.48266455078125],[121.06842041015625,29.48266455078125],[121.0711669921875,29.48266455078125],[121.07666015625,29.48266455078125],[121.07940673828125,29.48266455078125],[121.08489990234375,29.48266455078125],[121.09039306640625,29.48266455078125],[121.0931396484375,29.48266455078125],[121.1041259765625,29.48266455078125],[121.109619140625,29.48266455078125],[121.1151123046875,29.48266455078125],[121.12884521484375,29.48266455078125],[121.13433837890625,29.48266455078125],[121.142578125,29.48266455078125],[121.14532470703125,29.48266455078125],[121.15631103515625,29.48266455078125],[121.16180419921875,29.48266455078125],[121.16455078125,29.48266455078125],[121.16729736328125,29.48266455078125],[121.1700439453125,29.48266455078125],[121.17279052734375,29.48266455078125],[121.175537109375,29.48266455078125],[121.17828369140625,29.48266455078125],[121.18377685546875,29.48266455078125],[121.1865234375,29.48266455078125],[121.1920166015625,29.48266455078125],[121.19476318359375,29.48266455078125],[121.20025634765625,29.48266455078125],[121.2030029296875,29.48266455078125],[121.20849609375,29.48266455078125],[121.21124267578125,29.48266455078125],[121.21673583984375,29.48266455078125],[121.2249755859375,29.48266455078125],[121.22772216796875,29.48266455078125],[121.23870849609375,29.48266455078125],[121.241455078125,29.48266455078125],[121.24420166015625,29.48266455078125],[121.24969482421875,29.48266455078125],[121.25244140625,29.48266455078125],[121.26068115234375,29.4854111328125],[121.263427734375,29.4854111328125],[121.2689208984375,29.48815771484375],[121.27166748046875,29.48815771484375],[121.27716064453125,29.48815771484375],[121.285400390625,29.490904296875],[121.28814697265625,29.490904296875],[121.29364013671875,29.49365087890625],[121.29638671875,29.49365087890625],[121.29913330078125,29.49365087890625],[121.3018798828125,29.49365087890625],[121.30462646484375,29.49365087890625],[121.307373046875,29.49365087890625],[121.31011962890625,29.49365087890625],[121.318359375,29.49365087890625],[121.32110595703125,29.4963974609375],[121.32659912109375,29.4963974609375],[121.33209228515625,29.49914404296875],[121.3348388671875,29.49914404296875],[121.33758544921875,29.49914404296875],[121.3458251953125,29.501890625],[121.35406494140625,29.501890625],[121.3568115234375,29.501890625],[121.3623046875,29.501890625],[121.3677978515625,29.501890625],[121.37054443359375,29.50463720703125],[121.37603759765625,29.50463720703125],[121.38153076171875,29.5073837890625],[121.38702392578125,29.51013037109375],[121.39251708984375,29.51013037109375],[121.395263671875,29.512876953125],[121.40350341796875,29.512876953125],[121.40899658203125,29.5183701171875],[121.41448974609375,29.52111669921875],[121.417236328125,29.52111669921875],[121.41998291015625,29.52386328125],[121.4227294921875,29.52386328125],[121.42547607421875,29.52660986328125],[121.42822265625,29.5293564453125],[121.43096923828125,29.5293564453125],[121.4337158203125,29.53210302734375],[121.43646240234375,29.534849609375],[121.43646240234375,29.53759619140625],[121.4447021484375,29.54308935546875],[121.44744873046875,29.54308935546875],[121.45294189453125,29.54858251953125],[121.45843505859375,29.55407568359375],[121.461181640625,29.55407568359375],[121.46392822265625,29.556822265625],[121.4666748046875,29.55956884765625],[121.46942138671875,29.5623154296875],[121.47491455078125,29.56780859375],[121.4776611328125,29.57055517578125],[121.48040771484375,29.5733017578125],[121.48040771484375,29.57604833984375],[121.483154296875,29.578794921875],[121.48590087890625,29.58154150390625],[121.494140625,29.5952744140625],[121.49688720703125,29.59802099609375],[121.4996337890625,29.60351416015625],[121.50238037109375,29.60900732421875],[121.50238037109375,29.61175390625],[121.505126953125,29.6172470703125],[121.505126953125,29.61999365234375],[121.50787353515625,29.622740234375],[121.50787353515625,29.6282333984375],[121.50787353515625,29.6337265625],[121.5106201171875,29.63647314453125],[121.51336669921875,29.6392197265625],[121.51611328125,29.644712890625],[121.51885986328125,29.65295263671875],[121.51885986328125,29.65569921875],[121.5216064453125,29.6611923828125],[121.52435302734375,29.666685546875],[121.527099609375,29.6721787109375],[121.527099609375,29.67492529296875],[121.52984619140625,29.677671875],[121.52984619140625,29.6831650390625],[121.52984619140625,29.68591162109375],[121.52984619140625,29.69140478515625],[121.5325927734375,29.69964453125],[121.53533935546875,29.70788427734375],[121.5380859375,29.710630859375],[121.5380859375,29.7216171875],[121.54083251953125,29.72985693359375],[121.5435791015625,29.7380966796875],[121.54632568359375,29.74633642578125],[121.549072265625,29.754576171875],[121.549072265625,29.75732275390625],[121.5545654296875,29.76830908203125],[121.5545654296875,29.7710556640625],[121.5545654296875,29.77380224609375],[121.5545654296875,29.77929541015625],[121.5545654296875,29.7820419921875],[121.55731201171875,29.78753515625],[121.55731201171875,29.79577490234375],[121.55731201171875,29.80126806640625],[121.56005859375,29.80676123046875],[121.56280517578125,29.82324072265625],[121.5655517578125,29.83422705078125],[121.5655517578125,29.84521337890625],[121.5655517578125,29.85070654296875],[121.5655517578125,29.85619970703125],[121.5655517578125,29.86169287109375],[121.5655517578125,29.864439453125],[121.56829833984375,29.86718603515625],[121.56829833984375,29.8699326171875],[121.56829833984375,29.87267919921875],[121.56829833984375,29.87542578125],[121.56829833984375,29.87817236328125],[121.56829833984375,29.8809189453125],[121.56829833984375,29.88366552734375],[121.56829833984375,29.88915869140625],[121.56829833984375,29.8919052734375],[121.56829833984375,29.8973984375],[121.56829833984375,29.90014501953125],[121.56829833984375,29.9028916015625],[121.56829833984375,29.90563818359375],[121.56829833984375,29.908384765625],[121.56829833984375,29.91113134765625],[121.56829833984375,29.9138779296875],[121.56829833984375,29.91662451171875],[121.56829833984375,29.91937109375],[121.56829833984375,29.92211767578125],[121.56829833984375,29.9248642578125],[121.56829833984375,29.930357421875],[121.56829833984375,29.93859716796875],[121.56829833984375,29.94134375],[121.56829833984375,29.94958349609375],[121.56829833984375,29.95507666015625],[121.56829833984375,29.9578232421875],[121.56829833984375,29.96056982421875],[121.56829833984375,29.96606298828125],[121.56829833984375,29.97155615234375],[121.56829833984375,29.974302734375],[121.5655517578125,29.9797958984375],[121.5655517578125,29.98254248046875],[121.56280517578125,29.98803564453125],[121.56280517578125,29.9907822265625],[121.56005859375,29.99352880859375],[121.56005859375,29.996275390625],[121.56005859375,29.99902197265625],[121.55731201171875,29.99902197265625],[121.55731201171875,30.0017685546875],[121.5545654296875,30.00451513671875],[121.5545654296875,30.00726171875],[121.55181884765625,30.00726171875],[121.55181884765625,30.00451513671875],[121.5545654296875,30.00726171875],[121.5545654296875,30.00451513671875],[121.5545654296875,30.01000830078125],[121.5545654296875,30.0127548828125],[121.5545654296875,30.01550146484375],[121.5545654296875,30.018248046875],[121.55181884765625,30.02099462890625],[121.55181884765625,30.02648779296875],[121.55181884765625,30.029234375],[121.54632568359375,30.0347275390625],[121.5380859375,30.062193359375],[121.52984619140625,30.0731796875],[121.527099609375,30.07592626953125],[121.527099609375,30.0786728515625],[121.5216064453125,30.084166015625],[121.5216064453125,30.0896591796875],[121.51885986328125,30.09240576171875],[121.51885986328125,30.09789892578125],[121.51611328125,30.1006455078125],[121.51336669921875,30.106138671875],[121.5106201171875,30.10888525390625],[121.505126953125,30.11987158203125],[121.50238037109375,30.1226181640625],[121.4996337890625,30.12536474609375],[121.49688720703125,30.13085791015625],[121.494140625,30.1336044921875],[121.49139404296875,30.13909765625],[121.48590087890625,30.14733740234375],[121.48590087890625,30.15283056640625],[121.483154296875,30.1555771484375],[121.48040771484375,30.1610703125],[121.4776611328125,30.16381689453125],[121.47491455078125,30.1665634765625],[121.46392822265625,30.1775498046875],[121.461181640625,30.18029638671875],[121.45843505859375,30.18304296875],[121.45294189453125,30.1885361328125],[121.4501953125,30.19128271484375],[121.44744873046875,30.194029296875],[121.4447021484375,30.19677587890625],[121.44195556640625,30.1995224609375],[121.439208984375,30.1995224609375],[121.43646240234375,30.20226904296875],[121.42547607421875,30.2105087890625],[121.4227294921875,30.2105087890625],[121.41448974609375,30.216001953125],[121.40625,30.21874853515625],[121.395263671875,30.22424169921875],[121.3897705078125,30.22698828125],[121.3787841796875,30.22973486328125],[121.3677978515625,30.23522802734375],[121.36505126953125,30.237974609375],[121.3623046875,30.237974609375],[121.3568115234375,30.24072119140625],[121.351318359375,30.24072119140625],[121.3458251953125,30.24072119140625],[121.3458251953125,30.2434677734375],[121.34307861328125,30.2434677734375],[121.33758544921875,30.2434677734375],[121.33209228515625,30.2434677734375],[121.329345703125,30.2434677734375],[121.32659912109375,30.24621435546875],[121.32110595703125,30.24621435546875],[121.31561279296875,30.24621435546875],[121.3128662109375,30.24621435546875],[121.31011962890625,30.2489609375],[121.307373046875,30.2489609375],[121.3018798828125,30.2489609375],[121.29913330078125,30.2489609375],[121.29638671875,30.2489609375],[121.2908935546875,30.2489609375],[121.285400390625,30.25170751953125],[121.27716064453125,30.25170751953125],[121.27166748046875,30.25170751953125],[121.2689208984375,30.25170751953125],[121.263427734375,30.25170751953125],[121.26068115234375,30.25170751953125],[121.25518798828125,30.25170751953125],[121.25244140625,30.25170751953125],[121.24969482421875,30.25170751953125],[121.24420166015625,30.25170751953125],[121.241455078125,30.25170751953125],[121.23321533203125,30.25170751953125],[121.23046875,30.25170751953125],[121.22772216796875,30.25170751953125],[121.2249755859375,30.25170751953125],[121.22222900390625,30.25170751953125],[121.21673583984375,30.25170751953125],[121.21124267578125,30.25170751953125],[121.20025634765625,30.25170751953125],[121.19476318359375,30.25170751953125],[121.1865234375,30.25170751953125],[121.1810302734375,30.25170751953125],[121.17828369140625,30.25170751953125],[121.17279052734375,30.25170751953125],[121.1700439453125,30.25170751953125],[121.16455078125,30.25170751953125],[121.16180419921875,30.2489609375],[121.1590576171875,30.2489609375],[121.153564453125,30.24621435546875],[121.15081787109375,30.24621435546875],[121.14532470703125,30.2434677734375],[121.142578125,30.24072119140625],[121.1370849609375,30.24072119140625],[121.13433837890625,30.237974609375],[121.131591796875,30.237974609375],[121.131591796875,30.23522802734375],[121.12884521484375,30.23522802734375],[121.12335205078125,30.2324814453125],[121.12060546875,30.2324814453125]]]},"properties":{"type":"FreePolygon","style":{"fill":{"fillColor":"rgba(255,255,0,0.4)","opacity":0.4},"stroke":{"strokeColor":"rgba(255,255,0,1)","strokeWidth":2,"strokeLineDash":null},"image":{"type":"","image":{"fill":{"fillColor":"rgba(255,204,51,1)"},"points":null,"radius":7,"angle":0,"stroke":null,"rotateWithView":false,"snapToPixel":true}},"text":null},"points":[[121.0986328125,30.19677587890625],[121.0931396484375,30.19677587890625],[121.09039306640625,30.19677587890625],[121.08489990234375,30.19677587890625],[121.0821533203125,30.194029296875],[121.07666015625,30.19128271484375],[121.07391357421875,30.1885361328125],[121.05194091796875,30.18029638671875],[121.043701171875,30.1775498046875],[121.043701171875,30.17480322265625],[121.03546142578125,30.172056640625],[121.03546142578125,30.16931005859375],[121.02996826171875,30.16931005859375],[121.0272216796875,30.1665634765625],[121.02447509765625,30.16381689453125],[121.021728515625,30.1610703125],[121.01898193359375,30.15832373046875],[121.0162353515625,30.1555771484375],[121.01348876953125,30.15283056640625],[121.0107421875,30.150083984375],[121.00799560546875,30.14733740234375],[121.00250244140625,30.1445908203125],[120.999755859375,30.1445908203125],[120.99700927734375,30.13635107421875],[120.9942626953125,30.1336044921875],[120.98876953125,30.13085791015625],[120.98602294921875,30.128111328125],[120.9832763671875,30.12536474609375],[120.9832763671875,30.1226181640625],[120.98052978515625,30.11987158203125],[120.977783203125,30.11987158203125],[120.977783203125,30.117125],[120.97503662109375,30.11437841796875],[120.9722900390625,30.1116318359375],[120.96954345703125,30.10888525390625],[120.966796875,30.106138671875],[120.966796875,30.10339208984375],[120.96405029296875,30.10339208984375],[120.96405029296875,30.1006455078125],[120.9613037109375,30.09789892578125],[120.95855712890625,30.09515234375],[120.955810546875,30.0896591796875],[120.95306396484375,30.0896591796875],[120.9503173828125,30.084166015625],[120.9503173828125,30.08141943359375],[120.94757080078125,30.0786728515625],[120.94482421875,30.07592626953125],[120.94207763671875,30.0731796875],[120.9393310546875,30.07043310546875],[120.93658447265625,30.07043310546875],[120.93109130859375,30.062193359375],[120.9283447265625,30.062193359375],[120.9228515625,30.0567001953125],[120.9173583984375,30.05395361328125],[120.91461181640625,30.05395361328125],[120.91461181640625,30.05120703125],[120.911865234375,30.05120703125],[120.90911865234375,30.04846044921875],[120.90911865234375,30.0457138671875],[120.9063720703125,30.04296728515625],[120.90362548828125,30.040220703125],[120.90087890625,30.03747412109375],[120.90087890625,30.029234375],[120.90087890625,30.02648779296875],[120.8953857421875,30.02099462890625],[120.8953857421875,30.018248046875],[120.8953857421875,30.01550146484375],[120.8953857421875,30.0127548828125],[120.89263916015625,30.01000830078125],[120.89263916015625,30.00451513671875],[120.89263916015625,30.0017685546875],[120.89263916015625,29.99902197265625],[120.889892578125,29.996275390625],[120.88714599609375,29.99352880859375],[120.88714599609375,29.9907822265625],[120.88714599609375,29.9852890625],[120.88714599609375,29.98254248046875],[120.8843994140625,29.9797958984375],[120.8843994140625,29.97155615234375],[120.87890625,29.9578232421875],[120.8734130859375,29.91937109375],[120.867919921875,29.90563818359375],[120.867919921875,29.9028916015625],[120.867919921875,29.90014501953125],[120.867919921875,29.8973984375],[120.867919921875,29.89465185546875],[120.867919921875,29.8919052734375],[120.867919921875,29.88915869140625],[120.867919921875,29.886412109375],[120.867919921875,29.88366552734375],[120.867919921875,29.8809189453125],[120.87066650390625,29.87817236328125],[120.87066650390625,29.87542578125],[120.87066650390625,29.8699326171875],[120.87066650390625,29.86718603515625],[120.8734130859375,29.864439453125],[120.8734130859375,29.86169287109375],[120.8734130859375,29.8589462890625],[120.8734130859375,29.85619970703125],[120.8734130859375,29.853453125],[120.8734130859375,29.85070654296875],[120.8734130859375,29.8479599609375],[120.8734130859375,29.8369736328125],[120.86517333984375,29.82324072265625],[120.86517333984375,29.8095078125],[120.85693359375,29.78753515625],[120.85418701171875,29.77929541015625],[120.84869384765625,29.75732275390625],[120.84869384765625,29.754576171875],[120.84869384765625,29.75182958984375],[120.84869384765625,29.7490830078125],[120.84869384765625,29.74633642578125],[120.845947265625,29.74633642578125],[120.845947265625,29.74358984375],[120.845947265625,29.74084326171875],[120.845947265625,29.7380966796875],[120.845947265625,29.73535009765625],[120.845947265625,29.72985693359375],[120.84869384765625,29.72436376953125],[120.84869384765625,29.71887060546875],[120.84869384765625,29.70239111328125],[120.84869384765625,29.6941513671875],[120.8514404296875,29.688658203125],[120.8514404296875,29.67492529296875],[120.85418701171875,29.66943212890625],[120.85418701171875,29.666685546875],[120.85693359375,29.66393896484375],[120.85693359375,29.6611923828125],[120.85693359375,29.65844580078125],[120.85693359375,29.65569921875],[120.85968017578125,29.65295263671875],[120.85968017578125,29.6502060546875],[120.8624267578125,29.64745947265625],[120.86517333984375,29.644712890625],[120.86517333984375,29.64196630859375],[120.867919921875,29.6392197265625],[120.87066650390625,29.6392197265625],[120.87066650390625,29.63647314453125],[120.87615966796875,29.63097998046875],[120.87890625,29.6282333984375],[120.87890625,29.62548681640625],[120.88165283203125,29.622740234375],[120.8843994140625,29.61999365234375],[120.8843994140625,29.6172470703125],[120.88714599609375,29.61450048828125],[120.88714599609375,29.61175390625],[120.889892578125,29.60900732421875],[120.8953857421875,29.60351416015625],[120.8953857421875,29.600767578125],[120.89813232421875,29.600767578125],[120.89813232421875,29.59802099609375],[120.90087890625,29.5952744140625],[120.90087890625,29.59252783203125],[120.90362548828125,29.58978125],[120.9063720703125,29.5842880859375],[120.90911865234375,29.578794921875],[120.911865234375,29.57604833984375],[120.91461181640625,29.5733017578125],[120.91461181640625,29.56780859375],[120.92010498046875,29.5623154296875],[120.92010498046875,29.55956884765625],[120.9228515625,29.556822265625],[120.92559814453125,29.55407568359375],[120.9283447265625,29.54858251953125],[120.93109130859375,29.54858251953125],[120.93109130859375,29.5458359375],[120.933837890625,29.54308935546875],[120.933837890625,29.5403427734375],[120.93658447265625,29.5403427734375],[120.9393310546875,29.5403427734375],[120.94207763671875,29.53759619140625],[120.94482421875,29.534849609375],[120.94757080078125,29.53210302734375],[120.95306396484375,29.53210302734375],[120.955810546875,29.5293564453125],[120.95855712890625,29.52660986328125],[120.9613037109375,29.52660986328125],[120.96405029296875,29.52386328125],[120.96405029296875,29.52111669921875],[120.966796875,29.52111669921875],[120.96954345703125,29.5183701171875],[120.9722900390625,29.5183701171875],[120.9722900390625,29.51562353515625],[120.977783203125,29.51562353515625],[120.977783203125,29.512876953125],[120.98052978515625,29.512876953125],[120.98602294921875,29.51013037109375],[120.98876953125,29.5073837890625],[120.9942626953125,29.5073837890625],[120.9942626953125,29.50463720703125],[120.999755859375,29.501890625],[121.0052490234375,29.49914404296875],[121.00799560546875,29.49914404296875],[121.0107421875,29.49914404296875],[121.01348876953125,29.4963974609375],[121.0162353515625,29.4963974609375],[121.021728515625,29.4963974609375],[121.02996826171875,29.490904296875],[121.03546142578125,29.4854111328125],[121.0382080078125,29.4854111328125],[121.04095458984375,29.4854111328125],[121.043701171875,29.4854111328125],[121.04644775390625,29.48266455078125],[121.0491943359375,29.48266455078125],[121.05194091796875,29.48266455078125],[121.0546875,29.48266455078125],[121.05743408203125,29.48266455078125],[121.0601806640625,29.48266455078125],[121.06292724609375,29.48266455078125],[121.06842041015625,29.48266455078125],[121.0711669921875,29.48266455078125],[121.07666015625,29.48266455078125],[121.07940673828125,29.48266455078125],[121.08489990234375,29.48266455078125],[121.09039306640625,29.48266455078125],[121.0931396484375,29.48266455078125],[121.1041259765625,29.48266455078125],[121.109619140625,29.48266455078125],[121.1151123046875,29.48266455078125],[121.12884521484375,29.48266455078125],[121.13433837890625,29.48266455078125],[121.142578125,29.48266455078125],[121.14532470703125,29.48266455078125],[121.15631103515625,29.48266455078125],[121.16180419921875,29.48266455078125],[121.16455078125,29.48266455078125],[121.16729736328125,29.48266455078125],[121.1700439453125,29.48266455078125],[121.17279052734375,29.48266455078125],[121.175537109375,29.48266455078125],[121.17828369140625,29.48266455078125],[121.18377685546875,29.48266455078125],[121.1865234375,29.48266455078125],[121.1920166015625,29.48266455078125],[121.19476318359375,29.48266455078125],[121.20025634765625,29.48266455078125],[121.2030029296875,29.48266455078125],[121.20849609375,29.48266455078125],[121.21124267578125,29.48266455078125],[121.21673583984375,29.48266455078125],[121.2249755859375,29.48266455078125],[121.22772216796875,29.48266455078125],[121.23870849609375,29.48266455078125],[121.241455078125,29.48266455078125],[121.24420166015625,29.48266455078125],[121.24969482421875,29.48266455078125],[121.25244140625,29.48266455078125],[121.26068115234375,29.4854111328125],[121.263427734375,29.4854111328125],[121.2689208984375,29.48815771484375],[121.27166748046875,29.48815771484375],[121.27716064453125,29.48815771484375],[121.285400390625,29.490904296875],[121.28814697265625,29.490904296875],[121.29364013671875,29.49365087890625],[121.29638671875,29.49365087890625],[121.29913330078125,29.49365087890625],[121.3018798828125,29.49365087890625],[121.30462646484375,29.49365087890625],[121.307373046875,29.49365087890625],[121.31011962890625,29.49365087890625],[121.318359375,29.49365087890625],[121.32110595703125,29.4963974609375],[121.32659912109375,29.4963974609375],[121.33209228515625,29.49914404296875],[121.3348388671875,29.49914404296875],[121.33758544921875,29.49914404296875],[121.3458251953125,29.501890625],[121.35406494140625,29.501890625],[121.3568115234375,29.501890625],[121.3623046875,29.501890625],[121.3677978515625,29.501890625],[121.37054443359375,29.50463720703125],[121.37603759765625,29.50463720703125],[121.38153076171875,29.5073837890625],[121.38702392578125,29.51013037109375],[121.39251708984375,29.51013037109375],[121.395263671875,29.512876953125],[121.40350341796875,29.512876953125],[121.40899658203125,29.5183701171875],[121.41448974609375,29.52111669921875],[121.417236328125,29.52111669921875],[121.41998291015625,29.52386328125],[121.4227294921875,29.52386328125],[121.42547607421875,29.52660986328125],[121.42822265625,29.5293564453125],[121.43096923828125,29.5293564453125],[121.4337158203125,29.53210302734375],[121.43646240234375,29.534849609375],[121.43646240234375,29.53759619140625],[121.4447021484375,29.54308935546875],[121.44744873046875,29.54308935546875],[121.45294189453125,29.54858251953125],[121.45843505859375,29.55407568359375],[121.461181640625,29.55407568359375],[121.46392822265625,29.556822265625],[121.4666748046875,29.55956884765625],[121.46942138671875,29.5623154296875],[121.47491455078125,29.56780859375],[121.4776611328125,29.57055517578125],[121.48040771484375,29.5733017578125],[121.48040771484375,29.57604833984375],[121.483154296875,29.578794921875],[121.48590087890625,29.58154150390625],[121.494140625,29.5952744140625],[121.49688720703125,29.59802099609375],[121.4996337890625,29.60351416015625],[121.50238037109375,29.60900732421875],[121.50238037109375,29.61175390625],[121.505126953125,29.6172470703125],[121.505126953125,29.61999365234375],[121.50787353515625,29.622740234375],[121.50787353515625,29.6282333984375],[121.50787353515625,29.6337265625],[121.5106201171875,29.63647314453125],[121.51336669921875,29.6392197265625],[121.51611328125,29.644712890625],[121.51885986328125,29.65295263671875],[121.51885986328125,29.65569921875],[121.5216064453125,29.6611923828125],[121.52435302734375,29.666685546875],[121.527099609375,29.6721787109375],[121.527099609375,29.67492529296875],[121.52984619140625,29.677671875],[121.52984619140625,29.6831650390625],[121.52984619140625,29.68591162109375],[121.52984619140625,29.69140478515625],[121.5325927734375,29.69964453125],[121.53533935546875,29.70788427734375],[121.5380859375,29.710630859375],[121.5380859375,29.7216171875],[121.54083251953125,29.72985693359375],[121.5435791015625,29.7380966796875],[121.54632568359375,29.74633642578125],[121.549072265625,29.754576171875],[121.549072265625,29.75732275390625],[121.5545654296875,29.76830908203125],[121.5545654296875,29.7710556640625],[121.5545654296875,29.77380224609375],[121.5545654296875,29.77929541015625],[121.5545654296875,29.7820419921875],[121.55731201171875,29.78753515625],[121.55731201171875,29.79577490234375],[121.55731201171875,29.80126806640625],[121.56005859375,29.80676123046875],[121.56280517578125,29.82324072265625],[121.5655517578125,29.83422705078125],[121.5655517578125,29.84521337890625],[121.5655517578125,29.85070654296875],[121.5655517578125,29.85619970703125],[121.5655517578125,29.86169287109375],[121.5655517578125,29.864439453125],[121.56829833984375,29.86718603515625],[121.56829833984375,29.8699326171875],[121.56829833984375,29.87267919921875],[121.56829833984375,29.87542578125],[121.56829833984375,29.87817236328125],[121.56829833984375,29.8809189453125],[121.56829833984375,29.88366552734375],[121.56829833984375,29.88915869140625],[121.56829833984375,29.8919052734375],[121.56829833984375,29.8973984375],[121.56829833984375,29.90014501953125],[121.56829833984375,29.9028916015625],[121.56829833984375,29.90563818359375],[121.56829833984375,29.908384765625],[121.56829833984375,29.91113134765625],[121.56829833984375,29.9138779296875],[121.56829833984375,29.91662451171875],[121.56829833984375,29.91937109375],[121.56829833984375,29.92211767578125],[121.56829833984375,29.9248642578125],[121.56829833984375,29.930357421875],[121.56829833984375,29.93859716796875],[121.56829833984375,29.94134375],[121.56829833984375,29.94958349609375],[121.56829833984375,29.95507666015625],[121.56829833984375,29.9578232421875],[121.56829833984375,29.96056982421875],[121.56829833984375,29.96606298828125],[121.56829833984375,29.97155615234375],[121.56829833984375,29.974302734375],[121.5655517578125,29.9797958984375],[121.5655517578125,29.98254248046875],[121.56280517578125,29.98803564453125],[121.56280517578125,29.9907822265625],[121.56005859375,29.99352880859375],[121.56005859375,29.996275390625],[121.56005859375,29.99902197265625],[121.55731201171875,29.99902197265625],[121.55731201171875,30.0017685546875],[121.5545654296875,30.00451513671875],[121.5545654296875,30.00726171875],[121.55181884765625,30.00726171875],[121.55181884765625,30.00451513671875],[121.5545654296875,30.00726171875],[121.5545654296875,30.00451513671875],[121.5545654296875,30.01000830078125],[121.5545654296875,30.0127548828125],[121.5545654296875,30.01550146484375],[121.5545654296875,30.018248046875],[121.55181884765625,30.02099462890625],[121.55181884765625,30.02648779296875],[121.55181884765625,30.029234375],[121.54632568359375,30.0347275390625],[121.5380859375,30.062193359375],[121.52984619140625,30.0731796875],[121.527099609375,30.07592626953125],[121.527099609375,30.0786728515625],[121.5216064453125,30.084166015625],[121.5216064453125,30.0896591796875],[121.51885986328125,30.09240576171875],[121.51885986328125,30.09789892578125],[121.51611328125,30.1006455078125],[121.51336669921875,30.106138671875],[121.5106201171875,30.10888525390625],[121.505126953125,30.11987158203125],[121.50238037109375,30.1226181640625],[121.4996337890625,30.12536474609375],[121.49688720703125,30.13085791015625],[121.494140625,30.1336044921875],[121.49139404296875,30.13909765625],[121.48590087890625,30.14733740234375],[121.48590087890625,30.15283056640625],[121.483154296875,30.1555771484375],[121.48040771484375,30.1610703125],[121.4776611328125,30.16381689453125],[121.47491455078125,30.1665634765625],[121.46392822265625,30.1775498046875],[121.461181640625,30.18029638671875],[121.45843505859375,30.18304296875],[121.45294189453125,30.1885361328125],[121.4501953125,30.19128271484375],[121.44744873046875,30.194029296875],[121.4447021484375,30.19677587890625],[121.44195556640625,30.1995224609375],[121.439208984375,30.1995224609375],[121.43646240234375,30.20226904296875],[121.42547607421875,30.2105087890625],[121.4227294921875,30.2105087890625],[121.41448974609375,30.216001953125],[121.40625,30.21874853515625],[121.395263671875,30.22424169921875],[121.3897705078125,30.22698828125],[121.3787841796875,30.22973486328125],[121.3677978515625,30.23522802734375],[121.36505126953125,30.237974609375],[121.3623046875,30.237974609375],[121.3568115234375,30.24072119140625],[121.351318359375,30.24072119140625],[121.3458251953125,30.24072119140625],[121.3458251953125,30.2434677734375],[121.34307861328125,30.2434677734375],[121.33758544921875,30.2434677734375],[121.33209228515625,30.2434677734375],[121.329345703125,30.2434677734375],[121.32659912109375,30.24621435546875],[121.32110595703125,30.24621435546875],[121.31561279296875,30.24621435546875],[121.3128662109375,30.24621435546875],[121.31011962890625,30.2489609375],[121.307373046875,30.2489609375],[121.3018798828125,30.2489609375],[121.29913330078125,30.2489609375],[121.29638671875,30.2489609375],[121.2908935546875,30.2489609375],[121.285400390625,30.25170751953125],[121.27716064453125,30.25170751953125],[121.27166748046875,30.25170751953125],[121.2689208984375,30.25170751953125],[121.263427734375,30.25170751953125],[121.26068115234375,30.25170751953125],[121.25518798828125,30.25170751953125],[121.25244140625,30.25170751953125],[121.24969482421875,30.25170751953125],[121.24420166015625,30.25170751953125],[121.241455078125,30.25170751953125],[121.23321533203125,30.25170751953125],[121.23046875,30.25170751953125],[121.22772216796875,30.25170751953125],[121.2249755859375,30.25170751953125],[121.22222900390625,30.25170751953125],[121.21673583984375,30.25170751953125],[121.21124267578125,30.25170751953125],[121.20025634765625,30.25170751953125],[121.19476318359375,30.25170751953125],[121.1865234375,30.25170751953125],[121.1810302734375,30.25170751953125],[121.17828369140625,30.25170751953125],[121.17279052734375,30.25170751953125],[121.1700439453125,30.25170751953125],[121.16455078125,30.25170751953125],[121.16180419921875,30.2489609375],[121.1590576171875,30.2489609375],[121.153564453125,30.24621435546875],[121.15081787109375,30.24621435546875],[121.14532470703125,30.2434677734375],[121.142578125,30.24072119140625],[121.1370849609375,30.24072119140625],[121.13433837890625,30.237974609375],[121.131591796875,30.237974609375],[121.131591796875,30.23522802734375],[121.12884521484375,30.23522802734375],[121.12335205078125,30.2324814453125],[121.12060546875,30.2324814453125]]}}];
	var plot = new olPlot(map.getOLMap(), {
		zoomToExtent: true
	});
	plot.plotUtils.addFeatures(features);
}

/**
 * 清空影响范围，箭标
 */
function clearPlot(){
	var plot = new olPlot(map.getOLMap(), {
		zoomToExtent: true
	});
	plot.plotUtils.removeAllFeatures();
}

/**
 * 闪烁线测试
 */
function testFlashLine(){
    
    var data = [{
           //--点坐标
           points: [[120.834725,29.931203],[120.834044,29.929421],[120.833884,29.928901],[120.833764,29.928511],[120.833734,29.928311],[120.833623,29.92757],[120.833603,29.92745],[120.833513,29.92651],[120.833523,29.92583],[120.833523,29.92573],[120.833624,29.92499],[120.833664,29.92467],[120.833824,29.924051],[120.833904,29.923651],[120.834055,29.922971],[120.834135,29.922601],[120.834315,29.921792],[120.834356,29.921662],[120.834375,29.921592],[120.834516,29.921112],[120.834646,29.920663],[120.834837,29.919423],[120.834857,29.919233],[120.834857,29.919193],[120.834867,29.918993],[120.834857,29.918663],[120.834817,29.918233],[120.834727,29.917623],[120.834657,29.917113],[120.834597,29.916803],[120.834566,29.916663],[120.834456,29.916323],[120.834416,29.916212],[120.834396,29.916152],[120.834346,29.915982],[120.834206,29.915582],[120.833906,29.914572],[120.833705,29.913881],[120.833625,29.913571],[120.833465,29.913021],[120.833335,29.912581],[120.833294,29.912441],[120.833224,29.912181],[120.833034,29.91149],[120.833034,29.91147],[120.832683,29.91006],[120.832603,29.90975],[120.832433,29.909119],[120.832403,29.908999],[120.832343,29.908759],[120.832173,29.908069],[120.832052,29.907609],[120.832032,29.907519],[120.831672,29.906068],[120.831612,29.905838],[120.831521,29.905458],[120.831431,29.905108],[120.831411,29.905018],[120.831351,29.904778],[120.831221,29.904277],[120.831091,29.903747],[120.83089,29.902967],[120.83071,29.902257],[120.8307,29.902117],[120.83064,29.901696],[120.83063,29.901616],[120.8306,29.900866],[120.83059,29.900676],[120.8306,29.900606],[120.83063,29.900336],[120.83069,29.900137],[120.83082,29.899717],[120.83083,29.899667],[120.831021,29.899027],[120.831081,29.898857],[120.831422,29.897958],[120.831492,29.897718],[120.831592,29.897408],[120.831632,29.897278],[120.831682,29.897139],[120.831883,29.896599],[120.831933,29.896449],[120.832534,29.89458],[120.833266,29.892392],[120.833326,29.892242],[120.833807,29.891053],[120.834389,29.889764],[120.835,29.888445],[120.83508,29.888205],[120.8352,29.887835],[120.835381,29.887106],[120.835391,29.887046],[120.835521,29.886496],[120.835531,29.886256],[120.835591,29.885796],[120.835612,29.885346],[120.835481,29.883666],[120.835371,29.882706],[120.835311,29.881876],[120.835341,29.880996],[120.835401,29.880566],[120.835472,29.880186],[120.835642,29.879457],[120.836033,29.878437],[120.836444,29.877578],[120.838037,29.874601],[120.838177,29.874251],[120.838548,29.873462],[120.838758,29.872962],[120.838909,29.872663],[120.83938,29.871624],[120.839931,29.870455],[120.839941,29.870425],[120.839991,29.870325],[120.840021,29.870255],[120.840051,29.870215],[120.840091,29.870135],[120.840272,29.869755],[120.840512,29.869176],[120.840703,29.868746],[120.841123,29.867877],[120.841374,29.867347],[120.841655,29.866778],[120.841905,29.866259],[120.842136,29.865799],[120.842296,29.865349],[120.842546,29.86422],[120.842567,29.86415],[120.842647,29.86359],[120.842667,29.86342],[120.842667,29.86316],[120.842707,29.86276],[120.842707,29.86261],[120.842627,29.86181],[120.842527,29.86111],[120.842486,29.86091],[120.842356,29.86057],[120.842206,29.86006],[120.842036,29.85957],[120.841885,29.859189],[120.841745,29.858849],[120.841435,29.858119],[120.841204,29.857678],[120.840783,29.856937],[120.840723,29.856847],[120.840403,29.856287],[120.840072,29.855776],[120.840062,29.855756],[120.839752,29.855196],[120.839451,29.854725],[120.83899,29.853854],[120.83894,29.853744],[120.83876,29.853314],[120.83865,29.853034],[120.838569,29.852744],[120.838459,29.852354],[120.838409,29.852044],[120.838399,29.851904],[120.838359,29.851404],[120.838369,29.851134],[120.83844,29.850434],[120.8386,29.849814],[120.83876,29.849354],[120.838991,29.848865],[120.840053,29.846707],[120.840855,29.845278],[120.842077,29.843071],[120.842899,29.841602],[120.84329,29.840883],[120.843921,29.839774],[120.845074,29.837636],[120.845565,29.836617],[120.845825,29.835918],[120.845895,29.835748],[120.846006,29.835288],[120.846086,29.834908],[120.846226,29.834159],[120.846276,29.833729],[120.846276,29.833689],[120.846276,29.833649],[120.846276,29.833529],[120.846286,29.833329],[120.846286,29.833069],[120.846286,29.832339],[120.846277,29.832209],[120.846257,29.829379],[120.846267,29.828619],[120.846267,29.827919],[120.846267,29.827359],[120.846277,29.827149],[120.846277,29.827109],[120.846307,29.826599],[120.846307,29.826519],[120.846387,29.825889],[120.846397,29.825809],[120.846457,29.825569],[120.846587,29.82496],[120.846607,29.82488],[120.846637,29.82478],[120.846828,29.82414],[120.846858,29.82405],[120.847178,29.822931],[120.847208,29.822781],[120.847228,29.822691],[120.847248,29.822611],[120.847308,29.822371],[120.847399,29.821721],[120.847449,29.821251],[120.847449,29.821161],[120.847479,29.820821],[120.847489,29.820651],[120.847489,29.820511],[120.847529,29.819632],[120.847549,29.819372],[120.847569,29.818922],[120.847569,29.818832],[120.84761,29.818122],[120.84761,29.817922],[120.84764,29.817592],[120.84773,29.816453],[120.847811,29.815923],[120.84785,29.815693],[120.847991,29.815003],[120.848001,29.814954],[120.848111,29.814484],[120.848181,29.814184],[120.848472,29.812715],[120.848552,29.812355],[120.848653,29.811885],[120.848703,29.811655],[120.848843,29.810936],[120.848893,29.810716],[120.849144,29.809576],[120.849174,29.809406],[120.849204,29.809266],[120.849394,29.808297],[120.849424,29.808077],[120.849464,29.807717],[120.849484,29.807467],[120.849524,29.807147],[120.849554,29.806897],[120.849714,29.805367],[120.849734,29.805137],[120.849764,29.804387],[120.849774,29.803647],[120.849785,29.802787],[120.849774,29.802547],[120.849764,29.802187],[120.849724,29.801247],[120.849664,29.800267],[120.849524,29.798837],[120.849504,29.798657],[120.849374,29.797817],[120.849234,29.797017],[120.849094,29.796227],[120.848993,29.795676],[120.848853,29.794936],[120.848713,29.794146],[120.848563,29.793386],[120.848393,29.792526],[120.848393,29.792496],[120.848073,29.790846],[120.848003,29.790576],[120.847942,29.790306],[120.847902,29.790166],[120.847832,29.789985],[120.847812,29.789925],[120.847602,29.789515],[120.847362,29.789045],[120.847322,29.788955],[120.846731,29.787754],[120.846461,29.787394],[120.846421,29.787224],[120.84638,29.787064],[120.84627,29.786713],[120.84602,29.785863],[120.84582,29.785183],[120.845599,29.784402],[120.845519,29.784142],[120.845319,29.783492],[120.845128,29.782782],[120.845058,29.782572],[120.845038,29.782482],[120.844838,29.781822],[120.844677,29.781161],[120.844597,29.780731],[120.844587,29.779911],[120.844678,29.779482],[120.844748,29.779212],[120.844828,29.778952],[120.845319,29.777503],[120.845519,29.776843],[120.84571,29.776364],[120.84615,29.775075],[120.846271,29.774725],[120.846411,29.774305],[120.846611,29.773695],[120.847242,29.771827],[120.847423,29.771267],[120.847463,29.771177],[120.847653,29.770567],[120.847853,29.770048],[120.847913,29.769838],[120.847983,29.769598],[120.848014,29.769478],[120.848024,29.769438],[120.848034,29.769298],[120.848054,29.769178],[120.848074,29.768988],[120.848084,29.768788],[120.848074,29.768488],[120.848014,29.768218],[120.847974,29.768028],[120.847633,29.767038],[120.847563,29.766848],[120.847413,29.766447],[120.847232,29.765947],[120.847062,29.765547],[120.846922,29.765187],[120.846621,29.764367],[120.846391,29.763786],[120.84609,29.762996],[120.84605,29.762896],[120.84558,29.761655],[120.845519,29.761515],[120.845159,29.760575],[120.844728,29.759464],[120.844638,29.759194],[120.844378,29.758444],[120.843987,29.757493],[120.843847,29.757123],[120.843476,29.756142],[120.843105,29.755142],[120.843065,29.754992],[120.843055,29.754952],[120.842985,29.754722],[120.842955,29.754642],[120.842925,29.754462]],
           //--定义对象属性
           attributes:{
               //基本对象属性【id属性必须】
               id:"line_002",name:"line_002",//等其他属性
               
               //可根据具体情况配置属性
               //--信息框设置
               infoWindowWidth:"19vw",
               //infoWindowContent:"<table><tr><td>测试线2</td></tr></table>",
               infoWindowCallBack:function(map,coordinate,feature){
				   nowLon = coordinate[0];
				   nowLat = coordinate[1];
				   luxian_teshu();
			   }
           },
           
           //定义样式:第一个默认样式，第二个是高亮样式（mouseover）
           style: ['line_red','line_yellow']
        }               
    ];          
    
    addLines("line_vectorLayer",true,data);
    var vLayer= map.getLayer("line_vectorLayer");
    var feature= map.getLayerFeature(vLayer,"id","line_002");
    heightLight(feature,vLayer,'line_red','line_yellow');
}
/**
 * 线闪烁(简单效果)
 */
function heightLight(feature,vLayer,stylename1,stylename2){
		var a = 0;
		heigthligthTime = setInterval(function() {
			if (a) {
				feature.setStyle(this.getSymbolStyle(stylename1));
				//vLayer.setVisible(true);
				a = 0;
			} else {
				feature.setStyle(this.getSymbolStyle(stylename2));
				//vLayer.setVisible(false);
				a = 1;
			}
		}, 500);
}

/**
 * 导出地图
 */
function exportMap(){
	map.getOLMap().once('postcompose', function(event) {
        var canvas = event.context.canvas;
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(canvas.msToBlob(), 'map.gif');
        } else {
          canvas.toBlob(function(blob) {
            saveAs(blob, 'map.gif');
          });
        }
      });
    map.getOLMap().renderSync();
}
/**
 * 绘制长方形 
 */
function drawRectangle() {
			//设置maxPoints及geometryFunction
            var maxPoints, geometryFunction;
            maxPoints = 2;
            geometryFunction = function (coordinates, geometry) {
                if (!geometry) {                    
                    geometry = new ol.geom.Polygon();
                }
                //设置起始点及终止点
                var start = coordinates[0];
                var end = coordinates[1];
                geometry.setCoordinates([
                    [start, [start[0], end[1]], end, [end[0], start[1]], start]     //特别注意，长方形终止点与起始点重合
                ]);
                return geometry;
            };
            //新建source和layer
            var source = new ol.source.Vector({
                wrapX: false,
            });
            var layer = new ol.layer.Vector({
                source: source
            });
            //新建绘制长方形interaction
            var drawRectangle = new ol.interaction.Draw({
                source: source,
                type: "LineString",
                geometryFunction: geometryFunction,
                maxPoints: maxPoints
            });
		   drawRectangle.on('drawstart',function(evt){
				map.removeLayer("pointlayer");
		   });
           drawRectangle.on('drawend',function(evt){
        	   var extent = null;
   				if(evt.feature){
   					  extent = evt.feature.getGeometry().getExtent();
	   				  var minx=extent[0];
	   				  var miny=extent[1];
	   				  var maxx=extent[2];
	   				  var maxy=extent[3];
	   				  //alert(minx+","+miny+","+maxx+","+maxy); 
   				}
   				map.getOLMap().removeInteraction(drawRectangle);
   				drawRectangle = null;
   				source.removeFeature(evt.feature);
           });
            //将layer和interaction添加到地图中
            map.getOLMap().addLayer(layer);
            map.getOLMap().addInteraction(drawRectangle);
}

/**
 * 动态查询并标注路线
 * @param queryUrl
 * @param params
 * @param layername
 * @param isclearlayer
 * @param linecolor
 * @param linewidth
 */
function queryDynamicSegment(queryUrl,params,layername,isclearlayer,linecolor,linewidth){
    $.ajax({
        url: queryUrl,
        headers: {
            'Content-Type':'application/json;charset=utf8'
        },
        contentType : 'application/json',
        dataType : 'json',
        data:JSON.stringify(params),
        type: "POST",
        success: function (data) {
            //alert(JSON.stringify(data));
            var line_wkt=data.data.geometry;
            renderGraphic(layername,isclearlayer,line_wkt,linecolor,linewidth);
        }
    })
}

function renderGraphic(layername,isclearlayer,line_wkt,linecolor,linewidth){
    var l = map.getLayer(layername);
    if(l == null){
        var layer_option = {
            name: layername
        };
        l = map.addVectorLayer(layer_option);
    }

    if (isclearlayer ==  true){
        map.clearVectorLayer(l);
    }

    var style_line = map.getLineStyle({color:linecolor,width:linewidth});
    var line = map.getGeometryFromWKT(line_wkt);
    var feature = map.createFeature(line,{},style_line);
    map.addLayerFeature(l,feature);
    //map.zoomToBufferFeature(feature,1.2);
}











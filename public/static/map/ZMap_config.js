var defaultConfig = gisConfig[gisConfig.isUsed];
// --全局样式
// var styleMap;
// var map;

// 主题1地图
function initTheme1Map(params, mapOptions, zoomChangeCallBack) {
	return createMap(params, mapOptions, zoomChangeCallBack, defaultConfig.theme1);
}

// 主题2地图
function initTheme2Map(params, mapOptions, zoomChangeCallBack) {
	return createMap(params, mapOptions, zoomChangeCallBack, defaultConfig.theme2);
}

/**
 * 默认初始化地图方法
 */
function initMap(params, mapOptions, zoomChangeCallBack) {
  return createMap(params, mapOptions, zoomChangeCallBack, defaultConfig);
}

/**
 * 初始化地图
 * @param {string} params 绘制地图的DOM元素id
 * @param {object} mapOptions 初始化地图中自定义的属性
 * @param {function} zoomChangeCallBack 地图缩放时的回调函数，默认会返回当前的地图缩放级别
 *
 * @return {object} 返回创建的地图实例
 */
function createMap(params, mapOptions, zoomChangeCallBack, config) {

  var mapExp;
  var mapUrl;
  var maptype = 'geoserver'; // 地图类型 默认geoserver
  var fullExtent = []; // 全图范围
  var resolutions = null; // 分辨率
  var origin = [-400.0, 400.0]; // 始点
  var initLayers = "BaseLayer"; // 始点
  var center = []; // 中心点
  var zoom = 0; // 当前级别
  var minZoom = 0; // 最小缩放级别
  var maxZoom = 0; // 最大缩放级别

  if (config.gisIp && config.initMapUrl) {
    mapUrl = config.gisIp + config.initMapUrl;
  }
  maptype = config.mapType ? config.mapType : maptype;
  fullExtent = config.fullExtent ? config.fullExtent : fullExtent;
  origin = config.origin ? config.origin : origin;
  center = config.mapCenter ? config.mapCenter : center;
  resolutions = config.resolutions ? config.resolutions : resolutions;
  zoom = config.initZoom ? config.initZoom : zoom;
  minZoom = config.minZoom ? config.minZoom : minZoom;
  maxZoom = config.maxZoom ? config.maxZoom : maxZoom;
  initLayers = config.initLayers ? config.initLayers : initLayers;

  var options = {
    target: params,
    baseLayers: [],
    projection: null,
    resolutions: resolutions,
    center: center, // 地图中心点
    minZoom: minZoom, // 最小缩放级别
    maxZoom: maxZoom, // 最大缩放级别
    zoom: zoom, // 当前缩放级别
    extent: fullExtent,
    scaleBarVisible: false, // 是否显示比例尺
    zoomBarVisible: false, // 是否显示缩放工具
    zoomBarPosition: [8, 8], // 导航条
    mousePositionVisible: false, // 拾取坐标
    // 地图缩放回调
    zoomChange: function() {
      if (typeof zoomChangeCallBack === "function") {
        zoomChangeCallBack(mapExp.getZoom());
      }
    },
    initComplete: function(cMap) {
      mapExp = cMap;

      // arcgis
      if (maptype == 'arcgis') {
        // 初始化底图
        var layerOption = {
          name: "BaseLayer",
          url: mapUrl,
          projection: ol.proj.get('EPSG:4326'),
          origin: origin,
          resolutions: resolutions,
          extent: fullExtent
        };
        var baseLayer = cMap.getArcgisTileLayer(layerOption);
        mapExp.getOLMap().addLayer(baseLayer);
      }
      // 超图
      else if (maptype == 'supermap') {
        var baseLayer = new ol.layer.Tile({
        	name: 'BaseLayer',
        	source: new ol.source.TileSuperMapRest({ // 超图需要引用的组件
        		wrapX: true,
        		url: mapUrl
        	})
        });
        mapExp.getOLMap().addLayer(baseLayer);
      }
      // geoserver
      else if (maptype == 'geoserver') {

        var wmtsSource = new ol.source.TileWMS({
          url: mapUrl,
          params: {
            version: '1.1.1',
            format: 'image/png',
            styles: '',
            tiled: true,
            layers: initLayers,
            format: 'image/png',
            tilesOrigin: origin[0] + "," + origin[1],
          }
        });

        var baseLayer = new ol.layer.Tile({
          opacity: 1,
          source: wmtsSource
        });
        mapExp.getOLMap().addLayer(baseLayer);
      }
      // 天地图
      else if (maptype == 'tianditu') {
        var VEC_W = new ol.layer.Tile({
            name: "VEC_W",
            groupKey: "TDT_VECTOR",
            source: new ol.source.XYZ({
                url: tianditu
            })
        });
        var CVA_W = new ol.layer.Tile({
            name: "CVA_W",
            groupKey: "TDT_VECTOR",
            source: new ol.source.XYZ({
                url: tiandituTxt
            })
        });
        mapExp.getOLMap().addLayer(VEC_W);
        mapExp.getOLMap().addLayer(CVA_W);
      }

      // 浙江
      else if (maptype == 'zhejiangDZ') {
        projection.setExtent([-180,-90,180,90]);
        var size = 360/ 256; //Extent.getWidth();
        var zjresolutions = new Array(20);
        var matrixIds = new Array(20);

        for (var z = 0; z < 20; ++z) {
        	// generate resolutions and matrixIds arrays for this WMTS
        	zjresolutions[z] = size / Math.pow(2, z);
        	matrixIds[z] = z;
        }

        var VEC_W = new ol.layer.Tile({
					name: "VEC_W",
					groupKey: "TDT_VECTOR",
					source: new ol.source.XYZ({
						url: tianditu
					})
				});
				var CVA_W = new ol.layer.Tile({
					name: "CVA_W",
					groupKey: "TDT_VECTOR",
					source: new ol.source.XYZ({
						url: tiandituTxt
					})
				});

				var VEC_ZJ = new ol.layer.Tile({
					name: "VEC_ZJ",
					source: new ol.source.WMTS({
						url: 'http://ditu.zjzwfw.gov.cn/mapserver/vmap/WMTS/1.0/zjvmap/zjlwdt',
						layer: 'zjvmap',
						matrixSet: 'EPSG:4490',
						format: 'image/png',
						projection: ol.proj.get('EPSG:4326'),
						tileGrid: new ol.tilegrid.WMTS({
							origin: [-180,90],
							resolutions: zjresolutions,
							matrixIds: matrixIds
						}),
						style: 'default',
						wrapX: true
					})
				});
				var CVA_ZJ = new ol.layer.Tile({
					name: "CVA_ZJ",
					source: new ol.source.WMTS({
						url: 'https://ditu.zjzwfw.gov.cn/mapserver/label/WMTS/1.0/zjvmap/zjlwdt',
						layer: 'zjvmap',
						matrixSet: 'EPSG:4490',
						format: 'image/png',
						projection: ol.proj.get('EPSG:4326'),
						tileGrid: new ol.tilegrid.WMTS({
							origin: [-180,90],
							resolutions: zjresolutions,
							matrixIds: matrixIds
						}),
						style: 'default',
						wrapX: true
					})
				});

				var IMG_ZJ = new ol.layer.Tile({
          visible: false,
          name: "IMG_ZJ",
          source: new ol.source.WMTS({
            url: 'http://ditu.zjzwfw.gov.cn/services/wmts/imgmap/2019/oss',
            layer: 'zjvmap',
            matrixSet: 'EPSG:4490',
            format: 'image/png',
            projection: ol.proj.get('EPSG:4326'),
            tileGrid: new ol.tilegrid.WMTS({
              origin: [-180,90],
              resolutions: zjresolutions,
              matrixIds: matrixIds
            }),
            style: 'default',
            wrapX: true
          })
        });
				mapExp.getOLMap().addLayer(VEC_W);
				mapExp.getOLMap().addLayer(CVA_W);
				mapExp.getOLMap().addLayer(VEC_ZJ);
				mapExp.getOLMap().addLayer(CVA_ZJ);
				mapExp.getOLMap().addLayer(IMG_ZJ);


				if(typeof mapOver === "function"){
					mapOver();
					console.log("mapOver")
				}
      }
    }
  };

  if (maptype === 'arcgis') {
    options.projection = ol.proj.get('EPSG:4326');
  } else if (maptype === 'geoserver') {
    options.projection = ol.proj.get('EPSG:4326');
    delete options.resolutions;
    delete options.extent;
  } else if (maptype === 'tianditu') {
    options.projection = ol.proj.get('EPSG:4326');
    delete options.resolutions;
    delete options.extent;
  } else if (maptype === 'zhejiangDZ') {
    options.projection = ol.proj.get('EPSG:4326');
    var size = 360/ 256; //Extent.getWidth();
    var resolutions = new Array(20);

    for (var z = 0; z < 20; ++z) {
    	// generate resolutions and matrixIds arrays for this WMTS
    	resolutions[z] = size / Math.pow(2, z);
    }
    options.resolutions = resolutions;
    delete options.extent;
  }

  // 合并地图初始化参数
  if (typeof mapOptions === 'object' && !Array.isArray(mapOptions)) {
    for (var key in mapOptions) {
      options[key] = mapOptions[key]
    }
  }

  mapExp = new gis.ZMap(options);
  mapExp.getOLMap().updateSize();

  // --全局样式
  // initStyleMap(map);
  map = mapExp;

  return mapExp;
}

// --全局样式
function initStyleMap(map) {
  var styleMap = {
    "icon_chouxi": map.getIconStyle({
      src: "",
      opacity: 1,
      anchor: [0.5, 0.5]
    }),
    "circle_green": map.getCircleStyle({
      radius: 5,
      fillColor: "#18B42D",
      borderWidth: 1,
      borderColor: "#FF0000",
      textAlign: "center",
      textOffsetY: 15
    }),
    "line_green": map.getLineStyle({
      color: "#FF0000",
      width: 4
    }),
    "polygon_red": map.getPolygonStyle({
      fillColor:"rgba(243, 14, 8, 0.5)",
      borderWidth:3,
      borderColor:"rgba(243, 14, 8, 0.9)",
    }),
    "polygon_green": map.getPolygonStyle({
      fillColor: "rgba(0, 208, 218, 0.3)",
      borderWidth: 3,
      borderColor: "#FF0000"
    }),
    "polygon_blue": map.getPolygonStyle({
      fillColor:"rgba(255, 255, 12, 0.3)",
      borderWidth:3,
      borderColor:"#3333FF",
    }),
    "polygon_yellow": map.getPolygonStyle({
      fillColor:"rgba(250, 253, 2, 0.5)",
      borderWidth:3,
      borderColor:"rgba(250, 253, 2, 0.9)",
    }),
    "polygon_orange": map.getPolygonStyle({
      fillColor:"rgba(255, 165, 0, 0.5)",
      borderWidth:3,
      borderColor:"rgba(255, 86, 0, 0.9)",
    }),
    "polygon_transparent": map.getPolygonStyle({
      fillColor: 'rgba(128, 128, 128, 0.3)',
      borderWidth: 3,
      borderColor: '#888' ,
    }),
  };

  return styleMap;
}

/**
 * 绘制标注点【单个或多个】
 * @param {Object} map 地图实例
 * @param {String} layername 图层名称
 * @param {Boolean} isclearlayer 是否清空原图层之后再标注
 * @param {Array} data 数据
 *
 * 例子:
 * var points = [{
     point: [116, 40],
     icons: [{ src: '' }], // 代表标注点的图片路径(建议用绝对路径)
     attributes: {
       id: 'xx', // 标注点的唯一标识
       //--可自定义参数 -start
       params1: 'xxx',
       params2: 'xxx',
       //--可自定义参数 -end

       // 点击标注的回调函数
       infoWindowCallBack: function(map, coordinate, feature) {
         var attributes = feature.get("attributes"); // 即上方的attributes
         var params1 = attributes.params1;
         var params2 = attributes.params2;

         // 显示弹窗
         // coordinate 回调传回的coordinate
         // html {String} 弹窗显示的内容，可以是文字可以是html代码
         // infoWindowWidth 弹窗的宽度
         map.infoWindowShow(coordinate, html, infoWindowWidth);
       }
     }
   }
 ];

 addPoints(map, 'xx', true, points);
 */
function addPoints(mapExp, layername, isclearlayer, data) {
  mapExp = mapExp ? mapExp : map;
  var vectorLayer = mapExp.getLayer(layername);

  if (!vectorLayer) {
  	var layer_option = {
  		labelEnable: false,
  		name: layername // 图层唯一标识
  	};
  	vectorLayer = mapExp.addVectorLayer(layer_option); // 添加矢量图层
  } else if (isclearlayer == true) {
    console.log(layername);
  	mapExp.clearVectorLayer(vectorLayer);
  }

  var len = data.length;
  var points = [];
  for (var i = 0; i < len; i++) {
    var item = data[i];
    var p = mapExp.createPoint(item.point);

    var attributes = {};
    if (item.attributes) {
    	attributes = item.attributes;
    }

    var defaultStyle = [];

    if (item.style && item.style.length > 0) {
    	defaultStyle.push(initStyleMap(mapExp)[item.style[0]]);
    } else {
    	if (item.icons && item.icons.length > 0) {
    		for (var k = 0; k < item.icons.length; k++) {
    			var iconObj = item.icons[k];
    			var anchor = [ 0.5, 0.5 ];
    			if (iconObj.anchor) {
    				anchor = iconObj.anchor;
    			}
    			var iconStyle = mapExp.getIconStyle({
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
    		var tipStyle = mapExp.getLabelStyle(item.labels[k]);
    		defaultStyle.push(tipStyle);
    	}
    }

    attributes.defaultStyle = defaultStyle;

    // --
    if (item.style && item.style.length > 1) {
    	// attributes.overStyle = this.getSymbolStyle(item.style[1]);
    }

    var g = mapExp.createFeature(p, attributes, defaultStyle);
    mapExp.addLayerFeature(vectorLayer, g);
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
function updatePoints(mapExp, layername, data) {
  mapExp = mapExp ? mapExp : map;

  var vectorLayer = mapExp.getLayer(layername);
  if (vectorLayer == null) {
    return;
  }

  var len = data.length;
  var points = [];
  var feature = null;
  for (var i = 0; i < len; i++) {
    var item = data[i];
    if (item.id) {
      feature = mapExp.getLayerFeature(vectorLayer, 'id', item.id);
      if (feature == null) {
        continue;
      }
    }

    var p = null;
    if (item.point) {
      var p = mapExp.createPoint(item.point);
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
          var iconStyle = mapExp.getIconStyle({
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
        var tipStyle = mapExp.getLabelStyle(item.labels[k]);
        defaultStyle.push(tipStyle);
      }
    }

    attributes.defaultStyle = defaultStyle;

    // --
    if (item.style && item.style.length > 1) {
      attributes.overStyle = this.getSymbolStyle(item.style[1]);
    }

    //修改图形
    if (p) {
      feature.setGeometry(p);
    }
    //修改样式
    if (defaultStyle !== undefined && defaultStyle.length > 0) {
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
 * 绘制图形
 * @param {Object} mapExp 地图实例
 * @param {String} layername 图层名称
 * @param {Boolean} isclearlayer 是否清除图层
 * @param {Object} data 绘制数据
 */
function showWKT(mapExp, layername, isclearlayer, data){
  mapExp = mapExp ? mapExp : map;

	var vectorLayer = mapExp.getLayer(layername);

	if(vectorLayer == null){
		var layer_option = {
			labelEnable: false,
			name: layername //图层唯一标识
		};
		vectorLayer = mapExp.addVectorLayer(layer_option);   //添加矢量图层
	}

	if (isclearlayer) mapExp.clearVectorLayer(vectorLayer);

	var len = data.length;
	for(var i=0; i<len; i++) {
		var defaultStyle = [];
		var item = data[i];
		var _wkt = item.wkt;
		var _geo = mapExp.getGeometryFromWKT(_wkt);

    // 标点
    var flg = _wkt.indexOf("MULTIPOINT") > -1 ? false : true;
    // 属性
		var attributes = item.attributes ? item.attributes : {};

    if (item.style && item.style.length > 0) {
      var polygonStyle0 = null;
      var circleStyle0 = null;

      if (typeof item.style[0] === 'object') {
        var fillColor0 = item.style[0].fillColor ? item.style[0].fillColor : "rgba(0, 208, 218, 0.3)";
        var borderWidth0 = item.style[0].borderWidth ? item.style[0].borderWidth : 3;
        var borderColor0 = item.style[0].borderColor ? item.style[0].borderColor : "#FF0000";
        var radius0 = item.style[0].radius ? item.style[0].radius : 6;

        polygonStyle0 = mapExp.getPolygonStyle({
          fillColor: fillColor0,
          borderWidth: borderWidth0,
          borderColor: borderColor0
        })
        circleStyle0 = mapExp.getCircleStyle({
          radius: radius0,
          fillColor: fillColor0,
          borderWidth: borderWidth0,
          borderColor: borderColor0,
          textAlign: "center",
          textOffsetY: 15
        })
      } else if (typeof item.style[0] === 'string') {
        polygonStyle0 = initStyleMap(mapExp)[item.style[0]];
        circleStyle0 = initStyleMap(mapExp)[item.style[0]];
      }

      if(flg) {
        defaultStyle.push(polygonStyle0);
      } else {
        defaultStyle.push(circleStyle0);
      }
    }

		attributes.defaultStyle = defaultStyle;
    if(item.style && item.style.length > 1) {
      var polygonStyle1 = null;
      var circleStyle1 = null;

      if (typeof item.style[1] === 'object') {
        var fillColor1 = item.style[1].fillColor ? item.style[1].fillColor : "rgba(0, 208, 218, 0.3)";
        var borderWidth1 = item.style[1].borderWidth ? item.style[1].borderWidth : 3;
        var borderColor1 = item.style[1].borderColor ? item.style[1].borderColor : "#FF0000";
        var radius1 = item.style[1].radius ? item.style[1].radius : 6;

        polygonStyle1 = mapExp.getPolygonStyle({
          fillColor: fillColor1,
          borderWidth: borderWidth1,
          borderColor: borderColor1
        })
        circleStyle1 = mapExp.getCircleStyle({
          radius: radius1,
          fillColor: fillColor1,
          borderWidth: borderWidth1,
          borderColor: borderColor1,
          textAlign: "center",
          textOffsetY: 15
        })
      } else if (typeof item.style[1] === 'string') {
        polygonStyle1 = initStyleMap(mapExp)[item.style[1]];
        circleStyle1 = initStyleMap(mapExp)[item.style[1]];
      }

    	if(flg) {
        attributes.overStyle = polygonStyle1;
      } else {
        attributes.overStyle = circleStyle1;
      }
    }
		var _feature = mapExp.createFeature(_geo,attributes, defaultStyle);
		mapExp.addLayerFeature(vectorLayer,_feature);
	}
}

/**
 * 绘制图形传颜色
 * @param layername
 * @param isclearlayer
 * @param data
 */
function showWKTByColor(mapExp, layername, isclearlayer, data) {
  mapExp = mapExp ? mapExp : map;
  var vectorLayer = mapExp.getLayer(layername);
  if (vectorLayer == null) {
    var layer_option = {
      labelEnable: false,
      name: layername //图层唯一标识
    };
    vectorLayer = mapExp.addVectorLayer(layer_option); //添加矢量图层
  }
  if (isclearlayer == true) {
    mapExp.clearVectorLayer(vectorLayer);
  }
  var len = data.length;
  for (var i = 0; i < len; i++) {
    defaultStyle = [];
    var item = data[i];
    var _wkt = item.wkt;
    var _geo = mapExp.getGeometryFromWKT(_wkt);

    var flg = true;
    if (_wkt.indexOf('MULTIPOINT') > -1) flg = false;
    var attributes = {};
    if (item.attributes) {
      attributes = item.attributes;
    }

    var dash = false;
    if (item.hasOwnProperty('dash')) {
      if (item.dash == true) dash = true;
    }

    if (item.style && item.style.length > 0) {
      if (flg) defaultStyle.push(this.getSymbolStyleByPolys(mapExp, item.style[0], dash));
      else defaultStyle.push(this.getSymbolStyleByPoint(mapExp, item.style[0]));
    }
    attributes.defaultStyle = defaultStyle;
    if (item.style && item.style.length > 1) {
      if (flg) attributes.overStyle = this.getSymbolStyleByPolys(mapExp, item.style[1], dash);
      else attributes.overStyle = this.getSymbolStyleByPoint(mapExp, item.style[1]);
    }
    var _feature = mapExp.createFeature(_geo, attributes, defaultStyle);
    mapExp.addLayerFeature(vectorLayer, _feature);
  }
}

// 获取样式(面/线)
function getSymbolStyleByPolys(mapExp, styleKey, dash) {
  return mapExp.getPolygonStyle({ fillColor: styleKey, borderWidth: 3, borderColor: styleKey, borderDash: dash });
}

//获取样式(点)
function getSymbolStyleByPoint(mapExp, styleKey) {
  return mapExp.getCircleStyle({ radius: 5, fillColor: styleKey, borderWidth: 1, borderColor: styleKey, textAlign: 'center', textOffsetY: 15 });
}

/**
 * 标绘闪烁
 * @param {Array} points 对象值数组.
 */
var flashMaker = null;
function drawFlash(mapExp, points, zIndex){
	flashMaker = new FlashMarker(mapExp.getOLMap(), points, zIndex);
}
/**
 * 删除闪烁
 * @param {Array} points 对象值数组.
 */
function clearFlash(){
	if(flashMaker != null) flashMaker.myclear();
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
function createCircle(mapExp, x, y, radius, rgba, bodercolor) {
  var centerLon = x;
  var centerLat = y;
  var srs = 4326;
  var circle_geom = mapExp.createCircle(centerLon, centerLat, radius, srs);

  // 声明缓冲区图层
  var bufferLayer = mapExp.getLayer("CircleLayer");
  if (bufferLayer == null) {
    var layer_option = {
      name : "CircleLayer"
    };
    bufferLayer = mapExp.addVectorLayer(layer_option);
  }
  // --清空图层
  mapExp.clearVectorLayer(bufferLayer);

  var circle_attributes = {};
  var circle_style = mapExp.getPolygonStyle({
    fillColor : rgba,
    borderWidth : 1,
    borderColor : bodercolor
  });
  var circle_feature = mapExp.createFeature(circle_geom, circle_attributes,
    circle_style);
  circle_feature.set("mouseover", false);
  mapExp.addLayerFeature(bufferLayer, circle_feature);
  mapExp.setLayerZIndex("CircleLayer", 1);

}

// --清空图层
function clearLayerByMap(mapExp, layerName) {
  var bufferLayer = mapExp.getLayer(layerName);
  if (bufferLayer != null) {
    mapExp.clearVectorLayer(bufferLayer);
  }
}

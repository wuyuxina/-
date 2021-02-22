(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		  typeof define === 'function' && define.amd ? define(factory) :
				(global.LocusCar = factory());
}(this, (function () { 'use strict';
	if(typeof ol !== 'object' || ol === null) return null;
	var idInst = 0;
	var gjInst = 0;
	var allObjs = [];
	/*
	var _map;
	var timer = 5;
	var lu_track = null;
	var me = null;
	*/
	var lu_LngLat = function(lng, lat) {
		//如果有坐标偏移，你可以在这做
		var lnglat = { "lng": lng, "lat": lat };
		//经纬度坐标转换到高斯坐标
		return ol.proj.fromLonLat([lnglat.lng, lnglat.lat]);
	};
	
	//颜色格式转换
	/*16进制颜色转为RGB格式*/
	String.prototype.colorRgb = function(opacity) {
		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
		var sColor = this.toLowerCase();
		if(sColor && reg.test(sColor)){
			if(sColor.length === 4){
				var sColorNew = "#";
				for(var i=1; i<4; i+=1){
					sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));    
				}
				sColor = sColorNew;
			}
			//处理六位的颜色值
			var sColorChange = [];
			for(var i=1; i<7; i+=2){
				sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
			}
			if(typeof opacity === 'number' && !isNaN(opacity)) sColorChange.push(opacity);
			return sColorChange;
		}
		else {
			return [];    
		}
	};
/*
  function speedUp () {
    timer = timer + 50
    // me._moveNext(++me.i);
    clearInterval(this._intervalFlag);
    this._clearTimeout();
  }
  function speedDown () {
    if (timer >= 5) {
		timer = timer - 5
    }
    // me._moveNext(++me.i);
    clearInterval(this._intervalFlag);
    this._clearTimeout();
  }
*/
	/**
	* 轨迹回放

	* @constructor
	*/
	function lu_LocusOption(data) {
		this.locusData = {
			_map: null,
			locusId: 0,
			label: new Object({//加入label对象
				offset: [25, 30], //修改label相对于maker的位置 偏移
				content: '',
				// content: '<div style="width: 200px; height: 100px; border: 1px #1b9de8 solid; background: #FFF;">\n' +
				// 		'                <p>车牌号：京B6857</p>' +
				// 		'                <p>时间：2017.5.26-2.17.5.30</p>' +
				// 		'    </div>' //显示内容，也可以为html
			}),
			icon: "http://webapi.amap.com/images/car.png",
			iconOffset: [-26, -13],
			iconAngle: 0,
			lnglat: [],
			//lineType: "solid",
			lineWidth: 3,
			lineOpacity: 0.5,
			lineColor: "#0000ff",
			nodeIcon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
			nodeSize: 5,
			nodeBoundaryColor: "#ff00ff",
			nodeBoundaryOpacity: 0.5,
			nodeBoundaryWidth: 2,
			nodeFillColor: "#00ff00",
			nodeFillOpacity: 0.5
		};

		this.locusState = {
			moveSpeed: 3,
			isSetView: false,
			syncEvent: null,
			circlable: true,
			overlayEvent: null
		};
		
		this._lu_locus = undefined;
		this.timer = 5;
		
		this.vectorLayer = undefined;
		
		this.arrX = [];
		this.arrY = [];
		
		this.shVisible = false;
		
		this.mouseEvt = false;
		
		allObjs.push(this);
		
		if(data) {
			if (data.locusData) {
				if (data.locusData._map) this.locusData._map = data.locusData._map;
				if (data.locusData.locusId) this.locusData.locusId = data.locusData.locusId;
				else {
					this.locusData.locusId = gjInst ++;
				}
				if (data.locusData.icon) this.locusData.icon = data.locusData.icon;
				if (data.locusData.label) {
					if(data.locusData.label.offset) this.locusData.label.offset = data.locusData.label.offset;
					if(data.locusData.label.content) this.locusData.label.content = data.locusData.label.content;
				}
				if (data.locusData.lnglat) {
					this.locusData.lnglat = [];
					for(var i = 0, ln = data.locusData.lnglat.length; i < ln; ++ i) {
						//this.locusData.lnglat.push(lu_LngLat(data.locusData.lnglat[i][0], data.locusData.lnglat[i][1]));
						this.locusData.lnglat.push([data.locusData.lnglat[i][0], data.locusData.lnglat[i][1]]);
					}
				}
				//if (data.locusData.lineType) this.locusData.lineType = data.locusData.lineType;
				if (data.locusData.nodeIcon) this.locusData.nodeIcon = data.locusData.nodeIcon;
				if (typeof data.locusData.lineWidth === 'number' && !isNaN(data.locusData.lineWidth)) this.locusData.lineWidth = data.locusData.lineWidth;
				if (data.locusData.lineColor) this.locusData.lineColor = data.locusData.lineColor;
				if (typeof data.locusData.lineOpacity === 'number' && !isNaN(data.locusData.lineOpacity)) this.locusData.lineOpacity = data.locusData.lineOpacity;
				
				if (typeof data.locusData.nodeSize === 'number' && !isNaN(data.locusData.nodeSize)) this.locusData.nodeSize = data.locusData.nodeSize;
				if (data.locusData.nodeBoundaryColor) this.locusData.nodeBoundaryColor = data.locusData.nodeBoundaryColor;
				if (typeof data.locusData.nodeBoundaryWidth === 'number' && !isNaN(data.locusData.nodeBoundaryWidth)) this.locusData.nodeBoundaryWidth = data.locusData.nodeBoundaryWidth;
				if (typeof data.locusData.nodeBoundaryOpacity === 'number' && !isNaN(data.locusData.nodeBoundaryOpacity)) this.locusData.nodeBoundaryOpacity = data.locusData.nodeBoundaryOpacity;
				if (data.locusData.nodeFillColor) this.locusData.nodeFillColor = data.locusData.nodeFillColor;
				if (typeof data.locusData.nodeFillOpacity === 'number' && !isNaN(data.locusData.nodeFillOpacity)) this.locusData.nodeFillOpacity = data.locusData.nodeFillOpacity;
				if (data.locusData.iconOffset) this.locusData.iconOffset = data.locusData.iconOffset;
				if (typeof data.locusData.iconAngle === 'number' && !isNaN(data.locusData.iconAngle)) this.locusData.iconAngle = data.locusData.iconAngle;
				if (data.locusState) {
					if (data.locusState.moveSpeed) this.locusState.moveSpeed = data.locusState.moveSpeed;
					if (data.locusState.isSetView != undefined) this.locusState.isSetView = data.locusState.isSetView;
					if (data.locusState.syncEvent) this.locusState.syncEvent = data.locusState.syncEvent;
					if (data.locusState.circlable != undefined) this.locusState.circlable = data.locusState.circlable;
					if (data.locusState.overlayEvent) this.locusState.overlayEvent = data.locusState.overlayEvent;
				}
			}
		}
		
		this.lu_MoveLocus();
	}

	lu_LocusOption.prototype = {
		constructor: lu_LocusOption,
		lu_getLocation: function() {
			var ret = null;
			var LocusOption = this;
			if(LocusOption._lu_locus) {
				var lc = LocusOption._lu_locus.currentStat;
				ret = {
					startLoc: [lc.startLoc[0], lc.startLoc[1]],  //路链开始点的坐标
					startId: lc.startId,                         //路链开始点的的ID
					endLoc: [lc.endLoc[0], lc.endLoc[1]],        //路链结束点的坐标
					endId: lc.endId,                             //路链结束点的ID
					nearLoc: [0, 0],                             //离设备最近的路链点坐标
					nearId: -1,
					curLoc: [lc.curLoc[0], lc.curLoc[1]]        //当前设备坐标
				};
				var dst1, dst2;
				dst1 = Math.sqrt(Math.pow(ret.curLoc[0] - ret.startLoc[0], 2) + Math.pow(ret.curLoc[1] - ret.startLoc[1], 2));
				dst2 = Math.sqrt(Math.pow(ret.curLoc[0] - ret.endLoc[0], 2) + Math.pow(ret.curLoc[1] - ret.endLoc[1], 2));
				if(dst1 < dst2) {
					ret.nearId = ret.startId;
					ret.nearLoc[0] = ret.startLoc[0];
					ret.nearLoc[1] = ret.startLoc[1];
				}
				else {
					ret.nearId = ret.endId;
					ret.nearLoc[0] = ret.endLoc[0];
					ret.nearLoc[1] = ret.endLoc[1];
				}
			}
			return ret;
		},
		lu_MoveLocus: function(isfor) {
			var LocusOption = this;
			if(LocusOption._lu_locus) {
				LocusOption._lu_locus.stop();
			}
			try {
				var _locusState = LocusOption.locusState;
				var _locusData = LocusOption.locusData;
				if (_locusState.isClearOverlay) {
					//清空
				}
				
				LocusOption.lu_DrawLinesAndMarkers();
				
				if(typeof LocusOption._lu_locus === 'object' && LocusOption._lu_locus !== null) {
					LocusOption._lu_locus.destroy();
				}
				//开启路书
				LocusOption._lu_locus = new TYMapLib.lu_track(_locusData._map, _locusData.lnglat, {
					icon: _locusData.icon,
					iconOffset: _locusData.iconOffset,
					iconAngle: _locusData.iconAngle,
					defaultContent: _locusData.label,
					autoView: _locusState.isSetView, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
					speed: _locusState.moveSpeed,
					enableRotation: true, //是否设置marker随着道路的走向进行旋转
					circlable: _locusState.circlable,
					timer: LocusOption.timer,
					locusId: _locusData.locusId,
					clickFunc: function() {
						LocusOption.shTitle();
					},
					overFunc: function() {
						if(LocusOption.mouseEvt && !LocusOption._lu_locus.finished) LocusOption._lu_locus.pause();
					},
					outFunc: function() {
						if(LocusOption.mouseEvt && !LocusOption._lu_locus.finished) LocusOption._lu_locus.start();
					}
				});
			}
			catch (e) {
				console.log(e.message);
			}
		},
		lu_DrawLinesAndMarkers: function() {
			var LocusOption = this;
			var locusData = this.locusData;
			var _locusState = this.locusState;
			
			var image, text, offset;
			if (locusData) {
				if (locusData.nodeIcon) image = locusData.nodeIcon;
				if (locusData.label) text = locusData.label.content;
				if (locusData.label) offset = locusData.label.offset;
			}
			
			var styles = {
				'route': new ol.style.Style({
					stroke: new ol.style.Stroke({
						width: locusData.lineWidth, 
						color: locusData.lineColor.colorRgb(locusData.lineOpacity)
					})
				}),
				'node': new ol.style.Style({
					image: new ol.style.Circle({
						radius: locusData.nodeSize,
						stroke: new ol.style.Stroke({
							color: locusData.nodeBoundaryColor.colorRgb(locusData.nodeBoundaryOpacity),
							width: locusData.nodeBoundaryWidth
						}),
						fill: new ol.style.Fill({
							color: locusData.nodeFillColor.colorRgb(locusData.nodeFillOpacity)
						})
					})
				}),
				'icon1': typeof image === 'string' && image !== "" ? new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1],
						src: image
					}),
					text: new ol.style.Text({
						font: "13px Microsoft Yahei",
						text: "起点",
						fill: new ol.style.Fill({
							color: "#aa3300"
						}),
						stroke: new ol.style.Stroke({ color: "#fff", width: 2 }),
						textAlign: "left"
					})
				}) : null,
				'icon2': typeof image === 'string' && image !== "" ? new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1],
						src: image
					}),
					text: new ol.style.Text({
						font: "13px Microsoft Yahei",
						text: "终点",
						fill: new ol.style.Fill({
							color: "#aa3300"
						}),
						stroke: new ol.style.Stroke({ color: "#fff", width: 2 }),
						textAlign: "left"
					})
				}) : null,
				'geoMarker': typeof locusData.icon === 'string' && locusData.icon !== "" ? new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 0.5],
						rotation: 0,
						size: [52, 26],
						src: locusData.icon
					}),
					text: new ol.style.Text({
						font: "13px Microsoft Yahei",
						text: text,
						fill: new ol.style.Fill({
							color: "#aa3300"
						}),
						stroke: new ol.style.Stroke({color: "#fff", width: 2}),
						offsetX: offset[0],
						offsetY: offset[1],
						textAlign: "left"
					})
				}) : null
			};

			var locussff = [], star, stop;
			/*
			var style = new ol.style.Style({
				stroke: new ol.style.Stroke({
					width: 5,
					color: [237, 212, 0, 0.8]
				})
			});
			*/
			var lineFeature = new ol.Feature(new ol.geom.LineString(locusData.lnglat));
			lineFeature.setId(locusData.locusId);
			lineFeature.setStyle(styles.route);
			locussff.push(lineFeature);

			//节点打印
			var arrLngLat = locusData.lnglat;

			var arrX = [], arrY = [];
			for(var i = 0, lni = arrLngLat.length; i < lni; ++ i) {
				//console.log(i)
				if(i > 0 && i < lni - 1) {
					var nodeMarker = new ol.Feature({
						type: 'node',
						geometry: new ol.geom.Point(locusData.lnglat[i])
					});
					locussff.push(nodeMarker);
				}
				else {
					if(i == 0) {
						var starMarker = new ol.Feature({
							type: 'node',
							geometry: new ol.geom.Point(arrLngLat[i])
						});
						locussff.push(starMarker);
					}
					else if(i == lni - 1) {
						var startMarker = new ol.Feature({
							type: 'node',
							geometry: new ol.geom.Point(arrLngLat[i])
						});
						locussff.push(startMarker);
					}
				}
				arrX.push(arrLngLat[i][0]);
				arrY.push(arrLngLat[i][1]);
			}
			this.arrX = arrX;
			this.arrY = arrY;

			var routeCoords = arrLngLat;
			var routeLength = arrLngLat.length;

			if(typeof LocusOption.vectorLayer === 'object' && LocusOption.vectorLayer !== null) {
				locusData._map.removeLayer(LocusOption.vectorLayer);
			}
			
			LocusOption.vectorLayer = new ol.layer.Vector({
				zIndex: 50000,
				source: new ol.source.Vector({
					features: locussff
				}),
				style: function(feature) {
					// hide geoMarker if animation is active
					if (feature.get('type') === 'geoMarker') return null;
					return styles[feature.get('type')];
				}
			});

			locusData._map.addLayer(LocusOption.vectorLayer);

			//标题
			var mp2 = document.createElement("div");
			mp2.id = "mycar_title" + locusData.locusId;
			mp2.innerHTML = locusData.label.content;

			if(typeof LocusOption.title === 'object' && LocusOption.title !== null) {
				locusData._map.removeOverlay(LocusOption.title);
			}
			mp2.style.visibility = "hidden";
			LocusOption.title = new ol.Overlay({
				id: "_ty_lj_key_title" + locusData.locusId,
				//autoPan: true,
				position: [arrX[0][0], arrY[0][1]],
				stopEvent: false,
				offset: offset,
				positioning: "bottom-left",
				element: mp2
			});
			locusData._map.addOverlay(LocusOption.title);

			//添加事件
			if (_locusState.overlayEvent) {
				var keys__ = locusData._map.on(_locusState.overlayEvent.mouseEvent, function(evt) {
					var feature = locusData._map.forEachFeatureAtPixel(evt.pixel, function(feature) {
						return feature;
					});
					if(feature) {
						var mkNew = new Object();
						var coord = feature.getGeometry().getCoordinates();
						var newcoord = new GPSLngLat(coord[0], coord[1]);
						mkNew.lng = newcoord.GPSLng;
						mkNew.lat = newcoord.GPSLat;

						_locusState.overlayEvent.mouseFunc(mkNew);
					}
				});
				_ty_point.push(keys__);
			}
		},
		LocusStart: function() {
			var LocusOption = this;
			if(LocusOption._lu_locus) {
				LocusOption._lu_locus.start();
			}
		},
		LocusStop: function() {
			var LocusOption = this;
			if(LocusOption._lu_locus) {
				LocusOption._lu_locus.stop();
			}
		},
		SetSpeed: function (speed) {
			if(typeof speed !== 'number' || isNaN(speed) || speed <= 0) speed = 3;
			this._lu_locus._opts.speed = speed; 
		},
		
		LocusPause: function() {
			var LocusOption = this;
			if(LocusOption._lu_locus) {
				LocusOption._lu_locus.pause();
			}
		},
		destroy: function() {
			var LocusOption = this;
			if(typeof LocusOption.vectorLayer === 'object' && LocusOption.vectorLayer !== null) {
				LocusOption.locusData._map.removeLayer(LocusOption.vectorLayer);
			}
			if(typeof LocusOption.title === 'object' && LocusOption.title !== null) {
				LocusOption.locusData._map.removeOverlay(LocusOption.title);
			}
			if(typeof LocusOption._lu_locus === 'object' && LocusOption._lu_locus !== null) {
				LocusOption._lu_locus.destroy();
			}
			for(var i = 0, lni = allObjs.length; i < lni; ++ i) {
				if(allObjs[i] === LocusOption) allObjs.splice(i, 1);
			}
		},
		destroyAll: function() {
			var sall = allObjs;
			allObjs = [];
			for(var i = 0, lni = sall.length; i < lni; ++ i) {
				sall[i].destroy();
			}
		},
		shTitle: function(tof) {
			var LocusOption = this;
			if(typeof LocusOption.title === 'object' && LocusOption.title !== null) {
				if(typeof tof !== 'boolean') tof = !LocusOption.shVisible;
				LocusOption.shVisible = tof;
				var doma = LocusOption.title.getElement();
				/*
				if(tof) LocusOption.locusData._map.addOverlay(LocusOption.title);
				else LocusOption.locusData._map.removeOverlay(LocusOption.title);
				*/
				if(tof) doma.style.visibility = "visible";
				else doma.style.visibility = "hidden";
			}
		},
		/**
		 * 获取最好视野
		 * @param __boxX
		 * @param __boxY
		 * @author luwenjun 2016-9-22
		 * @returns
		 */
		lu_box: function() {
			var LocusOption = this;
			var __boxX = LocusOption.arrX;
			var __boxY = LocusOption.arrY;
			try {
				var sort1 = [__boxX.sort()[0], __boxX.sort()[__boxX.sort().length - 1]];
				var sort2 = [__boxY.sort()[0], __boxY.sort()[__boxY.sort().length - 1]];
				LocusOption.locusData._map.getView().fit([sort1[0], sort2[0], sort1[1], sort2[1]], LocusOption.locusData._map.getSize());
			}
			catch(e) {
				console.log(e.message);
			}
		}
	};

	function TYCar(lnglat, config) {
		var gid = idInst ++;
		
		var mp = document.createElement("div");
		mp.id = "mymovecar" + gid;
		mp.style.position = "absolute";

		var mimg = document.createElement("img");
		if (config.icon) mimg.src = config.icon;
		if(typeof config.clickFunc === 'function') mp.onclick = config.clickFunc;
		if(typeof config.overFunc === 'function') mp.onmouseover = config.overFunc;
		if(typeof config.outFunc === 'function') mp.onmouseout = config.outFunc;
		mp.appendChild(mimg);

		var TYMarker = new ol.Overlay({
			id: "_ty_lj_key_car" + gid,
			stopEvent: false,
			offset: config.iconOffset,
			positioning: "center-center",
			element: mp
		});

		TYMarker.setPosition(lnglat);
		//console.log(config);
		TYMarker.setRotation = function(a) {
			if(!isNaN(a)) {
				if (a <= 360 && a >= 0) {
					var x = document.getElementById("mymovecar" + gid);
					x.style.transform = "rotate(" + a + "deg)";
				}
			}
		}

		return TYMarker;
	}

	/**
	 * @namespace BMap的所有library类均放在TYMapLib命名空间下
	 */
	var TYMapLib = window.TYMapLib = TYMapLib || {};
	(function() {
    /**
     * @exports lu_track as TYMapLib.lu_track
     */
		var lu_track = TYMapLib.lu_track = function(map, path, opts) {
		  if (!path || path.length < 1) {
		    return;
		  }
		  this.ismove = false;
		  this._cc = 0;
		  this._map = map;
		  //存储一条路线
		  this._path = path;
		  //移动到当前点的索引
		  this.i = 0;
		  //控制暂停后开始移动的队列的数组
		  this._setTimeoutQuene = [];
		  //进行坐标转换的类
		  // this._projection = this._map.getMapType().getProjection();
		  this._opts = {
		    icon: null,
		    //默认速度 米/秒
		    speed: 400,
		    defaultContent: ''
		  };
		  this._setOptions(opts);
		  this._rotation = 0; //小车转动的角度
		  
		  this.timer = typeof opts.timer === 'number' && !isNaN(opts.timer) ? opts.timer : 5;
		  this.locusId = typeof opts.locusId === 'number' && !isNaN(opts.locusId) ? opts.locusId : 0;
		  
		  this.finished = false;
		  
		  this.currentStat = {
			startLoc: [path[0][0], path[0][1]],
			startId: 0,
			endLoc: path.length >= 2 ? [path[1][0], path[1][1]] : [path[0][0], path[0][1]],
			endId: path.length >= 2 ? 1 : 0,
			curLoc: [path[0][0], path[0][1]]
		  };

		  //如果不是默认实例，则使用默认的icon  instanceof BMap.Icon
		  if (!this._opts.icon) {
		    this._opts.icon = "http://webapi.amap.com/images/car.png";
		  }

		}
		
		lu_track.prototype.destroy = function() {
			var me = this;
			me.stop();
			if(typeof me._marker === 'object' && me._marker !== null) {
				me._map.removeOverlay(me._marker);
				me._marker.setMap(null);
				me._marker = undefined;
			}
			if(typeof me._overlay === 'object' && me._overlay !== null) {
				me._map.TYremoveOverLay(me._overlay);
				me._overlay.setMap(null);
				me._overlay = undefined;
			}
		};
		
    /**
     * 根据用户输入的opts，修改默认参数_opts
     * @param {Json Object} opts 用户输入的修改参数.
     * @return 无返回值.
     */
    lu_track.prototype._setOptions = function(opts) {
		if (!opts) {
		  return;
		}
		for (var p in opts) {
		  if (opts.hasOwnProperty(p)) {
		    this._opts[p] = opts[p];
		  }
		}
    }

    /**
     * @description 开始运动
     * @param none
     * @return 无返回值.
     *
     * @example <b>参考示例：</b><br />
     * lu_track.start();
     */
    lu_track.prototype.start = function() {
		this.finished = false;
		this.ismove = true;
		var me = this, len = me._path.length;

		//不是第一次点击开始,并且小车还没到达终点
		if (me.i && me.i < len - 1) {
		  //没按pause再按start不做处理
		  if (!me._fromPause) {
		    return;
		  } else if (!me._fromStop) {
		    //按了pause按钮,并且再按start，直接移动到下一点
		    //并且此过程中，没有按stop按钮
		    //防止先stop，再pause，然后连续不停的start的异常
		    me._moveNext(me.i);

		  }
		} else {
		  //第一次点击开始，或者点了stop之后点开始
		  me._addMarker();
		  //等待marker动画完毕再加载infowindow
		  me._timeoutFlag = setTimeout(function() {
		    //弹出窗口
		    //me._addInfoWin();
		    if (me._opts.defaultContent == "") {
				//  me.hideInfoWindow();
		    }
		    me._moveNext(me.i);
		  }, 400);
		}
		//重置状态
		this._fromPause = false;
		this._fromStop = false;
    },
		/**
		 * 结束运动
		 * @return 无返回值.
		 *
		 * @example <b>参考示例：</b><br />
		 * lu_track.stop();
		 */
		lu_track.prototype.stop = function() {
		  this.ismove = false;
		  this.i = 0;
		  this._fromStop = true;
		  clearInterval(this._intervalFlag);
		  this._clearTimeout();
		  //重置landmark里边的poi为未显示状态
		  /*  for (var i = 0, t = this._opts.landmarkPois, len = t.length; i < len; i++) {
		  t[i].bShow = false;
		  }*/
		};
    /**
     * 暂停运动
     * @return 无返回值.
     */
    lu_track.prototype.pause = function() {

		clearInterval(this._intervalFlag);

		//标识是否是按过pause按钮
		this._fromPause = true;
		this._clearTimeout();
    };
    /**
     * 隐藏上方overlay
     * @return 无返回值.
     *
     * @example <b>参考示例：</b><br />
     * lu_track.hideInfoWindow();
     */
    lu_track.prototype.hideInfoWindow = function() {
		if(this._overlay) this._overlay._div.style.visibility = 'hidden';
    };
    /**
     * 显示上方overlay
     * @return 无返回值.
     *
     * @example <b>参考示例：</b><br />
     * lu_track.showInfoWindow();
     */

    lu_track.prototype.showInfoWindow = function() {
		if(this._overlay) this._overlay._div.style.visibility = 'visible';
    };


    //lu_track私有方法

    /**
     * 添加marker到地图上
     * @param {Function} 回调函数.
     * @return 无返回值.
     */
    lu_track.prototype._addMarker = function(callback) {
		if (this._marker) {
		  this.stop();
		  this._marker.setMap(null);

		  clearTimeout(this._timeoutFlag);
		}
		//移除之前的overlay
		this._overlay && this._overlay.setMap(null);
		var marker = new TYCar(this._path[0], this._opts);
		//this._opts.icon && marker.setIcon(this._opts.icon);


		// this._opts.icon && marker.setIcon(this._opts.icon);
		this._map.addOverlay(marker);

		//if (this._opts.defaultContent && this._opts.defaultContent != "")
		this._marker = marker;


		// var adiv = this._marker.getIcon().containerDiv;
		//adiv.innerHTML = adiv.innerHTML + "<br/>" + this._opts.defaultContent;


    },
		/**
		 * 添加上方overlay
		 * @return 无返回值. 暂时无用
		 */
		lu_track.prototype._addInfoWin = function() {
		  var me = this;
		  //if(me._opts.defaultContent!== ""){
		  var overlay = new CustomOverlay(me._marker.getLngLat(), me._opts.defaultContent);

		  //将当前类的引用传给overlay。
		  overlay.setRelatedClass(this);
		  this._overlay = overlay;
		  this._map.TYaddOverLay(overlay);

		  //}

		},

		/**
		 * 计算两点间的距离
		 * @param {Point} poi 经纬度坐标A点.
		 * @param {Point} poi 经纬度坐标B点.
		 * @return 无返回值.
		 */
		lu_track.prototype._getDistance = function(pxA, pxB) {
		  return formatLength([pxA, pxB], this._map)
		},
		//目标点的  当前的步长,position,总的步长,动画效果,回调
		/**
		 * 移动小车
		 * @param {Number} poi 当前的步长.
		 * @param {Point} initPos 经纬度坐标初始点.
		 * @param {Point} targetPos 经纬度坐标目标点.
		 * @param {Function} effect 缓动效果.
		 * @return 无返回值.
		 */
		lu_track.prototype._move = function(initPos, targetPos, effect, currentCount) {
		  var me = this;
		  me.ismove = true;
		  //当前的帧数
		  if (!currentCount)
		    currentCount = 0;
		  //步长，米/秒
		  
		    //初始坐标
		    var init_pos = this._map.getPixelFromCoordinate(initPos),
		    //获取结束点的(x,y)坐标
		    target_pos = this._map.getPixelFromCoordinate(targetPos);
		    //总的步长
			/*
			,step = this._opts.speed / (1000 / me.timer)
		    ,count = Math.round(me._getDistance(init_pos, target_pos) / step);
			*/
		

		  //如果小于1直接移动到下一点
		  var count = this._opts.speed * 1000 / me.timer * (formatLength([initPos, targetPos], me._map) / formatLength(me._path, me._map));
		  if (count < 1) {
		    me._moveNext(++me.i);
		    return;
		  }
		  //两点之间匀速移动 setInterval
		  me._intervalFlag = setInterval(function() {
		    //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
		    if (currentCount >= count) {
				clearInterval(me._intervalFlag);
				//移动的点已经超过总的长度
				if (me.i > me._path.length) {
		return;
				}
				//运行下一个点
				me._moveNext(++me.i);
		    } else {
				currentCount++;
				me._cc = currentCount;
				/*
				var x = effect(init_pos[0], target_pos[0], currentCount, count),
				y = effect(init_pos[1], target_pos[1], currentCount, count),
				pos = me._map.getCoordinateFromPixel([x, y]);
				*/
				var x = effect(initPos[0], targetPos[0], currentCount, count),
				y = effect(initPos[1], targetPos[1], currentCount, count),
				pos = [x, y];
				//做记录
				me.currentStat.curLoc[0] = x;
				me.currentStat.curLoc[1] = y;
				//console.log(pos);
				//设置marker
				if (currentCount == 1) {
		var proPos = null;
		if (me.i - 1 >= 0) {
		proPos = me._path[me.i - 1];
		}
		if (me._opts.enableRotation == true) {
		me.setRotation(proPos, initPos, targetPos);
		}
		if (me._opts.autoView) {

		}
				}

				var extent = me._map.getView().calculateExtent(me._map.getSize());
				var bl = ol.extent.getBottomLeft(extent);
				var tr = ol.extent.getTopRight(extent);
				var bb = ol.extent.containsCoordinate([bl[0], bl[1], tr[0], tr[1]], pos);

				//移动中的label
				var overs = me._map.getOverlayById("_ty_lj_key_title" + me.locusId);
				if(overs) overs.setPosition(pos);

				if (!bb) {
		if (me._opts.autoView) {
		clearInterval(me._intervalFlag);
		me._map.getView().setCenter(pos);
		me._move(initPos, targetPos, me._tween.linear);
		} else {
		me._marker && me._marker.setPosition(pos);
		}
				} else {
		me._marker && me._marker.setPosition(pos);
				}
		    }
		  }, me.timer);
		},

		/**
		 *在每个点的真实步骤中设置小车转动的角度
		 */
		lu_track.prototype.setRotation = function(prePos, curPos, targetPos) {
		  //console.log(prePos);console.log(curPos);

		  var me = this;

		  curPos = me._map.getPixelFromCoordinate(curPos);
		  targetPos = me._map.getPixelFromCoordinate(targetPos);

		  curPos = { x: curPos[0], y: curPos[1] };
		  targetPos = { x: targetPos[0], y: targetPos[1] }

		  var x = Math.abs(targetPos.x - curPos.x);
		  var y = Math.abs(targetPos.y - curPos.y);
		  var z = Math.sqrt(x * x + y * y);
		  var ration = Math.round((Math.asin(y / z) / Math.PI * 180));
		  var a = 0;
		  if (targetPos.y < curPos.y && targetPos.x == curPos.x) {
		    a = 270; // (180 - ration);
		  }
		  else if (targetPos.y > curPos.y && targetPos.x == curPos.x)
		    a = 90///ration;
		  else if (targetPos.y == curPos.y && targetPos.x < curPos.x)
		    a = 180//(180 - ration);
		  else if (targetPos.y == curPos.y && targetPos.x > curPos.x)
		    a = 0//ration;
		  else if (targetPos.y > curPos.y && targetPos.x > curPos.x)
		    a = ration;
		  else if (targetPos.y > curPos.y && targetPos.x < curPos.x)
		    a = 180 - ration;
		  else if (targetPos.y < curPos.y && targetPos.x < curPos.x)
		    a = 180 + ration;
		  else if (targetPos.y < curPos.y && targetPos.x > curPos.x)
		    a = 360 - ration;
		  a += me._opts.iconAngle;
		  while(a < 0) a += 360;
		  this._marker && this._marker.setRotation(a);
		  //console.log(a)
		  return;

		},

		lu_track.prototype.linePixellength = function(from, to) {
		  return Math.sqrt(Math.abs(from.x - to.x) * Math.abs(from.x - to.x) + Math.abs(from.y - to.y) * Math.abs(from.y - to.y));

		},
		lu_track.prototype.pointToPoint = function(from, to) {
		  return Math.abs(from.x - to.x) * Math.abs(from.x - to.x) + Math.abs(from.y - to.y) * Math.abs(from.y - to.y)
		},

		/**
		 * 移动到下一个点
		 * @param {Number} index 当前点的索引.
		 * @return 无返回值.
		 */
		lu_track.prototype._moveNext = function(index) {
			this.ismove = true;
			if (this._opts.func && this._opts.func != "") this._opts.func(index);
			var me = this;
			if (index == me._path.length - 1 && me._path.length > 1) {
				if(me._opts.circlable) {
					index = 0;
					me.i = 0;
				}
				else {
					me.finished = true;
					me._marker.setPosition(me._path[index]);
					
					var overs = me._map.getOverlayById("_ty_lj_key_title" + me.locusId);
					if(overs) overs.setPosition(me._path[index]);
					//做记录
					me.currentStat.startId = index - 1;
					me.currentStat.endId = index;
					me.currentStat.startLoc[0] = me._path[index - 1][0];
					me.currentStat.startLoc[1] = me._path[index - 1][1];
					me.currentStat.endLoc[0] = me._path[index][0];
					me.currentStat.endLoc[1] = me._path[index][1];
					me.currentStat.curLoc[0] = me._path[index][0];
					me.currentStat.curLoc[1] = me._path[index][1];
				}
			}
			if (index < this._path.length - 1) {
				//做记录
				me.currentStat.startId = index;
				me.currentStat.endId = index + 1;
				me.currentStat.startLoc[0] = me._path[index][0];
				me.currentStat.startLoc[1] = me._path[index][1];
				me.currentStat.endLoc[0] = me._path[index + 1][0];
				me.currentStat.endLoc[1] = me._path[index + 1][1];
				me.currentStat.curLoc[0] = me._path[index + 1][0];
				me.currentStat.curLoc[1] = me._path[index + 1][1];
				
				//判断是否需要屏幕暂停，移动中心
				var ifXYZ1 = me._path[index];
				var ifXYZ2 = me._path[index + 1];

				var extent = me._map.getView().calculateExtent(me._map.getSize());

				var bl = ol.extent.getBottomLeft(extent);
				var tr = ol.extent.getTopRight(extent);

				tr = [me._map.getPixelFromCoordinate(tr)[0] - 30, me._map.getPixelFromCoordinate(tr)[1] + 30];
				bl = [me._map.getPixelFromCoordinate(bl)[0] + 30, me._map.getPixelFromCoordinate(tr)[1] - 30];

				tr = me._map.getCoordinateFromPixel(tr);
				bl = me._map.getCoordinateFromPixel(bl);

				var extentA = ol.extent.containsCoordinate([bl[0], bl[1], tr[0], tr[1]], ifXYZ1);
				var extentB = ol.extent.containsCoordinate([bl[0], bl[1], tr[0], tr[1]], ifXYZ2);

				//console.log(extentA, extentB);
				if (extentA == false || extentB == false) {
					if (me._opts.autoView) {
						clearInterval(me._intervalFlag);

						var centerA = (ifXYZ2[0] - ifXYZ1[0]) / 2 + ifXYZ2[0];
						var centerB = (ifXYZ2[1] - ifXYZ1[1]) / 2 + ifXYZ2[1];

						if (extentA == false && extentB == false) {
							me._map.getView().setCenter([centerA, centerB]);
						}
						else if (extentA == false) {
							me._map.getView().setCenter(ifXYZ1);
						}
						else if (extentB == false) {
							me._map.getView().setCenter(ifXYZ2);
						}
						else {
							// console.log("#1005853");
							return;
						}
						setTimeout(function() {
							me._move(me._path[index], me._path[index + 1], me._tween.linear);
						}, 100);
					}
					else {
						me._move(me._path[index], me._path[index + 1], me._tween.linear);
					}
				}
				else {
					me._move(me._path[index], me._path[index + 1], me._tween.linear);
				}
			}
		},
		/**
		 * 设置小车上方infowindow的内容，位置等
		 * @param {Point} pos 经纬度坐标点.
		 * @return 无返回值.
		 */
		lu_track.prototype._setInfoWin = function(pos) {
		  //设置上方overlay的position
		  var me = this;
		  if (!me._overlay) {
		    return;
		  }
		  me._overlay.setPosition(pos, me._marker.getIcon().size);
		  var index = me._troughPointIndex(pos);
		  if (index != -1) {
		    clearInterval(me._intervalFlag);
		    //  me._overlay.setHtml(me._opts.landmarkPois[index].html);
		    me._overlay.setPosition(pos, me._marker.getIcon().getSize());
		    me._pauseForView(index);
		  } else {
		    me._overlay.setHtml(me._opts.defaultContent);
		  }
		},
		/**
		 * 在某个点暂停的时间
		 * @param {Number} index 点的索引.
		 * @return 无返回值.
		 */
		lu_track.prototype._pauseForView = function(index) {

		  var me = this;
		  var t = setTimeout(function() {
				//运行下一个点
				me._moveNext(++me.i);
		    },
		    me._opts.landmarkPois[index].pauseTime * 1000);
		  me._setTimeoutQuene.push(t);
		},
		//清除暂停后再开始运行的timeout
		lu_track.prototype._clearTimeout = function() {
		  for (var i in this._setTimeoutQuene) {
		    clearTimeout(this._setTimeoutQuene[i]);
		  }
		  this._setTimeoutQuene.length = 0;
		},
		//缓动效果
		lu_track.prototype._tween = {
		  //初始坐标，目标坐标，当前的步长，总的步长
		  linear: function(initPos, targetPos, currentCount, count) {
		    var b = initPos, c = targetPos - initPos, t = currentCount,
				d = count;
		    return c * t / d + b;
		  }
		},

		/**
		 * 否经过某个点的index
		 * @param {Point} markerPoi 当前小车的坐标点.
		 * @return 无返回值.
		 */
		lu_track.prototype._troughPointIndex = function(markerPoi) {
		  var t = this._opts.landmarkPois, distance;
		  for (var i = 0, len = t.length; i < len; i++) {
		    //landmarkPois中的点没有出现过的话
		    if (!t[i].bShow) {
				distance = markerPoi.distance(new AMap.LngLat(t[i].lng, t[i].lat));
				//两点距离小于10米，认为是同一个点
				if (distance < 10) {
		t[i].bShow = true;
		return i;
				}
		    }
		  }
		  return -1;
		}


  })();

	/**
	 * 求多点间距离
	 * @param hex
	 * @param opacity
	 * @author luwenjun 2016-9-22
	 * @returns
	 */
	var formatLength = function(coordinates, _map) {
		//var wgs84Sphere = new ol.Sphere(6378137);
		var length = 0;
		var sourceProj = _map.getView().getProjection();
		for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
			var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
			var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
			//length += wgs84Sphere.haversineDistance(c1, c2);
			length += ol.sphere.getDistance(c1, c2);
		}
		return length;
	};
	return lu_LocusOption;
})));
	
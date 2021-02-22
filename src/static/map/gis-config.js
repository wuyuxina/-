// 天地图地址
var tianditu = "http://t{1-6}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=530dad1bfc5a88d60e566c101a095bbc"; // 地图
var tiandituTxt = "http://t{1-6}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a64782b550587d3367380beec20779df"; // 省市县等区域文字

var gisConfig = {
  "isUsed": "jiangxilw", // 正在使用的配置项

  // 江西路网
  "jiangxilw": {
    "gisIp": "http://222.249.173.36:6305", // 地图服务器地址
    "initMapUrl": "/geoserver/jxdemo/wms", // 地图初始化地址
    "mapType": "geoserver", // 地图类型
    // 地图全图范围
    "fullExtent": [
      113.580253601074,
      24.5224494934082,
      118.393119812012,
      30.0793762207031
    ],
    "mapCenter": [116.01, 27.67], // 地图中心点
    "initZoom": 8, // 地图当前缩放级别
    "minZoom": 6, // 最小缩放级别
    "maxZoom": 20, // 最大缩放级别
    "origin": [113.580253601074, 24.5224494934082],

    "theme1": {
      "gisIp": "http://222.249.173.36:6305", // 地图服务器地址
      "initMapUrl": "/geoserver/jxdemo/wms", // 地图初始化地址
      "mapType": "tianditu", // 地图类型
      // 地图全图范围
      "fullExtent": [
        113.580253601074,
        24.5224494934082,
        118.393119812012,
        30.0793762207031
      ],
      "mapCenter": [116.01, 28.67], // 地图中心点
      "initZoom": 8, // 地图当前缩放级别
      "minZoom": 6, // 最小缩放级别
      "maxZoom": 20, // 最大缩放级别
      "origin": [113.580253601074, 24.5224494934082],
    },

    "theme2": {
      "gisIp": "http://222.249.173.36:6305", // 地图服务器地址
      "initMapUrl": "/geoserver/jxdemo/wms", // 地图初始化地址
      "initLayers": "jxdemo:jxdemo", // 底图名
      "mapType": "geoserver", // 地图类型
      // 地图全图范围
      "fullExtent": [
        113.580253601074,
        24.5224494934082,
        118.393119812012,
        30.0793762207031
      ],
      "mapCenter": [116.01, 28.67], // 地图中心点
      "initZoom": 8, // 地图当前缩放级别
      "minZoom": 6, // 最小缩放级别
      "maxZoom": 20, // 最大缩放级别
      "origin": [113.580253601074, 24.5224494934082],
    },
  }
};

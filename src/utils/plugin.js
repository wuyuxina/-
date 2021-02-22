/**
 * Created by 朱明月 on 2019/6/11.
 */
var util_management = function () {
};
util_management.prototype = {
    constructor: util_management,

    /**
     * 判断参数是否合法
     * 如果是null/undefined/""/"null"/"undefined"返回true
     */
    isLegitimate: function (param) {
        if (param == null || param == undefined || param == "" || param == "null" || param == "undefined") {
            return true;
        } else {
            return false;
        }
        ;
    },

    /**
     * 判断参数是否合法
     * 如果是null/undefined/""/"null"/"undefined"返回true
     */
    legitimateParam: function (param) {
        if (param == null || param == undefined || param == "" || param == "null" || param == "undefined") {
            return "";
        } else {
            return param;
        }
        ;
    },

    /**
     * 判断参数是否合法,反回固定值
     * 如果是null/undefined/""/"null"/"undefined"返回true
     */
    legitimateParamByDefault: function (param, res) {
        if (param == null || param == undefined || param === "" || param == "null" || param == "undefined") {
            return res;
        } else {
            return param;
        }
        ;
    },

    /**
     * 判断参数是否合法,反回固定值
     * 如果是null/undefined/""/"null"/"undefined"返回true
     */
    legitimateByNoData: function (param) {
        if (param == null || param == undefined || param == "" || param == "null" || param == "undefined") {
            return "查无数据！";
        } else {
            return param;
        }
        ;
    },

    /**
     * 是否存在数组中
     * @arr要判断的数组
     * @value 要判断的元素
     */
    isinArr: function (arr, value) {
        var index = $.inArray(value, arr);
        if (index >= 0) {
            return true;
        }
        return false;
    },

    /**
     * 统一得到反回数据 resultData,如果错误直接弹出错误信息
     * @param data axios请求后返回的数据
     * @param _this
     * @returns {null|*}
     */
    getAxiosData: function (data, _this) {
        _this.loading = false;
        if (data.data.code == 200) {
            return data.data.resultData;
        } else {
            _this.$message.error(data.data.msg);
        }
        return null;
    },

    /**
     * 没有数据返回的请求
     * @param data
     * @param msg
     * @param _this
     * @param fun
     * @returns {null}
     */
    axiosNoResult: function (data, msg, _this, fun) {
        _this.loading = false;
        if (data.data.code == 200) {
            _this.$message.success(msg);
            if (typeof fun === "function") {
                fun.call();
            }
        } else {
            _this.$message.error(data.data.msg);
        }
        return null;
    },

    /**
     * 统一处理错误
     * @param msg
     * @param _this
     */
    errorAxios: function (msg, _this) {
        _this.loading = false;
        layui.use(['layedit', 'laydate'], () => {
            var layer = layui.layer
            layer.msg(msg)
        })
        // _this.$message.error(msg);

    },

    /**
     * 成功处理
     * @param msg
     * @param _this
     */
    successAxios: function (msg, _this) {
        _this.$message.success(msg);
    },

    /**
     * 把数组格式的数据按某个key分组返回json格式的数据
     * @param arr 转换前的数组格式数据 [{key:''}]
     * @param key 要分组的数组中某个key
     * @constructor
     * @returns {key:[]}
     */
    JSONgroupByKey: function (arr, key) {
        var res_group = {}, new_group = [];
        if (Array.isArray(arr) && arr.length > 0) {
            var map = {};
            for (var i = 0; i < arr.length; i++) {
                var group_key = arr[i];
                if (!map[group_key[key]]) {
                    new_group.push({"group": group_key[key], data: [group_key]});
                    map[group_key[key]] = group_key;
                } else {
                    for (var j = 0; j < new_group.length; j++) {
                        var j_group = new_group[j];
                        if (j_group.group == group_key[key]) {
                            j_group.data.push(group_key);
                            break;
                        }
                    }
                }
            }
            ;

            for (var i = 0; i < new_group.length; i++) {
                res_group[new_group[i]["group"]] = new_group[i]["data"];
            }
            ;
        }
        return res_group;
    },

    /**
     * json数组得到key类型的字符数组
     * @param jsonArr
     * @param key
     * @returns [jsonArr[1][key],jsonArr[2][key]]
     */
    jsonArrToArrBykey: function (jsonArr, key) {
        var arr = [];
        if (Array.isArray(jsonArr) && jsonArr.length > 0) {
            for (var i = 0; i < jsonArr.length; i++) {
                arr.push(jsonArr[i][key]);
            }
            ;
            return arr;
        }
        ;
        return arr;
    },

    /**
     * 数据置空
     * @param data
     * @returns {*}
     */
    dataIsEmpty: function (data, defaultData) {
        defaultData = defaultData || "";
        for (var key in data) {
            data[key] = defaultData;
        }
        return data;
    },

    //将图标转成黑色，默认转换区域48像素以内（为什么是48？因为第一次谷歌不支持，暂时不理为什么识别不了宽高，）
    grayImg: function (imgSrc, callback) {
        // var img = document.createElement("img");
        var img = new Image();
        img.src = imgSrc;
        var canvas = document.createElement("canvas");

        img.onload = function () {
            canvas.width = img.width == 0 ? 48 : img.width;
            canvas.height = img.height == 0 ? 48 : img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var c = ctx.getImageData(0, 0, img.width, img.height);
            for (var i = 0; i < c.height; i++) {
                for (var j = 0; j < c.width; j++) {
                    var x = (i * 4) * c.height + (j * 4);      //还有这个求像素点的式子为什么0,1,2 后面直接就是4,5,6     8,9,10？？？
                    var r = c.data[x];
                    var g = c.data[x + 1];
                    var b = c.data[x + 2];
                    c.data[x] = c.data[x + 1] = c.data[x + 2] = (r + g + b) / 3;
                }
            }
            ctx.putImageData(c, 0, 0, 0, 0, c.width, c.height);

            var dataURL = canvas.toDataURL();
            canvas = null;
            callback.call(this, dataURL);
        };


        /*    canvas.width = img.width==0?48:img.width;
            canvas.height = img.height==0?48:img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img,0,0);
            var c = ctx.getImageData(0,0,img.width,img.height);
            for(var i=0;i<c.height;i++){
              for(var j=0;j<c.width;j++){
                var x = (i*4)*c.height+(j*4);      //还有这个求像素点的式子为什么0,1,2 后面直接就是4,5,6     8,9,10？？？
                var r = c.data[x];
                var g = c.data[x+1];
                var b = c.data[x+2];
                c.data[x] = c.data[x+1] = c.data[x+2] = (r+g+b)/3;
              }
            }
            ctx.putImageData(c,0,0,0,0,c.width,c.height);

            return canvas.toDataURL();*/
    },

    //将图标转成红色，默认转换区域48像素以内（为什么是48？因为第一次谷歌不支持，暂时不理为什么识别不了宽高，）
    redImg: function (imgSrc, callback) {
        // var img = document.createElement("img");
        var img = new Image();
        img.src = imgSrc;

        var canvas = document.createElement("canvas");
        img.onload = function () {
            canvas.width = img.width == 0 ? 48 : img.width;
            canvas.height = img.height == 0 ? 48 : img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var c = ctx.getImageData(0, 0, img.width, img.height);
            for (var i = 0; i < c.height; i++) {
                for (var j = 0; j < c.width; j++) {
                    var x = (i * 4) * c.height + (j * 4);      //还有这个求像素点的式子为什么0,1,2 后面直接就是4,5,6     8,9,10？？？
                    c.data[x] = c.data[x + 1] = c.data[x + 2] = 255;
                    c.data[x + 1] = c.data[x + 2] = 0;
                }
            }

            ctx.putImageData(c, 0, 0, 0, 0, c.width, c.height);

            var dataURL = canvas.toDataURL();
            canvas = null;
            callback.call(this, dataURL);
        };
    },

    getBase64Img(imgSrc, callback) {
        var canvas = document.createElement("canvas");   //创建canvas DOM元素
        var ctx = canvas.getContext("2d");
        var img = new Image;
        img.crossOrigin = 'Anonymous';
        img.src = imgSrc;
        img.onload = function () {
            canvas.height = 14;
            canvas.width = 14;
            ctx.drawImage(img, 0, 0, 14, 14);
            var dataURL = canvas.toDataURL("image/png");
            canvas = null;
            callback.call(this, dataURL);
        };
    },


    /**
     * 判断是否为IE浏览器
     * @return true:IE   false:非IE
     */
    judgeBrowserIE: function () {
        var browser = this.getBrowser();
        if (browser.indexOf("IE") > -1) return true;
        return false;
    },

    /**
     * 得到浏览器类型
     */
    getBrowser: function () {
        var userAgent = navigator.userAgent;//取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) return "Opera";
        if (userAgent.indexOf("Firefox") > -1) return "Firefox";
        if (userAgent.indexOf("Chrome") > -1) return "Chrome";
        if (userAgent.indexOf("Safari") > -1) return "Safari";
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }
        ;//判断是否为IE浏览器
        if (userAgent.indexOf("rv") > -1) return "IE11";
    },

    /**
     * ztree树结构递归
     * @param data 树结构数据
     * @param parent Pid
     * @returns {Array}
     */
    filterArray: function (data, parent) {
        var tree = [];
        var temp;
        for (var i = 0; i < data.length; i++) {
            if (data[i].pId == parent) {
                var obj = data[i];
                temp = this.filterArray(data, data[i].id);
                if (temp.length > 0) {
                    obj.children = temp;
                }
                tree.push(obj);
            }
        }
        return tree;
    },


    //tree转array
    treeTolist: function (treeNodes, opt) {

        if (!opt) {
            opt = {};
            opt.key = "id";
            opt.parent = "pId";
            opt.children = "children";
            opt.nextChild = "nextChild";
        }


        var NodeList = [];


        function appenChildren(nodes) {

            for (var i = 0; i < nodes.length; i++) {

                var node = nodes[i];

                //如果没有上层节点那么就是根节点
                if (node.parentNode == null) {
                    node.Level = 0;
                    node[opt.parent] = 0;
                }
                //判断是否有子节点
                if (node[opt.children] && node[opt.children].length > 0) {
                    //所有子节点
                    for (var k = 0; k < node[opt.children].length; k++) {
                        node[opt.children][k][opt.parent] = node[opt.parent];
                        node[opt.children][k].Level = node.Level + 1;
                        node[opt.children][k].parentNode = node;
                    }
                    node["isParent"] = true;
                    node[opt.nextChild] = node[opt.children];
                    appenChildren(node[opt.children]);

                } else {
                    node["isParent"] = false;
                }


                if (node.hasOwnProperty("parentNode"))
                    delete node.parentNode;
                if (node.hasOwnProperty(opt.children))
                    delete node[opt.children];

                NodeList.push(node);

            }
        }

        appenChildren(treeNodes);

        return NodeList;

    },

    //根据key排序(倒序)
    sortByKey: function (arr, key) {
        var paramSort = arr.sort(function (a, b) {
            return b[key] - a[key];
        });
        return paramSort;
    },

    sortByKeyAsc: function (arr, key) {
        var paramSort = arr.sort(function (a, b) {
            return a[key] - b[key];
        });
        return paramSort;
    },

};

export function getMyUtil() {
    return new util_management();

}

/*eslint-disable*/
/**
 * 图片格式判断
 */
export function legitimateImage(param) {

    if (param == "jpeg2000".toLowerCase() ||
        param == "tiff".toLowerCase() ||
        param == "psd".toLowerCase() ||
        param == "png".toLowerCase() ||
        param == "swf".toLowerCase() ||
        param == "svg".toLowerCase() ||
        param == "pcx".toLowerCase() ||
        param == "dxf".toLowerCase() ||
        param == "wmf".toLowerCase() ||
        param == "emf".toLowerCase() ||
        param == "lic".toLowerCase() ||
        param == "fli".toLowerCase() ||
        param == "flc".toLowerCase() ||
        param == "eps".toLowerCase() ||
        param == "tga".toLowerCase() ||
        param == "bmp".toLowerCase() ||
        param == "jpg".toLowerCase() ||
        param == "jpeg".toLowerCase() ||
        param == "gif".toLowerCase()) return true;
    return false
};

/**
 * EXCEL表格文件格式判断
 */
export function legitimateExcel(param) {
    if (param == "xls".toLowerCase() ||
        param == "xlsm".toLowerCase() ||
        param == "xltx".toLowerCase() ||
        param == "xltm".toLowerCase() ||
        param == "xlsb".toLowerCase() ||
        param == "xlam".toLowerCase() ||
        param == "xlsx".toLowerCase()) return true;

    return false;
};

/**
 * 得到时分 hh:mm
 * @param param：日期字符串
 */
export function getHourMinute(param) {
    var date = this.strTrunDate(param);
    var res = this.getDateTimeByJson(date);
    return res.hh + ":" + res.mim;
};

/**
 * 字符转日期
 * @param param 字符串 yyyy/mm/dd hh:mm:ss 或 yyyy-mm-dd hh:mm:ss
 * @returns {Date}
 */
export function strTrunDate(param) {
    param = param.replace(/-/g, "/");
    return new Date(param);
};

/**
 * 将带时分秒的日期截取到日
 */
export function splitDateTimeByDay(param) {
    if (this.isLegitimate(param)) return "";
    return param.split(" ")[0];
};

/**
 * 计算时间差
 */
export function optionTime(date1, date2) {
    var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数

    var days = Math.floor(date3 / (24 * 3600 * 1000));

    var leave1 = date3 % (24 * 3600 * 1000);    		//计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    var leave2 = leave1 % (3600 * 1000);  	      	//计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    var leave3 = leave2 % (60 * 1000);	      		//计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    return {days: days, hours: hours, min: minutes, sec: seconds};
};

/**
 * 得到几天前或几天后的日期类型时间yyyy-mm-dd
 * @parma data 计算日期
 * @param day 要加上或减去的天数，正数加，负数为减
 * @returns {String}
 */
export function getDayBefore(data, day) {
    if (!(data instanceof Date))
        data = new Date(data.replace(/\-/g, "/"));
    var tmya = new Date(data.setDate(data.getDate() + day));
    return _this.getNowFormatDate(tmya);
};

/**
 * 得到几天前或几天后的日期类型时间yyyy-mm-dd
 * @parma data 计算日期
 * @param day 要加上或减去的天数，正数加，负数为减
 * @returns {String}
 */
export function getDayBeforeDate(data, day) {
    if (!(data instanceof Date))
        data = new Date(data.replace(/\-/g, "/"));
    return new Date(data.setDate(data.getDate() + day));
};

/**
 * 根据出生日期得到年龄
 */
export function getAgeByBirthday(str) {
    var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return "";
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
        var Y = new Date().getFullYear();
        return Y - r[1];
    }
    return "";
};

export function getDaysArr(startDate, endDate) {
    var days = [], sd = startDate.getTime(), ed = endDate.getTime();

    var day = 24 * 3600 * 1000;
    var length = (ed - sd + day) / day;
    for (var i = 0; i < length; i++) {
        days.push(this.getNowFormatDate(new Date(sd + day * i)));
    }
    return days;
};

/**
 * 得到日期类型时间yyyy-mm-dd
 * @param date 日期
 * @returns {String}
 */
export function getNowFormatDate(data) {
    var month = data.getMonth() + 1;
    if (month < 10)
        month = "0" + month;
    var day = data.getDate();
    if (day < 10)
        day = "0" + day;

    return data.getFullYear() + "-" + month + "-" + day;
};

/**
 * 得到日期类型时间yyyy-mm-dd
 * @param date 日期
 * @returns {String}
 */
export function getNowFormatDateByIE(data) {
    var month = data.getMonth() + 1;
    if (month < 10)
        month = "0" + month;
    var day = data.getDate();
    if (day < 10)
        day = "0" + day;

    return data.getFullYear() + "/" + month + "/" + day;
};

/**
 * 得到日期类型时间yyyy-mm-dd hh:MM:ss
 * @param date 日期
 * @returns {String}
 */
export function getNowFormatDateTime(data) {
    var month = data.getMonth() + 1;
    if (month < 10)
        month = "0" + month;
    var day = data.getDate();
    if (day < 10)
        day = "0" + day;
    var hour = data.getHours();
    if (hour < 10)
        hour = "0" + hour;
    var minute = data.getMinutes();
    if (minute < 10)
        minute = "0" + minute;
    var second = data.getSeconds();
    if (second < 10)
        second = "0" + second;

    return data.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
};

/**
 * 得到日期类型时间JSON {yyyy:yyyy, mm:mm, dd:dd, hh:hh, mm:MM, ss:ss}
 * @param date 日期
 * @returns {String}
 */
export function getDateTimeByJson(data) {
    var month = data.getMonth() + 1;
    if (month < 10)
        month = "0" + month;
    var day = data.getDate();
    if (day < 10)
        day = "0" + day;
    var hour = data.getHours();
    if (hour < 10)
        hour = "0" + hour;
    var minute = data.getMinutes();
    if (minute < 10)
        minute = "0" + minute;
    var second = data.getSeconds();
    if (second < 10)
        second = "0" + second;

    return {yyyy: data.getFullYear(), mm: month, dd: day, hh: hour, mim: minute, ss: second};
};


/**
 * 常量信息数据重组
 */
export function getContstant(old_con) {

    var contstant = {};

    for (var i = 0; i < old_con.length; i++) {

        for (var key in old_con[i]) {
            contstant[key] = old_con[i][key];
        }
        ;

    }
    ;

    return contstant;
};


export function pySort(a, b) {
    if (/^\d/.test(a) ^ /^\D/.test(b)) return a > b ? 1 : (a == b ? 0 : -1);
    return a > b ? -1 : (a == b ? 0 : 1);
};

/**
 * 计算天数差
 * @param sDate1 日期yyyy-MM-dd
 * @param sDate2 日期yyyy-MM-dd
 */
export function DateDiff(sDate1, sDate2) {
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
    return iDays;
};

/**
 * 计算小时差
 * @sHover1 传来的时间 hh:mm
 * @sHover2 小时差
 */
export function hoverDiff(sHover1, sHover2) {
    var startHoverDate = "2000/1/1 " + sHover1 + ":00";
    var t = new Date(startHoverDate);
    var t_s = t.getTime();

    t.setTime(t_s + 1000 * 60 * 60 * sHover2);
    return this.getDateTimeByJson(t);
};

export function hoverHalfDiff(h1, h2) {
    var sh1 = new Date("2000/1/1 " + h1 + ":00"), sh2 = new Date("2000/1/1 " + h2 + ":00");
    var s1 = sh1.getTime(), s2 = sh2.getTime();
    var to = (s2 - s1) / 1000;
    var hour = parseInt(to / (60 * 60));
    var afterHour = to - hour * 60 * 60;//取得算出小时数后剩余的秒数
    var min = parseInt(afterHour / 60);//计算整数分
    if (min >= 30) return hour + .5;
    else return hour;
};


/**
 * 根据key的值删除数据
 * @param arr 要删除的array
 * @param key 要删除数据的依据
 * @param id  要删除数据的值
 * @returns {*} 返回删除后数据
 */
export function arrayDelByKey(arr, key, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == id) {
            arr = arr.splice(i, 1);
            break;
        }
    }
    ;
    return arr;
};

/**
 * 数据去重
 * @param arr要去重的数组
 * @returns 去重后的数组
 */
export function distinctArr(arr) {
    var new_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if ($.inArray(arr[i], new_arr) == -1) new_arr.push(arr[i]);
    }
    ;

    return new_arr;
};

/**
 * 根据key的值查找数据
 * @param arr 要查找的array
 * @param key 要查找数据的依据
 * @param id  要查找数据的值
 * @returns {*} 返回第一个查找到的数据
 */
export function getDataByKey(arr, key, id) {
    var params = null;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == id) {
            params = arr[i];
            break;
        }
    }
    ;
    return params;
};

//递规得到树节点的第一个最后级的第一个子节点
export function recursionTree(treeData) {
    var __this = this;
    var r = [];
    getSubTree(treeData);

    function getSubTree(treeData) {
        if (Array.isArray(treeData)) {

            _do(treeData[0]);

        } else {

            _do(treeData);
        }
        ;
    }


    return r;

    function _do(_node) {

        if (!_node.isParent) {
            r.push(_node);

        } else if (r.length == 0) {

            getSubTree(_node.children);
        }
        ;
    };
};

//得到树的层数
export function getLayerNum(treeData) {
    var layer = 0;
    //if(treeData.isParent) each(treeData["children"], 1);
    if (treeData.hasOwnProperty("isParent")) each(treeData["children"], 1);
    else return 1;

    function each(data, floor) {

        for (var i = 0; i < data.length; i++) {
            if (floor > layer) layer = floor;
            if (data[i].hasOwnProperty("isParent")) each(data[i]["children"], floor + 1);
            //if(data[i].isParent) each(data[i]["children"], floor+1);
        }
        ;
    };

    return layer;
};

//ztree树结构递归
export function filterArray(data, parent) {
    var tree = [];
    var temp;
    for (var i = 0; i < data.length; i++) {
        if (data[i].pId == parent) {
            var obj = data[i];
            temp = this.filterArray(data, data[i].id);
            if (temp.length > 0) {
                obj.children = temp;
            }
            tree.push(obj);
        }
    }
    return tree;
};


//根据key排序(string)倒序
export function sortStrByKey(arr, key) {
    var paramSort = arr.sort(function (a, b) {
        return a[key].localeCompare(b[key]);
    });
    return paramSort;
};

//根据key字母排序
export function sortByKeyWord(arr, key) {
    var paramSort = arr.sort(function (a, b) {
        if (/^\d/.test(a[key]) ^ /^\D/.test(b[key])) return a[key] > b[key] ? 1 : (a[key] == b[key] ? 0 : -1);
        return a[key] > b[key] ? -1 : (a[key] == b[key] ? 0 : 1);

    });
    return paramSort;
};

//添加字母分组
export function insertGroupByKey(arr, key) {
    var new_group = [];
    if (Array.isArray(arr) && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            var param = arr[i];
            param.groupkw = arr[i][key].substr(0, 1).toUpperCase();
            new_group.push(param);
        }
        ;
    }

    return new_group;
};

//json转数组
export function jsonToArr(json) {
    var arr = [];
    for (var key in json) {
        arr = arr.concat(json[key]);
    }
    ;
    return arr;
};


/**
 * jsonArr根据key得到字符串
 * @param jsonArr 要提取字符的json数组
 * @param key 要组成的json数组的key
 * @param joinkey 分隔key
 * @returns strArr json[1][key]joinkeyjson[2][key]
 */
export function jsonArrGetStrByKey(jsonArr, key, joinkey) {
    if (Array.isArray(jsonArr) && jsonArr.length > 0) {
        var strArr = [];
        for (var i = 0; i < jsonArr.length; i++) {
            strArr.push(jsonArr[i][key]);
        }
        ;
        return strArr.join(joinkey);
    }
    ;

    return null;
};

/**
 * arr字符根据key转数组
 * @param strArr 要转换的字符数组
 * @param key 要组成的json数组的key
 * @returns jsonArr [{key:strArr[1]}, {key:strArr[2]}]
 */
export function strArrToJsonArr(strArr, key) {
    var jsonArr = [];
    if (Array.isArray(strArr) && strArr.length > 0) {
        for (var i = 0; i < strArr.length; i++) {
            var param = {};
            param[key] = strArr[i];
            jsonArr.push(param);
        }
        ;
    }
    ;
    return jsonArr;
};


//数组[{key1:val1, key2:val2},{key1:val1, key2:val2},{key1:val3, key2:val3}]根据某个key去重
export function arrDeduplicationByKey(arr, key) {
    var obj = {};
    arr = arr.reduce(function (item, next) {
        obj[next[key]] ? '' : obj[next[key]] = true && item.push(next);
        return item;
    }, []);
    return arr;
};


function maxDivisor(arr, origin) {
    this.arr = arr
    this.min = this._getMin(arr)
    this.maxDivisor = this._getMaxDiv()
    if (origin) {
        this.minMulti = this._getMinMulti();
    }
};

maxDivisor.prototype._getMin = function (arr) {
    var min = Infinity
    arr.forEach(item => min = (item && item < min) ? item : min)
    return min
};

maxDivisor.prototype._getMaxDiv = function () {
    var arr_maxdivi
    var self = this,
        arr = this.arr

    function maxDivisor(arr) {
        var min = self._getMin.call(null, arr)
        if (min === Infinity) {
            arr_maxdivi = 0
            return;
        }
        var exparr = arr.filter(item => (item !== min && item != 0))
        if (exparr.length === 0) {
            arr_maxdivi = min
            return;
        } else {
            var modearr = arr.map(item =>
                (item === min || item === 0) ? item : item % min
            )
            maxDivisor(modearr)
        }
    }

    maxDivisor(this.arr)
    return arr_maxdivi
};

maxDivisor.prototype._getMinMulti = function () {
    var arr = this.arr,
        arr_minMulti
    var totalmulti =
        arr.reduce((multi, curvalue) => multi * curvalue)
    if (totalmulti === 0) {
        return 0
    } else {
        var marr = arr.map((item) => totalmulti / item),
            b = new maxDivisor(marr, false)
        arr_minMulti = totalmulti / b.maxDivisor
        return arr_minMulti
    }
};

//最大公约数，最小公倍数
export function getDivisor(arr) {
    var res = new maxDivisor(arr, true);
    return res;
};

//求一数组的所占百分比
//arr所求的百分比,必传
//baseNum 求百分比的基数， 如果不传为数组的第一个数，
//basePercent 百分比的比数，传0-1之间的数，如baseNum是一个数的90%传.9，不传默认为100%
export function arrPercent(arr, baseNum, basePercent) {
    //var params = {arr: [0], baseNum: params.arr[0], basePercent: parseFloat(1)};
    baseNum = parseFloat(baseNum);
    basePercent = parseFloat(basePercent);
    baseNum = baseNum.toString() == 'NaN' ? arr[0] : baseNum;
    basePercent = basePercent.toString() == 'NaN' ? 1 : basePercent;

    var fullBaseNum = parseFloat(baseNum / basePercent).toFixed(2);
    let percentArr = [];

    percentArr = arr.map((val, index, arr) => {
        return {
            fix: parseFloat(val / fullBaseNum).toFixed(4),
            per: (parseFloat(val / fullBaseNum).toFixed(4) * 100) + "%"
        };
    });
    return percentArr;
};

/*eslint-disable*/
export function getTreeTransArray(tree, key) {
    return pub.treeTransArray(tree, key);
};

/*eslint-disable*/
export function getTreeTransLastArray(tree, key) {
    return pub.treeTransLastArray(tree, key)
};

var factorial = (function f(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * f(num - 1);
    }
});


//得到行数
export function getListList(list) {
    //    var nl = list.map((item, index, arr) => {
    //        if(!item.isParent) return item;
    //      });
    var nl = [];
    for (var i = 0; i < list.length; i++) {
        if (!list[i]["isParent"]) nl.push(list[i]);
    }
    ;
    return nl;
};

//tree转array
export function treeTolist(treeNodes, opt) {

    if (!opt) {
        opt = {};
        opt.key = "id";
        opt.parent = "pid";
        opt.children = "children";
        opt.nextChild = "nextChild";
    }


    var NodeList = [];


    function appenChildren(nodes) {

        for (var i = 0; i < nodes.length; i++) {

            var node = nodes[i];

            //如果没有上层节点那么就是根节点
            if (node.parentNode == null) {
                node.Level = 0;
                node[opt.parent] = 0;
            }
            //判断是否有子节点
            if (node[opt.children] && node[opt.children].length > 0) {
                //所有子节点
                for (var k = 0; k < node[opt.children].length; k++) {
                    node[opt.children][k][opt.parent] = node[opt.parent];
                    node[opt.children][k].Level = node.Level + 1;
                    node[opt.children][k].parentNode = node;
                }
                node["isParent"] = true;
                node[opt.nextChild] = node[opt.children];
                appenChildren(node[opt.children]);

            } else {
                node["isParent"] = false;
            }


            if (node.hasOwnProperty("parentNode"))
                delete node.parentNode;
            if (node.hasOwnProperty(opt.children))
                delete node[opt.children];

            NodeList.push(node);

        }
    }

    appenChildren(treeNodes);

    return NodeList;

}


//树递规
/*eslint-disable*/
var pub = {
    // tree 为当前树的数据源  key为父节点key值
    treeTransArray: function (tree, key) {
        return tree.reduce(function (con, item) {
            //var callee = arguments.callee;
            var callee = factorial;
            con.push(item);
            if (item[key] && item[key].length > 0)
                item[key].reduce(callee, con);
            return con;
        }, []).map(function (item) {
//            item.node = item[key];

            return item;
        });
    },

    //只要最后子节点
    treeTransLastArray: function (tree, key) {
        return tree.reduce(function (con, item) {
            var callee = arguments.callee;
            //var callee = factorial;
            con.push(item);
            if (item[key] && item[key].length > 0)
                item[key].reduce(callee, con);
            return con;
        }, []).map(function (item) {
//            item.node = item[key];
            if (item[key]) item["isParent"] = true;
            else item["isParent"] = false;
            return item;
        });
    },


    //数组转树
    // list 数组数据源 ,key 对应父节点id字符串
    arrayTransTree: function (list, key) {
        var tree = list.filter(function (parent) {
            var branchArr = list.filter(function (child) {
                return parent.id == child[key];
            });
            parent.nodes = [];
            if (branchArr.length > 0) {
                parent.nodes = branchArr;
            }
            return parent[key] == "";
        });
        return tree;
    }

}






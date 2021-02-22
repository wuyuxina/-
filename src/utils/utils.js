
/**
 * author: lihaoyan
 * creation time: 2019-10-11
 * module: 公共函数
 * description: 开发者将项目中用到的公共函数放置于此，并做好注释与维护
 */
export default {
  install(Vue, options) {
    // 字符串去除首位空格
    Vue.prototype.$sub = function (val) {
      return val.substring(Math.max(val.search(/\S/), 0), val.search(/\S\s*$/) + 1)
    }

    /**
     * 按照指定的长度生成随机的字符串
     * @param {Number} n 默认为5
     */
    Vue.prototype.randomString = function (n) {
      let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let temp = '',
          len = str.length;

      n = n ? n : 5;

      for (let i=0; i<n; i++) {
        temp += str.charAt(Math.floor(Math.random() * len));
      }
      return temp
    }

    /**
     * @desc 防抖
     * @author lihaoyan
     * @time 2019-12-20
     * @param e 事件
     * @returns {boolean}
     */
    Vue.prototype.debounce = function (fn, delay = 500) {
      let timer = null
      return function (...args) {
        clearTimeout(timer)

        timer = setTimeout(() => {
          fn.apply(this, args)
        }, delay)
      }
    }

    /**
     * @desc 阻止冒泡事件和默认行为
     * @author lihaoyan
     * @time 2019-12-20
     * @param e 事件
     * @returns {boolean}
     */
    Vue.prototype.stopBubbleAndDefault = function (e) {
      e = e || window.event;
      if (e.preventDefault) {
        // Firefox
        e.preventDefault();
        e.stopPropagation();
      } else {
        // IE
        e.cancelBubble = true;
        e.returnValue = false;
      }
      return false;
    }

    /**
     * @desc 停止冒泡事件
     * @author lihaoyan
     * @time 2019-12-20
     * @param e 事件
     * @returns {boolean}
     */
    Vue.prototype.stopBubble = function (e) {
      // 阻止默认浏览器动作(W3C)
      if (e.stopPropagation) e.preventDefault();
      // IE
      else e.cancelBubble = true;
    }

    /**
     * @desc 阻止默认行为
     * @author lihaoyan
     * @time 2019-12-20
     * @param e 事件
     * @returns {boolean}
     */
    Vue.prototype.stopDefault = function (e) {
      // 阻止默认浏览器动作(W3C)
      if (e.preventDefault) e.preventDefault();
      // IE
      else e.returnValue = false;

      return false;
    }

    /**
     * @desc 将普通数组转化成树结构数据
     * @author lihaoyan
     * @time 2019-10-11
     * @param array 数组数据
     * @param root 根节点
     * @param rootId 父节点的键名（默认pId，可自定义）
     * @param childId 子节点的键名（默认id，可自定义）
     * @param parentIndexPath 父节点的索引路径（默认无）
     */
    Vue.prototype.parseArrayToTree = function (array, root, rootId, childId, parentIndexPath) {
      let tree = [];

      if (Array.isArray(array)) {
        // 节点父ID的键名默认为：pId
        if (!rootId) rootId = 'pId';
        // 节点本身ID的键名默认为：id
        if (!childId) childId = 'id';

        if (root) {
          for (let i = 0; i < array.length; i++) {

            if (array[i][rootId] == root) {
              let obj = array[i];
              let temp = [];

              obj.indexPath = tree.length + 1;
              obj.indexPath = parentIndexPath ? parentIndexPath + '-' + obj.indexPath : obj.indexPath + '';

              temp = Vue.prototype.parseArrayToTree(array, array[i][childId], null, null, obj.indexPath);

              if (temp.length > 0) {
                obj.children = temp;
              }

              // 有按钮信息时重组按钮数组
              if (obj.buttonList) {
                obj.buttonGroup = Vue.prototype.btnRegroup(obj.buttonList);
              }

              tree.push(obj);
            }
          }

          return tree;
        } else {
          return array;
        }
      } else {
        return [array];
      }
    };

    /**
     * @desc 数组去重
     * @author lihaoyan
     * @param array 要去重的数组
     * @param key 用以对比的对象键名
     */
    Vue.prototype.uniqueArr = function (array, key) {
      let result = [];
      let obj = {};

      for (let i = 0; i < array.length; i++) {
        if (key) {
          if (!obj[array[i][key]]) {
            result.push(array[i]);
            obj[array[i][key]] = 1;
          }
        } else {
          if (!obj[array[i]]) {
            result.push(array[i]);
            obj[array[i]] = 1;
          }
        }
      }

      return result;
    };

    /**
     * @desc 按按钮类别重组按钮信息
     * @author lihaoyan
     * @param btnArr 按钮数组
     * @returns {boolean}
     */
    Vue.prototype.btnRegroup = function (btnArr) {

      let newObj = {};
      let Base64 = require('js-base64').Base64;

      if (Array.isArray(btnArr) && btnArr.length > 0) {

        for (let j in btnArr) {
          if (btnArr[j].checked == 1) {
            if (newObj[btnArr[j].operLevel]) newObj[btnArr[j].operLevel].push(btnArr[j]);
            else newObj[btnArr[j].operLevel] = [btnArr[j]];
          }
        }
      }

      // sessionStorage.setItem('b', Base64.encode(JSON.stringify(newObj)));
      return newObj;
    };
    /**
     * @desc 判断是否有按钮权限
     * @author lihaoyan
     * @param code 按钮编码
     * @param level 按钮类型
     * @returns {boolean}
     */
    Vue.prototype.btnPermission = function (code, level) {
      let btnList = sessionStorage.getItem('b');
      let Base64 = require('js-base64').Base64;
      btnList = JSON.parse(Base64.decode(btnList));
      if (btnList) {
        btnList = btnList[level];
        if (Array.isArray(btnList) && btnList.length > 0) {

          for (let i in btnList) {
            if (btnList[i].operCode === code) {
              return true;
            }
          }
        }
      }

      return false;
    };

    /**
     * @desc 滚动鼠标使元素横向滚动
     * @author lihaoyan
     * @param container 需滚动的元素
     */
    Vue.prototype.scrollHorizontalByMouse = function (container) {
      // 判断浏览器
      let isIE = navigator.userAgent.match(/MSIE (\d)/i);
      isIE = isIE ? isIE[1] : undefined;
      let isFF = /FireFox/i.test(navigator.userAgent);

      // IE9以下的浏览器
      if (isIE < 9) {
        container.attachEvent('onmousewheel', function (e) {
          // 计算鼠标滚轮滚动距离
          let v = e.wheelDelta / 2;
          container.scrollLeft += v;

          // 阻止浏览器默认方法
          return false;
        })
      }
      // 除火狐外的现代浏览器
      else if (!isFF) {
        container.addEventListener('mousewheel', function (e) {
          // 计算鼠标滚轮滚动距离
          let v = -e.wheelDelta / 2;
          container.scrollLeft += v;

          // 阻止浏览器默认方法
          e.preventDefault();
        }, false);
      }
      // 火狐
      else {
        container.addEventListener('DOMMouseScroll', function (e) {
          container.scrollLeft += e.detail * 80;

          // 阻止浏览器默认方法
          e.preventDefault();
        }, false);
      }
    };

    /**
     * @desc 获取DOM元素的CSS属性值
     * @author lihaoyan
     * @param element DOM元素
     * @param attr CSS属性
     */
    Vue.prototype.getStyle = function (element, attr) {
      if (element.currentStyle) {
        let value = element.currentStyle[attr];

        if (value == 'auto' || value == '100%') {
          if (attr == 'width') {
            return element.clientWidth;
          } else if (attr == 'height') {
            return element.clientHeight;
          } else {
            return value;
          }
        } else {
          return value;
        }

      } else {
        return getComputedStyle(element, false)[attr];
      }
    };

    /**
     * @desc 格式化时间
     * @param tmm 需要格式化的时间   tmm为空 格式化当前时间
     * @param type 返回的时间格式 dateym年月格式  date年月日格式  dateTime年月日时分秒格式
     */
    Vue.prototype.$formatTime = function (tmm, type) {
      let date;
      if (tmm) {
        date = new Date(tmm);

      } else {
        date = new Date();
      }
      //年
      let year = date.getFullYear();
      //月
      let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
      //日
      let day = date.getDate() < 10 ? "0" + (date.getDate()) : (date.getDate());
      //时
      let hh = date.getHours() < 10 ? "0" + (date.getHours()) : (date.getHours());
      //分
      let mm = date.getMinutes() < 10 ? "0" + (date.getMinutes()) : (date.getMinutes());
      //秒
      let ss = date.getSeconds() < 10 ? "0" + (date.getSeconds()) : (date.getSeconds());
      let rq = '';
      if (type === 'date') {
        rq = year + "-" + month + "-" + day;
      } else if (type === 'dateym'){
        rq = year + "-" + month
      }else {
        rq = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
      }
      return rq;
    }
    /**
     * @desc 转换树结构 适合后端只给反id和pid的情况
     * @param  option  需要转换的树结构
     * @param  id 子节点id   pid：父节点id   pn 父节点数字
     */
    Vue.prototype.$optionData = function (option) {
      let cloneData = JSON.parse(JSON.stringify(option))
      return cloneData.filter(father => { // 循环所有项，并添加children属性
        let branchArr = cloneData.filter(child => father.id == child.pId); // 返回每一项的子级数组
        branchArr.length > 0 ? father.children = branchArr : '' //给父级添加一个children属性，并赋值
        return father.pId == 0; //返回第一层
      });
    }
       /**
     * @desc 转换树结构
     * @param  option  需要转换的树结构
     * @param  childId 子节点
     * @param  rootId 父节点
     * @param  pn 根节点父的id
     */
    Vue.prototype.$optionData1 = function (option,childId,rootId,pn) {
      let cloneData = JSON.parse(JSON.stringify(option))
      return cloneData.filter(father => { // 循环所有项，并添加children属性
        let branchArr = cloneData.filter(child => father[childId] == child[rootId]); // 返回每一项的子级数组
        branchArr.length > 0 ? father.children = branchArr : '' //给父级添加一个children属性，并赋值
        return father[rootId] == pn; //返回第一层

      });
    }
    /**
     * @desc 导出
     * @param  url  接口地址
     * @param  par  参数
     * @param  text  'xx'文件未生成提示字段
     */
    Vue.prototype.$beExport = function (url, par, text) {
      let self = this
      self.$axios.post(url, par, {
        responseType: "blob"
      }).then(res => {
        let file = res.data;
        self.spinShow = false
        //如果文件存在则下载，无则提示
        if (file) {
          let blob = new Blob([file]);
          let fileName = text + "信息.xls";
          //download：<a>标签属性，规定被下载的超链接目标，H5中的属性
          //这里判断创建的a标签是否具有download属性
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            navigator.msSaveBlob(blob, fileName);
          }
        } else {
          self.$Message.error(text + "信息文件未生成");
        }
      }).catch(error => {
        self.spinShow = false
      });
    }

    /**
     * @desc 公用文件导出
     * @author fengshuai
     * @time 2020-9-1
     * @param file 下载文件流
     * @param fileName 文件名称：字符串
     */
    Vue.prototype.$download = function (file, fileName) {
      if (!file) {
        this.$message.error('文件数据为空，无法下载')
        return false
      }
      let blob = new Blob([file])
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    };

    /**
     * @desc 公用文件导入
     * @author fengshuai
     * @time 2020-9-1
     * @param file 获取的input
     * @param url 接口地址
     * @param fd apend的文件
     */
    Vue.prototype.$fileUpload = function (file, url, fd) {
        let name = file.files[0].name
        let reg = /^(xls|xlsx)$/
        let self = this
        // let errorData = []
        name = name.split(".")
        name = name[name.length - 1]
        if (!reg.test(name)) {
          this.$message.error("文件格式错误")
          file.value = ""
          return
        }
        return new Promise((resolve, reject) => {
          this.$axios.post(url, fd, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            // if (res.data.code == 200) {
            //   errorData = res.data.resultData
            // }else{
            //   this.$message.error("文件导入有误,无法识别此类文件!")
            //   return
            // }
            resolve(res) //成功
            file.value = "";
          }).catch(error => {
            reject(error) //错误
          })
        })
      },
      /**
       * 转换年月日  datetime为"2019-11-06T16:00:00.000Z"这种格式的
       */
      Vue.prototype.$formateDate = function (datetime) {
        // let  = "2019-11-06T16:00:00.000Z"
        function addDateZero(num) {
          return (num < 10 ? "0" + num : num);
        }
        let d = new Date(datetime);
        let formatdatetime =  d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
        return formatdatetime;
      },
        /**
       * 转换时分  datetime为"2019-11-06T16:00:00.000Z"这种格式的
       */
      Vue.prototype.$taskDate = function (datetime) {
        let d = new Date(datetime);
        let formatdatetime = d.getHours()+ ':' + d.getMinutes() ;
        return formatdatetime;
      }
      /*
      * 获取开始时间和结束时间中的所有日期 starDay开始时间 endDay结束时间
      * */
      Vue.prototype.$getTwoTimeList=function getDayAll(starDay, endDay) {
    　　 let arr = [];
        let dates = [];
        // 设置两个日期UTC时间
    　　　let db = new Date(starDay);
    　　　let de = new Date(endDay);

        // 获取两个日期GTM时间
    　　　let s = db.getTime() - 24 * 60 * 60 * 1000;
    　　　let d = de.getTime() - 24 * 60 * 60 * 1000;

        // 获取到两个日期之间的每一天的毫秒数
    　　　for (let i = s; i <= d;) {
    　　　　　　i = i + 24 * 60 * 60 * 1000;
            arr.push(parseInt(i))
    　　　}
        // 获取每一天的时间  YY-MM-DD
        for( let j in arr ){
            let time = new Date(arr[j]);
            let year = time.getFullYear(time);
            let mouth = (time.getMonth() + 1)>=10?(time.getMonth() + 1):('0'+(time.getMonth() + 1));
            let day = time.getDate()>=10?time.getDate():('0'+time.getDate());
            let YYMMDD = year + '-' + mouth + '-' + day;
            dates.push(YYMMDD)
        }
        return dates
      }
      /*
      * 寻找两个数组中相同的元素 并返回 arr1 arr2
      * */
      Vue.prototype.$getArrEqual=function (arr1, arr2) {
           let newArr = [];
           for (let i = 0; i < arr2.length; i++) {
            for (let j = 0; j < arr1.length; j++) {
                if(arr1[j] === arr2[i]){
                    newArr.push(arr1[j]);
                }
              }
            }
           return newArr;
          }
    //对数组进行排序
    //  property = 要根据数组中的sort进行排序   value1 - value2
    Vue.prototype.$compare = function (property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    }
  }
}

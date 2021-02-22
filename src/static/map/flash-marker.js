(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.FlashMarker = factory());
}(this, (function () { 'use strict';


    function CanvasLayer(options) {
        this.options = options || {};
        this.paneName = this.options.paneName || 'labelPane';
        this.zIndex = this.options.zIndex || 0;
        this._kjf_map = options.map;
        this._lastDrawTime = null;
        this.show();
    }

    CanvasLayer.prototype.initialize = function () {
        var _zt_map = this._kjf_map;
        var canvas = this.canvas = document.createElement('canvas');
        var ctx = this.ctx = this.canvas.getContext('2d');
        canvas.style.cssText = 'position:absolute;' + 'left:0;' + 'top:0;' + 'z-index:' + this.zIndex + '; pointer-events: none;';
        this.adjustSize();
        this.adjustRatio(ctx);
        _zt_map.getViewport().appendChild(canvas);
        var that = this;
        _zt_map.getView().on('propertychange',function(){
            $(canvas).hide();
        });
        _zt_map.on("moveend",function(){
            $(canvas).show();
            that.adjustSize();
            that._draw();
        });
    };

    CanvasLayer.prototype.adjustSize = function () {
        var size = this._kjf_map.getSize();
        var canvas = this.canvas;
        canvas.width = size[0];
        canvas.height = size[1];

        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';1
    };

    CanvasLayer.prototype.clearCanvas = function (){
        var size = this._kjf_map.getSize();
        var ctx = this.ctx = this.canvas.getContext('2d');

        // var ctx = this.canvas.getContext('2d');

        var width = size[0];
        var height = size[1];
        ctx.clearRect(0,0,width,height);


    }

    CanvasLayer.prototype.adjustRatio = function (ctx) {
        var backingStore = ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        var pixelRatio = (window.devicePixelRatio || 1) / backingStore;
        var canvasWidth = ctx.canvas.width;
        var canvasHeight = ctx.canvas.height;
        ctx.canvas.width = canvasWidth * pixelRatio;
        ctx.canvas.height = canvasHeight * pixelRatio;
        ctx.canvas.style.width = canvasWidth + 'px';
        ctx.canvas.style.height = canvasHeight + 'px';
        ctx.scale(pixelRatio, pixelRatio);
    };

    CanvasLayer.prototype.draw = function () {
        var self = this;
        var args = arguments;

        clearTimeout(self.timeoutID);
        self.timeoutID = setTimeout(function () {
            self._draw();
        }, 15);
    };

    CanvasLayer.prototype._draw = function () {
        var _zt_map = this._kjf_map;
        var size = _zt_map.getSize();
        var center = _zt_map.getView().getCenter();
        if (center) {
            var pixel = _zt_map.getPixelFromCoordinate(center);
            this.canvas.style.left = pixel[0] - size[0] / 2 + 'px';
            this.canvas.style.top = pixel[1] - size[1] / 2 + 'px';
            this.options.update && this.options.update.call(this);
        }
    };

    CanvasLayer.prototype.getContainer = function () {
        return this.canvas;
    };

    CanvasLayer.prototype.show = function () {
        this.initialize();
        this.canvas.style.display = 'block';
    };

    CanvasLayer.prototype.hide = function () {
        this.canvas.style.display = 'none';
    };

    CanvasLayer.prototype.setZIndex = function (zIndex) {
        this.canvas.style.zIndex = zIndex;
    };

    CanvasLayer.prototype.getZIndex = function () {
        return this.zIndex;
    };

    var global = typeof window === 'undefined' ? {} : window;

    var requestAnimationFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame || global.webkitRequestAnimationFrame || global.msRequestAnimationFrame || function (callback) {
            return global.setTimeout(callback, 1000 / 60);
        };

    function Marker(opts) {
        this.city = opts.name;
        this.location = [opts.lnglat[0], opts.lnglat[1]];
        this.color = opts.color;
        this.type = opts.type || 'circle';
        this.speed = opts.speed || 0.15;
        this.size = 0;
        this.max = opts.max || 20;
        this._marker_map = opts._map;
    }

    Marker.prototype.draw = function (context) {
        context.save();
        context.beginPath();
        switch (this.type) {
            case 'circle':
                this._drawCircle(context);
                break;
            case 'ellipse':
                this._drawEllipse(context);
                break;
            default:
                break;
        }
        context.closePath();
        context.restore();

        this.size += this.speed;
        if (this.size > this.max) {
            this.size = 0;
        }
      /*if (this.size > this.max) {

      } else {
        this.size += this.speed;
      }*/
    };

    Marker.prototype._drawCircle = function (context) {
        var pixel = this.pixel||this._marker_map.getPixelFromCoordinate(this.location);
        context.strokeStyle = this.color;
        //alert(this.color);
        context.moveTo(pixel[0] + pixel.size, pixel[1]);
        context.arc(pixel[0], pixel[1], this.size, 0, Math.PI * 2);
        context.stroke();
    };


    function FlashMarker(_zt_map, dataSet) {
        var parent = this;
        this.animationLayer = null;
        this.ischild = true;
        this._map = _zt_map;
        var width = _zt_map.getSize()[0],
            height = _zt_map.getSize()[1],
            animationFlag = true,
            markers = [];

        var addMarker = function addMarker() {
            if (markers.length > 0) return;
            markers = [];
            for (var i = 0; i < dataSet.length; i++) {
                markers.push(new Marker(dataSet[i]));
            }
        };

        //上层canvas渲染，动画效果
        var render = function render() {

            if (!parent.animationLayer) {
                return;
            }

            var animationCtx = parent.animationLayer.canvas.getContext('2d');
            if (!animationCtx) {
                return;
            }

            if (!animationFlag) {
                animationCtx.clearRect(0, 0, width, height);
                return;
            }

            addMarker();

            animationCtx.fillStyle = 'rgba(0,0,0,.95)';
            var prev = animationCtx.globalCompositeOperation;
            animationCtx.globalCompositeOperation = 'destination-in';
            animationCtx.fillRect(0, 0, width, height);
            animationCtx.globalCompositeOperation = prev;

            for (var i = 0; i < markers.length; i++) {
                var marker = markers[i];
                marker.draw(animationCtx);
            }
        };

        //初始化
        var init = function init() {
            parent.animationLayer = new CanvasLayer({
                map: _zt_map,
                update: render
            });

            (function drawFrame() {
                requestAnimationFrame(drawFrame);
                render();
            })();
        };

        init();

    }

    FlashMarker.prototype = {
        constructor: FlashMarker,
        myclear: function() {
            //console.log(this.animationLayer);
            //this.animationLayer.hide();
            clearTimeout(this.animationLayer.timeoutID);
            if(this.ischild) this._map.getViewport().removeChild(this.animationLayer.canvas);
            this.ischild = false;
        }
    };
    return FlashMarker;

})));

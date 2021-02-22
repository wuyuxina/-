goog.provide('gis.ZMapEventType');
goog.provide('gis.ZMapEvent');
goog.provide('gis.ZMap');

//goog.require('goog.events');
//goog.require('goog.events.Event');
//goog.require('goog.events.EventType');
//goog.require('goog.dom');
//goog.require('goog.dom.TagName');

goog.require('goog.object');
goog.require('goog.uri.utils');


/**
 * @enum {string}
 */
gis.ZMapEventType = {


};

gis.ZMapEvent = function(type, map, opt_frameState) {

	//goog.base(this, type);

	/**
	 * The map where the event occurred.
	 * @type {gis.ZMap}
	 * @api stable
	 */
	this.map = map;

	/**
	 * The frame state at the time of the event.
	 * @type {?olx.FrameState}
	 * @api
	 */
	this.frameState = opt_frameState !== undefined ? opt_frameState : null;

};
//goog.inherits(gis.ZMapEvent, goog.events.Event);


/**
 * @enum {ol.layer.Tile}
 */
gis.TileMap = {
}

/**
 * @type {Array>}
 * @const
 */
gis.UUID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

/**
 * @type {String>}
 * @const
 */
gis.BASE64_ENCODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * @type {Array>}
 * @const
 */
gis.BASE64_DECODE_CHARS = new Array(
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
	-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
	-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

/**
 * @type {string>}
 * @const
 */
gis.VERSION = "0.1.0";

/**
 * @type {Number>}
 * @const
 */
gis.SINGLE_CLICK_FEATURE_COUNT = 5;

/**
 * @type {string}
 * @const
 */
gis.DEFAULT_PROJECTION = "EPSG:3857";

/**
 * @type {Array>}
 * @const
 */
gis.DEFAULT_CENTER = [12957262.1151473,4853917.2936334];


/**
 * @type {string}
 * @const
 */
gis.PROXY_URL = "MapService?url=";


/**
 * @type {Ember.Controller}
 */
gis.EMBER_CONTROLLER = null;


gis.OL_ZOOMSLIDER_BG_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABfCAYAAADh/UfYAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAuklEQVRYhe3WMQvDIBQE4KMUAi4ho784U36now4hCMq77iXShhL6hnvgpHyDx8EDSbyfdV0t58zeO1trTClx27Z+9vaJweSc0VoDSZRSRs/GQIwR0zSBJEIIQ+Axuqi1wsxgZtj3/Trw7fwfOP3E4zh+SyGEoBQujLrgAbgvhWVZMM/zxxSGAACYGUgqBXXhfkApeACUggdAO5IHQF3wAGhH8gCoCx4ApeABUAoeAO1IHgB1wQOgHQl4AU863752Sv6fAAAAAElFTkSuQmCC";

gis.OL_ZOOMSLIDER_THUMB_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAA9klEQVQokZ2SMUsDYQyGn8QPWtwEuVE3r9Sxv8HV6uzs7qjg0M3VH9HNQRB/QldHOSfFrYLgdt+d9hIHe9KWA70+EAghIXnDK5ej0UGn071S1QGAO4gACODU+LxS5272UJbFRdDu5vh4eJjs91La8Jg9DW7u7sc6qyTpp3u4e6vo91I+K5JQILj73ysbKB20qNaaBaAwIURbviDcvoICNi+s5LPh7m9vNCHk3iDBaMZY6s1dCHFFwtfRzr8lRIMQXdd+Yl4Jmtt6wwDRQfPKp5PspbUPJtkz0Xwq6en5iW4l164b27WURcuKyI+/FxFBzN7t4+3sGwrHshxXorgFAAAAAElFTkSuQmCC";

gis.OL_ZOOM_OUT_0_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAxElEQVQ4je3SMQqDQBAF0Bl3S7HZ4AY8hl4hN7JJYyFI2hzBwuOYK2glCMbOQpGdTRuCGpIJaZJfzjCPXwzmeX5wXfckhAiBEWPMZRiGo/Q8r4iiyA+CgONB0zRhWZaFRERfaw3zPLNArTUgou8AAFhrWdi94bClh/xBfuTaIk3TzcMkSRbn32uYZdnm4TRN6+DSY4/j+FKzp+C7kQAARPRZ8McaElHbdd1eKcWC+r4HImplVVWxtfYshNhxQGPMta7r+AbAq1Naqkv7WgAAAABJRU5ErkJggg==";

gis.OL_ZOOM_OUT_1_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAA00lEQVQ4je3SMQ6CQBAF0Bl3CwtCg2FNaOw8AFzBi9jZ03gCW09gKDgOXgFsSEiQjgJCdsbGwihIcO30V5PszssvBqMo2liWdRBC+GAQrfW5ruu9tG07DoLA9TzPxIM8z/0kSWKJiK5SCrquMwKVUoCI7gwAgJmNsEdjZiw95Q+aRw49zE+X+8QAgC9zs1317k1siKM/Bhvybv12sW3bYbDvsJumGW0zCfw0EgCAiL4L/lhDIirKslw6jmMEVVUFRFTINE1DZj4KIRYmoNb6mmVZeANo31Vbl4bQ+wAAAABJRU5ErkJggg==";

gis.OL_ZOOM_IN_0_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAA80lEQVQ4jcXRQYqDMBQG4PeaLMWNgyl4jHqF3qibIrgISLdzBBc9jr2CroSCdRdBkbzMaoZ2mtaUlJl/FV6SLy8JlmW5DYLgwBjbgEe01iel1J6HYXhM0zROksTHg7ZtN1VVHTkixkIImOfZCxRCACLGKwAAY4wXdm2svKVf+R9QSglSyru67am8OkTE94K28EcTtite1/I8t+77uw6LovgZZ1l2V5um6TFo+61xHJ1qzqAtLus4AAARPV30fdVhGNzApZOVUovQDbjU4St56Q2dQCI6d123jqLIC+r7HojozOu63hljPhljHz6g1vrSNM3uCxn3axu2l7DNAAAAAElFTkSuQmCC";

gis.OL_ZOOM_IN_1_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAABFklEQVQ4jcWTMW6DMBSG/xczMCAWKlyJqVMPEK6Qi2TrnqUn6NqtG2LIcegBskAWpEiUzUggZLtDEjUkJDh1pT7JkvXb/vT/z3qUpunC87w3xtgcFiWl/BRCvDq+76/jOA6jKLLhoSzLeZZla4eIQs45+r63AnLOQUThDAC01lawU8bMmnRW/wN0ky3cZHuhj7XK0OF4j4not0Dzcq4d7CNqAHRYgJsUh71Gu3wafTfh8DTSEa7PdEOH+uX5B/uxAUADreu668Cx32rb9sLdULvhcHpS9hFNJsoBAKXUzUvHqE3T/I1DIcQkaACccnhPGfbwDqBSaldV1WMQBFaguq6hlNo5eZ6vtNbvjLEHG6CU8qsoitU3DktxHmvRwrAAAAAASUVORK5CYII=";

gis.OL_NAVIGATION_BG_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAGCklEQVRogdWazXMSdxjHv+wLuxtedsEESLJEkpAJxXRsHPViDtFT73WmVw/17MU/w4tnO6NHM2PP9VbTptXONLHqTCQVE8JLAgQICwsL7LLbg9lIlBiIMdt+Tgyww+d55mH3t7/v2gzDQL8sLDzefx2JjF9pNJo3FKU532qpg7WawquqZvvwGJqmDIeDk+x2usBxzBOWZR7EYhu/m59///23fXvY+pHvlA6FRu5JknxdkmSBYezgeQc8Hh4ejxtutwMsawdJktB1HYrShCTJ2N2toFgsQ5braDRaEARXmeedjxKJrZvHKaIn+U5pUfQ/KRalK5qmUaLox+RkEDzv7PkHTXZ3K4jHk8jlSiBJQvN6+aV0One1nwKOlDfFw+GxW5lM/o6qqlQ0OoGpqbN9C3ej2Wzh7ds03rzZBE3T2uio73Y8nrwLHF3EJ+VN8eHhoZV8vjgbDAYQjU6C45gTEe+k2Wzh5cs3SKWyCAQGn29v71wAPl3AofILC48RiYyfzWTyr3Vd586fn8bw8OCJS3ei6zpSqRxWV9dBkoQyOur7Khbb2DysgI/kzW5HoxNj6XQupusGNz9/EQxj/6LinchyHYuLy6BpSgkG/ZHV1fVktwKIbgdHIuNnU6lcjGUZbm5u9lTFAcDpHMC1a5fAMDSXTudi0ejEWOdJw+RA580vuFyOuq7r3Pz8RbDsyc93r1SrNTx9+hIAlGq1NgAc/A981Pnh4aEVANzc3Kyl4gDgcjlw+fIMms0Wt+d1gH35hYXHCIfHbmWzhdmvvw7D6Rw4XdNDEAQXZmcjyGYLs+Hw2K3O8bEZhrE/LhzHqkNDAnXx4jnYbB9d4S3lzz9foVSStHq9QQPvxme/86Lo/0VVVerCheh/ThwAZmbCaLVUShT9v5jv2R4+/BkAMDDAqhMTIjU9HbLK70hevPgHmUxOU5QmDezNfCg0cq/d1qnJyaC1dkcwMxNGo9GiQqGRH4E9eUmSr4uiDxRFWmt3BCRJIBAYhCTJ3wEAEYmMXymXq0IoNGq1W0+Ew0GUy1UhEhm/QjQazRsMY4cguKz26gmfzwuKItFoNG8QitKcP8563ErcbgcUpTlPtFrqoMfjttqnLwTBjVZLHSRqNYX/v8l7PC7UagpPqKpm+7+NjSC4oKqajQDwRe6MviQM886XMAwDBNF1Wf+fhSTf+RIAoKqapTL90m7rAPbkNa1tqUy/1OsKAICgacqQJNlinf6QJBk0TRmE0zkgZbMFq336oliU4HBwEmG304VyuWK1T19UKjLsdrpAcByzWKnUoOu61U49oWltyHIdHMc8IViWua9pbRSLktVePbGzU4KmtcGyzH0iFtv4XRBc5c3NLau9eiKZzEIQXOVYbOMPAgB43vloe7uARqNltdsnkeU68vkSeN75CNg7zycSWzcpitTW19PW2h1BPJ4CRZGauZ9PmDtQXi+/tL6eRq2mWCp4GLJcRyqVhdfLLwEfbH2k07mrJEloq6tvrTM8hHZbx8rKa5AkoZkBBLA3Nmb3R0Z8tzOZPFKprEWa3UkkMigUyhgd9d8G3vseWE7G48m7Pt+Zv1dWXqNSqVmg+TG7uxXEYhsIBAafx+PJu103Ws03t7d3ZjmOVZaXVy2ff1mu49mzV7DbacVMSjo50HmzgLGxwLSqaspvv62gXm+ckupBJEnG0tJzkCShiKI/0uln0jXW6Yx0CMLGXbo0c6zE77iUShKWl1cBQBHFPpMRAIjFNjaDQX/EMAzl11+XcVrXgERiC4uLf8EwoASDgenDxIHe08Dn2Wzhm+HhIZw7Nwm323Hi0pJUxYsXb1As7sLv/8w00KQzh93ayt9pt3VKFP2YmhqDw8F9trSiNLG2lkAyuQ2aprSRkRPKYT8sAHi3j18qSXOqqlE+nxeTk0F4vfz+TXGv5PMlrK0lsLOzC5ZltDNn3ifgvYj3LN+tCPPZg3K5KtA0BaeTgyC44fW6wfMuDAywsNls0LQ2FKUBSZJRKkkol6uoVmtot3V4PO4yzzt/SiS2fuhH+ljy3Yo45lMfiwxjf7C2lthfpxyHfwFdxOhDgsTJiwAAAABJRU5ErkJggg==";

gis.OL_NAVIGATION_FULL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAADLUlEQVQ4jVWTS2tcZQCGn3ObM5PMZGZyq0mYkJbSlLaJIaYtGhNQIhHRhSBFoQhx4c6s/AmShRsXliIINuClZFMoCC3VqrWxkpKLU7WJTmqMTBIn00wyJ8mZc/m+87lpJX2XLw8P7+bVlFIczPj02BDwHnAaaAFMoArMqEhd/Hh48vpBXnssGJ8eM4FJ4I3XOkfsxkQLVbceNwAhPQQlbq5fE1LIb4SQ5z57ZWrvf8H49JgFfD/QcnJwNPcijmfjE1BwNGLKZsuNUCIgwT4b/m1m12bviVAMXz53tao/WjLZ33xscKh9gIoMCHUNIXRqIoZLjIpvs+klKO7E6EyeYaCtuzfww8sARmVk9Xngw/PHXjV+lftsUMONBHtekopv4XhQKO5S3dvHbnyIli7wbPNxbt6/e+TzmUt54+w7fR+Ndpw9pRkJNnQB6hDtMsVcyaDm6dwv7hHFK9hdS/gNBcrRNua25FRTTp/7e6nRBE53NnSw4K5TjuucMI4SIVgtBXhejXSbwmm8wXK0A74iI2wKmz4jh/sJfdFjAk11Zj2r7jqbvkuq7gg7QQPb2xHplhqtWZey7MPx89hql93yFpWdOlKJFGEgMqZSStMUBL6DIodpSa79HKIlkmwsh+iqgfbWGilnCGctxGOWMFgBpRBCaKYUUcUJnI4mI0Mq/jTFsokXWsTiNvHWQzz4awvvbgYij3SrRaa+g7SxSWW/ihRRVRehmF+p/MPRuhzrpZ+IrDVihkfouYShSSyZxW5MYMZ1LE1iBGXa25pZWVsBWNTDQFy4snhLdCVbMN01qg/vkM36mMLH0hS2bmAGPtlckXTrj+i1P+jr7OHit1cU8Kmx8NXvD6byXw54tf3uZ9pPUHFd4vZhopqBbVtYmsASO6Trv4Z/t+g/eZyFP39juVS8NT+Rf98ECP3w/A+FX6b9WtD7cv8wS5smRlUhtF3CSIekJNfVRXdvF9/N3eH6vZkC8NYTZxq98EJKhGJKhPKltwfHTORTKFWHpms0ZxxKW/N8cuOqBG4Db85P5EtPCB7nuQ/OvC6FfFfKqCeSUfZRXQUWgUvzE/kvDvL/AcQemX1wXHn8AAAAAElFTkSuQmCC";

gis.OL_NAVIGATION_TOP_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAdUlEQVQokWP8//8/A7mAiWydQ1czCzJHXl4eRfJRxa7/DAwMDHIdbozI4g8fPsRvM0wjA8N/JDYqwKoZm2JsYhiaH1XshCuS63BjlOtwZ2Rg+A91wU4UAxiREwnj9JsoGnHZ/D9TnRGLzf+xakQVQ7JsBCZPALLnMzVa2CQ9AAAAAElFTkSuQmCC";

gis.OL_NAVIGATION_DOWN_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAjklEQVQokdWSQRKDMAwDV6R/CX2aX5SvQf9CxIEwMEDbGW74llgreZzINneru00+F37tDyqDQQDJkWu7w9Gj8gFsMI5eF8laVz+pjB3QQDUQmnlTH55KZZhAq2mCWnemwFsOX8OLwThtU3mXluXYdKeFqYw4cgLqoSPH0v869sGottjOkU/Cn/C/eugPmwGTyT2Bp9YqzAAAAABJRU5ErkJggg==";

gis.OL_NAVIGATION_LEFT_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAm0lEQVQokaWS0Q0DIQxDbcousBoTZTXYpeD7AFUnAe31Lj9IoGebJJSEu+Vuk09h/+2RVgigAYJS5E9nWhknAeg9btfiq4YNgXoS90qhXo19Bl89+lwTTCtt5NRwXILAutvsnKAUGi3v2CXsuzFJy1Up/gVX9H8CgKOVqVGfiLv1pGXXhQgAUgqT0XbOSrEBHAm0HPTW+Uo92u0DbQE5jkoao6oAAAAASUVORK5CYII=";

gis.OL_NAVIGATION_RIGHT_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8xNy8xN1PIWaEAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAlElEQVQokcWTUQ6DIBBE36jtVerVPBFXk7OgTj/ApqmSqP1wkiVkw5vZQJBtrqq5TP4Ld3tNhdEgA42H19lklcUpm8UzMM9i0inEVEuvwQl4lH2nENNhuCRNPwbzIVhhLAaewOTanq0k9ygIYM6XJ76m+Gj3qbLGGbyat8ByCFaIyxoHbj30G7A6NriAqoIAuu1jvAGoqjKSGmQuoAAAAABJRU5ErkJggg==";

/**
 * @classdesc
 *
 * Created: 2020-3
 * @author:
 * @param {Object} options Map options.
 */
gis.ZMap = function(options) {

	this.wktFormat = new ol.format.WKT();

	this.jsonFormat = new ol.format.GeoJSON();

	//--tooltip
	this.featureTooltipElement = null;
	this.featureTooltip = null;

	//--infoWindow
	this.infoWindowElement = null;
	this.infoWindow = null;
	this.infoWindowCloseButton = null;
	this.infoWindowCloseCallBack = null;
	//-
	this.preZoom = 10;
	this.zoomChangeFunction = null;

	//--wms getFeatureInfo callBack
	this.featureInfoLayers = [];
	this.featureCount = 5;
	this.featureInfoFormat = "geoserver";
	this.featureInfoFunction = null;
	//--
	this.callBackTarget = null;

	this.moveEndCallBack = null;

	this.baseMapLayers = [];
	this.baseBarVisible = false;

	this.popupContentID = "popup-content_"+this.getUUID(8,16);
	this.popupCloserId = "popup-closer_"+this.getUUID(8,16);

	//==================pointermove feature=====================
	this.selectPointerMove = null;

	//==================draw feature=====================
	this.featureSelect = null;
	this.featureSelectStyle = null;
	this.featureModify = null;
	//
	this.featureDraw = null;
	this.featureDrawCallBack = null;
	this.drawGeometryFunction  = null;
	this.featureDrawResetId_ = 0;

	//====================measure========================
	this.measureDraw = null;
	this.measureResetId_ = 0;
	this.measureVector = null;
	this.measureTooltipElement = null;
	this.measureTooltip = null;
	this.measureListener = null;
	this.measureSketch = null;
	//===================================================
	this.proxyEnable = true;
	//===================================================

	this.optionsInternal = options;

	this.proxyEnable = goog.isDef(options.proxyEnable) ? options.proxyEnable : true;

	this.proxyUrl = goog.isDef(options.proxyUrl) ? options.proxyUrl : gis.PROXY_URL;
	//
	var baseLayer = goog.isDef(options.baseLayer) ? options.baseLayer : null;
	var baseLayers = goog.isDef(options.baseLayers) ? options.baseLayers : null;
	var layers = goog.isDef(options.layers) ? options.layers : null;
	//--
	var zoom = goog.isDef(options.zoom) ? options.zoom : 5;
	var minZoom = goog.isDef(options.minZoom) ? options.minZoom : 1;
	var maxZoom = goog.isDef(options.maxZoom) ? options.maxZoom : 21;
	var extent = goog.isDef(options.extent) ? options.extent : null;

	//resolutions
	var resolutions = goog.isDef(options.resolutions) ? options.resolutions : null;
	var resolution = goog.isDef(options.resolution) ? options.resolution : null;

	//
	var target = goog.isDef(options.target) ? options.target : "map";
	var backgroundColor = goog.isDef(options.backgroundColor) ? options.backgroundColor: null;
	var projection = goog.isDef(options.projection) ? options.projection : gis.DEFAULT_PROJECTION;
	var enableRotation = goog.isDef(options.enableRotation) ? options.enableRotation : false;
	var center = goog.isDef(options.center) ? options.center : gis.DEFAULT_CENTER;
	//
	var scaleBarVisible = goog.isDef(options.scaleBarVisible) ? options.scaleBarVisible : false;
	var zoomBarVisible = goog.isDef(options.zoomBarVisible) ? options.zoomBarVisible : false;
	var mousePositionVisible = goog.isDef(options.mousePositionVisible) ? options.mousePositionVisible : false;
	var zoomBarPosition = goog.isDef(options.zoomBarPosition) ? options.zoomBarPosition : [10,10];
	this.switchBarVisible = goog.isDef(options.switchBarVisible) ? options.switchBarVisible : false;
	//--
	var zoomChangeCallBack = goog.isDef(options.zoomChange) ? options.zoomChange : null;
	if(zoomChangeCallBack && goog.isFunction(zoomChangeCallBack)){
		this.zoomChangeFunction = zoomChangeCallBack;
	}
	this.preZoom = zoom;

	//--
	var featureInfoCallBack = goog.isDef(options.getFeatureInfo) ? options.getFeatureInfo : null;
	if(featureInfoCallBack && goog.isFunction(featureInfoCallBack)){
		this.featureInfoFunction = featureInfoCallBack;
	}
	//--

	var curLayers = [];

	if(baseLayer){
		if(goog.isDef(gis.TileMap[baseLayer])){
			curLayers.push(gis.TileMap[baseLayer]);
		}
	} else if(baseLayers && goog.isArray(baseLayers)){
		//--1
		for(var i=0;i<baseLayers.length;i++){
			var bl = goog.isDef(gis.TileMap[baseLayers[i]]) ? gis.TileMap[baseLayers[i]] : null;
			if(bl){
				bl.setVisible(false);
				this.baseMapLayers.push(bl);
			}
		}
		//--2
		if(this.baseMapLayers.length > 0){
			this.baseMapLayers[0].setVisible(true);
		}
		//--3
		for(var i=0;i<this.baseMapLayers.length;i++){
			curLayers.push(this.baseMapLayers[i]);
		}

	} else if(layers && goog.isArray(layers)){
		curLayers = layers;
	}

	this.clearMap();

	var viewOptions = {
		projection: projection,
		enableRotation:enableRotation,
		center: center,
		minZoom: minZoom,
		maxZoom: maxZoom,
		zoom: zoom
	};

	if(extent){
		viewOptions.extent = extent;
	}

	if(resolutions && goog.isArray(resolutions)){
		viewOptions.resolutions = resolutions;
	}

	if(resolution){
		viewOptions.resolution = resolution;
	}

	this.map = new ol.Map({
		interactions : ol.interaction.defaults(),
		view : new ol.View(viewOptions),
		layers : curLayers,
		loadTilesWhileAnimating: true,
		target : target,
		controls : []
	});

	//--init

	if(zoomBarVisible){
		var parent = this;
		var navigationLeft = zoomBarPosition[0];
		var navigationTop = zoomBarPosition[1];

		var zoomsTop = navigationTop+47+2;
		var zoomsLet = navigationLeft + (47-26)/2;
		var zoomsliderHeight = 120;

		this.map.addControl(new ol.control.ZoomToExtent({extent:extent,tipLabel:"地图最大范围",label:""}));
		this.map.addControl(new ol.control.Zoom({zoomInLabel:"",zoomOutLabel:"",zoomInTipLabel:"放大",zoomOutTipLabel:"缩小"}));
		this.map.addControl(new ol.control.ZoomSlider());

		//
		$(this.map.getTargetElement()).find('.ol-zoom-extent').css({"top":(navigationTop)+"px","width":"47px",height:"47px","left":(navigationLeft)+"px","background-color":"rgba(255,255,255,0)","background-image": "url("+gis.OL_NAVIGATION_BG_ICON+")"});
		$(this.map.getTargetElement()).find('.ol-zoom-extent :button').addClass("ol-zoom-extent-full");
		$(this.map.getTargetElement()).find('.ol-zoom-extent .ol-zoom-extent-full').css({"margin-top":((47-16)/2-2)+"px","margin-left":((47-16)/2-2)+"px",height:"16px",width:"16px","background-color":"rgba(255,255,255,0)","background-image": "url("+gis.OL_NAVIGATION_FULL_ICON+")"});

		//-top
		var navigationDivTop = document.createElement('div');
		navigationDivTop.className = "ol-zoom-extent-div-top";
		var navigationButtonTop = document.createElement('button');
		navigationButtonTop.setAttribute('type', 'button');
		navigationButtonTop.className = "ol-zoom-extent-top";

		$(navigationButtonTop).appendTo($(navigationDivTop));
		$(navigationDivTop).appendTo($(this.map.getTargetElement()).find('.ol-zoom-extent'));

		$(this.map.getTargetElement()).find('.ol-zoom-extent-top').css({height:"15px",width:"15px","background-color":"rgba(255,255,255,0)","background-image": "url("+gis.OL_NAVIGATION_TOP_ICON+")"});
		$(this.map.getTargetElement()).find('.ol-zoom-extent-div-top').css({"position":"absolute","top":"-2px","left":((47-16)/2-1)+"px"});

		//goog.events.listen(navigationButtonTop,"click", goog.partial(gis.ZMap.prototype.navigationPanTop_), false, this);
		$(this.map.getTargetElement()).find('.ol-zoom-extent-top').click(function (event) {
			parent.navigationPanTop_();
		});


		//-down
		var navigationDivTop = document.createElement('div');
		navigationDivTop.className = "ol-zoom-extent-div-down";
		var navigationButtonTop = document.createElement('button');
		navigationButtonTop.setAttribute('type', 'button');
		navigationButtonTop.className = "ol-zoom-extent-down";

		$(navigationButtonTop).appendTo($(navigationDivTop));
		$(navigationDivTop).appendTo($(this.map.getTargetElement()).find('.ol-zoom-extent'));

		$(this.map.getTargetElement()).find('.ol-zoom-extent-down').css({height:"15px",width:"15px","background-color":"rgba(255,255,255,0)","background-image": "url("+gis.OL_NAVIGATION_DOWN_ICON+")"});
		$(this.map.getTargetElement()).find('.ol-zoom-extent-div-down').css({"position":"absolute","top":(47-15)+"px","left":((47-16)/2-1)+"px"});

		$(this.map.getTargetElement()).find('.ol-zoom-extent-down').click(function (event) {
			parent.navigationPanDown_(parent.map);
			//parent.map.pan("north");
		});

		//-left
		var navigationDivTop = document.createElement('div');
		navigationDivTop.className = "ol-zoom-extent-div-left";
		var navigationButtonTop = document.createElement('button');
		navigationButtonTop.setAttribute('type', 'button');
		navigationButtonTop.className = "ol-zoom-extent-left";

		$(navigationButtonTop).appendTo($(navigationDivTop));
		$(navigationDivTop).appendTo($(this.map.getTargetElement()).find('.ol-zoom-extent'));

		$(this.map.getTargetElement()).find('.ol-zoom-extent-left').css({height:"15px",width:"15px","background-color":"rgba(255,255,255,0)","background-image": "url("+gis.OL_NAVIGATION_LEFT_ICON+")"});
		$(this.map.getTargetElement()).find('.ol-zoom-extent-div-left').css({"position":"absolute","top":((47-15)/2)+"px","left":(-2)+"px"});

		$(this.map.getTargetElement()).find('.ol-zoom-extent-left').click(function (event) {
			parent.navigationPanLeft_();

		});

		//-right
		var navigationDivTop = document.createElement('div');
		navigationDivTop.className = "ol-zoom-extent-div-right";
		var navigationButtonTop = document.createElement('button');
		navigationButtonTop.setAttribute('type', 'button');
		navigationButtonTop.className = "ol-zoom-extent-right";

		$(navigationButtonTop).appendTo($(navigationDivTop));
		$(navigationDivTop).appendTo($(this.map.getTargetElement()).find('.ol-zoom-extent'));

		$(this.map.getTargetElement()).find('.ol-zoom-extent-right').css({height:"15px",width:"15px","background-color":"rgba(255,255,255,0)","background-image": "url("+gis.OL_NAVIGATION_RIGHT_ICON+")"});
		$(this.map.getTargetElement()).find('.ol-zoom-extent-div-right').css({"position":"absolute","top":((47-15)/2)+"px","right":(-2)+"px"});

		$(this.map.getTargetElement()).find('.ol-zoom-extent-right').click(function (event) {
			parent.navigationPanRight_();
		});

		//--
		$(this.map.getTargetElement()).find('.ol-zoom').css({"top":zoomsTop+"px","width":"26px","left":zoomsLet+"px","background-color": "rgba(255,255,255,0)"});
		$(this.map.getTargetElement()).find('.ol-zoomslider').css({"top":(zoomsTop+20+2)+"px","left":(zoomsLet+5)+"px","width":"16px",height:zoomsliderHeight+"px","background-color": "rgba(255,255,255,0)","background-image":"url("+gis.OL_ZOOMSLIDER_BG_ICON+")"});
		$(this.map.getTargetElement()).find('.ol-zoomslider-thumb').css({margin:-2,height:"12px",width:"16px","background-image":"url("+gis.OL_ZOOMSLIDER_THUMB_ICON+")"});

		$(this.map.getTargetElement()).find('.ol-zoom-in').css({"width":"20px",height:"20px","background-image":"url("+gis.OL_ZOOM_IN_0_ICON+")"});
		$(this.map.getTargetElement()).find('.ol-zoom-out').css({"margin-top":(zoomsliderHeight-1)+"px","width":"20px",height:"20px","background-image":"url("+gis.OL_ZOOM_OUT_0_ICON+")"});

		//$(this.map.getTargetElement()).find('.ol-zoom-in').addClass("ol-zoom-in:hover");
		//$(this.map.getTargetElement()).find('.ol-zoom-in:hover').css({"background-image":"url("+gis.OL_ZOOM_IN_1_ICON+")"});

		$(this.map.getTargetElement()).find('.ol-zoom-in').hover(function(){
			$(this).css("background-image","url("+gis.OL_ZOOM_IN_1_ICON+")");
		},function(){
			$(this).css("background-image","url("+gis.OL_ZOOM_IN_0_ICON+")");
		});

		$(this.map.getTargetElement()).find('.ol-zoom-out').hover(function(){
			$(this).css("background-image","url("+gis.OL_ZOOM_OUT_1_ICON+")");
		},function(){
			$(this).css("background-image","url("+gis.OL_ZOOM_OUT_0_ICON+")");
		});



	}

	//
	if(scaleBarVisible){
		this.map.addControl(new ol.control.ScaleLine({units: 'metric'}));
	}

    if(mousePositionVisible){
		this.map.addControl(new ol.control.MousePosition());
	}

	if(backgroundColor){
		$(this.map.getTargetElement()).css("background-color",backgroundColor);
	}


	this.map.on('pointerdown', function(evt) {
		//console.log('--pointerdown=='+evt.type);
		if (evt.dragging) {
			return;
		}

		var pixel = evt.map.getEventPixel(evt.originalEvent);
		var feature = evt.map.forEachFeatureAtPixel(pixel,
			function(feature, layer){
				return feature;
			}
		);

		if (feature) {
			var attributes;
			var features = feature.get('features');
			if(features){
				// var size = features.length;
				// if (size == 1) {
				attributes = features[0].get("attributes");
				// }else{}
			}else{
				attributes = feature.get("attributes");
			}

			//if(!attributes){return false}
			if(attributes){
				var infoWindowWidth = goog.isDef(attributes.infoWindowWidth) ? attributes.infoWindowWidth:undefined;
				var infoWindowContent = goog.isDef(attributes.infoWindowContent) ? attributes.infoWindowContent:undefined;
				var infoWindowCallBack = goog.isDef(attributes.infoWindowCallBack) ? attributes.infoWindowCallBack:undefined;
				var dblclickCallBack = goog.isDef(attributes.dblclickCallBack) ? attributes.dblclickCallBack:undefined;
				if(dblclickCallBack !== undefined && goog.isFunction(dblclickCallBack)){
					return;
				}

				var coordinate = evt.coordinate;
				var geomtype = feature.getGeometry().getType();

				if(geomtype === "Point"){
					//console.log('--pointerdown.geomtype=='+geomtype);
					coordinate = feature.getGeometry().getCoordinates();
				}
				//var contentElement = $("#popup-content");
				//console.log('--popupContentID=='+this.popupContentID);
				var contentElement = $("#"+ this.popupContentID);

				if(infoWindowWidth !== undefined){
					$(this.infoWindowElement).css("min-width", infoWindowWidth);
				}

				if((infoWindowContent !== undefined && Array.isArray(features) && features.length == 1) || infoWindowContent !== undefined && features == undefined){
					contentElement.html(infoWindowContent);
					map.infoWindow.setPosition(coordinate);
					//evt.stopPropagation();
					return;
				}

				if(infoWindowCallBack !== undefined && goog.isFunction(infoWindowCallBack)){
					//this.infoWindow.setPosition(undefined);
					evt.stopPropagation();
					infoWindowCallBack(this,coordinate,feature);
				}

			}

		}


	},this);


	/*
	 this.map.on('click', function(evt) {
	 //console.log('--map.type=='+evt.type);
	 },this);
	 */

	this.map.on('pointermove', function(evt) {
		//console.log('--pointermove=='+evt.type);

		if (evt.dragging) {
			return;
		}

		var pixel = evt.map.getEventPixel(evt.originalEvent);
		var feature = evt.map.forEachFeatureAtPixel(pixel,
			function(feature, layer){
				return feature;
			}
		);

		var element = evt.map.getTargetElement();
		if (feature) {
			var features = feature.get('features');
			if(features){
				if(features.length > 1) {
					return false;
				} else {
					feature = features[0];

					// element.style.cursor = "pointer";
					// var tooltip = features[0].get('tooltip');
					// console.log('--tooltip=='+tooltip);
					// if (typeof(tooltip) != "undefined" && tooltip !== null){
					// 	this.featureTooltipElement.innerHTML = tooltip;
					// 	this.featureTooltip.setPosition(evt.coordinate);
					// 	$(this.featureTooltipElement).show();
					// }else{
					// 	$(this.featureTooltipElement).hide();
					// 	element.style.cursor = "";
					// }
				}
				// var size = features.length;
				// if (size == 1) {
				// attributes = features[0].get("attributes");
				// }else{}
			}else{
				// attributes = feature.get("attributes");
			}

			//console.log('--map.type=='+evt.type);
			element.style.cursor = "pointer";
			var tooltip = feature.get('tooltip');
			if (typeof(tooltip) != "undefined" && tooltip !== null){
				map.featureTooltipElement.innerHTML = tooltip;
				map.featureTooltip.setPosition(evt.coordinate);

				$(map.featureTooltipElement).show();
			}else{
				$(map.featureTooltipElement).hide();
				element.style.cursor = "";
			}
		} else {
			$(map.featureTooltipElement).hide();
			element.style.cursor = "";
		}



	},this);


	this.map.on('singleclick', function(evt) {
		//console.log('--singleclick=='+evt.type);
		var parentMap = this;

		if (evt.dragging) {
			return;
		}

		if(map && map.isEditModle_()){
			return;
		}

		var pixel = evt.map.getEventPixel(evt.originalEvent);
		var feature = evt.map.forEachFeatureAtPixel(pixel,
			function(feature, layer){
				return feature;
			}
		);

		if (!feature) {
			var coordinate = evt.coordinate;
			//var ls = evt.map.getLayerGroup().getLayers();
			var ls = map.featureInfoLayers;
			if(ls.length == 0){
				var callBack = this.featureInfoFunction;
				if(callBack && goog.isFunction(callBack)){
					var context = goog.isDef(options.emberComponent) ? options.emberComponent : null;
					callBack(coordinate,context,evt);
				}

				return false;
			}

			var layerNames = [];
			var layerUrl = [];
			var viewparams = null;
			//
			for(var i=0;i<ls.length;i++){
				var l = null;
				var l_temp = ls[i];
				if(goog.isString(l_temp)){
					l = this.getLayer(l_temp);
				} else if (l_temp instanceof ol.layer.Layer) {
					l = l_temp;
				}

				if(l){
					var layerName = l.get("name");
					if(l.getSource() instanceof ol.source.ImageWMS){
						//if(l.getVisible()){
						viewparams = l.getSource().getParams()["VIEWPARAMS"];
						var layersParam = l.getSource().getParams()["LAYERS"];
						var url = l.getSource().getUrl();
						//console.log('--layersParam.layer=='+layersParam+"=="+viewparams);
						layerNames.push(layersParam);
						layerUrl.push(url);
						//}
					}

					if(l.getSource() instanceof ol.source.TileWMS){
						//if(l.getVisible()){
						viewparams = l.getSource().getParams()["VIEWPARAMS"];
						var layersParam = l.getSource().getParams()["LAYERS"];
						var url = l.getSource().getUrls()[0];
						//console.log('--layersParam.layer=='+layersParam+"=="+viewparams);
						layerNames.push(layersParam);
						layerUrl.push(url);
						//}
					}
				}
			}

			//--
			if(layerNames.length > 0 && layerUrl.length > 0){
				var view = evt.map.getView();
				var resolution = view.getResolution();
				var projection = view.getProjection();
				var size = [101, 101];//ol.source.ImageWMS.GETFEATUREINFO_IMAGE_SIZE_
				var extent = this.getForViewAndSize(coordinate,resolution,0,size);   //kjf

				var params = {'INFO_FORMAT': 'application/json','FEATURE_COUNT': this.featureCount};
				//var params = {'INFO_FORMAT': this.featureInfoFormat,'FEATURE_COUNT': this.featureCount};
				var baseParams = {
					'SERVICE': 'WMS',
					'VERSION': "1.1.1",
					'REQUEST': 'GetFeatureInfo',
					'FORMAT': 'image/png',
					'TRANSPARENT': true,
					//'STYLES':'',
					'LAYERS': layerNames.join(','),
					'QUERY_LAYERS': layerNames.join(',')
				};

				goog.object.extend(baseParams,params);

				var x = Math.floor((coordinate[0] - extent[0]) / resolution);
				var y = Math.floor((extent[3] - coordinate[1]) / resolution);
				baseParams['X'] = x;
				baseParams['Y'] = y;

				if(viewparams){
					baseParams['VIEWPARAMS'] = viewparams;
				}

				var requestUrl = this.getRequestUrl_(layerUrl[0],extent,size,1,ol.proj.get(projection), baseParams);
				var infoFormat = this.featureInfoFormat;

				if(infoFormat === "arcgis"){
					var arcgisWfsUrl = layerUrl[0].replace("WMSServer","WFSServer");
				}

				var callBack = this.featureInfoFunction;

				var context = goog.isDef(options.emberComponent) ? options.emberComponent : null;

				if(requestUrl && callBack && goog.isFunction(callBack)){
					var reqUrl = this.proxyUrl + this.base64Encode(requestUrl);
					if(!this.proxyEnable){
						reqUrl = requestUrl;
					}
					var parentEvt = evt;

					try{
						if(infoFormat === "geoserver"){
							$.getJSON(reqUrl,function(result) {
								if(result){
									var features = (new ol.format.GeoJSON()).readFeatures(result);
									if(features.length > 0){
										$.each(features,function(n,ele){
											var attributes = ele.getProperties();
											var key;
											for (key in attributes) {
												//ele.unset(key);
											}
											var fid = ele.getId();
											var id_infos = fid.split(".");
											attributes.objectId = id_infos[1];
											attributes.objectName = id_infos[0];
											ele.set('attributes',attributes);
										});

										callBack(features,parentMap,coordinate,context,parentEvt);
									}else{
										callBack([],parentMap,coordinate,context,parentEvt);
									}
								}
							});

						}else if(infoFormat === "arcgis"){


						}

					}catch(e){
						alert(e);
					}
				}

			}

		}

	},this);


	this.map.on('dblclick', function(evt) {

		if (evt.dragging) {
			return;
		}

		if(map.isEditModle_()){
			return;
		}

		var pixel = evt.map.getEventPixel(evt.originalEvent);
		var feature = evt.map.forEachFeatureAtPixel(pixel,
			function(feature, layer){
				return feature;
			}
		);

		if (feature) {
			var coordinate = evt.coordinate;
			var geomtype = feature.getGeometry().getType();
			if(geomtype === "Point"){
				coordinate = feature.getGeometry().getCoordinates();
			}
			var attributes = feature.get("attributes");
			if(attributes){
				var dblclickCallBack = goog.isDef(attributes.dblclickCallBack) ? attributes.dblclickCallBack:undefined;
				if(dblclickCallBack !== undefined && goog.isFunction(dblclickCallBack)){
					dblclickCallBack(this,coordinate,feature);
				}
			}
			evt.preventDefault();
		}

	},this);

	this.map.on('moveend', function(evt){

		if(this.moveEndCallBack != null && goog.isFunction(this.moveEndCallBack)){
			this.moveEndCallBack();
		}

		var cur_zoom = evt.map.getView().getZoom();
		if(cur_zoom != this.preZoom){
			this.preZoom = cur_zoom;
			if(this.zoomChangeFunction){
				//this.zoomChangeFunction();
				var context = goog.isDef(options.emberComponent) ? options.emberComponent : null;
				//this.zoomChangeFunction.call(context);
				var callBack = this.zoomChangeFunction;
				if(context != null){
					//callBack.apply(context,[]);
					callBack(context,this);
				} else {
					callBack(this);
				}
			}
		}

	},this);

	//--
	this.createfeaturePopup();
	this.createfeatureTooltip();
	this.createSwitchBaseLayerToolBar();
	this.initSelectHandel_();
	//--
	var emberComponent = goog.isDef(options.emberComponent) ? options.emberComponent : null;
	var initCallBack = goog.isDef(options.initComplete) ? options.initComplete : null;
	if(initCallBack != null && goog.isFunction(initCallBack)){
		if(emberComponent != null){
			initCallBack(emberComponent,this);
			//initCallBack.call(emberComponent,this);
		} else {
			initCallBack(this);
		}
	}

};

goog.inherits(gis.ZMap, ol.Object);


gis.ZMap.prototype.initSelectHandel_ = function() {
	//---
	if(this.selectPointerMove){
		this.map.removeInteraction(this.selectPointerMove);
		this.selectPointerMove = null;
	}

	this.selectPointerMove = new ol.interaction.Select({
		condition: ol.events.condition.pointerMove,
		filter: function (feature, layer) {
			var flag = true;
			var enableMouseover = feature.get("mouseover");
			if(enableMouseover !== undefined && enableMouseover == false){
				flag = false;
			}

			if(!layer){
				return false;
			}
			var lname = layer.get("name");
			if(lname && lname == "ttmap_measureVector"){
				flag = false;
			}

			return flag;
		}
	});

	//this.map.addInteraction(this.selectPointerMove);
	this.selectPointerMove.on('select', function(e) {
		if(e.selected.length > 0){
			//--鼠标移入，选择了一个，是mouseover
			for(var i=0;i<e.selected.length;i++){
				var f = e.selected[i];
				var layer = map.selectPointerMove.getLayer(f);
				if(layer){
					var features = layer.getSource().getFeatures();
					$.each(features,function(n,f2){
						var f2_attributes = f2.get("attributes");
						if(f2_attributes && f2_attributes.overStyle && f2_attributes.defaultStyle){
							f2.setStyle(f2_attributes.defaultStyle);
						}
					});
				}

				var attributes = f.get("attributes");
				if(attributes && attributes.overStyle && attributes.defaultStyle){
					f.setStyle(attributes.overStyle);
				}
				if(attributes && attributes.mouseoverCallBack && attributes.mouseoverCallBack){
					attributes.mouseoverCallBack(f);
				}
			}
		} else if(e.deselected.length > 0){
			//鼠标移出，放弃选择，mouseout
			for(var i=0;i<e.deselected.length;i++){
				var f = e.deselected[i];
				var attributes = f.get("attributes");
				if(attributes && attributes.overStyle && attributes.defaultStyle){
					f.setStyle(attributes.defaultStyle);
				}
				if(attributes && attributes.mouseoutCallBack && attributes.mouseoutCallBack){
					attributes.mouseoutCallBack(f);
				}
			}
		}
	},this);

	this.initSelectHandel2_();
}

/**
 * @private
 */
gis.ZMap.prototype.initSelectHandel2_ = function() {

	if(this.featureSelect){
		this.map.removeInteraction(this.featureSelect);
		this.featureSelect = null;
	}

	this.featureSelect = new ol.interaction.Select({
		style: this.featureSelectStyle,
		filter: function (feature, layer) {
			var attributes = feature.get("attributes");
			var editFlag = false;
			if(attributes && goog.isDef(attributes.editFlag) && attributes.editFlag){
				editFlag = true;
			}
			return editFlag;
		}
	});

	this.featureSelect.getFeatures().on('add', function(evt) {
		var feature = evt.element;

		var attributes = feature.get("attributes");
		var editFlag = false;
		if(attributes && goog.isDef(attributes.editFlag) && attributes.editFlag){
			editFlag = true;
		}

		var selectedFeatures = this.featureSelect.getFeatures();
		if(!editFlag){
			selectedFeatures.remove(feature);
		}
		this.initModifyHandel_();

	},this);

	this.featureSelect.getFeatures().on('remove', function(evt) {
		var feature = evt.element;
		var fid = feature.getId();
		var selectedFeatures = this.featureSelect.getFeatures();
	},this);

	//-
	this.featureSelect.on('change:active', function() {
		var selectedFeatures = map.featureSelect.getFeatures();
		selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
	},this);

	this.map.addInteraction(this.featureSelect);
};

/**
 * @private
 */
gis.ZMap.prototype.navigationPanTop_ = function(target) {
	this.pan("south");
}

/**
 * @private
 */
gis.ZMap.prototype.navigationPanDown_ = function() {
	this.pan("north");
}

/**
 * @private
 */
gis.ZMap.prototype.navigationPanLeft_ = function() {
	this.pan("east");
}

/**
 * @private
 */
gis.ZMap.prototype.navigationPanRight_ = function() {
	this.pan("west");
}

/**
 * @private
 */
gis.ZMap.prototype.initModifyHandel_ = function() {
	if(this.featureModify){
		this.map.removeInteraction(this.featureModify);
		this.featureModify = null;
	}

	this.featureModify = new ol.interaction.Modify({
		features: this.featureSelect.getFeatures(),
		deleteCondition: function(event) {
			return ol.events.condition.shiftKeyOnly(event) &&
				ol.events.condition.singleClick(event);
		}
	});

	this.map.addInteraction(this.featureModify);
};

/**
 * @private
 */
gis.ZMap.prototype.isEditModle_ = function() {

	if(this.featureModify && this.featureModify.getActive()){
		return true;
	}

	if(this.measureDraw){
		return true;
	}

	if(this.featureDraw){
		return true;
	}

	return false;
};


gis.ZMap.prototype.getForViewAndSize = function(center, resolution, rotation, size, opt_extent) {
	var dx = resolution * size[0] / 2;
	var dy = resolution * size[1] / 2;
	var cosRotation = Math.cos(rotation);
	var sinRotation = Math.sin(rotation);
	/** @type {Array.<number>} */
	var xs = [-dx, -dx, dx, dx];
	/** @type {Array.<number>} */
	var ys = [-dy, dy, -dy, dy];
	var i, x, y;
	for (i = 0; i < 4; ++i) {
		x = xs[i];
		y = ys[i];
		xs[i] = center[0] + x * cosRotation - y * sinRotation;
		ys[i] = center[1] + x * sinRotation + y * cosRotation;
	}

	return this.boundingExtentXYs_(xs, ys, opt_extent);
};

gis.ZMap.prototype.boundingExtentXYs_ = function(xs, ys, opt_extent) {
	//goog.asserts.assert(xs.length > 0, 'xs length should be larger than 0');
	//goog.asserts.assert(ys.length > 0, 'ys length should be larger than 0');
	var minX = Math.min.apply(null, xs);
	var minY = Math.min.apply(null, ys);
	var maxX = Math.max.apply(null, xs);
	var maxY = Math.max.apply(null, ys);
	return this.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
};

gis.ZMap.prototype.createOrUpdate = function(minX, minY, maxX, maxY, opt_extent) {
	if (opt_extent) {
		opt_extent[0] = minX;
		opt_extent[1] = minY;
		opt_extent[2] = maxX;
		opt_extent[3] = maxY;
		return opt_extent;
	} else {
		return [minX, minY, maxX, maxY];
	}
};


/**
 * @param {string} url.
 * @param {ol.Extent} extent Extent.
 * @param {ol.Size} size Size.
 * @param {number} pixelRatio Pixel ratio.
 * @param {ol.proj.Projection} projection Projection.
 * @param {Object} params Params.
 * @return {string} Request URL.
 * @private
 */
gis.ZMap.prototype.getRequestUrl_ = function(url, extent, size, pixelRatio, projection, params) {
	params['SRS'] = projection.getCode();
	if (!('STYLES' in params)) {
		/* jshint -W053 */
		params['STYLES'] = new String('');
		/* jshint +W053 */
	}

	if (pixelRatio != 1) {

	}
	params['WIDTH'] = size[0];
	params['HEIGHT'] = size[1];
	params['BBOX'] = extent.join(',');
	return goog.uri.utils.appendParamsFromMap(url, params);
};


gis.ZMap.prototype.getUUID = function(len, radix) {
	var chars = gis.UUID_CHARS, uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	} else {
		// rfc4122, version 4 form
		var r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random()*16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	return uuid.join('');
};

/**
 * @private
 */
gis.ZMap.prototype.createSwitchBaseLayerToolBar = function(){
	var parent = this;
	/*
	 if(this.baseMapLayers && goog.isArray(this.baseMapLayers) && this.switchBarVisible){
	 var vectorFlag = false;
	 var imageFlag = false;
	 //--1
	 for(var i=0;i<this.baseMapLayers.length;i++){
	 var l = this.baseMapLayers[i];
	 var groupKey = l.get("groupKey");
	 //console.log('--groupKey=='+groupKey);
	 if (groupKey.indexOf('VECTOR') != -1) {
	 vectorFlag = true;
	 }
	 if (groupKey.indexOf('IMAGE') != -1) {
	 imageFlag = true;
	 }
	 }
	 //--2
	 if(!imageFlag || !vectorFlag){
	 return false;
	 }

	 console.log('--createSwitchBaseLayerToolBar==1');

	 var className = 'switch-baselayer';

	 var vectorElement = goog.dom.createDom("span", {
	 'class': 'btn btn-default btn-sm ZMap_switch_vector_handle'
	 }, '矢量地图');

	 //goog.events.listen(vectorElement,"click", goog.partial(gis.ZMap.prototype.switchHandleClick_, "VECTOR"), false, this);

	 var imageElement = goog.dom.createDom(
	 "span", {
	 'class': 'btn btn-default btn-sm ZMap_switch_image_handle'
	 }, "影像地图");
	 $(imageElement).css("margin-left","5px");
	 //goog.events.listen(imageElement,"click", goog.partial(gis.ZMap.prototype.switchHandleClick_, "IMAGE"), false, this);

	 var CLASS_CONTROL = 'ol-control';
	 var cssClasses = className + ' ' + CLASS_CONTROL;
	 var element = goog.dom.createDom("div", cssClasses, vectorElement,imageElement);
	 //$(element).css("width","150px");
	 //$(element).css("height","40px");
	 $(element).css("float","left");

	 var targetElement = this.map.getTargetElement();
	 targetElement.appendChild(element);

	 $(".ZMap_switch_vector_handle").click(function (event) {
	 parent.switchHandleClick_("VECTOR",event)
	 });

	 $(".ZMap_switch_image_handle").click(function (event) {
	 parent.switchHandleClick_("IMAGE",event)
	 });
	 }
	 */
};

/**
 * @param {String} baseLayer groupKey.
 * @param {goog.events.BrowserEvent} event The event to handle
 * @private
 */
gis.ZMap.prototype.switchHandleClick_ = function(groupKey, event) {
	event.preventDefault();
	this.visibleGroupBaseLayer(groupKey);
};


/**
 * @private
 */
gis.ZMap.prototype.createfeatureTooltip = function() {
	if (this.featureTooltipElement) {
		this.featureTooltipElement.parentNode.removeChild(this.featureTooltipElement);
	}

	this.featureTooltipElement = document.createElement('div');
	var options = {};
	options.name = "featureTooltipElement";
	options.element = this.featureTooltipElement;
	//options.className = 'tooltip tooltip-static';
	// options.className = 'tooltip_gis tooltip-static_gis';
	options.className = 'ol-tooltip ol-tooltip-static';
	options.offset = [0, -15];
	options.positioning = 'bottom-center';
	this.featureTooltip = this.addOverlay(options);
};

/**
 * @private
 */
gis.ZMap.prototype.createfeaturePopup = function() {
	if (this.infoWindowElement) {
		this.infoWindowElement.removeChild($("#"+this.popupCloserId));
		this.infoWindowElement.removeChild($("#popup-label"));
		//this.infoWindowElement.removeChild($("#popup-content"));
		this.infoWindowElement.removeChild($("#"+ this.popupContentID));

		this.infoWindowElement.parentNode.removeChild(this.infoWindowElement);
	}

	this.infoWindowElement = document.createElement('div');
	$(this.infoWindowElement).attr("id", "popup");
	$(this.infoWindowElement).addClass('ol-popup');

	$(this.infoWindowElement).append("<a href=\"#\" id=\"popup-closer\" class=\"ol-popup-closer\"></a>");
	$(this.infoWindowElement).append("<span id=\""+this.popupCloserId+"\" class=\"glyphicon glyphicon-remove\" style=\"cursor:pointer;right:4px;top:4px;position:absolute;\"></span>");
	$(this.infoWindowElement).append("<div id=\"popup-label\"></div>");
	//$(this.infoWindowElement).append("<div id=\"popup-content\"></div>");
	$(this.infoWindowElement).append("<div id=\""+this.popupContentID+"\"></div>");


	$(this.infoWindowElement).mousedown(function(event) {

		var targ = event.srcElement || event.target;
		//console.log(targ);
		var tname = targ.tagName;
		//console.log(tname);
		if(tname != "INPUT" && tname != "TEXTAREA" && tname != "SELECT" && tname != "SPAN"){
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			return false;
		}

		event.stopPropagation();

	});


	var options = {};
	options.name = "infoWindowElement";
	options.element = this.infoWindowElement;
	options.className = 'ol-popup';
	options.autoPan = true;
	options.autoPanAnimation = {duration: 250};
	this.infoWindow = this.addOverlay(options);
	//--
	var popup = this.infoWindow;
	this.infoWindowCloseButton = $("#"+this.popupCloserId);

	var parent = this;
	$(this.infoWindowCloseButton).mousedown(function(event) {
		event.preventDefault();
		var closeCallBack = parent.infoWindowCloseCallBack;
		//console.log('--===========5555featurepopupCloser');
		popup.setPosition(undefined);
		//console.log('--featurepopupCloser--1');
		if(closeCallBack && goog.isFunction(closeCallBack)){
			//console.log('--featurepopupCloser--2');
			closeCallBack();
		}
		//console.log('--featurepopupCloser--3');
		//$("#popup-closer").blur();
		event.stopPropagation();
		event.stopImmediatePropagation();
		return false;
	});


};

gis.ZMap.prototype.clearMap = function() {
	if(this.map != null){
		var t_map = this.map;
		var target = this.map.getTarget();
		//
		var controls = this.map.getControls().getArray();
		$.each(controls,function(n,control) {
			//console.log('--pointermove...');
			t_map.removeControl(control);
		});

		var interactions = this.map.getInteractions().getArray();
		$.each(interactions,function(n,interaction) {
			t_map.removeInteraction(interaction);
		});

		var layers = this.map.getLayerGroup().getLayers().getArray();
		$.each(layers,function(n,layer) {
			t_map.removeLayer(layer);
		});

		var overlays = this.map.getOverlays().getArray();
		$.each(overlays,function(n,overlay) {
			t_map.removeOverlay(overlay);
		});

		this.map = null;
		this.baseMapLayers = [];
		$(target).empty();
	}

};

/**
 * @private
 */
gis.ZMap.prototype.stringDivider = function(str, width, spaceReplacer){
	if (str.length > width) {
		var p = width;
		for (; p > 0 && (str[p] != ' ' && str[p] != '-'); p--) {
		}
		if (p > 0) {
			var left;
			if (str.substring(p, p + 1) == '-') {
				left = str.substring(0, p + 1);
			} else {
				left = str.substring(0, p);
			}
			var right = str.substring(p + 1);
			return left + spaceReplacer + this.stringDivider(right, width, spaceReplacer);
		}
	}
	return str;
};


gis.ZMap.prototype.base64Encode = function(str){
	var out, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	out = "";
	while(i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if(i == len){
			out += gis.BASE64_ENCODE_CHARS.charAt(c1 >> 2);
			out += gis.BASE64_ENCODE_CHARS.charAt((c1 & 0x3) << 4);
			out += "==";
			break;
		}

		c2 = str.charCodeAt(i++);
		if(i == len){
			out += gis.BASE64_ENCODE_CHARS.charAt(c1 >> 2);
			out += gis.BASE64_ENCODE_CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
			out += gis.BASE64_ENCODE_CHARS.charAt((c2 & 0xF) << 2);
			out += "=";
			break;
		}

		c3 = str.charCodeAt(i++);
		out += gis.BASE64_ENCODE_CHARS.charAt(c1 >> 2);
		out += gis.BASE64_ENCODE_CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		out += gis.BASE64_ENCODE_CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
		out += gis.BASE64_ENCODE_CHARS.charAt(c3 & 0x3F);
	}
	return out;
};

/****************public method*********************/


gis.ZMap.prototype.colorRgb = function(sColor){
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	sColor = sColor.toLowerCase();
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
		return sColorChange;
	}else{
		return [255,255,255];
	}
};



//-----------toolbar operation----------
gis.ZMap.prototype.removeDraw = function(){
	if(this.featureSelect){
		this.featureSelect.getFeatures().clear();
	}

	if(this.featureDraw){
		this.map.removeInteraction(this.featureDraw);
		this.featureDraw = null;
		this.drawGeometryFunction  = null;
	}
};

/**
 * draw feature
 * @param {string} source.
 * @param {string} model area or length.
 * @param {object} style.
 * @param {object} popupAttributes.
 * @param {function} callBackFun.
 */
gis.ZMap.prototype.draw = function(vectorLayer,model,style,popupAttributes,callBackFun,_id){
	//var type = (model == 'area' ? 'Polygon' : 'LineString');
	var type = model;
	//console.log(style);
	var draw_style;
	if(style === undefined){
		style = {};
	}
	if (style instanceof ol.style.Style){
		draw_style = style;
	} else {
		var alpha = goog.isDef(style.alpha) ? style.alpha : 0.2;
		var fillColor = goog.isDef(style.fillColor) ? style.fillColor : "#00CC33";
		var strokeWidth = goog.isDef(style.strokeWidth) ? style.strokeWidth : 2;
		var strokeColor = goog.isDef(style.strokeColor) ? style.strokeColor : '#0033FF';
		var radius = goog.isDef(style.radius) ? style.radius : 4;
		var rgb = this.colorRgb(fillColor);
		var rgba = 'rgba('+rgb[0]+', '+rgb[1]+', '+rgb[2]+', '+alpha+')';

		draw_style = new ol.style.Style({
			fill: new ol.style.Fill({
				color: rgba
			}),
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: strokeWidth
			}),
			image: new ol.style.Circle({
				radius: radius,
				stroke: new ol.style.Stroke({color: strokeColor, width: strokeWidth}),
				fill: new ol.style.Fill({
					color: rgba
				})
			})
		});
	}

	vectorLayer.setStyle(draw_style);
	var maxPoints = 200;
	if (type === 'Square') {
		type = 'Circle';
		this.drawGeometryFunction = ol.interaction.Draw.createRegularPolygon(4);
	} else if (type === 'Box') {
		type = 'LineString';
		maxPoints = 2;
		this.drawGeometryFunction = function(coordinates, geometry) {
			if (!geometry) {
				geometry = new ol.geom.Polygon(null);
			}
			var start = coordinates[0];
			var end = coordinates[1];
			geometry.setCoordinates([
				[start, [start[0], end[1]], end, [end[0], start[1]], start]
			]);
			return geometry;
		};
	}
	if(this.featureDraw){
		this.map.removeInteraction(this.featureDraw);
		this.featureDraw = null;
		this.drawGeometryFunction  = null;
	}
	this.featureDrawCallBack = callBackFun;
	this.featureDraw = new ol.interaction.Draw({
		source: vectorLayer.getSource(),
		type: type,
		style: draw_style,
		geometryFunction: this.drawGeometryFunction,
		maxPoints: maxPoints
	});
	this.featureDraw.on('drawstart',
		function(evt) {
			//console.log('--featureDraw.drawstart');
			map.featureSelect.setActive(false);
			var f = evt.feature;
			var attributes = {};
			attributes.id = _id;
			attributes.editFlag = true;
			//--
			if(popupAttributes!== undefined && popupAttributes != null){
				if(goog.isDef(popupAttributes.infoWindowWidth)){
					attributes.infoWindowWidth = popupAttributes.infoWindowWidth;
				}
				if(goog.isDef(popupAttributes.infoWindowContent)){
					attributes.infoWindowContent = popupAttributes.infoWindowContent;
				}
				if(goog.isDef(popupAttributes.infoWindowCallBack)){
					attributes.infoWindowCallBack = popupAttributes.infoWindowCallBack;
				}
			}

			f.set('attributes',attributes);
		}, this);

	this.featureDraw.on('drawend',
		function(evt) {
			//console.log('--featureDraw.drawend');
			if(map.featureDrawCallBack !== undefined && goog.isFunction(map.featureDrawCallBack)){
				var geom = null;
				if(evt.feature){
					geom = evt.feature.getGeometry().clone();
				}
				map.featureDrawCallBack(geom);
			}
			map.featureDrawResetHandler_1();

		}, this);

	this.map.addInteraction(this.featureDraw);

};


/**
 * @private
 */
gis.ZMap.prototype.featureDrawResetHandler_1 = function(){

	if (this.featureDrawResetId_ !== 0) {
		goog.global.clearTimeout(this.featureDrawResetId_);
		this.featureDrawResetId_ = 0;
	}

	this.featureDrawResetId_ = goog.global.setTimeout(goog.bind(function() {
		this.map.removeInteraction(this.featureDraw);
		this.featureDraw = null;
		this.drawGeometryFunction  = null;
		this.featureDrawCallBack = null;
		this.featureSelect.setActive(false);
	}, this), 250);

};

gis.ZMap.prototype.featureDrawResetHandler_2 = function(){

	if (this.featureDrawResetId_ !== 0) {
		goog.global.clearTimeout(this.featureDrawResetId_);
		this.featureDrawResetId_ = 0;
	}

	this.featureDrawResetId_ = goog.global.setTimeout(goog.bind(function() {
		this.map.removeInteraction(this.featureDraw);
		this.featureDraw = null;
		this.drawGeometryFunction  = null;
		this.featureDrawCallBack = null;
		this.featureSelect.setActive(true);
	}, this), 250);


};

gis.ZMap.prototype.featureDrawResetHandler_3 = function(){

//	if (this.featureDrawResetId_ !== 0) {
//		goog.global.clearTimeout(this.featureDrawResetId_);
//		this.featureDrawResetId_ = 0;
//	}

	this.featureDrawResetId_ = goog.global.setTimeout(goog.bind(function() {
		this.map.removeInteraction(this.featureDraw);
		this.featureDraw = null;
		this.drawGeometryFunction  = null;
		this.featureDrawCallBack = null;
		this.featureSelect.setActive(false);
	}, this), 250);


};


/**
 * @private
 */
gis.ZMap.prototype.measureResetHandler_ = function(){

	if (this.measureResetId_ !== 0) {
		goog.global.clearTimeout(this.measureResetId_);
		this.measureResetId_ = 0;
	}

	this.measureResetId_ = goog.global.setTimeout(goog.bind(function() {
		this.map.removeInteraction(this.measureDraw);
		this.measureDraw = null;

		this.measureSketch = null;
		ol.Observable.unByKey(this.measureListener);

		this.featureSelect.setActive(true);

	}, this), 250);

};


gis.ZMap.prototype.clearMeature = function(){
	this.measureResetHandler_();
	if(this.measureVector){
		this.measureVector.getSource().clear();
	}

	this.removeOverlayByPrefix("meature");
	this.measureTooltip = null;
	if (this.measureTooltipElement) {
		this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
		this.measureTooltipElement = null;
	}
};

/**
 * meature line length or area square
 * @param {string} model area or length.
 * @param {object} style.
 */
gis.ZMap.prototype.measure = function(model,style){
	var type = (model == 'area' ? 'Polygon' : 'LineString');

	if(style === undefined){
		style = {};
	}

	var alpha = goog.isDef(style.alpha) ? style.alpha : 0.2;
	var fillColor = goog.isDef(style.fillColor) ? style.fillColor : "#00CC33";
	var strokeWidth = goog.isDef(style.strokeWidth) ? style.strokeWidth : 2;
	var strokeColor = goog.isDef(style.strokeColor) ? style.strokeColor : '#0033FF';
	//
	//console.log('--fillColor=='+fillColor);
	var rgb = this.colorRgb(fillColor);
	var rgba = 'rgba('+rgb[0]+', '+rgb[1]+', '+rgb[2]+', '+alpha+')';

	var measure_style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: rgba
		}),
		stroke: new ol.style.Stroke({
			color: strokeColor,
			lineDash: [10, 10],
			width: strokeWidth
		})
	});

	if(!this.measureVector){
		this.measureVector = new ol.layer.Vector({
			name:"ttmap_measureVector",
			source: new ol.source.Vector(),
			style: measure_style
		});

		this.map.addLayer(this.measureVector);
	} else {
		this.measureVector.setStyle(measure_style);
		this.measureVector.getSource().clear();
	}

	if(this.measureDraw){
		this.map.removeInteraction(this.measureDraw);
		this.measureDraw = null;
	}

	this.measureDraw = new ol.interaction.Draw({
		source: this.measureVector.getSource(),
		type: (type),
		style: measure_style,
		maxPoints: 150
	});

	//--

	if (this.measureTooltipElement) {
		this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
	}

	this.measureTooltipElement = document.createElement('div');
	this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';

	this.measureTooltip = new ol.Overlay({
		name:"meature_overlay_"+ this.getUUID(8,16),
		element: this.measureTooltipElement,
		offset: [0, -15],
		positioning: 'bottom-center'
	});

	this.map.addOverlay(this.measureTooltip);


	this.measureDraw.on('drawstart',
		function(evt) {
			//console.log('--measureDraw.drawstart');
			map.featureSelect.setActive(false);
			this.measureSketch = evt.feature;
			var tooltipCoord = evt.coordinate;
			this.measureListener = this.measureSketch.getGeometry().on('change', function(evt) {
				var geom = evt.target;
				var output;
				if (geom instanceof ol.geom.Polygon) {
					output = map.formatArea((geom));
					tooltipCoord = geom.getInteriorPoint().getCoordinates();
				} else if (geom instanceof ol.geom.LineString) {
					output = map.formatLength((geom));
					tooltipCoord = geom.getLastCoordinate();
				}

				map.measureTooltipElement.innerHTML = output;
				map.measureTooltip.setPosition(tooltipCoord);

			},this);

		}, this);

	this.measureDraw.on('drawend',
		function(evt) {
			//console.log('--measureDraw.drawend');
			map.measureResetHandler_();

		}, this);


	this.map.addInteraction(this.measureDraw);

};


/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
gis.ZMap.prototype.formatLength = function(line){
	//var wgs84Sphere = new ol.Sphere(6378137);
	var length;
	var sourceProj = this.map.getView().getProjection();
	//console.log('--Proj.code=='+sourceProj.getCode());
	if (sourceProj.getCode() == "EPSG:4326") {
		// var coordinates = line.getCoordinates();
		// length = 0;
		// for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
		// 	var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
		// 	var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
		// 	length += wgs84Sphere.haversineDistance(c1, c2);
		// }
		length = ol.sphere.getLength(line, {radius: 6378137,projection: sourceProj});
		//length = getLength(line, {projection: sourceProj/*, radius: 6371008.8*/});
	} else {
		length = Math.round(line.getLength() * 100) / 100;
	}
	var output;
	if (length > 100) {
		output = (Math.round(length / 1000 * 100) / 100) +
			' ' + 'km';
	} else {
		output = (Math.round(length * 100) / 100) +
			' ' + 'm';
	}
	return output;
};


/**
 * Format length output.
 * @param {ol.geom.Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
gis.ZMap.prototype.formatArea = function(polygon){
	//var wgs84Sphere = new ol.Sphere(6378137);
	var area;
	var sourceProj = this.map.getView().getProjection();
	if (sourceProj.getCode() == "EPSG:4326") {
		//var geom = (polygon.clone().transform(sourceProj, 'EPSG:4326'));
		//var coordinates = geom.getLinearRing(0).getCoordinates();
		//area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
		area = ol.sphere.getArea(polygon, {radius: 6378137,projection: sourceProj});
	} else {
		area = polygon.getArea();
	}
	var output;
	if (area > 10000) {
		output = (Math.round(area / 1000000 * 100) / 100) +
			' ' + 'km<sup>2</sup>';
	} else {
		output = (Math.round(area * 100) / 100) +
			' ' + 'm<sup>2</sup>';
	}
	return output;
};


//-------------map operation------------

/**
 * @param {boolean}
 */
gis.ZMap.prototype.setProxyEnable = function(enable){
	this.proxyEnable = enable;
};

/**
 * @param {Object} style
 */
gis.ZMap.prototype.initSelectStyle = function(style){

	if(style === undefined){
		style = {};
	}

	var alpha = goog.isDef(style.alpha) ? style.alpha : 0.2;
	var fillColor = goog.isDef(style.fillColor) ? style.fillColor : "#00CC33";
	var strokeWidth = goog.isDef(style.strokeWidth) ? style.strokeWidth : 2;
	var strokeColor = goog.isDef(style.strokeColor) ? style.strokeColor : '#3333FF';
	var radius = goog.isDef(style.radius) ? style.radius : 4;
	//
	var rgb = this.colorRgb(fillColor);
	var rgba = 'rgba('+rgb[0]+', '+rgb[1]+', '+rgb[2]+', '+alpha+')';

	this.featureSelectStyle = new ol.style.Style({
		fill: new ol.style.Fill({
			color: rgba
		}),
		stroke: new ol.style.Stroke({
			color: strokeColor,
			width: strokeWidth
		}),
		image: new ol.style.Circle({
			radius: radius,
			stroke: new ol.style.Stroke({color: strokeColor, width: strokeWidth}),
			fill: new ol.style.Fill({
				color: rgba
			})
		})
	});

	this.initSelectHandel_();
};

/**
 * @return {ol.Map}
 */
gis.ZMap.prototype.getOLMap = function(){
	return this.map;
};



/**
 * @param {String} groupKey
 */
gis.ZMap.prototype.visibleGroupBaseLayer = function(groupKey){
	if(this.baseMapLayers && goog.isArray(this.baseMapLayers)){
		//console.log('--groupKey=='+groupKey);
		for(var i=0;i<this.baseMapLayers.length;i++){
			var l = this.baseMapLayers[i];
			var group_key = l.get("groupKey")
			//console.log('--groupKey=='+groupKey);
			if(group_key && group_key.toUpperCase().indexOf(groupKey) != -1){
				l.setVisible(true);
			}else{
				l.setVisible(false);
			}
		}
	}
};

/**
 * @param {Number} baseLayerIndex
 */
gis.ZMap.prototype.switchBaseLayer = function(baseLayerIndex){
	if(this.baseMapLayers && goog.isArray(this.baseMapLayers)){
		if(baseLayerIndex >= this.baseMapLayers.length){
			return false;
		}
		//
		var selLayer = this.baseMapLayers[baseLayerIndex];
		selLayer.setVisible(true);
		var selGroupKey = selLayer.get("groupKey");
		//console.log('--selGroupKey=='+selGroupKey);
		for(var i=0;i<this.baseMapLayers.length;i++){
			var l = this.baseMapLayers[i];
			var groupKey = l.get("groupKey");
			//console.log('--groupKey=='+groupKey);
			if(groupKey && groupKey == selGroupKey){
				l.setVisible(true);
			}else{
				l.setVisible(false);
			}
		}
	}
};


/**
 * @param {ol.Coordinate} coordinate
 * @param {String} infoWindow content
 * @param {String} infoWindowWidth
 * @param {function} closeWindowCallBack
 */
gis.ZMap.prototype.infoWindowShow = function(coordinate,content,infoWindowWidth,closeWindowCallBack){
	//var contentElement = $("#popup-content");

	//if(content){
	var contentElement = $("#"+this.popupContentID);
	contentElement.html(content);
	this.infoWindow.setPosition(coordinate);
	//
	if(infoWindowWidth !== undefined && this.infoWindowElement){
		$(this.infoWindowElement).css("min-width", infoWindowWidth);
	}
	//}

	if(closeWindowCallBack !== undefined && goog.isFunction(closeWindowCallBack)){
		this.infoWindowCloseCallBack = closeWindowCallBack;
	} else {
		this.infoWindowCloseCallBack = null;
	}

};


/**
 * @param {number} w
 * @param {number} h
 */
gis.ZMap.prototype.setSize = function(w,h){
	var targetElement = this.map.getTargetElement();
	$(targetElement).css("width",w);
	$(targetElement).css("height",h);
	this.map.updateSize();
};

/**
 * @param {function} moveEndCallBack
 */
gis.ZMap.prototype.setMoveEndCallBack = function(moveEndCallBack){
	if(moveEndCallBack !== undefined && moveEndCallBack != null && goog.isFunction(moveEndCallBack)){
		this.moveEndCallBack = moveEndCallBack;
	} else {
		this.moveEndCallBack = null;
	}
};

/**
 */
gis.ZMap.prototype.infoWindowHide = function(){
	this.infoWindow.setPosition(undefined);
};


/**
 *
 */
gis.ZMap.prototype.zoomIn = function(){
	var zoom = this.getZoom()+1;
	this.map.getView().setZoom(zoom);
};


/**
 *
 */
gis.ZMap.prototype.zoomOut = function(){
	var zoom = this.getZoom()-1;
	this.map.getView().setZoom(zoom);
};

/**
 * @return {number}
 */
gis.ZMap.prototype.getZoom = function(){
	return this.map.getView().getZoom();
};


/**
 * @param {number}
 */
gis.ZMap.prototype.setZoom = function(zoomValue){
	this.map.getView().setZoom(zoomValue);
};

/**
 * @return {ol.Coordinate|undefined}
 */
gis.ZMap.prototype.getCenter = function(){
	return this.map.getView().getCenter();
};

/**
 * @param {ol.Coordinate} coordinate
 */
gis.ZMap.prototype.setCenter = function(coordinate){
	this.map.getView().setCenter(coordinate);
};


/**
 *
 */
gis.ZMap.prototype.pan = function(direction){
	var pixelDelta = 128;
	var duration = 100;

	var view = this.map.getView();
	var mapUnitsDelta = view.getResolution() * pixelDelta;

	var deltaX = 0, deltaY = 0;
	if (direction == 'south') {
		deltaY = -mapUnitsDelta;
	} else if (direction == 'west') {
		deltaX = -mapUnitsDelta;
	} else if (direction == 'east') {
		deltaX = mapUnitsDelta;
	} else {
		deltaY = mapUnitsDelta;
	}
	var delta = [deltaX, deltaY];
	ol.coordinate.rotate(delta, view.getRotation());

	// pan
	var currentCenter = view.getCenter();
	if (currentCenter) {
		/*
		 if (duration && duration > 0) {
		 map.beforeRender(ol.animation.pan({
		 source: currentCenter,
		 duration: duration,
		 easing: ol.easing.linear
		 }));
		 }
		 */
		var center = view.constrainCenter([currentCenter[0] + delta[0], currentCenter[1] + delta[1]]);
		view.setCenter(center);
	}

};


/**
 * @param {ol.Coordinate} coordinate
 */
gis.ZMap.prototype.flyToCenter = function(coordinate){
	var duration = 2000;
	var start = +new Date();
	var view = this.map.getView();

	var pan = ol.animation.pan({
		duration: duration,
		source: view.getCenter(),
		start: start
	});

	var bounce = ol.animation.bounce({
		duration: duration,
		resolution: 2 * view.getResolution(),
		start: start
	});

	this.map.beforeRender(pan, bounce);
	view.setCenter(coordinate);
};

/**
 * @param {String} proxyUrl
 */
gis.ZMap.prototype.setProxyUrl = function(proxyUrl){
	this.proxyUrl = proxyUrl;
};


/**
 * @param {Array} wmsLayers
 * @param {Number} featureCount
 * @param {Function} callBack
 */
gis.ZMap.prototype.getFeatureInfoLayers = function(wmsLayers,featureCount,infoFormat,callBack){

	this.featureInfoLayers = wmsLayers;
	this.featureCount = featureCount;
	if(infoFormat !== undefined){
		this.featureInfoFormat = infoFormat;
	}

	if(callBack !== undefined && goog.isFunction(callBack)){
		this.featureInfoFunction = callBack;
	} else {
		this.featureInfoFunction = null;
	}
};

/**
 * @param {Function} callBack
 */
gis.ZMap.prototype.getMapClickCoordinate = function(callBack){
	this.featureInfoLayers = [];
	this.featureCount = 1;

	if(callBack !== undefined && goog.isFunction(callBack)){
		this.featureInfoFunction = callBack;
	} else {
		this.featureInfoFunction = null;
	}
};

/**
 */
gis.ZMap.prototype.clearFeatureInfoLayers = function(){
	this.featureInfoLayers = [];
	this.featureInfoFunction = null;
};


/**
 * @param {ol.Extent} extent.
 */
gis.ZMap.prototype.zoomToExtent = function(extent) {
	this.map.getView().fit(extent, this.map.getSize());
};

/**
 * @param {ol.layer.Base} vectorLayer.
 */
gis.ZMap.prototype.zoomToVectorLayer = function(vectorLayer) {
	var extent = vectorLayer.getSource().getExtent();
	this.map.getView().fit(extent, this.map.getSize());
};

/**
 * @param {ol.geom.Geometry} geometry.
 */
gis.ZMap.prototype.zoomToGeometry = function(geometry) {
	var extent = geometry.getExtent();
	this.map.getView().fit(extent, this.map.getSize());
};

/**
 * @param {ol.Feature} feature.
 */
gis.ZMap.prototype.zoomToFeature= function(feature) {
	var extent = feature.getGeometry().getExtent();
	this.map.getView().fit(extent, this.map.getSize());
};

/**
 * @param {ol.Feature} feature.
 * @param {number} value extent should be buffered.
 */
gis.ZMap.prototype.zoomToBufferFeature= function(feature,value) {
	var extent = feature.getGeometry().getExtent();
	var big_extent = ol.extent.buffer(extent,value);
	this.map.getView().fit(big_extent, this.map.getSize());
};

//-------------style operation-------------

/**
 * @param {Object} options style options.
 * @return {ol.style.Style}
 */
gis.ZMap.prototype.getIconStyle = function(options){
	if(options === undefined){
		options = {};
	}
	var src = goog.isDef(options.src) ? options.src : "";
	if(src ===""){
		return null;
	}
	var anchor = goog.isDef(options.anchor) ? options.anchor : [0.5, 0.5];
	var size = goog.isDef(options.size) ? options.size : null;
	var offset = goog.isDef(options.offset) ? options.offset : [0,0];
	var anchorXUnits = goog.isDef(options.anchorXUnits) ? options.anchorXUnits : "fraction";
	var anchorYUnits = goog.isDef(options.anchorYUnits) ? options.anchorYUnits : "fraction";
	var opacity = goog.isDef(options.opacity) ? options.opacity : 1;
	var text = this.createTextStyle(options);
	//
	var style = new ol.style.Style({
		image: new ol.style.Icon({
			anchor: anchor,
			size: size,
			offset: offset,
			anchorXUnits: anchorXUnits,
			anchorYUnits: anchorYUnits,
			opacity: opacity,
			src: src
		}),
		text: text
	});

	return style;
};


/**
 * @param {Object} options style options.
 * @return {ol.style.Style}
 */
gis.ZMap.prototype.getCircleStyle = function(options){
	if(options === undefined){
		options = {};
	}
	var radius = goog.isDef(options.radius) ? options.radius : 10;
	var fillColor = goog.isDef(options.fillColor) ? options.fillColor : "#FFFFFF";
	var borderWidth = goog.isDef(options.borderWidth) ? options.borderWidth : 2;
	var borderColor = goog.isDef(options.borderColor) ? options.borderColor : 'blue';
	var text = this.createTextStyle(options);
	//--
	var style = new ol.style.Style({
		image: new ol.style.Circle({
			radius: radius,
			fill: new ol.style.Fill({
				color: fillColor
			}),
			stroke: new ol.style.Stroke({color: borderColor, width: borderWidth})
		}),
		text: text
	});
	return style;
};

/**
 * @param {Object} options style options.
 * @return {ol.style.Style}
 */
gis.ZMap.prototype.getRegularStyle = function(options){
	if(options === undefined){
		options = {};
	}
	var points = goog.isDef(options.points) ? options.points : 4;
	var angle = goog.isDef(options.angle) ? options.angle : Math.PI/4;
	var radius = goog.isDef(options.radius) ? options.radius : 10;
	var fillColor = goog.isDef(options.fillColor) ? options.fillColor : "#FFFFFF";
	var borderWidth = goog.isDef(options.borderWidth) ? options.borderWidth : 2;
	var borderColor = goog.isDef(options.borderColor) ? options.borderColor : 'blue';
	var text = this.createTextStyle(options);
	//--
	var style = new ol.style.Style({
		image: new ol.style.RegularShape({
			points: 4,
			radius: radius,
			angle: angle,
			fill: new ol.style.Fill({
				color: fillColor
			})
		}),
		text: text
	});
	return style;
};

/**
 * @param {Object} options style options.
 * @return {ol.style.Style}
 */
gis.ZMap.prototype.getLineStyle = function(options){
	if(options === undefined){
		options = {};
	}
	var color = goog.isDef(options.color) ? options.color : "red";
	var width = goog.isDef(options.width) ? options.width : 2;
	var text = this.createTextStyle(options);
	//--
	var style = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: color,
			width: width
		}),
		text: text

	});
	return style;
};

/**
 * @param {Object} options style options.
 * @return {ol.style.Style}
 */
gis.ZMap.prototype.getPolygonStyle = function(options){
	if(options === undefined){
		options = {};
	}
	var fillColor = goog.isDef(options.fillColor) ? options.fillColor : "#FFFFFF";
	var borderWidth = goog.isDef(options.borderWidth) ? options.borderWidth : 2;
	var borderColor = goog.isDef(options.borderColor) ? options.borderColor : 'blue';
	var text = this.createTextStyle(options);
	//--
	var style = null;
	if(borderWidth == 0){
		style = new ol.style.Style({
			fill: new ol.style.Fill({
				color: fillColor
			}),
			text: text
		});

	} else {
		if(options.borderDash) {
			style = new ol.style.Style({
				fill: new ol.style.Fill({
					color: fillColor
				}),
				stroke: new ol.style.Stroke({
					lineDash:[10,8],
					color: borderColor,
					width: borderWidth
				}),
				text: text
			});
		} else {
			style = new ol.style.Style({
				fill: new ol.style.Fill({
					color: fillColor
				}),
				stroke: new ol.style.Stroke({
					color: borderColor,
					width: borderWidth
				}),
				text: text
			});
		}

	}

	return style;
};


gis.ZMap.prototype.createTextStyle = function(options) {
	if(options === undefined){
		options = {};
	}
	var textType = goog.isDef(options.textType) ? options.textType : "normal";			//normal;hide;shorten;wrap
	var textAlign = goog.isDef(options.textAlign) ? options.textAlign : "center";		//center;left;right;start;end
	var baseline = goog.isDef(options.baseline) ? options.baseline : "middle";			//middle;top;bottom;alphabetic;hanging;ideographic
	var fontSize = goog.isDef(options.fontSize) ? options.fontSize : "14px";
	var textOffsetX = goog.isDef(options.textOffsetX) ? options.textOffsetX : 0;
	var textOffsetY = goog.isDef(options.textOffsetY) ? options.textOffsetY : 0;
	var fontWeight = goog.isDef(options.fontWeight) ? options.fontWeight : "bold";		//normal,bold
	var fontFamily = goog.isDef(options.fontFamily) ? options.fontFamily : "微软雅黑";
	var textRotation = goog.isDef(options.textRotation) ? options.textRotation : 0;
	var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
	var fontColor = goog.isDef(options.fontColor) ? options.fontColor : "#000000";
	var fontOutlineColor = goog.isDef(options.fontOutlineColor) ? options.fontOutlineColor : "#FFFFFF";
	var fontOutlineWidth = goog.isDef(options.fontOutlineWidth) ? options.fontOutlineWidth : 3;
	var maxResolution = goog.isDef(options.maxResolution) ? options.maxResolution : -1;

	//--
	var text = goog.isDef(options.text) ? options.text : "";
	/*
	 if (resolution > maxResolution) {
	 //text = '';
	 } else if (type == 'hide') {
	 text = '';
	 } else if (type == 'shorten') {
	 text = text.length > 12 ? text.substr(0, 12 - 1) + '...' : text.substr(0);
	 //text = text.trunc(12);
	 } else if (type == 'wrap') {
	 text = this.stringDivider(text, 16, '\n');
	 }
	 */

	var stroke = null;
	if(fontOutlineWidth > 0){
		stroke = new ol.style.Stroke({color: fontOutlineColor, width: fontOutlineWidth});
	}

	//var textStyle = new ol.style.Style({

		var textStyle= new ol.style.Text({
			textAlign: textAlign,
			textBaseline: baseline,
			font: font,
			text: text,
			fill: new ol.style.Fill({color: fontColor}),
			stroke: stroke,
			offsetX: textOffsetX,
			offsetY: textOffsetY,
			rotation: textRotation
		});
	//});

	return textStyle;
};

//-------------layer operation-------------

/**
 * @param {String} name layer name.
 * @return {ol.layer.Base} layer Layer.
 */
gis.ZMap.prototype.getLayer = function(name) {
	var layers = this.map.getLayerGroup().getLayers();
	var len = layers.getLength();
	for(var i=0;i<len;i++){
		var layer = layers.item(i);
		var layerName = layer.get("name");
		//console.log('--layerName=='+layerName);
		//if(layerName && layerName === name){
		if(goog.isDef(layerName) && layerName === name){
			//console.log('--layerName=='+layerName);
			return layer;
		}
	}
	return null;
};

//得到所有图层
gis.ZMap.prototype.getLayersByName = function(name) {
	var layers = this.map.getLayerGroup().getLayers();
	var len = layers.getLength();
	var rl = [];
	for(var i=0;i<len;i++){
		var layer = layers.item(i);
		var layerName = layer.get("name");
		//console.log('--layerName=='+layerName);
		//if(layerName && layerName === name){
		if(goog.isDef(layerName) && layerName.indexOf(name) > -1){
			//console.log('--layerName=='+layerName);
			rl.push(layerName);
		}
	}
	return rl;
};
/**
 * @param {String|ol.layer.Base} layer
 * @param {Boolean} visible layer visible.
 */
gis.ZMap.prototype.setLayerVisible = function(layer,visible) {
	if(goog.isString(layer)){
		var layers = this.map.getLayerGroup().getLayers().getArray();
		$.each(layers,function(n,l){
			if(goog.isDef(l.get("name")) && l.get("name") === layer){
				l.setVisible(visible);
				return false;
			}
		});
	} else {
		if (layer instanceof ol.layer.Base) {
			layer.setVisible(visible);
		}
	}
};


/**
 * @param {String|ol.layer.Base} layer
 * @param {number} zindex layer zindex.
 */
gis.ZMap.prototype.setLayerZIndex = function(layer,zindex) {
	if(goog.isString(layer)){
		var layers = this.map.getLayerGroup().getLayers().getArray();
		$.each(layers,function(n,l){
			if(goog.isDef(l.get("name")) && l.get("name") === layer){
				l.setZIndex(zindex);
				return false;
			}
		});
	} else {
		if (layer instanceof ol.layer.Base) {
			layer.setZIndex(zindex);
		}
	}
};

/**
 * @param {String|ol.layer.Base} layer
 * @param {number} value Opacity value.
 */
gis.ZMap.prototype.setLayerOpacity = function(layer,value) {
	if(goog.isString(layer)){
		var layers = this.map.getLayerGroup().getLayers().getArray();
		$.each(layers,function(n,l){
			if(goog.isDef(l.get("name")) && l.get("name") === layer){
				l.setOpacity(value);
				return false;
			}
		});
	} else {
		if (layer instanceof ol.layer.Base) {
			layer.setOpacity(value);
		}
	}
};


/**
 * @param {String|ol.layer.Layer} layer
 */
gis.ZMap.prototype.refreshLayer = function(layer) {



	if(goog.isString(layer)){
		var layers = this.map.getLayerGroup().getLayers();
		var len = layers.getLength();
		for(var i=0;i<len;i++){
			var l = layers.item(i);
			var layerName = l.get("name");
			if(goog.isDef(layerName) && layerName === layer){
				if (l instanceof ol.layer.Layer) {
					var params = l.getSource().getParams();
					params.t = Math.random();//new Date().getMilliseconds();
					l.getSource().updateParams(params);
				}
			}
		}
	} else {
		if (layer instanceof ol.layer.Layer) {
			var params = layer.getSource().getParams();
			params.t = Math.random();//new Date().getMilliseconds();
			layer.getSource().updateParams(params);
		}
	}
};

/**
 * @param {Object} options layer options.
 * @return {ol.layer.Base} layer Layer.
 */
gis.ZMap.prototype.getArcgisTileLayer = function(opt_options) {
	var options = opt_options ? opt_options :({});
	var name = goog.isDef(options.name) ? options.name : null;
	var url = goog.isDef(options.url) ? options.url : null;
	var tileSize = goog.isDef(options.tileSize) ? options.tileSize : 256;
	var projection = goog.isDef(options.projection) ? options.projection : null;
	var origin = goog.isDef(options.origin) ? options.origin : null;
	var resolutions = goog.isDef(options.resolutions) ? options.resolutions : null;
	var extent = goog.isDef(options.extent) ? options.extent : null;


	var tileGrid = new ol.tilegrid.TileGrid({
		tileSize : tileSize,
		origin : origin,
		extent : extent,
		resolutions : resolutions
	});

	// 瓦片数据源
	var tileArcGISXYZ = new ol.source.XYZ({
		tileGrid : tileGrid,
		projection : projection,
		url : url
	});

	var arcgistileLayer = new ol.layer.Tile({
		name : name,
		source : tileArcGISXYZ
	});

	return arcgistileLayer;
}

/**
 * @param {Object} options layer options.
 * @return {ol.layer.Base} layer Layer.
 */
gis.ZMap.prototype.addTileLayer = function(options) {
	var name = goog.isDef(options.name) ? options.name : "layer_"+ this.getUUID(8,16);
	var title = goog.isDef(options.title) ? options.title : "tileLayer";
	var visible = goog.isDef(options.visible) ? options.visible : undefined;
	var url = goog.isDef(options.url) ? options.url : "";

	//
	if(visible === undefined){
		visible = true;
	}
	//--
	var l = this.getLayer(name);
	if(l != null){
		this.setLayerVisible(l,visible);
		return l;
	}

	l = new ol.layer.Tile({
		name: name,
		title: title,
		visible: visible,
		source:new ol.source.XYZ({
			url: url
		})
	});

	this.map.addLayer(l);
	return l;
};


/**
 * @param {Object} options layer options.
 * @return {ol.layer.Base} layer Layer.
 */
gis.ZMap.prototype.addWMSLayer = function(options) {
	var name = goog.isDef(options.name) ? options.name : "layer_"+ this.getUUID(8,16);
	var title = goog.isDef(options.title) ? options.title : "wmsLayer";
	var visible = goog.isDef(options.visible) ? options.visible : undefined;
	var url = goog.isDef(options.url) ? options.url : "";
	var layers = goog.isDef(options.layers) ? options.layers : "";
	var version = goog.isDef(options.version) ? options.version : "1.3.0";
	//var singleclick = goog.isDef(options.singleclick) ? options.singleclick: false;
	var tiled = goog.isDef(options.tiled) ? options.tiled: true;
	var params = goog.isDef(options.params) ? options.params: {};

	//--
	if(url == "" || layers==""){
		return null;
	}
	//--
	if(visible === undefined){
		visible = true;
	}
	//--
	var l = this.getLayer(name);
	if(l != null){
		this.setLayerVisible(l,visible);
		return l;
	}

	if(tiled){
		var baseParams = {LAYERS:layers,TILED:tiled,VERSION:version};
		goog.object.extend(baseParams,params);

		l = new ol.layer.Tile({
			name: name,
			title: title,
			visible: visible,
			source: new ol.source.TileWMS({
				url: url,
				params: baseParams
			})
		});
	}else{
		var baseParams = {LAYERS:layers,VERSION:version};
		goog.object.extend(baseParams,params);

		l = new ol.layer.Image({
			name: name,
			title: title,
			visible: visible,
			source: new ol.source.ImageWMS({
				url: url,
				params: baseParams
			})
		});
	}

	this.map.addLayer(l);
	return l;
};

/**
 * @param {Object} options layer options.
 * @return {ol.layer.Base} layer Layer.
 */
gis.ZMap.prototype.addVectorLayer = function(options) {
	var name = goog.isDef(options.name) ? options.name : "layer_"+ this.getUUID(8,16);
	var title = goog.isDef(options.title) ? options.title : "VectorLayer";
	var visible = goog.isDef(options.visible) ? options.visible : undefined;
	var style = goog.isDef(options.style) ? options.style : null;
	var labelEnable = goog.isDef(options.labelEnable) ? options.labelEnable : false;
	//
	if(visible === undefined){
		visible = true;
	}
	//--
	var l = this.getLayer(name);
	if(l != null){
		this.setLayerVisible(l,visible);
		return l;
	}
	//
	var source = new ol.source.Vector({});

	if(labelEnable){
		l = new ol.layer.Vector({
			name: name,
			labelEnable: true,
			title: title,
			visible: visible,
			//style: style,
			style: function(feature, resolution) {
				var attributes = feature.get('attributes');
				var labelMaxResolution = goog.isDef(attributes.labelMaxResolution) ? attributes.labelMaxResolution : -1;
				var label = attributes.label;
				var f_style = attributes.defaultStyle;

				if(labelMaxResolution != -1 && resolution > labelMaxResolution){
					label = "";
				}

				var styles = [];
				if(f_style){
					if (Array.isArray(f_style)) {
						styles = f_style;
					} else if(f_style instanceof ol.style.Style) {
						styles = [f_style];
					} else {
						var newStyle = new ol.style.Style({});
						styles = [newStyle];
					}
				}


				var text = null;
				var ref_style = styles[0];
				//if(ref_style.getText()){
				//text = ref_style.getText().clone();
				//} else {
				text = new ol.style.Text({
					font: "bold 14px 微软雅黑",
					fill: new ol.style.Fill({
						color: "#000"
					})
				});
				//}
				text.setText(label);
				ref_style.setText(text);


				/*
				 if(f_style){
				 console.log('--f_style not null..');
				 if(f_style.getText()){
				 //console.log('--f_style.getText not null..');
				 //f_style.getText().setText(label);
				 f_style.setText(new ol.style.Text({
				 font: "bold 14px 微软雅黑",
				 text: label,
				 fill: new ol.style.Fill({
				 color: "#000"
				 })
				 }));

				 var svgStyle = new ol.style.Style({
				 text: new ol.style.Text({
				 font: "bold 14px 微软雅黑",
				 text: label,
				 fill: new ol.style.Fill({
				 color: "#000"
				 })
				 })
				 });

				 //return svgStyle;

				 }else{
				 console.log('--f_style.getText is null..');
				 }

				 } else {
				 console.log('--f_style is null..');
				 }
				 */

				/*
				 if(f_style !== undefined && f_style && f_style.getText()){
				 f_style.getText().setText(label);
				 }
				 */

				return ref_style;
			},
			source: source
		});

	} else {
		l = new ol.layer.Vector({
			name: name,
			labelEnable: labelEnable,
			title: title,
			visible: visible,
			style: style,
			source: source
		});
	}
	//
	this.map.addLayer(l);
	return l;
};


/**
 * @param {Object} options Overlay options.
 * @return {ol.Overlay} Overlay.
 */
gis.ZMap.prototype.addOverlay = function(options) {
	var name = goog.isDef(options.name) ? options.name : "overlay_"+ this.getUUID(8,16);
	var positioning = goog.isDef(options.positioning) ? options.positioning : 'bottom-center';
	var offset = goog.isDef(options.offset) ? options.offset : undefined;
	var className = goog.isDef(options.className) ? options.className : "ol-tooltip ol-tooltip-measure";
	var element = goog.isDef(options.element) ? options.element : null;
	var autoPan = goog.isDef(options.autoPan) ? options.autoPan : false;
	var autoPanAnimation = goog.isDef(options.autoPanAnimation) ? options.autoPanAnimation : undefined;
	var stopEvent = goog.isDef(options.stopEvent) ? options.stopEvent : true;
	//
	if(!element){
		element = document.createElement('div');
	}
	element.className = className;

	var overlay = new ol.Overlay({
		name: name,
		stopEvent: stopEvent,
		element: element,
		offset: offset,
		positioning: positioning
	});
	this.map.addOverlay(overlay);
	return overlay;
};


/**
 * @param {Object} options Overlay options.
 * @return {ol.Overlay} Overlay.
 */
gis.ZMap.prototype.addOverlayPopup = function(options) {
	var name = goog.isDef(options.name) ? options.name : "overlay_"+ this.getUUID(8,16);
	var position = goog.isDef(options.position) ? options.position : map.getCenter;
	var positioning = goog.isDef(options.positioning) ? options.positioning : 'bottom-center';
	var offset = goog.isDef(options.offset) ? options.offset : undefined;
	var className = goog.isDef(options.className) ? options.className : "ol-tooltip ol-tooltip-measure";
	var element = goog.isDef(options.element) ? options.element : null;
	var autoPan = goog.isDef(options.autoPan) ? options.autoPan : false;
	var autoPanAnimation = goog.isDef(options.autoPanAnimation) ? options.autoPanAnimation : undefined;
	var stopEvent = goog.isDef(options.stopEvent) ? options.stopEvent : true;
	//
	if(!element){
		element = document.createElement('div');
	}
	element.className = className;

	var overlay = new ol.Overlay({
		name: name,
		position:position,
		stopEvent: stopEvent,
		element: element,
		offset: offset,
		positioning: positioning
	});
	this.map.addOverlay(overlay);
	return overlay;
};

/**
 * @param {String} name overlay name.
 */
gis.ZMap.prototype.removeOverlay = function(name) {
	//console.log('--removeOverlay=='+name);
	var t_map = this.map;
	var overlays = this.map.getOverlays();
	var items = overlays.getArray();
	//console.log('--items.lenght=='+items.length);
	$.each(items,function(n,item) {
		if(goog.isDef(item.get("name")) && item.get("name") === name){
			//console.log('--name=='+name);
			t_map.removeOverlay(item);
			return false;
		}
	});
};

/**
 * @param {String} name overlay name.
 */
gis.ZMap.prototype.removeOverlayByPrefix = function(name) {
	var t_map = this.map;
	var overlays = this.map.getOverlays();
	var items = overlays.getArray();
	$.each(items,function(n,item) {
		if(goog.isDef(item.get("name")) && item.get("name").indexOf(name)>-1){
			t_map.removeOverlay(item);
			return false;
		}
	});
};

/**
 * @param {String} name layer name.
 */
gis.ZMap.prototype.removeLayer = function(name) {
	var t_map = this.map;
	var layers = this.map.getLayerGroup().getLayers();
	var items = layers.getArray();
	$.each(items,function(n,item) {
		if(goog.isDef(item.get("name")) && item.get("name") === name){
			t_map.removeLayer(item);
			return false;
		}
	});
};


//-------------feature operation-------------

/**
 * @param {ol.geom.Geometry} geometry.
 * @return {ol.Coordinate} coordinate
 */
gis.ZMap.prototype.getGeometryCenter = function(geometry) {
	var geom_type = geometry.getType();
	if(geom_type == "Point"){
		return geometry.getCoordinates();
	}

	if(geom_type == "MultiPoint"){
		return geometry.getFirstCoordinate();
	}

	if(geom_type == "LinearRing" || geom_type == "LineString"){
		//return geometry.getCoordinates()[0];
		var centerPoint = geometry.getFirstCoordinate();
		var coordinates = geometry.getCoordinates();
		if(coordinates.length == 2){
			var pFrom = coordinates[0];
			var pTo = coordinates[1];
			centerPoint = [Math.abs(pTo[0]+(pFrom[0]-pTo[0])/2),Math.abs(pTo[1]+(pFrom[1]-pTo[1])/2)];
		} else if (coordinates.length % 2 == 0){
			var fIndex = parseInt(coordinates.length / 2 - 1);
			var tIndex = parseInt(coordinates.length / 2);
			var pFrom = coordinates[fIndex];
			var pTo = coordinates[tIndex];
			centerPoint = [Math.abs(pTo[0]+(pFrom[0]-pTo[0])/2),Math.abs(pTo[1]+(pFrom[1]-pTo[1])/2)];
		} else {
			var c_index = parseInt(coordinates.length/2);
			centerPoint = coordinates[c_index];
		}

		return centerPoint;
	}

	if(geom_type == "Polygon" || geom_type == "MultiPolygon"){
    var center = geometry.getInteriorPoint().getCoordinates();   //获取区域内部点		return center;
	}

	return geometry.getFirstCoordinate();
};


gis.ZMap.prototype.getGeometryFromWKT = function(wkt,fromProjection,toProjection) {
	var geom = this.wktFormat.readGeometry(wkt);
	if(fromProjection !== undefined && toProjection !== undefined){
		geom.transform(fromProjection,toProjection);
	}
	return geom;
};


gis.ZMap.prototype.getGeometryFromJSON = function(json,fromProjection,toProjection) {
	var geom = this.jsonFormat.readGeometry(json);
	if(fromProjection !== undefined && toProjection !== undefined){
		geom.transform(fromProjection,toProjection);
	}
	return geom;
};


gis.ZMap.prototype.createPoint = function(coordinates,fromProjection,toProjection) {
	var p = new ol.geom.Point(coordinates);
	if(fromProjection !== undefined && toProjection !== undefined){
		p.transform(fromProjection,toProjection);
	}
	return p;
};

gis.ZMap.prototype.createLine = function(coordinates,fromProjection,toProjection) {
	//[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6],[0, 6e6], [-2e6, 6e6]]
	var line = new ol.geom.LineString(coordinates);
	if(fromProjection !== undefined && toProjection !== undefined){
		line.transform(fromProjection,toProjection);
	}
	return line;
};

gis.ZMap.prototype.createMLine = function(coordinates,fromProjection,toProjection) {
	//[[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6],[0, 6e6], [-2e6, 6e6]]]
	var line = new ol.geom.MultiLineString(coordinates);
	if(fromProjection !== undefined && toProjection !== undefined){
		line.transform(fromProjection,toProjection);
	}
	return line;
};

gis.ZMap.prototype.createPolygon = function(coordinates,fromProjection,toProjection) {
	var py = new ol.geom.Polygon(coordinates);
	if(fromProjection !== undefined && toProjection !== undefined){
		py.transform(fromProjection,toProjection);
	}
	return py;
};


/**
 * @param {ol.geom.Geometry} geometry.
 * @param {String} fromProjection.
 * @param {String} toProjection.
 */
gis.ZMap.prototype.geometryTransform = function(geometry,fromProjection,toProjection) {
	geometry.transform(fromProjection,toProjection);
};

/**
 * @param {ol.Feature} feature.
 * @param {String} fromProjection.
 * @param {String} toProjection.
 */
gis.ZMap.prototype.featureTransform = function(feature,fromProjection,toProjection) {
	feature.getGeometry().transform(fromProjection,toProjection);
};

/**
 * @param {ol.layer.Base} vectorLayer.
 * @param {String} geoWKT.
 * @param {Object} attributes.
 * @return {ol.Feature} feature.
 */
gis.ZMap.prototype.getFeatureFormWKT = function(vectorLayer,geoWKT,attributes) {
	var tooltip = goog.isDef(attributes.tooltip) ? attributes.tooltip : null;
	var fromProjection = goog.isDef(attributes.fromProjection) ? attributes.fromProjection : null;
	var toProjection = goog.isDef(attributes.toProjection) ? attributes.toProjection : null;
	var style = goog.isDef(attributes.style) ? attributes.style : null;

	delete attributes.fromProjection;
	delete attributes.toProjection;
	delete attributes.style;
	//
	var g = this.wktFormat.readFeature(geoWKT);
	g.set('attributes',attributes);
	if(tooltip){
		g.set('tooltip',tooltip);
	}

	if(style){
		g.setStyle(style);
	}

	if(fromProjection && toProjection){
		this.featureTransform(g,fromProjection,toProjection);
	}

	vectorLayer.getSource().addFeature(g);
	return g;
};

/**
 * @param {ol.layer.Base} vectorLayer.
 * @param {ol.geom.Geometry} geometry.
 * @param {Object} attributes.
 * @return {ol.Feature} feature.
 */
gis.ZMap.prototype.addFeature = function(vectorLayer,geometry,attributes) {
	var id = goog.isDef(attributes.id) ? attributes.id : null;
	var tooltip = goog.isDef(attributes.tooltip) ? attributes.tooltip : null;
	var fromProjection = goog.isDef(attributes.fromProjection) ? attributes.fromProjection : null;
	var toProjection = goog.isDef(attributes.toProjection) ? attributes.toProjection : null;
	var style = goog.isDef(attributes.style) ? attributes.style : null;

	delete attributes.fromProjection;
	delete attributes.toProjection;
	delete attributes.style;
	//
	var g = new ol.Feature({geometry:geometry});
	if(id){
		g.setId(id);
	}
	g.set('attributes',attributes);
	if(tooltip){
		g.set('tooltip',tooltip);
	}

	if(style){
		g.setStyle(style);
	}

	if(fromProjection && toProjection){
		this.featureTransform(g,fromProjection,toProjection);
	}

	vectorLayer.getSource().addFeature(g);
	return g;
};

/**
 * @param {ol.layer.Base} vectorLayer.
 * @param {ol.Feature} feature.
 */
gis.ZMap.prototype.addLayerFeature = function(vectorLayer,feature) {
	var attributes = feature.get("attributes");
	if(attributes !== undefined && attributes != null ){
		var tooltip = goog.isDef(attributes.tooltip) ? attributes.tooltip:undefined;
		if(tooltip !== undefined ){
			feature.set('tooltip',tooltip);
		}
		//--
		var labelFlag = goog.isDef(attributes.label) ? true : false;
		var labelLayerFlag = vectorLayer.get("labelEnable");
		if(labelLayerFlag && labelFlag){
			//attributes.labelMaxResolution = vectorLayer.getMaxResolution();
			//attributes.style = feature.getStyle().clone();
			if(!attributes.defaultStyle){
				attributes.defaultStyle = feature.getStyle().clone();
			}
			feature.setStyle(null);
		}
	}

	vectorLayer.getSource().addFeature(feature);

};

/**
 * @param {ol.geom.Geometry} geometry.
 * @param {Object} attributes.
 * @param {ol.style.Style} style.
 * @return {ol.Feature} feature.
 */
gis.ZMap.prototype.createFeature = function(geometry,attributes,style) {

	var id = goog.isDef(attributes.id) ? attributes.id : "fid_"+this.getUUID(8,16);
	var tooltip = goog.isDef(attributes.tooltip) ? attributes.tooltip : null;

	var g = new ol.Feature({geometry:geometry});

	if(style !== undefined ){
		g.setStyle(style);
	}

	if(id){
		g.setId(id);
	}

	if(tooltip){
		g.set('tooltip',tooltip);
	}

	if(attributes){
		g.set('attributes',attributes);
	}



	return g;
};


/**
 * @param {ol.layer.Tile|ol.layer.Image} wmsLayer.
 * @param {String} propertyName.
 * @param {String} propertyValue.
 * @param {function} callBack.
 * @return {ol.Feature} feature.
 */
gis.ZMap.prototype.getWMSLayerFeature = function(layer,propertyStr,callBack){
//propertyName,propertyValue
	//值相等的
//	var filter = "<ogc:Filter xmlns:ogc='http://www.opengis.net/ogc'>"+
//				 	"<ogc:PropertyIsEqualTo>"+
//				 		"<ogc:PropertyName>"+propertyName+"</ogc:PropertyName>"+
//              	 		"<ogc:Literal>"+propertyValue+"</ogc:Literal>"+
//            	 	"</ogc:PropertyIsEqualTo>"+
//          		"</ogc:Filter>";

	//值相似的
//	var filter = "<ogc:Filter xmlns:ogc='http://www.opengis.net/ogc'>"+propertyStr+"</ogc:Filter>";
	//	"<ogc:PropertyIsLike wildCard='*' singleChar='?' escapeChar='\'>"+
	//		"<ogc:PropertyName>"+propertyName+"</ogc:PropertyName>"+
//	 		"<ogc:Literal>"+propertyValue+"</ogc:Literal>"+
	//	"</ogc:PropertyIsLike>"+

	var filter =  this.getFilterXML(propertyStr);
	var typeName = layer.getSource().getParams()["LAYERS"];
	var url = null;

	if(layer.getSource() instanceof ol.source.ImageWMS){
		url = layer.getSource().getUrl();
	}else if(layer.getSource() instanceof ol.source.TileWMS){
		url = layer.getSource().getUrls()[0];
	}
	var parentMap = this;
	if(url){
		url = url.replace("/wms","/ows");
		url = url +'?service=WFS&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&version=1.1.0&typename='+typeName+'&filter='+encodeURIComponent(filter);
		//url = url +'?service=WFS&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&version=1.1.0&typename='+typeName+'&filter='+filter;

		//$.getJSON(this.proxyUrl + this.base64Encode(url),function(response) {
		$.getJSON(url,function(response) {
			if(response){
				var features = (new ol.format.GeoJSON()).readFeatures(response);
				//console.log('--features.length=='+features.length);
				if(features.length > 0){
					$.each(features,function(n,ele){
						var attributes = ele.getProperties();
						var key;
						for (key in attributes) {
							//ele.unset(key);
						}
						var fid = ele.getId();
						var id_infos = fid.split(".");
						//console.log(id_infos[0]+'=='+id_infos[1]);
						attributes.objectId = id_infos[1];
						attributes.objectName = id_infos[0];
						ele.set('attributes',attributes);
					});

					if(callBack !== undefined && goog.isFunction(callBack)){
						callBack(features,parentMap);
					}

				}
			}
		});

	}

};

gis.ZMap.prototype.getFilterXML = function(options) {

	// var filters = goog.isDef(options) ? options : [];
	var filters = options;
	var xml = [];

	xml.push("<ogc:Filter xmlns:ogc='http://www.opengis.net/ogc'>");
	console.log(filters);

	if(filters.fields.length > 1 && filters.logical && filters.logical === "AND"){
		xml.push("<ogc:And>");
	}

	if(filters.fields.length > 1 && filters.logical && filters.logical === "OR"){
		xml.push("<ogc:Or>");
	}

	// if(filters && filters.length > 0){
	if(filters.fields && filters.fields.length > 0){
		for(var k=0;k<filters.fields.length;k++){
			var field = filters.fields[k];
			if(field.compare && field.compare === "LIKE"){

				//--模糊查询
				xml.push("<ogc:PropertyIsLike wildCard=\"*\" singleChar=\".\" escape=\"!\">");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push("<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push("</ogc:PropertyIsLike>");
			}else if(field.compare && field.compare === "EQUAL"){
				xml.push( "<ogc:PropertyIsEqualTo>");
				xml.push("<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsEqualTo>");
			}else if(field.compare && field.compare === "NOTEQUAL"){
				xml.push( "<ogc:PropertyIsNotEqualTo>");
				xml.push("<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsNotEqualTo>");
			}else if(field.compare && field.compare === "GREATER_THAN_OR_EQUAL_TO"){
				xml.push( "<ogc:PropertyIsGreaterThanOrEqualTo>");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsGreaterThanOrEqualTo>");
			}else if(field.compare && field.compare === "LESS_THAN"){
				xml.push( "<ogc:PropertyIsLessThan>");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsLessThan>");
			}else if(field.compare && field.compare === "LESS_THAN_OR_EQUAL_TO"){
				xml.push( "<ogc:PropertyIsLessThanOrEqualTo>");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsLessThanOrEqualTo>");
			}else if(field.compare && field.compare === "GREATER_THAN"){
				xml.push( "<ogc:PropertyIsGreaterThan>");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsGreaterThan>");
			}

		}
	}

	if(filters.fields.length > 1 && filters.logical && filters.logical === "AND"){
		xml.push( "</ogc:And>");
	}

	if(filters.fields.length > 1 && filters.logical && filters.logical === "OR"){
		xml.push( "</ogc:Or>");
	}

	xml.push( "</ogc:Filter>");

	return xml.join("");
}

/**
 * 通过CQL查询WMS
 * @param {ol.layer.Base} vectorLayer.
 * @param {String} key.
 * @param {String} value.
 * @return {ol.Feature} feature.
 */

gis.ZMap.prototype.getWFSLayerFeatureByCql   = function(layer,propertyStr,callBack){


	//var filter =  this.getFilterXML(propertyStr);
	//console.log(filter);
	var typeName = layer.getSource().getParams()["LAYERS"];
	var url = null;

	if(layer.getSource() instanceof ol.source.ImageWMS){
		url = layer.getSource().getUrl();
	}else if(layer.getSource() instanceof ol.source.TileWMS){
		url = layer.getSource().getUrls()[0];
	}
	var parentMap = this;
	if(url){
		url = url.replace("/wms","/ows");
		//url = url +'?service=WFS&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&version=1.1.0&typename='+typeName+'&filter='+encodeURIComponent(filter);
		//url = url +'?service=WFS&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&version=1.1.0&typename='+typeName+'&filter='+filter;
		url = url +'?service=WFS&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&version=1.1.0&typename='+typeName;


		if(propertyStr!=null && propertyStr!=''){
			url += ("&cql_filter=" + encodeURIComponent(propertyStr));
		}
		//$.getJSON(this.proxyUrl + this.base64Encode(url),function(response) {
		$.getJSON(url,function(response) {
			if(response){
				var features = (new ol.format.GeoJSON()).readFeatures(response);
				//console.log('--features.length=='+features.length);
				if(features.length > 0){
					$.each(features,function(n,ele){
						var attributes = ele.getProperties();
						var key;
						for (key in attributes) {
							//ele.unset(key);
						}
						var fid = ele.getId();
						var id_infos = fid.split(".");
						//console.log(id_infos[0]+'=='+id_infos[1]);
						attributes.objectId = id_infos[1];
						attributes.objectName = id_infos[0];
						ele.set('attributes',attributes);
					});

					if(callBack !== undefined && goog.isFunction(callBack)){
						callBack(features,parentMap);
					}

				}
			}
		});

	}

};


/**
 * @param {ol.layer.Base} vectorLayer.
 * @param {String} key.
 * @param {String} value.
 * @return {ol.Feature} feature.
 */
gis.ZMap.prototype.getLayerFeature = function(vectorLayer,key,value) {
	var f = null;
	var features = vectorLayer.getSource().getFeatures();

	$.each(features,function(n,feature){
		var attributes = feature.get('attributes');
		var attribute_value = goog.isDef(attributes[key]) ? attributes[key] : undefined;

		if(attribute_value !== undefined && attribute_value === value){
			f = feature;
			return false;
		}
	});
	return f;
};

/**
 * @param {ol.layer.Base} vectorLayer.
 * @param {ol.Feature} feature.
 */
gis.ZMap.prototype.removeFeature = function(vectorLayer,feature) {
	vectorLayer.getSource().removeFeature(feature);
};


/**
 * @param {ol.layer.Base} vectorLayer.
 */
gis.ZMap.prototype.clearVectorLayer = function(vectorLayer) {
	vectorLayer.getSource().clear();
};

/**
 * @param {ol.layer.Base} vectorLayer.
 * @param {String} key.
 * @param {String} value.
 */
gis.ZMap.prototype.removeFeatureByFilter = function(vectorLayer,key,value) {
	var features = vectorLayer.getSource().getFeatures();
	$.each(features,function(n,feature){
		var attributes = feature.get('attributes');
		var attribute_value = goog.isDef(attributes[key]) ? attributes[key] : undefined;
		if(attribute_value !== undefined && attribute_value === value){
			vectorLayer.getSource().removeFeature(feature);
			return false;
		}
	});
};

/**
 * @param {Number} centerLon.
 * @param {Number} centerLat.
 * @param {Number} radius (meter).
 * @return {Object} bbox.
 */
gis.ZMap.prototype.getCircleBBox = function(centerLon,centerLat,radius) {
	var wgs84Projection = "EPSG:4326";
	var googleProjection = "EPSG:900913";
	var center_google = this.createPoint([centerLon,centerLat],wgs84Projection,googleProjection);
	var circle_google = new ol.geom.Circle(center_google.getCoordinates(),radius);
	var circle_84 = circle_google.transform(googleProjection,wgs84Projection);
	var extent84 = circle_84.getExtent();
	var bl1 = ol.extent.getBottomLeft(extent84);
	var tr1 = ol.extent.getTopRight(extent84);
	//console.log(bl1[0]+","+bl1[1]+","+tr1[0]+","+tr1[1]);
	var bbox = {};
	bbox.minX = bl1[0];
	bbox.minY = bl1[1];
	bbox.maxX = tr1[0];
	bbox.maxY = tr1[1];
	return bbox;
};


/**
 * @param {Number} centerLon.
 * @param {Number} centerLat.
 * @param {Number} radius (meter).
 * @param {Number} srs.
 * @return {ol.geom.Geometry} circle.
 */
gis.ZMap.prototype.createCircle = function(centerLon,centerLat,radius,srs) {
	if(srs === undefined){
		srs = 4326;
	}

	var wgs84Projection = "EPSG:4326";
	var googleProjection = "EPSG:3857";
	var center_google = this.createPoint([centerLon,centerLat],wgs84Projection,googleProjection);
	var circle_google = new ol.geom.Circle(center_google.getCoordinates(),radius);


	//alert(circle_google.flatCoordinates);
	//console.log('--circle_google.flatCoordinates=='+circle_google.flatCoordinates);

	if(srs === 4326){
		var circle_84 = circle_google.transform(googleProjection,wgs84Projection);
		return circle_84.clone();
	} else {
		return circle_google.clone();
	}
};

/**
 * @param {ol.geom.Geometry} geometry.
 * @param {ol.geom.Geometry} point.
 * @param {Number} lat.
 * @return {boolean}
 */
gis.ZMap.prototype.containsPoint = function(geometry,point) {
	var flag = geometry.containsCoordinate(point.getCoordinates());
	return flag;
};

gis.ZMap.prototype.getWFSFeatures = function(opts, callback) {
	var layerName = opts.layerName;
	var url = opts.url;
	var filter = opts.filter;
	var orderBy = opts.orderBy;
	var maxCount = opts.maxCount;

	if (layerName && url) {
		url = url + '?service=WFS&request=GetFeature&outputFormat=application/json&srsname=EPSG:4326&version=1.1.0&typename=' + layerName;
		if (filter) {
			url += ("&cql_filter=" + encodeURIComponent(filter));
		}
		if (orderBy != null && orderBy != "") {
			url += ("&SORTBY=" + orderBy);
		}
		if (maxCount != null && maxCount > 0) {
			url += ("&MAXFEATURES=" + maxCount);
		}
		$.getJSON(this.proxyUrl + this.base64Encode(url), function(response) {
			if (response) {
				if (callback !== undefined && goog.isFunction(callback)) {
					callback(response);
				}
			}
		});

	} else {
		console.log("layerName,URL为空！");
		if (callback !== undefined && goog.isFunction(callback)) {
			callback(null);
		}
	}
};


gis.ZMap.prototype.FreeHandCircle = function (params) {
	this.options = params || {};
	//this.wgs84Sphere = new ol.Sphere(typeof this.options['sphere'] === 'number' ? this.options['sphere'] : 6378137);
	this.layerName = this.options['layerName'] || 'FREE_HAND_CIRCLE';
	this.centerStyle = this.options['centerStyle'] || null;
	this.layer = null;
	this.radius = '';
	this.center_ = [];
	this.isMouseDown = false;
	this.isDraging = false;
	this.cursor_ = 'pointer';
	this.drawStart_ = false;
	this.previousCursor_ = undefined;
	this.coordinate_ = null;
	this.feature_ = null;
	this.textOverlay = null;
	this.circleFeature = null;
	this.centerFeature = null;
	this.labelFeature = null;
	this.style_ = {
		fill: {
			fillColor: 'rgba(67, 110, 238, 0)'
		},
		stroke: {
			strokeColor: 'rgba(249, 185, 154, 1)',
			strokeWidth: 2.5
		},
		image: {
			type: '',
			image: {
				fill: {
					fillColor: 'rgba(255, 255, 255, 0.8)'
				},
				points: Infinity,
				radius: 4,
				stroke: {
					strokeColor: 'rgba(255, 0, 0, 1)',
					strokeWidth: 1.5
				}
			}
		}
	};
	if (this.options['style'] && _typeof(this.options['style']) === 'object') {
		this.style_ = this.options['style'];
	}
	ol.interaction.Pointer.call(this, {
		handleMoveEvent: ol.interaction.FreeHandCircle.handleMoveEvent_,
		handleDownEvent: ol.interaction.FreeHandCircle.handleDownEvent_,
		handleUpEvent: ol.interaction.FreeHandCircle.handleUpEvent_,
		handleDragEvent: ol.interaction.FreeHandCircle.handleDragEvent_
	});


};


/**
 * @param {String} color
 */
gis.ZMap.prototype.createCircleStyle = function(color) {
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius: 3,
			fill: new ol.style.Fill({
				color: color
			}),
			stroke: new ol.style.Stroke({color:color,width:0})
		})
	})
}

/**
 * @param {String} iconUrl
 */
gis.ZMap.prototype.createIconStyle = function(iconUrl) {
	return new ol.style.Style({
		image: new ol.style.Icon({
			src: iconUrl,
			anchor: [0.5, 0.5],
			rotateWithView: false,
			rotation: 0
		})
	})
}

gis.ZMap.prototype.getLabelStyle = function(options){
	if(options === undefined){
		options = {};
	}


	var textType = "normal";		//normal;hide;shorten;wrap
	var textAlign = "center";		//center;left;right;start;end
	var baseline = "middle";		//middle;top;bottom;alphabetic;hanging;ideographic
	var fontSize = "18px";
	var textOffsetX =  0;
	var textOffsetY = 0;
	var fontWeight = "bold";		//normal,bold
	var fontFamily = "微软雅黑";
	var textRotation = 0;

	var fontColor = "#000000";
	var fontOutlineColor = "#000000";
	var fontOutlineWidth =  1;
	var maxResolution = -1;
	var text = "";
	var backgroundStrokeColor='#000000';
	var backgroundStrokeWidth=1;
	var backgroundFillColor='#000000';

	if(options.text){
		text = options.text;
	}

	if(options.fontWeight){
		fontWeight = options.fontWeight;
	}

	if(options.fontSize){
		fontSize = options.fontSize;
	}

	if(options.fontColor){
		fontColor = options.fontColor;
	}

	if(options.textOffsetX){
		textOffsetX = options.textOffsetX;
	}

	if(options.textOffsetY){
		textOffsetY = options.textOffsetY;
	}


	if(options.backgroundStrokeColor){
		backgroundStrokeColor = options.backgroundStrokeColor;
	}

	if(options.backgroundStrokeWidth){
		backgroundStrokeWidth = options.backgroundStrokeWidth;
	}

	if(options.backgroundFillColor){
		backgroundFillColor = options.backgroundFillColor;
	}

	var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
	return new ol.style.Style({
		text: new ol.style.Text({
			font: font,
			text: text,
			offsetX:textOffsetX,
			offsetY:textOffsetY,
			fill: new ol.style.Fill({
				color: fontColor
			}),
			backgroundFill:new ol.style.Fill({
				color: backgroundFillColor
			}),
			backgroundStroke:new ol.style.Stroke({
				color:backgroundStrokeColor,
				width:backgroundStrokeWidth
			})
		})
	});
}

gis.ZMap.prototype.getToolTipStyle = function(options){
	if(options === undefined){
		options = {};
	}
	var colorMap = {
		"red":"#EA4A56",
		"orange":"#FF9600",
		"green":"#000000",
		"blue":"#007FC8"
	};

	var label = options.label;
	var color = "#FF9600";
	var labelWidth = 65;
	var labelHeight = 23;

	/*
	 var iconSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
	 'x="0px" y="0px" width="' + labelWidth + 'px" height="'+labelHeight+'px" ' +
	 'viewBox="0 0 ' + labelWidth + ' '+labelHeight+'" enable-background="new 0 0 ' + labelWidth + ' '+labelHeight+'" xml:space="preserve">'+
	 '<rect x="0" y="0" width="' + labelWidth + '" height="'+labelHeight+'" stroke="'+color+'" fill="'+color+'" fill-opacity="0" stroke-width="0"></rect>'  +
	 '</svg>';
	 */

	var textType = goog.isDef(options.textType) ? options.textType : "normal";			//normal;hide;shorten;wrap
	var textAlign = goog.isDef(options.textAlign) ? options.textAlign : "center";		//center;left;right;start;end
	var baseline = goog.isDef(options.baseline) ? options.baseline : "middle";			//middle;top;bottom;alphabetic;hanging;ideographic
	var fontSize = goog.isDef(options.fontSize) ? options.fontSize : "14px";
	var textOffsetX = goog.isDef(options.textOffsetX) ? options.textOffsetX : 0;
	var textOffsetY = goog.isDef(options.textOffsetY) ? options.textOffsetY : 0;
	var fontWeight = goog.isDef(options.fontWeight) ? options.fontWeight : "bold";		//normal,bold
	var fontFamily = goog.isDef(options.fontFamily) ? options.fontFamily : "微软雅黑";
	var textRotation = goog.isDef(options.textRotation) ? options.textRotation : 0;
	var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
	var fontColor = goog.isDef(options.fontColor) ? options.fontColor : "#000000";
	var fontOutlineColor = goog.isDef(options.fontOutlineColor) ? options.fontOutlineColor : "#000000";
	var fontOutlineWidth = goog.isDef(options.fontOutlineWidth) ? options.fontOutlineWidth : 1;
	var maxResolution = goog.isDef(options.maxResolution) ? options.maxResolution : -1;

	var text = goog.isDef(options.text) ? options.text : "";


	var svg_style = new ol.style.Style({
		/*
		 image: new ol.style.Icon({
		 src: 'data:image/svg+xml,' + escape(iconSVG),
		 anchor: [0.5, 1.7],
		 rotateWithView: false,
		 rotation: 0
		 }),
		 */
		text: new ol.style.Text({
			font: font,
			text: text,
			offsetX:textOffsetX,
			offsetY:textOffsetY,
			fill: new ol.style.Fill({
				color: fontColor
			})
		})
	});

	return svg_style;

}

/**
 * @param {Object} options layer options.
 * @return {String} xml string.
 */
gis.ZMap.prototype.getWFSPostXml = function(opt_options) {
	var options = opt_options ? opt_options :({});
	var version = goog.isDef(options.version) ? options.version : "1.0.0";
	var outputFormat = goog.isDef(options.outputFormat) ? options.outputFormat : null;
	var maxFeatures = goog.isDef(options.maxFeatures) ? options.maxFeatures : 3000;

	var typeName = goog.isDef(options.typeName) ? options.typeName : null;
	var outFields = goog.isDef(options.outFields) ? options.outFields : [];
	var shapeField = goog.isDef(options.shapeField) ? options.shapeField: null;
	var filters = goog.isDef(options.filters) ? options.filters : {};
	var coordinates = goog.isDef(options.coordinates) ? options.coordinates : null;

	if(!typeName){
		return null;
	}

	var xml = [];

	xml.push("<wfs:GetFeature service=\"WFS\" ");
	xml.push("version=\""+version+"\" ");
	//+ "outputFormat=\"text/xml;subtype=gml/3.1.1\" "
	//+ "outputFormat=\"json\" "

	if(outputFormat){
		xml.push("outputFormat=\""+outputFormat+"\" ");
	}

	//设置返回最大记录数
	xml.push("maxFeatures=\""+maxFeatures+"\" ");

	xml.push("xmlns:gml=\"http://www.opengis.net/gml\" ");
	xml.push("xmlns:wfs=\"http://www.opengis.net/wfs\" ");
	xml.push("xmlns:ogc=\"http://www.opengis.net/ogc\" > ");
	xml.push("<wfs:Query typeName=\""+typeName+"\">");

	//设置返回的属性列表

	/*
	 +"<ogc:PropertyName>NCGL:FID</ogc:PropertyName>"
	 */

	var filterLen = 0;
	if(coordinates && shapeField){
		filterLen = filterLen +1;
	}

	if(filters.fields && filters.fields.length > 0){
		filterLen = filterLen + filters.fields.length;
	}

	xml.push("<ogc:Filter>");

	if(filterLen > 1 && filters.logical && filters.logical === "AND"){
		xml.push("<ogc:And>");
	}

	if(filterLen > 1 && filters.logical && filters.logical === "OR"){
		xml.push("<ogc:Or>");
	}

	if(filters.fields && filters.fields.length > 0){
		for(var k=0;k<filters.fields.length;k++){
			var field = filters.fields[k];
			if(field.compare && field.compare === "LIKE"){
				//--模糊查询
				xml.push("<ogc:PropertyIsLike wildCard=\"*\" singleChar=\".\" escape=\"!\">");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push("<ogc:Literal>*"+field.searchText+"*</ogc:Literal>");
				xml.push("</ogc:PropertyIsLike>");
			}else if(field.compare && field.compare === "EQUAL"){
				xml.push( "<ogc:PropertyIsEqualTo>");
				xml.push("<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsEqualTo>");
			}else if(field.compare && field.compare === "NOTEQUAL"){
				xml.push( "<ogc:PropertyIsNotEqualTo>");
				xml.push("<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsNotEqualTo>");
			}else if(field.compare && field.compare === "GREATER_THAN_OR_EQUAL_TO"){
				xml.push( "<ogc:PropertyIsGreaterThanOrEqualTo>");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsGreaterThanOrEqualTo>");
			}else if(field.compare && field.compare === "LESS_THAN"){
				xml.push( "<ogc:PropertyIsLessThan>");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsLessThan>");
			}else if(field.compare && field.compare === "LESS_THAN_OR_EQUAL_TO"){
				xml.push( "<ogc:PropertyIsLessThanOrEqualTo>");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsLessThanOrEqualTo>");
			}else if(field.compare && field.compare === "GREATER_THAN"){
				xml.push( "<ogc:PropertyIsGreaterThan>");
				xml.push( "<ogc:PropertyName>"+field.searchField+"</ogc:PropertyName>");
				xml.push( "<ogc:Literal>"+field.searchText+"</ogc:Literal>");
				xml.push( "</ogc:PropertyIsGreaterThan>");
			}

		}
	}

	//+ "<ogc:PropertyIsEqualTo>"
	//+ "<ogc:PropertyName>esri:Type</ogc:PropertyName>"
	//+ "<ogc:Literal>050102</ogc:Literal>"
	//+ "</ogc:PropertyIsEqualTo>"

	//--模糊查询
	//+ "<ogc:PropertyIsLike wildCard=\"*\" singleChar=\".\" escape=\"!\"> "
	//+ "<ogc:PropertyName>esri:Name_CHN</ogc:PropertyName>"
	//+ "<ogc:Literal>*酒楼</ogc:Literal>"
	//+ "</ogc:PropertyIsLike >"
	/*
	 + "<ogc:PropertyIsGreaterThanOrEqualTo>"
	 + "<ogc:PropertyName>esri:Shape_Leng</ogc:PropertyName>"
	 + "<ogc:Literal>10000</ogc:Literal>"
	 + "</ogc:PropertyIsGreaterThanOrEqualTo>"

	 + "<ogc:PropertyIsLessThan>"
	 + "<ogc:PropertyName>esri:Shape_Leng</ogc:PropertyName>"
	 + "<ogc:Literal>80000</ogc:Literal>"
	 + "</ogc:PropertyIsLessThan>"
	 */

	//范围查询：minX,minY maxX,maxY
	/*
	 + "<ogc:BBOX>"
	 + "     <ogc:PropertyName>esri:Shape</ogc:PropertyName>"
	 + "     <gml:Box srsName='http://www.opengis.net/gml/srs/epsg.xml#4326'>"
	 +"          <gml:coordinates>106.56455299900006,29.584877000000063 106.63817900000004,29.718690999000046</gml:coordinates>"
	 + "     </gml:Box>"
	 + "</ogc:BBOX>"
	 */

	//圆收索
	if(coordinates && shapeField){
		xml.push( "<ogc:Intersects>");
		xml.push( "     <ogc:PropertyName>"+shapeField+"</ogc:PropertyName>");
		xml.push( "     <gml:Polygon srsName='http://www.opengis.net/gml/srs/epsg.xml#4326'>");
		xml.push( "         <gml:outerBoundaryIs>");
		xml.push( "             <gml:LinearRing>");
		xml.push("                  <gml:coordinates>"+coordinates+"</gml:coordinates>");
		xml.push( "             </gml:LinearRing>");
		xml.push( "         </gml:outerBoundaryIs>");
		xml.push( "     </gml:Polygon>");
		xml.push( "</ogc:Intersects>");
	}

	if(filterLen > 1 && filters.logical && filters.logical === "AND"){
		xml.push( "</ogc:And>");
	}

	if(filterLen > 1 && filters.logical && filters.logical === "OR"){
		xml.push( "</ogc:Or>");
	}

	//+ "</ogc:And>"
	xml.push( "</ogc:Filter>");

	xml.push( "</wfs:Query>");
	xml.push( "</wfs:GetFeature>");

	return xml.join("");

}

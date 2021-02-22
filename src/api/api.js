import { post } from './request.js'
const target = 'http://222.249.173.36:6027';
const targetLogin = 'http://222.249.173.36:6509';
const mapTarget= 'http://222.249.173.36:6509/jtyj';
// 登录
export function login(data) {
  return post(targetLogin + "/api-auth/user/auth/login", data);
}
// 获取云台视频
export function queryPlayAddresss(data) {
  return post("http://121.36.102.235:8866/video/preview/queryPlayAddresss", data);
}
// 获取云台视频-方向,箭头，焦距，光圈
export function pztControl(data) {
  return post("http://121.36.102.235:8866/video/preview/pztControl", data);
}
// 上传文件测试地址
export function uploadFile(data) {
  return post("https://www.mocky.io/v2/5cc8019d300000980a055e76", data);
}



/**地图缓冲器查询API*/

export function eventList(data) {
  return post(mapTarget+"/yjzh/eventList", data);
}
export function getRange(data) {
  return post(mapTarget+"/yjzh/getRange", data);
}
export function materialStoreroom(data) {
  return post(mapTarget+"/materialStoreroom/get", data);
}
export function selectBookConcent(data) {
  return post(mapTarget+"/yjzh/selectBookConcent", data);
}
export function selectSd(data) {
  return post(mapTarget+"/yjzh/selectSd", data);
}
export function selectQl(data) {
  return post(mapTarget+"/yjzh/selectQl", data);
}





/**
 * Created by 朱明月 on 2019/6/11.
 * 通用配置文件
 */
var config_management = function() {};
config_management.prototype = {
  constructor: config_management,

  /**
   * 提示信息的通用使用短语
   * @param key
   * @returns {*}
   */
  toast: function(key) {
    let toast = {
      //保存区
      add: "新增成功",
      update: "修改成功",
      delete: "删除成功",
      upload: "上传成功",
      send: "发布成功",
      replace: "替换成功",
      bind: "绑定成功",
      countersign: "确认成功",
      save: "保存成功",

      //寻问区
      affirmDel: "确认删除吗？",
      affirmSend: "确认发布吗？",

      //异常区（主要针对请求失败）
      addError: "新增失败",
      updateError: "修改失败",
      deleteError: "删除失败",
      uploadError: "上传失败",
      sendError: "发布失败",
      replaceError: "替换失败",
      bindError: "绑定失败",
      countersignError: "确认失败",
      saveError: "保存失败",

      //其他提示
      repetitive: "已存在", //不允许重复提示
      dataError: "数据请求失败"

    };

    return toast[key];
  }

};

export function getMyConfig() {
  return new config_management();

}






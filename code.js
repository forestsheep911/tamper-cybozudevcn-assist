// ==UserScript==
// @name         cybozudevcn-assist
// @namespace    https://github.com/forestsheep911/tamper-cybozudevcn-assist
// @version      0.30
// @description  cybozu开发者网站中文版辅助工具ForDLD成员
// @author       bxu
// @license      MIT
// @match        https://cybozudev.kf5.com/hc/kb/article/*
// @match        https://developer.cybozu.io/hc/ja/articles/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js

// ==/UserScript==

(function () {
  "use strict";

  const managePerfix = "https://bozuman.cybozu.com/k/20708/show#record=";
  const buttonStyle =
    "box-sizing: border-box;margin-left:12px;font-family: inherit;display: inline-block;padding: 6px 12px;line-height: 1.128571429;text-align: center;vertical-align: middle;cursor: pointer;border: 1px solid transparent;border-radius: 4px;user-select: none;color: #fff;background-color: #f0ad4e;border-color: #eea236;font-size:11px";

  // get json
  function getKijiDz() {
    return new Promise(function (resolve, reject) {
      axios
        .get("https://dld-dev.oss-cn-shanghai.aliyuncs.com/ass/kiji.json")
        .then(function (response) {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject("get kiji fail");
          }
        });
    });
  }

  // 适配URL添加按钮
  function addButton(pareTable) {
    const regexja = /articles\/(\d+)/;
    const regexzh = /article\/(\d+)/;
    for (let i = 0; i < pareTable.length; i++) {
      const matchedResultJa = `${pareTable[i].ja}/`.match(regexja);
      const matchedResultZh = `${pareTable[i].zh}/`.match(regexzh);
      if (
        matchedResultZh &&
        window.location.pathname.includes(matchedResultZh[1])
      ) {
        let eles = document.getElementsByTagName("h2");
        if (eles.length > 0) {
          if (pareTable[i].ja) {
            let findPareButton = document.createElement("a");
            findPareButton.setAttribute("href", pareTable[i].ja);
            findPareButton.setAttribute("target", "_blank");
            findPareButton.setAttribute("style", buttonStyle);
            findPareButton.innerText = "日语原版";
            eles[0].insertBefore(findPareButton, eles[0].lastChild.nextSibling);
          }

          let manageButton = document.createElement("a");
          manageButton.setAttribute(
            "href",
            `${managePerfix}${pareTable[i].id}`
          );
          manageButton.setAttribute("target", "_blank");
          manageButton.setAttribute("style", buttonStyle);
          manageButton.innerText = "管理";
          eles[0].insertBefore(manageButton, eles[0].lastChild.nextSibling);

          let copyButton = document.createElement("a");
          copyButton.setAttribute(
            "data-clipboard-target",
            ".original-content"
          );
          copyButton.setAttribute("style", buttonStyle);
          copyButton.setAttribute("class", "doccopy");
          copyButton.innerText = "拷贝文档";
          eles[0].insertBefore(copyButton, eles[0].lastChild.nextSibling);
        }
        break;
      }
      if (
        matchedResultJa &&
        window.location.pathname.includes(matchedResultJa[1]) &&
        pareTable[i].zh
      ) {
        console.log(pareTable[i].zh);
        let eles = document.getElementsByTagName("h1");
        if (eles.length > 0) {
          let findPareButton = document.createElement("a");
          findPareButton.setAttribute("href", pareTable[i].zh);
          findPareButton.setAttribute("target", "_blank");
          findPareButton.setAttribute("style", buttonStyle);
          findPareButton.innerText = "中文版";
          eles[0].insertBefore(findPareButton, eles[0].lastChild.nextSibling);
        }
        break;
      }
    }
  }
  getKijiDz().then(addButton);

  // draft 404
  function testDrarftAndJump() {
    axios.get(location.href + "?from=draft").then(function (response) {
      if (response.status === 200) {
        location.replace(location.href + "?from=draft");
      }
    });
  }
  for (let v of document.body.classList) {
    if (v === "error404") {
      testDrarftAndJump();
    }
  }
  let unlogin404 = document.querySelectorAll('[data-letters="404"]');
  if (unlogin404.length > 0) {
    testDrarftAndJump();
  }

  // copy html
  new ClipboardJS('.doccopy');
})();

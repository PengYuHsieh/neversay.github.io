var tumblrAutoPager = {
  url : "http://proto.jp/",
  ver : "0.1.7",
  rF : true,
  gP : {},
  pp : null,
  ppId : "",
  LN : location.hostname,
  /**
   * @return {undefined}
   */
  init : function() {
    /**
     * @param {Node} r
     * @return {?}
     */
    function fn(r) {
      /** @type {Array} */
      var a = [];
      /** @type {number} */
      var i = 0;
      var valuesLen = r.childNodes.length;
      for (;i < valuesLen;i++) {
        a.push(r.childNodes.item(i));
      }
      return a;
    }
    /**
     * @return {?}
     */
    function detect() {
      var uHostName;
      /** @type {string} */
      var userAgent = navigator.userAgent;
      this.bw = {
        safari : ((uHostName = userAgent.split("AppleWebKit/")[1]) ? uHostName.split("(")[0].split(".")[0] : 0) >= 124,
        konqueror : ((uHostName = userAgent.split("Konqueror/")[1]) ? uHostName.split(";")[0] : 0) >= 3.3,
        mozes : ((uHostName = userAgent.split("Gecko/")[1]) ? uHostName.split(" ")[0] : 0) >= 20011128,
        opera : !!window.opera && typeof XMLHttpRequest == "function",
        msie : !!window.ActiveXObject ? !!getXHRObject() : false
      };
      return this.bw.safari || (this.bw.konqueror || (this.bw.mozes || (this.bw.opera || this.bw.msie)));
    }
    /**
     * @return {?}
     */
    function getXHRObject() {
      if (window.XMLHttpRequest) {
        return new XMLHttpRequest;
      } else {
        if (window.ActiveXObject) {
          try {
            return new ActiveXObject("Msxml2.XMLHTTP");
          } catch (B) {
            try {
              return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (A) {
              return null;
            }
          }
        } else {
          return null;
        }
      }
    }
    /**
     * @param {Function} params
     * @param {string} path
     * @param {string} method
     * @param {string} name
     * @param {boolean} options
     * @param {boolean} cmp
     * @param {?} cb
     * @param {?} map
     * @return {?}
     */
    function init(params, path, method, name, options, cmp, cb, map) {
      /**
       * @param {Object} r
       * @return {?}
       */
      function send(r) {
        if (!oa || typeof r.setRequestHeader == "function") {
          r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        }
        return r;
      }
      /**
       * @param {string} path
       * @param {string} style
       * @return {?}
       */
      function normalize(path, style) {
        /**
         * @param {string} prop
         * @param {string} value
         * @return {undefined}
         */
        function filter(prop, value) {
          tagNameArr.push(encodeURIComponent(prop) + "=" + encodeURIComponent(value));
        }
        /** @type {Array} */
        var tagNameArr = [];
        if (typeof path == "object") {
          var i;
          for (i in path) {
            filter(i, path[i]);
          }
        } else {
          if (typeof path == "string") {
            if (path == "") {
              return "";
            }
            if (path.charAt(0) == "&") {
              /** @type {string} */
              path = path.substring(1, path.length);
            }
            /** @type {Array.<string>} */
            var codeSegments = path.split("&");
            /** @type {number} */
            i = 0;
            for (;i < codeSegments.length;i++) {
              /** @type {Array.<string>} */
              var retArr = codeSegments[i].split("=");
              filter(retArr[0], retArr[1]);
            }
          }
        }
        return tagNameArr.join("&");
      }
      /** @type {boolean} */
      var isGet = method.toUpperCase() == "GET";
      var _this = getXHRObject();
      if (_this == null) {
        return null;
      }
      if (cmp ? cmp : false) {
        name += (name.indexOf("?") == -1 ? "?" : "&") + "t=" + (new Date).getTime();
      }
      var self = new detect;
      var oa = self.bw.opera;
      var program = self.bw.safari;
      var konqueror = self.bw.konqueror;
      var inverse = self.bw.mozes;
      if (typeof params == "object") {
        var fn = params.onload;
        var app = params.onbeforsetheader;
      } else {
        /** @type {Function} */
        fn = params;
        /** @type {null} */
        app = null;
      }
      if (oa || (program || inverse)) {
        /**
         * @return {undefined}
         */
        _this.onload = function() {
          fn(_this);
          _this.abort();
        };
      } else {
        /**
         * @return {undefined}
         */
        _this.onreadystatechange = function() {
          if (_this.readyState == 4) {
            fn(_this);
            _this.abort();
          }
        };
      }
      path = normalize(path, name);
      if (isGet) {
        name += (name.indexOf("?") == -1 ? "?" : path == "" ? "" : "&") + path;
      }
      _this.open(method, name, options, cb, map);
      if (!!app) {
        app(_this);
      }
      send(_this);
      _this.send(path);
      return _this;
    }
    /**
     * @param {Object} req
     * @return {undefined}
     */
    function load(req) {
      if (req.status == 404) {
        /** @type {boolean} */
        event.remainFlg = false;
        return;
      }
      /** @type {Element} */
      var menu = document.createElement("div");
      menu.innerHTML = req.responseText;
      var codeSegments = event.gP(menu.getElementsByTagName("*"));
      if (codeSegments.length < 2) {
        /** @type {boolean} */
        event.rF = false;
        return;
      }
      /** @type {Element} */
      menu = document.createElement("div");
      /** @type {string} */
      menu.className = "tumblrAutoPager_page_info";
      event.pp.appendChild(menu);
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        event.pp.appendChild(codeSegments[i]);
      }
      var node = $("footer");
      if (node) {
        node.parentNode.appendChild(node);
      } else {
        null;
      }
      /** @type {boolean} */
      event.rF = true;
    }
    /**
     * @return {undefined}
     */
    function resize() {
      /** @type {(Element|null)} */
      var element = document.compatMode == "BackCompat" ? document.body : document.documentElement;
      /** @type {number} */
      var r = element.scrollHeight - element.clientHeight - (element.scrollTop || document.body.scrollTop);
      if (r < element.clientHeight * 2 && event.rF) {
        /** @type {boolean} */
        event.rF = false;
        requiredVersionPart++;
        /**
         * @param {Object} evt
         * @return {undefined}
         */
        addNextPageWithLikes = function(evt) {
          load(evt);
          Tumblr.LikeButton.get_status_by_page(requiredVersionPart);
        };
        init(addNextPageWithLikes, "", "GET", "http://" + event.LN + "/page/" + requiredVersionPart, true);
      }
      setTimeout(arguments.callee, 200);
    }
    /**
     * @param {string} attr
     * @return {?}
     */
    function $(attr) {
      return document.getElementById(attr);
    }
    if ($("autopagerize_icon") || navigator.userAgent.indexOf("iPhone") != -1) {
      return;
    }
    var event = tumblrAutoPager;
    /** @type {number} */
    var requiredVersionPart = 1;
    /** @type {string} */
    var uri = location.href;
    /** @type {number} */
    var pos = uri.lastIndexOf("/page/");
    /** @type {number} */
    var to = uri.lastIndexOf("/tagged/");
    if (pos != -1) {
      /** @type {number} */
      requiredVersionPart = parseInt(uri.slice(pos + 6));
      /** @type {string} */
      event.LN = uri.slice(7, pos);
    } else {
      if (to != -1) {
        /** @type {string} */
        event.LN = uri.slice(7);
        if (event.LN.slice(event.LN.length - 1) == "/") {
          /** @type {string} */
          event.LN = event.LN.slice(0, event.LN.length - 1);
        }
      } else {
        if ("http://" + event.LN + "/" != uri) {
          return;
        }
      }
    }
    /** @type {Array} */
    var codeSegments = [];
    /**
     * @param {Array} a
     * @return {?}
     */
    codeSegments[0] = function(a) {
      /** @type {Array} */
      var result = [];
      /** @type {number} */
      var i = 0;
      var aLength = a.length;
      for (;i < aLength;i++) {
        if (a[i].className == "autopagerize_page_element") {
          result = fn(a[i]);
          break;
        }
      }
      return result;
    };
    /**
     * @param {Array} args
     * @return {?}
     */
    codeSegments[1] = function(args) {
      /** @type {Array} */
      var arrayOfArgs = [];
      /** @type {number} */
      var i = 0;
      var argLength = args.length;
      for (;i < argLength;i++) {
        var branchDataJSON = args[i].className ? args[i].className.split(" ") : null;
        if (branchDataJSON) {
          /** @type {number} */
          var conditionIndex = 0;
          for (;conditionIndex < branchDataJSON.length;conditionIndex++) {
            if (branchDataJSON[conditionIndex] == "post") {
              arrayOfArgs.push(args[i]);
            } else {
              null;
            }
          }
        }
      }
      return arrayOfArgs;
    };
    /**
     * @param {Array} values
     * @return {?}
     */
    codeSegments[2] = function(values) {
      /** @type {Array} */
      var result = [];
      /** @type {Array} */
      var enabledFilters = event.ppId ? [event.ppId] : ["posts", "main", "container", "content", "apDiv2", "wrapper", "projects"];
      /** @type {number} */
      var i = 0;
      var valuesLen = values.length;
      for (;i < valuesLen;i++) {
        /** @type {number} */
        var j = 0;
        for (;j < enabledFilters.length;j++) {
          if (values[i].id == enabledFilters[j]) {
            result = fn(values[i]);
            event.ppId = values[i].id;
            break;
          }
        }
      }
      return result;
    };
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      var scriptTags = codeSegments[i](document.body.getElementsByTagName("*"));
      if (scriptTags.length) {
        event.gP = codeSegments[i];
        event.pp = scriptTags[0].parentNode;
        break;
      }
    }
    if (!event.pp) {
      return;
    }
    init.README = {
      license : "Public Domain",
      url : "http://jsgt.org/lib/ajax/ref.htm",
      version : 0.516,
      author : "Toshiro Takahashi"
    };
    resize();
  },
  /**
   * @return {undefined}
   */
  switchAutoPage : function() {
    /** @type {boolean} */
    this.rF = !this.rF;
    /** @type {NodeList} */
    var a = document.getElementsByTagName("*");
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var aLength = a.length;
    for (;i < aLength;i++) {
      if (a[i].className == "tAP_switch") {
        /** @type {string} */
        a[i].firstChild.nodeValue = this.rF ? "AutoPage[OFF]" : "AutoPage[ON]";
      }
    }
  }
};
if (window.addEventListener) {
  window.addEventListener("load", tumblrAutoPager.init, false);
} else {
  if (window.attachEvent) {
    window.attachEvent("onload", tumblrAutoPager.init);
  } else {
    /** @type {function (): undefined} */
    window.onload = tumblrAutoPager.init;
  }
}
;
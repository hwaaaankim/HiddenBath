!(function (t, e) {
  if ("object" == typeof exports && "object" == typeof module)
    module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    var n = e();
    for (var r in n) ("object" == typeof exports ? exports : t)[r] = n[r];
  }
})(this, function () {
  return (function (t) {
    var e = {};
    function n(r) {
      if (e[r]) return e[r].exports;
      var i = (e[r] = { i: r, l: !1, exports: {} });
      return t[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
    }
    return (
      (n.m = t),
      (n.c = e),
      (n.d = function (t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
      }),
      (n.r = function (t) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      (n.t = function (t, e) {
        if ((1 & e && (t = n(t)), 8 & e)) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, "default", { enumerable: !0, value: t }),
          2 & e && "string" != typeof t)
        )
          for (var i in t)
            n.d(
              r,
              i,
              function (e) {
                return t[e];
              }.bind(null, i)
            );
        return r;
      }),
      (n.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return n.d(e, "a", e), e;
      }),
      (n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (n.p = ""),
      n((n.s = 5))
    );
  })([
    function (t, e, n) {
      "use strict";
      var r,
        i =
          (this && this.__extends) ||
          ((r = function (t, e) {
            return (r =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                  t.__proto__ = e;
                }) ||
              function (t, e) {
                for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
              })(t, e);
          }),
          function (t, e) {
            function n() {
              this.constructor = t;
            }
            r(t, e),
              (t.prototype =
                null === e
                  ? Object.create(e)
                  : ((n.prototype = e.prototype), new n()));
          });
      Object.defineProperty(e, "__esModule", { value: !0 });
      var o = (function (t) {
        function e(e) {
          var n = this;
          return (
            (e +=
              " check the documentation at https://www.360-javascriptviewer.com/installation"),
            ((n = t.call(this, e) || this).name =
              "360 Javascript Viewer InputError"),
            n
          );
        }
        return i(e, t), e;
      })(Error);
      e.default = o;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.mergeDeep =
          e.hexToRgb =
          e.now =
          e.removeEvent =
          e.addEvent =
          e.minusClient =
          e.plueClient =
          e.getAverageClient =
          e.getClient =
          e.getClients =
          e.getPositions =
          e.getDist =
          e.getPosition =
          e.getPositionEvent =
          e.isMultiTouch =
          e.getPinchDragPosition =
          e.getRotation =
          e.getRandomId =
          e.getRad =
            void 0);
      var r = n(12);
      function i(t, e) {
        var n = e[0] - t[0],
          r = e[1] - t[1],
          i = Math.atan2(r, n);
        return i >= 0 ? i : i + 2 * Math.PI;
      }
      function o(t, e, n) {
        var r = t.clientX,
          i = t.clientY;
        return {
          clientX: r,
          clientY: i,
          deltaX: r - e.clientX,
          deltaY: i - e.clientY,
          distX: r - n.clientX,
          distY: i - n.clientY,
        };
      }
      function a(t) {
        for (var e = Math.min(t.length, 2), n = [], r = 0; r < e; ++r)
          n.push(s(t[r]));
        return n;
      }
      function s(t) {
        return { clientX: t.clientX, clientY: t.clientY };
      }
      function u(t) {
        return 1 === t.length
          ? t[0]
          : {
              clientX: (t[0].clientX + t[1].clientX) / 2,
              clientY: (t[0].clientY + t[1].clientY) / 2,
            };
      }
      function c(t, e) {
        return {
          clientX: t.clientX + e.clientX,
          clientY: t.clientY + e.clientY,
        };
      }
      function l(t, e) {
        return {
          clientX: t.clientX - e.clientX,
          clientY: t.clientY - e.clientY,
        };
      }
      (e.getRad = i),
        (e.getRandomId = function () {
          return "_" + Math.random().toString(36).substr(2, 9);
        }),
        (e.getRotation = function (t) {
          return (
            (i([t[0].clientX, t[0].clientY], [t[1].clientX, t[1].clientY]) /
              Math.PI) *
            180
          );
        }),
        (e.getPinchDragPosition = function (t, e, n, r) {
          var i = u(t),
            a = u(e),
            s = u(r);
          return o(c(r[0], l(i, s)), c(r[0], l(a, s)), n[0]);
        }),
        (e.isMultiTouch = function (t) {
          return t.touches && t.touches.length >= 2;
        }),
        (e.getPositionEvent = function (t) {
          return t.touches ? a(t.touches) : [s(t)];
        }),
        (e.getPosition = o),
        (e.getDist = function (t) {
          return Math.sqrt(
            Math.pow(t[0].clientX - t[1].clientX, 2) +
              Math.pow(t[0].clientY - t[1].clientY, 2)
          );
        }),
        (e.getPositions = function (t, e, n) {
          return t.map(function (t, r) {
            return o(t, e[r], n[r]);
          });
        }),
        (e.getClients = a),
        (e.getClient = s),
        (e.getAverageClient = u),
        (e.plueClient = c),
        (e.minusClient = l),
        (e.addEvent = function (t, e, n, r) {
          t.addEventListener(e, n, r);
        }),
        (e.removeEvent = function (t, e, n) {
          t.removeEventListener(e, n);
        }),
        (e.now = function () {
          return Date.now ? Date.now() : new Date().getTime();
        }),
        (e.hexToRgb = function (t) {
          var e = r(t);
          return e
            ? { r: e.rgba[0], g: e.rgba[1], b: e.rgba[2], a: e.rgba[3] }
            : null;
        }),
        (e.mergeDeep = function t(e) {
          var n = e.objects,
            r = function (t) {
              return t && "object" == typeof t;
            };
          return n.reduce(function (e, n) {
            return (
              Object.keys(n).forEach(function (i) {
                var o = e[i],
                  a = n[i];
                Array.isArray(o) && Array.isArray(a)
                  ? (e[i] = o.concat.apply(o, a))
                  : r(o) && r(a)
                  ? (e[i] = t({ objects: [o, a] }))
                  : (e[i] = a);
              }),
              e
            );
          }, {});
        });
    },
    function (t, e) {
      var n = /^\s+|\s+$/g,
        r = /^[-+]0x[0-9a-f]+$/i,
        i = /^0b[01]+$/i,
        o = /^0o[0-7]+$/i,
        a = parseInt,
        s = Object.prototype.toString;
      function u(t, e) {
        var u;
        if ("function" != typeof e) throw new TypeError("Expected a function");
        return (
          (t = (function (t) {
            var e = (function (t) {
                if (!t) return 0 === t ? t : 0;
                if (
                  (t = (function (t) {
                    if ("number" == typeof t) return t;
                    if (
                      (function (t) {
                        return (
                          "symbol" == typeof t ||
                          ((function (t) {
                            return !!t && "object" == typeof t;
                          })(t) &&
                            "[object Symbol]" == s.call(t))
                        );
                      })(t)
                    )
                      return NaN;
                    if (c(t)) {
                      var e = "function" == typeof t.valueOf ? t.valueOf() : t;
                      t = c(e) ? e + "" : e;
                    }
                    if ("string" != typeof t) return 0 === t ? t : +t;
                    t = t.replace(n, "");
                    var u = i.test(t);
                    return u || o.test(t)
                      ? a(t.slice(2), u ? 2 : 8)
                      : r.test(t)
                      ? NaN
                      : +t;
                  })(t)) ===
                    1 / 0 ||
                  t === -1 / 0
                ) {
                  return 17976931348623157e292 * (t < 0 ? -1 : 1);
                }
                return t == t ? t : 0;
              })(t),
              u = e % 1;
            return e == e ? (u ? e - u : e) : 0;
          })(t)),
          function () {
            return (
              --t > 0 && (u = e.apply(this, arguments)),
              t <= 1 && (e = void 0),
              u
            );
          }
        );
      }
      function c(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e);
      }
      t.exports = function (t) {
        return u(2, t);
      };
    },
    function (t, e, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (t, e, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function a(t) {
                try {
                  u(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function s(t) {
                try {
                  u(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function u(t) {
                var e;
                t.done
                  ? i(t.value)
                  : ((e = t.value),
                    e instanceof n
                      ? e
                      : new n(function (t) {
                          t(e);
                        })).then(a, s);
              }
              u((r = r.apply(t, e || [])).next());
            });
          },
        i =
          (this && this.__generator) ||
          function (t, e) {
            var n,
              r,
              i,
              o,
              a = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function s(o) {
              return function (s) {
                return (function (o) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; a; )
                    try {
                      if (
                        ((n = 1),
                        r &&
                          (i =
                            2 & o[0]
                              ? r.return
                              : o[0]
                              ? r.throw || ((i = r.return) && i.call(r), 0)
                              : r.next) &&
                          !(i = i.call(r, o[1])).done)
                      )
                        return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return a.label++, { value: o[1], done: !1 };
                        case 5:
                          a.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((i = a.trys),
                            (i = i.length > 0 && i[i.length - 1]) ||
                              (6 !== o[0] && 2 !== o[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === o[0] &&
                            (!i || (o[1] > i[0] && o[1] < i[3]))
                          ) {
                            a.label = o[1];
                            break;
                          }
                          if (6 === o[0] && a.label < i[1]) {
                            (a.label = i[1]), (i = o);
                            break;
                          }
                          if (i && a.label < i[2]) {
                            (a.label = i[2]), a.ops.push(o);
                            break;
                          }
                          i[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      o = e.call(t, a);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      n = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, s]);
              };
            }
          };
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.DomUtilities = void 0);
      var o = n(0),
        a = (function () {
          function t() {}
          return (
            (t.hideImage = function (t, e) {
              var n = e.document.getElementById(t.id);
              n && (n.style.display = "none");
            }),
            (t.addHiddenStyle = function (t, e, n) {
              return (
                void 0 === n && (n = 100),
                r(this, void 0, void 0, function () {
                  var n = this;
                  return i(this, function (o) {
                    return [
                      2,
                      new Promise(function (o, a) {
                        return r(n, void 0, void 0, function () {
                          var n;
                          return i(this, function (r) {
                            return (
                              null === (n = e.document.getElementById(t))
                                ? a()
                                : (n.classList.remove("jsv-show"),
                                  n.classList.add("jsv-hidden"),
                                  setTimeout(function () {
                                    o();
                                  }, 2e3)),
                              [2]
                            );
                          });
                        });
                      }),
                    ];
                  });
                })
              );
            }),
            (t.hideImageSlow = function (t, e, n) {
              return (
                void 0 === n && (n = 100),
                r(this, void 0, void 0, function () {
                  var o = this;
                  return i(this, function (a) {
                    return [
                      2,
                      new Promise(function (a, s) {
                        return r(o, void 0, void 0, function () {
                          var r, o, u;
                          return i(this, function (i) {
                            return (
                              "" === t && a(),
                              null === (r = e.document.getElementById(t))
                                ? s()
                                : ((o = 1),
                                  (u = setInterval(function () {
                                    (o -= 50 / n) <= 0 &&
                                      (clearInterval(u),
                                      (o = 0),
                                      (r.style.display = "none"),
                                      (r.style.visibility = "hidden"),
                                      a()),
                                      (r.style.opacity = "" + o),
                                      (r.style.filter =
                                        "alpha(opacity=" + 100 * o + ")");
                                  }, 50))),
                              [2]
                            );
                          });
                        });
                      }),
                    ];
                  });
                })
              );
            }),
            (t.addShowStyle = function (t, e, n) {
              return (
                void 0 === n && (n = 100),
                r(this, void 0, void 0, function () {
                  var n = this;
                  return i(this, function (o) {
                    return [
                      2,
                      new Promise(function (o, a) {
                        return r(n, void 0, void 0, function () {
                          var n;
                          return i(this, function (r) {
                            return (
                              null === (n = e.document.getElementById(t))
                                ? a()
                                : (n.classList.remove("jsv-hidden"),
                                  n.classList.add("jsv-show"),
                                  setTimeout(function () {
                                    o();
                                  }, 2e3)),
                              [2]
                            );
                          });
                        });
                      }),
                    ];
                  });
                })
              );
            }),
            (t.addStyles = function (t) {
              var e = t.document.createElement("style");
              (e.innerText =
                "\n            .jsv-hidden { \n                opacity:0;\n                display: none;\n                transition: opacity .8s ease-in-out\n            }\n            .jsv-show {\n              opacity:1;\n              display:unset;\n              transition: opacity .8s ease-in-out\n            }\n            .jsv-width-100 {\n                width: 100%;\n            }     \n            .jsv-height-100 {\n                height: 100%;\n            }\n        "),
                document.head.appendChild(e);
            }),
            (t.showImage = function (t, e) {
              var n = e.document.getElementById(t.id);
              if (!n) throw "could not find element with id " + t.id;
              (n.style.display = "block"),
                n.style.removeProperty("z-index"),
                n.style.removeProperty("width"),
                n.style.removeProperty("position"),
                n.style.removeProperty("opacity"),
                n.style.removeProperty("filter"),
                n.style.removeProperty("visibility");
            }),
            (t.getImageHolderElement = function (t, e, n, r, i) {
              var o,
                a,
                s,
                u,
                c = t.document.createElement("div"),
                l = null !== (o = r[0]) && void 0 !== o ? o : null;
              if (
                i.autoCDNResizer &&
                i.zoom &&
                null !== l &&
                (null === (a = i.autoCDNResizerConfig) || void 0 === a
                  ? void 0
                  : a.scaleWithZoomMax)
              ) {
                if (
                  null === (s = i.autoCDNResizerConfig) || void 0 === s
                    ? void 0
                    : s.useWidth
                ) {
                  var h = l.naturalWidth;
                  (h /= i.zoomMax), (c.style.maxWidth = h + "px");
                }
                if (
                  null === (u = i.autoCDNResizerConfig) || void 0 === u
                    ? void 0
                    : u.useHeight
                ) {
                  var d = l.naturalHeight;
                  (d /= i.zoomMax), (c.style.height = d + "px");
                }
              }
              return (
                (c.style.padding = "0"),
                (c.style.margin = "0"),
                (c.style.position = "relative"),
                (c.id = n),
                c
              );
            }),
            (t.removeElement = function (t) {
              if (null !== t && t && t.parentNode && t.hasChildNodes())
                try {
                  t.parentNode.removeChild(t);
                } catch (t) {
                  return;
                }
            }),
            (t.getMainHolderElement = function (t, e, n, r) {
              var i = e.document.getElementById(t);
              if (i instanceof HTMLDivElement)
                return (i.style.position = "relative"), i;
              throw new o.default(
                'Could not find main holder with id "' +
                  t +
                  '". Did you create an element like <div id="' +
                  t +
                  '"></div>'
              );
            }),
            (t.createLink = function (t, e) {
              var n = t.document.createElement("a");
              (n.title = atob("MzYwIHByb2R1Y3Qgdmlld2VyLCAzNjAgc3Bpbg==")),
                (n.style.position = "absolute"),
                (n.style.bottom = "10px"),
                (n.style.right = "10px"),
                (n.style.zIndex = "300"),
                (n.style.color = "#ccc"),
                (n.href = atob(
                  "aHR0cHM6Ly93d3cuMzYwLWphdmFzY3JpcHR2aWV3ZXIuY29t"
                )),
                (n.innerText = atob("MzYwIHByb2R1Y3Qgdmlld2Vy")),
                e.appendChild(n);
            }),
            (t.getImageElement = function (t, e) {
              var n = e.document.createElement("img");
              return (
                (n.src = t.src),
                (n.id = t.id),
                (n.style.userSelect = "none"),
                (n.style.display = "none"),
                (n.style.touchAction = "pan-x"),
                (n.style.touchAction = "pan-y"),
                t.extraClass.length > 0 &&
                  t.extraClass.split(" ").forEach(function (t) {
                    t.length > 0 && n.classList.add(t.trim());
                  }),
                n
              );
            }),
            (t.setPointer = function (t, e) {
              t.style.cursor = e;
            }),
            (t.setTouchAction = function (t, e) {
              e && (t.style.touchAction = e);
            }),
            t
          );
        })();
      e.DomUtilities = a;
    },
    function (t, e) {
      t.exports = (function (t) {
        var e = {};
        function n(r) {
          if (e[r]) return e[r].exports;
          var i = (e[r] = { i: r, l: !1, exports: {} });
          return t[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
        }
        return (
          (n.m = t),
          (n.c = e),
          (n.d = function (t, e, r) {
            n.o(t, e) ||
              Object.defineProperty(t, e, { enumerable: !0, get: r });
          }),
          (n.r = function (t) {
            "undefined" != typeof Symbol &&
              Symbol.toStringTag &&
              Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
              Object.defineProperty(t, "__esModule", { value: !0 });
          }),
          (n.t = function (t, e) {
            if ((1 & e && (t = n(t)), 8 & e)) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var r = Object.create(null);
            if (
              (n.r(r),
              Object.defineProperty(r, "default", { enumerable: !0, value: t }),
              2 & e && "string" != typeof t)
            )
              for (var i in t)
                n.d(
                  r,
                  i,
                  function (e) {
                    return t[e];
                  }.bind(null, i)
                );
            return r;
          }),
          (n.n = function (t) {
            var e =
              t && t.__esModule
                ? function () {
                    return t.default;
                  }
                : function () {
                    return t;
                  };
            return n.d(e, "a", e), e;
          }),
          (n.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
          }),
          (n.p = ""),
          n((n.s = 4))
        );
      })([
        function (t, e, n) {
          "use strict";
          function r(t, e, n) {
            return (
              e in t
                ? Object.defineProperty(t, e, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = n),
              t
            );
          }
          function i(t) {
            if (Array.isArray(t)) {
              for (var e = 0, n = Array(t.length); e < t.length; e++)
                n[e] = t[e];
              return n;
            }
            return Array.from(t);
          }
          Object.defineProperty(e, "__esModule", { value: !0 });
          var o = n(1),
            a = n(2),
            s = function () {
              throw new Error("Slot not connected");
            };
          e.defaultSlotConfig = { noBuffer: !1 };
          var u = function (t) {
              return Object.assign(
                function () {
                  return s();
                },
                {
                  config: t,
                  lazy: function () {
                    return s;
                  },
                  on: function () {
                    return s;
                  },
                  slotName: "Not connected",
                }
              );
            },
            c = function (t, e) {
              return Object.keys(e).reduce(function (n, r) {
                return n.concat(e[r][t] || []);
              }, []);
            },
            l = function (t) {
              return Object.keys(t).reduce(function (e, n) {
                var r = t[n],
                  o = Object.keys(r).filter(function (t) {
                    return (r[t] || []).length > 0;
                  }),
                  a = [].concat(i(e), i(o));
                return [].concat(i(new Set(a)));
              }, []);
            };
          (e.slot = function () {
            var t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : e.defaultSlotConfig;
            return u(t);
          }),
            (e.connectSlot = function (t, e) {
              var n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : {},
                s = e.reduce(function (t, e, n) {
                  return Object.assign({}, t, r({}, n, {}));
                }, r({}, "LOCAL_TRANSPORT", {})),
                u = e.reduce(function (t, e, n) {
                  return Object.assign({}, t, r({}, n, {}));
                }, {}),
                h = function (t, e) {
                  var n = function () {},
                    r = new Promise(function (t) {
                      return (n = t);
                    });
                  u[t][e] = { registered: r, onRegister: n };
                },
                d = [],
                f = [],
                g = function (t) {
                  return d.forEach(function (e) {
                    return e(t);
                  });
                },
                p = function (t) {
                  return f.forEach(function (e) {
                    return e(t);
                  });
                };
              function m(t, r) {
                var l = 2 === arguments.length,
                  d = l ? r : t,
                  f = l ? t : a.DEFAULT_PARAM;
                if (n.noBuffer || 0 === e.length) {
                  var g = c(f, s);
                  return o.callHandlers(d, g);
                }
                e.forEach(function (t, e) {
                  u[e][f] || h(String(e), f);
                });
                var p = e.reduce(function (t, e, n) {
                  return [].concat(i(t), [u[n][f].registered]);
                }, []);
                return Promise.all(p).then(function () {
                  var t = c(f, s);
                  return o.callHandlers(d, t);
                });
              }
              function v(t, e) {
                return (
                  d.push(t),
                  f.push(e),
                  l(s).forEach(t),
                  function () {
                    l(s).forEach(e);
                    var n = d.indexOf(t);
                    n > -1 && d.splice(n, 1);
                    var r = f.indexOf(e);
                    r > -1 && f.splice(r, 1);
                  }
                );
              }
              function y(n, r) {
                var i = "",
                  o = function () {
                    return new Promise(function (t) {
                      return t();
                    });
                  };
                return (
                  "string" == typeof n
                    ? ((i = n), (o = r || o))
                    : ((i = a.DEFAULT_PARAM), (o = n)),
                  e.forEach(function (e) {
                    return e.registerHandler(t, i, o);
                  }),
                  (s.LOCAL_TRANSPORT[i] = (s.LOCAL_TRANSPORT[i] || []).concat(
                    o
                  )),
                  1 === c(i, s).length && g(i),
                  function () {
                    e.forEach(function (e) {
                      return e.unregisterHandler(t, i, o);
                    });
                    var n = (s.LOCAL_TRANSPORT[i] || []).indexOf(o);
                    -1 !== n && s.LOCAL_TRANSPORT[i].splice(n, 1),
                      0 === c(i, s).length && p(i);
                  }
                );
              }
              return (
                e.forEach(function (e, n) {
                  e.addRemoteHandlerRegistrationCallback(t, function () {
                    var t =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : a.DEFAULT_PARAM,
                      e = arguments[1],
                      r = s[n][t] || [];
                    (s[n][t] = r.concat(e)),
                      1 === c(t, s).length && g(t),
                      u[n][t] || h(String(n), t),
                      u[n][t].onRegister();
                  }),
                    e.addRemoteHandlerUnregistrationCallback(t, function () {
                      var t =
                          arguments.length > 0 && void 0 !== arguments[0]
                            ? arguments[0]
                            : a.DEFAULT_PARAM,
                        e = arguments[1],
                        r = s[n][t] || [],
                        i = r.indexOf(e);
                      i > -1 && s[n][t].splice(i, 1),
                        0 === c(t, s).length && p(t),
                        h(String(n), t);
                    });
                }),
                Object.assign(m, { on: y, lazy: v, config: n, slotName: t })
              );
            });
        },
        function (t, e, n) {
          "use strict";
          function r(t, e) {
            var n = null;
            try {
              n = t(e);
            } catch (t) {
              return Promise.reject(t);
            }
            return n && n.then ? n : Promise.resolve(n);
          }
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.callHandlers = function (t, e) {
              return e && 0 !== e.length
                ? 1 === e.length
                  ? r(e[0], t)
                  : Promise.all(
                      e.map(function (e) {
                        return r(e, t);
                      })
                    )
                : new Promise(function (t) {});
            });
        },
        function (t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.DEFAULT_PARAM = "$_DEFAULT_$");
        },
        function (t, e, n) {
          "use strict";
          var r = (function () {
            function t(t, e) {
              for (var n = 0; n < e.length; n++) {
                var r = e[n];
                (r.enumerable = r.enumerable || !1),
                  (r.configurable = !0),
                  "value" in r && (r.writable = !0),
                  Object.defineProperty(t, r.key, r);
              }
            }
            return function (e, n, r) {
              return n && t(e.prototype, n), r && t(e, r), e;
            };
          })();
          function i(t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          }
          Object.defineProperty(e, "__esModule", { value: !0 });
          var o = (function () {
            function t() {
              var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : 5e3;
              i(this, t),
                (this._timeout = e),
                (this._onMessageCallbacks = []),
                (this._onConnectCallbacks = []),
                (this._onDisconnectCallbacks = []),
                (this._onErrorCallbacks = []),
                (this._ready = !1);
            }
            return (
              r(t, [
                {
                  key: "onData",
                  value: function (t) {
                    -1 === this._onMessageCallbacks.indexOf(t) &&
                      this._onMessageCallbacks.push(t);
                  },
                },
                {
                  key: "onConnect",
                  value: function (t) {
                    this._ready && t(), this._onConnectCallbacks.push(t);
                  },
                },
                {
                  key: "onDisconnect",
                  value: function (t) {
                    this._onDisconnectCallbacks.push(t);
                  },
                },
                {
                  key: "onError",
                  value: function (t) {
                    this._onErrorCallbacks.push(t);
                  },
                },
                {
                  key: "_messageReceived",
                  value: function (t) {
                    this._onMessageCallbacks.forEach(function (e) {
                      return e(t);
                    });
                  },
                },
                {
                  key: "_error",
                  value: function (t) {
                    this._onErrorCallbacks.forEach(function (e) {
                      return e(t);
                    });
                  },
                },
                {
                  key: "_connected",
                  value: function () {
                    (this._ready = !0),
                      this._onConnectCallbacks.forEach(function (t) {
                        return t();
                      });
                  },
                },
                {
                  key: "_disconnected",
                  value: function () {
                    (this._ready = !1),
                      this._onDisconnectCallbacks.forEach(function (t) {
                        return t();
                      });
                  },
                },
                {
                  key: "timeout",
                  get: function () {
                    return this._timeout;
                  },
                },
              ]),
              t
            );
          })();
          e.GenericChannel = o;
        },
        function (t, e, n) {
          t.exports = n(5);
        },
        function (t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: !0 });
          var r = n(0);
          e.slot = r.slot;
          var i = n(6);
          (e.combineEvents = i.combineEvents),
            (e.createEventBus = i.createEventBus);
          var o = n(3);
          e.GenericChannel = o.GenericChannel;
          var a = n(8);
          e.ChunkedChannel = a.ChunkedChannel;
          var s = n(2);
          e.DEFAULT_PARAM = s.DEFAULT_PARAM;
        },
        function (t, e, n) {
          "use strict";
          function r(t) {
            if (Array.isArray(t)) {
              for (var e = 0, n = Array(t.length); e < t.length; e++)
                n[e] = t[e];
              return n;
            }
            return Array.from(t);
          }
          Object.defineProperty(e, "__esModule", { value: !0 });
          var i = n(0),
            o = n(7);
          (e.combineEvents = function (
            t,
            e,
            n,
            i,
            o,
            a,
            s,
            u,
            c,
            l,
            h,
            d,
            f,
            g,
            p,
            m,
            v,
            y,
            b,
            w,
            x,
            E,
            R,
            I
          ) {
            var _ = Array.from(arguments),
              k = _.reduce(function (t, e) {
                return [].concat(r(t), r(Object.keys(e)));
              }, []),
              C = [].concat(r(new Set(k)));
            if (k.length > C.length)
              throw new Error(
                "ts-event-bus: duplicate slots encountered in combineEvents."
              );
            return Object.assign.apply(Object, [{}].concat(r(_)));
          }),
            (e.createEventBus = function (t) {
              var e = (t.channels || []).map(function (t) {
                return new o.Transport(t);
              });
              return Object.keys(t.events).reduce(function (n, r) {
                var o = t.events[r].config;
                return (n[r] = i.connectSlot(r, e, o)), n;
              }, {});
            });
        },
        function (t, e, n) {
          "use strict";
          var r = (function () {
            function t(t, e) {
              for (var n = 0; n < e.length; n++) {
                var r = e[n];
                (r.enumerable = r.enumerable || !1),
                  (r.configurable = !0),
                  "value" in r && (r.writable = !0),
                  Object.defineProperty(t, r.key, r);
              }
            }
            return function (e, n, r) {
              return n && t(e.prototype, n), r && t(e, r), e;
            };
          })();
          Object.defineProperty(e, "__esModule", { value: !0 });
          var i = n(1),
            o = 0,
            a = (function () {
              function t(e) {
                var n = this;
                !(function (t, e) {
                  if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function");
                })(this, t),
                  (this._channel = e),
                  (this._localHandlers = {}),
                  (this._localHandlerRegistrations = {}),
                  (this._remoteHandlers = {}),
                  (this._remoteHandlerRegistrationCallbacks = {}),
                  (this._remoteHandlerDeletionCallbacks = {}),
                  (this._pendingRequests = {}),
                  (this._channelReady = !1),
                  this._channel.onData(function (t) {
                    switch (t.type) {
                      case "request":
                        return n._requestReceived(t);
                      case "response":
                        return n._responseReceived(t);
                      case "handler_registered":
                        return n._registerRemoteHandler(t);
                      case "handler_unregistered":
                        return n._unregisterRemoteHandler(t);
                      case "error":
                        return n._errorReceived(t);
                      default:
                        !(function (t) {
                          throw new Error("Should not happen: " + t);
                        })(t);
                    }
                  }),
                  this._channel.onConnect(function () {
                    (n._channelReady = !0),
                      Object.keys(n._localHandlerRegistrations).forEach(
                        function (t) {
                          n._localHandlerRegistrations[t].forEach(function (t) {
                            n._channel.send(t);
                          });
                        }
                      );
                  }),
                  this._channel.onDisconnect(function () {
                    (n._channelReady = !1),
                      n._unregisterAllRemoteHandlers(),
                      n._rejectAllPendingRequests(
                        new Error("REMOTE_CONNECTION_CLOSED")
                      );
                  }),
                  this._channel.onError(function (t) {
                    return n._rejectAllPendingRequests(t);
                  });
              }
              return (
                r(t, [
                  {
                    key: "_requestReceived",
                    value: function (t) {
                      var e = this,
                        n = t.slotName,
                        r = t.data,
                        o = t.id,
                        a = t.param,
                        s = this._localHandlers[n];
                      if (s) {
                        var u = s[a];
                        u &&
                          i
                            .callHandlers(r, u)
                            .then(function (t) {
                              return e._channel.send({
                                type: "response",
                                slotName: n,
                                id: o,
                                data: t,
                                param: a,
                              });
                            })
                            .catch(function (t) {
                              return e._channel.send({
                                id: o,
                                message: "" + t,
                                param: a,
                                slotName: n,
                                stack: t.stack || "",
                                type: "error",
                              });
                            });
                      }
                    },
                  },
                  {
                    key: "_responseReceived",
                    value: function (t) {
                      var e = t.slotName,
                        n = t.data,
                        r = t.id,
                        i = t.param,
                        o = this._pendingRequests[e];
                      o &&
                        o[i] &&
                        o[i][r] &&
                        (o[i][r].resolve(n), delete o[i][r]);
                    },
                  },
                  {
                    key: "_errorReceived",
                    value: function (t) {
                      var e = t.slotName,
                        n = t.id,
                        r = t.message,
                        i = t.stack,
                        o = t.param,
                        a = this._pendingRequests[e];
                      if (a && a[o] && a[o][n]) {
                        var s = new Error(r + " on " + e + " with param " + o);
                        (s.stack = i || s.stack),
                          this._pendingRequests[e][o][n].reject(s),
                          delete this._pendingRequests[e][o][n];
                      }
                    },
                  },
                  {
                    key: "_registerRemoteHandler",
                    value: function (t) {
                      var e = this,
                        n = t.slotName,
                        r = t.param,
                        i = this._remoteHandlerRegistrationCallbacks[n];
                      if (i) {
                        var a = this._remoteHandlers[n];
                        if (!a || !a[r]) {
                          var s = function (t) {
                            return new Promise(function (i, a) {
                              if (!e._channelReady)
                                return a(
                                  new Error("CHANNEL_NOT_READY on " + n)
                                );
                              var s = "" + o++;
                              (e._pendingRequests[n] =
                                e._pendingRequests[n] || {}),
                                (e._pendingRequests[n][r] =
                                  e._pendingRequests[n][r] || {}),
                                (e._pendingRequests[n][r][s] = {
                                  resolve: i,
                                  reject: a,
                                }),
                                e._channel.send({
                                  type: "request",
                                  id: s,
                                  slotName: n,
                                  param: r,
                                  data: t,
                                }),
                                setTimeout(function () {
                                  var t = ((e._pendingRequests[n] || {})[r] ||
                                    {})[s];
                                  if (t) {
                                    var i = new Error(
                                      "TIMED_OUT on " + n + " with param " + r
                                    );
                                    t.reject(i),
                                      delete e._pendingRequests[n][r][s];
                                  }
                                }, e._channel.timeout);
                            });
                          };
                          (this._remoteHandlers[n] =
                            this._remoteHandlers[n] || {}),
                            (this._remoteHandlers[n][r] = s),
                            i(r, s);
                        }
                      }
                    },
                  },
                  {
                    key: "_unregisterRemoteHandler",
                    value: function (t) {
                      var e = t.slotName,
                        n = t.param,
                        r = this._remoteHandlerDeletionCallbacks[e],
                        i = this._remoteHandlers[e];
                      if (i) {
                        var o = i[n];
                        o && r && (r(n, o), delete this._remoteHandlers[e][n]);
                      }
                    },
                  },
                  {
                    key: "_unregisterAllRemoteHandlers",
                    value: function () {
                      var t = this;
                      Object.keys(this._remoteHandlerDeletionCallbacks).forEach(
                        function (e) {
                          var n = t._remoteHandlers[e];
                          n &&
                            Object.keys(n)
                              .filter(function (t) {
                                return n[t];
                              })
                              .forEach(function (n) {
                                return t._unregisterRemoteHandler({
                                  slotName: e,
                                  param: n,
                                });
                              });
                        }
                      );
                    },
                  },
                  {
                    key: "_rejectAllPendingRequests",
                    value: function (t) {
                      var e = this;
                      Object.keys(this._pendingRequests).forEach(function (n) {
                        Object.keys(e._pendingRequests[n]).forEach(function (
                          r
                        ) {
                          Object.keys(e._pendingRequests[n][r]).forEach(
                            function (i) {
                              e._pendingRequests[n][r][i].reject(t);
                            }
                          );
                        }),
                          (e._pendingRequests[n] = {});
                      });
                    },
                  },
                  {
                    key: "addRemoteHandlerRegistrationCallback",
                    value: function (t, e) {
                      this._remoteHandlerRegistrationCallbacks[t] ||
                        (this._remoteHandlerRegistrationCallbacks[t] = e);
                    },
                  },
                  {
                    key: "addRemoteHandlerUnregistrationCallback",
                    value: function (t, e) {
                      this._remoteHandlerDeletionCallbacks[t] ||
                        (this._remoteHandlerDeletionCallbacks[t] = e);
                    },
                  },
                  {
                    key: "registerHandler",
                    value: function (t, e, n) {
                      if (
                        ((this._localHandlers[t] =
                          this._localHandlers[t] || {}),
                        (this._localHandlers[t][e] =
                          this._localHandlers[t][e] || []),
                        this._localHandlers[t][e].push(n),
                        1 === this._localHandlers[t][e].length)
                      ) {
                        var r = {
                          type: "handler_registered",
                          param: e,
                          slotName: t,
                        };
                        (this._localHandlerRegistrations[e] =
                          this._localHandlerRegistrations[e] || []),
                          this._localHandlerRegistrations[e].push(r),
                          this._channelReady && this._channel.send(r);
                      }
                    },
                  },
                  {
                    key: "unregisterHandler",
                    value: function (t, e, n) {
                      var r = this._localHandlers[t];
                      if (r && r[e]) {
                        var i = r[e].indexOf(n);
                        if (i > -1 && (r[e].splice(i, 1), 0 === r[e].length)) {
                          var o = {
                            type: "handler_unregistered",
                            param: e,
                            slotName: t,
                          };
                          this._channelReady && this._channel.send(o);
                        }
                      }
                    },
                  },
                ]),
                t
              );
            })();
          e.Transport = a;
        },
        function (t, e, n) {
          "use strict";
          var r = (function () {
              function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                  var r = e[n];
                  (r.enumerable = r.enumerable || !1),
                    (r.configurable = !0),
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(t, r.key, r);
                }
              }
              return function (e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e;
              };
            })(),
            i = function t(e, n, r) {
              null === e && (e = Function.prototype);
              var i = Object.getOwnPropertyDescriptor(e, n);
              if (void 0 === i) {
                var o = Object.getPrototypeOf(e);
                return null === o ? void 0 : t(o, n, r);
              }
              if ("value" in i) return i.value;
              var a = i.get;
              return void 0 !== a ? a.call(r) : void 0;
            };
          Object.defineProperty(e, "__esModule", { value: !0 });
          var o = n(3),
            a = n(9),
            s = function (t) {
              if (!t.chunkId)
                throw new Error(
                  "ChunkedMessage did not have a chunkId: " + JSON.stringify(t)
                );
            },
            u = (function (t) {
              function e(t) {
                !(function (t, e) {
                  if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function");
                })(this, e);
                var n = (function (t, e) {
                  if (!t)
                    throw new ReferenceError(
                      "this hasn't been initialised - super() hasn't been called"
                    );
                  return !e || ("object" != typeof e && "function" != typeof e)
                    ? t
                    : e;
                })(
                  this,
                  (e.__proto__ || Object.getPrototypeOf(e)).call(
                    this,
                    t.timeout
                  )
                );
                return (
                  (n._buffer = {}),
                  (n._chunkSize = t.chunkSize),
                  (n._sender = t.sender),
                  (n._maxStringAlloc = t.maxStringAlloc || -1),
                  n
                );
              }
              return (
                (function (t, e) {
                  if ("function" != typeof e && null !== e)
                    throw new TypeError(
                      "Super expression must either be null or a function, not " +
                        typeof e
                    );
                  (t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                      value: t,
                      enumerable: !1,
                      writable: !0,
                      configurable: !0,
                    },
                  })),
                    e &&
                      (Object.setPrototypeOf
                        ? Object.setPrototypeOf(t, e)
                        : (t.__proto__ = e));
                })(e, t),
                r(e, [
                  {
                    key: "send",
                    value: function (t) {
                      var e = this,
                        n = JSON.stringify(t);
                      if (n.length <= this._chunkSize) this._sender(t);
                      else {
                        var r = (function (t) {
                            for (
                              var e = new Uint16Array(t.length),
                                n = 0,
                                r = t.length;
                              n < r;
                              n++
                            )
                              e[n] = t.charCodeAt(n);
                            return e;
                          })(n),
                          i = []
                            .concat(
                              (function (t) {
                                if (Array.isArray(t)) {
                                  for (
                                    var e = 0, n = Array(t.length);
                                    e < t.length;
                                    e++
                                  )
                                    n[e] = t[e];
                                  return n;
                                }
                                return Array.from(t);
                              })(Array(30))
                            )
                            .map(function () {
                              return Math.random().toString(36)[3];
                            })
                            .join("");
                        this._sender({
                          type: "chunk_start",
                          chunkId: i,
                          size: n.length,
                        }),
                          !(function t() {
                            var n =
                                arguments.length > 0 && void 0 !== arguments[0]
                                  ? arguments[0]
                                  : 0,
                              o = r.slice(n, n + e._chunkSize);
                            o.length &&
                              (e._sender({
                                type: "chunk_data",
                                chunkId: i,
                                data: Array.from(o),
                              }),
                              t(n + e._chunkSize));
                          })(),
                          this._sender({ type: "chunk_end", chunkId: i });
                      }
                    },
                  },
                  {
                    key: "_messageReceived",
                    value: function (t) {
                      switch (t.type) {
                        case "chunk_start":
                          this._receiveNewChunk(t);
                          break;
                        case "chunk_data":
                          this._receiveChunkData(t);
                          break;
                        case "chunk_end":
                          var n = this._mergeChunks(t);
                          i(
                            e.prototype.__proto__ ||
                              Object.getPrototypeOf(e.prototype),
                            "_messageReceived",
                            this
                          ).call(this, n);
                          break;
                        default:
                          i(
                            e.prototype.__proto__ ||
                              Object.getPrototypeOf(e.prototype),
                            "_messageReceived",
                            this
                          ).call(this, t);
                      }
                    },
                  },
                  {
                    key: "_receiveNewChunk",
                    value: function (t) {
                      if ((s(t), this._buffer[t.chunkId]))
                        throw new Error(
                          "There was already an entry in the buffer for chunkId " +
                            t.chunkId
                        );
                      this._buffer[t.chunkId] = {
                        id: t.chunkId,
                        chunks: [],
                        size: t.size,
                      };
                    },
                  },
                  {
                    key: "_receiveChunkData",
                    value: function (t) {
                      if ((s(t), !this._buffer[t.chunkId]))
                        throw new Error(
                          "ChunkId " +
                            t.chunkId +
                            " was not found in the buffer"
                        );
                      this._buffer[t.chunkId].chunks.push(t.data);
                    },
                  },
                  {
                    key: "_mergeChunks",
                    value: function (t) {
                      if ((s(t), !this._buffer[t.chunkId]))
                        throw new Error(
                          "ChunkId " +
                            t.chunkId +
                            " was not found in the buffer"
                        );
                      var e = this._buffer[t.chunkId].chunks.reduce(
                          function (t, e, n) {
                            return (
                              e.forEach(function (e, n) {
                                return (t.uintArray[t.currentIx + n] = e);
                              }),
                              (t.currentIx += e.length),
                              t
                            );
                          },
                          {
                            uintArray: new Uint16Array(
                              this._buffer[t.chunkId].size
                            ),
                            currentIx: 0,
                          }
                        ),
                        n = void 0,
                        r = (function (t, e) {
                          if (-1 === e)
                            return String.fromCharCode.apply(null, t);
                          for (var n = "", r = 0; r < t.length; r += e)
                            r + e > t.length
                              ? (n += String.fromCharCode.apply(
                                  null,
                                  t.subarray(r)
                                ))
                              : (n += String.fromCharCode.apply(
                                  null,
                                  t.subarray(r, r + e)
                                ));
                          return n;
                        })(e.uintArray, this._maxStringAlloc);
                      try {
                        n = JSON.parse(r);
                      } catch (t) {
                        throw new Error("Not a valid JSON string: " + r);
                      }
                      if (!a.isTransportMessage(n))
                        throw new Error(
                          "Not a transport message: " + JSON.stringify(n)
                        );
                      return n;
                    },
                  },
                ]),
                e
              );
            })(o.GenericChannel);
          e.ChunkedChannel = u;
        },
        function (t, e, n) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: !0 }),
            (e.isTransportMessage = function (t) {
              switch (t.type) {
                case "request":
                case "response":
                case "error":
                case "handler_unregistered":
                case "handler_registered":
                  return !0;
                default:
                  return !1;
              }
            });
        },
      ]);
    },
    function (t, e, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (t, e, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function a(t) {
                try {
                  u(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function s(t) {
                try {
                  u(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function u(t) {
                var e;
                t.done
                  ? i(t.value)
                  : ((e = t.value),
                    e instanceof n
                      ? e
                      : new n(function (t) {
                          t(e);
                        })).then(a, s);
              }
              u((r = r.apply(t, e || [])).next());
            });
          },
        i =
          (this && this.__generator) ||
          function (t, e) {
            var n,
              r,
              i,
              o,
              a = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function s(o) {
              return function (s) {
                return (function (o) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; a; )
                    try {
                      if (
                        ((n = 1),
                        r &&
                          (i =
                            2 & o[0]
                              ? r.return
                              : o[0]
                              ? r.throw || ((i = r.return) && i.call(r), 0)
                              : r.next) &&
                          !(i = i.call(r, o[1])).done)
                      )
                        return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return a.label++, { value: o[1], done: !1 };
                        case 5:
                          a.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((i = a.trys),
                            (i = i.length > 0 && i[i.length - 1]) ||
                              (6 !== o[0] && 2 !== o[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === o[0] &&
                            (!i || (o[1] > i[0] && o[1] < i[3]))
                          ) {
                            a.label = o[1];
                            break;
                          }
                          if (6 === o[0] && a.label < i[1]) {
                            (a.label = i[1]), (i = o);
                            break;
                          }
                          if (i && a.label < i[2]) {
                            (a.label = i[2]), a.ops.push(o);
                            break;
                          }
                          i[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      o = e.call(t, a);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      n = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, s]);
              };
            }
          };
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.JavascriptViewer = void 0);
      var o = n(6),
        a = n(3),
        s = n(1),
        u = n(15),
        c = n(4),
        l = n(16),
        h = n(17),
        d = n(0),
        f = n(18),
        g = n(20),
        p = {
          license: "",
          mainImageId: "jsv-image",
          mainHolderId: "jsv-holder",
          mainImageUrl: "",
          totalFrames: 72,
          imageUrls: [],
          speed: 80,
          inertia: 20,
          defaultProgressBar: !0,
          firstImageNumber: 1,
          imageUrlFormat: "",
          startFrameNo: 1,
          reverse: !1,
          autoRotate: 0,
          autoRotateSpeed: 0,
          autoRotateReverse: !1,
          enableImageEvents: !1,
          zoom: !1,
          zoomWheelSpeed: 50,
          zoomMax: 2,
          stopAtEdges: !1,
          enableChangeImageEvent: !1,
          cursorConfig: {
            default: "grab",
            drag: "grabbing",
            zoomIn: "zoom-in",
            zoomOut: "zoom-out",
            pan: "move",
          },
          touchConfig: {
            default: "pan-y",
            drag: "pan-y",
            zoomIn: "pan-x",
            zoomOut: "pan-x",
            pan: "pan-x",
          },
          autoCDNResizer: !1,
          autoCDNResizerConfig: {
            useWidth: !0,
            useHeight: !1,
            scaleWithZoomMax: !1,
          },
          notificationConfig: {
            dragToRotate: {
              showStartToRotateDefaultNotification: !1,
              imageUrl: "",
              languages: [],
              mainColor: "rgba(0,0,0,0.20)",
              textColor: "rgba(243,237,237,0.80)",
            },
          },
          extraImageClass: "",
          id: "",
        },
        m = (function () {
          function t(e) {
            (this.isStarted = !1),
              (this.isDragged = !1),
              (this.images = []),
              (this.currentImageNumber = 1),
              (this.previousImageNumber = 1),
              (this.desiredRotationInDegrees = 0),
              (this.mainImage = null),
              (this.mainHolderElement = null),
              (this.uniqueId = ""),
              (this.currentDegree = 0),
              (this.currentSpeed = 0),
              (this.inAnimation = !1),
              (this.desiredRotationInDegreesStartSlowingDown = null),
              (this.useEasing = !0),
              (this.updateInAction = !1),
              (this.window = null),
              (this.startDragInvocations = 0),
              (this.firstDrag = !1),
              (this.standbyRefreshRate = 40),
              (this.previousTargetDegree = null),
              (this.nAutoRotations = 0),
              (this.dragAllowed = !0),
              (this.currentPointer = "default"),
              (this.currentTouch = "default"),
              (this.zoomPointerTimeout = null),
              (this.watermark = !1),
              (this.watermark = !0),
              (this.zoom = null),
              (this.eventBus = t.initEventBus()),
              (this.window = "undefined" != typeof window ? window : null),
              (this.options = e),
              this.runningInBrowser();
          }
          return (
            (t.loadConfig = function (t, e, n) {
              return new Promise(function (r, i) {
                if (!t || t.length < 10 || (!e && n && "file:" !== n))
                  r({ config: "", watermark: !0 });
                else {
                  var o = new XMLHttpRequest(),
                    a =
                      "https://config.3dweb.io/" +
                      (t = null == t ? void 0 : t.trim());
                  (o.onreadystatechange = function () {
                    if (4 === this.readyState && 200 === this.status) {
                      var e = JSON.parse(this.responseText);
                      if (null !== e.config) return r(e);
                      i(
                        new Error("could not find a presentation with id " + t)
                      );
                    } else if (0 !== this.status && 200 !== this.status)
                      switch (this.status) {
                        case 404:
                          i(
                            new Error(
                              "could not find a presentation with id " + t
                            )
                          );
                          break;
                        case 403:
                          i(
                            new Error(
                              "you do not have access to presentation with id " +
                                t
                            )
                          );
                          break;
                        default:
                          i(
                            new Error(
                              "could not load presentation with id " + t
                            )
                          );
                      }
                  }),
                    o.open("GET", a, !0),
                    o.setRequestHeader("3dweb-host", e),
                    o.send();
                }
              });
            }),
            (t.initEventBus = function () {
              return c.createEventBus({ events: l.default, channels: [] });
            }),
            (t.prototype.runningInBrowser = function () {
              return "undefined" != typeof window;
            }),
            (t.prototype.events = function () {
              return this.eventBus;
            }),
            (t.prototype.setSpeed = function (t) {
              this.currentSpeed = t > 999 || t < -999 ? 999 : t;
            }),
            (t.prototype.setId = function (t) {
              var e = this;
              return (
                (this.options.id = t),
                (this.options.imageUrls = []),
                this.destroy()
                  .then(function () {
                    return e.start();
                  })
                  .catch(function (t) {
                    console.error(t);
                  })
              );
            }),
            (t.prototype.setInertia = function (t) {
              this.options.inertia = t > 99 ? 99 : t < 1 ? 1 : t;
            }),
            (t.prototype.initProgressBar = function () {
              if (this.options.defaultProgressBar) {
                this.options.mainImageId &&
                  o.Images.blurMainImage(this.options.mainImageId, this.window);
                var t = o.Images.createProgressBar(
                    this.uniqueId,
                    this.window,
                    this.mainHolderElement
                  ),
                  e = new h.default(0, t.firstChild);
                this.eventBus.loadImage.on(function (t) {
                  e.update(t.percentage);
                }),
                  this.eventBus.started.on(function () {
                    t.style.display = "none";
                  });
              }
            }),
            (t.prototype.documentIsReady = function () {
              return "complete" === this.window.document.readyState;
            }),
            (t.prototype.isB = function () {
              var t = new RegExp(
                  atob(
                    "KGdvb2dsZWJvdC98Ym90fEdvb2dsZWJvdC1Nb2JpbGV8R29vZ2xlYm90LUltYWdlfEdvb2dsZSBmYXZpY29ufE1lZGlhcGFydG5lcnMtR29vZ2xlfGJpbmdib3R8c2x1cnB8amF2YXx3Z2V0fGN1cmx8Q29tbW9ucy1IdHRwQ2xpZW50fFB5dGhvbi11cmxsaWJ8bGlid3d3fGh0dHB1bml0fG51dGNofHBocGNyYXdsfG1zbmJvdHxqeXhvYm90fEZBU1QtV2ViQ3Jhd2xlcnxGQVNUIEVudGVycHJpc2UgQ3Jhd2xlcnxiaWdsb3Ryb258dGVvbWF8Y29udmVyYXxzZWVrYm90fGdpZ2FibGFzdHxleGFib3R8bmdib3R8aWFfYXJjaGl2ZXJ8R2luZ2VyQ3Jhd2xlcnx3ZWJtb24gfGh0dHJhY2t8d2ViY3Jhd2xlcnxncnViLm9yZ3xVc2luZU5vdXZlbGxlQ3Jhd2xlcnxhbnRpYm90fG5ldHJlc2VhcmNoc2VydmVyfHNwZWVkeXxmbHVmZnl8YmlibnVtLmJuZnxmaW5kbGlua3xtc3Jib3R8cGFuc2NpZW50fHlhY3lib3R8QUlTZWFyY2hCb3R8SU9JfGlwcy1hZ2VudHx0YWdvb2JvdHxNSjEyYm90fGRvdGJvdHx3b3Jpb2JvdHx5YW5nYXxidXp6Ym90fG1sYm90fHlhbmRleGJvdHxwdXJlYm90fExpbmd1ZWUgQm90fFZveWFnZXJ8Q3liZXJQYXRyb2x8dm9pbGFib3R8YmFpZHVzcGlkZXJ8Y2l0ZXNlZXJ4Ym90fHNwYm90fHR3ZW5nYWJvdHxwb3N0cmFua3x0dXJuaXRpbmJvdHxzY3JpYmRib3R8cGFnZTJyc3N8c2l0ZWJvdHxsaW5rZGV4fEFkaWR4Ym90fGJsZWtrb2JvdHxlem9vbXN8ZG90Ym90fE1haWwuUlVfQm90fGRpc2NvYm90fGhlcml0cml4fGZpbmR0aGF0ZmlsZXxldXJvcGFyY2hpdmUub3JnfE5lcmRCeU5hdHVyZS5Cb3R8c2lzdHJpeCBjcmF3bGVyfGFocmVmc2JvdHxBYm91bmRleHxkb21haW5jcmF3bGVyfHdic2VhcmNoYm90fHN1bW1pZnl8Y2Nib3R8ZWRpc3RlcmJvdHxzZXpuYW1ib3R8ZWMybGlua2ZpbmRlcnxnc2xmYm90fGFpaGl0Ym90fGludGVsaXVtX2JvdHxmYWNlYm9va2V4dGVybmFsaGl0fHlldGl8UmV0cmV2b1BhZ2VBbmFseXplcnxsYi1zcGlkZXJ8c29nb3V8bHNzYm90fGNhcmVlcmJvdHx3b3Rib3h8d29jYm90fGljaGlyb3xEdWNrRHVja0JvdHxsc3Nyb2NrZXRjcmF3bGVyfGRydXBhY3R8d2ViY29tcGFueWNyYXdsZXJ8YWNvb25ib3R8b3BlbmluZGV4c3BpZGVyfGduYW0gZ25hbSBzcGlkZXJ8d2ViLWFyY2hpdmUtbmV0LmNvbS5ib3R8YmFja2xpbmtjcmF3bGVyfGNvY2NvY3xpbnRlZ3JvbWVkYnxjb250ZW50IGNyYXdsZXIgc3BpZGVyfHRvcGxpc3Rib3R8c2Vva2lja3Mtcm9ib3R8aXQybWVkaWEtZG9tYWluLWNyYXdsZXJ8aXAtd2ViLWNyYXdsZXIuY29tfHNpdGVleHBsb3Jlci5pbmZvfGVsaXNhYm90fHByb3hpbWljfGNoYW5nZWRldGVjdGlvbnxibGV4Ym90fGFyYWJvdHxXZVNFRTpTZWFyY2h8bmlraS1ib3R8Q3J5c3RhbFNlbWFudGljc0JvdHxyb2dlcmJvdHwzNjBTcGlkZXJ8cHNib3R8SW50ZXJmYXhTY2FuQm90fExpcHBlcmhleSBTRU8gU2VydmljZXxDQyBNZXRhZGF0YSBTY2FwZXJ8ZzAwZzFlLm5ldHxHcmFwZXNob3RDcmF3bGVyfHVybGFwcGVuZGJvdHxicmFpbm9ib3R8ZnItY3Jhd2xlcnxiaW5sYXJ8U2ltcGxlQ3Jhd2xlcnxMaXZlbGFwYm90fFR3aXR0ZXJib3R8Y1hlbnNlYm90fHNtdGJvdHxibmYuZnJfYm90fEE2LUluZGV4ZXJ8QURtYW50WHxGYWNlYm90fFR3aXR0ZXJib3R8T3JhbmdlQm90fG1lbW9yeWJvdHxBZHZCb3R8TWVnYUluZGV4fFNlbWFudGljU2Nob2xhckJvdHxsdHg3MXxuZXJkeWJvdHx4b3ZpYm90fEJVYmlOR3xRd2FudGlmeXxhcmNoaXZlLm9yZ19ib3R8QXBwbGVib3R8VHdlZXRtZW1lQm90fGNyYXdsZXI0anxmaW5keGJvdHxTZW1ydXNoQm90fHlvb3pCb3R8bGlwcGVyaGV5fHkhai1hc3J8RG9tYWluIFJlLUFuaW1hdG9yIEJvdHxBZGRUaGlzKQ=="
                  ),
                  "i"
                ),
                e = this.window.navigator.userAgent;
              return t.test(e);
            }),
            (t.prototype.isLocalhost = function () {
              var t = this.window.location.hostname,
                e = this.window.location.port;
              return Boolean(
                -1 !== t.indexOf("dev.") ||
                  -1 !== t.indexOf("beta.") ||
                  -1 !== t.indexOf("file") ||
                  "" !== e ||
                  "localhost" === t ||
                  "[::1]" === t ||
                  t.match(
                    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
                  )
              );
            }),
            (t.prototype.isV = function () {
              if (this.options.id) return !this.watermark;
              var t = this.window.location.host;
              return g.Helper.isValid(this.options.license, t);
            }),
            (t.prototype.getFirstImageIndex = function () {
              return this.options.firstImageNumber &&
                this.options.firstImageNumber > 0 &&
                this.options.firstImageNumber - 1 < this.images.length
                ? this.options.firstImageNumber - 1
                : 0;
            }),
            (t.prototype.destroy = function () {
              return r(this, void 0, void 0, function () {
                var e = this;
                return i(this, function (n) {
                  return [
                    2,
                    new Promise(function (n, r) {
                      try {
                        if (e.isStarted) {
                          var i = e.window.document.getElementById(e.uniqueId);
                          if (
                            (i && a.DomUtilities.removeElement(i),
                            e.options.defaultProgressBar)
                          ) {
                            var o = e.window.document.getElementById(
                              "loader_" + e.uniqueId
                            );
                            a.DomUtilities.removeElement(o);
                            var s = e.window.document.getElementById(
                              "link_" + e.uniqueId
                            );
                            a.DomUtilities.removeElement(s);
                          }
                          if (
                            e.options.notificationConfig.dragToRotate
                              .showStartToRotateDefaultNotification ||
                            e.options.notificationConfig.dragToRotate.imageUrl
                              .length > 0
                          ) {
                            var u = e.window.document.getElementById(
                              "notification_" + e.uniqueId
                            );
                            a.DomUtilities.removeElement(u);
                          }
                          a.DomUtilities.showImage(e.mainImage, e.window),
                            (e.mainHolderElement.outerHTML =
                              e.mainHolderElement.outerHTML),
                            (e.isStarted = !1),
                            (e.images = []),
                            (e.mainImage = null),
                            (e.mainHolderElement = null),
                            (e.firstDrag = !1),
                            (e.eventBus = t.initEventBus()),
                            n(!0);
                        } else n(!1);
                      } catch (t) {
                        var c = "error with destroying viewer";
                        t instanceof Error && (c += t.toString()), r(c);
                      }
                    }),
                  ];
                });
              });
            }),
            (t.prototype.start = function () {
              return r(this, void 0, void 0, function () {
                var e = this;
                return i(this, function (n) {
                  switch (n.label) {
                    case 0:
                      return this.documentIsReady()
                        ? [3, 2]
                        : [
                            4,
                            new Promise(function (t) {
                              setTimeout(function () {
                                t();
                              }, 200);
                            }).then(function () {
                              return e.start();
                            }),
                          ];
                    case 1:
                      return n.sent(), [3, 3];
                    case 2:
                      return [
                        2,
                        new Promise(function (n, r) {
                          var i = e.window.location.host,
                            o = e.window.location.protocol,
                            a = JSON.parse(JSON.stringify(e.options));
                          (e.options = s.mergeDeep({
                            objects: [p, e.options],
                          })),
                            e.options.id
                              ? t
                                  .loadConfig(e.options.id, i, o)
                                  .then(function (t) {
                                    e.watermark = t.watermark;
                                    var i = JSON.parse(t.config);
                                    (e.options = s.mergeDeep({
                                      objects: [p, i, a],
                                    })),
                                      (e.currentSpeed = e.options.speed),
                                      (e.options.totalFrames =
                                        e.getTotalFrames()),
                                      e.startPresentation().then(n).catch(r);
                                  })
                                  .catch(function (t) {
                                    e.handleError(t, r);
                                  })
                              : ((e.currentSpeed = e.options.speed),
                                (e.options.totalFrames = e.getTotalFrames()),
                                e.startPresentation().then(n).catch(r));
                        }),
                      ];
                    case 3:
                      return [2];
                  }
                });
              });
            }),
            (t.prototype.startPresentation = function () {
              return r(this, void 0, void 0, function () {
                var t = this;
                return i(this, function (e) {
                  return [
                    2,
                    new Promise(function (e, n) {
                      try {
                        if (
                          (t.isStarted &&
                            n("Viewer " + t.uniqueId + " already started"),
                          t.runningInBrowser() ||
                            n(
                              "Viewer " + t.uniqueId + " not started in browser"
                            ),
                          a.DomUtilities.addStyles(t.window),
                          t.registerStartEvents(),
                          t.registerInputEvents(),
                          (t.mainImage = o.Images.getMainImage(
                            t.options.mainImageId,
                            t.window
                          )),
                          (t.mainHolderElement =
                            a.DomUtilities.getMainHolderElement(
                              t.options.mainHolderId,
                              t.window,
                              t.isB(),
                              t.isLocalhost()
                            )),
                          !t.isB() ||
                            t.isLocalhost() ||
                            t.isV() ||
                            a.DomUtilities.createLink(
                              t.window,
                              t.mainHolderElement
                            ),
                          !t.isV() && !t.isLocalhost())
                        ) {
                          var u = JSON.parse(
                            JSON.stringify(t.options.notificationConfig)
                          );
                          (u.dragToRotate.mainColor = "rgb(255 ,255,255)"),
                            (u.dragToRotate.textColor = "rgb(55, 25, 2)"),
                            t.eventBus.startDragging.on(function (e) {
                              if (e.invocations >= 2) {
                                clearTimeout(t.pbto);
                                var n = o.Images.createOrGetPoweredBy(
                                  u,
                                  t.uniqueId,
                                  t.window,
                                  t.mainHolderElement,
                                  t.isLocalhost()
                                );
                                null !== n &&
                                  (t.pbto = setTimeout(function () {
                                    a.DomUtilities.addHiddenStyle(
                                      n.id,
                                      t.window,
                                      3e3
                                    ).then(function () {
                                      a.DomUtilities.removeElement(n);
                                    });
                                  }, 5e3));
                              }
                            });
                        }
                        (t.uniqueId = t.uniqueId || s.getRandomId()),
                          t.initProgressBar(),
                          t
                            .getImages()
                            .then(function (o) {
                              return r(t, void 0, void 0, function () {
                                var t,
                                  r = this;
                                return i(this, function (i) {
                                  return (
                                    (this.images = o),
                                    (t = a.DomUtilities.getImageHolderElement(
                                      this.window,
                                      this.mainHolderElement,
                                      this.uniqueId,
                                      o,
                                      this.options
                                    )),
                                    this.prepareImageHolder(t)
                                      .then(function () {
                                        return (
                                          r.mainHolderElement.appendChild(t),
                                          a.DomUtilities.hideImageSlow(
                                            r.mainImage.id,
                                            r.window
                                          )
                                            .then(function () {
                                              r.inAnimation ||
                                                (a.DomUtilities.showImage(
                                                  r.images[
                                                    r.getFirstImageIndex()
                                                  ],
                                                  r.window
                                                ),
                                                (r.currentImageNumber =
                                                  r.options.firstImageNumber ||
                                                  1),
                                                (r.previousImageNumber =
                                                  r.options.firstImageNumber ||
                                                  1),
                                                r.setCurrentDegree(
                                                  r.currentImageNumber
                                                )),
                                                (r.isStarted = !0),
                                                r.eventBus.started(!0),
                                                e();
                                            })
                                            .catch(function (t) {
                                              r.handleError(t, n);
                                            })
                                        );
                                      })
                                      .catch(function (t) {
                                        r.handleError(t, n);
                                      }),
                                    [2]
                                  );
                                });
                              });
                            })
                            .catch(function (e) {
                              t.handleError(e, n);
                            });
                      } catch (e) {
                        t.handleError(e, n);
                      }
                    }),
                  ];
                });
              });
            }),
            (t.prototype.handleError = function (t, e) {
              var n = this,
                r = "unknown error";
              t instanceof Error &&
                ((r = t.toString()),
                this.reportError(r),
                this.destroy()
                  .then(function () {
                    e(t.toString());
                  })
                  .catch(function (t) {
                    n.reportError(t);
                  })),
                e(r);
            }),
            (t.prototype.registerInputEvents = function () {
              var t = this;
              this.eventBus.pinch.on(function (e) {
                return t.onPinchListener(e);
              }),
                this.eventBus.doubleClick.on(function (e) {
                  return t.onDoubleClickListener(e);
                }),
                this.eventBus.scroll.on(function (e) {
                  return t.onScrollListener(e);
                });
            }),
            (t.prototype.startDragToRotateNotification = function () {
              o.Images.createReadyNotification(
                this.options.notificationConfig,
                this.uniqueId,
                this.window,
                this.mainHolderElement
              );
            }),
            (t.prototype.hideDragToRotateNotification = function () {
              var t = this;
              this.unsubscribe(),
                this.options.zoom && this.zoomUnsubscribe(),
                o.Images.hideReadyNotification(
                  this.options.notificationConfig,
                  this.uniqueId,
                  this.window
                ).then(function () {
                  var e = t.window.document.getElementById(
                    "notification_" + t.uniqueId
                  );
                  a.DomUtilities.removeElement(e);
                });
            }),
            (t.prototype.registerStartEvents = function () {
              var t = this;
              (this.options.notificationConfig.dragToRotate
                .showStartToRotateDefaultNotification ||
                this.options.notificationConfig.dragToRotate.imageUrl.length >
                  0) &&
                (this.eventBus.started.on(function () {
                  return t.startDragToRotateNotification();
                }),
                (this.unsubscribe = this.eventBus.startDragging.on(function () {
                  return t.hideDragToRotateNotification();
                })),
                this.options.zoom &&
                  ((this.zoomUnsubscribe = this.eventBus.pinch.on(function () {
                    return t.hideDragToRotateNotification();
                  })),
                  (this.zoomUnsubscribe = this.eventBus.scroll.on(function () {
                    return t.hideDragToRotateNotification();
                  })))),
                this.options.zoom &&
                  this.eventBus.started.on(function (e) {
                    return t.registerZoom(e);
                  }),
                this.options.autoRotate > 0 &&
                  this.eventBus.started.on(function (e) {
                    return t.runAutoRotate(e);
                  });
            }),
            (t.prototype.runAutoRotate = function (t) {
              var e = this;
              t
                ? this.autoRotate(this.options.autoRotate)
                    .then(function (t) {
                      e.eventBus.endAutoRotate({
                        currentDegree: e.currentDegree,
                        currentImage: e.images[e.currentImageNumber - 1],
                        completed: t,
                      });
                    })
                    .catch(function (t) {
                      e.reportError(t);
                    })
                : this.destroy()
                    .then(function () {
                      e.reportWarning("Failed starting autorotate");
                    })
                    .catch(function (t) {
                      return e.reportError(t);
                    });
            }),
            (t.prototype.registerZoom = function (t) {
              t &&
                (this.zoom = new f.DefaultZoom(
                  this.window,
                  this.images,
                  this.mainHolderElement,
                  this.options.zoomMax
                ));
            }),
            (t.prototype.onPinchListener = function (t) {
              var e,
                n = this;
              this.options.zoom &&
                ((this.dragAllowed = !1),
                null === (e = this.zoom) ||
                  void 0 === e ||
                  e.pinch(t, this.images[this.currentImageNumber - 1]),
                setTimeout(function () {
                  n.dragAllowed = !0;
                }, 1e3));
            }),
            (t.prototype.onDoubleClickListener = function (t) {
              var e, n;
              this.options.zoom &&
                (null === (e = this.zoom) || void 0 === e
                  ? void 0
                  : e.isZoomed()) &&
                (null === (n = this.zoom) ||
                  void 0 === n ||
                  n.reset(this.images[this.currentImageNumber - 1]),
                this.setPointer("default"));
            }),
            (t.prototype.onScrollListener = function (t) {
              var e,
                n,
                r = this;
              if (this.options.zoom) {
                this.cancelCurrentActions(),
                  this.zoomPointerTimeout &&
                    clearTimeout(this.zoomPointerTimeout),
                  null === (e = this.zoom) ||
                    void 0 === e ||
                    e.scroll(
                      t,
                      this.options.zoomWheelSpeed,
                      this.images[this.currentImageNumber - 1]
                    );
                var i = t.originalEvent.deltaY;
                (
                  null === (n = this.zoom) || void 0 === n
                    ? void 0
                    : n.isZoomed()
                )
                  ? (i < 0
                      ? this.setPointer("zoomIn")
                      : this.setPointer("zoomOut"),
                    (this.zoomPointerTimeout = this.window.setTimeout(
                      function () {
                        r.setPointer("pan");
                      },
                      500
                    )))
                  : this.setPointer("default");
              }
            }),
            (t.prototype.prepareImageHolder = function (t) {
              return r(this, void 0, void 0, function () {
                var e,
                  n,
                  o,
                  s,
                  c,
                  l = this;
                return i(this, function (h) {
                  return (
                    (e = []),
                    (n = function (t, e) {
                      return r(l, void 0, void 0, function () {
                        var n = this;
                        return i(this, function (r) {
                          return [
                            2,
                            new Promise(function (r, i) {
                              for (var o = [], a = 0; a < t.length; a++)
                                o.push(e.call(n, t[a], a));
                              Promise.all(o)
                                .then(function (t) {
                                  return r(t);
                                })
                                .catch(function (t) {
                                  return i(t);
                                });
                            }),
                          ];
                        });
                      });
                    }),
                    (o = function (n, r) {
                      (l.options.zoom || l.options.enableImageEvents) &&
                        l.addZoomEvents(n),
                        e.push(n),
                        (l.images[r].encoded = ""),
                        t.appendChild(n);
                    }),
                    (s = function (t, e) {
                      return new Promise(function (n, r) {
                        var i = a.DomUtilities.getImageElement(t, l.window);
                        i instanceof HTMLImageElement
                          ? i
                              .decode()
                              .then(function () {
                                o.call(l, i, e), n(!0);
                              })
                              .catch(function () {
                                o.call(l, i, e), n(!1);
                              })
                          : r("could not find element with id " + t.id);
                      });
                    }),
                    (c = function () {
                      var t, n;
                      (l.options.zoom || l.options.enableImageEvents) &&
                        (null === (t = l.mainHolderElement) ||
                          void 0 === t ||
                          t.addEventListener("wheel", l.onScroll.bind(l), {
                            passive: !1,
                          }),
                        null === (n = l.mainHolderElement) ||
                          void 0 === n ||
                          n.addEventListener(
                            "dblclick",
                            l.onDoubleClick.bind(l),
                            { passive: !0 }
                          )),
                        new u.default(e, {
                          container: l.mainHolderElement,
                          dragstart: l.dragStart.bind(l),
                          dragend: l.dragEnd.bind(l),
                          drag: l.drag.bind(l),
                          preventDefault: !1,
                          events: ["mouse", "touch"],
                        });
                    }),
                    [
                      2,
                      new Promise(function (t, e) {
                        n(l.images, s)
                          .then(function () {
                            c(), t();
                          })
                          .catch(function (t) {
                            e(t);
                          });
                      }),
                    ]
                  );
                });
              });
            }),
            (t.prototype.addZoomEvents = function (t) {
              var e = this;
              t.addEventListener("click", this.onClick.bind(this)),
                this.onScale(t, function (t, n, r) {
                  t > 0.5 &&
                    e
                      .events()
                      .pinch({
                        completed: !0,
                        currentImage: e.images[e.currentImageNumber - 1],
                        currentDegree: e.currentDegree,
                        originalEvent: r,
                        scale: t,
                        first: n,
                      });
                });
            }),
            (t.prototype.setPointer = function (t) {
              if (this.currentPointer !== t) {
                var e = this.options.cursorConfig[t];
                (this.currentPointer = t),
                  a.DomUtilities.setPointer(this.mainHolderElement, e);
              }
              var n = this.options.touchConfig[t];
              this.currentTouch !== n &&
                ((this.currentTouch = n),
                a.DomUtilities.setTouchAction(this.mainHolderElement, n));
            }),
            (t.prototype.onScale = function (t, e) {
              var n,
                r = this,
                i = !0,
                o = 0,
                a = !1;
              t.addEventListener(
                "touchmove",
                function (t) {
                  if (2 === t.targetTouches.length) {
                    var r = Math.hypot(
                      t.targetTouches[0].pageX - t.targetTouches[1].pageX,
                      t.targetTouches[0].pageY - t.targetTouches[1].pageY
                    );
                    (a = !0), e(r, i, t), void 0 === n && ((n = r), (i = !1));
                  }
                },
                { capture: !1, passive: !0 }
              ),
                t.addEventListener(
                  "touchend",
                  function (t) {
                    var e, s;
                    if (
                      ((n = void 0),
                      (i = !0),
                      (null === (e = r.zoom) || void 0 === e
                        ? void 0
                        : e.isZoomed()) && !a)
                    ) {
                      var u = new Date().getTime(),
                        c = u - o;
                      clearTimeout(void 0),
                        c < 500 &&
                          c > 0 &&
                          (null === (s = r.zoom) ||
                            void 0 === s ||
                            s.reset(r.images[r.currentImageNumber - 1])),
                        (o = u);
                    }
                    a = !1;
                  },
                  { capture: !1, passive: !0 }
                );
            }),
            (t.prototype.onClick = function (t) {
              this.events().click({
                currentDegree: this.currentDegree,
                currentImage: this.images[this.currentImageNumber - 1],
                completed: !0,
                originalEvent: t,
              });
            }),
            (t.prototype.onScroll = function (t) {
              t.preventDefault(),
                this.events().scroll({
                  currentDegree: this.currentDegree,
                  currentImage: this.images[this.currentImageNumber - 1],
                  completed: !0,
                  originalEvent: t,
                });
            }),
            (t.prototype.onDoubleClick = function (t) {
              this.events().doubleClick({
                currentDegree: this.currentDegree,
                currentImage: this.images[this.currentImageNumber - 1],
                completed: !0,
                originalEvent: t,
              });
            }),
            (t.prototype.reportError = function (t) {
              console.error("360 Javascript Viewer: " + t);
            }),
            (t.prototype.reportWarning = function (t) {
              console.warn("360 Javascript Viewer: " + t);
            }),
            (t.prototype.updateImage = function () {
              var t = this;
              this.updateInAction = !0;
              if (0 === this.desiredRotationInDegrees)
                return (
                  (this.inAnimation = !1),
                  (this.updateInAction = !1),
                  (this.desiredRotationInDegreesStartSlowingDown = null),
                  new Promise(function (e) {
                    e({ currentDegree: t.currentDegree });
                  })
                );
              var e,
                n = this.getNextImageNumber();
              if (this.options.stopAtEdges && !this.inAnimation) {
                var r = this.images.length;
                if (
                  (1 === this.previousImageNumber && n === r) ||
                  (this.previousImageNumber === r && 1 === n)
                )
                  return (
                    (this.updateInAction = !1),
                    new Promise(function (e) {
                      e({ currentDegree: t.currentDegree });
                    })
                  );
              }
              return (
                this.setCurrentImage(n),
                ((e = this.getCurrentRefreshRate()),
                new Promise(function (t) {
                  return setTimeout(t, e);
                })).then(function () {
                  return t.updateImage();
                })
              );
            }),
            (t.prototype.zoomTo = function (t, e, n) {
              var r = this;
              return new Promise(function (i, o) {
                var a, s;
                if (r.options.zoom) {
                  t > r.options.zoomMax &&
                    o(
                      "supplied zoom factor " +
                        t +
                        " higher then max zoom of " +
                        r.options.zoomMax
                    );
                  var u = r.images[r.currentImageNumber - 1];
                  null === (a = r.zoom) || void 0 === a || a.reset(u),
                    null === (s = r.zoom) || void 0 === s || s.zoom(t, e, n, u),
                    r.setPointer(t > 1 ? "zoomIn" : "zoomOut"),
                    i();
                } else o("zoom not activated");
              });
            }),
            (t.prototype.rotateDegrees = function (t) {
              return (
                (this.inAnimation = !0),
                (this.desiredRotationInDegrees = t),
                this.updateImage()
              );
            }),
            (t.prototype.resetZoom = function () {
              var t = this;
              return new Promise(function (e, n) {
                var r;
                t.options.zoom || n("zoom is not activated"),
                  null === (r = t.zoom) ||
                    void 0 === r ||
                    r.reset(t.images[t.currentImageNumber - 1]),
                  t.setPointer("default"),
                  setTimeout(function () {
                    e();
                  }, 500);
              });
            }),
            (t.prototype.isZoomedIn = function () {
              var t;
              return (
                !!this.options.zoom &&
                !!this.zoom &&
                (null === (t = this.zoom) || void 0 === t
                  ? void 0
                  : t.isZoomed())
              );
            }),
            (t.prototype.rotateToFrame = function (t, e, n) {
              void 0 === e && (e = !0), void 0 === n && (n = !0);
              var r = (360 / this.options.totalFrames) * (t - 1);
              return this.rotateToDegree(r, e, n);
            }),
            (t.prototype.rotateToDegree = function (t, e, n) {
              var r = this;
              if (
                (void 0 === e && (e = !0),
                void 0 === n && (n = !0),
                (this.inAnimation = !0),
                this.cancelCurrentActions(),
                (this.useEasing = n),
                (this.desiredRotationInDegrees = 0),
                (t = Math.round(t)),
                this.previousTargetDegree === t || t === this.currentDegree)
              )
                return (
                  (this.useEasing = !0),
                  new Promise(function (t) {
                    t({ currentDegree: r.currentDegree });
                  })
                );
              this.inAnimation = !0;
              var i =
                  t > this.currentDegree
                    ? t - this.currentDegree
                    : 360 - this.currentDegree + t,
                o =
                  t < this.currentDegree
                    ? -1 * (this.currentDegree - t)
                    : -1 * (this.currentDegree + (360 - t));
              return (
                (this.desiredRotationInDegrees = e && Math.abs(o) < i ? o : i),
                (this.previousTargetDegree = t),
                this.updateImage()
              );
            }),
            (t.prototype.cancelCurrentActions = function () {
              (this.desiredRotationInDegrees = 0),
                (this.previousTargetDegree = null),
                (this.nAutoRotations = 0);
            }),
            (t.prototype.dragEnd = function () {
              var t;
              (this.isDragged = !1),
                this.options.zoom &&
                (null === (t = this.zoom) || void 0 === t
                  ? void 0
                  : t.isZoomed())
                  ? this.setPointer("pan")
                  : this.setPointer("default");
              var e = this.options.inertia / 100;
              this.desiredRotationInDegrees +=
                -1 * e * this.desiredRotationInDegrees;
            }),
            (t.prototype.drag = function (t) {
              var e, n, r;
              if (
                this.options.zoom &&
                (null === (e = this.zoom) || void 0 === e
                  ? void 0
                  : e.isZoomed())
              ) {
                if (t.inputEvent.targetTouches)
                  if (
                    t.inputEvent.targetTouches &&
                    2 === t.inputEvent.targetTouches.length
                  )
                    if (
                      Math.hypot(
                        t.inputEvent.targetTouches[0].pageX -
                          t.inputEvent.targetTouches[1].pageX,
                        t.inputEvent.targetTouches[0].pageY -
                          t.inputEvent.targetTouches[1].pageY
                      ) < 1
                    )
                      return;
                if (Math.hypot(t.deltaX, t.deltaY) < 1) return;
                return (
                  null === (n = this.zoom) ||
                    void 0 === n ||
                    n.pan(
                      t.deltaX,
                      t.deltaY,
                      this.images[this.currentImageNumber - 1]
                    ),
                  void this.setPointer("pan")
                );
              }
              if (!(Math.abs(t.deltaY) > Math.abs(t.deltaX))) {
                if (!this.dragAllowed) return !1;
                if (
                  this.window.TouchEvent &&
                  t instanceof TouchEvent &&
                  2 === t.touches.length
                )
                  return !1;
                var i = this.getDegreesOneImage(),
                  o =
                    (t.deltaX /
                      (null === (r = this.mainHolderElement) || void 0 === r
                        ? void 0
                        : r.clientWidth)) *
                    this.getTotalFrames() *
                    i;
                return (
                  (o = (this.options.speed / 100) * o),
                  this.options.reverse || (o *= -1),
                  (this.desiredRotationInDegrees += o),
                  this.updateInAction || this.updateImage(),
                  this.setPointer("drag"),
                  this.firstDrag &&
                    (this.startDragInvocations++,
                    this.eventBus.startDragging({
                      invocations: this.startDragInvocations,
                    }),
                    (this.firstDrag = !1)),
                  this.isDragged
                );
              }
            }),
            (t.prototype.dragStart = function () {
              var t;
              this.dragAllowed &&
                ((this.options.zoom &&
                  (null === (t = this.zoom) || void 0 === t
                    ? void 0
                    : t.isZoomed())) ||
                  ((this.isDragged = !0),
                  (this.firstDrag = !0),
                  this.setPointer("drag"),
                  this.cancelCurrentActions()));
            }),
            (t.prototype.getNextImageNumber = function () {
              var e = this.images.length,
                n = this.getDegreesOneImage(),
                r = this.currentImageNumber;
              return Math.abs(this.desiredRotationInDegrees) < n
                ? (this.viewerHasNoAction() &&
                    (this.desiredRotationInDegrees = 0),
                  r)
                : ((r =
                    this.desiredRotationInDegrees > 0
                      ? t.increaseImageNumber(r, e)
                      : t.decreaseImageNumber(r, e)),
                  this.decreaseDesiredRotation(n),
                  r);
            }),
            (t.prototype.getDegreesOneImage = function () {
              var t = this.images.length;
              return Math.round(360 / t);
            }),
            (t.prototype.setCurrentDegree = function (t) {
              var e = this.getDegreesOneImage();
              this.currentDegree = 1 === t ? 0 : (t - 1) * e;
            }),
            (t.decreaseImageNumber = function (t, e) {
              return --t < 1 ? e : t;
            }),
            (t.increaseImageNumber = function (t, e) {
              return ++t > e ? 1 : t;
            }),
            (t.prototype.decreaseDesiredRotation = function (t) {
              (t = Math.abs(t)),
                this.desiredRotationInDegrees < 0
                  ? (this.desiredRotationInDegrees += t)
                  : (this.desiredRotationInDegrees -= Math.abs(t));
            }),
            (t.prototype.setCurrentImage = function (t) {
              t !== this.previousImageNumber &&
                this.isStarted &&
                (-1 !== this.previousImageNumber &&
                  a.DomUtilities.hideImage(
                    this.images[this.previousImageNumber - 1],
                    this.window
                  ),
                a.DomUtilities.showImage(this.images[t - 1], this.window),
                (this.previousImageNumber = t),
                (this.currentImageNumber = t),
                this.setCurrentDegree(t),
                this.options.enableChangeImageEvent &&
                  this.events().changeImage({
                    currentImage: this.images[t - 1],
                    currentDegree: this.currentDegree,
                    completed: !0,
                  }));
            }),
            (t.prototype.viewerHasNoAction = function () {
              return !this.isDragged;
            }),
            (t.prototype.getImages = function () {
              return r(this, void 0, void 0, function () {
                return i(this, function (t) {
                  return [
                    2,
                    o.Images.getPossibleImages(
                      this.mainHolderElement,
                      this.mainImage,
                      this.uniqueId,
                      this.eventBus,
                      this.options,
                      this.window
                    ),
                  ];
                });
              });
            }),
            (t.prototype.getTotalFrames = function () {
              if (this.options.imageUrls && this.options.imageUrls.length > 0)
                return this.options.imageUrls.length;
              var t = this.options.totalFrames;
              if (t > 0 && t <= 360) return t;
              throw new d.default(
                "totalFrames must be between 1 and 360 now " + t
              );
            }),
            (t.speedToRefreshRate = function (t) {
              return (100 - t) / 2;
            }),
            (t.prototype.getCurrentRefreshRate = function () {
              if (0 === this.desiredRotationInDegrees)
                return this.standbyRefreshRate;
              if (this.viewerHasNoAction() && this.useEasing) {
                this.desiredRotationInDegreesStartSlowingDown ||
                  (this.desiredRotationInDegreesStartSlowingDown = Math.abs(
                    this.desiredRotationInDegrees
                  ));
                var e =
                  (1 -
                    (1 -
                      Math.abs(this.desiredRotationInDegrees) /
                        this.desiredRotationInDegreesStartSlowingDown)) *
                  this.currentSpeed;
                return (
                  (e = ((100 - this.options.inertia) / 100) * e),
                  t.speedToRefreshRate(e)
                );
              }
              return t.speedToRefreshRate(this.currentSpeed);
            }),
            (t.prototype.autoRotate = function (t) {
              return r(this, void 0, void 0, function () {
                var e,
                  n = this;
                return i(this, function (o) {
                  return (
                    (this.nAutoRotations = t),
                    (e = function (e) {
                      return r(n, void 0, void 0, function () {
                        var n, r;
                        return i(this, function (i) {
                          switch (i.label) {
                            case 0:
                              (n = 0), (n = 0), (i.label = 1);
                            case 1:
                              return n < this.nAutoRotations
                                ? this.isDragged || this.nAutoRotations !== t
                                  ? (e && this.setSpeed(this.options.speed),
                                    [3, 4])
                                  : (n === t - 1 && (this.useEasing = !0),
                                    (r = this.options.autoRotateReverse
                                      ? -360
                                      : 360),
                                    [4, this.rotateDegrees(r)])
                                : [3, 4];
                            case 2:
                              i.sent(), (i.label = 3);
                            case 3:
                              return n++, [3, 1];
                            case 4:
                              return [
                                2,
                                new Promise(function (e, r) {
                                  e(n === t - 1);
                                }),
                              ];
                          }
                        });
                      });
                    }),
                    [
                      2,
                      new Promise(function (r, i) {
                        n.useEasing = !1;
                        var o = n.options.autoRotateSpeed !== n.options.speed;
                        o && n.setSpeed(n.options.autoRotateSpeed),
                          e(o)
                            .then(function () {
                              o && n.setSpeed(n.options.speed),
                                (n.useEasing = !0),
                                n.nAutoRotations === t ? r(!0) : r(!1);
                            })
                            .catch(function (t) {
                              n.reportError(t), i();
                            });
                      }),
                    ]
                  );
                });
              });
            }),
            t
          );
        })();
      e.JavascriptViewer = m;
    },
    function (t, e, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (t, e, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function a(t) {
                try {
                  u(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function s(t) {
                try {
                  u(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function u(t) {
                var e;
                t.done
                  ? i(t.value)
                  : ((e = t.value),
                    e instanceof n
                      ? e
                      : new n(function (t) {
                          t(e);
                        })).then(a, s);
              }
              u((r = r.apply(t, e || [])).next());
            });
          },
        i =
          (this && this.__generator) ||
          function (t, e) {
            var n,
              r,
              i,
              o,
              a = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function s(o) {
              return function (s) {
                return (function (o) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; a; )
                    try {
                      if (
                        ((n = 1),
                        r &&
                          (i =
                            2 & o[0]
                              ? r.return
                              : o[0]
                              ? r.throw || ((i = r.return) && i.call(r), 0)
                              : r.next) &&
                          !(i = i.call(r, o[1])).done)
                      )
                        return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return a.label++, { value: o[1], done: !1 };
                        case 5:
                          a.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((i = a.trys),
                            (i = i.length > 0 && i[i.length - 1]) ||
                              (6 !== o[0] && 2 !== o[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === o[0] &&
                            (!i || (o[1] > i[0] && o[1] < i[3]))
                          ) {
                            a.label = o[1];
                            break;
                          }
                          if (6 === o[0] && a.label < i[1]) {
                            (a.label = i[1]), (i = o);
                            break;
                          }
                          if (i && a.label < i[2]) {
                            (a.label = i[2]), a.ops.push(o);
                            break;
                          }
                          i[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      o = e.call(t, a);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      n = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, s]);
              };
            }
          };
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.Images = void 0);
      var o = n(0),
        a = n(7),
        s = n(8),
        u = n(3),
        c = (function () {
          function t() {}
          return (
            (t.getFilename = function (t, e, n) {
              if (0 === e.length) {
                var r = n.split(".").pop();
                if (void 0 === r)
                  throw new o.default(
                    "no extension found in url: " +
                      n +
                      ", cannot generate other filenames"
                  );
                var i = (t < 10 ? "0" : "") + t.toString();
                return n.replace("." + r, "_" + i + "." + r);
              }
              var a = this.getImagesPath(n),
                s = this.getImagesPath(e) || a,
                u = e.lastIndexOf("/") + 1;
              if (-1 !== (e = e.substr(u)).toLowerCase().indexOf("xxxx")) {
                if (t < 10) {
                  i = "000" + t.toString();
                  return "" + s + e.replace("xxxx", i);
                }
                if (t > 9 && t < 100) {
                  i = "00" + t.toString();
                  return "" + s + e.replace("xxxx", i);
                }
                if (t > 99) {
                  i = "0" + t.toString();
                  return "" + s + e.replace("xxxx", i);
                }
              }
              if (-1 !== e.toLowerCase().indexOf("xxx")) {
                if (t < 10) {
                  i = "00" + t.toString();
                  return "" + s + e.replace("xxx", i);
                }
                if (t > 9 && t < 100) {
                  i = "0" + t.toString();
                  return "" + s + e.replace("xxx", i);
                }
                if (t > 99) {
                  i = t.toString();
                  return "" + s + e.replace("xxx", i);
                }
              }
              if (-1 !== e.toLowerCase().indexOf("xx")) {
                i = (t < 10 ? "0" : "") + t.toString();
                return "" + s + e.replace("xx", i);
              }
              if (-1 !== e.toLowerCase().indexOf("x")) {
                i = t.toString();
                return "" + s + e.replace("x", i);
              }
              throw new o.default(
                "no placeholder x or xx found in format: " + e
              );
            }),
            (t.generateImagesUrlsFromFormat = function (t, e) {
              var n = [],
                r = e.startFrameNo,
                i = e.totalFrames,
                o = e.imageUrlFormat;
              if (0 === t.length) return n;
              for (var a = r; i > n.length; a++)
                n.push(this.getFilename(a, o, t));
              return n;
            }),
            (t.getPossibleImages = function (t, e, n, o, s, u) {
              return r(this, void 0, void 0, function () {
                var r = this;
                return i(this, function (i) {
                  return [
                    2,
                    new Promise(function (i, c) {
                      var l,
                        h,
                        d = [],
                        f = 0;
                      if (s.imageUrls && s.imageUrls.length > 0)
                        (d = s.imageUrls), (f = s.imageUrls.length);
                      else {
                        f = s.totalFrames;
                        var g = s.imageUrls || [],
                          p = s.mainImageUrl,
                          m = p.length > 0 ? p : e.src;
                        d =
                          g.length > 0
                            ? g
                            : r.generateImagesUrlsFromFormat(m, s);
                      }
                      var v = s.zoom ? s.zoomMax : 1,
                        y = t.clientWidth,
                        b = t.clientHeight,
                        w = "";
                      s.autoCDNResizer &&
                        s.zoom &&
                        (null === (l = s.autoCDNResizerConfig) || void 0 === l
                          ? void 0
                          : l.scaleWithZoomMax) &&
                        ((y *= v),
                        (b *= v),
                        (w = (
                          null === (h = s.autoCDNResizerConfig) || void 0 === h
                            ? void 0
                            : h.useWidth
                        )
                          ? "jsv-width-100"
                          : "jsv-height-100"));
                      var x = d.map(function (t, e) {
                          var r, i;
                          if (s.autoCDNResizer) {
                            var o = new URL(t);
                            (null === (r = s.autoCDNResizerConfig) ||
                            void 0 === r
                              ? void 0
                              : r.useHeight) &&
                              o.searchParams.set("height", b.toString()),
                              (null === (i = s.autoCDNResizerConfig) ||
                              void 0 === i
                                ? void 0
                                : i.useWidth) &&
                                o.searchParams.set("width", y.toString()),
                              (t = o.toString());
                          }
                          return {
                            src: t,
                            id: n + e.toString(),
                            sequence: e + 1,
                            encoded: "",
                            extraClass: s.extraImageClass + " " + w,
                          };
                        }),
                        E = 1;
                      (d = x.map(function (t) {
                        return t.src;
                      })),
                        a
                          .default(d, u, {
                            onSingleImageComplete: function (t) {
                              (x[d.indexOf(t.url)].encoded = ""),
                                (x[d.indexOf(t.url)].naturalWidth =
                                  t.naturalWidth),
                                (x[d.indexOf(t.url)].naturalHeight =
                                  t.naturalHeight),
                                o.loadImage({
                                  currentImage: E,
                                  totalImages: f,
                                  percentage: Math.round((E / f) * 100),
                                  image: x[E - 1],
                                }),
                                E++;
                            },
                            onSingleImageFail: function (t) {
                              c(new Error(t));
                            },
                          })
                          .then(function () {
                            E - 1 === d.length
                              ? i(x)
                              : c(
                                  new Error(
                                    "Not all images are loaded " +
                                      (E - 1) +
                                      " from " +
                                      d.length +
                                      ". \n                    Check the warning to see the image urls we are trying to fetch"
                                  )
                                );
                          })
                          .catch(function (t) {
                            c(t);
                          });
                    }),
                  ];
                });
              });
            }),
            (t.getMainImage = function (t, e) {
              var n = e.document.getElementById(t);
              if (n instanceof HTMLPictureElement) {
                var r = n.querySelector("img");
                if (r) {
                  var i = r.src;
                  return (
                    r.hasAttribute("data-src") &&
                      (i = r.getAttribute("data-src")),
                    { src: i, id: t, sequence: 0, extraClass: "" }
                  );
                }
              }
              if (n instanceof HTMLImageElement) {
                i = n.src;
                return (
                  n.hasAttribute("data-src") &&
                    (i = n.getAttribute("data-src")),
                  { src: i, id: t, sequence: 0, extraClass: "" }
                );
              }
              throw new o.default(
                'Could not find main image with id "' + t + '"'
              );
            }),
            (t.getMainImageFromURl = function (t) {
              return { src: t, id: "", sequence: 0, extraClass: "" };
            }),
            (t.getMainImageElement = function (t, e) {
              var n = e.document.getElementById(t);
              if (
                n instanceof HTMLImageElement ||
                n instanceof HTMLPictureElement
              )
                return n;
              throw new o.default(
                'Could not find main image with id "' + t + '"'
              );
            }),
            (t.blurMainImage = function (t, e) {
              var n = e.document.getElementById(t);
              n instanceof HTMLImageElement && (n.style.filter = "blur(5px)");
            }),
            (t.hideReadyNotification = function (t, e, n) {
              var r = "notification_" + e;
              return u.DomUtilities.addHiddenStyle(r, n, 700);
            }),
            (t.createOrGetPoweredBy = function (t, e, n, r, i) {
              var o = Math.max(Math.floor(25 * Math.random()), 5),
                a = btoa("powered_by_" + e),
                c = window.document.getElementById(a);
              if (c) return c;
              var l = n.document.createElement("div");
              l.style.top = o + "%";
              var h =
                (o = Math.max(Math.floor(15 * Math.random()), 5)) % 2 == 0;
              (l.style[h ? "left" : "right"] = o + "%"),
                (l.style.position = "absolute"),
                (l.style.display = "flex"),
                (l.style.alignItems = "right"),
                (l.style.justifyContent = "top"),
                (l.id = a),
                (l.style.zIndex = "200"),
                (l.style.width = "5%"),
                (l.style.minWidth = "30px"),
                (l.className = "jsv-hidden");
              var d = i ? "" : window.location.host;
              return (
                (l.innerHTML = s.Notifications.getPoweredBy(t, d)),
                r.appendChild(l),
                setTimeout(function () {
                  u.DomUtilities.addShowStyle(a, window, 300);
                }, 300),
                l
              );
            }),
            (t.createReadyNotification = function (t, e, n, r) {
              var i = n.document.createElement("div");
              (i.style.position = "absolute"),
                (i.style.display = "flex"),
                (i.style.alignItems = "center"),
                (i.style.justifyContent = "center"),
                (i.id = "notification_" + e),
                (i.style.zIndex = "200"),
                (i.style.top = "50%"),
                (i.style.left = "50%"),
                (i.style.height = "20%"),
                (i.style.width = "20%"),
                (i.style.pointerEvents = "none"),
                (i.style.transform = "translate(-50%, -50%)"),
                t.dragToRotate.showStartToRotateDefaultNotification &&
                  (i.innerHTML = s.Notifications.getReadyForRotate(t)),
                !t.dragToRotate.showStartToRotateDefaultNotification &&
                  t.dragToRotate.imageUrl.length > 0 &&
                  (i.innerHTML = s.Notifications.getNotificationCustomImage(t)),
                r.appendChild(i);
            }),
            (t.createProgressBar = function (t, e, n) {
              var r = e.document.createElement("div");
              (r.style.display = "flex"),
                (r.style.position = "absolute"),
                (r.style.height = "5px"),
                (r.style.width = "30%"),
                (r.style.overflow = "hidden"),
                (r.style.backgroundColor = "#e9ecef"),
                (r.style.borderRadius = "0.25rem"),
                (r.id = "loader_" + t),
                (r.style.zIndex = "200"),
                (r.style.top = "50%"),
                (r.style.left = "50%"),
                (r.style.transform = "translate(-50%, -50%)");
              var i = e.document.createElement("div");
              return (
                (i.style.backgroundColor = "#6a6d71"),
                r.appendChild(i),
                n.appendChild(r),
                r
              );
            }),
            (t.getImagesPath = function (t) {
              var e = t.replace(/^.*[\\/]/, "");
              return t.substring(0, t.length - e.length);
            }),
            t
          );
        })();
      e.Images = c;
    },
    function (t, e, n) {
      "use strict";
      var r =
          (this && this.__awaiter) ||
          function (t, e, n, r) {
            return new (n || (n = Promise))(function (i, o) {
              function a(t) {
                try {
                  u(r.next(t));
                } catch (t) {
                  o(t);
                }
              }
              function s(t) {
                try {
                  u(r.throw(t));
                } catch (t) {
                  o(t);
                }
              }
              function u(t) {
                var e;
                t.done
                  ? i(t.value)
                  : ((e = t.value),
                    e instanceof n
                      ? e
                      : new n(function (t) {
                          t(e);
                        })).then(a, s);
              }
              u((r = r.apply(t, e || [])).next());
            });
          },
        i =
          (this && this.__generator) ||
          function (t, e) {
            var n,
              r,
              i,
              o,
              a = {
                label: 0,
                sent: function () {
                  if (1 & i[0]) throw i[1];
                  return i[1];
                },
                trys: [],
                ops: [],
              };
            return (
              (o = { next: s(0), throw: s(1), return: s(2) }),
              "function" == typeof Symbol &&
                (o[Symbol.iterator] = function () {
                  return this;
                }),
              o
            );
            function s(o) {
              return function (s) {
                return (function (o) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; a; )
                    try {
                      if (
                        ((n = 1),
                        r &&
                          (i =
                            2 & o[0]
                              ? r.return
                              : o[0]
                              ? r.throw || ((i = r.return) && i.call(r), 0)
                              : r.next) &&
                          !(i = i.call(r, o[1])).done)
                      )
                        return i;
                      switch (((r = 0), i && (o = [2 & o[0], i.value]), o[0])) {
                        case 0:
                        case 1:
                          i = o;
                          break;
                        case 4:
                          return a.label++, { value: o[1], done: !1 };
                        case 5:
                          a.label++, (r = o[1]), (o = [0]);
                          continue;
                        case 7:
                          (o = a.ops.pop()), a.trys.pop();
                          continue;
                        default:
                          if (
                            !((i = a.trys),
                            (i = i.length > 0 && i[i.length - 1]) ||
                              (6 !== o[0] && 2 !== o[0]))
                          ) {
                            a = 0;
                            continue;
                          }
                          if (
                            3 === o[0] &&
                            (!i || (o[1] > i[0] && o[1] < i[3]))
                          ) {
                            a.label = o[1];
                            break;
                          }
                          if (6 === o[0] && a.label < i[1]) {
                            (a.label = i[1]), (i = o);
                            break;
                          }
                          if (i && a.label < i[2]) {
                            (a.label = i[2]), a.ops.push(o);
                            break;
                          }
                          i[2] && a.ops.pop(), a.trys.pop();
                          continue;
                      }
                      o = e.call(t, a);
                    } catch (t) {
                      (o = [6, t]), (r = 0);
                    } finally {
                      n = i = 0;
                    }
                  if (5 & o[0]) throw o[1];
                  return { value: o[0] ? o[1] : void 0, done: !0 };
                })([o, s]);
              };
            }
          },
        o =
          (this && this.__spreadArrays) ||
          function () {
            for (var t = 0, e = 0, n = arguments.length; e < n; e++)
              t += arguments[e].length;
            var r = Array(t),
              i = 0;
            for (e = 0; e < n; e++)
              for (var o = arguments[e], a = 0, s = o.length; a < s; a++, i++)
                r[i] = o[a];
            return r;
          };
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.default = function (t, e, n) {
          return r(this, void 0, void 0, function () {
            var e,
              a,
              s,
              u = this;
            return i(this, function (c) {
              return (
                (e = function (t) {
                  return r(u, void 0, void 0, function () {
                    return i(this, function (e) {
                      return [
                        2,
                        new Promise(function (e, r) {
                          var i = new Image();
                          (i.src = t),
                            (i.onload = function () {
                              i.naturalWidth < 10
                                ? r(
                                    new Error(
                                      "image (" +
                                        t +
                                        " is smaller then 10 px, probably not exist"
                                    )
                                  )
                                : (n.onSingleImageComplete({
                                    result: "",
                                    url: t,
                                    status: 200,
                                    naturalWidth: i.naturalWidth,
                                    naturalHeight: i.naturalHeight,
                                  }),
                                  e());
                            }),
                            (i.onerror = function () {
                              n.onSingleImageFail("failed loading " + t);
                            });
                        }),
                      ];
                    });
                  });
                }),
                (a = function (t, e) {
                  for (
                    var n = [], r = o(t), i = Math.ceil(r.length / e), a = 0;
                    a < i;
                    a++
                  )
                    n.push(r.splice(0, e));
                  return n;
                }),
                (s = function (t) {
                  return r(u, void 0, void 0, function () {
                    return i(this, function (n) {
                      return [2, Promise.all(t.map(e))];
                    });
                  });
                }),
                [
                  2,
                  new Promise(function (e, n) {
                    var r = a(t, 10),
                      i = function (t) {
                        var o = t.shift();
                        void 0 !== o &&
                          s(o)
                            .then(function () {
                              0 === r.length ? e() : i(t);
                            })
                            .catch(function (t) {
                              n(t);
                            });
                      };
                    i(r);
                  }),
                ]
              );
            });
          });
        });
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.Notifications = void 0);
      var r = n(9),
        i = n(1),
        o = (function () {
          function t() {}
          return (
            (t.getNotificationCustomImage = function (t) {
              return (
                '<img src="' +
                t.dragToRotate.imageUrl +
                '" class="jsv-notification" />'
              );
            }),
            (t.getReadyForRotate = function (t) {
              return (
                '<div style="display: flex; align-items: center; flex-direction: column;">\n' +
                this.getSvg(t) +
                " " +
                this.getText(t) +
                "</div>"
              );
            }),
            (t.getPoweredBy = function (t, e) {
              var n = this.getLogoSvg(),
                r =
                  atob("aHR0cHM6Ly93d3cuMzYwLWphdmFzY3JpcHR2aWV3ZXIuY29t") +
                  "?host=" +
                  e;
              return (
                '<div style="display: flex; align-items: center; flex-direction: column; width: 100%">\n                    <a title="' +
                atob("QnV5IDM2MCBKYXZhc2NyaXB0IFZpZXdlciBsaWNlbnNl") +
                '" target="_blank"  href="' +
                r +
                '" style="opacity: 0.8;">\n                     ' +
                n +
                "\n                    </a>\n                </div>"
              );
            }),
            (t.getMainColor = function (t) {
              var e = i.hexToRgb(t.dragToRotate.mainColor);
              return null === e && (e = { r: 0, g: 0, b: 0, a: 1 }), e;
            }),
            (t.getTextColor = function (t) {
              var e = i.hexToRgb(t.dragToRotate.textColor);
              return null === e && (e = { r: 0, g: 0, b: 0, a: 1 }), e;
            }),
            (t.getText = function (t) {
              var e = r.Localisation.getDragToRotate(t),
                n = this.getMainColor(t),
                i = this.getTextColor(t);
              return (
                '<div  style="text-align: center; font-size: 12px; padding:0.2em 0.5em; white-space: nowrap; color: rgba(' +
                i.r +
                ", " +
                i.g +
                ", " +
                i.b +
                ");\n background-color: rgba(" +
                n.r +
                ", " +
                n.g +
                ", " +
                n.b +
                ", " +
                n.a +
                ');  border-radius: 0.5em;">\n<span>' +
                e +
                "</span>\n</div>"
              );
            }),
            (t.getLogoSvg = function () {
              return '<div style="max-width: 0px; width: 0px;height:0px; padding: 0;"></div>';
            }),
            (t.getSvg = function (t) {
              var e = this.getMainColor(t),
                n = this.getTextColor(t),
                r = "rgba(" + e.r + ", " + e.g + ", " + e.b + ", " + e.a + ")",
                i = "rgba(" + n.r + ", " + n.g + ", " + n.b + ", " + n.a + ")";
              return (
                '<div style="max-width: 0px; width: 0px;height:0px; padding: 0;"></div>'
              );
            }),
            t
          );
        })();
      e.Notifications = o;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.Localisation = void 0);
      var r = n(10),
        i = n(11),
        o = (function () {
          function t() {}
          return (
            (t.getDragToRotate = function (t) {
              for (
                var e = r.getUserLocale(), n = 0, i = t.dragToRotate.languages;
                n < i.length;
                n++
              ) {
                var o = i[n];
                if (o.language === e) return o.text;
              }
              var a = this.getTranslation(e);
              return (
                null === a && (a = this.getTranslation("en")),
                null == a ? void 0 : a.dragToRotate
              );
            }),
            (t.getTranslation = function (t) {
              for (var e = 0, n = i.translations; e < n.length; e++) {
                if ((s = n[e]).language === t) return s;
              }
              for (
                var r = t.split("-").shift(), o = 0, a = i.translations;
                o < a.length;
                o++
              ) {
                var s;
                if ((s = a[o]).language === r) return s;
              }
              return null;
            }),
            t
          );
        })();
      e.Localisation = o;
    },
    function (t, e, n) {
      "use strict";
      n.r(e),
        n.d(e, "getUserLocales", function () {
          return o;
        }),
        n.d(e, "getUserLocale", function () {
          return a;
        });
      var r = n(2),
        i = n.n(r);
      var o = i()(function () {
        var t = [];
        return (
          "undefined" != typeof window &&
            (window.navigator.languages &&
              (t = t.concat(window.navigator.languages)),
            window.navigator.language && t.push(window.navigator.language),
            window.navigator.userLanguage &&
              t.push(window.navigator.userLanguage),
            window.navigator.browserLanguage &&
              t.push(window.navigator.browserLanguage),
            window.navigator.systemLanguage &&
              t.push(window.navigator.systemLanguage)),
          t.push("en-US"),
          (function (t) {
            return t.map(function (t) {
              if (!t || -1 === t.indexOf("-") || t.toLowerCase() !== t)
                return t;
              var e = t.split("-");
              return "".concat(e[0], "-").concat(e[1].toUpperCase());
            });
          })(
            t.filter(function (t, e, n) {
              return n.indexOf(t) === e;
            })
          )
        );
      });
      var a = i()(function () {
        return o()[0];
      });
      e.default = a;
    },
    function (t) {
      t.exports = JSON.parse(
        '{"translations":[{"language":"en","dragToRotate":"Drag To Rotate"},{"language":"nl","dragToRotate":"Sleep Voor Roteren"},{"language":"es","dragToRotate":"arrastrar para rotar"},{"language":"ru","dragToRotate":"перетащите, чтобы повернуть"},{"language":"fr","dragToRotate":"faire glisser pour faire pivoter"},{"language":"ch","dragToRotate":"拖动旋转"},{"language":"it","dragToRotate":"trascina per ruotare"},{"language":"de","dragToRotate":"zum Drehen ziehen"},{"language":"ko","dragToRotate":"드래그하여 회전"},{"language":"pt","dragToRotate":"arraste para girar"}]}'
      );
    },
    function (t, e, n) {
      var r = n(13);
      t.exports = function (t) {
        var e, n, i, o;
        if ((e = /^((?:rgb|hs[lv]|cmyk|xyz|lab)a?)\s*\(([^\)]*)\)/.exec(t))) {
          var a = e[1],
            s = "cmyk" === (u = a.replace(/a$/, "")) ? 4 : 3;
          (n = r[u]),
            (i = e[2]
              .replace(/^\s+|\s+$/g, "")
              .split(/\s*,\s*/)
              .map(function (t, e) {
                return /%$/.test(t) && e === s
                  ? parseFloat(t) / 100
                  : (/%$/.test(t), parseFloat(t));
              })),
            a === u && i.push(1),
            (o = void 0 === i[s] ? 1 : i[s]),
            (i = i.slice(0, s)),
            (n[u] = function () {
              return i;
            });
        } else if (/^#[A-Fa-f0-9]+$/.test(t)) {
          var u;
          s = (u = t.replace(/^#/, "")).length;
          (n = r.rgb),
            (i = (i = u.split(3 === s ? /(.)/ : /(..)/))
              .filter(Boolean)
              .map(function (t) {
                return 3 === s ? parseInt(t + t, 16) : parseInt(t, 16);
              })),
            (o = 1),
            (n.rgb = function () {
              return i;
            }),
            i[0] || (i[0] = 0),
            i[1] || (i[1] = 0),
            i[2] || (i[2] = 0);
        } else
          ((n = r.keyword).keyword = function () {
            return t;
          }),
            (i = t),
            (o = 1);
        var c = {
          rgb: void 0,
          hsl: void 0,
          hsv: void 0,
          cmyk: void 0,
          keyword: void 0,
          hex: void 0,
        };
        try {
          c.rgb = n.rgb(i);
        } catch (t) {}
        try {
          c.hsl = n.hsl(i);
        } catch (t) {}
        try {
          c.hsv = n.hsv(i);
        } catch (t) {}
        try {
          c.cmyk = n.cmyk(i);
        } catch (t) {}
        try {
          c.keyword = n.keyword(i);
        } catch (t) {}
        return (
          c.rgb &&
            (c.hex =
              "#" +
              c.rgb
                .map(function (t) {
                  var e = t.toString(16);
                  return 1 === e.length ? "0" + e : e;
                })
                .join("")),
          c.rgb && (c.rgba = c.rgb.concat(o)),
          c.hsl && (c.hsla = c.hsl.concat(o)),
          c.hsv && (c.hsva = c.hsv.concat(o)),
          c.cmyk && (c.cmyka = c.cmyk.concat(o)),
          c
        );
      };
    },
    function (t, e, n) {
      var r = n(14),
        i = function () {
          return new c();
        };
      for (var o in r) {
        i[o + "Raw"] = (function (t) {
          return function (e) {
            return (
              "number" == typeof e &&
                (e = Array.prototype.slice.call(arguments)),
              r[t](e)
            );
          };
        })(o);
        var a = /(\w+)2(\w+)/.exec(o),
          s = a[1],
          u = a[2];
        (i[s] = i[s] || {})[u] = i[o] = (function (t) {
          return function (e) {
            "number" == typeof e && (e = Array.prototype.slice.call(arguments));
            var n = r[t](e);
            if ("string" == typeof n || void 0 === n) return n;
            for (var i = 0; i < n.length; i++) n[i] = Math.round(n[i]);
            return n;
          };
        })(o);
      }
      var c = function () {
        this.convs = {};
      };
      (c.prototype.routeSpace = function (t, e) {
        var n = e[0];
        return void 0 === n
          ? this.getValues(t)
          : ("number" == typeof n && (n = Array.prototype.slice.call(e)),
            this.setValues(t, n));
      }),
        (c.prototype.setValues = function (t, e) {
          return (this.space = t), (this.convs = {}), (this.convs[t] = e), this;
        }),
        (c.prototype.getValues = function (t) {
          var e = this.convs[t];
          if (!e) {
            var n = this.space,
              r = this.convs[n];
            (e = i[n][t](r)), (this.convs[t] = e);
          }
          return e;
        }),
        ["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function (t) {
          c.prototype[t] = function (e) {
            return this.routeSpace(t, arguments);
          };
        }),
        (t.exports = i);
    },
    function (t, e) {
      function n(t) {
        var e,
          n,
          r = t[0] / 255,
          i = t[1] / 255,
          o = t[2] / 255,
          a = Math.min(r, i, o),
          s = Math.max(r, i, o),
          u = s - a;
        return (
          s == a
            ? (e = 0)
            : r == s
            ? (e = (i - o) / u)
            : i == s
            ? (e = 2 + (o - r) / u)
            : o == s && (e = 4 + (r - i) / u),
          (e = Math.min(60 * e, 360)) < 0 && (e += 360),
          (n = (a + s) / 2),
          [
            e,
            100 * (s == a ? 0 : n <= 0.5 ? u / (s + a) : u / (2 - s - a)),
            100 * n,
          ]
        );
      }
      function i(t) {
        var e,
          n,
          r = t[0],
          i = t[1],
          o = t[2],
          a = Math.min(r, i, o),
          s = Math.max(r, i, o),
          u = s - a;
        return (
          (n = 0 == s ? 0 : ((u / s) * 1e3) / 10),
          s == a
            ? (e = 0)
            : r == s
            ? (e = (i - o) / u)
            : i == s
            ? (e = 2 + (o - r) / u)
            : o == s && (e = 4 + (r - i) / u),
          (e = Math.min(60 * e, 360)) < 0 && (e += 360),
          [e, n, ((s / 255) * 1e3) / 10]
        );
      }
      function o(t) {
        var e = t[0],
          r = t[1],
          i = t[2];
        return [
          n(t)[0],
          100 * ((1 / 255) * Math.min(e, Math.min(r, i))),
          100 * (i = 1 - (1 / 255) * Math.max(e, Math.max(r, i))),
        ];
      }
      function a(t) {
        var e,
          n = t[0] / 255,
          r = t[1] / 255,
          i = t[2] / 255;
        return [
          100 * ((1 - n - (e = Math.min(1 - n, 1 - r, 1 - i))) / (1 - e) || 0),
          100 * ((1 - r - e) / (1 - e) || 0),
          100 * ((1 - i - e) / (1 - e) || 0),
          100 * e,
        ];
      }
      function s(t) {
        return I[JSON.stringify(t)];
      }
      function u(t) {
        var e = t[0] / 255,
          n = t[1] / 255,
          r = t[2] / 255;
        return [
          100 *
            (0.4124 *
              (e =
                e > 0.04045 ? Math.pow((e + 0.055) / 1.055, 2.4) : e / 12.92) +
              0.3576 *
                (n =
                  n > 0.04045
                    ? Math.pow((n + 0.055) / 1.055, 2.4)
                    : n / 12.92) +
              0.1805 *
                (r =
                  r > 0.04045
                    ? Math.pow((r + 0.055) / 1.055, 2.4)
                    : r / 12.92)),
          100 * (0.2126 * e + 0.7152 * n + 0.0722 * r),
          100 * (0.0193 * e + 0.1192 * n + 0.9505 * r),
        ];
      }
      function c(t) {
        var e = u(t),
          n = e[0],
          r = e[1],
          i = e[2];
        return (
          (r /= 100),
          (i /= 108.883),
          (n =
            (n /= 95.047) > 0.008856
              ? Math.pow(n, 1 / 3)
              : 7.787 * n + 16 / 116),
          [
            116 *
              (r = r > 0.008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116) -
              16,
            500 * (n - r),
            200 *
              (r -
                (i = i > 0.008856 ? Math.pow(i, 1 / 3) : 7.787 * i + 16 / 116)),
          ]
        );
      }
      function l(t) {
        var e,
          n,
          r,
          i,
          o,
          a = t[0] / 360,
          s = t[1] / 100,
          u = t[2] / 100;
        if (0 == s) return [(o = 255 * u), o, o];
        (e = 2 * u - (n = u < 0.5 ? u * (1 + s) : u + s - u * s)),
          (i = [0, 0, 0]);
        for (var c = 0; c < 3; c++)
          (r = a + (1 / 3) * -(c - 1)) < 0 && r++,
            r > 1 && r--,
            (o =
              6 * r < 1
                ? e + 6 * (n - e) * r
                : 2 * r < 1
                ? n
                : 3 * r < 2
                ? e + (n - e) * (2 / 3 - r) * 6
                : e),
            (i[c] = 255 * o);
        return i;
      }
      function h(t) {
        var e = t[0] / 60,
          n = t[1] / 100,
          r = t[2] / 100,
          i = Math.floor(e) % 6,
          o = e - Math.floor(e),
          a = 255 * r * (1 - n),
          s = 255 * r * (1 - n * o),
          u = 255 * r * (1 - n * (1 - o));
        r *= 255;
        switch (i) {
          case 0:
            return [r, u, a];
          case 1:
            return [s, r, a];
          case 2:
            return [a, r, u];
          case 3:
            return [a, s, r];
          case 4:
            return [u, a, r];
          case 5:
            return [r, a, s];
        }
      }
      function d(t) {
        var e,
          n,
          i,
          o,
          a = t[0] / 360,
          s = t[1] / 100,
          u = t[2] / 100,
          c = s + u;
        switch (
          (c > 1 && ((s /= c), (u /= c)),
          (i = 6 * a - (e = Math.floor(6 * a))),
          0 != (1 & e) && (i = 1 - i),
          (o = s + i * ((n = 1 - u) - s)),
          e)
        ) {
          default:
          case 6:
          case 0:
            (r = n), (g = o), (b = s);
            break;
          case 1:
            (r = o), (g = n), (b = s);
            break;
          case 2:
            (r = s), (g = n), (b = o);
            break;
          case 3:
            (r = s), (g = o), (b = n);
            break;
          case 4:
            (r = o), (g = s), (b = n);
            break;
          case 5:
            (r = n), (g = s), (b = o);
        }
        return [255 * r, 255 * g, 255 * b];
      }
      function f(t) {
        var e = t[0] / 100,
          n = t[1] / 100,
          r = t[2] / 100,
          i = t[3] / 100;
        return [
          255 * (1 - Math.min(1, e * (1 - i) + i)),
          255 * (1 - Math.min(1, n * (1 - i) + i)),
          255 * (1 - Math.min(1, r * (1 - i) + i)),
        ];
      }
      function p(t) {
        var e,
          n,
          r,
          i = t[0] / 100,
          o = t[1] / 100,
          a = t[2] / 100;
        return (
          (n = -0.9689 * i + 1.8758 * o + 0.0415 * a),
          (r = 0.0557 * i + -0.204 * o + 1.057 * a),
          (e =
            (e = 3.2406 * i + -1.5372 * o + -0.4986 * a) > 0.0031308
              ? 1.055 * Math.pow(e, 1 / 2.4) - 0.055
              : (e *= 12.92)),
          (n =
            n > 0.0031308
              ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055
              : (n *= 12.92)),
          (r =
            r > 0.0031308
              ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055
              : (r *= 12.92)),
          [
            255 * (e = Math.min(Math.max(0, e), 1)),
            255 * (n = Math.min(Math.max(0, n), 1)),
            255 * (r = Math.min(Math.max(0, r), 1)),
          ]
        );
      }
      function m(t) {
        var e = t[0],
          n = t[1],
          r = t[2];
        return (
          (n /= 100),
          (r /= 108.883),
          (e =
            (e /= 95.047) > 0.008856
              ? Math.pow(e, 1 / 3)
              : 7.787 * e + 16 / 116),
          [
            116 *
              (n = n > 0.008856 ? Math.pow(n, 1 / 3) : 7.787 * n + 16 / 116) -
              16,
            500 * (e - n),
            200 *
              (n -
                (r = r > 0.008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116)),
          ]
        );
      }
      function v(t) {
        var e,
          n,
          r,
          i,
          o = t[0],
          a = t[1],
          s = t[2];
        return (
          o <= 8
            ? (i = ((n = (100 * o) / 903.3) / 100) * 7.787 + 16 / 116)
            : ((n = 100 * Math.pow((o + 16) / 116, 3)),
              (i = Math.pow(n / 100, 1 / 3))),
          [
            (e =
              e / 95.047 <= 0.008856
                ? (e = (95.047 * (a / 500 + i - 16 / 116)) / 7.787)
                : 95.047 * Math.pow(a / 500 + i, 3)),
            n,
            (r =
              r / 108.883 <= 0.008859
                ? (r = (108.883 * (i - s / 200 - 16 / 116)) / 7.787)
                : 108.883 * Math.pow(i - s / 200, 3)),
          ]
        );
      }
      function y(t) {
        var e,
          n = t[0],
          r = t[1],
          i = t[2];
        return (
          (e = (360 * Math.atan2(i, r)) / 2 / Math.PI) < 0 && (e += 360),
          [n, Math.sqrt(r * r + i * i), e]
        );
      }
      function w(t) {
        return p(v(t));
      }
      function x(t) {
        var e,
          n = t[0],
          r = t[1];
        return (
          (e = (t[2] / 360) * 2 * Math.PI),
          [n, r * Math.cos(e), r * Math.sin(e)]
        );
      }
      function E(t) {
        return R[t];
      }
      t.exports = {
        rgb2hsl: n,
        rgb2hsv: i,
        rgb2hwb: o,
        rgb2cmyk: a,
        rgb2keyword: s,
        rgb2xyz: u,
        rgb2lab: c,
        rgb2lch: function (t) {
          return y(c(t));
        },
        hsl2rgb: l,
        hsl2hsv: function (t) {
          var e = t[0],
            n = t[1] / 100,
            r = t[2] / 100;
          if (0 === r) return [0, 0, 0];
          return [
            e,
            100 * ((2 * (n *= (r *= 2) <= 1 ? r : 2 - r)) / (r + n)),
            100 * ((r + n) / 2),
          ];
        },
        hsl2hwb: function (t) {
          return o(l(t));
        },
        hsl2cmyk: function (t) {
          return a(l(t));
        },
        hsl2keyword: function (t) {
          return s(l(t));
        },
        hsv2rgb: h,
        hsv2hsl: function (t) {
          var e,
            n,
            r = t[0],
            i = t[1] / 100,
            o = t[2] / 100;
          return (
            (e = i * o),
            [
              r,
              100 * (e = (e /= (n = (2 - i) * o) <= 1 ? n : 2 - n) || 0),
              100 * (n /= 2),
            ]
          );
        },
        hsv2hwb: function (t) {
          return o(h(t));
        },
        hsv2cmyk: function (t) {
          return a(h(t));
        },
        hsv2keyword: function (t) {
          return s(h(t));
        },
        hwb2rgb: d,
        hwb2hsl: function (t) {
          return n(d(t));
        },
        hwb2hsv: function (t) {
          return i(d(t));
        },
        hwb2cmyk: function (t) {
          return a(d(t));
        },
        hwb2keyword: function (t) {
          return s(d(t));
        },
        cmyk2rgb: f,
        cmyk2hsl: function (t) {
          return n(f(t));
        },
        cmyk2hsv: function (t) {
          return i(f(t));
        },
        cmyk2hwb: function (t) {
          return o(f(t));
        },
        cmyk2keyword: function (t) {
          return s(f(t));
        },
        keyword2rgb: E,
        keyword2hsl: function (t) {
          return n(E(t));
        },
        keyword2hsv: function (t) {
          return i(E(t));
        },
        keyword2hwb: function (t) {
          return o(E(t));
        },
        keyword2cmyk: function (t) {
          return a(E(t));
        },
        keyword2lab: function (t) {
          return c(E(t));
        },
        keyword2xyz: function (t) {
          return u(E(t));
        },
        xyz2rgb: p,
        xyz2lab: m,
        xyz2lch: function (t) {
          return y(m(t));
        },
        lab2xyz: v,
        lab2rgb: w,
        lab2lch: y,
        lch2lab: x,
        lch2xyz: function (t) {
          return v(x(t));
        },
        lch2rgb: function (t) {
          return w(x(t));
        },
      };
      var R = {
          aliceblue: [240, 248, 255],
          antiquewhite: [250, 235, 215],
          aqua: [0, 255, 255],
          aquamarine: [127, 255, 212],
          azure: [240, 255, 255],
          beige: [245, 245, 220],
          bisque: [255, 228, 196],
          black: [0, 0, 0],
          blanchedalmond: [255, 235, 205],
          blue: [0, 0, 255],
          blueviolet: [138, 43, 226],
          brown: [165, 42, 42],
          burlywood: [222, 184, 135],
          cadetblue: [95, 158, 160],
          chartreuse: [127, 255, 0],
          chocolate: [210, 105, 30],
          coral: [255, 127, 80],
          cornflowerblue: [100, 149, 237],
          cornsilk: [255, 248, 220],
          crimson: [220, 20, 60],
          cyan: [0, 255, 255],
          darkblue: [0, 0, 139],
          darkcyan: [0, 139, 139],
          darkgoldenrod: [184, 134, 11],
          darkgray: [169, 169, 169],
          darkgreen: [0, 100, 0],
          darkgrey: [169, 169, 169],
          darkkhaki: [189, 183, 107],
          darkmagenta: [139, 0, 139],
          darkolivegreen: [85, 107, 47],
          darkorange: [255, 140, 0],
          darkorchid: [153, 50, 204],
          darkred: [139, 0, 0],
          darksalmon: [233, 150, 122],
          darkseagreen: [143, 188, 143],
          darkslateblue: [72, 61, 139],
          darkslategray: [47, 79, 79],
          darkslategrey: [47, 79, 79],
          darkturquoise: [0, 206, 209],
          darkviolet: [148, 0, 211],
          deeppink: [255, 20, 147],
          deepskyblue: [0, 191, 255],
          dimgray: [105, 105, 105],
          dimgrey: [105, 105, 105],
          dodgerblue: [30, 144, 255],
          firebrick: [178, 34, 34],
          floralwhite: [255, 250, 240],
          forestgreen: [34, 139, 34],
          fuchsia: [255, 0, 255],
          gainsboro: [220, 220, 220],
          ghostwhite: [248, 248, 255],
          gold: [255, 215, 0],
          goldenrod: [218, 165, 32],
          gray: [128, 128, 128],
          green: [0, 128, 0],
          greenyellow: [173, 255, 47],
          grey: [128, 128, 128],
          honeydew: [240, 255, 240],
          hotpink: [255, 105, 180],
          indianred: [205, 92, 92],
          indigo: [75, 0, 130],
          ivory: [255, 255, 240],
          khaki: [240, 230, 140],
          lavender: [230, 230, 250],
          lavenderblush: [255, 240, 245],
          lawngreen: [124, 252, 0],
          lemonchiffon: [255, 250, 205],
          lightblue: [173, 216, 230],
          lightcoral: [240, 128, 128],
          lightcyan: [224, 255, 255],
          lightgoldenrodyellow: [250, 250, 210],
          lightgray: [211, 211, 211],
          lightgreen: [144, 238, 144],
          lightgrey: [211, 211, 211],
          lightpink: [255, 182, 193],
          lightsalmon: [255, 160, 122],
          lightseagreen: [32, 178, 170],
          lightskyblue: [135, 206, 250],
          lightslategray: [119, 136, 153],
          lightslategrey: [119, 136, 153],
          lightsteelblue: [176, 196, 222],
          lightyellow: [255, 255, 224],
          lime: [0, 255, 0],
          limegreen: [50, 205, 50],
          linen: [250, 240, 230],
          magenta: [255, 0, 255],
          maroon: [128, 0, 0],
          mediumaquamarine: [102, 205, 170],
          mediumblue: [0, 0, 205],
          mediumorchid: [186, 85, 211],
          mediumpurple: [147, 112, 219],
          mediumseagreen: [60, 179, 113],
          mediumslateblue: [123, 104, 238],
          mediumspringgreen: [0, 250, 154],
          mediumturquoise: [72, 209, 204],
          mediumvioletred: [199, 21, 133],
          midnightblue: [25, 25, 112],
          mintcream: [245, 255, 250],
          mistyrose: [255, 228, 225],
          moccasin: [255, 228, 181],
          navajowhite: [255, 222, 173],
          navy: [0, 0, 128],
          oldlace: [253, 245, 230],
          olive: [128, 128, 0],
          olivedrab: [107, 142, 35],
          orange: [255, 165, 0],
          orangered: [255, 69, 0],
          orchid: [218, 112, 214],
          palegoldenrod: [238, 232, 170],
          palegreen: [152, 251, 152],
          paleturquoise: [175, 238, 238],
          palevioletred: [219, 112, 147],
          papayawhip: [255, 239, 213],
          peachpuff: [255, 218, 185],
          peru: [205, 133, 63],
          pink: [255, 192, 203],
          plum: [221, 160, 221],
          powderblue: [176, 224, 230],
          purple: [128, 0, 128],
          rebeccapurple: [102, 51, 153],
          red: [255, 0, 0],
          rosybrown: [188, 143, 143],
          royalblue: [65, 105, 225],
          saddlebrown: [139, 69, 19],
          salmon: [250, 128, 114],
          sandybrown: [244, 164, 96],
          seagreen: [46, 139, 87],
          seashell: [255, 245, 238],
          sienna: [160, 82, 45],
          silver: [192, 192, 192],
          skyblue: [135, 206, 235],
          slateblue: [106, 90, 205],
          slategray: [112, 128, 144],
          slategrey: [112, 128, 144],
          snow: [255, 250, 250],
          springgreen: [0, 255, 127],
          steelblue: [70, 130, 180],
          tan: [210, 180, 140],
          teal: [0, 128, 128],
          thistle: [216, 191, 216],
          tomato: [255, 99, 71],
          turquoise: [64, 224, 208],
          violet: [238, 130, 238],
          wheat: [245, 222, 179],
          white: [255, 255, 255],
          whitesmoke: [245, 245, 245],
          yellow: [255, 255, 0],
          yellowgreen: [154, 205, 50],
        },
        I = {};
      for (var _ in R) I[JSON.stringify(R[_])] = _;
    },
    function (t, e, n) {
      "use strict";
      var r =
          (this && this.__assign) ||
          function () {
            return (r =
              Object.assign ||
              function (t) {
                for (var e, n = 1, r = arguments.length; n < r; n++)
                  for (var i in (e = arguments[n]))
                    Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
                return t;
              }).apply(this, arguments);
          },
        i =
          (this && this.__spreadArrays) ||
          function () {
            for (var t = 0, e = 0, n = arguments.length; e < n; e++)
              t += arguments[e].length;
            var r = Array(t),
              i = 0;
            for (e = 0; e < n; e++)
              for (var o = arguments[e], a = 0, s = o.length; a < s; a++, i++)
                r[i] = o[a];
            return r;
          };
      Object.defineProperty(e, "__esModule", { value: !0 });
      var o = n(1),
        a = ["textarea", "input"],
        s = (function () {
          function t(t, e) {
            var n = this;
            (this.dragStarted = !1),
              (this.pinchFlag = !1),
              (this.datas = {}),
              (this.isDrag = !1),
              (this.isPinch = !1),
              (this.isMouse = !1),
              (this.isTouch = !1),
              (this.prevClients = []),
              (this.startClients = []),
              (this.movement = 0),
              (this.startPinchClients = []),
              (this.startDistance = 0),
              (this.customDist = [0, 0]),
              (this.targets = []),
              (this.prevTime = 0),
              (this.isDouble = !1),
              (this.startRotate = 0),
              (this.onDragStart = function (t, e) {
                if (
                  (void 0 === e && (e = !0),
                  t.stopPropagation(),
                  n.dragStarted || t.cancelable)
                ) {
                  var i = n.options,
                    s = i.container,
                    u = i.pinchOutside,
                    c = i.dragstart,
                    l = i.preventRightClick,
                    h = i.preventDefault,
                    d = i.checkInput;
                  t instanceof MouseEvent && t.preventDefault();
                  var f = n.isTouch;
                  if (!n.dragStarted) {
                    var g = document.activeElement,
                      p = t.target,
                      m = p.tagName.toLowerCase(),
                      v = a.indexOf(m) > -1,
                      y = p.isContentEditable;
                    if (v || y) {
                      if (d || g === p) return !1;
                      if (g && y && g.isContentEditable && g.contains(p))
                        return !1;
                    } else if ((h || "touchstart" === t.type) && g) {
                      var b = g.tagName;
                      (g.isContentEditable || a.indexOf(b) > -1) && g.blur();
                    }
                  }
                  var w = 0;
                  if (
                    (!n.dragStarted &&
                      f &&
                      u &&
                      (w = setTimeout(function () {
                        o.addEvent(s, "touchstart", n.onDragStart, {
                          passive: !1,
                        });
                      })),
                    n.dragStarted &&
                      f &&
                      u &&
                      o.removeEvent(s, "touchstart", n.onDragStart),
                    f && o.isMultiTouch(t))
                  ) {
                    if (
                      (clearTimeout(w),
                      !n.dragStarted &&
                        t.touches.length !== t.changedTouches.length)
                    )
                      return;
                    n.pinchFlag || n.onPinchStart(t);
                  }
                  if (!n.dragStarted) {
                    var x = n.startClients[0]
                      ? n.startClients
                      : o.getPositionEvent(t);
                    (n.customDist = [0, 0]),
                      (n.dragStarted = !0),
                      (n.isDrag = !1),
                      (n.startClients = x),
                      (n.prevClients = x),
                      (n.datas = {}),
                      (n.movement = 0);
                    var E = o.getPosition(
                      x[0],
                      n.prevClients[0],
                      n.startClients[0]
                    );
                    if (
                      t instanceof MouseEvent &&
                      l &&
                      (3 === t.which || 2 === t.button)
                    )
                      return clearTimeout(w), n.initDrag(), !1;
                    !1 ===
                      (c &&
                        c(
                          r(
                            {
                              type: "dragstart",
                              datas: n.datas,
                              inputEvent: t,
                              isTrusted: e,
                            },
                            E
                          )
                        )) && (clearTimeout(w), n.initDrag()),
                      (n.isDouble = o.now() - n.prevTime < 200),
                      n.dragStarted && h && t.preventDefault();
                  }
                }
              }),
              (this.onDrag = function (t, e) {
                if (
                  (t.stopPropagation(),
                  !(t instanceof MouseEvent && 0 === t.buttons) &&
                    (!n.dragStarted &&
                      1 === t.buttons &&
                      t instanceof MouseEvent &&
                      n.onDragStart(t),
                    n.dragStarted))
                ) {
                  var i = o.getPositionEvent(t);
                  n.pinchFlag && n.onPinch(t, i);
                  var a = n.move([0, 0], t, i);
                  if (a && (a.deltaX || a.deltaY)) {
                    var s = n.options.drag;
                    s && s(r(r({}, a), { isScroll: !!e, inputEvent: t }));
                  }
                }
              }),
              (this.onDragEnd = function (t) {
                if ((t.stopPropagation(), n.dragStarted)) {
                  n.dragStarted = !1;
                  var e = n.options,
                    i = e.dragend,
                    a = e.pinchOutside,
                    s = e.container;
                  n.isTouch &&
                    a &&
                    o.removeEvent(s, "touchstart", n.onDragStart),
                    n.pinchFlag && n.onPinchEnd(t);
                  var u = n.prevClients,
                    c = n.startClients,
                    l = n.pinchFlag
                      ? o.getPinchDragPosition(u, u, c, n.startPinchClients)
                      : o.getPosition(u[0], u[0], c[0]),
                    h = o.now(),
                    d = !n.isDrag && n.isDouble;
                  (n.prevTime = n.isDrag || d ? 0 : h),
                    (n.startClients = []),
                    (n.prevClients = []),
                    i &&
                      i(
                        r(
                          {
                            type: "dragend",
                            datas: n.datas,
                            isDouble: d,
                            isDrag: n.isDrag,
                            inputEvent: t,
                          },
                          l
                        )
                      );
                }
              }),
              (this.options = r(
                {
                  checkInput: !1,
                  container:
                    t.length > 1
                      ? "undefined" != typeof window
                        ? window
                        : new HTMLDivElement()
                      : t[0],
                  preventRightClick: !0,
                  preventDefault: !0,
                  pinchThreshold: 0,
                },
                e
              ));
            var i = this.options,
              s = i.container,
              u = i.events;
            if (
              ((this.isTouch = u.indexOf("touch") > -1),
              (this.isMouse = u.indexOf("mouse") > -1),
              (this.customDist = [0, 0]),
              (this.targets = t),
              this.isMouse &&
                (o.addEvent(s, "mousedown", this.onDragStart, { capture: !0 }),
                o.addEvent(s, "mousemove", this.onDrag, { capture: !0 }),
                o.addEvent(s, "mouseleave", this.onDragEnd, { capture: !1 }),
                o.addEvent(s, "mouseup", this.onDragEnd, { capture: !1 }),
                o.addEvent(s, "contextmenu", this.onDragEnd, { capture: !1 })),
              this.isTouch)
            ) {
              var c = { passive: !1 };
              t.forEach(function (t) {
                o.addEvent(t, "touchstart", n.onDragStart, c);
              }),
                o.addEvent(s, "touchmove", this.onDrag, { passive: !0 }),
                o.addEvent(s, "touchend", this.onDragEnd, c),
                o.addEvent(s, "touchcancel", this.onDragEnd, c);
            }
          }
          return (
            (t.prototype.move = function (t, e, n) {
              var i = t[0],
                a = t[1];
              void 0 === n && (n = this.prevClients), e.stopPropagation();
              var s = this.customDist,
                u = this.prevClients,
                c = this.startClients,
                l = this.pinchFlag
                  ? o.getPinchDragPosition(n, u, c, this.startPinchClients)
                  : o.getPosition(n[0], u[0], c[0]);
              (s[0] += i), (s[1] += a), (l.deltaX += i), (l.deltaY += a);
              var h = l.deltaX,
                d = l.deltaY;
              return (
                (l.distX += s[0]),
                (l.distY += s[1]),
                (this.movement += Math.sqrt(h * h + d * d)),
                (this.prevClients = n),
                (this.isDrag = !0),
                r(r({ type: "drag", datas: this.datas }, l), {
                  movement: this.movement,
                  isDrag: this.isDrag,
                  isPinch: this.isPinch,
                  isScroll: !1,
                  inputEvent: e,
                })
              );
            }),
            (t.prototype.onPinchStart = function (t) {
              var e, n;
              t.stopPropagation();
              var a = this.options,
                s = a.pinchstart,
                u = a.pinchThreshold;
              if (!(this.isDrag && this.movement > u)) {
                var c = o.getClients(t.changedTouches);
                if (
                  ((this.pinchFlag = !0),
                  (e = this.startClients).push.apply(e, c),
                  (n = this.prevClients).push.apply(n, c),
                  (this.startDistance = o.getDist(this.prevClients)),
                  (this.startPinchClients = i(this.prevClients)),
                  s)
                ) {
                  var l = this.prevClients,
                    h = o.getAverageClient(l),
                    d = o.getPosition(h, h, h);
                  (this.startRotate = o.getRotation(l)),
                    s(
                      r(
                        r(
                          {
                            type: "pinchstart",
                            datas: this.datas,
                            angle: this.startRotate,
                            touches: o.getPositions(l, l, l),
                          },
                          d
                        ),
                        { inputEvent: t }
                      )
                    );
                }
              }
            }),
            (t.prototype.onPinch = function (t, e) {
              if (this.dragStarted && this.pinchFlag && !(e.length < 2)) {
                this.isPinch = !0;
                var n = this.options.pinch;
                if (n) {
                  var i = this.prevClients,
                    a = this.startClients,
                    s = o.getPosition(
                      o.getAverageClient(e),
                      o.getAverageClient(i),
                      o.getAverageClient(a)
                    ),
                    u = o.getRotation(e),
                    c = o.getDist(e);
                  n(
                    r(
                      r(
                        {
                          type: "pinch",
                          datas: this.datas,
                          movement: this.movement,
                          angle: u,
                          rotation: u - this.startRotate,
                          touches: o.getPositions(e, i, a),
                          scale: c / this.startDistance,
                          distance: c,
                        },
                        s
                      ),
                      { inputEvent: t }
                    )
                  );
                }
              }
            }),
            (t.prototype.onPinchEnd = function (t) {
              if (this.dragStarted && this.pinchFlag) {
                var e = this.isPinch;
                (this.isPinch = !1), (this.pinchFlag = !1);
                var n = this.options.pinchend;
                if (n) {
                  var i = this.prevClients,
                    a = this.startClients,
                    s = o.getPosition(
                      o.getAverageClient(i),
                      o.getAverageClient(i),
                      o.getAverageClient(a)
                    );
                  n(
                    r(
                      r(
                        {
                          type: "pinchend",
                          datas: this.datas,
                          isPinch: e,
                          touches: o.getPositions(i, i, a),
                        },
                        s
                      ),
                      { inputEvent: t }
                    )
                  ),
                    (this.isPinch = !1),
                    (this.pinchFlag = !1);
                }
              }
            }),
            (t.prototype.triggerDragStart = function (t) {
              this.onDragStart(t, !1);
            }),
            (t.prototype.unset = function () {
              var t = this,
                e = this.targets,
                n = this.options.container;
              this.isMouse &&
                (e.forEach(function (e) {
                  o.removeEvent(e, "mousedown", t.onDragStart);
                }),
                o.removeEvent(n, "mousemove", this.onDrag),
                o.removeEvent(n, "mouseup", this.onDragEnd),
                o.removeEvent(n, "contextmenu", this.onDragEnd)),
                this.isTouch &&
                  (e.forEach(function (e) {
                    o.removeEvent(e, "touchstart", t.onDragStart);
                  }),
                  o.removeEvent(n, "touchstart", this.onDragStart),
                  o.removeEvent(n, "touchmove", this.onDrag),
                  o.removeEvent(n, "touchend", this.onDragEnd),
                  o.removeEvent(n, "touchcancel", this.onDragEnd));
            }),
            (t.prototype.initDrag = function () {
              (this.startClients = []),
                (this.prevClients = []),
                (this.dragStarted = !1);
            }),
            t
          );
        })();
      e.default = s;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = n(4),
        i = {
          loadImage: r.slot(),
          started: r.slot(),
          startDragging: r.slot(),
          changeImage: r.slot(),
          endAutoRotate: r.slot(),
          click: r.slot(),
          pinch: r.slot(),
          scroll: r.slot(),
          doubleClick: r.slot(),
        };
      e.default = i;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var r = (function () {
        function t(t, e) {
          (this.bar = e), (this.p = t), this.refresh();
        }
        return (
          (t.prototype.refresh = function () {
            this.bar.style.width = this.p + "%";
          }),
          (t.prototype.update = function (t) {
            (this.p = t), this.refresh();
          }),
          t
        );
      })();
      e.default = r;
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.DefaultZoom = void 0);
      var r = n(19),
        i = (function () {
          function t(t, e, n, r) {
            (this.panzoomLoaded = !1),
              (this.currentZoomScale = 1),
              (this.previousPinchDistance = 0),
              (this.screenX = 0),
              (this.screenY = 0),
              (this.window = t),
              (this.images = e),
              (this.mainHolderElement = n),
              (this.zoomMax = r),
              this.initPanZoom();
          }
          return (
            (t.prototype.initPanZoom = function () {
              var t = this;
              this.images.forEach(function (e, n) {
                var r,
                  i =
                    null === (r = t.window) || void 0 === r
                      ? void 0
                      : r.document.getElementById("" + e.id);
                i && (t.images[n].pz = t.getMobilePanzoom(i));
              }),
                (this.panzoomLoaded = !0);
            }),
            (t.prototype.handleZoom = function (t, e, n, r, i) {
              var o = this;
              void 0 === i && (i = !1);
              var a = !1;
              (this.currentZoomScale < 1 && t < 0) ||
                (this.currentZoomScale + t > this.zoomMax && t > 0) ||
                ((this.currentZoomScale += t),
                this.currentZoomScale < 1.3 &&
                  t < 0 &&
                  ((e = 0),
                  (n = 0),
                  (a = !0),
                  (i = !0),
                  (this.previousPinchDistance = 0),
                  (this.currentZoomScale = 1)),
                (i ? this.images : [r]).forEach(function (t) {
                  var r, i;
                  a
                    ? null === (i = t.pz) ||
                      void 0 === i ||
                      i.reset({ animate: !0 })
                    : null === (r = t.pz) ||
                      void 0 === r ||
                      r.zoom(o.currentZoomScale, {
                        animate: !0,
                        focal: { x: e, y: n },
                      });
                }));
            }),
            (t.prototype.handlePan = function (t, e) {
              this.images.forEach(function (n) {
                var r;
                null === (r = n.pz) ||
                  void 0 === r ||
                  r.pan(t, e, { relative: !0, animate: !1 });
              });
            }),
            (t.prototype.getMobilePanzoom = function (t) {
              return r.default(t, {
                cursor: "",
                maxScale: this.zoomMax,
                minScale: 1,
                startX: 0,
                startY: 0,
                animate: !1,
                canvas: !1,
                noBind: !0,
                disablePan: !1,
                easing: "ease",
                panOnlyWhenZoomed: !0,
                touchAction: "",
              });
            }),
            (t.prototype.getRelativePosition = function (t, e, n) {
              var r,
                i = 0,
                o = 0,
                a =
                  null === (r = this.mainHolderElement) || void 0 === r
                    ? void 0
                    : r.getBoundingClientRect();
              if (a) {
                var s = this.window.pageXOffset + (null == a ? void 0 : a.left),
                  u = this.window.pageYOffset + (null == a ? void 0 : a.top);
                return (
                  (i = Math.round(t - s - a.width / 2)),
                  (o = Math.round(e - u - (a.height - a.height / 2))),
                  [i * this.currentZoomScale * 2, o * this.currentZoomScale * 2]
                );
              }
              return [i, o];
            }),
            (t.prototype.pinch = function (t, e) {
              var n;
              if (this.panzoomLoaded) {
                t.originalEvent.cancelBubble = !0;
                var r =
                    null === (n = this.mainHolderElement) || void 0 === n
                      ? void 0
                      : n.getBoundingClientRect(),
                  i = Math.sqrt(r.width * r.width + r.height * r.height),
                  o = t.scale / i;
                if (t.first || 0 === this.previousPinchDistance)
                  this.previousPinchDistance = o;
                else {
                  (this.screenX =
                    (t.originalEvent.targetTouches[0].pageX +
                      t.originalEvent.targetTouches[1].pageX) /
                    2),
                    (this.screenY =
                      (t.originalEvent.targetTouches[0].pageY +
                        t.originalEvent.targetTouches[1].pageY) /
                      2);
                  var a = o - this.previousPinchDistance;
                  a *= 4;
                  var s = this.getRelativePosition(
                      this.screenX,
                      this.screenY,
                      e
                    ),
                    u = s[0],
                    c = s[1];
                  this.handleZoom(a, u, c, e), (this.previousPinchDistance = o);
                }
              }
            }),
            (t.prototype.scroll = function (t, e, n) {
              var r = t.originalEvent.deltaY > 0 ? -1 : 1;
              r *= e / 100;
              var i = t.originalEvent,
                o = this.getRelativePosition(i.pageX, i.pageY, n),
                a = o[0],
                s = o[1];
              this.handleZoom(r, a, s, n);
            }),
            (t.prototype.isZoomed = function () {
              return this.currentZoomScale > 1;
            }),
            (t.prototype.pan = function (t, e) {
              this.handlePan(t, e);
            }),
            (t.prototype.reset = function (t) {
              this.handleZoom(-1 * (this.currentZoomScale - 1), 0, 0, t, !0);
            }),
            (t.prototype.zoomOnPage = function (t, e, n, r) {
              if (!(t > this.zoomMax)) {
                var i = this.getRelativePosition(e, n, r),
                  o = i[0],
                  a = i[1];
                this.handleZoom(t - this.currentZoomScale, o, a, r);
              }
            }),
            (t.prototype.zoom = function (t, e, n, r) {
              var i, o;
              if (!(t > this.zoomMax)) {
                var a = this.window.document.getElementById(r.id);
                if (a) {
                  this.currentZoomScale = t;
                  var s =
                      0 !== e ? (e * a.clientWidth) / this.currentZoomScale : 0,
                    u =
                      0 !== n
                        ? (n * a.clientHeight) / this.currentZoomScale
                        : 0;
                  null === (i = r.pz) ||
                    void 0 === i ||
                    i.pan(s, u, { animate: !0 }),
                    null === (o = r.pz) ||
                      void 0 === o ||
                      o.zoom(this.currentZoomScale, { animate: !0 });
                }
              }
            }),
            t
          );
        })();
      e.DefaultZoom = i;
    },
    function (t, e, n) {
      "use strict";
      n.r(e);

      var r = function () {
        return (r =
          Object.assign ||
          function (t) {
            for (var e, n = 1, r = arguments.length; n < r; n++)
              for (var i in (e = arguments[n]))
                Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t;
          }).apply(this, arguments);
      };
      function i(t, e) {
        for (var n = t.length; n--; )
          if (t[n].pointerId === e.pointerId) return n;
        return -1;
      }
      function o(t, e) {
        var n;
        if (e.touches) {
          n = 0;
          for (var r = 0, a = e.touches; r < a.length; r++) {
            var s = a[r];
            (s.pointerId = n++), o(t, s);
          }
        } else (n = i(t, e)) > -1 && t.splice(n, 1), t.push(e);
      }
      function a(t) {
        for (var e, n = (t = t.slice(0)).pop(); (e = t.pop()); )
          n = {
            clientX: (e.clientX - n.clientX) / 2 + n.clientX,
            clientY: (e.clientY - n.clientY) / 2 + n.clientY,
          };
        return n;
      }
      function s(t) {
        if (t.length < 2) return 0;
        var e = t[0],
          n = t[1];
        return Math.sqrt(
          Math.pow(Math.abs(n.clientX - e.clientX), 2) +
            Math.pow(Math.abs(n.clientY - e.clientY), 2)
        );
      }
      "undefined" != typeof window &&
        (window.NodeList &&
          !NodeList.prototype.forEach &&
          (NodeList.prototype.forEach = Array.prototype.forEach),
        "function" != typeof window.CustomEvent &&
          (window.CustomEvent = function (t, e) {
            e = e || { bubbles: !1, cancelable: !1, detail: null };
            var n = document.createEvent("CustomEvent");
            return n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), n;
          }));
      var u = {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup mouseleave",
      };
      function c(t, e, n, r) {
        u[t].split(" ").forEach(function (t) {
          e.addEventListener(t, n, r);
        });
      }
      function l(t, e, n) {
        u[t].split(" ").forEach(function (t) {
          e.removeEventListener(t, n);
        });
      }
      "undefined" != typeof window &&
        ("function" == typeof window.PointerEvent
          ? (u = {
              down: "pointerdown",
              move: "pointermove",
              up: "pointerup pointerleave pointercancel",
            })
          : "function" == typeof window.TouchEvent &&
            (u = {
              down: "touchstart",
              move: "touchmove",
              up: "touchend touchcancel",
            }));
      var h,
        d = "undefined" != typeof document && !!document.documentMode;
      function f() {
        return h || (h = document.createElement("div").style);
      }
      var g = ["webkit", "moz", "ms"],
        p = {};
      function m(t) {
        if (p[t]) return p[t];
        var e = f();
        if (t in e) return (p[t] = t);
        for (var n = t[0].toUpperCase() + t.slice(1), r = g.length; r--; ) {
          var i = "" + g[r] + n;
          if (i in e) return (p[t] = i);
        }
      }
      function v(t, e) {
        return parseFloat(e[m(t)]) || 0;
      }
      function y(t, e, n) {
        void 0 === n && (n = window.getComputedStyle(t));
        var r = "border" === e ? "Width" : "";
        return {
          left: v(e + "Left" + r, n),
          right: v(e + "Right" + r, n),
          top: v(e + "Top" + r, n),
          bottom: v(e + "Bottom" + r, n),
        };
      }
      function b(t, e, n) {
        t.style[m(e)] = n;
      }
      function w(t) {
        var e = t.parentNode,
          n = window.getComputedStyle(t),
          r = window.getComputedStyle(e),
          i = t.getBoundingClientRect(),
          o = e.getBoundingClientRect();
        return {
          elem: {
            style: n,
            width: i.width,
            height: i.height,
            top: i.top,
            bottom: i.bottom,
            left: i.left,
            right: i.right,
            margin: y(t, "margin", n),
            border: y(t, "border", n),
          },
          parent: {
            style: r,
            width: o.width,
            height: o.height,
            top: o.top,
            bottom: o.bottom,
            left: o.left,
            right: o.right,
            padding: y(e, "padding", r),
            border: y(e, "border", r),
          },
        };
      }
      function x(t, e) {
        return (
          1 === t.nodeType &&
          (
            " " +
            (function (t) {
              return (t.getAttribute("class") || "").trim();
            })(t) +
            " "
          ).indexOf(" " + e + " ") > -1
        );
      }
      var E = /^http:[\w\.\/]+svg$/;
      var R = {
        animate: !1,
        canvas: !1,
        cursor: "move",
        disablePan: !1,
        disableZoom: !1,
        disableXAxis: !1,
        disableYAxis: !1,
        duration: 200,
        easing: "ease-in-out",
        exclude: [],
        excludeClass: "panzoom-exclude",
        handleStartEvent: function (t) {
          t.preventDefault(), t.stopPropagation();
        },
        maxScale: 4,
        minScale: 0.125,
        overflow: "hidden",
        panOnlyWhenZoomed: !1,
        relative: !1,
        setTransform: function (t, e, n) {
          var r = e.x,
            i = e.y,
            o = e.scale,
            a = e.isSVG;
          if (
            (b(
              t,
              "transform",
              "scale(" + o + ") translate(" + r + "px, " + i + "px)"
            ),
            a && d)
          ) {
            var s = window.getComputedStyle(t).getPropertyValue("transform");
            t.setAttribute("transform", s);
          }
        },
        startX: 0,
        startY: 0,
        startScale: 1,
        step: 0.3,
        touchAction: "none",
      };
      function I(t, e) {
        if (!t) throw new Error("Panzoom requires an element as an argument");
        if (1 !== t.nodeType)
          throw new Error("Panzoom requires an element with a nodeType of 1");
        if (
          !(function (t) {
            var e = t.ownerDocument,
              n = t.parentNode;
            return (
              e &&
              n &&
              9 === e.nodeType &&
              1 === n.nodeType &&
              e.documentElement.contains(n)
            );
          })(t)
        )
          throw new Error(
            "Panzoom should be called on elements that have been attached to the DOM"
          );
        e = r(r({}, R), e);
        var n = (function (t) {
            return E.test(t.namespaceURI) && "svg" !== t.nodeName.toLowerCase();
          })(t),
          h = t.parentNode;
        (h.style.overflow = e.overflow),
          (h.style.userSelect = "none"),
          (h.style.touchAction = e.touchAction),
          ((e.canvas ? h : t).style.cursor = e.cursor),
          (t.style.userSelect = "none"),
          (t.style.touchAction = e.touchAction),
          b(
            t,
            "transformOrigin",
            "string" == typeof e.origin ? e.origin : n ? "0 0" : "50% 50%"
          );
        var d,
          f,
          g,
          p,
          v,
          y,
          I = 0,
          _ = 0,
          k = 1,
          C = !1;
        function D(e, n, r) {
          if (!r.silent) {
            var i = new CustomEvent(e, { detail: n });
            t.dispatchEvent(i);
          }
        }
        function P(e, r) {
          var i = { x: I, y: _, scale: k, isSVG: n };
          return (
            requestAnimationFrame(function () {
              "boolean" == typeof r.animate &&
                (r.animate
                  ? (function (t, e) {
                      b(
                        t,
                        "transition",
                        m("transform") + " " + e.duration + "ms " + e.easing
                      );
                    })(t, r)
                  : b(t, "transition", "none")),
                r.setTransform(t, i, r);
            }),
            D(e, i, r),
            D("panzoomchange", i, r),
            i
          );
        }
        function S() {
          if (e.contain) {
            var n = w(t),
              r = n.parent.width - n.parent.border.left - n.parent.border.right,
              i =
                n.parent.height - n.parent.border.top - n.parent.border.bottom,
              o = r / (n.elem.width / k),
              a = i / (n.elem.height / k);
            "inside" === e.contain
              ? (e.maxScale = Math.min(o, a))
              : "outside" === e.contain && (e.minScale = Math.max(o, a));
          }
        }
        function M(n, i, o, a) {
          var s = r(r({}, e), a),
            u = { x: I, y: _, opts: s };
          if (
            !s.force &&
            (s.disablePan || (s.panOnlyWhenZoomed && k === s.startScale))
          )
            return u;
          if (
            ((n = parseFloat(n)),
            (i = parseFloat(i)),
            s.disableXAxis || (u.x = (s.relative ? I : 0) + n),
            s.disableYAxis || (u.y = (s.relative ? _ : 0) + i),
            "inside" === s.contain)
          ) {
            var c = w(t);
            (u.x = Math.max(
              -c.elem.margin.left - c.parent.padding.left,
              Math.min(
                c.parent.width -
                  c.elem.width / o -
                  c.parent.padding.left -
                  c.elem.margin.left -
                  c.parent.border.left -
                  c.parent.border.right,
                u.x
              )
            )),
              (u.y = Math.max(
                -c.elem.margin.top - c.parent.padding.top,
                Math.min(
                  c.parent.height -
                    c.elem.height / o -
                    c.parent.padding.top -
                    c.elem.margin.top -
                    c.parent.border.top -
                    c.parent.border.bottom,
                  u.y
                )
              ));
          } else if ("outside" === s.contain) {
            var l = (c = w(t)).elem.width / k,
              h = c.elem.height / k,
              d = l * o,
              f = h * o,
              g = (d - l) / 2,
              p = (f - h) / 2,
              m =
                (-(d - c.parent.width) -
                  c.parent.padding.left -
                  c.parent.border.left -
                  c.parent.border.right +
                  g) /
                o,
              v = (g - c.parent.padding.left) / o;
            u.x = Math.max(Math.min(u.x, v), m);
            var y =
                (-(f - c.parent.height) -
                  c.parent.padding.top -
                  c.parent.border.top -
                  c.parent.border.bottom +
                  p) /
                o,
              b = (p - c.parent.padding.top) / o;
            u.y = Math.max(Math.min(u.y, b), y);
          }
          return u;
        }
        function T(t, n) {
          var i = r(r({}, e), n),
            o = { scale: k, opts: i };
          return (
            (!i.force && i.disableZoom) ||
              (o.scale = Math.min(Math.max(t, i.minScale), i.maxScale)),
            o
          );
        }
        function N(t, e, n) {
          var r = M(t, e, k, n),
            i = r.opts;
          return (I = r.x), (_ = r.y), P("panzoompan", i);
        }
        function H(t, e) {
          var n = T(t, e),
            r = n.opts;
          if (r.force || !r.disableZoom) {
            t = n.scale;
            var i = I,
              o = _;
            if (r.focal) {
              var a = r.focal;
              (i = (a.x / t - a.x / k + I * t) / t),
                (o = (a.y / t - a.y / k + _ * t) / t);
            }
            var s = M(i, o, t, { relative: !1, force: !0 });
            return (I = s.x), (_ = s.y), (k = t), P("panzoomzoom", r);
          }
        }
        function O(t, n) {
          var i = r(r(r({}, e), { animate: !0 }), n);
          return H(k * Math.exp((t ? 1 : -1) * i.step), i);
        }
        function z(e, i, o) {
          var a = w(t),
            s =
              a.parent.width -
              a.parent.padding.left -
              a.parent.padding.right -
              a.parent.border.left -
              a.parent.border.right,
            u =
              a.parent.height -
              a.parent.padding.top -
              a.parent.padding.bottom -
              a.parent.border.top -
              a.parent.border.bottom,
            c =
              i.clientX -
              a.parent.left -
              a.parent.padding.left -
              a.parent.border.left -
              a.elem.margin.left,
            l =
              i.clientY -
              a.parent.top -
              a.parent.padding.top -
              a.parent.border.top -
              a.elem.margin.top;
          n || ((c -= a.elem.width / k / 2), (l -= a.elem.height / k / 2));
          var h = { x: (c / s) * (s * e), y: (l / u) * (u * e) };
          return H(e, r(r({ animate: !1 }, o), { focal: h }));
        }
        H(e.startScale, { animate: !1 }),
          setTimeout(function () {
            S(), N(e.startX, e.startY, { animate: !1 });
          });
        var Y = [];
        function A(t) {
          if (
            !(function (t, e) {
              for (var n = t; null != n; n = n.parentNode)
                if (x(n, e.excludeClass) || e.exclude.indexOf(n) > -1)
                  return !0;
              return !1;
            })(t.target, e)
          ) {
            o(Y, t),
              (C = !0),
              e.handleStartEvent(t),
              (d = I),
              (f = _),
              D("panzoomstart", { x: I, y: _, scale: k }, e);
            var n = a(Y);
            (g = n.clientX), (p = n.clientY), (v = k), (y = s(Y));
          }
        }
        function Z(t) {
          if (
            C &&
            void 0 !== d &&
            void 0 !== f &&
            void 0 !== g &&
            void 0 !== p
          ) {
            o(Y, t);
            var n = a(Y);
            if (Y.length > 1) z(T(((s(Y) - y) * e.step) / 80 + v).scale, n);
            N(d + (n.clientX - g) / k, f + (n.clientY - p) / k, {
              animate: !1,
            });
          }
        }
        function j(t) {
          1 === Y.length && D("panzoomend", { x: I, y: _, scale: k }, e),
            (function (t, e) {
              if (e.touches) for (; t.length; ) t.pop();
              else {
                var n = i(t, e);
                n > -1 && t.splice(n, 1);
              }
            })(Y, t),
            C && ((C = !1), (d = f = g = p = void 0));
        }
        var X = !1;
        function G() {
          X ||
            ((X = !0),
            c("down", e.canvas ? h : t, A),
            c("move", document, Z, { passive: !0 }),
            c("up", document, j, { passive: !0 }));
        }
        return (
          e.noBind || G(),
          {
            bind: G,
            destroy: function () {
              (X = !1),
                l("down", e.canvas ? h : t, A),
                l("move", document, Z),
                l("up", document, j);
            },
            eventNames: u,
            getPan: function () {
              return { x: I, y: _ };
            },
            getScale: function () {
              return k;
            },
            getOptions: function () {
              return (function (t) {
                var e = {};
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
                return e;
              })(e);
            },
            pan: N,
            reset: function (t) {
              var n = r(r(r({}, e), { animate: !0, force: !0 }), t);
              k = T(n.startScale, n).scale;
              var i = M(n.startX, n.startY, k, n);
              return (I = i.x), (_ = i.y), P("panzoomreset", n);
            },
            setOptions: function (n) {
              for (var r in (void 0 === n && (n = {}), n))
                n.hasOwnProperty(r) && (e[r] = n[r]);
              n.hasOwnProperty("cursor") && (t.style.cursor = n.cursor),
                n.hasOwnProperty("overflow") && (h.style.overflow = n.overflow),
                n.hasOwnProperty("touchAction") &&
                  ((h.style.touchAction = n.touchAction),
                  (t.style.touchAction = n.touchAction)),
                (n.hasOwnProperty("minScale") ||
                  n.hasOwnProperty("maxScale") ||
                  n.hasOwnProperty("contain")) &&
                  S();
            },
            setStyle: function (e, n) {
              return b(t, e, n);
            },
            zoom: H,
            zoomIn: function (t) {
              return O(!0, t);
            },
            zoomOut: function (t) {
              return O(!1, t);
            },
            zoomToPoint: z,
            zoomWithWheel: function (t, n) {
              t.preventDefault();
              var i = r(r({}, e), n),
                o =
                  (0 === t.deltaY && t.deltaX ? t.deltaX : t.deltaY) < 0
                    ? 1
                    : -1;
              return z(T(k * Math.exp((o * i.step) / 3), i).scale, t, i);
            },
          }
        );
      }
      (I.defaultOptions = R), (e.default = I);
    },
    function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.Helper = void 0);
      var r = (function () {
        function t() {}
        return (
          (t.isValid = function (t, e) {
            e = e.toLowerCase().split("").reverse().join("");
            var n = parseInt(t.charAt(0), 10),
              r = t.split("=="),
              i = parseInt(r[0].charAt(r[0].length - 1), 10);
            return (
              r[0].substr(1, r[0].length - 2) === this.reverse(e, 2 * i) &&
              n + i === 10
            );
          }),
          (t.reverse = function (t, e) {
            var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase(),
              r = "";
            e > 26 && (e %= 26);
            for (var i = 0; i < t.length; ) {
              if (-1 !== n.indexOf(t[i])) {
                var o = n.indexOf(t[i]);
                n[o + e] ? (r += n[o + e]) : (r += n[o + e - 26]);
              }
              i++;
            }
            return r;
          }),
          t
        );
      })();
      e.Helper = r;
    },
  ]);
});

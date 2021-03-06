"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 	cPlayer
    Author	Corps

	I am the super Corps!
 */
var cPlayer = function () {
	function cPlayer(options) {
		var _this = this;

		_classCallCheck(this, cPlayer);

		this.transLock = false;
		var EVENTS = {
			"play": [], //When Music be played, Emit.
			"pause": [], //When Music be paused, Emit.
			"volumechange": [],
			"timeupdate": [],
			"canplaythrough": [],
			"ended": [],
			//All the above are binded on AUDIO Elements,
			//The following items are Function's callback function.
			"toggle": [],
			"previous": [],
			"next": [],
			"changeList": [],
			"changeLyric": [],
			"slideList": [],
			"slideLyric": [],
			"clickLyricPower": [],
			"clickListPower": [],
			"clickVolumePower": []
		};
		this.emitter = new cEmitter(EVENTS);
		this.on = function (eventName, func) {
			return _this.emitter.on(eventName, func);
		};
		/*
   *  參數处理,合并默认参数与定义參數
   */
		var DEFAULTS = {
			"element": document.getElementById("cplayer"),
			"list": []
		};
		if (Object.assign !== undefined) {
			this.options = Object.assign({}, DEFAULTS, options);
		}

		//SVG建立
		this.SVG = {
			"playArrow": 'M16 10v28l22-14z',
			"pause": 'M12 38h8V10h-8v28zm16-28v28h8V10h-8z',
			"playlistPlay": 'M26 6H-8v4h34V6zm0-8H-8v4h34v-4zM-8 18h26v-4H-8v4zm30-4v12l10-6-10-6z',
			"note": 'M44 20L32 8H8c-2.2 0-4 1.8-4 4v24.02C4 38.22 5.8 40 8 40l32-.02c2.2 0 4-1.78 4-3.98V20zm-14-9l11 11H30V11z',
			"volumeUp": 'M6 18v12h8l10 10V8L14 18H6zm27 6c0-3.53-2.04-6.58-5-8.05v16.11c2.96-1.48 5-4.53 5-8.06zM28 6.46v4.13c5.78 1.72 10 7.07 10 13.41s-4.22 11.69-10 13.41v4.13c8.01-1.82 14-8.97 14-17.54S36.01 8.28 28 6.46z',
			"volumeMute": 'M14 18v12h8l10 10V8L22 18h-8z',
			"volumeOff": 'M33 24c0-3.53-2.04-6.58-5-8.05v4.42l4.91 4.91c.06-.42.09-.85.09-1.28zm5 0c0 1.88-.41 3.65-1.08 5.28l3.03 3.03C41.25 29.82 42 27 42 24c0-8.56-5.99-15.72-14-17.54v4.13c5.78 1.72 10 7.07 10 13.41zM8.55 6L6 8.55 15.45 18H6v12h8l10 10V26.55l8.51 8.51c-1.34 1.03-2.85 1.86-4.51 2.36v4.13c2.75-.63 5.26-1.89 7.37-3.62L39.45 42 42 39.45l-18-18L8.55 6zM24 8l-4.18 4.18L24 16.36V8z',
			"volumeDown": 'M37 24c0-3.53-2.04-6.58-5-8.05v16.11c2.96-1.48 5-4.53 5-8.06zm-27-6v12h8l10 10V8L18 18h-8z'
		};
		(function () {
			for (var i = 0, keys = Object.keys(_this.SVG), length = keys.length; i < length; i++) {
				var svg = keys[i] === "playlistPlay" ? '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-12 -12 48 48" enable-background="new -12 -12 48 48"><path d="' + _this.SVG[keys[i]] + '"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><path d="' + _this.SVG[keys[i]] + '"/></svg>';
				_this.SVG[keys[i]] = svg;
			}
		})();

		this.CBASE = new cBase();
		this.now = 0;
		this.dragging = { contain: false, target: undefined };
		//现在开始填DOM
		this.options.element.innerHTML = '<c-player><div class="lyric invisible"><lyric-body></lyric-body></div><div class="controls"><div class="c-left"><div class="music-description"><div class="image"><img class="meta-bak"></div><div class="music-meta"><div><span class="music-name"></span><span class="music-artist"></span></div></div></div><a class="play-icon"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><path d="M16 10v28l22-14z"></path></svg></a></div><div class="c-center"><div class="time"><div class="time-body"><div class="time-line"><div class="time-point"></div></div></div></div></div><div class="c-right"><div class="volume"><div class="volume-button"><a class="volume-power"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><path d="M33 24c0-3.53-2.04-6.58-5-8.05v4.42l4.91 4.91c.06-.42.09-.85.09-1.28zm5 0c0 1.88-.41 3.65-1.08 5.28l3.03 3.03C41.25 29.82 42 27 42 24c0-8.56-5.99-15.72-14-17.54v4.13c5.78 1.72 10 7.07 10 13.41zM8.55 6L6 8.55 15.45 18H6v12h8l10 10V26.55l8.51 8.51c-1.34 1.03-2.85 1.86-4.51 2.36v4.13c2.75-.63 5.26-1.89 7.37-3.62L39.45 42 42 39.45l-18-18L8.55 6zM24 8l-4.18 4.18L24 16.36V8z"></path></svg></a></div><div class="volume-body"><div class="volume-line"><div class="volume-point"></div></div></div></div><div class="list-button"><a class="list-power"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-12 -12 48 48" enable-background="new -12 -12 48 48"><path d="M26 6H-8v4h34V6zm0-8H-8v4h34v-4zM-8 18h26v-4H-8v4zm30-4v12l10-6-10-6z"></path></svg></a></div><div class="lyric-button"><a class="lyric-power"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><path d="M44 20L32 8H8c-2.2 0-4 1.8-4 4v24.02C4 38.22 5.8 40 8 40l32-.02c2.2 0 4-1.78 4-3.98V20zm-14-9l11 11H30V11z"></path></svg></a></div></div></div><div class="list invisible"><list-body></list-body></div></c-player>';
		this.CBASE.root = this.options.element.getElementsByTagName("c-player");
		this.CBASE.root = this.CBASE.root[this.CBASE.root.length - 1];
		//然后为DOMList填充一下吧
		this.__LIST__ = {
			"lyric": this.CBASE.getByClass("lyric"),
			"lyricBody": this.CBASE.getByTagName("lyric-body"),
			"toggle": this.CBASE.getByClass("play-icon"),
			"img": this.CBASE.getByClass("meta-bak"),
			"name": this.CBASE.getByClass("music-name"),
			"artist": this.CBASE.getByClass("music-artist"),
			"time": this.CBASE.getByClass("time"),
			"timeBody": this.CBASE.getByClass("time-body"),
			"timeLine": this.CBASE.getByClass("time-line"),
			"timePoint": this.CBASE.getByClass("time-point"),
			"lyricPower": this.CBASE.getByClass("lyric-power"),
			"volumePower": this.CBASE.getByClass("volume-power"),
			"volumeBody": this.CBASE.getByClass("volume-body"),
			"volumeLine": this.CBASE.getByClass("volume-line"),
			"volumePoint": this.CBASE.getByClass("volume-point"),
			"listPower": this.CBASE.getByClass("list-power"),
			"list": this.CBASE.getByClass("list"),
			"listBody": this.CBASE.getByTagName("list-body")
		};
		this.__LIST__.toggleIcon = this.CBASE.getByTagName("svg", this.__LIST__.toggle);
		this.__LIST__.volumeIcon = this.CBASE.getByTagName("svg", this.__LIST__.volumePower);

		var that = this;function dragPercentage(options) {
			/*
   	While anything...
   	rightTarget(if.it.possible)[
   0 -> sth.point
   1 -> sth.line
   2 -> sth.point & sth.line & sth.body
   	]
   */
			var rightTarget = [];
			Object.defineProperties(rightTarget, {
				0: {
					get: function get() {
						return options.target === that.__LIST__.timePoint || options.target === that.__LIST__.volumePoint;
					}
				},
				1: {
					get: function get() {
						return options.target === that.__LIST__.timeLine || options.target === that.__LIST__.volumeLine;
					}
				},
				2: {
					get: function get() {
						return options.target === that.__LIST__.timePoint || options.target === that.__LIST__.volumePoint || options.target === that.__LIST__.timeBody || options.target === that.__LIST__.volumeBody || options.target === that.__LIST__.timeLine || options.target === that.__LIST__.volumeLine;
					}
				}
			});
			if (!rightTarget[2]) return; //Warning!!! rightTarget[2] checks if mouse focus on the percentage.
			that.dragging.contain = true;
			that.dragging.target = options.target;
			var mover = function mover(options) {
				if (that.dragging.contain === false) return;
				if (!rightTarget[0]) return;
				parent = that.dragging.target.parentNode.parentNode;
				if (parent.classList && parent.classList.contains("volume-body")) {
					that.__LIST__.volumeLine.style.width = (options.clientX - parent.getBoundingClientRect().left) / parent.offsetWidth * 100 + "%";
				} else if (parent.classList && parent.classList.contains("time-body")) {
					that.__LIST__.timeLine.style.width = (options.clientX - parent.getBoundingClientRect().left) / parent.offsetWidth * 100 + "%";
				}
				//实时修正VOLUME
				if (parent.classList.contains("volume-body")) {
					var vol = (options.clientX - parent.getBoundingClientRect().left) / parent.offsetWidth;
					vol = vol > 1 ? 1 : vol;
					vol = vol < 0 ? 0 : vol;
					that.music.volume = vol;
				}
				window.addEventListener("mouseup", upper);
			};var upper = function upper(options) {
				if (that.dragging.contain === false) return;
				/*
    	While anything...
    	sth.body -> self
    	sth.line -> parent
    	sth.point-> parent.parent
    */
				if (false) {} else if (rightTarget[0]) {
					parent = that.dragging.target.parentNode.parentNode;
				} else if (rightTarget[1]) {
					parent = that.dragging.target.parentNode;
				} else if (rightTarget[2]) {
					parent = that.dragging.target;
				} else throw new Error(JSON.stringify([that.dragging.target, rightTarget]));
				if (parent.classList.contains("volume-body")) {
					var vol = (options.clientX - parent.getBoundingClientRect().left) / parent.offsetWidth;
					vol = vol > 1 ? 1 : vol;
					vol = vol < 0 ? 0 : vol;
					that.music.volume = vol;
				} else if (parent.classList.contains("time-body")) {
					var time = (options.clientX - parent.getBoundingClientRect().left) / parent.offsetWidth;
					time = time > 1 ? 1 : time;
					time = time < 0 ? 0 : time;
					that.updateTime(time * that.music.duration);
				}
				that.dragging.contain = false;
				that.dragging.target = undefined;
				window.removeEventListener("mouseup", upper);
				window.removeEventListener("mousemove", mover);
			};var uppers = function uppers(options) {
				if (that.dragging.contain === false) return;
				if (false) {} else if (rightTarget[0]) {
					parent = that.dragging.target.parentNode.parentNode;
				} else if (rightTarget[1]) {
					parent = that.dragging.target.parentNode;
				} else if (rightTarget[2]) {
					parent = that.dragging.target;
				} else throw new Error(JSON.stringify([that.dragging.target, rightTarget]));

				if (parent.classList.contains("volume-body")) {
					var vol = (options.clientX - parent.getBoundingClientRect().left) / parent.offsetWidth;
					vol = vol > 1 ? 1 : vol;
					vol = vol < 0 ? 0 : vol;
					that.music.volume = vol;
				} else if (parent.classList.contains("time-body")) {
					var time = (options.clientX - parent.getBoundingClientRect().left) / parent.offsetWidth;
					time = time > 1 ? 1 : time;
					time = time < 0 ? 0 : time;
					that.updateTime(time * that.music.duration);
				}
				that.dragging.contain = false;
				that.dragging.target = undefined;
				window.removeEventListener("mouseup", uppers);
			};
			if (rightTarget[0]) window.addEventListener("mousemove", mover);
			if (!rightTarget[0]) window.addEventListener("mouseup", uppers);
		}

		this.music = document.createElement("audio");
		this.music.autoplay = !!this.options.autoplay;
		this.music.preload = "metadata";
		//绑定事件开始:

		this.emitter.on("toggle", function () {
			if (_this.isPaused()) {
				_this.play();
			} else {
				_this.pause();
			}
		}).on("clickLyricPower", function () {
			if (_this.hasLyric(_this.now) && _this.__LIST__.lyric.classList.contains("invisible")) {
				_this.showLyric();
			} else if (_this.hasLyric(_this.now) && !_this.__LIST__.lyric.classList.contains("invisible")) {
				_this.hideLyric();
			}
		}).on("clickListPower", function () {
			if (_this.hasList() && _this.__LIST__.list.classList.contains("invisible")) {
				_this.showList();
			} else if (_this.hasList() && !_this.__LIST__.list.classList.contains("invisible")) {
				_this.hideList();
			}
		}).on("clickVolumePower", function () {
			if (_this.isMuted()) {
				_this.music.muted = false;
			} else {
				_this.volume(0);
			}
		}).on("timeupdate", function () {
			_this.updateTime();
			if (_this.hasLyric(_this.now)) _this.slideLyric(_this.music.currentTime);
		}).on("volumechange", function () {
			_this.volume(); //做更新界面用.
		}).on("pause", function () {
			_this.CBASE.replaceInner(_this.__LIST__.toggle, _this.SVG.playArrow);
		}).on("play", function () {
			_this.CBASE.replaceInner(_this.__LIST__.toggle, _this.SVG.pause);
			_this.__LIST__.toggleIcon = _this.CBASE.getByTagName("svg", _this.__LIST__.toggle);
		}).on("ended", function () {
			_this.CBASE.style(_this.__LIST__.lyricBody, "transform", "");
			if (_this.options.list[_this.now].loop === true) {
				_this.updateTime(0);
				_this.play();
			} else if (_this.hasList() && _this.now !== _this.options.list.length - 1) {
				_this.next();
			}
		});

		//结束

		new cContext({ element: this.options.element, items: [{ "name": "上一曲", "action": function action() {
					return _this.previous();
				} }, { "name": "下一曲", "action": function action() {
					return _this.next();
				} }, { "name": "翻译", "action": function action() {
					return _this.translate();
				} }] });

		if (this.options.list[0]) this.toggle();
		this.__LIST__.toggle.addEventListener("click", function () {
			return _this.emitter.emit("toggle");
		});
		this.__LIST__.lyricPower.addEventListener("click", function () {
			return _this.emitter.emit("clickLyricPower");
		});
		this.__LIST__.listPower.addEventListener("click", function () {
			return _this.emitter.emit("clickListPower");
		});
		this.__LIST__.volumePower.addEventListener("click", function () {
			return _this.emitter.emit("clickVolumePower");
		});
		this.music.addEventListener("volumechange", function (ev) {
			return _this.emitter.emit("volumechange", ev);
		});
		this.music.addEventListener("timeupdate", function (ev) {
			return _this.emitter.emit("timeupdate", ev);
		});
		this.music.addEventListener("canplaythrough", function () {
			return _this.emitter.emit("canplaythrough");
		});
		this.music.addEventListener("pause", function () {
			return _this.emitter.emit("pause");
		});
		this.music.addEventListener("play", function () {
			return _this.emitter.emit("play");
		});
		this.music.addEventListener("ended", function () {
			return _this.emitter.emit("ended");
		});
		this.options.element.addEventListener("mousedown", function (a) {
			return dragPercentage(a);
		});

		this.volume();
		this.refreshList();
	}

	_createClass(cPlayer, [{
		key: "volume",
		value: function volume() {
			var _this2 = this;

			var vl = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

			var checkLevel = function checkLevel() {
				if (_this2.music.volume === 0 || _this2.isMuted()) {
					_this2.CBASE.replaceInner(_this2.__LIST__.volumePower, _this2.SVG.volumeOff);
				} else if (_this2.music.volume > 0 && _this2.music.volume <= 0.5) {
					_this2.CBASE.replaceInner(_this2.__LIST__.volumePower, _this2.SVG.volumeDown);
				} else if (_this2.music.volume > 0.5 && _this2.music.volume <= 1) {
					_this2.CBASE.replaceInner(_this2.__LIST__.volumePower, _this2.SVG.volumeUp);
				} else {
					console.log("Unexcepted Volume: " + _this2.music.volume);
				}
			};
			if (vl === undefined) {
				this.__LIST__.volumeLine.style.width = this.music.volume * 100 + "%";
				checkLevel();
				return this.isMuted() ? 0 : this.music.volume;
			} else {
				if (vl === 0) {
					this.music.muted = true;
					checkLevel();
				} else {
					this.music.volume = vl;
					checkLevel();
				}
			}
		}
	}, {
		key: "isMuted",
		value: function isMuted() {
			return this.music.muted;
		}
	}, {
		key: "play",
		value: function play() {
			if (this.music.seeking === true) return this;
			this.music.play();
			return this;
		}
	}, {
		key: "pause",
		value: function pause() {
			if (this.music.seeking === true) return;
			this.music.pause();
			return this;
		}
	}, {
		key: "previous",
		value: function previous() {
			this.emitter.emit("previous");
			if (this.now === 0) return;
			this.now--;
			this.toggle().play();
			return this;
		}
	}, {
		key: "next",
		value: function next() {
			this.emitter.emit("next");
			if (this.now === this.options.list.length - 1) return;
			this.now++;
			this.toggle().play();
			return this;
		}
	}, {
		key: "to",
		value: function to(now) {
			this.now = now;
			this.toggle();
			this.play();
			return this;
		}
	}, {
		key: "toggle",
		value: function toggle() {
			var now = arguments.length <= 0 || arguments[0] === undefined ? this.now : arguments[0];

			var list = this.options.list[now],
			    dom = this.__LIST__;
			this.music.pause();
			var _ref = [list.image, list.name, list.artist, list.url];
			dom.img.src = _ref[0];
			dom.name.innerHTML = _ref[1];
			dom.artist.innerHTML = _ref[2];
			this.music.src = _ref[3];

			this.transLock = false;
			this.refreshLyric();
			if (!this.hasLyric(this.now)) this.hideLyric();
			this.CBASE.style(this.__LIST__.lyricBody, "transform", "");
			return this;
		}
	}, {
		key: "isPaused",
		value: function isPaused(func) {
			if (func !== undefined) func();
			return this.music.paused;
		}
	}, {
		key: "hasLyric",
		value: function hasLyric() {
			var id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
			var func = arguments[1];

			if (func !== undefined) func();
			return this.options.list[id].lyric != undefined;
		}
	}, {
		key: "showLyric",
		value: function showLyric() {
			this.emitter.emit("slideLyric", true);
			if (this.hasLyric(this.now)) this.__LIST__.lyric.classList.remove("invisible");
			if (!this.__LIST__.list.classList.contains("invisible")) this.hideList();
			return this;
		}
	}, {
		key: "hideLyric",
		value: function hideLyric() {
			this.emitter.emit("slideLyric", false);
			this.__LIST__.lyric.classList.add("invisible");
			return this;
		}
	}, {
		key: "hasList",
		value: function hasList(func) {
			if (func !== undefined) func();
			return this.options.list.length > 1;
		}
	}, {
		key: "showList",
		value: function showList(func) {
			this.emitter.emit("slideList", true);
			this.__LIST__.list.classList.remove("invisible");
			if (!this.__LIST__.lyric.classList.contains("invisible")) this.hideLyric();
			if (func !== undefined) func();
			return this;
		}
	}, {
		key: "hideList",
		value: function hideList(func) {
			this.emitter.emit("slideList", false);
			this.__LIST__.list.classList.add("invisible");
			if (func !== undefined) func();
			return this;
		}
	}, {
		key: "refreshList",
		value: function refreshList(func) {
			var _this3 = this;

			this.emitter.emit("changeList");
			var list = this.options.list,
			    lb = this.__LIST__.listBody;
			lb.innerHTML = "";

			var _loop = function _loop(i) {
				var div = document.createElement("div");
				div.innerHTML = '<span class="music-name">' + list[i].name + '</span><span class="music-artist">' + list[i].artist + '</span>';
				div = lb.appendChild(div);
				div.addEventListener("click", function () {
					_this3.to(i);
				});
			};

			for (var i = 0; i <= list.length - 1; i++) {
				_loop(i);
			}
			if (func !== undefined) func();
		}
	}, {
		key: "add",
		value: function add(u, func) {
			var _this4 = this;

			var ln = this.options.list.push(u);
			var div = document.createElement("div");
			div.innerHTML = '<span class="music-name">' + u.name + '</span><span class="music-artist">' + u.artist + '</span>';
			div = this.__LIST__.listBody.appendChild(div);
			div.addEventListener("click", function () {
				_this4.to(ln - 1);
			});
			if (ln === 1) this.toggle(); //刷新元素.
			if (func !== undefined) func();
		}
	}, {
		key: "lyric",
		value: function lyric() {
			var content = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

			if (content === undefined) {
				if (this.hasLyric(this.now)) return this.options.list[this.now].lyric;
			} else {
				this.options.list[this.now].lyric = content;
				this.refreshLyric();
			}
			return this;
		}
	}, {
		key: "refreshLyric",
		value: function refreshLyric() {
			var isTrans = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			//REQUIRE LYRIC...
			this.__LIST__.lyricBody.innerHTML = "";
			if (!this.hasLyric(this.now)) return;
			var lr = isTrans !== false ? this.options.list[this.now].transLyric : this.options.list[this.now].lyric;
			//START LRC BASEING...
			lr = lr.split("\n").length > 1 ? lr.split("\n") : lr.replace("]", "]\n").split("]");
			var lrcs = [];
			for (var i = 0, content = lr[i]; i < lr.length; i++, content = lr[i]) {
				if (typeof content !== "string") break;
				var onelrc = content.split(/\[|\]\[|\]/gi);
				for (var _i = 0; _i < onelrc.length - 1; _i++) {
					if (onelrc[_i] === "" && _i !== onelrc.length - 1 || onelrc[_i].match(/\d{1,}\:\d{1,}/gi) === null) {
						onelrc.splice(_i, 1);
						_i--;
						continue;
					}

					if (onelrc[_i].match(/\d{1,}\:\d{1,}/gi)) {
						var lyricsarray = onelrc[_i].split(/\:|\./gi);
						switch (lyricsarray.length) {
							case 2:
								onelrc[_i] = parseInt(lyricsarray[0]) * 60 + parseInt(lyricsarray[1]);
								break;
							case 3:
								onelrc[_i] = parseInt(lyricsarray[0]) * 60 + parseInt(lyricsarray[1]) + parseFloat("0." + lyricsarray[2]);
								break;
							default:
								throw new Error("Time not be Found!");
						}
					}
				}

				lrcs.push(onelrc);
			}
			//LRC BASED
			var lyric = [];
			for (var _i2 = lrcs.length - 1; _i2 >= 0; _i2--) {
				if (lrcs[_i2].length > 2) {
					for (var count = lrcs[_i2].length - 1; count >= 0; count--) {
						if (count !== lrcs[_i2].length - 1 && lrcs[_i2][lrcs[_i2].length - 1] !== undefined) {
							lyric.push({ time: lrcs[_i2][count], content: lrcs[_i2][lrcs[_i2].length - 1] });
						}
					}
				} else if (lrcs[_i2][1] !== undefined) {
					lyric.push({ time: lrcs[_i2][0], content: lrcs[_i2][1] });
				}
			}

			lyric.sort(function (a, b) {
				return a.time - b.time;
			});
			lyric["now"] = 0;
			this.__LYRIC__ = lyric;
			for (var _i3 = 0; _i3 <= lyric.length - 1; _i3++) {
				var div = document.createElement("lrc");
				div.innerHTML = lyric[_i3].content;
				this.__LIST__.lyricBody.appendChild(div);
			}
			this.emitter.emit("changeLyric");
		}
	}, {
		key: "updateTime",
		value: function updateTime() {
			var time = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
			var func = arguments[1];

			if (time !== undefined) this.music.currentTime = time;
			if (this.dragging.contain === false) this.__LIST__.timeLine.style.width = this.music.currentTime / this.music.duration * 100 + "%";
			if (func !== undefined) func(this.music.currentTime);
		}
	}, {
		key: "slideLyric",
		value: function slideLyric(time) {
			if (this.__LIST__.lyric.classList.contains("invisible")) return;

			var lyricToTop = void 0,
			    halfBody = void 0,
			    translateY = void 0,
			    lyricBody = this.__LIST__.lyricBody,
			    lrc = this.__LIST__.lyricBody.getElementsByTagName("lrc");
			//遍历Lyric,寻找当前时间的歌词
			//注意:[].find & [].findIndex 仅返回符合要求元素组成的数组第一项,符合要求元素组成的数组的顺序参考原数组不变
			//现在的写法需要__LYRIC__属性具有time从小到大排列的顺序,详见refreshLyric()方法
			var lyric = this.CBASE.find(this.__LYRIC__, function (element) {
				return element.time < time;
			}).reverse()[0];
			var i = this.__LYRIC__.indexOf(lyric);if (i < 0) return;

			if (this.__LYRIC__["now"] !== i) this.__LYRIC__["now"] = i;
			lrc[i].classList.add("now");
			lyricToTop = lyricBody.childNodes[i].offsetTop - lyricBody.childNodes[0].offsetTop - 0.5 * lyricBody.childNodes[i].clientHeight;
			halfBody = 0.5 * this.__LIST__.lyric.clientHeight - lyricBody.childNodes[i].clientHeight;
			translateY = -(lyricToTop - halfBody);
			this.CBASE.style(lyricBody, "transform", "translateY(" + translateY + "px)");
			var list = this.__LIST__.lyricBody.getElementsByClassName("now");
			if (list.length > 1) for (var n = list.length - 1; n >= 0; n--) {
				if (list[n] !== lrc[i]) list[n].classList.remove("now");
			}
		}
	}, {
		key: "translate",
		value: function translate() {
			if (!this.options.list[this.now].transLyric || !this.hasLyric(this.now)) return false;
			this.transLock = !this.transLock;
			this.refreshLyric(this.transLock);
		}
	}, {
		key: "length",
		get: function get() {
			return this.options.list.length;
		},
		set: function set(length) {
			throw new SyntaxError("Read-only Property.");
		}
	}]);

	return cPlayer;
}();

//Object.assign 解决方案
if (typeof Object.assign != 'function') {
	Object.assign = function (target) {
		'use strict';

		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if (source != null) {
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	};
}

var cEmitter = function () {
	function cEmitter(typeList) {
		_classCallCheck(this, cEmitter);

		if (typeList) {
			this.events = typeList;
		} else {
			this.events = [];
		}
	}

	_createClass(cEmitter, [{
		key: "on",
		value: function on(eventName, func) {
			if (this.events[eventName] && this.events[eventName].push !== undefined && typeof func === "function") {
				this.events[eventName].push(func);
			} else if (this.events[eventName] === undefined || this.events[eventName].push === undefined) {
				this.events[eventName] = [];
			} else {
				throw new TypeError("Uncaught Unexcepted TypeError.");
			}
			return this;
		}
	}, {
		key: "emit",
		value: function emit(eventName) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			for (var i = 0; i < this.events[eventName].length; i++) {
				this.events[eventName][i](args);
			}
			return this;
		}
	}]);

	return cEmitter;
}();
var cBase = function () {
	function cBase() {
		var _this5 = this;

		var rootNode = arguments.length <= 0 || arguments[0] === undefined ? document.documentElement : arguments[0];

		_classCallCheck(this, cBase);

		this.root = rootNode;

		var _loop2 = function _loop2(styleList, i) {
			["-webkit-", "-moz-", "-o-", "-ms-"].forEach(function (element) {
				if (styleList[i].indexOf(element) !== -1) {
					_this5.browser = element.replace("-", "");
				};
			});
			if (_this5.browser) return "break";
		};

		for (var styleList = document.documentElement.style, i = styleList.length; i > 0; i--) {
			var _ret2 = _loop2(styleList, i);

			if (_ret2 === "break") break;
		}
	}

	_createClass(cBase, [{
		key: "replace",
		value: function replace(oldElement, newElement) {
			//newElement 不存在于oldElement 的父元素中,首先载入.
			newElement = newElement.cloneNode(true);
			oldElement.parentNode.appendChild(newElement);
			oldElement.parentNode.removeChild(oldElement);
			//顺便如果有值为oldElement的变量,请重新赋值.
		}
	}, {
		key: "replaceInner",
		value: function replaceInner(element, innerContent) {
			//进行一次简单的封装
			element.innerHTML = innerContent;
		}
	}, {
		key: "getByClass",
		value: function getByClass(className, parentElement) {
			return parentElement != undefined ? parentElement.getElementsByClassName(className)[0] : this.root.getElementsByClassName(className)[0];
		}
	}, {
		key: "getByTagName",
		value: function getByTagName(tagName, parentElement) {
			return parentElement != undefined ? parentElement.getElementsByTagName(tagName)[0] : this.root.getElementsByTagName(tagName)[0];
		}
	}, {
		key: "rand",
		value: function rand(start, end) {
			if (start === undefined || end === undefined) return Math.random();
			if (start > end) throw new RangeError("the EndNumber must be bigger than the StartNumber");
			return (end - start) * Math.random() + start;
		}
	}, {
		key: "find",
		value: function find(array, func) {
			var ar = [];
			array.forEach(function (el) {
				if (!!func(el)) ar.push(el);
			});return ar;
		}
	}, {
		key: "style",
		value: function style(dom, property, content) {
			dom.style[this.browser + property.slice(0, 1).toUpperCase() + property.slice(1)] = content;
			dom.style[property] = content;
		}
	}]);

	return cBase;
}();
var cContext = function () {
	/*
  * options:{
  *            "element":element,
  *            "items":[
  *                {"name":"XXX","action":func},
  *                {"name":"XXX","action":func},
  *            ]
  *         }
  */
	function cContext(options) {
		var _this6 = this;

		_classCallCheck(this, cContext);

		if (!options.element) throw new Error("Need a element to bind.");
		this.options = options;
		this.options.element.oncontextmenu = function () {
			return false;
		};
		this.options.element.addEventListener("contextmenu", function (a) {
			_this6.hide();
			_this6.show(a);
			return false;
		});
		document.documentElement.addEventListener("click", function () {
			return _this6.hide();
		});
		return this;
	}

	_createClass(cContext, [{
		key: "add",
		value: function add(_ref2) {
			var name = _ref2.name;
			var action = _ref2.action;

			this.options.items.push({ name: name, action: action });
			return this;
		}
	}, {
		key: "show",
		value: function show(_ref3) {
			var pageX = _ref3.pageX;
			var pageY = _ref3.pageY;

			var content = document.createElement("div");
			content.classList.add("c-context");
			for (var items = this.options.items, i = 0; i < items.length; i++) {
				content.appendChild(document.createElement("div"));
				content.children[i].classList.add("c-context--list");
				content.children[i].innerHTML = items[i].name;
				//content.innerHTML+=`<div class="c-context--list">${items[i].name}</div>`;
				content.children[i].addEventListener("click", items[i].action);
			}
			document.body.appendChild(content);
			//Set the offset-x
			if (document.documentElement.clientWidth > content.offsetWidth) {
				//When the body is wide enough
				content.style.left = document.documentElement.clientWidth > content.offsetWidth + pageX ? pageX + "px" : pageX - content.offsetWidth + "px";
			} else {
				content.style.width = document.documentElement.clientWidth + "px";
			}
			//Set the offset-y
			if (document.documentElement.clientHeight > content.offsetHeight) {
				content.style.top = document.documentElement.clientHeight > content.offsetHeight + pageY ? pageY + "px" : pageY - content.offsetHeight + "px";
			}
			content.style.visibility = "visible";
			return this;
		}
	}, {
		key: "hide",
		value: function hide() {
			for (var list = document.getElementsByClassName("c-context"), i = list.length - 1; i >= 0; i--) {
				document.body.removeChild(list[i]);
			}return this;
		}
	}, {
		key: "items",
		get: function get() {
			return this.options.items;
		},
		set: function set(context) {
			this.options.items = context;
			return this.options.items;
		}
	}]);

	return cContext;
}();
if (window) window.cPlayer = cPlayer;
//# sourceMappingURL=cplayer.js.map
console.log("\n%ccPlayer%cv2.4.7%c\n\n", "padding:7px;background:#cd3e45;font-family:'Sitka Heading';font-weight:bold;font-size:large;color:white", "padding:7px;background:#ff5450;font-family:'Sitka Text';font-size:large;color:#eee", "");
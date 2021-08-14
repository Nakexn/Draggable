(function (window, document) {
  const transform = getTransform();

  function Draggable(selector, options = {}) {
    this.$el = document.querySelector(selector);
    this.$target = options.target ? document.querySelector(options.target) : this.$el;
    this.$container = options.container
      ? document.querySelector(options.container)
      : this.$el.parentNode;
    this.originX = 0;
    this.originY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  Draggable.prototype.init = function () {
    this.setDrag();
  };

  Draggable.prototype.setDrag = function () {
    var self = this;
    this.$target.addEventListener('mousedown', start, false);
    this.$target.addEventListener('mouseover', over, false);
    function start(event) {
      self.mouseX = event.pageX;
      self.mouseY = event.pageY;

      var pos = self.getPosition();

      self.originX = pos.x;
      self.originY = pos.y;

      document.addEventListener('mousemove', move, false);
      document.addEventListener('contextmenu', rightClick, false);
      document.addEventListener('mouseup', end, false);
    }
    function over(event) {
      self.$target.style.cursor = 'move';
    }

    function move(event) {
      var currentX = event.pageX;
      var currentY = event.pageY;

      var distanceX = currentX - self.mouseX;
      var distanceY = currentY - self.mouseY;

      self.setPostion({
        x: (self.originX + distanceX).toFixed(),
        y: (self.originY + distanceY).toFixed()
      });
    }
    function rightClick(event) {
      event.preventDefault();
    }

    function end(event) {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('contextmenu', rightClick);
    }
  };

  Draggable.prototype.getStyle = function (property) {
    return document.defaultView.getComputedStyle
      ? document.defaultView.getComputedStyle(this.$el, false)[property]
      : this.$el.currentStyle[property];
  };

  Draggable.prototype.getPosition = function () {
    var pos = { x: 0, y: 0 };
    if (transform) {
      var transformValue = this.getStyle(transform);
      if (transformValue == 'none') {
        this.$el.style[transform] = 'translate(0, 0)';
      } else {
        var temp = transformValue.match(/-?\d+/g);
        pos = {
          x: parseInt(temp[4].trim()),
          y: parseInt(temp[5].trim())
        };
      }
    } else {
      if (this.getStyle('position') == 'static') {
        this.$el.style.position = 'relative';
      } else {
        pos = {
          x: parseInt(this.getStyle('left') ? this.getStyle('left') : 0),
          y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0)
        };
      }
    }

    return pos;
  };

  Draggable.prototype.setPostion = function (pos) {
    if (transform) {
      this.$el.style[transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
    } else {
      this.$el.style.left = pos.x + 'px';
      this.$el.style.top = pos.y + 'px';
    }
  };

  function getTransform() {
    var transform = '',
      divStyle = document.createElement('div').style,
      _transforms = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
      i = 0,
      len = _transforms.length;

    for (; i < len; i++) {
      if (_transforms[i] in divStyle) {
        // 找到之后立即返回，结束函数
        return (transform = _transforms[i]);
      }
    }

    // 如果没有找到，就直接返回空字符串
    return transform;
  }

  window.Draggable = Draggable;
})(window, document);

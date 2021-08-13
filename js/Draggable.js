(function (root) {
  function Draggable(el, options = {}) {
    this.$el = document.querySelector(el);
    this.$target = document.querySelector(`${el} ${options.target}`) || this.$el;
    this.$container =
      document.querySelector(options.container) || this.$el.parentNode || document.documentElement;
    this.resize = options.resize ? options.resize : null;
    this.init();
  }

  Draggable.prototype.init = function () {
    this.setAttribute();
    if (this.resize) {
      this.createOperator();
    }
    this.listenEvent();
  };
  Draggable.prototype.setAttribute = function () {
    const $container = this.$container;
    const $el = this.$el;
    $container.style.position = 'relative';
    $el.style.overflow = 'hidden';
    $el.style.position = 'absolute';
    this.containerWidth = $container.clientWidth;
    this.containerHeight = $container.clientHeight;
    this.containerLeft = $container.offsetLeft;
    this.containerTop = $container.offsetTop;
  };

  Draggable.prototype.createOperator = function () {
    const $el = this.$el;
    const charArray = ['t', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br'];
    let operatorArray = [];

    charArray.forEach(item => {
      let $span = document.createElement('span');
      $span.className = item;
      $span.style.position = 'absolute';
      $span.style.boxSizing = 'border-box';
      if (item.length === 1) {
        $span.style.background = 'transparent';
        if (item === 't') {
          $span.style.height = '10px';
          $span.style.width = '100%';
          $span.style.top = '0px';
        }
        if (item === 'r') {
          $span.style.height = '100%';
          $span.style.width = '10px';
          $span.style.top = '0px';
          $span.style.right = '0px';
        }
        if (item === 'b') {
          $span.style.height = '10px';
          $span.style.width = '100%';
          $span.style.bottom = '0px';
        }
        if (item === 'l') {
          $span.style.height = '100%';
          $span.style.width = '10px';
          $span.style.top = '0px';
          $span.style.left = '0px';
        }
      }
      if (item.length === 2) {
        $span.style.width = '16px';
        $span.style.height = '16px';
        $span.style.border = '1px solid #ccc';
        $span.style.background = 'yellow';
        if (item === 'tl') {
          $span.style.top = '-5px';
          $span.style.left = '-5px';
        }
        if (item === 'tr') {
          $span.style.top = '-5px';
          $span.style.right = '-5px';
        }
        if (item === 'bl') {
          $span.style.bottom = '-5px';
          $span.style.left = '-5px';
        }
        if (item === 'br') {
          $span.style.bottom = '-5px';
          $span.style.right = '-5px';
        }
      }
      $span.onmousedown = e => {
        e.preventDefault();
        e.stopPropagation();
        const $el = this.$el;
        const $span = e.target;

        let oldWidth = $el.offsetWidth;
        let oldHeight = $el.offsetHeight;
        let oldX = e.pageX;
        let oldY = e.pageY;
        let oldLeft = $el.offsetLeft;
        let oldTop = $el.offsetTop;

        root.onmousemove = e => {
          if ($span.className == 'tl') {
            $el.style.width = oldWidth - (e.pageX - oldX) + 'px';
            $el.style.height = oldHeight - (e.pageY - oldY) + 'px';
            $el.style.left = oldLeft + (e.pageX - oldX) + 'px';
            $el.style.top = oldTop + (e.pageY - oldY) + 'px';
          } else if ($span.className == 'bl') {
            $el.style.width = oldWidth - (e.pageX - oldX) + 'px';
            $el.style.height = oldHeight + (e.pageY - oldY) + 'px';
            $el.style.left = oldLeft + (e.pageX - oldX) + 'px';
            $el.style.bottom = oldTop + (e.pageY + oldY) + 'px';
          } else if ($span.className == 'tr') {
            $el.style.width = oldWidth + (e.pageX - oldX) + 'px';
            $el.style.height = oldHeight - (e.pageY - oldY) + 'px';
            $el.style.right = oldLeft - (e.pageX - oldX) + 'px';
            $el.style.top = oldTop + (e.pageY - oldY) + 'px';
          } else if ($span.className == 'br') {
            $el.style.width = oldWidth + (e.pageX - oldX) + 'px';
            $el.style.height = oldHeight + (e.pageY - oldY) + 'px';
            $el.style.right = oldLeft - (e.pageX - oldX) + 'px';
            $el.style.bottom = oldTop + (e.pageY + oldY) + 'px';
          } else if ($span.className == 't') {
            $el.style.height = oldHeight - (e.pageY - oldY) + 'px';
            $el.style.top = oldTop + (e.pageY - oldY) + 'px';
          } else if ($span.className == 'b') {
            $el.style.height = oldHeight + (e.pageY - oldY) + 'px';
            $el.style.bottom = oldTop - (e.pageY + oldY) + 'px';
          } else if ($span.className == 'l') {
            $el.style.height = oldHeight + 'px';
            $el.style.width = oldWidth - (e.pageX - oldX) + 'px';
            $el.style.left = oldLeft + (e.pageX - oldX) + 'px';
          } else if ($span.className == 'r') {
            $el.style.height = oldHeight + 'px';
            $el.style.width = oldWidth + (e.pageX - oldX) + 'px';
            $el.style.right = oldLeft - (e.pageX - oldX) + 'px';
          }
          this.handleOverBoundary();
        };
        root.onmouseup = e => {
          root.onmousemove = null;
          root.onmouseup = null;
        };
      };
      operatorArray.push($span);
    });

    operatorArray.forEach(item => {
      $el.appendChild(item);
    });
  };

  Draggable.prototype.listenEvent = function () {
    const $target = this.$target;
    const $el = this.$el;
    $target.onmousedown = e => {
      e.preventDefault();
      e.stopPropagation();

      const distanceX = e.pageX - $el.offsetLeft;
      const distanceY = e.pageY - $el.offsetTop;

      root.onmousemove = e => {
        $el.style.left = e.pageX - distanceX + 'px';
        $el.style.top = e.pageY - distanceY + 'px';
        this.handleOverBoundary();
      };

      root.onmouseup = e => {
        root.onmousemove = null;
        root.onmouseup = null;
      };
    };

    $target.onmouseenter = e => {
      $target.style.cursor = 'move';
    };

    root.onresize = e => {
      this.setAttribute();
    };
  };

  Draggable.prototype.handleOverBoundary = function () {
    const $el = this.$el;
    const top = $el.offsetTop;
    const right = this.containerWidth - $el.offsetLeft - $el.clientWidth;
    const bottom = this.containerHeight - $el.offsetTop - $el.clientHeight;
    const left = $el.offsetLeft;
    if (top < 0) {
      $el.style.top = '0px';
    }
    if (right < 0) {
      $el.style.left = `${this.containerWidth - $el.clientWidth}px`;
    }
    if (bottom < 0) {
      $el.style.top = `${this.containerHeight - $el.clientHeight}px`;
    }
    if (left < 0) {
      $el.style.left = `0px`;
    }
  };

  if (!root.Draggable) {
    root.Draggable = Draggable;
  }
})(window);

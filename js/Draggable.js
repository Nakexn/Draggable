(function (root) {
  function Draggable(el, options = {}) {
    this.$el = document.querySelector(el);
    this.$target = document.querySelector(`${el} ${options.target}`) || this.$el;
    this.$container = document.querySelector(options.container) || document.documentElement;
    this.resize = options.resize || true;
    this.init();
  }

  Draggable.prototype.init = function () {
    this.setAttribute();
    if (this.resize) {
      this.setOperator();
    }
    this.listenEvent();
  };
  Draggable.prototype.setAttribute = function () {
    const $container = this.$container;
    const $el = this.$el;
    $container.style.position = 'relative';
    $el.style.position = 'absolute';
    this.containerWidth = $container.clientWidth;
    this.containerHeight = $container.clientHeight;
    this.containerLeft = $container.offsetLeft;
    this.containerTop = $container.offsetTop;
  };

  Draggable.prototype.setOperator = function () {};

  Draggable.prototype.listenEvent = function () {
    const $target = this.$target;
    const $el = this.$el;
    $target.onmousedown = e => {
      e.preventDefault();
      e.stopPropagation();

      const distanceX = e.clientX - $el.offsetLeft;
      const distanceY = e.clientY - $el.offsetTop;

      root.onmousemove = e => {
        $el.style.left = e.clientX - distanceX + 'px';
        $el.style.top = e.clientY - distanceY + 'px';
        this.handleOverBoundary();
      };

      root.onmouseup = e => {
        root.onmousemove = null;
        root.onmouseup = null;
      };
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

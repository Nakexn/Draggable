(function () {
  const re = /\(([^)]*)\)/;

  function Draggable(el, options = {}) {
    this.$el = document.querySelector(el);
    this.$target = this.$el;
    this.$container = document.documentElement;
    this.originX = 0;
    this.originY = 0;
    this.mouseX = null;
    this.mouseY = null;
    if (options.container) {
      this.$container = document.querySelector(options.container);
    }
    if (options.target) {
      this.$target = document.querySelector(`${el} ${options.target}`);
    }
    this.maxLeft = this.$container.offsetLeft - this.$el.offsetLeft;
    this.maxRight =
      this.$container.offsetLeft +
      this.$container.clientWidth -
      this.$el.offsetLeft -
      this.$el.clientWidth;
    this.maxTop = this.$container.offsetTop;
    this.maxBottom = this.$container.offsetTop + this.$container.clientHeight;
    this.$container.style.overflow = 'hidden';
    this.rect = this.$el.getBoundingClientRect();
    this.handleMouseMove = handleMouseMove.bind(this);
    this.init();
  }

  Draggable.prototype.init = function () {
    this.$target.addEventListener('mouseover', handleMouseOver.bind(this));
    this.$target.addEventListener('mousedown', handleMouseDown.bind(this));
    this.$el.addEventListener('contextmenu', e => {
      e.preventDefault();
    });
    // this.$target.addEventListener('mouseup', handleEnd.bind(this));
    window.addEventListener('mouseup', handleEnd.bind(this));
    window.addEventListener('mouseleave', handleEnd.bind(this));
  };

  function handleMouseOver(e) {
    this.$target.style.cursor = 'move';
  }

  function handleMouseDown(e) {
    e.preventDefault();

    if (e.button === 0) {
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
      window.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  function handleMouseMove(e) {
    e.preventDefault();

    const offsetX = e.pageX - this.mouseX;
    const offsetY = e.pageY - this.mouseY;

    if (
      this.originX + offsetX < this.maxLeft ||
      this.originX + offsetX > this.maxRight ||
      this.originY + offsetY + this.$el.offsetTop < this.maxTop ||
      this.originY + offsetY + this.$el.offsetTop + this.$el.clientHeight > this.maxBottom
    ) {
      let overX = this.originX + offsetX,
        overY = this.originY + offsetY;
      if (this.originX + offsetX < this.maxLeft) {
        overX = this.maxLeft;
      }
      if (this.originX + offsetX > this.maxRight) {
        overX = this.maxRight;
      }
      if (this.originY + offsetY + this.$el.offsetTop < this.maxTop) {
        overY = this.$container.offsetTop - this.$el.offsetTop;
      }
      if (this.originY + offsetY + this.$el.offsetTop + this.$el.clientHeight > this.maxBottom) {
        overY =
          this.$container.offsetTop +
          this.$container.clientHeight -
          this.$el.offsetTop -
          this.$el.clientHeight;
      }
      this.$el.style.transform = `translate(${overX}px,${overY}px)`;
    } else {
      this.$el.style.transform = `translate(${this.originX + offsetX}px,${
        this.originY + offsetY
      }px)`;
    }
  }

  function handleEnd(e) {
    e.preventDefault();

    const computedStyle = window.getComputedStyle(this.$el).transform.match(re);

    if (computedStyle) {
      const matrix = computedStyle[1];
      const originX = matrix.split(', ')[4];
      const originY = matrix.split(', ')[5];

      this.originX = parseFloat(originX);
      this.originY = parseFloat(originY);
    }

    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  window.Draggable = Draggable;
})();

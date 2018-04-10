(function (window, document) {
  var currentPosition = 0;
  var currentPoint = -1;
  var pageNow = 1;
  var points = null;
  var app = {
    init: function () {
      document.addEventListener('DOMContentLoaded', function () {
        points = document.querySelectorAll('.page-view');
        app.bindTouchEvent();
        app.setPageNow();
      }.bind(app), false);
    }(),
    transform: function (translate) {
      this.style.webkitTransform = "translate3d(0," + translate + "px,0)";
      currentPosition = translate;
    },
    setPageNow: function () {
      currentPoint = pageNow - 1;
    },
    bindTouchEvent: function () {
      var viewport = document.querySelector('#viewport');
      var pageHeight = window.innerHeight;
      var maxHeight = -pageHeight * (points.length - 1);
      var startX, startY;
      var initialPos = 0;
      var moveLength = 0;
      var direction = "top";
      var isMove = false;
      var startT = 0;
      var isTouchEnd = true;
      document.addEventListener("touchstart", function (e) {
        if (e.touches.length === 1 || isTouchEnd) {
          var touch = e.touches[0];
          startX = touch.pageX;
          startY = touch.pageY;
          initialPos = currentPosition;
          viewport.style.webkitTransition = "";
          startT = new Date().getTime();
          isMove = false;
          isTouchEnd = false;
        }
      }.bind(this), false);
      document.addEventListener("touchmove", function (e) {
        if (isTouchEnd) return;
        var touch = e.touches[0];
        var deltaX = touch.pageX - startX;
        var deltaY = touch.pageY - startY;
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          moveLength = deltaY;
          var translate = initialPos + deltaY;
          if (translate <= 0 && translate >= maxHeight) {
            this.transform.call(viewport, translate);
            isMove = true;
          }
          direction = deltaY > 0 ? "bottom" : "top";
        }
      }.bind(this), false);
      document.addEventListener("touchend", function (e) {
        var translate = 0;
        var deltaT = new Date().getTime() - startT;
        if (isMove && !isTouchEnd) {
          isTouchEnd = true;
          viewport.style.webkitTransition = "0.3s ease -webkit-transform";
          if (deltaT < 300) {
            translate = direction === 'top' ? currentPosition - (pageHeight + moveLength) : currentPosition + pageHeight - moveLength;
            translate = translate > 0 ? 0 : translate;
            translate = translate < maxHeight ? maxHeight : translate;
          } else {
            if (Math.abs(moveLength) / pageHeight < 0.5) {
              translate = currentPosition - moveLength;
            } else {
              translate = direction === 'top' ? currentPosition - (pageHeight + moveLength) : currentPosition + pageHeight - moveLength;
              translate = translate > 0 ? 0 : translate;
              translate = translate < maxHeight ? maxHeight : translate;
            }
          }
          this.transform.call(viewport, translate);
          pageNow = Math.round(Math.abs(translate) / pageHeight) + 1;
          setTimeout(function () {
            this.setPageNow();
          }.bind(this), 100);
        }
      }.bind(this), false);
    }
  }
})(window, document);

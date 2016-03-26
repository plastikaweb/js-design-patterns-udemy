(function (win, $) {
    function clone(src, out) {
        for (var attr in src.prototype) {
            out.prototype[attr] = src.prototype[attr];
        }
    }

    //CIRCLE
    function Circle() {
        this.item = $('<div class="circle"></div>');
    }

    Circle.prototype.move = function (left, top) {
        this.item.css('left', left);
        this.item.css('top', top);
    };
    Circle.prototype.color = function (color) {
        this.item.css('background', color);
    };
    Circle.prototype.get = function () {
        return this.item;
    };

    //RECTANGLE
    function Rect() {
        this.item = $('<div class="rect"></div>');
    }

    clone(Circle, Rect);

    //DESCTRUCT DECORATOR
    function selfDestructDecorator(obj) {
        obj.item.click(function() {
            obj.kill();
        });
        obj.kill = function() {
            obj.item.remove();
        }
    }

    //RED CIRCLE
    function RedCircleBuilder() {
        this.item = new Circle();
        this.init();
    }

    RedCircleBuilder.prototype.init = function () {

    };
    RedCircleBuilder.prototype.get = function () {
        return this.item;
    };
    //BLUE CIRCLE
    function BlueCircleBuilder() {
        this.item = new Circle();
        this.init();
    }

    BlueCircleBuilder.prototype.init = function () {
        this.item.color('blue');
        var rect = new Rect();
        rect.color('yellow');
        rect.move(40, 40);
        selfDestructDecorator(rect);
        this.item.get().append(rect.get());
    };
    BlueCircleBuilder.prototype.get = function () {
        return this.item;
    };

    //SHAPE FACTORY
    var ShapeFactory = function () {
        this.types = {};
        this.create = function (type) {
            return new this.types[type]().get();
        };
        this.register = function (type, cls) {
            if (cls.prototype.init && cls.prototype.get) {
                this.types[type] = cls;
            }
        };
    };
    //STAGE ADAPTER
    function StageAdapter(id) {
        this.index = 0;
        this.context = $(id);
    }

    StageAdapter.prototype.SIG = 'stageItem_';
    StageAdapter.prototype.add = function (item) {
        ++this.index;
        item.addClass(this.SIG + this.index);
        this.context.append(item);
    };
    StageAdapter.prototype.remove = function (index) {
        this.context.remove('.' + this.SIG + index);
    };

    function CompositeController(arr) {
        this.arr = arr;
    }
    CompositeController.prototype.action = function(act) {
        var args = Array.prototype.slice.call( arguments);
        args.shift();
      for(var item in this.arr) {
          this.arr[item][act].apply(this.arr[item], args);
      }
    };

    //SINGLETON GENERATOR
    var CircleGeneratorSingleton = (function () {
        var instance;

        function init() {
            var _aCircle = [],
              _stage,
              _sf = new ShapeFactory(),
              _cc = new CompositeController(_aCircle);

            function registerShape(name, cls) {
                _sf.register(name, cls);
            }

            function setStage(stg) {
                _stage = stg;
            }

            function _position(circle, left, top) {
                circle.move(left, top);
            }

            function create(left, top, type) {
                var circle = _sf.create(type);
                circle.move(left, top);
                return circle;
            }
            function tint(clr) {
                _cc.action('color', clr);
            }
            function move(left, top) {
                _cc.action('move', left, top);
            }
            function add(circle) {
                _stage.add(circle.get());
                _aCircle.push(circle);
            }

            function index() {
                return _aCircle.length;
            }

            return {
                index: index,
                create: create,
                add: add,
                register: registerShape,
                setStage: setStage,
                tint: tint,
                move: move
            };
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = init();
                }
                return instance;
            }
        };
    })();

    $(win.document).ready(function () {
        var cg = CircleGeneratorSingleton.getInstance();
        cg.register('red', RedCircleBuilder);
        cg.register('blue', BlueCircleBuilder);
        cg.setStage(new StageAdapter('.advert'));
        $('.advert').click(function (e) {
            var circle = cg.create(e.pageX - 25, e.pageY - 25, 'blue');
            cg.add(circle);
        });
        $(win.document).keypress(function (e) {
            if (e.key === 'r') {
                var circle = cg.create(Math.floor(Math.random() * 600),
                  Math.floor(Math.random() * 600), 'red');
                cg.add(circle);
            } else if(e.key === 'b') {
                cg.tint('black');
            } else if(e.key === 'a') {
                cg.move('-=5px', '+=0px');
            }else if(e.key === 's') {
                cg.move('+=5px', '+=0px');
            }

        });

    });

})(window, jQuery);
(function () {
    var URL = window.URL || window.webkitURL;
    var pointsData = [];
    var $el = {};
    var img, sprite, zoomSprite;
    $el.win = $(window);
    $el.wrapper = $('.wrapper');
    $el.main = $('#main');
    $el.zoom = $('#zoom');
    $el.file = $('#file');
    $el.getjsonBtn = $('#getjson');

    var onInputFile = function onInputFileFn(e) {
        var file = e.target.files[0];
        var objUrl = URL.createObjectURL(file);
        loadFile(objUrl);
    };

    var loadFile = function loadFileFn(url) {
        img = document.createElement('img');
        img.onload = function () {
            assetsLoad(url);
        };
        img.src = url;
    };

    var assetsLoad = function assetsLoadFn(url) {
        var isOne = true;
        var oldPoint = null;
        sprite = PIXI.Sprite.fromImage(url);
        zoomSprite = PIXI.Sprite.fromImage(url);
        sprite.position.set(100, 100);
        graphics.position.set(100, 100);

        sprite.hitArea = new PIXI.Rectangle(0, 0, img.width, img.height);
        sprite.interactive = true;

        zoomSprite.scale.set(4);

        stage.addChildAt(sprite, 0);
        stage.addChildAt(graphics, 1);

        zoomStage.addChildAt(zoomSprite, 0);
        zoomStage.addChildAt(zoomCenter, 1);

        sprite.on('click', function (e) {
            var res = e.data.getLocalPosition(sprite);
            graphics.beginFill(0xFF0000);
            if (isOne) {
                oldPoint = {
                    x: res.x,
                    y: res.y
                };
                isOne = false;
            } else {
                graphics.lineStyle(1, 0xFF9090, 0.4);
                graphics.moveTo(oldPoint.x, oldPoint.y);
                graphics.lineTo(res.x, res.y);
                oldPoint = {
                    x: res.x,
                    y: res.y
                };
            }
            graphics.lineStyle(1, 0xFF0000, 1);
            graphics.drawRoundedRect(res.x, res.y, 1, 1, 0.4);
            pointsData.push({
                x: res.x,
                y: res.y
            });
            graphics.endFill();
        });
        sprite.on('mousemove', function (e) {
            var res = e.data.getLocalPosition(sprite);
            if (res.x < 0 || res.x > sprite.width || res.y < 0 || res.y > sprite.height) {
                return false;
            }
            zoomSprite.position.set(-res.x * 4 + 200, -res.y * 4 + 200);
        });
    };

    $el.file.on('change', onInputFile);

    $el.wrapper.on('touchmove', function (e) {
        e.preventDefault();
    });

    PIXI.utils._saidHello = true;

    var zoomBox = new PIXI.autoDetectRenderer(400, 400, {
        view: $el.zoom.get(0),
        transparent: true
    });

    var renderer = new PIXI.autoDetectRenderer(600, 600, {
        view: $el.main.get(0),
        transparent: true
    });

    var stage = new PIXI.Container();
    var zoomStage = new PIXI.Container();

    var graphics = new PIXI.Graphics();
    var zoomCenter = new PIXI.Graphics();

    zoomCenter.lineStyle(1, 0xFF0000, 1);
    zoomCenter.moveTo(0, 200);
    zoomCenter.lineTo(400, 200);
    zoomCenter.moveTo(200, 0);
    zoomCenter.lineTo(200, 400);

    var title = new PIXI.Text('一个用于勾勒PIXI多边形的工具.!');
    title.x = 60;
    title.y = 30;

    stage.addChild(title);

    var animate = function animateFn() {
        requestAnimationFrame(animate);
        renderer.render(stage);
        zoomBox.render(zoomStage);
    };

    requestAnimationFrame(animate);

    var getJson = function getJsonFn() {
        var json = JSON.stringify(pointsData);
        var date = new Date();
        var file = new File([json], "filename.txt", {type: "text/plain", lastModified: date});
        var down = new DownloadManager();
        down.download(file, null, 'polygon.json');
    };

    $el.getjsonBtn.on('click', getJson);

    var debug = function debugFn() {
        window.sprite = sprite;
        window.zoomSprite = zoomSprite;
        loadFile('./assets/images/mybsd.png');
    };
    window.debug = debug;
})();
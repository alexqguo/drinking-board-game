'use strict';

(function () {
    function fetchImage(src) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.src = src;
            img.addEventListener('load', function () {
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.style.background = "url(" + imgSrc + ")";
                canvas.style.backgroundSize = '100% 100%';
                resolve();
            });
        });
    }
    function fetchBoard(src) {
        return new Promise(function (resolve) {
            fetch(src)
                .then(function (resp) { return resp.json(); })
                .then(function (data) { return resolve(data); });
        });
    }
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var imgSrc = 'public/pokemon/index.png';
    var boardSrc = 'public/pokemon/index.json';
    Promise.all([fetchImage(imgSrc), fetchBoard(boardSrc)])
        .then(function (values) {
        ctx.fillStyle = 'red';
        var boardJson = values[1];
        var tilesWithPosition = boardJson.tiles.filter(function (tile) { return !!tile.position; });
        tilesWithPosition.forEach(function (tile) {
            tile.position.forEach(function (pos) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2, true);
                ctx.fill();
            });
        });
        window.pos = tilesWithPosition[tilesWithPosition.length - 1].position;
        window.getNext = function (x) {
            var positions = [];
            var _loop_1 = function (i) {
                positions.push(window.pos.map(function (p) {
                    return {
                        x: p.x + ((187 * i) + 2),
                        y: p.y
                    };
                }));
            };
            for (var i = 1; i <= x; i++) {
                _loop_1(i);
            }
            console.log(JSON.stringify(positions));
        };
    })["catch"](function (err) { return console.error(err); });
}());

$(function() {

    $flatqty = $('.flat-qty1');
    $fqty = $('.flatqty');








    var flats;


    var countFlat = function(etazh) {
        var flatQt = 0;
        for (flat in flats) {
            flatQt += (flats[flat].etazh == etazh && flats[flat].status == 1) ? 1 : 0;
        }

        return flatQt;

    };

    $.ajaxSetup({
        async: false,
        cache: false
    });

    $.getJSON('./js/flats.json?v=12', {}, function(json) { // загрузку JSON данных из файла example.json
        flats = json;
    });

    $.ajaxSetup({
        async: true
    });

    //функция заполнения поп окна
    var fillPop = function(obj) {
        $flatHead.text(" Этаж: " + obj.etazh + " - (" + flatType[obj.ftype].desc + obj.name + ")");
        $flatPlanImg.attr('src', '');
        $flatPlanImg.css({ 'opacity': 0 });

        var opacity = (obj.etazh != 'P') ? 1 : 0;
        var display = (obj.etazh != 'P') ? 'inline-block' : 'none';
        $('.desc table tbody tr').css('opacity', opacity);
        $('.desc table tbody tr:first-child').css('opacity', 1);
        $('.pic-head ul > li:nth-child(2)').css('display', display);
        $detail.css('display', display);
        $('.splan').css('opacity', opacity);

        $fArea.html(flatType[obj.ftype].area);
        $fQty.html(obj.number);
        $sQty.html(flatType[obj.ftype].sQty);
        $fView.html(flatType[obj.ftype].view);

        $btnShema.attr('data-rel', '');
        $btnShema1.attr('data-rel', '');
        $btnTrd.attr('data-rel', '');

        $('#popup .pic-head li').removeClass('active');
        $('#popup .pic-head li:first-child').addClass('active');
        $bigTrd1.css('display', 'none');

        $btnShema.attr('data-rel', 'plan/' + flatType[obj.ftype].imgShema + '.png');
        $btnShema1.attr('data-rel', 'freeplan/' + flatType[obj.ftype].imgShema + '.png');
        $btnTrd.attr('data-rel', 'trd/' + flatType[obj.ftype].imgShema + '.png');
        $bigTrd.attr('src', 'img/trdbig/' + flatType[obj.ftype].imgShema + '.jpg');
        $imgSPlan.attr('src', 'img/splan/' + flatType[obj.ftype].imgShema + '.png');

        $flatPlanImg.attr('src', 'img/plan/' + flatType[obj.ftype].imgShema + '.png');
        $detail.attr('href', 'files/pdf/' + flatType[obj.ftype].imgShema + '.pdf');

        $flatPlanImg.imagesLoaded(function() {
            $flatPlanImg.animate({ 'opacity': 1 }, 300);
        });
    };

    //переменные поп-окна
    var $flatHead = $('#flat-head'),
        $flatPlanImg = $('#flatplan'),
        $fArea = $('#area'),
        $fQty = $('#fqty'),
        $sQty = $('#sqty'),
        $fView = $('#view'),
        $btnShema = $('#button-shema'),
        $btnShema1 = $('#button-shema1'),
        $btnTrd = $('#button-trd'),
        $bigTrd = $('#pictrd'),
        $bigTrd1 = $('.big-trd'),
        $imgSPlan = $('#img-splan'),
        $level = $('#level'),
        $detail = $('#detail');




    var $output = $('#info');
    var $no = $('#flat-no');
    var $number = $('#qty-flat');
    var $area = $('#capacity');
    var $status = $('#status');
    var $imgPlan = $('#img-plan-img');
    var $imgPlanBack = $('#img-plan');
    var currentEtazh = localStorage.getItem('curEtazh') || 3;
    var $etazhdecs = $('#etazhdecs');

    //обработка клика на level

    $level.on('click', function() {
        var levelflat = $(this).attr('href');
        var curFlat = flats[levelflat];

        fillPop(curFlat);

        $(this).attr('href', curFlat.level);
        $(this).html(curFlat.levelc);

    });


    //рисуем области квартир

    var r = Raphael('flatarea', 969, 424),
        attributes = {
            'fill': '#f2f2f2',
            'stroke-width': 0,
            'opacity': 0
        };

    //обработка кликов по этажам

    $('.etazh li').on('click', function(e) {
        currentEtazh = $(this).find('a').text();
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        $etazhdecs.css('opacity', 0).text(etazhi[currentEtazh].desc).animate({ 'opacity': 1 }, 300);

        r.clear();

        $imgPlan.animate({ 'opacity': 0 }, 0);
        $imgPlan.attr('src', '');

        $imgPlan.attr('src', 'img/etazh/' + etazhi[currentEtazh].img + '.png').imagesLoaded(function() {
            $imgPlan.animate({ 'opacity': 1 }, 300, drowPoly(currentEtazh));

        });
    });


    //обработка клика переключения планов

    $('#popup .pic-head li').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('active')) { return; }
        var curDir = $(this).find('a').attr('data-rel');
        var display = ($(this).find('a').attr('id') === 'button-trd') ? 'block' : 'none';
        $(this).addClass('active').siblings().removeClass('active');

        $flatPlanImg.attr('src', '');
        $flatPlanImg.css({ 'opacity': 0 });

        $flatPlanImg.attr('src', 'img/' + curDir);



        $flatPlanImg.imagesLoaded(function() {
            $bigTrd1.css('display', display);
            $flatPlanImg.animate({ 'opacity': 1 }, 300);
        });
    });

    //обработка наведения на 3d

    $bigTrd1.on('mouseover', function() {
        $bigTrd.imagesLoaded(function() {
            $bigTrd.animate({ 'opacity': 1 }, 300);
        });
    });



    $bigTrd1.on('mouseout', function() {
        $bigTrd.animate({ 'opacity': 0 }, 300);
    });

    // движение мыши на 3d

    $bigTrd1.mousemove(function(e) {
        var pageCoords = "( " + e.pageX + ", " + e.pageY + " )";
        var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
        var imgX = (+e.pageX - $(this).offset().left) * 1.4 * -1;
        var imgY = (+e.pageY - $(this).offset().top) * 1.4 * -1;
        $bigTrd.css({
            'left': imgX,
            'top': imgY
        });
    });

    //функция площади квартир
    var drowPoly = function(etazh) {
        var etazh = etazh || 3;

        for (var flat in flats) {
            if (flats[flat].etazh == etazh) {
                var obj = r.path(flatType[flats[flat].ftype].path);

                if (flats[flat].status !== 1) {
                    // attributes.fill = '#000000';
                    var x = flatType[flats[flat].ftype].x;
                    var y = flatType[flats[flat].ftype].y;
                    var reserved = (etazh != 'P') ? 'ПРОДАНО' : '';
                    var t = r.text(x, y, reserved).attr({ "fill": "#dddddd", 'font-family': 'Verdana' });;

                    attributes.fill = 'url(../img/strip.png)';
                    attributes.opacity = 1;
                    attributes.cursor = 'auto';
                } else {
                    attributes.opacity = 0;
                    attributes.cursor = 'pointer';
                }
                obj.attr(attributes);
                if (flats[flat].status === 1) {
                    obj.name = flats[flat].name;
                    obj.ftype = flats[flat].ftype;
                    obj.desc = flatType[flats[flat].ftype].desc;
                    obj.etazh = flats[flat].etazh;
                    obj.number = flats[flat].number;
                    obj.area = flatType[flats[flat].ftype].area;
                    obj.status = flats[flat].status;
                    obj.imgShema = flatType[flats[flat].ftype].imgShema;
                    obj.view = flatType[flats[flat].ftype].view;
                    obj.sQty = flatType[flats[flat].ftype].sQty;
                    obj.level = flats[flat].level;
                    obj.levelc = flats[flat].levelc;



                    //обработка наведения на квартиру
                    obj.hover(function() {
                        var caption = (etazh == 'P') ? 'Место' : "Комнат";
                        var edizm = (etazh == 'P') ? '' : " м²";
                        $no.html('№ ' + this.name);
                        $number.html(caption + ': ' + this.number);
                        $area.html(this.area + edizm);
                        // $status.html(status[this.status-1]);

                        this.animate({
                            'fill': '#F7931E',
                            'opacity': 0.5
                        }, 200, 'easyIn');
                        $output.animate({ 'opacity': 1 }, 100);

                    }, function() {
                        this.animate({
                            'opacity': 0
                        }, 200);
                        $output.animate({ 'opacity': 0 }, 100);
                    });

                    //обработка клика на квартире
                    obj.click(function() {
                        fillPop(this); //заполнение pop-окна

                        var $bPopUp = $('#popup').bPopup();

                        if (this.level) {
                            $level.css('display', 'block');
                            $level.attr('href', this.level);
                            $level.html(this.levelc);
                        } else {
                            $level.css('display', 'none');
                        }

                        $imgSPlan.imagesLoaded(function() {
                            $imgSPlan.animate({ 'opacity': 1 }, 300);
                        });

                        $flatPlanImg.imagesLoaded(function() {
                            $flatPlanImg.animate({ 'opacity': 1 }, 300);
                        });

                        $('.close').on('click', function() {
                            $bigTrd.attr('src', '');
                            $bPopUp.close();
                        });

                    });
                }
            }
        }
    };

    //установка выбранного этажа
    $('ul.etazh li').each(function(item) {
        $(this).removeClass('active');
        if ($(this).find('a').text() == currentEtazh) {
            $(this).addClass('active');
        }
    });

    $etazhdecs.css('opacity', 0).text(etazhi[currentEtazh].desc).animate({ 'opacity': 1 }, 300);

    $imgPlan.css('opacity', 0);
    $imgPlan.attr('src', 'img/etazh/' + etazhi[currentEtazh].img + '.png').imagesLoaded(function() {
        $imgPlan.animate({ 'opacity': 1 }, 300, drowPoly(currentEtazh));
    });

    $('.etazh li a').mouseover(function() {
        var flatType = "Квартир";
        if ($(this).text() == 'P') flatType = "Машиномест";
        $flatqty.css('display', 'block');
        $fqty.text(countFlat($(this).text()));

        $('.type-area').text(flatType);
    }).mouseout(function() {
        $flatqty.css('display', 'none');
    });

    $(document).mousemove(function(e) {
        $flatqty.css({ 'top': e.pageY - 20 + 'px', 'left': e.pageX + 50 + 'px' });
    });

});
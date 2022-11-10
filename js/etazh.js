$(function() {

  var flats;

  $.ajaxSetup({
      async: false,
      cache: false
  });

 $.getJSON('/js/flats.json', {}, function(json){  // загрузку JSON данных из файла example.json  
      flats = json;     
  });

 $.ajaxSetup({
      async: true
  });







  var $popup = $('#etazhinfo');
  var $etazhCaption = $('#etazh-no');
  var $flatQty = $('#fqty1');
  var $flatCpt = $('#fqtycap');
  $(document).mousemove(function(e){
      $popup.css({'top' : e.pageY - 60 + 'px', 'left' : e.pageX + 20 + 'px'});
  });

  var r = Raphael('etazhArea',  1125, 750),
  attributes = {
    'fill':'#405C67'
    ,'stroke-width':0
    ,'opacity':0
    ,'cursor':'pointer'
  };

  var countFlat = function(etazh) {
    var flatQt = 0;
    for (flat in flats) {
      flatQt += (flats[flat].etazh == etazh && flats[flat].status == 1 ) ? 1 : 0;
    }    

    return flatQt;

  };


  


	var drowPolyetazh = function() {

    for (var etazh in etazhi) {       
        var obj = r.path(etazhi[etazh].path);
        obj.attr(attributes);
        obj.etazh = etazhi[etazh].name;
        obj.freeflat = countFlat(etazhi[etazh].name); 
        obj.flqtycap = (etazhi[etazh].name != 'P') ? 'квартир в продаже:' : 'стоянок в продаже:';
        if  (etazhi[etazh].name == 0 || etazhi[etazh].name == 1 ) {
          obj.freeflat = ''; 
          obj.flqtycap = 'коммерческие помещения';
        }
        


          obj.hover(function(e){

            $etazhCaption.text(this.etazh);
            $flatQty.text(this.freeflat);
            $flatCpt.text(this.flqtycap);
            $popup.show();
            this.animate({
              'fill': '#F15A24'
              ,'opacity': 0.6
            }, 50, 'easyIn');
            
            

          }, function(){
            this.animate({ 
            'opacity': 0      
            }, 50);
            $popup.hide();
          });

          //обработка клика на этаже
          obj.click(function() {
           
            localStorage.setItem('curEtazh', this.etazh);
            document.location.href = 'select_flat.html';

            // var $bPopUp = $('#popup').bPopup();
            // $flatPlanImg.attr('src','img/plan/' + this.imgShema + '.png');

            // $flatPlanImg.imagesLoaded( function() {
            //   $flatPlanImg.animate(
            //     {'opacity':1}
            //     ,300
            //   );
            // });

            // $('.close').on('click', function() {
            //    $bPopUp.close();
            // });

          });
          
    }
  };

$('#seletazh-img').imagesLoaded(function() {
  $('#seletazh-img').animate({'opacity':1}
    ,300
    ,drowPolyetazh()
  );    
});




});
$(function(){
			
			var $photos = $('#photos');
			var $albomTitle = $('#albom-title');
			var $albomDate = $('#albom-date');
			var albom;	
			var $photoBox		
			var $linkitem;
			var $imageitem;
			var $photodesc;
			var language = "ru";

			var $bPopUp;
			var albomsDir = '/img/constr/';
			var alboms;
			$.getJSON(albomsDir + 'albominfo.json?v=09', {}, function(json){
				alboms = json;
			});


			$('.item-constr a').on('click', function(e) {
				e.preventDefault();
				
				
				var albomID = $(this).data("albom");
				
				$photos.html('');
				$albomTitle.text('');
				$albomDate.text('');
			
		        albom = alboms[albomID];	
		        if (!albom) {
		        	return;
		        }
		         
		        var qtyFiles = albom.qty;
		        $albomTitle.text(albom.title[language]);
		        $albomDate.text(albom.date);
		         

		        for (var i = 1; i <= qtyFiles; i++ ) {

			        $photodesc = $('<span></span>', {
			        	'class' : 'photo-desc',
			        	'text' : albom.files[i-1][language]
			        })

			         $imageitem = $('<img>',{
						'src' : albomsDir + albom.dir + "/small/" + albom.files[i-1].filename + ".jpg"
					});

			         $linkitem = $('<a></a>', {
						'href' : albomsDir + albom.dir + "/" + albom.files[i-1].filename + ".jpg",
						'class' : 'fancy',
						'title' : albom.files[i-1][language],
						'rel' : albom.dir,
						'html' : $imageitem
					});

			         $photoBox = $('<div></div', {
			         	'class' : 'photo-box'
			         });

			         $photoBox.append($linkitem).append($photodesc);

			         $photos.append($photoBox);
			    }


    			
    

			    $bPopUp = $('#popupconstr').bPopup();
			    setEqualHeight($(".photo-box"));
				
			});

			$(".close").on('click', function() {
				$bPopUp.close();
			});



			$(".fancy").fancybox({
		    	openEffect	: 'elastic',
		    	closeEffect	: 'elastic'
		    });

		});
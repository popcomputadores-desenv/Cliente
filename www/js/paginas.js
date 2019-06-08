var pagina;

function carregarPagina(pagina)
{	
	if (typeof pagina === "undefined" || pagina==null || pagina=="" ) { 
	setStorage("pagina",'');	
	} else {												
	setStorage("pagina",pagina);
	}
	
   menu.setMainPage('Pagina-Personalizada.html');
	translatePage();
}

function paginaResultado(data)
{	
	getStorage("pagina");
	
	var pagina_personalizada='';
	
	pagina_personalizada+='<ons-carousel swipeable overscrollable auto-scroll fullscreen var="carousel">';
	translatePage();
	$.each( data.custom_page, function( key, val ) { 
	
		
		var nome_pagina=val.page_name;
		if (nome_pagina.indexOf(".-") != -1){
	pagina_personalizada+='<ons-carousel-item class="fundo">';	
	pagina_personalizada+='<div align="left" style="width: auto; margin-right: 25px; margin-top: 15px; margin-left: 10px; position: absolute;"></div>';
		} else {
	pagina_personalizada+='<ons-carousel-item class="fundo">';	
	pagina_personalizada+='<div align="left" style="width: auto; margin-right: 25px; margin-top: 15px; margin-left: 10px; position: absolute;">'+val.page_name+'</div>';
		}
		if (nome_pagina.indexOf("...") != -1){
	pagina_personalizada+='<div class="box2" align="right">';
	pagina_personalizada+='<img src="css/images/bot_fecha.png" width="60px" height="80px" onclick="fechar_prop();" style="padding: 10px 10px 2px 0px;"></div>';	
		}
		
	pagina_personalizada+='<div style="box-sizing: border-box; text-align: left;">'+val.content+'</div>';
	pagina_personalizada+='</ons-carousel-item>';  
		
	});
	
pagina_personalizada+='</ons-carousel>';
pagina_personalizada+='<ons-carousel-cover>';
pagina_personalizada+='<div class="cover-label-apresentacao">Arraste para a direita ou para a esquerda.</div>';
pagina_personalizada+='</ons-carousel-cover>';
	  
	createElement('pagina-personalizada',pagina_personalizada);
	
}

/*Atualização Master Hub (Sistema Página Inicial)*/
function Splash_Pagina_menu()
{
	var slide=getStorage("slide");
	var html='';
	html+='<ons-list-item onclick="getSlide('+slide+');" class="bottom-menu-item" style="border-bottom: 1px solid #DFDFE0;">';
	html+='<ons-icon icon="ion-university" class="crimson"></ons-icon>';
	html+='<span class="trn" data-trn-key="apresentacao">Apresentação Inicial</span>';
	html+='</ons-list-item>';
		
			createElement("splash-pagina-menu",html);
}

function getSlide(slide)
{	
	menu.setMainPage('Slide-Personalizado.html', {
		closeMenu: true,
		callback: function(index){				
	    }
	});	
}

function fechar_prop()
	  {
	 setHome2();
	  }

function SairdoSlide(){
	if (isLogin()){		
		menu.setMainPage('home.html', {closeMenu: true});
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true});
	}
}
/*Fim da atualização*/

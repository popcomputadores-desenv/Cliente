function carregarEstabelecimento(mtid) /* cópia da função loadRestaurantCategory(mtid) */
{		  	
  cart = [] ; /*clear cart variable*/
  removeStorage("tips_percentage");  
  removeStorage("cc_id");  
  removeStorage("category_count");  
  removeStorage("item_count");
  
  setStorage("merchant_id",mtid);
    
  callAjax("getCategoryCountDirect","mtid="+ mtid + "&device_id="+getStorage("device_id") );
}

function abreCaixaCupom(cod_cupom,empresa){
	ons.notification.confirm({
	  message: getTrans('Voce ganhou um cupom de desconto, deseja usar ele agora?','Voce ganhou um cupom de desconto, deseja usar ele agora?') ,	  
	  title: dialog_title_default,
	  buttonLabels: ['Sim', 'Não'],
	  animation: 'fade', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	dump(index);
	    if ( index==0){
	    	$("#page-paymentoption .voucher_code").val(cod_cupom);   
			setTimeout(function() {
	  			carregarEstabelecimento(empresa);
  			}, 1000);
	    }
	  }
	});		
}

function handleOpenURL(url) {
var identificador = url.substring(url.indexOf("?") + 1, url.indexOf("="));
var variante = url.substring(url.indexOf("&") + 1, url.indexOf("#"));
var resultado = url.substring(url.indexOf("=") + 1,url.indexOf("&"));
var resultado2 = url.substring(url.indexOf("#") + 1);	
	
	if (typeof resultado2 === "undefined" || resultado2==null || resultado2=="" || resultado2=="null" ){
		var resultado2="0";
	}
	/* 
	Modelo do link:
	masterhub://?cupom=YterfEw342FffG&facebook#teste
	Teste de Parametros:
	https://jsfiddle.net/popcomputadores/3goacyke/
	*/
	
	if (identificador == "pagina") {
		
	switch (variante)
  	   {
  	   	  case "facebook":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
  	   	  case "instagram":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;

  	   	  case "twitter":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
  	   	  case "google":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
  	   	  case "whatsapp":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "facebook-oferta":		   
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "instagram-oferta":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "twitter-oferta":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "google-oferta":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "whatsapp-oferta":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "facebook-info":		   
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "instagram-info":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "twitter-info":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "google-info":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
			   
  	   	  case "whatsapp-info":
  setTimeout(function() {
	  getSlide(resultado);
  }, 1500);				   
			   break;
	   }	
	}
		
	if (identificador == "empresa") {
		
	switch (variante)
  	   {
  	   	  case "facebook":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
  	   	  case "instagram":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
  	   	  case "twitter":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
  	   	  case "google":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
  	   	  case "whatsapp":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "facebook-oferta":		   
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "instagram-oferta":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "twitter-oferta":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "google-oferta":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "whatsapp-oferta":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "facebook-info":		   
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "instagram-info":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "twitter-info":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "google-info":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
			   
  	   	  case "whatsapp-info":
  setTimeout(function() {
	  carregarEstabelecimento(resultado);
  }, 2500);				   
			   break;
	   }	
	}	
	
	if (identificador == "cupom") {
		
	switch (variante)
  	   {
  	   	  case "facebook":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "instagram":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "twitter":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "google":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "whatsapp":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "panfleto":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "banner":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "cartao":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "adesivo":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;
  	   	  case "brinde":
	  setTimeout(function() {
		  abreCaixaCupom(resultado,resultado2);
	  }, 2500);				   
			   break;			   
	   }	
	}	
	
	if (identificador == "impresso") {
		
	switch (variante)
  	   {
  	   	  case "panfleto":
	  setTimeout(function() {
		  carregarEstabelecimento(resultado);
	  }, 2500);				   
			   break;
  	   	  case "banner":
	  setTimeout(function() {
		  carregarEstabelecimento(resultado);
	  }, 2500);				   
			   break;
  	   	  case "cartao":
	  setTimeout(function() {
		  carregarEstabelecimento(resultado);
	  }, 2500);				   
			   break;
  	   	  case "adesivo":
	  setTimeout(function() {
		  carregarEstabelecimento(resultado);
	  }, 2500);				   
			   break;
  	   	  case "brinde":
	  setTimeout(function() {
		  carregarEstabelecimento(resultado);
	  }, 2500);				   
			   break;
	   }	
	}		
}

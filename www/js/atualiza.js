function AtualizarApp(){
	
	var link_google = getStorage('link_google_play');
		link_google_play = getStorage("link_google_play");
	    dump("link_google_play=>"+link_google_play);
	
	var link_apple = getStorage('link_apple_store');
		link_apple_store = getStorage("link_apple_store");
	    dump("link_apple_store=>"+link_apple_store);


	if(device.platform=="Android"){
		cordova.plugins.market.open(link_google);
  }else {
		cordova.plugins.market.open(link_apple);
  }

}

function atualizarAppInicio()
{
		if(!isDebug()){
				var versao = getStorage('versao');
				var versaoCode = getStorage('versaoCode');
				var ver_aplicativo = getStorage('versao_aplicativo');
				var ver_aplicativo_code = getStorage('versao_aplicativo_code');
				versao_aplicativo = getStorage("versao_aplicativo");
				dump("versao_aplicativo=>"+versao_aplicativo);
				versao_aplicativo_code = getStorage("versao_aplicativo_code");
				dump("versao_aplicativo_code=>"+versao_aplicativo_code);
		if(typeof versao_aplicativo===getStorage("versao") || versao_aplicativo_code===getStorage("versaoCode")){
			   } else {
			var forcar_atualizar = getStorage("forcar_atualizar");
			dump("forcar_atualizar=>"+forcar_atualizar);
			if(forcar_atualizar==='yes'){
				  ons.createAlertDialog('alerta-atualizacao-forcada.html').then(function(alertDialog) {
					alertDialog.show();
					  removeStorage("splash_screen");
					});
			   } else {
				  ons.createAlertDialog('alerta-atualizacao.html').then(function(alertDialog) {
					alertDialog.show();
					  removeStorage("splash_screen");
					});
			}

		}

	}
	
}


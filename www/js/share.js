			


function whatsappShare(){
	
	var link_google = getStorage('link_google_play');
		link_google_play = getStorage("link_google_play");
	    dump("link_google_play=>"+link_google_play);
	
	window.plugins.socialsharing.shareViaWhatsApp('Eu pedi online e entregaram mais rápido que por telefone. Baixe o aplicativo da Playstore. ', null /* img */,
												  
     "https://play.google.com/store/apps/details?id="+link_google+"&hl=pt-BR", null, 
              function(errormsg){alert("Erro: Não foi compartilhado")}
         );
};
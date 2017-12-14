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

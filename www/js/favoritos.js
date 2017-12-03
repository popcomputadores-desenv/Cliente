//Função para gerenciar os favoritos
//Envio o cliente token e chamo a função na API Controler (AddFavorito)
function addFavorito() {

var tokem = getStorage("client_token");
if(tokem == "" || tokem == "null" || tokem == null){
alert("Você deve estar logado para adicionar um favorito");
}
 else {
	
 $.ajax({
    type:"GET",
    url: ajax_url+"/AddFavorito?client_token="+getStorage("client_token")+"&merchant_id="+getStorage('merchant_id')+"",
	data: { get_param: 'icone' }, 
	dataType: 'jsonp',
    success: function(data) {
		var dados = JSON.stringify(data);
		var obj = $.parseJSON(dados);
		var informacao = obj['request'];
        var icone = informacao.substring(9);
		var icone = icone.replace("{","");
		var icone = icone.replace("}","");
		var icone = icone.replace(/[\\"]/g, '');

	    if(icone == "1"){
		$("#imgfavorito").attr("src","images/icons/favorito.png");
		} else {
		$("#imgfavorito").attr("src","images/icons/favoritar.png");
		}
    },

  });
 
 }
 
}

//Verifico se o estabelecimento já é um favorito do cliente
function verificaFavorito(data){

var tokem = getStorage("client_token");
if(tokem == "" || tokem == "null" || tokem == null){

}
else {
//callAjax('VerificaFavorito',"client_token="+getStorage("client_token")+"&merchant_id="+ getStorage('merchant_id'));	

$.ajax({
    type:"GET",
    url: ajax_url+"/VerificaFavorito?client_token="+getStorage("client_token")+"&merchant_id="+getStorage('merchant_id')+"",
	data: { get_param: 'icone' }, 
	dataType: 'jsonp',
    success: function(data) {
		var dados = JSON.stringify(data);
		var obj = $.parseJSON(dados);
		var informacao = obj['request'];
        var icone = informacao.substring(9);
		var icone = icone.replace("{","");
		var icone = icone.replace("}","");
		var icone = icone.replace(/[\\"]/g, '');

	    if(icone == "1"){
		$("#imgfavorito").attr("src","images/icons/favorito.png");
		} else {
		$("#imgfavorito").attr("src","images/icons/favoritar.png");
		}
    },

  });
}
	
}



function displayFavoritosResults(data , target_id)
{	
	dump(data);
	var htm='';	
       
    $.each( data, function( key, val ) {     
    	 htm+='<ons-list-item modifier="tappable" class="list-item-container" onclick="loadRestaurantCategory('+val.merchant_id+');" >';
    	htm+='<ons-row class="row">';    	 
    	     htm+='<ons-col class="col-image border" width="35%">';
    	          htm+='<div class="logo-wrap2" >';
    	            htm+='<div class="img_loaded" >';
    	             htm+='<img src="'+val.logo+'" />';
    	            htm+='</div>';
    	            
    	          htm+='</div>';
	    	           if ( val.offers.length>0){
	    	           	   $.each( val.offers, function( key_offer, val_offer ) { 
	    	           	   	  htm+='<p class="center"><i class="fa fa-tags" aria-hidden="true"></i> '+val_offer+'</p>';
	    	           	   });
	    	           }
    	     htm+='</ons-col>';
    	     
    	     htm+='<ons-col class="col-description border" width="65%">';
    	           htm+='<div>';
		               htm+='<span class="notification '+val.tag_raw+' ">'+val.is_open+'</span>';
	    	           htm+='<div class="rating-stars" data-score="'+val.ratings.ratings+'"></div>';
	    	           htm+='<p class="restauran-title concat-text">'+val.restaurant_name+'</p>';
	    	           htm+='<p class="concat-text">'+val.cuisine+'</p>';

					   dump(val.service);
    	          
    	          if(!empty(val.services)){
    	          	  $.each( val.services, function( key_service, val_services ) { 
    	           	   	  htm+='<class="center" style="font-size: 12px;"><i class="green-color ion-android-checkmark-circle"></i>'+val_services+' ';
    	           	   });
    	          }
					  
	    	          
    	           htm+='</div>';
    	           
    	           
    	              htm+='<ons-col width="90%">';
					  /*tempo de entrega*/
					  if(val.service!=3){
	    	           	   if(!empty(val.delivery_estimation)){
	    	       htm+='<span class="p-small trn"><i class="ion-android-time" style="font-size: 15px;"></i> <b>'+val.delivery_estimation+'</b> | </span>';	
	    	           	   }
					    }
				
					 /*Pedido minímo
    	              htm+='<ons-col width="90%"">';*/
					   	  if (!empty(val.minimum_order)){  
						  htm+='<span class="p-small trn" data-trn-key="min_order">Min. Order</span>';
    	                  htm+='<price> '+val.minimum_order+'</price>';
						  }
    	              /*htm+='</ons-col>';
					  Fim Pedido minímo*/
                      /*FIM MODIFICADO*/
					  
    	              htm+='</ons-col>'; 
    	           
    	           
    	     htm+='</ons-col>';
    	     
    	 htm+='</ons-row>';
    	 htm+='</ons-list-item>';
    });
      
    createElement(target_id,htm);
        
    initRating();  
    
    imageLoaded('.img_loaded');
}
 
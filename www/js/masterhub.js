var versao_aplicativo;
var versao_aplicativo_code;
var seguimentoGlobal;
var pagina;
var upload_url = krms_config.UploadUrl;

function carregarEstabelecimento(mtid)
{		  	
  cart = [] ; /*clear cart variable*/
  removeStorage("tips_percentage");  
  removeStorage("cc_id");  
  removeStorage("category_count");  
  removeStorage("item_count");
    
  dump('clear cart');
  
  setStorage("merchant_id",mtid);
    
  /*var options = {
      animation: 'slide',
      onTransitionEnd: function() { 
      	  callAjax("MenuCategory","merchant_id="+mtid + "&device_id=" + getStorage("device_id")  );	
      } 
   };
   sNavigator.pushPage("menucategory.html", options);
   */ 
  callAjax("getCategoryCount","mtid="+ mtid );
}


var spinner='<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';

var lazyLoadSearchCategorias = {
  createItemContent: function(index, oldContent) {      	
  	
  	search_total = getStorage("search_total");
  	if(!empty(search_total)){
  		$(".result-msg").text(search_total+" "+getTrans("Restaurant found",'restaurant_found') );
  	}  	  	
    var $element = $('<div id="results-'+index+'">'+spinner+'</div>');     
    getcarregarCategorias(index);   
    return $element[0];    
  },
  calculateItemHeight: function(index) {  	
    return 25;
  },
  countItems: function() {  	
    return getStorage("search_total");
  },
  destroyItemContent: function(index, element) {
    console.log("Destroyed item " + index);
  }
}

function getcarregarCategorias(index)
{
	var params='';
	var seguimento=getStorage("seguimentoGlobal");
	search_mode = getSearchMode();		
	if ( search_mode=="postcode"){
		params="search_mode="+ search_mode;
		var search_type = getSearchType();			
		switch (search_type)
		{
			case "1":				
			params+="&city_id="+ global_city_id;
			params+="&area_id="+ global_area_id;
			params+="&cuisine_type="+ seguimento;
			break;
			
			case "2":
			params+="&state_id="+ global_state_id;
			params+="&city_id="+ global_city_id;
			params+="&cuisine_type="+ seguimento;
			break;
			
			case "3":
			params+="&postal_code="+ global_postal_code;
			params+="&cuisine_type="+ seguimento;
			break;
			
			default:
			break;
		}		
	} else {
		params  = "address="+ getStorage("search_address") + "&search_mode=" + search_mode;	    
	}
	
	if (!empty(global_filter_params)){
		params = global_filter_params;
	}
		
	action="search";
	params+="&page="+index;	
	
	/*add language use parameters*/
	params+="&lang_id="+getStorage("default_lang");
	params+="&lang="+getStorage("default_lang");
	if(!empty(krms_config.APIHasKey)){
		params+="&api_key="+krms_config.APIHasKey;
	}
		
	dump(ajax_url+"/"+action+"?"+params);
	
	 ajax_lazy = $.ajax({
		url: ajax_url+"/"+action, 
		data: params,
		type: 'post',                  
		async: false,
		dataType: 'jsonp',
		timeout: 6000,
		crossDomain: true,
	 beforeSend: function() {			 	
	},
	complete: function(data) {							
	},
	success: function (data) {	  	   
	   if (data.code=1){	   		   	      	  
	   	   displayRestaurantResults(data.details.data ,'results-'+index);	   	   
	   } else {	   	  
	   	  $("#results-"+index).html(data.msg);
	   }
	},
	error: function (request,error) {	        
		hideAllModal();				
		$("#results-"+index).html( getTrans("Network error has occurred please try again!",'network_error') );		
	}
   });       	
}

function carregarCategorias(id)
{			
		
  global_filter_params = '';
	
	if (typeof id === "undefined" || id==null || id=="" ) { 
	setStorage("seguimentoGlobal",'');	
	} else {												
	setStorage("seguimentoGlobal",id);
	}
	
	var seguimento=getStorage("seguimentoGlobal");

  
  var s = $('#s').val();  
  
  /*clear all storage*/ 
  setStorage("search_address",s);
  clearAllStorage();
  
  search_mode = getSearchMode();
  if ( search_mode=="postcode"){
  	   s="location";
  	   
  	   var search_type = getSearchType();
  	   dump("search_type=>"+search_type);
  	   switch (search_type)
  	   {
  	   	  case "1":
  	   	  case 1:
	  	   	  global_city_id = $(".city_id").val();
	  	   	  global_area_id = $(".area_id").val();
	  	   	    	   	  
			  if ( empty(global_city_id) ){
				  onsenAlert( getTrans('Please select City first','please_select_city') );
				  return;
		      }
			  if ( empty(global_area_id) ){
				  onsenAlert( getTrans('Please select Area','please_select_area') );
				  return;
			  }  	   	  
  	   	  break;
  	   	  
  	   	  case "2":
  	   	  case 2:  	   	    	   	    	   	  
	  	   	  if(empty(global_state_id)){
				  onsenAlert( getTrans('Please select State first','please_select_state') );
				  return;
		      }
			  if(empty(global_city_id)){
				  onsenAlert( getTrans('Please select Cty first','please_select_city') );
				  return;
		      }  	   	  
  	   	  break;
  	   	  
  	   	  case "3":
  	   	  case 3:  	   	    	   	      
	  	   	  if (empty(global_postal_code)){
				  onsenAlert( getTrans('Please select Postal code','please_postal_code') );
				  return;
		      }	      
  	   	  break;
  	   	  
  	   	  default:
  	   	  break;
  	   }
  }
  
  if(s!=""){	  
	  if ( search_mode=="postcode"){
			var sparams="search_mode="+ search_mode;
			var search_type = getSearchType();			
			switch (search_type)
			{
				case "1":				
				sparams+="&city_id="+ global_city_id;
				sparams+="&area_id="+ global_area_id;
				sparams+="&cuisine_type="+ seguimento;
				break;
				
				case "2":
				sparams+="&state_id="+ global_state_id;
				sparams+="&city_id="+ global_city_id;
				sparams+="&cuisine_type="+ seguimento;	
				break;
				
				case "3":
				sparams+="&postal_code="+ global_postal_code;
				sparams+="&cuisine_type="+ seguimento;	
				break;
				
				default:
				break;
			}
			callAjax("initSearchCategorias", sparams );	
		} else {
		    callAjax("initSearchCategorias","address="+ getStorage("search_address") + "&search_mode=" + search_mode + "&cuisine_type="+ seguimento );		
		}
  } else{
  	 onsenAlert(   getTrans('Address is required','address_is_required')  );
  }
}
function carregarCategoriaEmpresa(cat_id,mtid)
{			       
	
	if ( $("#close_store").val()==2 || $("#merchant_open").val()==1 ){
		onsenAlert( getTrans("This Restaurant Is Closed Now.  Please Check The Opening Times",'restaurant_close') );
		return;
	}
	
  cart = [] ; /*clear cart variable*/
  removeStorage("tips_percentage");  
  removeStorage("cc_id");  
  
  dump('clear cart');

	var options = {
      animation: 'none',
      onTransitionEnd: function() { 
      	  callAjax("getItemByCategory","cat_id="+cat_id+"&merchant_id="+mtid);
      	  showCartNosOrder();
      } 
   };
   sNavigator.pushPage("menuItemEmpresa.html", options);
}

function inicializarMapa() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: -22.41527, lng: -47.5629}  // Rio Claro.
  });

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById('right-panel2')
  });

  directionsDisplay.addListener('directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());
  });

  displayRoute('Cidade Jardim, Rio Claro, SP', getStorage("search_address"), directionsService,
      directionsDisplay);
}

function displayRoute(origin, destination, service, display) {
  service.route({
    origin: origin,
    destination: destination,
    waypoints: [],
    travelMode: 'DRIVING',
    avoidTolls: true
  }, function(response, status) {
    if (status === 'OK') {
      display.setDirections(response);
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}

function showSeguimentos()
{	
	if (typeof navDialog === "undefined" || navDialog==null || navDialog=="" ) { 	    
		ons.createDialog('filterSeguimentos.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	    });	
	} else {
		navDialog.show();
		//translatePage();
	}	
}

function applyFilterSeguimentos()
{
	navDialog.hide();
	
	var services='';
	if (  $(".delivery_type").exists()){
		$.each( $(".delivery_type:checked") , function( key, val ) { 			
			//services+= $(this).val() +",";
			services+= $(this).val();
		});			
	}
	
	dump("services=>"+services);
	var cuisine_type='';
	if (  $(".cuisine_type").exists()){
		$.each( $(".cuisine_type:checked") , function( key, val ) { 			
			cuisine_type+= $(this).val() +",";
		});		
	}
	dump("cuisine_type=>"+cuisine_type);
	callAjax("search","address="+ getStorage("search_address") +"&services=" + services + 
	"&cuisine_type="+cuisine_type + "&restaurant_name="+ $(".restaurant_name").val() );
}

function applyFilterCancela()
{
	navDialog.hide();
	
	var services='';

	var cuisine_type='';
	
	var restaurant_name='';

	callAjax("search","address="+ getStorage("search_address") +"&services=" + services + 
	"&cuisine_type="+cuisine_type + "&restaurant_name=" + restaurant_name);
}

function seguimentosResults(data)
{		
	var htm='';
	htm+='<ons-list>';
	
	/*htm+='<ons-list-item modifier="tappable">';
	 htm+='<label class="checkbox checkbox--list-item">';
		htm+='<input type="checkbox" name="delivery_type" class="delivery_type" value="1" >';
		htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
		htm+=' <span class="trn" data-trn-key="delivery_n_pickup" >Delivery & Pickup</span>';
	  htm+='</label>';
	htm+='</ons-list-item>';
	
	htm+='<ons-list-item modifier="tappable">';
	 htm+='<label class="checkbox checkbox--list-item">';
		htm+='<input type="checkbox" name="delivery_type" class="delivery_type" value="2">';
		htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
		htm+=' <span class="trn" data-trn-key="delivery_only">Delivery Only</span>';
	  htm+='</label> ';
	htm+='</ons-list-item>';
	
	htm+='<ons-list-item modifier="tappable">';
	 htm+='<label class="checkbox checkbox--list-item">';
		htm+='<input type="checkbox" name="delivery_type" class="delivery_type" value="3">';
		htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
		htm+=' <span class="trn" data-trn-key="pickup_only">Pickup Only</span>';
	  htm+='</label>  	   '; 
	htm+='</ons-list-item>	';*/
	    
	htm+='<ons-list-header class="list-header trn" data-trn-key="cuisine">Cuisine</ons-list-header>';
	
	$.each( data.cuisine, function( key, val ) {        		  		  
		htm+='<ons-list-item modifier="tappable">';
		 htm+='<label class="checkbox checkbox--list-item">';
			htm+='<input type="checkbox" name="cuisine_type" class="cuisine_type" value="'+key+'">';
			htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
			htm+=' '+val;
		  htm+='</label>'; 
		htm+='</ons-list-item>';
	});	
	
	htm+='</ons-list>';	
	createElement('filter-seguimentos-list',htm);	
	
	$(".restaurant_name").attr("placeholder",  getTrans("Enter Restaurant name",'enter_resto_name') );
	
	translatePage();
}

/*Atualização Master Hub (Cria, Mostra e Oculta Seguimentos)*/

/* Modificação Pagina Personalizada */

function carregarPagina(pagina)
{	
	if (typeof pagina === "undefined" || pagina==null || pagina=="" ) { 
	setStorage("pagina",'');	
	} else {												
	setStorage("pagina",pagina);
	}
	
   menu.setMainPage('Pagina-Personalizada.html');
	
}


function paginaResultado(data)
{	
	getStorage("pagina");
	
	var pagina_personalizada='';
	
	pagina_personalizada+='<ons-carousel swipeable overscrollable auto-scroll fullscreen var="carousel">';
	
	$.each( data.custom_page, function( key, val ) { 

	pagina_personalizada+='<ons-carousel-item class="fundo">';	
	pagina_personalizada+='<div align="left" style="width: auto; margin-right: 25px; margin-top: 15px; margin-left: 10px; position: absolute;">'+val.page_name+'</div>';	
	pagina_personalizada+='<div class="box" align="right" style="right:20px;top:10px">';	
	pagina_personalizada+='<img src="css/images/bot_fecha.png" width="30px" height="40px" onclick="fechar_prop();" ></div>';	

	pagina_personalizada+='<div style="padding-top: 52px; box-sizing: border-box; text-align: left;">'+val.content+'</div>';
	pagina_personalizada+='</ons-carousel-item>';  
		
	});
	
pagina_personalizada+='</ons-carousel>';
pagina_personalizada+='<ons-carousel-cover>';
pagina_personalizada+='<div class="cover-label">Arraste para a direita ou para a esquerda.</div>';
pagina_personalizada+='</ons-carousel-cover>';
	  
	createElement('pagina-personalizada',pagina_personalizada);
	
}

/* FIM da Modificação Pagina Personalizada */


function categorias_Resultado(data)
{		
		var htm='';
	
	htm+='<div style="color: #fff;"><span style="border-bottom: 2px dotted #fff; padding-bottom: 5px;" class="trn" data-trn-key="escolha_uma_ategoria">ESCOLHA UMA CATEGORIA</span></div>';
	htm+='<div class="wrapper center" style="margin: 15px auto; white-space: nowrap; overflow:auto;">';
	
	$.each( data.category, function( key, val ) {
		     
		val.cuisine = val.cuisine.replace(/"/g,'');
		var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);

		
		htm+='<div style="padding: 8px; margin: 5px; box-sizing: border-box; border: 2px dashed #ddd; width: 180px; display: inline-block; border-radius: 15px;" onclick="carregarCategorias('+val.cuisine+');">';
		if (val.photo!=""){
		htm+='<img src="'+upload_url+''+val.photo+'" style="width:60px;">';
		} else {
		htm+='<img src="css/images/logo-padrao.svg" style="width:60px;">';			
		}
		htm+='<div style="display: block; margin-top: 10px; color: #ddd; font-size: 14px;">';
		htm+=''+val.category_name;
		htm+='</div>';
		htm+='</div>';
		
	});	
	
	htm+='</div>';

	createElement('lista-categorias',htm);	
			   
			   
}

function sugestoes_Resultado_lista(data)
{		
		var htm='';
	
	htm+='<div style="color: #fff;"><span style="border-bottom: 2px dotted #fff; padding-bottom: 5px;" class="trn" data-trn-key="escolha_uma_ategoria">VOTE NO SEU ESTABELECIMENTO FAVORITO</span></div>';
	htm+='<div class="wrapper center" style="margin: 15px auto; white-space: nowrap; overflow:auto;">';
	
	$.each( data.sugestoes, function( key, val ) {
		     
		
		var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);

		
		//htm+='<div style="padding: 8px; margin: 5px; box-sizing: border-box; border: 1.5px dashed #ddd; width: 190px; display: inline-block; border-radius: 15px;" onclick="">';
		
		//htm+='<img src="'+upload_url+'estabelecimentos/'+val.sug_id+'.png" style="width:60px;">';
		htm+='<div style="display: block; text-align: -webkit-left; margin-top: 5px; color: #ddd; font-size: 15px;">Voto(s): ';
		
		
		htm+='<i style="text-align: -webkit-left; margin-left: 15px; margin-top: 5px; color: #ddd; font-size: 15px;">'+val.nome_empresa;
		htm+='</i>';

		htm+='<div style="text-align: -webkit-right; float: right; margin-top: auto; color: #ddd; font-size: 15px;">Votar';
		htm+='</div>';
		htm+='</div>';
		
		htm+='<div style="display: block; text-align: -webkit-left; margin-left: 15px; margin-top: 3px; color: #ddd; margin-left: 15px; font-size: 22px;">'+val.votos;
		htm+='<div style="display: block; float: right; text-align: -webkit-right; margin-top: 3px; color: #000; font-size: 12px;">Indicado por: ';
		htm+=''+val.indicacao_de;
		htm+='</div>';
		htm+='</div>';		
		htm+='<hr>';
		
	});	
	
	htm+='</div>';

	createElement('lista-sugestoes-lista',htm);	
}

function sugestoes_Resultado(data)
{		
		var htm='';
	
	htm+='<div style="color: #fff;"><span style="border-bottom: 1.5px dotted #fff; padding-bottom: 5px;" class="trn" data-trn-key="escolha_uma_ategoria">VOTE NO SEU ESTABELECIMENTO FAVORITO</span></div>';
	htm+='<div class="wrapper center" style="margin: 15px auto; white-space: nowrap; overflow:auto;">';
	
	$.each( data.sugestoes, function( key, val ) {
		     
		
		var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);

		
		htm+='<div style="padding: 8px; margin: 5px; box-sizing: border-box; border: 1.5px dashed #ddd; width: 190px; display: inline-block; border-radius: 15px;" onclick="">';
		
		htm+='<img src="'+upload_url+'estabelecimentos/'+val.sug_id+'.png" style="width:60px;">';
		
		htm+='<div style="display: block; margin-top: 5px; color: #ddd; font-size: 14px;">';
		htm+=''+val.nome_empresa;
		htm+='</div>';
		htm+='<div style="display: block; margin-top: 5px; color: #ddd; font-size: 18px;">Voto(s): ';
		htm+=''+val.votos;
		htm+='</div>';
		htm+='<div style="display: block; margin-top: 3px; color: #000; font-size: 12px;">Indicado por: ';
		htm+=''+val.indicacao_de;
		htm+='</div>';		
		htm+='</div>';
		
	});	
	
	htm+='</div>';

	createElement('lista-sugestoes',htm);	
}


function carregandoSugestoes()
{
	callAjax('Suggestion','');
}

function carregandoCategorias()
{
	var busca_categoria = getStorage("busca_categoria");
	       dump("busca_categoria=>"+busca_categoria);
	       if(busca_categoria!='yes'){
	       
			   return false;
			   			   
	       } else {
	callAjax('Lista_categorias','');
		   }
}

function carregandoSeguimentos()
{
	
	var busca_seguimentos = getStorage("busca_seguimentos");
	       dump("busca_seguimentos=>"+busca_seguimentos);
	       if(busca_seguimentos!='yes'){
	       
			   return false;
			   			   
	       } else {
	callAjax('Lista_seguimentos','');
		   }
}

function seguimentos_Resultado(data)
{		
	
	
		var htm='';
	
	htm+='<div style="width: 100%; margin: 15px auto; background: #ddd; border-top: 2px dashed #ddd; border-bottom: 2px dashed #ddd; padding: 5px 0px;  box-shadow: inset 0px 11px 8px -10px #888, inset 0px -11px 8px -10px #888;" class="center">';
	htm+='<div style="color: #222; padding-top: 10px; font-size: 13px; font-weight: bold;" class="trn" data-trn-key="busca_por_seguimentos">BUSCAR POR SEGUIMENTOS</div><div style="clear:both;"></div>';
	htm+='<div style="width: 100%; padding: 20px 10px; overflow: auto; display: block; white-space:nowrap; box-sizing: border-box;">';
	
	$.each( data.cuisine, function( key, val ) {  
		
		
	var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);
		
		htm+='<button class="button--cta green" onclick="carregarCategorias('+key+');" style="color: #222; font-size: 12px; box-shadow: -1px 2px 10px 2px rgba(255,255,255,0.1); font-weight: bold; background-color: #eee; border-radius: 0px;">';
		htm+='<img src="'+upload_url+'icones-seguimentos/'+key+'.svg" class="imgcategoria"></img>';
		htm+='<span>  '+val+'</span>';
		htm+='</button>';
		
	});	
	
	htm+='</div>';
	htm+='</div>';	

	createElement('lista-seguimentos',htm);	
			   
	
}

    // Adicionando Busca por CEP
    
function limpa_formulário_cep() {
            //Limpa valores do formulário de cep.
            document.getElementById('rua').value=("");
            document.getElementById('bairro').value=("");
            document.getElementById('cidade').value=("");
            document.getElementById('uf').value=("");
    }

    function meu_callback(conteudo) {
        if (!("erro" in conteudo)) {
            //Atualiza os campos com os valores.
            document.getElementById('rua').value=(conteudo.logradouro);
            document.getElementById('bairro').value=(conteudo.bairro);
            document.getElementById('cidade').value=(conteudo.localidade);
            document.getElementById('uf').value=(conteudo.uf);
        } //end if.
        else {
            //CEP não Encontrado.
            limpa_formulário_cep();
            alert("CEP não encontrado.");
        }
    }
        
    function pesquisacep(valor) {

        //Nova variável "cep" somente com dígitos.
        var cep = valor.replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                document.getElementById('rua').value="...";
                document.getElementById('bairro').value="...";
                document.getElementById('cidade').value="...";
                document.getElementById('uf').value="...";

                //Cria um elemento javascript.
                var script = document.createElement('script');

                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    }


function fechar_prop()
  {
 setHome2();
  }

function loadMoreSuggestion()
{
	var page = sNavigator.getCurrentPage();		
	if ( page.name=="votacao.html"){		
	    callAjax("Suggestion",params);	             	       
		return;
	}
	
	var options = {
      animation: 'slide',
      onTransitionEnd: function() { 						      	  
      	     'page-suggestion';
	      callAjax("Suggestion",params);	             	       
      } 
    };   
    sNavigator.pushPage("votacao.html", options);		 	
}

function displaySuggestion(data)
{
	var htm='';
	$.each( data, function( key, val ) {        		  
		htm+=tplSugestoes(val.nome_empresa, val.cidade, val.votos, val.date_created );
	});	
	createElement('suggestion-list-scroller',htm);
	initRating();
}

function showSuggestionForm()
{
	if (isLogin()){
	var options = {
      animation: 'none',
      onTransitionEnd: function() { 						      	  
      	  
      	     'page-addsuggestions';
      	  
      	  translatePage();
      	  $(".nome_empresa").attr("placeholder", getTrans('O Nome da Empresa','nome_da_empresa') );
          $(".cidade").attr("placeholder", getTrans('Cidade','cidade') ); 
          $(".telefone").attr("placeholder", getTrans('Telefone','telefone') );     
          $(".contato").attr("placeholder", getTrans('Contato','contato') );     
          translateValidationForm();      
          
          	  
      }                   
    };   
    sNavigator.pushPage("indicacao.html", options);	
	
} else {
		menu.setMainPage('prelogin.html', {closeMenu: true})
	}
	
}

function showSuggestion2Form()
{  
	if (isLogin()){
	var options = {
      animation: 'none',
      onTransitionEnd: function() { 						      	  
      	  
      	     'page-addsuggestions';
      	  
      	  translatePage();
      	  $(".nome_empresa").attr("placeholder", getTrans('o Nome da Empresa','nome_da_empresa') );
          $(".cidade").attr("placeholder", getTrans('Cidade','cidade') ); 
          $(".telefone").attr("placeholder", getTrans('Telefone','telefone') );     
          $(".contato").attr("placeholder", getTrans('Contato','contato') );     
          translateValidationForm();      
          
          	  
      }                   
    }; 
	
    sNavigator.pushPage("suggestion.html", options);
	
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true})
	}
}


function addSuggestion()
{
	if (isLogin()){
	
	$.validate({ 	
	    form : '#frm-addsuggestion',    
	    borderColorOnError:"#FF0000",
	    onError : function() { 
			return;
		},	    
	    onSuccess : function() {     	      
	      var params = $( "#frm-addsuggestion").serialize();	      
	      params+="&client_token="+ getStorage("client_token");
			
	      callAjax("addSuggestion",params);
			return;
			
	    }  
	});
		
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true})
	}
	
}


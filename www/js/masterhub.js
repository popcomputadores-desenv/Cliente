var versao_aplicativo;
var versao_aplicativo_code;
var seguimentoGlobal;
var upload_url = krms_config.UploadUrl;

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
			  global_city_name = $(".location_city").html();
	  	   	  global_area_name = $(".location_area").html();
	  	   	    	   	  
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
			  global_state_id = $(".state_id").val();
	  	   	  global_city_id = $(".city_id").val();
			  global_state_name = $(".location_state").html();
	  	   	  global_city_name = $(".location_city").html();
			   
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
			   global_postal_code = $(".postal_code").val();
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

function categorias_Resultado(data)
{		
		var htm='';
	
	htm+='<div style="color: #fbf0da;"><span style="border-bottom: 2px outset #fbf0da; padding-bottom: 5px;" class="trn" data-trn-key="escolha_uma_ategoria">ESCOLHA UMA CATEGORIA</span></div>';
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
		htm+='<div style="display: block; margin-top: 10px; color: #fbf0da; font-size: 14px;">';
		htm+=''+val.category_name;
		htm+='</div>';
		htm+='</div>';
		
		
	});	
	
	htm+='</div>';

	createElement('lista-categorias',htm);	
			   
			   
}

function botao_cancelar(tipo_de_servico)
{		
		var htm='';
	if (tipo_de_servico==8 || tipo_de_servico==9 || tipo_de_servico==10 || tipo_de_servico==11 || tipo_de_servico==12){
       htm+='<ons-toolbar-button onclick="cancelCartOrderEntregadores();">';
       htm+='<ons-icon icon="ion-ios-arrow-back" size="1.333333em"></ons-icon>';
       htm+='</ons-toolbar-button>';
	} else {
	   htm+='<ons-back-button></ons-back-button>';
	}
	createElement('botao_cancelar',htm);
}

function menu_Resultado(tempo_entrega)
{		
		var htm='';
       htm+='<div class="action-icon"><ons-icon icon="ion-clock"></ons-icon><br>';
       htm+='<span class="action-label trn tempo_de_entrega">'+tempo_entrega+'</span></div>';
	createElement('menu-resultado',htm);
}

function menu_Resultado2(tempo_entrega)
{		
		var htm='';
       htm+='<div class="action-icon"><ons-icon icon="ion-clock"></ons-icon><br>';
       htm+='<span class="action-label trn tempo_de_entrega">'+tempo_entrega+'</span></div>';
	createElement('menu-resultado2',htm);
}

function menu_Resultado3(tempo_entrega)
{		
		var htm='';
       htm+='<div class="action-icon"><ons-icon icon="ion-clock"></ons-icon><br>';
       htm+='<span class="action-label trn tempo_de_entrega">'+tempo_entrega+'</span></div>';
	createElement('menu-resultado3',htm);
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

/*Atualização Master Hub (Função de busca por CEP)*/
    
function limpa_formulario_cep() {
            //Limpa valores do formulário de cep.
            document.getElementById('street').value=("");
            document.getElementById('area_name').value=("");
            document.getElementById('city').value=("");
            document.getElementById('state').value=("");
			document.getElementById('numero').value=("");

    }

    function meu_callback(conteudo) {
        if (!("erro" in conteudo)) {
            //Atualiza os campos com os valores.
            document.getElementById('street').value=(conteudo.logradouro);
            document.getElementById('area_name').value=(conteudo.bairro);
            document.getElementById('city').value=(conteudo.localidade);
            document.getElementById('state').value=(conteudo.uf);
			document.getElementById('numero').value=("");

        } //end if.
        else {
            //CEP não Encontrado.
            limpa_formulario_cep();
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
                document.getElementById('street').value="...";
                document.getElementById('area_name').value="...";
                document.getElementById('city').value="...";
                document.getElementById('state').value="...";
				document.getElementById('numero').value="...";

                //Cria um elemento javascript.
                var script = document.createElement('script');

                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            } //end if.
            else {
                //cep e invalido.
                limpa_formulario_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            //limpa_formulário_cep();
        }
    }
/*Fim da atualização*/
/*Atualização Master Hub (Função de busca por CEP no Catálogo de Endereços)*/
function limpa_formulario_cep_catalogo() {
            //Limpa valores do formulário de cep.
            document.getElementById('street').value=("");
			$(".cidade").html("");
			$(".bairro").html("");
            document.getElementById('state').value=("");
			document.getElementById('numero').value=("");
			document.getElementById('city').value=("");
			document.getElementById('state').value=("");
			document.getElementById('area_name').value=("");
			$(".location_area").html(getTrans("Select District / Area","select_destrict_area"));
			$(".location_city").html(getTrans("Select City", "select_city"));
			$(".location_state").html(getTrans("Select State", "select_state"));    }

    function meu_callback_catalogo(conteudo) {
        if (!("erro" in conteudo)) {
			
			buscar_ids_por_CEP(conteudo.localidade, conteudo.bairro);
            //Atualiza os campos com os valores.
            document.getElementById('street').value=(conteudo.logradouro);
			$(".cidade").html(conteudo.localidade);
			$(".bairro").html(conteudo.bairro);
            document.getElementById('state').value=("");
			document.getElementById('numero').value=("");
			document.getElementById('city').value=("");
			document.getElementById('state').value=("");
			document.getElementById('area_name').value=("");
			//$(".location_area").html(getTrans("Select District / Area","select_destrict_area"));
			//$(".location_city").html(getTrans("Select City", "select_city"));
			//$(".location_state").html(getTrans("Select State", "select_state"));

        } //end if.
        else {
            //CEP não Encontrado.
            limpa_formulario_cep_catalogo();
            alert("CEP não encontrado.");
        }
    }
        
    function pesquisacep_catalogo(valor) {

        //Nova variável "cep" somente com dígitos.
        var cep = valor.replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                document.getElementById('street').value="...";
				$(".cidade").html("...");
				$(".bairro").html("...");
                document.getElementById('state').value="...";
				document.getElementById('numero').value="...";

                //Cria um elemento javascript.
                var script = document.createElement('script');

                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback_catalogo';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            } //end if.
            else {
                //cep é inválido.
                limpa_formulario_cep_catalogo();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            //limpa_formulário_cep();
        }
    }
/*Fim da atualização*/

/*Atualização Master Hub (Função de busca por CEP na Finalização do Pedido)*/
function limpa_formulario_cep_pedido() {
            //Limpa valores do formulário de cep.
            document.getElementById('street').value=("");
			$(".cidade").html("");
			$(".bairro").html("");
            document.getElementById('state').value=("");
			document.getElementById('numero').value=("");
			document.getElementById('city').value=("");
			document.getElementById('state').value=("");
			document.getElementById('area_name').value=("");
			$(".location_area").html(getTrans("Select District / Area","select_destrict_area"));
			$(".location_city").html(getTrans("Select City", "select_city"));
			$(".location_state").html(getTrans("Select State", "select_state"));    }

    function meu_callback_pedido(conteudo) {
        if (!("erro" in conteudo)) {
			
			buscar_ids_por_CEP(conteudo.localidade, conteudo.bairro);
            //Atualiza os campos com os valores.
            document.getElementById('street').value=(conteudo.logradouro);
			$(".cidade").html(conteudo.localidade);
			$(".bairro").html(conteudo.bairro);
            document.getElementById('state').value=("");
			document.getElementById('numero').value=("");
			document.getElementById('city').value=("");
			document.getElementById('state').value=("");
			document.getElementById('area_name').value=("");
			//$(".location_area").html(getTrans("Select District / Area","select_destrict_area"));
			//$(".location_city").html(getTrans("Select City", "select_city"));
			//$(".location_state").html(getTrans("Select State", "select_state"));

        } //end if.
        else {
            //CEP não Encontrado.
            limpa_formulario_cep_pedido();
            alert("CEP não encontrado.");
        }
    }
        
    function pesquisacep_pedido(valor) {

        //Nova variável "cep" somente com dígitos.
        var cep = valor.replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                document.getElementById('street').value="...";
				$(".cidade").html("...");
				$(".bairro").html("...");
                document.getElementById('state').value="...";
				document.getElementById('numero').value="...";

                //Cria um elemento javascript.
                var script = document.createElement('script');

                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback_pedido';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            } //end if.
            else {
                //cep é inválido.
                limpa_formulario_cep_pedido();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            //limpa_formulário_cep();
        }
    }
/*Fim da atualização*/
/*Atualização Master Hub (Personalização de ocultar caixas de escolha na tela inicial)*/
function mudarendereco()
{
	$(".catalogo_endereco").show();
	$(".search_by_location_btn").hide();
	$(".bairro_cidade").hide();
	$(".cidade_estado").hide();
	
	$(".city_id").val('');
	$(".state_id").val('');
	$(".area_id").val('');
	$(".city").val('');
	$(".area_name").val('');
	$(".state").val('');
	$(".location_area").html(getTrans("Select District / Area","select_destrict_area"));
	$(".location_city").html(getTrans("Select City", "select_city"));
	$(".location_state").html(getTrans("Select State", "select_state"));

	removeStorage("global_area_name");
	removeStorage("global_city_name");
	removeStorage("global_area_id");
	removeStorage("global_city_id");
}
/*Fim da atualização*/

/*Atualização Master Hub (Tradução e Catálogo de Endereços)*/
function onsenDialogCheckout(){
	ons.notification.confirm({
	  message: getTrans('Deseja finalizar o pedido?','Deseja continuar comprando?') ,	  
	  title: dialog_title_default,
	  buttonLabels: ['Sim', 'Ainda Não'],
	  animation: 'fade', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	dump(index);
	    if ( index==0){
	    	showCart();       
	    }
	  }
	});		
}
/*Fim da atualização*/
function onsenDialogCheckout2(){
	ons.notification.confirm({
	  message: getTrans('Escolha corretamente a rota do entregador!','Escolha corretamente a rota do entregador!') ,	  
	  title: dialog_title_default,
	  buttonLabels: ['OK'],
	  animation: 'fade', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	dump(index);
	    if ( index==0){
	    	showCart();       
	    }
	  }
	});		
}

/*Atualização Master Hub (Verificação de Endereços e Catálogo de Endereços)*/
function onsenDialogAddresBook(){

	ons.notification.confirm({
	  messageHTML: getTrans('Deseja cadastrar seu endereço agora? <br> Não esqueça de selecioná-lo como padrão!','Deseja cadastrar seu endereço agora? <br> Não esqueça de selecioná-lo como padrão!') ,	  
	  title: getTrans('Não há endereço cadastrado!','Não há endereço cadastrado!'),
	  buttonLabels: ['Sim', 'Não'],
	  animation: 'fade', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	dump(index);
	    if ( index==0){
	    	setEnderecoNovo();
	    } else 
			$(".catalogo_endereco").show();
			$(".search_by_location_btn").hide();
			//$(".search_by_address").hide();
	  }
	});		
}

function onsenDialogAddresBookDefault(){

	ons.notification.confirm({
	  messageHTML: getTrans('Você tem endereço cadastrado, porém nenhum está como padrão!<br>Deseja escolher o endereço padrão agora?','Você tem endereço cadastrado, porém nenhum está como padrão!<br>Deseja escolher o endereço padrão agora?') ,	  
	  title: getTrans('Não há endereço padrão!','Não há endereço padrão!'),
	  buttonLabels: ['Sim', 'Não'],
	  animation: 'fade', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	dump(index);
	    if ( index==0){
	    	setEnderecoNovo();
	    } else 
			$(".catalogo_endereco").show();
			$(".search_by_location_btn").hide();
			//$(".search_by_address").hide();
	  }
	});		
}

function onsenDialogAddresBookOld(){

	ons.notification.confirm({
	  messageHTML: getTrans('Você tem endereço cadastrado, porém está desatualizado!<br>Deseja atualizar seus endereços agora?','Você tem endereço cadastrado, porém está desatualizado!<br>Deseja atualizar seus endereços agora?') ,	  
	  title: getTrans('Endereço desatualizado!','Endereço desatualizado!'),
	  buttonLabels: ['Sim', 'Não'],
	  animation: 'fade', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	dump(index);
	    if ( index==0){
	    	setEnderecoNovo();
	    } else 
			$(".catalogo_endereco").show();
			$(".search_by_location_btn").hide();
			//$(".search_by_address").hide();
		    	$(".location_area").html(getTrans("District / Area","destrict_area"));
			$(".location_city").html(getTrans("City", "city"));
			$(".location_state").html(getTrans("Select State", "select_state"));
	  }
	});		
}
/*Fim da atualização*/
/*Atualização Master Hub (Catálogo de Endereços)*/
function setEnderecoNovo()
{
	dump("setEnderecoNovo");
	var options = {     	  		  
	  	  closeMenu:true,
	      animation: 'slide',
	      callback:setHomeCallback
	   };	   	   	   
	menu.setMainPage('addressBook.html', options); 	
}
/*Fim da atualização*/
/*Atualização Master Hub (Botão Fechar da Splash Page)*/
function setHome2() //Cópia da setHome
{
	 dump("setHome");
	var options = {     	  		  
	  	  closeMenu:true,
	      animation: 'slide',
	      callback:setHomeCallback
	   };	   	   	   
	 menu.setMainPage('home.html',options);
}
/*Fim da atualização*/

function displayMerchantLogo3(logo,total,subtotal,entrega,comodidade,embalagem,desconto,gorjeta,page_id) //Cópia de displayMerchantLogo
{
	if(!empty(logo)){
	    $("#"+ page_id +" .logo-wrap").html('<img src="'+logo+'" />')		
	}

	if (!empty(subtotal)){
		$("#"+ page_id +" .titulo-subtotal").html('Sub-Total: ');
		$("#"+ page_id +" .total-subtotal").html(subtotal);
		$("#"+ page_id +" .total-subtotal").css({"display":"block"});
		$("#"+ page_id +" .titulo-subtotal").css({"display":"block"});	
	}else{
		$("#"+ page_id +" .total-subtotal").css({"display":"none"});
		$("#"+ page_id +" .titulo-subtotal").css({"display":"none"});
	}
	
	transaction_type=getStorage("transaction_type");
	dump("transaction_type=>"+transaction_type);
	
	if ( transaction_type=="delivery" || transaction_type=="coleta" || transaction_type=="coleta_retorno" || transaction_type=="pre_coleta" || transaction_type=="pre_coleta_retorno"){	
		$("#page-paymentoption .titulo-entrega").css({"display":"block"});
		$("#page-paymentoption .total-entrega").css({"display":"block"});
					}else{
		$("#page-paymentoption .titulo-entrega").css({"display":"none"});
		$("#page-paymentoption .total-entrega").css({"display":"none"});
					}

	if (!empty(entrega)){
		$("#"+ page_id +" .titulo-entrega").html('Taxa de Entrega: ');
		$("#"+ page_id +" .total-entrega").html(entrega);
		//$("#"+ page_id +" .total-entrega").css({"display":"block"});
		//$("#"+ page_id +" .titulo-entrega").css({"display":"block"});
	}else{
		$("#"+ page_id +" .total-entrega").css({"display":"none"});
		$("#"+ page_id +" .titulo-entrega").css({"display":"none"});
	}
	
	if (!empty(comodidade)){
		$("#"+ page_id +" .titulo-comodidade").html('Taxa de Comodidade: ');
		$("#"+ page_id +" .total-comodidade").html(comodidade);
		$("#"+ page_id +" .total-comodidade").css({"display":"block"});
		$("#"+ page_id +" .titulo-comodidade").css({"display":"block"});
	}else{
		$("#"+ page_id +" .total-comodidade").css({"display":"none"});
		$("#"+ page_id +" .titulo-comodidade").css({"display":"none"});
	}
	
	if (!empty(embalagem)){
		$("#"+ page_id +" .titulo-embalagem").html('Taxa de Embalagem: ');
		$("#"+ page_id +" .total-embalagem").html(embalagem);
		$("#"+ page_id +" .total-embalagem").css({"display":"block"});
		$("#"+ page_id +" .titulo-embalagem").css({"display":"block"});
	}else{
		$("#"+ page_id +" .total-embalagem").css({"display":"none"});
		$("#"+ page_id +" .titulo-embalagem").css({"display":"none"});
	}
	
	if (!empty(desconto)){
		$("#"+ page_id +" .titulo-desconto").html('Descontos: ');
		$("#"+ page_id +" .total-desconto").html(desconto);
		$("#"+ page_id +" .total-desconto").css({"display":"block"});
		$("#"+ page_id +" .titulo-desconto").css({"display":"block"});
	}else{
		$("#"+ page_id +" .total-desconto").css({"display":"none"});
		$("#"+ page_id +" .titulo-desconto").css({"display":"none"});
	}

	if (!empty(total)){
		$("#"+ page_id +" .titulo-total").html('Total: ');
		$("#"+ page_id +" .total-amount").html(total);
	}
	
	if (!empty(gorjeta)){
		$("#"+ page_id +" .titulo-gorjeta").html('Gorjeta: ');
		$("#"+ page_id +" .total-gorjeta").html(gorjeta);
		$("#"+ page_id +" .total-gorjeta").css({"display":"block"});
		$("#"+ page_id +" .titulo-gorjeta").css({"display":"block"});
	}else{
		$("#"+ page_id +" .total-gorjeta").css({"display":"none"});
		$("#"+ page_id +" .titulo-gorjeta").css({"display":"none"});
	}
	
	var merchant_name=getStorage("merchant_name");	
	if (!empty(merchant_name)){
		$("#"+ page_id +" .restauran-title").html(merchant_name);
	}
}

/* function displayMerchantResumo(data,page_id)
{
		if(!empty(data.merchant_info)){
		$("#"+ page_id +" .logo-wrap").html('<img src="'+data.merchant_info.logo+'" />');
		}
	
		if (!empty(data.cart_total)){
		$("#"+ page_id +" .total-amount").html(data.cart_total);
		}
		
		if (!empty(data.cart.discount)){			
			$("#"+ page_id +" .total-desconto").html(data.cart.discount.amount_pretty);
		}				
		if (!empty(data.cart.sub_total)){
			$("#"+ page_id +" .total-subtotal").html(data.cart.sub_total.amount_pretty);
		}		
		if (!empty(data.cart.delivery_charges)){
			$("#"+ page_id +" .total-entrega").html(data.cart.delivery_charges.amount_pretty);
		}		
		if (!empty(data.cart.packaging)){
			$("#"+ page_id +" .total-embalagem").html(data.cart.packaging.amount_pretty);
		}		
		if (!empty(data.cart.tax)){
			$("#"+ page_id +" .total-comodidade").html(data.cart.tax.amount);
		}		
		
		if (!empty(data.cart.tips)){			
			$("#"+ page_id +" .total-gorjeta").html(data.cart.tips.tips_pretty);
			$(".total-gorjeta").removeClass("trn");
			$(".total-gorjeta").html( data.cart.tips.tips_percentage_pretty );
		} else {
			$(".total-gorjeta").addClass("trn");
			$(".total-gorjeta").html( getTrans("Tip Amount","tip_amount") );
		}
		
		if (!empty(data.cart.grand_total)){
			$("#"+ page_id +" .total-amount").html(data.cart.grand_total.amount_pretty);
		} 
		
	if (data.has_pts==2){		
		setStorage("earned_points", data.points );
		$(".pts_earn_label").show();
		$(".pts_earn_label").html(data.points_label);
	} else {
		$(".pts_earn_label").hide();
		removeStorage("earned_points");
	}

}*/

/* Atualização Master Hub (Alerta de mudança de taxa de entrega) */
function showDialogChangeAddressAlerta (deliveryPrice) {
	if (typeof dialogBrowseResto === "undefined" || dialogBrowseResto==null || dialogBrowseResto=="" ) {
		ons.createDialog('filterBrowseResto.html').then(function(dialog) {
			$(".restaurant_name").val('');
	        dialog.show();

	        translatePage();
	        translateValidationForm();
	        $(".restaurant_name").attr("placeholder", getTrans('Enter Restaurant name','enter_resto_name')  );

	    });
	} else {
		$(".restaurant_name").val('');
		dialogBrowseResto.show();

		/*translatePage();
	    translateValidationForm();
	    $(".restaurant_name").attr("placeholder", getTrans('Enter Restaurant name','enter_resto_name')  );*/
	}
}
/*Fim da atualização*/
/*Atualização Master Hub (Verificação de Endereços e Catálogo de Endereços)*/
function carregaEndereco()
{
	var params = "client_token="+ getStorage("client_token");
	params+="&device_id="+ getStorage("device_id");
	if (isDebug()){
	      	  params+="&device_platform=Android";
	      } else {
	      	  params+="&device_platform="+ device.platform;
	      }	
   callAjax("CarregaEndereco",params);	       
}
/*Fim da atualização*/
/*Atualização Master Hub (Menu Categorias suspenso)*/
function loadMenuFromShortcut(cat_id,mtid)
{

	/*if ( $("#close_store").val()==2 || $("#merchant_open").val()==1 ){
		onsenAlert( getTrans("This Restaurant Is Closed Now.  Please Check The Opening Times",'restaurant_close') );
		return;
	}*/

	/*var options = {
      animation: 'none',
      onTransitionEnd: function() {
      	  callAjax("getItemByCategory", "cat_id="+cat_id+"&merchant_id="+mtid);
      	  showCartNosOrder();
      }
   };
   sNavigator.pushPage("menuItem.html", options);*/

	removeStorage("item_count");
	setStorage("selected_cat_id" , cat_id);
	callAjax("getItemCount", "cat_id="+cat_id+"&merchant_id="+mtid );
	sNavigator.popPage();
	myPopover.hide();
	// showEasyCategory(this);

}
/*Fim da atualização*/
/*Atualização Master Hub (Função de Pesquisar Ids pelo nome do Bairro)*/
function buscar_ids_por_CEP(cidade, nome_bairro)
{
	callAjax("IdsDoCEP","cidade="+cidade+"&nome_bairro="+nome_bairro);
}

function buscar_ids_por_Bairro(nome_bairro)
{
	callAjax("IdsDoBairro","nome_bairro="+nome_bairro);
}
/*Fim da atualização*/
/*Atualização Master Hub (Converter Data para data do Brasil e Extensa)*/
function dataAtualFormatada(converter_data){
    var data = new Date(converter_data);
    var dia = data.getDate();
    if (dia.toString().length == 1)
      dia = "0"+dia;
    var mes = data.getMonth();
    if (mes.toString().length == 1)
      mes = "0"+mes;
    var ano = data.getFullYear();  
    return dia+"/"+mes+"/"+ano;
}

function dataAtualFormatada_NomeMes(converter_data){
	var nomeMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    var diaSemana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']	
    var data = new Date(converter_data);
    var diaS = data.getDay();
	diaS = diaSemana[diaS];
    var dia = data.getDate();
    var mes = data.getMonth();
	mes = nomeMeses[mes];
    var ano = data.getFullYear(); 
	data_completa=[diaS]+", "+[dia, mes, ano].join(' de ');
    return data_completa;
}

function dataAtualFormatada_NomeMes_hora(converter_data){
	var nomeMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    var diaSemana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']	
    var data = new Date(converter_data);
    var diaS = data.getDay();
	diaS = diaSemana[diaS];
    var dia = data.getDate();
    var mes = data.getMonth();
	mes = nomeMeses[mes];
    var ano = data.getFullYear(); 
    var horas    = data.getHours();          // 0-23
    var minutos  = data.getMinutes();        // 0-59
    var segundos = data.getSeconds();        // 0-59
    
//converte as horas, minutos e segundos para string
   str_horas = new String(horas);
   str_minutos = new String(minutos);
   str_segundos = new String(segundos);
   
   //se tiver menos que 2 digitos, acrescenta o 0
   if (str_horas.length < 2)
      str_horas = 0 + str_horas;
   if (str_minutos.length < 2)
      str_minutos = 0 + str_minutos;
   if (str_segundos.length < 2)
      str_segundos = 0 + str_segundos;
    
	data_completa=[diaS]+", "+[dia, mes, ano].join(' de ')+" às "+str_horas + ":" + str_minutos + ":" + str_segundos;
    return data_completa;
}
/*Fim da atualização*/
/* Atualização Master Hub (Personalização) */
function backtoSearch() //Cópia de backtoHome
{
	var options = {     	  		  
  	  closeMenu:true,
      animation: 'slide'	    
   };	   	   	   
   menu.setMainPage('searchCategorias.html',options);
}
/*Fim da atualização*/
/*Atualização Master Hub (Botão de Login novo)*/
function showShippingLocation_login_btn(data)
{	
   var options = {
      animation: 'slide',
      onTransitionEnd: function() {
			if (data.details.has_addressbook==2){
				if(!empty(data.details.default_address)){						      	  	       
		$(".delivery-address-text").html( data.details.default_address.address );
		$(".street").val ( data.details.default_address.street  );
		$(".numero").val ( data.details.default_address.numero  );
		$(".delivery_instruction").val( data.details.default_address.delivery_instruction );
		$(".zipcode").val(  data.details.default_address.zipcode );	
		$(".location_name").val( data.details.default_address.location_name ) ;
					
		global_state_id  = data.details.default_address.state_id;
		global_state_name  = data.details.default_address.state;

		$(".location_state").html( data.details.default_address.state );
		$(".state_id").val( data.details.default_address.state_id );
		$(".state").val( data.details.default_address.state );

		$(".city_id").val(data.details.default_address.city_id);
		$(".city").val(data.details.default_address.city);
		$(".location_city").html( data.details.default_address.city ) ;

		$(".area_id").val(data.details.default_address.area_id);
		$(".area_name").val(data.details.default_address.area_name);
		$(".location_area").html( data.details.default_address.area_name ) ;
      	$(".contact_phone").val($(".contact_phone").masked( data.details.default_address.contact_phone.replace("+55","") ));
				}
			}					      	  	 
											      	  						
      	  if(!empty(data.details.contact_phone)){
    $(".contact_phone").val($(".contact_phone").masked( data.details.contact_phone.replace("+55","") ));
		}
      } 
    };  
	
    sNavigator.pushPage("shippingLocationArea.html", options);
}
/*Fim da atualização*/
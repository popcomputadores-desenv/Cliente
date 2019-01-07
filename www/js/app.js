/**
KMRS MOBILE 
Version 2.7
*/

/**
Default variable declarations 
*/
var ajax_url= krms_config.ApiUrl ;
var dialog_title_default= krms_config.DialogDefaultTitle;
var upload_url= krms_config.UploadUrl;
var search_address;
var ajax_request;
var cart=[];
var networkState;

var easy_category_list='';
var map;
var map_search;
var drag_marker;
var map_track;
var track_order_interval;
var track_order_map_interval;
var drag_marker_bounce=1;

var global_city_id;
var global_city_name;
var global_area_id;
var global_area_name;
var global_state_id;
var global_state_name;
var global_postal_code;

var global_filter_params;
var browse_params;
var push;

var timer = null;
var ajax_lazy;
var ajax_lazy_item;

var app_version = "2.7";
var device_platform = 'android';

var send_post_ajax;
var analytics;

var usethislocation_lat;
var usethislocation_lng;

document.addEventListener("deviceready", onDeviceReady, false);
/*Atualização Master Hub (Máscaras de Campos)*/
$('.mask-phone').mask("(00) 0 0000-0000");
$('.mask-cpf').mask("000.000.000-00");
/*Fim da atualização*/
function onDeviceReady() {    
	    					
	try {
			
		navigator.splashscreen.hide();
		
		device_platform = device.platform;
		
		if(!isDebug()){		
	 	   getLanguageSettings();
		}				
						
		document.addEventListener("pause", onPause, false);
		document.addEventListener("resume", onResume, false);
		
		initPush(false);
   
   } catch(err) {
     alert(err.message);
   } 
}

/*document.addEventListener("offline", onOffline, false);
function onOffline() {    	
    $(".home-page").hide();
    $(".no-connection").show();		
}

document.addEventListener("online", onOnline, false);
function onOnline()
{
	$(".home-page").show();
    $(".no-connection").hide();		
}*/

function onPause() {
   //toastMsg('pause');
}

function onResume() {   
   try {
	   push.setApplicationIconBadgeNumber(function(){
	      //toastMsg("success")
	   }, function() {
	      //toastMsg("failed")
	   },0);
	   
   } catch(err) {
      toastMsg(err.message);       
   } 
}

document.addEventListener("offline", noNetConnection, false);

function noNetConnection()
{
	toastMsg( getTrans("Internet connection lost","net_connection_lost") );
	if ( $(".retry-language").exists() ){
		 $(".retry-language").show();
	}
}


jQuery.fn.exists = function(){return this.length>0;}

function dump(data)
{
	console.debug(data);
}

function setStorage(key,value)
{
	localStorage.setItem(key,value);
}

function getStorage(key)
{
	return localStorage.getItem(key);
}

function removeStorage(key)
{
	localStorage.removeItem(key);
}

function explode(sep,string)
{
	var res=string.split(sep);
	return res;
}

function urlencode(data)
{
	return encodeURIComponent(data);
}

$( document ).on( "keyup", ".numeric_only", function() {
  this.value = this.value.replace(/[^0-9\.]/g,'');
});	 

ons.bootstrap();  
ons.ready(function() {
	dump('ready');
		
	removeStorage("geo_address_result_formatted_address");
	
	if(isDebug()){		
		removeStorage("default_lang");
		removeStorage("search_address");
/*Atualização Master Hub (Tradução)*/
		setStorage("search_address","Cidade Jardim, Rio Claro, SP, Brasil");		
		// setStorage("search_address","none");	
	}
/*Fim da atualização*/
		
	//navigator.splashscreen.hide()	
	$("#s").val( getStorage("search_address") );
		
	refreshConnection();
	
	//removeStorage("client_token");
	
	if(isDebug()){
/*Atualização Master Hub (Nome do dispositivo quando está em modo Debug)*/
	   setStorage("device_id","device_web_masterhub");
	}
/*Fim da atualização*/
	//getLanguageSettings();
	if(isDebug()){
 	   setTimeout('getLanguageSettings()', 1100);
	}
	
	$( document ).on( "click", "#s", function() {    	     	    	   
	   $("#s").val('');
	});
	
}); /*end ready*/

function refreshConnection()
{	
	if ( !hasConnection() ){
		$(".home-page").hide();
		$(".no-connection").show();		
		toastMsg( getTrans("Internet connection lost","net_connection_lost") );
	} else {
		$(".home-page").show();
		$(".no-connection").hide();
	}	
}

function hasConnection()
{
	if(isDebug()){
		return true;
	}
	//networkState = navigator.network.connection.type;		
	var networkState = navigator.connection.type;	
	if ( networkState=="Connection.NONE" || networkState=="none"){	
		return false;
	}	
	return true;
}

function geoComplete()
{
	dump( "country_code_set=>" + getStorage("country_code_set"));
			
	if ( empty(getStorage("country_code_set")) ){				
		if(empty(getStorage("mobile_country_code"))){
		  $("#s").geocomplete();		
		} else {
		  $("#s").geocomplete({
		    country: getStorage("mobile_country_code")
	      });			 
	           
	      setStorage("country_code_set", getStorage("mobile_country_code") );
	      
		}				
	} else {				
		$("#s").geocomplete({
		   country: getStorage("country_code_set")
	    });	
	}
}

function createElement(elementId,elementvalue)
{
   var content = document.getElementById(elementId);
   content.innerHTML=elementvalue;
   ons.compile(content);
}

function searchMerchant()
{			
			
  global_filter_params = '';
  
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
/*Atualização Master Hub (Formatação do Endereço usando o GPS)*/
			  global_city_name = $(".city").val();
	  	   	  global_area_name = $(".area_name").val(); 

			  setStorage("global_city_id",global_city_id);
	  	   	  setStorage("global_area_id",global_area_id);
			  setStorage("global_city_name",global_city_name);
	  	   	  setStorage("global_area_name",global_area_name); 
	  	   	    	   	  
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
	  	   	  global_city_id = $(".city_id").val();
	  	   	  global_state_id = $(".state_id").val();
			  global_area_id = $(".area_id").val(); 
/*Fim da atualização*/
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
				break;
				
				case "2":
				sparams+="&state_id="+ global_state_id;
				sparams+="&city_id="+ global_city_id;
				break;
				
				case "3":
				sparams+="&postal_code="+ global_postal_code;
				break;
				
				default:
				break;
			}
			callAjax("initSearch", sparams );	
		} else {
		    callAjax("initSearch","address="+ getStorage("search_address") + "&search_mode=" + search_mode );		
		}
  } else{
  	 onsenAlert(   getTrans('Address is required','address_is_required')  );
  }
}

/*ons.ready(function() {
  kNavigator.on('prepush', function(event) {  	
  	 dump("prepush");   
  });
});*/

document.addEventListener("pageinit", function(e) {
	dump("pageinit");	
	
	dump("pagname => "+e.target.id);
			
	switch (e.target.id)
	{		
/* Atualização Master Hub (Sugestões de Estabelecimentos) */
		case "page-addsuggestions":
			carregandoSugestoes();
		  break;
/* Fim da atualização */
		case "page-edit_review":
		   translatePage();
		   break;
		   
		case "page_search":		   
		  geoComplete2();
		  $("#ss").attr("placeholder",  getTrans('Street Address,City,State','home_search_placeholder') );
		  translatePage();
		  search_address=getStorage("search_address");
		  if(!empty(search_address)){		  	 		     
		     setTimeout('$("#ss").val(search_address)', 100);
		  }		  
		  		  		  
		  initAutoLocation();		  
		  break;
		  
		case "page_search_byname":
		   $("#ss_restaurant_name").attr("placeholder",  getTrans('Enter Restaurant Name','enter_restaurant_name') );
		   translatePage();
		break;
		
		case "page_search_bystreet":
		  $("#ss_street").attr("placeholder",  getTrans('Enter Street Name','enter_street_name') );
		  translatePage();
		  break;
		   
		case "page_search_bycuisine":
		  $("#ss_cuisine").attr("placeholder",  getTrans('Enter Cuisine Name','enter_cuisine') );
		  translatePage();
		  break;
		  
		case "page_search_byfood":
		  $("#ss_item_name").attr("placeholder",  getTrans('Enter Food Name','enter_food') );
		  translatePage();
		  break;
		  
		case "page-photos":
		   translatePage();
		   callAjax("loadPhotos", "merchant_id=" +  getStorage("merchant_id") );
		   break;
		
		case "page-promo":		  
		  translatePage();
	      callAjax("loadPromos", "merchant_id=" +  getStorage("merchant_id") );	             	       
		  break;
		  
		case "page-menubycategoryitem":		   
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#page-menubycategoryitem .estabelecimento-header2").attr("style",'background-image: url('+ getStorage("merchant_logo") +'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#page-menubycategoryitem .estabelecimento-header").attr("style",'background-image: url('+ getStorage("merchant_logo") +'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
		  $("#page-menubycategoryitem .restauran-title").text( $(".selected_restaurant_name").val() );
	      $("#page-menubycategoryitem .rating-stars").attr("data-score",  $(".selected_restaurant_ratings").val() );	      
	      $("#page-menubycategoryitem .logo-wrap").html('<img src="'+ getStorage("merchant_logo") +'" />');
	      initRating();	      
	      
	      //callAjax("GetCategoryList", "merchant_id="+getStorage("merchant_id") + "&cat_id=" + getStorage("selected_cat_id") );
	      
		break;
		
		case "page-getsettings":
		  //getLanguageSettings();		  
		  break;
					
		case "menucategory-page":
		
		   menu_enabled_gallery = getStorage("menu_enabled_gallery");
		   if(menu_enabled_gallery==1){
	      	 	$("#menu_enabled_gallery").show();
	       } else {
	      	 	$("#menu_enabled_gallery").hide();
	       }
	       
	       menu_enabled_booking = getStorage("menu_enabled_booking");
		   if(menu_enabled_booking==1){
	      	 	$("#menu_enabled_booking").show();
	       } else {
	      	 	$("#menu_enabled_booking").hide();
	       }
	       
	       menu_enabled_hours = getStorage("menu_enabled_hours");
		   if(menu_enabled_hours==1){
	      	 	$("#menu_enabled_hours").show();
	       } else {
	      	 	$("#menu_enabled_hours").hide();
	       }
	       
	       menu_enabled_review = getStorage("menu_enabled_review");	       
		   if(menu_enabled_review==1){		   	   
	      	 	$("#menu_enabled_review").show();
	       } else {
	      	 	$("#menu_enabled_review").hide();
	       }
	       
	       menu_enabled_map = getStorage("menu_enabled_map");
		   if(menu_enabled_map==1){
	      	 	$("#menu_enabled_map").show();
	       } else {
	      	 	$("#menu_enabled_map").hide();
	       }
	       
	       menu_enabled_info = getStorage("menu_enabled_info");
		   if(menu_enabled_info==1){
	      	 	$("#menu_enabled_info").show();
	       } else {
	      	 	$("#menu_enabled_info").hide();
	       }
	       
	       menu_enabled_promo = getStorage("menu_enabled_promo");
		   if(menu_enabled_promo==1){
	      	 	$("#menu_enabled_promo").show();
	       } else {
	      	 	$("#menu_enabled_promo").hide();
	       }
	       
		   callAjax("MenuCategory", "merchant_id="+getStorage("merchant_id") );		   
		break;
		
		case "page-merchantinfo":				
		case "page-change-address":				
		  translatePage();
		  break;
		  
		case "page-receipt":
		  translatePage();
		  setTrackView("receipt");
		  break;
		  
		case "address-bymap":
		  translatePage();
		  $(".search_address_geo").attr("placeholder",  getTrans('Street Address,City,State','home_search_placeholder') );		  
		  $(".map_type").val(  'select_address_from_map' );
		  checkGPS('select_address_from_map');		  
		  break;
		   
		case "page-enter-contact":  
		  translatePage();
		  $(".contact_phone").attr("placeholder", getTrans("Mobile Phone","mobile_number") );
		  translateValidationForm();
		  break;
		  
		case "page-booking":  
		  translatePage();
		  $(".number_guest").attr("placeholder", getTrans("Number Of Guests","number_of_guest") );		  
/*Atualização Master Hub (Desativa entrada do código do país nos campos de telefone)*/
		  //*initIntelInputs();
/*Fim da atualização*/
		  setTrackView("book table: " + $(".selected_restaurant_name").val()  );
		  break;
		  
	   case "page-paymentoption":
	     translatePage();
	     $(".order_change").attr("placeholder", getTrans('change? For how much?','order_change') );	     
/*Atualização Master Hub (Campo CPF na Nota)*/
	     $(".cpf_nota").attr("placeholder", getTrans('CPF na Nota','cpf_nota') );
/*Fim da atualização*/
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#page-paymentoption .estabelecimento-header2").attr("style",'background-image: url('+ getStorage("merchant_logo") +'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#page-paymentoption .estabelecimento-header").attr("style",'background-image: url('+ getStorage("merchant_logo") +'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
		 break;
		 
/* Atualização Master Hub (Programa de Fidelidade) */
		  case "page-fidelidade-empresa":
var params = "client_token="+ getStorage("client_token");
	params+="&device_id="+ getStorage("device_id");
	params+="&merchant_id="+getStorage("merchant_id");		
	if (isDebug()){
	      	  params+="&device_platform=Android";
	      } else {
	      	  params+="&device_platform="+ device.platform;
	      }				
			
			callAjax("ProgramaFidelidade", params );
		//createElement('fidelidade-empresa',htm);	
		  break;
/*Fim da atualização*/	  
	  case "page-addressbook-details":
	    translatePage();
	    translateValidationForm();
	    
	    $(".street").attr("placeholder",  getTrans("Street",'street') );
/*Atualização Master Hub (Número e Bairro)*/
	    $(".numero").attr("placeholder",  getTrans("Numero",'numero') );
	    $(".area_name").attr("placeholder",  getTrans("Bairro",'bairro') );
/*Fim da atualização*/
	    $(".city").attr("placeholder",  getTrans("City",'city') );
	    $(".state").attr("placeholder",  getTrans("State",'state') );
	    $(".zipcode").attr("placeholder",  getTrans("Postal code/Zip Code",'zipcode') );
	    $(".location_name").attr("placeholder",  getTrans("Location name",'location_name') );
/*Atualização Master Hub (Campo Complemento no Catálogo de Endereços)*/
	    $(".delivery_instruction").attr("placeholder",  getTrans("Delivery instructions",'delivery_instruction') );
/*Fim da atualização*/
	    var page = sNavigator.getCurrentPage();
		record_id = page.options.id;			
		search_mode = getSearchMode();	
		if (typeof record_id === "undefined" || record_id==null || record_id=="" || record_id=="null" ) {			
			$(".id").val( '' );
			$(".action").val('add');
			$(".delete-addressbook").hide();
		} else {
			$(".id").val( record_id );
			$(".action").val('edit');
			$(".delete-addressbook").show();
			var params="client_token="+ getStorage("client_token")+"&id="+record_id;
      	    callAjax("getAddressBookDetails",params);
		}
	    
	    break;
	    
	   case "page-signup":		 
	     translatePage();
	     translateValidationForm();
	     $(".first_name").attr("placeholder",  getTrans("First Name",'first_name') );
	     $(".last_name").attr("placeholder",  getTrans('Last Name','last_name') );
	     $(".contact_phone").attr("placeholder",  getTrans('Mobile Phone','contact_phone') );
	     $(".email_address").attr("placeholder",  getTrans('Email address','email_address') );
	     $(".password").attr("placeholder",  getTrans('Password','password') );
	     $(".cpassword").attr("placeholder",  getTrans('Confirm Password','confirm_password') );	     
	     
	     break;
	     
	   case "page-checkoutsignup": 
	     translatePage();
         translateValidationForm();
         
         $(".first_name").attr("placeholder",  getTrans("First Name",'first_name') );
	     $(".last_name").attr("placeholder",  getTrans('Last Name','last_name') );
	     $(".contact_phone").attr("placeholder",  getTrans('Mobile Phone','contact_phone') );
	     $(".email_address").attr("placeholder",  getTrans('Email address','email_address') );
	     $(".password").attr("placeholder",  getTrans('Password','password') );
	     $(".cpassword").attr("placeholder",  getTrans('Confirm Password','confirm_password') );	
	     break;
		  
	   case "page-shipping":	  
	   
	      $(".street").attr("placeholder", getTrans('Street','street') );
/*Atualização Master Hub (Número e Bairro)*/
	      $(".numero").attr("placeholder", getTrans("Numero",'numero') );
	      $(".area_name").attr("placeholder", getTrans("Bairro",'bairro') );
/*Fim da atualização*/
	      $(".city").attr("placeholder", getTrans('City','city') );
	      $(".state").attr("placeholder", getTrans('State','state') );
	      $(".zipcode").attr("placeholder", getTrans('Postal code/Zip Code','zipcode') );
	      $(".contact_phone").attr("placeholder", getTrans('Contact phone','contact_phone') );
	      $(".location_name").attr("placeholder", getTrans('Apartment suite, unit number, or company name','location_name2') );
	      $(".delivery_instruction").attr("placeholder", getTrans('Delivery instructions','delivery_instruction') );
	   
	      translatePage();
	      translateValidationForm();
	      	      
	      //$('.zipcode').mask("00000-000", {placeholder: "_____-___"});
	      
/*Atualização Master Hub (Desativa entrada do código do país nos campos de telefone)*/
		  //*initIntelInputs();
/*Fim da atualização*/
	      
	      var customer_contact_number=getStorage("customer_contact_number");
	      if(!empty(customer_contact_number)){
/*Atualização Master Hub (Máscara do Telefone)*/
	      	  $(".contact_phone").val($(".contact_phone").masked( customer_contact_number.replace("+55","") ));
	      }
/*Fim da atualização*/	      	      
	      if(!empty(usethislocation_lat)){
	      	  $(".google_lat").val(usethislocation_lat);
	      	  $(".google_lng").val(usethislocation_lng);
	      }
	      
	      break;
		
		case "searchresult-page":	
		
		/*$("#search-text").html( getStorage("search_address") );
		
		search_mode = getSearchMode();		
		if ( search_mode=="postcode"){
			var sparams="search_mode="+ search_mode;
			var search_type = getSearchType();			
			switch (search_type)
			{
				case "1":				
				sparams+="&city_id="+ global_city_id;
				sparams+="&area_id="+ global_area_id;
				break;
				
				case "2":
				sparams+="&state_id="+ global_state_id;
				sparams+="&city_id="+ global_city_id;
				break;
				
				case "3":
				sparams+="&postal_code="+ global_postal_code;
				break;
				
				default:
				break;
			}
			callAjax("search", sparams );	
		} else {
		    callAjax("search","address="+ getStorage("search_address") + "&search_mode=" + search_mode );		
		}*/
		
		search_mode = getSearchMode();
		if ( search_mode=="postcode"){
			$("#search-text").html( '' );
		} else {
			$("#search-text").html( getStorage("search_address") );
		}
		
								
		break;
/*Atualização Master Hub (Modificação Pagina Personalizada)*/
		case "carregarPagina-page":	
		var pagina=getStorage("pagina");
		callAjax("Pagina","id="+pagina);
			break;
/* Fim da atualização */
			
/*Atualização Master Hub (Modificação Slide Personalizado)*/
		case "carregarSlide-page":	
		var slide=getStorage("slide");
		callAjax("Pagina","id="+slide);
			break;
/* Fim da atualização */
		
		case "page-home":
		    		    
		    setNotificationDisplay();
		    translatePage();
/*Atualização Master Hub (Verifica se há endereço cadastrado no Catálogo de Endereço)*/
		if (isLogin()){
			$(".catalogo_endereco").hide();
			$(".search_by_location_btn").show();
			//$(".search_by_address").hide();
			setTimeout('carregaEndereco();', 2000);
		} 
/*Fim da atualização*/
/*Atualização Master Hub (Slide Inicial)*/
	var splash_screen = getStorage("splash_screen");
	var slide=getStorage("slide");
	dump("slide=>"+slide);
		
	
	if (empty(splash_screen))
	{
		carregarPagina(slide);
		
		setStorage("splash_screen", 2);
		return;
	} 
/*Fim da atualização*/
		    search_mode = getSearchMode();
		    if ( search_mode=="postcode"){		
		    	
		    	search_type = getSearchType();
		    	dump("search_type=>"+search_type);
		    			    	
		    	$(".search_by_location").show();
				$(".search_by_address").hide();			
				$(".advance_search").hide();		
				
				dump(global_city_id);
				dump(global_area_id);
				dump(global_city_name);
				dump(global_area_name);
				
				if ( !empty(global_city_id)){
					$(".city_id").val( global_city_id );
/*Atualização Master Hub (Formatação do Endereço usando o GPS)*/
					$(".city").val( global_city_name );
					$(".location_city").html( global_city_name );
				}
				if ( !empty(global_area_id)){
					$(".area_id").val( global_area_id );
					$(".area_name").val( global_area_name );
/*Fim da atualização*/
					$(".location_area").html( global_area_name );
				}	
				
				switch (search_type)
				{
					case "1":
					case 1:
/*Atualização Master Hub (Personalização Estado, Cidade e Bairro como texto na tela inicial)*/
					$(".bairro_cidade").show();	
					$(".cidade_estado").hide();	
					$(".location_state").hide();
					$(".location_postal").hide();
					break;
					
					case "2":
					case 2:
					$(".cidade_estado").show();		
					$(".bairro_cidade").hide();
/*Fim da atualização*/
					if ( !empty(global_state_id)){
						$(".state_id").val( global_state_id );
/*Atualização Master Hub (Formatação do Endereço usando o GPS)*/
						$(".state").val( global_state_name );
						$(".location_state").html( global_state_name );
					}
						
					if ( !empty(global_city_id)){
						$(".city_id").val( global_city_id );
						$(".city").val( global_city_name );
						$(".location_city").html( global_city_name );
					}
					if ( !empty(global_area_id)){
						$(".area_id").val( global_area_id );
						$(".area_name").val( global_area_name );
						$(".location_area").html( global_area_name );
/*Fim da atualização*/
					}	
					
					$(".location_state").show();
					$(".location_area").hide();
					$(".location_postal").hide();
					break;
					
					case "3":
					case 3:
/*Atualização Master Hub (Personalização Estado, Cidade e Bairro como texto na tela inicial)*/
					$(".bairro_cidade").hide();
					$(".cidade_estado").hide();		
/*Fim da atualização*/
					$(".location_state").hide();
					$(".location_city").hide();
					$(".location_area").hide();
					$(".location_postal").show();
					break;
				}
							
		    } else {			
		    	var enabled_advance_search = getStorage("enabled_advance_search");
		    	if(enabled_advance_search=="yes"){
		    		
		    		theme_address = getStorage("theme_search_merchant_address");
		    		theme_name = getStorage("theme_search_merchant_name");
		    		theme_street_name = getStorage("theme_search_street_name");
		    		theme_cuisine = getStorage("theme_search_cuisine");
		    		theme_foodname = getStorage("theme_search_foodname");
		    				    		
		    		var tab_html='';
		    		 tab_html+='<ons-tabbar position="top" class="menu_tabbar" var="menu_tabbar" >';
		    		      if(theme_address!=2){
						     tab_html+='<ons-tab page="page_search.html" label="'+ getTrans('Address','address') +'" icon="ion-ios-location"></ons-tab>';
		    		      }
		    		      if(theme_name!=2){
						     tab_html+='<ons-tab page="page_search_byname.html" label="'+ getTrans('Name','name') +'" icon="ion-android-restaurant"></ons-tab>';
		    		      }
		    		      if(theme_street_name!=2){
						     tab_html+='<ons-tab page="page_search_bystreet.html" label="'+ getTrans('Street','street') +'" icon="ion-map"></ons-tab>';
		    		      }
		    		      if(theme_cuisine!=2){
						     tab_html+='<ons-tab page="page_search_bycuisine.html" label="'+ getTrans('Cuisine','cuisine') +'" icon="ion-icecream"></ons-tab>';
		    		      }
		    		      if(theme_foodname!=2){
						     tab_html+='<ons-tab page="page_search_byfood.html" label="'+ getTrans('Food','food') +'" icon="ion-soup-can-outline"></ons-tab>';
		    		      }
					 tab_html+='</ons-tabbar>';
		    		
		    		createElement("tabbar_wrap",tab_html);
		    		
		    		$(".search_by_location").hide();
					$(".search_by_address").hide();
					$(".advance_search").show();		
					
					
					 setTimeout(function(){ 
					    menu_tabbar.setActiveTab(0);	
					 }, 100);
												
		    	} else {		    	
			    	$(".search_by_location").hide();
			    	$(".advance_search").hide();
					$(".search_by_address").show();
					
					geoComplete();
					search_address=getStorage("search_address");					
					if (typeof search_address === "undefined" || search_address==null || search_address=="" ) { 						
						if ( !empty( getStorage("geo_address_result_formatted_address") ) ){
							search_address=getStorage("geo_address_result_formatted_address");
							setTimeout('$("#s").val(search_address)', 100);
						}						
					} else {												
						setTimeout('$("#s").val(search_address)', 100);
					}										
					$("#s").attr("placeholder",  getTrans('Street Address,City,State','home_search_placeholder') );		
					
					initAutoLocation();
							
		    	}								
		    }
		    
		    setTrackView('homepage');		    
			
		break;
			
		case "page-filter-options":
		  callAjax('cuisineList','');
		  break;
		
		case "page-browse":
		  //callAjax('browseRestaurant','');
		  
		  setTrackView('browse restaurant');
		  
		  translatePage();
		  break;
		  
		case "page-profile":
		  callAjax('getProfile',
		  "client_token="+getStorage("client_token")
		  );
		  translatePage();
		  translateValidationForm();
		  
		  $(".first_name").attr("placeholder",  getTrans('First Name','first_name') );
		  $(".last_name").attr("placeholder",  getTrans('Last Name','last_name') );
		  $(".email_address").attr("placeholder",  getTrans("Email Address",'email_address') );
		  $(".password").attr("placeholder",  getTrans("Password",'password') );
		  
		  break;
		
		case "page-orders":  
		
		  setTrackView("order history");
		  		
		  callAjax('getOrderHistory',
		  "client_token="+getStorage("client_token")
		  );
		  translatePage();
		  break;
		  
		case "page-addressbook": 
		  callAjax('getAddressBook',
		  "client_token="+getStorage("client_token")
		  );
		  translatePage();
		  break;
		  
		case "page-dialog-addressbook":  
		  callAjax('getAddressBookDialog',
		  "client_token="+getStorage("client_token")
		  );
		  break;
		  
		case "page-login":  
		case "page-prelogin":  
		  initSocialLogin();
		  translatePage();
		  translateValidationForm();

		  $(".email_address").attr("placeholder",  getTrans('Email address','email_address') );
		  $(".password").attr("placeholder",  getTrans('Password','password') );
		  
		  setTrackView("log in or register page")	  
		  
		  break;
		  		  		  
		case "page-settings":  
		
		  if (isDebug()){
/*Atualização Master Hub (Versão do Sistema em modo Debug)*/
		    	$(".software_version").html( "2.7.1 - Debug" );
/*Fim da atualização*/
		  } else {
		    	$(".software_version").html( BuildInfo.version );
		  }
		  
		  setTrackView("app settings");
		   
		  callAjax("getSettings",
		  "device_id="+getStorage("device_id")
		  ); 
		  translatePage();
		  break;
		  
		case "page-locations":  
		  callAjax('mobileCountryList',
		  "device_id="+getStorage("device_id")
		  );
		  break;
		  
		case "page-languageoptions":  
		  callAjax('getLanguageSelection','');
		  break;
		  
		case "page-expirationmonth": 
		  fillExpirationMonth();
		  break;	
		  
		case "page-expiration-year": 
		  fillExpirationYear();
		  break;  	  
		  
		case "page-show-country":  
		   fillCountryList();
		   break;  	  
		  		
		   
		case "page-pts":   
		  dump('page-pts');
		   callAjax('getPTS',
		    "client_token="+getStorage("client_token")
		   );
		   translatePage();
		   break; 
		
		case "page-atz-form":
		   translatePage();
	       translateValidationForm();	    
	       
	       $(".cc_number").attr("placeholder",  getTrans("Credit Card Number",'cc_number') );
	       $(".cvv").attr("placeholder",  getTrans("CVV",'cvv') );
	       $(".x_first_name").attr("placeholder",  getTrans("First Name",'first_name') );
	       $(".x_last_name").attr("placeholder",  getTrans("Last Name",'last_name') );
	       $(".x_address").attr("placeholder",  getTrans("Address",'address') );
	       $(".x_city").attr("placeholder",  getTrans("City",'city') );
	       $(".x_state").attr("placeholder",  getTrans("State",'state') );
	       $(".x_zip").attr("placeholder",  getTrans("Postal code/Zip Code",'zipcode') );
	       
		   break; 
		   
		case "page-stripe-form":   
		   translatePage();
	       translateValidationForm();  
	       
	       $(".cc_number").attr("placeholder",  getTrans("Credit Card Number",'cc_number') );
	       $(".cvv").attr("placeholder",  getTrans("CVV",'cvv') );
	       
		   break; 
		   
		   
		case "page-verify-account":   
		  $(".code").attr("placeholder",  getTrans("Code",'code') );
		  $(".email_address").attr("placeholder",  getTrans("Email Address",'email_address') );
		  translatePage();
		  translateValidationForm();
		 break;
		 
		case "page-address-selection":
           translatePage();
		   translateValidationForm();
		   $(".stree_1").attr("placeholder",  getTrans("Street",'street') );
/*Atualização Master Hub (Número e Bairro)*/
	       $(".numero_1").attr("placeholder",  getTrans("Numero",'numero') );
	       $(".area_name_1").attr("placeholder",  getTrans("Bairro",'bairro') );
/*Fim da atualização*/
	       $(".city_1").attr("placeholder",  getTrans("City",'city') );
	       $(".state_1").attr("placeholder",  getTrans("State",'state') );
	       $(".zipcode_1").attr("placeholder",  getTrans("Postal code/Zip Code",'zipcode') );	      		
		  break;
		  
		  
		case "page-hubtel-channel":  
		   callAjax('getHubtelChannel',"client_token="+getStorage("client_token"));
		   break;
		   
		/*case "page-location-city":   
		   callAjax('getLocationCity', "" );
		   break;*/
		   
		case "page-location-area":   
		   callAjax('getLocationArea', "city_id=" + $(".city_id").val() );
		   break; 
		   
		case "page-location-type":  
		
		   translatePage();
		   
		   if ( !empty(global_city_id)){
		   	   $(".location_city").html( global_city_name );
		   	   $(".city_id").val( global_city_id );
		   }
		   if ( !empty(global_area_id)){
		   	   $(".location_area").html( global_area_name );
		   	   $(".area_id").val( global_area_id );
		   }
		   
		   if ( !empty(global_state_id)){
		   	   $(".location_state").html( global_state_name );
		   	   $(".state_id").val( global_state_id );
		   }
		   
		   search_type = getSearchType();
		   switch (search_type)
		   {
		   	   case "1":
		   	   $(".location_state").hide();
		   if ( !empty(global_state_id)){
		   	   $(".location_state").html( global_state_name );		   	   		   	   
		   	   $(".state_id").val( global_state_id );
		   	   $(".state").val( global_state_name );
				}
				if ( !empty(global_city_id)){
					$(".city_id").val( global_city_id );
					$(".city").val( global_city_name );
					$(".location_city").html( global_city_name );
				}
				if ( !empty(global_area_id)){
					$(".area_id").val( global_area_id );
					$(".area_name").val( global_area_name );
					$(".location_area").html( global_area_name );
		   }
				   
		   	   break;
		   	   
		   	   case "2":
		   	   //$(".location_area").hide();
		   	   break;
		   	   
		   	   case "3":
		   	   break;
		   }
		   
		   break;
		   
		case "page-shipping-location-area":   
		
		   translatePage();
		   $(".street").attr("placeholder", getTrans('Street','street') );
		   $(".contact_phone").attr("placeholder", getTrans('Contact phone','contact_phone') );
	       $(".location_name").attr("placeholder", getTrans('Apartment suite, unit number, or company name','location_name2') );
	       $(".delivery_instruction").attr("placeholder", getTrans('Delivery instructions','delivery_instruction') );
		   
		   if ( !empty(global_city_id)){
		   	   $(".location_city").html( global_city_name );
		   	   
		   	   $(".city").val( global_city_name );
		   	   $(".city_id").val( global_city_id );
		   }
		   
		   if ( !empty(global_area_id)){
		   	   $(".location_area").html( global_area_name );
		   	   
		   	   $(".state").val( global_area_name );
		   	   $(".area_id").val( global_area_id );
		   }
		   
		   if ( !empty(global_state_id)){
		   	   $(".location_state").html( global_state_name );		   	   		   	   
		   	   $(".state_id").val( global_state_id );
		   	   $(".state").val( global_state_name );
		   }
		   		   
           translateValidationForm();
/*Atualização Master Hub (Desativa entrada do código do país nos campos de telefone)*/
           //*initIntelInputs();
/*Fim da atualização*/
           var customer_contact_number=getStorage("customer_contact_number");
	       if(!empty(customer_contact_number)){
/*Atualização Master Hub (Máscara do Telefone)*/
	      	  $(".contact_phone").val($(".contact_phone").masked( customer_contact_number.replace("+55","") ));
	       } 
/*Fim da atualização*/
	       
		   break;

		 case "page-location-postal":   
		   callAjax('getLocationPostal', "" );
		   break;
		   
		 case "page-ipay_mpesa":  
		    $(".ipay_phone_number").val( $(".ipay_phone_number").val() ) ;      	          	    
      	    //callAjax("ipayAfricaGetInstructions", "key="+e.target.id );
      	     $(".ipay_mpesa_content").html ( $(".int_MPESA").val()  );
		   break;
		   
		 case "page-ipay_airtel":  		 		    
		   //callAjax("ipayAfricaGetInstructions", "key="+e.target.id );
		   $(".ipay_airtel_content").html ( $(".int_AIRTEL").val()  );
		   break;
		   
		 case "page-dixicards-form":  		 
		   callAjax('getDixiCards', "&client_token="+ getStorage("client_token") );
		   break;
		 
		 case "page-map":		
		   translatePage();
  		   var page = sNavigator.getCurrentPage();	  	
  		   $(".map_type").val(  page.options.map_type );
		   checkGPS(page.options.map_type);
		 break;
		
		 /*case "page-cart":
		   translatePage();
		   search_address = getStorage("search_address");
		   if(!empty(search_address)){
		  	  $(".google_formatted_address").html( search_address );
		   }
		 break*/
		
		 case "page-track-order":
		   translatePage();
		   var params='order_id=' + $(".order_option_order_id").val();
      	   params+="&client_token="+getStorage("client_token");
		   callAjax("trackOrderHistory",params);	       	 		  
		   stopTrackInterval();	
		 break;
		 
		 case "tracking-page":
		   translatePage();
		   initTrackingMap();
		 break;
		 
		 case "page-order_details":		    
		    var page = sNavigator.getCurrentPage();	  			    
		    $("#page_title").html( getTrans('Order Details','order_details') + " #"+page.options.order_id );
  		    callAjax("getReceipt","order_id="+ page.options.order_id );	
		 break;
		 
		 case "page-order-options":		 
		   translatePage();
		   var page = sNavigator.getCurrentPage();
		   $(".page_title").html( getTrans("Order Options",'order_option') + " #"+ page.options.order_id );
		   $(".order_option_order_id").val( page.options.order_id );
		   
		   show_cancel_order = page.options.show_cancel_order;
		   if(show_cancel_order==1){
		   	  $(".cancel_this_order").show();
		   } else {
		   	  $(".cancel_this_order").hide();
		   }
		   
		   show_review = page.options.show_review;
		   if(show_review==1){
		   	  $(".add_review_order").show();
		   } else {
		   	  $(".add_review_order").hide();
		   }
		   
		 break;
		 
		 case "page-cart":
		 
		   translatePage();
		   search_address = getStorage("search_address");
		   //alert(search_address);
		   if (typeof search_address === "undefined" || search_address==null || search_address=="" || search_address=="null" ) { 	    		   			  	  
		   	  $(".google_formatted_address").html( '' );
		   } else {
		   	  $(".google_formatted_address").html( search_address );
		   }
		   
		  var cart_params=JSON.stringify(cart);       	        	  
      	  if (saveCartToDb()){
      	  	  var cart_params='';
      	  }      	  
      	  
      	  if ( empty(getStorage("tips_percentage")) ){
      	  	   setStorage("tips_percentage",0);
      	  }
      	  
      	  var remove_tips='';
      	  if(!empty(getStorage("remove_tips"))){
      	  	  remove_tips=getStorage("remove_tips");
      	  }
      	  
      	  var tips_percentage='';
      	  if(!empty(getStorage("tips_percentage"))){
      	  	  tips_percentage=getStorage("tips_percentage");
      	  }
      	      	        	        	        	 
      	  var params="merchant_id="+ getStorage('merchant_id');
      	  
      	  
      	  if(!empty(getStorage("search_address"))){
      	     params+="&search_address="+encodeURIComponent(getStorage("search_address"));
      	  } else {
      	  	if(!empty(getStorage("geo_address_result_formatted_address"))){
      	  		params+="&search_address="+encodeURIComponent(getStorage("geo_address_result_formatted_address"));
      	  	}
      	  }
      	  
      	  params+="&cart="+cart_params;
      	  
      	  if(empty(getStorage("transaction_type"))){      	  	      	  	
      	  	switch (getStorage("merchant_services"))
      	  	{
      	  		case 3:
      	  		case 6:
      	  		case "3":
      	  		case "6":
      	  		params+="&transaction_type=pickup";
      	  		setStorage('transaction_type','pickup');
      	  		break;
      	  		      	  		
      	  		case 7:
      	  		case "7":
      	  		params+="&transaction_type=dinein";
      	  		setStorage('transaction_type','dinein');
      	  		break;
      	  		
      	  		default:
      	  		params+="&transaction_type=delivery";
      	  		break;
      	  	}
      	  } else {
      	  	params+="&transaction_type=" + getStorage("transaction_type");
      	  }      	  
      	  
      	  
      	  params+="&device_id="+ getStorage("device_id");
      	  params+="&tips_percentage=" + tips_percentage;
      	  params+="&remove_tips=" + remove_tips;
      	        	 
      	  callAjax("loadCart",params);
      	  
		 break;
		 
		 case "page-popup_options":
		   loadOptionList();
		 break;
		 
		 case "page-addreviews":
		   var page = sNavigator.getCurrentPage();
		   order_id = page.options.order_id;	
		   $(".order_id").val( order_id );
		   $('.raty-stars').raty({ 
			   score:0,
			   readOnly: false, 		
			   path: 'lib/raty/images',
			   click: function (score, evt) {					   	   
			   	   $(".rating").val( score );
			   }
		  }); 		  
		  		  		 
		  displayMerchantLogo2( 
            getStorage("merchant_logo") ,
           '' ,
           'page-addreviews'
          );    
             
		 break;
		 
		 case "page-reviews":
		   website_review_type = getStorage("website_review_type");		   
		   if(website_review_type==2){
		   	  $(".add_review_button").hide();
		   }
		   
		   displayMerchantLogo2( 
      	     getStorage("merchant_logo") ,
      	     '' ,
      	     'page-reviews'
      	   );    
		   
		   var params="merchant_id=" +  getStorage("merchant_id") ;
      	   params+="&client_token="+ getStorage("client_token");
	       callAjax("merchantReviews",params);
	       
		 break;
		 
		 case "page_postcode_address":
		 
		    $(".street").attr("placeholder", getTrans('Street','street') );		   
	        $(".location_name").attr("placeholder", getTrans('Apartment suite, unit number, or company name','location_name2') );	       
	        translateValidationForm();
	        translatePage();
	       
		    var page = sNavigator.getCurrentPage();
		    record_id = page.options.id;	
		    if (typeof record_id === "undefined" || record_id==null || record_id=="" || record_id=="null" ) {
		    	$(".id").val('');
		    	$(".delete-addressbook-location").hide();
		    } else {
		    	$(".id").val(record_id);
		    	var params="client_token="+ getStorage("client_token")+"&id="+record_id;
      	        callAjax("getPostCodeAddressBookDetails",params);
		    }
		 break;
		 
		 case "page_popup_address_location":		         	   
      	   getAddressBookLocation();
		 break;
		 
		 case "page_notifications":		   		   
		   if (!isLogin()){		   	
		   	  removeStorage("client_token");		   	  
		   }
      	   callAjax("getNotificationList",'');
		 break;
		 
		 case "page_map_delivery":
		    toastMsg(  getTrans("For exact location of your delivery address please select your address from map",'exact_location') );
		    $(".map_type").val('delivery_map');
		    checkGPS( $(".map_type").val() );
		 break;
		 
		 /*end pagname*/
		 
		 default:
		   break;
	}
    
}, false);

function searchResultCallBack(address)
{
	search_address=address;	
}

function showFilterOptions()
{	
	if (typeof navDialog === "undefined" || navDialog==null || navDialog=="" ) { 	    
		ons.createDialog('filterOptons.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	    });	
	} else {
		navDialog.show();
		//translatePage();
	}	
}

function applyFilter()
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
	
	
	params = "address="+ getStorage("search_address") +"&services=" + services + 
	"&cuisine_type="+cuisine_type + "&restaurant_name="+ urlencode($(".filter_restaurant_name").val()) ;
	
	search_mode = getSearchMode();
	if ( search_mode=="postcode"){
		params+="&search_mode="+ search_mode;
		search_type = getSearchType();
		switch (search_type)
		{
			case "1":				
			params+="&city_id="+ global_city_id;
			params+="&area_id="+ global_area_id;
			break;
			
			case "2":
			params+="&state_id="+ global_state_id;
			params+="&city_id="+ global_city_id;
			break;
			
			case "3":
			params+="&postal_code="+ global_postal_code;
			break;
			
			default:
			break;
		}
	}
	

	global_filter_params = params;
	//callAjax("search", params);	
	callAjax("initSearch", params );	
}

function onsenAlert(message,dialog_title)
{		
	if (typeof dialog_title === "undefined" || dialog_title==null || dialog_title=="" ) { 
		dialog_title=dialog_title_default;
	}
	
	if(empty(message)){
		message='undefined error';
	}
	
	label = getTrans('Ok','ok');	
	if (typeof label === "undefined" || label==null || label=="" ) {
		label="Ok";
	}
		
	ons.notification.alert({
      message: message,
      title:dialog_title,
      buttonLabel : getTrans('Ok','ok')
    });
}

function hideAllModal()
{
	setTimeout('loaderSearch.hide()', 1);
	setTimeout('loader.hide()', 1);
	setTimeout('loaderLang.hide()', 1);
}

/*mycallajax*/
function callAjax(action,params)
{
	
	if ( !hasConnection() ){		
		switch (action)
		{
			case "registerMobile":			
			break;
			
			case "getLanguageSettings":
			  $(".retry-language").show();
			break;
			
			default:
			toastMsg(  getTrans("CONNECTION LOST",'connection_lost') );
			break;
			
		}
		return;
	}
	
	
	/*ADD MORE PARAMETERS*/
	switch (action)
	{		
		case "loadCart":
		case "placeOrder":
		case "getPaymentOptions":
		case "checkout":
			  search_mode = getSearchMode();
			  if ( search_mode=="postcode"){
			  	  params+="&search_mode=" + search_mode;		
			  	  params+="&search_type=" + getSearchType()			  	  
			  	  	  
			  	  if(!empty(global_city_id)){
			  	     params+="&city_id=" + global_city_id;
			  	  }
			  	  if(!empty(global_area_id)){
			  	     params+="&area_id=" + global_area_id;
			  	  }
			  	  if(!empty(global_state_id)){
			  	     params+="&state_id=" + global_state_id;
			  	  }
			  	  if(!empty(global_postal_code)){
			  	     params+="&postal_code=" + global_postal_code;
			  	  }
			  }
		break;
		
		default:
		break;
		
	}
	
	dump("action=>"+action);
	
	/*add language use parameters*/
	params+="&lang_id="+getStorage("default_lang");
	params+="&lang="+getStorage("default_lang");
	
	if(!empty(krms_config.APIHasKey)){
		params+="&api_key="+urlencode(krms_config.APIHasKey);
	}
	
	params+="&app_version="+ app_version;
	
	var device_id=getStorage("device_id");
	if(!empty(device_id)){
		params+="&device_id="+device_id;
	}
	
	if (isDebug()){
  	  params+="&device_platform=Android";
    } else {
  	  params+="&device_platform="+ encodeURIComponent(device.platform);
    }	 
	
    client_token = getStorage("client_token");
    if(!empty(client_token)){
       params+="&client_token="+ client_token;
    }
    
	//alert(ajax_url+"/"+action+"?"+params);
	dump(ajax_url+"/"+action+"?"+params);
	
    ajax_request = $.ajax({
		url: ajax_url+"/"+action, 
		data: params,
		type: 'post',                  
		async: false,
		dataType: 'jsonp',
		timeout: 20000,
		crossDomain: true,
	 beforeSend: function() {
		if(ajax_request != null) {			 	
		   /*abort ajax*/
		   hideAllModal();	
           ajax_request.abort();
           clearTimeout(timer);
		} else {    
			/*show modal*/			

			timer = setTimeout(function() {
				hideAllModal();				
				ajax_request.abort();
	            toastMsg( getTrans('Request taking lot of time. Please try again','request_taking_lot_time')  );	            
	        }, 20000);
			  
			switch(action)
			{
				case "registerMobile":
				   break;
				case "search":
				   loaderSearch.show();
				   translatePage();
				   break;
			    case "getLanguageSettings":			    
			       loaderLang.show();
			       break;
				default:
				   loader.show();
				   break;
			}
		}
	},
	complete: function(data) {					
		ajax_request=null;   	     				
		hideAllModal();		
	},
	success: function (data) {	  
		dump(data); 		
		if (data.code==1){
			switch (action)
			{

				case "loadPhotos":
				   var html_gallery='<ons-carousel swipeable overscrollable auto-scroll fullscreen var="carousel">';
				   
				   $.each( data.details, function( key, val ) {
				   	    dump(val);				   
				   	    html_gallery+='<ons-carousel-item>';
				   	       html_gallery+='<div class="item-label" style="background-image: url('+val+')" ></div>';
				   	    html_gallery+='</ons-carousel-item>';
				   });
				   
				   html_gallery+='<ons-carousel-cover>';
                     html_gallery+='<div class="cover-label">'+  getTrans("Swipe left or right",'swipe') +'</div>';
                   html_gallery+='</ons-carousel-cover>';
				   
				   html_gallery+='</ons-carousel>';
				   				   
				   createElement("gallery_list",html_gallery);
				break;
				
				case "getReview":
			        var options = {
				      animation: 'slide',
				      onTransitionEnd: function() { 
				      	  $(".review").val( data.details.review);
				      	  $(".review_id").val( data.details.id);
				      } 
				    };     
				    sNavigator.pushPage("page-edit_review.html", options);
				    break;
				    
				case "deleteReview":
				    loadMoreReviews();
				    break;
				    
				case "updateReview":
				    sNavigator.popPage({cancelIfRunning: true}); 
				    loadMoreReviews();
				    break;
				
				case "loadPromos":
				  if ( data.details.enabled==2){
				  	
				  	 var html_promo = '<ons-list class="list-dim-text">';
				  	 
				  	 if(!empty(data.details.offer)){
				  	 	 html_promo += '<ons-list-header>'+ getTrans("Promos","promos")+'</ons-list-header>';
					  	 $.each( data.details.offer, function( key, val ) {					  	 	
					  	 	html_promo += '<ons-list-item>'+val+'</ons-list-item>';
					  	 });
				  	 }
				  	 
				  	 if(!empty(data.details.voucher)){
				  	 	 html_promo += '<ons-list-header>'+ getTrans("Vouchers","vouchers")+'</ons-list-header>';  
					  	 $.each( data.details.voucher, function( key, val ) {
					  	 	dump(val);
					  	 	html_promo += '<ons-list-item>'+val+'</ons-list-item>';
					  	 });
				  	 }
/* Atualização Master Hub (Programa de Fidelidade) */
				  	 if(!empty(data.details.fidelidade)){
				  	 	 html_promo += '<ons-list-header>'+ getTrans("Programa de Fidelidade","programa_fidelidades")+'</ons-list-header>';  
					  	 $.each( data.details.fidelidade, function( key, val ) {
					  	 	dump(val);
					  	 	html_promo += '<ons-list-item>'+val+'</ons-list-item>';
					  	 });
				  	 }
/*Fim da atualização*/
				  	 if(!empty(data.details.free_delivery)){
				  	 	html_promo += '<ons-list-header>'+ getTrans("Delivery","delivery")+'</ons-list-header>'; 
				  	 	html_promo += '<ons-list-item>'+data.details.free_delivery+'</ons-list-item>';
				  	 }
				  	 
				  	 html_promo += '</ons-list>';
				  	 				  	
				  	 createElement("promo-list",html_promo);
				  } else {
				  	  //createElement("promo-list", '<p style="margin:20px;" class="small-font-dim">' +  data.msg + '</span>' );
				  	  createElement("promo-list",'');
				  	  toastMsg(data.msg)
				  }					
				break;
				
				case "search":				
				displayRestaurantResults(data.details.data ,'restaurant-results');
				//$(".result-msg").text(data.details.total+" Restaurant found");
				console.log(data.details.total);
				$(".result-msg").text(data.details.total == 1 ? +"1 empresa entrega no seu bairro" : data.details.total+" "+getTrans("Restaurant found",'restaurant_found') );
								
				break;
/*Atualização Master Hub (Verificação de Endereços, Catálogo de Endereços e Personalização de texto na tela inicial)*/
				case "CarregaEndereco":
				
			if (data.details.has_addressbook==2){
		if(!empty(data.details.default_address)){
if (data.details.default_address.area_id==0 || data.details.default_address.city_id==0){
						onsenDialogAddresBookOld(); 
		} else 
					  
		setStorage("global_area_name", data.details.default_address.area_name);
		setStorage("global_city_name", data.details.default_address.city);
		setStorage("global_state_name", data.details.default_address.state);	  
		setStorage("global_area_id", data.details.default_address.area_id);
		setStorage("global_city_id", data.details.default_address.city_id);
		setStorage("global_state_id", data.details.default_address.state_id);
				
		$(".delivery-address-text").html( data.details.default_address.address );
		$(".street").val ( data.details.default_address.street  );
		$(".numero").val ( data.details.default_address.numero  );
		$(".delivery_instruction").val( data.details.default_address.delivery_instruction );
		$(".zipcode").val(  data.details.default_address.zipcode );	
		$(".location_name").val( data.details.default_address.location_name ) ;
		
		global_area_id  = data.details.default_address.area_id;
		global_area_name  = data.details.default_address.area_name;
		global_city_id  = data.details.default_address.city_id;
		global_city_name  = data.details.default_address.city;
		global_state_id  = data.details.default_address.state_id;
		global_state_name  = data.details.default_address.state;

		$(".location_state").html( data.details.default_address.state );
		$(".location_city").html( data.details.default_address.city ) ;
		$(".location_area").html( data.details.default_address.area_name ) ;
		$(".city").html(data.details.default_address.city);
		$(".area_name").html(data.details.default_address.area_name);
		$(".state").html( data.details.default_address.state );
					
		$(".state_id").val( data.details.default_address.state_id );
		$(".state").val( data.details.default_address.state );
		$(".city_id").val(data.details.default_address.city_id);
		$(".city").val(data.details.default_address.city);
		$(".area_id").val(data.details.default_address.area_id);
		$(".area_name").val(data.details.default_address.area_name);
      	$(".contact_phone").val(data.details.default_address.contact_phone.replace("+55",""));
											      	  						
      	  if(!empty(data.details.contact_phone)){
    $(".contact_phone").val( data.details.contact_phone.replace("+55","") );
		}
			//$(".search_by_location").hide();
			$(".search_by_location_btn").show();
			$(".catalogo_endereco").hide();
			
search_type = getSearchType();
		switch (search_type)
		{
			case "1":				
				$(".bairro_cidade").show();	
				$(".cidade_estado").hide();
			break;
			
			case "2":
				$(".bairro_cidade").hide();	
				$(".cidade_estado").show();
			break;
			
			case "3":
				$(".bairro_cidade").hide();	
				$(".cidade_estado").hide();
			break;
			
			default:
			break;
		}			
											    
			} else onsenDialogAddresBookDefault();
						      	  	    	
		} else onsenDialogAddresBook();				      	  	 
				break;	
/*Fim da atualização*/
/*Atualização Master Hub (Personalização Sugestões, Página Personalizada e Abertos e Fechados)*/
				case "MenuCategory":			
				/*save merchant logo*/								
				setStorage("merchant_logo",data.details.logo);
				dump(data.details.restaurant_name);
				setStorage("merchant_name",data.details.restaurant_name);
				
				setStorage("enabled_table_booking",data.details.enabled_table_booking);
				
				setStorage("merchant_latitude",data.details.coordinates.latitude);
				setStorage("merchant_longtitude",data.details.coordinates.longtitude);
				setStorage("merchant_address",data.details.address);
				
				removeStorage("transaction_type");
				setStorage("merchant_services",data.details.service);
				
				removeStorage("two_flavor_option");
				if(!empty(data.details.two_flavor_option)){
				   setStorage("two_flavor_option",data.details.two_flavor_option);				   
				}
				
				$("#menucategory-page .restauran-title").text(data.details.restaurant_name);
				$("#menucategory-page .rating-stars").attr("data-score",data.details.ratings.ratings);
				initRating();
				$("#menucategory-page .logo-wrap").html('<img src="'+data.details.logo+'" />');
/* Atualização Master Hub (Programa de Fidelidade) */
				if (data.details.programa_fidelidade!=false){	
					fidelidade_PaginaCategorias(data.details);
				}
/*Fim da atualização*/
				if ( data.details.open){
					$("#merchant_open").val(2);
				} else $("#merchant_open").val(1);
					
				if (data.details.merchant_close_store){
					$("#close_store").val(2);
				} else $("#close_store").val(1);
				
				$(".selected_restaurant_name").val( data.details.restaurant_name );
				$(".selected_restaurant_ratings").val( data.details.ratings.ratings );

							
				break;
				
/* Atualização Master Hub (Programa de Fidelidade) */
				case "ProgramaFidelidade":
if (data.details.programa_fidelidade!=false){	
		fidelidade_PaginaDetalhes(data.details);
				}
					break;
/*Fim da atualização*/
					
/* Atualização Master Hub (Sistema de Sugestões) */
				case "VerificaVoto":
		if(data.details.icone === "1"){
		$("#imgvoto-"+sug_id).attr("src","images/icons/voto.png");
		$("#voto-"+sug_id+"-2").val(1);	
		} else {
		$("#imgvoto-"+sug_id).attr("src","images/icons/semvoto.png");
		$("#voto-"+sug_id+"-2").val(0);	
		}
					break;
					
				case "AddVoto":
		if(data.details.icone === "1"){
		$("#imgvoto-"+sug_id).attr("src","images/icons/voto.png");
		$("#voto-"+sug_id+"-2").val(1);
			toastMsg( getTrans("Obrigado por votar neste estabelecimento!",'voto_obrigado') );
		} else {
		$("#imgvoto-"+sug_id).attr("src","images/icons/semvoto.png");
		$("#voto-"+sug_id+"-2").val(0);	
			toastMsg( getTrans("Sinta-se a vontade por retirar seu voto! Obrigado pelo feedback",'voto_obrigado2') );
		}
					break;
/*Fim da atualização*/
					
				case "cuisineList":
				cuisineResults(data.details);
				break;
/* Atualização Master Hub (Categorias e Seguimentos) */
				case "seguimentosList":
				seguimentosResults(data.details);
				break;

				case "Lista_seguimentos":
				seguimentos_Resultado(data.details);
				break;

				case "Lista_categorias":
				categorias_Resultado(data.details);
				break;
/*Fim da atualização*/
/* Atualização Master Hub (Splash Page) */
				case "Pagina":
				paginaResultado(data.details);
					translatePage();
				break;
/*Fim da atualização*/
/* Atualização Master Hub (Sugestões de Estabelecimentos) */
				case "Suggestion":
				sugestoes_Resultado(data.details);
				sugestoes_Campo(data.details);	
				break;
/* Fim da atualização */
					
				case "getItemByCategory":			
				easy_category_list='';						
				displayItemByCategory(data.details);
				fillPopOverCategoryList(data.details.category_list);
				break;
				
				case "getItemDetails":
				displayItem(data.details);
				break;
				
				case "loadCart":
				$("#page-cart .wrapper").show();				
				$(".checkout-footer").show();
				$("#page-cart .frm-cart").show();
				
				/*tips*/
				if ( data.details.enabled_tip==2){
					$(".tip_amount_wrap").show();	
					setStorage("tips_percentage", data.details.tip_default );
				} else {
					$(".tip_amount_wrap").hide();
				}
												
				displayCart(data.details);
				
				if (!empty(data.details.cart.discount)){
					setStorage("has_discount",1);
				} else {
					removeStorage("has_discount");
				}
				
				if (typeof addressDialog === "undefined" || addressDialog==null || addressDialog=="" ) {
				} else {					
					if ( addressDialog.isShown()){						
						addressDialog.hide();
					}				
				}
				
				
				/*HIDE CHANGES ADDRESS FUNCTIONS*/
				if ( data.details.transaction_type=="delivery"){									   
					$(".change_address_wrap").show();					
					if (!empty(data.details.merchant_info.can_checkout)){
						if ( data.details.merchant_info.can_checkout.is_pre_order == 2){
							$(".delivery_asap_wrap").show();
						} else {
							$(".delivery_asap_wrap").hide();
						}					
					}								
				} else {
					$(".change_address_wrap").hide();
				}			
				
				/*FILL ESTIMATION TIME*/				
				/*if ( data.details.transaction_type=="delivery"){
					if (!empty(data.details.estimation_delivery_time)){					    
					   $(".delivery_time").val( data.details.estimation_delivery_time );
					}				
				}*/
				
				if(!empty(data.details.checkout_button)){
					$(".btn_checkout").html( data.details.checkout_button );
				}			
				
				if ( data.details.delivery_options){
					$(".cart_delivery_date").html( data.details.delivery_options.label.date );
					$(".cart_delivery_time").html( data.details.delivery_options.label.time );
					
					$(".delivery_date").val( data.details.delivery_options.default_value_date.date );
					$(".delivery_time").val( data.details.delivery_options.default_value_time.time );
					
					$(".cart_delivery_date_value").html( data.details.delivery_options.default_value_date.date_pretty );
					$(".cart_delivery_time_value").html( data.details.delivery_options.default_value_time.time_pretty );
				}
				
				break;
														
				case "checkout":		
								
				    if ( data.details=="shipping"){		
				    	
				    	search_mode = getSearchMode();
				    	if (search_mode=="postcode"){

				    		showShippingLocation(data);			    		
				    		
				    	} else {				    
				    			    					    		
					    	var options = {
						      animation: 'slide',
						      onTransitionEnd: function() { 						      	  
						      	  displayMerchantLogo2( getStorage("merchant_logo") ,
						      	     getStorage("order_total") ,
/*Atualização Master Hub (Máscara de Telefones, Número e Bairro e Catálogo de Endereços)*/
								  '' ,
						      	     'page-shipping');
						      	     
						      	  /*if (data.msg.length>0){
						      	  	  $(".select-addressbook").css({"display":"block"});
						      	  } else $(".select-addressbook").hide();*/
						      	  if(!empty(data.msg.profile)){
						      	  	  $(".contact_phone").val($(".contact_phone").masked( data.msg.profile.contact_phone.replace("+55","") ));
						      	  	  $(".location_name").val( data.msg.profile.location_name ) ;
									  $(".delivery_instruction").val( data.msg.profile.delivery_instruction ) ;
						      	  }
						      	  
						      	  var address_fill = false;
						      	  
						      	  if(!empty(getStorage("geo_address_result_formatted_address"))){
						      	  							      	  
						      	  	   $(".delivery-address-text").html( getStorage("geo_address_result_formatted_address") );
							  	       $(".street").val( getStorage("geo_address_result_address") );
									   $(".city").val( getStorage("geo_address_result_city") );
									   $(".state").val( getStorage("geo_address_result_state") );
									   $(".zipcode").val( getStorage("geo_address_result_zip") );	
									   $(".formatted_address").val( getStorage("geo_address_result_formatted_address") );	
						      	  				
									   dump('d0');						   
									   
						      	  } else if ( !empty( getStorage("map_address_result_formatted_address") )){
						      	  	    $(".delivery-address-text").html( getStorage("map_address_result_formatted_address") );
									    $(".street").val( getStorage("map_address_result_address") );
							  		    $(".numero").val( getStorage("map_address_result_numero") );
							  		    $(".area_name").val( getStorage("map_address_result_area_name") );
									    $(".city").val( getStorage("map_address_result_city") );
									    $(".state").val( getStorage("map_address_result_state") );
									    $(".zipcode").val( getStorage("map_address_result_zip") );	
									    $(".formatted_address").val( getStorage("map_address_result_formatted_address") );	
										reloadCart();
									 
									    $(".google_lat").val( getStorage("google_lat") );	
									    $(".google_lng").val( getStorage("google_lng") );	
									    									    
									    address_fill = true;
									    dump('d1');
						      	  } else {
						      	  	  if(!empty(data.msg.address_book)){
						      	  	  	  $(".street").val( data.msg.address_book.street );
									  	  $(".numero").val( data.msg.address_book.numero );
									  	  $(".area_name").val( data.msg.address_book.area_name );
										  $(".city").val( data.msg.address_book.city );
										  $(".state").val( data.msg.address_book.state );
										  $(".zipcode").val( data.msg.address_book.zipcode );
										  $(".location_name").val( data.msg.address_book.location_name );
										  $(".delivery_instruction").val( data.msg.address_book.delivery_instruction );
										  
										  
										  var complete_address = data.msg.address_book.street;
								  		  complete_address+=" "+ data.msg.address_book.numero;
									  	  complete_address+=" "+ data.msg.address_book.area_name;
										  complete_address+=" "+ data.msg.address_book.city;
										  complete_address+=" "+ data.msg.address_book.state;
										  complete_address+=" "+ data.msg.address_book.zipcode;
										
											reloadCart();
/*Fim da atualização*/
										  $(".delivery-address-text").html( complete_address ); 
										  $(".formatted_address").val( complete_address );	
										  
										  address_fill = true;										  						
										  dump('d2');			  
						      	  	  }
						      	  }
						      	  
						      	  if(!address_fill){						      	  	
						      	  	//fillShippingAddress();
						      	  }						      
						      	  					      	      	  
						      } /*end transition*/
						    };   
/*Atualização Master Hub (Correção de tela errada de endereços finalizando o pedido)*/
						    sNavigator.pushPage("shippingLocationArea.html", options);
/*Fim da atualização*/
						    
				    	}				
					    		
				    } else if ( data.details =="payment_method") {
				    	
				    	/*alert(data.msg.transaction_type);
				    	alert(data.msg.show_mobile_number);*/
				    	
					    var options = {
					      animation: 'slide',
					      onTransitionEnd: function() { 						      	  
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
					      	  displayMerchantLogo3( 
					      	     getStorage("merchant_logo") ,
					      	     getStorage("order_total") ,
								 getStorage("cart_sub_total_final") , 
								 getStorage("cart_delivery_charges_final"),
								 getStorage("cart_tax_final"), 
								 getStorage("cart_packaging_final"),
								 getStorage("cart_discount_final"),
								 getStorage("cart_tip_final"),							  
/*Fim da atualização*/
					      	     'page-paymentoption'
					      	  );
					      	  
					      	  var params="merchant_id="+ getStorage("merchant_id");
					      	  params+="&client_token="+ getStorage("client_token");
					      	  params+="&transaction_type=" + $(".transaction_type:checked").val();
					      	  callAjax("getPaymentOptions",params);
					      } 
					    };   
					    sNavigator.pushPage("paymentOption.html", options);		       
				    	
				    } else if ( data.details =="enter_contact_number") {
				    	 
				    	var options = {
					      animation: 'slide',
					      onTransitionEnd: function() { 	
/*Atualização Master Hub (Desativa entrada do código do país nos campos de telefone)*/
					      	  //*initIntelInputs();
/*Fim da atualização*/
					      } 
					    };   
					    sNavigator.pushPage("enterContact.html", options);		
				    	 
				    } else {
						var options = {
					      animation: 'slide',
					      onTransitionEnd: function() { 	
					      	  dump( getStorage("merchant_logo") );	      	  
					      	  dump( getStorage("order_total") );
					      	  displayMerchantLogo2( getStorage("merchant_logo") ,
					      	     getStorage("order_total") ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
								  '' ,
/*Fim da atualização*/
					      	     'page-checkoutsignup');
					      	     
					      	  callAjax("getCustomFields",'');     
/*Atualização Master Hub (Desativa entrada do código do país nos campos de telefone)*/
					      	  //*initIntelInputs();
/*Fim da atualização*/
					      } 
					    };     
					    sNavigator.pushPage("checkoutSignup.html", options);				
				    }
				break;
				
				case "signup":
				    setStorage("client_token", data.details.token ); // register token
				    
				    setStorage("avatar",data.details.avatar);
                    setStorage("client_name_cookie",data.details.client_name_cookie);
				    
					if (data.details.next_step=="shipping_address"){
						
					    search_mode = getSearchMode();
					    
					    if (search_mode=="postcode"){                    	    	           	    	                   	    
                   	    	showShippingLocation(data);                   	    	
                   	    } else {                   	    	                   	    
							var options = {
						      animation: 'slide',
						      onTransitionEnd: function() { 						      	  
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
						      	  displayMerchantLogo3( getStorage("merchant_logo") ,
						      	     getStorage("order_total") ,
								 getStorage("cart_sub_total_final") , 
								 getStorage("cart_delivery_charges_final"),
								 getStorage("cart_tax_final"), 
								 getStorage("cart_packaging_final"),
								 getStorage("cart_discount_final"),
								 getStorage("cart_tip_final"),							  
/*Fim da atualização*/
						      	     'page-shipping');
						      	     
						      	     fillShippingAddress();
						      } 
						    };     
/*Atualização Master Hub (Correção de tela errada de endereços finalizando o pedido)*/
					    sNavigator.pushPage("shippingLocationArea.html", options);		
/*Fim da atualização*/
                   	    }
					    		
					} else if ( data.details.next_step =="return_home") {
						onsenAlert(data.msg);
						menu.setMainPage('home.html', {closeMenu: true});
						
				   // mobile verification
				   } else if ( data.details.next_step =="mobile_verification") {
				   	
				   	    removeStorage('client_token');
				   	    
						var options = {
					      animation: 'none',
					      onTransitionEnd: function() { 						      	  
					      	   $(".mobile-verification-msg").show();
					      	   $(".email-verification-msg").hide();
					      	   $(".client_id").val( data.details.client_id);
					      	   $(".is_checkout").val( data.details.is_checkout);
					      	   $(".validation_type").val( data.details.next_step );
					      } 
					    };     
					    sNavigator.pushPage("SignupVerification.html", options);
					    
					// email verification
					} else if ( data.details.next_step =="email_verification") {
				   	
				   	    removeStorage('client_token');
				   	    
						var options = {
					      animation: 'none',
					      onTransitionEnd: function() { 						      	  
					      	   $(".mobile-verification-msg").hide();
					      	   $(".email-verification-msg").show();
					      	   $(".client_id").val( data.details.client_id);
					      	   $(".is_checkout").val( data.details.is_checkout);
					      	   $(".validation_type").val( data.details.next_step );
					      } 
					    };     
					    sNavigator.pushPage("SignupVerification.html", options);
					        
					} else {
						dump('payment_option');
						 var options = {
					      animation: 'slide',
					      onTransitionEnd: function() { 						      	  
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
					      	  displayMerchantLogo3( 
					      	     getStorage("merchant_logo") ,
					      	     getStorage("order_total") ,
								 getStorage("cart_sub_total_final") , 
								 getStorage("cart_delivery_charges_final"),
								 getStorage("cart_tax_final"), 
								 getStorage("cart_packaging_final"),
								 getStorage("cart_discount_final"),
								 getStorage("cart_tip_final"),							  
/*Fim da atualização*/
					      	     'page-paymentoption'
					      	  );
					      	  var params="merchant_id="+ getStorage("merchant_id");			
					      	  params+="&transaction_type=" +  getStorage("transaction_type") ;	
					      	  params+="&client_token=" +  getStorage("client_token");
					      	  callAjax("getPaymentOptions",params);
					      } 
					    };   
					    sNavigator.pushPage("paymentOption.html", options);	
					}
				break;
				
				case "getPaymentOptions":				
				   $(".frm-paymentoption").show();				   
/*Atualização Master Hub (Resumo de Endereço na finalização do pedido)*/
		transaction_type=getStorage("transaction_type");
					if (transaction_type=="delivery"){
					$(".conferirendereco").show();
					}else{
					$(".conferirendereco").hide();	
					}

	     if (typeof entrega === "undefined" || entrega==null || entrega=="" || entrega===0 || entrega===0.0 || entrega==="0" ){
	     $(".titulo-entrega").html("Taxa de Entrega");
	     $(".total-entrega").html("Entrega Grátis");
	     } else {
	     $(".titulo-entrega").html("Taxa de Entrega");
	     $(".total-entrega").html(prettyPrice(entrega));
	     }

				$(".endereco_de_entrega_street").html(data.details.endereco_de_entrega.street);
				$(".endereco_de_entrega_n").html("nº");
				$(".endereco_de_entrega_traco").html("-");
				$(".endereco_de_entrega_barra").html("/");
				$(".endereco_de_entrega_numero").html(data.details.endereco_de_entrega.numero);
				$(".endereco_de_entrega_city").html(data.details.endereco_de_entrega.city);
				$(".endereco_de_entrega_state").html(data.details.endereco_de_entrega.state);
				$(".endereco_de_entrega_area_name").html(data.details.endereco_de_entrega.area_name);
				$(".endereco_de_entrega_zipcode").html(data.details.endereco_de_entrega.zipcode);
				$(".endereco_de_entrega_location_name").html(data.details.endereco_de_entrega.location_name);
				$(".endereco_de_entrega_delivery_instruction").html(data.details.endereco_de_entrega.delivery_instruction);	
/*Fim da atualização*/
				   /*$(".client_id_sandbox").val( data.details.paypal_credentials.client_id_sandbox );
			   	   $(".client_id_live").val( data.details.paypal_credentials.client_id_live );*/
				   
			   	   $(".paypal_flag").val( data.details.paypal_flag );			   	   
			   	   if(data.details.paypal_flag==1){
				   	   $(".paypal_mode").val( data.details.paypal_credentials.mode );			   	   			   	   
				   	   $(".client_id").val( data.details.paypal_credentials.client_id );
			   	   }
			   	   
			   	   $(".paypal_card_fee").val( data.details.paypal_credentials.card_fee );	
			   	   setStorage("paypal_card_fee", data.details.paypal_credentials.card_fee );
			   	   
			   	   if (data.details.voucher_enabled=="yes"){
			   	   	   $(".voucher-wrap").show();			   	   	   
			   	   	   $(".voucher_code").attr("placeholder", getTrans("Enter Voucher here",'enter_voucher_here') );
			   	   } else {
			   	   	   $(".voucher-wrap").hide();
			   	   }			

/* Atualização Master Hub (Programa de Fidelidade) */
			   	   if (data.details.fidelidade_enabled=="yes"){
					   
					  if (data.details.programa_fidelidade!=false){
						  $(".voucher-wrap").hide();
						fidelidade_PaginaPagamentos(data.details);
					  }
			   	   	   $(".fidelidade-wrap").show();			   	   	   
			   	   } else {
			   	   	   $(".fidelidade-wrap").hide();
			   	   }			
/*Fim da atualização*/
			   	   /*set stripe key*/
			   	   setStorage("stripe_publish_key", data.details.stripe_publish_key );	
			   	   setStorage("stripe_publish_key", data.details.stripe_publish_key );
			   	   
			   	   /*set razor pay*/
			   	   if (!empty(data.details.razorpay)){
			   	   	   setStorage("razor_key_id", data.details.razorpay.razor_key );	
			   	       setStorage("razor_secret_key", data.details.razorpay.razor_secret );
			   	   }
			   	   
			   	   /*pts*/
			   	   if ( getStorage("pts")==2){			   	   	   
			   	   	   dump('pts is enabled');
			   	   	   $(".redeem_points").attr("placeholder",data.details.pts.pts_label_input);
			   	   	   $(".pts_available_points").html(data.details.pts.balance);
			   	   } else {
			   	   	   $(".pts-apply-points-wrap").hide();
			   	   }
			   	   
			   	   /*set ipay88*/
			   	   if (!empty(data.details.ip8_credentials)){
			   	   	   setStorage("ip8_merchantcode", data.details.ip8_credentials.code );	
			   	       setStorage("ip8_merchantkey", data.details.ip8_credentials.key );
			   	   }
			   	   
			   	    /*APPEND DINE INFORMATION*/
					new_fields='';		
			    	if (data.details.transaction_type=="dinein"){
			    		new_fields=DineinFields();					    		
			    		createElement("checkout_information_dinein",new_fields);
			    		$( document ).on( "keyup", ".numeric_only2", function() {
						  this.value = this.value.replace(/[^0-9\.]/g,'');
						});	 					    	
			        }			
			        
			        /*APPEND MOBILE NUMBER INFORMATION*/
			    	if(data.details.show_mobile_number){
			    	  	 new_fields=ContactNumberFields();					    		
			    		 createElement("checkout_information_contact",new_fields);
/*Atualização Master Hub (Desativa entrada do código do país nos campos de telefone)*/
			    		 //*initIntelInputs();
/*Fim da atualização*/
			       }			 
			       
			        translateValidationForm();
/*Atualização Master Hub (Recarrega carrinho para atualização de valores)*/
			   	   	reloadCart();	
/*Fim da atualização*/
			   	   displayPaymentOptions(data);
			   	   
			   	   $(".cod_change_required").val( data.details.cod_change_required);
			   	   
			   	   setTrackView("payment options");
			   	   
				break;				
				
				case "placeOrder":																  
				
				  setStorage("order_id",data.details.order_id);
/*Atualização Master Hub (Recarrega carrinho para atualização de valores)*/
				  reloadCart();
/*Fim da atualização*/
				  switch (data.details.next_step){
				  					  	  
				  	   case "paypal_init":
				  	   				  	   
				  	   setStorage("currency_code", data.details.payment_details.currency_code);
				  	   setStorage("paymet_desc", data.details.payment_details.paymet_desc);
				  	   setStorage("total_w_tax", data.details.payment_details.total_w_tax);
				  	   
				  	   app_paypal.initPaymentUI();
				  	   break;

				  	   case "atz_init":
				  	      var options = {
						      animation: 'slide',
						      onTransitionEnd: function() {
						      	  $(".order_id").val( data.details.order_id );
						      	  $(".currency_code").val( data.details.payment_details.currency_code );
						      	  $(".paymet_desc").val( data.details.payment_details.paymet_desc );
						      	  $(".total_w_tax").val( data.details.payment_details.total_w_tax );
						      } 
						  }; 
						  sNavigator.pushPage("atzPaymentForm.html", options);
				  	   break;
				  	   
				  	   
				  	   case "stp_init":
				  	      var options = {
						      animation: 'slide',
						      onTransitionEnd: function() {
						      	  $(".order_id").val( data.details.order_id );
						      	  $(".currency_code").val( data.details.payment_details.currency_code );
						      	  $(".paymet_desc").val( data.details.payment_details.paymet_desc );
						      	  $(".total_w_tax").val( data.details.payment_details.total_w_tax );
						      } 
						  }; 
						  sNavigator.pushPage("stripePaymentForm.html", options);
				  	   break;
				  	   
				  	   case "rzr_init":
				  	     
				  	     var razor_key_id = getStorage("razor_key_id");				  	     
				  	     
				  	     if(empty(razor_key_id)){
				  	     	onsenAlert( getTrans("Key id is empty","key_id_empty") );
				  	     	return;
				  	     }
				  	     
				  	     var rzr_options = {
						  description: data.details.payment_details.paymet_desc ,						  
						  currency: data.details.payment_details.currency_code ,
						  key: razor_key_id ,
						  amount: data.details.payment_details.total_w_tax_times,
						  name: data.details.payment_details.merchant_name ,
						  prefill: {
						    email: data.details.payment_details.customer_email ,
						    contact: data.details.payment_details.customer_contact ,
						    name: data.details.payment_details.customer_name
						  },
						  theme: {
						    color: data.details.payment_details.color
						  }
						};
						
						dump(rzr_options);
						
						if(isDebug()){
						   rzr_successCallback('pay_debug_1234566');
						} else {
						   RazorpayCheckout.open(rzr_options, rzr_successCallback, rzr_cancelCallback);
						}
				  	     
				  	   break;
				  	   
				  	   case "mri_init":
				  	      var options = {
						      animation: 'slide',
						      onTransitionEnd: function() {
						      	  $(".order_id").val( data.details.order_id );
						      	  $(".currency_code").val( data.details.payment_details.currency_code );
						      	  $(".paymet_desc").val( data.details.payment_details.paymet_desc );
						      	  $(".total_w_tax").val( data.details.payment_details.total_w_tax );
						      } 
						  }; 
						  sNavigator.pushPage("monerisForm.html", options);
				  	   break;
				  	   				  	   
				  	   case "ip8_init":
				  	     				  	     
				  	     /*alert(getStorage("ip8_merchantcode"));
				  	     alert(getStorage("ip8_merchantkey"));*/				  	     
				  	     
				  	     if(isDebug()){
				  	     	var params="payment_id=1234567890";
							params+="&order_id=55555-"+ data.details.order_id ;
							params+="&client_token="+ getStorage("client_token");	
							callAjax("iPay88Successfull",params);	  
				  	     	return;
				  	     }
				  	     
				  	     //alert(JSON.stringify(data.details.ipay88_details));  
				  	     
				  	     cloudSky.iPay88.makePayment(
						    {
						        amount: data.details.ipay88_details.amount ,
						        name:  data.details.ipay88_details.name ,
						        email: data.details.ipay88_details.email ,
						        phone: data.details.ipay88_details.phone ,
						        refNo: data.details.ipay88_details.refNo ,
						        currency: data.details.ipay88_details.currency ,
						        lang: data.details.ipay88_details.lang ,
						        country: data.details.ipay88_details.country ,
						        description: data.details.ipay88_details.description ,	
						        remark: data.details.ipay88_details.remark ,
						        paymentId: data.details.ipay88_details.paymentId ,					        
						        merchantKey: getStorage("ip8_merchantkey") ,
						        merchantCode: getStorage("ip8_merchantcode") ,
						        backendPostUrl: data.details.ipay88_details.backendPostUrl
						    },
						    function (resp) {
						        //alert("Success callback ");
						        //alert(JSON.stringify(resp));     
						        						        
						        var params="payment_id="+resp.transactionId;
								params+="&order_id="+ resp.referenceNo;
								params+="&client_token="+ getStorage("client_token");	
								callAjax("iPay88Successfull",params);	  
	     
						        // resp = { 
						        //     transactionId: transId, 
						        //     referenceNo: refNo, 
						        //     amount: amount, 
						        //     remarks: remarks, 
						        //     authCode: auth, 
						        // } 
						    },
						    function (err) {						        
						        //alert(JSON.stringify(err));           
						        onsenAlert(err.err);
						        // err = "unexpected error string" OR 
						        // err = { 
						        //     transactionId: transId, 
						        //     referenceNo: refNo, 
						        //     amount: amount, 
						        //     remarks: remarks, 
						        //     err: error message, // "canceled" if user canceled the payment. 
						        // } 
						    }
						)				  	     
				  	     
				  	   break;
				  	   
				  	   case "hubtel_init":
				  	     var options = {
						      animation: 'slide',
						      onTransitionEnd: function() {
						      	  $(".order_id").val( data.details.order_id );
						      	  $(".currency_code").val( data.details.payment_details.currency_code );
						      	  $(".paymet_desc").val( data.details.payment_details.paymet_desc );
						      	  $(".total_w_tax").val( data.details.payment_details.total_w_tax );
						      	  
						      	  $(".customer_name").val( data.details.customer_info.customer_name );
						      	  $(".customer_mobileno").val( data.details.customer_info.contact_phone );
						      	  $(".customer_email").val( data.details.customer_info.email_address );	
						      	  
						      } 
						  }; 
						  sNavigator.pushPage("hubtelForm.html", options);
				  	   break;
				  	   
				  	   
				  	   case "mcd_init":
/*Atualização Master Hub (Mercado Pago)*/
						  
				var color = "#841011"; 
			/* Você pode definir a cor do background do checkout aqui */
				var blackFont = true;  	   
				MercadoPago.startCheckout( data.details.mercapago.mercado_key , data.details.mercapago.payment_ref, color, blackFont, mercapagoSuccess, mercapagoFailed );
/*Fim da atualização*/
				  	   break;
				  	   
				  	   case "mcd_error":
				  	      toastMsg(data.msg);
				  	   break;
				  	   				  	   
				  	   default:		
				  	   var options = {
					      animation: 'slide',
					      onTransitionEnd: function() { 						      	  
					      	  /*displayMerchantLogo2( getStorage("merchant_logo") ,
					      	                      getStorage("order_total") ,
					      	                      'page-receipt');*/
					      	  displayMerchantLogo2( getStorage("merchant_logo") ,
					      	                      data.details.payment_details.total_w_tax_pretty ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
								  '' ,
/*Fim da atualização*/
					      	                      'page-receipt');
/*Atualização Master Hub (Resumo do Endereço de entrega e Valores)*/
					      	  //$(".receipt-msg").html(data.msg); 
                               //by delivery recibo
                              var totalp = 'Total: '+data.details.payment_details.total_w_tax_pretty;
                              $(".cod-thanks").html(getStorage("merchant_name"));
                              $(".total-amount").html('Total: '+ data.details.payment_details.total_w_tax_pretty);
                              //$(".receipt-pedido").html(pedidostr); 
					      	  $(".receipt-msg").html(data.msg);
                              $htmlicoentrega='';
                              $htmltentrega='';
                              $htmendentrega='';
                               $enderecoico ="";
                                $enderecodesc="";
                              dump(data);
                              if(getStorage("transaction_type")=='delivery'){ //se for entrega
                                 $htmlicoentrega+='<div class="myfa-moto fa-motorcycle fa"></div>';
                                 
                                 $htmlentrega="Endereço da Entrega";
                                 $htmlendentrega="";
                                  
                                  $enderecoentregaw=JSON.parse('{"' + decodeURI(getStorage('shipping_address').replace(/%2C/g,"").replace(/\+/g, " ").replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
                                  dump($enderecoentregaw);
                                  $enderecoentrega=$enderecoentregaw.street +" "+ $enderecoentregaw.numero + " - "+$enderecoentregaw.area_name +" - "+ $enderecoentregaw.city;
                                  
                                  $enderecoico='<div class="myfa-home fa-home fa"></div>'
                                 
                                 }else{//se for busca
                                $enderecoico='<div icon="fa-institution" class="myfa-inst fa-intitution fa"></div>'     
                                $enderecoentrega =getStorage('merchant_address');
                                 $htmlicoentrega+='<div class="myfa-male fa-male fa"></div>';
                                 $htmlentrega="Buscar no Restaurante";
                                 $htmlendentra="";
                                 }
                                 
                                 $(".t_entregaico").html($htmlicoentrega);
                                 $(".t_entrega").html($htmlentrega);
                               
                                $(".t_enderecoico").html($enderecoico);
                              $(".t_enderecoentrega").html($enderecoentrega);
                              $(".t_tempoentrega").html(getStorage("delivery_estimation"));
                                 

                           $transtr="";
                            $paym=data.details.payment_type;
                           if(data.details.payment_type=='cod'){
                               dump("pegou dinheiro ".$paym);
                                $pgtoico='<ons-icon icon="fa-usd" class="myfa-usd fa-usd fa fa-lg "></ons-icon>';
                                $pgtotrans="Pagar em Dinheiro";
                                $transtr+='Troco: ';
                                $transtr+=prettyPrice($('.order_change').val());
                                
                            }else{
                                dump("pegou cartao ".$paym);
                                $pgtoico='<ons-icon icon="fa-credit-card" class="myfa-creditcard fa-credit-card fa fa-lg"></ons-icon>';
                                $pgtotrans="Pagar com Cartão";
                                $transtr+=data.details.payment_details.payment_provider_name;
                                
            
                            }
                           
                           $(".t_pgtoico").html($pgtoico);
                           $(".t_pgtotrans").html($pgtotrans);
                           $(".t_pgtodesc").html($transtr);
                          
/*Fim da atualização*/
					      } 
					    };     
					    sNavigator.pushPage("receipt.html", options);
				  	   
				  	   break;
				  	   
				  	   case "wing_form":
				  	   				  	   
				  	     var options = {
						      animation: 'slide',
						      onTransitionEnd: function() {
						      	  $(".order_id").val( data.details.order_id );
						      	  $(".currency_code").val( data.details.payment_details.currency_code );
						      	  $(".paymet_desc").val( data.details.payment_details.paymet_desc );
						      	  $(".total_w_tax").val( data.details.payment_details.total_w_tax );
						      	  
						      	  $(".payment_desc_text").html(data.details.payment_details.paymet_desc);
						      	  $(".payment_amount_text").html(data.details.payment_details.total_w_tax_pretty);
						      	  
						      } 
						  }; 
						  sNavigator.pushPage("wingPaymentForm.html", options);
						  
				  	   break;
				  	   
				  	   case "ipay_africa_form":
				  	      var options = {
						      animation: 'slide',
						      onTransitionEnd: function() {
						      	
						      	  $(".payment_desc_text").html(data.details.payment_details.paymet_desc);
                                  $(".payment_amount_text").html(data.details.payment_details.total_w_tax_pretty);

						      	  $(".order_id_token").val( data.details.order_id_token );
                                  $(".order_id_token_text").html( data.details.order_id_token );
                                  
                                  $(".ipay_phone_number").val( data.details.customer_info.contact_phone );
						        
						      	  if(!empty(data.details.ipay_africa_payment)){
						      	  	ipay_html='<ons-list-header class="">'+getTrans('Select Payment','select_payment')+'</ons-list-header>';									      	  				      	 
						      	    $.each( data.details.ipay_africa_payment, function( ikey, ival ) {
						      	    	page_name = "ipay_"+ival.key;
						      	  	    ipay_html+='<ons-list-item modifier="chevron" class="trn" onclick="showPage('+  "'" +page_name+ "'"  +')" >'+ival.label+'</ons-list-item>';
						      	    });
						      	    createElement('ipay_africa_payment_list',ipay_html);	
						      	  }
						      	  
						      	  ipay_params="order_id="+data.details.order_id_token;
						      	  ipay_params+="&client_token="+getStorage("client_token");
						      	  callAjax("ipayInitiatorRequest",ipay_params);
						      } 
						  }; 
						  sNavigator.pushPage("ipaySelectPayment.html", options);
				  	   break;
				  	   
				  	   
				  	   case "strip_ideal_form":
				  	         var options = {
						      animation: 'slide',
						      onTransitionEnd: function() { 						      	 
						      	
						      	  $(".stripe_pub_key").val( data.details.ideal.publishable_key );
						      	  $(".stripe_amount").val( data.details.ideal.stripe_amount );
						      	  $(".stripe_descriptor").val( data.details.ideal.stripe_descriptor );
						      	  $(".stripe_currency").val( data.details.ideal.stripe_currency );
						      	  $(".stripe_client_name").val( data.details.ideal.stripe_client_name );
						      	  $(".stripe_return_url").val( data.details.ideal.stripe_return_url );
						      	  
						      	  $(".payment_desc_text").html(data.details.ideal.stripe_descriptor);
                                  $(".payment_amount_text").html(data.details.payment_details.total_w_tax_pretty);                                  						      	  
                                  $(".stripe_order_id").html( data.details.order_id );
						      } 
						    };     
						    sNavigator.pushPage("stripeIdealForm.html", options);
				  	   break;
				  	   
				  	   case "mollie_form":
				  	      var options = {
							  animation: 'slide',
							  onTransitionEnd: function() { 						      	 
								 						
							  	 $(".mol_order_id").val(data.details.order_id);
							  	 $(".payment_desc_text").html(data.details.payment_details.paymet_desc);
							  	 $(".payment_amount_text").html(data.details.payment_details.total_w_tax_pretty);
							  	 $(".mol_order_id_text").html( data.details.order_id);
							  } 
							  
						   };     
						  sNavigator.pushPage("mollieForm.html", options);
				  	   break;
				  	   
				  	 case "dixipay_form":  
				  	       var options = {
						      animation: 'slide',
						      onTransitionEnd: function() {
						      	  $(".order_id").val( data.details.order_id );
						      	  $(".currency_code").val( data.details.payment_details.currency_code );
						      	  $(".paymet_desc").val( data.details.payment_details.paymet_desc );
						      	  $(".total_w_tax").val( data.details.payment_details.total_w_tax );
						      	  
						      	  $(".payment_desc_text").html(data.details.payment_details.paymet_desc);
						      	  $(".payment_amount_text").html(data.details.payment_details.total_w_tax_pretty);
						      	  
						      	  if(!empty(data.details.has_cards)){
						      	  	  $(".select_credit_cards").show();
						      	  } else {
						      	  	  $(".select_credit_cards").hide();
						      	  }				      						      
						      	  
						      	  document.getElementById('cc_number').oninput = function() {
								    this.value = CreditCardFormat(this.value)
								  }
						      } 
						  }; 
						  sNavigator.pushPage("dixiForm.html", options);
				  	   break;
				  }
				  
				  /*END NEXT STEP*/
				  
				  break;
				  
				case "paypalSuccessfullPayment": 
				case "PayAtz":  
				case "PayStp":
				case "razorPaymentSuccessfull":
				case "iPay88Successfull":
				case "monerisPay":
				case "hubtelPaymentInit":
/*Atualização Master Hub (Mercado Pago)*/
				case "MercadoPagoOK":	
/*Fim da atualização*/
				case "WingCommit":
				case "ipayMobileMoney":
				case "ipayTransactCC":
				case "payDixiPay":
				case "payDixiPayCards":
				     
				       var amount_to_pay=data.details.amount_to_pay;
				       if(amount_to_pay==0){
				       	  amount_to_pay=getStorage("order_total");
				       }
					   var options = {
					      animation: 'slide',
					      onTransitionEnd: function() { 						      	  
					      	  displayMerchantLogo2( getStorage("merchant_logo") ,
					      	                       prettyPrice(amount_to_pay) ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
								  '' ,
/*Fim da atualização*/
					      	                      'page-receipt');
					      	  $(".receipt-msg").html(data.msg); 
					      } 
					    };     
					    sNavigator.pushPage("receipt.html", options);
				   break;  
				
				case "getMerchantInfo":
				   showMerchantInfo(data.details)
				   break;
								
				case "bookTable":
				  var options = {
				      animation: 'slide',
				      onTransitionEnd: function() { 			
				      	  displayMerchantLogo2( 
				      	     getStorage("merchant_logo") ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
					      	     getStorage("order_total") ,
/*Fim da atualização*/
				      	     '' ,
				      	     'page-booking-ty'
				      	  );    
				      	  				      	 	      	 
				      	  $(".book-ty-msg").html(data.msg);
				      } 
				    };     
				    sNavigator.pushPage("bookingTY.html", options);
				    break;
				
				case "merchantReviews":
				   //alert(JSON.stringify(data.details));  
				   displayReviews(data.details);
				   break;
				
				case "addReview":
				   toastMsg(data.msg);				   
				   if(data.details.review_type==2){
				   	  menu.setMainPage('orders.html', {closeMenu: true});
				   } else  {
				   	  sNavigator.popPage({cancelIfRunning: true}); 
				   	  setTimeout(function(){ 	
					   	 var params="merchant_id=" +  getStorage("merchant_id") ;
		                 params+="&client_token="+ getStorage("client_token");
	                     callAjax("merchantReviews",params);	   
				   	  }, 500);		   	  				   
				   }			
				   break;
				   				   
				
				case "browseRestaurant":
				   /*displayRestaurantResults( data.details.data ,'browse-results');				   
				   $(".result-msg").text(data.details.total+" "+ getTrans("Restaurant found",'restaurant_found')  );*/
				   break;   
				   
				case "getProfile":   
				  $(".first_name").val( data.details.first_name );
				  $(".last_name").val( data.details.last_name );
				  $(".email_address").val( data.details.email_address );
/*Atualização Master Hub (Máscara do Telefone)*/
				  if(!empty(data.details.contact_phone)){
				  $(".contact_phone").val($(".contact_phone").masked( data.details.contact_phone.replace("+55","") )); }
/*Fim da atualização*/
				  $(".avatar").attr("src", data.details.avatar );
				  
				  dump('set avatar');
				  setStorage("avatar",data.details.avatar);
				  
				  imageLoaded('.img_loaded');
/*Atualização Master Hub (Desativa entrada do código do país nos campos de telefone)*/
				  //*initIntelInputs();
/*Fim da atualização*/
				  break;   
				  
				case "registerUsingFb":  
				case "login": 
				case "googleLogin":
				  //onsenAlert(data.msg);				  			
				  setStorage("client_token",data.details.token);
				  
				  setStorage("avatar",data.details.avatar);
                  setStorage("client_name_cookie",data.details.client_name_cookie);
                  
                  if (!empty(data.details.social_strategy)){
                  	  setStorage("social_strategy",data.details.social_strategy);
                  }
                  
                  checkDeviceRegister();
				  
				  switch (data.details.next_steps)
				  {
				  	 case "delivery":
				  	 
				  	     search_mode = getSearchMode();
				  	     
				  	     if (search_mode=="postcode"){
				  	     	showShippingLocation(data);
				  	     } else {				  	    
						  	 var options = {
						      animation: 'slide',
						      onTransitionEnd: function() { 						      	  
						      	  displayMerchantLogo2( getStorage("merchant_logo") ,
						      	     getStorage("order_total") ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
								  '' ,
/*Fim da atualização*/
						      	     'page-shipping');					      	    
							      	  
	                                 if(!empty(data.details.contact_phone)){
/*Atualização Master Hub (Máscara do Telefone)*/
						      	  	     $(".contact_phone").val($(".contact_phone").masked( data.details.contact_phone.replace("+55","") ));
						      	     } else if(!empty(data.details.default_address.contact_phone)){
										 $(".contact_phone").val($(".contact_phone").masked( data.details.default_address.contact_phone.replace("+55","") ));
									 }
/*Fim da atualização*/
						      	     if(!empty(data.details.location_name)){
						      	  	     $(".location_name").val( data.details.location_name ) ;
						      	     }
						      	     
						      	     var address_fill = false;
/*Atualização Master Hub (Gravar Campo Complemento no Catálogo de Endereços e Número e Bairro)*/
						      	     if(!empty(data.details.delivery_instruction)){
						      	  	     $(".delivery_instruction").val( data.details.delivery_instruction ) ;
						      	     }
							      	  					      	     					      	     
							      	 if ( !empty( getStorage("map_address_result_formatted_address") )){
						      	  	     $(".delivery-address-text").html( getStorage("map_address_result_formatted_address") );
						      	  	     $(".street").val( getStorage("map_address_result_address") );
									 $(".numero").val( getStorage("map_address_result_numero") );
									 $(".area_name").val( getStorage("map_address_result_area_name") );
										 $(".city").val( getStorage("map_address_result_city") );
										 $(".state").val( getStorage("map_address_result_state") );
										 $(".zipcode").val( getStorage("map_address_result_zip") );	
										 $(".formatted_address").val( getStorage("map_address_result_formatted_address") );	
										 
										 $(".google_lat").val( getStorage("google_lat") );	
										 $(".google_lng").val( getStorage("google_lng") );	
										 address_fill = true;
						      	  	 } else {
						      	  	    if (data.details.has_addressbook==2){
						      	  	    	
						      	  	       if(!empty(data.details.default_address)){
						      	  	       	   address_fill = true;						      	  	       
							      	  	       $(".delivery-address-text").html( data.details.default_address.address );
							      	  	       $(".street").val (  data.details.default_address.street  );
					      	  	      $(".numero").val (  data.details.default_address.numero  );
					      	  	      $(".area_name").val (  data.details.default_address.area_name  );
/*Fim da atualização*/
											   $(".city").val( data.details.default_address.city  );
											   $(".state").val( data.details.default_address.state );
											   $(".zipcode").val(  data.details.default_address.zipcode );	
											   $(".formatted_address").val( data.details.default_address.address );	
						      	  	       }
						      	  	    	
						      	  	    }					      	  	 
						      	  	 }					      	  	
						      	  	 						      	  	 
						      	  	 if(!address_fill){						      	  
						      	  	    fillShippingAddress();
						      	     }		
						      } 
						     };  
/*Atualização Master Hub (Correção de tela errada de endereços finalizando o pedido)*/
						     sNavigator.pushPage("shippingLocationArea.html", options);		
/*Fim da atualização*/
				  	     }
				  	 break;
				  	 
				  	 case "pickup":
				  	 case "dinein":				  	 
				  	 
				  	   var options = {
					      animation: 'slide',
					      onTransitionEnd: function() { 						      	  
					      	  displayMerchantLogo2( 
					      	     getStorage("merchant_logo") ,
					      	     getStorage("order_total") ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
								  '' ,
/*Fim da atualização*/
					      	     'page-paymentoption'
					      	  );
					      	  var params="merchant_id="+ getStorage("merchant_id");
					      	  params+="&client_token="+ getStorage("client_token");
					      	  params+="&transaction_type=" +  getStorage("transaction_type") ;
					      	  callAjax("getPaymentOptions",params);
					      } 
					    };   
					    sNavigator.pushPage("paymentOption.html", options);		
				  	 
				  	 break;
				  	 
				  	 
				  	 default:
				  	 menu.setMainPage('home.html', {closeMenu: true});
				  	 break;
				  }	
				  
				  
				  break;   
				  
				case "forgotPassword":  
				  onsenAlert(data.msg);	
				  dialogForgotPass.hide();
				  break;   
				  
				case "getOrderHistory":  				   
				    displayOrders(data.details);
				  break;   
				  
				case "ordersDetails":  
				  displayOrderHistoryDetails(data.details);
				  break;  
				   
				case "getAddressBook":  
				  displayAddressBook(data.details);
/*Atualização Master Hub (Catálogo de Endereços)*/
					if (data.details.length>0){
				if (empty(data.details.default_address)){
					$(".endereco_padrao").show();
					} else $(".endereco_padrao").hide();
				} else $(".endereco_padrao").hide();
				  break;  
/*Fim da atualização*/
			    case "getAddressBookDetails":
			      fillAddressBook(data.details);
/*Atualização Master Hub (Catálogo de Endereços)*/
					if (data.details.area_id==0 || data.details.city_id==0){
			$("#frm-addressbook .location_area").html(getTrans("District / Area","destrict_area"));
			$("#frm-addressbook .location_city").html(getTrans("City", "city"));
			$("#frm-addressbook .area_id").val("");
			$("#frm-addressbook .city_id").val("");
			$("#frm-addressbook .state_id").val("");		
		}
			      break;  
/*Fim da atualização*/
			    case "saveAddressBook":  
/*Atualização Master Hub (Catálogo de Endereços)*/
						sNavigator.popPage({cancelIfRunning: true});
						callAjax('getAddressBook', "client_token="+getStorage("client_token"));

			      if (data.details=="add") {
							onsenAlert("Endereço adicionado");
			      } else {
							onsenAlert("Endereço atualizado");
			      }
			      break;  
/*Fim da atualização*/
			    case "deleteAddressBook":  
			         sNavigator.popPage({cancelIfRunning: true});			         
			         callAjax('getAddressBook',
					  "client_token="+getStorage("client_token")
					  );
			      break;  
			      
			    case "getAddressBookDialog":  
			       displayAddressBookPopup(data.details);
			       break; 
			       
			    case "reOrder":   
			       setStorage("merchant_id",data.details.merchant_id)
			       cart=data.details.cart;
			       showCart();
			       break;
			       			      
			    /*case "registerUsingFb":   
			       onsenAlert(data.msg);
			       setStorage("client_token",data.details.token);
			       menu.setMainPage('home.html', {closeMenu: true});
			       break;*/

			    case "registerMobile":
			    /*silent */
			    break;
			    
/*Atualização Master Hub (Preenchimento dos dados no Catálogo de Endereços adquiridos pelo GPS)*/
			    case "reverseGeoCoding":
			       //$("#s").val( data.details );
			       			       
			       var enabled_advance_search = getStorage("enabled_advance_search");
                   if(enabled_advance_search=="yes"){
                   	  $("#ss").val( data.details.address_to_use );
                   } else {
                   	  $("#s").val( data.details.address_to_use );
                   }
					$(".street").val(data.details.address);
					$(".numero").val(data.details.numero);
					$(".cidade").html(data.details.city);
					$(".bairro").html(data.details.area_name);
					$("#cep").val(data.details.zip);
					$(".location_area").html(data.details.ids.bairro);
					$(".location_name").val('');
					$(".delivery_instruction").val('');
					$(".location_city").html(data.details.ids.cidade);
					$(".location_state").html(data.details.ids.estado);
					$(".state_id").val(data.details.ids.state_id);
					$(".city_id").val(data.details.ids.city_id);
			       setStorage("geo_search_address", data.details.address_to_use );			       
			       setStorage("geo_address_result_address",data.details.address);
			       setStorage("geo_address_result_city",data.details.city);
					$(".area_id").val(data.details.ids.area_id);
			       setStorage("geo_address_result_state",data.details.state);
					$(".state").val(data.details.ids.estado);
					$(".city").val(data.details.ids.cidade);
					$(".area_name").val(data.details.ids.bairro);
					global_city_id = data.details.ids.city_id;
					global_area_id = data.details.ids.area_id;
			       setStorage("geo_address_result_zip",data.details.zip);
					global_state_id = data.details.ids.state_id;
					
					if (empty(data.details.ids_cidade)){
					toastMsg( getTrans("Sua cidade ainda nao e abrangida pelo nosso aplicativo, caso tenha interesse em trabalhar conosco representando a sua cidade, contate-nos (19) 98331-5667. Obrigado pelo seu interesse em nosso aplicativo!",'escolha_o_bairro_cidade_nao_cadastrada') );
					}
					
					if (empty(data.details.ids)){
					//toastMsg( getTrans("Não foi possível encontrar o seu bairro em nosso sistema, por favor escolha manualmente!",'escolha_o_bairro') );
						
							var params="cidade="+ data.details.ids_cidade.city_id;
					      	  params+="&bairro="+ data.details.area_name;
					      	  callAjax("SalvaBairro",params);
						
			       setStorage("geo_address_result_country",data.details.country);
					$(".location_area").html(getTrans("Select District / Area","select_destrict_area"));
					//$(".location_city").html(getTrans("Select City", "select_city"));
					//$(".city_id").val('');
					//$(".city").val('');	
					$(".area_id").val('');
					$(".area_name").val('');
						
					}
					
			       setStorage("geo_address_result_formatted_address",data.details.formatted_address);
			       
			       break;
/*Fim da atualização*/
/*Atualização Master Hub (Preenchimento dos dados no Catálogo de Endereços adquiridos pelo CEP)*/
				case "IdsDoCEP":
					 
					if(!empty(data.details)){
				toastMsg( getTrans("Preencha o número da sua residência ou de onde você está!",'preencha_o_numero') );		
					$(".location_area").html(data.details.bairro);
					$(".location_city").html(data.details.cidade);
					$(".location_state").html(data.details.estado);
					$(".location_name").val('');
					$(".delivery_instruction").val('');
					$(".state_id").val(data.details.state_id);
					$(".city_id").val(data.details.city_id);
					$(".area_id").val(data.details.area_id);
					$(".state").val(data.details.estado);
					$(".city").val(data.details.cidade);
					$(".area_name").val(data.details.bairro);
					global_city_id = data.details.city_id;
					global_area_id = data.details.area_id;
					global_state_id = data.details.state_id;					
					} 
					/* if(data.msg=='OK'){ 
					toastMsg( getTrans("Não foi possível encontrar o seu bairro em nosso sistema, por favor escolha manualmente!",'escolha_o_bairro') );	
			       setStorage("geo_address_result_formatted_address",data.details.formatted_address);
					$(".location_area").html(getTrans("Select District / Area","select_destrict_area"));
					$(".location_city").html(getTrans("Select City", "select_city"));
					$(".city_id").val('');
					$(".city").val('');	
					$(".area_id").val('');
					$(".area_name").val('');
					}*/
					
					/*if (empty(data.details.ids)){
					//toastMsg( getTrans("Não foi possível encontrar o seu bairro em nosso sistema, por favor escolha manualmente!",'escolha_o_bairro') );
						
							var params="cidade="+ data.details.ids_cidade.city_id;
					      	  params+="&bairro="+ data.details.area_name;
					      	  callAjax("SalvaBairro",params);
					} */
					break;
					
				case "IdsDoBairro":
					if(!empty(data.details)){
					//$(".location_area").html(data.details.area_name);
					$(".location_city").html(data.details.city);
					$(".location_state").html(data.details.state);
					$(".location_name").val('');
					$(".delivery_instruction").val('');
					$(".state_id").val(data.details.state_id);
					$(".city_id").val(data.details.city_id);
					//$(".area_id").val(data.details.area_id);
					$(".state").val(data.details.state);
					$(".city").val(data.details.city);
					//$(".area_name").val(data.details.area_name);
					global_city_id = data.details.city_id;
					//global_area_id = data.details.area_id;
					global_state_id = data.details.state_id;					
					} 
					break;
/*Fim da atualização*/
			    case "getSettings":      			       
			       if ( data.details.enabled_push==1){		
			       	   enabled_push.setChecked(true);			       	   	       	  			       	  
			       } else {			       	  
			       	   enabled_push.setChecked(false);
			       }			
			       $(".country_code_set").val( data.details.country_code_set);
			       
			       var device_id=getStorage("device_id");
			       $(".device_id_val").html( device_id );
			       break;
			       
			    case "mobileCountryList":   
			       displayLocations(data.details);
			       break;
			   
			    case "getLanguageSelection":
			       displayLanguageSelection(data.details);
			       break;    
			       
			    case "getLanguageSettings":   			       		      
			    
			       setStorage("enabled_advance_search",data.details.settings.enabled_advance_search);
			       
			       setStorage("theme_search_merchant_name",data.details.settings.theme_search_merchant_name);
			       setStorage("theme_search_street_name",data.details.settings.theme_search_street_name);
			       setStorage("theme_search_cuisine",data.details.settings.theme_search_cuisine);
			       setStorage("theme_search_foodname",data.details.settings.theme_search_foodname);
			       setStorage("theme_search_merchant_address",data.details.settings.theme_search_merchant_address);
			       
			       setStorage("translation",JSON.stringify(data.details.translation));
			       
			       dump(data);
			       /*set settings to storage*/			       
			       setStorage("decimal_place",data.details.settings.decimal_place);
			       setStorage("currency_position",data.details.settings.currency_position);
			       setStorage("currency_set",data.details.settings.currency_set);
			       setStorage("thousand_separator",data.details.settings.thousand_separator);
			       setStorage("decimal_separator",data.details.settings.decimal_separator);
			       setStorage("show_addon_description",data.details.settings.show_addon_description);

			       var device_set_lang=getStorage("default_lang");
			       
			       /*CHECK FORCE LANGUAGE*/
			       if(!empty(data.details.settings.force_app_default_lang)){
			       	   device_set_lang  = data.details.settings.force_app_default_lang;
			       	   setStorage("default_lang",device_set_lang);
			       }
			       
			       dump("device_set_lang=>"+device_set_lang);
			       
			       if (empty(device_set_lang)){
			       	   dump('proceed');
				       if(!empty(data.details.settings.default_lang)){			       	  
				          setStorage("default_lang",data.details.settings.default_lang);
				       } else {
				       	  setStorage("default_lang","");
				       }			
			       } 
			       
			       
			       dump("SET LANG=>"+ getStorage("default_lang"));
			       
			       /*single food item*/
			       setStorage('single_add_item', data.details.settings.single_add_item );
			       
			       /*pts*/
			       setStorage("pts",data.details.settings.pts);
			       
/*Atualização Master Hub (Personalizações)*/
					/*splash_paginas slide*/
				   setStorage("slide",data.details.settings.splash_paginas);
				   
/*Fim da atualização*/
			
			       /*facebook_flag*/
			       setStorage("facebook_flag",data.details.settings.facebook_flag);
			       
			       /*avatar*/
			       setStorage("avatar",data.details.settings.avatar);
			       setStorage("client_name_cookie",data.details.settings.client_name_cookie);			       
			       setStorage("mobile_country_code",data.details.settings.mobile_country_code);
			       
			       setStorage("from_icon",data.details.settings.map_icons.from_icon);
			       setStorage("destination_icon",data.details.settings.map_icons.destination_icon);
			       
			       setStorage("mobile_save_cart_db",data.details.settings.mobile_save_cart_db);
			       
			       setStorage("search_mode",data.details.settings.search_mode);			       			       
			       setStorage("search_type",data.details.settings.search_type);
			       
			       setStorage("location_accuracy",data.details.settings.location_accuracy);			       
			       setStorage("facebook_app_id",data.details.settings.facebook_app_id);
			       setStorage("enabled_googlogin",data.details.settings.enabled_googlogin);
			       
			       setStorage("custom_pages",data.details.settings.pages);
			       
			       setStorage("analytics_id",data.details.settings.analytics_id);
			       setStorage("analytics_enabled",data.details.settings.analytics_enabled);
			       
			       setStorage("website_review_type",data.details.settings.website_review_type);
			       setStorage("mobile_enabled_fblogin",data.details.settings.mobile_enabled_fblogin);
			       setStorage("mobile_auto_location",data.details.settings.mobile_auto_location);
			       setStorage("enabled_delivery_select_map",data.details.settings.enabled_delivery_select_map);
			       
			       
			       
			       /*SET ANALYTICS*/
			       /*if (!isDebug()){			       	   
			       	   if ( data.details.settings.analytics_enabled == 1 && !empty(data.details.settings.analytics_id)){
			       	   	   window.ga.startTrackerWithId( data.details.settings.analytics_id , 30);
			       	   }			      					   					  
			       }*/
			       
			       /*SET ANALYTICS*/
			       setTrackingAccount();
			       
			       //translatePage();	  
			       var options = {
				      animation: 'slide',
				      onTransitionEnd: function() { 		
				      	 initSlideMenu();						      	 
				      	 //getCurrentLocation();
				      } 
				   };     
				   //kSettingsNavigator.pushPage("slidingMenu.html", options);	
				   kSettingsNavigator.resetToPage("slidingMenu.html", options);	
			       
			       break;
/* Atualização Master Hub (Programa de Fidelidade) */
			   case "applyFidelidade":   
			       dump(data.details);			       
			       $(".fidelidade_amount").val(data.details.amount);
			      $(".fidelidade_type").val(data.details.fidelidade_type);
/*Atualização Master Hub (Ao aplicar o cupom atualiza o resumo)*/
				   carrinho=getStorage("cart_sub_total");
				   embalagem=getStorage("cart_packaging");
				   entrega=getStorage("cart_delivery_charges");
				   percent_comod=getStorage("cart_tax");
					
					if (typeof entrega === "undefined" || entrega==null || entrega=="" || entrega<0 ){
							  	taxa_entrega=0;
 								}else{
 								taxa_entrega = entrega;
 								}
					
					if (typeof embalagem === "undefined" || embalagem==null || embalagem=="" || embalagem<0 ){
							  	taxa_embalagem=0;
 								}else{
 								taxa_embalagem = embalagem;
 								}
					
					if (typeof percent_comod === "undefined" || percent_comod==null || percent_comod=="" || percent_comod<0 ){
							  	taxa_percent_comod=0;
								taxa_comodidade_ok=0;
 								}else{
 								taxa_percent_comod = percent_comod;	
									
 								}
					
					if(data.details.fidelidade_type == 'percentage'){
					   	 valor_fidelidade=carrinho*data.details.amount/100;
					} else {
					     valor_fidelidade=data.details.amount;
					}
					
					subtotal_new=getStorage("cart_sub_total") - valor_fidelidade;
					
					
					subtotal_new2=parseFloat(taxa_embalagem)+parseFloat(taxa_entrega)+parseFloat(subtotal_new);
					
					taxa_comodidade=subtotal_new*taxa_percent_comod/100;
					gorjeta_new=getStorage("tips_percentage")*subtotal_new/100;
					
				$("#page-paymentoption .titulo-cupom").html('Desconto do Fidelidade: ');
				$("#page-paymentoption .fidelidade_amount").html('('+prettyPrice(valor_fidelidade)+')');
				$("#page-paymentoption .titulo-subtotal_new").html('Sub Total (- Fidelidade): ');
				$("#page-paymentoption .titulo-comodidade").html('Taxa de Comodidade: ');
				$("#page-paymentoption .total-comodidade").html(prettyPrice(taxa_comodidade));
				$("#page-paymentoption .subtotal_new").html(prettyPrice(subtotal_new));
				$("#page-paymentoption .titulo-gorjeta").html('Gorjeta: ');
				$("#page-paymentoption .total-gorjeta").html(prettyPrice(gorjeta_new));			
							if (transaction_type=="delivery"){	
				$("#page-paymentoption .titulo-entrega").css({"display":"block"});
				$("#page-paymentoption .total-entrega").css({"display":"block"});
							}else{
				$("#page-paymentoption .titulo-entrega").css({"display":"none"});
				$("#page-paymentoption .total-entrega").css({"display":"none"});
							}
							if (taxa_entrega==0){	
				$("#page-paymentoption .titulo-entrega").css({"display":"block"});
				$("#page-paymentoption .total-entrega").html("Entrega Grátis");
							}		
				$("#page-paymentoption .fidelidade_amount").css({"display":"block"});
				$("#page-paymentoption .titulo-cupom").css({"display":"block"});
				$("#page-paymentoption .subtotal_new").css({"display":"block"});
				$("#page-paymentoption .titulo-subtotal_new").css({"display":"block"});
					
			       $(".apply-fidelidade").hide();
			       $(".remove-fidelidade").css({
			       	  "display":"block"
			       });
			       if (data.details.amount==0.0000){
					$(".fidelidade-header").html('');   
				   } else {
			       $(".fidelidade-header").html(data.details.less);
				   }
					if (typeof taxa_comodidade_ok === "undefined" || taxa_comodidade_ok==null || taxa_comodidade_ok=="" || taxa_comodidade_ok==0){
						taxa_comodidade_ok=0;
					} else {
						taxa_comodidade_ok=taxa_comodidade;
					}
					
			       new_total= data.details.new_total;
				
					if (transaction_type=="delivery"){	
		new_total2=parseFloat(taxa_embalagem)+parseFloat(taxa_entrega)+parseFloat(new_total)+parseFloat(taxa_comodidade_ok);
					}else{
		new_total2=parseFloat(taxa_embalagem)+parseFloat(new_total)+parseFloat(taxa_comodidade_ok);		
					}
					
					if (typeof taxa_comodidade === "undefined" || taxa_comodidade==null || taxa_comodidade=="" || taxa_comodidade<0 ){
				$(".total-amount").html( prettyPrice(new_total));
 								}else{
 				$(".total-amount").html( prettyPrice(new_total2));
 								}
					if (typeof taxa_entrega==0 ){
				$(".total-amount").html( prettyPrice(new_total));
 								}else{
 				$(".total-amount").html( prettyPrice(new_total2));
 								}
			       break;
/*Fim da atualização*/
			   case "applyVoucher":   
			       dump(data.details);			       
			       $(".voucher_amount").val( data.details.amount );
			       $(".voucher_type").val( data.details.voucher_type );
/*Atualização Master Hub (Ao aplicar o cupom atualiza o resumo)*/
				   carrinho=getStorage("cart_sub_total");
				   embalagem=getStorage("cart_packaging");
				   entrega=getStorage("cart_delivery_charges");
				   percent_comod=getStorage("cart_tax");
					
					if (typeof entrega === "undefined" || entrega==null || entrega=="" || entrega<0 ){
							  	taxa_entrega=0;
 								}else{
 								taxa_entrega = entrega;
 								}
					
					if (typeof embalagem === "undefined" || embalagem==null || embalagem=="" || embalagem<0 ){
							  	taxa_embalagem=0;
 								}else{
 								taxa_embalagem = embalagem;
 								}
					
					if (typeof percent_comod === "undefined" || percent_comod==null || percent_comod=="" || percent_comod<0 ){
							  	taxa_percent_comod=0;
								taxa_comodidade_ok=0;
 								}else{
 								taxa_percent_comod = percent_comod;	
									
 								}
					
					if(data.details.voucher_type == 'percentage'){
					   	 valor_voucher=carrinho*data.details.amount/100;
					} else {
					     valor_voucher=data.details.amount;
					}
					
					subtotal_new=getStorage("cart_sub_total") - valor_voucher;
					
					
					subtotal_new2=parseFloat(taxa_embalagem)+parseFloat(taxa_entrega)+parseFloat(subtotal_new);
					
					taxa_comodidade=subtotal_new*taxa_percent_comod/100;
					gorjeta_new=getStorage("tips_percentage")*subtotal_new/100;
					
				$("#page-paymentoption .titulo-cupom").html('Desconto do Cupom: ');
				$("#page-paymentoption .voucher_amount").html('('+prettyPrice(valor_voucher)+')');
				$("#page-paymentoption .titulo-subtotal_new").html('Sub Total (- Cupom): ');
				$("#page-paymentoption .titulo-comodidade").html('Taxa de Comodidade: ');
				$("#page-paymentoption .total-comodidade").html(prettyPrice(taxa_comodidade));
				$("#page-paymentoption .subtotal_new").html(prettyPrice(subtotal_new));
				$("#page-paymentoption .titulo-gorjeta").html('Gorjeta: ');
				$("#page-paymentoption .total-gorjeta").html(prettyPrice(gorjeta_new));			
							if (transaction_type=="delivery"){	
				$("#page-paymentoption .titulo-entrega").css({"display":"block"});
				$("#page-paymentoption .total-entrega").css({"display":"block"});
							}else{
				$("#page-paymentoption .titulo-entrega").css({"display":"none"});
				$("#page-paymentoption .total-entrega").css({"display":"none"});
							}
							if (taxa_entrega==0){	
				$("#page-paymentoption .titulo-entrega").css({"display":"block"});
				$("#page-paymentoption .total-entrega").html("Entrega Grátis");
							}		
				$("#page-paymentoption .voucher_amount").css({"display":"block"});
				$("#page-paymentoption .titulo-cupom").css({"display":"block"});
				$("#page-paymentoption .subtotal_new").css({"display":"block"});
				$("#page-paymentoption .titulo-subtotal_new").css({"display":"block"});
					
			       $(".apply-voucher").hide();
			       $(".remove-voucher").css({
			       	  "display":"block"
			       });
			       
			       $(".voucher-header").html(data.details.less);
					
					if (typeof taxa_comodidade_ok === "undefined" || taxa_comodidade_ok==null || taxa_comodidade_ok=="" || taxa_comodidade_ok==0){
						taxa_comodidade_ok=0;
					} else {
						taxa_comodidade_ok=taxa_comodidade;
					}
					
			       var new_total= data.details.new_total;
				
					if (transaction_type=="delivery"){	
		new_total2=parseFloat(taxa_embalagem)+parseFloat(taxa_entrega)+parseFloat(new_total)+parseFloat(taxa_comodidade_ok);
					}else{
		new_total2=parseFloat(taxa_embalagem)+parseFloat(new_total)+parseFloat(taxa_comodidade_ok);		
					}
					
					if (typeof taxa_comodidade === "undefined" || taxa_comodidade==null || taxa_comodidade=="" || taxa_comodidade<0 ){
				$(".total-amount").html( prettyPrice(new_total));
 								}else{
 				$(".total-amount").html( prettyPrice(new_total2));
 								}
					if (typeof taxa_entrega==0 ){
				$(".total-amount").html( prettyPrice(new_total));
 								}else{
 				$(".total-amount").html( prettyPrice(new_total2));
 								}
			       break;
/*Fim da atualização*/
			       
			    case "validateCLient":   
			       setStorage("client_token", data.details.token ); // register token
                   onsenAlert(data.msg);
                   
                   
                   if ( data.details.is_checkout=="shipping_address"){
                   	   
                   	    search_mode = getSearchMode();
                   	   
                   	    if (search_mode=="postcode"){                    	    	           	    	                   	    
                   	    	showShippingLocation(data);                   	    	
                   	    } else {
	                   	    var options = {
						      animation: 'slide',
						      onTransitionEnd: function() { 						      	  
						      	  displayMerchantLogo2( getStorage("merchant_logo") ,
						      	     getStorage("order_total") ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
								  '' ,
/*Fim da atualização*/
						      	     'page-shipping');
						      	     					      	     
						      	     fillShippingAddress();
						      	     
						      } 
						    };     
/*Atualização Master Hub (Correção de tela errada de endereços finalizando o pedido)*/
						     sNavigator.pushPage("shippingLocationArea.html", options);		
/*Fim da atualização*/
                   	    }
					    
                   } else if ( data.details.is_checkout=="payment_option" )  {
						 var options = {
					      animation: 'slide',
					      onTransitionEnd: function() { 						      	  
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
					      	  displayMerchantLogo3( 
					      	     getStorage("merchant_logo") ,
					      	     getStorage("order_total") ,
								 getStorage("cart_sub_total_final") , 
								 getStorage("cart_delivery_charges_final"),
								 getStorage("cart_tax_final"), 
								 getStorage("cart_packaging_final"),
								 getStorage("cart_discount_final"),
								 getStorage("cart_tip_final"),							  
/*Fim da atualização*/
					      	     'page-paymentoption'
					      	  );
					      	  var params="merchant_id="+ getStorage("merchant_id");
					      	  params+="&client_token="+ getStorage("client_token");
					      	  params+="&transaction_type=" +  getStorage("transaction_type") ;
					      	  callAjax("getPaymentOptions",params);
					      } 
					    };   
					    sNavigator.pushPage("paymentOption.html", options);	   
                   	
                   } else {
                      menu.setMainPage('home.html', {closeMenu: true});
                   }
			       break;
			       
			    /*pts*/
			    case "getPTS":   
			       $(".available_points").html( data.details.available_points );
			       $(".expenses_points").html( data.details.total_expenses_points );
			       $(".expired_points").html( data.details.points_expiring );
			    break;
			    
			    case "detailsPTS":
			      $(".pts_title").html(data.details.title);
			      displayPTSdetails(data.details.data);
			    break;
			    
			    
			    case "applyRedeemPoints":
			    
			      $(".pts_redeem_points").val( data.details.pts_points_raw );
			      $(".pts_redeem_amount").val( data.details.pts_amount_raw );
			      $(".pts_points_label").html( data.details.pts_points +" ("+ data.details.pts_amount+")" );
			      $(".pts_pts").hide();
			      $(".pts_pts_cancel").css({"display":"block"});
/*Atualização Master Hub (Ao aplicar o pontos atualiza o resumo)*/
					carrinho=getStorage("cart_sub_total");
				    embalagem=getStorage("cart_packaging");
					entrega=getStorage("cart_delivery_charges");
					percent_comod=getStorage("cart_tax");
					
					if (typeof entrega === "undefined" || entrega==null || entrega=="" || entrega==0 ){
							  	taxa_entrega=0;
 								}else{
 								taxa_entrega = entrega;
 								}
					
					if (typeof embalagem === "undefined" || embalagem==null || embalagem=="" || embalagem==0 ){
							  	taxa_embalagem=0;
 								}else{
 								taxa_embalagem = embalagem;
 								}
					
					if (typeof percent_comod === "undefined" || percent_comod==null || percent_comod=="" || percent_comod==0 ){
							  	taxa_percent_comod=0;
								taxa_comodidade_ok=0;
 								}else{
 								taxa_percent_comod = percent_comod;
 								}
					
					valor_pontos=data.details.pts_amount_raw;
					
					subtotal_new=carrinho - valor_pontos;
					subtotal_new2=parseFloat(taxa_embalagem)+parseFloat(taxa_entrega)+parseFloat(subtotal_new);
					taxa_comodidade=subtotal_new*taxa_percent_comod/100;
					gorjeta_new=getStorage("tips_percentage")*subtotal_new/100;
		$("#page-paymentoption .total-pontos").html('('+data.details.pts_amount+')');
		$("#page-paymentoption .titulo-pontos").html('Menos '+data.details.pts_points_raw+' Pontos: ');
		$("#page-paymentoption .titulo-comodidade").html('Taxa de Comodidade: ');
		$("#page-paymentoption .total-comodidade").html(prettyPrice(taxa_comodidade));
		$("#page-paymentoption .titulo-subtotal_new").html('Sub Total (- Pontos): ');
					if (transaction_type=="delivery"){	
		$("#page-paymentoption .titulo-entrega").css({"display":"block"});
		$("#page-paymentoption .total-entrega").css({"display":"block"});
					}else{
		$("#page-paymentoption .titulo-entrega").css({"display":"none"});
		$("#page-paymentoption .total-entrega").css({"display":"none"});
					}
					if (taxa_entrega==0){	
		$("#page-paymentoption .titulo-entrega").css({"display":"none"});
		$("#page-paymentoption .total-entrega").css({"display":"none"});
					}					
		$("#page-paymentoption .subtotal_new").html(prettyPrice(subtotal_new));
		$("#page-paymentoption .titulo-gorjeta").html('Gorjeta: ');
		$("#page-paymentoption .total-gorjeta").html(prettyPrice(gorjeta_new));			
		$("#page-paymentoption .total-pontos").css({"display":"block"});
		$("#page-paymentoption .titulo-pontos").css({"display":"block"});
		$("#page-paymentoption .subtotal_new").css({"display":"block"});
		$("#page-paymentoption .titulo-subtotal_new").css({"display":"block"});	

			      
			      
			      var new_total= data.details.new_total;
			      dump('compute new total for pts');
					
					if (typeof taxa_comodidade_ok === "undefined" || taxa_comodidade_ok==null || taxa_comodidade_ok=="" || taxa_comodidade_ok==0){
						taxa_comodidade_ok=0;
					} else {
						taxa_comodidade_ok=taxa_comodidade;
					}
									
					if (transaction_type=="delivery"){	
		new_total2=parseFloat(taxa_embalagem)+parseFloat(taxa_entrega)+parseFloat(new_total)+parseFloat(taxa_comodidade_ok);
					}else{
		new_total2=parseFloat(taxa_embalagem)+parseFloat(new_total)+parseFloat(taxa_comodidade_ok);		
					}
					
					if (typeof taxa_comodidade === "undefined" || taxa_comodidade==null || taxa_comodidade=="" || taxa_comodidade<0 ){
				$(".total-amount").html( prettyPrice(new_total));
 								}else{
 				$(".total-amount").html( prettyPrice(new_total2));
 								}
					if (typeof taxa_entrega==0 ){
				$(".total-amount").html( prettyPrice(new_total));
 								}else{
 				$(".total-amount").html( prettyPrice(new_total2));
 								}
/*Fim da atualização*/
			    break;
			    
			    case "addToCart":
			    //onsenAlert(  getTrans("Item added to cart",'item_added_to_cart') );
/*Atualização Master Hub (Remoção da mensagem de ítem adicionado e Correção da tela de exibição)*/
			    //toastMsg( getTrans("Item added to cart",'item_added_to_cart') );
			onsenDialogCheckout();
/*Fim da atualização*/
			    break;
			    
			   
			    case "getCustomFields":
			      var custom_fields='';
			      $.each( data.details, function( key, val ) {     			      	  
			      	 custom_fields+= customFields(key,val);
			      });			      
                  createElement("custom-fields-wrap",custom_fields);
                  
                  if ( data.msg=="yes"){
                  	  $(".iagree-wrap").show();
                  } else $(".iagree-wrap").hide();
                  
			    break;
			    
			    case "verifyAccount":
			      setStorage("client_token", data.details.token ); // register token
			      toastMsg( data.msg );
			      menu.setMainPage('home.html', {closeMenu: true});
			    break;

			    case "coordinatesToAddress":	
			    
			       var your_location = new plugin.google.maps.LatLng(data.details.lat,data.details.lng); 
			       
			       var marker_title='';			       
			       marker_title+=data.details.result.formatted_address;
			       
			       setStorage("map_address_result_address",data.details.result.address);
			       setStorage("map_address_result_city",data.details.result.city);
			       setStorage("map_address_result_state",data.details.result.state);
			       setStorage("map_address_result_zip",data.details.result.zip);
			       setStorage("map_address_result_country",data.details.result.country);
			       setStorage("map_address_result_formatted_address",data.details.result.formatted_address);
			       
			       setStorage("google_lat",data.details.lat);
			       setStorage("google_lng",data.details.lng);
			       
			       //alert("add marker");
			       
			        map_search.addMarker({
					  'position': your_location ,
					  'title': marker_title,
					  'snippet': getTrans( "Press on marker 2 seconds to drag" ,'press_marker'),
					  'draggable': true				  
					}, function(marker) {
						
					   marker.showInfoWindow();
					   if(drag_marker_bounce==1){
					      //marker.setAnimation(plugin.google.maps.Animation.BOUNCE);
					   }
					   
					   drag_marker=marker;
					   drag_marker_bounce=2;					   
					   
					   
					   marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function(marker) {
							marker.getPosition(function(latLng) {								 
								 temp_result=explode(",", latLng.toUrlValue() );
								 /*alert(temp_result[0]);
								 alert(temp_result[1]);*/
								 drag_marker=marker;
								 callAjax("dragMarker","lat=" + temp_result[0] + "&lng="+ temp_result[1] );	 
							});
					   });
										   
					}); /*marker*/	    
			    break;
			    
			    case "dragMarker":
			    
			       setStorage("map_address_result_address",data.details.result.address);
			       setStorage("map_address_result_city",data.details.result.city);
			       setStorage("map_address_result_state",data.details.result.state);
			       setStorage("map_address_result_zip",data.details.result.zip);
			       setStorage("map_address_result_country",data.details.result.country);
			       setStorage("map_address_result_formatted_address",data.details.result.formatted_address);
			       
			       setStorage("google_lat",data.details.lat);
			       setStorage("google_lng",data.details.lng);	       
			       
			       drag_marker.setTitle( data.details.result.formatted_address );
			       drag_marker.showInfoWindow();
			    break;
			    
			    case "trackOrderHistory":	
			    
			       $(".track_driver").show();
			       $(".track-status-wrap").html(''); 
			       
			       $(".time-left").html( data.details.time_left );
			       $(".remaining").html( data.details.remaining );
			       
			       if ( data.details.history.length>0){
			       	  var html='<ul>';
			       	  $.each( data.details.history , function( key, val ) {     
			       	  	  dump(val);
			       	  	  html+='<li>';
				       	  	  html+='<div class="s-c-g"></div>';
/*Atualização Master Hub (Correção da Data ao rastrear o pedido)*/
				       	  	  html+='<p>'+dataAtualFormatada_NomeMes_hora(val.date_time)+'</p>';
/*Fim da atualização*/
				       	  	  html+='<h3>'+val.status+'</h3>';
			       	  	  html+='</li>';
			       	  });
			       	  html+='</ul>';
			       	  $(".track-status-wrap").append( html );
			       }
			       
			       if ( data.details.assign_driver==1){
			       	   $(".track_driver").show();
			       	   
			       	   $(".driver_lat").val( data.details.coordinates.driver_lat );
			       	   $(".driver_lng").val( data.details.coordinates.driver_lng );
			       	   
			       	   $(".task_lat").val( data.details.coordinates.task_lat );
			       	   $(".task_lng").val( data.details.coordinates.task_lng );
			       	   
			       	   $(".driver_name").val( data.details.driver_info.driver_name );
			       	   $(".driver_email").val( data.details.driver_info.driver_email );
			       	   $(".driver_phone").val( data.details.driver_info.driver_phone );
			       	   $(".transport_type").val( data.details.driver_info.transport_type );
			       	   $(".licence_plate").val( data.details.driver_info.licence_plate );
			       	   $(".delivery_address").val( data.details.delivery_address );
			       	   
			       	   $(".driver_icon").val( data.details.driver_icon );
			       	   $(".address_icon").val( data.details.address_icon );
			       	   $(".driver_avatar").val( data.details.driver_avatar );
			       	   
			       	   $(".dropoff_lat").val( data.details.coordinates.dropoff_lat );
			       	   $(".dropoff_lng").val( data.details.coordinates.dropoff_lng );
			       	   $(".drop_address").val( data.details.coordinates.drop_address );
			       	   $(".merchant_icon").val( data.details.merchant_icon );
			       	   
			       }  else {
			       	   $(".track_driver").hide();
			       	   
			       	   $(".driver_lat").val('');
			       	   $(".driver_lng").val('');
			       	   
			       	   $(".task_lat").val('');
			       	   $(".task_lng").val('');
			       	   
			       	   $(".driver_name").val( '' );
			       	   $(".driver_email").val( '' );
			       	   $(".driver_phone").val( '' );
			       	   $(".transport_type").val( '' );
			       	   $(".licence_plate").val( '' );
			       	   $(".delivery_address").val( '' );
			       	   $(".driver_avatar").val( '' );
			       	   
			       	   $(".dropoff_lat").val( '' );
			       	   $(".dropoff_lng").val( '' );
			       	   $(".merchant_icon").val( '' );
			       	   
			       }
			       
			       stopTrackInterval();
		           track_order_interval = setInterval(function(){runTrackOrder()}, 60000);
			       
			    break;
			    
			    
			    case "saveContactNumber":	
			    		    
                   var options = {
				      animation: 'slide',
				      onTransitionEnd: function() { 						      	  
				      	  displayMerchantLogo2( 
				      	     getStorage("merchant_logo") ,
				      	     getStorage("order_total") ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
								  '' ,
/*Fim da atualização*/
				      	     'page-paymentoption'
				      	  );
				      	  var params="merchant_id="+ getStorage("merchant_id");
				      	  params+="&client_token="+ getStorage("client_token");
				      	  params+="&transaction_type=" +  getStorage("transaction_type") ;
				      	  callAjax("getPaymentOptions",params);
				      } 
				    };   
				    sNavigator.pushPage("paymentOption.html", options);		

			    break;
			    
			    case "trackOrderMap":
			       //reInitTrackMap(data.details);
			       ReInitTrackingMap(data.details);
			    break;
			    
			    case "getMerchantCClist":
			       fillCCList(data.details);
			    break;
			    
			    case "saveCreditCard":
			    case "deleteCreditCard":
			        sNavigator.popPage({cancelIfRunning: true});			        
			        var params="merchant_id=" +  getStorage("merchant_id") ;
			      	params+="&client_token="+getStorage("client_token");
				    callAjax("getMerchantCClist",params);			        
			    break;
			    
			    case "loadCC":
			       $(".card_name").val( data.details.card_name);
			       $(".cc_number").val( data.details.credit_card_number);
			       $(".cvv").val( data.details.cvv);
			       $(".billing_address").val( data.details.billing_address);
			       
			       $(".expiration_month").val( data.details.expiration_month);
			       $(".expiration_yr").val( data.details.expiration_yr);
			       $(".expiration_month_label").html( data.details.expiration_month );
			       $(".expiration_year").html( data.details.expiration_yr );

			       $(".cc_id").val( data.details.cc_id );	
			       
			       $(".delete-cc").show();
			       
			    break;
			    
			    case "getHubtelChannel":
			    
			       var htm='';
					htm+='<ons-list>';
					htm+='<ons-list-header class="list-header trn" data-trn-key="channel">Channel</ons-list-header>';
			       $.each( data.details, function( channel, channel_name ) { 
			       	
			       	 htm+='<ons-list-item modifier="tappable" onclick="setChannel('+"'"+channel+"',"+"'"+channel_name+"'"+ ');">';
					 htm+='<label class="radio-button checkbox--list-item">';
						htm+='<input type="radio" name="channel_m" class="channel_m" value="'+channel+'"  >';
						htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
						htm+=' '+channel_name;
					  htm+='</label>'; 
					htm+='</ons-list-item>';
			       	
			       });
			       htm+='</ons-list>';	
	               createElement('hubtel-channel-options-list',htm);	
			    break;
			    
			    case "getLocationCity":
			    
			      var htm='';
					htm+='<ons-list>';
					//htm+='<ons-list-header class="list-header trn" >'+ getTrans('City','city') +'</ons-list-header>';
			       $.each( data.details, function( city_key , city_val ) { 
			       	
			       	 htm+='<ons-list-item modifier="tappable" onclick="setLocationCity('+"'"+city_val.id+"',"+"'"+city_val.name+"',"+  "'" + city_val.state_id + "'" +  ');">';
					 htm+='<label class="radio-button checkbox--list-item">';
						htm+='<input type="radio" name="channel_m" class="channel_m" value="'+city_val.id+'"  >';
						htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
						htm+=' '+city_val.name;
					  htm+='</label>'; 
					htm+='</ons-list-item>';
					
					});
					
					htm+='</ons-list>';	
	               createElement('location-city-list',htm);	
			    
			    break;
			    
			    case "getLocationArea":
			    
			       var htm='';
					htm+='<ons-list>';
					//htm+='<ons-list-header class="list-header trn">'+getTrans('Area','area')+'</ons-list-header>';
			       $.each( data.details, function( area_key , val_area ) { 
			       				       	
			       	 htm+='<ons-list-item modifier="tappable" onclick="setLocationArea('+"'"+val_area.area_id+"',"+"'"+val_area.name+"'"+ ');">';
					 htm+='<label class="radio-button checkbox--list-item">';
						htm+='<input type="radio" name="channel_m" class="channel_m" value="'+val_area.area_id+'"  >';
						htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
						htm+=' '+val_area.name;
					  htm+='</label>'; 
					htm+='</ons-list-item>';
					
					});
					
					htm+='</ons-list>';	
	               createElement('location-area-list',htm);	
	               
			    break;
/*Atualização Master Hub (Correção ao Pegar o Endereço)*/
			    case "getLocationArea_multi":
			    
			       var htm='';
					htm+='<ons-list>';
					//htm+='<ons-list-header class="list-header trn">'+getTrans('Area','area')+'</ons-list-header>';
			       $.each( data.details, function( area_key , val_area ) { 
			       				       	
			       	 htm+='<ons-list-item modifier="tappable" onclick="setLocationArea('+"'"+val_area.area_id+"',"+"'"+val_area.name+"'"+ ');">';
					 htm+='<label class="radio-button checkbox--list-item">';
						//htm+='<input type="radio" name="channel_m" class="channel_m" value="'+val_area.area_id+'"  >';
						htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
						htm+=' '+val_area.name;
					  htm+='</label>'; 
					htm+='</ons-list-item>';
					
					});
					
					htm+='</ons-list>';	
	               createElement('location-area-list',htm);	
	               
			    break;
/*Fim da atualização*/
			    
			    case "locationState":
			    
			       var htm='';
					htm+='<ons-list>';
					htm+='<ons-list-header class="list-header trn">'+getTrans("State",'state')+'</ons-list-header>';
			       $.each( data.details, function( state_key , val_state ) { 
			       				       	
			       	 htm+='<ons-list-item modifier="tappable" onclick="setLocationState('+"'"+val_state.id+"',"+"'"+val_state.name+"'"+ ');">';
					 htm+='<label class="radio-button checkbox--list-item">';
						htm+='<input type="radio" name="channel_m" class="channel_m" value="'+val_state.id+'"  >';
						htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
						htm+=' '+val_state.name;
					  htm+='</label>'; 
					htm+='</ons-list-item>';
					
					});
					
					htm+='</ons-list>';	
	               createElement('location-state-list',htm);	
			    
			    break;
			    
			    case "getLocationPostal":
			    
			        var htm='';
					htm+='<ons-list>';
					htm+='<ons-list-header class="list-header trn" ">'+getTrans("Postal Code",'postal_code')+'</ons-list-header>';
			       $.each( data.details, function( postal_key , val_postal ) { 
			       				       	
			       	 htm+='<ons-list-item modifier="tappable" onclick="setLocationPostal('+"'"+val_postal.postal_code+"'"+');">';
					 htm+='<label class="radio-button checkbox--list-item">';
						htm+='<input type="radio" name="channel_m" class="channel_m" value="'+val_postal.postal_code+'"  >';
						htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
						htm+=' '+val_postal.postal_code;
					  htm+='</label>'; 
					htm+='</ons-list-item>';
					
					});
					
					htm+='</ons-list>';	
	               createElement('location-area-postal',htm);	
			    
			    break;
			    
			    case "initSearch":
			    
			       setTrackView("restaurant results");
			    
			       // set the total search results
			       setStorage("search_total", data.details.total);
			       setStorage("search_total_raw", data.details.total_raw);
			    
			       var options = {     
				  	  //address:s,	  	 	  	  
				  	  closeMenu:true,
				      animation: 'slide',
				      callback: function(index) {	      	
				      }
				   };	   	   	 				   
				   menu.setMainPage('searchResults.html',options);
			    break;
/*Atualização Master Hub (Buscando Categorias Modificado)*/
			    case "initSearchCategorias":
					
				var login_force_on=getStorage("login_force_on");
				dump("login_force_on=>"+login_force_on);
				
			if(login_force_on==="yes"){	
		
			if (!isLogin()){
		menu.setMainPage('prelogin.html', {closeMenu: true});
		} else {
			
			       setTrackView("restaurant results");
			    
			       // set the total search results
			       setStorage("search_total", data.details.total);
			    
			       var options = {     
				  	  //address:s,	  	 	  	  
				  	  closeMenu:true,
				      animation: 'slide',
				      callback: function(index) {	      	
				      }
				   };	   	   	 				   
				   menu.setMainPage('searchCategorias.html',options);
		} 
			} else {
					
					setTrackView("restaurant results");
			    
			       // set the total search results
			       setStorage("search_total", data.details.total);
			    
			       var options = {     
				  	  //address:s,	  	 	  	  
				  	  closeMenu:true,
				      animation: 'slide',
				      callback: function(index) {	      	
				      }
				   };	   	   	 				   
				   menu.setMainPage('searchCategorias.html',options);				
			}
				
			    break;
/*Fim da atualização*/
			    case "initBrowseMerchant":
/*Atualização Master Hub (Atualização forçada do APP)*/
				var login_force_on=getStorage("login_force_on");
				dump("login_force_on=>"+login_force_on);
				
			if(login_force_on==="yes"){	
		
			if (!isLogin()){
		menu.setMainPage('prelogin.html', {closeMenu: true});
		} else {
			       setStorage("browse_total", data.details.total);			       
			       setStorage("browse_total_raw", data.details.total_raw);	
			       menu.setMainPage('browseRestaurant.html', {closeMenu: true});
		}
				} else {
			       
				   setStorage("browse_total", data.details.total);	
			       setStorage("browse_total_raw", data.details.total_raw);
			       menu.setMainPage('browseRestaurant.html', {closeMenu: true});
		}
/*Fim da atualização*/
			    break;
			    
			    case "getCategoryCount":
/*Atualização Master Hub (Login forçado antes de ver as empresas)*/
				var login_force_on=getStorage("login_force_on");
				dump("login_force_on=>"+login_force_on);
				
			if(login_force_on==="yes"){	
		
			if (!isLogin()){
		menu.setMainPage('prelogin.html', {closeMenu: true});
		} else {
			       setTrackView("restaurant menu - " + data.details.restaurant_name );
			    
			       setStorage("category_count", data.details.total);
			       
			       /*setStorage("enabled_gallery", data.details.enabled_gallery);
			       setStorage("enabled_booking", data.details.enabled_booking);*/
			       
			       setStorage("menu_enabled_gallery", data.details.menu_enabled_gallery);
			       setStorage("menu_enabled_booking", data.details.menu_enabled_booking);
			       setStorage("menu_enabled_hours", data.details.menu_enabled_hours);
			       setStorage("menu_enabled_review", data.details.menu_enabled_review);
			       setStorage("menu_enabled_map", data.details.menu_enabled_map);
			       setStorage("menu_enabled_info", data.details.menu_enabled_info);
			       setStorage("menu_enabled_promo", data.details.menu_enabled_promo);
			       
			       
			       var options = {
				      animation: 'slide',
				      onTransitionEnd: function() { 	
				      					      	
				      	 if(data.details.total<=0){
				      	    toastMsg(data.msg);	
				      	 }
				      	 if(!empty(data.details.merchant_photo_bg)){
				      	 	//$(".menu-header").css("background","url("+data.details.merchant_photo_bg+") no-repeat center center / cover");
				      	 	//$(".menu-header").css("background", 'url("' + data.details.merchant_photo_bg + '") no-repeat center center / cover ');
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#menucategory-page .estabelecimento-header2").attr("style",'background-image: url('+ data.details.merchant_photo_bg +'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#menucategory-page .estabelecimento-header").attr("style",'background-image: url('+ data.details.merchant_photo_bg +'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
							 
				      	 }
				      } 
				   };
				   sNavigator.pushPage("menucategory.html", options);
}
				} else {
		       setTrackView("restaurant menu - " + data.details.restaurant_name );
			    
			       setStorage("category_count", data.details.total);
			       var options = {
				      animation: 'slide',
				      onTransitionEnd: function() { 	
				      	 if(data.details.total<=0){
				      	    toastMsg(data.msg);	
				      	 }
				      	 if(!empty(data.details.merchant_photo_bg)){
							 
	//$(".menu-header").css("background","url("+data.details.merchant_photo_bg+") no-repeat center center / cover");
							 
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#menucategory-page .estabelecimento-header2").attr("style",'background-image: url('+ data.details.merchant_photo_bg +'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#menucategory-page .estabelecimento-header").attr("style",'background-image: url('+ data.details.merchant_photo_bg +'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
							 
				      	 }
				      } 
				   };
				   sNavigator.pushPage("menucategory.html", options);
}					
/* Fim da Atualização */
			    break;
			    
			    case "getItemCount":
			    			       
			       setTrackView( $(".selected_restaurant_name").val() + " category" ,  data.details.category_name );
			       
			       setStorage("item_count",data.details.total)			       
			       var options = {
				      animation: 'none',
				      onTransitionEnd: function(){				      	  
				      	 showCartNosOrder();
				      } 
				   };
/*Atualização Master Hub (Chamada de página nova)*/
				   sNavigator.pushPage("menuItemEmpresa.html", options);
/* Fim da Atualização */
			    break;
			    
			    
			    case "GetCategoryList":
			       $("#page-menubycategoryitem #search-text").html(data.details.category_name);
			       fillPopOverCategoryList(data.details.category);
			    break;
			    
			    case "getPages":			    
			      $(".custompage_title").html(data.details.title);
			      $(".custom_page_content").html(data.details.content);
			      setTrackView( data.details.title );
			    break;
			    
			    case "clearMyCart":
			      cart=[];		       
		          sNavigator.popPage({cancelIfRunning: true}); //back button
		          showCartNosOrder();
			    break;
			    
			    case "WingValidate":
			    
			          var options = {
					      animation: 'slide',
					      onTransitionEnd: function() {
					      	  $(".wing_token").val( data.details.wing_token );
					      	  $(".order_id").val( data.details.order_info.order_id );
					      	  $(".total_w_tax").val( data.details.order_info.total_w_tax );
					      	  
					      	  var html='';
					      	  html = wingRow('pay_to','Pay to', data.details.wing_data.merchant_name );
					      	  html+= wingRow('item','Item', data.details.wing_data.amount );
					      	  html+= wingRow('fee','Fee', data.details.wing_data.fee );
					      	  if ( !empty(data.details.wing_data.exchange_rate)){
					      	  	html+= wingRow('exchange_rate','Exchange Rate', data.details.wing_data.exchange_rate );
					      	  }					     
					      	  html+= wingRow('total_amount','Total Amount', data.details.wing_data.total );
					      	  html+= wingRow('wing_account','WING Account', data.details.order_info.wing_account );
					      	  html+= wingRow('account_name','Account Name ', data.details.wing_data.account_name );					      	  
					      	  createElement('wing_confirm_payment_details',html);
					      } 
					  }; 
					  sNavigator.pushPage("wingCommitForm.html", options);   
			    
			    break;
			    
			    case "ipayAfricaGetInstructions":			        			        
			        $(".ipay_"+data.msg+"_content").html(data.details);
			    break;
			    
			    case "ipayInitiatorRequest":
			       $(".ipay_sid").val( data.details.sid ); 
			       $(".ipay_hash").val( data.details.hash ); 
			       $(".ipay_oid").val( data.details.oid ); 
			       $(".ipay_amount").val( data.details.amount ); 
			       
			       $(".int_MPESA").val( data.details.instructions.MPESA ); 
			       $(".int_AIRTEL").val( data.details.instructions.AIRTEL ); 
			       $(".int_EQUITEL").val( data.details.instructions.EQUITEL ); 
			       
			    break;
			    
			    case "ipaympesaSendCode":
			        onsenAlert( data.msg );
			        $(".frm-ipay_initiator").hide();
			        $(".frm-ipay_mpesa").show();
			    break;
			    
			    case "payMollie":
			       setHome();
			       if(!isDebug()){			    		
			    		var iab = cordova.InAppBrowser;
			    		iab.open( data.details  , '_system');  
			    	} else {
			    	    window.open(data.details);
			    	}
			    break;
			    
			    case "getDixiCards":
			       var crd_html='';
			       $.each( data.details.cards, function( card_key, card_val ) {
			       	   dump(card_val);
			       	   
			       	    crd_html+='<ons-list-item modifier="tappable" >';
					       crd_html+='<ons-row class="row">';
					         crd_html+='<ons-col width="10%">';
						       crd_html+='<label class="radio-button" >';
								  crd_html+='<input type="radio" name="selected_cards" value="'+card_val.id+'" class="selected_cards">';
								  crd_html+='<div class="radio-button__checkmark"></div>';
								crd_html+='</label>';
							  crd_html+='</ons-col>';
							  
							  crd_html+='<ons-col>';
							    crd_html+= '<span class="small-font-dim-smaller">'+card_val.card_number+'</span>';
							  crd_html+='</ons-col>';
							  
						    crd_html+='</<ons-row>';
						crd_html+='</ons-list-item>'; 
			       	   
			       });			       			       
			       createElement('dixicards_list',crd_html);
			    break;
			    
			    case "useThisLocation":
			       var page = sNavigator.getCurrentPage();
	               map_address_action = page.options.map_address_action;
	               dump("map_address_action : "+ map_address_action);
	               
	               var location_res = data.details.result;
	               dump(location_res);
	               
	               removeStorage("geo_address_result_formatted_address");
	               
	               switch(map_address_action){
	               	 case "mapaddress":
	               	 
	               	 $(".street").val( location_res.address );
					 $(".city").val( location_res.city );
					 $(".state").val( location_res.state );
					 $(".zipcode").val( location_res.zip );	
					
					 $(".google_lat").val( data.details.lat );	
					 $(".google_lng").val( data.details.lng  );	
					 $(".formatted_address").val( location_res.formatted_address );	
					
					 $(".delivery-address-text").html( location_res.formatted_address );  
	               	 
					 sNavigator.popPage({cancelIfRunning: true}); //back button
		             sNavigator.popPage({cancelIfRunning: true}); //back button    
	               	 break;
	               	  
	               	 case "changeaddress":
	               	 	               	    
	               	    $(".google_formatted_address").html( location_res.formatted_address );
		                setStorage("search_address", location_res.formatted_address );	
		                	
		                setStorage("geo_address_result_formatted_address", location_res.formatted_address );
		                setStorage("geo_address_result_address", location_res.address );
		                setStorage("geo_address_result_city", location_res.city );
		                setStorage("geo_address_result_state", location_res.state );
		                setStorage("geo_address_result_zip", location_res.zip );	               
		                
		                var cart_params=JSON.stringify(cart);       			     
					    if (saveCartToDb()){
					       var cart_params='';
					    }
					    						
					    callAjax("loadCart","merchant_id="+ getStorage('merchant_id')+"&search_address=" + 
					    encodeURIComponent( getStorage("search_address") ) + "&cart="+cart_params +"&transaction_type=" +
					    getStorage("transaction_type") + "&device_id="+ getStorage("device_id") );
					   
					    sNavigator.popPage({cancelIfRunning: true}); //back button
					    sNavigator.popPage({cancelIfRunning: true}); //back button		
					                    
		                
	               	 break;
	               	 
	               	 default:
	               	  sNavigator.popPage({cancelIfRunning: true}); //back button
	               	 break;
	               }			
			    break;
			    
			    case "getReceipt":
			      html='';			      
			      html+='<ons-list>';
			      $.each( data.details.info, function( key, val ) {     
			      	 dump(val);
			      	 html+=wingRow( '', val.label, val.value );
			      });
			      html+='</ons-list>';
			      
			      html +='<br/>';	
			      html += data.details.html;
			      createElement('receipt_wrap', html);
			    break;
			    
			    case "requestCancelOrder":
			      menu.setMainPage('orders.html', {closeMenu: true});
			    break;
			    
			    case "loadOptionList":
			      displayOptionsList(data.details);
			    break;
			    
			    case "saveAddressBookLocation":
			    case "deleteAddressBookLocation":
				   menu.setMainPage('addressBook.html', {closeMenu: true});
				 break;
				 
				case "getPostCodeAddressBookDetails":
				    $(".id").val( data.details.data.id );
				    $(".street").val( data.details.data.street );
				    $(".location_name").val( data.details.data.location_name );
				    $(".state_id").val( data.details.data.state_id );
				    $(".city_id").val( data.details.data.city_id );
				    $(".area_id").val( data.details.data.area_id );				    
				    if (data.details.data.as_default==2){
						$(".as_default").attr("checked","checked");
					} else $(".as_default").removeAttr("checked");
					
					$(".location_state").html( data.details.data.state_name );
					$(".location_city").html( data.details.data.city_name );
					$(".location_area").html( data.details.data.area_name );
					
				 break;
				 
				case "getAddressBookLocation":
				   var htm='';
					htm+='<ons-list>';
					$.each( data.details, function( key, val ) {
						htm+='<ons-list-item modifier="tappable" onclick="setAddressLocation(' + "'" + val.id + "'" + ');" >';
						   htm+= '<span class="small-font-dim">'+val.address+'</span>';
						htm+='</ons-list-item>';
					});
					htm+='</ons-list>';	
					createElement('options_list',htm);
				break;
				
				case "setAddressLocation":
				   $(".state_id").val( data.details.data.state_id );
				   $(".city_id").val( data.details.data.city_id );
				   $(".area_id").val( data.details.data.area_id );
				   
				   $(".city").val( data.details.data.city_name );
				   $(".state").val( data.details.data.state_name );
				   $(".zipcode").val( data.details.data.postal_code );
				   $(".area_name").val( data.details.data.area_name );
				   
				   $(".location_state").html( data.details.data.state_name );
				   $(".location_city").html( data.details.data.city_name );
				   $(".location_area").html( data.details.data.area_name );
				   
				   $(".street").val( data.details.data.street );
				   $(".location_name").val( data.details.data.location_name );
				   
				   popup_address_location.hide();	
				break;
				
				case "saveSettings":
				   toastMsg(data.msg);	
				   dump( "enabled_push-> "+data.details.enabled_push );
				   if (data.details.enabled_push==2){				   	   			
				   	   pushUnregister();				   	   
				   } else {
				   	   checkDeviceRegister();
				   }			
				   
				break;
				
				case "reRegisterDevice":
				  onsenAlert(data.msg);	
				  removeStorage("push_unregister");
				break;
				
				case "getNotificationList":
				   clearNotificationCount();
				   displayNotification(data.details);
				break;
				
				 				 
				default:
				//onsenAlert("Sorry but something went wrong during processing your request");
				  onsenAlert(data.msg);	
				  break;				
			}
			
			/* end ok conditions*/
		} else {
			/*failed condition*/
			
			dump('failed condition');
			switch(action)
			{					
									
				case "getNotificationList":		
				  clearNotificationCount();	
				  toastMsg(data.msg);
				break;
				
				case "getPostCodeAddressBookDetails":
				  toastMsg(data.msg);
				  menu.setMainPage('addressBook.html', {closeMenu: true});
				break;
				
				case "getLocationCity":
				  toastMsg(data.msg);
				  createElement('location-city-list','');
				break;
				
				case "loadOptionList":
				case "getAddressBookLocation":
				  $(".options_list").html('');
				  toastMsg(data.msg);
			    break;
			    
				case "getReceipt":
				$(".receipt_wrap").html('');
				  toastMsg(data.msg);
			    break;
			    
/* Atualização Master Hub (Sugestões de Estabelecimentos) */
				case "Suggestion":
				$("#mensagem_nao").hide();	
				sugestoes_Campo(data.details);
				toastMsg(data.msg);
				break;		
/* Fim da atualização */
				case "loadPhotos":		
				   toastMsg(data.msg);
				break;
				
				case "merchantReviews":
				  toastMsg(data.msg);
				  createElement('review-list-scroller','');
				break;
				
					
				case "search":
				  //$(".result-msg").text("No Restaurant found");
				  $(".result-msg").text(data.msg);				  
				  toastMsg(data.msg);
				  createElement('restaurant-results','');
				  break;
								
				case "getItemByCategory":				
				  onsenAlert(data.msg);	
				  displayMerchantInfo(data.details);			
				  //sNavigator.popPage({cancelIfRunning: true});	back button
				  break;
				
				case "loadCart":				
				  displayMerchantLogo(data.details,'page-cart');
				  //onsenAlert(data.msg);
				  toastMsg(data.msg);
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#page-cart .estabelecimento-header2").attr("style",'background-image: url('+getStorage("merchant_logo")+'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#page-cart .estabelecimento-header").attr("style",'background-image: url('+getStorage("merchant_logo")+'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
				  
				  $("#page-cart .wrapper").hide();				
				  $("#page-cart .frm-cart").hide();	
				  $(".checkout-footer").hide();
				  showCartNosOrder();
				  break;
				
				case "getPaymentOptions":
				  if ( data.details==3){
				  	  toastMsg(data.msg);				  	  
				  	  //resetLocation();
				  	  sNavigator.popPage({cancelIfRunning: true});
				  } else {
					  $(".frm-paymentoption").hide();
					  toastMsg(data.msg);
				  }
				  break;
				
				case "browseRestaurant":
				   toastMsg(data.msg);
				  /*$(".result-msg").text(data.msg);
			      createElement('browse-results','<div></div>');*/
			      break;   
				
			    case "getProfile":  
			      dump('show login form')
			      menu.setMainPage('prelogin.html', {closeMenu: true});
			      break;   
			      
			    case "getAddressBook":  		
			      //onsenAlert(data.msg);
			      createElement('address-book-list', '');
			      if (data.code==3){
			      	 menu.setMainPage('prelogin.html', {closeMenu: true});
			      }			      
			      break;   
			      
			    case "getOrderHistory":  
			       if (data.code==3){
			           menu.setMainPage('prelogin.html', {closeMenu: true}); 
			       } else {
			       	   toastMsg(data.msg);
			       }
			       break;   
			      			    
			    case "registerMobile":  			    
			    //case "getLanguageSettings":  
			      /*silent */
			      break;   
			      
			    case "getLanguageSettings":   
			      toastMsg(data.msg);
			      break;   
			      

			    case "getSettings":      
			       var device_id=getStorage("device_id");
			       $(".device_id_val").html( device_id );
			    break;   
			       
			    
			    /*silent*/
			    case "addToCart":
			    case "getCustomFields":
			    break;
			    			    
			    case "saveContactNumber":
			    case "coordinatesToAddress":
			    case "trackOrderMap":			    
			       toastMsg(data.msg);
			    break;
			    
			    case "getMerchantCClist":
			       toastMsg(data.msg);
			       $("#cc-list").html('');
			    break;
			    
			    //case "trackOrderHistory":		
			    case "loadCC":	        
			      sNavigator.popPage({cancelIfRunning: true}); //back button			      
			    break;
			    
			    case "trackOrderHistory":		
			       toastMsg(data.msg);
			       $(".track_driver").hide();
			    break;
			    			    
			    case "ipayInitiatorRequest":
			      toastMsg(data.msg);
			      sNavigator.popPage({cancelIfRunning: true}); //back button
			    break;
			    
				default:
				  //onsenAlert(data.msg);	
				  toastMsg(data.msg);
				  break;
			}			
		}
				
	},
	error: function (request,error) {	        
		hideAllModal();		
		//if ( action=="getLanguageSettings" || action=="registerMobile"){
		if ( action=="registerMobile"){
		} else {			
			//onsenAlert( getTrans("Network error has occurred please try again!",'network_error') );		
			toastMsg( getTrans("Network error has occurred please try again!",'network_error') );		
		}	
	}
   });       	
   
   ajax_request.always(function() {
       dump( "second complete" );
       ajax_request=null;  
       clearTimeout(timer);
   });
}

function setHome()
{
	dump("setHome");
	var options = {     	  		  
	  	  closeMenu:true,
	      animation: 'slide',
	      callback:setHomeCallback
	   };	   	   	   
	 menu.setMainPage('home.html',options);
}

function setHomeCallback()
{	
	refreshConnection();
}

function displayRestaurantResults(data , target_id)
{	
/*Atualização Master Hub (Empresas abertas e fechadas)*/
	//dump(data);	
	var htm='';	
	
	var abertas = new Array();
	var fechadas = new Array();

	for(var i=0; i<data.length; i++) {
		if (data[i].is_open == 'Fechado')
			fechadas.push(data[i]);
		else
			abertas.push(data[i]);
	}
	data = abertas.concat(fechadas);
/*Fim da atualização*/
/*Atualização Master Hub (Personalização da tela de busca de Empresas)*/
    $.each( data, function( key, val ) {     
    	
    	// dump(val);
    	 htm+='<ons-list-item modifier="tappable" class="list-item-container '+val.tag_raw+'" onclick="loadRestaurantCategory('+val.merchant_id+');" >';
    	 htm+='<ons-row class="row">';    	 
    	     htm+='<ons-col class="col-image border" width="30%">';
    	          htm+='<div class="logo-wrap2" >';
    	            htm+='<div class="img_loaded" style="border-radius: 40px; overflow:hidden;">';
    	             htm+='<img src="'+val.logo+'" />';
    	            htm+='</div>';
    	            
    	          htm+='</div>';
			
    	          //htm+='<p class="center">'+val.payment_options.cod+'</p>';
    	         /* if(!empty(val.payment_available)){ 
    	          	 if(val.payment_available.length>0){
    	          	 	$.each( val.payment_available, function( key_pv, val_pv ) { 
    	          	 		 htm+='<p class="center">'+val_pv+'</p>';
    	          	 	});	
    	          	 }
    	          }*/
    	          
    	          
    	     htm+='<div align="center"><span class="notification '+val.tag_raw+'">'+val.is_open+'</span></div>';
    	     htm+='</ons-col>';
    	     
    	     htm+='<ons-col class="col-description border" width="70%">';
    	           htm+='<div>';
	    	           htm+='<div><span class="rating-stars " data-score="'+val.ratings.ratings+'">';
					   htm+='</span>';
					   htm+='<span class="p-small" style="margin-left: 40px; position: absolute;">';
			// Dinheiro
						if(!empty(val.tag_dinheiro)){
		  				htm+='<i class="green-color '+val.tag_dinheiro+'" style="font-size: 23px;"></i>   ';
			};
			//Fim Dinheiro
			// Cartão
						if(!empty(val.tag_cartao)){
		  				htm+='  <i class="green-color '+val.tag_cartao+'" style="font-size: 23px;"></i>';
			};
			//Fim Cartão
					   htm+='</span></div>';
	    	           htm+='<p class="restauran-title concat-text">'+val.restaurant_name+'</p>';
	    	           //htm+='<p class="concat-textx">'+val.cuisine+'</p>';
	    	           
					   dump(val.service);
    	          
    	          /* if(!empty(val.services)){
    	          	  $.each( val.services, function( key_service, val_services ) { 
    	           	   	  htm+='<class="center" style="font-size: 12px; color: #fff;"><i class="green-color ion-android-checkmark-circle"></i> '+val_services+'   ';
    	           	   });
    	          }*/
					  					  /*Estimativa de entrega*/
	    	           //if(val.service!=3){
	    	           if(val.service==1 || val.service==2 || val.service==4 || val.service==5 ){
	    	           	   if(!empty(val.delivery_estimation)){
	    	       htm+='<span class="p-small trn"><i class="green-color ion-android-time" style="font-size: 15px;"></i> <b style="font-size: 14px;">'+val.delivery_estimation+'</b></span>';	
	    	           	   }
	    	           }
	    	         /*  if ( val.offers.length>0){
	    	           	   $.each( val.offers, function( key_offer, val_offer ) { 
	    	           	   	  htm+='<p class="top10">'+val_offer+'</p>';
	    	           	   });
	    	           } */
	    	           if (val.is_sponsored==2){
	    	           	  htm+='<span class="notification sponsored">'+ getTrans("Sponsored",'sponsored') +'</span>';
	    	           } 
    	           htm+='</div>';
    	           
    	              htm+='<ons-col width="90%">';
			// Cupom
						//if(!empty(val.tag_cupom)){
		  				//htm+='<span class="p-small trn"><i class="green-color ion-social-usd"></i> '+val.tag_cupom+'</span><br> ';
			//};
			//Fim Cupom
					   /*Fim Estimativa de entrega*/
					   /*Taxa de entrega*/
    	                 //if(val.service!=3){
    	                 if(val.service==1 || val.service==2 || val.service==4 || val.service==5 ){
    	                   htm+='<span class="p-small trn"><i class="fa green-color fa-motorcycle" style="font-size: 15px;"></i> ';
	
    	                   if(!empty(val.delivery_fee)){
							   
							   if (val.delivery_fee=='R$ 0,00'){
							  	fee_pretty = "Entrega Grátis";
 								}else{
 								fee_pretty = val.delivery_fee;
 								}
							   
    	                      htm+='<price>'+fee_pretty+'</price></span>';
    	                   }
    	                 }
    	                 
		
    	             /*Fim Taxa de entrega*/
					 /*Pedido minímo*/
    	              
					   	  if (!empty(val.minimum_order)){  
						  htm+='     <i class="fa green-color fa-money aria-hidden="true"" style="font-size: 15px;"></i>  <span class="p-small trn" data-trn-key="min_order">Min. Order</span>';
    	                  htm+='<price> '+val.minimum_order+'</price>';
						  }
								  if (!empty(val.distance)){ 
						  //htm+='<div>;	  
						  htm+='<br><i class="fa green-color fa-location-arrow aria-hidden="true"" style="font-size: 15px;"> </i>';
    	                  htm+='<span class="p-small">  '+val.distance+'</span>';
						  //htm+='</div>;	  
						  }
						  htm+='<ons-col width="90%"">';
	    	           if ( val.offers.length>0){
	    	           	   $.each( val.offers, function( key_offer, val_offer ) { 
	    	           	   	  htm+='<p class="center"><i class="fa fa-tags" aria-hidden="true"></i> '+val_offer+'</p>';
	    	           	   });
	    	           }
    	              htm+='</ons-col>';
					  /*Fim Pedido minímo*/
    	              htm+='</ons-col>'; 
    	           
    	     htm+='</ons-col>';
    	     
    	 htm+='</ons-row>';
    	 htm+='</ons-list-item>';
    });
/*Fim da atualização*/
      
    createElement(target_id,htm);
        
    initRating();  
    
    imageLoaded('.img_loaded');
}

function initRating()
{
	$('.rating-stars').raty({ 
		readOnly: true, 
		score: function() {
             return $(this).attr('data-score');
       },
		path: 'lib/raty/images'
    });
    translatePage();
}

function loadRestaurantCategory(mtid)
{		  	
  cart = [] ; /*clear cart variable*/
  removeStorage("tips_percentage");  
  removeStorage("cc_id");  
  removeStorage("category_count");  
  removeStorage("item_count");  
  
  setStorage("merchant_id",mtid);
    
  /*var options = {
      animation: 'slide',
      onTransitionEnd: function() { 
      	  callAjax("MenuCategory","merchant_id="+mtid + "&device_id=" + getStorage("device_id")  );	
      } 
   };
   sNavigator.pushPage("menucategory.html", options);
   */ 
    
  callAjax("getCategoryCount","mtid="+ mtid + "&device_id="+getStorage("device_id") );
}

function cuisineResults(data)
{		
	var htm='';
	htm+='<ons-list>';
	htm+='<ons-list-header class="list-header trn" data-trn-key="services">Services</ons-list-header>';
	
	if (!empty(data.services)){
		$.each( data.services, function( key, val ) {			
			/*htm+='<ons-list-item modifier="tappable">';
			 htm+='<label class="checkbox checkbox--list-item">';
				htm+='<input type="checkbox" name="delivery_type" class="delivery_type" value="'+key+'" >';
				htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
				htm+=' <span>'+val+'</span>';
			  htm+='</label>';
			htm+='</ons-list-item>';*/
			
   htm+='<ons-list-item modifier="tappable">';
    htm+='<ons-row class="row">';
     htm+='<ons-col class="concat-text" width="10%">';
       htm+='<label class="radio-button checkbox--list-item">';
	     htm+='<input type="radio" name="delivery_type" class="delivery_type" value="'+key+'" >';
	     htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';	     
	   htm+='</label>';
	  htm+='</ons-col>';	
	  htm+='<ons-col class="text-left" >'+val+'</ons-col>';
    htm+='</ons-row>';
    htm+='</ons-list-item>';
    
		});
	}	
	
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
	createElement('filter-options-list',htm);	
	
	$(".restaurant_name").attr("placeholder",  getTrans("Enter Restaurant name",'enter_resto_name') );
	
	translatePage();
}

function menuCategoryResult(data)
{
	$("#menucategory-page .restauran-title").text(data.restaurant_name);
	$("#menucategory-page .rating-stars").attr("data-score",data.ratings.ratings);
	initRating();
	$("#menucategory-page .logo-wrap").html('<img src="'+data.logo+'" />')
	
	if ( data.open){
		$("#merchant_open").val(2);
	} else $("#merchant_open").val(1);
		
	if (data.merchant_close_store){
		$("#close_store").val(2);
	} else $("#close_store").val(1);
	
	if (data.has_menu_category==2){
		var htm='';
		htm+='<ons-list>';
		$.each( data.menu_category, function( key, val ) { 			  
             htm+='<ons-list-item modifier="tappable" class="row" onclick="loadmenu('+
             val.cat_id+','+val.merchant_id+');">'+val.category_name+'</ons-list-item>';
		});	
		htm+='</ons-list>';
		createElement('category-list',htm);	
	} else {
		toastMsg(  getTrans("This restaurant has not published their menu yet.",'this_restaurant_no_menu') );
	}	
}
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
function loadmenu(cat_id,mtid)
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
}

function displayMerchantInfo(data)
{
	if (!empty(data)){
		$("#page-menubycategoryitem #search-text").html(data.category_info.category_name);
		$("#page-menubycategoryitem .restauran-title").text(data.merchant_info.restaurant_name);
		$("#page-menubycategoryitem .rating-stars").attr("data-score",data.merchant_info.ratings.ratings);
		initRating();
		$("#page-menubycategoryitem .logo-wrap").html('<img src="'+data.merchant_info.logo+'" />')			
	}
}

function displayMerchantLogo(data,page_id)
{
	if(!empty(data.merchant_info)){
		$("#"+ page_id +" .logo-wrap").html('<img src="'+data.merchant_info.logo+'" />')		
	}
	if (!empty(data.cart_total)){
		$("#"+ page_id +" .total-amount").html(data.cart_total);
	}
}
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
function displayMerchantLogo2(logo,total,entrega,page_id)
{
	if(!empty(logo)){
	    $("#"+ page_id +" .logo-wrap").html('<img src="'+logo+'" />')		
	}
	if (!empty(total)){
		$("#"+ page_id +" .total-amount").html(total);
	}
	if (!empty(entrega)){
		$("#"+ page_id +" .total-entrega").html('Taxa de Entrega '+entrega);
/*Fim da atualização*/
	}
	
	var merchant_name=getStorage("merchant_name");	
	if (!empty(merchant_name)){
		$("#"+ page_id +" .restauran-title").html(merchant_name);
	}
}

function displayItemByCategory(data , index)
{			
	
	/*dump( "mobile_menu=>"+data.mobile_menu );	
	$("#page-menubycategoryitem #search-text").html(data.category_info.category_name);
	$("#page-menubycategoryitem .restauran-title").text(data.merchant_info.restaurant_name);
	$("#page-menubycategoryitem .rating-stars").attr("data-score",data.merchant_info.ratings.ratings);
	initRating();
	$("#page-menubycategoryitem .logo-wrap").html('<img src="'+data.merchant_info.logo+'" />');*/
	
	    
	var actions = '';
	
	var html='';
	html+='<ons-list>';	 
	//html+='<ons-list class="restaurant-list">';
	$.each( data.item, function( key, val ) { 		 

		html+= '<ons-list-item>';	
		
		 if (data.disabled_ordering==2){
		 //html+='<ons-list-item modifier="tappable" class="list-item-container" onclick="itemNotAvailable(2)" >';		
		   actions = "itemNotAvailable(2)";
		 } else {
			 if (val.not_available==2){
			     //html+='<ons-list-item modifier="tappable" class="list-item-container" onclick="itemNotAvailable(1)" >';	
			     actions = "itemNotAvailable(1)";
			 } else {
			 	  var single_add_item=getStorage("single_add_item");
			 	  dump("=>"+single_add_item);
			 	  if (val.single_item==2 && single_add_item==2){
			 	  	  item_auto_price="0|";
			 	  	  item_auto_discount="0";
			 	  	  if ( val.prices.length>0){
			 	  	  	  $.each( val.prices, function( key_price, price ) { 
			 	  	  	  	   if (!empty(price.price_discount_pretty)){
			 	  	  	  	   	   //item_auto_price = "'"+price.price+"|'";
			 	  	  	  	   	   item_auto_price = price.price+"|";
			 	  	  	  	   	   item_auto_discount=parseInt(price.price)-parseInt(price.price_discount)
			 	  	  	  	   } else {
			 	  	  	  	   	   //item_auto_price=  "'"+price.price+"|'";
			 	  	  	  	   	   item_auto_price =  price.price+"|";
			 	  	  	  	   }
			 	  	  	  });
			 	  	  }
			 	  	  			 	  	  			 	  	 
/*html+='<ons-list-item modifier="tappable" class="list-item-container"';
html+='onclick="autoAddToCart('+ "'"+val.item_id+"'," +  "'"+item_auto_price+"'," + "'"+item_auto_discount+"'"  +');"  >';*/
			 	  	   
                     actions = '"autoAddToCart('+ "'"+val.item_id+"'," +  "'"+item_auto_price+"'," + "'"+item_auto_discount+"'," + "'"+data.cat_id+"'"  +');"';
			 	  } else {
			          /*html+='<ons-list-item modifier="tappable" class="list-item-container" onclick="loadItemDetails('+val.item_id+','+data.merchant_info.merchant_id+','+data.category_info.cat_id+');"  >';*/			         
			          
actions='"loadItemDetails('+ "'"+val.item_id+"'," +  "'"+data.merchant_id+"'," + "'"+data.cat_id+"'"  +');"';
			 	  }
			 }
		 }
		 
         html+='<ons-row class="row" onclick='+actions+' >';
         
         /*DISH ICON*/
         var dish_icon_html = '';
     	 if(!empty(val.icon_dish)){         	 	
     	    $.each( val.icon_dish, function( dish_id, dish_icon_url ) {
     	    	dish_icon_html += '<img src="'+ dish_icon_url +'" />';
     	    });
     	 }
         
         if ( data.mobile_menu==1){
         	
         	html+='<ons-col class="col-image" width="65%">';
                html+='<p class="restauran-title concat-text">'+val.item_name+'</p>';
                html+='<p class="small-font-dim small nomargin">'+val.item_description+'</p>';  
                
                if(!empty(dish_icon_html)){
                   html+= '<div class="dish_icon_wrap">'+dish_icon_html+'</div>';   
                }
                 
             html+='</ons-col>';
         	
             html+='<ons-col class="col-image text-right" width="35%">';
              if ( val.prices.length>0){
	                $.each( val.prices, function( key_price, price ) { 
	                   if (!empty(price.price_discount_pretty)){
	                   	   html+='<p class="p-small">'+price.size+' <price class="discount">'+price.price_pretty+'</price>'; 
	                   	   html+='<price>'+price.price_discount_pretty+'</price>';
	                   	   html+='</p>';
	                   } else {
	                   	   html+='<p class="p-small">'+price.size+' <price>'+price.price_pretty+'</price></p>';
	                   }                   
	                });
                }
             html+='</ons-col>';
             
         } else {
/*Atualização Master Hub (Mostra logo da empresa quando não há logo do produto.)*/
		var upload_url = krms_config.UploadUrl;
		dump("upload_url=>"+upload_url); 
         	
         	if (val.photo!=""){
             html+='<ons-col class="col-image" width="29%">';
                html+='<div class="logo-wrap3" >';
                  html+='<div class="img_loaded" >';
                  html+='<img src="'+val.photo+'" />';
                  html+='</div>';
                html+='</div>';
             html+='</ons-col>';
			} else {
             html+='<ons-col class="col-image" width="29%">';
                html+='<div class="logo-wrap3" >';
                  html+='<div class="img_loaded" >';
                  html+='<img src="'+upload_url+''+val.logotipo+'" />';
                  html+='</div>';
                html+='</div>';
             html+='</ons-col>';
             }
                html+='<ons-col class="col-description" width="65%" style="border-bottom: 0px solid #333; margin-left: 12px;">';
                html+='<p class="restauran-title concat-text" style="margin-top: 5px;">'+val.item_name+'</p>';
                html+='<p class="" style="margin-top: 5px; font-size: 13px; margin-bottom: 15px;">'+val.item_description+'</p>';   
                                     
                if ( val.prices.length>0){
	                $.each( val.prices, function( key_price, price ) { 
	                   if (!empty(price.price_discount_pretty)){
	                   	   html+='<p class="p-small">'+price.size+' <price class="discount">'+price.price_pretty+'</price>'; 
	                   	   html+='<price>'+price.price_discount_pretty+'</price>';
	                   	   html+='</p>';
	                   } else {
	                   	   html+='<p class="p-small">'+price.size+' <price>'+price.price_pretty+'</price></p>';
	                   }                   
	                });
                }
                                
                if (val.not_available==2){
                	html+='<p style="background: #d32f2f;color: white;text-align: center;width: 128px;height: 17px;padding-top: 2px;border-radius: 20px;">'+  getTrans("item not available",'item_not_available')  +'</p>';
/*Fim da atualização*/
                }
                
                if(!empty(dish_icon_html)){
                   html+= '<div class="dish_icon_wrap">'+dish_icon_html+'</div>';   
                }
                
             html+='</ons-col>';
         }                 
           
         html+='</ons-row>';
        html+='</ons-list-item>';
    });			
    html+='</ons-list>';    
    
    //createElement('menu-list',html);
    createElement( 'item-results-'+ index , html);
    
    imageLoaded('.img_loaded');
}

function empty(data)
{
	//if (typeof data === "undefined" || data==null || data=="" ) { 
	if (typeof data === "undefined" || data==null || data=="" || data=="null" || data=="undefined" ) {	
		return true;
	}
	return false;
}

function loadItemDetails(item_id,mtid,cat_id)
{		
		
    if ( $("#close_store").val()==2 || $("#merchant_open").val()==1 ){
		onsenAlert( getTrans("This Restaurant Is Closed Now.  Please Check The Opening Times",'restaurant_close') );
		return;
	}
	
	var options = {
      animation: 'slide',
      onTransitionEnd: function() { 
      	  callAjax("getItemDetails","item_id="+item_id+"&merchant_id="+mtid+"&cat_id="+cat_id);
      } 
   };   
   sNavigator.pushPage("itemDisplay.html", options);
}

function displayItem(data)
{		
	$("#page-itemdisplay .item-header").css({
		'background-image':'url('+data.photo+')'
	});
	
	$("#page-itemdisplay .title").html(data.item_name);
	$("#page-itemdisplay .description").html(data.item_description);	
	
	
	if (!empty(data.category_info)){
		$("#page-itemdisplay #search-text").text(data.category_info.category_name);
	}
	
	var htm='';
	
	htm+='<input type="hidden" name="item_id" class="item_id" value="'+data.item_id+'">';	
	htm+='<input type="hidden" name="category_id" class="category_id" value="'+data.category_info.cat_id+'">';	//cart category
	htm+='<input type="hidden" name="currency_symbol" class="currency_symbol" value="'+data.currency_symbol+'">';	
	htm+='<input type="hidden" name="discount" class="discount discount_amt" value="'+data.discount+'">';	
	
	htm+='<input type="hidden" name="two_flavors" class="two_flavors" value="'+data.two_flavors+'">';	
	
	if (data.two_flavors==2){
		data.has_price=1;
	}
	
	if ( data.has_price==2){	
		htm+='<ons-list-header class="list-header trn" data-trn-key="price">Price</ons-list-header>';
		var x=0
		$.each( data.prices, function( key, val ) { 				
			if (data.discount>0){
				var discount_price='<price class="discount">'+val.pretty_price;				
				discount_price+='</price>';
				discount_price+='<price>'+val.discounted_price_pretty+'</price>';
				if (x==0){	
					htm+=privatePriceRowWithRadio2('price',
					val.price+'|'+val.size ,
					val.size,
					discount_price,
					'checked="checked"');
				} else {
					htm+=privatePriceRowWithRadio2('price',
					val.price+'|'+val.size,
					val.size,
					discount_price);
				}	
			} else {			
				if (x==0){				
					htm+=privatePriceRowWithRadio('price',
					val.price+'|'+val.size ,
					val.size,
					val.pretty_price,
					'checked="checked"');
				} else {
					htm+=privatePriceRowWithRadio('price',
					val.price+'|'+val.size,
					val.size,
					val.pretty_price);
				}		
			}	
			x++;
		});	
	}
	
	if (!empty(data.cooking_ref)){
		htm+='<ons-list-header class="list-header trn" data-trn-key="cooking_ref">Cooking Preference</ons-list-header>';
		$.each( data.cooking_ref, function( key, val ) { 
			htm+=privateRowWithRadio('cooking_ref',val,val);	
		});		
	}
	
	if (!empty(data.ingredients)){
		htm+='<ons-list-header class="list-header trn" data-trn-key="ingredients">Ingredients</ons-list-header>';
		$.each( data.ingredients, function( key, val ) { 
			htm+=privateRowWithCheckbox('ingredients','ingredients',val,val);	
		});		
	}
	
	var show_addon_description=getStorage("show_addon_description");	
	
	if (!empty(data.addon_item)){
		$.each( data.addon_item, function( key, val ) { 
			htm+='<ons-list-header class="list-header require_addon_'+val.subcat_id+' ">'+val.subcat_name+'</ons-list-header>';
			
			htm+='<input type="hidden" name="require_addon_'+val.subcat_id+'" class="require_addon" value="'+val.require_addons+'" data-id="'+val.subcat_id+'" data-name="'+val.subcat_name+'" >'
			
			if (!empty(val.sub_item)){
				$.each( val.sub_item, function( key2, val2 ) { 				
					  if (val.multi_option == "custom"){					  	 
	                     htm+=subItemRowWithCheckbox(
	                                 val.subcat_id,
	                                 'sub_item', 
	                                 val2.sub_item_id+"|"+val2.price +"|"+val2.sub_item_name,
	                                 val2.sub_item_name,
/*Atualização Master Hub (Correção de valor zerado)*/
	                                 val2.price>0?val2.pretty_price:'',
/*Fim da atualização*/
	                                 val.multi_option_val,
	                                 val2.item_description
	                                 );	
	                                 	                     
					  } else if ( val.multi_option == "multiple") { 
					  	 htm+=subItemRowWithCheckboxQty(
					  	             val.subcat_id,
					  	            'sub_item', 
	                                 val2.sub_item_id+"|"+val2.price +"|"+val2.sub_item_name,
	                                 val2.sub_item_name,
/*Atualização Master Hub (Correção de valor zerado)*/
	                                 val2.price>0?val2.pretty_price:'');	
/*Fim da atualização*/
	                     
	                     if(show_addon_description==1){
		                     if(!empty(val2.item_description)){
		                        htm+='<div class="addon_description small-font-dim">'+val2.item_description+'</div>'; 
		                     }
	                     }
	                     
					  } else {    
                          htm+=subItemRowWithRadio(
                                   val.subcat_id,
                                   "sub_item",
                                   //val2.sub_item_id+"|"+val2.price + "|"+val2.sub_item_name  , 
                                   val2.sub_item_id+"|"+val2.price + "|"+val2.sub_item_name + "|" + val.two_flavor_position  , 
                                   val2.sub_item_name,
/*Atualização Master Hub (Correção de valor zerado)*/
                                   val2.price>0?val2.pretty_price:'',
/*Fim da atualização*/
                                   false,
                                   val2.item_description
                                   );                                                           
					  }
				});	
			}
		});	
	}
	
	htm+=cartFooter(data.currency_code);
	
	createElement('item-info',htm);

	setCartValue()
	
	translatePage();
		
}

jQuery(document).ready(function() {	
	
	/*jquery onclick*/
	
	 // fix to autocomplete search address bar
	$(document).on({
	"DOMNodeInserted": function(e){
	console.log(e);
	$(".pac-item span",this).addClass("needsclick");
	}
	}, ".pac-container");
	
	$( document ).on( "click", ".price", function() {
		setCartValue();
	});
	$( document ).on( "change", ".qty", function() {
		setCartValue();
	});
	
	$( document ).on( "change", ".sub_item", function() {
		setCartValue();
	});
	
	$( document ).on( "change", ".subitem-qty", function() {
		setCartValue();
	});
	
	$( document ).on( "click", ".edit-order", function() {
		editOrderInit();
	});
		
	$( document ).on( "click", ".order-apply-changes", function() {
		applyCartChanges();
	});
		
	$( document ).on( "click", ".delete-item", function() {
		var id=$(this).data('id');
		var parent=$(this).parent().parent().parent();		
		parent.remove();
		$(".subitem-row"+id).remove();
	});
		
	$( document ).on( "click", ".sub_item_custom", function() {		
		 var this_obj=$(this);
		 var multi=$(this).data("multi");		 
		 if (empty(multi)){
		 	return;
		 }		 
		 var id=$(this).data("id");		 
		 var total_check=0;		 	
		 $('.sub_item_custom:checked').each(function(){ 
		 	if ( $(this).data("id") == id){
		 		total_check++;
		 	}
		 });		 
		 if (multi<total_check){
		 	onsenAlert( getTrans('Sorry but you can select only','sorry_but_you_can_select') + " "+multi+" "  +
		 	 getTrans('addon','addon') );
		 	this_obj.attr("checked",false);
		 	return;
		 }
	});
	
	$( document ).on( "click", ".transaction_type", function() {
		var transaction_type=$(this).val();		
		
		if(transaction_type=="pickup"){
			$(".delivery_asap_wrap").hide();
		} else {
			$(".delivery_asap_wrap").show();
		}
		
		setStorage('transaction_type',transaction_type);
		
		  var cart_params=JSON.stringify(cart);	
		  if (saveCartToDb()){	
		      cart_params='';
		  }
		    
		  var extra_params= "&delivery_date=" +  $(".delivery_date").val();  
		  if ( !empty($(".delivery_time").val()) ){
			  extra_params+="&delivery_time="+$(".delivery_time").val();
		   }
		  
      	  callAjax("loadCart","merchant_id="+ getStorage('merchant_id')+"&search_address=" + 
      	  encodeURIComponent(getStorage("search_address")) + "&cart="+cart_params +"&transaction_type=" +
      	  getStorage("transaction_type") + extra_params + "&device_id="+ getStorage("device_id") );
			
	});
	
	$( document ).on( "click", ".payment_list", function() {		
		//alert( $(this).val() );
		var transaction_type = getStorage("transaction_type");
		//alert( transaction_type );
		var paypal_card_fee=$(".paypal_card_fee").val();
		
		/*CHECK IF CHANGE IS REQUIRED*/
		if ( $(this).val() == "cod"){
			if ( $(".cod_change_required").val()==2 ){
			   if ( transaction_type =="delivery" ) {
			      $(".order_change").attr("data-validation","required");
			   }
/*Atualização Master Hub (Correção de Troco obrigatório)*/
			   $(".order_change").attr("data-validation-error-msg","Preencha o valor antes de continuar");
/*Fim da atualização*/
			} else {
				$(".order_change").removeAttr("data-validation");
			}
		} else {
			$(".order_change").removeAttr("data-validation");
		}
		
		switch( $(this).val() )
		{
			case "paypal":
			case "pyp":			  			  
			  if (paypal_card_fee>0){
				  var total_order_plus_fee=parseFloat(getStorage("order_total_raw")) + parseFloat(paypal_card_fee);
				  total_order_plus_fee= number_format(total_order_plus_fee,2);
				  $(".total-amount").html( getStorage("cart_currency_symbol")+" "+total_order_plus_fee);
			  }
			  
			  $(".order-change-wrapper").hide();
			  $(".payon-delivery-wrapper").hide();
			  break;
			 
			case "cod":
			if (paypal_card_fee>0){
				$(".total-amount").html( getStorage("order_total"));
			}
			if ( transaction_type =="delivery" || transaction_type =="pickup" || transaction_type =="dinein" ) {
				$(".order-change-wrapper").show();						
			}
			$(".payon-delivery-wrapper").hide();
			break;
			
			case "pyr":			
			if (paypal_card_fee>0){
				$(".total-amount").html( getStorage("order_total"));
			}
			$(".order-change-wrapper").hide();
			$(".payon-delivery-wrapper").show();
			break;
			
			case "ocr":
						
			var options = {
		      animation: 'slide',
		      onTransitionEnd: function() { 						      	  		      	  
		      	  var params="merchant_id=" +  getStorage("merchant_id") ;
		      	  params+="&client_token="+getStorage("client_token");
			      callAjax("getMerchantCClist",params);
			      translatePage();
		      } 
		    };   
		    sNavigator.pushPage("cclist.html", options);		 
			
			break;
						
			default:
			if (paypal_card_fee>0){
				$(".total-amount").html( getStorage("order_total"));
			}
			$(".order-change-wrapper").hide();
			$(".payon-delivery-wrapper").hide();
			break;
		}
	});
	
	$( document ).on( "click", ".logo-wrap img", function() {
		var page = sNavigator.getCurrentPage();	
		dump("pagename=>"+page.name);		
		if ( page.name=="merchantInfo.html"){			
			return;
		}
		
		var options = {
	      animation: 'none',
	      onTransitionEnd: function() { 	 	      	  
	      	  displayMerchantLogo2( 
		      	     getStorage("merchant_logo") ,
		      	     '' ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
		      	     '' ,
/*Fim da atualização*/
		      	     'page-merchantinfo'
		      );	  		      
		      callAjax("getMerchantInfo","merchant_id="+ getStorage('merchant_id'));  		      
	      } 
	    };     
		
		var found=false;
		var _pages = sNavigator.getPages();
		dump( _pages.length );
		if ( _pages.length>0){
			$.each( _pages, function( key, val ) { 	
				if (!empty(val)){
					dump(val.name);
					if ( val.name=="merchantInfo.html"){
						dump('found');
						found=true;
						//sNavigator.resetToPage("merchantInfo.html",options);			
						sNavigator.popPage();
					}
				}
			});	
		}
		
		if (found){
			dump('exit');
			return;
		}
						
	    sNavigator.pushPage("merchantInfo.html", options);						
	});
		
	$( document ).on( "click", ".setAddress", function() {		
		var address=$(this).data("address");		
		var address_split=address.split("|");
		dump(address_split);
		if ( address_split.length>0){
			$(".street").val( address_split[0] );
/*Atualização Master Hub (Catálogo de Endereços)*/
			$(".numero").val( address_split[1] );
			
			$(".bairro").html(address_split[2]);
			$(".area_name").val( address_split[2] );
			$(".area_id", "#frm-shipping").val(address_split[8]);
			$(".location_area", "#frm-shipping").html(address_split[2]);
			global_area_name = address_split[2];
			global_area_id = address_split[8];
			
			$(".cidade").html(address_split[3]);
			$(".city").val( address_split[3]);
			$(".city_id", "#frm-shipping").val(address_split[9]);
			$(".location_city", "#frm-shipping").html(address_split[3]);
			global_city_name = address_split[3];
			global_city_id = address_split[9];
			
			$(".state").val( address_split[4] );
			$(".state_id").val( address_split[10] );
			$(".location_state", "#frm-shipping").html(address_split[4]);
			global_state_name = address_split[4];
			global_state_id = address_split[10];
			
			$(".zipcode").val( address_split[5] );
			$(".location_name").val( address_split[6] );
			$(".delivery_instruction").val( address_split[11] );
			
			var number='';
			if (!empty(address_split[7])){
				number=address_split[7];								
				//number=number.replace("+","");				
			}
			
			$(".contact_phone").val( number );
			
			var complete_address = address_split[0];
			complete_address+=" "+ address_split[1];
			complete_address+=" "+ address_split[2];
			complete_address+=" "+ address_split[3];
			complete_address+=" "+ address_split[4];
			complete_address+=" "+ address_split[5];
/*Fim da atualização*/
			$(".delivery-address-text").html( complete_address ); 
			$(".google_lat").val( '' );	
			$(".google_lng").val( '' );	
			$(".formatted_address").val( '' );			
			
			dialogAddressBook.hide();
			
			sNavigator.popPage({cancelIfRunning: true}); //back button
			
		} else {
			onsenAlert(  getTrans("Error: cannot set address book",'cannot_set_address')  );
			dialogAddressBook.hide();
		}
	});
	
}); /*end ready*/

function setCartValue()
{	
	/*set the default total price based on selected price*/
	var selected_price=parseFloat($(".price:checked").val());
	var discount= parseFloat( $(".discount_amt").val() );	
	if (isNaN(discount)){
		discount=0;
	}
	
	if (isNaN(selected_price)){
		selected_price=0;
	}	
	
	dump("discount=>"+discount);
	dump("selected_price=>"+selected_price);
	var qty=parseFloat($(".qty").val());
	var total_value=qty* (selected_price-discount);    
	
	//adon	
	dump('addon totalx');	
	var addon_total=0;
	
	var addon_prices = [];
	
	$('#page-itemdisplay .sub_item:checkbox:checked').each(function(){        		
        var addo_price=explode("|",$(this).val());        
        if ( $(this).data("withqty")==2 ){
        	var p=$(this).parent().parent().parent();        	
        	var qtysub= parseFloat(p.find('.subitem-qty').val());
        	        	        
        	addon_total+=qtysub* parseFloat(addo_price[1]);
        	//addon_prices.push(addon_total);
        } else {        	
        	addon_total+=qty* parseFloat(addo_price[1]);
        	//addon_prices.push(addon_total);
        }        
    });
       
    $('#page-itemdisplay .sub_item:radio:checked').each(function(){        		
    	    	
        var addo_price=explode("|",$(this).val());       

        dump(addo_price);
        dump(addo_price[1]);
               
        addon_total+=qty * parseFloat(addo_price[1]);
        addon_prices.push( parseFloat(addo_price[1]) );
    });
        
    total_value+=addon_total;
    
    dump("total_value =>"+total_value);    
    if ( $(".two_flavors").val()==2 ){
    	dump("two_flavors");
    	dump(addon_prices);
    	total_value = Math.max.apply(Math,addon_prices); 
    	dump('get the highest value => ' + total_value );
    	total_value = parseInt($("#page-itemdisplay .qty").val()) * total_value;	
    }
    
    //$(".total_value").html(  $(".currency_symbol").val() +" "+ total_value);
    $(".total_value").html( prettyPrice(total_value)  );
}

function addCartQty(bolean)
{	
	var qty=parseInt($("#page-itemdisplay .qty").val());	
	if ( bolean==2){
		qty=qty+1;
	} else {
		qty=qty-1;
	}
	if ( qty>1){
	    $("#page-itemdisplay .qty").val(qty)
	} else {
		$("#page-itemdisplay .qty").val(1)
	}
	setCartValue();
}
	
function addToCart()
{		
	var proceed=true;
	/*check if sub item has required*/
	if ( $(".require_addon").exists()){
/*Atualização Master Hub (Personalização)*/
		$(".small-texto-verde").remove();	
		$('.require_addon').each(function () {
			if ( $(this).val()==2 ) {
				var required_addon_id=$(this).data("id");
	   	   	   	var required_addon_name=$(this).data("name");
	   	   	   	var required_addon_selected=$(".sub_item_name_"+required_addon_id+":checked").length; 
	   	   	   	if ( required_addon_selected <=0){
	   	   	   		proceed=false;
	   	   	   			   	   	  
	   	   	   		var err_msg= getTrans("You must select at least one addon","select_addon") +  " - "+ required_addon_name;
	   	   	   		   	   	   		
	   	   	   		$(".require_addon_"+required_addon_id).after( 
					"<span class=\"small-texto-verde\">"+err_msg 
/*Fim da atualização*/
					+'</span');
					onsenAlert(err_msg);
	   	   	   	}
			}
		});
	}

	dump("proceed=>"+proceed);
	if (!proceed){
		return;
	}	
	
	var sub_item=[];
	var cooking_ref=[];	
	var ingredients=[];
	var item_id='';
	var qty=0;
	var price=0;
	var order_notes='';
	var discount='';
	var category_id='';  //cart category
	//dump('add to cart');
	//var params = $( "#page-itemdisplay .frm-foodorder").serialize();
	var params = $( "#page-itemdisplay .frm-foodorder").serializeArray();	
	if (!empty(params)){
		$.each( params, function( key, val ) { 			
			/*item*/
			if (val.name=="item_id"){
				item_id=val.value;
			}			
			if (val.name=="qty"){
				qty=val.value;
			}
			if (val.name=="price"){
				price=val.value;
			}
			if (val.name=="category_id"){
				category_id=val.value;
			}
			/*sub item*/
			/*if ( val.name=="sub_item"){				
				sub_item[sub_item.length]={"value":val.value};
			}*/
			/*cooking_ref*/
			if ( val.name=="cooking_ref"){				
				cooking_ref[cooking_ref.length]={"value":val.value};
			}
			/*ingredients*/
			if ( val.name=="ingredients"){				
				ingredients[ingredients.length]={"value":val.value};
			}					
			if ( val.name=="order_notes"){				
				order_notes=val.value;
			}							
			if ( val.name=="discount"){				
				discount=val.value;
			}				
		});	
				
		/*get sub item */
		
		if ( $(".two_flavors").val()==2 ){			
			var sub_item_selected=$(".sub_item:checked").length; 			
			if ( sub_item_selected<2){
   	   	  	  onsenAlert(  getTrans("You must select price for left and right flavor",'two_flavor_required') ); 
   	   	      return;
   	   	   }   	   
   	   	   
   	   	   var xx=0; var addon_price_array=[];
   	   	   $.each( $(".sub_item:checked") , function( key, val ) { 	
				var parent=$(this).parent().parent().parent();		
				var sub_item_qty = parent.find(".subitem-qty").val()
				if (empty(sub_item_qty)){
					sub_item_qty="itemqty";
				}
				var subcat_id=$(this).data("id");	

				var addon_price=$(this).val();
				addon_price=addon_price.split("|");				
				
			
				if (!empty(addon_price[3])){
				   addon_price_array[xx]=addon_price[1];
				} else {
				   addon_price_array[xx]=0;
				}
							
				sub_item[sub_item.length] = {
					'subcat_id':subcat_id,
					'value':$(this).val(),
					'qty':sub_item_qty
				};
				
				xx++;
			});	
			
			dump(addon_price_array);			
			
			largest=0;
			
			two_flavor_option = getStorage("two_flavor_option");
			dump("two_flavor_option=>"+two_flavor_option);
			
			if(two_flavor_option==2){
				if($.isArray(addon_price_array)) {
					var two_flavor_sum = 0;
					$.each( addon_price_array , function( key_1, val_1 ) {							
						two_flavor_sum+= parseFloat(val_1);
					});
					
					dump("two_flavor_sum =>" +two_flavor_sum);
					if(two_flavor_sum>0){
					  largest = two_flavor_sum/2;
					}
				}
			} else {
			   largest = Math.max.apply(Math,addon_price_array);
			}
			
			dump("largest price => "+largest);
			price=largest;	
			   	   	   
		} else {
			$.each( $(".sub_item:checked") , function( key, val ) { 	
				var parent=$(this).parent().parent().parent();		
				var sub_item_qty = parent.find(".subitem-qty").val()
				if (empty(sub_item_qty)){
					sub_item_qty="itemqty";
				}
				var subcat_id=$(this).data("id");						
				sub_item[sub_item.length] = {
					'subcat_id':subcat_id,
					'value':$(this).val(),
					'qty':sub_item_qty
				};
			});	
		}
			
		cart[cart.length]={		  
		  "item_id":item_id,
		  "qty":qty,
		  "price":price,
		  "sub_item":sub_item,
		  "cooking_ref":cooking_ref,
		  "ingredients":ingredients,
		  'order_notes': order_notes,
		  'discount':discount,
		  'category_id':category_id  //cart category
		};
		
		var cart_value={		  
		  "item_id":item_id,
		  "qty":qty,
		  "price":price,
		  "sub_item":sub_item,
		  "cooking_ref":cooking_ref,
		  "ingredients":ingredients,
		  'order_notes': order_notes,
		  'discount':discount,
		  'category_id':category_id  //cart category
		};
		
		dump(cart);
				
		if( saveCartToDb() ){
		   callAjax("addToCart", "cart="+ JSON.stringify(cart_value) + "&device_id=" + getStorage("device_id") );
		   sNavigator.popPage({cancelIfRunning: true}); //back button
		} else {
			sNavigator.popPage({cancelIfRunning: true}); //back button
/*Atualização Master Hub (Remoção da mensagem de ítem adicionado e Correção da tela de exibição)*/
			//toastMsg(  getTrans("Item added to cart",'item_added_to_cart') );
			onsenDialogCheckout();
		}
/*Fim da atualização*/
		showCartNosOrder();
	}
}

function showCart()
{
	usethislocation_lat = '';
	usethislocation_lng = '';

	dump('showCart');
	var options = {
      animation: 'none',
   };     
   sNavigator.pushPage("cart.html", options);
}

function showCartNosOrder()
{
	dump('showCartNosOrder');
	dump(  cart.length );
	if ( cart.length>0 ){		
		//$(".cart-num").show();	    
		$(".cart-num").css({ "display":"inline-block","position":"absolute","margin-left":"-10px" });
		$(".cart-num").text(cart.length);
	} else {
		$(".cart-num").hide();
	}
}

function displayCart(data)
{	
	// display merchant logo
	displayMerchantLogo(data,'page-cart');
	
	var htm='';	
	
	htm+='<input type="hidden" name="validation_msg" class="validation_msg" value="'+data.validation_msg+'">';	
	htm+='<input type="hidden" name="required_time" class="required_time" value="'+data.required_time+'">';	
		
	/*set storage merchant logo*/
    setStorage("merchant_logo",data.merchant_info.logo);
    setStorage("order_total",data.cart.grand_total.amount_pretty); 
    
    setStorage("order_total_raw",data.cart.grand_total.amount);
    setStorage("cart_currency_symbol",data.currency_symbol);
    
    setStorage("order_sub_total_raw",data.cart.sub_total.amount);
    
    /*for pts computation refference*/
    setStorage("cart_sub_total", data.cart.sub_total.amount );
    if(!empty(data.cart.delivery_charges)){
/*Atualização Master Hub (Mensagem de mudança na taxa de entrega)*/
    if (sNavigator.getCurrentPage().name == "paymentOption.html" && getStorage("cart_delivery_charges") != data.cart.delivery_charges.amount) {
    var message = "A taxa de entrega para a localização selecionada é " + data.cart.delivery_charges.amount_pretty;
    	toastMsg(message);
			} 
/*Fim da atualização*/
       setStorage("cart_delivery_charges", data.cart.delivery_charges.amount );
    }
    if(!empty(data.cart.packaging)){
       setStorage("cart_packaging", data.cart.packaging.amount );
    }
    if(!empty(data.cart.tax)){
       //setStorage("cart_tax_amount", data.cart.tax.amount );
       setStorage("cart_tax", data.cart.tax.tax );
    }
    	
	/*if (!empty(data.delivery_date)){
	    $(".delivery_date").val( data.delivery_date);
	}		
	if (!empty(data.estimation_delivery_date)){
	    $(".delivery_date").val( data.estimation_delivery_date);
	}*/		
/*Atualização Master Hub (Resumo carrinho finalização)*/
    if(!empty(data.cart.delivery_charges)){
		setStorage("cart_delivery_charges_final", data.cart.delivery_charges.amount_pretty);
		$(".total-entrega").html(data.cart.delivery_charges.amount_pretty);
    }
	
	if (!empty(data.cart.discount)){			
     setStorage("cart_discount_final", data.cart.discount.amount_pretty);
	}
	
	if (!empty(data.cart.sub_total)){
     setStorage("cart_sub_total_final", data.cart.sub_total.amount_pretty);
	}
	
	if (!empty(data.cart.packaging)){
     setStorage("cart_packaging_final", data.cart.packaging.amount_pretty);
	}
	
	if (!empty(data.cart.tax)){
		setStorage("cart_tax_final", data.cart.tax.amount);
	 	$(".total-comodidade").html(data.cart.tax.amount);	
	}		
		
	if (!empty(data.cart.tips)){			
     setStorage("cart_tip_final", data.cart.tips.tips_pretty);
		} 
/*Fim da atualização*/
	
	if (!empty(data.cart)){
		
		if(!empty(data.cart.grand_total.amount_pretty)){
		   $(".total-amount").html(data.cart.grand_total.amount_pretty);
		}
		
		if(!empty(data.cart.sub_total.amount)){
		   $(".cart_subtotal").val(data.cart.sub_total.amount  );
		}
		
		var xx=1;
		$.each( data.cart.cart, function( key, val ) { 			 
			 if (val.discount>0){
			 	 htm+=tplCartRowNoBorder(
					 val.item_id,
					 val.item_name,
					 val.price+'|'+val.size,
					 val.total_pretty,
					 val.qty,
					 'price', 
					 val.size,
					 xx,
					 val.discounted_price,
					 val.discount,
					 val.category_id
					 );
			 	
			 } else {
			   htm+=tplCartRowNoBorder(
					 val.item_id,
					 val.item_name,
					 val.price+'|'+val.size,
					 val.total_pretty,
					 val.qty,
					 'price', 
					 val.size,
					 xx,
					 val.price,
					 val.discount,
					 val.category_id
					 );
			 }	 
			 
			 if ( !empty(val.order_notes)){
			 		htm+=tplCartRowHiddenFields( val.order_notes ,
                        val.order_notes , 
                        'order_notes',
                        xx ,
                        'row-no-border' );
			 }
			 
			 if (!empty(val.cooking_ref)){
			 	htm+=tplCartRowHiddenFields( val.cooking_ref ,
			 	                        val.cooking_ref , 
			 	                        'cooking_ref',
			 	                        xx ,
			 	                        'row-no-border' );
			 }
			 
			 if (!empty(val.ingredients)){
			 	//htm+='<ons-list-header class="subitem-row'+xx+'">Ingredients</ons-list-header>';			 	
			 	htm+='<ons-list-header class="subitem-row'+xx+'">'+getTrans('Ingredients','ingredients')+'</ons-list-header>';
			 	$.each( val.ingredients, function( key_ing, val_ing ) { 			 	
			 		 htm+=tplCartRowHiddenFields( val_ing , val_ing ,'ingredients', xx ,'row-no-border' );
			 	});	
			 }
			 
			 /*if (!empty(val.sub_item)){
			 	 var x=0
				 $.each( val.sub_item , function( key_sub, val_sub ) {
				 	 if (x==0){
				 	     htm+='<ons-list-header>'+val_sub.category_name+'</ons-list-header>';
				 	 }				 	 
				 	 htm+=tplCartRowNoBorderSub(
				 	        val_sub.sub_item_id,
				 	        val_sub.sub_item_name,
				 	        val_sub.price, 
				 	        val_sub.total_pretty,
				 	        val_sub.qty ,
				 	        'sub_item',
				 	        xx
				 	        );
				 	 x++;
				 });	
			 }*/			 			 
			 
			 /*sub item*/
			 if (!empty(val.sub_item)){
			 	var x=0;
			 	$.each( val.sub_item , function( key_sub, val_sub ) {			 		 
				 	 //htm+='<ons-list-header class="subitem-row'+xx+'">'+key_sub+'</ons-list-header>';
				 	 htm+='<ons-list-header class="subitem-row'+xx+'">'+val_sub[0]['category_name']+'</ons-list-header>';
				 	 $.each( val_sub  , function( key_sub2, val_sub2 ) {			 		 
				 	      dump(val_sub2);	
				 	      if ( val_sub2.qty =="itemqty"){
				 	      	 subitem_qty=val.qty;
				 	      } else {
				 	      	 subitem_qty=val_sub2.qty;
				 	      }				 	      
				 	      
				 	      htm+=tplCartRowNoBorderSub(
				 	        val_sub2.subcat_id,
				 	        val_sub2.sub_item_id,
				 	        val_sub2.sub_item_name,
				 	        val_sub2.price, 
				 	        val_sub2.total_pretty,
				 	        subitem_qty ,
				 	        val_sub2.qty,
				 	        xx
				 	        );
				 	     x++;
				 	 });
			 	});
			 }
			 
			 htm+='<ons-list-item class="grey-border-top line-separator"></ons-list-item>';	
			 xx++;
		});	
								
		htm+='<ons-list-item class="line-separator"></ons-list-item>';	
		
		if (!empty(data.cart.discount)){			
			htm+=tplCartRow(data.cart.discount.display, '('+data.cart.discount.amount_pretty+')' ,'price-normal' );
		}				
		if (!empty(data.cart.sub_total)){
			htm+=tplCartRow( getTrans('Sub Total','sub_total') , data.cart.sub_total.amount_pretty ,'price-normal');
		}		
		if (!empty(data.cart.delivery_charges)){
			htm+=tplCartRow( getTrans('Delivery Fee','delivery_fee') , data.cart.delivery_charges.amount_pretty, 'price-normal');
		}		
		if (!empty(data.cart.packaging)){
			htm+=tplCartRow( getTrans('Packaging','packaging') , data.cart.packaging.amount_pretty, 'price-normal');
		}		
		if (!empty(data.cart.tax)){
			htm+=tplCartRow(data.cart.tax.tax_pretty, data.cart.tax.amount, 'price-normal');
		}		
		
		if (!empty(data.cart.tips)){			
			htm+=tplCartRow(data.cart.tips.tips_percentage_pretty, data.cart.tips.tips_pretty, 'price-normal');
			$(".tip_amount").removeClass("trn");
			$(".tip_amount").html( data.cart.tips.tips_percentage_pretty );
		} else {
			$(".tip_amount").addClass("trn");
			$(".tip_amount").html( getTrans("Tip Amount","tip_amount") );
		}
		
		if (!empty(data.cart.grand_total)){
			htm+=tplCartRow('<b class="trn" data-trn-key="total">Total</b>', data.cart.grand_total.amount_pretty );
		}		
		
	}

	var transaction_type=getStorage("transaction_type");
	if (empty(transaction_type)){	
		transaction_type='delivery';
	}
	dump("transaction_type=>"+transaction_type);
	setStorage('transaction_type',transaction_type);
		
	htm+='<ons-list-header class="trn" data-trn-key="delivery_options">Delivery Options</ons-list-header>';
	/*htm+=privateRowWithRadio('transaction_type','delivery','Delivery');
	htm+=privateRowWithRadio('transaction_type','pickup','Pickup');*/		
	
	/*fixed transaction type*/
	
	dump("services =>"+data.merchant_info.service);
	
	switch (data.merchant_info.service)
	{
		case 1:
		case "1":
		   htm+=privateRowWithRadio('transaction_type','delivery', getTrans('Delivery','delivery') );
		   htm+=privateRowWithRadio('transaction_type','pickup',  getTrans('Pickup','pickup') );
		break;
		
		case 2:
		case "2":
		   htm+=privateRowWithRadio('transaction_type','delivery', getTrans('Delivery','delivery') );
		break;
		
		case 3:
		case "3":
		   transaction_type='pickup';
		   setStorage('transaction_type',transaction_type);
		   htm+=privateRowWithRadio('transaction_type','pickup',  getTrans('Pickup','pickup') );
		break;
		
		case 4:
		case "4":		    
			htm+=privateRowWithRadio('transaction_type','delivery', getTrans('Delivery','delivery') );
		    htm+=privateRowWithRadio('transaction_type','pickup',  getTrans('Pickup','pickup') );
		    htm+=privateRowWithRadio('transaction_type','dinein',  getTrans('Dinein','dinein') );
		break;
		
		case 5:
		case "5":
			htm+=privateRowWithRadio('transaction_type','delivery', getTrans('Delivery','delivery') );	    
		    htm+=privateRowWithRadio('transaction_type','dinein',  getTrans('Dinein','dinein') );
		break;
		
		case 6:
		case "6":
			htm+=privateRowWithRadio('transaction_type','pickup',  getTrans('Pickup','pickup') );
		    htm+=privateRowWithRadio('transaction_type','dinein',  getTrans('Dinein','dinein') );
		break;
		
		case 7:
		case "7":
		    transaction_type='dinein';
		    setStorage('transaction_type',transaction_type);
			htm+=privateRowWithRadio('transaction_type','dinein',  getTrans('Dinein','dinein') );
		break;
		
		default:		    
			htm+=privateRowWithRadio('transaction_type','delivery', getTrans('Delivery','delivery') );
		    htm+=privateRowWithRadio('transaction_type','pickup',  getTrans('Pickup','pickup') );
		break;
	}
		
	createElement('cart-item',htm);
	
	//$('.transaction_type[value="' + transaction_type + '"]').prop('checked', true);
	$.each( $(".transaction_type") , function() {		
		if ( $(this).val()==transaction_type ){
			$(this).attr("checked",true);
		}
	});		
	
	/*if ( transaction_type=="delivery"){
		$(".delivery_time").attr("placeholder",  getTrans("Delivery Time",'delivery_time') );
		$(".delivery_asap_wrap").show();
	} else {
		$(".delivery_time").attr("placeholder", getTrans("Pickup Time",'pickup_time') );
		$(".delivery_asap_wrap").hide();
	}*/
	switch(transaction_type)
	{
		case "pickup":
			$(".delivery_time").attr("placeholder", getTrans("Pickup Time",'pickup_time') );
			$(".delivery_asap_wrap").hide();
		break;
		
		case "dinein":
		   $(".delivery_time").attr("placeholder", getTrans("Dine in time",'dinein_time') );
		   $(".delivery_asap_wrap").hide();
		break;
		
		default:
			$(".delivery_time").attr("placeholder",  getTrans("Delivery Time",'delivery_time') );
			$(".delivery_asap_wrap").show();
		break;
	}
	
	
	/*loyalty points*/
	if (data.has_pts==2){		
		setStorage("earned_points", data.points );
		$(".pts_earn_label").show();
		$(".pts_earn_label").html(data.points_label);
	} else {
		$(".pts_earn_label").hide();
		removeStorage("earned_points");
	}
	
	initMobileScroller();
	translatePage();
}

function editOrderInit()
{
	$("#page-cart .numeric_only").show();
	$(".order-apply-changes").show();
	$(".edit-order").hide();
	$(".qty-label").hide();
	$(".row-del-wrap").show();
/*Atualização Master Hub (Reorganização dos botões de editar do carrinho)*/
	$(".row-del-wrap").css('display', 'flex');
	$(".esconde-ao-editar").hide();
	$(".mostra-ao-editar").show();
/*Fim da atualização*/
	var x=1;
	$.each( $(".item-qty") , function( key, val ) {
		$.each( $(".subitem-qty"+x) , function( key2, val2 ) {
			if ( $(this).data("qty")!="itemqty"){
				$(this).show();
			}
		});
		x++;
	});
}

function applyCartChanges()
{	
	$("#page-cart .numeric_only").hide();
	$(".order-apply-changes").hide();
	$(".edit-order").show();
	$(".qty-label").show();
	$(".subitem-qty").hide();
	$(".row-del-wrap").hide();
/*Atualização Master Hub (Reorganização dos botões de editar do carrinho)*/
	$(".esconde-ao-editar").show();
	$(".mostra-ao-editar").hide();
/*Fim da atualização*/
	dump( "qty L=>"+ $(".item-qty").length );
	if (!empty( $(".item-qty") )){
		cart=[];		
		var x=1;
		$.each( $(".item-qty") , function( key, val ) { 	

			var x=$(this).data("rowid");
			dump("rowid=>"+x);
			
			var sub_item=[];
			var ingredients=[];
			var cooking_ref=[];	
			var order_notes='';
			var discount='';
									
			/*$.each( $(".subitem-qty"+x) , function( key2, val2 ) {
				sub_item[sub_item.length]={
				  'value': $(".sub_item_id"+x).val() + "|" + $(".sub_item_price"+x).val() +'|' + $(".sub_item_name"+x).val()
			    };					    			  
			});*/			

			if ( $(".ingredients"+x).exists() ){				
		    	ingredients[ingredients.length]={
		    		'value': $(".ingredients"+x).val()
		    	};
		    }
		    		    
		    if ( $(".cooking_ref"+x).exists() ){
		    	cooking_ref[cooking_ref.length]={
		    		'value': $(".cooking_ref"+x).val()
		    	};
		    }
		    
		    if ( $(".order_notes"+x).exists() ){
		    	/*order_notes[order_notes.length]={
		    		'value': $(".order_notes"+x).val()
		    	};*/
		    	order_notes=$(".order_notes"+x).val();
		    }
		    		    
		    /*get sub item*/		    
		    $.each( $(".subitem-qty"+x) , function( key2, val2 ) { 		    	 
		    	 subqty = $(this).data("qty");
		    	 if ( $(this).data("qty") != "itemqty"){
		    	 	subqty = $(this).val();
		    	 }
		    	 var parent=$(this).parent().parent();		 
		    	 var subcat_id=parent.find(".subcat_id").val();   	 
		    	 var subcat_value= parent.find(".sub_item_id").val()+'|'+
		    	 parent.find(".sub_item_price").val()+'|'+parent.find(".sub_item_name").val();
		    	 
		    	 sub_item[sub_item.length]={
		    	 	 'qty':subqty,
		    	 	 'subcat_id': subcat_id ,
		    	 	 'value': subcat_value
		    	 };
		    });		    		    			    				
			cart[cart.length]={
			   'item_id':$(".item_id"+x).val(),
			   'category_id':$(".category_id"+x).val(),
			   'qty': $(this).val(),
			   'price': $(".price"+x).val(),
			   "sub_item":sub_item,
			   'cooking_ref': cooking_ref ,
			   "ingredients":ingredients,
			   "order_notes":order_notes,
			   "discount":$(".discount"+x).val(),
			};
			x++;
		});	
		
		dump('updated cartx');
		dump(cart);
								
		var cart_params=JSON.stringify(cart);      
		
		var extra_params= "&delivery_date=" +  $(".delivery_date").val();  
		if ( !empty($(".delivery_time").val()) ){
			extra_params+="&delivery_time="+$(".delivery_time").val();
		}
		
		if ( empty(getStorage("tips_percentage")) ){
	       setStorage("tips_percentage",0);
	    }
	    
      	callAjax("loadCart","merchant_id="+ getStorage('merchant_id')+"&search_address=" + 
      	  encodeURIComponent(getStorage("search_address")) + "&update_cart="+ encodeURIComponent(cart_params) +"&transaction_type=" + 
      	  getStorage("transaction_type") + extra_params  + "&device_id="+ getStorage("device_id") +"&tips_percentage=" + getStorage("tips_percentage") );
		
	}
}

function checkOut()
{	
	var validation_msg=$(".validation_msg").val();
	dump(validation_msg);
	dump(cart);
	if ( cart.length<1){
		onsenAlert( getTrans("Your cart is empty",'your_cart_is_empty') );
		return;
	}
	
	if ( validation_msg!="" ){
		dump('d2');
		onsenAlert(validation_msg);
		return;
	}		
	//var tr_type=getStorage("transaction_type");
	var tr_type = $(".transaction_type:checked").val();
	dump("tr_type=>"+tr_type);
	
	switch (tr_type)
	{
		case "pickup":
		if ( $(".delivery_time").val()==""){
			onsenAlert(  getTrans("Pickup time is required",'pickup_time_is_required') );
			return;
		}
		break;
		
		case "dinein":
		if ( $(".delivery_time").val()==""){
			onsenAlert(  getTrans("Dinein time is required",'dinein_time_is_required') );
			return;
		}
		break;
		
		case "delivery":
		  search_mode = getSearchMode();
		  if ( search_mode=="postcode"){		  	  
		  	  if(!showLocationSelect()){
		  	  	 return;
		  	  }
		  }
		break;
	}
	
		
	if ( $(".required_time").val()==2){
		if ( $(".delivery_time").val() ==""){			
			if ( $(".delivery_asap:checked").length<=0){
				onsenAlert( tr_type+ " "+ getTrans('time is required','time_is_required') );
				return;
			}
		}
	}		
		    
    var extra_params= "&delivery_date=" +  $(".delivery_date").val();  
	if ( !empty($(".delivery_time").val()) ){
		extra_params+="&delivery_time="+$(".delivery_time").val();
	}			
	
	extra_params+="&delivery_asap="+ $(".delivery_asap:checked").val();
	
	extra_params+="&client_token="+getStorage("client_token");
	//extra_params+="&transaction_type2=" + $(".transaction_type:checked").val();
	
	extra_params+="&cart_subtotal"+ $(".cart_subtotal").val();
	
	setTrackView("checkout");
	
    callAjax("checkout","merchant_id="+ getStorage('merchant_id')+"&search_address=" + 
      	  encodeURIComponent(getStorage("search_address")) + "&transaction_type=" + 
      	  getStorage("transaction_type") + extra_params );	
}

function clientRegistration()
{
	$.validate({ 	
	    form : '#frm-checkoutsignup',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	

	      if ($('.iagree-wrap').is(':visible')) {	
		      var iagree = $(".iagree:checked").val();	
		      if(empty(iagree)){
		      	 onsenAlert( getTrans("You must agree to terms & conditions",'agree_terms') );
		      	 return;
		      }
	      }
	      
	      // save mobile number
/*Atualização Master Hub (Máscara do Telefone)*/
	     // setStorage("customer_contact_number", $(".contact_phone").val().replace(/[^0-9\.]+/g, ''));

				var form = $( "#frm-checkoutsignup").serializeArray();
	      var params = "";

				jQuery.each( form, function(i, field) {
					if (field.name == "contact_phone")
						field.value = "%2B55"+field.value.replace(/[^0-9\.]+/g, '');
					params += field.name+"="+field.value+"&";
				});
/*Fim da atualização*/
	      params+="&transaction_type=" +  getStorage("transaction_type") ;
	      params+="&device_id="+ getStorage("device_id");
	      
	      if (isDebug()){
	      	  params+="&device_platform=Android";
	      } else {
	      	  params+="&device_platform="+ device.platform;
	      }	
	      
	      callAjax("signup",params);	       
	      return false;
	    }  
	});
}

function clientShipping()
{	
	var google_lat = $(".google_lat").val();
	var google_lng = $(".google_lng").val();
	enabled_delivery_select_map = getStorage("enabled_delivery_select_map");
	
	if (empty(google_lat) && enabled_delivery_select_map==1){						
		sNavigator.pushPage("map_delivery.html", {
       	  animation: 'none',       	  
       });	
	} else {	
		$.validate({ 	
		    form : '#frm-shipping',    
		    borderColorOnError:"#FF0000",
		    onError : function() {      
		    },	    
		    onSuccess : function() {  
		       var params = $( "#frm-shipping").serialize();			      	       
		       setStorage('shipping_address',params);
		       dump(params);	       
		       var options = {
			      animation: 'slide',
			      onTransitionEnd: function() { 						      	  
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
			displayMerchantLogo3( 
			      	     getStorage("merchant_logo") ,
			      	     getStorage("order_total") ,
				getStorage("cart_sub_total_final") , 
				getStorage("cart_delivery_charges_final"),
				getStorage("cart_tax_final"), 
				getStorage("cart_packaging_final"),
				getStorage("cart_discount_final"),
				getStorage("cart_tip_final"),
/*Fim da atualização*/
			      	     'page-paymentoption'
			      	  );
			      	  params+="&merchant_id="+ getStorage("merchant_id");
			      	  params+="&street="+ urlencode($(".street").val());
/*Atualização Master Hub (Catálogo de Endereços e Número e Bairro)*/
		      	  params+="&numero="+ urlencode($(".numero").val());
		      	  params+="&area_name="+ urlencode($(".area_name").val());
			      	  params+="&city="+ urlencode($(".city").val());
			      	  params+="&state="+ urlencode($(".state").val());
			      	  params+="&zipcode="+ urlencode($(".zipcode").val());
			  params+="&state_id="+ urlencode($(".state_id").val());
			  params+="&city_id="+ urlencode($(".city_id").val());
			  params+="&area_id="+ urlencode($(".area_id").val());
			  params+="&delivery_instruction="+ urlencode($(".delivery_instruction").val());
/*Fim da atualização*/
			      	  params+="&location_name="+ urlencode($(".location_name").val());
			      	  params+="&save_address="+$('.save_address:checked').val();
			      	  params+="&transaction_type=" +  getStorage("transaction_type") ;
			      	  params+="&client_token="+ getStorage('client_token');
			      	  params+="&contact_phone="+ $(".contact_phone").val();
			      	  
			      	  params+="&cart_subtotal="+ $(".cart_subtotal").val();
			      	  		      	  
			      	  callAjax("getPaymentOptions",params);
			      } 
			    };   
			    sNavigator.pushPage("paymentOption.html", options);		       
		       return false;
		    }  
		});
	}
}

function displayPaymentOptions(data)
{
	var htm='';
	$.each( $(data.details.payment_list) , function( key, val ) { 			
		dump(val);
		htm+=tplPaymentList('payment_list', val.value, val.label, val.icon);
	});		
	createElement('payment-list',htm);
	
	var htm='';
	if (data.details.pay_on_delivery_flag==1){
		$.each( $(data.details.pay_on_delivery_list) , function( key, val ) { 			
		    //dump(val);
		    htm+=tplPaymentProvider('payment_provider_name', val.payment_name, val.payment_name, val.payment_logo);
	    });		    
	    createElement('payon-deliver-list',htm);
	}
	
	//$(':radio[value=cod]').attr('checked',true);
}

function placeOrder()
{	
	if ( $('.payment_list:checked').length > 0){
		
		var selected_payment=$('.payment_list:checked').val();
		dump(selected_payment);
		if ( selected_payment=="pyr"){
			dump( $('.payment_provider_name:checked').length );
			if ( $('.payment_provider_name:checked').length <= 0){
				onsenAlert( getTrans("Please select payment provider",'please_select_payment_provider') );
				return;
			}
		}
		
		if ( selected_payment=="ocr"){
			if ( empty( getStorage("cc_id") )){
				onsenAlert( getTrans("Please select credit card",'please_select_cc') );
				return;
			}
		}
		
		/*if ( selected_payment=="cod"){
			if ( $(".order_change").val()=="" ){
				onsenAlert( getTrans("Change is required",'change_is_required') );
				return;
			}
		}*/
		
		
		var params = $( "#frm-paymentoption").serialize();	
		var cart_params = JSON.stringify(cart);		
		
		if ( saveCartToDb() ){
			cart_params=''; 
		}		
		
		var extra_params= "&delivery_date=" +  $(".delivery_date").val();  
		if ( !empty($(".delivery_time").val()) ){
			extra_params+="&delivery_time="+$(".delivery_time").val();
		}		
		
		extra_params+="&delivery_asap="+ $(".delivery_asap:checked").val();		
		extra_params+="&formatted_address="+ urlencode($(".formatted_address").val());	
		extra_params+="&google_lat="+ $(".google_lat").val();	
		extra_params+="&google_lng="+ $(".google_lng").val();
		
		//extra_params+="&payment_method="+ $(".payment_list:checked").val();
		//extra_params+="&order_change="+ $(".order_change").val();
		//extra_params+="&"+ urlencode(getStorage("shipping_address")) ;
		extra_params+="&"+getStorage("shipping_address") ;
		extra_params+="&client_token="+ getStorage('client_token');
		extra_params+="&search_address="+ urlencode(getStorage('search_address'));
		/*pts*/
		extra_params+="&earned_points="+ getStorage('earned_points');
		extra_params+="&device_id="+ getStorage('device_id');
		extra_params+="&"+params;	
				
		/*tips*/
		if ( empty(getStorage("tips_percentage")) ){
	        setStorage("tips_percentage",0);
	    }	    
	    extra_params+="&tips_percentage="+ getStorage('tips_percentage');
	    
	    if ( selected_payment=="ocr"){
	    	extra_params+="&cc_id="+ getStorage('cc_id');
	    }
							
      	callAjax("placeOrder","merchant_id="+ getStorage('merchant_id') + 
      	  "&cart="+ urlencode(cart_params) +      	  
      	  "&transaction_type=" + 
      	  getStorage("transaction_type") + extra_params );
      	  
	} else {
		onsenAlert( getTrans("Please select payment method",'please_select_payment_method') );
	}
}

function showMerchantInfo(data)
{
	dump(data);
	setTrackView("restaurant information: " + data.merchant_info.restaurant_name );
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#page-merchantinfo .estabelecimento-header2").attr("style",'background-image: url('+upload_url+''+data.merchant_info.merchant_bg+'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#page-merchantinfo .estabelecimento-header").attr("style",'background-image: url('+upload_url+''+data.merchant_info.merchant_bg+'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
	$("#page-merchantinfo h3").html(data.merchant_info.restaurant_name);
	$("#page-merchantinfo h5").html(data.merchant_info.cuisine);
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#page-merchantinfo address").html(data.merchant_info.merchant_information);
/* Fim da Atualização */
	$("#page-merchantinfo .rating-stars").attr("data-score",data.merchant_info.ratings.ratings);	
	if (!empty(data.reviews)){
	   $(".total-reviews").html(data.reviews.total_review + " "+ getTrans("reviews",'reviews') );
	}	
	$(".opening-hours").html(data.opening_hours);
	
	if (!empty(data.payment_method)){
		var p='';
		p+='<ons-list-header class="center trn" data-trn-key="payment_methods">Payment Methods</ons-list-header>';
		 $.each( $(data.payment_method) , function( key, val ) { 			
		   p+=tplPaymentListStatic(val.value , val.label, val.icon);
		});
		createElement('merchant-payment-list', p );
	}
	
	/*if (!empty(data.reviews)){
		$(".latest-review").html( data.reviews.date_created +" - " + data.reviews.client_name);
	}*/
	
	/*if (!empty(data.maps)){
		$("#merchant-map").show();	
			
		var locations={
		"name":data.merchant_info.restaurant_name,
		"lat":data.maps.merchant_latitude,
		"lng":data.maps.merchant_longtitude
		};		
		initMerchantMap(locations);			
				
	} else {
		$("#merchant-map").hide();
	}*/
	
	/*check if booking is enabled*/
	/*if ( data.enabled_table_booking==2){
		$("#book-table").show();
	} else $("#book-table").hide();*/
	
	
	$("#book-table").hide();
	
	initRating();	
}

function loadBookingForm()
{
	var options = {
      animation: 'slide',
      onTransitionEnd: function() { 	
      					      	 
      	  displayMerchantLogo2( 
      	     getStorage("merchant_logo") ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
      	     '' ,
/* Fim da Atualização */
      	     '' ,
      	     'page-booking'
      	  );      	  
      	  
      	  initMobileScroller();
      	  
      	  /*translate booking form*/
      	  $(".number_guest").attr("placeholder", getTrans('Number Of Guests','number_of_guest') );
      	  $(".date_booking").attr("placeholder", getTrans('Date Of Booking','date_of_booking') );
      	  $(".booking_time").attr("placeholder", getTrans('Time Of Booking','time_of_booking') );
      	  $(".booking_name").attr("placeholder", getTrans('Name','name') );
      	  $(".email").attr("placeholder", getTrans('Email Address','email_address') );
      	  $(".mobile").attr("placeholder", getTrans('Mobile Number','mobile_number') );
      	  $(".booking_notes").attr("placeholder", getTrans('Your Instructions','your_instructions') );
      	  
      	  translateValidationForm();
      	        	  
      } 
    };   
    sNavigator.pushPage("booking.html", options);		 
}

function submitBooking()
{
	$.validate({ 	
	    form : '#frm-booking',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      var params = $( "#frm-booking").serialize();	      
	      params+="&merchant_id=" +  getStorage("merchant_id") ;
	      params+="&client_token="+ getStorage("client_token");
	      callAjax("bookTable",params);	       
	      return false;
	    }  
	});
}

function loadMoreReviews()
{
	var page = sNavigator.getCurrentPage();		
	if ( page.name=="reviews.html"){		
		var params="merchant_id=" +  getStorage("merchant_id") ;
		params+="&client_token="+ getStorage("client_token");
	    callAjax("merchantReviews",params);	             	       
		return;
	}
	
	var options = {
      animation: 'slide',
      onTransitionEnd: function() { 						      	  
      	  displayMerchantLogo2( 
      	     getStorage("merchant_logo") ,
      	     '' ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
			 '' ,
/* Fim da Atualização */
      	     'page-reviews'
      	  );       	  

/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#page-reviews .estabelecimento-header2").attr("style",'background-image: url('+getStorage("merchant_logo")+'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#page-reviews .estabelecimento-header").attr("style",'background-image: url('+getStorage("merchant_logo")+'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
		  
      	  var params="merchant_id=" +  getStorage("merchant_id") ;
      	  params+="&client_token="+ getStorage("client_token");
	      callAjax("merchantReviews",params);	             	       
      } 
    };   
    sNavigator.pushPage("reviews.html", options);		 	
}

function displayReviews(data)
{
	var htm='';
	$.each( data, function( key, val ) {        		  
		htm+=tplReviews(val.avatar, val.rating, val.client_name, val.review, val.date_created , val.id , val.can_modify, val.replies );
	});	
	createElement('review-list-scroller',htm);
	initRating();
}

function showReviewForm()
{
	var options = {
      animation: 'none',
      onTransitionEnd: function() { 						      	  
      	  displayMerchantLogo2( 
      	     getStorage("merchant_logo") ,
      	     '' ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
			 '' , 
/* Fim da Atualização */
      	     'page-addreviews'
      	  );          	  
		  
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#page-addreviews .estabelecimento-header2").attr("style",'background-image: url('+getStorage("merchant_logo")+'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#page-addreviews .estabelecimento-header").attr("style",'background-image: url('+getStorage("merchant_logo")+'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
		  
      	  translatePage();
      	  $(".rating").attr("placeholder", getTrans('Your Rating 1 to 5','your_rating') );
          $(".review").attr("placeholder", getTrans('Your reviews','your_reviews') );     
          translateValidationForm();      
          
          $('.raty-stars').raty({ 
			   score:0,
			   readOnly: false, 		
			   path: 'lib/raty/images',
			   click: function (score, evt) {					   	   
			   	   $(".rating").val( score );
			   }
		  });              
          	  
      }                   
    };   
    sNavigator.pushPage("addReviews.html", options);		 	
}

function addReview()
{
	$.validate({ 	
	    form : '#frm-addreview',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      var params = $( "#frm-addreview").serialize();	  
	      
	      merchant_id = getStorage("merchant_id");
	      if (typeof merchant_id === "undefined" || merchant_id==null || merchant_id=="" || merchant_id=="null" ) {	      	
	      } else {
	      	 params+="&merchant_id=" +  merchant_id  ;
	      }
	          	      
	      params+="&client_token="+ getStorage("client_token");
	      callAjax("addReview",params);	       
	      return false;
	    }  
	});
}



function showFilterResto()
{	
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


function submitFilterBrowse()
{
	$.validate({ 	
	    form : '#frm-filterbrowse',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      dialogBrowseResto.hide();	
	      browse_params = $( "#frm-filterbrowse").serialize();	      	      	      
	      removeStorage("browse_total");  
	      callAjax("initBrowseMerchant",browse_params);	       
	      //callAjax("browseRestaurant",params);	       
	      return false;
	    }  
	});
}

function showProfile()
{
	if (isLogin()){
		menu.setMainPage('profile.html', {closeMenu: true});
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true})
	}
}

function saveProfile()
{
	$.validate({ 	
	    form : '#frm-profile',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	   	      
	      var params = $( "#frm-profile").serialize();	      	      
	      params+="&client_token="+ getStorage("client_token");
	      callAjax("saveProfile",params);	       
	      return false;
	    }  
	});	
}

function login()
{
	$.validate({ 	
	    form : '#frm-login',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	   
	    onSuccess : function() {     	   	      
	      var params = $( "#frm-login").serialize();
	      params+="&device_id="+ getStorage("device_id");
	      if (isDebug()){
	      	  params+="&device_platform=Android";
	      } else {
	      	  params+="&device_platform="+ device.platform;
	      }	      
	      callAjax("login",params);	       
	      return false;
	    }  
	});	
}

function logout()
{		
	ons.notification.confirm({
	  message: 'Are you sure?',	  
	  title: dialog_title_default ,
	  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
	  animation: 'default', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	    if(index<=0){
	    	
	    	/*LOGOUT TO GOOGLE */
			var social_strategy = getStorage("social_strategy");
			enabled_googlogin = getStorage("enabled_googlogin");
			dump(social_strategy); 
			dump(enabled_googlogin);
			
			if (!isDebug()){
				if(!empty(social_strategy)){
					switch(social_strategy)
					{
						case "google_mobile":
						  window.plugins.googleplus.logout(
							    function (msg) {
							      removeStorage("social_strategy");						      
							    }
							);
						break;
						
						case "fb_mobile":
						  if(social_strategy=="fb_mobile"){
						    fbLogout();
					      }
						break;
					}
				}
			}
		
			pushUnregister();
			removeStorage("client_token");								
			toastMsg(  getTrans("You are now logout",'you_are_now_logout') );
			menu.setMainPage('home.html', {closeMenu: true});	
	    	
	    }
	  }
	});
}

function isLogin()
{
	if (!empty(getStorage("client_token"))){
		return true;
	}
	return false;
}

function showLogin(next_steps)
{
   var options = {
      animation: 'slide',
      onTransitionEnd: function() {       	  
      	  if ( !empty(next_steps)){
      	  	 $(".page-login-fb").show();
    	     $(".next_steps").val( getStorage("transaction_type") );
          } else {
          	 $(".page-login-fb").hide();
          	 $(".next_steps").val( '' );
          }
      } 
    };       
    sNavigator.pushPage("login.html", options);		 	
}

function showForgotPass()
{
	$(".email_address").val('');
	if (typeof dialogForgotPass === "undefined" || dialogForgotPass==null || dialogForgotPass=="" ) { 	    
		ons.createDialog('forgotPassword.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	        translateValidationForm();	        
	        $(".email_address").attr("placeholder",  getTrans('Email Address','email_address') );
	    });	
	} else {
		dialogForgotPass.show();		
	}	
}

function forgotPassword()
{
	$.validate({ 	
	    form : '#frm-forgotpass',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	   	      
	      var params = $( "#frm-forgotpass").serialize();	      	      	      
	      callAjax("forgotPassword",params);	       
	      return false;
	    }  
	});	
}

function showSignupForm()
{
	var options = {
      animation: 'slide',
      onTransitionEnd: function() {          	  
      	  callAjax("getCustomFields",'');   
/*Atualização Master Hub (Desativa entrada do código do país nos campos de telefone)*/
      	  /*initIntelInputs();*/
/*Fim da atualização*/
      } 
    };   
    sNavigator.pushPage("signup.html", options);		 	
}

function signup()
{	
	$.validate({ 	
	    form : '#frm-signup',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     

	      if ($('.iagree-wrap').is(':visible')) {	
		      var iagree = $(".iagree:checked").val();	
		      if(empty(iagree)){
		      	 onsenAlert( getTrans("You must agree to terms & conditions",'agree_terms') );
		      	 return;
		      }
	      }
/*Atualização Master Hub (Máscara do Telefone)*/
				var form = $( "#frm-signup").serializeArray();
				var params = "";

			  jQuery.each( form, function(i, field) {
					if (field.name == "contact_phone")
						field.value = "%2B55"+field.value.replace(/[^0-9\.]+/g, '');
					params += field.name+"="+field.value+"&";
			  });
	      params+="&device_id="+ getStorage("device_id");
/*Fim da atualização*/
	      if (isDebug()){
	      	  params+="&device_platform=Android";
	      } else {
	      	  params+="&device_platform="+ device.platform;
	      }	      
	      
	      callAjax("signup",params);	       
	      return false;
	    }  
	});
}

function showOrders()
{
	if (isLogin()){		
		menu.setMainPage('orders.html', {closeMenu: true});
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true});
	}
}

function showAddressBook()
{
  if (isLogin()){
		menu.setMainPage('addressBook.html', {closeMenu: true});
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true});
	}
}

function displayOrderHistory(data)
{
	var htm='<ons-list>';
	$.each( data, function( key, val ) {   	     
	     htm+='<ons-list-item modifier="tappable" class="list-item-container" onclick="showOrderOptions('+val.order_id+');" >';
           htm+='<ons-row class="row">';
              htm+='<ons-col class="col-orders concat-text">';
                htm+=val.title;
              htm+='</ons-col>';
              htm+='<ons-col class="col-order-stats center" width="98px">';
                 htm+='<span class="notification concat-text '+val.status_raw+' ">'+val.status+'</span>';
              htm+='</ons-col>';
           htm+='</ons-row>';
         htm+='</ons-list-item>';
	});
	htm+='</ons-list>';
	createElement('recent-orders',htm);	
}

function showOrderDetails(order_id)
{
    dump(order_id);
	var options = {
      animation: 'slide',
      onTransitionEnd: function() {        	
      	var params="client_token="+ getStorage("client_token")+"&order_id="+order_id;
      	callAjax("ordersDetails",params);
      } 
    };
    sNavigator.pushPage("ordersDetails.html", options);	
}

function displayOrderHistoryDetails(data)
{
	//$("#page-orderdetails .title").html("Total : "+ data.total);
	//$("#page-orderdetails #search-text").html("Order Details #"+data.order_id);
	$("#page-orderdetails .title").html( getTrans('Total','total') + " : "+ data.total);
	$("#page-orderdetails #search-text").html( getTrans('Order Details','order_details') + " #"+data.order_id);
	
	
	var htm='<ons-list-header class="center trn" data-trn-key="items" >Items</ons-list-header>';
	if ( data.item.length>0){
		$.each( data.item, function( key, val ) {   			  
			  htm+='<ons-list-item class="center">'+val.item_name+'</ons-list-item> ';
		});	
	} else {
		htm+='<ons-list-item class="center">';
		htm+='no item found';
		htm+='</ons-list-item>';
	}
	createElement('item-details', htm );
	
	var htm='<ons-list-header class="center trn" data-trn-key="status_history">Status History</ons-list-header>';	
	if ( data.history_data.length>0){		
		$.each( data.history_data, function( key, val ) {   		
			dump(val);
			htm+='<ons-list-item>';
	        htm+='<ons-row class="row">';
	           htm+='<ons-col class="" width="40%">';
	             htm+= val.date_created;
	           htm+='</ons-col>';
	           htm+='<ons-col class="padding-left5" width="30%">';
	             htm+=val.status;
	           htm+='</ons-col>';
	           htm+='<ons-col class="padding-left5"  width="25%">';
	             htm+=val.remarks;
	           htm+='</ons-col>';
	        htm+='</ons-row>';
	       htm+='</ons-list-item>';
		});		
	} else {
		htm+='<ons-list-item class="center">';
		htm+='No history found';
		htm+='</ons-list-item>';
	}
	createElement('item-history', htm );
		
	if ( data.order_from.request_from=="mobile_app"){
	var html='<button class="button green-btn button--large trn" onclick="reOrder('+data.order_id+');" data-trn-key="click_here_to_reorder" >';
	html+='Click here to Re-order';
	html+='<div class="search-btn"><ons-icon icon="ion-forward"></ons-icon></div>';
    html+='</button>';
    createElement('re-order-wrap', html );
	}
         
   translatePage();
}

function reOrder(order_id)
{
	var params="client_token="+ getStorage("client_token")+"&order_id="+order_id;
     callAjax("reOrder",params);
}

function displayAddressBook(data)
{
/*Atualização Master Hub (Verificação de Endereços e Catálogo de Endereços)*/
	var htm='<ons-list>';
	if ( data.address.length>0){		
	   $.each( data.address, function( key, val ) {  
		   
		   if (val.area_id==0 || val.city_id==0){
		   
	     htm+='<ons-list-item modifier="tappable" onclick="modifyAddressBook('+val.id+');" >';
	         htm+='<ons-row class="row">';
	            htm+='<ons-col class="" width="70%">';
	            htm+='<p class="small-font-dim"style="color: #670707;">'+val.address+'</p>';
	            htm+='</ons-col>';
	            htm+='<ons-col class="text-right" >';
	              if (val.as_default==2){
	                 htm+='<ons-icon icon="ion-ios-location-outline"></ons-icon>';
	              }
	            htm+='</ons-col>';
			   htm+='<i class="white text-center" style="margin-top: -20px; margin-bottom: -7px; font-size: 12px;">Este endereço está desatualizado!</i>';			   
	         htm+='<ons-row>';
	     htm+='</ons-list-item>';
			   
		   } else {
	     htm+='<ons-list-item modifier="tappable" onclick="modifyAddressBook('+val.id+');" >';
	         htm+='<ons-row class="row">';
	            htm+='<ons-col class="" width="70%">';
	            htm+='<p class="small-font-dim">'+val.address+'</p>';
	            htm+='</ons-col>';
	            htm+='<ons-col class="text-right" >';
	              if (val.as_default==2){
	                 htm+='<ons-icon icon="ion-ios-location-outline"></ons-icon>';
	              }
	            htm+='</ons-col>';
	         htm+='<ons-row>';
	     htm+='</ons-list-item>';
		   }
	   });
   }  
   htm+='</ons-list>';
   
   createElement('address-book-list', htm );
}
/*Fim da atualização*/

function modifyAddressBook(id)
{	
	dump(id);	
	var options = {
      animation: 'slide',
      onTransitionEnd: function() {        	
      	var params="client_token="+ getStorage("client_token")+"&id="+id;
      	callAjax("getAddressBookDetails",params);
      } 
    };
    sNavigator.pushPage("addressBookDetails.html", options);	
}

function fillAddressBook(data)
{
	$(".action").val('edit');
	$(".delete-addressbook").show();
	
	$(".id").val( data.id );
	$(".street").val( data.street );
/*Atualização Master Hub (Número e Bairro e Catálogo de Endereços)*/
	$(".numero").val( data.numero );
	$(".location_area", "#frm-addressbook").html(data.area_name);
	$(".area_name", "#frm-addressbook").val(data.area_name);
	$(".area_id", "#frm-addressbook").val( data.area_id );
	$(".city", "#frm-addressbook").val(data.city);
	$(".location_city", "#frm-addressbook").html(data.city);
	$(".city_id").val( data.city_id );
	$(".state", "#frm-addressbook").val( data.state );
	$(".location_state", "#frm-addressbook").html(data.state);
	$(".state_id", "#frm-addressbook").val( data.state_id );
	$(".zipcode").val( data.zipcode );
	$(".location_name", "#frm-addressbook").val( data.location_name );	
	$(".delivery_instruction", "#frm-addressbook").val( data.delivery_instruction );	
	$(".country_code").val( data.country_code );		
	if (data.as_default==2){
		$(".as_default").attr("checked","checked");
	} else $(".as_default").removeAttr("checked");
}
/*Fim da atualização*/

function saveAddressBook()
{
/*Atualização Master Hub (Verificação de Endereços e Catálogo de Endereços)*/
if ($(".city").val()!="" && $(".state").val()!="" && $(".area_name").val()!=""){
	$.validate({ 	
	    form : '#frm-addressbook',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      var params = $( "#frm-addressbook").serialize();	    
	      params+="&client_token="+ getStorage("client_token");
	      callAjax("saveAddressBook",params);	       
	      return false;
	    }  
	});
} else {
	toastMsg( getTrans('Você precisa preencher o seu endereço corretamente!','Você precisa preencher o seu endereço corretamente!')); 
		return;
	}	
}
/*Fim da atualização*/

function newAddressBook()
{
	$(".delete-addressbook").hide();
	var options = {
      animation: 'slide',
      onTransitionEnd: function() {        	
      	$(".id").val('');
      	$(".action").val('add');
      } 
    };
    sNavigator.pushPage("addressBookDetails.html", options);
}

function deleteAddressBook()
{
	ons.notification.confirm({
	  message: getTrans('Delete this records?','delete_this_records') ,	  
	  title: dialog_title_default,
/*Atualização Master Hub (Tradução)*/
	  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
/*Fim da atualização*/
	  animation: 'default', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	dump(index);
	    if ( index==0){
	    	var id=$(".id").val();		
	        var params="&client_token="+ getStorage("client_token")+"&id="+id;
	        callAjax("deleteAddressBook",params);	       
	    }
	  }
	});	
}


function popUpAddressBook()
{	
	$(".manual-address-input").hide();
	
	if (typeof dialogAddressBook === "undefined" || dialogAddressBook==null || dialogAddressBook=="" ) { 	    
		ons.createDialog('dialogAddressBook.html').then(function(dialog) {			
	        dialog.show();
	        translatePage();
	    });	
	} else {
		callAjax('getAddressBookDialog',
		  "client_token="+getStorage("client_token")
		);		
		dialogAddressBook.show();
		//translatePage();
	}	
}

function displayAddressBookPopup(data)
{		
	var htm='<ons-list>';
/*Atualização Master Hub (Verificação de Endereços e Catálogos de Endereços)*/
	if ( data.address.length>0){		
	   $.each( data.address, function( key, val ) {   		
	   	 var complete_address=val.street+"|";
	   	 complete_address+=val.numero+"|";
	   	 complete_address+=val.area_name+"|";
	   	 complete_address+=val.city+"|";
	   	 complete_address+=val.state+"|";
	   	 complete_address+=val.zipcode+"|";
	   	 complete_address+=val.location_name+"|";
	   	 complete_address+=val.contact_phone+"|";
		 complete_address+=val.area_id+"|";
		 complete_address+=val.city_id+"|";
		 complete_address+=val.state_id+"|";
	   	 complete_address+=val.delivery_instruction+"|";
		   
	if (val.area_id==0 || val.city_id==0){
	 toastMsg( getTrans('O endereço "'+val.street+' nº '+val.numero+', '+val.area_name+'" está desatualizado no catálogo de endereços, atualize-o antes de selecioná-lo!','O endereço '+val.street+' nº '+val.numero+' - '+val.area_name+' está desatualizado no catálogo de endereços, atualize-o antes de selecioná-lo!')); 
		return;
		}
/*Fim da atualização*/
	     htm+='<ons-list-item modifier="tappable" class="setAddress" data-address="'+complete_address+'" >';
	         htm+='<ons-row class="row">';
	            htm+='<ons-col class="" width="80%">';
	            htm+='<p class="small-font-dim">'+val.address+'</p>';
	            htm+='</ons-col>';
	            htm+='<ons-col class="text-right" >';
	              if (val.as_default==2){
	                 htm+='<ons-icon icon="ion-ios-location-outline"></ons-icon>';
	              }
	            htm+='</ons-col>';
	         htm+='<ons-row>';
	     htm+='</ons-list-item>';
	   });
   }  
   htm+='</ons-list>';
   
   createElement('addressbook-popup', htm );
}

function initSocialLogin()
{	
   dump('initSocialLogin');    
   
   enabled_social_login = 0;
   
   /*FACEBOOK*/
   enabled_fblogin = getStorage("mobile_enabled_fblogin");
   if ( !empty(enabled_fblogin)){
   	  if ( enabled_fblogin == 1 || enabled_fblogin == "1" ){
   	  	  $(".fb-login-wrap").show();
   	  	  enabled_social_login++;
   	  }
   }
   
   // GOOGLE LOGIN
   enabled_googlogin = getStorage("enabled_googlogin");
   if ( !empty(enabled_googlogin)){
   	   if ( enabled_googlogin==1 || enabled_googlogin == "1"){
   	   	   $(".google-login-wrap").show();
   	   	   enabled_social_login++;
   	   }    	  
   }   
   
   if(enabled_social_login<=0){
   	  $(".or_use_email_wrap").hide();
   }
   
}

function myFacebookLogin()
{			
	openFB.login(
    function(response) {
        if(response.status === 'connected') {        	
            //alert('Facebook login succeeded, got access token: ' + response.authResponse.token);             
            getFbInfo();
        } else {
            alert('Facebook login failed: ' + response.error);
        }
    }, {scope: 'public_profile,email'});
}

function getFbInfo()
{			
	openFB.api({
		path: '/me',
		params: {
			fields:"email,first_name,last_name"
		},
		success: function(data) {			
		    dump(data);				    
		    var params="&email="+ encodeURIComponent(data.email);
	        params+="&first_name="+ encodeURIComponent(data.first_name);
	        params+="&last_name="+ encodeURIComponent(data.last_name);
	        params+="&fbid="+ encodeURIComponent(data.id);
	        params+="&device_id="+ encodeURIComponent(getStorage("device_id"));
	        
	        if (isDebug()){
	      	  params+="&device_platform=Android";
	        } else {
	      	  params+="&device_platform="+ encodeURIComponent(device.platform);
	        }	     
	        
	        if ( $(".next_steps").exists()){
	           params+="&next_steps="+ encodeURIComponent($(".next_steps").val());        
	        }	        
		    callAjax("registerUsingFb",params);	       
		    
    },
    error: fbErrorHandler});
    	
}


function paypalSuccessfullPayment(response)
{	
	var params="response="+response;
	params+="&order_id="+ getStorage("order_id");
	params+="&client_token="+ getStorage("client_token");	
	callAjax("paypalSuccessfullPayment",params);	
}

function showNotification(title,message)
{	
			
	if ( $(".map_canvass").exists() ){
		toastMsg(message);
		return;
	}
	
	if (typeof pushDialog === "undefined" || pushDialog==null || pushDialog=="" ) { 	    
		ons.createDialog('pushNotification.html').then(function(dialog) {
			$(".push-title").html(title);
	        $(".push-message").html(message);
	        dialog.show();
	    });	
	} else {
		$(".push-title").html(title);
	    $(".push-message").html(message);
		pushDialog.show();
	}	
}

function showOrders2()
{	
	pushDialog.hide();
	if (isLogin()){
		menu.setMainPage('orders.html', {closeMenu: true});		
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true});
	}
}

function initMerchantMap(data)
{		
	dump(data);	
	if ( !empty(data)){
		var map = new GoogleMap();	
	    map.initialize('merchant-map', data.lat, data.lng , 15);
	} else {
		$("#merchant-map").hide();
	}
}

function getCurrentLocation()
{	
		
	if (isDebug()){
		onRequestSuccess();
		return;
	}
	
	if ( device.platform =="iOS"){		

		cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){								
			if(authorized){			
				cordova.plugins.locationAccuracy.request(
	            onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
			} else {
			 	cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
				    switch(status){
				        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
				            toastMsg( getTrans("Permission not requested",'permission_not_requested') );
				            return;
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.DENIED:		            
				            toastMsg( getTrans("Permission denied",'permission_denied') );
				            return;
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
				            //toastMsg("Permission granted always");		 		            
				            cordova.plugins.locationAccuracy.request(
			                onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
				                       
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
				            //toastMsg("Permission granted only when in use");
				            cordova.plugins.locationAccuracy.request(
			                onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
			                
				            break;
				    }
				}, function(error){
				    toastMsg(error);
				    return;
				}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);				
			}
		}, function(error){
		    toastMsg("The following error occurred: "+error);
		});
		
	} else {
			
		cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
		    switch(status){
		        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
		            toastMsg( getTrans("Permission not requested",'permission_not_requested') );
		            return;
		            break;
		        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
		            //toastMsg("Permission granted");
		            
		            cordova.plugins.locationAccuracy.request(
	                onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
		            
		            break;
		        case cordova.plugins.diagnostic.permissionStatus.DENIED:
		            toastMsg( getTrans("Permission denied",'permission_denied') );
		            return;
		            break;
		        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
		            toastMsg( getTrans("Permission permanently denied",'permission_permanently_denied') );
		            return;
		            break;
		    }
		}, function(error){
		    toastMsg(error);
		    return;
		});	
	}
	
	/*if ( device.platform=="iOS"){		
		getCurrentLocationOld();
	} else {
		
		var can_request=true;
		cordova.plugins.locationAccuracy.canRequest(function(canRequest){
		 	 if(!canRequest){	
		 	 	can_request=false;
		 	 	var _message=getTrans('Your device has no access to location Would you like to switch to the Location Settings page and do this manually?','location_off')
			   	   ons.notification.confirm({
					  message: _message,		  
					  title: dialog_title_default ,
//Atualização Master Hub (Tradução)
					  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
//Fim da atualização
					  animation: 'none',
					  primaryButtonIndex: 1,
					  cancelable: true,
					  callback: function(index) {
					     if ( index==0 || index=="0"){
					     	cordova.plugins.diagnostic.switchToLocationSettings();
					     } 
					  }
				 });			   			 
		 	 }
		});
		
		if(!can_request){
			return;
		}
		
	   cordova.plugins.locationAccuracy.request(
	    onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
	}*/
		
}

function onRequestSuccess()
{	
	loader.show();
	//  {enableHighAccuracy:false,maximumAge:Infinity, timeout:60000}
	navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError, 
	 { timeout: 10000 , enableHighAccuracy: getLocationAccuracy() , maximumAge:Infinity } );	
	 
	/*navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError, 
	 { timeout:10000 , enableHighAccuracy: false } );	*/
	 	
}

function onRequestFailure(error){    
	//alert("Accuracy request failed: error code="+error.code+"; error message="+error.message);    
    if(error.code == 4){
    	toastMsg( getTrans("You have choosen not to turn on location accuracy",'turn_off_location') );
    	getCurrentLocation();
    } else {
    	toastMsg( error.message );
    }
}

function getCurrentLocationOld()
{		
	CheckGPS.check(function win(){
    //GPS is enabled! 
     loader.show();
	 navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError, 
	 { timeout:10000 , enableHighAccuracy: getLocationAccuracy() } );	
   },
   function fail(){
      //GPS is disabled!
      var m_1= getTrans('Your GPS is disabled, this app needs to be enabled to work.','your_gps');
      var m_2= getTrans('Use GPS for location.','use_gps_for_location');
      var m_3= getTrans('Improve location accuracy','improve_location_accuracy');
      var b_1= getTrans('Cancel','cancel');
      var b_2= getTrans('Later','later');
      var b_3= getTrans('Go','go');
      
      cordova.dialogGPS( m_1 ,//message
	    m_2,//description
	    function(buttonIndex){//callback
	      switch(buttonIndex) {
	        case 0: break;//cancel
	        case 1: break;//neutro option
	        case 2: break;//user go to configuration
	      }
	    },
	      m_3+"?",//title
	      [b_1, b_2, b_3]
	    );//buttons
   });	    
}


function geolocationSuccess(position)
{
	dump(position);
	var params="lat="+position.coords.latitude;
	params+="&lng="+position.coords.longitude;
	
	setStorage("device_location_lat", position.coords.latitude);
	setStorage("device_location_lng", position.coords.longitude);
	
	callAjax("reverseGeoCoding",params);
}

function geolocationError(error)
{
	hideAllModal();
	/*onsenAlert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');*/
	toastMsg( error.message );
}

function saveSettings()
{	
	setStorage("country_code_set", $(".country_code_set").val() );
	
	var params = $( "#frm-settings").serialize();	 
	params+="&client_token="+getStorage("client_token");	
	params+="&device_id="+getStorage("device_id");	
	callAjax("saveSettings",params);	    
}

function showLocationPopUp()
{
	if (typeof locationDialog === "undefined" || locationDialog==null || locationDialog=="" ) { 	    
		ons.createDialog('locationOptions.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	    });	
	} else {
		locationDialog.show();
		//translatePage();
	}	
}

function displayLocations(data)
{
	var htm='';
	htm+='<ons-list>';
	htm+='<ons-list-header class="list-header trn" data-trn-key="country">Country</ons-list-header>';
	$.each( data.list, function( key, val ) {        		  		  
		ischecked='';
		if ( key==data.selected){
			ischecked='checked="checked"';
		}
		htm+='<ons-list-item modifier="tappable" onclick="setCountry('+"'"+key+"'"+');">';
		 htm+='<label class="radio-button checkbox--list-item">';
			htm+='<input type="radio" name="country_code" class="country_code" value="'+key+'" '+ischecked+' >';
			htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
			htm+=' '+val;
		  htm+='</label>'; 
		htm+='</ons-list-item>';
	});		
	htm+='</ons-list>';	
	createElement('location-options-list',htm);	
	translatePage();
}

function setCountry(country_code)
{		
	$(".country_code_set").val(country_code);	
	setStorage("country_code_set",country_code);
}

function addressPopup()
{
	removeStorage("geo_address_result_formatted_address");
	
	if (typeof addressDialog === "undefined" || addressDialog==null || addressDialog=="" ) { 	    
		ons.createDialog('addressPopup.html').then(function(dialog) {
	        dialog.show({"callback":geoCompleteChangeAddress});
	        translatePage();
	        translateValidationForm();	        
	        $(".new_s").attr("placeholder",  getTrans('Enter your address','enter_your_address') );
	    });	
	} else {
		addressDialog.show( {"callback":geoCompleteChangeAddress} );
	}	
		
}

function changeAddress()
{	
	$.validate({ 	
	    form : '#frm-adddresspopup',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	        dump('change address');
	        
	        sNavigator.popPage({cancelIfRunning: true}); //back button
	        
	        setStorage("search_address", $(".new_s").val() );
	        
	         $(".google_formatted_address").html( $(".new_s").val() );
	        
			var cart_params=JSON.stringify(cart);       	  
			if (saveCartToDb()){
			    cart_params='';
			}
		    callAjax("loadCart","merchant_id="+ getStorage('merchant_id')+"&search_address=" + 
		    encodeURIComponent($(".new_s").val()) + "&cart="+cart_params +"&transaction_type=" +
		    getStorage("transaction_type") + "&device_id="+ getStorage("device_id") );
	        return false;
	    }  
	});		
}

function geoCompleteChangeAddress()
{
	dump( "country_code_set=>" + getStorage("country_code_set"));
	if ( empty(getStorage("country_code_set")) ){		
		$("#new_s").geocomplete();		
	} else {		
		$("#new_s").geocomplete({
		   country: getStorage("country_code_set")
	    });	
	}
	$(".pac-container").css( {"z-index":99999} );
}

function showNotificationCampaign(title,message)
{	
		
    if ( $(".map_canvass").exists() ){
		toastMsg(message);
		return;
	}
	
	if (typeof pushcampaignDialog === "undefined" || pushcampaignDialog==null || pushcampaignDialog=="" ) { 	    
		ons.createDialog('pushNotificationCampaign.html').then(function(dialog) {
			$("#page-notificationcampaign .push-title").html(title);
	        $("#page-notificationcampaign .push-message").html(message);
	        dialog.show();
	    });	
	} else {
		$("#page-notificationcampaign .push-title").html(title);
	    $("#page-notificationcampaign .push-message").html(message);
		pushcampaignDialog.show();
	}	
}

function itemNotAvailable(options)
{
	switch (options)
	{
		case 1:
/*Atualização Master Hub (Tradução)*/
		toastMsg( getTrans("item não disponível",'item_not_available') );
/*Fim da atualização*/
		break;
		
		case 2:
		toastMsg( getTrans("Ordering is disabled",'ordering_disabled') );
		return;
		
		break;
	}	
}

function number_format(number, decimals, dec_point, thousands_sep) 
{
  number = (number + '')
    .replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + (Math.round(n * k) / k)
        .toFixed(prec);
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
    .split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '')
    .length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1)
      .join('0');
  }
  return s.join(dec);
}

var translator;
var dictionary;

function getLanguageSettings()
{
	if ( !hasConnection() ){
		toastMsg( getTrans("Internet connection lost","net_connection_lost") );
		return;
	}	
	var params="&client_token="+getStorage("client_token");
	callAjax("getLanguageSettings",params);		
}

function translatePage()
{
	dump("TranslatePage");			
	//if (getStorage("translation")!="undefined"){
	if (typeof getStorage("translation") === "undefined" || getStorage("translation")==null || getStorage("translation")=="" ) { 	   
		return;		
	} else {
		dictionary =  JSON.parse( getStorage("translation") );
	}
	if (!empty(dictionary)){
		//dump(dictionary);		
		var default_lang=getStorage("default_lang");
		//dump(default_lang);
		if (default_lang!="undefined" && default_lang!=""){
			dump("INIT TRANSLATE");
			translator = $('body').translate({lang: default_lang, t: dictionary});
		} 
	}		
}

function getTrans(words,words_key)
{
	var temp_dictionary='';
	/*dump(words);
	dump(words_key);	*/
	if (getStorage("translation")!="undefined"){
	   temp_dictionary =  JSON.parse( getStorage("translation") );
	}
	if (!empty(temp_dictionary)){
		//dump(temp_dictionary);		
		var default_lang=getStorage("default_lang");
		//dump(default_lang);
		if (default_lang!="undefined" && default_lang!=""){
			//dump("OK");
			if ( array_key_exists(words_key,temp_dictionary) ){
				//dump('found=>' + words_key +"=>"+ temp_dictionary[words_key][default_lang]);				
				return temp_dictionary[words_key][default_lang];
			}
		}
	}	
	return words;
}

function array_key_exists(key, search) {  
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false;
  }
  return key in search;
}

function translateValidationForm()
{
	$.each( $(".has_validation") , function() { 
		var validation_type = $(this).data("validation");
		
		switch (validation_type)
		{
			case "number":			
			$(this).attr("data-validation-error-msg",getTrans("The input value was not a correct number",'validation_numeric') );
			break;
			
			case "required":
			$(this).attr("data-validation-error-msg",getTrans("this field is mandatory!",'validaton_mandatory') );
			break;
			
			case "email":
			$(this).attr("data-validation-error-msg",getTrans("You have not given a correct e-mail address!",'validation_email') );
			break;
		}
		
	});
}

function showLanguageList()
{
	if (typeof languageOptions === "undefined" || languageOptions==null || languageOptions=="" ) { 	    
		ons.createDialog('languageOptions.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	    });	
	} else {
		languageOptions.show();		
	}	
}

function displayLanguageSelection(data)
{
	var selected = getStorage("default_lang");
	dump("selected=>"+selected);	
	var htm='';
	htm+='<ons-list>';
	htm+='<ons-list-header class="list-header trn" data-trn-key="language">Language</ons-list-header>';
	$.each( data, function( key, val ) {        		  		  
		dump(val.lang_id);
		ischecked='';
		if ( key==selected){
			ischecked='checked="checked"';
		}
		htm+='<ons-list-item modifier="tappable" onclick="setLanguage('+"'"+key+"'"+');">';
		 htm+='<label class="radio-button checkbox--list-item">';
			htm+='<input type="radio" name="country_code" class="country_code" value="'+key+'" '+ischecked+' >';
			htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
			htm+=' '+val;
		  htm+='</label>'; 
		htm+='</ons-list-item>';
	});		
	htm+='</ons-list>';	
	createElement('language-options-list',htm);	
	translatePage();
}

function setLanguage(lang_id)
{	
	//removeStorage("translation");
	dump( getStorage("translation") );
	if (typeof getStorage("translation") === "undefined" || getStorage("translation")==null || getStorage("translation")=="" ) { 	
	   languageOptions.hide();   
       ons.notification.confirm({
		  message: 'Language file has not been loaded, would you like to reload?',		  
		  title: dialog_title_default ,
/*Atualização Master Hub (Tradução)*/
		  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
/*Fim da atualização*/
		  animation: 'none',
		  primaryButtonIndex: 1,
		  cancelable: true,
		  callback: function(index) {
		     if ( index==0 || index=="0"){
		     	getLanguageSettings();		     	
		     } 
		  }
		});
		return;
	}	
		
	if ( getStorage("translation").length<=5 ){	
		onsenAlert("Translation file is not yet ready.");	
		return;
	}
	
	if ( !empty(lang_id) ){	   
	   setStorage("default_lang",lang_id);
	   if ( !empty(translator)){
	       translator.lang(lang_id);
	   } else {
	   	   translator = $('body').translate({lang: lang_id, t: dictionary});
	   }	   
	}
}

function applyVoucher()
{
	
	if ( checkIfhasOfferDiscount() ){
		return false;
	}
	
	voucher_code = $(".voucher_code").val();
	if ( voucher_code!="" ){
		var params="voucher_code="+ voucher_code;        
		params+="&client_token="+getStorage("client_token");
		params+="&merchant_id="+ getStorage("merchant_id");
		
		params+="&cart_sub_total="+ getStorage("cart_sub_total");
		
		transaction_type=getStorage("transaction_type");		
		params+="&transaction_type=" + getStorage("transaction_type");
		if ( transaction_type=="delivery"){
		   params+="&cart_delivery_charges="+ getStorage("cart_delivery_charges");
		}
		
		params+="&cart_packaging="+ getStorage("cart_packaging");
		params+="&cart_tax="+ getStorage("cart_tax");
		params+="&pts_redeem_amount="+ $(".pts_redeem_amount").val();
		
		if ( empty(getStorage("tips_percentage")) ){
	       setStorage("tips_percentage",0);
	    }
	    params+="&tips_percentage=" + getStorage("tips_percentage");	    
		
        callAjax("applyVoucher",params);	 
	} else {
		onsenAlert(  getTrans('invalid voucher code','invalid_voucher_code') );
	}
}

function removeVoucher()
{
	$(".voucher_amount").val( '' );
    $(".voucher_type").val( '' );
    $(".voucher_code").val('');
/*Atualização Master Hub (Aplica personalizações quando Remover cupom))*/
	$("#page-paymentoption .voucher_amount").css({"display":"none"});
	$("#page-paymentoption .titulo-cupom").css({"display":"none"});	
	$("#page-paymentoption .titulo-subtotal_new").css({"display":"none"});
	$("#page-paymentoption .subtotal_new").css({"display":"none"});
	$("#page-paymentoption .total-comodidade").html( getStorage("cart_tax_final"));
	$("#page-paymentoption .total-gorjeta").html( getStorage("cart_tip_final"));			
/*Fim da atualização*/
   
    $(".apply-voucher").show();
    $(".remove-voucher").hide();
    
    $(".voucher-header").html( getTrans("Voucher",'voucher') );
    
    $(".total-amount").html( prettyPrice(getStorage("order_total_raw")) );
}

function deviceBackReceipt()
{
	return false;
}

function prettyPrice( price )
{
	dump(price);
	
	var decimal_place = getStorage("decimal_place");		
	var currency_position= getStorage("currency_position");
	var currency_symbol = getStorage("currency_set");
	var thousand_separator = getStorage("thousand_separator");
	var decimal_separator = getStorage("decimal_separator");	
			
	dump("decimal_place=>"+decimal_place);	
	dump("currency_symbol=>"+currency_symbol);
	dump("thousand_separator=>"+thousand_separator);
	dump("decimal_separator=>"+decimal_separator);
	dump("currency_position=>"+currency_position);
		
	price = number_format(price,decimal_place, decimal_separator ,  thousand_separator ) ;
	
	if ( currency_position =="left"){
/*Atualização Master Hub (Separar o símbolo da moeda do valor)*/
		return currency_symbol+" "+price;
	} else {
		return price+" "+currency_symbol;
/*Fim da atualização*/
	}
}

function showExpirationMonth()
{
	if (typeof ExpirationMonthDialog === "undefined" || ExpirationMonthDialog==null || ExpirationMonthDialog=="" ) { 	    
		ons.createDialog('ExpirationMonth.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	    });	
	} else {
		ExpirationMonthDialog.show();
		//translatePage();
	}	
}

function fillExpirationMonth()
{
	var htm='';
	htm+='<ons-list>';
	htm+='<ons-list-header class="list-header trn" data-trn-key="expiration_month">Expiration Month</ons-list-header>';
	for (i = 1; i < 13; i++) { 
		if (i<=9){
			i="0"+i;
		}

		htm+='<ons-list-item modifier="tappable" onclick="setExpirationMonth('+"'"+i+"'"+');">';
		 htm+='<label class="radio-button checkbox--list-item">';
			htm+='<input type="radio" name="expiration_m" class="expiration_m" value="'+i+'"  >';
			htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
			htm+=' '+i;
		  htm+='</label>'; 
		htm+='</ons-list-item>';
	}
	htm+='</ons-list>';	
	createElement('expiration-options-list',htm);	
	translatePage();
}

function setExpirationMonth(month)
{	
	$(".expiration_month").val( month );
	$(".expiration_month_label").html( month );
	ExpirationMonthDialog.hide();
}

function showExpirationYear()
{
	if (typeof showExpirationYearDialog === "undefined" || showExpirationYearDialog==null || showExpirationYearDialog=="" ) { 	    
		ons.createDialog('showExpirationYearDialog.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	    });	
	} else {
		showExpirationYearDialog.show();
	}	
}

function fillExpirationYear()
{
	var d = new Date();
    var current_year = d.getFullYear(); 
    
	var htm='';
	htm+='<ons-list>';
	htm+='<ons-list-header class="list-header trn" data-trn-key="expiration_year">Expiration Year</ons-list-header>';
	for (i = 0; i < 15; i++) { 
		
		years = parseInt(current_year)+i;
		
		htm+='<ons-list-item modifier="tappable" onclick="setExpirationYear('+"'"+years+"'"+');">';
		 htm+='<label class="radio-button checkbox--list-item">';
			htm+='<input type="radio" name="expiration_m" class="expiration_m" value="'+years+'"  >';
			htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
			htm+=' '+years;
		  htm+='</label>'; 
		htm+='</ons-list-item>';
	}
	htm+='</ons-list>';	
	createElement('expiration-year-options-list',htm);	
	translatePage();
}

function setExpirationYear(year_value)
{
	dump(year_value);
	$(".expiration_yr").val( year_value );	
	$(".expiration_year").html( year_value );
	showExpirationYearDialog.hide();
}

function showCountry()
{
	if (typeof showCountryDialog === "undefined" || showCountryDialog==null || showCountryDialog=="" ) { 	    
		ons.createDialog('showCountryDialog.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	    });	
	} else {
		showCountryDialog.show();
	}	
}

function fillCountryList()
{
	var htm='';
	htm+='<ons-list>';
	htm+='<ons-list-header class="list-header trn" data-trn-key="expiration_year">Expiration Year</ons-list-header>';
	$.each( country_json_list , function( key, val ) {   
		htm+='<ons-list-item modifier="tappable" onclick="setCardCountry('+"'"+val.code+"'"+');">';
		 htm+='<label class="radio-button checkbox--list-item">';
			htm+='<input type="radio" name="expiration_m" class="expiration_m" value="'+val.code+'"  >';
			htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
			htm+=' '+val.name;
		  htm+='</label>'; 
		htm+='</ons-list-item>';
	});
	htm+='</ons-list>';	
	createElement('country-options-list',htm);	
}

function setCardCountry(country_code)
{
	$(".x_country").val( country_code );
	$(".country_label").html( country_code );
	showCountryDialog.hide();
}

function atzPayNow()
{
    $.validate({ 	
	    form : '#frm-atz',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	       var params = $( "#frm-atz").serialize();
	       params+="&client_token="+getStorage("client_token");
	       params+="&merchant_id="+ getStorage("merchant_id");
	       /*pts*/
	       params+="&earned_points="+ getStorage('earned_points');	       
	       callAjax("PayAtz",params);	       
	       return false;
	    }  
	});
}

function stripePayNow()
{
	var stripe_publish_key = getStorage('stripe_publish_key');
	dump(stripe_publish_key);
	 $.validate({ 	
	    form : '#frm-stp',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() { 
	    	
	       loader.show();
	    	
	       var cards = $(".cc_number").val();       
	       var cvv = $(".cvv").val();  
	       var expiration_month = $(".expiration_month").val();  
	       var expiration_yr = $(".expiration_yr").val(); 
	            
	       Stripe.setPublishableKey(stripe_publish_key);
	       Stripe.card.createToken({
			  number: cards ,
			  cvc: cvv,
			  exp_month: expiration_month ,
			  exp_year: expiration_yr
		   }, stripeResponseHandler);	
		   
	       return false;
	    }  
	});
}

function stripeResponseHandler(status, response)
{
	dump('stripe response');
	dump(status);
	dump(response);
	if (response.error) {
		hideAllModal();
	 	onsenAlert( response.error.message );
	} else {
		$(".stripe_token").val( response.id );
		
	    var params = $( "#frm-stp").serialize();
        params+="&client_token="+getStorage("client_token");
        params+="&merchant_id="+ getStorage("merchant_id");
        callAjax("PayStp",params);	       
	}
}

function autoAddToCart(item_id,price,discount,category_id)
{
		
    if ( $("#close_store").val()==2 || $("#merchant_open").val()==1 ){
		onsenAlert( getTrans("This Restaurant Is Closed Now.  Please Check The Opening Times",'restaurant_close') );
		return;
	}
	
	dump(item_id);
	dump(price);
    cart[cart.length]={		  
	  "item_id":item_id,
	  "qty":1,
	  "price":price,
	  "sub_item":[],
	  "cooking_ref":[],
	  "ingredients":[],
	  'order_notes': '',
	  'discount':discount,
	  'category_id':category_id  //cart category
	};
	dump(cart);
	
	var cart_value={		  
	  "item_id":item_id,
	  "qty":1,
	  "price":price,
	  "sub_item":[],
	  "cooking_ref":[],
	  "ingredients":[],
	  'order_notes': '',
	  'discount':discount,
	  'category_id':category_id  //cart category
	};

	
	if(saveCartToDb()){
		callAjax("addToCart", "cart="+ JSON.stringify(cart_value) + "&device_id=" + getStorage("device_id") );		
	} else {		
	    //sNavigator.popPage({cancelIfRunning: true}); //back button
/*Atualização Master Hub (Remoção da mensagem de ítem adicionado e Correção da tela de exibição)*/
			//toastMsg(  getTrans("Item added to cart",'item_added_to_cart') );
			onsenDialogCheckout();
		}
/*Fim da atualização*/
	showCartNosOrder();
}

function validateCLient()
{
	$.validate({ 	
	    form : '#frm-signup-validation',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	       var params = $( "#frm-signup-validation").serialize();	       
	       callAjax("validateCLient",params);	       
	       return false;
	    }  
	});
}

function detailsPTS(pts_type)
{
	dump(pts_type);
	var options = {
      animation: 'slide',
      onTransitionEnd: function() {
      	   callAjax('detailsPTS',
		    "client_token="+getStorage("client_token")+"&pts_type="+pts_type
		   );
      } 
    };
    sNavigator.pushPage("detailsPTS.html", options);		
}

function displayPTSdetails(data)
{
	if (data.length>0){
		var htm='<ons-list class="list-dim-text">';
		$.each( data, function( key, val ) {   
		     htm+='<ons-list-item  class="list-item-container" >';
	           htm+='<ons-row class="row">';
	              htm+='<ons-col width="100px" >';
	                htm+=val.date_created;
	              htm+='</ons-col>';
	              htm+='<ons-col >';
	                 htm+=val.label;
	              htm+='</ons-col>';
	              htm+='<ons-col width="20px" >';
	                 htm+=val.points;
	              htm+='</ons-col>';
	           htm+='</ons-row>';
	         htm+='</ons-list-item>';
		});
		htm+='</ons-list>';
		createElement('scroller-pts-details',htm);	
	}
}

function applyRedeem()
{
	
	/*if ( checkIfhasOfferDiscount() ){
		return false;
	}*/
	
	/*pts*/
	redeem_points = $(".redeem_points").val();
	if ( redeem_points!="" ){
		var params="redeem_points="+ redeem_points;        
		params+="&client_token="+getStorage("client_token");
		params+="&merchant_id="+ getStorage("merchant_id");
		params+="&voucher_amount="+ $(".voucher_amount").val();
/* Atualização Master Hub (Programa de Fidelidade) */
		params+="&fidelidade_amount="+ $(".fidelidade_amount").val();
/*Fim da atualização*/
		params+="&subtotal_order="+ getStorage("cart_sub_total");
		
		params+="&cart_sub_total="+ getStorage("cart_sub_total");
		params+="&cart_delivery_charges="+ getStorage("cart_delivery_charges");
		params+="&cart_packaging="+ getStorage("cart_packaging");
		//params+="&cart_tax_amount="+ getStorage("cart_tax_amount");
		params+="&cart_tax="+ getStorage("cart_tax");
		
		if ( empty(getStorage("tips_percentage")) ){
	       setStorage("tips_percentage",0);
	    }
	    params+="&tips_percentage=" + getStorage("tips_percentage");
	
        callAjax("applyRedeemPoints",params);	 
	} else {
		onsenAlert(  getTrans('invalid redeem points','invalid_redeem_points') );
	}
}

function cancelRedeem()
{
	$(".pts_redeem_points").val( '' );
    $(".pts_redeem_amount").val( '' );
    $(".pts_pts").show();
    $(".pts_pts_cancel").hide();
/* Atualização Master Hub (Programa de Fidelidade) */
	$("#page-paymentoption .total-pontos").css({"display":"none"});
	$("#page-paymentoption .titulo-pontos").css({"display":"none"});
	$("#page-paymentoption .titulo-subtotal_new").css({"display":"none"});
	$("#page-paymentoption .subtotal_new").css({"display":"none"});
	$("#page-paymentoption .titulo-gorjeta").html('Gorjeta: ');
	$("#page-paymentoption .total-gorjeta").html(getStorage("cart_tip_final"));			
	$("#page-paymentoption .total-comodidade").html( getStorage("cart_tax_final"));   $(".total-amount").html( prettyPrice(getStorage("order_total_raw")) );
/*Fim da atualização*/
    $(".total-amount").html( prettyPrice(getStorage("order_total_raw")) );
}

function backtoHome()
{
	var options = {     	  		  
  	  closeMenu:true,
      animation: 'slide'	    
   };	   	   	   
   menu.setMainPage('home.html',options);
}

function exitKApp()
{
	ons.notification.confirm({
	  message: getTrans('Are you sure to close the app?','close_app') ,	  
	  title: dialog_title_default ,
	  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
	  animation: 'default', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	   //alert(index);
	  	   // -1: Cancel
           // 0-: Button index from the left           
	  	   if (index==0){	  	   	      	   	  
				if (navigator.app) {
				   navigator.app.exitApp();
				} else if (navigator.device) {
				   navigator.device.exitApp();
				} else {
				   window.close();
				}
	  	   }
	  }
	});
}

function imageLoaded(div_id)
{	
	$(div_id).imagesLoaded()
	  .always( function( instance ) {
	    //console.log('all images loaded');
	  })
	  .done( function( instance ) {
	    //console.log('all images successfully loaded');
	  })
	  .fail( function() {
	    console.log('all images loaded, at least one is broken');
	  })
	  .progress( function( instance, image ) {
	    var result = image.isLoaded ? 'loaded' : 'broken';	    	   
	    image.img.parentNode.className = image.isLoaded ? '' : 'is-broken';
	    //console.log( 'image is ' + result + ' for ' + image.img.src );	    
	});
}

$( document ).on( "keyup", ".limit_char", function() {
	  var limit=$(this).data("maxl");
	  limit=parseInt(limit);	  
	  limitText(this,limit);
});

function limitText(field, maxChar){
    var ref = $(field),
        val = ref.val();
    if ( val.length >= maxChar ){
        ref.val(function() {
            //console.log(val.substr(0, maxChar))
            return val.substr(0, maxChar);       
        });
    }
}

function toastMsg( message )
{		
	if (isDebug()){		
		onsenAlert( message );
		return ;
	}
	 
   /* window.plugins.toast.showWithOptions(
    {
      message: message ,
      duration: "long",
      position: "bottom",
      addPixelsY: -40 
    },
      toastOnSuccess, 
      toastOnError  
    );*/
   
    window.plugins.toast.showWithOptions(
      {
        message: message ,
        duration: "long",
        position: "bottom",
        addPixelsY: -40 
      },
      function(args) {
      	
      },
      function(error) {
      	onsenAlert( message );
      }
    );
}

function isDebug()
{	
	var debug = krms_config.debug;
	if(debug){
		return true;
	}
	return false;
}

var rzr_successCallback = function(payment_id) {
  //alert('payment_id: ' + payment_id)
    var params="payment_id="+payment_id;
	params+="&order_id="+ getStorage("order_id");
	params+="&client_token="+ getStorage("client_token");	
	callAjax("razorPaymentSuccessfull",params);	  
}

var rzr_cancelCallback = function(error) {
  onsenAlert(error.description + ' (Error '+error.code+')')
}


function showEasyCategory(element)
{
	
	if (typeof myPopover === "undefined" || myPopover==null || myPopover=="" ) { 	    		
		ons.createPopover('popover.html').then(function(popover) {	
		   popover.show(element,{
		   	 animation:"none"
		   });	   
		   createElement("category-pop-over-list", easy_category_list );
	    });	    
	} else {				
		myPopover.show(element);		
		myPopover.on("postshow", function(e) {	
			createElement("category-pop-over-list", easy_category_list );
		});
	}
	      
}


function fillPopOverCategoryList(data)
{		
/*Atualização Master Hub (Menu de Categorias)*/
	var html='<ons-scroller class="category_popup_scroller">';
	
	html+='<ons-list>';
	if( data.length>0){
	   $.each( data, function( key, val ) {     
	   	  html+='<ons-list-item modifier="tappable" class="row" onclick="loadMenuFromShortcut('+
             val.cat_id+','+val.merchant_id+');"  >'+val.category_name+'</ons-list-item>';
	   });	
	}	
	html+='</ons-list>';
	
	html+='</ons-scroller>';
	
	dump(html);		
	easy_category_list=html;
}
/*Fim da atualização*/

function loadmenu2(cat_id,mtid)
{
	callAjax("getItemByCategory","cat_id="+cat_id+"&merchant_id="+mtid);	
	myPopover.hide();
}

function showMenu(element)
{
	if (typeof merhantPopOverMenu === "undefined" || merhantPopOverMenu==null || merhantPopOverMenu=="" ) { 	    		
		ons.createPopover('merchantmenu.html').then(function(popover) {	
		   popover.show(element,{
		   	 animation:"none"
		   });	   		   
		   
		   enabled_table_booking = getStorage('enabled_table_booking');	    
		    if(enabled_table_booking==2){
		    	$(".book_table_menu").show();
		    } else $(".book_table_menu").hide();
		    
		    translatePage();
		    
	    });	    	    	    
	} else {						
		merhantPopOverMenu.show(element);				
		
		merhantPopOverMenu.on("preshow", function(e) {	
			enabled_table_booking = getStorage('enabled_table_booking');	    
		    if(enabled_table_booking==2){
		    	$(".book_table_menu").show();
		    } else $(".book_table_menu").hide();
		});				
		
		translatePage();
	}
}

function loadPageMerchantInfo()
{
	var options = {
      animation: 'none',
      onTransitionEnd: function() { 	 	      	  
      	  displayMerchantLogo2( 
	      	     getStorage("merchant_logo") ,
/*Atualização Master Hub (Correção do Cabeçalho, Imagem de fundo da empresa)*/
	      	     '' ,
/*Fim da atualização*/
	      	     '' ,
	      	     'page-merchantinfo'
	      );	  		      
	      callAjax("getMerchantInfo","merchant_id="+ getStorage('merchant_id'));  		      
      } 
    };  
    sNavigator.pushPage("merchantInfo.html", options);	   
    
    if (typeof merhantPopOverMenu === "undefined" || merhantPopOverMenu==null || merhantPopOverMenu=="" ) {	     
    } else {
       merhantPopOverMenu.hide(); 
    }
}

function loadBookingForm1()
{
	if (typeof merhantPopOverMenu === "undefined" || merhantPopOverMenu==null || merhantPopOverMenu=="" ) {	     
	} else {
	   merhantPopOverMenu.hide(); 
	}
	loadBookingForm();
}

function loadMoreReviews1()
{
	
	if (typeof merhantPopOverMenu === "undefined" || merhantPopOverMenu==null || merhantPopOverMenu=="" ) {	     
	} else {
		merhantPopOverMenu.hide(); 
	}
	loadMoreReviews();
}

function loadMap(map_type)
{
	
	if (typeof merhantPopOverMenu === "undefined" || merhantPopOverMenu==null || merhantPopOverMenu=="" ) {	     
	} else {
	   merhantPopOverMenu.hide(); 
	}
		
	var options = {
      animation: 'none',
      'map_type': map_type,      
    };  
    sNavigator.pushPage("map.html", options);	   
}

function checkGPS(map_type)
{					 
	 if (isDebug()){
	 	//viewTaskMapInit();
	 	initMap(map_type);
		return ;
	 }
	 
 	if ( device.platform =="iOS"){		
 		 		
 		cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){		
 			 
 			if(authorized){
 				cordova.plugins.locationAccuracy.request( onRequestSuccessMap, 
                onRequestFailureMap, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
 			} else {
			 	 cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
				    switch(status){
				        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
				            toastMsg( getTrans("Permission not requested",'permission_not_requested') );
				            return;
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.DENIED:
				            toastMsg( getTrans("Permission denied",'permission_denied') );
				            return;
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
				            //toastMsg("Permission granted always");		 
				            
				            cordova.plugins.locationAccuracy.request( onRequestSuccessMap, 
			                onRequestFailureMap, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
				                       
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
				            //toastMsg("Permission granted only when in use");		            		            
				            
				            cordova.plugins.locationAccuracy.request( onRequestSuccessMap, 
			                onRequestFailureMap, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
			                
				            break;
				    }
				}, function(error){
				    toastMsg(error);
				    return;
				}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);				
 			}
		
		}, function(error){
		   toastMsg("The following error occurred: "+error);
		});
		
	} else {
			
		cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
		    switch(status){
		        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
		            toastMsg( getTrans("Permission not requested",'permission_not_requested') );
		            return;
		            break;
		        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
		            //toastMsg("Permission granted");
		            
		            cordova.plugins.locationAccuracy.request( onRequestSuccessMap, 
	                onRequestFailureMap, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
		            
		            break;
		        case cordova.plugins.diagnostic.permissionStatus.DENIED:
		            toastMsg( getTrans("Permission denied",'permission_denied') );
		            return;
		            break;
		        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
		            toastMsg( getTrans("Permission permanently denied",'permission_permanently_denied') );
		            return;
		            break;
		    }
		}, function(error){
		    toastMsg(error);
		    return;
		});	
	}
}

function onRequestSuccessMap(success){
    //alert("Successfully requested accuracy: "+success.message);    
    //viewTaskMapInit();
    initMap( $(".map_type").val() );
}

function onRequestFailureMap(error){
    //alert("Accuracy request failed: error code="+error.code+"; error message="+error.message);    
    if(error.code == 4){
    	toastMsg( getTrans("You have choosen not to turn on location accuracy",'turn_off_location') );
    	checkGPS();
    } else {
    	toastMsg( error.message );
    }
}


function viewTaskMapInit()
{
	
	if(isDebug()){
		return;
	}
	
	loader.show();
	
	merchant_latitude = getStorage("merchant_latitude");
	merchant_longtitude = getStorage("merchant_longtitude");
	
	/*alert('viewTaskMapInit');	
	alert( merchant_latitude );
	alert( merchant_longtitude );	*/
	
	google_lat = new plugin.google.maps.LatLng( merchant_latitude , merchant_longtitude );
	
	setTimeout(function(){ 	    
        var div = document.getElementById("map_canvas_div");
        $('#map_canvas_div').css('height', $(window).height() - $('#map_canvas_div').offset().top);
        
        map = plugin.google.maps.Map.getMap(div, {     
	     'camera': {
	      'latLng': google_lat,
	      'zoom': 17
	     }
	    });
        map.setBackgroundColor('white');        
        
        map.on(plugin.google.maps.event.MAP_READY, onMapInit); 
        
    }, 500); // and timeout for clear transitions    
}

function onMapInit()
{
			
	merchant_latitude = getStorage("merchant_latitude");
	merchant_longtitude = getStorage("merchant_longtitude");
	delivery_address = getStorage("merchant_address");
	
	var GOOGLE = new plugin.google.maps.LatLng( merchant_latitude , merchant_longtitude);
	
	map.clear();	
	map.off();
	map.setCenter(GOOGLE);
	map.setZoom(17);
					
    map.addMarker({
	  'position': new plugin.google.maps.LatLng( merchant_latitude , merchant_longtitude ),	  
	  'title': delivery_address ,
	  'snippet': getTrans( "Destination" ,'destination'),
	  'icon': {
	    'url': getStorage("destination_icon")
	   }			  				  
     }, function(marker) {
     	
     	marker.showInfoWindow();
     	     	
     	navigator.geolocation.getCurrentPosition( function(position) {	    
	    	     		
	    	 var your_location = new plugin.google.maps.LatLng(position.coords.latitude , position.coords.longitude); 	
	    	 	    	 
	    	 var destination = new plugin.google.maps.LatLng( merchant_latitude , merchant_longtitude );
	    	 	    	 
	    	 if ( iOSeleven() ){	    	 	
	    	 	 map.animateCamera({
				  'target': your_location,
				  'zoom': 17,
				  'tilt': 30
					}, function() {
						
					   var data = [      
				          {
				            'title': getTrans('You are here','you_are_here'), 
				            'position': your_location ,
				            'icon': {
							    'url': getStorage("from_icon")
							  }			  				  
				          }  
				       ];
				       
				       hideAllModal();
				   
					   addMarkers(data, function(markers) {
					    markers[markers.length - 1].showInfoWindow();
					   });
						
				   });  
	    	 	
	    	 } else {	    	      
		    	  map.addPolyline({
				    points: [
				      destination,
				      your_location
				    ],
				    'color' : '#AA00FF',
				    'width': 10,
				    'geodesic': true
				   }, function(polyline) {
				   	
				   	  
				   	  map.animateCamera({
						  'target': your_location,
						  'zoom': 17,
						  'tilt': 30
						}, function() {
							
						   var data = [      
					          {
					            'title': getTrans('You are here','you_are_here'), 
					            'position': your_location ,
					            'icon': {
								    'url': getStorage("from_icon")
								  }			  				  
					          }  
					       ];
					       
					       hideAllModal();
					   
						   addMarkers(data, function(markers) {
						    markers[markers.length - 1].showInfoWindow();
						   });
							
					   });  
					   
				   });   
		    	 // end polyline
	    	 }
	    	 
	      }, function(error){
	      	 hideAllModal();
	    	 toastMsg( error.message );
	    	 // end position error
	      }, 
          { timeout: 10000, enableHighAccuracy : getLocationAccuracy() } 
        );	    	  
     	
     });     
}

function addMarkers(data, callback) {
  var markers = [];
  function onMarkerAdded(marker) {
    markers.push(marker);
    if (markers.length === data.length) {
      callback(markers);
    }
  }
  data.forEach(function(markerOptions) {
    map.addMarker(markerOptions, onMarkerAdded);
  });
}


function getLocationAccuracy()
{
	/*var networkState = navigator.connection.type;		
	switch (networkState)
	{
		case "Connection.WIFI":
		case "wifi":
		return false;
		break;
		
		default:
		return true;
		break;
	}*/
	
	location_accuracy = getStorage("location_accuracy");
	if (location_accuracy=="true"){
		return true;
	}
	return false;
}

function viewTaskDirection()
{
	merchant_latitude = getStorage("merchant_latitude");
	merchant_longtitude = getStorage("merchant_longtitude");
	
	navigator.geolocation.getCurrentPosition( function(position) {	    
   	         
         var your_location = new plugin.google.maps.LatLng(position.coords.latitude , position.coords.longitude); 	        
         //demo
         //var yourLocation = new plugin.google.maps.LatLng(34.039413 , -118.25480649999997); 	        
         
         var destination_location = new plugin.google.maps.LatLng(merchant_latitude , merchant_longtitude); 	        
         
         plugin.google.maps.external.launchNavigation({
	         "from": your_location,
	         "to": destination_location
	      });	

    	 // end position success    	 
      }, function(error){
    	 toastMsg( error.message );
    	 // end position error
      }, 
      { timeout: 10000, enableHighAccuracy : getLocationAccuracy() } 
    );	    	  		
	
}

function initIntelInputs()
{
	 var mobile_country_code=getStorage("mobile_country_code");
	 dump(mobile_country_code);
	 if(!empty(mobile_country_code)){
	 	 $(".mobile_inputs").intlTelInput({      
		    autoPlaceholder: false,		      
		    defaultCountry: mobile_country_code,  
		    autoHideDialCode:true,    
		    nationalMode:false,
		    autoFormat:false,
		    utilsScript: "lib/intel/lib/libphonenumber/build/utils.js"
		 });
	 } else {
		 $(".mobile_inputs").intlTelInput({      
		    autoPlaceholder: false,		        
		    autoHideDialCode:true,    
		    nationalMode:false,
		    autoFormat:false,
		    utilsScript: "lib/intel/lib/libphonenumber/build/utils.js"
		 });
	 }
}

function showVerifyAccountPage()
{
	 var options = {
	      animation: 'slide',
	      onTransitionEnd: function() {	      	  
	      } 
	  }; 
	  sNavigator.pushPage("verify-account.html", options);
}

function verifyAccount()
{
	$.validate({ 	
	    form : '#frm-verify-account',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      var params = $( "#frm-verify-account").serialize();	      	      
	      callAjax("verifyAccount",params);	       
	      return false;
	    }  
	});
}

function checkIfhasOfferDiscount()
{
	var has_discount = getStorage("has_discount");	
	if(!empty(has_discount)){
		if(has_discount==1){
		   onsenAlert(  getTrans('you request cannot be applied you have offer discount already','discount_offer') );
		   return true;
		}
	}
	return false;
}

function showPageAdressSelection()
{
	var options = {
      animation: 'none',
      onTransitionEnd: function() {         	   	 
      } 
   };   
   sNavigator.pushPage("address-selection.html", options);
}

function showManualAddressInput()
{
	$(".manual-address-input").toggle();
}

function setManualAddress()
{
	$.validate({ 	
	    form : '#frm-manual-address',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	       $(".street").val( $(".stree_1").val()  );	
/*Atualização Master Hub (Recaregando Carrinho e Número e Bairro)*/
	       $(".numero").val( $(".numero_1").val()  );	
	       $(".area_name").val( $(".area_name_1").val()  );	
	       $(".city").val( $(".city_1").val()  );	
	       $(".state").val( $(".state_1").val()  );	
	       $(".zipcode").val( $(".zipcode_1").val()  );		
	       
	       var complete_address = $(".stree_1").val();
	       complete_address+=" "+ $(".numero_1").val();
	       complete_address+=" "+ $(".area_name_1").val();
	       complete_address+=" "+ $(".city_1").val();
	       complete_address+=" "+ $(".state_1").val();
	       complete_address+=" "+ $(".zipcode_1").val();	       
	       
           $(".google_lat").val( '' );	
		   $(".google_lng").val( '' );	
		   $(".formatted_address").val( '' );			
	       
	       $(".delivery-address-text").html( complete_address );       
					reloadCart();	       
	       sNavigator.popPage({cancelIfRunning: true});    
	       return false;
	    }  
	});
}
/*Fim da atualização*/
function showMapAddress(map_address_action)
{
	setStorage("map_address_action",map_address_action)
	
	var options = {
      animation: 'none',
      map_address_action: map_address_action
      /*onTransitionEnd: function() {       	 
      	 checkGPS_AddressMap();
      } */
    };   
    sNavigator.pushPage("address-bymap.html", options);		
}


function checkGPS_AddressMap()
{
	
	$('#map_canvas_address').css('height', $(window).height() - $('#map_canvas_address').offset().top);
	
	if ( $(".search_address_geo").exists() ){
		
		dump('checkGPS_AddressMap');
		$('.map_search_field_wrap').css('height',"auto");
		
		$( document ).on( "click", "#search_address_geo", function() {    	     	    
		   $('.map_search_field_wrap').css('height', $(window).height() - $('.map_search_field_wrap').offset().top);
		   $(".search_address_geo").val('');
		});
		
		var country_code_set=getStorage("country_code_set");
		if ( empty(getStorage("country_code_set")) ){
			country_code_set='';
		}		
		$(".search_address_geo").geocomplete({
		   country: country_code_set
	    }).bind("geocode:result", function(event, result){	    	    		    	    		        
	    	
	    	 dump(result);    
	    	 
	    	 $('.map_search_field_wrap').css('height',"auto");
	    	 
/*Atualização Master Hub (Número e Bairro)*/
	    	 var address = "", numero="", area_name="", city="", state="" ;			 			 
			 var zip = "", formatted_address="", s_lat='', s_lng=''; 

			 formatted_address=result.formatted_address;
			 
	    	 $.each(result.address_components, function(){
	            switch(this.types[0]){
	                case "postal_code":
	                    zip = this.short_name;
	                    break;
	                case "route":
	                    address = this.short_name;
	                    break;
	                case "administrative_area_level_1":
	                    state = this.short_name;
	                    break;
	                case "locality":
	                    city = this.short_name;
	                    break;  
	                case "street_number":
	                    numero = this.short_name;
	                    break;                  
	                case "sublocality":
	                    area_name = this.short_name;
	                    break; 
					case "sublocality_level_1":
	                    area_name = this.short_name;
	                    break;
					case "neighborhood":
	                    area_name = this.short_name;
	                    break;
/*Fim da atualização*/
	            }
	        });
	        
	        dump("formatted_address=>"+formatted_address);
	        dump("address=>"+address);
/*Atualização Master Hub (Número e Bairro)*/
	        dump("numero=>"+numero);
	        dump("area_name=>"+area_name);
/*Fim da atualização*/
	        dump("city=>"+city);
	        dump("state=>"+state);
	        dump("zip=>"+zip);
	    	 
	         s_lat = result.geometry.location.lat();
	         s_lng = result.geometry.location.lng();
	         
	         if(!isDebug()){
		         var geo_loc = new plugin.google.maps.LatLng( s_lat , s_lng );	
		         	         
		         map_search.getCameraPosition(function(camera) {
		         	
		         	 map_search.setCenter(geo_loc);
		             map_search.setZoom(camera.zoom);
			         drag_marker.setPosition(geo_loc);
			         drag_marker.setTitle( formatted_address );
		             drag_marker.showInfoWindow();	             
			         	
		         });		         
	         }
             
	         var map_address_action=getStorage("map_address_action");
	         dump(map_address_action);
	         	         
	         setStorage("map_address_result_address", address );
/*Atualização Master Hub (Número e Bairro)*/
			 setStorage("map_address_result_numero", numero );
			 setStorage("map_address_result_area_name", area_name );
/*Fim da atualização*/
			 setStorage("map_address_result_city", city );
			 setStorage("map_address_result_state",state);
			 setStorage("map_address_result_zip",zip);				
			 setStorage("map_address_result_formatted_address",formatted_address);
			 
			 setStorage("google_lat", result.geometry.location.lat() );
			 setStorage("google_lng", result.geometry.location.lng() );
			 
	    });
	} /*end search geo*/
	
	if(isDebug()){
		return;
	}
			
	/*var can_request=true;
	cordova.plugins.locationAccuracy.canRequest(function(canRequest){
	 	 if(!canRequest){	
	 	 	can_request=false;
	 	 	var _message=getTrans('Your device has no access to location Would you like to switch to the Location Settings page and do this manually?','location_off')
		   	   ons.notification.confirm({
				  message: _message,		  
				  title: dialog_title_default ,
//Atualização Master Hub (Número e Bairro)
				  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
//Fim da atualização
				  animation: 'none',
				  primaryButtonIndex: 1,
				  cancelable: true,
				  callback: function(index) {
				     if ( index==0 || index=="0"){
				     	cordova.plugins.diagnostic.switchToLocationSettings();
				     } 
				  }
			 });			   			 
	 	 }
	});
	
	if(!can_request){
		return;
	}*/

	if ( device.platform =="iOS"){		
		 cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){
		 	 if(authorized){		 
		 	 			 	 	
		 	 	cordova.plugins.locationAccuracy.request( function(success){		
					MapInit_addressMap();			
				} ,  function(error){			
					if(error.code == 4){	    	
				    	checkGPS_AddressMap();
				    } else {
				    	toastMsg( error.message );
				    }			
				}, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
		 	 	
		 	 } else {	
			 	 cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
				    switch(status){
				        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
				            toastMsg( getTrans("Permission not requested",'permission_not_requested') );
				            return;
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.DENIED:
				            toastMsg( getTrans("Permission denied",'permission_denied') );
				            return;
				            break;
				            
				        case cordova.plugins.diagnostic.permissionStatus.GRANTED:		            
				        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
				            toastMsg("Permission granted only when in use");	
		
				            cordova.plugins.locationAccuracy.request( function(success){		
								MapInit_addressMap();			
							} ,  function(error){			
								if(error.code == 4){	    	
							    	checkGPS_AddressMap();
							    } else {
							    	toastMsg( error.message );
							    }			
							}, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
				            	            
				            break;
				    }
				}, function(error){
				    toastMsg(error);
				    return;
				}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);			
		 	}
		}, function(error){
		   toastMsg("The following error occurred: "+error);
		});

	} else {
			
		cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
		    switch(status){
		        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
		            toastMsg( getTrans("Permission not requested",'permission_not_requested') );
		            return;
		            break;
		        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
		            //toastMsg("Permission granted");		            		            
		            
		            cordova.plugins.locationAccuracy.request( function(success){		
						MapInit_addressMap();			
					} ,  function(error){			
						if(error.code == 4){	    	
					    	checkGPS_AddressMap();
					    } else {
					    	toastMsg( error.message );
					    }			
					}, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
		            
		            
		            break;
		        case cordova.plugins.diagnostic.permissionStatus.DENIED:
		            toastMsg( getTrans("Permission denied",'permission_denied') );            		            
		            return;
		            break;
		            
		        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
		            toastMsg( getTrans("Permission permanently denied",'permission_permanently_denied') );
		            return;
		            break;
		    }
		}, function(error){
		    toastMsg(error);
		    return;
		});
	
	}
	
}

function MapInit_addressMap()
{
		 
	 loader.show();
	
	 drag_marker_bounce=1;
	
     navigator.geolocation.getCurrentPosition( function(position) {
		
	 var your_location = new plugin.google.maps.LatLng( position.coords.latitude , position.coords.longitude ); 	
	
		setTimeout(function(){ 	    
			
	        var div = document.getElementById("map_canvas_address");
	        $('#map_canvas_address').css('height', $(window).height() - $('#map_canvas_address').offset().top);
	        	        
	        map_search = plugin.google.maps.Map.getMap(div, {     
			         'camera': {
			         'latLng': your_location,
			         'zoom': 17
			        }
			      });
			    
		        map_search.setBackgroundColor('white');

		        map_search.addEventListener(plugin.google.maps.event.MAP_READY, function onMapInit(map) {		     
		        			        	
		        	
		        	map_search.clear();	
		        	map_search.off();
		        	map_search.setCenter(your_location);
		        	map_search.setZoom(17);
		        			        	
		        	
		        	callAjax("coordinatesToAddress","lat=" + position.coords.latitude + "&lng="+ position.coords.longitude );	 
		        	
		        	
		        	map_search.addEventListener(plugin.google.maps.event.MAP_CLICK, function onMapClick(latLng) {		        	
	                     //alert("Map was long clicked.\n" + latLng.toUrlValue());
	                     var lat_lng= latLng.toUrlValue();
	                     lat_lng=explode(",",lat_lng);
	                     /*alert(lat_lng[0]);
	                     alert(lat_lng[1]);*/
		            });/* even listner*/
		            
		            map_search.addEventListener(plugin.google.maps.event.CAMERA_CHANGE, function onMapCamera(position) {
	                    //alert(JSON.stringify(position));
	                    /*alert( position.target.lat );
	                    alert( position.target.lng );*/
	                    
	                    //drag_marker.remove();	                    
	                    
	                    var new_location = new plugin.google.maps.LatLng( position.target.lat , position.target.lng );
	                    /*map_search.addMarker({
						  'position': new_location
						}, function(marker) {							
							drag_marker=marker;
	                    });*/
	                    
	                    if(drag_marker_bounce==2){
		                    //toastMsg('CAMERA CHANGE =>' + position.target.lat );
		                    drag_marker.setPosition(new_location);
		                    drag_marker.hideInfoWindow();
		                    		                    
		                    $(".change_cemara_action").val("getAddress");
		                    $(".change_cemara_lat").val(  position.target.lat );
		                    $(".change_cemara_lng").val( position.target.lng );
		                    
		                    $(".use-location").html( getTrans("Get Address",'get_address') );
	                    }
	                    
	                    /*if(drag_marker_bounce==2){
	                       callAjax("coordinatesToAddress","lat=" + position.target.lat + "&lng="+ position.target.lng );	 
	                    }*/
	                    
		            });/* even listner*/
		        	
		       });/* even listner*/
		       		       
		       	
	    }, 500); // and timeout for clear transitions    
		
	
	  }, function(error){
	  	 hideAllModal();
    	 toastMsg( error.message );    	 
      }, 
      { timeout: 10000, enableHighAccuracy : getLocationAccuracy() } 
    );	   
}

function useThisLocationOld()
{	
	
	var data_action=$(".change_cemara_action").val();
	//toastMsg(data_action);
	if ( data_action=="getAddress"){
		var lat = $(".change_cemara_lat").val();
		var lng = $(".change_cemara_lng").val();
		//toastMsg( lat + "=>"+ lng );
		$(".change_cemara_action").val('');
		$(".use-location").html( getTrans("Use this address",'use_this_address') );
		callAjax("dragMarker","lat=" + lat + "&lng="+ lng );	 
		return;
	}
	
	var map_address_action=getStorage("map_address_action");
	//alert(map_address_action);
	dump(map_address_action);
	
	switch (map_address_action){
		case "mapaddress":
		
		    //remove this when going live
		    if(isDebug()){
/*Atualização Master Hub (Tradução)*/
		    	$(".street").val( "Rua 9 JA" );
				$(".numero").val( "501" );
				$(".area_name").val( "Jardim América" );
				$(".city").val( "Rio Claro" );
				$(".state").val( "SP" );
				$(".zipcode").val( "13506033" );	
				
				$(".google_lat").val( "-22.3813754" );	
				$(".google_lng").val( "-47.5523903" );	
				$(".formatted_address").val( "Rua 9 JA, 501 - Jardim America, Rio Claro - SP" );	
				
				$(".delivery-address-text").html( "Rua 9 JA, 501 - Jardim America, Rio Claro - SP" );  
				
					reloadCart();
/*Fim da atualização*/
				sNavigator.popPage({cancelIfRunning: true}); //back button
		        sNavigator.popPage({cancelIfRunning: true}); //back button    
		    	return;
		    }
		
		    $(".street").val( getStorage("map_address_result_address") );
/*Atualização Master Hub (Número e Bairro)*/
			$(".numero").val( getStorage("map_address_result_numero") );
			$(".area_name").val( getStorage("map_address_result_area_name") );
/*Fim da atualização*/
			$(".city").val( getStorage("map_address_result_city") );
			$(".state").val( getStorage("map_address_result_state") );
			$(".zipcode").val( getStorage("map_address_result_zip") );	
			
			$(".google_lat").val( getStorage("google_lat") );	
			$(".google_lng").val( getStorage("google_lng") );	
			$(".formatted_address").val( getStorage("map_address_result_formatted_address") );	
			
			$(".delivery-address-text").html( getStorage("map_address_result_formatted_address") );  
/*Atualização Master Hub (Recarregando o carrinho)*/
				reloadCart();		
/*Fim da atualização*/
		    sNavigator.popPage({cancelIfRunning: true}); //back button
		    sNavigator.popPage({cancelIfRunning: true}); //back button    
		break;
		
		case "changeaddress":
		
		   sNavigator.popPage({cancelIfRunning: true}); //back button
		   setStorage("search_address", getStorage("map_address_result_formatted_address") );		   
		   
		   var cart_params=JSON.stringify(cart);       			     
		   if (saveCartToDb()){
		      var cart_params='';
		   }
			
		   callAjax("loadCart","merchant_id="+ getStorage('merchant_id')+"&search_address=" + 
		   encodeURIComponent( getStorage("search_address") ) + "&cart="+cart_params +"&transaction_type=" +
		   getStorage("transaction_type") + "&device_id="+ getStorage("device_id") );
		   
		   sNavigator.popPage({cancelIfRunning: true}); //back button
		   sNavigator.popPage({cancelIfRunning: true}); //back button
		   
		break;
		
		default: 
		  sNavigator.popPage({cancelIfRunning: true}); //back button
		break;
	}			
}

function showChangeAddressPage(object)
{
   search_mode = getSearchMode();	
   if ( search_mode=="postcode"){
   	  showLocationSelect(1);
   } else {
	   var options = {
	      animation: 'slide',
	      onTransitionEnd: function() {       	  
	      } 
	   };   
	   sNavigator.pushPage("change-address.html", options);
   }
}

function showOrderOptions(order_id, show_cancel_order , show_review)
{	
	var options = {
      animation: 'none',
      order_id : order_id,
      show_cancel_order : show_cancel_order,
      show_review : show_review
   };   
   sNavigator.pushPage("order-options.html", options);
}

function showOrderDetails2()
{
	showOrderDetails( $(".order_option_order_id").val() ); 
}

function reOrder2()
{
	reOrder( $(".order_option_order_id").val() );
}

function showTrackPage()
{	
	var options = {
      animation: 'slide',
      /*onTransitionEnd: function() {           	        	      	  
      	  var params='order_id=' + $(".order_option_order_id").val();
      	  params+="&client_token="+getStorage("client_token");
		  callAjax("trackOrderHistory",params);	       	 		  
		  stopTrackInterval();		  		  		  
      } */
   };   
   sNavigator.pushPage("track-order.html", options);
}

function showTrackingPage()
{
	var options = {
      animation: 'none',
      /*onTransitionEnd: function() {              	
      	  $(".driver_avatar").attr("src", $(".driver_avatar").val() );
      	  $("._driver_name").html( $(".driver_name").val() );
      	  $(".call_driver").attr("href","tel:"+ $(".driver_phone").val() );      	  	  
      	  MapInit_Track();      	        	  
      } */
   };   
   sNavigator.pushPage("tracking-page.html", options);
}

function MapInit_Track()
{
	if(isDebug()){
	   return ;
    }
    
    var driver_lat=$(".driver_lat").val();
	var driver_lng=$(".driver_lng").val();
	
	var task_lat=$(".task_lat").val();
	var task_lng=$(".task_lng").val();
	
	var dropoff_lat=$(".dropoff_lat").val();
	var dropoff_lng=$(".dropoff_lng").val();
		
	var driver_location = new plugin.google.maps.LatLng( driver_lat , driver_lng );
    var destination = new plugin.google.maps.LatLng( task_lat , task_lng );
    var dropoff_location = new plugin.google.maps.LatLng( dropoff_lat , dropoff_lng );
	
    setTimeout(function(){ 
    	
    	var div = document.getElementById("map_canvas_track");
    	$('#map_canvas_track').css('height', $(window).height() - $('#map_canvas_track').offset().top);
    	
    	 map = plugin.google.maps.Map.getMap(div, {     
			 'camera': {
			 'latLng': driver_location,
			 'zoom': 17
			}
		 });
		 
		 map.setBackgroundColor('white');
		 
		 map.addEventListener(plugin.google.maps.event.MAP_READY, function onMapInit2(map) {
		 	
		 	map.clear();	
			map.off();
			map.setCenter(driver_location);
			map.setZoom(17);
										
	         var data = [      
			 { 
		        'title': $(".driver_name").val(),
		        'position': driver_location ,
		        'snippet': getTrans( "Driver name" ,'driver_name'),
		        'icon': {
			       'url': $(".driver_icon").val()
			    }
		      },
		      { 
		        'title': "Merchant name" , 
		        'position': dropoff_location ,
		        'snippet': $(".drop_address").val() ,
		        'icon': {
			       'url': $(".merchant_icon").val()
			    }
		      },
		      {
		      	'title': $(".delivery_address").val() , 
		        'position': destination ,
		        'snippet': getTrans( "Delivery Address" ,'delivery_address') ,
		        'icon': {
			       'url': $(".address_icon").val()
			    }
		      } 
		    ];
		    		    		    
		    addMarkers(data, function(markers) {    
		    	
		    	if ( iOSeleven() ){		    		
		    		map.animateCamera({
						  'target': dropoff_location,
						  'zoom': 17,
						  'tilt': 30
					}, function() {			
									
						map.animateCamera({
						  'target': destination,
						  'zoom': 17,
						  'tilt': 30
						}, function() {			
							
							stopTrackMapInterval();
  	                        track_order_map_interval = setInterval(function(){runTrackMap()}, 10000);
												
						}); /*end animate*/		
									
					}); /*end animate*/
		    		
		    	} else {		    	
			    	map.addPolyline({
					points: [
					  driver_location,
					  dropoff_location
					],
					'color' : '#AA00FF',
					'width': 10,
					'geodesic': true
					}, function(polyline) {
					   
						map.animateCamera({
						  'target': dropoff_location,
						  'zoom': 17,
						  'tilt': 30
						}, function() {
							
			                map.addPolyline({
							points: [
							  dropoff_location,
							  destination
							],
							'color' : '#AA00FF',
							'width': 10,
							'geodesic': true
							}, function(polyline) {
							   						
								map.animateCamera({
								  'target': destination,
								  'zoom': 17,
								  'tilt': 30
								}, function() {			
									
									stopTrackMapInterval();
	      	                        track_order_map_interval = setInterval(function(){runTrackMap()}, 10000);
														
								}); /*end animate*/
									
							});  /*end polyline*/
							
						}); /*end animate*/
						
					});  /*end polyline*/
					
		    	}
		    	  								    		
	        });/* end marker*/
		 	
		 });/* even listner*/
    	
    }, 500); 
}

function MapInit_Track_OLD()
{
	if(isDebug()){
		return ;
	}
	
	var driver_lat=$(".driver_lat").val();
	var driver_lng=$(".driver_lng").val();
	
	var task_lat=$(".task_lat").val();
	var task_lng=$(".task_lng").val();
	
	
	var driver_location = new plugin.google.maps.LatLng( driver_lat , driver_lng );
	var destination = new plugin.google.maps.LatLng( task_lat , task_lng );
	
	setTimeout(function(){ 	    
		
        var div = document.getElementById("map_canvas_track");
        $('#map_canvas_track').css('height', $(window).height() - $('#map_canvas_track').offset().top);
        	        
	         map = plugin.google.maps.Map.getMap(div, {     
		         'camera': {
		         'latLng': driver_location,
		         'zoom': 17
		        }
		      });
		    
	        map.setBackgroundColor('white');

	        map.addEventListener(plugin.google.maps.event.MAP_READY, function onMapInit2(map) {		        	
	        		        	
	        	map.clear();	
	        	map.off();
	        	map.setCenter(driver_location);
	        	map.setZoom(17);
	        		        	 	        	
	        	 map.addMarker({
				  'position': driver_location ,
				  'title': $(".driver_name").val(),
				  'snippet': getTrans( "Driver name" ,'driver_name'),
				  'icon': {
				    'url': $(".driver_icon").val()
				  }			  				  
			     }, function(marker) {
			     	
	        	       marker.showInfoWindow();	        	       
	        	       
	        	        map.addPolyline({
						    points: [
						      driver_location,
						      destination
						    ],
						    'color' : '#AA00FF',
						    'width': 10,
						    'geodesic': true
						   }, function(polyline) {
						   	
						   	  map.animateCamera({
								  'target': destination,
								  'zoom': 17,
								  'tilt': 30
								}, function() {
									
								   var data = [      
							          { 
							            'title': $(".delivery_address").val() , 							            
							            'position': destination ,
							            'snippet': getTrans( "Delivery Address" ,'delivery_address'),
							            'icon': {
									       'url': $(".address_icon").val()
									    }
							          }  
							       ];												      
							       
								   addMarkers(data, function(markers) {
								      markers[markers.length - 1].showInfoWindow();
								      //markers[markers.length - 1].setAnimation(plugin.google.maps.Animation.BOUNCE);
								   });
									
							   });  
							   
						 });   
				    	 // end addPolyline
				    	 
				    	 stopTrackMapInterval();
      	                 track_order_map_interval = setInterval(function(){runTrackMap()}, 10000);
	        	       
			     });  /*end marker*/ 
			     	
	       });/* even listner*/
        
	    }, 500); // and timeout for clear transitions      
}


function submitContactForm()
{
	$.validate({ 	
	    form : '#frm-enter-contact',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      var params = $( "#frm-enter-contact").serialize();	      
	      params+="&client_token="+ getStorage('client_token');
	      callAjax("saveContactNumber",params);	       
	      return false;
	    }  
	});
}

function playNotification()
{	 
	 //var sound_url= "file:///android_asset/www/audio/fb-alert.mp3";
	 var sound_url= "file:///android_asset/www/beep.wav";
	 dump(sound_url);
	 if(!empty(sound_url)){
        playAudio(sound_url);
	 }
}

var my_media;

function playAudio(url) {
    // Play the audio file at url    
    my_media = new Media(url,
        // success callback
        function () {
            dump("playAudio():Audio Success");
            my_media.stop();
            my_media.release();
        },
        // error callback
        function (err) {
            dump("playAudio():Audio Error: " + err);
        }
    );
    // Play audio    
    my_media.play({ playAudioWhenScreenIsLocked : true });
    my_media.setVolume('1.0');
}

function stopNotification()
{
	my_media.stop();
    my_media.release();
}

function saveCartToDb()
{
	var mobile_save_cart_db= getStorage("mobile_save_cart_db");
	if(mobile_save_cart_db==1){
		return true;
	}
	return false;
}

function runTrackOrder()
{
	if ($('#page-track-order').is(':visible')) {	
	   dump("runTrackOrder");
	   var params='order_id=' + $(".order_option_order_id").val();
       params+="&client_token="+getStorage("client_token");
       callAjax("trackOrderHistory",params);	       	 
	} else {
		dump("stop runTrackOrder");
		stopTrackInterval();
	}
}

function reRunTrackOrder(){
   stopTrackInterval();
   track_order_interval = setInterval(function(){runTrackOrder()}, 60000);	
}

function reRunTrackOrder2()
{	
	sNavigator.popPage({cancelIfRunning: true}); //back button
	stopTrackInterval();
    track_order_interval = setInterval(function(){runTrackOrder()}, 60000);	
}

function stopTrackInterval() {
    clearInterval(track_order_interval);
}

function stopTrackMapInterval() {
    clearInterval(track_order_map_interval);
}

function runTrackMap()
{	
	if ($('#tracking-page').is(':visible')) {	
	   dump("runTrackMap");
	   stopTrackMapInterval();
	   var params='order_id=' + $(".order_option_order_id").val();
       params+="&client_token="+getStorage("client_token");
       callAjax("trackOrderMap",params);	       	 
	} else {
		dump("stop runTrackMap");
		stopTrackMapInterval();
	}
}

function reInitTrackMap(data)
{
	dump('reInitTrackMap');
	dump(data);
    var driver_lat = data.driver_lat;
	var driver_lng = data.driver_lng;
	
	var task_lat = data.task_lat;
	var task_lng = data.task_lng;
	
	var dropoff_lat = $(".dropoff_lat").val();
	var dropoff_lng = $(".dropoff_lng").val();
	
	if(isDebug()){
		dump("driver location=>" + driver_lat + ":"+ driver_lng);
		dump("task location=>" + task_lat + ":"+ task_lng);
		return;
	}
	
	var driver_location = new plugin.google.maps.LatLng( driver_lat , driver_lng );
	var destination = new plugin.google.maps.LatLng( task_lat , task_lng );
	var dropoff_location = new plugin.google.maps.LatLng( dropoff_lat , dropoff_lng );
		
	map.getCameraPosition(function(camera) {
	  var data = ["Current camera position:\n",
	      "latitude:" + camera.target.lat,
	      "longitude:" + camera.target.lng,
	      "zoom:" + camera.zoom,
	      "tilt:" + camera.tilt,
	      "bearing:" + camera.bearing].join("\n");
	      
	      //toastMsg(data);
			
	    var camera_location = new plugin.google.maps.LatLng( camera.target.lat , camera.target.lng );  
		
		map.clear();	
		map.off();
		map.setCenter(camera_location);
		map.setZoom(camera.zoom);
			     
	   /* var data = [      
		 { 
	        'title': $(".driver_name").val(),
	        'position': driver_location ,
	        'snippet': getTrans( "Driver name" ,'driver_name'),
	        'icon': {
		       'url': $(".driver_icon").val()
		    }
	      },{ 
	        'title': $(".delivery_address").val() , 							            
	        'position': destination ,
	        'snippet': getTrans( "Delivery Address" ,'delivery_address'),
	        'icon': {
		       'url': $(".address_icon").val()
		    }
	      }  
	    ];*/
	    
	     var data = [      
		 { 
	        'title': $(".driver_name").val(),
	        'position': driver_location ,
	        'snippet': getTrans( "Driver name" ,'driver_name'),
	        'icon': {
		       'url': $(".driver_icon").val()
		    }
	      },
	      { 
	        'title': "Merchant name" , 
	        'position': dropoff_location ,
	        'snippet': $(".drop_address").val() ,
	        'icon': {
		       'url': $(".merchant_icon").val()
		    }
	      },
	      {
	      	'title': $(".delivery_address").val() , 
	        'position': destination ,
	        'snippet': getTrans( "Delivery Address" ,'delivery_address') ,
	        'icon': {
		       'url': $(".address_icon").val()
		    }
	      } 
	    ];
	    
	    addMarkers(data, function(markers) {       
	    	
	    	if ( iOSeleven() ){
	    		// do nothing
	    	} else {
		    	map.addPolyline({
				points: [
				  driver_location,
				  dropoff_location
				],
				'color' : '#AA00FF',
				'width': 10,
				'geodesic': true
				}, function(polyline) {
				   
					map.addPolyline({
					points: [
					  dropoff_location,
					  destination
					],
					'color' : '#AA00FF',
					'width': 10,
					'geodesic': true
					}, function(polyline) {
					   
					}); /*end polyline*/
					
				}); /*end polyline*/			
	    	}
	    	
	    });
	   
	    stopTrackMapInterval();
		track_order_map_interval = setInterval(function(){runTrackMap()}, 9000);   

	});
}

function showTip()
{		
	if (typeof tipsDialog === "undefined" || tipsDialog==null || tipsDialog=="" ) { 	    
		ons.createDialog('tipsDialog.html').then(function(dialog) {
			$(".cash_tip").val('');
			dialog.show();
	        translatePage();   
	        $(".cash_tip").attr("placeholder",  getTrans("Cash Tip",'cash_tip') );
	    });	
	} else {
		$(".cash_tip").val('');
		tipsDialog.show();
	}	
}

function setTips(tips)
{	
	removeStorage("remove_tips");
	setStorage("tips_percentage",tips);
	$(".tip_amount").html( getTrans("Tips",'tips') + " "+ tips+"%" );
	tipsDialog.hide();
	reloadCart();
}

function removeTips()
{
	removeStorage("tips_percentage");
	setStorage("remove_tips",1);
	tipsDialog.hide();
	reloadCart();
}

function reloadCart()
{
	var cart_params=JSON.stringify(cart);       	        	  
	if (saveCartToDb()){
	  	  var cart_params='';
	}      	  
	        	 
    if ( empty(getStorage("tips_percentage")) ){
	   setStorage("tips_percentage",0);
	}
	
	var params='';
	params="merchant_id="+ getStorage('merchant_id');
	params+="&search_address=" + encodeURIComponent(getStorage("search_address"))
	params+="&cart="+cart_params;
	params+="&transaction_type=" + getStorage("transaction_type");
	params+="&device_id="+ getStorage("device_id");
	params+="&tips_percentage=" + getStorage("tips_percentage");
		
	if (!empty( getStorage("remove_tips") )){
		params+="&remove_tips="+getStorage("remove_tips");
	}
	  
	callAjax("loadCart",params); 	
}

function fillCCList(data)
{
	var html='';
	if (data.length>0){
	  $.each( data, function( key, val ) { 
	  	  html+='<ons-list-item modifier="tappable" onclick="setCC('+val.cc_id+');" >';
	  	  html+=val.credit_card_number;
	  	  html+='</ons-list-item>';
	  });
	  createElement("cc-list", html );
	}
}

function setCC(cc_id)
{
	/*dump(cc_id);
	setStorage("cc_id",cc_id);
	sNavigator.popPage({cancelIfRunning: true});*/
	
	ons.notification.confirm({
	  message: getTrans('Choose action','choose_action'),  
	  title: '',
	  buttonLabels: [ getTrans('Use this card','use_this_card') , getTrans('Edit this card','edit_this_card')  ],
	  animation: 'default', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	  dump(index);
	      switch (index)
	      {
	      	 case 0:
	      	 setStorage("cc_id",cc_id);
	         sNavigator.popPage({cancelIfRunning: true});
	      	 break;
	      	 
	      	 case 1:
	      	  var options = {
			      animation: 'slide',
			      onTransitionEnd: function() {         	   	 
			      	  translatePage();
				      translateValidationForm();				      
				      var params="&client_token="+ getStorage("client_token");
				      params+="&cc_id="+cc_id;
				      callAjax("loadCC",params);	       
			      } 
			   };   
			   sNavigator.pushPage("ccform.html", options);
	      	 break;
	      }
	  }
   });
	
}

function showCCForm()
{
    var options = {
      animation: 'slide',
      onTransitionEnd: function() {         	   	 
      	  translatePage();
	      translateValidationForm();
	      $(".delete-cc").hide();
	      
	      $(".cc_number").attr("placeholder",  getTrans("Credit Card Number",'cc_number') );
	      $(".cvv").attr("placeholder",  getTrans("CVV",'cvv') );
	      $(".card_name").attr("placeholder",  getTrans("Card name",'card_name') );	      
	      $(".billing_address").attr("placeholder",  getTrans("Billing Address",'billing_address') );
	      
      } 
   };   
   sNavigator.pushPage("ccform.html", options);
}

function saveCC()
{
	$.validate({ 	
	    form : '#frm-cc',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      var params = $( "#frm-cc").serialize();	      	      
	      params+="&client_token="+ getStorage("client_token");
	      callAjax("saveCreditCard",params);	       
	      return false;
	    }  
	});
}

function deleteCC()
{	
	ons.notification.confirm({
	  message: getTrans('Delete this records?','delete_this_records') ,	  
	  title: dialog_title_default,
/*Atualização Master Hub (Tradução)*/
	  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
/*Fim da atualização*/
	  animation: 'default', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {	  	
	    if ( index==0){
	    	var params='';
	        params+="&client_token="+ getStorage("client_token");
	        params+="&cc_id="+ $(".cc_id").val() ;	
	        callAjax("deleteCreditCard",params);	       
	    }
	  }
	});		
}

function fillShippingAddress()
{	
	
	dump('fillShippingAddress');
	if ( !empty( getStorage("map_address_result_formatted_address") )){
		 dump('p1');
  	     $(".delivery-address-text").html( getStorage("map_address_result_formatted_address") );
  	     $(".street").val( getStorage("map_address_result_address") );
/*Atualização Master Hub (Número e Bairro)*/
		 $(".numero").val( getStorage("map_address_result_numero") );
		 $(".area_name").val( getStorage("map_address_result_area_name") );
/*Fim da atualização*/
		 $(".city").val( getStorage("map_address_result_city") );
		 $(".state").val( getStorage("map_address_result_state") );
		 $(".zipcode").val( getStorage("map_address_result_zip") );	
		 $(".formatted_address").val( getStorage("map_address_result_formatted_address") );	
		 
		 $(".google_lat").val( getStorage("google_lat") );	
		 $(".google_lng").val( getStorage("google_lng") );	
  	 } else {  	 	
  	 	dump("p2");
  	 	if(!empty(getStorage("geo_address_result_formatted_address"))){
  	 	   $(".delivery-address-text").html( getStorage("geo_address_result_formatted_address") );
  	       $(".street").val( getStorage("geo_address_result_address") );
/*Atualização Master Hub (Número e Bairro)*/
		 $(".numero").val( getStorage("map_address_result_numero") );
		 $(".area_name").val( getStorage("map_address_result_area_name") );
/*Fim da atualização*/
		   $(".city").val( getStorage("geo_address_result_city") );
		   $(".state").val( getStorage("geo_address_result_state") );
		   $(".zipcode").val( getStorage("geo_address_result_zip") );	
		   $(".formatted_address").val( getStorage("geo_address_result_formatted_address") );	
  	 	}
  	 } 
}

function monerisPay()
{	
	 $.validate({ 	
	    form : '#frm-mri',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() { 
	    		      
	       var cards = $(".cc_number").val();       	       
	       var expiration_month = $(".expiration_month").val();  
	       var expiration_yr = $(".expiration_yr").val(); 
	            	      
	       params="cards="+cards;
	       params+="&expiration_month="+expiration_month;
	       params+="&expiration_yr="+expiration_yr;
	       
	       params+="&order_id="+$("#order_id").val();
	       params+="&currency_code="+$("#currency_code").val();
	       params+="&paymet_desc="+$("#paymet_desc").val();
	       params+="&total_w_tax="+$("#total_w_tax").val();
	       params+="&merchant_id="+ getStorage("merchant_id");
	       params+="&client_token="+getStorage("client_token");
	       
	       params+="&cvv="+ $(".cvv").val(); 
	       
	       callAjax("monerisPay",params);
	       return false;
	    }  
	});
}

function applyCashTip()
{
	if ( $(".cash_tip").val() ==""){
		 onsenAlert(   getTrans('Cash Tip is required','cash_tip_required')  );
		 return;
	}
	var tip_raw = $(".cash_tip").val();
	var order_sub_total = getStorage("order_sub_total_raw");
	
	
	if (!empty(order_sub_total)){				
		//dump( tip_raw + "/"+ order_sub_total );
	    var reverse_percentage = ( parseFloat(tip_raw)/parseFloat(order_sub_total))*100;
	    dump(reverse_percentage); dump( reverse_percentage.toFixed() );
	    var tips=reverse_percentage.toFixed();	    
	    setStorage("tips_percentage",tips);
		$(".tip_amount").html( getTrans("Tips",'tips') + " "+ tips+"%" );
		tipsDialog.hide();
		reloadCart();	    
	}	
}

function initSlideMenu()
{	
   menu.on('preopen', function() {
       console.log("Menu page is going to open");
       
       if (isLogin()){
       	   dump('logon ok');
       	   
       	   var pts = getStorage("pts");
	       dump("pts=>"+pts);
	       if(pts!=2){
	       	  $(".menu-pts").hide();
	       } else {
	       	  $(".menu-pts").css({"display":"block"});
	       }
	              	   
       	   $(".logout-menu").css({"display":"block"});
       	   
       	   var avatar=getStorage("avatar");
       	   dump("avatar=>"+avatar);       	   
       	   if(!empty(avatar)){
       	   	   dump('fillavatar');
	       	   $(".profile-pic-wrap").show();
	       	   $(".avatar").attr("src", getStorage("avatar") );
	       	   $(".avatar-right").html(  getStorage("client_name_cookie") );
	       	   $(".avatar-wrap-menu div").addClass("img_loaded");
       	   }
       } else {
       	   dump('logon not');
       	   $(".logout-menu").hide();
       	   $(".profile-pic-wrap").hide();
       	   $(".menu-pts").hide();
       }
       
       initCustomPages();
/*Atualização Master Hub (Página de Introdução)*/
	   Splash_Pagina_menu();
/*Fim da atualização*/
       translatePage();    
          
  });  
  menu.on('postopen', function() {
      dump('menu is open');      
      imageLoaded('.img_loaded');
  });	
}

function InitPlaceOrder()
{
	$.validate({ 	
	    form : '#frm-paymentoption',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	
	    	placeOrder();
	        return false;
	    }  
	});   
}

function hubtePaynow()
{
	$.validate({ 	
	    form : '#frm-hubtel',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	
	       var params='';
	       params+="&order_id="+$("#order_id").val();
	       params+="&currency_code="+$("#currency_code").val();
	       params+="&paymet_desc="+$("#paymet_desc").val();
	       params+="&total_w_tax="+$("#total_w_tax").val();
	       
	       params+="&merchant_id="+ getStorage("merchant_id");
	       params+="&client_token="+getStorage("client_token");
	       
	       params+="&channel_code="+ $(".channel_code").val(); 
	       params+="&customer_name="+ $(".customer_name").val(); 
	       params+="&customer_mobileno="+ $(".customer_mobileno").val(); 
	       params+="&customer_email="+ $(".customer_email").val(); 
	       
	       callAjax("hubtelPaymentInit",params);
	       return false;
	    }  
	});   
}

function showHubtelChannel()
{
	if (typeof hubtelChannel === "undefined" || hubtelChannel==null || hubtelChannel=="" ) { 	    
		ons.createDialog('hubtelChannel.html').then(function(dialog) {
	        dialog.show();
	        translatePage();
	    });	
	} else {
		hubtelChannel.show();
	}	
}

function setChannel(channel, channel_name)
{
	$(".channel_code").val(channel);
	$(".channel_label").html( channel_name );
	hubtelChannel.hide();
}

/*VERSION 2.1 STARTES HERE*/

function showCity()
{		
	if (typeof locationCity === "undefined" || locationCity==null || locationCity=="" ) { 	    
		ons.createDialog('locationCity.html').then(function(dialog) {
	        dialog.show();
	        $(".search_city").attr("placeholder", getTrans("Type City here",'search_city') );	        
	        $(".search_title").html( getTrans("Search",'search') );
	        loadAjaxLocationCity();	        	        
	        //translatePage();
	    });	
	} else {
		loadAjaxLocationCity();
		locationCity.show();
	}	
}

function searchCity()
{
	loadAjaxLocationCity( $(".search_city").val() );
}

function loadAjaxLocationCity(s)
{
	search_type = getSearchType();	
	if(empty(global_state_id)){
		global_state_id='';
	}
	
	params="state_id="+ global_state_id ;
	if(!empty(s)){
		params+="&s="+ s ;
	}
	
	callAjax('getLocationCity', params );
	/*switch (search_type){
    	case "1":
    	callAjax('getLocationCity', "" );
    	break;
    	
    	case "2":
    	if (empty(global_state_id)){
    		global_state_id='';
    	}
    	callAjax('getLocationCity', "state_id="+ global_state_id );
    	break;
    	
    	case "3":
    	break;
    }*/
}

function setLocationCity(city_id , city_name, state_id )
{
	global_city_name = city_name;
	global_city_id = city_id;
	
	if(!empty(state_id)){
	   global_state_id = state_id;
	}
	
	$(".city_id").val( city_id );
	$(".location_city").html( city_name );

	$(".city").val( city_name );
	
	$(".area_id").val('');
	$(".location_area").html( getTrans("District / Area","destrict_area") );
	
	locationCity.hide();
}

function searchArea()
{
	callAjax('getLocationArea', "city_id=" + $(".city_id").val() + "&s=" + $(".search_area").val() );
}

function showArea()
{
	if ( $(".city_id").val()!="" ){
		if (typeof locationArea === "undefined" || locationArea==null || locationArea=="" ) { 	    
		ons.createDialog('locationArea.html').then(function(dialog) {
			
			$(".search_area").attr("placeholder", getTrans("Type Area here",'search_area') );	        
	        $(".search_title").html( getTrans("Search",'search') );
	        
	        dialog.show();
	        //translatePage();
	    });	
		} else {
			callAjax('getLocationArea', "city_id=" + $(".city_id").val() );
			locationArea.show();
		}	
	} else {
		onsenAlert( getTrans('Please select Cty first','please_select_city') );
	}
}

function setLocationArea(area_id, area_name )
{
/*Atualização Master Hub (Buscar IDs por nome do Bairro)*/
	//buscar_ids_por_Bairro(area_name);
/*Fim da atualização*/
	global_area_name = area_name;
	global_area_id = area_id;
	
	$(".area_id").val( area_id );
	$(".location_area").html( area_name );
		
	$(".area_name").val( area_name );	
	
	locationArea.hide();
}


function clearAllStorage()
{  
  removeStorage('merchant_id');
  removeStorage('shipping_address');  
  removeStorage('merchant_id');
  removeStorage('transaction_type');
  removeStorage('merchant_logo');
  removeStorage('order_total');
  removeStorage('merchant_name');
  removeStorage('total_w_tax');
  removeStorage('currency_code');
  removeStorage('paymet_desc');
  removeStorage('order_id');   
  removeStorage('order_total_raw');   
  removeStorage('cart_currency_symbol');     
  removeStorage('paypal_card_fee');   
  
  removeStorage('cart_sub_total');
  removeStorage('cart_delivery_charges');
  removeStorage('cart_packaging');
  removeStorage('cart_tax');
/*Atualização Master Hub (Remove variáveis do resumo de pedido)*/
  removeStorage('cart_sub_total_final');
  removeStorage('cart_delivery_charges_final');
  removeStorage('cart_packaging_final');
  removeStorage('cart_tip_final');
  removeStorage('cart_tax_final');
  removeStorage("cart_discount_final"),
/*Fim da atualização*/
  removeStorage('map_address_result_formatted_address');
  removeStorage("customer_contact_number");
  
  removeStorage("category_count");
  removeStorage("item_count");    
}

function getSearchMode()
{
	var search_mode = getStorage("search_mode");	
	return search_mode;
}

function getSearchType()
{
	var search_type = getStorage("search_type");	
	return search_type;
}

function showLocationSelect(force_show)
{
	search_type = getSearchType();
	dump(search_type);
	dump("force_show=>"+force_show);
	
	var is_false=1;
	
	switch (search_type){
		case "1":
		case 1:
		
		if(force_show==1 || force_show=="1" ){
			is_false=2;
		} else {
			if (empty(global_city_id)){		
				is_false++;
			}
			if (empty(global_area_id)){					
				is_false++;
			}
		}	
		
		dump("is_false=>"+ is_false);
		
		if (is_false>=2){
			var options = {
		      animation: 'slide',
		      onTransitionEnd: function() { 		      	  		      	
		      } 
		    };   
/*Atualização Master Hub (Verifica se o cliente está logado)*/
			 if (!isLogin()){
				return true;
				    } else
/*Fim da atualização*/
		    sNavigator.pushPage("locationTypeCityArea.html", options);		
		    return false;
		}
		
		break;
		
		case "2":
		case 2:
		
		 if(force_show==1 || force_show=="1" ){
				is_false=2;
		 } else {
			if (empty(global_city_id)){		
				is_false++;
			}
			if (empty(global_state_id)){					
				is_false++;
			}
		 }	
		
		 dump("is_false=>"+ is_false);
		 
		 if (is_false>=2){
			var options = {
		      animation: 'slide',
		      onTransitionEnd: function() { 		  		      	  
		      } 
		    };   
/*Atualização Master Hub (Verifica se o cliente está logado)*/
		    if (!isLogin()){
				return true;
				    } else
/*Fim da atualização*/
		    sNavigator.pushPage("locationTypeCityArea.html", options);		
		    return false;
		 }
		    
		break;
		
		case "3":
		case 3:
		break;
	}
	
	return true;
}

function showShippingLocation(data)
{	
	
   var options = {
      animation: 'slide',
      onTransitionEnd: function() { 		
      	  if(!empty(data.msg.profile)){
/*Atualização Master Hub (Máscara de Telefone)*/
      	  	$(".contact_phone").val($(".contact_phone").masked( data.msg.profile.contact_phone.replace("+55","") ));
/*Fim da atualização*/
      	  	$(".location_name").val( data.msg.profile.location_name ) ;
/*Atualização Master Hub (Complemento de endereço e Número e Bairro)*/
      	  }
		  		if (global_area_name===data.msg.address_book.area_name){
      	  if(!empty(data.msg.address_book)){
      	  	 $(".street").val( data.msg.address_book.street );
      	  	 $(".numero").val( data.msg.address_book.numero );
      	  	 $(".location_name").val( data.msg.address_book.location_name );
      	  	 $(".delivery_instruction").val( data.msg.address_book.delivery_instruction );
      	  }
		  		}
/*Fim da atualização*/
      	  if(!empty(data.msg.state_info)){
      	  	 global_state_id  = data.msg.state_info.state_id;
      	  	 global_state_name  = data.msg.state_info.state_name;
      	  	 
      	  	 $(".location_state").html( data.msg.state_info.state_name );
      	  	 $(".state_id").html( data.msg.state_info.state_id );
      	  	 
      	  	 $(".state").val( data.msg.state_info.state_name );
      	  }
/*Atualização Master Hub (Função de finalização com os mesmos dados selecionados no inicio)*/
			$(".city_id").val(getStorage("global_city_id"));
			$(".area_id").val(getStorage("global_area_id"));
			$(".city").val(getStorage("global_city_name"));
			$(".area_name").val(getStorage("global_area_name"));
		    $(".location_area").html( getStorage("global_area_name") ) ;
		    $(".location_city").html( getStorage("global_city_name") ) ;
/*Fim da atualização*/
/*Atualização Master Hub (Máscara de Telefone)*/
      	  if(!empty(data.details.contact_phone)){
      	  	$(".contact_phone").val($(".contact_phone").masked( data.details.contact_phone.replace("+55","") ));
      	  }
/*Fim da atualização*/
/*Atualização Master Hub (Função de finalização com os mesmos dados selecionados no inicio)*/
      	  if(!empty(global_area_name)){
      	  	 $(".area_name").val( global_area_name );
      	  }
/*Fim da atualização*/
      } 
    };   
    sNavigator.pushPage("shippingLocationArea.html", options);
		    
	/*search_type = getSearchType();		
	dump("search_type=>"+search_type);
	dump(data);
	switch (search_type){
		case "1":
		case "2":
		case "3":
		
			var options = {
		      animation: 'slide',
		      onTransitionEnd: function() { 		

		      	  if(!empty(data.msg.profile)){
		      	  	$(".contact_phone").val( data.msg.profile.contact_phone ) ;
		      	  	$(".location_name").val( data.msg.profile.location_name ) ;
		      	  }
		      	  if(!empty(data.msg.address_book)){
		      	  	 $(".street").val( data.msg.address_book.street );
		      	  	 $(".location_name").val( data.msg.address_book.location_name );
		      	  }
		      } 
		    };   
		    sNavigator.pushPage("shippingLocationArea.html", options);
		
		break;
		
		default:
	    break;
	}	*/
}

function showState()
{
	if (typeof locationState === "undefined" || locationState==null || locationState=="" ) { 	    
	ons.createDialog('locationState.html').then(function(dialog) {
		callAjax('locationState', '' );
        dialog.show();        
    });	
	} else {
		callAjax('locationState', '' );
		locationState.show();
	}	
}

function setLocationState(state_id, state_name)
{
	search_type = getSearchType();
	
	global_state_id = state_id ;
	global_state_name = state_name ;
	
	$(".location_state").html( state_name );
	$(".state_id").val( state_id );
	$(".state").val( state_name );
	
	$(".location_city").html( getTrans("City", "city") );
	$(".city_id").val( '' );
		
	$(".area_id").val('');
	$(".location_area").html( getTrans("District / Area","destrict_area") );
	
	locationState.hide();
}

function showPostal()
{
	if (typeof locationPostal === "undefined" || locationPostal==null || locationPostal=="" ) { 	    
		ons.createDialog('locationPostal.html').then(function(dialog) {
	        dialog.show();	        	        
	    });	
	} else {
		callAjax('getLocationPostal', "" );
		locationPostal.show();
	}	
}

function setLocationPostal(postal_code)
{
	dump(postal_code);
	global_postal_code = postal_code;
	$(".location_postal").html( postal_code );
	locationPostal.hide();
}

function resetLocation()
{
	search_mode = getSearchMode();
    if ( search_mode=="postcode"){
	   setTimeout(function(){ 	 
	   	
		 if ( !empty(global_state_id)){
	        $(".location_state").html( global_state_name );		   	   		   	   		   	   
	     }
	     if ( !empty(global_city_id)){
	     	 $(".location_city").html( global_city_name );
	     }
	     if ( !empty(global_area_id)){
	     	 $(".location_area").html( global_area_name );
	     }
	  },200);
    }
}

function showTestpage()
{
   var options = {
      animation: 'slide',
      onTransitionEnd: function() {         	   	 
      } 
   };   
   kNavigator.pushPage("testpage.html", options);
}

var spinner='<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';

var lazyLoadSearch = {
  createItemContent: function(index, oldContent) {      	
  	
  	search_total = getStorage("search_total_raw");
  	if(!empty(search_total)){
/*Atualização Master Hub (Tradução)*/
  		$(".result-msg").text(search_total==1 ? "1 empresa entrega no seu bairro" : search_total+" empresas entregam no seu bairro");
/*Fim da atualização*/
  	}  	  	
    var $element = $('<div id="results-'+index+'">'+spinner+'</div>');     
    getSearchMerchant(index);   
    return $element[0];    
  },
  calculateItemHeight: function(index) {  	
    return 1100;
  },
  countItems: function() {  	
    return getStorage("search_total");
  },
  destroyItemContent: function(index, element) {
    console.log("Destroyed item " + index);
  }
}

function getSearchMerchant(index)
{
	var params='';
	search_mode = getSearchMode();		
	if ( search_mode=="postcode"){
		params="search_mode="+ search_mode;
		var search_type = getSearchType();			
		switch (search_type)
		{
			case "1":				
			params+="&city_id="+ global_city_id;
			params+="&area_id="+ global_area_id;
			break;
			
			case "2":
			params+="&state_id="+ global_state_id;
			params+="&city_id="+ global_city_id;
			break;
			
			case "3":
			params+="&postal_code="+ global_postal_code;
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

	params+="&app_version=" + app_version;
	
	dump(ajax_url+"/"+action+"?"+params);
	
	 ajax_lazy = $.ajax({
		url: ajax_url+"/"+action, 
		data: params,
		type: 'post',                  
		async: false,
		dataType: 'jsonp',
		timeout: 8000,
		crossDomain: true,
	 beforeSend: function() {			 	
	},
	complete: function(data) {							
	},
	success: function (data) {	  	   
	   if (data.code=1){	   		   	      	  
	   	   if ( $('#results-'+index).exists() ){
	   	      displayRestaurantResults(data.details.data ,'results-'+index);	   	   
	   	   } else {
	   	   	  dump('element not exist');
	   	   	  ajax_lazy.abort();
              ajax_lazy = null;
	   	   }
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

function initBrowseMerchant()
{
	browse_params='';
	removeStorage("browse_total");  
	callAjax("initBrowseMerchant",'');
}


var lazyBrowseMerchant = {
  createItemContent: function(index, oldContent) {      	
  	
  	search_total = getStorage("browse_total_raw");
  	if(!empty(search_total)){
  		$(".result-msg").text(search_total+" "+getTrans("Restaurant found",'restaurant_found') );
  	}  	  	
    var $element = $('<div id="browse-results-'+index+'">'+spinner+'</div>');     
    getBrowseMerchant(index);   
    return $element[0];    
  },
  calculateItemHeight: function(index) {  	
    return 1200;
  },
  countItems: function() {  	
    return getStorage("browse_total");
  },
  destroyItemContent: function(index, element) {
    console.log("Destroyed item " + index);
  }
}

function getBrowseMerchant(index)
{
	var params='';
	action="BrowseRestaurant";
	params+="&page="+index;	
	if(!empty(browse_params)){
		params+="&"+browse_params;
	}
	
	/*add language use parameters*/
	params+="&lang_id="+getStorage("default_lang");
	params+="&lang="+getStorage("default_lang");
	if(!empty(krms_config.APIHasKey)){
		params+="&api_key="+krms_config.APIHasKey;
	}
		
	params+="&app_version=" + app_version;
	
	dump(ajax_url+"/"+action+"?"+params);	
	
	 ajax_lazy = $.ajax({
		url: ajax_url+"/"+action, 
		data: params,
		type: 'post',                  
		async: false,
		dataType: 'jsonp',
		timeout: 8000,
		crossDomain: true,
	 beforeSend: function() {			 	
	},
	complete: function(data) {							
	},
	success: function (data) {	  	   
	   if (data.code=1){	   		   
	   	  if ( $('#browse-results-'+index).exists() ){
	   	      displayRestaurantResults(data.details.data ,'browse-results-'+index);
	   	   } else {
	   	   	  dump('element not exist');
	   	   	  ajax_lazy.abort();
              ajax_lazy = null;
	   	   } 	  	   	   
	   } else {	   	  
	   	  $("#browse-results-"+index).html(data.msg);
	   }
	},
	error: function (request,error) {	        
		hideAllModal();				
		$("#browse-results-"+index).html( getTrans("Network error has occurred please try again!",'network_error') );		
	}
   });       	
}

function clearCart()
{
	ons.notification.confirm({
	  message: getTrans('Are you sure','are_you_sure') +"?",
	  title: dialog_title_default,
	  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
	  animation: 'default', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {	    
	    if ( index==0){
	     	
	       if (saveCartToDb()){
	       	  callAjax("clearMyCart", "&device_id="+ encodeURIComponent(getStorage("device_id")) );
	       } else {
	       	   //showCart();
		       cart=[];		       
		       sNavigator.popPage({cancelIfRunning: true}); //back button
		       showCartNosOrder();
	       }
	    }
	  }
	});	
}

function googleLogin()
{
	if(isDebug()){
		
/*Atualização Master Hub (Tradução)*/
		var params = "email=robson@google.com";
		params+="&userid=14000000";
		params+="&fullname=Robson";
		params+="&lastname=Web";
		params+="&imageurl=";		
		params+="&device_id="+ encodeURIComponent(getStorage("device_id"));
/*Fim da atualização*/
		if (isDebug()){
      	  params+="&device_platform=Android";
        } else {
      	  params+="&device_platform="+ encodeURIComponent(device.platform);
        }
                
		if ( $(".next_steps").exists()){
            params+="&next_steps="+ encodeURIComponent($(".next_steps").val());        
        }        		
		callAjax("googleLogin", params );
		
	} else {
		// USE GOOGLE LOGIN PLUGIN
		window.plugins.googleplus.login(
	    {      
	    },
	    function (obj) {
	    	// SUCCESS
	    	var params = "email=" + encodeURIComponent(obj.email);
			params+="&userid=" + encodeURIComponent(obj.userId);			
			if(!empty(obj.givenName)){
			    params+="&fullname="+ encodeURIComponent(obj.givenName);
			} else {
				params+="&fullname="+ encodeURIComponent(obj.displayName);
			}
			params+="&lastname="+ encodeURIComponent(obj.familyName);
			params+="&imageurl="+ encodeURIComponent(obj.imageUrl);			
			params+="&device_id="+ encodeURIComponent(getStorage("device_id"));
			
			if (isDebug()){
	      	  params+="&device_platform=Android";
	        } else {
	      	  params+="&device_platform="+ encodeURIComponent(device.platform);
	        }
	                
			if ( $(".next_steps").exists()){
	            params+="&next_steps="+ encodeURIComponent($(".next_steps").val());        
	        }	        			        
			callAjax("googleLogin", params );	    	
	    },
	    function (msg) {
	    	// FAILED
	    	switch(msg){
	    	   case "10":	
	    	   case 10:
	    	   case "16":	
	    	   case 16:
	    	     err_msg = getTrans('error has occured. android keystore not valid','invalid_keystore');
	    	     err_msg+=". "+ getTrans("error code:",'error_code') + msg;
/*Atualização Master Hub (Tradução)*/
	    	     toastMsg('error: ' + err_msg);
/*Fim da atualização*/
	    	   break;
	    	   	
	    	   default:
	    	   toastMsg( getTrans('error has occured. error number','error_has_occured') + ' : ' + msg);
	    	   break;	
	    	}	    	
	    });
	}
}

var lazyFoodCategory = {
  createItemContent: function(index, oldContent) {      	
  	  	
    var $element = $('<div id="foodcategory-results-'+index+'">'+spinner+'</div>');     
    getCategory(index);   
    return $element[0];    
  },
  calculateItemHeight: function(index) {  	
    return 50;
  },
  countItems: function() {  	
    return getStorage("category_count");
  },
  destroyItemContent: function(index, element) {
    console.log("Destroyed item " + index);
  }
}

function getCategory(index)
{
	var params='';
	action="getCategory";
	params+="&page="+index;	
	params+="&mtid="+  getStorage("merchant_id");
		
	/*add language use parameters*/
	params+="&lang_id="+getStorage("default_lang");
	params+="&lang="+getStorage("default_lang");
	if(!empty(krms_config.APIHasKey)){
		params+="&api_key="+krms_config.APIHasKey;
	}
		
	params+="&app_version=" + app_version;
	
	dump(ajax_url+"/"+action+"?"+params);		
    ajax_lazy = $.ajax({
		url: ajax_url+"/"+action, 
		data: params,
		type: 'post',                  
		async: false,
		dataType: 'jsonp',
		timeout: 8000,
		crossDomain: true,
	 beforeSend: function() {			 	
	},
	complete: function(data) {							
	},
	success: function (data) {		   
	   if (data.code=1){	   	
	   	
	   	   if ( $('#foodcategory-results-'+index).exists() ){
	   	
		   	   html='';
		   	   html+='<ons-list>';	   	  
/*Atualização Master Hub (Correção Menu de Categorias)*/
			fillPopOverCategoryList(data.details);
/*Fim da atualização*/
		   	   if (app_version>="2.4"){
		   	   	   if(data.details.show_cat_image==1){
		   	   	   	  $.each( data.details.data, function( key, val ) {
		   	   	   	  	 html+= '<ons-list-item onclick="loadmenu('+val.cat_id+','+val.merchant_id+');"  >';			   	   	   
                             html+= '<ons-row align="center">';
                               html+= '<ons-col class="col-image" width="90px">';
                                 html+='<img class="rounded_image" src="'+ val.photo_url +'">';
                               html+= '</ons-col>';
                               
                               html+= '<ons-col>';
                               html+= val.category_name;
                               html+= '<p class="small-font-dim small nomargin">'+val.category_description+'</p>';
                               
                               if($.isArray(val.dish_list)) {
                               	  html+='<div class="dish_wrap">';
                               	  $.each( val.dish_list, function( d_key, d_val ) {
                               	  	  html+='<div class="dish_col">';
                               	  	  html+='<img class="dish_icon" src="'+ d_val +'">';
                               	  	  html+='</div>';
                               	  });
                               	  html+='</div>';
                               }
                               
                               html+= '</ons-col>';
                               
                             html+= '</ons-row>';
			   	   	     html+= '</ons-list-item>';
		   	   	   	  });
		   	   	   } else {
		   	   	   	  $.each( data.details.data, function( key, val ) {
			   	   	   html+= '<ons-list-item onclick="loadmenu('+val.cat_id+','+val.merchant_id+');"  >';			   	   	   
				   	   	   html+= val.category_name;	   	   	   			   	   	   
			   	   	   html+= '</ons-list-item>';
			   	   });	   	   		   	   
		   	   	   }
		   	   } else {		   	       	  
			   	   $.each( data.details, function( key, val ) {
			   	   	   html+= '<ons-list-item onclick="loadmenu('+val.cat_id+','+val.merchant_id+');"  >';			   	   	   
				   	   	   html+= val.category_name;	   	   	   			   	   	   
			   	   	   html+= '</ons-list-item>';
			   	   });	   	   		   	   
		   	   }
		   	   
		   	   html+='</ons-list>';
		   	   createElement( 'foodcategory-results-'+index, html);
	   	   
	   	   } else {
			  dump('element not exist');
			  ajax_lazy.abort();
			  ajax_lazy = null;
			} 	  	   	   
	   } else {	   	  
	   	  $("#foodcategory-results-"+index).html(data.msg);
	   }
	},
	error: function (request,error) {	        
		hideAllModal();				
		$("#foodcategory-results-"+index).html( getTrans("Network error has occurred please try again!",'network_error') );		
	}
   });       	
}


var lazyItem = {
  createItemContent: function(index, oldContent) {      	
  	  	
    var $element = $('<div id="item-results-'+index+'">'+spinner+'</div>');     
    getItem(index);   
    return $element[0];    
  },
  calculateItemHeight: function(index) {  	
    return 50;
  },
  countItems: function() {  	
    return getStorage("item_count");
  },
  destroyItemContent: function(index, element) {
    console.log("Destroyed item " + index);
  }
}

function getItem(index)
{
	var params='';
	action="getItem";
	params+="&page="+index;	
	params+="&merchant_id="+  getStorage("merchant_id");
	params+="&cat_id="+  getStorage("selected_cat_id");
		
	/*add language use parameters*/
	params+="&lang_id="+getStorage("default_lang");
	params+="&lang="+getStorage("default_lang");
	if(!empty(krms_config.APIHasKey)){
		params+="&api_key="+krms_config.APIHasKey;
	}
		
	params+="&app_version=" + app_version;
	
	dump(ajax_url+"/"+action+"?"+params);
	
	ajax_lazy_item = $.ajax({
		url: ajax_url+"/"+action, 
		data: params,
		type: 'post',                  
		async: false,
		dataType: 'jsonp',
		timeout: 8000,
		crossDomain: true,
	beforeSend: function() {			 	
	},
	complete: function(data) {							
	},
	success: function (data) {	  	   
	   if (data.code=1){	   		  
	   	   if ( $('#item-results-'+index).exists() ){	      	  
	   	   	  dump('element  exist' + index);
	   	      displayItemByCategory(data.details, index);
	   	   } else {

			  dump('element not exist');
			  ajax_lazy_item.abort();
			  ajax_lazy_item = null;
			} 	  	   	   
	   } else {	   	  
	   	  $("#item-results-"+index).html(data.msg);
	   }
	},
	error: function (request,error) {	        
		hideAllModal();				
		$("#item-results-"+index).html( getTrans("Network error has occurred please try again!",'network_error') );		
	}
   });       	
	
}

function initCustomPages()
{
	lang = getStorage("default_lang");
	dump('initCustomPages');	
	var html='';
	custom_pages = getStorage("custom_pages");	
	if(!empty(custom_pages)){		
		custom_pages =  JSON.parse(custom_pages);
		if($.isArray(custom_pages)) {
			$.each( custom_pages , function( key, val ) {			
				
				title = val.title;
				if(!empty(lang)){				
				   var t = "lang_title_"+lang;
				   if ( array_key_exists(t,val) ){			   
					   title = val[t];
					   if(empty(title)){
					   	  title = val.title;
					   }
				   }
				}
				
				html+='<ons-list-item onclick="getPage('+val.page_id+');" class="bottom-menu-item">';
			      html+='<ons-icon icon="'+val.icon+'"></ons-icon> ';
			      html+='<span>'+title+'</span>';
			    html+='</ons-list-item>';
				
			});			
			createElement("custom_pages",html);
		}
	}
	
}

function getPage(page_id)
{	
	menu.setMainPage('custompage.html', {
		closeMenu: true,
		callback: function(index){				
			callAjax('getPages', "page_id=" + page_id );
	    }
	});	
}

function browseCamera()
{
	if(isDebug()){		
		loader.show();		
		setTimeout(function(){
			hideAllModal();
		 }, 3000);	
		return;
	}
	
	navigator.camera.getPicture(uploadPhoto, function(){
		//toastMsg( getTrans("Get photo failed","get_photo_failed") );
	},{
	    destinationType: Camera.DestinationType.FILE_URI,
	    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	    popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
    });
}

function uploadPhoto(imageURI)
{

	try {
	
		 loader.show();
		 
		 var options = new FileUploadOptions();
		 options.fileKey = "file";
		 options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
		 options.mimeType = "image/jpeg";
		 	 
		 var params = {};
		 params.client_token = getStorage("client_token") ;	 
		 options.params = params;
	 
		 options.chunkedMode = false;	
		 
		 var headers={'headerParam':'headerValue'};
		 options.headers = headers;
		
		 var ft = new FileTransfer();	 	 	 
		 
		 ft.onprogress = function(progressEvent) {
	     if (progressEvent.lengthComputable) {
	     	    //toastMsg( "progressEvent=>"+progressEvent.loaded + " - " + progressEvent.total );     	    
	     	    var loaded_bytes= parseInt(progressEvent.loaded);
	     	    var total_bytes= parseInt(progressEvent.total);
	     	    
	     	    var loaded_percent = (loaded_bytes/total_bytes)*100;	        
	     	    loaded_percent=Math.ceil(loaded_percent);
	     	    	       	        
		        $(".profile_title").html( getTrans("Uploading files",'upload_files') + "... " + loaded_percent+"%" );
		        
		    } else {	    		    	
		        //loadingStatus.increment();
		    }
		 };
		 	 
		 ft.upload(imageURI, ajax_url+"/UploadProfile", function(result){
		    //alert(JSON.stringify(result));
		    /*alert(result.responseCode);
		    alert(JSON.stringify(result.response));*/  
		    
		    var response=explode("|",result.response);
		    toastMsg(response[1]);	
		    
		    if ( response[0]=="1" || response[0]==1){	    	
		    	$(".avatar").attr("src", response[2] );
		    	setStorage("avatar", response[2] );
		    	imageLoaded('.img_loaded');
		    }
		    
		    $(".profile_title").html( getTrans("Profile",'profile') );
		    
		    setTimeout(function(){
				hideAllModal();
			 }, 2000);
		    
		 }, function(error){	 	
		 	 $(".profile_title").html( getTrans("Profile",'profile') );
		 	 hideAllModal();
		     toastMsg( getTrans("An error has occurred: Code","error_occured") + " "+ error.code);
		 }, options);
	 
	 } catch(err) {
       alert(err.message);       
     } 
}

function mercapagoSuccess(payment)
{
/*Atualização Master Hub (Mercado Pago)*/
	 if (payment != null){         
	 	//alert(JSON.stringify(payment));     
        //toastMsg(JSON.parse(payment).status);
		var params="payment_id="+JSON.parse(payment).id;
			params+="&resposta="+JSON.parse(payment).status;
			params+="&client_token="+ getStorage("client_token");
			params+="&order_id="+JSON.parse(payment).externalReference;
			params+="&merchant_id="+ getStorage("merchant_id");
		callAjax("MercadoPagoOK",params); 
/*Fim da atualização*/
    } else {
        toastMsg("The user did not make the payment");
    }
}

function mercapagoFailed(error)
{
/*Atualização Master Hub (Tradução)*/
	toastMsg("Erro do Plugin do Mercado Pago: " + error);
/*Fim da atualização*/
}

function setTrackView(pagename , campaign_details )
{
	
   var analytics_id = getStorage("analytics_id");
   var analytics_enabled = getStorage("analytics_enabled");
			
   if ( analytics_enabled == 1 && !empty(analytics_id)){
	   dump('setTrackView=>'+pagename);
	   try {   	
	      analytics.sendAppView(pagename, function(){
	      	 dump("ok");
	      }, function(){
	      	 dump("failed");
	      });		
	   } catch(err) {
	      dump(err.message);       
	   } 
   }         
}

function iOSeleven()
{	
	if ( device.platform =="iOS"){	
		version = parseFloat(device.version);		
		if ( version>=11 ){
			return true;
		}
	}
	return false;
}

function cancelCartOrder()
{
  if ( cart.length>0 ){		
	   ons.notification.confirm({
		  message: getTrans('Cancel current order?','cancel_order') ,	  
		  title: dialog_title_default ,
		  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
		  animation: 'default', // or 'none'
		  primaryButtonIndex: 1,
		  cancelable: true,
		  callback: function(index) {	  	       
		  	   if (index==0){	  	   	      	   	  
					sNavigator.popPage({cancelIfRunning: true}); 
		  	   }
		  }
		});
  } else {
  	  sNavigator.popPage({cancelIfRunning: true}); 
  }
}



function showPromoPage()
{
	if (typeof merhantPopOverMenu === "undefined" || merhantPopOverMenu==null || merhantPopOverMenu=="" ) {	     
	} else {
		merhantPopOverMenu.hide(); 
	}	
	var options = {
      animation: 'slide',
      onTransitionEnd: function() {       	 
      	      	 
      } 
    };   
    sNavigator.pushPage("page-promo.html", options);		
}



function showReviewsDialog(id)
{
	ons.ready(function() {
	  ons.createDialog('reviews-dialog.html').then(function(dialog) {	  	 
	  	  $(".review_id").val(id);
	      dialog.show();
	      translatePage();
	  });
	});
}

function editReview()
{
	dialog_reviews.hide();
	var id = $(".review_id").val();	
	var params="&client_token="+ getStorage("client_token")+"&id="+id;
    params+="&id=" + id;
    callAjax("getReview",params);	       
}

function deleteReview()
{	
	var id = $(".review_id").val();	
	ons.notification.confirm({
	  message: getTrans('Are you sure?','are_you_sure') ,	  
	  title: dialog_title_default,
/*Atualização Master Hub (Tradução)*/
	  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
/*Fim da atualização*/
	  animation: 'default', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {	  	
	    if ( index==0){	    	
	    	dialog_reviews.hide();
	        var params="&client_token="+ getStorage("client_token")+"&id="+id;
	        params+="&id=" + id;
	        callAjax("deleteReview",params);	       
	    }
	  }
	});	
}

function updateReview()
{
	$.validate({ 	
	    form : '#frm-edit_review',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      var params = $( "#frm-edit_review").serialize();	      
	      params+="&merchant_id=" +  getStorage("merchant_id") ;
	      params+="&client_token="+ getStorage("client_token");
	      callAjax("updateReview",params);	       
	      return false;
	    }  
	});
}

function showPage(pagename)
{
	var options = {
      animation: 'slide',
      onTransitionEnd: function() {       	  
      } 
   };   
   sNavigator.pushPage(pagename+".html", options);
}


function geoComplete2()
{
	dump( "country_code_set=>" + getStorage("country_code_set"));			
	if ( empty(getStorage("country_code_set")) ){				
		if(empty(getStorage("mobile_country_code"))){
		  $("#ss").geocomplete();		
		} else {
		  $("#ss").geocomplete({
		    country: getStorage("mobile_country_code")
	      });			 
	           
	      setStorage("country_code_set", getStorage("mobile_country_code") );
	      
		}				
	} else {				
		$("#ss").geocomplete({
		   country: getStorage("country_code_set")
	    });	
	}
}

function searchByAddress()
{
	search_mode = getSearchMode();	   
	var ss = $("#ss").val();
	/*clear all storage*/ 
    setStorage("search_address", ss );
    clearAllStorage();
    callAjax("initSearch","address="+ urlencode(ss) + "&search_mode=" + search_mode );			   
}

function searchByName()
{
	var ss_restaurant_name = $("#ss_restaurant_name").val();
	
	if(empty(ss_restaurant_name)){
		toastMsg( getTrans("Restaurant name is required","restaurant_name_is_required") );
		return;
	}
	
	clearAllStorage();
	if(!empty(getStorage("search_address"))){
	    search_address = getStorage("search_address");
	} else  search_address = '';
	global_filter_params = "&address=" + search_address +  "&stype=1&sname="+ ss_restaurant_name ;
	callAjax("initSearch","address="+ search_address + "&search_mode=" + search_mode + "&sname="+ ss_restaurant_name + "&stype=1" );			   
}

function searchByStreet()
{
	var ss_street = $("#ss_street").val();
	
	if(empty(ss_street)){
		toastMsg( getTrans("Street name is required","street_required") );
		return;
	}
	
	clearAllStorage();
	if(!empty(getStorage("search_address"))){
	    search_address = getStorage("search_address");
	} else  search_address = '';
	global_filter_params = "&address=" + search_address +  "&stype=2&ss_street="+ ss_street ;
	callAjax("initSearch","address="+ search_address + "&search_mode=" + search_mode + "&ss_street="+ ss_street + "&stype=2" );
}

function searchByCuisine()
{
	var ss_cuisine = $("#ss_cuisine").val();
	
	if(empty(ss_cuisine)){
		toastMsg( getTrans("Cuisine name is required","cuisine_required") );
		return;
	}
	
	clearAllStorage();
	if(!empty(getStorage("search_address"))){
	    search_address = getStorage("search_address");
	} else  search_address = '';
	global_filter_params = "&address=" + search_address +  "&stype=3&ss_cuisine="+ ss_cuisine ;
	callAjax("initSearch","address="+ search_address + "&search_mode=" + search_mode + "&ss_cuisine="+ ss_cuisine + "&stype=3" );
}

function searchByFoodName()
{
	var ss_item_name = $("#ss_item_name").val();
	
	if(empty(ss_item_name)){
		toastMsg( getTrans("Food name is required","foodname_required") );
		return;
	}
	
	clearAllStorage();
	if(!empty(getStorage("search_address"))){
	    search_address = getStorage("search_address");
	} else  search_address = '';
	global_filter_params = "&address=" + search_address +  "&stype=4&ss_item_name="+ ss_item_name ;
	callAjax("initSearch","address="+ search_address + "&search_mode=" + search_mode + "&ss_item_name="+ ss_item_name + "&stype=4" );
}

/*END CLEAN OF CODE*/




/*4.6 CODE*/

function t(words,words_key){
	return getTrans(words,words_key);
}

initPush = function(re_init){
	
	try {
	
		push = PushNotification.init({
			android: {
				sound : "true",
				clearBadge : "true"
			},
		    browser: {
		        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
		    },
			ios: {
				alert: "true",
				badge: "true",
				sound: "true",
				clearBadge:"true"
			},
			windows: {}
	    });
	    
	    push.on('registration', function(data) {   	  	
	    	/*CHECK IF SAME DEVICE ID*/	    	
	    	if(re_init){	    		
		    	old_device_id = getStorage("device_id");
		    	dump(old_device_id +"=>" + data.registrationId );
	    		if (old_device_id!=data.registrationId){	    			
	    			sendPost('reRegisterDevice', "new_device_id="+ data.registrationId);
	    		}
	    	} else {	    		
	    	   setStorage("device_id", data.registrationId ); 	
	    	}	    	 
		});
		
		 push.on('notification', function(data){     
	   	   //alert(JSON.stringify(data));   	
		   if ( data.additionalData.foreground ){
	    		playSound();
	       } 
	                       	  
	       handleNotification(data);
	       
	    });
	    
	    PushNotification.createChannel(function(){
	    	//alert('create channel succces');
	    }, function(){
	    	//alert('create channel failed');
	    },{
	    	 id: 'kmrs_channel',
	         description: 'mobile app channel',
	         importance: 5,
	         vibration: true,
	         sound : 'beep'
	      }
	    );
	    
	    push.on('error', function(e) {      
	     	 alert(e.message);
		});
    
	} catch(err) {
       alert(err.message);
    } 
};

playSound = function(){		 
	 try {	 		 	 
		 url = 'file:///android_asset/www/beep.wav';			 
		 if(device_platform=="iOS"){
		 	url = "beep.wav";
		 }
		 //alert(url);
		 my_media = new Media(url,	        
	        function () {
	            dump("playAudio():Audio Success");
	            my_media.stop();
	            my_media.release();
	        },	        
	        function (err) {
	            dump("playAudio():Audio Error: " + err);
	        }
	    );	    
	    my_media.play({ playAudioWhenScreenIsLocked : true });
	    my_media.setVolume('1.0');
    
    } catch(err) {
       alert(err.message);
    } 
};

handleNotification = function(data){
	//var push_type = data.additionalData.push_type;	
	toastMsg(data.title+"\n"+data.message);
	
	/*SET THE COUNT FOR NOTIFICATION BADGE*/	
	setNotificationCount();
};

fbInit = function(){
	try {
		
		facebookConnectPlugin.getLoginStatus(function(status){
			//alert(JSON.stringify(status)); 
			if (status.status=="connected"){			
				fbRegister( status.authResponse.userID );	
			} else {
				fbLogin();
			}
		}, function(error){
		   	onsenAlert( t("an error has occured","an_error_has_occured") + " "+ JSON.stringify(error) );
		});	
		
	} catch(err) {
       onsenAlert(err.message);
    } 
};

fbLogin = function(){	
	facebookConnectPlugin.login(["public_profile","email"], function(data){
		//alert(JSON.stringify(data)); 		
		fbRegister( data.authResponse.userID );		 
	}, function(error){
		//alert(JSON.stringify(error)); 		
		//cancel = error.errorCode  = 4201;		
		if(error.errorCode!=4201){
		   onsenAlert( t("an error has occured","an_error_has_occured") + " "+ JSON.stringify(error) );
		}
	});
};

fbRegister = function(userID){	
	facebookConnectPlugin.api(userID+"/?fields=id,email,first_name,last_name", ["public_profile","email"], 
	function(data){
		//alert(JSON.stringify(data)); 		
		params = "email="+ data.email ;
		params+= "&first_name="+ data.first_name ;
		params+= "&last_name="+ data.last_name ;
		params+= "&fbid="+ data.id ;
		    
		if ( $(".next_steps").exists()){
	       params+="&next_steps="+ encodeURIComponent($(".next_steps").val());  
	    }	 
				
		callAjax('registerUsingFb', params );
		
	}, function(error){
		onsenAlert( t("an error has occured","an_error_has_occured") + " "+ JSON.stringify(error) );
	});
};


fbLogout = function(){		
	try{
		facebookConnectPlugin.getLoginStatus(function(status){
			//alert(JSON.stringify(status)); 
			if (status.status=="connected"){			
				facebookConnectPlugin.logout(function(success){
					//alert(JSON.stringify(success)); 
				}, function(error){				
				});
			} 
		}, function(error){	   	
		});
			
	} catch(err) {
       //alert(err.message);
    } 
};

var map_bounds = [];
var map_style = [ {stylers: [ { "saturation":-100 }, { "lightness": 0 }, { "gamma": 1 } ]}];
var marker_dragable;
var marker_track_destination;
var marker_track_driver;
var marker_track_dropoff;

getMapIcons = function(){
	
	var destination_icon =  getStorage("destination_icon");
	var from_icon =  getStorage("from_icon");
	
	if(empty(destination_icon)){
		destination_icon = 'http://maps.gstatic.com/mapfiles/markers2/marker.png';
	}
	if(empty(from_icon)){
		from_icon = 'http://maps.gstatic.com/mapfiles/markers2/icon_green.png';
	}
	
	return {
		'destination_icon':destination_icon,
		'from_icon':from_icon
	};
	
};

initMap = function(map_type){
	
	//toastMsg("map_type =>" + map_type);
	dump("map_type =>" + map_type);
	
	/*var destination_icon =  getStorage("destination_icon");
	var from_icon =  getStorage("from_icon");
	
	if(empty(destination_icon)){
		destination_icon = 'http://maps.gstatic.com/mapfiles/markers2/marker.png';
	}
	if(empty(from_icon)){

		from_icon = 'http://maps.gstatic.com/mapfiles/markers2/icon_green.png';
	}*/

	icons = getMapIcons();
	
	var country_code_set=getStorage("country_code_set");
    if ( empty(getStorage("country_code_set")) ){
	    country_code_set='';
    } 		
	
	switch(map_type){
		case "merchant_map":
		
		lat = getStorage("merchant_latitude");
	    lng = getStorage("merchant_longtitude");
	    merchant_name = getStorage("merchant_name");
	    delivery_address = getStorage("merchant_address");
	    
	    dump("merchant location =>"+lat + " => "+  lng);
	    
	    try {
	    	
	       map_bounds = [];
	       
	       $(".destination_lat").val( lat );
	       $(".destination_lng").val( lng );
	    	
	       options = {
			  div: ".map_canvass",
			  lat: lat,
			  lng: lng,
			  disableDefaultUI: true,
			  styles: map_style ,
		   };
			
	       map = new GMaps(options);
	       
	       info_html = '<p><b>'+merchant_name+"<br/></b>";
	       info_html += delivery_address+'</p>';
	       
	       var infoWindow = new google.maps.InfoWindow({
		    content: info_html
		   });		
	       
	       marker =  map.addMarker({
			  lat: lat,
			  lng: lng,
			  infoWindow: infoWindow,
			  icon: icons.destination_icon
		   });
		   
		   infoWindow.open(map, marker);
		   
		   var latlng = new google.maps.LatLng( lat , lng );
		   map_bounds.push(latlng);
		   
		   /*GET USER LOCATION*/		   
		   navigator.geolocation.getCurrentPosition( function(position){
		   	 
		   	  var your_lat = position.coords.latitude;
              var your_lng = position.coords.longitude;
              
              $(".origin_lat").val( your_lat );
	          $(".origin_lng").val( your_lng );
	       
              dump("your location =>"+your_lat + " => "+  your_lng);
              
              var infoWindow = new google.maps.InfoWindow({
		       content: getTrans('You are here','you_are_here') 
		      });		
		   
              marker2 =  map.addMarker({
			    lat: your_lat,
			    lng: your_lng,
			    infoWindow: infoWindow,			    	 
			    icon : icons.from_icon
		      });
		      infoWindow.open(map, marker2);
		      
		      dump("done adding location marker");
		      
		      var latlng = new google.maps.LatLng( your_lat , your_lng );
		      map_bounds.push(latlng);
		      
		      setMapCenter();		      
		      map.cleanRoute();
		      
		      map.drawRoute({
			    origin: [your_lat , your_lng ],
 			    destination: [ lat , lng ],
			    travelMode: 'driving',
			    strokeColor: '#131540',
			    strokeOpacity: 0.6,
			    strokeWeight: 6
			  });		
		   	 
		   },geolocationError, 
	       { timeout: 60000 , enableHighAccuracy: getLocationAccuracy(), maximumAge:Infinity } );	
		   
	    	
		} catch(err) {		
	        toastMsg(err.message);
	    }     
		break;
		
		case "select_address_from_map":
		case "delivery_map":
		
		   lat = getStorage("merchant_latitude");
	       lng = getStorage("merchant_longtitude");
	       
	       dump("merchant location =>"+lat + " => "+  lng);
	       
	       try {
              	
			   
	       	   $(".search_address_geo").geocomplete({
		          country: country_code_set
	           }).bind("geocode:result", function(event, result){
	          	   s_lat = result.geometry.location.lat();
	               s_lng = result.geometry.location.lng();	
	               dump("search location =>"+s_lat + " => "+  s_lng);	
	               
	               map.removeMarkers(); 				  	  				  	  
				   marker_dragable =  map.addMarker({
						  lat: s_lat ,
						  lng: s_lng,						  
				   });					   

				   map.setCenter(s_lat,s_lng);
				         
	           });	           
	           
		       options = {
				  div: ".map_canvass",
				  lat: lat,
				  lng: lng,
				  disableDefaultUI: true,
				  styles: map_style ,
				  dragend: function(event) {
				  	  var location = map.getCenter(); 
				  	  map.removeMarkers(); 				  	  				  	  
				  	   marker_dragable =  map.addMarker({
						  lat: location.lat() ,
						  lng: location.lng(),
						  infoWindow: infoWindow,				  			 
					  });					  
				  }
			   };
			   
			   map = new GMaps(options);
			   
		 			   	          
	           /*GET USER LOCATION*/		   
		       navigator.geolocation.getCurrentPosition( function(position){
		       	
		       	  var your_lat = position.coords.latitude;
                  var your_lng = position.coords.longitude;
                                              
                  dump("your location =>"+your_lat + " => "+  your_lng);
                  
                  marker_dragable =  map.addMarker({
					  lat: your_lat,
					  lng: your_lng	,					  
				  });
				  
				  map.setCenter(your_lat,your_lng);
		       	
	           }, function(){
	           	  // GET LOCATION HAS FAILED
	           	  //toastMsg("failed getting location");
	           	  marker_dragable =  map.addMarker({
					  lat: lat,
					  lng: lng					  					 
				  });
				  
				  map.setCenter(your_lat,your_lng);
				  
	           }, 
	           { timeout: 60000 , enableHighAccuracy: getLocationAccuracy(), maximumAge:Infinity } );	
	       	
	       } catch(err) {		
	        toastMsg(err.message);
	       }     
	    
		break;
				
		
		default:
		  toastMsg( getTrans("Undefined map type","undefined_map_type") );
		break;
	}	
	
};


setMapBound = function(lat, lng){
	var latlng = new google.maps.LatLng( lat , lng );
    map_bounds.push(latlng);
};

setMapCenter = function(){			
	map.fitLatLngBounds(map_bounds);
};

viewExternalDirection = function(){
	try {
		
		var origin_lat = $(".destination_lat").val();
	    var origin_lng = $(".destination_lng").val();
	
		launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function(isAvailable){
		    var app;
		    if(isAvailable){
		        app = launchnavigator.APP.GOOGLE_MAPS;
		    }else{		        
		        app = launchnavigator.APP.USER_SELECT;
		    }
		    launchnavigator.navigate( [origin_lat, origin_lng] , {
		        app: app
		    });
		});
		
	} catch(err) {
       toastMsg(err.message);
    } 
};

useThisLocation = function(){	
	var lat = marker_dragable.getPosition().lat();
    var lng = marker_dragable.getPosition().lng();
    dump("marker location =>"+lat + " => "+  lng);
    
    usethislocation_lat = lat;
    usethislocation_lng = lng;
    
    callAjax("useThisLocation","lat=" + lat + "&lng="+ lng );	 
};

initTrackingMap = function(){
	
	
	$(".driver_avatar").attr("src", $(".driver_avatar").val() );
    $("._driver_name").html( $(".driver_name").val() );
    $(".call_driver").attr("href","tel:"+ $(".driver_phone").val() ); 
	
	var task_lat=$(".task_lat").val();
	var task_lng=$(".task_lng").val();
	
	icons = getMapIcons();
	dump(icons);
	
	dump("task location =>"+task_lat + " => "+  task_lng);
	
	options = {
	  div: "#map_canvas_track",
	  lat: task_lat,
	  lng: task_lng ,
	  disableDefaultUI: true,
	  styles: map_style ,
    };       
    
    setMapBound(task_lat,task_lng);
	
    map = new GMaps(options);
    
    infoWindow =  createInfoWindow( getTrans("Destination",'destination') ) ;
    
    marker_track_destination =  map.addMarker({
	  lat: task_lat,
	  lng: task_lng,
	  infoWindow: infoWindow,
	  icon: icons.destination_icon
	});
	
	infoWindow.open(map, marker_track_destination);
	
	/*DRIVER LOCATION*/
	driver_lat = $(".driver_lat").val();
	driver_lng = $(".driver_lng").val();
	
	if(!empty(driver_lat)){	
		infoWindow =  createInfoWindow( getTrans("Courier",'courier') );    
		marker_track_driver =  map.addMarker({
		  lat: driver_lat,
		  lng: driver_lng,
		  infoWindow: infoWindow,
		  icon: icons.from_icon
		});		
		
		infoWindow.open(map, marker_track_driver);
		
		setMapBound(driver_lat,driver_lng);
	}	
	
	/*DROPOFF LOCATION*/
	dropoff_lat = $(".dropoff_lat").val();
	dropoff_lng = $(".dropoff_lng").val();
	
	if(!empty(dropoff_lat)){	
		infoWindow =  createInfoWindow( getTrans("Dropoff",'dropoff') );    
		marker_track_dropoff =  map.addMarker({
		  lat: dropoff_lat,
		  lng: dropoff_lng,
		  infoWindow: infoWindow,		  
		});				
		infoWindow.open(map, marker_track_dropoff);		
		setMapBound(dropoff_lat,dropoff_lng);
	}	
	
	
	/*DRAW ROUTE*/
	if(!empty(driver_lat)){
		if(!empty(dropoff_lat)){
		  map.drawRoute({
		    origin: [driver_lat , driver_lng ],
			destination: [ dropoff_lat , dropoff_lng ],
		    travelMode: 'driving',
		    strokeColor: '#131540',
		    strokeOpacity: 0.6,
		    strokeWeight: 6
		  });		
		  
		  map.drawRoute({
		    origin: [dropoff_lat , dropoff_lng ],
			destination: [ task_lat , task_lng ],
		    travelMode: 'driving',
		    strokeColor: '#131540',
		    strokeOpacity: 0.6,
		    strokeWeight: 6
		  });				  		  
		} else {
		   map.drawRoute({
		    origin: [driver_lat , driver_lng ],
			destination: [ task_lat , task_lng ],
		    travelMode: 'driving',
		    strokeColor: '#131540',
		    strokeOpacity: 0.6,
		    strokeWeight: 6
		  });		
		}
	}
		
	setMapCenter();		
	track_order_map_interval = setInterval(function(){runTrackMap()}, 10000);
};

createInfoWindow = function(info_html){
	return new google.maps.InfoWindow({
	      content: info_html
	});	
};

ReInitTrackingMap = function(data){
	dump(data);
	marker_track_driver.setPosition( new google.maps.LatLng( data.driver_lat , data.driver_lng ) );
	track_order_map_interval = setInterval(function(){runTrackMap()}, 10000);
};

loadOrderDetails = function(){
   var options = {
      animation: 'slide',
      order_id : $(".order_option_order_id").val(),
      onTransitionEnd: function() {         	   	 
      } 
   };   
   sNavigator.pushPage("order_details.html", options);
};

requestCancelOrder = function(){
	var page = sNavigator.getCurrentPage();	 
    order_id = page.options.order_id
    
    ons.notification.confirm({
	  message: getTrans("Are you sure","are_you_sure") +"?",	  
	  title: dialog_title_default ,
	  buttonLabels: [ getTrans('Yes','yes') ,  getTrans('No','no') ],
	  animation: 'default', 
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	      if(index<=0){
	      	 callAjax("requestCancelOrder", "order_id=" +  order_id );	
	      }
	  }
	});
};

showPopUpOptions = function(action_type){	
	
	setStorage("popup_options_action" , action_type  );
	
	if (typeof dialog_popup_options === "undefined" || dialog_popup_options==null || dialog_popup_options=="" ) { 	    
		ons.createDialog('popup_options.html').then(function(dialog) {
	        dialog.show();	        
	        translatePage();
	    });		    
	} else {
		dump('already init');
		dialog_popup_options.show();		
	    loadOptionList();
	}	
};

displayOptionsList = function(data){
	dump(data);
	var htm='';
	htm+='<ons-list>';
	$.each( data.list, function( key, val ) {
		htm+='<ons-list-item modifier="tappable" onclick="setOptionValue(' + "'" + key + "'," + "'" + val + "'"  + ');" >';
		   htm+= '<span class="small-font-dim">'+val+'</span>';
		htm+='</ons-list-item>';
	});
	htm+='</ons-list>';	
	createElement('options_list',htm);	
	translatePage();
};

setOptionValue = function(key, value){
	
	dump(key+"=>"+value);
	option_type = getStorage("popup_options_action");
	dump(option_type);
	switch(option_type){
		case "DateList":
		  $(".delivery_date").val(key);
		  $(".cart_delivery_date_value").html(value);
		break;
		
		case "TimeList":
		  $(".delivery_time").val(key); 
		  $(".cart_delivery_time_value").html(value);
		break;
	}
	dialog_popup_options.hide();
};

loadOptionList = function(){	
    $(".options_list").html('');
	params = "option_type=" + getStorage("popup_options_action");
	params+= "&merchant_id=" + getStorage('merchant_id');
	params+= "&delivery_date=" + $(".delivery_date").val();
	callAjax("loadOptionList", params );				   
};

showReviewForm = function(){
	var options = {
      animation: 'slide',      
      order_id: $(".order_option_order_id").val()
   };   
   sNavigator.pushPage("addReviews.html", options);
};

saveAddressBookLocation = function(){
	
	$.validate({ 	
	    form : '#frm_addressbook_location',    
	    borderColorOnError:"#FF0000",
	    onError : function() {      
	    },	    
	    onSuccess : function() {     	      
	      var params = $( "#frm_addressbook_location").serialize();	      	      
	      params+="&client_token="+ getStorage("client_token");
	      callAjax("saveAddressBookLocation",params);	       
	      return false;
	    }  
	});
	
};

deleteAddressBookLocation = function(){
	
	ons.notification.confirm({
	  message: getTrans('Delete this records?','delete_this_records') ,	  
	  title: dialog_title_default,
	  buttonLabels: ['Yes', 'No'],
	  animation: 'default', // or 'none'
	  primaryButtonIndex: 1,
	  cancelable: true,
	  callback: function(index) {
	  	dump(index);
	    if ( index==0){
	    	var id=$(".id").val();		
	        var params="&client_token="+ getStorage("client_token")+"&id="+id;
	        callAjax("deleteAddressBookLocation",params);	       
	    }
	  }
	});	
};

showAddressBookLocation = function(){
	
	if (typeof popup_address_location === "undefined" || popup_address_location==null || popup_address_location=="" ) { 	    
		ons.createDialog('popup_address_location.html').then(function(dialog) {
	        dialog.show();	        
	        translatePage();
	    });		    
	} else {
		dump('already init');
		popup_address_location.show();	    
		getAddressBookLocation();
	}	
	
};

getAddressBookLocation = function(){
	var params="client_token="+ getStorage("client_token");
    callAjax("getAddressBookLocation",params);	
};

setAddressLocation = function(id){
	var params="client_token="+ getStorage("client_token") +"&id="+ id;
    callAjax("setAddressLocation",params);	
};


pushUnregister = function(){
	dump("pushUnregister");
	try {	
		push.unregister(function(){			
			dump('unregister ok');
			setStorage("push_unregister",1);
		},function(error) {   	   	   	   	   
			dump('unregister error');
	    });		
		
	} catch(err) {
       alert(err.message);       
    } 
};

checkDeviceRegister = function(){	
	push_unregister = getStorage("push_unregister");
	dump("push_unregister => "+ push_unregister);
	if (typeof push_unregister === "undefined" || push_unregister==null || push_unregister=="" || push_unregister=="null" ) {
		// do nothing
	} else {
		if(push_unregister==1){
			dump("Registered again");
			initPush(true);
		}
	}
};


sendPost = function(action,params){
		
	try {
		
		params+="&lang_id="+getStorage("default_lang");
		params+="&lang="+getStorage("default_lang");
		if(!empty(krms_config.APIHasKey)){
			params+="&api_key="+krms_config.APIHasKey;
		}
		
		params+="&app_version="+ app_version;
		
		var device_id=getStorage("device_id");
		if(!empty(device_id)){
			params+="&device_id="+device_id;
		}
		
		if (isDebug()){
	  	  params+="&device_platform=Android";
	    } else {
	  	  params+="&device_platform="+ encodeURIComponent(device.platform);
	    }	 
		
	    client_token = getStorage("client_token");
	    if(!empty(client_token)){
	       params+="&client_token="+ client_token;
	    }
	    	
		//alert(ajax_url+"/"+action+"?"+params);
		
		var send_post_ajax = $.ajax({
		  url: ajax_url+"/"+action, 
		  method: "GET",
		  data: params,
		  dataType: "jsonp",
		  timeout: 20000,
		  crossDomain: true,
		  beforeSend: function( xhr ) {       
	      }
	    });
	    
	    send_post_ajax.done(function( data ) {
	    	 //alert(JSON.stringify(data));
	    	 if(data.code==1){
	    	 	setStorage("device_id", data.details ); 
	    	 	removeStorage("push_unregister");
	    	 } else {    	 
	    	 	// do nothing	
	    	 }
	    });
	    
	    send_post_ajax.always(function() {        
	    	send_post_ajax=null;   
	    });
	          
	    /*FAIL*/
	    send_post_ajax.fail(function( jqXHR, textStatus ) {    	
	    	send_post_ajax=null;   	    	
	    });    
    
    } catch(err) {
       alert(err.message);       
    } 
};

initAutoLocation = function(){
	mobile_auto_location = getStorage("mobile_auto_location");
	if(mobile_auto_location==1){
	   getCurrentLocation();
	}
};

setTrackingAccount = function(){
	
	try {
				
		var analytics_id = getStorage("analytics_id");
		var analytics_enabled = getStorage("analytics_enabled");
				
		if ( analytics_enabled == 1 && !empty(analytics_id)){		
			analytics = navigator.analytics;
			analytics.setTrackingId(analytics_id);
		}
		
	} catch(err) {
       alert(err.message);       
    } 	 
};

showNotificationPage = function(){	
	menu.setMainPage('notifications.html',{
		closeMenu:true,
	    animation: 'slide',
	});
};

setNotificationCount = function(){	
	current_count = getStorage("notification_count");
	if (typeof current_count === "undefined" || current_count==null || current_count=="" || current_count=="null" ) {
		current_count =1;
	} else current_count++;
		
	setStorage("notification_count",current_count);	
	setNotificationDisplay();
};

clearNotificationCount = function(){
	removeStorage("notification_count");
};

setNotificationDisplay = function(){
	current_count = getStorage("notification_count");	
	if (typeof current_count === "undefined" || current_count==null || current_count=="" || current_count=="null" ) {		
		setTimeout(function(){ 
		    $(".notification_count").html( '' );
	     }, 100);
	} else {
		dump('set number =>' + current_count);		
		 setTimeout(function(){ 
		    $(".notification_count").html( current_count );
	     }, 100);
	}
};

openWindow = function(url){	
   if(!isDebug()){			    		
		var iab = cordova.InAppBrowser;
		iab.open( url  , '_system');  
	} else {
	    window.open(url);
	}
};

proceedPaymentOptions = function(){
	var lat = marker_dragable.getPosition().lat();
    var lng = marker_dragable.getPosition().lng();
    $(".google_lat").val( lat );
    $(".google_lng").val( lng );    
	sNavigator.popPage({cancelIfRunning: true}); 
};
var lazyLoadSearch = {
  createItemContent: function(index, oldContent) {      	
  	
  	search_total = getStorage("search_total_raw");
  	if(!empty(search_total)){
  		$(".result-msg").text(search_total+" "+getTrans("Restaurant found",'restaurant_found') );
  	}  	  	
    var $element = $('<div id="results-'+index+'">'+spinner+'</div>');     
    getSearchMerchant(index);   
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

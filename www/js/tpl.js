function privatePriceRowWithRadio(radio_name,radio_value,label,price,ischecked)
{
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
    htm+='<ons-row class="row">';
     htm+='<ons-col class="concat-text" width="79%">';
       htm+='<label class="radio-button checkbox--list-item">';
	     htm+='<input type="radio" name="'+radio_name+'" class="'+radio_name+'" value="'+radio_value+'" '+ischecked+' >';
	     htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
	   htm+='</label>';
	  htm+='</ons-col>';	
	  htm+='<ons-col class="text-right" ><price>'+price+'</price></ons-col>';
    htm+='</ons-row>';
    htm+='</ons-list-item>';
    return htm;
}

function privatePriceRowWithRadio2(radio_name,radio_value,label,price,ischecked)
{
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
    htm+='<ons-row class="row">';
     htm+='<ons-col class="concat-text" width="50%">';
       htm+='<label class="radio-button checkbox--list-item">';
	     htm+='<input type="radio" name="'+radio_name+'" class="'+radio_name+'" value="'+radio_value+'" '+ischecked+' >';
	     htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
	   htm+='</label>';
	  htm+='</ons-col>';	
	  htm+='<ons-col class="text-right" >'+price+'</ons-col>';
    htm+='</ons-row>';
    htm+='</ons-list-item>';
    return htm;
}

function subItemRowWithRadio(subcat_id,radio_name,radio_value,label,price,ischecked , description)
{
	
	var show_addon_description=getStorage("show_addon_description");	
	
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
    htm+='<ons-row class="row">';
    
     if(show_addon_description==1){
        htm+='<ons-col class="concat-text" width="10%">';
     } else {
     	htm+='<ons-col class="concat-text" width="60%">';
     }
     
       htm+='<label class="radio-button checkbox--list-item">';
	     htm+='<input type="radio" name="'+radio_name+subcat_id+'" class="'+radio_name+' sub_item_name_'+subcat_id+'" value="'+radio_value+'" '+ischecked+' data-id="'+subcat_id+'"  >';
	     htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
	     
	     if(show_addon_description!=1){
	     htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
	     }
	     
	   htm+='</label>';
	  htm+='</ons-col>';	
	  
	  if(show_addon_description==1){
	     htm+='<ons-col class="small-font-dim" width="30%" style="margin-top:10px;" >'+getTrans(label, label)+'</ons-col>';
	  }
	  
	  if(empty(description)){
	  	description='';
	  }
	  
	  if(show_addon_description==1){
	  htm+='<ons-col class="small-font-dim" width="40%" style="margin-top:10px;padding-left:5px;" >'+description+'</ons-col>';
	  }	  
	  
	  if(show_addon_description==1){
	    htm+='<ons-col class="text-right" width="20%" ><price>'+price+'</price></ons-col>';
	  } else {
	  	htm+='<ons-col class="text-right" ><price>'+price+'</price></ons-col>';
	  }
    htm+='</ons-row>';
    htm+='</ons-list-item>';
    return htm;
}

function subItemRowWithCheckbox(subcat_id, radio_name, radio_value, label, price, multi_option_val, description )
{
/*Atualização Master Hub (Correção Descrição)*/
	
	var show_addon_description=getStorage("show_addon_description");	
		
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
    htm+='<ons-row class="row">';
     	htm+='<ons-col class="concat-text" width="56%">';

       htm+='<label class="checkbox checkbox--list-item">';
	     htm+='<input type="checkbox" name="'+radio_name+'" class="sub_item_custom '+radio_name+' sub_item_name_'+subcat_id+' " value="'+radio_value+'" data-id="'+subcat_id+'" data-multi="'+multi_option_val+'"  >';
	     htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
	   htm+='</label>';
	  htm+='</ons-col>';
/*Fim da atualização*/	 
		  	htm+='<ons-col class="text-right" ><price>'+price+'</price></ons-col>';
	  	  
	  if(show_addon_description==1){
	     htm+='<ons-row class="small-font-dim" style="margin-top:-2px;font-size: 11px;" >'+description+'</ons-row>';
	  }
	  if(show_addon_description==1 || empty(description)){
	  	description='';
	  }	
	  
    htm+='</ons-row>';
    htm+='</ons-list-item>';
    return htm;

}

function subItemRowWithCheckboxSabor(subcat_id, radio_name, radio_value, label, price, limite_sabores, description, result_obj)
{
/*Atualização Master Hub (Correção Descrição)*/
	
	var show_addon_description=getStorage("show_addon_description");	
		
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
    htm+='<ons-row class="row">';
     	htm+='<ons-col class="concat-text" width="56%">';

       htm+='<label class="checkbox checkbox--list-item">';
	     htm+='<input type="checkbox" name="'+radio_name+'" class="sub_item_sabor '+radio_name+' sub_item_name_'+subcat_id+' " value='+radio_value+' data-id="'+subcat_id+'" data-multi="'+limite_sabores+'" data-nome_produto="'+label+'" data-sabores="limitado"  >';
	     htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
	   htm+='</label>';
	  htm+='</ons-col>';
/*Fim da atualização*/	 
		  	htm+='<ons-col class="text-right" ><price>'+result_obj+'</price></ons-col>';
	  	  
	  if(show_addon_description==1){
	     htm+='<ons-row class="small-font-dim" style="margin-top:-2px;font-size: 11px;" >'+description+'</ons-row>';
	  }
	  if(show_addon_description==1 || empty(description)){
	  	description='';
	  }	
	  
    htm+='</ons-row>';
    htm+='</ons-list-item>';
    return htm;

}

function subItemRowWithCheckboxQtd(subcat_id, radio_name, radio_value, label, price, multi_option_val, description )
{
/*Atualização Master Hub (Correção Descrição)*/
	var show_addon_description=getStorage("show_addon_description");	
		
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
    htm+='<ons-row class="row">';
/*Atualização Master Hub (Correção 2 Sabores)*/
     	htm+='<ons-col class="concat-text" width="56%">';

       htm+='<label class="checkbox checkbox--list-item">';
	     htm+='<input type="checkbox" name="'+radio_name+'" class="sub_item_custom_qty '+radio_name+' sub_item_name_'+subcat_id+' " value="'+radio_value+'" data-id="'+subcat_id+'" data-multi="'+multi_option_val+'" data-withqty="2" >';
	     htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
	   htm+='</label>';
	  htm+='</ons-col>';
/*Fim da atualização*/	 
		  	htm+='<ons-col class="text-right" ><price>'+price+'</price></ons-col>';
	  	  
	  if(show_addon_description==1){
	     htm+='<ons-row class="small-font-dim" style="margin-top:-2px;font-size: 11px;" >'+description+'</ons-row>';
	  }
	  if(show_addon_description==1 || empty(description)){
	  	description='';
	  }	
	  
    htm+='</ons-row>';
    htm+='</ons-list-item>';
    return htm;
}

function subItemRowWithCheckboxQty(subcat_id,radio_name,radio_value,label,price)
{
			
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
    htm+='<ons-row class="row">';
	
     htm+='<ons-col class="concat-text" width="56%">';
       htm+='<label class="checkbox checkbox--list-item">';
	     htm+='<input type="checkbox" name="'+radio_name+'" class="sub_item_custom_qty '+radio_name+' sub_item_name_'+subcat_id+'" " value="'+radio_value+'" data-id="'+subcat_id+'" data-withqty="2" >';
	     htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
	   htm+='</label>';
	  htm+='</ons-col>';

/*Atualização Master Hub (Tradução)*/
	htm+='<ons-col class="concat-text text-left quantidade" width="25%">';
     htm+='<ons-icon class="prod-qtd-menos" icon="ion-minus-circled"></ons-icon>';
	  htm+='<input disabled name="subitem-qty" type="number" style="padding-top: 10px; padding: 15px 0px 0px 0px;width: 12px!important;font-size: 10px;" class="text-center numeric_only small-input text-center text-input text-input--underbar subitem-qty " ';
      	  htm+='placeholder="quant." value="0">';
     htm+='<ons-icon class="prod-qtd-mais" icon="ion-plus-circled"></ons-icon>';		  
	  htm+='</ons-col>';
/*Fim da atualização*/
	  htm+='<ons-col class="text-right" ><price>'+price+'</price></ons-col>';
    htm+='</ons-row>';
    htm+='</ons-list-item>';
    return htm;
} 

function privateRowWithRadio(radio_name,radio_value,label)
{
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
       htm+='<label class="radio-button checkbox--list-item">';
	     htm+='<input type="radio" name="'+radio_name+'" class="'+radio_name+'" value="'+radio_value+'" >';
	     htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name"> '+label+'</p>';
	   htm+='</label>';
	htm+='</ons-list-item>';
	return htm;
}

function privateRowWithRadio2(radio_name,radio_value,label)
{
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
       htm+='<label class="radio-button checkbox--list-item">';
	     htm+='<input type="radio" name="'+radio_name+'" class="'+radio_name+'" value="'+radio_value+'" >';
	     htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name" style="font-size: 14px;"> '+label+'</p>';
	   htm+='</label>';
	htm+='</ons-list-item>';
	return htm;
}

function privateRowWithRadio3(radio_name,radio_value,label)
{
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
       htm+='<label class="radio-button checkbox--list-item">';
	     htm+='<input type="radio" name="'+radio_name+'" class="'+radio_name+'" value="'+radio_value+'" >';
	     htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name" style="font-size: 14px;"> '+label+'</p>';
	   htm+='</label>';
	htm+='</ons-list-item>';
	return htm;
}

function privateRowWithCheckbox(radio_name,class_name,radio_value,label)
{
	var htm='';
	htm+='<ons-list-item modifier="tappable">';
       htm+='<label class="checkbox checkbox--list-item">';
	     htm+='<input type="checkbox" name="'+radio_name+'" class="'+class_name+'" value="'+radio_value+'" >';
	     htm+='<div class="checkbox__checkmark checkbox--list-item__checkmark"></div>';
	     htm+='<p class="description item-name"> '+label+'</p>';
	   htm+='</label>';
	htm+='</ons-list-item>';
	return htm;
}

function cartFooter(currency_code)
{
  var htm='';  
  
  htm+='<div class="wrapper">';
      htm+='<div class="field-wrapper">';
      htm+='<textarea name="order_notes" class="trn order_notes text-input text-input--underbar" placeholder="'+getTrans("Special Instructions",'special_instruction')+'"></textarea>';
      htm+='</div>';
   htm+='</div>';   
   
   htm+='<ons-row class="row stic-align">';
      htm+='<ons-col class="concat-text text-right" width="25%">';
        htm+='<button class="button button--quiet" onclick="addCartQty(1)">';
          htm+='<ons-icon class="prod-qtd-menos" icon="ion-minus-circled"></ons-icon>';
        htm+='</button>';
      htm+='</ons-col>';

      htm+='<ons-col class="" width="10%">';
         htm+='<ons-row class="row grey-border-bottom">';
             htm+='<ons-col class="quantity-center trn" data-trn-key="quantity">Quantity</ons-col>';
             htm+='<ons-col>';
             htm+='<input name="qty" type="number" class="qty numeric_only text-input text-input--transparent" value="1">';
             htm+='</ons-col>';
         htm+='</ons-row>';
      htm+='</ons-col>';

      htm+='<ons-col class="concat-text" width="25%">';
         htm+='<button class="button button--quiet" onclick="addCartQty(2)">';
          htm+='<ons-icon class="prod-qtd-mais" icon="ion-plus-circled"></ons-icon>';
        htm+='</button>';
      htm+='</ons-col>';

      htm+='<ons-col class="total_value text-left" style="padding-left:25px" width="40%">'+ currency_code+'</ons-col>';
      
    htm+='</ons-row>';

    return htm
}

function cartFooter_coleta(currency_code)
{
  var htm='';  
  
  htm+='<div class="wrapper">';
      htm+='<div class="field-wrapper">';
      htm+='<textarea name="order_notes" class="trn order_notes text-input text-input--underbar" placeholder="'+getTrans("Special Instructions",'special_instruction2')+'"></textarea>';
      htm+='</div>';
   htm+='</div>';   
   
   htm+='<ons-row class="row stic-align" style="display:none">';

      htm+='<input name="qty" type="number" class="qty numeric_only text-input text-input--transparent" value="1">';
      htm+='<ons-col class="total_value text-left">'+ currency_code+'</ons-col>';
      
    htm+='</ons-row>';

    return htm
}
function tplCartRowNoBorder(item_id, item_name, price, pretty_price, qty, field_name,size,x ,price2, discount, category_id)
{	
   var htm='';
   htm+='<ons-list-item class="row-no-border">';
   htm+='<ons-row >';
	   htm+='<ons-col class="concat-text" width="73%">';
		 htm+='<input name="qty" type="number" class="item-qty qty numeric_only small-input text-center text-input text-input--underbar green bold"  style="padding-top: 13px; border-bottom: 1px solid #ddd;"';
/*Atualização Master Hub (Tradução)*/
		  htm+='placeholder="quant." value="'+qty+'" data-rowid="'+x+'">';
/*Fim da atualização*/
		  htm+='<input type="hidden" name="'+field_name+'" class="'
		  +field_name + ' price'+x + ' " value="'+price+'" >';		  
		  
		  htm+='<input type="hidden" name="item_id" class="item_id'+x+' " value="'+ item_id +'" >';
		  htm+='<input type="hidden" name="discount" class="discount'+x+' " value="'+ discount +'" >';
		  
		  htm+='<input type="hidden" name="category_id" class="category_id'+x+' " value="'+ category_id +'" >';

		  if (discount>0){
		  	  //price2='<price class="discount">'+ (parseFloat(price2)+parseFloat(discount)) +'</price> '+price2;
		  }
		  
		  /*alert(price2);
		  alert(size);*/
		  
		  if (empty(size))	{
/*Atualização Master Hub (Personalização)*/
		     htm+='<p class="description item-name concat-texto bold"><span class="qty-label vermelho">'+qty+"x </span>"+getTrans(item_name, item_name)+'</span></p>';
		  } else {
		  	htm+='<p class="description item-name concat-texto bold"><span class="qty-label vermelho">'+qty+"x </span>"+getTrans(item_name, item_name)+
/*Fim da atualização*/
		  	"</span></p><p class=\"description item-name concat-text bold\"> <size style=\"font-size: x-small; margin-top: -12px;\">- "+getTrans(size, size)+"</size>"
		  	+'</p>';
		  }
	   htm+='</ons-col>';
	   htm+='<ons-col class="text-right" ><price>'+pretty_price+'</price></ons-col>';
   htm+='</ons-row>';
   
   htm+='<ons-row class="row-del-wrap" >';
   htm+='<ons-col class="text-right" width="100%">';
   htm+='<ons-button modifier="quiet" class="delete-item" data-id="'+x+'"><ons-icon icon="fa-times"></ons-icon></ons-button>';
   htm+='</ons-col>';
   htm+='</ons-row>';
   
   htm+='</ons-list-item>';
   return htm;
}

function tplCartRowNoBorderSub(subcat_id, sub_item_id, item_name, price, pretty_price, qty, qty2,x )
{
   var htm='';
   htm+='<ons-list-item class="row-no-border subitem-row'+x+' ">';
   htm+='<ons-row >';
      htm+='<ons-col width="3%"></ons-col>';
	   htm+='<ons-col class="concat-text" width="60%">';
		 htm+='<input name="qty" type="number" class="subitem-qty'+x+' qty small-input text-center text-input text-input--underbar" ';
/*Atualização Master Hub (Tradução)*/
		  htm+='placeholder="quant." value="'+qty+'" data-qty="'+qty2+'" >';
/*Fim da atualização*/
		  htm+='<input type="hidden" name="subcat_id" class="subcat_id" value="'+subcat_id+'">';
		  htm+='<input type="hidden" name="sub_item_id" class="sub_item_id" value="'+sub_item_id+'">';
		  htm+='<input type="hidden" name="sub_item_price" class="sub_item_price" value="'+price+'">';
		  htm+='<input type="hidden" name="sub_item_name" class="sub_item_name" value="'+getTrans(item_name, item_name)+'">';
		  
/*Atualização Master Hub (Personalização)*/
		  htm+='<p class="description item-name concat-text"><span class="qty-label vermelho">'+qty+"x</span> "+getTrans(item_name, item_name)+'</p>';
/*Fim da atualização*/
	   htm+='</ons-col>';
	   htm+='<ons-col class="text-right" ><price>'+pretty_price+'</price></ons-col>';
   htm+='</ons-row>';
   htm+='</ons-list-item>';
   return htm;
}

function tplCartRow(label,price,class_name)
{
	var htm='';	
	htm+='<ons-list-item class="'+class_name+'">';
	  htm+='<ons-row >';
		   htm+='<ons-col class="concat-text" width="75%">';
			  htm+='<p class="description item-name concat-text">'+getTrans(label, label)+'</p>';
		   htm+='</ons-col>';
		   htm+='<ons-col class="text-right" ><price>'+price+'</price></ons-col>';
	   htm+='</ons-row>';
	htm+='</ons-list-item>';
	return htm;
}

function tplCartRow2(label,price,class_name)
{
	var htm='';	
	htm+='<ons-list-item class="'+class_name+'">';
	  htm+='<ons-row >';
		   htm+='<ons-col class="concat-text" width="77%">';
			  htm+='<p class="description item-name concat-text">'+getTrans(label, label)+'</p>';
		   htm+='</ons-col>';
		   htm+='<ons-col class="text-right" ><price>'+price+'</price></ons-col>';
	   htm+='</ons-row>';
	htm+='</ons-list-item>';
	return htm;
}

function tplCartRowHiddenFields(label, value, field_name, x, class_name)
{
	var htm='';	
	htm+='<ons-list-item class="'+class_name+' subitem-row'+x+' " >';
	  htm+='<ons-row >';
		   htm+='<ons-col class="concat-text" >';
		      htm+='<input type="hidden" name="'+field_name+x+'"  class="'+field_name+x+'" value="'+value+'" >';
			  htm+='<p class="description item-name concat-text">'+getTrans(label, label)+'</p>';
		   htm+='</ons-col>';		   
	   htm+='</ons-row>';
	htm+='</ons-list-item>';
	return htm;	
}

function initMobileScroller()
{	
/*Atualização Master Hub (Tradução e Formato de Datas)*/
	//https://docs.mobiscroll.com/jquery/select#localization
	if ( $('.delivery_date').exists()){
		$('.delivery_date').mobiscroll().date({
			theme: 'android-holo-light', 
			mode: "scroller",
			display: "modal",
			lang: "pt-BR",
			dateFormat : "d/m/Y",
			/*timeFormat:"HH:ii",
			timeWheels:"HHii"*/
		});
	}
	
	if ( $('.delivery_time').exists()){		
		$('.delivery_time').mobiscroll().time({
			theme: 'android-holo-light', 
			mode: "scroller",
			display: "modal",
			lang: "pt-BR",
			dateFormat : "d/m/Y",
			/*timeFormat:"HH:ii",
			timeWheels:"HHii"*/
		});
	}
		
	if ( $('.date_booking').exists()){
		$('.date_booking').mobiscroll().date({
			theme: 'android-holo-light', 
			mode: "scroller",
			display: "modal",
			lang: "pt-BR",
			dateFormat : "d/m/Y"
			/*timeFormat:"HH:ii",
			timeWheels:"HHii"*/
		});
	}
	
	if ( $('.booking_time').exists()){
		$('.booking_time').mobiscroll().time({
			theme: 'android-holo-light', 
			mode: "scroller",
			display: "modal",
			lang: "pt-BR",
			dateFormat : "d/m/Y"
			/*timeFormat:"HH:ii",
			timeWheels:"HHii"*/
		});
	}
}
/*Fim da atualização*/
function tplPaymentList(radio_name, radio_value, label, icons)
{
	var htm='';	
	 htm+='<ons-list-item modifier="tappable">';
       htm+='<ons-row class="row">';
          htm+='<ons-col class="concat-text" width="80%">';
             htm+='<label class="radio-button checkbox--list-item">';
               htm+='<input type="radio" name="'+radio_name+'" class="'+radio_name+'" value="'+radio_value+'">';
               htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
               htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
             htm+='</label>';
          htm+='</ons-col>';
          htm+='<ons-col class="text-right '+radio_value+'" >';
            htm+='<ons-icon icon="'+icons+'" ></ons-icon>';
          htm+='</ons-col>';
       htm+='</ons-row>';
     htm+='</ons-list-item>';
     return htm;
}

function tplPaymentListStatic(radio_value, label, icons)
{
	var htm='';	
	 htm+='<ons-list-item modifier="tappable">';
       htm+='<ons-row class="row">';
          htm+='<ons-col class="concat-text" width="80%">';          
               htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';             
          htm+='</ons-col>';
          htm+='<ons-col class="text-right '+radio_value+'" >';
            htm+='<ons-icon icon="'+icons+'"></ons-icon>';
          htm+='</ons-col>';
       htm+='</ons-row>';
     htm+='</ons-list-item>';
     return htm;
}

function tplTaxasdeEntrega(id_bairro, bairro, cidade, taxa)
{
	var htm='';	
	 htm+='<ons-list-item modifier="tappable">';
       htm+='<ons-row class="row">';
          htm+='<ons-col class="concat-text" width="75%">';          
               htm+='<p class="description item-name concat-text"> '+bairro+'</p>';             
          htm+='</ons-col>';
          htm+='<ons-col class="text-right">';
            htm+='<span class="description item-name concat-text">'+prettyPrice(taxa)+'</span>';
          htm+='</ons-col>';
       htm+='</ons-row>';
     htm+='</ons-list-item>';
     return htm;
}

function tplPaymentProvider(radio_name, radio_value, label, icons)
{
	var htm='';	
	 htm+='<ons-list-item modifier="tappable">';
       htm+='<ons-row class="row">';
          htm+='<ons-col class="concat-text" width="80%">';
             htm+='<label class="radio-button checkbox--list-item">';
               htm+='<input type="radio" name="'+radio_name+'" class="'+radio_name+'" value="'+radio_value+'">';
               htm+='<div class="radio-button__checkmark checkbox--list-item__checkmark"></div>';
               htm+='<p class="description item-name concat-text"> '+getTrans(label, label)+'</p>';
             htm+='</label>';
          htm+='</ons-col>';
          htm+='<ons-col class="text-right" >';
            htm+='<div class="logo-wrap">';
            htm+='<img src="'+icons+'" alt="" title="" />';
            htm+='</div>';
          htm+='</ons-col>';
       htm+='</ons-row>';
     htm+='</ons-list-item>';
     return htm;
}

function tplReviews(avatar , rating, client_name, review, date_review, id , can_modify, data_reply)
{
   var htm='';      
   htm+='<ons-list class="stic-list review-list">';
   
      if ( can_modify == 1){
	     htm+='<ons-list-item class="stic-list-item review" modifier="chevron" class="list-item-container" onclick="showReviewsDialog('+ id +')" >';
      } else {
      	 htm+='<ons-list-item class="stic-list-item review" modifier="tappable" class="list-item-container">';
      }
	  
	     htm+='<ons-row class="row stic-row-align"> ';
		     htm+='<ons-col class="col-image" width="60px">';
			   //htm+='<ons-icon icon="fa-user" class="icon-user"></ons-icon>';
			   htm+='<img class="avatar" src="'+ avatar +'">';
			 htm+='</ons-col>';
			 
			 htm+='<ons-col class="col-description">';
			   htm+='<div class="rating-stars" data-score="'+rating+'"></div>';
			   htm+='<p class="restauran-title f14 bold concat-text">'+client_name+'</p>';
			   htm+='<p class="small-font-dim stic-review-date small-font-dim-smaller">'+date_review+'</p> ';
			   htm+='<p class="small-font-dim stic-review">'+review+'</p>';
			   
			   if($.isArray(data_reply)) {
			   	  $.each( data_reply , function( key , val_data_reply ) { 
			   	  	 dump(val_data_reply);
			   	  	  htm+='<div class="reply-wrap">';
	    		        htm+='<p class="reply-from">'+ val_data_reply.from +':</p>';
	    		        htm+='<p class="reply-content">'+ val_data_reply.review + '</p>';
 	    		      htm+='</div>';
			   	  });
			   }
			   
			 htm+='</ons-col>';
			 
		 htm+='</ons-row>';
	  htm+='</ons-list-item>';
	htm+='</ons-list>';
	return htm;
}

/* Atualização Master Hub (Sugestões de Estabelecimentos) */
function tplSuggestions(nome_empresa, cidade, votos, date_created)
{
   var htm='';
   htm+='<ons-list class="review-list">';
	  htm+='<ons-list-item modifier="tappable" class="list-item-container">';
	     htm+='<ons-row class="row"> ';
		     htm+='<ons-col class="col-image" width="90px">';
			   htm+='<ons-icon icon="fa-user" class="icon-user"></ons-icon>';
			 htm+='</ons-col>';
			 
			 htm+='<ons-col class="col-description">';
			   htm+='<p class="small-font-dim">'+nome_empresa+'</p>';
			   htm+='<p class="small-font-dim">'+cidade+'</p>';
			   htm+='<p class="small-font-dim">'+votos+'</p>';
			   htm+='<p class="small-font-dim">'+date_created+'</p>';
			 htm+='</ons-col>';
			 
		 htm+='</ons-row>';
	  htm+='</ons-list-item>';
	htm+='</ons-list>';
	return htm;
}

function customFields(name, placeholder)
{
	var htm='';	
	htm+='<div class="field-wrapper">';
/*Atualização Master Hub (Tradução)*/
	/*  htm+='<input type="text" name="'+name+'"  class="text-input text-input--underbar" placeholder="'+placeholder+'" value="" has_validation data-validation="required" data-validation-error-msg="este campo precisa ser preenchido!" >'; */
	  htm+='<input type="text" name="'+name+'"  class="text-input text-input--underbar" placeholder="'+placeholder+'" value="" >';
	htm+='</div>';
	return htm;
}
/*Fim da atualização*/
function DineinFields()
{
	var htm='';	
	htm+='<div class="wrapper">';
       htm+='<ons-row class="row">';
           htm+='<ons-col class="stic-title text-big trn">'+ getTrans("Dine in information",'dine_in_information') +'</ons-col>';
       htm+='</ons-row>';
   htm+='</div>';
   
    htm+='<div class="field-wrapper">';
/*Atualização Master Hub (Tradução)*/
      htm+='<input type="text" name="dinein_number_of_guest"  class="numeric_only2 dinein_number_of_guest stic-rgba text-input text-input--underbar has_validation" placeholder="'+  getTrans("Number of guest",'number_of_guest') + '" data-validation="required" data-validation-error-msg="este campo precisa ser preenchido!"   >';
   htm+='</div>';
/*Fim da atualização*/
   
    htm+='<div class="field-wrapper">';
      htm+='<input type="text" name="dinein_table_number"  class="dinein_table_number stic-rgba text-input text-input--underbar has_validation" placeholder="'+  getTrans("Table number",'table_number') + '" data-validation="required" data-validation-error-msg="this field is mandatory!"   >';
   htm+='</div>';
   
   htm+='<div class="field-wrapper">';
      htm+='<input type="text" name="dinein_special_instruction"  class="dinein_special_instruction text-input stic-rgba text-input--underbar has_validation" placeholder="'+ getTrans("Special Instructions",'special_instruction2') + '" >';
   htm+='</div> ';
   
	return htm;
}

function ContactNumberFields()
{
	var htm='';	
	htm+='<div class="wrapper" style="margin-top: -22px;">';
       htm+='<ons-row class="row">';
           htm+='<ons-col class="text-big trn">'+ getTrans("Contact information",'contact_information') +'</ons-col>';
       htm+='</ons-row>';
   htm+='</div>';
   
    htm+='<div class="field-wrapper" style="margin-top: -22px; margin-bottom: 10px;">';
/*Atualização Master Hub (Tradução)*/
      htm+='<input type="tel" name="contact_phone" regex="^(|\(\d{2})\)\d{4,5}-\d{4}" class="mobile_inputs contact_phone text-input text-input--underbar has_validation mask-phone" placeholder="'+  getTrans("Contact phone",'contact_phone') + '" value="" data-validation="required" data-validation-error-msg="este campo precisa ser preenchido!"   >';
   htm+='</div>';
/*Fim da atualização*/
	return htm;
}

function wingRow(key, label , value)
{
   var htm='';	
   htm+='<ons-list-item modifier="tappable">';
	   htm+='<ons-row >';
	    htm+='<ons-col width="40%" class="trn" data-trn-key="'+key+'">';
	    htm+= label;
	    htm+='</ons-col>';
	    htm+='<ons-col width="60%" >';
	       htm+=": "+value
	    htm+='</ons-col>';
	   htm+='</ons-row >';
   htm+='</ons-list-item>';
   return htm;
}

displayOrders = function(data){
	
	var htm='<ons-list class="stic-list">';
    $.each( data, function( key, val ) {
    	
    	htm+='<ons-list-item modifier="tappable" class="stic-list-item list-item-container" onclick="showOrderOptions('+ "'" + val.order_id + "'" + ','+ "'" +  val.show_cancel_order + "'," + "'" + val.show_review + "'" + ');" >';
    	  
    	  cancel_html='';
    	  if(!empty(val.cancel_status)){
    	  	 //cancel_html = '<br/><p class="small '+val.cancel_class+'">'+val.cancel_status+'</p>';
    	  	 cancel_html = '<br/><p class="small cancel_status '+val.cancel_class+' ">'+val.cancel_status+'</p>';
    	  }
    	  	 
    	  //htm+="<h3>"+val.title_new+"</h3>";
    	  
    	  htm+='<div class="stic-nopad equal_table full_width">';
    	     htm+='<div class="stic-nopad col col-1-1" style="width:60%;"><span class="stic-title">'+val.title_new+'</span></div>';
    	     if(!empty(val.rating)){
    	        htm+='<div class="col col-2-2 stic-order-rating text_right"><div class="rating-stars" data-score="'+val.rating+'"></div></div>';
    	     }
    	  htm+='</div>';
    	  
    	  // htm+='<div class="line"></div>';
    	  htm+='<div class="equal_table full_width">';
    	     htm+='<div class="col col-1-1 small">' + val.merchant_name + '<br/>'  +val.place_on+ '<br/>' + val.payment_type + cancel_html + '</div>';
    	     htm+='<div class="stic-order-status col col-2-2 text_right"><span class="notification concat-text '+val.status_raw+' ">'+ val.status  +'</span></div>';
    	  htm+='</div>';
    	      	  
    	  // htm+='<div class="line"></div>';
    	  
    	  htm+='<div class="equal_table full_width">';
    	     // htm+='<div class="stic-order-total col col-1-1 "><h4>'+val.total_words+'</h4></div>';
    	     htm+='<div class="stic-order-price col col-2-2 text_right"><h4 style="padding-right: 3px;">'+val.total_words+'</h4><h4 class="stic-nobold">'+val.total+'</h4></div>';
    	  htm+='</div>';
    	  
    	htm+='</ons-list-item>';
    });
	htm+='</ons-list>';
	createElement('recent-orders',htm);	
	initRating();
};

displayNotification = function(data){
	var htm='<ons-list>';
	$.each( data.data, function( key, val ) {
		htm+='<ons-list-item modifier="tappable" class="list-item-container" >';
		  htm+='<h3>'+val.push_title+'</h3>';
		  htm+='<div class="line"></div>';
		  htm+='<p class="small pad">'+ val.date_created + '<br/>' + val.push_message +'</p>';
		htm+='</ons-list-item>';
	});
	htm+='</ons-list>';
	createElement('notification_list',htm);	
};

smsOrderTemplate = function(){	
	var html ='';
	html+='<div class="wrapper">';
       html+='<ons-row class="row">';
           html+='<ons-col class="text-big concat-text trn" width="60%" data-trn-key="sms_verification">';
           html+= getTrans('SMS verification','sms_verification');
           html+='</ons-col>        ';   
       html+='</ons-row>';
       
      html+='<p class="small-font-dim">'+ getTrans('This merchant has required SMS verification before you can place your order','require_order_sms');
	  html+='<ons-button modifier="quiet" class="green-color small-font-dim" onclick="showEnterMobile()">';
	  html+= getTrans('Click here','click_here');
	  html+='</ons-button>' + getTrans('to receive your order sms code','receive_sms_code');
	  html+='</p>';
	  
	  html+='<section class="field-section">';
	     html+='<input name="sms_code" id="sms_code" value="" type="text" class="text-input text-input--underbar trn" ng-model="text" ';
	     html+='placeholder="'+ getTrans('SMS code','sms_code') +'" data-trn-key="sms_code" maxlength="6"';
	     html+='data-validation="required" data-validation-error-msg="this field is mandatory!"';
	     html+='style="display: block; width: 100%">';
      html+='</section>';
       
   html+='</div>';
   createElement('sms_order_verification_wrap',html);
};

CategoryListSmall = function(data){
	if (data.length<=0){
		return;
	}		
	var html='';
		
	$.each( data  , function( key, val ) {
		html+='<ons-list-item tappable onclick="loadmenu('+val.cat_id+','+val.merchant_id+');" >';		    
		   html+='<ons-row align="center">';
		     html+='<ons-col width="40px" align="center" ><img class="list-item__thumbnail" src="'+ val.photo_url +'"></ons-col>';
		     html+='<ons-col >';
		        html+='<span class="item_title">' + val.category_name + '</span>';
		        html+='<span class="item_subtitle">'+ val.item_found +'</span>';
		     html+='</ons-col>';
		   html+='</ons-row>';
		html+='</ons-list-item>';				
	});	
	
	createElement('s_category_name_results',html);
};

ItemListSmall = function(data){
	if (data.length<=0){
		return;
	}		
	var html='';
		
	$.each( data  , function( key, val ) {
		html+='<ons-list-item tappable onclick="loadItemDetails('+val.item_id+','+val.merchant_id+','+val.category_id+' );" >';		    
		   html+='<ons-row align="center">';
		     html+='<ons-col width="40px" align="center" ><img class="list-item__thumbnail" src="'+ val.photo_url +'"></ons-col>';
		     html+='<ons-col >';
		        html+='<span class="item_title">' + val.item_name + '</span>';
		        html+='<span class="item_subtitle">'+ val.item_description +'</span>';
		     html+='</ons-col>';
		   html+='</ons-row>';
		html+='</ons-list-item>';				
	});	
	createElement('s_item_results',html);
};
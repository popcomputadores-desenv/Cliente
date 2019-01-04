/* Atualização Master Hub (Sugestões de Estabelecimentos) */
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
			sNavigator.popPage({cancelIfRunning: true});
			return;
			
			
	    }  
	});
		
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true})
	}
	
}

function sugestoes_Resultado(data)
{		
		var htm='';
	
	htm+='<div><span style="border-bottom: 2px dotted #000; padding-bottom: 5px;" class="trn" data-trn-key="escolha_uma_ategoria">VOTE NO SEU ESTABELECIMENTO FAVORITO</span></div>';
	htm+='<div class="wrapper center" style="margin: 15px auto; white-space: nowrap; overflow:auto;">';
	
	$.each( data.sugestoes, function( key, val ) {
		     
		
		var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);

				verificaVoto(data.details, val.sug_id);	
		
		totaldevotos=parseFloat(val.votos) + parseFloat(val.votostotal);
		
		
		htm+='<input type="hidden" id="voto-'+val.sug_id+'" value="'+totaldevotos+'" />';
		htm+='<input type="hidden" id="voto-'+val.sug_id+'-2" value="" />';

		//htm+='<div style="padding: 8px; margin: 5px; box-sizing: border-box; border: 1.5px dashed #ddd; width: 190px; display: inline-block; border-radius: 15px;" onclick="">';
		
		//htm+='<img src="'+upload_url+'estabelecimentos/'+val.sug_id+'.png" style="width:60px;">';
		
		
		
		htm+='<div style="display: block; text-align: -webkit-left; position: absolute;">';
		
		htm+='<img src="'+upload_url+'estabelecimentos/'+val.sug_id+'.png" style="width:47px;">';
		htm+='</div>';
		htm+='<div style="display: block; text-align: -webkit-left; margin-top: 5px; margin-left: 60px; font-size: 15px;">';
		htm+='Voto(s):';
		htm+='<i style="text-align: -webkit-left; margin-left: 15px; margin-top: 5px; font-size: 15px;">'+val.nome_empresa;
		htm+='</i>';
		
		htm+='<div style="margin-top: -20px; margin-left: 70px;"><img src="images/icons/semvoto.png" style="margin-left: 3px; margin-bottom: -30px; margin-top: inherit;" id="imgvoto-'+val.sug_id+'" class="ons-icon" width="24px" height="24px"></div>';

		//htm+='<div style="text-align: -webkit-right; float: right; margin-top: -12px; color: #ddd; font-size: 24px;" onclick="addVoto('+val.sug_id+');">Votar';
		
		htm+='<button class="button masterhub-btn-voto" style="text-align: -webkit-right; float: right; margin-top: -12px;" onclick="addVoto('+val.sug_id+');">Votar</button>';
   
		//htm+='</div>';
		htm+='</div>';
		
		htm+='<div style="display: block; text-align: -webkit-left; margin-left: 15px; margin-top: 3px; margin-left: 71px; font-size: 22px;">';
		htm+='<span id="resultado_voto-'+val.sug_id+'">'+totaldevotos+'</span>';
		htm+='<span style="display: block; float: right; text-align: -webkit-right; margin-right: -57px; margin-top: 15px; font-size: 12px;">Indicado por: ';
		htm+=''+val.indicacao_de;
		htm+='</span>';
		htm+='</div>';		
		htm+='<hr>';
		
	});	
	
	htm+='</div>';

	createElement('lista-sugestoes',htm);	
}

function addVoto(sug_id) {

var tokem = getStorage("client_token");
if(tokem == "" || tokem == "null" || tokem == null){
alert("Você deve estar logado para Votar");
}
 else {
	
 $.ajax({
    type:"GET",
    url: ajax_url+"/AddVoto?client_token="+getStorage("client_token")+"&sug_id="+sug_id+"",
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
		
	    if(icone==="1"){
		$("#imgvoto-"+sug_id).attr("src","images/icons/voto.png");
		$("#voto-"+sug_id+"-2").val(1);	
			toastMsg( getTrans("Obrigado por votar neste estabelecimento!",'voto_obrigado') );
		} else {
		$("#imgvoto-"+sug_id).attr("src","images/icons/semvoto.png");
		$("#voto-"+sug_id+"-2").val(0);	
			toastMsg( getTrans("Sinta-se a vontade por retirar seu voto! Obrigado pelo feedback",'voto_obrigado2') );
		}
		
		
		var votos = Number(document.getElementById("voto-"+sug_id).value);
    	var votoatual = Number(document.getElementById("voto-"+sug_id+"-2").value);
    	var elemResult = document.getElementById("resultado_voto-"+sug_id);

    if (elemResult.textContent === undefined) {
       elemResult.textContent = String(votos + votoatual);
    	}
    else { // IE
       elemResult.innerText = String(votos + votoatual);
    	}

    },

  });
 
 }
 
}

//Verifico se o estabelecimento já é um favorito do cliente
function verificaVoto(data, sug_id){

var tokem = getStorage("client_token");
if(tokem == "" || tokem == "null" || tokem == null){
alert("Você deve estar logado para Votar");
}
 else {
	
 $.ajax({
    type:"GET",
    url: ajax_url+"/VerificaVoto?client_token="+getStorage("client_token")+"&sug_id="+sug_id+"",
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
		
		
		
	    if(icone==="1"){
		$("#imgvoto-"+sug_id).attr("src","images/icons/voto.png");
		$("#voto-"+sug_id+"-2").val(1);	
		} else {
		$("#imgvoto-"+sug_id).attr("src","images/icons/semvoto.png");
		$("#voto-"+sug_id+"-2").val(0);	
		}

		var votos = Number(document.getElementById("voto-"+sug_id).value);
    	var votoatual = Number(document.getElementById("voto-"+sug_id+"-2").value);
    	var elemResult = document.getElementById("resultado_voto-"+sug_id);

    if (elemResult.textContent === undefined) {
       elemResult.textContent = String(votos + votoatual);
    	}
    else { // IE
       elemResult.innerText = String(votos + votoatual);
    	}
    },

  });
 
 }
 
}

function sugestoes_Resultado_lista(data)
{		
		var htm='';
	
	htm+='<div style="color: #fff;"><span style="border-bottom: 1.5px dotted #fff; padding-bottom: 5px;" class="trn" data-trn-key="escolha_uma_ategoria">VOTE NO SEU ESTABELECIMENTO FAVORITO</span></div>';
	htm+='<div class="wrapper center" style="margin: 15px auto; white-space: nowrap; overflow:auto;">';
	
	$.each( data.sugestoes, function( key, val ) {
		
		var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);
		
		verificaVoto(data.details, val.sug_id);	
		
		totaldevotos=parseFloat(val.votos) + parseFloat(val.votostotal);
		
		
		htm+='<input type="hidden" id="voto-'+val.sug_id+'" value="'+totaldevotos+'" />';
		htm+='<input type="hidden" id="voto-'+val.sug_id+'-2" value="" />';
		htm+='<div style="padding: 8px; margin: 5px; box-sizing: border-box; border: 1.5px dashed #ddd; width: 190px; display: inline-block; border-radius: 15px;" onclick="addVoto('+val.sug_id+');">';
		
		htm+='<div style="margin-top: -20px; margin-left: 70px;"><img src="images/icons/semvoto.png" style="margin-left: 50px; margin-bottom: -40px; margin-top: inherit;" id="imgvoto-'+val.sug_id+'" class="ons-icon" width="64px" height="64px"></div>';
		
		
		htm+='<img src="'+upload_url+'estabelecimentos/'+val.sug_id+'.png" style="width:60px;">';
		
		htm+='<div style="display: block; margin-top: 5px; font-size: 14px;">';
		htm+=''+val.nome_empresa;
		htm+='</div>';
		htm+='<div style="display: block; margin-top: 5px; font-size: 18px;">Voto(s): ';
		htm+='<span id="resultado_voto-'+val.sug_id+'">'+totaldevotos+'</span>';
		htm+='</div>';
		htm+='<div style="display: block; margin-top: 3px; font-size: 12px;">Indicado por: ';
		htm+=''+val.indicacao_de;
		htm+='</div>';		
		htm+='</div>';
		
	});	
	
	htm+='</div>';

	createElement('lista-sugestoes',htm);	
}

function sugestoes_Campo(data)
{		
		var htm2='';
	
	htm2+='<input type="hidden" name="cidade"  class="review text-input text-input--underbar has_validation" placeholder="Cidade" value="'+ global_city_id +'" data-validation="required" data-validation-error-msg="este campo precisa ser preenchido!" >';

	
	htm2+='<div class="field-wrapper">';
	htm2+='<input type="text" name="nome_empresa"  class="review text-input text-input--underbar has_validation" placeholder="Nome da Empresa" value="" data-validation="required" data-validation-error-msg="este campo precisa ser preenchido!" >';
	htm2+='</div>';
	htm2+='<div class="field-wrapper" style="font-size: 35px;">';
	htm2+=''+global_city_name+'';
	htm2+='</div>';
	htm2+='<div class="field-wrapper">';
	htm2+='<input type="text" name="contato"  class="review text-input text-input--underbar" placeholder="Contato na Empresa" value="">';
	htm2+='</div>';
	htm2+='<div class="field-wrapper">';
	htm2+='<input type="text" name="telefone"  class="review text-input text-input--underbar" placeholder="Telefone da Empresa" value="">';
	htm2+='</div>';
	htm2+='';
	htm2+='';

	createElement('campos-sugestoes',htm2);	
}

function carregandoSugestoes()
{
	sparams="city_id="+ global_city_id;
	
callAjax('Suggestion',sparams);
	
}
/* Fim da atualização */

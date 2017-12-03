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

function sugestoes_Resultado_lista(data)
{		
		var htm='';
	
	htm+='<div style="color: #fff;"><span style="border-bottom: 2px dotted #fff; padding-bottom: 5px;" class="trn" data-trn-key="escolha_uma_ategoria">VOTE NO SEU ESTABELECIMENTO FAVORITO</span></div>';
	htm+='<div class="wrapper center" style="margin: 15px auto; white-space: nowrap; overflow:auto;">';
	
	$.each( data.sugestoes, function( key, val ) {
		     
		
		var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);

		totaldevotos=parseFloat(val.votos) + parseFloat(val.votostotal);
		//htm+='<div style="padding: 8px; margin: 5px; box-sizing: border-box; border: 1.5px dashed #ddd; width: 190px; display: inline-block; border-radius: 15px;" onclick="">';
		
		//htm+='<img src="'+upload_url+'estabelecimentos/'+val.sug_id+'.png" style="width:60px;">';
		htm+='<div style="display: block; text-align: -webkit-left; margin-top: 5px; color: #ddd; font-size: 15px;">Voto(s): ';
		
		
		htm+='<i style="text-align: -webkit-left; margin-left: 15px; margin-top: 5px; color: #ddd; font-size: 15px;">'+val.nome_empresa;
		htm+='</i>';

		htm+='<div style="text-align: -webkit-right; float: right; margin-top: auto; color: #ddd; font-size: 15px;">Votar';
		htm+='</div>';
		htm+='</div>';
		
		htm+='<div style="display: block; text-align: -webkit-left; margin-left: 15px; margin-top: 3px; color: #ddd; margin-left: 15px; font-size: 22px;">'+totaldevotos;
		htm+='<div style="display: block; float: right; text-align: -webkit-right; margin-top: 3px; color: #000; font-size: 12px;">Indicado por: ';
		htm+=''+val.indicacao_de;
		htm+='</div>';
		htm+='</div>';		
		htm+='<hr>';
		
	});	
	
	htm+='</div>';

	createElement('lista-sugestoes-lista',htm);	
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

function sugestoes_Resultado(data)
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
		
		htm+='<div style="display: block; margin-top: 5px; color: #ddd; font-size: 14px;">';
		htm+=''+val.nome_empresa;
		htm+='</div>';
		htm+='<div style="display: block; margin-top: 5px; color: #ddd; font-size: 18px;">Voto(s): ';
		htm+='<span id="resultado_voto-'+val.sug_id+'">'+totaldevotos+'</span>';
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
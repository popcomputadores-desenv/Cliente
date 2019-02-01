function fidelidade_PaginaCategorias(data)
{		
		var htm='';
	
	
	    htm+='<ons-carousel swipeable overscrollable auto-scroll  setAutoScrollRatio(0.7) var="carousel" style="width: 100%; height:158px; margin: auto; box-shadow: 0 0 10px 3px rgba(0,0,0,0.6);" class="etiqueta-fidelidade">';
		htm+='<div style=" position: initial; margin-top: 10px;"><b style="background: rgba(33,144,19,0.73); z-index: 9999; color:  white; padding:  3px 10px; border-radius: 10px;">';
		htm+='Programa de Fidelidade!';
		htm+='</b></div>';
		//htm+='<div class="etiqueta-fidelidade">';

		$.each( data.programa_fidelidade, function( key, val ) {
			if (val.fidelidade_tipo==="primeira" && val.found!=0){
				$("#lista-fidelidades").hide();
			} else {	
				$("#lista-fidelidades").show();
		val.joining_merchant = val.joining_merchant.replace(/"/g,'');
		var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);
		if (isLogin()){
			
		var meta='';
		var bater_meta='';
		var contagem_pedido='';
		var contagem_item='';
		var contagem_valor='';
		var contagem_pontos='';
		var barra_progresso='';
		var ciclo='';
		var totalItens;
		var totalItens_ultimos;
		var pontos;
		var pontos_ultimos;
		var totalGasto;
		var totalGasto_ultimos;	
		
		ciclo=val.found*val.beneficio;
		
		if (val.beneficio_tipo==="pedido"){
			if (val.found===0){
			contagem_pedido=val.ContarDeorder_id-ciclo;
			} else {
			contagem_pedido=val.ContarDeorder_id-(ciclo+parseFloat(val.found));
			}
			bater_meta=Math.round(contagem_pedido); // 2 // 0
		  	barra_progresso=Math.round((contagem_pedido/val.beneficio)*100); // (2/2)=0*100=0
			meta=val.beneficio-contagem_pedido; 
		if (meta<=0){ 
		 	  msg_meta=getTrans('Faca uma compra AGORA!','faca_agora');
			  mensagem_fidelidade=val.premio;
		  } else { 
			  msg_meta=getTrans('Clique AQUI para ver os detalhes!','clique_aqui_detalhes');
			  mensagem_fidelidade=val.fidelidade_desc;
		  }
		htm+='<ons-carousel-item class="carousel_item">';
		htm+='<div class="progress5">';
		htm+='<div onclick="showFidelidadeEmpresa();">';
		htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_programa_fidelidade">';
		htm+=mensagem_fidelidade;
		htm+='</span><br>';			
		htm+='<span style="font-size: 15px; color: #ffffff;">'+msg_meta+'</span>';			
		htm+='</div>';
		htm+='</div>';
		htm+='</ons-carousel-item>';
		  } else 
		if (val.beneficio_tipo==="item"){
			totalItens=val.totalItens;
			totalItens_ultimos=val.totalItens_ultimos;
			if (totalItens===null){
				totalItens=0;
			}
			if (totalItens_ultimos===null){
				totalItens_ultimos=0;
			}
			if (val.found===0){
			contagem_item=totalItens-ciclo;
			} else {
			contagem_item=(totalItens-(ciclo+parseFloat(totalItens_ultimos)));
			}			
			bater_meta=Math.round(contagem_item);
		  	barra_progresso=Math.round((contagem_item/val.beneficio)*100);
			meta=val.beneficio-contagem_item;
		if (meta<=0){ 
		 	  msg_meta=getTrans('Faca uma compra AGORA!','faca_agora');
			  mensagem_fidelidade=val.premio;
		  } else { 
			  msg_meta=getTrans('Clique AQUI para ver os detalhes!','clique_aqui_detalhes');
			  mensagem_fidelidade=val.fidelidade_desc;
		  }
		htm+='<ons-carousel-item class="carousel_item">';
		htm+='<div class="progress5">';
		htm+='<div onclick="showFidelidadeEmpresa();">';
		htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_programa_fidelidade">';
		htm+=mensagem_fidelidade;
		htm+='</span><br>';			
		htm+='<span style="font-size: 15px; color: #ffffff;">'+msg_meta+'</span>';			
		htm+='</div>';
		htm+='</div>';
		htm+='</ons-carousel-item>';
		  } else 
		if (val.beneficio_tipo==="valortotal"){
			totalGasto=val.totalGasto;
			totalGasto_ultimos=val.totalGasto_ultimos;
			if (totalGasto===null){
				totalGasto=0;
			}
			if (totalGasto_ultimos===null){
				totalGasto_ultimos=0;
			}
			if (val.found===0){
			contagem_valor=totalGasto-ciclo;
			} else {
			contagem_valor=(totalGasto-(ciclo+parseFloat(totalGasto_ultimos)));
			}			
			valor_total=Math.round(contagem_valor);
		  	barra_progresso=Math.round((contagem_valor/val.beneficio)*100);
			meta=val.beneficio-contagem_valor;
		if (meta<=0){ 
		 	  msg_meta=getTrans('Faca uma compra AGORA!','faca_agora');
			  mensagem_fidelidade=val.premio;
		  } else { 
			  msg_meta=getTrans('Clique AQUI para ver os detalhes!','clique_aqui_detalhes');
			  mensagem_fidelidade=val.fidelidade_desc;
		  }
		htm+='<ons-carousel-item class="carousel_item">';
		htm+='<div class="progress5">';
		htm+='<div onclick="showFidelidadeEmpresa();">';
		htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_programa_fidelidade">';
		htm+=mensagem_fidelidade;
		htm+='</span><br>';			
		htm+='<span style="font-size: 15px; color: #ffffff;">'+msg_meta+'</span>';			
		htm+='</div>';
		htm+='</div>';
		htm+='</ons-carousel-item>';
		} else 
		  if (val.beneficio_tipo==="pontos"){
			pontos=val.pontos;
			pontos_ultimos=val.pontos_ultimos;
			if (pontos===null){
				pontos=0;
			}
			if (pontos_ultimos===null){
				pontos_ultimos=0;
			}
			if (val.found===0){
			contagem_pontos=pontos-ciclo;
			} else {
			contagem_pontos=(pontos-(ciclo+parseFloat(pontos_ultimos)));
			}			
		  	barra_progresso=Math.round((contagem_pontos/val.beneficio)*100);
			meta=val.beneficio-contagem_pontos;
		if (meta<=0){ 
		 	  msg_meta=getTrans('Faca uma compra AGORA!','faca_agora');
			  mensagem_fidelidade=val.premio;
		  } else { 
			  msg_meta=getTrans('Clique AQUI para ver os detalhes!','clique_aqui_detalhes');
			  mensagem_fidelidade=val.fidelidade_desc;
		  }
		htm+='<ons-carousel-item class="carousel_item">';
		htm+='<div class="progress5">';
		htm+='<div onclick="showFidelidadeEmpresa();">';
		htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_programa_fidelidade">';
		htm+=mensagem_fidelidade;
		htm+='</span><br>';			
		htm+='<span style="font-size: 15px; color: #ffffff;">'+msg_meta+'</span>';			
		htm+='</div>';
		htm+='</div>';
		htm+='</ons-carousel-item>';
		  }
		} else {
		htm+='<ons-carousel-item class="carousel_item">';
		htm+='<div class="progress5">';
		htm+='<div onclick="showFidelidadeEmpresa();">';
		htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_programa_fidelidade">';
		htm+=val.fidelidade_desc;
		htm+='</span><br>';			
		htm+='<span style="font-size: 15px; color: #ffffff;">Clique AQUI para ver os detalhes!</span>';			
		htm+='</div>';
		htm+='</div>';
		htm+='</ons-carousel-item>';
		}
	}
	});	
		htm+='</ons-carousel>';
	
	createElement('lista-fidelidades',htm);	
			   
}

function fidelidade_PaginaPagamentos(data)
{		
		if ( empty(data.programa_fidelidade) ){
			
             if (data.voucher_enabled=="yes"){
			   	   	   $(".voucher-wrap").show();			   	   	   
			   	   	   $(".voucher_code").attr("placeholder", getTrans("Enter Voucher here",'enter_voucher_here') );
			   	   } else {
			   	   	   $(".voucher-wrap").hide();
			   	   }
			
		} else 
		var htm='';
		htm+='<div class="wrapper">';
		htm+='<ons-list id="fidelidade-wrap">';
		htm+='<ons-list-header class="center fidelidade-header trn" data-trn-key="fidelidade">Fidelidade</ons-list-header>';
		htm+='<ons-carousel swipeable overscrollable auto-scroll  setAutoScrollRatio(0.7) var="carousel" style="width: 100%; height:158px; margin: auto;" class="etiqueta-fidelidade">';			
		htm+='<ons-carousel-item class="carousel_item">';
		htm+='<div class="progress6">';
		htm+='<div onclick="showFidelidadeEmpresa();">';
		htm+='<span style="font-size: 15px; color: #ffffff;">';
		htm+=data.programa_fidelidade.premio;
		htm+='<br>'+getTrans("Clique abaixo para aceitar este desconto!",'clique_para_aceitar_desconto');
		htm+='</span><br>';			
		htm+='</div>';
		htm+='</div>';
		htm+='</ons-list-item>';
		htm+='<div id="fidelidade-wrap">';
		htm+='<input type="hidden" name="fidelidade_code"  class="fidelidade_code text-input text-input--underbar" value="'+data.programa_fidelidade.fidelidade_name+'">';
		htm+='<p class="center apply-fidelidade botao-fidelidade">';
		htm+='<button class="newbutton" onclick="applyFidelidade();">';
		htm+='<span class="trn" data-trn-key="apply_fidelidade">Usar esta campanha!</span>';
		htm+='</button>';
		htm+='</p>';
		htm+='<p class="center remove-fidelidade botao-fidelidade">';
		htm+='<button class="newbutton" onclick="removeFidelidade();" >';
		htm+='<span class="trn" data-trn-key="remove_fidelidade">Remover Campanha!</span>';
		htm+='</button>';
		htm+='</p>';
		htm+='</ons-carousel-item>';
		htm+='</ons-carousel>';
		htm+='</div>';
		htm+='</div>';
	
	createElement('lista-fidelidades-pagamento',htm);	
			   
}

function fidelidade_PaginaDetalhes(data)
{		
		var htm='';
	
	htm+='<ons-carousel swipeable overscrollable auto-scroll  setAutoScrollRatio(0.7) var="carousel" style="width: 100%; height:550px; margin: auto;">';

		  htm+='';
	
	$.each( data.programa_fidelidade, function( key, val ) {
		
	if (val.fidelidade_tipo==="primeira" && val.found!=0){
		
	} else {
		val.joining_merchant = val.joining_merchant.replace(/"/g,'');
		var upload_url = krms_config.UploadUrl;
	    dump("upload_url=>"+upload_url);
		var mensagem_fidelidade='';
		htm+='<ons-carousel-item class="carousel_item">';
		htm+='<div style="box-sizing: border-box;font-size: 12px; text-align: right; padding-right: 7px; margin-top: 2px;" class="white concat-text">'+getTrans('Esta campanha esta valida ate:','campanha_valida_ate')+'<br>'+dataAtualFormatada_NomeMes(val.expiration)+'.</div>';
		htm+='<img src="css/images/trofeu.svg" style="max-width: 100%; margin-top: -6px;" />';
		htm+='<div class="progress7">';

		var meta='';
		var bater_meta='';
		var contagem_pedido;
		var contagem_item;
		var contagem_valor;
		var contagem_pontos;
		var barra_progresso;
		var ciclo;
		var totalItens;
		var totalItens_ultimos;
		var pontos;
		var pontos_ultimos;
		var totalGasto;
		var totalGasto_ultimos;
		
		ciclo=val.found*val.beneficio;
		
		if (val.beneficio_tipo==="pedido"){
			if (val.found===0){
			contagem_pedido=val.ContarDeorder_id-ciclo;
			} else {
			contagem_pedido=val.ContarDeorder_id-(ciclo+parseFloat(val.found));
			}
			bater_meta=Math.round(contagem_pedido);
			meta=val.beneficio-contagem_pedido; 
			if (val.fidelidade_tipo==="primeira"){
				barra_progresso=100;
			} else {
				barra_progresso=Math.round((contagem_pedido/val.beneficio)*100);
			}
		if (meta<=0){
			  meta=getTrans('Voce ja tem este beneficio!','voce_ja_tem_este_beneficio'); 
		 	  msg_meta=getTrans('Faca uma compra AGORA!','faca_agora');
			  total_meta='';
			  progresso_total='';
			  mensagem_fidelidade=val.premio;
		} else { 
			  msg_meta=getTrans('Voce precisa fazer mais:','voce_precisa_fazer');
			  total_meta=getTrans('Pedidos para concluir e conquistar este beneficio!','pedidos_para_concluir');
			  mensagem_fidelidade=val.fidelidade_desc;
			  progresso_total='<p style="text-align:center;font-size:18px; height: 0px; margin-top: -17px;">'+bater_meta+' de '+Math.round(val.beneficio)+' pedidos.</p>';
		  }
		  htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_fidelidade">';
		  htm+=''+mensagem_fidelidade;
		  htm+='</span>';			
		  htm+='</div>';			
		  htm+='<p style="text-align:center;font-size:25px;line-height: 0; margin-top: 16px;">'+msg_meta+'</p>';
			
		  htm+='<p style="text-align:  center;font-weight: bold;font-size:  36px;line-height: 1;margin-top:-10px;margin-bottom:  -14px;"><b style="text-align:  center;">'+meta+'</b></p>';		  
		  htm+='<p style="text-align:center;font-size:14px;">'+total_meta+'</p>';
		  } else 
		if (val.beneficio_tipo==="item"){
			totalItens=val.totalItens;
			totalItens_ultimos=val.totalItens_ultimos;
			if (val.totalItens===null){
				totalItens=0;
			}
			if (val.totalItens_ultimos===null){
				totalItens_ultimos=0;
			}
			if (val.found===0){
			contagem_item=parseFloat(totalItens-ciclo);
			} else {
			contagem_item=parseFloat((totalItens-(ciclo+parseFloat(totalItens_ultimos))));
			}			
			bater_meta=Math.round(contagem_item);
		  	barra_progresso=Math.round((contagem_item/val.beneficio)*100);
			meta=val.beneficio-contagem_item;
		if (meta<=0){
			  meta=getTrans('Voce ja tem este beneficio!','voce_ja_tem_este_beneficio'); 
		 	  msg_meta=getTrans('Faca uma compra AGORA!','faca_agora');
			  total_meta='';
			  progresso_total='';
			  mensagem_fidelidade=val.premio;
		  } else { 
			  msg_meta=getTrans('Voce precisa comprar mais:','voce_precisa_comprar');
			  total_meta=getTrans('Itens(s) para concluir e conquistar este beneficio!','itens_para_concluir');
			  mensagem_fidelidade=val.fidelidade_desc;
			  progresso_total='<p style="text-align:center;font-size:18px; height: 0px; margin-top: -17px;">'+Math.round(contagem_item)+' de '+Math.round(val.beneficio)+' itens.</p>';
		  }
		  htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_fidelidade">';
		  htm+=''+mensagem_fidelidade;
		  htm+='</span>';			
		  htm+='</div>';						
		  htm+='<p style="text-align:center;font-size:25px;line-height: 0; margin-top: 16px;">'+msg_meta+'</p>';
			
		  htm+='<p style="text-align:  center;font-weight: bold;font-size:36px;line-height: 1;margin-top:-10px;margin-bottom:  -14px;"><b style="text-align:  center;">'+meta+'</b></p>';
		  htm+='<p style="text-align:center;font-size:14px;">'+total_meta+'</p>';
		  } else 
		if (val.beneficio_tipo==="valortotal"){
			totalGasto=val.totalGasto;
			totalGasto_ultimos=val.totalGasto_ultimos;
			if (val.totalGasto===null){
				totalGasto=0;
			}
			if (val.totalGasto_ultimos===null){
				totalGasto_ultimos=0;
			}
			if (val.found===0){
			contagem_valor=totalGasto-ciclo;
			} else {
			contagem_valor=(totalGasto-(ciclo+parseFloat(totalGasto_ultimos)));
			}			
			valor_total=Math.round(contagem_valor);
		  	barra_progresso=Math.round((contagem_valor/val.beneficio)*100);
			meta=val.beneficio-contagem_valor;
		if (meta<=0){
			  meta=getTrans('Voce ja tem este beneficio!','voce_ja_tem_este_beneficio'); 
		 	  msg_meta=getTrans('Faca uma compra AGORA!','faca_agora');
			  total_meta='';
			  progresso_total='';
			  mensagem_fidelidade=val.premio;		
		  } else { 
			  meta=prettyPrice(val.beneficio-contagem_valor);
			  msg_meta=getTrans('Voce precisa comprar mais:','voce_precisa_comprar');
			  total_meta=getTrans('para concluir e conquistar este beneficio!','reais_para_concluir');
			  mensagem_fidelidade=val.fidelidade_desc;
			  progresso_total='<p style="text-align:center;font-size:18px; height: 0px; margin-top: -17px;">'+prettyPrice(valor_total)+' de '+prettyPrice(Math.round(val.beneficio))+'</p>';
		  }
		  htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_fidelidade">';
		  htm+=''+mensagem_fidelidade;
		  htm+='</span>';			
		  htm+='</div>';			
		  htm+='<p style="text-align:center;font-size:25px;line-height: 0; margin-top: 16px;">'+msg_meta+'</p>';
			
		  htm+='<p style="text-align:  center;font-weight: bold;font-size:  36px;line-height: 1;margin-top:-10px;margin-bottom:  -14px;"><b style="text-align:  center;">'+meta+'</b></p>';
		  htm+='<p style="text-align:center;font-size:14px;">'+total_meta+'</p>';
		} else 
		  if (val.beneficio_tipo==="pontos"){
			pontos=val.pontos;
			pontos_ultimos=val.pontos_ultimos;
			if (val.pontos===null){
				pontos=0;
			}
			if (val.pontos_ultimos===null){
				pontos_ultimos=0;
			}
			if (val.found===0){
			contagem_pontos=pontos-ciclo;
			} else {
			contagem_pontos=(pontos-(ciclo+parseFloat(pontos_ultimos)));
			}			
		  	barra_progresso=Math.round((contagem_pontos/val.beneficio)*100);
			meta=val.beneficio-contagem_pontos;
		if (meta<=0){
			  meta=getTrans('Voce ja tem este beneficio!','voce_ja_tem_este_beneficio'); 
		 	  msg_meta=getTrans('Faca uma compra AGORA!','faca_agora');
			  total_meta='';
			  progresso_total='';
			  mensagem_fidelidade=val.premio;
		  } else { 
			  msg_meta=getTrans('Voce precisa de:','voce_precisa_pontuar');
			  total_meta=getTrans('Pontos para concluir e conquistar este beneficio!','pontos_para_concluir');
			  mensagem_fidelidade=val.fidelidade_desc;
			  progresso_total='<p style="text-align:center;font-size:18px; height: 0px; margin-top: -17px;">'+Math.round(contagem_pontos)+' de '+Math.round(val.beneficio)+' pontos.</p>';
		  }
		  htm+='<span style="font-size: 15px; color: #ffffff;" class="mensagem_fidelidade">';
		  htm+=''+mensagem_fidelidade;
		  htm+='</span>';			
		  htm+='</div>';			
		  htm+='<p style="text-align:center;font-size:25px;line-height: 0; margin-top: 16px;">'+msg_meta+'</p>';
			
		  htm+='<p style="text-align:  center;font-weight: bold;font-size:  36px;line-height: 1;margin-top:-10px;margin-bottom:  -14px;"><b style="text-align:  center;">'+meta+'</b></p>';
		  htm+='<p style="text-align:center;font-size:14px;">'+total_meta+'</p>';
		}
		  htm+='<div class="cssProgress" style="max-width: 100%;margin-bottom: 20px; width: 94%; margin-left: 3%;margin-right: 3%;">';
		  if (barra_progresso>=100){
		  htm+='<div class="progress2" style="border-radius: 18px;">';
		  htm+='<div class="cssProgress-bar cssProgress-success cssProgress-active" data-percent="100" style="width: 100%; height: 34px; border-radius: 25px;">';
		  htm+='<span class="cssProgress-label" style="font-size: 18px; overflow: visible; margin-top:  8px;">'+getTrans('Parabens!','parabens')+'</span>';
		  } else {
		  htm+='<div class="progress2" style="border-radius: 18px;">';
		  htm+='<div class="cssProgress-bar cssProgress-success cssProgress-active" data-percent="'+barra_progresso+'" style="width: '+barra_progresso+'%; height: 34px; border-radius: 25px;">';
		  htm+='<span class="cssProgress-label" style="font-size: 18px; overflow: visible; margin-top:  8px;">'+barra_progresso+'%</span>';
		  }
		  htm+='</div>';
		  htm+='</div>';
		  htm+='</div>';
		  htm+=progresso_total;
		  
		htm+='</ons-carousel-item>';
		
	}
		
	});	
		htm+='</ons-carousel>';
	
	createElement('lista-fidelidades-detalhes',htm);	
			   
}

function showFidelidadeEmpresa(data)
{  
	if (isLogin()){
	var options = {
      animation: 'fade',
      onTransitionEnd: function() { 						      	  
      	  displayMerchantLogo2( 
      	     getStorage("merchant_logo") ,
      	     '' ,
			 '' ,
      	     'page-fidelidade-empresa'
      	  );       	  
      	  
      	  translatePage();
/* Atualização João Neves (Pede.ai) Cabeçalho App dentro do menu do estabelecimento */
	$("#page-fidelidade-empresa .estabelecimento-header2").attr("style",'background-image: url('+getStorage("merchant_logo")+'); background-size: 108%; padding-bottom: 42px; box-sizing: border-box; position: fixed; top: 0px; left: 0px; right: 0px; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
	$("#page-fidelidade-empresa .estabelecimento-header").attr("style",'background-image: url('+getStorage("merchant_logo")+'); background-size: cover; box-sizing: border-box; position: relative; top: -42px; left: 0px; right: 0px; height: 165px; z-index: -1; box-shadow: 0 -5px 7px -5px #000, 0 3px 7px -2px #000;');
/* Fim da Atualização */
		  $("#page-fidelidade-empresa .restauran-title").text( $(".selected_restaurant_name").val() );
	      $("#page-fidelidade-empresa .rating-stars").attr("data-score",  $(".selected_restaurant_ratings").val() );

		  var htm='';
		  
		  createElement('programa-fidelity-empresa',htm);
		  
		  
	      initRating();	      
          	  
      }                   
    }; 
	
    sNavigator.pushPage("Pagina-Fidelidade-Empresa.html", options);
	
	} else {
		menu.setMainPage('prelogin.html', {closeMenu: true})
	}
}
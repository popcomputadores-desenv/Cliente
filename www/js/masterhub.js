/*Atualização Master Hub (Função de busca por CEP no Catálogo de Endereços)*/
function limpa_formulario_cep() {
            //Limpa valores do formulário de cep.
            document.getElementById('street').value=("");
            document.getElementById('state_name').value=("");
			document.getElementById('city_name').value=("");
			document.getElementById('area_name').value=("");
            //document.getElementById('state_raw').value=("");
			//document.getElementById('city_name_raw').value=("");
			//document.getElementById('area_name_raw').value=("");
			document.getElementById('numero').value=("");
            document.getElementById('state_id').value=("");
			document.getElementById('city_id').value=("");
			document.getElementById('area_id').value=("");
			//$(".location_area").html(t("Select District / Area"));
			//$(".location_city").html(t("Select City"));
			//$(".location_state").html(t("Select State"));    
}

function limpa_formulario_gps() {
            //Limpa valores do formulário de cep.
            document.getElementById('street').value=("");
            document.getElementById('state_name').value=("");
			document.getElementById('city_name').value=("");
			document.getElementById('area_name').value=("");
            //document.getElementById('state_raw').value=("");
			//document.getElementById('city_name_raw').value=("");
			//document.getElementById('area_name_raw').value=("");
			document.getElementById('numero').value=("");
            document.getElementById('state_id').value=("");
			document.getElementById('city_id').value=("");
			document.getElementById('area_id').value=("");
			document.getElementById('cep').value=("");
			//$(".location_area").html(t("Select District / Area"));
			//$(".location_city").html(t("Select City"));
			//$(".location_state").html(t("Select State"));    
}

    function meu_callback(conteudo) {
        if (!("erro" in conteudo)) {
			
			buscar_ids_por_CEP(conteudo.localidade, conteudo.bairro);
            //Atualiza os campos com os valores.
            document.getElementById('street').value=(conteudo.logradouro);
			$(".city_name").value=(conteudo.localidade);
			$(".area_name").value=(conteudo.bairro);
			$(".state_name").value=(conteudo.estado);
            //document.getElementById('state').value=("");
			document.getElementById('numero').value=("");
			//document.getElementById('city_name').value=("");
			//document.getElementById('state_name').value=("");
			//document.getElementById('area_name').value=("");
			//$(".location_area").html(getTrans("Select District / Area","select_destrict_area"));
			//$(".location_city").html(getTrans("Select City", "select_city"));
			//$(".location_state").html(getTrans("Select State", "select_state"));

        } //end if.
        else {
            //CEP não Encontrado.
            limpa_formulario_cep();
            showAlert(t("CEP nao encontrado."));
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
				$(".city_name").value=("...");
				$(".area_name").value=("...");
				$(".state_name").value=("...");
				document.getElementById('numero').value="...";

                //Cria um elemento javascript.
                var script = document.createElement('script');

                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            } //end if.
            else {
                //cep é inválido.
                limpa_formulario_cep();
                showAlert(t("Formato de CEP invalido."));
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            //limpa_formulário_cep();
        }
    }
/*Fim da atualização*/
/*Atualização Master Hub (Função de Pesquisar Ids pelo nome do Bairro)*/
function buscar_ids_por_CEP(cidade, nome_bairro)
{
	processDynamicAjax("IdsDoCEP","cidade="+cidade+"&nome_bairro="+nome_bairro);
}

function buscar_ids_por_Bairro(cidade, nome_bairro)
{
	processDynamicAjax("IdsDoBairro","cidade="+cidade+"&nome_bairro="+nome_bairro);
}

function buscar_ids_Bairro(cidade, nome_bairro)
{
	processDynamicAjax("IdsBairro","cidade="+cidade+"&nome_bairro="+nome_bairro);
}
/*Fim da atualização*/

function searchArea()
{
	processDynamicAjax('locationArea', "city_id=" + $(".city_id").val() + "&s=" + $(".search_area").val() );
}

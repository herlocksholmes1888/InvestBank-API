document.addEventListener('DOMContentLoaded', () => {
    const apiActionsSelect = document.getElementById('apiActions');
    const parametersContainer = document.getElementById('parametersContainer');
    const apiForm = document.getElementById('apiForm');
    const responseContainer = document.getElementById('responseContainer'); 

    const apiConfig = {
        'getUsuarios': {
            method: 'GET',
            path: '/usuarios',
            params: []
        },
        'getInvestimentos': {
            method: 'GET',
            path: '/investimentos',
            params: []
        },
        'getMovimentacoes': {
            method: 'GET',
            path: '/movimentacoes',
            params: []
        },
        'getSaldo': {
            method: 'GET',
            path: '/saldo',
            params: [
                { name: 'accountId', type: 'number', label: 'ID da Conta:' }
            ]
        },
        'criarUsuario': {
            method: 'POST',
            path: '/criarUsuario',
            params: [
                { name: 'newUserId', type: 'number', label: 'Novo ID do Usuário:' },
                { name: 'newUserName', type: 'text', label: 'Nome do Novo Usuário:' }
            ]
        },
        'criarConta': {
            method: 'POST',
            path: '/criarConta',
            params: [
                { name: 'accountId', type: 'number', label: 'ID da Conta:' },
                { name: 'userId', type: 'number', label: 'ID do Usuário:' },
                { name: 'accountType', type: 'text', label: 'Tipo de Conta:' }
            ]
        },
        'deposito': {
            method: 'POST',
            path: '/deposito',
            params: [
                { name: 'accountId', type: 'number', label: 'ID da Conta:' },
                { name: 'amount', type: 'number', label: 'Valor:' }
            ]
        },
        'transferencia': {
            method: 'POST',
            path: '/transferencia',
            params: [
                { name: 'senderId', type: 'number', label: 'ID do Remetente:' },
                { name: 'senderAccountId', type: 'number', label: 'ID da Conta Remetente:' },
                { name: 'receiverId', type: 'number', label: 'ID do Destinatário:' },
                { name: 'receiverAccountId', type: 'number', label: 'ID da Conta Destinatário:' },
                { name: 'amount', type: 'number', label: 'Valor:' }
            ]
        },
        'comprarAtivo': { 
            method: 'POST',
            path: '/comprarAtivo',
            params: [
                { name: 'accountId', type: 'number', label: 'ID da Conta:' },
                { name: 'investmentId', type: 'number', label: 'ID do Investimento:' },
                { name: 'investmentPaidPrice', type: 'number', label: 'Preço Pago pelo Investimento:' }
            ]
        },
        'resgatarAtivo': { 
            method: 'POST',
            path: '/resgatarAtivo',
            params: [
                { name: 'accountId', type: 'number', label: 'ID da Conta:' },
                { name: 'investmentId', type: 'number', label: 'ID do Investimento:' }
            ]
        },
        'deletarUsuario': {
            method: 'DELETE',
            path: '/deletarUsuario',
            params: [
                { name: 'id', type: 'number', label: 'ID do Usuário a Deletar:' } 
            ]
        }
    };

    function renderParameters(actionKey) {
        parametersContainer.innerHTML = '';

        const config = apiConfig[actionKey];
        if (config && config.params) {
            config.params.forEach(param => {
                const div = document.createElement('div');
                div.classList.add('form-group');

                const label = document.createElement('label');
                label.setAttribute('for', param.name);
                label.textContent = param.label;

                const input = document.createElement('input');
                input.setAttribute('type', param.type);
                input.setAttribute('id', param.name);
                input.setAttribute('name', param.name);
                input.setAttribute('required', true);

                div.appendChild(label);
                div.appendChild(input);
                parametersContainer.appendChild(div);
            });
        }
    }

    apiActionsSelect.addEventListener('change', (event) => {
        const selectedAction = event.target.value;
        renderParameters(selectedAction);
    });

    apiForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedActionKey = apiActionsSelect.value;
        if (!selectedActionKey) {
            alert('Por favor, selecione uma ação.');
            return;
        }

        const config = apiConfig[selectedActionKey];
        if (!config) {
            alert('Configuração da API não encontrada para a ação selecionada.');
            return;
        }

        const formData = new FormData(apiForm);
        const requestBody = {};

        for (const [key, value] of formData.entries()) {
            if (key !== 'apiActions') {
                const paramConfig = config.params.find(p => p.name === key);
                if (paramConfig && paramConfig.type === 'number') {
                    requestBody[key] = parseFloat(value);
                } else {
                    requestBody[key] = value;
                }
            }
        }

        let url = `http://localhost:3000${config.path}`; 
        let fetchOptions = {
            method: config.method,
            headers: {}
        };

        if (config.method === 'GET') {
            const queryParams = new URLSearchParams(requestBody).toString();
            if (queryParams) {
                url += `?${queryParams}`;
            }
        } else if (config.method === 'DELETE') {
             fetchOptions.headers['Content-Type'] = 'application/json';
             fetchOptions.body = JSON.stringify(requestBody);
        }
        else {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(requestBody);
        }

        console.log('--- Requisição API ---');
        console.log('Ação selecionada:', selectedActionKey);
        console.log('Método HTTP:', config.method);
        console.log('URL da Requisição:', url);
        if (config.method === 'POST' || config.method === 'DELETE') {
            console.log('Body da Requisição:', requestBody);
        }

        try {
        const response = await fetch(url, fetchOptions);

        console.log('--- Resposta da API ---');
        console.log('Status:', response.status);

        let data;
        if (response.status !== 204) {
            data = await response.json();
            console.log('Dados:', data);
            responseContainer.innerHTML = JSON.stringify(data, null, 2); 
        } else {
            responseContainer.innerHTML = 'Usuário deletado com sucesso, assim como as contas bancárias atreladas a ele.';
        }

        } catch (error) {
            console.error('Erro ao chamar a API:', error);
            responseContainer.innerHTML = `Erro: ${error.message}`;
            alert('Ocorreu um erro ao tentar chamar a API.');
        }
    });

    renderParameters(apiActionsSelect.value);
});
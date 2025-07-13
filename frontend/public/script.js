document.addEventListener('DOMContentLoaded', () => {
    const apiActionsSelect = document.getElementById('apiActions');
    const parametersContainer = document.getElementById('parametersContainer');
    const apiForm = document.getElementById('apiForm');
    
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
        'getSaldo': {
            method: 'GET',
            path: '/saldo',
            params: [
                { name: 'accountId', type: 'text', label: 'ID da Conta:' }
            ]
        },
        'criarUsuario': {
            method: 'POST',
            path: '/criarUsuario',
            params: [
                { name: 'newUserId', type: 'text', label: 'Novo ID do Usuário:' },
                { name: 'newUserName', type: 'text', label: 'Nome do Novo Usuário:' }
            ]
        },
        'criarConta': {
            method: 'POST',
            path: '/criarConta',
            params: [
                { name: 'accountId', type: 'text', label: 'ID da Conta:' },
                { name: 'userId', type: 'text', label: 'ID do Usuário:' },
                { name: 'accountType', type: 'text', label: 'Tipo de Conta:' }
            ]
        },
        'deposito': {
            method: 'POST',
            path: '/deposito',
            params: [
                { name: 'accountId', type: 'text', label: 'ID da Conta:' },
                { name: 'amount', type: 'number', label: 'Valor:' }
            ]
        },
        'transferencia': {
            method: 'POST',
            path: '/transferencia',
            params: [
                { name: 'senderId', type: 'text', label: 'ID do Remetente:' },
                { name: 'senderAccountId', type: 'text', label: 'ID da Conta Remetente:' },
                { name: 'receiverId', type: 'text', label: 'ID do Destinatário:' },
                { name: 'receiverAccountId', type: 'text', label: 'ID da Conta Destinatário:' },
                { name: 'amount', type: 'number', label: 'Valor:' }
            ]
        },
        'comprarAtivosFixos': {
            method: 'POST',
            path: '/comprarAtivosFixos',
            params: [
                { name: 'accountId', type: 'text', label: 'ID da Conta:' },
                { name: 'accountType', type: 'text', label: 'Tipo de Conta:' },
                { name: 'investmentId', type: 'text', label: 'ID do Investimento:' },
                { name: 'investmentPaidPrice', type: 'number', label: 'Preço Pago pelo Investimento:' }
            ]
        },
        'deletarUsuario': {
            method: 'DELETE',
            path: '/deletarUsuario',
            params: [
                { name: 'userId', type: 'text', label: 'ID do Usuário a Deletar:' }
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
                requestBody[key] = value;
            }
        }

        let url = config.path;
        let fetchOptions = {
            method: config.method,
            headers: {}
        };

        // Lógica para GET e DELETE: parâmetros vão na URL (query string)
        if (config.method === 'GET' || config.method === 'DELETE') {
            const queryParams = new URLSearchParams(requestBody).toString();
            if (queryParams) {
                url += `?${queryParams}`;
            }
        } else { // POST: parâmetros vão no body
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(requestBody);
        }

        console.log('--- Requisição API ---');
        console.log('Ação selecionada:', selectedActionKey);
        console.log('Método HTTP:', config.method);
        console.log('URL da Requisição:', url);
        if (config.method === 'POST') {
            console.log('Body da Requisição:', requestBody);
        }
        console.log('----------------------');

        try {
            alert('Requisição simulada. Verifique o console para os detalhes da requisição.');

        } catch (error) {
            console.error('Erro ao chamar a API:', error);
            alert('Ocorreu um erro ao tentar chamar a API.');
        }
    });

    renderParameters(apiActionsSelect.value);
});

class CadastroModule {
    constructor() {
        this.currentTab = 'pacientes';
        this.initTabs();
        this.initForms();
        this.initFilters();
        this.initEventListeners();
        this.loadInitialData();
    }

    initTabs() {
        // Mostrar a aba inicial
        this.showTab(this.currentTab);

        // Configurar eventos de clique nas abas
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.target.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
    }

    showTab(tabName) {
        // Esconder todas as abas
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Desmarcar todas as abas
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Mostrar aba selecionada
        document.getElementById(`${tabName}-tab`).classList.add('active');
        document.getElementById(`${tabName}-content`).classList.add('active');
        this.currentTab = tabName;

        // Atualizar filtros para a aba atual
        this.updateFiltersForCurrentTab();
    }

    initForms() {
        // Inicializar máscaras de campos
        this.initMasks();

        // Configurar formulários
        this.initPacienteForm();
        this.initMedicoForm();
        this.initConvenioForm();
        this.initEspecialidadeForm();
        this.initServicoForm();
        this.initAgendaForm();
    }

    initMasks() {
        // Máscaras para CPF, telefone, etc.
        if (typeof $.fn.mask === 'function') {
            $('.cpf-mask').mask('000.000.000-00', { reverse: true });
            $('.phone-mask').mask('(00) 0000-0000');
            $('.celular-mask').mask('(00) 00000-0000');
            $('.cep-mask').mask('00000-000');
            $('.crm-mask').mask('000000/UF');
            $('.money-mask').mask('000.000.000.000.000,00', { reverse: true });
        }
    }

    initPacienteForm() {
        const form = document.getElementById('form-paciente');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePaciente(new FormData(form));
        });

        // Auto-completar endereço via CEP
        const cepInput = document.getElementById('paciente-cep');
        if (cepInput) {
            cepInput.addEventListener('blur', () => {
                const cep = cepInput.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    this.buscarEnderecoPorCEP(cep);
                }
            });
        }
    }

    initMedicoForm() {
        const form = document.getElementById('form-medico');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMedico(new FormData(form));
        });
    }

    initConvenioForm() {
        const form = document.getElementById('form-convenio');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveConvenio(new FormData(form));
        });
    }

    initEspecialidadeForm() {
        const form = document.getElementById('form-especialidade');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEspecialidade(new FormData(form));
        });
    }

    initServicoForm() {
        const form = document.getElementById('form-servico');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveServico(new FormData(form));
        });
    }

    initAgendaForm() {
        const form = document.getElementById('form-agenda');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAgenda(new FormData(form));
        });

        // Inicializar datepickers
        $('.datepicker').datepicker({
            format: 'dd/mm/yyyy',
            language: 'pt-BR',
            autoclose: true
        });

        // Inicializar timepickers
        $('.timepicker').timepicker({
            showMeridian: false,
            minuteStep: 15
        });
    }

    initFilters() {
        // Inicializar filtros para cada tipo de cadastro
        this.initPacienteFilters();
        this.initMedicoFilters();
        this.initConvenioFilters();
        this.initEspecialidadeFilters();
        this.initServicoFilters();
        this.initAgendaFilters();
    }

    initPacienteFilters() {
        const form = document.getElementById('filter-paciente');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.applyPacienteFilters();
        });

        document.getElementById('clear-filter-paciente').addEventListener('click', () => {
            form.reset();
            this.applyPacienteFilters();
        });
    }

    initMedicoFilters() {
        const form = document.getElementById('filter-medico');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.applyMedicoFilters();
        });

        document.getElementById('clear-filter-medico').addEventListener('click', () => {
            form.reset();
            this.applyMedicoFilters();
        });
    }

    initConvenioFilters() {
        const form = document.getElementById('filter-convenio');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.applyConvenioFilters();
        });

        document.getElementById('clear-filter-convenio').addEventListener('click', () => {
            form.reset();
            this.applyConvenioFilters();
        });
    }

    initEspecialidadeFilters() {
        const form = document.getElementById('filter-especialidade');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.applyEspecialidadeFilters();
        });

        document.getElementById('clear-filter-especialidade').addEventListener('click', () => {
            form.reset();
            this.applyEspecialidadeFilters();
        });
    }

    initServicoFilters() {
        const form = document.getElementById('filter-servico');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.applyServicoFilters();
        });

        document.getElementById('clear-filter-servico').addEventListener('click', () => {
            form.reset();
            this.applyServicoFilters();
        });
    }

    initAgendaFilters() {
        const form = document.getElementById('filter-agenda');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.applyAgendaFilters();
        });

        document.getElementById('clear-filter-agenda').addEventListener('click', () => {
            form.reset();
            this.applyAgendaFilters();
        });
    }

    applyPacienteFilters() {
        const filters = {
            nome: document.getElementById('filter-paciente-nome').value,
            cpf: document.getElementById('filter-paciente-cpf').value,
            status: document.getElementById('filter-paciente-status').value,
            convenio: document.getElementById('filter-paciente-convenio').value,
            dataInicio: document.getElementById('filter-paciente-data-inicio').value,
            dataFim: document.getElementById('filter-paciente-data-fim').value
        };

        // Aplicar filtros na tabela
        this.filterTable('table-pacientes', filters);
    }

    applyMedicoFilters() {
        const filters = {
            nome: document.getElementById('filter-medico-nome').value,
            crm: document.getElementById('filter-medico-crm').value,
            especialidade: document.getElementById('filter-medico-especialidade').value,
            status: document.getElementById('filter-medico-status').value
        };

        this.filterTable('table-medicos', filters);
    }

    applyConvenioFilters() {
        const filters = {
            nome: document.getElementById('filter-convenio-nome').value,
            codigo: document.getElementById('filter-convenio-codigo').value,
            status: document.getElementById('filter-convenio-status').value
        };

        this.filterTable('table-convenios', filters);
    }

    applyEspecialidadeFilters() {
        const filters = {
            nome: document.getElementById('filter-especialidade-nome').value,
            status: document.getElementById('filter-especialidade-status').value
        };

        this.filterTable('table-especialidades', filters);
    }

    applyServicoFilters() {
        const filters = {
            nome: document.getElementById('filter-servico-nome').value,
            tipo: document.getElementById('filter-servico-tipo').value,
            status: document.getElementById('filter-servico-status').value
        };

        this.filterTable('table-servicos', filters);
    }

    applyAgendaFilters() {
        const filters = {
            medico: document.getElementById('filter-agenda-medico').value,
            especialidade: document.getElementById('filter-agenda-especialidade').value,
            dataInicio: document.getElementById('filter-agenda-data-inicio').value,
            dataFim: document.getElementById('filter-agenda-data-fim').value,
            status: document.getElementById('filter-agenda-status').value
        };

        this.filterTable('table-agendas', filters);
    }

    filterTable(tableId, filters) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowData = this.getRowData(row, tableId);
            const shouldShow = this.evaluateRowAgainstFilters(rowData, filters);
            row.style.display = shouldShow ? '' : 'none';
        });
    }

    getRowData(row, tableId) {
        const cells = row.querySelectorAll('td');
        const rowData = {};
        
        // Mapear células para dados baseado no tipo de tabela
        switch(tableId) {
            case 'table-pacientes':
                rowData.nome = cells[0].textContent;
                rowData.cpf = cells[1].textContent;
                rowData.convenio = cells[2].textContent;
                rowData.status = cells[3].querySelector('.badge').textContent;
                rowData.dataCadastro = cells[4].textContent;
                break;
                
            case 'table-medicos':
                rowData.nome = cells[0].textContent;
                rowData.crm = cells[1].textContent;
                rowData.especialidade = cells[2].textContent;
                rowData.status = cells[3].querySelector('.badge').textContent;
                break;
                
            // Adicionar outros casos para diferentes tabelas
            default:
                cells.forEach((cell, index) => {
                    rowData[`col${index}`] = cell.textContent;
                });
        }
        
        return rowData;
    }

    evaluateRowAgainstFilters(rowData, filters) {
        for (const [key, value] of Object.entries(filters)) {
            if (!value) continue;
            
            const rowValue = String(rowData[key] || '').toLowerCase();
            const filterValue = String(value).toLowerCase();
            
            // Filtro para datas
            if (key.includes('data')) {
                if (!this.filterDate(rowData, key, value, filters)) {
                    return false;
                }
                continue;
            }
            
            // Filtro padrão (contém texto)
            if (!rowValue.includes(filterValue)) {
                return false;
            }
        }
        
        return true;
    }

    filterDate(rowData, key, value, filters) {
        if (!value) return true;
        
        const rowDate = this.parseDate(rowData[key] || rowData[key.replace('Inicio', '').replace('Fim', '')]);
        if (!rowDate) return true;
        
        if (key.includes('Inicio') && filters.dataFim) {
            const endDate = this.parseDate(filters.dataFim);
            return rowDate >= this.parseDate(value) && rowDate <= endDate;
        }
        
        if (key.includes('Fim') && filters.dataInicio) {
            const startDate = this.parseDate(filters.dataInicio);
            return rowDate <= this.parseDate(value) && rowDate >= startDate;
        }
        
        if (key.includes('Inicio')) {
            return rowDate >= this.parseDate(value);
        }
        
        if (key.includes('Fim')) {
            return rowDate <= this.parseDate(value);
        }
        
        return rowDate.toDateString() === this.parseDate(value).toDateString();
    }

    parseDate(dateString) {
        if (!dateString) return null;
        
        // Tentar vários formatos de data
        const formats = [
            { regex: /(\d{2})\/(\d{2})\/(\d{4})/, parts: [2, 1, 0] }, // dd/mm/yyyy
            { regex: /(\d{4})-(\d{2})-(\d{2})/, parts: [0, 1, 2] },    // yyyy-mm-dd
            { regex: /(\d{2})-(\d{2})-(\d{4})/, parts: [2, 1, 0] }     // mm-dd-yyyy
        ];
        
        for (const format of formats) {
            const match = dateString.match(format.regex);
            if (match) {
                const year = parseInt(match[format.parts[0] + 1]);
                const month = parseInt(match[format.parts[1] + 1]) - 1;
                const day = parseInt(match[format.parts[2] + 1]);
                return new Date(year, month, day);
            }
        }
        
        return null;
    }

    initEventListeners() {
        // Botões de exportação
        document.querySelectorAll('.btn-export-pdf').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tableId = e.target.closest('button').getAttribute('data-table');
                const filters = this.getCurrentFilters();
                exportFilteredToPDF(tableId, filters, `${this.currentTab}_${tableId}`);
            });
        });

        document.querySelectorAll('.btn-export-excel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tableId = e.target.closest('button').getAttribute('data-table');
                const filters = this.getCurrentFilters();
                exportFilteredToExcel(tableId, filters, `${this.currentTab}_${tableId}`);
            });
        });

        // Botões de ação
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.editarRegistro(id);
            });
        });

        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.excluirRegistro(id);
            });
        });
    }

    getCurrentFilters() {
        const filters = {};
        const currentTab = this.currentTab;

        switch (currentTab) {
            case 'pacientes':
                filters.nome = document.getElementById('filter-paciente-nome')?.value;
                filters.cpf = document.getElementById('filter-paciente-cpf')?.value;
                filters.status = document.getElementById('filter-paciente-status')?.value;
                filters.convenio = document.getElementById('filter-paciente-convenio')?.value;
                filters.dataInicio = document.getElementById('filter-paciente-data-inicio')?.value;
                filters.dataFim = document.getElementById('filter-paciente-data-fim')?.value;
                break;

            case 'medicos':
                filters.nome = document.getElementById('filter-medico-nome')?.value;
                filters.crm = document.getElementById('filter-medico-crm')?.value;
                filters.especialidade = document.getElementById('filter-medico-especialidade')?.value;
                filters.status = document.getElementById('filter-medico-status')?.value;
                break;

            case 'convenios':
                filters.nome = document.getElementById('filter-convenio-nome')?.value;
                filters.codigo = document.getElementById('filter-convenio-codigo')?.value;
                filters.status = document.getElementById('filter-convenio-status')?.value;
                break;

            case 'especialidades':
                filters.nome = document.getElementById('filter-especialidade-nome')?.value;
                filters.status = document.getElementById('filter-especialidade-status')?.value;
                break;

            case 'servicos':
                filters.nome = document.getElementById('filter-servico-nome')?.value;
                filters.tipo = document.getElementById('filter-servico-tipo')?.value;
                filters.status = document.getElementById('filter-servico-status')?.value;
                break;

            case 'agendas':
                filters.medico = document.getElementById('filter-agenda-medico')?.value;
                filters.especialidade = document.getElementById('filter-agenda-especialidade')?.value;
                filters.dataInicio = document.getElementById('filter-agenda-data-inicio')?.value;
                filters.dataFim = document.getElementById('filter-agenda-data-fim')?.value;
                filters.status = document.getElementById('filter-agenda-status')?.value;
                break;
        }

        return filters;
    }

    loadInitialData() {
        // Carregar dados iniciais para cada aba
        this.loadPacientes();
        this.loadMedicos();
        this.loadConvenios();
        this.loadEspecialidades();
        this.loadServicos();
        this.loadAgendas();
    }

    loadPacientes() {
        // Simular carregamento de pacientes
        setTimeout(() => {
            const pacientes = [
                { id: 1, nome: 'João Silva', cpf: '123.456.789-00', convenio: 'Unimed', status: 'Ativo', dataCadastro: '15/05/2023' },
                { id: 2, nome: 'Maria Souza', cpf: '987.654.321-00', convenio: 'Amil', status: 'Ativo', dataCadastro: '14/05/2023' },
                { id: 3, nome: 'Pedro Costa', cpf: '456.789.123-00', convenio: 'Bradesco Saúde', status: 'Inativo', dataCadastro: '10/05/2023' },
                { id: 4, nome: 'Ana Oliveira', cpf: '789.123.456-00', convenio: 'SulAmérica', status: 'Ativo', dataCadastro: '08/05/2023' },
                { id: 5, nome: 'Luiz Pereira', cpf: '321.654.987-00', convenio: 'Unimed', status: 'Pendente', dataCadastro: '05/05/2023' }
            ];

            this.populateTable('table-pacientes', pacientes);
        }, 500);
    }

    loadMedicos() {
        // Simular carregamento de médicos
        setTimeout(() => {
            const medicos = [
                { id: 1, nome: 'Dr. Carlos', crm: '12345/SP', especialidade: 'Cardiologia', status: 'Ativo' },
                { id: 2, nome: 'Dra. Ana', crm: '54321/SP', especialidade: 'Pediatria', status: 'Ativo' },
                { id: 3, nome: 'Dr. Roberto', crm: '67890/SP', especialidade: 'Ortopedia', status: 'Ativo' },
                { id: 4, nome: 'Dra. Fernanda', crm: '09876/SP', especialidade: 'Dermatologia', status: 'Inativo' },
                { id: 5, nome: 'Dr. Marcelo', crm: '13579/SP', especialidade: 'Cardiologia', status: 'Ativo' }
            ];

            this.populateTable('table-medicos', medicos);
        }, 500);
    }

    loadConvenios() {
        // Simular carregamento de convênios
        setTimeout(() => {
            const convenios = [
                { id: 1, nome: 'Unimed', codigo: 'UNI123', status: 'Ativo' },
                { id: 2, nome: 'Amil', codigo: 'AMI456', status: 'Ativo' },
                { id: 3, nome: 'Bradesco Saúde', codigo: 'BRD789', status: 'Ativo' },
                { id: 4, nome: 'SulAmérica', codigo: 'SUL012', status: 'Inativo' },
                { id: 5, nome: 'NotreDame', codigo: 'NOT345', status: 'Ativo' }
            ];

            this.populateTable('table-convenios', convenios);
        }, 500);
    }

    loadEspecialidades() {
        // Simular carregamento de especialidades
        setTimeout(() => {
            const especialidades = [
                { id: 1, nome: 'Cardiologia', status: 'Ativo' },
                { id: 2, nome: 'Pediatria', status: 'Ativo' },
                { id: 3, nome: 'Ortopedia', status: 'Ativo' },
                { id: 4, nome: 'Dermatologia', status: 'Ativo' },
                { id: 5, nome: 'Clínico Geral', status: 'Ativo' }
            ];

            this.populateTable('table-especialidades', especialidades);
        }, 500);
    }

    loadServicos() {
        // Simular carregamento de serviços
        setTimeout(() => {
            const servicos = [
                { id: 1, nome: 'Consulta', tipo: 'Consulta', status: 'Ativo' },
                { id: 2, nome: 'Retorno', tipo: 'Consulta', status: 'Ativo' },
                { id: 3, nome: 'Eletrocardiograma', tipo: 'Exame', status: 'Ativo' },
                { id: 4, nome: 'Raio-X', tipo: 'Exame', status: 'Inativo' },
                { id: 5, nome: 'Ultrassom', tipo: 'Exame', status: 'Ativo' }
            ];

            this.populateTable('table-servicos', servicos);
        }, 500);
    }

    loadAgendas() {
        // Simular carregamento de agendas
        setTimeout(() => {
            const agendas = [
                { id: 1, medico: 'Dr. Carlos', especialidade: 'Cardiologia', data: '15/05/2023', status: 'Confirmado' },
                { id: 2, medico: 'Dra. Ana', especialidade: 'Pediatria', data: '15/05/2023', status: 'Confirmado' },
                { id: 3, medico: 'Dr. Roberto', especialidade: 'Ortopedia', data: '16/05/2023', status: 'Pendente' },
                { id: 4, medico: 'Dra. Fernanda', especialidade: 'Dermatologia', data: '16/05/2023', status: 'Cancelado' },
                { id: 5, medico: 'Dr. Marcelo', especialidade: 'Cardiologia', data: '17/05/2023', status: 'Agendado' }
            ];

            this.populateTable('table-agendas', agendas);
        }, 500);
    }

    populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = data.map(item => {
            switch(tableId) {
                case 'table-pacientes':
                    return `
                        <tr>
                            <td>${item.nome}</td>
                            <td>${item.cpf}</td>
                            <td>${item.convenio}</td>
                            <td><span class="badge ${this.getStatusBadgeClass(item.status)}">${item.status}</span></td>
                            <td>${item.dataCadastro}</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-primary btn-editar" data-id="${item.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger btn-excluir" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                
                case 'table-medicos':
                    return `
                        <tr>
                            <td>${item.nome}</td>
                            <td>${item.crm}</td>
                            <td>${item.especialidade}</td>
                            <td><span class="badge ${this.getStatusBadgeClass(item.status)}">${item.status}</span></td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-primary btn-editar" data-id="${item.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger btn-excluir" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                
                // Adicionar outros casos para diferentes tabelas
                default:
                    return `
                        <tr>
                            <td>${item.nome}</td>
                            <td>${item.especialidade || item.tipo || ''}</td>
                            <td><span class="badge ${this.getStatusBadgeClass(item.status)}">${item.status}</span></td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-primary btn-editar" data-id="${item.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger btn-excluir" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
            }
        }).join('');
    }

    getStatusBadgeClass(status) {
        switch(status.toLowerCase()) {
            case 'ativo':
            case 'confirmado':
            case 'agendado':
                return 'bg-success';
            case 'pendente':
                return 'bg-warning text-dark';
            case 'inativo':
            case 'cancelado':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    buscarEnderecoPorCEP(cep) {
        // Simular busca de endereço via API
        console.log(`Buscando endereço para CEP: ${cep}`);
        
        // Exemplo de como seria com a API ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('paciente-endereco').value = data.logradouro;
                    document.getElementById('paciente-bairro').value = data.bairro;
                    document.getElementById('paciente-cidade').value = data.localidade;
                    document.getElementById('paciente-uf').value = data.uf;
                } else {
                    showToast('CEP não encontrado', 'warning');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                showToast('Erro ao buscar CEP', 'danger');
            });
    }

    savePaciente(formData) {
        // Simular salvamento
        console.log('Salvando paciente:', Object.fromEntries(formData));
        showToast('Paciente salvo com sucesso!', 'success');
        this.loadPacientes();
    }

    saveMedico(formData) {
        console.log('Salvando médico:', Object.fromEntries(formData));
        showToast('Médico salvo com sucesso!', 'success');
        this.loadMedicos();
    }

    saveConvenio(formData) {
        console.log('Salvando convênio:', Object.fromEntries(formData));
        showToast('Convênio salvo com sucesso!', 'success');
        this.loadConvenios();
    }

    saveEspecialidade(formData) {
        console.log('Salvando especialidade:', Object.fromEntries(formData));
        showToast('Especialidade salva com sucesso!', 'success');
        this.loadEspecialidades();
    }

    saveServico(formData) {
        console.log('Salvando serviço:', Object.fromEntries(formData));
        showToast('Serviço salvo com sucesso!', 'success');
        this.loadServicos();
    }

    saveAgenda(formData) {
        console.log('Salvando agenda:', Object.fromEntries(formData));
        showToast('Agenda salva com sucesso!', 'success');
        this.loadAgendas();
    }

    editarRegistro(id) {
        // Simular edição
        console.log(`Editando registro ID: ${id}`);
        showToast(`Editando registro ${id}`, 'info');
    }

    excluirRegistro(id) {
        // Confirmar antes de excluir
        if (confirm('Tem certeza que deseja excluir este registro?')) {
            console.log(`Excluindo registro ID: ${id}`);
            showToast('Registro excluído com sucesso!', 'success');
            
            // Recarregar dados
            switch(this.currentTab) {
                case 'pacientes': this.loadPacientes(); break;
                case 'medicos': this.loadMedicos(); break;
                case 'convenios': this.loadConvenios(); break;
                case 'especialidades': this.loadEspecialidades(); break;
                case 'servicos': this.loadServicos(); break;
                case 'agendas': this.loadAgendas(); break;
            }
        }
    }

    updateFiltersForCurrentTab() {
        // Atualizar opções de filtro dinâmicas
        switch(this.currentTab) {
            case 'pacientes':
                // Atualizar opções de convênio
                break;
            case 'medicos':
                // Atualizar opções de especialidade
                break;
            case 'agendas':
                // Atualizar opções de médico e especialidade
                break;
        }
    }
}

// Inicializar módulo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-module="cadastro"]')) {
        new CadastroModule();
    }
});

// Helper function para mostrar toasts
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.role = 'alert';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1100';
    document.body.appendChild(container);
    return container;
}

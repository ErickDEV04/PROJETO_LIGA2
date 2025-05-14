
class AtendimentoModule {
    constructor() {
        this.table = null;
        this.initFilters();
        this.initTable();
        this.initEventListeners();
    }
    
    initFilters() {
        // Filtro de status
        const statusFilter = document.getElementById('filterStatus');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // Filtros de data
        const startDateFilter = document.getElementById('filterStartDate');
        const endDateFilter = document.getElementById('filterEndDate');
        
        if (startDateFilter) {
            startDateFilter.addEventListener('change', () => {
                if (endDateFilter && endDateFilter.value && startDateFilter.value > endDateFilter.value) {
                    endDateFilter.value = startDateFilter.value;
                }
                this.applyFilters();
            });
        }
        
        if (endDateFilter) {
            endDateFilter.addEventListener('change', () => {
                if (startDateFilter && startDateFilter.value && endDateFilter.value < startDateFilter.value) {
                    startDateFilter.value = endDateFilter.value;
                }
                this.applyFilters();
            });
        }
    }
    
    initTable() {
        // Inicializar DataTable
        this.table = $('#atendimentosTable').DataTable({
            responsive: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/pt-BR.json'
            },
            columns: [
                { data: 'id' },
                { data: 'paciente' },
                { data: 'medico' },
                { data: 'data' },
                { data: 'convenio' },
                { 
                    data: 'status',
                    render: function(data) {
                        const badgeClass = getStatusBadgeClass(data);
                        return `<span class="badge ${badgeClass}">${data}</span>`;
                    }
                }
            ]
        });
        
        // Carregar dados iniciais
        this.loadData();
    }
    
    loadData() {
        // Dados mockados - na implementação real, você buscaria de uma API
        const data = [
            { id: 1001, paciente: 'João Silva', medico: 'Dr. Carlos', data: '15/05/2023 09:00', convenio: 'Unimed', status: 'Confirmado' },
            { id: 1002, paciente: 'Maria Souza', medico: 'Dra. Ana', data: '15/05/2023 10:30', convenio: 'Amil', status: 'Confirmado' },
            { id: 1003, paciente: 'Pedro Costa', medico: 'Dr. Roberto', data: '15/05/2023 11:15', convenio: 'Bradesco Saúde', status: 'Pendente' },
            { id: 1004, paciente: 'Ana Oliveira', medico: 'Dra. Fernanda', data: '14/05/2023 14:00', convenio: 'SulAmérica', status: 'Confirmado' },
            { id: 1005, paciente: 'Luiz Pereira', medico: 'Dr. Marcelo', data: '14/05/2023 15:30', convenio: 'Unimed', status: 'Cancelado' },
            { id: 1006, paciente: 'Carlos Mendes', medico: 'Dr. Roberto', data: '16/05/2023 08:00', convenio: 'Amil', status: 'Agendado' },
            { id: 1007, paciente: 'Fernanda Lima', medico: 'Dra. Patrícia', data: '16/05/2023 11:00', convenio: 'Bradesco Saúde', status: 'Agendado' }
        ];
        
        this.table.clear().rows.add(data).draw();
    }
    
    applyFilters() {
        const filters = this.getFilters();
        
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                const rowData = this.table.row(dataIndex).data();
                return evaluateFilters(rowData, filters);
            }.bind(this)
        );
        
        this.table.draw();
        $.fn.dataTable.ext.search.pop();
    }
    
    getFilters() {
        return {
            status: document.getElementById('filterStatus')?.value,
            dateRange: {
                start: document.getElementById('filterStartDate')?.value,
                end: document.getElementById('filterEndDate')?.value
            }
        };
    }
    
    initEventListeners() {
        // Botão de limpar filtros
        document.getElementById('clearFilters')?.addEventListener('click', () => {
            document.getElementById('filterStatus').value = 'todos';
            document.getElementById('filterStartDate').value = '';
            document.getElementById('filterEndDate').value = '';
            this.applyFilters();
        });
    }
}

// Helper function
function getStatusBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'confirmado': return 'bg-success';
        case 'pendente': 
        case 'agendado': return 'bg-warning text-dark';
        case 'cancelado': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Inicializar módulo quando a página carregar
if (document.querySelector('[data-module="atendimento"]')) {
    new AtendimentoModule();
}

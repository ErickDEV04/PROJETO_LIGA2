
// dashboard.js - Módulo do Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gráficos
    initCharts();
    
    // Inicializar filtros
    initFilters();
    
    // Carregar dados iniciais
    loadDashboardData();
    
    // Configurar eventos
    setupEventListeners();
});

function initCharts() {
    // Gráfico de consultas por status
    const statusCtx = document.getElementById('consultasStatusChart');
    if (statusCtx) {
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Confirmadas', 'Pendentes', 'Canceladas'],
                datasets: [{
                    data: [65, 15, 20],
                    backgroundColor: [
                        '#28a745',
                        '#ffc107',
                        '#dc3545'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Gráfico de consultas por especialidade
    const especialidadeCtx = document.getElementById('consultasEspecialidadeChart');
    if (especialidadeCtx) {
        new Chart(especialidadeCtx, {
            type: 'bar',
            data: {
                labels: ['Cardiologia', 'Pediatria', 'Ortopedia', 'Dermatologia', 'Clínico Geral'],
                datasets: [{
                    label: 'Consultas',
                    data: [12, 19, 8, 5, 10],
                    backgroundColor: '#0ea3af'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function initFilters() {
    // Filtro de período
    const rangeFilter = document.getElementById('dashboardRange');
    if (rangeFilter) {
        rangeFilter.addEventListener('change', updateDashboard);
    }
    
    // Filtro de tipo de visualização
    const viewFilter = document.getElementById('dashboardViewType');
    if (viewFilter) {
        viewFilter.addEventListener('change', updateDashboard);
    }
}

function updateDashboard() {
    const filters = getDashboardFilters();
    loadDashboardData(filters);
}

function getDashboardFilters() {
    return {
        range: document.getElementById('dashboardRange')?.value,
        viewType: document.getElementById('dashboardViewType')?.value
    };
}

function loadDashboardData(filters = {}) {
    // Simular carregamento de dados
    showLoading(true);
    
    // Dados mockados - na implementação real, você buscaria de uma API
    setTimeout(() => {
        updateStatusCards(filters);
        updateRecentAppointments(filters);
        updateNextAppointments(filters);
        showLoading(false);
    }, 800);
}

function updateStatusCards(filters) {
    // Atualizar cards de status com base nos filtros
    const cards = {
        consultasHoje: document.getElementById('consultasHojeCard'),
        pacientesNovos: document.getElementById('pacientesNovosCard'),
        receitaDiaria: document.getElementById('receitaDiariaCard'),
        atendimentosPendentes: document.getElementById('atendimentosPendentesCard')
    };
    
    // Valores mockados - na implementação real, você buscaria de uma API
    const values = {
        consultasHoje: calculateConsultasHoje(filters),
        pacientesNovos: calculatePacientesNovos(filters),
        receitaDiaria: calculateReceitaDiaria(filters),
        atendimentosPendentes: calculateAtendimentosPendentes(filters)
    };
    
    // Atualizar os cards
    for (const [key, card] of Object.entries(cards)) {
        if (card) {
            const valueElement = card.querySelector('.stat-value');
            if (valueElement) {
                valueElement.textContent = values[key].value;
            }
            
            const progressElement = card.querySelector('.progress-bar');
            if (progressElement) {
                progressElement.style.width = `${values[key].progress}%`;
                progressElement.textContent = `${values[key].progress}%`;
            }
        }
    }
}

function calculateConsultasHoje(filters) {
    // Lógica mockada - na implementação real, você buscaria de uma API
    return { value: 24, progress: 75 };
}

function calculatePacientesNovos(filters) {
    // Lógica mockada
    return { value: 8, progress: 40 };
}

function calculateReceitaDiaria(filters) {
    // Lógica mockada
    return { value: 'R$ 5.240,00', progress: 65 };
}

function calculateAtendimentosPendentes(filters) {
    // Lógica mockada
    return { value: 3, progress: 15 };
}

function updateRecentAppointments(filters) {
    // Atualizar tabela de agendamentos recentes
    const tableBody = document.querySelector('#recentAppointmentsTable tbody');
    if (!tableBody) return;
    
    // Dados mockados - na implementação real, você buscaria de uma API
    const appointments = [
        { paciente: 'João Silva', medico: 'Dr. Carlos', data: '15/05/2023 09:00', convenio: 'Unimed', status: 'Confirmado' },
        { paciente: 'Maria Souza', medico: 'Dra. Ana', data: '15/05/2023 10:30', convenio: 'Amil', status: 'Confirmado' },
        { paciente: 'Pedro Costa', medico: 'Dr. Roberto', data: '15/05/2023 11:15', convenio: 'Bradesco Saúde', status: 'Pendente' },
        { paciente: 'Ana Oliveira', medico: 'Dra. Fernanda', data: '14/05/2023 14:00', convenio: 'SulAmérica', status: 'Confirmado' },
        { paciente: 'Luiz Pereira', medico: 'Dr. Marcelo', data: '14/05/2023 15:30', convenio: 'Unimed', status: 'Cancelado' }
    ];
    
    // Aplicar filtros
    const filteredAppointments = applyDataFilters(appointments, filters);
    
    // Atualizar tabela
    tableBody.innerHTML = filteredAppointments.map(app => `
        <tr>
            <td>${app.paciente}</td>
            <td>${app.medico}</td>
            <td>${app.data}</td>
            <td>${app.convenio}</td>
            <td><span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span></td>
        </tr>
    `).join('');
}

function updateNextAppointments(filters) {
    // Atualizar lista de próximas consultas
    const listGroup = document.querySelector('.nextAppointmentsList');
    if (!listGroup) return;
    
    // Dados mockados - na implementação real, você buscaria de uma API
    const appointments = [
        { paciente: 'João Silva', medico: 'Dr. Carlos', data: 'Hoje, 09:00', especialidade: 'Cardiologia' },
        { paciente: 'Maria Souza', medico: 'Dra. Ana', data: 'Hoje, 10:30', especialidade: 'Pediatria' },
        { paciente: 'Carlos Mendes', medico: 'Dr. Roberto', data: 'Amanhã, 08:00', especialidade: 'Ortopedia' },
        { paciente: 'Fernanda Lima', medico: 'Dra. Patrícia', data: 'Amanhã, 11:00', especialidade: 'Dermatologia' }
    ];
    
    // Aplicar filtros
    const filteredAppointments = applyDataFilters(appointments, filters);
    
    // Atualizar lista
    listGroup.innerHTML = filteredAppointments.map(app => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h6 class="mb-1">${app.paciente}</h6>
                <small class="text-muted">${app.medico} • ${app.especialidade}</small>
            </div>
            <span class="badge bg-primary rounded-pill">${app.data}</span>
        </li>
    `).join('');
}

function setupEventListeners() {
    // Botão de exportar PDF
    document.getElementById('exportDashboardPdf')?.addEventListener('click', () => {
        const filters = getDashboardFilters();
        exportFilteredToPDF('dashboardContent', {
            ...filters,
            orientation: 'landscape',
            header: {
                text: `Dashboard MED+ - ${new Date().toLocaleDateString('pt-BR')}`
            }
        }, 'dashboard_medplus');
    });
    
    // Botão de exportar Excel
    document.getElementById('exportDashboardExcel')?.addEventListener('click', () => {
        exportDashboardToExcel();
    });
    
    // Botão de atualizar
    document.getElementById('refreshDashboard')?.addEventListener('click', () => {
        updateDashboard();
    });
}

function exportDashboardToExcel() {
    try {
        const filters = getDashboardFilters();
        const wb = XLSX.utils.book_new();
        
        // Adicionar aba de estatísticas
        const statsData = [
            ['Estatísticas do Dashboard'],
            ['Consultas Hoje', calculateConsultasHoje(filters).value],
            ['Pacientes Novos', calculatePacientesNovos(filters).value],
            ['Receita Diária', calculateReceitaDiaria(filters).value],
            ['Atendimentos Pendentes', calculateAtendimentosPendentes(filters).value],
            [''],
            ['Filtros aplicados'],
            ['Período', filters.range || 'Todos'],
            ['Tipo de visualização', filters.viewType || 'Padrão'],
            ['Data de exportação', new Date().toLocaleString('pt-BR')]
        ];
        
        const wsStats = XLSX.utils.aoa_to_sheet(statsData);
        XLSX.utils.book_append_sheet(wb, wsStats, "Estatísticas");
        
        // Adicionar aba de agendamentos recentes
        const table = document.getElementById('recentAppointmentsTable');
        if (table) {
            const wsAppointments = XLSX.utils.table_to_sheet(table);
            XLSX.utils.book_append_sheet(wb, wsAppointments, "Agendamentos");
        }
        
        // Salvar arquivo
        XLSX.writeFile(wb, `dashboard_${new Date().toISOString().slice(0,10)}.xlsx`);
        showToast('Dashboard exportado com sucesso!', 'success');
    } catch (err) {
        console.error('Erro ao exportar dashboard:', err);
        showToast('Erro ao exportar dashboard', 'danger');
    }
}

function showLoading(show) {
    const loadingElement = document.getElementById('dashboardLoading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

// Helper function
function getStatusBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'confirmado': return 'bg-success';
        case 'pendente': return 'bg-warning text-dark';
        case 'cancelado': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

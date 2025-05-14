
// Configuração inicial do aplicativo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!isAuthenticated() && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Inicializar módulos
    initModules();
    loadDashboardData();
    initExportHandlers();
    
    // Configurar logout
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
});

// Funções de Autenticação
function isAuthenticated() {
    const token = localStorage.getItem('medplus_token');
    return token !== null && token !== undefined;
}

function logout() {
    localStorage.removeItem('medplus_token');
    window.location.href = 'index.html';
}

// Inicialização dos módulos
function initModules() {
    const modules = ['cadastro', 'agendamento', 'atendimento'];
    
    modules.forEach(module => {
        const links = document.querySelectorAll(`[data-module="${module}"]`);
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                loadModule(module);
            });
        });
    });
}

// Carregar módulo
function loadModule(moduleName) {
    // Atualizar navegação
    document.querySelectorAll('.ios-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`[data-module="${moduleName}"]`).classList.add('active');
    
    // Aqui você implementaria a lógica para carregar o conteúdo do módulo
    console.log(`Módulo carregado: ${moduleName}`);
}

// Inicializador de handlers de exportação
function initExportHandlers() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.export-pdf-btn')) {
            handleExport(e, 'pdf');
        } else if (e.target.closest('.export-excel-btn')) {
            handleExport(e, 'excel');
        }
    });
}

// Handler centralizado para exportação
function handleExport(event, type) {
    const btn = event.target.closest('.export-btn');
    if (!btn) return;
    
    const elementId = btn.getAttribute('data-element');
    const module = btn.getAttribute('data-module') || 'default';
    const filters = getCurrentFilters(module);
    
    if (type === 'pdf') {
        exportFilteredToPDF(elementId, filters, `${module}_${elementId}`);
    } else {
        exportFilteredToExcel(elementId, filters, `${module}_${elementId}`);
    }
}

// Obter filtros atuais do módulo
function getCurrentFilters(module) {
    const filters = {};
    
    switch (module) {
        case 'atendimento':
            filters.status = document.getElementById('filterStatus')?.value;
            filters.dateRange = {
                start: document.getElementById('filterStartDate')?.value,
                end: document.getElementById('filterEndDate')?.value
            };
            break;
            
        case 'agendamento':
            filters.especialidade = document.getElementById('especialidadeFilter')?.value;
            filters.servico = document.getElementById('servicoFilter')?.value;
            break;
            
        case 'cadastro':
            const activeTab = document.querySelector('.cadastro-tab.active');
            const prefix = activeTab?.id.replace('Tab', '');
            if (prefix) {
                filters.status = document.getElementById(`${prefix}StatusFilter`)?.value;
                filters.dateRange = {
                    start: document.getElementById(`${prefix}StartDateFilter`)?.value,
                    end: document.getElementById(`${prefix}EndDateFilter`)?.value
                };
            }
            break;
            
        case 'dashboard':
            filters.range = document.getElementById('dashboardRange')?.value;
            filters.viewType = document.getElementById('dashboardViewType')?.value;
            break;
    }
    
    return filters;
}

// Exportação com filtros para PDF
function exportFilteredToPDF(elementId, filters, fileName) {
    const element = document.getElementById(elementId);
    if (!element) {
        showToast('Elemento não encontrado para exportação', 'danger');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: filters?.orientation || 'portrait',
        unit: 'mm'
    });

    // Criar clone para aplicar filtros
    const clone = element.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);

    // Aplicar filtros no clone
    applyFiltersToElement(clone, filters);

    html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = filters?.orientation === 'landscape' ? 297 : 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        
        // Adicionar cabeçalho com filtros
        if (filters) {
            doc.setFontSize(10);
            doc.setTextColor(100);
            const filtersText = formatFiltersForHeader(filters);
            doc.text(`Filtros: ${filtersText}`, 10, imgHeight + 15);
            doc.text(`Exportado em: ${new Date().toLocaleString('pt-BR')}`, 10, imgHeight + 20);
        }

        doc.save(`${fileName}_${new Date().toISOString().slice(0,10)}.pdf`);
        showToast('PDF gerado com sucesso!', 'success');
        
        // Remover clone
        document.body.removeChild(clone);
    }).catch(err => {
        console.error('Erro ao gerar PDF:', err);
        showToast('Erro ao gerar PDF', 'danger');
        document.body.removeChild(clone);
    });
}

// Exportação com filtros para Excel
function exportFilteredToExcel(tableId, filters, fileName) {
    const table = document.getElementById(tableId);
    if (!table) {
        showToast('Tabela não encontrada para exportação', 'danger');
        return;
    }

    try {
        // Converter tabela para JSON
        let data = XLSX.utils.table_to_json(table, { raw: true });
        
        // Aplicar filtros
        data = applyDataFilters(data, filters);
        
        // Criar workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Dados");
        
        // Adicionar aba de filtros
        if (filters) {
            const filterRows = [['Filtros aplicados']];
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== '') {
                    if (typeof value === 'object') {
                        for (const [subKey, subValue] of Object.entries(value)) {
                            filterRows.push([`${key}.${subKey}`, subValue]);
                        }
                    } else {
                        filterRows.push([key, value]);
                    }
                }
            }
            filterRows.push(['Data exportação', new Date().toLocaleString('pt-BR')]);
            
            const wsFilters = XLSX.utils.aoa_to_sheet(filterRows);
            XLSX.utils.book_append_sheet(wb, wsFilters, "Filtros");
        }
        
        XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().slice(0,10)}.xlsx`);
        showToast('Excel gerado com sucesso!', 'success');
    } catch (err) {
        console.error('Erro ao gerar Excel:', err);
        showToast('Erro ao gerar Excel', 'danger');
    }
}

// Aplicar filtros ao elemento HTML
function applyFiltersToElement(element, filters) {
    if (!filters || !element) return;
    
    if (element.tagName === 'TABLE') {
        const rows = element.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowData = getRowData(row);
            const shouldShow = evaluateFilters(rowData, filters);
            row.style.display = shouldShow ? '' : 'none';
        });
    }
}

// Aplicar filtros aos dados
function applyDataFilters(data, filters) {
    if (!filters) return data;
    
    return data.filter(item => {
        const rowData = {
            ...item,
            date: item.data ? new Date(item.data) : null,
            status: item.status?.toLowerCase()
        };
        return evaluateFilters(rowData, filters);
    });
}

// Avaliar se a linha passa nos filtros
function evaluateFilters(rowData, filters) {
    let pass = true;
    
    // Filtro por status
    if (filters.status && filters.status !== 'todos') {
        pass = pass && rowData.status === filters.status.toLowerCase();
    }
    
    // Filtro por data
    if (filters.dateRange) {
        const rowDate = rowData.date || (rowData.data ? new Date(rowData.data) : null);
        if (rowDate) {
            if (filters.dateRange.start) {
                const startDate = new Date(filters.dateRange.start);
                pass = pass && rowDate >= startDate;
            }
            if (filters.dateRange.end) {
                const endDate = new Date(filters.dateRange.end);
                pass = pass && rowDate <= endDate;
            }
        }
    }
    
    // Filtro por especialidade
    if (filters.especialidade && filters.especialidade !== 'todas') {
        pass = pass && rowData.especialidade === filters.especialidade;
    }
    
    // Filtro por serviço
    if (filters.servico && filters.servico !== 'todos') {
        pass = pass && rowData.servico === filters.servico;
    }
    
    return pass;
}

// Obter dados da linha da tabela
function getRowData(row) {
    const cells = row.querySelectorAll('td');
    const rowData = {};
    
    // Obter cabeçalhos da tabela
    const headers = [];
    const headerRow = row.closest('table').querySelector('thead tr');
    if (headerRow) {
        headerRow.querySelectorAll('th').forEach(th => {
            headers.push(th.textContent.trim().toLowerCase());
        });
    }
    
    // Mapear células para dados
    cells.forEach((cell, index) => {
        const header = headers[index] || `col${index}`;
        rowData[header] = cell.textContent.trim();
        
        // Tratamento especial para status
        if (header.includes('status')) {
            const badge = cell.querySelector('.badge');
            if (badge) {
                rowData.status = badge.textContent.trim().toLowerCase();
            }
        }
    });
    
    return rowData;
}

// Formatador de filtros para cabeçalho
function formatFiltersForHeader(filters) {
    const parts = [];
    
    for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === '') continue;
        
        if (typeof value === 'object') {
            for (const [subKey, subValue] of Object.entries(value)) {
                if (subValue) parts.push(`${key}.${subKey}: ${subValue}`);
            }
        } else {
            parts.push(`${key}: ${value}`);
        }
    }
    
    return parts.join(', ') || 'Nenhum filtro aplicado';
}

// Mostrar notificação toast
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
    
    // Remover toast após 5 segundos
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

// Carregar dados do dashboard
function loadDashboardData(filters = {}) {
    // Dados mockados - na implementação real, você buscaria de uma API
    const appointments = [
        { paciente: 'João Silva', medico: 'Dr. Carlos', data: '15/05/2023 09:00', convenio: 'Unimed', status: 'Confirmado' },
        { paciente: 'Maria Souza', medico: 'Dra. Ana', data: '15/05/2023 10:30', convenio: 'Amil', status: 'Confirmado' },
        { paciente: 'Pedro Costa', medico: 'Dr. Roberto', data: '15/05/2023 11:15', convenio: 'Bradesco Saúde', status: 'Pendente' },
        { paciente: 'Ana Oliveira', medico: 'Dra. Fernanda', data: '15/05/2023 14:00', convenio: 'SulAmérica', status: 'Confirmado' },
        { paciente: 'Luiz Pereira', medico: 'Dr. Marcelo', data: '15/05/2023 15:30', convenio: 'Unimed', status: 'Cancelado' }
    ];
    
    const nextAppointments = [
        { paciente: 'João Silva', medico: 'Dr. Carlos', data: 'Hoje, 09:00', especialidade: 'Cardiologia' },
        { paciente: 'Maria Souza', medico: 'Dra. Ana', data: 'Hoje, 10:30', especialidade: 'Pediatria' },
        { paciente: 'Carlos Mendes', medico: 'Dr. Roberto', data: 'Amanhã, 08:00', especialidade: 'Ortopedia' },
        { paciente: 'Fernanda Lima', medico: 'Dra. Patrícia', data: 'Amanhã, 11:00', especialidade: 'Dermatologia' }
    ];
    
    // Aplicar filtros
    const filteredAppointments = applyDataFilters(appointments, filters);
    const filteredNextAppointments = applyDataFilters(nextAppointments, filters);
    
    // Preencher tabela de agendamentos
    const tableBody = document.querySelector('.ios-table tbody');
    if (tableBody) {
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
    
    // Preencher lista de próximas consultas
    const listGroup = document.querySelector('.ios-list-group');
    if (listGroup) {
        listGroup.innerHTML = filteredNextAppointments.map(app => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${app.paciente}</h6>
                    <small class="text-muted">${app.medico} • ${app.especialidade}</small>
                </div>
                <span class="badge bg-primary rounded-pill">${app.data}</span>
            </li>
        `).join('');
    }
}

function getStatusBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'confirmado': return 'bg-success';
        case 'pendente': return 'bg-warning text-dark';
        case 'cancelado': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

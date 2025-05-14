
class AgendamentoModule {
    constructor() {
        this.calendar = null;
        this.initCalendar();
        this.initFilters();
        this.initEventListeners();
    }
    
    initCalendar() {
        // Inicializar FullCalendar
        this.calendar = new FullCalendar.Calendar(document.getElementById('agendaCalendar'), {
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: this.loadAgendamentos(),
            eventClick: this.handleEventClick.bind(this),
            dateClick: this.handleDateClick.bind(this),
            locale: 'pt-br',
            eventContent: this.renderEventContent.bind(this),
            eventClassNames: this.getEventClasses.bind(this),
            slotMinTime: '07:00:00',
            slotMaxTime: '20:00:00',
            weekends: false,
            editable: true,
            eventDrop: this.handleEventDrop.bind(this),
            eventResize: this.handleEventResize.bind(this)
        });
        
        this.calendar.render();
    }
    
    initFilters() {
        // Filtro de especialidade
        document.getElementById('especialidadeFilter')?.addEventListener('change', () => {
            this.applyCalendarFilters();
        });
        
        // Filtro de tipo de serviço
        document.getElementById('servicoFilter')?.addEventListener('change', () => {
            this.applyCalendarFilters();
        });
        
        // Filtro de status
        document.getElementById('statusFilter')?.addEventListener('change', () => {
            this.applyCalendarFilters();
        });
    }
    
    applyCalendarFilters() {
        const filters = this.getFilters();
        const events = this.calendar.getEvents();
        
        events.forEach(event => {
            const eventData = event.extendedProps;
            const shouldShow = evaluateFilters(eventData, filters);
            event.setProp('display', shouldShow ? 'auto' : 'none');
        });
    }
    
    getFilters() {
        return {
            especialidade: document.getElementById('especialidadeFilter')?.value,
            servico: document.getElementById('servicoFilter')?.value,
            status: document.getElementById('statusFilter')?.value
        };
    }
    
    loadAgendamentos() {
        // Dados mockados - na implementação real, você buscaria de uma API
        return [
            {
                id: 'event1',
                title: 'João Silva',
                start: '2023-05-15T09:00:00',
                end: '2023-05-15T09:30:00',
                extendedProps: {
                    paciente: 'João Silva',
                    medico: 'Dr. Carlos',
                    especialidade: 'Cardiologia',
                    servico: 'Consulta',
                    convenio: 'Unimed',
                    status: 'confirmado'
                }
            },
            {
                id: 'event2',
                title: 'Maria Souza',
                start: '2023-05-15T10:30:00',
                end: '2023-05-15T11:00:00',
                extendedProps: {
                    paciente: 'Maria Souza',
                    medico: 'Dra. Ana',
                    especialidade: 'Pediatria',
                    servico: 'Retorno',
                    convenio: 'Amil',
                    status: 'confirmado'
                }
            },
            {
                id: 'event3',
                title: 'Pedro Costa',
                start: '2023-05-15T11:15:00',
                end: '2023-05-15T11:45:00',
                extendedProps: {
                    paciente: 'Pedro Costa',
                    medico: 'Dr. Roberto',
                    especialidade: 'Ortopedia',
                    servico: 'Consulta',
                    convenio: 'Bradesco Saúde',
                    status: 'pendente'
                }
            },
            {
                id: 'event4',
                title: 'Ana Oliveira',
                start: '2023-05-16T14:00:00',
                end: '2023-05-16T14:30:00',
                extendedProps: {
                    paciente: 'Ana Oliveira',
                    medico: 'Dra. Fernanda',
                    especialidade: 'Dermatologia',
                    servico: 'Exame',
                    convenio: 'SulAmérica',
                    status: 'confirmado'
                }
            },
            {
                id: 'event5',
                title: 'Luiz Pereira',
                start: '2023-05-16T15:30:00',
                end: '2023-05-16T16:00:00',
                extendedProps: {
                    paciente: 'Luiz Pereira',
                    medico: 'Dr. Marcelo',
                    especialidade: 'Cardiologia',
                    servico: 'Consulta',
                    convenio: 'Unimed',
                    status: 'cancelado'
                }
            }
        ];
    }
    
    renderEventContent(eventInfo) {
        // Renderização customizada do evento
        const { paciente, medico, convenio } = eventInfo.event.extendedProps;
        
        const eventEl = document.createElement('div');
        eventEl.className = 'fc-event-content';
        eventEl.innerHTML = `
            <div class="fc-event-title">${paciente}</div>
            <div class="fc-event-details">
                <small>${medico}</small>
                <small>${convenio}</small>
            </div>
        `;
        
        return { domNodes: [eventEl] };
    }
    
    getEventClasses(event) {
        // Classes CSS baseadas no status
        const { status } = event.extendedProps;
        const classes = [];
        
        if (status === 'confirmado') classes.push('fc-event-confirmado');
        if (status === 'pendente') classes.push('fc-event-pendente');
        if (status === 'cancelado') classes.push('fc-event-cancelado');
        
        return classes;
    }
    
    handleEventClick(info) {
        // Mostrar detalhes do agendamento
        this.showAppointmentDetails(info.event);
    }
    
    handleDateClick(info) {
        // Abrir modal para novo agendamento
        this.openNewAppointmentModal(info.date);
    }
    
    handleEventDrop(info) {
        // Atualizar data/hora do agendamento
        this.updateAppointmentTime(info.event);
    }
    
    handleEventResize(info) {
        // Atualizar duração do agendamento
        this.updateAppointmentDuration(info.event);
    }
    
    showAppointmentDetails(event) {
        // Implementar modal de detalhes
        console.log('Mostrar detalhes do agendamento:', event);
    }
    
    openNewAppointmentModal(date) {
        // Implementar modal de novo agendamento
        console.log('Novo agendamento para:', date);
    }
    
    updateAppointmentTime(event) {
        // Implementar atualização no backend
        console.log('Atualizar horário:', event);
    }
    
    updateAppointmentDuration(event) {
        // Implementar atualização no backend
        console.log('Atualizar duração:', event);
    }
    
    initEventListeners() {
        // Botão de exportar PDF
        document.getElementById('exportAgendaPdf')?.addEventListener('click', () => {
            const filters = this.getFilters();
            exportFilteredToPDF('agendaCalendar', {
                ...filters,
                orientation: 'landscape',
                header: {
                    text: `Agenda Médica - ${new Date().toLocaleDateString('pt-BR')}`
                }
            }, 'agenda_medica');
        });
        
        // Botão de exportar Excel
        document.getElementById('exportAgendaExcel')?.addEventListener('click', () => {
            this.exportFilteredAgendaToExcel();
        });
        
        // Botão de limpar filtros
        document.getElementById('clearFilters')?.addEventListener('click', () => {
            document.getElementById('especialidadeFilter').value = 'todas';
            document.getElementById('servicoFilter').value = 'todos';
            document.getElementById('statusFilter').value = 'todos';
            this.applyCalendarFilters();
        });
    }
    
    exportFilteredAgendaToExcel() {
        try {
            const filters = this.getFilters();
            let events = this.calendar.getEvents();
            
            // Aplicar filtros
            if (filters.especialidade && filters.especialidade !== 'todas') {
                events = events.filter(e => e.extendedProps.especialidade === filters.especialidade);
            }
            
            if (filters.servico && filters.servico !== 'todos') {
                events = events.filter(e => e.extendedProps.servico === filters.servico);
            }
            
            if (filters.status && filters.status !== 'todos') {
                events = events.filter(e => e.extendedProps.status === filters.status);
            }
            
            // Preparar dados
            const data = events.map(event => ({
                'Paciente': event.extendedProps.paciente,
                'Médico': event.extendedProps.medico,
                'Especialidade': event.extendedProps.especialidade,
                'Serviço': event.extendedProps.servico,
                'Início': event.start.toLocaleString('pt-BR'),
                'Fim': event.end.toLocaleString('pt-BR'),
                'Convênio': event.extendedProps.convenio,
                'Status': event.extendedProps.status
            }));
            
            // Criar workbook
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, "Agendamentos");
            
            // Adicionar aba de filtros
            if (filters) {
                const filterData = [
                    ['Filtros aplicados'],
                    ['Especialidade', filters.especialidade || 'Todas'],
                    ['Serviço', filters.servico || 'Todos'],
                    ['Status', filters.status || 'Todos'],
                    ['Data de exportação', new Date().toLocaleString('pt-BR')]
                ];
                const wsFilters = XLSX.utils.aoa_to_sheet(filterData);
                XLSX.utils.book_append_sheet(wb, wsFilters, "Filtros");
            }
            
            XLSX.writeFile(wb, `agenda_${new Date().toISOString().slice(0,10)}.xlsx`);
            showToast('Agenda exportada com sucesso!', 'success');
        } catch (err) {
            console.error('Erro ao exportar agenda:', err);
            showToast('Erro ao exportar agenda', 'danger');
        }
    }
}

// Inicializar módulo quando a página carregar
if (document.querySelector('[data-module="agendamento"]')) {
    new AgendamentoModule();
}

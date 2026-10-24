import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxhp9c0GHGX0JHEjda9CBmuKTfD0MdQrg",
  authDomain: "measurements-bf85a.firebaseapp.com",
  projectId: "measurements-bf85a",
  storageBucket: "measurements-bf85a.firebasestorage.app",
  messagingSenderId: "116446528416",
  appId: "1:116446528416:web:eefd425fe30e3fb75c1ac5"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
enableIndexedDbPersistence(db).catch((err) => console.warn("Offline:", err.code));

// =========================================================
// CHECKLISTS CONTEXTUAIS POR TIPO DE AMBIENTE
// =========================================================
const CHECKLISTS_CONTEXTUAIS = {
    banheiro: {
        label: "Banheiro / Lavabo",
        sections: [
            { titulo: "Hidráulica", itens: [
                "Ponto de água fria do lavatório",
                "Ponto de esgoto do lavatório",
                "Ponto de água fria do vaso",
                "Ponto de esgoto do vaso",
                "Ponto de água fria do chuveiro",
                "Ponto de água quente do chuveiro (se houver)",
                "Registro de gaveta acessível",
                "Ralo sifonado no box",
                "Ralo sifonado fora do box"
            ]},
            { titulo: "Louças e Metais", itens: [
                "Vaso sanitário instalado",
                "Cuba / lavatório instalado",
                "Torneira do lavatório",
                "Chuveiro / ducha",
                "Box (instalado ou previsto)",
                "Espelho previsto"
            ]},
            { titulo: "Elétrica", itens: [
                "Tomada próxima ao lavatório (com DR)",
                "Interruptor interno",
                "Ponto de iluminação no teto",
                "Ponto de exaustão / ventilação",
                "Tomada para chuveiro elétrico (se aplicável)"
            ]},
            { titulo: "Estrutural", itens: [
                "Shaft aparente ou fechado",
                "Nichos no box",
                "Impermeabilização do piso",
                "Impermeabilização das paredes do box"
            ]}
        ]
    },
    cozinha: {
        label: "Cozinha",
        sections: [
            { titulo: "Hidráulica", itens: [
                "Ponto de água fria da cuba",
                "Ponto de esgoto da cuba",
                "Ponto de água da máquina de lavar (se aplicável)",
                "Ponto de esgoto da máquina de lavar (se aplicável)",
                "Registro de gaveta acessível",
                "Ponto de filtro de água"
            ]},
            { titulo: "Elétrica", itens: [
                "Tomada para geladeira",
                "Tomada para forno elétrico",
                "Tomada para micro-ondas",
                "Tomada para cooktop (se elétrico)",
                "Tomada para coifa / depurador",
                "Tomada para lava-louças",
                "Tomadas da bancada (mínimo 2)",
                "Interruptores",
                "Ponto de iluminação geral",
                "Ponto de iluminação sob armários"
            ]},
            { titulo: "Marcenaria e Bancada", itens: [
                "Altura da bancada",
                "Profundidade da bancada",
                "Espaço para armários inferiores",
                "Espaço para armários superiores",
                "Abertura de portas de armário",
                "Circulação entre bancadas"
            ]},
            { titulo: "Eletrodomésticos", itens: [
                "Espaço para geladeira (largura x profundidade)",
                "Espaço para fogão / cooktop",
                "Espaço para forno",
                "Espaço para coifa",
                "Espaço para lava-louças",
                "Interferências (tubulação, esquadria)"
            ]}
        ]
    },
    quarto: {
        label: "Quarto / Suíte",
        sections: [
            { titulo: "Dimensões", itens: [
                "Comprimento da parede da cama",
                "Largura da parede do guarda-roupa",
                "Espaço para circulação ao redor da cama",
                "Espaço para abertura do guarda-roupa"
            ]},
            { titulo: "Elétrica", itens: [
                "Tomadas nas cabeceiras",
                "Tomada para TV",
                "Tomada para ar-condicionado",
                "Interruptor de entrada",
                "Interruptor de cabeceira",
                "Ponto de iluminação no teto",
                "Ponto de iluminação nas cabeceiras"
            ]},
            { titulo: "Esquadrias", itens: [
                "Janela: largura, altura, peitoril",
                "Cortina: espaço e tipo",
                "Persiana: espaço e tipo",
                "Porta: largura, altura, sentido de abertura"
            ]},
            { titulo: "Marcenaria", itens: [
                "Profundidade disponível para guarda-roupa",
                "Altura disponível para armário",
                "Interferências (tomadas, janelas, tubulação)"
            ]}
        ]
    },
    varanda: {
        label: "Varanda / Sacada",
        sections: [
            { titulo: "Estrutural", itens: [
                "Guarda-corpo (altura e tipo)",
                "Piso e desnível em relação ao interior",
                "Ralo de escoamento",
                "Laje para condensadora (se houver)"
            ]},
            { titulo: "Hidráulica e Gás", itens: [
                "Ponto de água (se gourmet)",
                "Ponto de esgoto (se gourmet)",
                "Ponto de gás (se churrasqueira)",
                "Registro acessível"
            ]},
            { titulo: "Elétrica", itens: [
                "Tomada (área molhada — com DR)",
                "Ponto de iluminação",
                "Interruptor"
            ]},
            { titulo: "Regras do Condomínio", itens: [
                "Fechamento permitido?",
                "Alteração de fachada permitida?",
                "Regras para churrasqueira / gourmet"
            ]}
        ]
    },
    sala: {
        label: "Sala (Estar / Jantar)",
        sections: [
            { titulo: "Dimensões", itens: [
                "Comprimento total da sala",
                "Largura da área de estar",
                "Largura da área de jantar",
                "Distância entre sofá e TV",
                "Circulação principal"
            ]},
            { titulo: "Elétrica", itens: [
                "Tomadas na parede da TV",
                "Tomada para rack / home theater",
                "Tomadas próximas ao sofá",
                "Tomada para ar-condicionado",
                "Pontos de internet / rede",
                "Interruptores",
                "Ponto de iluminação central",
                "Pontos de iluminação auxiliar"
            ]},
            { titulo: "Esquadrias e Cortinas", itens: [
                "Janela: largura, altura, peitoril",
                "Porta de entrada: largura, altura, sentido",
                "Espaço para cortina",
                "Espaço para persiana"
            ]}
        ]
    },
    lavanderia: {
        label: "Lavanderia / Área de Serviço",
        sections: [
            { titulo: "Hidráulica", itens: [
                "Ponto de água do tanque",
                "Ponto de esgoto do tanque",
                "Ponto de água da máquina de lavar",
                "Ponto de esgoto da máquina de lavar",
                "Registro acessível"
            ]},
            { titulo: "Elétrica", itens: [
                "Tomada para máquina de lavar (com DR)",
                "Tomada para secadora (se houver)",
                "Tomada para ferro de passar",
                "Ponto de iluminação",
                "Interruptor"
            ]},
            { titulo: "Estrutural", itens: [
                "Ventilação (janela ou exaustão)",
                "Ponto para varal",
                "Espaço para armários",
                "Impermeabilização do piso"
            ]}
        ]
    },
    generico: {
        label: "Ambiente (genérico)",
        sections: [
            { titulo: "Dimensões", itens: [
                "Comprimento",
                "Largura",
                "Pé-direito",
                "Área do piso",
                "Perímetro"
            ]},
            { titulo: "Elétrica", itens: [
                "Tomadas (quantidade e altura)",
                "Interruptores",
                "Ponto de iluminação"
            ]},
            { titulo: "Vãos", itens: [
                "Portas: largura, altura, sentido",
                "Janelas: largura, altura, peitoril"
            ]},
            { titulo: "Acabamentos", itens: [
                "Piso",
                "Parede",
                "Teto",
                "Rodapé"
            ]}
        ]
    }
};

// Mapeia nome do ambiente para tipo de checklist
function detectTipoAmbiente(nome) {
    const n = nome.toLowerCase();
    if (n.includes('banheiro') || n.includes('sanit') || n.includes('lavabo') || n.includes('wc')) return 'banheiro';
    if (n.includes('cozinha')) return 'cozinha';
    if (n.includes('quarto') || n.includes('suíte') || n.includes('suite') || n.includes('dormit')) return 'quarto';
    if (n.includes('varanda') || n.includes('sacada') || n.includes('gourmet')) return 'varanda';
    if (n.includes('sala') || n.includes('estar') || n.includes('jantar') || n.includes('living')) return 'sala';
    if (n.includes('lavand') || n.includes('serviço') || n.includes('servico')) return 'lavanderia';
    return 'generico';
}

// =========================================================
// APP
// =========================================================
const app = {
    data: {
        projeto: { id: "apto801", nome: "Love 801 A 💝", dataVisita: new Date().toISOString().split('T')[0] },
        ambientes: [],
        checklist: [],
        plantaImagem: null,
        plantaPins: [],
        divergencias: [],
        marcenaria: []
    },
    currentAmbienteId: null,
    currentTab: 'tab-geral',
    qm: { tipo: null, ambienteId: null, paredeId: null, count: 0 },
    div: { fotoTemp: null },
    _unsynced: false,

    planta: {
        scale: 1, tx: 0, ty: 0, minScale: 0.5, maxScale: 5,
        mode: 'view', pendingPin: null,
        lastTouchDist: 0, lastTouchX: 0, lastTouchY: 0,
        isPanning: false, isPinching: false
    },

    async init() {
        this.loadLocalData();
        this.renderAll();
        if (navigator.onLine) await this.syncToFirebase();
        window.addEventListener('online', () => {
            this.updateSaveStatus('Sincronizando...', 'syncing');
            this.syncToFirebase();
        });
        window.addEventListener('offline', () => this.updateSaveStatus('Offline (Salvo local)', 'saved'));
        window.addEventListener('beforeunload', (e) => {
            if (this._unsynced) { e.preventDefault(); e.returnValue = ''; }
        });
    },

    // ========== TOAST + HAPTIC ==========
    showToast(message, type = 'default', duration = 2200) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    haptic(intensity = 'light') {
        if (navigator.vibrate) {
            const patterns = { light: [10], medium: [20], heavy: [30] };
            navigator.vibrate(patterns[intensity] || [10]);
        }
    },
    markUnsynced() {
        this._unsynced = true;
        const dot = document.getElementById('unsync-dot');
        if (dot) dot.classList.add('active');
        this.updateSaveStatus('Não sincronizado', 'unsynced');
    },

    // ========== PERSISTÊNCIA ==========
    saveLocal() {
        try {
            localStorage.setItem('vistoriaAppData', JSON.stringify(this.data));
            this.updateSaveStatus('Salvo localmente', 'saved');
            this.markUnsynced();
        } catch (e) {
            this.showToast("Erro ao salvar. Armazenamento cheio.", 'error');
        }
    },
    loadLocalData() {
        const saved = localStorage.getItem('vistoriaAppData');
        if (saved) {
            this.data = JSON.parse(saved);
            if (!this.data.plantaPins) this.data.plantaPins = [];
            if (!this.data.divergencias) this.data.divergencias = [];
            if (!this.data.marcenaria) this.data.marcenaria = [];
        } else {
            this.data.ambientes = [
                { id: '1', nome: 'Estar/Jantar', comp: 4.26, larg: 2.40, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} },
                { id: '2', nome: 'Cozinha', comp: 4.33, larg: 1.60, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} },
                { id: '3', nome: 'Área de Serviço', comp: null, larg: null, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} },
                { id: '4', nome: 'Varanda Gourmet', comp: 2.40, larg: 1.75, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} },
                { id: '5', nome: 'Quarto 1', comp: 2.95, larg: 2.40, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} },
                { id: '6', nome: 'Quarto 2 (Suíte)', comp: 2.56, larg: 2.90, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} },
                { id: '7', nome: 'Sanitário Social', comp: null, larg: null, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} },
                { id: '8', nome: 'Sanitário Suíte', comp: 2.22, larg: 1.69, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} }
            ];
            const checkItens = [
                "Confirmar acesso a todos os ambientes", "Verificar se planta corresponde à unidade",
                "Medir comprimento e largura de todos os ambientes", "Medir pé-direito",
                "Registrar pontos elétricos (tomadas)", "Registrar pontos hidráulicos (água/esgoto)",
                "Registrar medidas de janelas e portas", "Fotografar todas as paredes"
            ];
            this.data.checklist = checkItens.map((item, index) => ({ id: `chk_${index}`, texto: item, status: 'pendente', observacao: '' }));
            this.data.plantaPins = [];
            this.data.divergencias = [];
            this.data.marcenaria = [];
            this.saveLocal();
        }
    },
    async syncToFirebase() {
        if (!navigator.onLine) return;
        this.updateSaveStatus('Sincronizando...', 'syncing');
        try {
            const dataToSync = JSON.parse(JSON.stringify(this.data));
            dataToSync.ambientes.forEach(a => a.fotos = []);
            dataToSync.plantaImagem = null;
            dataToSync.divergencias.forEach(d => d.foto = null);
            await setDoc(doc(db, "projetos", this.data.projeto.id), dataToSync, { merge: true });
            this._unsynced = false;
            const dot = document.getElementById('unsync-dot');
            if (dot) dot.classList.remove('active');
            this.updateSaveStatus('Sincronizado', 'saved');
        } catch (e) {
            console.error("Erro ao sincronizar:", e);
            this.updateSaveStatus('Erro nuvem (Salvo local)', 'unsynced');
        }
    },
    updateSaveStatus(text, className) {
        const el = document.getElementById('save-status');
        if (el) { el.textContent = text; el.className = `status-badge ${className}`; }
    },

    // ========== NAVEGAÇÃO ==========
    navigate(viewName) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        const view = document.getElementById(`view-${viewName}`);
        if (view) view.classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
        const navBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('data-tab') === viewName);
        if (navBtn) navBtn.classList.add('active');

        if (viewName === 'ambientes') this.renderAmbientes();
        if (viewName === 'checklist') this.renderChecklist();
        if (viewName === 'dashboard') this.renderDashboard();
        if (viewName === 'planta') this.renderPlanta();
        if (viewName === 'relatorio') this.renderRelatorio();
        if (viewName === 'divergencias') this.renderDivergenciasPage();
        if (viewName === 'marcenaria') this.renderMarcenariaPage();
    },
    switchTab(tabId, event) {
        this.currentTab = tabId;
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        const tab = document.getElementById(tabId);
        if (tab) tab.classList.add('active');
        if (event && event.target) event.target.classList.add('active');
        if (tabId === 'tab-checklist-ctx') this.renderChecklistContextual();
        this.haptic('light');
    },
    switchTabProgrammatic(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        const tab = document.getElementById(tabId);
        if (tab) tab.classList.add('active');
        const btn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
        if (btn) btn.classList.add('active');
    },

    // ========== RENDER ==========
    renderAll() {
        this.renderDashboard();
        this.renderAmbientes();
        this.renderChecklist();
        const dateEl = document.getElementById('dash-date');
        if (dateEl) dateEl.textContent = this.data.projeto.dataVisita;
    },
    renderDashboard() {
        let totalItens = 0, medidos = 0, totalParedes = 0;
        this.data.ambientes.forEach(amb => {
            totalItens += 3;
            if (amb.comp) medidos++;
            if (amb.larg) medidos++;
            if (amb.peDireito) medidos++;
            totalParedes += (amb.paredes?.length || 0);
        });
        this.data.checklist.forEach(chk => {
            totalItens++;
            if (chk.status === 'medido' || chk.status === 'conferido' || chk.status === 'na') medidos++;
        });
        const percent = totalItens === 0 ? 0 : Math.round((medidos / totalItens) * 100);
        const bar = document.getElementById('dash-progress-bar');
        const text = document.getElementById('dash-progress-text');
        if (bar) bar.style.width = `${percent}%`;
        if (text) text.textContent = `${percent}% concluído`;
        const md = document.getElementById('dash-medidos');
        const pd = document.getElementById('dash-pendentes');
        const pr = document.getElementById('dash-paredes');
        if (md) md.textContent = medidos;
        if (pd) pd.textContent = totalItens - medidos;
        if (pr) pr.textContent = totalParedes;

        const abertas = this.data.divergencias.filter(d => d.status === 'aberta').length;
        const analise = this.data.divergencias.filter(d => d.status === 'analise').length;
        const resolvidas = this.data.divergencias.filter(d => d.status === 'resolvida' || d.status === 'aceita').length;
        const ea = document.getElementById('dash-div-abertas');
        const ean = document.getElementById('dash-div-analise');
        const er = document.getElementById('dash-div-resolvidas');
        if (ea) ea.textContent = abertas;
        if (ean) ean.textContent = analise;
        if (er) er.textContent = resolvidas;

        const grid = document.getElementById('dash-amb-grid');
        if (grid) {
            grid.innerHTML = '';
            this.data.ambientes.forEach(amb => {
                const status = this.ambStatus(amb);
                const mini = document.createElement('div');
                mini.className = `amb-mini-card status-${status}`;
                mini.onclick = () => this.openAmbiente(amb.id);
                mini.innerHTML = `
                    <div class="mini-nome">${amb.nome}</div>
                    <div class="mini-sub">${amb.comp && amb.larg ? (amb.comp * amb.larg).toFixed(1) + ' m²' : 'Sem medidas'}</div>
                `;
                grid.appendChild(mini);
            });
        }
    },
    ambStatus(amb) {
        const hasDim = !!(amb.comp && amb.larg && amb.peDireito);
        const hasParedes = (amb.paredes?.length || 0) > 0;
        if (hasDim && hasParedes) return 'verde';
        if (hasDim || hasParedes) return 'amarelo';
        return 'vermelho';
    },
    renderAmbientes() {
        const container = document.getElementById('ambientes-list');
        if (!container) return;
        const searchEl = document.getElementById('amb-search');
        const search = searchEl ? searchEl.value.toLowerCase().trim() : '';
        container.innerHTML = '';
        const filtered = this.data.ambientes.filter(a => !search || a.nome.toLowerCase().includes(search));
        if (filtered.length === 0) {
            container.innerHTML = '<p class="empty-msg">Nenhum ambiente encontrado.</p>';
            return;
        }
        filtered.forEach(amb => {
            const area = (amb.comp && amb.larg) ? (amb.comp * amb.larg).toFixed(2) : '?';
            const status = this.ambStatus(amb);
            const div = document.createElement('div');
            div.className = 'list-item';
            div.style.borderLeft = `4px solid var(--${status === 'verde' ? 'success' : status === 'amarelo' ? 'warning' : 'danger'})`;
            div.innerHTML = `
                <div class="list-item-header">
                    <strong>${amb.nome}</strong>
                    <span class="badge">${area} m²</span>
                </div>
                <div class="list-item-details">
                    ${amb.comp || '?'} x ${amb.larg || '?'} m • ${amb.paredes?.length || 0} paredes • ${amb.elementos?.length || 0} elementos
                </div>
                <button class="btn btn-secondary mt-2" onclick="app.openAmbiente('${amb.id}')">Abrir Ficha</button>
            `;
            container.appendChild(div);
        });
    },
    renderChecklist() {
        const container = document.getElementById('checklist-items');
        if (!container) return;
        const filterEl = document.getElementById('filter-status');
        const filter = filterEl ? filterEl.value : 'all';
        container.innerHTML = '';
        this.data.checklist.forEach(chk => {
            if (filter !== 'all' && chk.status !== filter) return;
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-header">
                    <span>${chk.texto}</span>
                    <select onchange="app.updateChecklist('${chk.id}', this.value)" class="status-select">
                        <option value="pendente" ${chk.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="medido" ${chk.status === 'medido' ? 'selected' : ''}>Medido</option>
                        <option value="conferido" ${chk.status === 'conferido' ? 'selected' : ''}>Conferido</option>
                        <option value="na" ${chk.status === 'na' ? 'selected' : ''}>N/A</option>
                    </select>
                </div>
            `;
            container.appendChild(div);
        });
    },

    // ========== AMBIENTE ==========
    openAmbiente(id) {
        this.haptic('light');
        this.currentAmbienteId = id;
        const amb = this.data.ambientes.find(a => a.id === id);
        if (!amb) return;
        const nomeEl = document.getElementById('amb-nome');
        if (nomeEl) nomeEl.textContent = amb.nome;
        const compEl = document.getElementById('amb-comprimento');
        const largEl = document.getElementById('amb-largura');
        const peEl = document.getElementById('amb-pe-direito');
        if (compEl) compEl.value = amb.comp || '';
        if (largEl) largEl.value = amb.larg || '';
        if (peEl) peEl.value = amb.peDireito || '';
        this.calcArea(amb);
        this.renderFotos(amb);
        this.renderParedes(amb);
        this.renderElementos(amb);
        this.populateParedeSelect(amb);
        this.navigate('ambiente-detalhe');
        this.switchTabProgrammatic('tab-geral');
    },
    addAmbiente() {
        const nome = prompt("Nome do novo ambiente:", "Novo Ambiente");
        if (!nome) return;
        this.data.ambientes.push({
            id: Date.now().toString(), nome,
            comp: null, larg: null, peDireito: null,
            paredes: [], elementos: [], fotos: [], checklistCtx: {}
        });
        this.saveLocal(); this.syncToFirebase();
        this.renderAmbientes(); this.renderDashboard();
        this.showToast("Ambiente adicionado", 'success');
        this.haptic('medium');
    },
    saveAmbienteDimensoes() {
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        amb.comp = parseFloat(document.getElementById('amb-comprimento').value) || null;
        amb.larg = parseFloat(document.getElementById('amb-largura').value) || null;
        amb.peDireito = parseFloat(document.getElementById('amb-pe-direito').value) || null;
        this.calcArea(amb);
        this.saveLocal(); this.syncToFirebase();
        this.haptic('light');
    },
    calcArea(amb) {
        const el = document.getElementById('amb-area-calc');
        if (!el) return;
        if (amb.comp && amb.larg) el.textContent = `${(amb.comp * amb.larg).toFixed(2)} m²`;
        else el.textContent = '-- m²';
    },

    // ========== PAREDES ==========
    addParede() {
        const nomeEl = document.getElementById('parede-nome');
        const compEl = document.getElementById('parede-comp');
        const altEl = document.getElementById('parede-alt');
        if (!nomeEl || !compEl || !altEl) return;
        const nome = nomeEl.value.trim();
        const comp = parseFloat(compEl.value);
        const alt = parseFloat(altEl.value);
        if (!nome || !comp || !alt) return this.showToast("Preencha nome, comprimento e altura.", 'warning');
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        if (!amb.paredes) amb.paredes = [];
        amb.paredes.push({ id: Date.now().toString(), nome, comp, alt });
        nomeEl.value = ''; compEl.value = ''; altEl.value = '';
        this.saveLocal(); this.syncToFirebase();
        this.renderParedes(amb); this.populateParedeSelect(amb);
        this.showToast("Parede adicionada", 'success');
        this.haptic('medium');
    },
    renderParedes(amb) {
        const container = document.getElementById('paredes-list');
        if (!container) return;
        container.innerHTML = '';
        if (!amb.paredes || amb.paredes.length === 0) {
            container.innerHTML = '<p class="empty-msg">Nenhuma parede cadastrada.</p>';
            return;
        }
        amb.paredes.forEach(p => {
            const areaBruta = (p.comp * p.alt).toFixed(2);
            const elementosParede = (amb.elementos || []).filter(e => e.paredeId === p.id);
            let areaVaos = 0;
            elementosParede.forEach(e => { if (e.larg && e.alt) areaVaos += (e.larg * e.alt); });
            const areaLiquida = (areaBruta - areaVaos).toFixed(2);
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-header">
                    <strong>${p.nome}</strong>
                    <button class="btn-icon-danger" onclick="app.removeParede('${p.id}')">Excluir</button>
                </div>
                <div class="list-item-details">
                    ${p.comp}m x ${p.alt}m • Área Bruta: ${areaBruta} m²<br>
                    Vãos: ${areaVaos.toFixed(2)} m² • <strong>Área Líquida: ${areaLiquida} m²</strong>
                </div>
            `;
            container.appendChild(div);
        });
    },
    removeParede(id) {
        if (!confirm("Excluir esta parede? Elementos associados também serão removidos.")) return;
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        amb.paredes = amb.paredes.filter(p => p.id !== id);
        amb.elementos = (amb.elementos || []).filter(e => e.paredeId !== id);
        this.saveLocal(); this.syncToFirebase();
        this.renderParedes(amb); this.renderElementos(amb); this.populateParedeSelect(amb);
        this.showToast("Parede removida", 'warning');
        this.haptic('medium');
    },

    // ========== ELEMENTOS ==========
    populateParedeSelect(amb) {
        const select = document.getElementById('elem-parede-select');
        if (!select) return;
        select.innerHTML = '<option value="">Selecione uma parede...</option>';
        (amb.paredes || []).forEach(p => { select.innerHTML += `<option value="${p.id}">${p.nome}</option>`; });
    },
    addElemento() {
        const paredeId = document.getElementById('elem-parede-select')?.value;
        const tipo = document.getElementById('elem-tipo')?.value;
        const larg = parseFloat(document.getElementById('elem-larg')?.value) || null;
        const alt = parseFloat(document.getElementById('elem-alt')?.value) || null;
        const peitoril = parseFloat(document.getElementById('elem-peitoril')?.value) || null;
        if (!paredeId) return this.showToast("Selecione a parede.", 'warning');
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        if (!amb.elementos) amb.elementos = [];
        amb.elementos.push({ id: Date.now().toString(), paredeId, tipo, larg, alt, peitoril });
        const lg = document.getElementById('elem-larg'); if (lg) lg.value = '';
        const at = document.getElementById('elem-alt'); if (at) at.value = '';
        const pe = document.getElementById('elem-peitoril'); if (pe) pe.value = '';
        this.saveLocal(); this.syncToFirebase();
        this.renderElementos(amb); this.renderParedes(amb);
        this.showToast("Elemento adicionado", 'success');
        this.haptic('medium');
    },
    renderElementos(amb) {
        const container = document.getElementById('elementos-list');
        if (!container) return;
        container.innerHTML = '';
        if (!amb.elementos || amb.elementos.length === 0) {
            container.innerHTML = '<p class="empty-msg">Nenhum elemento cadastrado.</p>';
            return;
        }
        const tiposFormatados = {
            janela: '🪟 Janela', porta: '🚪 Porta', tomada: '🔌 Tomada',
            interruptor: '💡 Interruptor', ponto_hidraulico: '🚰 Hidráulica',
            ponto_gas: '🔥 Gás', ar_condicionado: '❄️ Ar-Cond.'
        };
        amb.elementos.forEach(e => {
            const parede = amb.paredes.find(p => p.id === e.paredeId);
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-header">
                    <strong>${tiposFormatados[e.tipo] || e.tipo}</strong>
                    <button class="btn-icon-danger" onclick="app.removeElemento('${e.id}')">Excluir</button>
                </div>
                <div class="list-item-details">
                    Parede: ${parede ? parede.nome : '—'}<br>
                    ${e.larg ? `Larg: ${e.larg}m ` : ''}${e.alt ? `Alt: ${e.alt}m ` : ''}${e.peitoril ? `Peitoril: ${e.peitoril}m` : ''}
                </div>
            `;
            container.appendChild(div);
        });
    },
    removeElemento(id) {
        if (!confirm("Excluir este elemento?")) return;
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        amb.elementos = amb.elementos.filter(e => e.id !== id);
        this.saveLocal(); this.syncToFirebase();
        this.renderElementos(amb); this.renderParedes(amb);
        this.showToast("Elemento removido", 'warning');
        this.haptic('medium');
    },

    // ========== FOTOS ==========
    async handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const compressed = await this.compressImage(file, 800, 0.7);
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        if (!amb.fotos) amb.fotos = [];
        amb.fotos.push(compressed);
        this.saveLocal(); this.syncToFirebase();
        this.renderFotos(amb);
        event.target.value = '';
        this.showToast("Foto adicionada", 'success');
        this.haptic('medium');
    },
    compressImage(file, maxWidth, quality) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scaleSize = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scaleSize;
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
            };
        });
    },
    renderFotos(amb) {
        const container = document.getElementById('fotos-gallery');
        if (!container) return;
        container.innerHTML = '';
        (amb.fotos || []).forEach(foto => {
            const img = document.createElement('img');
            img.src = foto;
            container.appendChild(img);
        });
    },
    updateChecklist(id, newStatus) {
        const item = this.data.checklist.find(c => c.id === id);
        if (item) {
            item.status = newStatus;
            this.saveLocal(); this.syncToFirebase();
            this.renderDashboard();
            this.haptic('light');
        }
    },
    exportBackup() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_vistoria_${this.data.projeto.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast("Backup exportado", 'success');
        this.haptic('medium');
    },

    // ========== CHECKLIST CONTEXTUAL ==========
    renderChecklistContextual() {
        const container = document.getElementById('ctx-checklist-container');
        if (!container) return;
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) { container.innerHTML = '<p class="empty-msg">Nenhum ambiente aberto.</p>'; return; }
        
        const tipo = detectTipoAmbiente(amb.nome);
        const config = CHECKLISTS_CONTEXTUAIS[tipo];
        if (!amb.checklistCtx) amb.checklistCtx = {};
        const ctx = amb.checklistCtx;

        let html = `<div class="card">
            <h3>${config.label}</h3>
            <p class="hint-text">Checklist específico para este tipo de ambiente. Marque o status de cada item.</p>
        </div>`;

        config.sections.forEach(sec => {
            html += `<div class="ctx-section-title">${sec.titulo}</div>`;
            sec.itens.forEach((item, idx) => {
                const key = `${tipo}:${sec.titulo}:${idx}`;
                const status = ctx[key] || 'pendente';
                html += `
                    <div class="ctx-item">
                        <span class="ctx-label">${item}</span>
                        <select onchange="app.updateChecklistCtx('${key}', this.value)">
                            <option value="pendente" ${status === 'pendente' ? 'selected' : ''}>Pendente</option>
                            <option value="ok" ${status === 'ok' ? 'selected' : ''}>OK</option>
                            <option value="medido" ${status === 'medido' ? 'selected' : ''}>Medido</option>
                            <option value="na" ${status === 'na' ? 'selected' : ''}>N/A</option>
                        </select>
                    </div>
                `;
            });
        });

        container.innerHTML = html;
    },
    updateChecklistCtx(key, value) {
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        if (!amb.checklistCtx) amb.checklistCtx = {};
        amb.checklistCtx[key] = value;
        this.saveLocal(); this.syncToFirebase();
        this.haptic('light');
    },

    // ========== MARCENARIA ==========
    renderMarcenariaPage() {
        const select = document.getElementById('marc-ambiente');
        if (select) {
            select.innerHTML = '<option value="">— Selecione —</option>';
            this.data.ambientes.forEach(a => { select.innerHTML += `<option value="${a.id}">${a.nome}</option>`; });
        }
        this.renderMarcenaria();
    },

    marcSalvar() {
        const ambId = document.getElementById('marc-ambiente').value;
        const nome = document.getElementById('marc-nome').value.trim();
        const largura = parseFloat(document.getElementById('marc-largura').value) || null;
        const profundidade = parseFloat(document.getElementById('marc-profundidade').value) || null;
        const altura = parseFloat(document.getElementById('marc-altura').value) || null;
        const folga = parseFloat(document.getElementById('marc-folga').value) || 5;
        const modelo = document.getElementById('marc-modelo').value.trim();
        const obs = document.getElementById('marc-obs').value.trim();
        
        if (!ambId) return this.showToast("Selecione o ambiente.", 'warning');
        if (!nome) return this.showToast("Informe o nome do móvel.", 'warning');
        if (!largura || !profundidade) return this.showToast("Informe largura e profundidade.", 'warning');

        if (!this.data.marcenaria) this.data.marcenaria = [];
        this.data.marcenaria.push({
            id: Date.now().toString(),
            ambienteId: ambId,
            nome, largura, profundidade, altura: altura || null,
            folga, modelo, obs,
            dataRegistro: new Date().toISOString().split('T')[0]
        });
        this.saveLocal(); this.syncToFirebase();
        
        ['marc-nome','marc-largura','marc-profundidade','marc-altura','marc-modelo','marc-obs'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        this.renderMarcenaria();
        this.showToast("Móvel adicionado", 'success');
        this.haptic('medium');
    },

    // Avalia se o móvel cabe no ambiente
    marcAvaliar(item) {
        const amb = this.data.ambientes.find(a => a.id === item.ambienteId);
        if (!amb) return { status: 'sem-medida', msg: 'Ambiente não encontrado.' };
        if (!amb.comp || !amb.larg) return { status: 'sem-medida', msg: 'O ambiente ainda não tem medidas registradas. Meça antes de avaliar.' };

        const folgaM = (item.folga || 5) / 100;
        const compDisp = Math.max(amb.comp, amb.larg);
        const largDisp = Math.min(amb.comp, amb.larg);
        const altDisp = amb.peDireito || null;

        const largNecessaria = item.largura + folgaM;
        const profNecessaria = item.profundidade + folgaM;

        const cabeLarg = largNecessaria <= largDisp;
        const cabeProf = profNecessaria <= compDisp;
        const cabeAlt = item.altura && altDisp ? item.altura <= altDisp : true;

        if (cabeLarg && cabeProf && cabeAlt) {
            return { status: 'cabe', msg: `✓ Parece caber. Largura disponível: ${largDisp.toFixed(2)} m (necessário ${largNecessaria.toFixed(2)} m). Profundidade disponível: ${compDisp.toFixed(2)} m (necessário ${profNecessaria.toFixed(2)} m).${altDisp ? ` Pé-direito: ${altDisp.toFixed(2)} m.` : ''} Confirme circulação e abertura de portas/gavetas.` };
        }
        if (!cabeLarg && !cabeProf) {
            return { status: 'nao-cabe', msg: `✗ Não cabe. Você precisa de ${largNecessaria.toFixed(2)} m x ${profNecessaria.toFixed(2)} m. Este ambiente tem ${largDisp.toFixed(2)} m x ${compDisp.toFixed(2)} m úteis (com folga de ${item.folga} cm).` };
        }
        return { status: 'apertado', msg: `⚠ Apertado. ${!cabeLarg ? 'Falta largura. ' : ''}${!cabeProf ? 'Falta profundidade. ' : ''}${!cabeAlt ? 'Altura do móvel excede o pé-direito. ' : ''}Reveja o projeto ou escolha um modelo menor.` };
    },

    renderMarcenaria() {
        const container = document.getElementById('marc-list');
        const totalEl = document.getElementById('marc-total');
        if (!container) return;
        if (!this.data.marcenaria) this.data.marcenaria = [];
        if (totalEl) totalEl.textContent = this.data.marcenaria.length;

        if (this.data.marcenaria.length === 0) {
            container.innerHTML = '<p class="empty-msg">Nenhum móvel cadastrado ainda.</p>';
            return;
        }

        container.innerHTML = '';
        // Ordena por ambiente
        const sorted = this.data.marcenaria.slice().sort((a, b) => {
            const na = this.data.ambientes.find(x => x.id === a.ambienteId)?.nome || '';
            const nb = this.data.ambientes.find(x => x.id === b.ambienteId)?.nome || '';
            return na.localeCompare(nb);
        });

        let lastAmb = null;
        sorted.forEach(item => {
            const amb = this.data.ambientes.find(a => a.id === item.ambienteId);
            const ambNome = amb ? amb.nome : '—';
            const av = this.marcAvaliar(item);

            if (ambNome !== lastAmb) {
                const t = document.createElement('div');
                t.className = 'ctx-section-title';
                t.textContent = ambNome;
                container.appendChild(t);
                lastAmb = ambNome;
            }

            const badgeLabel = { cabe: 'Cabe', apertado: 'Apertado', 'nao-cabe': 'Não Cabe', 'sem-medida': 'Sem Medida' }[av.status];
            const alertaClass = { cabe: 'ok', apertado: 'atencao', 'nao-cabe': 'erro', 'sem-medida': '' }[av.status];

            const card = document.createElement('div');
            card.className = `list-item marc-card status-${av.status === 'nao-cabe' ? 'nao-cabe' : av.status === 'apertado' ? 'apertado' : av.status === 'cabe' ? 'cabe' : 'sem-medida'}`;
            card.innerHTML = `
                <div class="marc-header">
                    <div>
                        <div class="marc-nome">${item.nome}</div>
                        ${item.modelo ? `<div class="marc-sub">${item.modelo}</div>` : ''}
                    </div>
                    <span class="marc-badge ${av.status}">${badgeLabel}</span>
                </div>
                <div class="marc-dims">
                    <span>Larg: <strong>${item.largura} m</strong></span>
                    <span>Prof: <strong>${item.profundidade} m</strong></span>
                    ${item.altura ? `<span>Alt: <strong>${item.altura} m</strong></span>` : ''}
                    <span>Folga: <strong>${item.folga} cm</strong></span>
                </div>
                ${item.obs ? `<div class="list-item-details">${item.obs}</div>` : ''}
                ${alertaClass ? `<div class="marc-alerta ${alertaClass}">${av.msg}</div>` : ''}
                <div class="marc-actions">
                    <button class="btn-delete" onclick="app.marcExcluir('${item.id}')">Excluir</button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    marcExcluir(id) {
        if (!confirm("Excluir este item?")) return;
        this.data.marcenaria = this.data.marcenaria.filter(m => m.id !== id);
        this.saveLocal(); this.syncToFirebase();
        this.renderMarcenaria();
        this.showToast("Item removido", 'warning');
        this.haptic('medium');
    },

    // ========== DIVERGÊNCIAS ==========
    renderDivergenciasPage() {
        const ambSelect = document.getElementById('div-ambiente');
        const filterAmb = document.getElementById('div-filter-ambiente');
        if (ambSelect) {
            ambSelect.innerHTML = '<option value="">— Selecione —</option>';
            this.data.ambientes.forEach(a => { ambSelect.innerHTML += `<option value="${a.id}">${a.nome}</option>`; });
        }
        if (filterAmb) {
            const currentVal = filterAmb.value;
            filterAmb.innerHTML = '<option value="all">Todos os ambientes</option>';
            this.data.ambientes.forEach(a => { filterAmb.innerHTML += `<option value="${a.id}">${a.nome}</option>`; });
            filterAmb.value = currentVal || 'all';
        }
        this.div.fotoTemp = null;
        const preview = document.getElementById('div-foto-preview');
        if (preview) preview.innerHTML = '';
        const outroGroup = document.getElementById('div-elemento-outro-group');
        if (outroGroup) outroGroup.style.display = 'none';
        const calcBox = document.getElementById('div-calculo-box');
        if (calcBox) calcBox.style.display = 'none';
        this.renderDivergencias();
    },
    divLoadElementos() {
        const ambId = document.getElementById('div-ambiente').value;
        const select = document.getElementById('div-elemento');
        if (!select) return;
        select.innerHTML = '<option value="">— Selecione —</option>';
        if (!ambId) return;
        const amb = this.data.ambientes.find(a => a.id === ambId);
        if (!amb) return;
        (amb.paredes || []).forEach(p => { select.innerHTML += `<option value="parede:${p.id}">🧱 ${p.nome}</option>`; });
        const tiposLabel = { janela: '🪟 Janela', porta: '🚪 Porta', tomada: '🔌 Tomada', interruptor: '💡 Interruptor', ponto_hidraulico: '🚰 Hidráulica', ponto_gas: '🔥 Gás', ar_condicionado: '❄️ Ar-Cond.' };
        (amb.elementos || []).forEach((e, idx) => { select.innerHTML += `<option value="elem:${e.id}">${tiposLabel[e.tipo] || e.tipo} #${idx+1}</option>`; });
        select.innerHTML += `<option value="__outro__">✏️ Outro (digitar)</option>`;
    },
    divToggleElementoOutro() {
        const val = document.getElementById('div-elemento').value;
        const group = document.getElementById('div-elemento-outro-group');
        if (group) group.style.display = (val === '__outro__') ? 'block' : 'none';
    },
    divCalcular() {
        const planta = parseFloat(document.getElementById('div-medida-planta').value);
        const real = parseFloat(document.getElementById('div-medida-real').value);
        const box = document.getElementById('div-calculo-box');
        const difEl = document.getElementById('div-calculo-dif');
        const pctEl = document.getElementById('div-calculo-pct');
        if (!box || !difEl || !pctEl) return;
        if (isNaN(planta) || isNaN(real) || planta === 0) { box.style.display = 'none'; return; }
        box.style.display = 'flex';
        const dif = real - planta;
        const pct = (dif / planta) * 100;
        const sinal = dif > 0 ? '+' : '';
        difEl.textContent = `${sinal}${dif.toFixed(3)} m`;
        difEl.style.color = dif === 0 ? 'var(--success)' : 'var(--danger)';
        pctEl.textContent = `${sinal}${pct.toFixed(2)}%`;
        pctEl.style.color = dif === 0 ? 'var(--success)' : 'var(--danger)';
    },
    async divFotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const compressed = await this.compressImage(file, 800, 0.7);
        this.div.fotoTemp = compressed;
        const preview = document.getElementById('div-foto-preview');
        if (preview) preview.innerHTML = `<img src="${compressed}" alt="Foto da divergência">`;
        event.target.value = '';
    },
    divSalvar() {
        const ambId = document.getElementById('div-ambiente').value;
        if (!ambId) return this.showToast("Selecione o ambiente.", 'warning');
        const amb = this.data.ambientes.find(a => a.id === ambId);
        if (!amb) return;
        const elemVal = document.getElementById('div-elemento').value;
        let elementoNome = '';
        if (elemVal === '__outro__') {
            elementoNome = document.getElementById('div-elemento-outro').value.trim();
            if (!elementoNome) return this.showToast("Descreva o elemento.", 'warning');
        } else if (elemVal.startsWith('parede:')) {
            const pId = elemVal.split(':')[1];
            const p = amb.paredes.find(x => x.id === pId);
            elementoNome = p ? `Parede: ${p.nome}` : 'Parede';
        } else if (elemVal.startsWith('elem:')) {
            const eId = elemVal.split(':')[1];
            const e = amb.elementos.find(x => x.id === eId);
            const tiposLabel = { janela: 'Janela', porta: 'Porta', tomada: 'Tomada', interruptor: 'Interruptor', ponto_hidraulico: 'Hidráulica', ponto_gas: 'Gás', ar_condicionado: 'Ar-Cond.' };
            elementoNome = e ? (tiposLabel[e.tipo] || e.tipo) : 'Elemento';
        } else {
            return this.showToast("Selecione o elemento/local.", 'warning');
        }
        const planta = parseFloat(document.getElementById('div-medida-planta').value) || null;
        const real = parseFloat(document.getElementById('div-medida-real').value) || null;
        const descricao = document.getElementById('div-descricao').value.trim();
        const pergunta = document.getElementById('div-pergunta').value.trim();
        const prioridade = document.getElementById('div-prioridade').value;
        const status = document.getElementById('div-status').value;
        if (!planta || !real) return this.showToast("Informe a medida na planta e a medida real.", 'warning');
        let dif = null, pct = null;
        if (planta && real && planta !== 0) { dif = real - planta; pct = (dif / planta) * 100; }
        this.data.divergencias.push({
            id: Date.now().toString(), ambienteId: ambId, ambienteNome: amb.nome, elemento: elementoNome,
            medidaPlanta: planta, medidaReal: real, diferenca: dif, diferencaPercentual: pct,
            descricao, pergunta, prioridade, status, foto: this.div.fotoTemp || null,
            dataRegistro: new Date().toISOString().split('T')[0]
        });
        this.saveLocal(); this.syncToFirebase();
        this.divLimparFormulario();
        this.renderDivergencias(); this.renderDashboard(); this.updateDivTotal();
        this.showToast("Divergência registrada", 'success');
        this.haptic('heavy');
    },
    divLimparFormulario() {
        ['div-elemento-outro', 'div-medida-planta', 'div-medida-real', 'div-descricao', 'div-pergunta'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const sel = document.getElementById('div-elemento'); if (sel) sel.value = '';
        const outroGroup = document.getElementById('div-elemento-outro-group'); if (outroGroup) outroGroup.style.display = 'none';
        const calcBox = document.getElementById('div-calculo-box'); if (calcBox) calcBox.style.display = 'none';
        this.div.fotoTemp = null;
        const preview = document.getElementById('div-foto-preview'); if (preview) preview.innerHTML = '';
    },
    updateDivTotal() {
        const el = document.getElementById('div-total');
        if (el) el.textContent = this.data.divergencias.length;
    },
    renderDivergencias() {
        this.updateDivTotal();
        const container = document.getElementById('divergencias-list');
        if (!container) return;
        const filterAmb = document.getElementById('div-filter-ambiente')?.value || 'all';
        const filterStatus = document.getElementById('div-filter-status')?.value || 'all';
        let list = this.data.divergencias.slice();
        if (filterAmb !== 'all') list = list.filter(d => d.ambienteId === filterAmb);
        if (filterStatus !== 'all') list = list.filter(d => d.status === filterStatus);
        list.sort((a, b) => b.id.localeCompare(a.id));
        if (list.length === 0) {
            container.innerHTML = '<p class="empty-msg">Nenhuma divergência registrada com esses filtros.</p>';
            return;
        }
        container.innerHTML = '';
        list.forEach(d => {
            const statusLabel = { aberta: 'Aberta', analise: 'Em análise', resolvida: 'Resolvida', aceita: 'Aceita' };
            const prioLabel = { baixa: 'Baixa', media: 'Média', alta: 'Alta', critica: 'Crítica' };
            const dif = d.diferenca !== null ? d.diferenca : 0;
            const pct = d.diferencaPercentual !== null ? d.diferencaPercentual : 0;
            const sinal = dif > 0 ? '+' : '';
            const card = document.createElement('div');
            card.className = `list-item div-card prioridade-${d.prioridade}`;
            card.innerHTML = `
                <div class="div-header">
                    <div>
                        <div class="div-title">${d.elemento}</div>
                        <div class="div-sub">${d.ambienteNome} • Prioridade ${prioLabel[d.prioridade]}</div>
                    </div>
                    <span class="div-status-badge status-${d.status}">${statusLabel[d.status]}</span>
                </div>
                <div class="div-diff">
                    <span>Planta: <strong>${d.medidaPlanta.toFixed(2)} m</strong></span>
                    <span>Real: <strong>${d.medidaReal.toFixed(2)} m</strong></span>
                    <span class="div-pct">${sinal}${dif.toFixed(3)} m (${sinal}${pct.toFixed(1)}%)</span>
                </div>
                ${d.descricao ? `<div class="list-item-details" style="margin-top:6px;"><strong>Descrição:</strong> ${d.descricao}</div>` : ''}
                ${d.pergunta ? `<div class="list-item-details" style="margin-top:4px;"><strong>Pergunta:</strong> ${d.pergunta}</div>` : ''}
                ${d.foto ? `<img class="div-foto" src="${d.foto}" alt="Foto">` : ''}
                <div class="div-actions">
                    <button class="btn-status" onclick="app.divMudarStatus('${d.id}')">Mudar Status</button>
                    <button class="btn-delete" onclick="app.divExcluir('${d.id}')">Excluir</button>
                </div>
            `;
            container.appendChild(card);
        });
    },
    divMudarStatus(id) {
        const d = this.data.divergencias.find(x => x.id === id);
        if (!d) return;
        const opts = ['aberta', 'analise', 'resolvida', 'aceita'];
        d.status = opts[(opts.indexOf(d.status) + 1) % opts.length];
        this.saveLocal(); this.syncToFirebase();
        this.renderDivergencias(); this.renderDashboard();
        this.haptic('medium');
    },
    divExcluir(id) {
        if (!confirm("Excluir esta divergência?")) return;
        this.data.divergencias = this.data.divergencias.filter(d => d.id !== id);
        this.saveLocal(); this.syncToFirebase();
        this.renderDivergencias(); this.renderDashboard();
        this.showToast("Divergência excluída", 'warning');
        this.haptic('heavy');
    },

    // ========== PLANTA ==========
    renderPlanta() {
        const empty = document.getElementById('planta-empty');
        const stage = document.getElementById('planta-stage');
        const img = document.getElementById('planta-img');
        if (!empty || !stage || !img) return;
        if (this.data.plantaImagem) {
            empty.style.display = 'none';
            stage.style.display = 'block';
            if (img.src !== this.data.plantaImagem) img.src = this.data.plantaImagem;
            this.plantaReset();
            this.renderPins();
        } else {
            empty.style.display = 'flex';
            stage.style.display = 'none';
        }
    },
    renderPins() {
        const layer = document.getElementById('planta-pins-layer');
        if (!layer) return;
        layer.innerHTML = '';
        this.data.plantaPins.forEach(pin => {
            const amb = this.data.ambientes.find(a => a.id === pin.ambienteId);
            if (!amb) return;
            const status = this.pinStatus(amb);
            const div = document.createElement('div');
            div.className = `planta-pin status-${status}`;
            div.style.left = `${pin.x}%`;
            div.style.top = `${pin.y}%`;
            div.innerHTML = `<span class="pin-label">${amb.nome.substring(0, 10)}</span>`;
            div.onclick = (e) => { e.stopPropagation(); this.openAmbiente(amb.id); };
            layer.appendChild(div);
        });
    },
    pinStatus(amb) {
        const hasDim = !!(amb.comp && amb.larg && amb.peDireito);
        const hasParedes = (amb.paredes?.length || 0) > 0;
        if (hasDim && hasParedes) return 'verde';
        if (hasDim || hasParedes) return 'amarelo';
        return 'vermelho';
    },
    applyTransform() {
        const stage = document.getElementById('planta-stage');
        if (!stage) return;
        stage.style.transform = `translate(${this.planta.tx}px, ${this.planta.ty}px) scale(${this.planta.scale})`;
    },
    plantaZoomIn() { this.planta.scale = Math.min(this.planta.scale * 1.3, this.planta.maxScale); this.applyTransform(); },
    plantaZoomOut() { this.planta.scale = Math.max(this.planta.scale / 1.3, this.planta.minScale); this.applyTransform(); },
    plantaReset() { this.planta.scale = 1; this.planta.tx = 0; this.planta.ty = 0; this.applyTransform(); },
    _plantaListenersInstalled: false,
    installPlantaGestures() {
        if (this._plantaListenersInstalled) return;
        const viewer = document.getElementById('planta-viewer');
        if (!viewer) return;
        this._plantaListenersInstalled = true;
        const self = this;
        viewer.addEventListener('touchstart', (e) => {
            if (self.planta.mode === 'addpin') return;
            if (e.touches.length === 1) {
                self.planta.isPanning = true;
                self.planta.lastTouchX = e.touches[0].clientX;
                self.planta.lastTouchY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                self.planta.isPinching = true;
                self.planta.isPanning = false;
                self.planta.lastTouchDist = self._dist(e.touches[0], e.touches[1]);
            }
        }, { passive: false });
        viewer.addEventListener('touchmove', (e) => {
            if (self.planta.mode === 'addpin') return;
            e.preventDefault();
            if (self.planta.isPinching && e.touches.length === 2) {
                const dist = self._dist(e.touches[0], e.touches[1]);
                const ratio = dist / self.planta.lastTouchDist;
                self.planta.scale = Math.min(Math.max(self.planta.scale * ratio, self.planta.minScale), self.planta.maxScale);
                self.planta.lastTouchDist = dist;
                self.applyTransform();
            } else if (self.planta.isPanning && e.touches.length === 1) {
                const dx = e.touches[0].clientX - self.planta.lastTouchX;
                const dy = e.touches[0].clientY - self.planta.lastTouchY;
                self.planta.tx += dx; self.planta.ty += dy;
                self.planta.lastTouchX = e.touches[0].clientX;
                self.planta.lastTouchY = e.touches[0].clientY;
                self.applyTransform();
            }
        }, { passive: false });
        viewer.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                self.planta.isPanning = false; self.planta.isPinching = false;
            } else if (e.touches.length === 1) {
                self.planta.isPinching = false; self.planta.isPanning = true;
                self.planta.lastTouchX = e.touches[0].clientX;
                self.planta.lastTouchY = e.touches[0].clientY;
            }
        });
        viewer.addEventListener('click', (e) => {
            if (self.planta.mode !== 'addpin') return;
            const rect = viewer.getBoundingClientRect();
            const x = (e.clientX - rect.left - self.planta.tx) / self.planta.scale;
            const y = (e.clientY - rect.top - self.planta.ty) / self.planta.scale;
            const xPct = (x / rect.width) * 100;
            const yPct = (y / rect.height) * 100;
            if (xPct < 0 || xPct > 100 || yPct < 0 || yPct > 100) return;
            self.openPinModal(xPct, yPct);
        });
        viewer.addEventListener('mousedown', (e) => {
            if (self.planta.mode === 'addpin') return;
            self.planta.isPanning = true;
            self.planta.lastTouchX = e.clientX;
            self.planta.lastTouchY = e.clientY;
        });
        viewer.addEventListener('mousemove', (e) => {
            if (!self.planta.isPanning) return;
            const dx = e.clientX - self.planta.lastTouchX;
            const dy = e.clientY - self.planta.lastTouchY;
            self.planta.tx += dx; self.planta.ty += dy;
            self.planta.lastTouchX = e.clientX; self.planta.lastTouchY = e.clientY;
            self.applyTransform();
        });
        viewer.addEventListener('mouseup', () => { self.planta.isPanning = false; });
        viewer.addEventListener('mouseleave', () => { self.planta.isPanning = false; });
        viewer.addEventListener('wheel', (e) => {
            if (self.planta.mode === 'addpin') return;
            e.preventDefault();
            const ratio = e.deltaY < 0 ? 1.1 : 0.9;
            self.planta.scale = Math.min(Math.max(self.planta.scale * ratio, self.planta.minScale), self.planta.maxScale);
            self.applyTransform();
        }, { passive: false });
    },
    _dist(t1, t2) {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    },
    async handlePlantaUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const compressed = await this.compressImage(file, 2000, 0.8);
        this.data.plantaImagem = compressed;
        this.saveLocal();
        this.installPlantaGestures();
        this.renderPlanta();
        event.target.value = '';
        this.showToast("Planta importada", 'success');
        this.haptic('medium');
    },
    plantaTrocarImagem() {
        const input = document.getElementById('planta-input');
        if (input) input.click();
    },
    plantaStartAddPin() {
        if (!this.data.plantaImagem) return this.showToast("Importe a planta primeiro.", 'warning');
        this.planta.mode = 'addpin';
        const hint = document.getElementById('planta-hint');
        if (hint) hint.classList.add('active');
        this.haptic('light');
    },
    plantaCancelPin() {
        this.planta.mode = 'view';
        const hint = document.getElementById('planta-hint');
        if (hint) hint.classList.remove('active');
    },
    plantaLimparPins() {
        if (!confirm("Remover todos os pins da planta? (Os ambientes não serão apagados)")) return;
        this.data.plantaPins = [];
        this.saveLocal(); this.syncToFirebase();
        this.renderPins();
        this.showToast("Pins removidos", 'warning');
        this.haptic('heavy');
    },
    openPinModal(xPct, yPct) {
        this.planta.pendingPin = { x: xPct, y: yPct };
        this.plantaCancelPin();
        let modal = document.getElementById('pin-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pin-modal';
            modal.className = 'pin-modal-overlay';
            document.body.appendChild(modal);
        }
        const options = this.data.ambientes.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
        modal.innerHTML = `
            <div class="pin-modal">
                <h3>📍 Associar Pin a um Ambiente</h3>
                <div class="input-group">
                    <label>Ambiente</label>
                    <select id="pin-ambiente-select">${options}</select>
                </div>
                <div class="pin-modal-actions">
                    <button class="btn btn-secondary" onclick="app.closePinModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="app.confirmPin()">Adicionar</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    },
    closePinModal() {
        const modal = document.getElementById('pin-modal');
        if (modal) modal.classList.remove('active');
        this.planta.pendingPin = null;
    },
    confirmPin() {
        const select = document.getElementById('pin-ambiente-select');
        if (!select || !this.planta.pendingPin) return;
        this.data.plantaPins.push({
            id: Date.now().toString(),
            x: this.planta.pendingPin.x,
            y: this.planta.pendingPin.y,
            ambienteId: select.value
        });
        this.saveLocal(); this.syncToFirebase();
        this.renderPins();
        this.closePinModal();
        this.showToast("Pin adicionado", 'success');
        this.haptic('medium');
    },

    // ========== MEDIÇÃO RÁPIDA ==========
    openQuickMeasure() {
        this.qm = { tipo: null, ambienteId: null, paredeId: null, count: 0 };
        const ambSelect = document.getElementById('qm-ambiente');
        if (!ambSelect) return;
        ambSelect.innerHTML = '<option value="">Selecione...</option>';
        this.data.ambientes.forEach(a => { ambSelect.innerHTML += `<option value="${a.id}">${a.nome}</option>`; });
        const details = document.getElementById('qm-step-details');
        if (details) details.style.display = 'none';
        const countEl = document.getElementById('qm-count');
        if (countEl) countEl.textContent = '0';
        document.querySelectorAll('.qm-type-btn').forEach(b => b.classList.remove('selected'));
        const modal = document.getElementById('quick-measure-modal');
        if (modal) modal.classList.add('active');
        document.querySelectorAll('.qm-type-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.qm-type-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.qm.tipo = btn.getAttribute('data-type');
                this.qmConfigurarCampos(this.qm.tipo);
                if (details) details.style.display = 'block';
                this.haptic('light');
            };
        });
        this.haptic('medium');
    },
    closeQuickMeasure() {
        const modal = document.getElementById('quick-measure-modal');
        if (modal) modal.classList.remove('active');
        this.renderDashboard();
        if (this.currentAmbienteId) {
            const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
            if (amb) { this.renderParedes(amb); this.renderElementos(amb); }
        }
    },
    qmConfigurarCampos(tipo) {
        const labelA = document.getElementById('qm-label-a');
        const labelB = document.getElementById('qm-label-b');
        const campoBGroup = document.getElementById('qm-campo-b-group');
        const campoCGroup = document.getElementById('qm-campo-c-group');
        if (!labelA || !labelB || !campoBGroup || !campoCGroup) return;
        campoBGroup.style.display = 'block';
        campoCGroup.style.display = 'block';
        switch(tipo) {
            case 'parede': labelA.textContent = 'Comprimento (m)'; labelB.textContent = 'Altura (m)'; campoCGroup.style.display = 'none'; break;
            case 'janela': case 'porta': labelA.textContent = 'Largura (m)'; labelB.textContent = 'Altura (m)'; break;
            case 'tomada': case 'interruptor': case 'ponto_hidraulico': case 'ponto_gas':
                labelA.textContent = 'Altura do Piso (m)'; campoBGroup.style.display = 'none'; campoCGroup.style.display = 'none'; break;
            case 'ar_condicionado':
                labelA.textContent = 'Altura (m)'; campoBGroup.style.display = 'none'; campoCGroup.style.display = 'none'; break;
        }
    },
    qmLoadParedes() {
        const ambSelect = document.getElementById('qm-ambiente');
        if (!ambSelect) return;
        const ambId = ambSelect.value;
        this.qm.ambienteId = ambId;
        const paredeSelect = document.getElementById('qm-parede');
        if (!paredeSelect) return;
        paredeSelect.innerHTML = '<option value="">Selecione...</option>';
        if (!ambId) return;
        const amb = this.data.ambientes.find(a => a.id === ambId);
        if (!amb) return;
        (amb.paredes || []).forEach(p => { paredeSelect.innerHTML += `<option value="${p.id}">${p.nome}</option>`; });
    },
    qmSave() {
        if (!this.qm.tipo) return this.showToast("Escolha o tipo de medida.", 'warning');
        if (!this.qm.ambienteId) return this.showToast("Escolha o ambiente.", 'warning');
        const amb = this.data.ambientes.find(a => a.id === this.qm.ambienteId);
        if (!amb) return;
        const valorA = parseFloat(document.getElementById('qm-valor-a')?.value) || null;
        const valorB = parseFloat(document.getElementById('qm-valor-b')?.value) || null;
        const valorC = parseFloat(document.getElementById('qm-valor-c')?.value) || null;
        const paredeId = document.getElementById('qm-parede')?.value || null;
        if (!valorA) return this.showToast("Informe o valor principal.", 'warning');
        if (this.qm.tipo === 'parede') {
            if (!amb.paredes) amb.paredes = [];
            amb.paredes.push({ id: Date.now().toString(), nome: `Parede ${(amb.paredes.length + 1)}`, comp: valorA, alt: valorB || 2.70 });
        } else {
            if (!amb.elementos) amb.elementos = [];
            amb.elementos.push({ id: Date.now().toString(), paredeId: paredeId, tipo: this.qm.tipo, larg: valorA, alt: valorB, peitoril: valorC });
        }
        this.saveLocal(); this.syncToFirebase();
        this.qm.count++;
        const counter = document.getElementById('qm-count');
        if (counter) counter.textContent = this.qm.count;
        const counterBox = document.querySelector('.qm-counter');
        if (counterBox) { counterBox.classList.remove('flash'); void counterBox.offsetWidth; counterBox.classList.add('flash'); }
        const a = document.getElementById('qm-valor-a');
        const b = document.getElementById('qm-valor-b');
        const c = document.getElementById('qm-valor-c');
        if (a) { a.value = ''; a.focus(); }
        if (b) b.value = '';
        if (c) c.value = '';
        this.haptic('light');
    },

    // ========== RELATÓRIO (COM FOTOS) ==========
    renderRelatorio() {
        const container = document.getElementById('report-content');
        if (!container) return;
        const hoje = new Date().toLocaleDateString('pt-BR');
        let html = `
            <div class="report-header">
                <h1>Relatório de Vistoria e Medição</h1>
                <p><strong>Empreendimento:</strong> ${this.data.projeto.nome} Unidade 801 A</p>
                <p><strong>Data da Visita:</strong> ${this.data.projeto.dataVisita} &nbsp;|&nbsp; <strong>Emissão:</strong> ${hoje}</p>
                <p><strong>Área Total Prevista na Planta:</strong> 55,70 m²</p>
            </div>
        `;
        let totalParedes = 0, totalElementos = 0, totalFotos = 0;
        this.data.ambientes.forEach(a => {
            totalParedes += (a.paredes?.length || 0);
            totalElementos += (a.elementos?.length || 0);
            totalFotos += (a.fotos?.length || 0);
        });
        html += `
            <div class="report-section">
                <h2>Resumo Geral</h2>
                <table class="report-table">
                    <tr><th>Ambientes cadastrados</th><td>${this.data.ambientes.length}</td></tr>
                    <tr><th>Paredes medidas</th><td>${totalParedes}</td></tr>
                    <tr><th>Elementos registrados</th><td>${totalElementos}</td></tr>
                    <tr><th>Fotografias anexadas</th><td>${totalFotos}</td></tr>
                    <tr><th>Pins na planta</th><td>${this.data.plantaPins.length}</td></tr>
                    <tr><th>Itens de marcenaria</th><td>${this.data.marcenaria.length}</td></tr>
                    <tr><th style="color:#C41E16;">Divergências registradas</th><td style="color:#C41E16;font-weight:700;">${this.data.divergencias.length}</td></tr>
                </table>
            </div>
        `;
        // Divergências
        if (this.data.divergencias.length > 0) {
            html += `<div class="report-section"><h2 style="border-left-color:#FF3B30;">⚠️ Divergências</h2>`;
            const prioLabel = { baixa: 'Baixa', media: 'Média', alta: 'Alta', critica: 'Crítica' };
            const statusLabel = { aberta: 'Aberta', analise: 'Em análise', resolvida: 'Resolvida', aceita: 'Aceita' };
            this.data.divergencias.forEach((d, i) => {
                const dif = d.diferenca !== null ? d.diferenca : 0;
                const pct = d.diferencaPercentual !== null ? d.diferencaPercentual : 0;
                const sinal = dif > 0 ? '+' : '';
                html += `
                    <div class="report-divergencia-box">
                        <h4>#${i+1} — ${d.elemento} (${d.ambienteNome})</h4>
                        <p><strong>Medida na planta:</strong> ${d.medidaPlanta.toFixed(2)} m &nbsp;|&nbsp; <strong>Medida real:</strong> ${d.medidaReal.toFixed(2)} m &nbsp;|&nbsp; <strong>Diferença:</strong> ${sinal}${dif.toFixed(3)} m (${sinal}${pct.toFixed(2)}%)</p>
                        <p><strong>Prioridade:</strong> ${prioLabel[d.prioridade]} &nbsp;|&nbsp; <strong>Status:</strong> ${statusLabel[d.status]}</p>
                        ${d.descricao ? `<p><strong>Descrição:</strong> ${d.descricao}</p>` : ''}
                        ${d.pergunta ? `<p><strong>Pergunta à construtora:</strong> ${d.pergunta}</p>` : ''}
                        ${d.foto ? `<div class="report-foto-grid" style="margin-top:8px;"><img src="${d.foto}" alt="Foto divergência"></div>` : ''}
                    </div>
                `;
            });
            html += `</div>`;
        }
        // Ambientes com fotos
        this.data.ambientes.forEach(amb => {
            const area = (amb.comp && amb.larg) ? (amb.comp * amb.larg).toFixed(2) : 'Não medido';
            html += `
                <div class="report-section">
                    <div class="report-ambiente-title">${amb.nome}</div>
                    <table class="report-table">
                        <tr>
                            <th>Comprimento</th><td>${amb.comp ? amb.comp + ' m' : '—'}</td>
                            <th>Largura</th><td>${amb.larg ? amb.larg + ' m' : '—'}</td>
                            <th>Pé-direito</th><td>${amb.peDireito ? amb.peDireito + ' m' : '—'}</td>
                        </tr>
                        <tr>
                            <th>Área do Piso</th><td>${area !== 'Não medido' ? area + ' m²' : '—'}</td>
                            <th>Paredes</th><td>${amb.paredes?.length || 0}</td>
                            <th>Elementos</th><td>${amb.elementos?.length || 0}</td>
                        </tr>
                    </table>
            `;
            if (amb.paredes && amb.paredes.length > 0) {
                html += `<h3 style="font-size:0.95rem; margin:12px 0 6px;">Paredes</h3>
                    <table class="report-table">
                        <thead><tr><th>Parede</th><th>Comp.</th><th>Alt.</th><th>Área Bruta</th><th>Vãos</th><th>Área Líquida</th></tr></thead><tbody>`;
                amb.paredes.forEach(p => {
                    const bruta = (p.comp * p.alt);
                    let vaos = 0;
                    (amb.elementos || []).filter(e => e.paredeId === p.id).forEach(e => {
                        if (e.larg && e.alt) vaos += (e.larg * e.alt);
                    });
                    html += `<tr><td>${p.nome}</td><td>${p.comp}</td><td>${p.alt}</td><td>${bruta.toFixed(2)}</td><td>${vaos.toFixed(2)}</td><td><strong>${(bruta - vaos).toFixed(2)}</strong></td></tr>`;
                });
                html += `</tbody></table>`;
            }
            if (amb.elementos && amb.elementos.length > 0) {
                const tipoLabel = { janela: 'Janela', porta: 'Porta', tomada: 'Tomada', interruptor: 'Interruptor', ponto_hidraulico: 'Hidráulica', ponto_gas: 'Gás', ar_condicionado: 'Ar-Cond.' };
                html += `<h3 style="font-size:0.95rem; margin:12px 0 6px;">Elementos</h3>
                    <table class="report-table">
                        <thead><tr><th>Tipo</th><th>Parede</th><th>Larg.</th><th>Alt.</th><th>Peitoril</th></tr></thead><tbody>`;
                amb.elementos.forEach(e => {
                    const parede = amb.paredes.find(p => p.id === e.paredeId);
                    html += `<tr><td>${tipoLabel[e.tipo] || e.tipo}</td><td>${parede ? parede.nome : '—'}</td><td>${e.larg || '—'}</td><td>${e.alt || '—'}</td><td>${e.peitoril || '—'}</td></tr>`;
                });
                html += `</tbody></table>`;
            }
            // FOTOS DO AMBIENTE (NOVO)
            if (amb.fotos && amb.fotos.length > 0) {
                html += `<h3 style="font-size:0.95rem; margin:12px 0 6px;">Fotos do Ambiente (${amb.fotos.length})</h3>`;
                html += `<div class="report-foto-grid">`;
                amb.fotos.forEach(foto => { html += `<img src="${foto}" alt="Foto">`; });
                html += `</div>`;
            }
            html += `</div>`;
        });
        // Marcenaria
        if (this.data.marcenaria && this.data.marcenaria.length > 0) {
            html += `<div class="report-section"><h2>🛋️ Planejamento de Marcenaria</h2>`;
            html += `<table class="report-table"><thead><tr><th>Ambiente</th><th>Item</th><th>Larg.</th><th>Prof.</th><th>Alt.</th><th>Folga</th><th>Avaliação</th></tr></thead><tbody>`;
            this.data.marcenaria.forEach(m => {
                const amb = this.data.ambientes.find(a => a.id === m.ambienteId);
                const av = this.marcAvaliar(m);
                const avLabel = { cabe: '✓ Cabe', apertado: '⚠ Apertado', 'nao-cabe': '✗ Não cabe', 'sem-medida': '— Sem medida' }[av.status];
                html += `<tr>
                    <td>${amb ? amb.nome : '—'}</td>
                    <td>${m.nome}${m.modelo ? ' (' + m.modelo + ')' : ''}</td>
                    <td>${m.largura} m</td>
                    <td>${m.profundidade} m</td>
                    <td>${m.altura || '—'}</td>
                    <td>${m.folga} cm</td>
                    <td>${avLabel}</td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
        }
        // Checklist
        html += `<div class="report-section"><h2>Checklist Geral</h2><table class="report-table"><thead><tr><th>Item</th><th>Status</th></tr></thead><tbody>`;
        const statusLabel2 = { pendente: 'Pendente', medido: 'Medido', conferido: 'Conferido', na: 'N/A' };
        this.data.checklist.forEach(chk => {
            html += `<tr><td>${chk.texto}</td><td>${statusLabel2[chk.status] || chk.status}</td></tr>`;
        });
        html += `</tbody></table></div>`;
        html += `<div class="report-section" style="text-align:center; margin-top:40px; font-size:0.8rem; color:#888;"><p>Relatório gerado pelo aplicativo de Medição e Vistoria.</p></div>`;
        container.innerHTML = html;
    },
    printReport() {
    // 1. Garante que estamos na tela de relatório
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    const relView = document.getElementById('view-relatorio');
    if (relView) relView.classList.add('active');
    
    // 2. Renderiza o relatório (caso haja dados novos)
    this.renderRelatorio();
    
    // 3. Força o navegador a recalcular o layout antes de imprimir
    //    (Safari precisa disso para pegar o CSS @media print corretamente)
    void document.body.offsetHeight;
    
    // 4. Rola para o topo (a prévia começa do topo da página)
    const main = document.getElementById('app-content');
    if (main) main.scrollTop = 0;
    
    // 5. Abre o diálogo de impressão após o layout estabilizar
    setTimeout(() => {
        window.print();
    }, 300);
    
    this.haptic('medium');
},
printReportInNewTab() {
    // Renderiza o HTML do relatório
    this.renderRelatorio();
    const reportHtml = document.getElementById('report-content').innerHTML;
    
    // Monta uma página limpa com CSS embutido
    const css = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #000; background: #fff; padding: 20px; max-width: 900px; margin: 0 auto; }
        h1 { font-size: 1.5rem; border-bottom: 2px solid #333; padding-bottom: 10px; text-align: center; }
        h2 { font-size: 1.1rem; border-left: 4px solid #007AFF; padding-left: 10px; margin-top: 24px; }
        h3 { font-size: 1rem; margin-top: 16px; }
        p { font-size: 0.9rem; line-height: 1.4; }
        table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #f0f0f0; font-weight: 700; }
        .report-foto-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 8px 0; }
        .report-foto-grid img { width: 100%; height: 100px; object-fit: cover; border-radius: 6px; border: 1px solid #ccc; }
        .report-divergencia-box { background: #FFF5F4; border-left: 4px solid #FF3B30; padding: 12px 16px; margin-bottom: 12px; border-radius: 6px; }
        .report-divergencia-box h4 { margin: 0 0 6px; color: #C41E16; }
        .report-ambiente-title { font-size: 1.2rem; font-weight: 800; margin: 24px 0 8px; padding-bottom: 6px; border-bottom: 1px solid #999; }
        .report-header { text-align: center; margin-bottom: 20px; }
        .report-header p { margin: 2px 0; color: #555; }
        @media print {
            body { padding: 0; max-width: none; }
            .report-foto-grid { grid-template-columns: repeat(4, 1fr); }
            .report-foto-grid img { height: 80px; }
            .report-section { page-break-inside: avoid; }
            .report-divergencia-box { page-break-inside: avoid; }
        }
    `;
    
    const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Vistoria</title>
    <style>${css}</style>
</head>
<body>${reportHtml}</body>
</html>`;
    
    // Abre em nova aba
    const win = window.open('', '_blank');
    if (!win) {
        this.showToast("Bloqueador de popup impediu. Permita popups neste site.", 'error');
        return;
    }
    win.document.open();
    win.document.write(fullHtml);
    win.document.close();
    
    // Aguarda as imagens carregarem antes de imprimir
    win.onload = () => {
        setTimeout(() => {
            win.focus();
            win.print();
        }, 500);
    };
    this.haptic('medium');
},
    exportCSV() {
        let csv = '\uFEFF';
        csv += 'Ambiente;Tipo;Identificação/Elemento;Largura (m);Altura/Comprimento (m);Peitoril (m);Área (m²)\n';
        this.data.ambientes.forEach(amb => {
            const areaPiso = (amb.comp && amb.larg) ? (amb.comp * amb.larg).toFixed(2) : '';
            csv += `"${amb.nome}";"Piso";"—";"${amb.larg || ''}";"${amb.comp || ''}";"${amb.peDireito || ''}";"${areaPiso}"\n`;
            (amb.paredes || []).forEach(p => {
                const bruta = (p.comp * p.alt).toFixed(2);
                csv += `"${amb.nome}";"Parede";"${p.nome}";"${p.comp}";"${p.alt}";"";"${bruta}"\n`;
            });
            (amb.elementos || []).forEach(e => {
                const parede = amb.paredes.find(p => p.id === e.paredeId);
                csv += `"${amb.nome}";"${e.tipo}";"${parede ? parede.nome : ''}";"${e.larg || ''}";"${e.alt || ''}";"${e.peitoril || ''}";""\n`;
            });
        });
        csv += '\nChecklist;Status\n';
        this.data.checklist.forEach(chk => { csv += `"${chk.texto}";"${chk.status}"\n`; });
        csv += '\nDivergências;Ambiente;Elemento;Medida Planta (m);Medida Real (m);Diferença (m);Diferença (%);Prioridade;Status;Descrição;Pergunta\n';
        this.data.divergencias.forEach(d => {
            const dif = d.diferenca !== null ? d.diferenca.toFixed(3) : '';
            const pct = d.diferencaPercentual !== null ? d.diferencaPercentual.toFixed(2) : '';
            csv += `"Sim";"${d.ambienteNome}";"${d.elemento}";"${d.medidaPlanta}";"${d.medidaReal}";"${dif}";"${pct}";"${d.prioridade}";"${d.status}";"${(d.descricao || '').replace(/"/g, '""')}";"${(d.pergunta || '').replace(/"/g, '""')}"\n`;
        });
        csv += '\nMarcenaria;Ambiente;Item;Largura (m);Profundidade (m);Altura (m);Folga (cm);Avaliação\n';
        this.data.marcenaria.forEach(m => {
            const amb = this.data.ambientes.find(a => a.id === m.ambienteId);
            const av = this.marcAvaliar(m);
            const avLabel = { cabe: 'Cabe', apertado: 'Apertado', 'nao-cabe': 'Não cabe', 'sem-medida': 'Sem medida' }[av.status];
            csv += `"Sim";"${amb ? amb.nome : ''}";"${m.nome}";"${m.largura}";"${m.profundidade}";"${m.altura || ''}";"${m.folga}";"${avLabel}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_vistoria_${this.data.projeto.id}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast("CSV exportado", 'success');
        this.haptic('medium');
    }
};

window.app = app;
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    setTimeout(() => app.installPlantaGestures(), 100);
});
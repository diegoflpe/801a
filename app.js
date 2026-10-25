import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// FIREBASE CONFIG (COLOQUE SUAS CHAVES AQUI)
// ==========================================
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

// ==========================================
// CHECKLISTS CONTEXTUAIS (Mantidos)
// ==========================================
const CHECKLISTS_CONTEXTUAIS = {
    banheiro: { label: "Banheiro / Lavabo", sections: [
        { titulo: "Hidráulica", itens: ["Ponto de água fria do lavatório","Ponto de esgoto do lavatório","Ponto de água fria do vaso","Ponto de esgoto do vaso","Ponto de água fria do chuveiro","Ponto de água quente do chuveiro (se houver)","Registro de gaveta acessível","Ralo sifonado no box","Ralo sifonado fora do box"]},
        { titulo: "Louças e Metais", itens: ["Vaso sanitário instalado","Cuba / lavatório instalado","Torneira do lavatório","Chuveiro / ducha","Box (instalado ou previsto)","Espelho previsto"]},
        { titulo: "Elétrica", itens: ["Tomada próxima ao lavatório (com DR)","Interruptor interno","Ponto de iluminação no teto","Ponto de exaustão / ventilação","Tomada para chuveiro elétrico (se aplicável)"]},
        { titulo: "Estrutural", itens: ["Shaft aparente ou fechado","Nichos no box","Impermeabilização do piso","Impermeabilização das paredes do box"]}
    ]},
    cozinha: { label: "Cozinha", sections: [
        { titulo: "Hidráulica", itens: ["Ponto de água fria da cuba","Ponto de esgoto da cuba","Ponto de água da máquina de lavar (se aplicável)","Ponto de esgoto da máquina de lavar (se aplicável)","Registro de gaveta acessível","Ponto de filtro de água"]},
        { titulo: "Elétrica", itens: ["Tomada para geladeira","Tomada para forno elétrico","Tomada para micro-ondas","Tomada para cooktop (se elétrico)","Tomada para coifa / depurador","Tomada para lava-louças","Tomadas da bancada (mínimo 2)","Interruptores","Ponto de iluminação geral","Ponto de iluminação sob armários"]},
        { titulo: "Marcenaria e Bancada", itens: ["Altura da bancada","Profundidade da bancada","Espaço para armários inferiores","Espaço para armários superiores","Abertura de portas de armário","Circulação entre bancadas"]},
        { titulo: "Eletrodomésticos", itens: ["Espaço para geladeira (largura x profundidade)","Espaço para fogão / cooktop","Espaço para forno","Espaço para coifa","Espaço para lava-louças","Interferências (tubulação, esquadria)"]}
    ]},
    quarto: { label: "Quarto / Suíte", sections: [
        { titulo: "Dimensões", itens: ["Comprimento da parede da cama","Largura da parede do guarda-roupa","Espaço para circulação ao redor da cama","Espaço para abertura do guarda-roupa"]},
        { titulo: "Elétrica", itens: ["Tomadas nas cabeceiras","Tomada para TV","Tomada para ar-condicionado","Interruptor de entrada","Interruptor de cabeceira","Ponto de iluminação no teto","Ponto de iluminação nas cabeceiras"]},
        { titulo: "Esquadrias", itens: ["Janela: largura, altura, peitoril","Cortina: espaço e tipo","Persiana: espaço e tipo","Porta: largura, altura, sentido de abertura"]},
        { titulo: "Marcenaria", itens: ["Profundidade disponível para guarda-roupa","Altura disponível para armário","Interferências (tomadas, janelas, tubulação)"]}
    ]},
    varanda: { label: "Varanda / Sacada", sections: [
        { titulo: "Estrutural", itens: ["Guarda-corpo (altura e tipo)","Piso e desnível em relação ao interior","Ralo de escoamento","Laje para condensadora (se houver)"]},
        { titulo: "Hidráulica e Gás", itens: ["Ponto de água (se gourmet)","Ponto de esgoto (se gourmet)","Ponto de gás (se churrasqueira)","Registro acessível"]},
        { titulo: "Elétrica", itens: ["Tomada (área molhada — com DR)","Ponto de iluminação","Interruptor"]},
        { titulo: "Regras do Condomínio", itens: ["Fechamento permitido?","Alteração de fachada permitida?","Regras para churrasqueira / gourmet"]}
    ]},
    sala: { label: "Sala (Estar / Jantar)", sections: [
        { titulo: "Dimensões", itens: ["Comprimento total da sala","Largura da área de estar","Largura da área de jantar","Distância entre sofá e TV","Circulação principal"]},
        { titulo: "Elétrica", itens: ["Tomadas na parede da TV","Tomada para rack / home theater","Tomadas próximas ao sofá","Tomada para ar-condicionado","Pontos de internet / rede","Interruptores","Ponto de iluminação central","Pontos de iluminação auxiliar"]},
        { titulo: "Esquadrias e Cortinas", itens: ["Janela: largura, altura, peitoril","Porta de entrada: largura, altura, sentido","Espaço para cortina","Espaço para persiana"]}
    ]},
    lavanderia: { label: "Lavanderia / Área de Serviço", sections: [
        { titulo: "Hidráulica", itens: ["Ponto de água do tanque","Ponto de esgoto do tanque","Ponto de água da máquina de lavar","Ponto de esgoto da máquina de lavar","Registro acessível"]},
        { titulo: "Elétrica", itens: ["Tomada para máquina de lavar (com DR)","Tomada para secadora (se houver)","Tomada para ferro de passar","Ponto de iluminação","Interruptor"]},
        { titulo: "Estrutural", itens: ["Ventilação (janela ou exaustão)","Ponto para varal","Espaço para armários","Impermeabilização do piso"]}
    ]},
    generico: { label: "Ambiente (genérico)", sections: [
        { titulo: "Dimensões", itens: ["Comprimento","Largura","Pé-direito","Área do piso","Perímetro"]},
        { titulo: "Elétrica", itens: ["Tomadas (quantidade e altura)","Interruptores","Ponto de iluminação"]},
        { titulo: "Vãos", itens: ["Portas: largura, altura, sentido","Janelas: largura, altura, peitoril"]},
        { titulo: "Acabamentos", itens: ["Piso","Parede","Teto","Rodapé"]}
    ]}
};

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

// ==========================================
// APP
// ==========================================
const app = {
    data: {
        projeto: { id: "apto801A", nome: "Love 801A 💝", dataVisita: new Date().toISOString().split('T')[0] },
        ambientes: [],
        checklist: [],
        plantaImagem: null,
        plantaPins: [],
        divergencias: [],
        marcenaria: [],
        vistoria: { preparacao: {}, ambientes: {}, obsGeral: {} }
    },
    currentAmbienteId: null,
    currentTab: 'tab-geral',
    currentRelatorio: 'rel-medicao',
    _currentVistTipo: null,
    qm: { tipo: null, ambienteId: null, paredeId: null, count: 0 },
    div: { fotoTemp: null },
    _unsynced: false,
    _isSyncing: false, // Evita loop de sincronização

    planta: {
        scale: 1, tx: 0, ty: 0, minScale: 0.5, maxScale: 5,
        mode: 'view', pendingPin: null,
        lastTouchDist: 0, lastTouchX: 0, lastTouchY: 0,
        isPanning: false, isPinching: false
    },

    async init() {
        this.loadLocalData();
        this.renderAll();
        
        if (navigator.onLine) {
            await this.syncFromFirebase(); // Busca inicial
            this.listenToFirebase();       // Fica escutando em tempo real
        }
        
        window.addEventListener('online', () => { this.updateSaveStatus('Sincronizando...', 'syncing'); this.syncToFirebase(); });
        window.addEventListener('offline', () => this.updateSaveStatus('Offline (Salvo local)', 'saved'));
        window.addEventListener('beforeunload', (e) => { if (this._unsynced) { e.preventDefault(); e.returnValue = ''; } });
    },

    showToast(message, type = 'default', duration = 2200) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 300); }, duration);
    },
    haptic(intensity = 'light') {
        if (navigator.vibrate) {
            const patterns = { light: [10], medium: [20], heavy: [30] };
            navigator.vibrate(patterns[intensity] || [10]);
        }
    },
    markUnsynced() {
        if (this._isSyncing) return;
        this._unsynced = true;
        this.updateSaveStatus('Não sincronizado', 'unsynced');
    },

    saveLocal() {
        try {
            localStorage.setItem('vistoriaAppData', JSON.stringify(this.data));
            this.updateSaveStatus('Salvo localmente', 'saved');
            this.markUnsynced();
        } catch (e) { this.showToast("Erro ao salvar. Armazenamento cheio.", 'error'); }
    },
    loadLocalData() {
        const saved = localStorage.getItem('vistoriaAppData');
        if (saved) {
            this.data = JSON.parse(saved);
            if (!this.data.plantaPins) this.data.plantaPins = [];
            if (!this.data.divergencias) this.data.divergencias = [];
            if (!this.data.marcenaria) this.data.marcenaria = [];
            if (!this.data.vistoria) this.data.vistoria = { preparacao: {}, ambientes: {}, obsGeral: {} };
        } else {
            // Dados iniciais (só roda se não tiver nada salvo)
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
            this.data.vistoria = { preparacao: {}, ambientes: {}, obsGeral: {} };
            this.saveLocal();
        }
    },

    async syncToFirebase() {
        if (!navigator.onLine || this._isSyncing) return;
        this._isSyncing = true;
        this.updateSaveStatus('Sincronizando...', 'syncing');
        try {
            const dataToSync = JSON.parse(JSON.stringify(this.data));
            dataToSync.ambientes.forEach(a => a.fotos = []);
            dataToSync.plantaImagem = null;
            dataToSync.divergencias.forEach(d => d.foto = null);
            
            await setDoc(doc(db, "projetos", this.data.projeto.id), dataToSync, { merge: true });
            this._unsynced = false;
            this.updateSaveStatus('Sincronizado', 'saved');
        } catch (e) {
            console.error("Erro ao sincronizar:", e);
            this.updateSaveStatus('Erro nuvem (Salvo local)', 'unsynced');
        } finally {
            this._isSyncing = false;
        }
    },

    async syncFromFirebase() {
        if (!navigator.onLine) return;
        try {
            const docRef = doc(db, "projetos", this.data.projeto.id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                this.applyCloudData(docSnap.data(), false);
            }
        } catch (e) {
            console.error("Erro ao baixar da nuvem:", e);
        }
    },

        listenToFirebase() {
        const docRef = doc(db, "projetos", this.data.projeto.id);
        onSnapshot(docRef, (docSnap) => {
            // Só aplica os dados se NÃO estiver no meio de um envio local
            if (docSnap.exists() && !this._isSyncing) {
                const dataNuvem = docSnap.data();
                this.applyCloudData(dataNuvem, true);
            }
        });
    },

        applyCloudData(dataNuvem, showToast = true) {
        let changed = false;
        
        // 1. Sincroniza Ambientes (incluindo novos e excluídos)
        if (dataNuvem.ambientes) {
            // Pega as fotos que estão no aparelho atual para não perder
            const fotosLocais = {};
            this.data.ambientes.forEach(amb => {
                if (amb.fotos && amb.fotos.length > 0) fotosLocais[amb.id] = amb.fotos;
            });

            // Substitui a lista inteira pela da nuvem
            this.data.ambientes = dataNuvem.ambientes.map(ambNuvem => {
                // Se o ambiente da nuvem tiver fotos salvas no celular, recoloca elas
                if (fotosLocais[ambNuvem.id]) {
                    ambNuvem.fotos = fotosLocais[ambNuvem.id];
                } else {
                    ambNuvem.fotos = ambNuvem.fotos || [];
                }
                return ambNuvem;
            });
            changed = true;
        }
        
        // 2. Sincroniza o resto dos dados
        if (dataNuvem.divergencias) { this.data.divergencias = dataNuvem.divergencias; changed = true; }
        if (dataNuvem.vistoria) { this.data.vistoria = dataNuvem.vistoria; changed = true; }
        if (dataNuvem.marcenaria) { this.data.marcenaria = dataNuvem.marcenaria; changed = true; }
        if (dataNuvem.checklist) { this.data.checklist = dataNuvem.checklist; changed = true; }
        if (dataNuvem.plantaPins) { this.data.plantaPins = dataNuvem.plantaPins; changed = true; }

        // 3. Atualiza a tela e salva no celular
        if (changed) {
            localStorage.setItem('vistoriaAppData', JSON.stringify(this.data));
            this.renderAll(); 
            this.updateSaveStatus('Sincronizado', 'saved');
            
            if (showToast) this.showToast("Dados atualizados", 'success');
        }
    },

    updateSaveStatus(text, className) {
        const el = document.getElementById('save-status');
        if (el) { el.textContent = text; el.className = `status-badge ${className}`; }
    },

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
        if (viewName === 'vistoria') this.renderVistoriaPage();
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
    switchTabRelatorio(tabId, event) {
        this.currentRelatorio = tabId;
        document.querySelectorAll('#view-relatorio .tab-btn').forEach(el => el.classList.remove('active'));
        if (event && event.target) event.target.classList.add('active');
        this.renderRelatorio();
    },

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
                mini.innerHTML = `<div class="mini-nome">${amb.nome}</div><div class="mini-sub">${amb.comp && amb.larg ? (amb.comp * amb.larg).toFixed(1) + ' m²' : 'Sem medidas'}</div>`;
                grid.appendChild(mini);
            });
        }

        let vistOk = 0, vistDefeito = 0, vistPendente = 0;
        const VIST = this.getChecklistVistoria();
        Object.keys(VIST.ambientes).forEach(tipo => {
            VIST.ambientes[tipo].sections.forEach(sec => {
                sec.itens.forEach((item, idx) => {
                    const key = `${tipo}:${sec.titulo}:${idx}`;
                    const st = (this.data.vistoria.ambientes || {})[key]?.status;
                    if (st === 'ok') vistOk++;
                    else if (st === 'defeito') vistDefeito++;
                    else vistPendente++;
                });
            });
        });
        const elOk = document.getElementById('dash-vist-ok');
        const elDef = document.getElementById('dash-vist-defeito');
        const elPend = document.getElementById('dash-vist-pendente');
        if (elOk) elOk.textContent = vistOk;
        if (elDef) elDef.textContent = vistDefeito;
        if (elPend) elPend.textContent = vistPendente;
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
            const area = (amb.comp && amb.larg) ? (amb.comp * amb.larg).toFixed(2) : '--';
            const status = this.ambStatus(amb);
            const statusIcon = status === 'verde' ? '✓' : status === 'amarelo' ? '⏳' : '!';
            
            const div = document.createElement('div');
            div.className = 'amb-card-premium';
            // O clique no card abre a ficha
            div.onclick = () => this.openAmbiente(amb.id);
            
            div.innerHTML = `
                <div class="amb-icon-box ${status}">${statusIcon}</div>
                <div class="amb-info">
                    <div class="amb-title-row">
                        <strong>${amb.nome}</strong>
                        <span class="amb-area-badge">${area} m²</span>
                    </div>
                    <div class="amb-details-text">
                        ${amb.comp || '?'} x ${amb.larg || '?'} m • ${amb.paredes?.length || 0} paredes
                    </div>
                </div>
                <button class="amb-options-btn" onclick="app.openAmbienteOptions(event, '${amb.id}')">⋮</button>
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
                <div class="list-item-header"><span>${chk.texto}</span>
                <select onchange="app.updateChecklist('${chk.id}', this.value)" class="status-select">
                    <option value="pendente" ${chk.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="medido" ${chk.status === 'medido' ? 'selected' : ''}>Medido</option>
                    <option value="conferido" ${chk.status === 'conferido' ? 'selected' : ''}>Conferido</option>
                    <option value="na" ${chk.status === 'na' ? 'selected' : ''}>N/A</option>
                </select></div>`;
            container.appendChild(div);
        });
    },

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
        const nome = prompt("Nome do novo ambiente:", ""); // Deixei vazio
        if (!nome || nome.trim() === '') return;
        this.data.ambientes.push({ id: Date.now().toString(), nome: nome.trim(), comp: null, larg: null, peDireito: null, paredes: [], elementos: [], fotos: [], checklistCtx: {} });
        this.saveLocal(); this.syncToFirebase();
        this.renderAmbientes(); this.renderDashboard();
        this.showToast("Ambiente adicionado", 'success'); this.haptic('medium');
    },

        openAmbienteOptions(event, id) {
        event.stopPropagation(); // Evita que abra a ficha ao clicar nos 3 pontinhos
        const amb = this.data.ambientes.find(a => a.id === id);
        if (!amb) return;

        let modal = document.getElementById('amb-options-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'amb-options-modal';
            modal.className = 'action-sheet-overlay';
            modal.onclick = (e) => { if (e.target === modal) this.closeAmbienteOptions(); };
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="action-sheet">
                <h3>${amb.nome}</h3>
                <button class="action-btn" onclick="app.editAmbiente('${amb.id}')">
                    ✏️ Editar Nome
                </button>
                <button class="action-btn danger" onclick="app.deleteAmbiente('${amb.id}')">
                    🗑️ Excluir Ambiente
                </button>
                <button class="action-btn cancel" onclick="app.closeAmbienteOptions()">Cancelar</button>
            </div>
        `;
        modal.classList.add('active');
        this.haptic('light');
    },

    closeAmbienteOptions() {
        const modal = document.getElementById('amb-options-modal');
        if (modal) modal.classList.remove('active');
    },

    editAmbiente(id) {
        this.closeAmbienteOptions();
        const amb = this.data.ambientes.find(a => a.id === id);
        if (!amb) return;
        
        const novoNome = prompt("Novo nome do ambiente:", amb.nome);
        if (novoNome && novoNome.trim() !== '') {
            amb.nome = novoNome.trim();
            this.saveLocal();
            this.syncToFirebase();
            this.renderAmbientes();
            this.renderDashboard();
            this.showToast("Nome atualizado", 'success');
            this.haptic('medium');
        }
    },

    deleteAmbiente(id) {
        this.closeAmbienteOptions();
        const amb = this.data.ambientes.find(a => a.id === id);
        if (!amb) return;
        
        if (!confirm(`Tem certeza que deseja excluir o ambiente "${amb.nome}"?\n\nTodas as paredes, fotos e elementos dele serão apagados permanentemente.`)) return;
        
        this.data.ambientes = this.data.ambientes.filter(a => a.id !== id);
        // Remove pins associados a este ambiente na planta
        this.data.plantaPins = this.data.plantaPins.filter(p => p.ambienteId !== id);
        
        this.saveLocal();
        this.syncToFirebase();
        this.renderAmbientes();
        this.renderDashboard();
        this.showToast("Ambiente excluído", 'warning');
        this.haptic('heavy');
    },
    
    saveAmbienteDimensoes() {
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        amb.comp = parseFloat(document.getElementById('amb-comprimento').value) || null;
        amb.larg = parseFloat(document.getElementById('amb-largura').value) || null;
        amb.peDireito = parseFloat(document.getElementById('amb-pe-direito').value) || null;
        this.calcArea(amb); this.saveLocal(); this.syncToFirebase(); this.haptic('light');
    },
    
    calcArea(amb) {
        const el = document.getElementById('amb-area-calc');
        if (!el) return;
        if (amb.comp && amb.larg) el.textContent = `${(amb.comp * amb.larg).toFixed(2)} m²`;
        else el.textContent = '-- m²';
    },

    addParede() {
        const nomeEl = document.getElementById('parede-nome');
        const compEl = document.getElementById('parede-comp');
        const altEl = document.getElementById('parede-alt');
        if (!nomeEl || !compEl || !altEl) return;
        const nome = nomeEl.value.trim();
        const comp = parseFloat(compEl.value);
        const alt = parseFloat(altEl.value);
        if (!nome || !comp || !alt) return this.showToast("Preencha todos os campos.", 'warning');
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        if (!amb.paredes) amb.paredes = [];
        amb.paredes.push({ id: Date.now().toString(), nome, comp, alt });
        nomeEl.value = ''; compEl.value = ''; altEl.value = '';
        this.saveLocal(); this.syncToFirebase();
        this.renderParedes(amb); this.populateParedeSelect(amb);
        this.showToast("Parede adicionada", 'success'); this.haptic('medium');
    },
    
    renderParedes(amb) {
        const container = document.getElementById('paredes-list');
        if (!container) return;
        container.innerHTML = '';
        if (!amb.paredes || amb.paredes.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhuma parede cadastrada.</p>'; return; }
        amb.paredes.forEach(p => {
            const areaBruta = (p.comp * p.alt).toFixed(2);
            const elementosParede = (amb.elementos || []).filter(e => e.paredeId === p.id);
            let areaVaos = 0;
            elementosParede.forEach(e => { if (e.larg && e.alt) areaVaos += (e.larg * e.alt); });
            const areaLiquida = (areaBruta - areaVaos).toFixed(2);
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-header"><strong>${p.nome}</strong><button class="btn-icon-danger" onclick="app.removeParede('${p.id}')">Excluir</button></div>
                <div class="list-item-details">${p.comp}m x ${p.alt}m • Área Bruta: ${areaBruta} m²<br>Vãos: ${areaVaos.toFixed(2)} m² • <strong>Área Líquida: ${areaLiquida} m²</strong></div>`;
            container.appendChild(div);
        });
    },
    
    removeParede(id) {
        if (!confirm("Excluir esta parede?")) return;
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        amb.paredes = amb.paredes.filter(p => p.id !== id);
        amb.elementos = (amb.elementos || []).filter(e => e.paredeId !== id);
        this.saveLocal(); this.syncToFirebase();
        this.renderParedes(amb); this.renderElementos(amb); this.populateParedeSelect(amb);
        this.showToast("Parede removida", 'warning'); this.haptic('medium');
    },

    populateParedeSelect(amb) {
        const select = document.getElementById('elem-parede-select');
        if (!select) return;
        select.innerHTML = '<option value="">Selecione...</option>';
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
        this.showToast("Elemento adicionado", 'success'); this.haptic('medium');
    },
    
    renderElementos(amb) {
        const container = document.getElementById('elementos-list');
        if (!container) return;
        container.innerHTML = '';
        if (!amb.elementos || amb.elementos.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhum elemento.</p>'; return; }
        const tiposFormatados = { janela: '🪟 Janela', porta: '🚪 Porta', tomada: '🔌 Tomada', interruptor: '💡 Interruptor', ponto_hidraulico: '🚰 Hidráulica', ponto_gas: '🔥 Gás', ar_condicionado: '❄️ Ar-Cond.' };
        amb.elementos.forEach(e => {
            const parede = amb.paredes.find(p => p.id === e.paredeId);
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-item-header"><strong>${tiposFormatados[e.tipo] || e.tipo}</strong><button class="btn-icon-danger" onclick="app.removeElemento('${e.id}')">Excluir</button></div>
                <div class="list-item-details">Parede: ${parede ? parede.nome : '—'}<br>${e.larg ? `Larg: ${e.larg}m ` : ''}${e.alt ? `Alt: ${e.alt}m ` : ''}${e.peitoril ? `Peitoril: ${e.peitoril}m` : ''}</div>`;
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
        this.showToast("Elemento removido", 'warning'); this.haptic('medium');
    },

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
        this.showToast("Foto adicionada", 'success'); this.haptic('medium');
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
        (amb.fotos || []).forEach(foto => { const img = document.createElement('img'); img.src = foto; container.appendChild(img); });
    },
    
    updateChecklist(id, newStatus) {
        const item = this.data.checklist.find(c => c.id === id);
        if (item) { item.status = newStatus; this.saveLocal(); this.syncToFirebase(); this.renderDashboard(); this.haptic('light'); }
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
        this.showToast("Backup exportado", 'success'); this.haptic('medium');
    },

    renderChecklistContextual() {
        const container = document.getElementById('ctx-checklist-container');
        if (!container) return;
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) { container.innerHTML = '<p class="empty-msg">Nenhum ambiente aberto.</p>'; return; }
        const tipo = detectTipoAmbiente(amb.nome);
        const config = CHECKLISTS_CONTEXTUAIS[tipo];
        if (!amb.checklistCtx) amb.checklistCtx = {};
        const ctx = amb.checklistCtx;
        let html = `<div class="card"><h3>${config.label}</h3></div>`;
        config.sections.forEach(sec => {
            html += `<div class="ctx-section-title">${sec.titulo}</div>`;
            sec.itens.forEach((item, idx) => {
                const key = `${tipo}:${sec.titulo}:${idx}`;
                const status = ctx[key] || 'pendente';
                html += `<div class="ctx-item"><span class="ctx-label">${item}</span>
                    <select onchange="app.updateChecklistCtx('${key}', this.value)">
                        <option value="pendente" ${status === 'pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="ok" ${status === 'ok' ? 'selected' : ''}>OK</option>
                        <option value="medido" ${status === 'medido' ? 'selected' : ''}>Medido</option>
                        <option value="na" ${status === 'na' ? 'selected' : ''}>N/A</option>
                    </select></div>`;
            });
        });
        container.innerHTML = html;
    },
    
    updateChecklistCtx(key, value) {
        const amb = this.data.ambientes.find(a => a.id === this.currentAmbienteId);
        if (!amb) return;
        if (!amb.checklistCtx) amb.checklistCtx = {};
        amb.checklistCtx[key] = value;
        this.saveLocal(); this.syncToFirebase(); this.haptic('light');
    },

    renderMarcenariaPage() {
        const select = document.getElementById('marc-ambiente');
        if (select) { select.innerHTML = '<option value="">— Selecione —</option>'; this.data.ambientes.forEach(a => { select.innerHTML += `<option value="${a.id}">${a.nome}</option>`; }); }
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
        if (!nome) return this.showToast("Informe o nome.", 'warning');
        if (!largura || !profundidade) return this.showToast("Informe largura e profundidade.", 'warning');
        if (!this.data.marcenaria) this.data.marcenaria = [];
        this.data.marcenaria.push({ id: Date.now().toString(), ambienteId: ambId, nome, largura, profundidade, altura: altura || null, folga, modelo, obs, dataRegistro: new Date().toISOString().split('T')[0] });
        this.saveLocal(); this.syncToFirebase();
        ['marc-nome','marc-largura','marc-profundidade','marc-altura','marc-modelo','marc-obs'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        this.renderMarcenaria();
        this.showToast("Móvel adicionado", 'success'); this.haptic('medium');
    },
    
    marcAvaliar(item) {
        const amb = this.data.ambientes.find(a => a.id === item.ambienteId);
        if (!amb) return { status: 'sem-medida', msg: 'Ambiente não encontrado.' };
        if (!amb.comp || !amb.larg) return { status: 'sem-medida', msg: 'O ambiente não tem medidas registradas.' };
        const folgaM = (item.folga || 5) / 100;
        const compDisp = Math.max(amb.comp, amb.larg);
        const largDisp = Math.min(amb.comp, amb.larg);
        const largNec = item.largura + folgaM;
        const profNec = item.profundidade + folgaM;
        if (largNec <= largDisp && profNec <= compDisp) return { status: 'cabe', msg: `✓ Parece caber.` };
        if (largNec > largDisp && profNec > compDisp) return { status: 'nao-cabe', msg: `✗ Não cabe.` };
        return { status: 'apertado', msg: `⚠ Apertado.` };
    },
    
    renderMarcenaria() {
        const container = document.getElementById('marc-list');
        const totalEl = document.getElementById('marc-total');
        if (!container) return;
        if (!this.data.marcenaria) this.data.marcenaria = [];
        if (totalEl) totalEl.textContent = this.data.marcenaria.length;
        if (this.data.marcenaria.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhum item.</p>'; return; }
        container.innerHTML = '';
        const sorted = this.data.marcenaria.slice().sort((a, b) => (this.data.ambientes.find(x => x.id === a.ambienteId)?.nome || '').localeCompare(this.data.ambientes.find(x => x.id === b.ambienteId)?.nome || ''));
        let lastAmb = null;
        sorted.forEach(item => {
            const amb = this.data.ambientes.find(a => a.id === item.ambienteId);
            const ambNome = amb ? amb.nome : '—';
            const av = this.marcAvaliar(item);
            if (ambNome !== lastAmb) { const t = document.createElement('div'); t.className = 'ctx-section-title'; t.textContent = ambNome; container.appendChild(t); lastAmb = ambNome; }
            const badgeLabel = { cabe: 'Cabe', apertado: 'Apertado', 'nao-cabe': 'Não Cabe', 'sem-medida': 'Sem Medida' }[av.status];
            const alertaClass = { cabe: 'ok', apertado: 'atencao', 'nao-cabe': 'erro', 'sem-medida': '' }[av.status];
            const card = document.createElement('div');
            card.className = `list-item marc-card status-${av.status === 'nao-cabe' ? 'nao-cabe' : av.status === 'apertado' ? 'apertado' : av.status === 'cabe' ? 'cabe' : 'sem-medida'}`;
            card.innerHTML = `
                <div class="marc-header"><div><div class="marc-nome">${item.nome}</div>${item.modelo ? `<div class="marc-sub">${item.modelo}</div>` : ''}</div><span class="marc-badge ${av.status}">${badgeLabel}</span></div>
                <div class="marc-dims"><span>Larg: <strong>${item.largura} m</strong></span><span>Prof: <strong>${item.profundidade} m</strong></span>${item.altura ? `<span>Alt: <strong>${item.altura} m</strong></span>` : ''}<span>Folga: <strong>${item.folga} cm</strong></span></div>
                ${item.obs ? `<div class="list-item-details">${item.obs}</div>` : ''}
                ${alertaClass ? `<div class="marc-alerta ${alertaClass}">${av.msg}</div>` : ''}
                <div class="marc-actions"><button class="btn-delete" onclick="app.marcExcluir('${item.id}')">Excluir</button></div>`;
            container.appendChild(card);
        });
    },
    
    marcExcluir(id) {
        if (!confirm("Excluir?")) return;
        this.data.marcenaria = this.data.marcenaria.filter(m => m.id !== id);
        this.saveLocal(); this.syncToFirebase();
        this.renderMarcenaria();
        this.showToast("Item removido", 'warning'); this.haptic('medium');
    },

    renderDivergenciasPage() {
        const ambSelect = document.getElementById('div-ambiente');
        const filterAmb = document.getElementById('div-filter-ambiente');
        if (ambSelect) { ambSelect.innerHTML = '<option value="">— Selecione —</option>'; this.data.ambientes.forEach(a => { ambSelect.innerHTML += `<option value="${a.id}">${a.nome}</option>`; }); }
        if (filterAmb) {
            const currentVal = filterAmb.value;
            filterAmb.innerHTML = '<option value="all">Todos</option>';
            this.data.ambientes.forEach(a => { filterAmb.innerHTML += `<option value="${a.id}">${a.nome}</option>`; });
            filterAmb.value = currentVal || 'all';
        }
        this.div.fotoTemp = null;
        const preview = document.getElementById('div-foto-preview'); if (preview) preview.innerHTML = '';
        const outroGroup = document.getElementById('div-elemento-outro-group'); if (outroGroup) outroGroup.style.display = 'none';
        const calcBox = document.getElementById('div-calculo-box'); if (calcBox) calcBox.style.display = 'none';
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
        select.innerHTML += `<option value="__outro__">✏️ Outro</option>`;
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
        pctEl.textContent = `${sinal}${pct.toFixed(2)}%`;
    },
    
    async divFotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const compressed = await this.compressImage(file, 800, 0.7);
        this.div.fotoTemp = compressed;
        const preview = document.getElementById('div-foto-preview');
        if (preview) preview.innerHTML = `<img src="${compressed}" alt="Foto">`;
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
        } else { return this.showToast("Selecione o elemento.", 'warning'); }
        const planta = parseFloat(document.getElementById('div-medida-planta').value) || null;
        const real = parseFloat(document.getElementById('div-medida-real').value) || null;
        const descricao = document.getElementById('div-descricao').value.trim();
        const pergunta = document.getElementById('div-pergunta').value.trim();
        const prioridade = document.getElementById('div-prioridade').value;
        const status = document.getElementById('div-status').value;
        if (!planta || !real) return this.showToast("Informe as medidas.", 'warning');
        let dif = null, pct = null;
        if (planta && real && planta !== 0) { dif = real - planta; pct = (dif / planta) * 100; }
        this.data.divergencias.push({ id: Date.now().toString(), ambienteId: ambId, ambienteNome: amb.nome, elemento: elementoNome, medidaPlanta: planta, medidaReal: real, diferenca: dif, diferencaPercentual: pct, descricao, pergunta, prioridade, status, foto: this.div.fotoTemp || null, dataRegistro: new Date().toISOString().split('T')[0] });
        this.saveLocal(); this.syncToFirebase();
        this.divLimparFormulario();
        this.renderDivergencias(); this.renderDashboard(); this.updateDivTotal();
        this.showToast("Divergência registrada", 'success'); this.haptic('heavy');
    },
    
    divLimparFormulario() {
        ['div-elemento-outro', 'div-medida-planta', 'div-medida-real', 'div-descricao', 'div-pergunta'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
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
        if (list.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhuma divergência registrada.</p>'; return; }
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
                <div class="div-header"><div><div class="div-title">${d.elemento}</div><div class="div-sub">${d.ambienteNome} • Prioridade ${prioLabel[d.prioridade]}</div></div><span class="div-status-badge status-${d.status}">${statusLabel[d.status]}</span></div>
                <div class="div-diff"><span>Planta: <strong>${d.medidaPlanta.toFixed(2)} m</strong></span><span>Real: <strong>${d.medidaReal.toFixed(2)} m</strong></span><span class="div-pct">${sinal}${dif.toFixed(3)} m (${sinal}${pct.toFixed(1)}%)</span></div>
                ${d.descricao ? `<div class="list-item-details" style="margin-top:6px;"><strong>Descrição:</strong> ${d.descricao}</div>` : ''}
                ${d.foto ? `<img class="div-foto" src="${d.foto}" alt="Foto">` : ''}
                <div class="div-actions"><button class="btn-status" onclick="app.divMudarStatus('${d.id}')">Mudar Status</button><button class="btn-delete" onclick="app.divExcluir('${d.id}')">Excluir</button></div>`;
            container.appendChild(card);
        });
    },
    
    divMudarStatus(id) {
        const d = this.data.divergencias.find(x => x.id === id);
        if (!d) return;
        const opts = ['aberta', 'analise', 'resolvida', 'aceita'];
        d.status = opts[(opts.indexOf(d.status) + 1) % opts.length];
        this.saveLocal(); this.syncToFirebase();
        this.renderDivergencias(); this.renderDashboard(); this.haptic('medium');
    },
    
    divExcluir(id) {
        if (!confirm("Excluir esta divergência?")) return;
        this.data.divergencias = this.data.divergencias.filter(d => d.id !== id);
        this.saveLocal(); this.syncToFirebase();
        this.renderDivergencias(); this.renderDashboard();
        this.showToast("Divergência excluída", 'warning'); this.haptic('heavy');
    },

    renderPlanta() {
        const empty = document.getElementById('planta-empty');
        const stage = document.getElementById('planta-stage');
        const img = document.getElementById('planta-img');
        if (!empty || !stage || !img) return;
        if (this.data.plantaImagem) {
            empty.style.display = 'none'; stage.style.display = 'block';
            if (img.src !== this.data.plantaImagem) img.src = this.data.plantaImagem;
            this.plantaReset(); this.renderPins();
        } else { empty.style.display = 'flex'; stage.style.display = 'none'; }
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
            div.style.left = `${pin.x}%`; div.style.top = `${pin.y}%`;
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
            if (e.touches.length === 1) { self.planta.isPanning = true; self.planta.lastTouchX = e.touches[0].clientX; self.planta.lastTouchY = e.touches[0].clientY; }
            else if (e.touches.length === 2) { self.planta.isPinching = true; self.planta.isPanning = false; self.planta.lastTouchDist = self._dist(e.touches[0], e.touches[1]); }
        }, { passive: false });
        viewer.addEventListener('touchmove', (e) => {
            if (self.planta.mode === 'addpin') return;
            e.preventDefault();
            if (self.planta.isPinching && e.touches.length === 2) {
                const dist = self._dist(e.touches[0], e.touches[1]);
                const ratio = dist / self.planta.lastTouchDist;
                self.planta.scale = Math.min(Math.max(self.planta.scale * ratio, self.planta.minScale), self.planta.maxScale);
                self.planta.lastTouchDist = dist; self.applyTransform();
            } else if (self.planta.isPanning && e.touches.length === 1) {
                const dx = e.touches[0].clientX - self.planta.lastTouchX;
                const dy = e.touches[0].clientY - self.planta.lastTouchY;
                self.planta.tx += dx; self.planta.ty += dy;
                self.planta.lastTouchX = e.touches[0].clientX; self.planta.lastTouchY = e.touches[0].clientY;
                self.applyTransform();
            }
        }, { passive: false });
        viewer.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) { self.planta.isPanning = false; self.planta.isPinching = false; }
            else if (e.touches.length === 1) { self.planta.isPinching = false; self.planta.isPanning = true; self.planta.lastTouchX = e.touches[0].clientX; self.planta.lastTouchY = e.touches[0].clientY; }
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
        viewer.addEventListener('mousedown', (e) => { if (self.planta.mode === 'addpin') return; self.planta.isPanning = true; self.planta.lastTouchX = e.clientX; self.planta.lastTouchY = e.clientY; });
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
    _dist(t1, t2) { const dx = t1.clientX - t2.clientX; const dy = t1.clientY - t2.clientY; return Math.sqrt(dx*dx + dy*dy); },
    async handlePlantaUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const compressed = await this.compressImage(file, 2000, 0.8);
        this.data.plantaImagem = compressed;
        this.saveLocal(); this.installPlantaGestures(); this.renderPlanta();
        event.target.value = '';
        this.showToast("Planta importada", 'success'); this.haptic('medium');
    },
    plantaTrocarImagem() { const input = document.getElementById('planta-input'); if (input) input.click(); },
    plantaStartAddPin() {
        if (!this.data.plantaImagem) return this.showToast("Importe a planta primeiro.", 'warning');
        this.planta.mode = 'addpin';
        const hint = document.getElementById('planta-hint');
        if (hint) hint.classList.add('active');
        this.haptic('light');
    },
    plantaCancelPin() { this.planta.mode = 'view'; const hint = document.getElementById('planta-hint'); if (hint) hint.classList.remove('active'); },
    plantaLimparPins() {
        if (!confirm("Remover todos os pins da planta?")) return;
        this.data.plantaPins = [];
        this.saveLocal(); this.syncToFirebase(); this.renderPins();
        this.showToast("Pins removidos", 'warning'); this.haptic('heavy');
    },
    openPinModal(xPct, yPct) {
        this.planta.pendingPin = { x: xPct, y: yPct };
        this.plantaCancelPin();
        let modal = document.getElementById('pin-modal');
        if (!modal) { modal = document.createElement('div'); modal.id = 'pin-modal'; modal.className = 'pin-modal-overlay'; document.body.appendChild(modal); }
        const options = this.data.ambientes.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
        modal.innerHTML = `<div class="pin-modal"><h3>📍 Associar Pin a um Ambiente</h3><div class="input-group"><label>Ambiente</label><select id="pin-ambiente-select">${options}</select></div><div class="pin-modal-actions"><button class="btn btn-secondary" onclick="app.closePinModal()">Cancelar</button><button class="btn btn-primary" onclick="app.confirmPin()">Adicionar</button></div></div>`;
        modal.classList.add('active');
    },
    closePinModal() { const modal = document.getElementById('pin-modal'); if (modal) modal.classList.remove('active'); this.planta.pendingPin = null; },
    confirmPin() {
        const select = document.getElementById('pin-ambiente-select');
        if (!select || !this.planta.pendingPin) return;
        this.data.plantaPins.push({ id: Date.now().toString(), x: this.planta.pendingPin.x, y: this.planta.pendingPin.y, ambienteId: select.value });
        this.saveLocal(); this.syncToFirebase(); this.renderPins(); this.closePinModal();
        this.showToast("Pin adicionado", 'success'); this.haptic('medium');
    },

    openQuickMeasure() {
        this.qm = { tipo: null, ambienteId: null, paredeId: null, count: 0 };
        const ambSelect = document.getElementById('qm-ambiente');
        if (!ambSelect) return;
        ambSelect.innerHTML = '<option value="">Selecione...</option>';
        this.data.ambientes.forEach(a => { ambSelect.innerHTML += `<option value="${a.id}">${a.nome}</option>`; });
        const details = document.getElementById('qm-step-details'); if (details) details.style.display = 'none';
        const countEl = document.getElementById('qm-count'); if (countEl) countEl.textContent = '0';
        document.querySelectorAll('.qm-type-btn').forEach(b => b.classList.remove('selected'));
        const modal = document.getElementById('quick-measure-modal'); if (modal) modal.classList.add('active');
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
        const modal = document.getElementById('quick-measure-modal'); if (modal) modal.classList.remove('active');
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
        campoBGroup.style.display = 'block'; campoCGroup.style.display = 'block';
        switch(tipo) {
            case 'parede': labelA.textContent = 'Comprimento (m)'; labelB.textContent = 'Altura (m)'; campoCGroup.style.display = 'none'; break;
            case 'janela': case 'porta': labelA.textContent = 'Largura (m)'; labelB.textContent = 'Altura (m)'; break;
            case 'tomada': case 'interruptor': case 'ponto_hidraulico': case 'ponto_gas': labelA.textContent = 'Altura do Piso (m)'; campoBGroup.style.display = 'none'; campoCGroup.style.display = 'none'; break;
            case 'ar_condicionado': labelA.textContent = 'Altura (m)'; campoBGroup.style.display = 'none'; campoCGroup.style.display = 'none'; break;
        }
    },
    qmLoadParedes() {
        const ambSelect = document.getElementById('qm-ambiente'); if (!ambSelect) return;
        const ambId = ambSelect.value; this.qm.ambienteId = ambId;
        const paredeSelect = document.getElementById('qm-parede'); if (!paredeSelect) return;
        paredeSelect.innerHTML = '<option value="">Selecione...</option>';
        if (!ambId) return;
        const amb = this.data.ambientes.find(a => a.id === ambId); if (!amb) return;
        (amb.paredes || []).forEach(p => { paredeSelect.innerHTML += `<option value="${p.id}">${p.nome}</option>`; });
    },
    qmSave() {
        if (!this.qm.tipo) return this.showToast("Escolha o tipo.", 'warning');
        if (!this.qm.ambienteId) return this.showToast("Escolha o ambiente.", 'warning');
        const amb = this.data.ambientes.find(a => a.id === this.qm.ambienteId); if (!amb) return;
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
            amb.elementos.push({ id: Date.now().toString(), paredeId, tipo: this.qm.tipo, larg: valorA, alt: valorB, peitoril: valorC });
        }
        this.saveLocal(); this.syncToFirebase();
        this.qm.count++;
        const counter = document.getElementById('qm-count'); if (counter) counter.textContent = this.qm.count;
        const counterBox = document.querySelector('.qm-counter');
        if (counterBox) { counterBox.classList.remove('flash'); void counterBox.offsetWidth; counterBox.classList.add('flash'); }
        const a = document.getElementById('qm-valor-a'); const b = document.getElementById('qm-valor-b'); const c = document.getElementById('qm-valor-c');
        if (a) { a.value = ''; a.focus(); } if (b) b.value = ''; if (c) c.value = '';
        this.haptic('light');
    },

    getChecklistVistoria() {
        return {
            preparacao: { label: "Preparação", itens: [
                "Levar o Memorial Descritivo e as plantas (arquitetura, elétrica e hidráulica)",
                "Levar carregador de celular para testar todas as tomadas",
                "Levar régua ou trena para conferir medidas",
                "Levar cabo de vassoura para bater nos pisos e identificar som oco",
                "Levar lanterna para olhar dentro de shafts e cantos escuros",
                "Levar fita crepe ou adesivos para marcar defeitos no local",
                "Levar celular carregado para fotos",
                "Agendar a vistoria com a construtora e ter um representante presente",
                "Verificar se a unidade está com as chaves e a documentação"
            ]},
            ambientes: {
                sala: { label: "Sala / Estar / Jantar", sections: [
                    { titulo: "Pisos e Paredes", itens: ["Caminhar por todo o piso e verificar se há peças soltas, desníveis ou som oco","Verificar se há trincas, rachaduras ou manchas nas paredes","Passar a mão nas paredes para sentir irregularidades na pintura","Verificar se os rodapés estão bem fixados e sem falhas","Verificar se o piso está nivelado com o piso dos ambientes vizinhos (soleiras)"]},
                    { titulo: "Esquadrias e Portas", itens: ["Abrir e fechar a porta de entrada, verificando se desliza suavemente","Verificar se a fechadura funciona bem","Abrir e fechar as janelas, verificando se deslizam suavemente","Verificar se os vidros não estão trincados ou lascados","Verificar se as borrachas de vedação das janelas estão íntegras"]},
                    { titulo: "Elétrica", itens: ["Testar TODAS as tomadas com o carregador de celular","Testar TODOS os interruptores","Verificar se os espelhos (placas) das tomadas e interruptores estão bem fixados","Verificar se há pontos de TV e internet previstos no memorial","Verificar se o ponto de ar-condicionado está previsto e acessível"]},
                    { titulo: "Teto", itens: ["Verificar se há manchas de infiltração no teto","Verificar se o teto está nivelado","Verificar se há pontos de iluminação previstos"]}
                ]},
                cozinha: { label: "Cozinha", sections: [
                    { titulo: "Hidráulica", itens: ["Abrir a torneira da pia por 1-2 minutos e verificar vazamentos","Verificar se o escoamento da pia é rápido e não empoça água","Verificar se há ponto de água e esgoto para a máquina de lavar (se previsto)","Verificar se há ponto de filtro de água (se previsto)","Verificar se há registro de gaveta acessível"]},
                    { titulo: "Elétrica", itens: ["Testar TODAS as tomadas (inclusive geladeira, forno, micro-ondas)","Testar TODOS os interruptores","Verificar se há tomadas na bancada em quantidade suficiente","Verificar se há ponto de iluminação sob os armários (se previsto)"]},
                    { titulo: "Pisos, Paredes e Teto", itens: ["Bater nas paredes revestidas e verificar se há som oco","Verificar se há trincas nos revestimentos","Verificar se o piso está nivelado","Verificar se há manchas no teto","Verificar se o rejunte está completo e sem falhas"]},
                    { titulo: "Bancada e Armários", itens: ["Verificar se a bancada está bem fixada e sem trincas","Verificar se há espaço para a geladeira conforme o memorial","Verificar se há espaço para o fogão/cooktop","Verificar se há espaço para a coifa"]}
                ]},
                lavanderia: { label: "Área de Serviço / Lavanderia", sections: [
                    { titulo: "Hidráulica", itens: ["Abrir a torneira do tanque e verificar vazamentos","Verificar se o escoamento do tanque é rápido","Verificar se há ponto de água e esgoto para a máquina de lavar","Verificar se há registro acessível"]},
                    { titulo: "Elétrica", itens: ["Testar a tomada da máquina de lavar (com DR)","Testar a tomada da secadora (se previsto)","Testar TODOS os interruptores","Verificar se há ponto de iluminação funcionando"]},
                    { titulo: "Estrutural", itens: ["Verificar se há ventilação adequada (janela ou exaustão)","Verificar se há ponto para varal","Verificar se o piso está impermeabilizado e com caimento para o ralo","Verificar se há som oco nas paredes revestidas","Verificar se o ralo escoa bem e não tem odores"]}
                ]},
                banheiro: { label: "Banheiro / Lavabo", sections: [
                    { titulo: "Hidráulica", itens: ["Abrir a torneira do lavatório e verificar vazamentos","Abrir o chuveiro por 1-2 minutos e verificar vazamentos","Dar descarga e verificar se o fluxo é forte","Verificar se o escoamento do box é rápido e não empoça água","Verificar se o ralo fora do box escoa bem","Verificar se há registro de gaveta acessível"]},
                    { titulo: "Rejuntes e Revestimentos", itens: ["Bater levemente nos azulejos e verificar se há som oco","Verificar se o rejunte está completo e sem falhas","Verificar se há trincas nos revestimentos","Verificar se há manchas de umidade"]},
                    { titulo: "Louças e Metais", itens: ["Verificar se o vaso sanitário está bem fixado e sem folgas","Verificar se a cuba/lavatório está bem fixada","Verificar se as torneiras não estão frouxas ou manchadas","Verificar se o chuveiro/ducha está bem fixado","Verificar se o box está instalado corretamente (ou previsto)"]},
                    { titulo: "Porta e Elétrica", itens: ["Abrir e fechar a porta, verificando se não está emperrando","Testar a tomada do lavatório (com DR)","Testar o interruptor","Verificar se há ponto de exaustão/ventilação","Verificar se há ponto de iluminação funcionando"]}
                ]},
                quarto: { label: "Quarto / Suíte", sections: [
                    { titulo: "Pisos e Paredes", itens: ["Caminhar por todo o piso e verificar se há peças soltas ou som oco","Verificar se há trincas, rachaduras ou manchas nas paredes","Passar a mão nas paredes para sentir irregularidades na pintura","Verificar se os rodapés estão bem fixados","Verificar se o piso está nivelado com o corredor"]},
                    { titulo: "Esquadrias e Portas", itens: ["Abrir e fechar a porta, verificando se desliza suavemente","Abrir e fechar as janelas, verificando se deslizam suavemente","Verificar se os vidros não estão trincados","Verificar se as borrachas de vedação das janelas estão íntegras"]},
                    { titulo: "Elétrica", itens: ["Testar TODAS as tomadas (inclusive as das cabeceiras)","Testar TODOS os interruptores","Verificar se há ponto de TV (se previsto)","Verificar se há ponto de ar-condicionado (se previsto)"]},
                    { titulo: "Teto", itens: ["Verificar se há manchas de infiltração no teto","Verificar se o teto está nivelado","Verificar se há pontos de iluminação funcionando"]}
                ]},
                varanda: { label: "Varanda / Sacada", sections: [
                    { titulo: "Estrutural", itens: ["Verificar a altura e a fixação do guarda-corpo","Verificar se o piso da varanda tem o desnível correto em relação ao interior","Verificar se o ralo de escoamento está desobstruído e escoa bem","Verificar se a laje para condensadora está prevista e acessível"]},
                    { titulo: "Hidráulica e Gás", itens: ["Verificar se há ponto de água (se for gourmet)","Verificar se há ponto de esgoto (se for gourmet)","Verificar se há ponto de gás (se for churrasqueira)","Verificar se há registro acessível"]},
                    { titulo: "Elétrica", itens: ["Testar as tomadas (com DR, se área molhada)","Testar o interruptor","Verificar se há ponto de iluminação funcionando"]}
                ]},
                hall: { label: "Hall / Corredor", sections: [
                    { titulo: "Pisos e Paredes", itens: ["Caminhar por todo o piso e verificar se há peças soltas","Verificar se há trincas ou manchas nas paredes","Verificar se os rodapés estão bem fixados","Verificar se há soleiras nos acessos aos ambientes"]},
                    { titulo: "Elétrica", itens: ["Testar TODAS as tomadas","Testar TODOS os interruptores","Verificar se há ponto de iluminação funcionando"]},
                    { titulo: "Portas", itens: ["Abrir e fechar todas as portas dos ambientes","Verificar se as portas não estão emperrando","Verificar se os trincos encaixam bem"]}
                ]}
            }
        };
    },

    renderVistoriaPage() {
        this.renderVistoriaPreparacao();
        this.renderVistoriaAmbientes();
        this.renderVistoriaPendencias();
    },
    
    renderVistoriaPreparacao() {
        const container = document.getElementById('vist-prep-list');
        if (!container) return;
        const prep = this.data.vistoria.preparacao || {};
        const config = this.getChecklistVistoria().preparacao;
        let html = '';
        config.itens.forEach((item, idx) => {
            const done = prep[idx] === true;
            html += `<div class="vist-prep-item ${done ? 'done' : ''}"><input type="checkbox" id="prep_${idx}" ${done ? 'checked' : ''} onchange="app.vistTogglePreparacao(${idx}, this.checked)"><label for="prep_${idx}">${item}</label></div>`;
        });
        container.innerHTML = html;
    },
    
    vistTogglePreparacao(idx, checked) {
        if (!this.data.vistoria.preparacao) this.data.vistoria.preparacao = {};
        this.data.vistoria.preparacao[idx] = checked;
        this.saveLocal(); this.syncToFirebase();
        this.renderVistoriaPreparacao();
        this.haptic('light');
    },
    
    renderVistoriaAmbientes() {
        const container = document.getElementById('vist-ambientes-list');
        if (!container) return;
        const config = this.getChecklistVistoria().ambientes;
        const ambData = this.data.vistoria.ambientes || {};
        container.innerHTML = '';
        Object.keys(config).forEach(tipo => {
            const cfg = config[tipo];
            let total = 0, ok = 0, defeito = 0;
            cfg.sections.forEach(sec => {
                sec.itens.forEach((item, idx) => {
                    total++;
                    const key = `${tipo}:${sec.titulo}:${idx}`;
                    const st = ambData[key]?.status;
                    if (st === 'ok') ok++;
                    else if (st === 'defeito') defeito++;
                });
            });
            const status = defeito > 0 ? 'parcial' : (ok === total ? 'completo' : 'pendente');
            const statusLabel = defeito > 0 ? `${defeito} defeito(s)` : (ok === total ? 'Completo' : `${total - ok} pendente(s)`);
            const div = document.createElement('div');
            div.className = `list-item vist-amb-card status-${status}`;
            div.onclick = () => this.openVistoriaAmbiente(tipo);
            div.innerHTML = `<div class="vist-amb-header"><strong>${cfg.label}</strong><span class="badge" style="background:${status === 'completo' ? 'rgba(52,199,89,0.15)' : status === 'parcial' ? 'rgba(255,59,48,0.15)' : 'rgba(255,149,0,0.15)'}; color:${status === 'completo' ? '#1E8E3E' : status === 'parcial' ? '#C41E16' : '#B46100'}; font-size:0.7rem;">${statusLabel}</span></div><div class="vist-amb-sub">${ok} de ${total} itens verificados</div>`;
            container.appendChild(div);
        });
    },
    
    openVistoriaAmbiente(tipo) {
        this._currentVistTipo = tipo;
        const config = this.getChecklistVistoria().ambientes[tipo];
        if (!config) return;
        const nomeEl = document.getElementById('vist-amb-nome');
        if (nomeEl) nomeEl.textContent = config.label;
        const obsEl = document.getElementById('vist-amb-obs-geral');
        if (obsEl) obsEl.value = (this.data.vistoria.obsGeral || {})[tipo] || '';
        this.renderVistoriaRoteiro(tipo);
        this.navigate('vistoria-ambiente');
    },
    
    renderVistoriaRoteiro(tipo) {
        const container = document.getElementById('vist-amb-roteiro');
        if (!container) return;
        const config = this.getChecklistVistoria().ambientes[tipo];
        if (!config) return;
        const ambData = this.data.vistoria.ambientes || {};
        let html = '';
        config.sections.forEach(sec => {
            html += `<div class="vist-section-title">${sec.titulo}</div>`;
            sec.itens.forEach((item, idx) => {
                const key = `${tipo}:${sec.titulo}:${idx}`;
                const entry = ambData[key] || {};
                const status = entry.status || null;
                const obs = entry.obs || '';
                const fotos = entry.fotos || [];
                const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
                let cls = '';
                if (status === 'ok') cls = 'status-ok';
                else if (status === 'defeito') cls = 'status-defeito';
                else if (status === 'na') cls = 'status-na';
                html += `
                    <div class="vist-item ${cls}" id="vist-item-${safeKey}">
                        <div class="vist-item-header">
                            <span class="vist-item-desc">${item}</span>
                            <div class="vist-item-actions">
                                <button class="vist-btn-status ${status === 'ok' ? 'selected-ok' : ''}" onclick="app.vistSetStatus('${key}', 'ok')" title="OK">✓</button>
                                <button class="vist-btn-status ${status === 'defeito' ? 'selected-defeito' : ''}" onclick="app.vistSetStatus('${key}', 'defeito')" title="Com defeito">✗</button>
                                <button class="vist-btn-status ${status === 'na' ? 'selected-na' : ''}" onclick="app.vistSetStatus('${key}', 'na')" title="Não se aplica">—</button>
                            </div>
                        </div>
                        <div class="vist-item-detalhe ${status === 'defeito' ? 'active' : ''}" id="vist-det-${safeKey}">
                            <textarea placeholder="Descreva o defeito..." onchange="app.vistSetObs('${key}', this.value)">${obs}</textarea>
                            <input type="file" accept="image/*" capture="environment" id="vist-foto-${safeKey}" style="display:none" onchange="app.vistAddFoto('${key}', event)">
                            <button class="btn btn-secondary" onclick="document.getElementById('vist-foto-${safeKey}').click()" style="padding:8px; font-size:0.8rem; margin-bottom:8px;">📷 Adicionar Foto</button>
                            <div class="vist-item-foto-preview">${fotos.map(f => `<img src="${f}" alt="Foto">`).join('')}</div>
                        </div>
                    </div>`;
            });
        });
        container.innerHTML = html;
    },
    
    vistSetStatus(key, status) {
        if (!this.data.vistoria.ambientes) this.data.vistoria.ambientes = {};
        if (!this.data.vistoria.ambientes[key]) this.data.vistoria.ambientes[key] = {};
        this.data.vistoria.ambientes[key].status = status;
        this.saveLocal(); this.syncToFirebase();
        this.renderVistoriaRoteiro(this._currentVistTipo);
        this.renderVistoriaAmbientes(); this.renderDashboard();
        this.haptic('light');
    },
    
    vistSetObs(key, obs) {
        if (!this.data.vistoria.ambientes) this.data.vistoria.ambientes = {};
        if (!this.data.vistoria.ambientes[key]) this.data.vistoria.ambientes[key] = {};
        this.data.vistoria.ambientes[key].obs = obs;
        this.saveLocal(); this.syncToFirebase();
    },
    
    async vistAddFoto(key, event) {
        const file = event.target.files[0];
        if (!file) return;
        const compressed = await this.compressImage(file, 800, 0.7);
        if (!this.data.vistoria.ambientes) this.data.vistoria.ambientes = {};
        if (!this.data.vistoria.ambientes[key]) this.data.vistoria.ambientes[key] = {};
        if (!this.data.vistoria.ambientes[key].fotos) this.data.vistoria.ambientes[key].fotos = [];
        this.data.vistoria.ambientes[key].fotos.push(compressed);
        this.saveLocal(); this.syncToFirebase();
        this.renderVistoriaRoteiro(this._currentVistTipo); this.renderVistoriaPendencias();
        event.target.value = '';
        this.showToast("Foto adicionada", 'success'); this.haptic('medium');
    },
    
    vistSalvarObsGeral() {
        const el = document.getElementById('vist-amb-obs-geral');
        if (!el || !this._currentVistTipo) return;
        if (!this.data.vistoria.obsGeral) this.data.vistoria.obsGeral = {};
        this.data.vistoria.obsGeral[this._currentVistTipo] = el.value;
        this.saveLocal(); this.syncToFirebase();
    },
    
    renderVistoriaPendencias() {
        const container = document.getElementById('vist-pendencias-list');
        if (!container) return;
        const ambData = this.data.vistoria.ambientes || {};
        const config = this.getChecklistVistoria().ambientes;
        const pendencias = [];
        Object.keys(config).forEach(tipo => {
            config[tipo].sections.forEach(sec => {
                sec.itens.forEach((item, idx) => {
                    const key = `${tipo}:${sec.titulo}:${idx}`;
                    const entry = ambData[key];
                    if (entry && entry.status === 'defeito') {
                        pendencias.push({ ambienteLabel: config[tipo].label, secao: sec.titulo, descricao: item, obs: entry.obs || '', fotos: entry.fotos || [] });
                    }
                });
            });
        });
        if (pendencias.length === 0) { container.innerHTML = '<p class="empty-msg">Nenhuma pendência registrada ainda.</p>'; return; }
        container.innerHTML = '';
        pendencias.forEach(p => {
            const div = document.createElement('div');
            div.className = 'vist-pendencia-card';
            div.innerHTML = `<div class="vist-pend-amb">${p.ambienteLabel} — ${p.secao}</div><div class="vist-pend-desc">${p.descricao}</div>${p.obs ? `<div class="vist-pend-obs">${p.obs}</div>` : ''}${p.fotos.length > 0 ? `<div class="vist-pend-fotos">${p.fotos.map(f => `<img src="${f}" alt="Foto">`).join('')}</div>` : ''}`;
            container.appendChild(div);
        });
    },
    
    vistLimparPreparacao() {
        if (!confirm("Tem certeza que deseja limpar o checklist de preparação?")) return;
        this.data.vistoria.preparacao = {};
        this.saveLocal(); this.syncToFirebase();
        this.renderVistoriaPreparacao();
        this.showToast("Checklist limpo", 'success'); this.haptic('heavy');
    },

    vistLimparRoteiroAmbiente() {
        if (!this._currentVistTipo) return;
        if (!confirm("Tem certeza que deseja limpar todos os itens deste ambiente?")) return;
        const tipo = this._currentVistTipo;
        const ambData = this.data.vistoria.ambientes || {};
        Object.keys(ambData).forEach(key => {
            if (key.startsWith(tipo + ':')) delete ambData[key];
        });
        if (this.data.vistoria.obsGeral) this.data.vistoria.obsGeral[tipo] = '';
        const obsEl = document.getElementById('vist-amb-obs-geral');
        if (obsEl) obsEl.value = '';
        this.saveLocal(); this.syncToFirebase();
        this.renderVistoriaRoteiro(tipo);
        this.renderVistoriaAmbientes();
        this.renderDashboard();
        this.showToast("Ambiente limpo", 'success'); this.haptic('heavy');
    },

    renderRelatorio() {
        const container = document.getElementById('report-content');
        if (!container) return;
        const hoje = new Date().toLocaleDateString('pt-BR');
        if (this.currentRelatorio === 'rel-medicao') {
            this.renderRelatorioMedicao(container, hoje);
        } else {
            this.renderRelatorioVistoria(container, hoje);
        }
    },

    renderRelatorioMedicao(container, hoje) {
        let html = `
            <div class="report-header">
                <h1>Relatório de Medição e Planejamento</h1>
                <p><strong>Empreendimento:</strong> ${this.data.projeto.nome} Unidade 801A</p>
                <p><strong>Data da Visita:</strong> ${this.data.projeto.dataVisita} &nbsp;|&nbsp; <strong>Emissão:</strong> ${hoje}</p>
                <p><strong>Área Total Prevista na Planta:</strong> 55,70 m²</p>
            </div>
        `;
        let totalParedes = 0, totalElementos = 0;
        this.data.ambientes.forEach(a => { totalParedes += (a.paredes?.length || 0); totalElementos += (a.elementos?.length || 0); });
        html += `<div class="report-section"><h2>Resumo Geral</h2><table class="report-table"><tr><th>Ambientes</th><td>${this.data.ambientes.length}</td></tr><tr><th>Paredes</th><td>${totalParedes}</td></tr><tr><th>Elementos/Pontos</th><td>${totalElementos}</td></tr><tr><th>Marcenaria</th><td>${this.data.marcenaria.length}</td></tr></table></div>`;
        
        this.data.ambientes.forEach(amb => {
            const area = (amb.comp && amb.larg) ? (amb.comp * amb.larg).toFixed(2) : 'Não medido';
            html += `<div class="report-section"><div class="report-ambiente-title">${amb.nome}</div><table class="report-table"><tr><th>Comprimento</th><td>${amb.comp ? amb.comp + ' m' : '—'}</td><th>Largura</th><td>${amb.larg ? amb.larg + ' m' : '—'}</td><th>Pé-direito</th><td>${amb.peDireito ? amb.peDireito + ' m' : '—'}</td><th>Área Piso</th><td>${area !== 'Não medido' ? area + ' m²' : '—'}</td></tr></table>`;
            if (amb.paredes && amb.paredes.length > 0) {
                html += `<h3 style="font-size:0.95rem; margin:12px 0 6px;">Paredes</h3><table class="report-table"><thead><tr><th>Parede</th><th>Comp.</th><th>Alt.</th><th>Área Bruta</th><th>Vãos</th><th>Área Líquida</th></tr></thead><tbody>`;
                amb.paredes.forEach(p => {
                    const bruta = (p.comp * p.alt);
                    let vaos = 0;
                    (amb.elementos || []).filter(e => e.paredeId === p.id).forEach(e => { if (e.larg && e.alt) vaos += (e.larg * e.alt); });
                    html += `<tr><td>${p.nome}</td><td>${p.comp}</td><td>${p.alt}</td><td>${bruta.toFixed(2)} m²</td><td>${vaos.toFixed(2)} m²</td><td><strong>${(bruta - vaos).toFixed(2)} m²</strong></td></tr>`;
                });
                html += `</tbody></table>`;
            }
            if (amb.elementos && amb.elementos.length > 0) {
                const tipoLabel = { janela: 'Janela', porta: 'Porta', tomada: 'Tomada', interruptor: 'Interruptor', ponto_hidraulico: 'Hidráulica', ponto_gas: 'Gás', ar_condicionado: 'Ar-Cond.' };
                html += `<h3 style="font-size:0.95rem; margin:12px 0 6px;">Elementos e Pontos</h3><table class="report-table"><thead><tr><th>Tipo</th><th>Parede</th><th>Larg.</th><th>Alt.</th><th>Peitoril</th></tr></thead><tbody>`;
                amb.elementos.forEach(e => {
                    const parede = amb.paredes.find(p => p.id === e.paredeId);
                    html += `<tr><td>${tipoLabel[e.tipo] || e.tipo}</td><td>${parede ? parede.nome : '—'}</td><td>${e.larg || '—'}</td><td>${e.alt || '—'}</td><td>${e.peitoril || '—'}</td></tr>`;
                });
                html += `</tbody></table>`;
            }
            if (amb.fotos && amb.fotos.length > 0) {
                html += `<h3 style="font-size:0.95rem; margin:12px 0 6px;">Fotos (${amb.fotos.length})</h3><div class="report-foto-grid">`;
                amb.fotos.forEach(foto => { html += `<img src="${foto}" alt="Foto">`; });
                html += `</div>`;
            }
            html += `</div>`;
        });
        if (this.data.marcenaria && this.data.marcenaria.length > 0) {
            html += `<div class="report-section"><h2>🛋️ Marcenaria</h2><table class="report-table"><thead><tr><th>Ambiente</th><th>Item</th><th>Larg.</th><th>Prof.</th><th>Alt.</th><th>Folga</th><th>Avaliação</th></tr></thead><tbody>`;
            this.data.marcenaria.forEach(m => {
                const amb = this.data.ambientes.find(a => a.id === m.ambienteId);
                const av = this.marcAvaliar(m);
                const avLabel = { cabe: '✓ Cabe', apertado: '⚠ Apertado', 'nao-cabe': '✗ Não cabe', 'sem-medida': '— Sem medida' }[av.status];
                html += `<tr><td>${amb ? amb.nome : '—'}</td><td>${m.nome}</td><td>${m.largura} m</td><td>${m.profundidade} m</td><td>${m.altura || '—'}</td><td>${m.folga} cm</td><td>${avLabel}</td></tr>`;
            });
            html += `</tbody></table></div>`;
        }
        html += `<div class="report-section"><h2>Checklist de Medição</h2><table class="report-table"><thead><tr><th>Item</th><th>Status</th></tr></thead><tbody>`;
        const statusLabel = { pendente: 'Pendente', medido: 'Medido', conferido: 'Conferido', na: 'N/A' };
        this.data.checklist.forEach(chk => { html += `<tr><td>${chk.texto}</td><td>${statusLabel[chk.status] || chk.status}</td></tr>`; });
        html += `</tbody></table></div>`;
        html += `<div class="report-section" style="text-align:center; margin-top:40px; font-size:0.8rem; color:#888;"><p>Relatório de Medição.</p></div>`;
        container.innerHTML = html;
    },

    renderRelatorioVistoria(container, hoje) {
        let html = `<div class="report-header"><h1>Relatório de Vistoria de Entrega</h1><p><strong>Empreendimento:</strong> ${this.data.projeto.nome}</p><p><strong>Data:</strong> ${this.data.projeto.dataVisita} &nbsp;|&nbsp; <strong>Emissão:</strong> ${hoje}</p></div>`;
        const vistAmbData = this.data.vistoria.ambientes || {};
        const vistConfig = this.getChecklistVistoria().ambientes;
        let hasDefeitos = false, vistHtml = '';
        Object.keys(vistConfig).forEach(tipo => {
            const cfg = vistConfig[tipo];
            let ambHtml = '', ambTemDefeito = false;
            cfg.sections.forEach(sec => {
                let secHtml = '';
                sec.itens.forEach((item, idx) => {
                    const key = `${tipo}:${sec.titulo}:${idx}`;
                    const entry = vistAmbData[key];
                    if (!entry || entry.status !== 'defeito') return; 
                    ambTemDefeito = true; hasDefeitos = true;
                    secHtml += `<div class="report-vist-item status-defeito"><span class="vist-status-icon">✗</span><div class="vist-item-text"><strong>${item}</strong>${entry.obs ? `<div class="vist-item-obs" style="color:#C41E16; font-style:normal; margin-top:4px;">Descrição: ${entry.obs}</div>` : ''}${entry.fotos && entry.fotos.length > 0 ? `<div class="report-foto-grid" style="margin-top:6px; grid-template-columns: repeat(4, 1fr);">${entry.fotos.map(f => `<img src="${f}" alt="Foto" style="height:60pt;">`).join('')}</div>` : ''}</div></div>`;
                });
                if (secHtml) ambHtml += `<h3 style="font-size:0.9rem; margin:10px 0 4px; color:#555;">${sec.titulo}</h3>${secHtml}`;
            });
            if (ambTemDefeito) vistHtml += `<div class="report-vist-section"><div class="report-ambiente-title">${cfg.label}</div>${ambHtml}</div>`;
        });
        if (hasDefeitos) { html += `<div class="report-section"><h2 style="border-left-color:#FF3B30;">⚠️ Pendências e Defeitos Encontrados</h2>${vistHtml}</div>`; } 
        else { html += `<div class="report-section"><h2>Nenhum defeito registrado</h2><p>Todos os itens vistoriados foram marcados como OK ou Não se Aplica.</p></div>`; }

        const obsGeral = this.data.vistoria.obsGeral || {};
        let hasObs = false, obsHtml = '';
        Object.keys(obsGeral).forEach(tipo => {
            if (obsGeral[tipo] && obsGeral[tipo].trim() !== '') {
                hasObs = true;
                const label = vistConfig[tipo] ? vistConfig[tipo].label : tipo;
                obsHtml += `<div style="margin-bottom:12px;"><strong>${label}:</strong><br><span style="font-size:0.9rem;">${obsGeral[tipo]}</span></div>`;
            }
        });
        if (hasObs) html += `<div class="report-section"><h2>📝 Observações Adicionais</h2>${obsHtml}</div>`;
        html += `<div class="report-section" style="text-align:center; margin-top:40px; font-size:0.8rem; color:#888;"><p>Este documento é um registro visual e funcional da entrega do imóvel.</p></div>`;
        container.innerHTML = html;
    },

    printReport() {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        const relView = document.getElementById('view-relatorio');
        if (relView) relView.classList.add('active');
        this.renderRelatorio();
        void document.body.offsetHeight;
        const main = document.getElementById('app-content');
        if (main) main.scrollTop = 0;
        setTimeout(() => { window.print(); }, 300);
        this.haptic('medium');
    },
    
    printReportInNewTab() {
        this.renderRelatorio();
        const reportHtml = document.getElementById('report-content').innerHTML;
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
            @media print { body { padding: 0; max-width: none; } .report-section { page-break-inside: avoid; } .report-divergencia-box { page-break-inside: avoid; } }
        `;
        const fullHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório</title><style>${css}</style></head><body>${reportHtml}</body></html>`;
        const win = window.open('', '_blank');
        if (!win) { this.showToast("Bloqueador de popup impediu. Permita popups.", 'error'); return; }
        win.document.open(); win.document.write(fullHtml); win.document.close();
        win.onload = () => { setTimeout(() => { win.focus(); win.print(); }, 500); };
        this.haptic('medium');
    },
    
    exportCSV() {
        let csv = '\uFEFF';
        csv += 'Ambiente;Tipo;Identificação;Largura;Altura;Peitoril;Área\n';
        this.data.ambientes.forEach(amb => {
            const areaPiso = (amb.comp && amb.larg) ? (amb.comp * amb.larg).toFixed(2) : '';
            csv += `"${amb.nome}";"Piso";"—";"${amb.larg || ''}";"${amb.comp || ''}";"${amb.peDireito || ''}";"${areaPiso}"\n`;
            (amb.paredes || []).forEach(p => { const bruta = (p.comp * p.alt).toFixed(2); csv += `"${amb.nome}";"Parede";"${p.nome}";"${p.comp}";"${p.alt}";"";"${bruta}"\n`; });
            (amb.elementos || []).forEach(e => { const parede = amb.paredes.find(p => p.id === e.paredeId); csv += `"${amb.nome}";"${e.tipo}";"${parede ? parede.nome : ''}";"${e.larg || ''}";"${e.alt || ''}";"${e.peitoril || ''}";""\n`; });
        });
        csv += '\nChecklist;Status\n';
        this.data.checklist.forEach(chk => { csv += `"${chk.texto}";"${chk.status}"\n`; });
        csv += '\nDivergências;Ambiente;Elemento;Medida Planta;Medida Real;Diferença;Prioridade;Status;Descrição\n';
        this.data.divergencias.forEach(d => {
            const dif = d.diferenca !== null ? d.diferenca.toFixed(3) : '';
            csv += `"Sim";"${d.ambienteNome}";"${d.elemento}";"${d.medidaPlanta}";"${d.medidaReal}";"${dif}";"${d.prioridade}";"${d.status}";"${(d.descricao || '').replace(/"/g, '""')}"\n`;
        });
        csv += '\nMarcenaria;Ambiente;Item;Largura;Profundidade;Altura;Folga;Avaliação\n';
        this.data.marcenaria.forEach(m => {
            const amb = this.data.ambientes.find(a => a.id === m.ambienteId);
            const av = this.marcAvaliar(m);
            const avLabel = { cabe: 'Cabe', apertado: 'Apertado', 'nao-cabe': 'Não cabe', 'sem-medida': 'Sem medida' }[av.status];
            csv += `"Sim";"${amb ? amb.nome : ''}";"${m.nome}";"${m.largura}";"${m.profundidade}";"${m.altura || ''}";"${m.folga}";"${avLabel}"\n`;
        });
        csv += '\nVistoria;Ambiente;Seção;Item;Status;Observação;Fotos\n';
        const vistData = this.data.vistoria.ambientes || {};
        const vistCfg = this.getChecklistVistoria().ambientes;
        Object.keys(vistCfg).forEach(tipo => {
            vistCfg[tipo].sections.forEach(sec => {
                sec.itens.forEach((item, idx) => {
                    const key = `${tipo}:${sec.titulo}:${idx}`;
                    const entry = vistData[key];
                    if (entry && entry.status) {
                        const stLabel = { ok: 'OK', defeito: 'Com defeito', na: 'Não se aplica' }[entry.status] || entry.status;
                        csv += `"Sim";"${vistCfg[tipo].label}";"${sec.titulo}";"${item}";"${stLabel}";"${(entry.obs || '').replace(/"/g, '""')}";"${(entry.fotos || []).length}"\n`;
                    }
                });
            });
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_${this.data.projeto.id}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast("CSV exportado", 'success'); this.haptic('medium');
    }
};

window.app = app;
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    setTimeout(() => app.installPlantaGestures(), 100);
});
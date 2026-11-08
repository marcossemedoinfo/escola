/**
 * ============================================================================
 * SALA DE AULA CARTOON ONLINE - APP.JS (V2 MOBILE + CADERNO + PERMISSÃO LOUSA)
 * - Lousa inicia 100% limpa e apagável, com Apagador físico clicável na calha
 * - Alunos bloqueados de desenhar na lousa por padrão; Professor libera/bloqueia
 * - Caderno individual para cada Aluno desenhar; Professor clica no Aluno para ver!
 * - Opção de Download / Criar Atalho no Celular (PWA + Atalho portátil)
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. DEFINIÇÃO DAS CARTEIRAS E AVATARES CARTOON
// ----------------------------------------------------------------------------

const DESKS_CONFIG = [
  { id: 'desk-1', x: 15.5, y: 67.5, propClass: 'prop-notebook', propHtml: '📓' },
  { id: 'desk-2', x: 34.8, y: 84.5, propClass: 'prop-open-pad', propHtml: '' },
  { id: 'desk-3', x: 56.5, y: 69.5, propClass: 'prop-pouch-green', propHtml: '' },
  { id: 'desk-4', x: 77.2, y: 86.0, propClass: 'prop-pouch-blue', propHtml: '' },
  { id: 'desk-5', x: 93.0, y: 69.5, propClass: 'prop-pouch-purple', propHtml: '★' }
];

const AVATARS = [
  {
    id: 'teacher-suit',
    name: 'Prof. Terno',
    roleHint: 'teacher',
    skin: '#c68b65',
    hairColor: '#362317',
    hairStyle: 'parted',
    glasses: false,
    outfit: 'suit',
    markerInHand: true
  },
  {
    id: 'student-glasses',
    name: 'Leo (Óculos)',
    roleHint: 'student',
    skin: '#f0c4a0',
    hairColor: '#29221e',
    hairStyle: 'fluffy',
    glasses: true,
    outfit: 'grey-shirt',
    markerInHand: false
  },
  {
    id: 'student-curly',
    name: 'Bia (Cachos)',
    roleHint: 'student',
    skin: '#72462e',
    hairColor: '#301c12',
    hairStyle: 'long-wavy',
    glasses: false,
    outfit: 'blue-stripes',
    markerInHand: false
  },
  {
    id: 'student-blonde',
    name: 'Nina (Loira)',
    roleHint: 'student',
    skin: '#f6cba6',
    hairColor: '#f2ca52',
    hairStyle: 'bangs-long',
    glasses: false,
    outfit: 'pink-stripes',
    markerInHand: false
  },
  {
    id: 'teacher-casual',
    name: 'Profª. Ana',
    roleHint: 'teacher',
    skin: '#e0a680',
    hairColor: '#5c2c1d',
    hairStyle: 'bangs-long',
    glasses: true,
    outfit: 'suit',
    markerInHand: true
  }
];

function renderCharacterSVG(avatarId, isSeated = false, isSpeaking = false) {
  const av = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

  let backHair = '';
  if (av.hairStyle === 'long-wavy') {
    backHair = `
      <path d="M22,42 C10,55 12,108 26,118 C40,125 80,125 94,118 C108,108 110,55 98,42 Z"
            fill="${av.hairColor}" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
    `;
  } else if (av.hairStyle === 'bangs-long') {
    backHair = `
      <path d="M25,45 L20,115 C30,120 90,120 100,115 L95,45 Z"
            fill="${av.hairColor}" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
    `;
  }

  let outfitSvg = '';
  if (av.outfit === 'suit') {
    outfitSvg = `
      <path d="M36,96 L84,96 L88,138 L32,138 Z" fill="#2e3136" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="52,96 68,96 60,124" fill="#ffffff" stroke="#231f20" stroke-width="3"/>
      <polygon points="58,100 62,100 63,122 60,126 57,122" fill="#5e43b8" stroke="#231f20" stroke-width="2"/>
    `;
  } else if (av.outfit === 'pink-stripes') {
    outfitSvg = `
      <path d="M35,96 L85,96 L89,136 L31,136 Z" fill="#ffffff" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
      <line x1="34" y1="106" x2="86" y2="106" stroke="#e06c62" stroke-width="4"/>
      <line x1="33" y1="116" x2="87" y2="116" stroke="#e06c62" stroke-width="4"/>
      <line x1="32" y1="126" x2="88" y2="126" stroke="#e06c62" stroke-width="4"/>
      <path d="M35,96 L85,96 L89,136 L31,136 Z" fill="none" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
    `;
  } else if (av.outfit === 'blue-stripes') {
    outfitSvg = `
      <path d="M36,96 L84,96 L87,136 L33,136 Z" fill="#d9ecff" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
      <line x1="35" y1="108" x2="85" y2="108" stroke="#3b76ad" stroke-width="4"/>
      <line x1="34" y1="120" x2="86" y2="120" stroke="#3b76ad" stroke-width="4"/>
    `;
  } else {
    outfitSvg = `
      <path d="M35,96 L85,96 L88,136 L32,136 Z" fill="#9ea6ad" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
      <line x1="45" y1="106" x2="75" y2="106" stroke="#5c6369" stroke-width="4"/>
      <line x1="45" y1="118" x2="75" y2="118" stroke="#5c6369" stroke-width="4"/>
    `;
  }

  let legsSvg = '';
  if (isSeated) {
    legsSvg = `
      <rect x="40" y="134" width="14" height="24" rx="6" fill="#507699" stroke="#231f20" stroke-width="4"/>
      <rect x="66" y="134" width="14" height="24" rx="6" fill="#507699" stroke="#231f20" stroke-width="4"/>
      <ellipse cx="46" cy="160" rx="11" ry="7" fill="#55c299" stroke="#231f20" stroke-width="3.5"/>
      <ellipse cx="74" cy="160" rx="11" ry="7" fill="#55c299" stroke="#231f20" stroke-width="3.5"/>
    `;
  } else {
    const pantsColor = av.outfit === 'suit' ? '#25282c' : '#5887b0';
    const shoeColor = av.outfit === 'suit' ? '#332f2e' : '#4ec496';
    legsSvg = `
      <rect x="42" y="134" width="15" height="30" rx="5" fill="${pantsColor}" stroke="#231f20" stroke-width="4"/>
      <rect x="63" y="134" width="15" height="30" rx="5" fill="${pantsColor}" stroke="#231f20" stroke-width="4"/>
      <ellipse cx="48" cy="167" rx="11" ry="6.5" fill="${shoeColor}" stroke="#231f20" stroke-width="3.5"/>
      <ellipse cx="72" cy="167" rx="11" ry="6.5" fill="${shoeColor}" stroke="#231f20" stroke-width="3.5"/>
    `;
  }

  let armsSvg = '';
  if (av.markerInHand) {
    armsSvg = `
      <path d="M36,100 L18,118 L26,126 L40,112" fill="#2e3136" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="20" cy="122" r="7" fill="${av.skin}" stroke="#231f20" stroke-width="3.5"/>
      <rect x="8" y="96" width="9" height="28" rx="4" transform="rotate(24 14 110)" fill="#f2784b" stroke="#231f20" stroke-width="3"/>
      <path d="M84,100 L96,126 L86,130 L78,112" fill="#2e3136" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="92" cy="129" r="7" fill="${av.skin}" stroke="#231f20" stroke-width="3.5"/>
    `;
  } else {
    armsSvg = `
      <path d="M35,100 L22,126 L31,130 L40,112" fill="${av.skin}" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="25" cy="129" r="6.5" fill="${av.skin}" stroke="#231f20" stroke-width="3.5"/>
      <path d="M85,100 L98,126 L89,130 L80,112" fill="${av.skin}" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="95" cy="129" r="6.5" fill="${av.skin}" stroke="#231f20" stroke-width="3.5"/>
    `;
  }

  let frontHair = '';
  if (av.hairStyle === 'parted') {
    frontHair = `
      <path d="M24,54 C20,24 38,14 62,14 C88,14 98,26 96,54 C86,38 72,34 45,36 C34,37 28,44 24,54 Z"
            fill="${av.hairColor}" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
    `;
  } else if (av.hairStyle === 'fluffy') {
    frontHair = `
      <path d="M16,60 C10,42 22,20 42,16 C56,10 78,12 92,22 C108,32 108,52 100,62 C92,50 82,46 60,48 C38,46 26,50 16,60 Z"
            fill="${av.hairColor}" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
    `;
  } else if (av.hairStyle === 'long-wavy') {
    frontHair = `
      <path d="M22,58 C22,25 45,16 60,16 C75,16 98,25 98,58 C88,40 75,32 60,30 C45,32 32,40 22,58 Z"
            fill="${av.hairColor}" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
    `;
  } else {
    frontHair = `
      <path d="M22,56 C22,24 42,16 60,16 C78,16 98,24 98,56 C85,58 75,56 60,56 C45,56 35,58 22,56 Z"
            fill="${av.hairColor}" stroke="#231f20" stroke-width="4" stroke-linejoin="round"/>
    `;
  }

  let glassesSvg = '';
  if (av.glasses) {
    glassesSvg = `
      <circle cx="44" cy="68" r="12" fill="rgba(255,255,255,0.25)" stroke="#235789" stroke-width="4.5"/>
      <circle cx="76" cy="68" r="12" fill="rgba(255,255,255,0.25)" stroke="#235789" stroke-width="4.5"/>
      <line x1="56" y1="68" x2="64" y2="68" stroke="#235789" stroke-width="4.5"/>
    `;
  }

  const mouthSvg = isSpeaking
    ? `<ellipse cx="60" cy="82" rx="6" ry="5" fill="#d94336" stroke="#231f20" stroke-width="3"/>`
    : `<path d="M54,81 Q60,86 66,81" fill="none" stroke="#231f20" stroke-width="3.5" stroke-linecap="round"/>`;

  return `
    <svg viewBox="0 0 120 180" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      ${backHair}
      ${legsSvg}
      ${armsSvg}
      ${outfitSvg}
      <circle cx="22" cy="68" r="8" fill="${av.skin}" stroke="#231f20" stroke-width="4"/>
      <circle cx="98" cy="68" r="8" fill="${av.skin}" stroke="#231f20" stroke-width="4"/>
      <rect x="24" y="28" width="72" height="66" rx="31" fill="${av.skin}" stroke="#231f20" stroke-width="4"/>
      <ellipse cx="36" cy="75" rx="5.5" ry="3.2" fill="#f28b82" opacity="0.55"/>
      <ellipse cx="84" cy="75" rx="5.5" ry="3.2" fill="#f28b82" opacity="0.55"/>
      <circle cx="44" cy="68" r="5" fill="#231f20"/>
      <circle cx="42.5" cy="66.5" r="1.5" fill="#ffffff"/>
      <circle cx="76" cy="68" r="5" fill="#231f20"/>
      <circle cx="74.5" cy="66.5" r="1.5" fill="#ffffff"/>
      <ellipse cx="60" cy="72" rx="3.2" ry="2.2" fill="${av.skin}" stroke="#231f20" stroke-width="2.8"/>
      <path d="M38,56 Q44,53 49,56" fill="none" stroke="#231f20" stroke-width="3" stroke-linecap="round"/>
      <path d="M71,56 Q76,53 82,56" fill="none" stroke="#231f20" stroke-width="3" stroke-linecap="round"/>
      ${mouthSvg}
      ${glassesSvg}
      ${frontHair}
    </svg>
  `;
}

// ----------------------------------------------------------------------------
// 2. ESTADO GLOBAL DO JOGO E REDE (MULTIPLAYER + VOZ + LOUSA + CADERNOS)
// ----------------------------------------------------------------------------

const state = {
  myId: 'p_' + Math.random().toString(36).substring(2, 9),
  roomCode: 'SALA101',
  myName: 'Prof. Marcos',
  myRole: 'teacher', // 'teacher' | 'student'
  myAvatar: 'teacher-suit',
  players: {},
  // Por padrão, APENAS o professor escreve na lousa até que ele clique para liberar!
  allowStudentsDraw: false,
  micEnabled: true,
  speakerEnabled: true,
  localStream: null,
  peer: null,
  isHost: false,
  hostConn: null,
  clientConns: {},
  bc: null,

  // Estado da Lousa
  drawTool: 'pen', // 'pen' | 'eraser' | 'text'
  drawColor: '#232323',
  drawSize: 8,
  isDrawing: false,
  lastPt: null,
  pendingTextPos: null,

  // Estado dos Cadernos dos Alunos (playerId -> dataURL / strokes em tempo real)
  notebooks: {}, // playerId -> dataURL (PNG transparente sob a folha pautada)
  activeNotebookOwnerId: null, // Qual caderno está aberto no modal agora
  nbTool: 'pen', // 'pen' | 'eraser'
  nbColor: '#1e3a8a',
  nbSize: 5,
  isNbDrawing: false,
  lastNbPt: null,

  // PWA Install Prompt
  deferredInstallPrompt: null
};

// ----------------------------------------------------------------------------
// 3. INICIALIZAÇÃO DA UI, LOBBY E INSTALAÇÃO NO CELULAR (PWA)
// ----------------------------------------------------------------------------

const lobbyOverlay = document.getElementById('lobby-overlay');
const playerNameInput = document.getElementById('player-name');
const roomCodeInput = document.getElementById('room-code');
const roleTeacherBtn = document.getElementById('role-teacher-btn');
const roleStudentBtn = document.getElementById('role-student-btn');
const avatarOptionsEl = document.getElementById('avatar-options');
const joinBtn = document.getElementById('join-btn');
const lobbyStatus = document.getElementById('lobby-status');
const entitiesLayer = document.getElementById('entities-layer');

function initLobbyAndPWA() {
  // Registra Service Worker para PWA (atalho de aplicativo no celular)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredInstallPrompt = e;
  });

  // Botões de Download / Criar Atalho no Celular
  const triggerInstallFlow = async () => {
    if (state.deferredInstallPrompt) {
      state.deferredInstallPrompt.prompt();
      await state.deferredInstallPrompt.userChoice;
      state.deferredInstallPrompt = null;
      return;
    }
    document.getElementById('install-guide-modal').classList.remove('hidden');
  };

  document.getElementById('lobby-install-btn').addEventListener('click', triggerInstallFlow);
  document.getElementById('hud-install-btn').addEventListener('click', triggerInstallFlow);
  document.getElementById('close-install-modal-btn').addEventListener('click', () => {
    document.getElementById('install-guide-modal').classList.add('hidden');
  });

  // Botão que baixa um arquivo de atalho direto para o celular/PC
  document.getElementById('download-shortcut-file-btn').addEventListener('click', () => {
    const currentUrl = window.location.href;
    const shortcutHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="refresh" content="0;url=${currentUrl}">
<title>Sala de Aula Cartoon</title>
<style>body{background:#ffd84d;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-weight:bold;}</style>
</head>
<body>Abrindo Sala de Aula Cartoon... <a href="${currentUrl}">Clique aqui</a></body>
</html>`;
    const blob = new Blob([shortcutHtml], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Atalho-Sala-De-Aula.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Previews de Professor e Aluno
  document.getElementById('preview-teacher-icon').innerHTML = renderCharacterSVG('teacher-suit', false, false);
  document.getElementById('preview-student-icon').innerHTML = renderCharacterSVG('student-glasses', false, false);

  const params = new URLSearchParams(window.location.search);
  if (params.get('room')) {
    roomCodeInput.value = params.get('room').toUpperCase();
  }
  if (params.get('role') === 'student') {
    selectRole('student');
  } else {
    selectRole('teacher');
  }

  roleTeacherBtn.addEventListener('click', () => selectRole('teacher'));
  roleStudentBtn.addEventListener('click', () => selectRole('student'));

  renderAvatarSelector();
  joinBtn.addEventListener('click', startClassroomSession);
}

function selectRole(role) {
  state.myRole = role;
  roleTeacherBtn.classList.toggle('active', role === 'teacher');
  roleStudentBtn.classList.toggle('active', role === 'student');

  if (role === 'teacher') {
    state.myAvatar = 'teacher-suit';
    if (!playerNameInput.value || playerNameInput.value.startsWith('Aluno')) {
      playerNameInput.value = 'Prof. Marcos';
    }
  } else {
    const studentAvatars = ['student-glasses', 'student-curly', 'student-blonde'];
    state.myAvatar = studentAvatars[Math.floor(Math.random() * studentAvatars.length)];
    if (!playerNameInput.value || playerNameInput.value.startsWith('Prof.')) {
      playerNameInput.value = 'Aluno ' + Math.floor(10 + Math.random() * 89);
    }
  }
  renderAvatarSelector();
}

function renderAvatarSelector() {
  avatarOptionsEl.innerHTML = '';
  AVATARS.forEach(av => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'avatar-option-btn' + (state.myAvatar === av.id ? ' active' : '');
    btn.title = av.name;
    btn.innerHTML = renderCharacterSVG(av.id, false, false);
    btn.addEventListener('click', () => {
      state.myAvatar = av.id;
      renderAvatarSelector();
    });
    avatarOptionsEl.appendChild(btn);
  });
}

// ----------------------------------------------------------------------------
// 4. LOUSA INTERATIVA (100% LIMPA, APAGADOR FÍSICO E CONTROLE DO PROFESSOR)
// ----------------------------------------------------------------------------

const canvas = document.getElementById('whiteboard-canvas');
const ctx = canvas.getContext('2d');

function clearWhiteboardBlank() {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function getCanvasPoint(targetCanvas, e) {
  const rect = targetCanvas.getBoundingClientRect();
  const touch = e.touches && e.touches[0] ? e.touches[0] : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e);
  return {
    x: ((touch.clientX - rect.left) / rect.width) * targetCanvas.width,
    y: ((touch.clientY - rect.top) / rect.height) * targetCanvas.height
  };
}

function canIDrawOnBoard() {
  if (state.myRole === 'teacher') return true;
  return Boolean(state.allowStudentsDraw);
}

function drawStrokeOnCanvas(stroke) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (stroke.tool === 'eraser') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = stroke.size * 4;
  } else {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
  }
  ctx.beginPath();
  ctx.moveTo(stroke.x0, stroke.y0);
  ctx.lineTo(stroke.x1, stroke.y1);
  ctx.stroke();
  ctx.restore();
}

function drawTextOnCanvas(item) {
  ctx.save();
  ctx.font = `bold ${item.size * 4 + 14}px "Patrick Hand", "Fredoka", sans-serif`;
  ctx.fillStyle = item.color;
  ctx.fillText(item.text, item.x, item.y);
  ctx.restore();
}

function updateBoardPermissionUI() {
  const hudLockBtn = document.getElementById('teacher-lock-board-btn');
  const toolbarLockBtn = document.getElementById('toolbar-lock-btn');
  const isTeacher = state.myRole === 'teacher';

  hudLockBtn.style.display = isTeacher ? 'flex' : 'none';
  toolbarLockBtn.style.display = isTeacher ? 'inline-block' : 'none';

  if (state.allowStudentsDraw) {
    hudLockBtn.className = 'hud-action-btn lock-board-btn unlocked';
    hudLockBtn.innerHTML = '🔓 Lousa Liberada p/ Alunos';
    toolbarLockBtn.className = 'board-tool-btn lock-toggle-inline unlocked';
    toolbarLockBtn.innerHTML = '🔓 Bloquear Alunos';
  } else {
    hudLockBtn.className = 'hud-action-btn lock-board-btn locked';
    hudLockBtn.innerHTML = '🔒 Lousa Bloqueada p/ Alunos';
    toolbarLockBtn.className = 'board-tool-btn lock-toggle-inline locked';
    toolbarLockBtn.innerHTML = '🔒 Liberar Alunos';
  }

  // Esconde/mostra a barra de ferramentas da lousa para o aluno se estiver bloqueada
  const boardToolbar = document.getElementById('board-toolbar');
  if (state.myRole === 'student') {
    boardToolbar.style.display = state.allowStudentsDraw ? 'flex' : 'none';
  } else {
    boardToolbar.style.display = 'flex';
  }
}

function toggleStudentsBoardPermission() {
  if (state.myRole !== 'teacher') return;
  state.allowStudentsDraw = !state.allowStudentsDraw;
  updateBoardPermissionUI();
  broadcastMessage({
    type: 'BOARD_PERMISSION',
    allowStudentsDraw: state.allowStudentsDraw
  });
  showTemporaryHint(
    state.allowStudentsDraw
      ? 'Você LIBEROU a lousa para os alunos escreverem!'
      : 'Você BLOQUEOU a lousa (somente você pode escrever).'
  );
}

function initWhiteboardEvents() {
  // Inicia a lousa 100% limpa e branca!
  clearWhiteboardBlank();

  const onPointerDown = (e) => {
    if (!canIDrawOnBoard()) {
      showTemporaryHint('🔒 A lousa está bloqueada pelo professor! Use o botão "📓 Meu Caderno" para desenhar.');
      return;
    }
    e.preventDefault();
    const pt = getCanvasPoint(canvas, e);

    if (state.drawTool === 'text') {
      state.pendingTextPos = pt;
      const modal = document.getElementById('text-prompt-modal');
      const input = document.getElementById('board-text-input');
      modal.classList.remove('hidden');
      input.value = '';
      setTimeout(() => input.focus(), 50);
      return;
    }

    state.isDrawing = true;
    state.lastPt = pt;

    const stroke = {
      tool: state.drawTool,
      color: state.drawColor,
      size: state.drawSize,
      x0: pt.x,
      y0: pt.y,
      x1: pt.x + 0.5,
      y1: pt.y + 0.5
    };
    drawStrokeOnCanvas(stroke);
    broadcastMessage({ type: 'BOARD_STROKE', stroke });
  };

  const onPointerMove = (e) => {
    if (!state.isDrawing || !state.lastPt) return;
    e.preventDefault();
    const pt = getCanvasPoint(canvas, e);
    const stroke = {
      tool: state.drawTool,
      color: state.drawColor,
      size: state.drawSize,
      x0: state.lastPt.x,
      y0: state.lastPt.y,
      x1: pt.x,
      y1: pt.y
    };
    drawStrokeOnCanvas(stroke);
    broadcastMessage({ type: 'BOARD_STROKE', stroke });
    state.lastPt = pt;
  };

  const onPointerUp = () => {
    state.isDrawing = false;
    state.lastPt = null;
  };

  canvas.addEventListener('mousedown', onPointerDown);
  canvas.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', onPointerDown, { passive: false });
  canvas.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);

  // Cores da Lousa
  document.querySelectorAll('.color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.drawColor = btn.dataset.color;
      if (state.drawTool === 'eraser') setBoardTool('pen');
    });
  });

  // Tamanhos
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.drawSize = parseInt(btn.dataset.size, 10);
    });
  });

  // Ferramentas: Canetão, Texto, Apagador (na barra e no objeto físico da calha!)
  document.getElementById('tool-pen').addEventListener('click', () => setBoardTool('pen'));
  document.getElementById('tool-text').addEventListener('click', () => setBoardTool('text'));
  document.getElementById('tool-eraser').addEventListener('click', () => setBoardTool('eraser'));
  document.getElementById('ledge-eraser-btn').addEventListener('click', () => {
    if (!canIDrawOnBoard()) {
      showTemporaryHint('🔒 Apenas o professor pode usar o apagador da lousa agora.');
      return;
    }
    setBoardTool(state.drawTool === 'eraser' ? 'pen' : 'eraser');
    showTemporaryHint(state.drawTool === 'eraser' ? '🧽 Apagador selecionado! Passe na lousa para apagar.' : '🖍️ Canetão selecionado!');
  });

  document.getElementById('tool-clear').addEventListener('click', () => {
    if (!canIDrawOnBoard()) return;
    clearWhiteboardBlank();
    broadcastMessage({ type: 'BOARD_CLEAR' });
  });

  // Botões do Professor para Liberar/Bloquear Lousa para Alunos
  document.getElementById('teacher-lock-board-btn').addEventListener('click', toggleStudentsBoardPermission);
  document.getElementById('toolbar-lock-btn').addEventListener('click', toggleStudentsBoardPermission);

  // Zoom da Lousa
  const wrapper = document.getElementById('whiteboard-wrapper');
  document.getElementById('board-zoom-btn').addEventListener('click', () => {
    wrapper.classList.toggle('zoomed');
  });
  document.getElementById('close-zoom-btn').addEventListener('click', () => {
    wrapper.classList.remove('zoomed');
  });

  // Modal de Texto na Lousa
  document.getElementById('board-text-cancel').addEventListener('click', () => {
    document.getElementById('text-prompt-modal').classList.add('hidden');
  });
  document.getElementById('board-text-confirm').addEventListener('click', confirmBoardText);
  document.getElementById('board-text-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmBoardText();
  });
}

function confirmBoardText() {
  const input = document.getElementById('board-text-input');
  const txt = input.value.trim();
  document.getElementById('text-prompt-modal').classList.add('hidden');
  if (!txt || !state.pendingTextPos) return;

  const item = {
    text: txt,
    x: state.pendingTextPos.x,
    y: state.pendingTextPos.y,
    color: state.drawColor,
    size: state.drawSize
  };
  drawTextOnCanvas(item);
  broadcastMessage({ type: 'BOARD_TEXT', item });
}

function setBoardTool(tool) {
  state.drawTool = tool;
  document.getElementById('tool-pen').classList.toggle('active', tool === 'pen');
  document.getElementById('tool-text').classList.toggle('active', tool === 'text');
  document.getElementById('tool-eraser').classList.toggle('active', tool === 'eraser');
  document.getElementById('ledge-eraser-btn').classList.toggle('active-eraser', tool === 'eraser');
}

// ----------------------------------------------------------------------------
// 5. SISTEMA DE CADERNO DO ALUNO + VISUALIZAÇÃO EM TEMPO REAL PELO PROFESSOR
// ----------------------------------------------------------------------------

const nbModal = document.getElementById('notebook-modal');
const nbCanvas = document.getElementById('notebook-canvas');
const nbCtx = nbCanvas.getContext('2d');

function initNotebookSystem() {
  // Botão "📓 Meu Caderno" na barra superior
  document.getElementById('open-notebook-btn').addEventListener('click', () => {
    openNotebookForPlayer(state.myId);
  });

  document.getElementById('close-notebook-btn').addEventListener('click', () => {
    nbModal.classList.add('hidden');
    state.activeNotebookOwnerId = null;
  });

  const onNbDown = (e) => {
    if (!state.activeNotebookOwnerId) return;
    e.preventDefault();
    const pt = getCanvasPoint(nbCanvas, e);
    state.isNbDrawing = true;
    state.lastNbPt = pt;

    const stroke = {
      ownerId: state.activeNotebookOwnerId,
      tool: state.nbTool,
      color: state.nbColor,
      size: state.nbSize,
      x0: pt.x,
      y0: pt.y,
      x1: pt.x + 0.5,
      y1: pt.y + 0.5
    };
    drawStrokeOnNotebookCanvas(stroke);
    saveAndSyncActiveNotebook(stroke);
  };

  const onNbMove = (e) => {
    if (!state.isNbDrawing || !state.lastNbPt || !state.activeNotebookOwnerId) return;
    e.preventDefault();
    const pt = getCanvasPoint(nbCanvas, e);
    const stroke = {
      ownerId: state.activeNotebookOwnerId,
      tool: state.nbTool,
      color: state.nbColor,
      size: state.nbSize,
      x0: state.lastNbPt.x,
      y0: state.lastNbPt.y,
      x1: pt.x,
      y1: pt.y
    };
    drawStrokeOnNotebookCanvas(stroke);
    broadcastMessage({ type: 'NOTEBOOK_STROKE', stroke });
    state.lastNbPt = pt;
  };

  const onNbUp = () => {
    if (!state.isNbDrawing) return;
    state.isNbDrawing = false;
    state.lastNbPt = null;
    if (state.activeNotebookOwnerId) {
      state.notebooks[state.activeNotebookOwnerId] = nbCanvas.toDataURL('image/png');
      broadcastMessage({
        type: 'NOTEBOOK_SNAPSHOT',
        ownerId: state.activeNotebookOwnerId,
        dataUrl: state.notebooks[state.activeNotebookOwnerId]
      });
    }
  };

  nbCanvas.addEventListener('mousedown', onNbDown);
  nbCanvas.addEventListener('mousemove', onNbMove);
  window.addEventListener('mouseup', onNbUp);

  nbCanvas.addEventListener('touchstart', onNbDown, { passive: false });
  nbCanvas.addEventListener('touchmove', onNbMove, { passive: false });
  window.addEventListener('touchend', onNbUp);

  // Cores do Caderno
  document.querySelectorAll('.nb-color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nb-color-swatch').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.nbColor = btn.dataset.color;
      setNotebookTool('pen');
    });
  });

  document.getElementById('nb-tool-pen').addEventListener('click', () => setNotebookTool('pen'));
  document.getElementById('nb-tool-eraser').addEventListener('click', () => setNotebookTool('eraser'));

  document.getElementById('nb-tool-clear').addEventListener('click', () => {
    if (!state.activeNotebookOwnerId) return;
    nbCtx.clearRect(0, 0, nbCanvas.width, nbCanvas.height);
    state.notebooks[state.activeNotebookOwnerId] = nbCanvas.toDataURL('image/png');
    broadcastMessage({
      type: 'NOTEBOOK_CLEAR',
      ownerId: state.activeNotebookOwnerId
    });
  });

  // Carimbos do Professor no caderno do aluno ("⭐ Parabéns!" e "✅ Correto!")
  document.getElementById('nb-stamp-star').addEventListener('click', () => {
    placeTeacherStamp('⭐ Parabéns!', '#d97706');
  });
  document.getElementById('nb-stamp-check').addEventListener('click', () => {
    placeTeacherStamp('✅ Muito Bem!', '#16a34a');
  });
}

function setNotebookTool(tool) {
  state.nbTool = tool;
  document.getElementById('nb-tool-pen').classList.toggle('active', tool === 'pen');
  document.getElementById('nb-tool-eraser').classList.toggle('active', tool === 'eraser');
}

function drawStrokeOnNotebookCanvas(stroke) {
  nbCtx.save();
  nbCtx.lineCap = 'round';
  nbCtx.lineJoin = 'round';
  if (stroke.tool === 'eraser') {
    nbCtx.globalCompositeOperation = 'destination-out';
    nbCtx.lineWidth = 26;
  } else {
    nbCtx.globalCompositeOperation = 'source-over';
    nbCtx.strokeStyle = stroke.color;
    nbCtx.lineWidth = stroke.size || 5;
  }
  nbCtx.beginPath();
  nbCtx.moveTo(stroke.x0, stroke.y0);
  nbCtx.lineTo(stroke.x1, stroke.y1);
  nbCtx.stroke();
  nbCtx.restore();
}

function placeTeacherStamp(text, color) {
  if (!state.activeNotebookOwnerId) return;
  const stamp = {
    ownerId: state.activeNotebookOwnerId,
    text,
    color,
    x: 480 + Math.floor(Math.random() * 60),
    y: 90 + Math.floor(Math.random() * 60)
  };
  drawStampOnNotebookCanvas(stamp);
  state.notebooks[state.activeNotebookOwnerId] = nbCanvas.toDataURL('image/png');
  broadcastMessage({ type: 'NOTEBOOK_STAMP', stamp });
  broadcastMessage({
    type: 'NOTEBOOK_SNAPSHOT',
    ownerId: state.activeNotebookOwnerId,
    dataUrl: state.notebooks[state.activeNotebookOwnerId]
  });
}

function drawStampOnNotebookCanvas(stamp) {
  nbCtx.save();
  nbCtx.font = 'bold 34px "Fredoka", sans-serif';
  nbCtx.fillStyle = stamp.color;
  nbCtx.fillText(stamp.text, stamp.x, stamp.y);
  nbCtx.restore();
}

function saveAndSyncActiveNotebook(stroke) {
  broadcastMessage({ type: 'NOTEBOOK_STROKE', stroke });
  state.notebooks[state.activeNotebookOwnerId] = nbCanvas.toDataURL('image/png');
}

function openNotebookForPlayer(targetPlayerId) {
  const targetPlayer = state.players[targetPlayerId];
  if (!targetPlayer) return;

  state.activeNotebookOwnerId = targetPlayerId;
  const isMyOwn = targetPlayerId === state.myId;
  const isTeacherInspecting = state.myRole === 'teacher' && !isMyOwn;

  const badgeEl = document.getElementById('notebook-mode-badge');
  const titleEl = document.getElementById('notebook-owner-title');

  if (isMyOwn) {
    badgeEl.textContent = 'MEU CADERNO';
    badgeEl.className = 'notebook-badge';
    titleEl.textContent = `Caderno de ${targetPlayer.name} 📓`;
  } else {
    badgeEl.textContent = 'VISÃO DO PROFESSOR (AO VIVO)';
    badgeEl.className = 'notebook-badge teacher-viewing';
    titleEl.textContent = `Caderno de ${targetPlayer.name} 👀`;
  }

  // Mostra botões de carimbo se for o professor olhando o caderno do aluno
  document.getElementById('nb-stamp-star').style.display = isTeacherInspecting ? 'inline-block' : 'none';
  document.getElementById('nb-stamp-check').style.display = isTeacherInspecting ? 'inline-block' : 'none';

  // Carrega o desenho salvo do caderno desse aluno e pede atualização em tempo real
  nbCtx.clearRect(0, 0, nbCanvas.width, nbCanvas.height);
  if (state.notebooks[targetPlayerId]) {
    const img = new Image();
    img.onload = () => {
      nbCtx.clearRect(0, 0, nbCanvas.width, nbCanvas.height);
      nbCtx.drawImage(img, 0, 0);
    };
    img.src = state.notebooks[targetPlayerId];
  }

  if (!isMyOwn) {
    broadcastMessage({
      type: 'REQUEST_NOTEBOOK_SNAPSHOT',
      ownerId: targetPlayerId
    });
  }

  nbModal.classList.remove('hidden');
}

// ----------------------------------------------------------------------------
// 6. CENÁRIO: CARTEIRAS, CLIQUE NO ALUNO PARA VER CADERNO E MOVIMENTAÇÃO
// ----------------------------------------------------------------------------

function renderDesks() {
  DESKS_CONFIG.forEach((d, idx) => {
    const deskEl = document.createElement('div');
    deskEl.className = 'desk-unit';
    deskEl.id = d.id;
    deskEl.style.left = d.x + '%';
    deskEl.style.top = d.y + '%';
    deskEl.style.zIndex = Math.round(d.y);

    deskEl.innerHTML = `
      <div class="desk-seat-hint">🪑 Sentar na Carteira ${idx + 1}</div>
      <div class="chair-backrest"></div>
      <div class="desk-legs">
        <div class="desk-leg bl"></div>
        <div class="desk-leg br"></div>
        <div class="desk-leg fl"></div>
        <div class="desk-leg fr"></div>
      </div>
      <div class="desk-tabletop">
        <div class="desk-prop ${d.propClass}" title="Abrir Caderno">${d.propHtml}</div>
      </div>
    `;

    deskEl.addEventListener('click', (e) => {
      e.stopPropagation();
      // Se o professor clicar numa carteira onde há um aluno sentado, abre o caderno daquele aluno!
      const seatedStudent = Object.values(state.players).find(p => p.deskId === d.id);
      if (state.myRole === 'teacher' && seatedStudent && seatedStudent.id !== state.myId) {
        openNotebookForPlayer(seatedStudent.id);
        return;
      }
      // Se o próprio aluno clicar na carteira onde já está sentado, abre o seu próprio caderno!
      if (seatedStudent && seatedStudent.id === state.myId) {
        openNotebookForPlayer(state.myId);
        return;
      }
      sitAtDesk(d.id);
    });

    entitiesLayer.appendChild(deskEl);
  });

  document.querySelector('.wood-floor').addEventListener('click', (e) => {
    const stageRect = document.getElementById('classroom-stage').getBoundingClientRect();
    const xPct = ((e.clientX - stageRect.left) / stageRect.width) * 100;
    const yPct = ((e.clientY - stageRect.top) / stageRect.height) * 100;

    const me = state.players[state.myId];
    if (!me) return;
    me.deskId = null;
    me.x = Math.max(8, Math.min(92, xPct));
    me.y = Math.max(54, Math.min(92, yPct));
    syncMyPlayerState();
    renderAllPlayers();
  });
}

function sitAtDesk(deskId) {
  const desk = DESKS_CONFIG.find(d => d.id === deskId);
  if (!desk) return;

  const occupant = Object.values(state.players).find(p => p.deskId === deskId && p.id !== state.myId);
  if (occupant) {
    if (state.myRole === 'teacher') {
      openNotebookForPlayer(occupant.id);
    } else {
      showTemporaryHint(`A carteira já está ocupada por ${occupant.name}!`);
    }
    return;
  }

  const me = state.players[state.myId];
  if (!me) return;
  me.deskId = deskId;
  me.x = desk.x;
  me.y = desk.y - 4.5;
  syncMyPlayerState();
  renderAllPlayers();
}

function renderAllPlayers() {
  document.querySelectorAll('.character-entity').forEach(el => {
    const pid = el.dataset.playerId;
    if (!state.players[pid]) el.remove();
  });

  const playersArr = Object.values(state.players);
  document.getElementById('online-count').textContent = playersArr.length;

  const inlineList = document.getElementById('players-list-inline');
  inlineList.innerHTML = '';

  playersArr.forEach(p => {
    // Chip na barra superior (se o professor clicar no nome do aluno na lista superior, também abre o caderno dele!)
    const chip = document.createElement('div');
    chip.className = 'player-chip' +
      (p.role === 'teacher' ? ' is-teacher' : '') +
      (p.speaking ? ' speaking' : '');
    chip.title = state.myRole === 'teacher' && p.role === 'student'
      ? `Clique para ver o caderno de ${p.name}`
      : p.name;
    chip.innerHTML = `
      <span>${p.role === 'teacher' ? '👨‍🏫' : '🎒'}</span>
      <span>${escapeHtml(p.name)}${p.id === state.myId ? ' (Você)' : ''}</span>
      <span>${p.micOn ? (p.speaking ? '🔊' : '🎙️') : '🔇'}</span>
      ${state.myRole === 'teacher' && p.role === 'student' ? '<span>📓</span>' : ''}
    `;
    chip.addEventListener('click', () => {
      if (state.myRole === 'teacher' && p.role === 'student') {
        openNotebookForPlayer(p.id);
      } else if (p.id === state.myId) {
        openNotebookForPlayer(state.myId);
      }
    });
    inlineList.appendChild(chip);

    // Personagem no cenário
    let charEl = document.getElementById('char-' + p.id);
    if (!charEl) {
      charEl = document.createElement('div');
      charEl.id = 'char-' + p.id;
      charEl.className = 'character-entity';
      charEl.dataset.playerId = p.id;
      charEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const clickedPlayer = state.players[p.id];
        if (!clickedPlayer) return;
        // Se o professor clicar no aluno, abre o caderno do aluno!
        if (state.myRole === 'teacher' && clickedPlayer.role === 'student') {
          openNotebookForPlayer(clickedPlayer.id);
        } else if (clickedPlayer.id === state.myId) {
          openNotebookForPlayer(state.myId);
        }
      });
      entitiesLayer.appendChild(charEl);
    }

    const isSeated = Boolean(p.deskId);
    charEl.classList.toggle('is-seated', isSeated);
    charEl.classList.toggle('speaking', Boolean(p.speaking));

    charEl.style.left = p.x + '%';
    charEl.style.top = p.y + '%';

    if (isSeated) {
      const desk = DESKS_CONFIG.find(d => d.id === p.deskId);
      charEl.style.zIndex = desk ? Math.round(desk.y) - 1 : 30;
    } else {
      charEl.style.zIndex = Math.round(p.y);
    }

    const bubbleContent = p.emote || (p.handRaised ? '✋' : '');
    const bubbleHtml = bubbleContent ? `<div class="char-bubble">${bubbleContent}</div>` : '';

    // Se eu sou o Professor e este personagem é um Aluno, exibe o botão "📓 Ver Caderno" acima dele
    let inspectBadgeHtml = '';
    if (state.myRole === 'teacher' && p.role === 'student') {
      inspectBadgeHtml = `<div class="inspect-notebook-pill">📓 Ver Caderno</div>`;
    } else if (p.id === state.myId && p.role === 'student') {
      inspectBadgeHtml = `<div class="inspect-notebook-pill">📓 Meu Caderno</div>`;
    }

    charEl.innerHTML = `
      ${bubbleHtml}
      ${inspectBadgeHtml}
      <div class="char-nametag ${p.role === 'teacher' ? 'teacher-tag' : ''}">
        <span>${p.micOn ? '🎙️' : '🔇'}</span>
        <span>${escapeHtml(p.name)}</span>
      </div>
      <div class="voice-ring"></div>
      <div class="character-svg-holder">
        ${renderCharacterSVG(p.avatar, isSeated, p.speaking)}
      </div>
    `;
  });
}

// ----------------------------------------------------------------------------
// 7. ÁUDIO ABERTO PARA TODOS (WEBRTC VOZ + DETECTOR DE FALA)
// ----------------------------------------------------------------------------

async function setupLocalMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false
    });
    state.localStream = stream;
    state.micEnabled = true;
    updateMicUI();
    startVoiceActivityDetection(stream);
    return stream;
  } catch (err) {
    console.warn('Microfone não disponível ou permissão negada:', err);
    state.micEnabled = false;
    updateMicUI();
    return null;
  }
}

function startVoiceActivityDetection(stream) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const micBar = document.getElementById('local-mic-bar');

    setInterval(() => {
      if (!state.micEnabled) {
        micBar.style.width = '0%';
        setMySpeakingState(false);
        return;
      }
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const avg = sum / data.length;
      const pct = Math.min(100, Math.round((avg / 65) * 100));
      micBar.style.width = pct + '%';

      const isNowSpeaking = avg > 14;
      setMySpeakingState(isNowSpeaking);
    }, 120);
  } catch (e) {
    console.warn('Erro ao iniciar analisador de voz:', e);
  }
}

function setMySpeakingState(speaking) {
  const me = state.players[state.myId];
  if (!me || me.speaking === speaking) return;
  me.speaking = speaking;
  renderAllPlayers();
  broadcastMessage({
    type: 'VOICE_ACTIVITY',
    playerId: state.myId,
    speaking
  });
}

function updateMicUI() {
  const btn = document.getElementById('mic-toggle-btn');
  const icon = document.getElementById('mic-icon');
  const label = document.getElementById('mic-label');

  btn.classList.toggle('mic-on', state.micEnabled);
  btn.classList.toggle('mic-off', !state.micEnabled);
  icon.textContent = state.micEnabled ? '🎙️' : '🔇';
  label.textContent = state.micEnabled ? 'Mic' : 'Mudo';

  const me = state.players[state.myId];
  if (me) {
    me.micOn = state.micEnabled;
    syncMyPlayerState();
    renderAllPlayers();
  }
}

function attachRemoteAudioStream(peerId, remoteStream) {
  const container = document.getElementById('remote-audios-container');
  let audioEl = document.getElementById('audio-' + peerId);
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.id = 'audio-' + peerId;
    audioEl.autoplay = true;
    audioEl.playsInline = true;
    container.appendChild(audioEl);
  }
  audioEl.srcObject = remoteStream;
  audioEl.muted = !state.speakerEnabled;
  audioEl.play().catch(() => {});
}

// ----------------------------------------------------------------------------
// 8. CONEXÃO ONLINE MULTIPLAYER (PEERJS WEBRTC + BROADCASTCHANNEL)
// ----------------------------------------------------------------------------

async function startClassroomSession() {
  const rawName = playerNameInput.value.trim() || (state.myRole === 'teacher' ? 'Professor' : 'Aluno');
  const rawRoom = (roomCodeInput.value.trim() || 'SALA101').toUpperCase().replace(/[^A-Z0-9]/g, '');

  state.myName = rawName;
  state.roomCode = rawRoom || 'SALA101';

  joinBtn.disabled = true;
  lobbyStatus.textContent = 'Ativando microfone e entrando na Sala Online...';

  await setupLocalMicrophone();

  let startX = 44.5;
  let startY = 55.0;
  let assignedDeskId = null;

  if (state.myRole === 'student') {
    const firstDesk = DESKS_CONFIG[0];
    assignedDeskId = firstDesk.id;
    startX = firstDesk.x;
    startY = firstDesk.y - 4.5;
  }

  state.players[state.myId] = {
    id: state.myId,
    peerId: null,
    name: state.myName,
    role: state.myRole,
    avatar: state.myAvatar,
    x: startX,
    y: startY,
    deskId: assignedDeskId,
    micOn: state.micEnabled,
    speaking: false,
    handRaised: false,
    emote: ''
  };

  document.getElementById('hud-room-code').textContent = state.roomCode;
  document.getElementById('my-hud-name').textContent = `${state.myName} (${state.myRole === 'teacher' ? 'Professor' : 'Aluno'})`;
  document.getElementById('my-hud-hint').textContent = state.myRole === 'teacher'
    ? 'Toque em qualquer aluno para abrir e corrigir o caderno dele!'
    : 'Toque em "📓 Meu Caderno" para desenhar ou fazer a lição!';

  updateBoardPermissionUI();
  setupLocalBroadcastChannel();
  setupPeerJSNetwork();

  lobbyOverlay.classList.add('hidden');
  renderAllPlayers();

  // Centraliza o scroll horizontal em telas mobile portrait
  const scrollWrap = document.getElementById('stage-scroll-wrapper');
  if (scrollWrap && scrollWrap.scrollWidth > scrollWrap.clientWidth) {
    scrollWrap.scrollLeft = (scrollWrap.scrollWidth - scrollWrap.clientWidth) / 2;
  }
}

function setupLocalBroadcastChannel() {
  if (!('BroadcastChannel' in window)) return;
  state.bc = new BroadcastChannel('cartoon_classroom_' + state.roomCode);
  state.bc.onmessage = (ev) => {
    handleIncomingNetworkMessage(ev.data);
  };
  state.bc.postMessage({
    type: 'PLAYER_JOIN',
    player: state.players[state.myId]
  });
}

function setupPeerJSNetwork() {
  if (typeof Peer === 'undefined') return;

  const hostPeerId = `toca-aula-${state.roomCode.toLowerCase()}-host`;
  const candidateHost = new Peer(hostPeerId);

  candidateHost.on('open', (id) => {
    state.peer = candidateHost;
    state.isHost = true;
    state.players[state.myId].peerId = id;
    setNetStatus(true);

    candidateHost.on('connection', (conn) => {
      setupDataConnection(conn);
    });

    candidateHost.on('call', (call) => {
      call.answer(state.localStream || undefined);
      call.on('stream', (remoteStream) => {
        attachRemoteAudioStream(call.peer, remoteStream);
      });
    });
  });

  candidateHost.on('error', (err) => {
    if (err.type === 'unavailable-id') {
      connectAsPeerClient(hostPeerId);
    } else {
      console.warn('Aviso PeerJS:', err.type);
    }
  });
}

function connectAsPeerClient(hostPeerId) {
  const clientPeer = new Peer();
  state.peer = clientPeer;
  state.isHost = false;

  clientPeer.on('open', (myPeerId) => {
    state.players[state.myId].peerId = myPeerId;
    setNetStatus(true);

    const conn = clientPeer.connect(hostPeerId, { reliable: true });
    state.hostConn = conn;
    setupDataConnection(conn);

    if (state.localStream) {
      const call = clientPeer.call(hostPeerId, state.localStream);
      if (call) {
        call.on('stream', (remoteStream) => {
          attachRemoteAudioStream(hostPeerId, remoteStream);
        });
      }
    }
  });

  clientPeer.on('call', (call) => {
    call.answer(state.localStream || undefined);
    call.on('stream', (remoteStream) => {
      attachRemoteAudioStream(call.peer, remoteStream);
    });
  });
}

function setupDataConnection(conn) {
  conn.on('open', () => {
    state.clientConns[conn.peer] = conn;

    conn.send({
      type: 'PLAYER_JOIN',
      player: state.players[state.myId]
    });

    if (state.isHost) {
      conn.send({
        type: 'ROOM_SNAPSHOT',
        players: state.players,
        allowStudentsDraw: state.allowStudentsDraw,
        boardDataUrl: canvas.toDataURL('image/png'),
        notebooks: state.notebooks
      });

      if (state.localStream && conn.peer) {
        const call = state.peer.call(conn.peer, state.localStream);
        if (call) {
          call.on('stream', (remoteStream) => {
            attachRemoteAudioStream(conn.peer, remoteStream);
          });
        }
      }
    }
  });

  conn.on('data', (data) => {
    handleIncomingNetworkMessage(data);

    if (state.isHost) {
      Object.values(state.clientConns).forEach(otherConn => {
        if (otherConn.peer !== conn.peer && otherConn.open) {
          otherConn.send(data);
        }
      });
    }
  });

  conn.on('close', () => {
    delete state.clientConns[conn.peer];
    const entry = Object.values(state.players).find(p => p.peerId === conn.peer);
    if (entry && entry.id !== state.myId) {
      delete state.players[entry.id];
      renderAllPlayers();
      if (state.isHost) {
        broadcastMessage({ type: 'PLAYER_LEAVE', playerId: entry.id });
      }
    }
  });
}

function broadcastMessage(msg) {
  if (state.bc) {
    state.bc.postMessage(msg);
  }
  if (state.isHost) {
    Object.values(state.clientConns).forEach(conn => {
      if (conn.open) conn.send(msg);
    });
  } else if (state.hostConn && state.hostConn.open) {
    state.hostConn.send(msg);
  }
}

function handleIncomingNetworkMessage(msg) {
  if (!msg || !msg.type) return;

  switch (msg.type) {
    case 'PLAYER_JOIN': {
      const p = msg.player;
      if (!p || p.id === state.myId) return;

      if (p.role === 'student' && p.deskId) {
        const taken = Object.values(state.players).some(
          existing => existing.id !== p.id && existing.deskId === p.deskId
        );
        if (taken) {
          const freeDesk = DESKS_CONFIG.find(d =>
            !Object.values(state.players).some(ex => ex.deskId === d.id)
          );
          if (freeDesk) {
            p.deskId = freeDesk.id;
            p.x = freeDesk.x;
            p.y = freeDesk.y - 4.5;
          }
        }
      }

      state.players[p.id] = p;
      renderAllPlayers();

      if (state.bc) {
        state.bc.postMessage({
          type: 'PLAYER_UPDATE',
          player: state.players[state.myId]
        });
        if (state.myRole === 'teacher' || state.isHost) {
          state.bc.postMessage({
            type: 'ROOM_SNAPSHOT',
            players: state.players,
            allowStudentsDraw: state.allowStudentsDraw,
            boardDataUrl: canvas.toDataURL('image/png'),
            notebooks: state.notebooks
          });
        }
      }

      if (state.peer && state.localStream && p.peerId && p.peerId !== state.players[state.myId].peerId) {
        const call = state.peer.call(p.peerId, state.localStream);
        if (call) {
          call.on('stream', (remoteStream) => {
            attachRemoteAudioStream(p.peerId, remoteStream);
          });
        }
      }
      break;
    }

    case 'ROOM_SNAPSHOT': {
      if (msg.players) {
        Object.values(msg.players).forEach(p => {
          if (p.id !== state.myId) {
            state.players[p.id] = p;
          }
        });
        const me = state.players[state.myId];
        if (me && me.deskId) {
          const conflict = Object.values(state.players).some(
            other => other.id !== me.id && other.deskId === me.deskId
          );
          if (conflict) {
            const freeDesk = DESKS_CONFIG.find(d =>
              !Object.values(state.players).some(ex => ex.deskId === d.id)
            );
            if (freeDesk) {
              me.deskId = freeDesk.id;
              me.x = freeDesk.x;
              me.y = freeDesk.y - 4.5;
              syncMyPlayerState();
            }
          }
        }
        renderAllPlayers();
      }
      if (typeof msg.allowStudentsDraw === 'boolean') {
        state.allowStudentsDraw = msg.allowStudentsDraw;
        updateBoardPermissionUI();
      }
      if (msg.boardDataUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = msg.boardDataUrl;
      }
      if (msg.notebooks) {
        Object.assign(state.notebooks, msg.notebooks);
      }
      break;
    }

    case 'PLAYER_UPDATE': {
      const p = msg.player;
      if (!p || p.id === state.myId) return;
      state.players[p.id] = p;
      renderAllPlayers();
      break;
    }

    case 'PLAYER_LEAVE': {
      if (msg.playerId && state.players[msg.playerId]) {
        delete state.players[msg.playerId];
        renderAllPlayers();
      }
      break;
    }

    case 'VOICE_ACTIVITY': {
      const target = state.players[msg.playerId];
      if (target) {
        target.speaking = msg.speaking;
        renderAllPlayers();
      }
      break;
    }

    case 'BOARD_STROKE': {
      if (msg.stroke) drawStrokeOnCanvas(msg.stroke);
      break;
    }

    case 'BOARD_TEXT': {
      if (msg.item) drawTextOnCanvas(msg.item);
      break;
    }

    case 'BOARD_CLEAR': {
      clearWhiteboardBlank();
      break;
    }

    case 'BOARD_PERMISSION': {
      state.allowStudentsDraw = Boolean(msg.allowStudentsDraw);
      updateBoardPermissionUI();
      showTemporaryHint(
        state.allowStudentsDraw
          ? '🔓 O professor liberou a lousa para os alunos escreverem!'
          : '🔒 O professor bloqueou a lousa para os alunos.'
      );
      break;
    }

    // Sincronização em tempo real dos Cadernos dos Alunos!
    case 'NOTEBOOK_STROKE': {
      const st = msg.stroke;
      if (!st) break;
      if (state.activeNotebookOwnerId === st.ownerId) {
        drawStrokeOnNotebookCanvas(st);
      }
      break;
    }

    case 'NOTEBOOK_STAMP': {
      const sp = msg.stamp;
      if (!sp) break;
      if (state.activeNotebookOwnerId === sp.ownerId) {
        drawStampOnNotebookCanvas(sp);
      }
      break;
    }

    case 'NOTEBOOK_CLEAR': {
      if (msg.ownerId) {
        delete state.notebooks[msg.ownerId];
        if (state.activeNotebookOwnerId === msg.ownerId) {
          nbCtx.clearRect(0, 0, nbCanvas.width, nbCanvas.height);
        }
      }
      break;
    }

    case 'NOTEBOOK_SNAPSHOT': {
      if (msg.ownerId && msg.dataUrl) {
        state.notebooks[msg.ownerId] = msg.dataUrl;
        if (state.activeNotebookOwnerId === msg.ownerId) {
          const img = new Image();
          img.onload = () => {
            nbCtx.clearRect(0, 0, nbCanvas.width, nbCanvas.height);
            nbCtx.drawImage(img, 0, 0);
          };
          img.src = msg.dataUrl;
        }
      }
      break;
    }

    case 'REQUEST_NOTEBOOK_SNAPSHOT': {
      if (msg.ownerId === state.myId && state.notebooks[state.myId]) {
        broadcastMessage({
          type: 'NOTEBOOK_SNAPSHOT',
          ownerId: state.myId,
          dataUrl: state.notebooks[state.myId]
        });
      }
      break;
    }
  }
}

function syncMyPlayerState() {
  const me = state.players[state.myId];
  if (!me) return;
  broadcastMessage({
    type: 'PLAYER_UPDATE',
    player: me
  });
}

function setNetStatus(online) {
  const dot = document.getElementById('net-status-dot');
  dot.classList.toggle('online', online);
  dot.classList.toggle('connecting', !online);
}

// ----------------------------------------------------------------------------
// 9. CONTROLES DA BARRA SUPERIOR E EMOTES
// ----------------------------------------------------------------------------

function initHudControls() {
  document.getElementById('mic-toggle-btn').addEventListener('click', async () => {
    if (!state.localStream) {
      await setupLocalMicrophone();
      return;
    }
    state.micEnabled = !state.micEnabled;
    state.localStream.getAudioTracks().forEach(t => {
      t.enabled = state.micEnabled;
    });
    updateMicUI();
  });

  document.getElementById('speaker-toggle-btn').addEventListener('click', () => {
    state.speakerEnabled = !state.speakerEnabled;
    const btn = document.getElementById('speaker-toggle-btn');
    const icon = document.getElementById('speaker-icon');
    btn.classList.toggle('speaker-off', !state.speakerEnabled);
    icon.textContent = state.speakerEnabled ? '🔊' : '🔈';

    document.querySelectorAll('#remote-audios-container audio').forEach(a => {
      a.muted = !state.speakerEnabled;
    });
  });

  document.getElementById('raise-hand-btn').addEventListener('click', () => {
    const me = state.players[state.myId];
    if (!me) return;
    me.handRaised = !me.handRaised;
    document.getElementById('raise-hand-btn').classList.toggle('active', me.handRaised);
    syncMyPlayerState();
    renderAllPlayers();
  });

  document.getElementById('copy-link-btn').addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', state.roomCode);
    url.searchParams.set('role', 'student');
    navigator.clipboard.writeText(url.toString()).then(() => {
      const btn = document.getElementById('copy-link-btn');
      const prev = btn.textContent;
      btn.textContent = '✅ Copiado!';
      setTimeout(() => { btn.textContent = prev; }, 2000);
    });
  });

  document.querySelectorAll('.emote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const me = state.players[state.myId];
      if (!me) return;
      me.emote = btn.dataset.emote;
      syncMyPlayerState();
      renderAllPlayers();
      setTimeout(() => {
        if (me.emote === btn.dataset.emote) {
          me.emote = '';
          syncMyPlayerState();
          renderAllPlayers();
        }
      }, 3500);
    });
  });

  window.addEventListener('beforeunload', () => {
    broadcastMessage({ type: 'PLAYER_LEAVE', playerId: state.myId });
  });
}

function showTemporaryHint(text) {
  const hintEl = document.getElementById('my-hud-hint');
  if (!hintEl) return;
  hintEl.textContent = text;
  hintEl.style.color = '#d94336';
  setTimeout(() => {
    hintEl.style.color = '';
    hintEl.textContent = state.myRole === 'teacher'
      ? 'Toque em qualquer aluno para abrir e corrigir o caderno dele!'
      : 'Toque em "📓 Meu Caderno" para desenhar ou fazer a lição!';
  }, 4000);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

// ----------------------------------------------------------------------------
// BOOTSTRAP
// ----------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  renderDesks();
  initLobbyAndPWA();
  initWhiteboardEvents();
  initNotebookSystem();
  initHudControls();
});

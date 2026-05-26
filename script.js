/* =============================================
   CODE CANVAS – Visual HTML CSS Builder
   script.js  –  Full application logic
============================================= */

'use strict';

/* ── STATE ───────────────────────────────── */
const state = {
  elements: [],        // array of element objects
  selected: null,      // currently selected element id
  nextId: 1,
  gridSnap: false,
  dragging: false,
  resizing: false,
};

/* ── DOM REFS ────────────────────────────── */
const canvas         = document.getElementById('canvas');
const canvasHint     = document.getElementById('canvas-hint');
const propertiesEmpty   = document.getElementById('properties-empty');
const propertiesContent = document.getElementById('properties-content');
const propsTag       = document.getElementById('props-tag');
const propsBody      = document.getElementById('props-body');
const contextMenu    = document.getElementById('context-menu');
const codeModal      = document.getElementById('code-modal');
const htmlOutput     = document.getElementById('html-output');
const cssOutput      = document.getElementById('css-output');
const previewFrame   = document.getElementById('preview-frame');
const btnGridSnap    = document.getElementById('btn-grid-snap');
const gridSnapLabel  = document.getElementById('grid-snap-label');
const btnViewCode    = document.getElementById('btn-view-code');
const btnClear       = document.getElementById('btn-clear');
const modalClose     = document.getElementById('modal-close');
const copyHtmlBtn    = document.getElementById('copy-html');
const copyCssBtn     = document.getElementById('copy-css');
const ctxDuplicate   = document.getElementById('ctx-duplicate');
const ctxDelete      = document.getElementById('ctx-delete');

/* ── ELEMENT DEFAULTS ────────────────────── */
const ELEMENT_DEFAULTS = {
  h1:       { tag:'h1',       text:'Heading 1',                     styles:{ fontSize:'40px', fontWeight:'700', color:'#fafafa', backgroundColor:'transparent', padding:'8px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.2', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  h2:       { tag:'h2',       text:'Heading 2',                     styles:{ fontSize:'32px', fontWeight:'700', color:'#fafafa', backgroundColor:'transparent', padding:'8px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.2', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  h3:       { tag:'h3',       text:'Heading 3',                     styles:{ fontSize:'24px', fontWeight:'700', color:'#fafafa', backgroundColor:'transparent', padding:'8px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.3', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  h4:       { tag:'h4',       text:'Heading 4',                     styles:{ fontSize:'20px', fontWeight:'600', color:'#fafafa', backgroundColor:'transparent', padding:'8px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.4', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  h5:       { tag:'h5',       text:'Heading 5',                     styles:{ fontSize:'16px', fontWeight:'600', color:'#fafafa', backgroundColor:'transparent', padding:'8px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.4', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  h6:       { tag:'h6',       text:'Heading 6',                     styles:{ fontSize:'14px', fontWeight:'600', color:'#fafafa', backgroundColor:'transparent', padding:'8px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.4', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  p:        { tag:'p',        text:'This is a paragraph. Double-click to edit.',  styles:{ fontSize:'16px', fontWeight:'400', color:'#fafafa', backgroundColor:'transparent', padding:'8px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.6', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  button:   { tag:'button',   text:'Click Me',                      styles:{ fontSize:'14px', fontWeight:'500', color:'#ffffff', backgroundColor:'#7c3aed', padding:'10px 24px', margin:'0px', borderRadius:'6px', fontFamily:'Arial, sans-serif', textAlign:'center', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.4', textDecoration:'none', display:'inline-block', position:'absolute', cursor:'pointer', fontStyle:'normal' } },
  a:        { tag:'a',        text:'Click this link',               styles:{ fontSize:'14px', fontWeight:'400', color:'#7c3aed', backgroundColor:'transparent', padding:'4px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.6', textDecoration:'underline', display:'inline-block', position:'absolute', cursor:'pointer', fontStyle:'normal' } },
  input:    { tag:'input',    text:'',                              styles:{ fontSize:'14px', fontWeight:'400', color:'#1a1a1a', backgroundColor:'#ffffff', padding:'8px 12px', margin:'0px', borderRadius:'6px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'200px', height:'38px', opacity:'1', border:'1px solid #cccccc', letterSpacing:'normal', lineHeight:'1.4', textDecoration:'none', display:'block', position:'absolute', cursor:'text', fontStyle:'normal' } },
  textarea: { tag:'textarea', text:'Enter text here...',            styles:{ fontSize:'14px', fontWeight:'400', color:'#1a1a1a', backgroundColor:'#ffffff', padding:'8px 12px', margin:'0px', borderRadius:'6px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'220px', height:'100px', opacity:'1', border:'1px solid #cccccc', letterSpacing:'normal', lineHeight:'1.6', textDecoration:'none', display:'block', position:'absolute', cursor:'text', fontStyle:'normal' } },
  img:      { tag:'img',      text:'',                              styles:{ fontSize:'14px', fontWeight:'400', color:'transparent', backgroundColor:'#2a2a3a', padding:'0px', margin:'0px', borderRadius:'4px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'200px', height:'160px', opacity:'1', border:'2px dashed #555', letterSpacing:'normal', lineHeight:'normal', textDecoration:'none', display:'block', position:'absolute', cursor:'move', fontStyle:'normal' } },
  div:      { tag:'div',      text:'Container',                     styles:{ fontSize:'14px', fontWeight:'400', color:'#fafafa', backgroundColor:'rgba(255,255,255,0.05)', padding:'20px', margin:'0px', borderRadius:'8px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'240px', height:'120px', opacity:'1', border:'1px solid rgba(255,255,255,0.1)', letterSpacing:'normal', lineHeight:'1.6', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  ul:       { tag:'ul',       text:'',                              styles:{ fontSize:'14px', fontWeight:'400', color:'#fafafa', backgroundColor:'transparent', padding:'8px 24px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.8', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  ol:       { tag:'ol',       text:'',                              styles:{ fontSize:'14px', fontWeight:'400', color:'#fafafa', backgroundColor:'transparent', padding:'8px 24px', margin:'0px', borderRadius:'0px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'auto', height:'auto', opacity:'1', border:'none', letterSpacing:'normal', lineHeight:'1.8', textDecoration:'none', display:'block', position:'absolute', cursor:'default', fontStyle:'normal' } },
  table:    { tag:'table',    text:'',                              styles:{ fontSize:'13px', fontWeight:'400', color:'#fafafa', backgroundColor:'transparent', padding:'0px', margin:'0px', borderRadius:'4px', fontFamily:'Arial, sans-serif', textAlign:'left', width:'320px', height:'auto', opacity:'1', border:'1px solid rgba(255,255,255,0.2)', letterSpacing:'normal', lineHeight:'1.5', textDecoration:'none', display:'table', position:'absolute', cursor:'default', fontStyle:'normal' } },
};

const HEADING_TAGS = ['h1','h2','h3','h4','h5','h6'];
const HEADING_FONT_SIZES = { h1:'40px', h2:'32px', h3:'24px', h4:'20px', h5:'16px', h6:'14px' };

/* ── FONT OPTIONS ────────────────────────── */
const FONTS = [
  'Arial, sans-serif',
  'Verdana, sans-serif',
  'Georgia, serif',
  'Tahoma, sans-serif',
  "'Trebuchet MS', sans-serif",
  "'Times New Roman', serif",
  "'Courier New', monospace",
  "'Brush Script MT', cursive",
  "'Lucida Handwriting', cursive",
  "'Monotype Corsiva', cursive",
  'Garamond, serif',
  "'Palatino Linotype', Palatino, serif",
  "'Comic Sans MS', cursive",
  'Impact, fantasy',
  'Fantasy',
];
const FONT_LABELS = [
  'Arial','Verdana','Georgia','Tahoma','Trebuchet MS',
  'Times New Roman','Courier New','Brush Script MT',
  'Lucida Handwriting','Monotype Corsiva','Garamond',
  'Palatino','Comic Sans MS','Impact','Fantasy',
];

/* ═══════════════════════════════════════════
   ELEMENT CREATION
═══════════════════════════════════════════ */
function createElement(type, x, y) {
  const def = ELEMENT_DEFAULTS[type];
  if (!def) return;

  const id = 'el_' + (state.nextId++);
  const el = {
    id,
    type,
    tag: def.tag,
    text: def.text,
    x: x || 60,
    y: y || 60,
    styles: { ...def.styles },
  };
  state.elements.push(el);
  renderElement(el);
  selectElement(id);
  updateHint();
}

function renderElement(el) {
  // remove old DOM if re-rendering
  const old = document.getElementById(el.id);
  if (old) old.remove();

  const dom = buildDOMElement(el);
  canvas.appendChild(dom);
  dom.style.left = el.x + 'px';
  dom.style.top  = el.y + 'px';
  attachElementEvents(dom, el);
}

function buildDOMElement(el) {
  let dom;

  if (el.tag === 'img') {
    dom = document.createElement('div');
    dom.className = 'canvas-element img-element';
    dom.id = el.id;
    if (!el.imgSrc) el.imgSrc = '';
    if (!el.imgAlt) el.imgAlt = 'Image';
    applyStyles(dom, el.styles);
    dom.style.overflow = 'hidden';
    dom.style.display = 'flex';
    dom.style.alignItems = 'center';
    dom.style.justifyContent = 'center';
    // Build inner content: placeholder or real image
    buildImageInner(dom, el);

  } else if (el.tag === 'input') {
    dom = document.createElement('div');
    dom.className = 'canvas-element';
    dom.id = el.id;
    dom.innerHTML = `<input type="text" placeholder="Input field..." style="width:100%;height:100%;border:none;outline:none;background:transparent;font-size:inherit;font-family:inherit;color:inherit;padding:0;" />`;
    applyStyles(dom, el.styles);

  } else if (el.tag === 'textarea') {
    dom = document.createElement('div');
    dom.className = 'canvas-element';
    dom.id = el.id;
    dom.innerHTML = `<textarea placeholder="Textarea..." style="width:100%;height:100%;border:none;outline:none;background:transparent;font-size:inherit;font-family:inherit;color:inherit;padding:0;resize:none;">${el.text}</textarea>`;
    applyStyles(dom, el.styles);

  } else if (el.tag === 'ul') {
    dom = document.createElement('ul');
    dom.className = 'canvas-element';
    dom.id = el.id;
    dom.innerHTML = '<li>List item 1</li><li>List item 2</li><li>List item 3</li>';
    applyStyles(dom, el.styles);

  } else if (el.tag === 'ol') {
    dom = document.createElement('ol');
    dom.className = 'canvas-element';
    dom.id = el.id;
    dom.innerHTML = '<li>List item 1</li><li>List item 2</li><li>List item 3</li>';
    applyStyles(dom, el.styles);

  } else if (el.tag === 'table') {
    dom = document.createElement('table');
    dom.className = 'canvas-element';
    dom.id = el.id;
    dom.setAttribute('border','1');
    dom.setAttribute('cellpadding','8');
    dom.setAttribute('cellspacing','0');
    dom.style.borderCollapse = 'collapse';
    dom.innerHTML = `
      <thead><tr style="background:rgba(124,58,237,0.3)">
        <th style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Header 1</th>
        <th style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Header 2</th>
        <th style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Header 3</th>
      </tr></thead>
      <tbody>
        <tr><td style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Cell 1</td><td style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Cell 2</td><td style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Cell 3</td></tr>
        <tr><td style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Cell 4</td><td style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Cell 5</td><td style="border:1px solid rgba(255,255,255,0.2);padding:8px;">Cell 6</td></tr>
      </tbody>`;
    applyStyles(dom, el.styles);

  } else if (el.tag === 'a') {
    // Render as styled span visually — pointer-events blocked so no navigation in builder
    dom = document.createElement('div');
    dom.className = 'canvas-element';
    dom.id = el.id;
    if (!el.href) el.href = 'https://';
    const aInner = document.createElement('a');
    aInner.href = el.href;
    aInner.textContent = el.text || 'Click this link';
    aInner.style.cssText = 'pointer-events:none;display:inline;color:inherit;font-size:inherit;font-family:inherit;font-weight:inherit;text-decoration:inherit;letter-spacing:inherit;line-height:inherit;font-style:inherit;';
    dom.appendChild(aInner);
    applyStyles(dom, el.styles);
    dom.style.display = 'inline-block';
    dom.style.cursor = 'move';

  } else {
    dom = document.createElement(el.tag);
    dom.className = 'canvas-element';
    dom.id = el.id;
    dom.textContent = el.text;
    applyStyles(dom, el.styles);
  }

  // resize handle
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  dom.appendChild(handle);

  return dom;
}

function applyStyles(dom, styles) {
  dom.style.position    = 'absolute';
  dom.style.fontSize    = styles.fontSize    || '14px';
  dom.style.fontWeight  = styles.fontWeight  || '400';
  dom.style.color       = styles.color       || '#fafafa';
  dom.style.backgroundColor = styles.backgroundColor || 'transparent';
  dom.style.padding     = styles.padding     || '8px';
  dom.style.margin      = styles.margin      || '0px';
  dom.style.borderRadius = styles.borderRadius|| '0px';
  dom.style.fontFamily  = styles.fontFamily  || 'Arial, sans-serif';
  dom.style.textAlign   = styles.textAlign   || 'left';
  dom.style.width       = styles.width       || 'auto';
  dom.style.height      = styles.height      || 'auto';
  dom.style.opacity     = styles.opacity     || '1';
  dom.style.border      = styles.border      || 'none';
  dom.style.letterSpacing = styles.letterSpacing || 'normal';
  dom.style.lineHeight  = styles.lineHeight  || 'normal';
  dom.style.textDecoration = styles.textDecoration || 'none';
  dom.style.display     = styles.display     || 'block';
  dom.style.cursor      = styles.cursor      || 'move';
  dom.style.fontStyle   = styles.fontStyle   || 'normal';
}

/* ── Image helpers ───────────────────────── */
function getSvgPlaceholder() {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='160'%3E%3Crect width='200' height='160' fill='%232a2a3a'/%3E%3Crect x='60' y='45' width='80' height='55' rx='4' fill='none' stroke='%23666' stroke-width='2'/%3E%3Ccircle cx='80' cy='65' r='8' fill='%23666'/%3E%3Cpolyline points='60,95 85,75 105,88 125,68 140,100' stroke='%23666' stroke-width='2' fill='none'/%3E%3Ctext x='100' y='130' text-anchor='middle' font-family='Arial' font-size='12' fill='%23888'%3EImage%3C/text%3E%3C/svg%3E";
}

// Build / rebuild the inner content of an image element wrapper
function buildImageInner(dom, el) {
  // Clear previous inner content (but keep resize handle)
  const handle = dom.querySelector('.resize-handle');
  dom.innerHTML = '';
  if (handle) dom.appendChild(handle);

  if (el.imgSrc) {
    // Show the real image
    const img = document.createElement('img');
    img.src = el.imgSrc;
    img.alt = el.imgAlt || 'Image';
    img.draggable = false;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;position:absolute;top:0;left:0;';
    dom.style.position = 'absolute';
    dom.style.overflow = 'hidden';
    dom.insertBefore(img, handle || null);

    // Small "change image" button overlay (top-right)
    const changeBtn = document.createElement('div');
    changeBtn.className = 'img-change-btn';
    changeBtn.title = 'Change image';
    changeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 10L5 6L8 9L10 7L13 10" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="4" cy="4" r="1.5" fill="white"/>
      <rect x="0.7" y="0.7" width="12.6" height="12.6" rx="1.5" stroke="white" stroke-width="1.2"/>
    </svg>`;
    changeBtn.style.cssText = 'position:absolute;top:6px;right:6px;width:26px;height:26px;background:rgba(0,0,0,0.55);border-radius:5px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;z-index:5;';
    dom.appendChild(changeBtn);
    dom.addEventListener('mouseenter', () => { changeBtn.style.opacity = '1'; });
    dom.addEventListener('mouseleave', () => { changeBtn.style.opacity = '0'; });
    changeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerImageUpload(dom, el);
    });

  } else {
    // Show the "click + to upload" placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'img-placeholder';
    placeholder.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer;position:absolute;top:0;left:0;';
    placeholder.innerHTML = `
      <div class="img-plus-btn" style="width:48px;height:48px;border-radius:50%;background:rgba(124,58,237,0.2);border:2px dashed #7c3aed;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <line x1="11" y1="4" x2="11" y2="18" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="4" y1="11" x2="18" y2="11" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </div>
      <span style="font-size:12px;color:#8888a8;font-family:sans-serif;pointer-events:none;">Click to upload image</span>`;
    placeholder.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerImageUpload(dom, el);
    });
    placeholder.querySelector('.img-plus-btn').addEventListener('mouseenter', function() {
      this.style.background = 'rgba(124,58,237,0.35)';
      this.style.borderColor = '#a78bfa';
    });
    placeholder.querySelector('.img-plus-btn').addEventListener('mouseleave', function() {
      this.style.background = 'rgba(124,58,237,0.2)';
      this.style.borderColor = '#7c3aed';
    });
    dom.insertBefore(placeholder, handle || null);
  }
}

// Hidden file input for image upload (reused for all images)
const _imgFileInput = document.createElement('input');
_imgFileInput.type = 'file';
_imgFileInput.accept = 'image/*';
_imgFileInput.style.display = 'none';
document.body.appendChild(_imgFileInput);
let _imgUploadTarget = null; // { dom, el }

function triggerImageUpload(dom, el) {
  _imgUploadTarget = { dom, el };
  _imgFileInput.value = '';
  _imgFileInput.click();
}

_imgFileInput.addEventListener('change', () => {
  if (!_imgFileInput.files || !_imgFileInput.files[0]) return;
  if (!_imgUploadTarget) return;
  const { dom, el } = _imgUploadTarget;
  const reader = new FileReader();
  reader.onload = (e) => {
    el.imgSrc = e.target.result; // base64 data URL
    buildImageInner(dom, el);
    // update the alt field in properties panel if open
    updatePropInput('imgSrc', el.imgSrc.substring(0, 40) + '...');
    // reattach resize handle events
    attachResizeHandle(dom, el);
  };
  reader.readAsDataURL(_imgFileInput.files[0]);
});

/* ═══════════════════════════════════════════
   DRAG SYSTEM
═══════════════════════════════════════════ */
function attachElementEvents(dom, el) {
  let dragStartX, dragStartY, startLeft, startTop;
  let resizeStartX, resizeStartY, startW, startH;

  const handle = dom.querySelector('.resize-handle');

  // ── RESIZE ──
  if (handle) {
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      state.resizing = true;
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      startW = dom.offsetWidth;
      startH = dom.offsetHeight;

      function onMouseMove(me) {
        const dw = me.clientX - resizeStartX;
        const dh = me.clientY - resizeStartY;
        const newW = Math.max(40, startW + dw);
        const newH = Math.max(20, startH + dh);
        dom.style.width  = newW + 'px';
        dom.style.height = newH + 'px';
        el.styles.width  = newW + 'px';
        el.styles.height = newH + 'px';
        updatePropInput('width',  el.styles.width);
        updatePropInput('height', el.styles.height);
      }
      function onMouseUp() {
        state.resizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  // ── DRAG ──
  dom.addEventListener('mousedown', (e) => {
    if (state.resizing) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (dom.classList.contains('editing')) return;
    if (e.button === 2) return; // right click
    e.preventDefault();

    selectElement(el.id);

    dragStartX = e.clientX;
    dragStartY = e.clientY;
    startLeft  = el.x;
    startTop   = el.y;
    state.dragging = true;

    document.body.style.userSelect = 'none';

    function onMouseMove(me) {
      let dx = me.clientX - dragStartX;
      let dy = me.clientY - dragStartY;

      let newX = startLeft + dx;
      let newY = startTop  + dy;

      if (state.gridSnap) {
        newX = Math.round(newX / 24) * 24;
        newY = Math.round(newY / 24) * 24;
      }

      el.x = Math.max(0, newX);
      el.y = Math.max(0, newY);
      dom.style.left = el.x + 'px';
      dom.style.top  = el.y + 'px';
    }

    function onMouseUp() {
      state.dragging = false;
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // ── DOUBLE-CLICK: inline edit ──
  dom.addEventListener('dblclick', (e) => {
    if (el.tag === 'img' || el.tag === 'input' || el.tag === 'textarea' ||
        el.tag === 'ul'  || el.tag === 'ol'   || el.tag === 'table') return;
    e.stopPropagation();
    if (el.tag === 'a') {
      // Edit the inner <a> text via a prompt for simplicity
      const newText = prompt('Edit link text:', el.text);
      if (newText !== null) {
        el.text = newText;
        const innerA = dom.querySelector('a');
        if (innerA) innerA.textContent = newText;
        updatePropInput('text', newText);
      }
      return;
    }
    startInlineEdit(dom, el);
  });

  // ── RIGHT CLICK: context menu ──
  dom.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    selectElement(el.id);
    showContextMenu(e.clientX, e.clientY);
  });

  // ── CLICK: select ──
  dom.addEventListener('click', (e) => {
    e.stopPropagation();
    selectElement(el.id);
  });
}

/* ═══════════════════════════════════════════
   INLINE EDITING
═══════════════════════════════════════════ */
function startInlineEdit(dom, el) {
  dom.classList.add('editing');
  dom.contentEditable = 'true';
  dom.focus();

  // place cursor at end
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(dom);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);

  function stopEdit(e) {
    if (e && e.target === dom) return;
    dom.contentEditable = 'false';
    dom.classList.remove('editing');
    // remove resize handle from text content
    const savedHandle = dom.querySelector('.resize-handle');
    let content = dom.innerHTML;
    dom.textContent = dom.innerText.trim();
    el.text = dom.textContent;
    // re-add handle
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    dom.appendChild(handle);
    // re-attach resize
    attachResizeHandle(dom, el);
    document.removeEventListener('mousedown', stopEdit);
    // update content prop field
    updatePropInput('text', el.text);
  }

  dom.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { stopEdit(); return; }
    // allow arrow keys without bubbling
    e.stopPropagation();
  }, { once: false });

  setTimeout(() => {
    document.addEventListener('mousedown', stopEdit);
  }, 50);
}

function attachResizeHandle(dom, el) {
  const oldHandle = dom.querySelector('.resize-handle');
  if (oldHandle) oldHandle.remove();
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  dom.appendChild(handle);

  let resizeStartX, resizeStartY, startW, startH;
  handle.addEventListener('mousedown', (e) => {
    e.stopPropagation(); e.preventDefault();
    state.resizing = true;
    resizeStartX = e.clientX; resizeStartY = e.clientY;
    startW = dom.offsetWidth; startH = dom.offsetHeight;
    function onMM(me) {
      const nw = Math.max(40, startW + me.clientX - resizeStartX);
      const nh = Math.max(20, startH + me.clientY - resizeStartY);
      dom.style.width = nw+'px'; dom.style.height = nh+'px';
      el.styles.width = nw+'px'; el.styles.height = nh+'px';
      updatePropInput('width', el.styles.width);
      updatePropInput('height', el.styles.height);
    }
    function onMU() {
      state.resizing = false;
      document.removeEventListener('mousemove', onMM);
      document.removeEventListener('mouseup', onMU);
    }
    document.addEventListener('mousemove', onMM);
    document.addEventListener('mouseup', onMU);
  });
}

/* ═══════════════════════════════════════════
   SELECTION
═══════════════════════════════════════════ */
function selectElement(id) {
  // deselect previous
  if (state.selected) {
    const prevDom = document.getElementById(state.selected);
    if (prevDom) prevDom.classList.remove('selected');
  }
  state.selected = id;
  const dom = document.getElementById(id);
  if (dom) dom.classList.add('selected');

  const el = state.elements.find(e => e.id === id);
  if (el) buildPropertiesPanel(el);
}

function deselectAll() {
  if (state.selected) {
    const dom = document.getElementById(state.selected);
    if (dom) dom.classList.remove('selected');
  }
  state.selected = null;
  propertiesEmpty.style.display   = 'flex';
  propertiesContent.style.display = 'none';
}

/* ═══════════════════════════════════════════
   PROPERTIES PANEL
═══════════════════════════════════════════ */
function buildPropertiesPanel(el) {
  propertiesEmpty.style.display   = 'none';
  propertiesContent.style.display = 'flex';
  propsTag.textContent = el.tag;
  propsBody.innerHTML = '';

  const s = el.styles;
  const isHeading = HEADING_TAGS.includes(el.tag);
  const isMedia   = el.tag === 'img';
  const isForm    = el.tag === 'input' || el.tag === 'textarea';
  const isList    = el.tag === 'ul' || el.tag === 'ol';
  const isTable   = el.tag === 'table';

  // ── Heading type ──
  if (isHeading) {
    addSelect('Heading Type', 'headingType', el.tag,
      ['h1','h2','h3','h4','h5','h6'], ['H1','H2','H3','H4','H5','H6'],
      (val) => {
        changeHeadingType(el, val);
      });
    addDivider();
  }

  // ── Image-specific ──
  if (isMedia) {
    // "Choose File" button
    addImageUploadButton(el);
    addInput('Alt Text', 'imgAlt', el.imgAlt || 'Image', (val) => {
      el.imgAlt = val;
      const dom = document.getElementById(el.id);
      if (dom) { const imgTag = dom.querySelector('img'); if (imgTag) imgTag.alt = val; }
    });
    addDivider();
  }

  // ── Link-specific ──
  if (el.tag === 'a') {
    addInput('Link Text', 'text', el.text || 'Click this link', (val) => {
      el.text = val;
      const dom = document.getElementById(el.id);
      if (dom) { const aTag = dom.querySelector('a'); if (aTag) aTag.textContent = val; }
    });
    addInput('Link URL', 'href', el.href || 'https://', (val) => {
      el.href = val;
      const dom = document.getElementById(el.id);
      if (dom) { const aTag = dom.querySelector('a'); if (aTag) aTag.href = val; }
    });
    // Open in new tab toggle
    addSelect('Open in', 'linkTarget', el.linkTarget || '_self',
      ['_self', '_blank'], ['Same Tab', 'New Tab'],
      (val) => {
        el.linkTarget = val;
        const dom = document.getElementById(el.id);
        if (dom) { const aTag = dom.querySelector('a'); if (aTag) aTag.target = val; }
      });
    addDivider();
  }

  // ── Content (text) ──
  if (!isMedia && !isForm && !isList && !isTable) {
    addTextarea('Content', 'text', el.text, (val) => {
      el.text = val;
      const dom = document.getElementById(el.id);
      if (dom) {
        if (el.tag === 'a') {
          // update inner anchor text
          const aTag = dom.querySelector('a');
          if (aTag) aTag.textContent = val;
        } else {
          // preserve resize handle
          dom.textContent = val;
          const h = document.createElement('div');
          h.className = 'resize-handle';
          dom.appendChild(h);
          attachResizeHandle(dom, el);
        }
      }
    });
    addDivider();
  }

  // ── Color ──
  if (!isMedia) {
    addColor('Color', 'color', s.color || '#fafafa', (val) => {
      s.color = val;
      styleEl(el, 'color', val);
      // for anchor, also update the inner <a> tag
      if (el.tag === 'a') {
        const dom = document.getElementById(el.id);
        if (dom) { const aTag = dom.querySelector('a'); if (aTag) aTag.style.color = val; }
      }
    });

    addColor('Background', 'backgroundColor', s.backgroundColor || 'transparent', (val) => {
      s.backgroundColor = val;
      styleEl(el, 'backgroundColor', val);
    });
    addDivider();
  }

  // ── Font Size ──
  if (!isMedia) {
    const fsNum = parseInt(s.fontSize) || 14;
    addSlider('Font Size', 'fontSize', fsNum, 8, 120, 1, 'px', (val) => {
      s.fontSize = val + 'px';
      styleEl(el, 'fontSize', s.fontSize);
    });
  }

  // ── Font Weight ──
  if (!isMedia) {
    addSelect('Font Weight', 'fontWeight', s.fontWeight || '400',
      ['100','200','300','400','500','600','700','800','900'],
      ['100 – Thin','200 – Extra Light','300 – Light','400 – Regular','500 – Medium','600 – Semi Bold','700 – Bold','800 – Extra Bold','900 – Black'],
      (val) => { s.fontWeight = val; styleEl(el, 'fontWeight', val); });
  }

  // ── Font Family ──
  if (!isMedia) {
    addSelect('Font Family', 'fontFamily', s.fontFamily || 'Arial, sans-serif',
      FONTS, FONT_LABELS,
      (val) => { s.fontFamily = val; styleEl(el, 'fontFamily', val); });
  }

  // ── Text Align ──
  if (!isMedia) {
    addSelect('Text Align', 'textAlign', s.textAlign || 'left',
      ['left','center','right','justify'], ['Left','Center','Right','Justify'],
      (val) => { s.textAlign = val; styleEl(el, 'textAlign', val); });
  }

  addDivider();

  // ── Width / Height ──
  addInput('Width',  'width',  s.width  || 'auto', (val) => { s.width  = val; styleEl(el, 'width',  val); });
  addInput('Height', 'height', s.height || 'auto', (val) => { s.height = val; styleEl(el, 'height', val); });

  // ── Padding slider ──
  const padNum = parseInt(s.padding) || 8;
  addSlider('Padding', 'padding', padNum, 0, 80, 1, 'px', (val) => {
    s.padding = val + 'px';
    styleEl(el, 'padding', s.padding);
  });

  // ── Margin ──
  addInput('Margin', 'margin', s.margin || '0px', (val) => { s.margin = val; styleEl(el, 'margin', val); });

  // ── Border Radius slider ──
  const brNum = parseInt(s.borderRadius) || 0;
  addSlider('Border Radius', 'borderRadius', brNum, 0, 100, 1, 'px', (val) => {
    s.borderRadius = val + 'px';
    styleEl(el, 'borderRadius', s.borderRadius);
  });

  addDivider();

  // ── Border ──
  addInput('Border', 'border', s.border || 'none', (val) => { s.border = val; styleEl(el, 'border', val); });

  // ── Box Shadow ──
  addInput('Box Shadow', 'boxShadow', s.boxShadow || 'none', (val) => { s.boxShadow = val; styleEl(el, 'boxShadow', val); });

  // ── Opacity slider ──
  const opNum = parseFloat(s.opacity !== undefined ? s.opacity : 1);
  addSlider('Opacity', 'opacity', Math.round(opNum * 100), 0, 100, 1, '%', (val) => {
    s.opacity = (val / 100).toString();
    styleEl(el, 'opacity', s.opacity);
  });

  addDivider();

  // ── Display ──
  addSelect('Display', 'display', s.display || 'block',
    ['block','inline-block','inline','flex','none'],
    ['Block','Inline-Block','Inline','Flex','None'],
    (val) => { s.display = val; styleEl(el, 'display', val); });

  // ── Cursor ──
  addSelect('Cursor', 'cursor', s.cursor || 'default',
    ['default','pointer','text','move','not-allowed','grab','crosshair','auto'],
    ['Default','Pointer','Text','Move','Not Allowed','Grab','Crosshair','Auto'],
    (val) => { s.cursor = val; styleEl(el, 'cursor', val); });

  addDivider();

  // ── Text Decoration ──
  if (!isMedia) {
    addSelect('Text Decoration', 'textDecoration', s.textDecoration || 'none',
      ['none','underline','overline','line-through'],
      ['None','Underline','Overline','Line Through'],
      (val) => { s.textDecoration = val; styleEl(el, 'textDecoration', val); });

    // ── Font Style ──
    addSelect('Font Style', 'fontStyle', s.fontStyle || 'normal',
      ['normal','italic','oblique'],['Normal','Italic','Oblique'],
      (val) => { s.fontStyle = val; styleEl(el, 'fontStyle', val); });
  }

  // ── Line Height ──
  addInput('Line Height', 'lineHeight', s.lineHeight || 'normal', (val) => { s.lineHeight = val; styleEl(el, 'lineHeight', val); });

  // ── Letter Spacing ──
  addInput('Letter Spacing', 'letterSpacing', s.letterSpacing || 'normal', (val) => { s.letterSpacing = val; styleEl(el, 'letterSpacing', val); });

  // ── Z-Index ──
  addInput('Z-Index', 'zIndex', s.zIndex || 'auto', (val) => { s.zIndex = val; styleEl(el, 'zIndex', val); });

  // ── Overflow ──
  addSelect('Overflow', 'overflow', s.overflow || 'visible',
    ['visible','hidden','scroll','auto'],['Visible','Hidden','Scroll','Auto'],
    (val) => { s.overflow = val; styleEl(el, 'overflow', val); });
}

// ── Property helpers ──────────────────────

function addGroup(label) {
  const g = document.createElement('div');
  g.className = 'prop-group';
  const lbl = document.createElement('label');
  lbl.className = 'prop-label';
  lbl.textContent = label;
  g.appendChild(lbl);
  propsBody.appendChild(g);
  return g;
}

function addInput(label, key, val, onChange) {
  const g = addGroup(label);
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'prop-input';
  inp.value = val;
  inp.dataset.propKey = key;
  inp.addEventListener('input', () => onChange(inp.value));
  g.appendChild(inp);
}

function addTextarea(label, key, val, onChange) {
  const g = addGroup(label);
  const ta = document.createElement('textarea');
  ta.className = 'prop-textarea';
  ta.value = val;
  ta.dataset.propKey = key;
  ta.addEventListener('input', () => onChange(ta.value));
  g.appendChild(ta);
}

function addSelect(label, key, val, opts, optLabels, onChange) {
  const g = addGroup(label);
  const sel = document.createElement('select');
  sel.className = 'prop-select';
  sel.dataset.propKey = key;
  opts.forEach((o, i) => {
    const opt = document.createElement('option');
    opt.value = o;
    opt.textContent = optLabels[i];
    if (o === val) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => onChange(sel.value));
  g.appendChild(sel);
}

function addColor(label, key, val, onChange) {
  const g = addGroup(label);
  const row = document.createElement('div');
  row.className = 'prop-color-row';
  const swatch = document.createElement('div');
  swatch.className = 'prop-color-swatch';
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  // only set color picker if valid hex
  try { colorInput.value = val.startsWith('#') ? val : '#000000'; } catch(e) { colorInput.value = '#000000'; }
  swatch.appendChild(colorInput);
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.className = 'prop-color-text';
  textInput.value = val;
  textInput.dataset.propKey = key;

  colorInput.addEventListener('input', () => {
    textInput.value = colorInput.value;
    onChange(colorInput.value);
  });
  textInput.addEventListener('input', () => {
    onChange(textInput.value);
    try { colorInput.value = textInput.value; } catch(e) {}
  });

  row.appendChild(swatch);
  row.appendChild(textInput);
  g.appendChild(row);
}

function addSlider(label, key, val, min, max, step, unit, onChange) {
  const g = addGroup(label);
  const row = document.createElement('div');
  row.className = 'prop-slider-row';
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'prop-slider';
  slider.min = min; slider.max = max; slider.step = step;
  slider.value = val;
  const dispVal = document.createElement('span');
  dispVal.className = 'prop-slider-val';
  dispVal.textContent = val + unit;
  slider.addEventListener('input', () => {
    dispVal.textContent = slider.value + unit;
    onChange(Number(slider.value));
  });
  row.appendChild(slider);
  row.appendChild(dispVal);
  g.appendChild(row);
}

function addDivider() {
  const d = document.createElement('div');
  d.className = 'prop-divider';
  propsBody.appendChild(d);
}

// ── Apply style to DOM element ──
function styleEl(el, prop, val) {
  const dom = document.getElementById(el.id);
  if (dom) dom.style[prop] = val;
}

// ── Update single prop input ──
function updatePropInput(key, val) {
  const inp = propsBody.querySelector(`[data-prop-key="${key}"]`);
  if (inp) inp.value = val;
}

/* ═══════════════════════════════════════════
   HEADING TYPE CHANGE
═══════════════════════════════════════════ */
function changeHeadingType(el, newTag) {
  const oldDom = document.getElementById(el.id);
  if (!oldDom) return;

  const x = el.x, y = el.y;
  const text = el.text;

  el.tag = newTag;
  el.styles.fontSize = HEADING_FONT_SIZES[newTag] || '16px';

  // update font size slider visually
  updatePropInput('fontSize', el.styles.fontSize);

  oldDom.remove();
  renderElement(el);

  const newDom = document.getElementById(el.id);
  if (newDom) newDom.classList.add('selected');

  propsTag.textContent = newTag;
}

/* ═══════════════════════════════════════════
   CONTEXT MENU
═══════════════════════════════════════════ */
function showContextMenu(x, y) {
  contextMenu.style.left = x + 'px';
  contextMenu.style.top  = y + 'px';
  contextMenu.classList.add('visible');
}
function hideContextMenu() { contextMenu.classList.remove('visible'); }

ctxDuplicate.addEventListener('click', () => {
  hideContextMenu();
  if (!state.selected) return;
  const el = state.elements.find(e => e.id === state.selected);
  if (!el) return;
  const newEl = {
    id: 'el_' + (state.nextId++),
    type: el.type, tag: el.tag, text: el.text,
    x: el.x + 24, y: el.y + 24,
    styles: { ...el.styles },
  };
  state.elements.push(newEl);
  renderElement(newEl);
  selectElement(newEl.id);
});

ctxDelete.addEventListener('click', () => {
  hideContextMenu();
  deleteSelected();
});

function deleteSelected() {
  if (!state.selected) return;
  const dom = document.getElementById(state.selected);
  if (dom) dom.remove();
  state.elements = state.elements.filter(e => e.id !== state.selected);
  state.selected = null;
  propertiesEmpty.style.display   = 'flex';
  propertiesContent.style.display = 'none';
  updateHint();
}

/* ═══════════════════════════════════════════
   ELEMENT SIDEBAR CLICKS
═══════════════════════════════════════════ */
document.querySelectorAll('.element-item').forEach(item => {
  item.addEventListener('click', () => {
    const type = item.dataset.type;
    // place near center of visible canvas
    const wrapper = document.querySelector('.canvas-wrapper');
    const rect = wrapper.getBoundingClientRect();
    const cx = wrapper.scrollLeft + rect.width / 2 - 80;
    const cy = wrapper.scrollTop  + rect.height / 2 - 40;
    createElement(type, Math.round(cx), Math.round(cy));
  });
});

/* ═══════════════════════════════════════════
   CANVAS CLICK (deselect)
═══════════════════════════════════════════ */
canvas.addEventListener('click', (e) => {
  if (e.target === canvas) deselectAll();
});

document.addEventListener('click', (e) => {
  if (!contextMenu.contains(e.target)) hideContextMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    // only delete if not editing text
    const active = document.activeElement;
    if (active && (active.isContentEditable || active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;
    deleteSelected();
  }
  if (e.key === 'Escape') { deselectAll(); hideContextMenu(); }
});

/* ═══════════════════════════════════════════
   GRID SNAP
═══════════════════════════════════════════ */
btnGridSnap.addEventListener('click', () => {
  state.gridSnap = !state.gridSnap;
  gridSnapLabel.textContent = state.gridSnap ? 'Grid Snap On' : 'Grid Snap Off';
  btnGridSnap.classList.toggle('active', state.gridSnap);
});

/* ═══════════════════════════════════════════
   CLEAR CANVAS
═══════════════════════════════════════════ */
btnClear.addEventListener('click', () => {
  if (!state.elements.length) return;
  if (!confirm('Clear the canvas? This cannot be undone.')) return;
  state.elements.forEach(el => {
    const dom = document.getElementById(el.id);
    if (dom) dom.remove();
  });
  state.elements = [];
  state.selected = null;
  propertiesEmpty.style.display   = 'flex';
  propertiesContent.style.display = 'none';
  updateHint();
});

/* ═══════════════════════════════════════════
   HINT
═══════════════════════════════════════════ */
function updateHint() {
  canvasHint.style.display = state.elements.length === 0 ? 'block' : 'none';
}

/* ═══════════════════════════════════════════
   CODE GENERATION
═══════════════════════════════════════════ */
function generateHTML() {
  if (!state.elements.length) return '<!-- No elements on canvas -->';

  let lines = [];
  lines.push('<!DOCTYPE html>');
  lines.push('<html lang="en">');
  lines.push('<head>');
  lines.push('  <meta charset="UTF-8" />');
  lines.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
  lines.push('  <title>My Page</title>');
  lines.push('  <link rel="stylesheet" href="style.css" />');
  lines.push('</head>');
  lines.push('<body>');

  state.elements.forEach(el => {
    const cls = el.id;
    switch(el.tag) {
      case 'h1': case 'h2': case 'h3':
      case 'h4': case 'h5': case 'h6':
        lines.push(`  <${el.tag} class="${cls}">${escHtml(el.text)}</${el.tag}>`);
        break;
      case 'p':
        lines.push(`  <p class="${cls}">${escHtml(el.text)}</p>`);
        break;
      case 'button':
        lines.push(`  <button class="${cls}">${escHtml(el.text)}</button>`);
        break;
      case 'a':
        lines.push(`  <a href="#" class="${cls}">${escHtml(el.text)}</a>`);
        break;
      case 'input':
        lines.push(`  <input type="text" class="${cls}" placeholder="Input field..." />`);
        break;
      case 'textarea':
        lines.push(`  <textarea class="${cls}">${escHtml(el.text)}</textarea>`);
        break;
      case 'img':
        lines.push(`  <img src="${el.imgSrc || 'your-image.jpg'}" alt="${el.imgAlt || 'Image'}" class="${cls}" />`);
        break;
        break;
      case 'div':
        lines.push(`  <div class="${cls}">${escHtml(el.text)}</div>`);
        break;
      case 'ul':
        lines.push(`  <ul class="${cls}">`);
        lines.push(`    <li>List item 1</li>`);
        lines.push(`    <li>List item 2</li>`);
        lines.push(`    <li>List item 3</li>`);
        lines.push(`  </ul>`);
        break;
      case 'ol':
        lines.push(`  <ol class="${cls}">`);
        lines.push(`    <li>List item 1</li>`);
        lines.push(`    <li>List item 2</li>`);
        lines.push(`    <li>List item 3</li>`);
        lines.push(`  </ol>`);
        break;
      case 'table':
        lines.push(`  <table class="${cls}" border="1" cellpadding="8" cellspacing="0">`);
        lines.push(`    <thead><tr>`);
        lines.push(`      <th>Header 1</th><th>Header 2</th><th>Header 3</th>`);
        lines.push(`    </tr></thead>`);
        lines.push(`    <tbody>`);
        lines.push(`      <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>`);
        lines.push(`      <tr><td>Cell 4</td><td>Cell 5</td><td>Cell 6</td></tr>`);
        lines.push(`    </tbody>`);
        lines.push(`  </table>`);
        break;
    }
  });

  lines.push('</body>');
  lines.push('</html>');
  return lines.join('\n');
}

function generateCSS() {
  if (!state.elements.length) return '/* No elements on canvas */';

  let lines = [];
  lines.push('/* Generated by Code Canvas */');
  lines.push('');
  lines.push('* { box-sizing: border-box; margin: 0; padding: 0; }');
  lines.push('');
  lines.push('body {');
  lines.push('  position: relative;');
  lines.push('  min-height: 100vh;');
  lines.push('}');
  lines.push('');

  state.elements.forEach(el => {
    const s = el.styles;
    const cls = el.id;
    lines.push(`.${cls} {`);
    lines.push(`  position: absolute;`);
    lines.push(`  left: ${el.x}px;`);
    lines.push(`  top: ${el.y}px;`);
    if (s.width  && s.width  !== 'auto') lines.push(`  width: ${s.width};`);
    if (s.height && s.height !== 'auto') lines.push(`  height: ${s.height};`);
    lines.push(`  font-size: ${s.fontSize || '14px'};`);
    lines.push(`  font-weight: ${s.fontWeight || '400'};`);
    lines.push(`  font-family: ${s.fontFamily || 'Arial, sans-serif'};`);
    lines.push(`  color: ${s.color || '#000000'};`);
    if (s.backgroundColor && s.backgroundColor !== 'transparent') lines.push(`  background-color: ${s.backgroundColor};`);
    lines.push(`  padding: ${s.padding || '8px'};`);
    if (s.margin && s.margin !== '0px') lines.push(`  margin: ${s.margin};`);
    if (s.borderRadius && s.borderRadius !== '0px') lines.push(`  border-radius: ${s.borderRadius};`);
    if (s.border && s.border !== 'none') lines.push(`  border: ${s.border};`);
    lines.push(`  text-align: ${s.textAlign || 'left'};`);
    if (s.lineHeight && s.lineHeight !== 'normal') lines.push(`  line-height: ${s.lineHeight};`);
    if (s.letterSpacing && s.letterSpacing !== 'normal') lines.push(`  letter-spacing: ${s.letterSpacing};`);
    if (s.textDecoration && s.textDecoration !== 'none') lines.push(`  text-decoration: ${s.textDecoration};`);
    if (s.fontStyle && s.fontStyle !== 'normal') lines.push(`  font-style: ${s.fontStyle};`);
    if (s.opacity && s.opacity !== '1') lines.push(`  opacity: ${s.opacity};`);
    if (s.boxShadow && s.boxShadow !== 'none') lines.push(`  box-shadow: ${s.boxShadow};`);
    if (s.overflow && s.overflow !== 'visible') lines.push(`  overflow: ${s.overflow};`);
    if (s.display && s.display !== 'block') lines.push(`  display: ${s.display};`);
    if (s.cursor && s.cursor !== 'default') lines.push(`  cursor: ${s.cursor};`);
    if (s.zIndex && s.zIndex !== 'auto') lines.push(`  z-index: ${s.zIndex};`);
    if (el.tag === 'table') lines.push(`  border-collapse: collapse;`);
    lines.push(`}`);
    lines.push('');
  });

  return lines.join('\n');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════════
   SYNTAX HIGHLIGHT (simple)
═══════════════════════════════════════════ */
function highlightHTML(code) {
  return escHtml(code)
    .replace(/(&lt;\/?[\w!]+)/g, '<span class="tag">$1</span>')
    .replace(/([\w-]+=)(&quot;[^&]*&quot;)/g, '<span class="attr">$1</span><span class="val">$2</span>');
}
function highlightCSS(code) {
  return escHtml(code)
    .replace(/(\/\*.*?\*\/)/gs, '<span class="cmt">$1</span>')
    .replace(/([\w-]+)(\s*:)/g, '<span class="attr">$1</span>$2');
}

/* ═══════════════════════════════════════════
   CODE MODAL
═══════════════════════════════════════════ */
btnViewCode.addEventListener('click', () => {
  const html = generateHTML();
  const css  = generateCSS();
  htmlOutput.innerHTML = highlightHTML(html);
  cssOutput.innerHTML  = highlightCSS(css);

  // preview
  const previewContent = `<!DOCTYPE html><html><head><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; position: relative; min-height: 600px; }
    ${css.replace(/\/\*.*?\*\//gs,'')}
  </style></head><body>${generateBodyHTML()}</body></html>`;
  previewFrame.srcdoc = previewContent;

  codeModal.classList.add('visible');
  // reset tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-tab="html"]').classList.add('active');
  document.getElementById('tab-html').classList.add('active');
});

function generateBodyHTML() {
  let out = '';
  state.elements.forEach(el => {
    const cls = el.id;
    switch(el.tag) {
      case 'h1': case 'h2': case 'h3':
      case 'h4': case 'h5': case 'h6':
        out += `<${el.tag} class="${cls}">${escHtml(el.text)}</${el.tag}>`; break;
      case 'p':   out += `<p class="${cls}">${escHtml(el.text)}</p>`; break;
      case 'button': out += `<button class="${cls}">${escHtml(el.text)}</button>`; break;
      case 'a':   out += `<a href="${el.href||'#'}" class="${cls}">${escHtml(el.text)}</a>`; break;
      case 'input':  out += `<input type="text" class="${cls}" placeholder="Input field..." />`; break;
      case 'textarea': out += `<textarea class="${cls}">${escHtml(el.text)}</textarea>`; break;
      case 'img': out += `<div class="${cls}" style="background:#ddd;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px;">Image</div>`; break;
      case 'div': out += `<div class="${cls}">${escHtml(el.text)}</div>`; break;
      case 'ul':  out += `<ul class="${cls}"><li>List item 1</li><li>List item 2</li><li>List item 3</li></ul>`; break;
      case 'ol':  out += `<ol class="${cls}"><li>List item 1</li><li>List item 2</li><li>List item 3</li></ol>`; break;
      case 'table': out += `<table class="${cls}" border="1" cellpadding="8" cellspacing="0"><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr><tr><td>Cell 4</td><td>Cell 5</td><td>Cell 6</td></tr></tbody></table>`; break;
    }
  });
  return out;
}

modalClose.addEventListener('click', () => codeModal.classList.remove('visible'));
codeModal.addEventListener('click', (e) => { if (e.target === codeModal) codeModal.classList.remove('visible'); });

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

// Copy buttons
function setupCopy(btn, getContent) {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(getContent()).then(() => {
      btn.classList.add('copied');
      const orig = btn.innerHTML;
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2000);
    });
  });
}
setupCopy(copyHtmlBtn, generateHTML);
setupCopy(copyCssBtn,  generateCSS);

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
updateHint();
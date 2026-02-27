import { useState } from "react";

const DEFAULT_TESTATE = [
  { id: 1, nome: "Gazzetta del Mezzogiorno", lordo: 15 },
  { id: 2, nome: "Quotidiano di Puglia", lordo: 13 },
  { id: 3, nome: "Repubblica Bari", lordo: 10 },
  { id: 4, nome: "ANSA", lordo: 5 },
];

const DEFAULT_BENI = [
  { id: 1, nome: "Caffè al bar", prezzo: 1.3, emoji: "☕" },
  { id: 2, nome: "Pranzo al ristorante", prezzo: 18, emoji: "🍝" },
  { id: 3, nome: "Spesa settimanale", prezzo: 80, emoji: "🛒" },
  { id: 4, nome: "Bolletta luce (mensile)", prezzo: 90, emoji: "💡" },
  { id: 5, nome: "Affitto monolocale Bari", prezzo: 550, emoji: "🏠" },
  { id: 6, nome: "iPhone 15", prezzo: 999, emoji: "📱" },
  { id: 7, nome: "Auto utilitaria usata", prezzo: 8000, emoji: "🚗" },
  { id: 8, nome: "Abbonamento Netflix", prezzo: 17.99, emoji: "🎬" },
  { id: 9, nome: "Pieno di benzina", prezzo: 75, emoji: "⛽" },
  { id: 10, nome: "Volo low cost", prezzo: 120, emoji: "✈️" },
];

function formatEuro(n) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function articoliNecessari(prezzo, tassa, lordo) {
  const netto = lordo * (1 - tassa / 100);
  return Math.ceil(prezzo / netto);
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f5f3; }
  .app { min-height: 100vh; background: #f5f5f3; font-family: 'DM Sans', sans-serif; color: #1a1a1a; }
  .header { background: #fff; border-bottom: 1px solid #e8e8e5; padding: 28px 24px 24px; text-align: center; }
  .header-tag { display: inline-block; background: #eef2ff; color: #4f6ef7; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-bottom: 14px; }
  .header h1 { font-size: clamp(20px, 5vw, 30px); font-weight: 700; color: #111; line-height: 1.15; margin-bottom: 6px; }
  .header p { font-size: 14px; color: #888; }
  .nav { display: flex; background: #fff; border-bottom: 1px solid #e8e8e5; padding: 0 16px; gap: 4px; }
  .nav-btn { padding: 12px 16px; background: none; border: none; border-bottom: 2px solid transparent; color: #888; font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; margin-bottom: -1px; }
  .nav-btn.active { color: #4f6ef7; border-bottom-color: #4f6ef7; }
  .container { max-width: 680px; margin: 0 auto; padding: 24px 16px 48px; }
  .card { background: #fff; border: 1px solid #e8e8e5; border-radius: 12px; padding: 20px; margin-bottom: 14px; }
  .card-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #aaa; margin-bottom: 12px; display: block; }
  .select-wrap { position: relative; }
  .select-wrap select { width: 100%; background: #f9f9f8; color: #111; border: 1px solid #e0e0dc; border-radius: 8px; padding: 11px 36px 11px 14px; font-size: 15px; font-weight: 500; font-family: 'DM Sans', sans-serif; appearance: none; cursor: pointer; outline: none; transition: border-color 0.15s; }
  .select-wrap select:focus { border-color: #4f6ef7; }
  .select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; font-size: 12px; }
  .slider-row { display: flex; align-items: center; gap: 14px; margin-top: 16px; }
  .slider-label { font-size: 13px; color: #888; white-space: nowrap; }
  input[type=range] { flex: 1; accent-color: #4f6ef7; cursor: pointer; }
  .slider-value { font-size: 16px; font-weight: 700; color: #4f6ef7; min-width: 42px; font-family: 'DM Mono', monospace; }
  .divider { height: 1px; background: #f0f0ed; margin: 16px 0; }
  .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
  .stat-label { font-size: 14px; color: #666; }
  .stat-value { font-size: 14px; font-weight: 600; color: #111; font-family: 'DM Mono', monospace; }
  .stat-value.red { color: #e53935; }
  .stat-value.blue { color: #4f6ef7; font-size: 18px; }
  .quick-input input { width: 100%; background: #f9f9f8; color: #111; border: 1px solid #e0e0dc; border-radius: 8px; padding: 11px 14px; font-size: 15px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.15s; }
  .quick-input input:focus { border-color: #4f6ef7; }
  .quick-result { margin-top: 14px; background: #f0f4ff; border: 1px solid #d4dcff; border-radius: 10px; padding: 20px; text-align: center; }
  .quick-num { font-size: 56px; font-weight: 700; color: #4f6ef7; line-height: 1; font-family: 'DM Mono', monospace; }
  .quick-sub { font-size: 12px; color: #888; margin-top: 6px; }
  .bene-row { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid #f0f0ed; }
  .bene-row:last-child { border-bottom: none; }
  .bene-emoji { font-size: 22px; width: 32px; text-align: center; flex-shrink: 0; }
  .bene-info { flex: 1; min-width: 0; }
  .bene-nome { font-size: 14px; font-weight: 600; color: #111; }
  .bene-prezzo { font-size: 12px; color: #aaa; margin-top: 1px; }
  .bar-bg { height: 4px; background: #f0f0ed; border-radius: 2px; margin-top: 6px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 2px; transition: width 0.4s cubic-bezier(.4,0,.2,1); }
  .bene-count { text-align: right; flex-shrink: 0; }
  .bene-num { font-size: 22px; font-weight: 700; font-family: 'DM Mono', monospace; line-height: 1; }
  .bene-unit { font-size: 10px; color: #ccc; margin-top: 1px; }
  .form-col { display: flex; flex-direction: column; gap: 10px; }
  .form-input { background: #f9f9f8; color: #111; border: 1px solid #e0e0dc; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.15s; width: 100%; }
  .form-input:focus { border-color: #4f6ef7; }
  .form-row { display: flex; gap: 8px; align-items: center; }
  .btn-primary { padding: 10px 18px; background: #4f6ef7; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
  .btn-primary:hover { background: #3a5ae8; }
  .btn-ghost { background: none; border: none; color: #ccc; cursor: pointer; font-size: 16px; padding: 4px 6px; border-radius: 4px; transition: color 0.15s; line-height: 1; flex-shrink: 0; }
  .btn-ghost:hover { color: #e53935; }
  .testata-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: #f9f9f8; border: 1px solid #e8e8e5; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.15s; }
  .testata-item.selected { background: #f0f4ff; border-color: #4f6ef7; }
  .testata-nome { font-size: 14px; font-weight: 600; color: #111; }
  .testata-sub { font-size: 12px; color: #aaa; margin-top: 2px; }
  .badge { font-size: 10px; font-weight: 600; color: #4f6ef7; background: #e8eeff; padding: 2px 8px; border-radius: 20px; letter-spacing: 0.5px; }
  .footer { text-align: center; font-size: 11px; color: #bbb; padding: 8px 0 32px; }
  .disclaimer { display: flex; gap: 8px; align-items: flex-start; padding: 12px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; margin-bottom: 14px; font-size: 12px; color: #92400e; line-height: 1.4; }
`;

function barColor(count) {
  if (count > 50) return "#e53935";
  if (count > 20) return "#f59e0b";
  return "#4f6ef7";
}

export default function App() {
  const [testate, setTestate] = useState(DEFAULT_TESTATE);
  const [beni, setBeni] = useState(DEFAULT_BENI);
  const [selectedTestata, setSelectedTestata] = useState(DEFAULT_TESTATE[0]);
  const [tassa, setTassa] = useState(30);
  const [view, setView] = useState("calcolatore");
  const [newTestata, setNewTestata] = useState({ nome: "", lordo: "" });
  const [newBene, setNewBene] = useState({ nome: "", prezzo: "", emoji: "📦" });
  const [customPrice, setCustomPrice] = useState("");

  const nettoPerArticolo = selectedTestata.lordo * (1 - tassa / 100);
  const maxArticoli = Math.max(...beni.map(b => articoliNecessari(b.prezzo, tassa, selectedTestata.lordo)));

  const addTestata = () => {
    if (!newTestata.nome || !newTestata.lordo) return;
    setTestate(p => [...p, { id: Date.now(), nome: newTestata.nome, lordo: parseFloat(newTestata.lordo) }]);
    setNewTestata({ nome: "", lordo: "" });
  };

  const removeTestata = (id) => {
    const remaining = testate.filter(t => t.id !== id);
    setTestate(remaining);
    if (selectedTestata.id === id && remaining.length) setSelectedTestata(remaining[0]);
  };

  const addBene = () => {
    if (!newBene.nome || !newBene.prezzo) return;
    setBeni(p => [...p, { id: Date.now(), ...newBene, prezzo: parseFloat(newBene.prezzo) }]);
    setNewBene({ nome: "", prezzo: "", emoji: "📦" });
  };

  const customCount = customPrice && !isNaN(parseFloat(customPrice)) && parseFloat(customPrice) > 0
    ? articoliNecessari(parseFloat(customPrice), tassa, selectedTestata.lordo) : null;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-tag">Strumento per giornalisti</div>
          <h1>Quanti articoli vale?</h1>
          <p>Calcola il costo reale del tuo lavoro a pezzo</p>
        </div>
        <div className="nav">
          {[["calcolatore", "Calcolatore"], ["testate", "Testate"], ["beni", "Beni"]].map(([v, l]) => (
            <button key={v} className={`nav-btn${view === v ? " active" : ""}`} onClick={() => setView(v)}>{l}</button>
          ))}
        </div>

        {view === "calcolatore" && (
          <div className="container">
            <div className="disclaimer">
              <span>⚠️</span>
              <span>I compensi inseriti sono indicativi e dichiarati dagli utenti. Verifica sempre le tariffe aggiornate con la tua redazione.</span>
            </div>

            <div className="card">
              <span className="card-label">Testata</span>
              <div className="select-wrap">
                <select value={selectedTestata.id} onChange={e => {
                  const t = testate.find(t => t.id === parseInt(e.target.value));
                  if (t) setSelectedTestata(t);
                }}>
                  {testate.map(t => (
                    <option key={t.id} value={t.id}>{t.nome} — {t.lordo}€ lordi/articolo</option>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>
              <div className="slider-row">
                <span className="slider-label">Trattenute fiscali</span>
                <input type="range" min={20} max={45} step={1} value={tassa} onChange={e => setTassa(Number(e.target.value))} />
                <span className="slider-value">{tassa}%</span>
              </div>
              <div className="divider" />
              <div className="stat-row">
                <span className="stat-label">Compenso lordo</span>
                <span className="stat-value">{formatEuro(selectedTestata.lordo)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Trattenute ({tassa}%)</span>
                <span className="stat-value red">− {formatEuro(selectedTestata.lordo * tassa / 100)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label" style={{ fontWeight: 600, color: "#111" }}>Netto per articolo</span>
                <span className="stat-value blue">{formatEuro(nettoPerArticolo)}</span>
              </div>
            </div>

            <div className="card">
              <span className="card-label">Calcolo rapido</span>
              <div className="quick-input">
                <input type="number" placeholder="Inserisci un prezzo in euro…" value={customPrice} onChange={e => setCustomPrice(e.target.value)} />
              </div>
              {customCount !== null && (
                <div className="quick-result">
                  <div className="quick-num">{customCount}</div>
                  <div className="quick-sub">articoli su <strong>{selectedTestata.nome}</strong> per {formatEuro(parseFloat(customPrice))}</div>
                </div>
              )}
            </div>

            <div className="card">
              <span className="card-label">Beni di consumo</span>
              {beni.map(b => {
                const count = articoliNecessari(b.prezzo, tassa, selectedTestata.lordo);
                return (
                  <div key={b.id} className="bene-row">
                    <div className="bene-emoji">{b.emoji}</div>
                    <div className="bene-info">
                      <div className="bene-nome">{b.nome}</div>
                      <div className="bene-prezzo">{formatEuro(b.prezzo)}</div>
                      <div className="bar-bg">
                        <div className="bar-fill" style={{ width: `${Math.min((count / maxArticoli) * 100, 100)}%`, background: barColor(count) }} />
                      </div>
                    </div>
                    <div className="bene-count">
                      <div className="bene-num" style={{ color: barColor(count) }}>{count}</div>
                      <div className="bene-unit">art.</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "testate" && (
          <div className="container">
            <div className="card">
              <span className="card-label">Testate configurate</span>
              {testate.map(t => (
                <div key={t.id} className={`testata-item${t.id === selectedTestata.id ? " selected" : ""}`}
                  onClick={() => { setSelectedTestata(t); setView("calcolatore"); }}>
                  <div>
                    <div className="testata-nome">{t.nome}</div>
                    <div className="testata-sub">{formatEuro(t.lordo)} lordi → {formatEuro(t.lordo * (1 - tassa / 100))} netti</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {t.id === selectedTestata.id && <span className="badge">Attiva</span>}
                    <button className="btn-ghost" onClick={e => { e.stopPropagation(); removeTestata(t.id); }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <span className="card-label">Aggiungi testata</span>
              <div className="form-col">
                <input className="form-input" placeholder="Nome della testata" value={newTestata.nome}
                  onChange={e => setNewTestata(p => ({ ...p, nome: e.target.value }))} />
                <div className="form-row">
                  <input className="form-input" type="number" placeholder="Compenso lordo (€)" value={newTestata.lordo}
                    onChange={e => setNewTestata(p => ({ ...p, lordo: e.target.value }))} />
                  <button className="btn-primary" onClick={addTestata}>Aggiungi</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "beni" && (
          <div className="container">
            <div className="card">
              <span className="card-label">Beni configurati</span>
              {beni.map(b => (
                <div key={b.id} className="bene-row">
                  <div className="bene-emoji">{b.emoji}</div>
                  <div className="bene-info">
                    <div className="bene-nome">{b.nome}</div>
                    <div className="bene-prezzo">{formatEuro(b.prezzo)}</div>
                  </div>
                  <button className="btn-ghost" onClick={() => setBeni(p => p.filter(x => x.id !== b.id))}>✕</button>
                </div>
              ))}
            </div>
            <div className="card">
              <span className="card-label">Aggiungi bene di consumo</span>
              <div className="form-col">
                <div className="form-row">
                  <input className="form-input" placeholder="🎁" value={newBene.emoji} style={{ width: "64px", textAlign: "center", flex: "none" }}
                    onChange={e => setNewBene(p => ({ ...p, emoji: e.target.value }))} />
                  <input className="form-input" placeholder="Nome del bene" value={newBene.nome}
                    onChange={e => setNewBene(p => ({ ...p, nome: e.target.value }))} />
                </div>
                <div className="form-row">
                  <input className="form-input" type="number" placeholder="Prezzo (€)" value={newBene.prezzo}
                    onChange={e => setNewBene(p => ({ ...p, prezzo: e.target.value }))} />
                  <button className="btn-primary" onClick={addBene}>Aggiungi</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

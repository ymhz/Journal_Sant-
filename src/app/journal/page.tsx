"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

// ─── TYPES ──────────────────────────────────────────────────────────
type AlimentRef = {
  id: string; nom: string;
  kcal: number | null; prot: number | null; lip: number | null; gluc: number | null; fib: number | null;
  na: number | null; k: number | null; ca: number | null; mg: number | null; oxa: number | null;
  pral: number | null; ig: number | null; cg: number | null;
};
type SolutionRef = {
  id: string; nom: string;
  nacl: number | null; khco3: number | null; nahco3: number | null;
  citrateK: number | null; citrateNa: number | null; mgSel: number | null; caSel: number | null;
  na: number | null; k: number | null; hco3: number | null; cl: number | null;
};
type SupplementRef = { id: string; nom: string; dosage: string | null };
type Refs = { aliments: AlimentRef[]; solutions: SolutionRef[]; supplements: SupplementRef[] };

type Journee = {
  id: string;
  repas: any[];
  hydratations: any[];
  mictions: any[];
  symptomes: any[];
  tensions: any[];
  selles: any[];
  notes: any[];
};

// ─── API HELPERS ─────────────────────────────────────────────────────
async function fetchJSON(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

async function postJSON(url: string, body: any) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

async function putJSON(url: string, body: any) {
  const r = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

async function deleteAPI(url: string) {
  const r = await fetch(url, { method: "DELETE" });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

// ─── STYLES ──────────────────────────────────────────────────────────
const base: React.CSSProperties = {
  width: "100%", padding: "9px 11px", background: "#151f2e",
  border: "1px solid #253347", borderRadius: 7, color: "#dce4ed",
  fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
  outline: "none", boxSizing: "border-box",
};
const sel: React.CSSProperties = {
  ...base, cursor: "pointer", appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7f96' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: 30,
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────
function F({ label, children, w }: { label: string; children: React.ReactNode; w?: string }) {
  return (
    <div style={{ marginBottom: 10, width: w || "100%" }}>
      <label style={{ display: "block", fontSize: 11, color: "#5e7490", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
    </div>
  );
}

function Slider({ label, value, onChange, max = 10, unit = "/10" }: { label: string; value: number | null; onChange: (v: number) => void; max?: number; unit?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "#5e7490", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
        <span style={{ fontSize: 12, color: value != null ? "#dce4ed" : "#3a4d63", fontFamily: "'JetBrains Mono', monospace" }}>
          {value != null ? `${value}${unit}` : "—"}
        </span>
      </div>
      <input type="range" min="0" max={max} value={value ?? 0}
        onChange={(e) => onChange(parseInt(e.target.value))}
        onMouseDown={() => { if (value == null) onChange(0); }}
        onTouchStart={() => { if (value == null) onChange(0); }}
        style={{ width: "100%", accentColor: "#3b8beb", height: 5, cursor: "pointer", opacity: value != null ? 1 : 0.25 }}
      />
    </div>
  );
}

function SaveBtn({ onClick, label = "Enregistrer", loading = false }: { onClick: () => void; label?: string; loading?: boolean }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { if (!loading) { onClick(); setOk(true); setTimeout(() => setOk(false), 900); } }}
      disabled={loading}
      style={{
        width: "100%", padding: "11px 0", marginTop: 6, borderRadius: 8, border: "none",
        background: ok ? "#16a34a" : loading ? "#1e3a5f" : "#2563eb", color: "#fff", fontSize: 14,
        fontWeight: 600, cursor: loading ? "wait" : "pointer", transition: "all 0.25s", letterSpacing: "0.01em",
      }}>
      {ok ? "✓ OK" : loading ? "..." : label}
    </button>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 13px", borderRadius: 18,
      border: active ? "1px solid #3b8beb" : "1px solid #253347",
      background: active ? "rgba(59,139,235,0.12)" : "transparent",
      color: active ? "#3b8beb" : "#6b7f96", cursor: "pointer", fontSize: 12,
      transition: "all 0.15s",
    }}>{label}</button>
  );
}

// ─── NUTRIENT DISPLAYS ──────────────────────────────────────────────
function calcNutrients(ref: AlimentRef, poids_g: number) {
  if (!poids_g) return null;
  const r = poids_g / 100;
  return {
    na: Math.round((ref.na || 0) * r), k: Math.round((ref.k || 0) * r),
    kcal: Math.round((ref.kcal || 0) * r), prot: +((ref.prot || 0) * r).toFixed(1),
    lip: +((ref.lip || 0) * r).toFixed(1), gluc: +((ref.gluc || 0) * r).toFixed(1),
    oxa: Math.round((ref.oxa || 0) * r), ca: Math.round((ref.ca || 0) * r),
    mg: Math.round((ref.mg || 0) * r), fib: +((ref.fib || 0) * r).toFixed(1),
  };
}

function calcElec(ref: SolutionRef, volume_ml: number) {
  if (!volume_ml) return null;
  const r = volume_ml / 1000;
  return { na: Math.round((ref.na || 0) * r), k: Math.round((ref.k || 0) * r), mg: Math.round((ref.mgSel || 0) * r) };
}

function NutrientBar({ nutrients }: { nutrients: ReturnType<typeof calcNutrients> }) {
  if (!nutrients) return null;
  const items = [
    { label: "Na", val: nutrients.na, unit: "mg", color: "#e87040" },
    { label: "K", val: nutrients.k, unit: "mg", color: "#4aba7a" },
    { label: "Kcal", val: nutrients.kcal, unit: "", color: "#d4a843" },
    { label: "Prot", val: nutrients.prot, unit: "g", color: "#5b9bd5" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4, marginBottom: 6 }}>
      {items.map(i => (
        <span key={i.label} style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: i.color, background: `${i.color}15`, padding: "2px 7px", borderRadius: 4 }}>
          {i.label} {i.val}{i.unit}
        </span>
      ))}
    </div>
  );
}

function ElecBar({ elec }: { elec: { na: number; k: number; mg: number } | null }) {
  if (!elec) return null;
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      {elec.na > 0 && <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#e87040", background: "#e8704015", padding: "2px 7px", borderRadius: 4 }}>Na {elec.na}mg</span>}
      {elec.k > 0 && <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#4aba7a", background: "#4aba7a15", padding: "2px 7px", borderRadius: 4 }}>K {elec.k}mg</span>}
      {elec.mg > 0 && <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#b084cc", background: "#b084cc15", padding: "2px 7px", borderRadius: 4 }}>Mg {elec.mg}mg</span>}
    </div>
  );
}

// ─── DATE HELPERS ────────────────────────────────────────────────────
function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(dateStr: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (dateStr === today) return "Aujourd'hui";
  if (dateStr === addDays(today, -1)) return "Hier";
  if (dateStr === addDays(today, 1)) return "Demain";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

// ─── REPAS FORM ──────────────────────────────────────────────────────
function RepasForm({ refs, journeeId, onSaved }: { refs: Refs; journeeId: string; onSaved: () => void }) {
  const [heure, setHeure] = useState("");
  const [numeroRepas, setNumeroRepas] = useState(1);
  const [aliments, setAliments] = useState<Array<{ id: string; poids: number }>>([]);
  const [submitting, setSubmitting] = useState(false);

  const addAlim = () => setAliments([...aliments, { id: refs.aliments[0]?.id || "", poids: 0 }]);
  const setAlimField = (i: number, k: "id" | "poids", v: any) => {
    const arr = [...aliments];
    arr[i] = { ...arr[i], [k]: v };
    setAliments(arr);
  };

  const save = async () => {
    if (!heure || aliments.some(a => !a.id || a.poids <= 0)) return;
    setSubmitting(true);
    try {
      await postJSON("/api/repas", { 
        journeeId, 
        heure, 
        numeroRepas, 
        aliments: aliments.map(a => ({ alimentId: a.id, poidsG: a.poids }))
      });
      setHeure(""); setNumeroRepas(1); setAliments([]);
      onSaved();
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <F label="Heure" w="140px">
          <input type="time" value={heure} onChange={e => setHeure(e.target.value)} style={base} />
        </F>
        <F label="Repas N°">
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4].map(n => (
              <button key={n} onClick={() => setNumeroRepas(n)} style={{
                flex: 1, padding: "9px 0", borderRadius: 7,
                border: numeroRepas === n ? "1px solid #3b8beb" : "1px solid #253347",
                background: numeroRepas === n ? "rgba(59,139,235,0.12)" : "#151f2e",
                color: numeroRepas === n ? "#3b8beb" : "#6b7f96", cursor: "pointer", fontSize: 14, fontWeight: 500,
              }}>{n}</button>
            ))}
          </div>
        </F>
      </div>
      <div style={{ fontSize: 11, color: "#5e7490", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Aliments</div>
      {aliments.map((a, i) => {
        const ref = refs.aliments.find(r => r.id === a.id);
        const nutrients = ref ? calcNutrients(ref, a.poids) : null;
        return (
          <div key={i} style={{ background: "#0d1520", border: "1px solid #1a2738", borderRadius: 10, padding: 10, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: nutrients ? 2 : 0 }}>
              <div style={{ flex: 1 }}>
                <select value={a.id} onChange={e => setAlimField(i, "id", e.target.value)} style={sel}>
                  {refs.aliments.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
                </select>
              </div>
              <div style={{ width: 90 }}>
                <input type="number" placeholder="Poids" value={a.poids || ""} onChange={e => setAlimField(i, "poids", +e.target.value)} style={{ ...base, textAlign: "right" }} />
              </div>
              <button onClick={() => setAliments(aliments.filter((_, idx) => idx !== i))} style={{ width: 36, height: 36, borderRadius: 7, background: "#1a2331", border: "1px solid #253347", color: "#e87060", cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <NutrientBar nutrients={nutrients} />
          </div>
        );
      })}
      <button onClick={addAlim} style={{ width: "100%", padding: "8px 0", background: "transparent", border: "1px dashed #3b8beb", borderRadius: 7, color: "#3b8beb", cursor: "pointer", fontSize: 13, marginBottom: 8 }}>+ Aliment</button>
      <SaveBtn onClick={save} loading={submitting} />
    </>
  );
}

// ─── HYDRATATION FORM ────────────────────────────────────────────────
function HydratationForm({ refs, journeeId, onSaved }: { refs: Refs; journeeId: string; onSaved: () => void }) {
  const [heure, setHeure] = useState("");
  const [solutionId, setSolutionId] = useState(refs.solutions[0]?.id || "");
  const [volume_ml, setVolume] = useState(0);
  const [supplements, setSupplements] = useState<Array<{ id: string; dose: string }>>([]);
  const [submitting, setSubmitting] = useState(false);

  const ref = refs.solutions.find(s => s.id === solutionId);
  const elec = ref ? calcElec(ref, volume_ml) : null;

  const addSup = () => setSupplements([...supplements, { id: refs.supplements[0]?.id || "", dose: "" }]);
  const setSupField = (i: number, k: "id" | "dose", v: any) => {
    const arr = [...supplements];
    arr[i] = { ...arr[i], [k]: v };
    setSupplements(arr);
  };

  const save = async () => {
    if (!heure || !solutionId || volume_ml <= 0) return;
    setSubmitting(true);
    try {
      await postJSON("/api/hydratation", { journeeId, heure, solutionId, volume_ml, supplements });
      setHeure(""); setVolume(0); setSupplements([]);
      onSaved();
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <F label="Heure" w="140px">
          <input type="time" value={heure} onChange={e => setHeure(e.target.value)} style={base} />
        </F>
        <F label="Volume (ml)">
          <input type="number" value={volume_ml || ""} onChange={e => setVolume(+e.target.value)} style={{ ...base, textAlign: "right" }} />
        </F>
      </div>
      <F label="Solution">
        <select value={solutionId} onChange={e => setSolutionId(e.target.value)} style={sel}>
          {refs.solutions.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
        </select>
      </F>
      <ElecBar elec={elec} />
      {supplements.length > 0 && <div style={{ fontSize: 11, color: "#5e7490", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 10, marginBottom: 5 }}>Suppléments</div>}
      {supplements.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <select value={s.id} onChange={e => setSupField(i, "id", e.target.value)} style={{ ...sel, flex: 1 }}>
            {refs.supplements.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
          </select>
          <input type="text" placeholder="Dose" value={s.dose} onChange={e => setSupField(i, "dose", e.target.value)} style={{ ...base, width: 90 }} />
          <button onClick={() => setSupplements(supplements.filter((_, idx) => idx !== i))} style={{ width: 36, height: 36, borderRadius: 7, background: "#1a2331", border: "1px solid #253347", color: "#e87060", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      ))}
      <button onClick={addSup} style={{ width: "100%", padding: "7px 0", background: "transparent", border: "1px dashed #3b8beb", borderRadius: 7, color: "#3b8beb", cursor: "pointer", fontSize: 12, marginTop: 6, marginBottom: 8 }}>+ Supplément</button>
      <SaveBtn onClick={save} loading={submitting} />
    </>
  );
}

// ─── MICTIONS FORM ───────────────────────────────────────────────────
function MictionsForm({ journeeId, onSaved }: { journeeId: string; onSaved: () => void }) {
  const [heure, setHeure] = useState("");
  const [volume_ml, setVolume] = useState<number | null>(null);
  const [couleur, setCouleur] = useState("jaune-clair");
  const [sensations, setSensations] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleSens = (s: string) => setSensations(sensations.includes(s) ? sensations.filter(x => x !== s) : [...sensations, s]);

  const save = async () => {
    if (!heure) return;
    setSubmitting(true);
    try {
      await postJSON("/api/mictions", { journeeId, heure, volume_ml, couleur, sensations });
      setHeure(""); setVolume(null); setCouleur("jaune-clair"); setSensations([]);
      onSaved();
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <F label="Heure" w="140px">
          <input type="time" value={heure} onChange={e => setHeure(e.target.value)} style={base} />
        </F>
        <F label="Volume (ml)">
          <input type="number" value={volume_ml || ""} onChange={e => setVolume(e.target.value ? +e.target.value : null)} style={{ ...base, textAlign: "right" }} placeholder="Optionnel" />
        </F>
      </div>
      <F label="Couleur">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["jaune-clair", "jaune", "jaune-foncé", "orange", "rouge", "marron"].map(c => (
            <Chip key={c} label={c} active={couleur === c} onClick={() => setCouleur(c)} />
          ))}
        </div>
      </F>
      <F label="Sensations">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["urgence", "brûlure", "douleur", "difficulté"].map(s => (
            <Chip key={s} label={s} active={sensations.includes(s)} onClick={() => toggleSens(s)} />
          ))}
        </div>
      </F>
      <SaveBtn onClick={save} loading={submitting} />
    </>
  );
}

// ─── SYMPTOMES FORM ──────────────────────────────────────────────────
function SymptomesForm({ journeeId, onSaved }: { journeeId: string; onSaved: () => void }) {
  const [heure, setHeure] = useState("");
  const [symptomes, setSymptomes] = useState<string[]>([]);
  const [douleurLat, setDouleurLat] = useState<number | null>(null);
  const [douleurDos, setDouleurDos] = useState<number | null>(null);
  const [fatigue, setFatigue] = useState<number | null>(null);
  const [nausee, setNausee] = useState<number | null>(null);
  const [remarque, setRemarque] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleSymp = (s: string) => setSymptomes(symptomes.includes(s) ? symptomes.filter(x => x !== s) : [...symptomes, s]);

  const save = async () => {
    if (!heure) return;
    setSubmitting(true);
    try {
      await postJSON("/api/symptomes", { journeeId, heure, symptomes, douleurLat, douleurDos, fatigue, nausee, remarque });
      setHeure(""); setSymptomes([]); setDouleurLat(null); setDouleurDos(null); setFatigue(null); setNausee(null); setRemarque("");
      onSaved();
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <F label="Heure">
        <input type="time" value={heure} onChange={e => setHeure(e.target.value)} style={base} />
      </F>
      <F label="Symptômes">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["douleur-latérale", "douleur-dos", "fatigue", "nausée", "maux-tête", "vertiges"].map(s => (
            <Chip key={s} label={s} active={symptomes.includes(s)} onClick={() => toggleSymp(s)} />
          ))}
        </div>
      </F>
      <Slider label="Douleur Latérale" value={douleurLat} onChange={setDouleurLat} />
      <Slider label="Douleur Dos" value={douleurDos} onChange={setDouleurDos} />
      <Slider label="Fatigue" value={fatigue} onChange={setFatigue} />
      <Slider label="Nausée" value={nausee} onChange={setNausee} />
      <F label="Remarque">
        <textarea value={remarque} onChange={e => setRemarque(e.target.value)} style={{ ...base, minHeight: 60 }} placeholder="Optionnel..." />
      </F>
      <SaveBtn onClick={save} loading={submitting} />
    </>
  );
}

// ─── TENSION FORM ────────────────────────────────────────────────────
function TensionForm({ journeeId, onSaved }: { journeeId: string; onSaved: () => void }) {
  const [heure, setHeure] = useState("");
  const [systolique, setSystolique] = useState<number | null>(null);
  const [diastolique, setDiastolique] = useState<number | null>(null);
  const [pouls, setPouls] = useState<number | null>(null);
  const [position, setPosition] = useState("assis");
  const [submitting, setSubmitting] = useState(false);

  const save = async () => {
    if (!heure || systolique == null || diastolique == null) return;
    setSubmitting(true);
    try {
      await postJSON("/api/tension", { journeeId, heure, systolique, diastolique, pouls, position });
      setHeure(""); setSystolique(null); setDiastolique(null); setPouls(null); setPosition("assis");
      onSaved();
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <F label="Heure">
        <input type="time" value={heure} onChange={e => setHeure(e.target.value)} style={base} />
      </F>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <F label="Systolique">
          <input type="number" value={systolique || ""} onChange={e => setSystolique(e.target.value ? +e.target.value : null)} style={{ ...base, textAlign: "right" }} />
        </F>
        <F label="Diastolique">
          <input type="number" value={diastolique || ""} onChange={e => setDiastolique(e.target.value ? +e.target.value : null)} style={{ ...base, textAlign: "right" }} />
        </F>
        <F label="Pouls">
          <input type="number" value={pouls || ""} onChange={e => setPouls(e.target.value ? +e.target.value : null)} style={{ ...base, textAlign: "right" }} placeholder="Opt." />
        </F>
      </div>
      <F label="Position">
        <div style={{ display: "flex", gap: 6 }}>
          {["assis", "debout", "couché"].map(p => (
            <Chip key={p} label={p} active={position === p} onClick={() => setPosition(p)} />
          ))}
        </div>
      </F>
      <SaveBtn onClick={save} loading={submitting} />
    </>
  );
}

// ─── NOTES FORM ──────────────────────────────────────────────────────
function NotesForm({ journeeId, onSaved }: { journeeId: string; onSaved: () => void }) {
  const [heure, setHeure] = useState("");
  const [texte, setTexte] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const save = async () => {
    if (!heure || !texte.trim()) return;
    setSubmitting(true);
    try {
      await postJSON("/api/notes", { journeeId, heure, texte });
      setHeure(""); setTexte("");
      onSaved();
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <F label="Heure">
        <input type="time" value={heure} onChange={e => setHeure(e.target.value)} style={base} />
      </F>
      <F label="Note">
        <textarea value={texte} onChange={e => setTexte(e.target.value)} style={{ ...base, minHeight: 80 }} placeholder="Votre note..." />
      </F>
      <SaveBtn onClick={save} loading={submitting} />
    </>
  );
}

// ─── ENTRY ROW ───────────────────────────────────────────────────────
function EntryRow({ entry, category, onDelete }: { entry: any; category: string; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  let preview = entry.heure || "";
  if (category === "repas") preview += ` • Repas ${entry.numeroRepas}`;
  else if (category === "hydratations") preview += ` • ${entry.volume_ml}ml`;
  else if (category === "mictions") preview += ` • ${entry.couleur || "—"}`;
  else if (category === "symptomes" && entry.symptomes?.length) preview += ` • ${entry.symptomes.join(", ")}`;
  else if (category === "tensions") preview += ` • ${entry.systolique}/${entry.diastolique}`;
  else if (category === "notes") preview += ` • ${entry.texte?.slice(0, 30)}...`;

  return (
    <div style={{ background: "#0d1520", border: "1px solid #1a2738", borderRadius: 10, padding: 10, marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={() => setExpanded(!expanded)} style={{ flex: 1, cursor: "pointer", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#dce4ed" }}>
          {preview}
        </div>
        <button onClick={onDelete} style={{ marginLeft: 8, width: 28, height: 28, borderRadius: 6, background: "#1a2331", border: "1px solid #253347", color: "#e87060", cursor: "pointer", fontSize: 14 }}>×</button>
      </div>
      {expanded && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #1a2738", fontSize: 12, color: "#6b7f96" }}>
          {JSON.stringify(entry, null, 2)}
        </div>
      )}
    </div>
  );
}

// ─── DAILY SUMMARY ───────────────────────────────────────────────────
function DailySummary({ date }: { date: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchJSON(`/api/bilan?date=${date}`).then(setData);
  }, [date]);

  if (!data) return <div style={{ textAlign: "center", padding: 40, color: "#5e7490" }}>Chargement...</div>;

  return (
    <div style={{ paddingTop: 10 }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#3b8beb" }}>Bilan du {formatDateLabel(date)}</h3>
      <div style={{ background: "#0d1520", border: "1px solid #1a2738", borderRadius: 10, padding: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#5e7490", marginBottom: 6 }}>APPORTS NUTRITION</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#e87040" }}>Na {data.totalNa || 0}mg</span>
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#4aba7a" }}>K {data.totalK || 0}mg</span>
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#d4a843" }}>Kcal {data.totalKcal || 0}</span>
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#5b9bd5" }}>Prot {data.totalProt || 0}g</span>
        </div>
      </div>
      <div style={{ background: "#0d1520", border: "1px solid #1a2738", borderRadius: 10, padding: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#5e7490", marginBottom: 6 }}>HYDRATATION</div>
        <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#dce4ed" }}>
          {data.totalHydratation || 0}ml
        </div>
      </div>
      <div style={{ background: "#0d1520", border: "1px solid #1a2738", borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 11, color: "#5e7490", marginBottom: 6 }}>MICTIONS</div>
        <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#dce4ed" }}>
          {data.totalMictions || 0}
        </div>
      </div>
    </div>
  );
}

// ─── NAV ARROW ───────────────────────────────────────────────────────
function NavArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: 8,
      border: "1px solid #253347", background: "transparent",
      color: "#5e7490", cursor: "pointer", fontSize: 16,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

// ─── CATEGORIES ──────────────────────────────────────────────────────
const CATS = [
  { id: "repas", label: "Repas", icon: "🍽️", apiPath: "/api/repas" },
  { id: "hydratations", label: "Hydrat.", icon: "💧", apiPath: "/api/hydratation" },
  { id: "mictions", label: "Mictions", icon: "🧪", apiPath: "/api/mictions" },
  { id: "symptomes", label: "Sympt.", icon: "⚡", apiPath: "/api/symptomes" },
  { id: "tensions", label: "Tension", icon: "❤️", apiPath: "/api/tension" },
  { id: "notes", label: "Notes", icon: "📝", apiPath: "/api/notes" },
  { id: "bilan", label: "Bilan", icon: "📊", apiPath: "" },
];

// ─── MAIN PAGE ───────────────────────────────────────────────────────
export default function JournalPage() {
  const [tab, setTab] = useState("repas");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [refs, setRefs] = useState<Refs>({ aliments: [], solutions: [], supplements: [] });
  const [journee, setJournee] = useState<Journee | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRefs = useCallback(async () => {
    const data = await fetchJSON("/api/refs");
    setRefs(data);
  }, []);

  const loadJournee = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchJSON(`/api/journees?date=${date}`);
      setJournee(data);
    } finally { setLoading(false); }
  }, [date]);

  useEffect(() => { loadRefs(); }, [loadRefs]);
  useEffect(() => { loadJournee(); }, [loadJournee]);

  const onSaved = () => loadJournee();

  const handleDelete = async (category: string, id: string) => {
    const cat = CATS.find(c => c.id === category);
    if (!cat?.apiPath) return;
    await deleteAPI(`${cat.apiPath}?id=${id}`);
    loadJournee();
  };

  const counts: Record<string, number> = {};
  if (journee) {
    CATS.forEach(c => { counts[c.id] = (journee as any)[c.id]?.length || 0; });
  }

  const forms: Record<string, React.ReactNode> = journee ? {
    repas: <RepasForm refs={refs} journeeId={journee.id} onSaved={onSaved} />,
    hydratations: <HydratationForm refs={refs} journeeId={journee.id} onSaved={onSaved} />,
    mictions: <MictionsForm journeeId={journee.id} onSaved={onSaved} />,
    symptomes: <SymptomesForm journeeId={journee.id} onSaved={onSaved} />,
    tensions: <TensionForm journeeId={journee.id} onSaved={onSaved} />,
    notes: <NotesForm journeeId={journee.id} onSaved={onSaved} />,
  } : {};

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0a0f1a 0%, #0f1724 100%)",
      color: "#dce4ed",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #1a2738", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Journal Santé</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <NavArrow direction="left" onClick={() => setDate(addDays(date, -1))} />
          <div style={{ textAlign: "center", minWidth: 100 }}>
            <div style={{ fontSize: 12, color: "#3b8beb", fontWeight: 600 }}>{formatDateLabel(date)}</div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...base, width: "auto", padding: "2px 6px", fontSize: 11, cursor: "pointer", background: "transparent", border: "none", color: "#5e7490", textAlign: "center" }} />
          </div>
          <NavArrow direction="right" onClick={() => setDate(addDays(date, 1))} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, padding: "10px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setTab(c.id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: "8px 11px", borderRadius: 10,
            border: tab === c.id ? "1px solid #3b8beb" : "1px solid transparent",
            background: tab === c.id ? "rgba(59,139,235,0.08)" : "rgba(255,255,255,0.015)",
            color: tab === c.id ? "#3b8beb" : "#5e7490",
            cursor: "pointer", minWidth: 58, flexShrink: 0, transition: "all 0.15s",
            position: "relative",
          }}>
            <span style={{ fontSize: 17 }}>{c.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{c.label}</span>
            {(counts[c.id] || 0) > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 4,
                background: "#3b8beb", color: "#0a0f1a",
                fontSize: 9, fontWeight: 700, width: 14, height: 14,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{counts[c.id]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "0 12px 90px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#5e7490" }}>Chargement...</div>
        ) : !journee ? (
          <div style={{ textAlign: "center", padding: 40, color: "#5e7490" }}>Erreur de chargement</div>
        ) : tab === "bilan" ? (
          <DailySummary date={date} />
        ) : (
          <>
            {((journee as any)[tab]?.length || 0) > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#5e7490", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 5 }}>
                  {(journee as any)[tab].length} entrée{(journee as any)[tab].length > 1 ? "s" : ""}
                </div>
                {(journee as any)[tab].map((e: any) => (
                  <EntryRow key={e.id} entry={e} category={tab} onDelete={() => handleDelete(tab, e.id)} />
                ))}
              </div>
            )}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a2738", borderRadius: 12, padding: 16 }}>
              {forms[tab]}
            </div>
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(10,15,26,0.95)", backdropFilter: "blur(10px)",
        borderTop: "1px solid #1a2738", padding: "8px 16px",
        display: "flex", justifyContent: "space-around",
      }}>
        {CATS.map(c => (
          <div key={c.id} onClick={() => setTab(c.id)} style={{
            textAlign: "center", cursor: "pointer",
            opacity: tab === c.id ? 1 : 0.4, transition: "opacity 0.15s",
          }}>
            <div style={{ fontSize: 15 }}>{c.icon}</div>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: (counts[c.id] || 0) > 0 ? "#3b8beb" : "#3a4d63" }}>
              {counts[c.id] || "·"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

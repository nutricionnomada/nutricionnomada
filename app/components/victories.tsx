'use client';

import { useEffect, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Check, Leaf } from 'lucide-react';
import { emptyWeek, migrate, setDefaults, weekFor, type Habit, type Emotion, type Week, type Records, type VictoryData } from '../lib/victory-model';

const catalog: Record<string, string[]> = {
 '🥗 Alimentación': ['He seguido la estructura de comidas acordada.', 'He incluido verduras en mis comidas principales.', 'He comido al menos 2 piezas de fruta.', 'He incluido proteína en las comidas planificadas.', 'He respetado mis señales de hambre y saciedad.', 'He comido despacio y sin distracciones.', 'He elegido una alternativa saludable ante un imprevisto.', 'He evitado saltarme comidas por falta de organización.'],
 '💧 Hidratación': ['He alcanzado mi objetivo diario de agua.', 'He llevado agua conmigo durante el día.', 'He priorizado el agua como bebida habitual.'],
 '🏃 Actividad física': ['He alcanzado mi objetivo diario de pasos.', 'He realizado mi entrenamiento programado.', 'He caminado o realizado pausas activas.', 'He dedicado tiempo a movilidad o estiramientos.', 'He respetado mi descanso físico programado.'],
 '🌙 Descanso y bienestar': ['He respetado mi horario de descanso.', 'He realizado mi rutina para dormir mejor.', 'He dedicado al menos 10 minutos a desconectar.', 'He realizado una actividad que me hace sentir bien.', 'He gestionado un momento de estrés sin recurrir automáticamente a la comida.'],
 '📅 Organización': ['He planificado mis comidas del día siguiente.', 'He preparado comida para llevar.', 'He tenido disponible una opción rápida y equilibrada.', 'He organizado la compra o los ingredientes necesarios.', 'He adaptado mi alimentación a mis horarios.'],
 '❤️ Relación con la comida': ['He disfrutado de la comida sin culpabilidad.', 'He evitado compensar una comida más abundante.', 'He identificado si tenía hambre física o emocional.', 'He sido flexible ante una comida social.', 'He retomado mi rutina sin castigarme.'],
 '⭐ Motivación y constancia': ['He reconocido un logro personal del día.', 'He realizado una acción que me acerca a mi objetivo.', 'He superado un obstáculo con una solución práctica.', 'He registrado cómo me he sentido hoy.', 'He valorado mi esfuerzo sin exigirme perfección.'],
};

const storageKey = 'nomada-victorias-v2';
const legacyKey = 'nomada-victorias-v1';
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const metrics = [['energy', 'Nivel de energía'], ['hunger', 'Nivel de hambre'], ['mood', 'Estado de ánimo'], ['rest', 'Calidad del descanso']] as const;
function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
function monday() { const d = new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()-((d.getDay()+6)%7)); return dateKey(d); }
function shift(value: string, count: number) { const d = new Date(value+'T12:00:00'); d.setDate(d.getDate()+count); return dateKey(d); }
function display(value: string) { return new Date(value+'T12:00:00').toLocaleDateString('es-ES',{day:'numeric', month:'short'}); }
function seedWeek(client: number): Week {
 const indexes = client%2 ? [['🏃 Actividad física',0,'Objetivo de pasos acordado en consulta.'],['🌙 Descanso y bienestar',0,'Cuidar la rutina de descanso.']] : [['💧 Hidratación',0,'Objetivo de agua acordado en consulta.'],['🥗 Alimentación',4,'Escuchar y respetar las señales de mi cuerpo.'],['⭐ Motivación y constancia',0,'Reconocer los pequeños avances.']];
 return { ...emptyWeek(), habits: indexes.map(([category,index,goal],i)=>({id:`example-${i}`,title:catalog[String(category)][Number(index)],goal:String(goal),category:String(category)})) };
}

export default function Victories({ professional, clients }: { professional: boolean; clients: string[] }) {
 const [client,setClient]=useState(clients[0]||'Clara Martín');
 const [week,setWeek]=useState(monday); const [day,setDay]=useState(0);
 const [data,setData]=useState<VictoryData>({records:{},schedules:{}}); const [loaded,setLoaded]=useState(false);
 const [message,setMessage]=useState(''); const [error,setError]=useState('');
 const [category,setCategory]=useState(Object.keys(catalog)[0]); const [choice,setChoice]=useState(catalog[Object.keys(catalog)[0]][0]);
 const [custom,setCustom]=useState(''); const [goal,setGoal]=useState(''); const [editing,setEditing]=useState<string|null>(null);
 const key=`${client}::${week}`; const entry=weekFor(data,client,week);
 const canEditHabits=professional&&week===monday();
 useEffect(()=>{
  try {
   const raw=localStorage.getItem(storageKey);
   const legacy=localStorage.getItem(legacyKey);
   const validRecords=(value: unknown): value is Records => !!value&&typeof value==='object'&&!Array.isArray(value)&&Object.values(value).every(v=>v&&Array.isArray(v.habits)&&v.habits.every((h: Habit)=>h&&typeof h.id==='string'&&typeof h.title==='string'&&typeof h.goal==='string'&&typeof h.category==='string'&&h.category in catalog)&&v.checks&&v.emotions&&typeof v.comment==='string');
   if(raw) {
    const parsed: unknown=JSON.parse(raw);
    const saved=parsed as VictoryData;
    if(!saved||!validRecords(saved.records)||!saved.schedules||typeof saved.schedules!=='object'||!Object.values(saved.schedules).every(versions=>Array.isArray(versions)&&versions.every(v=>typeof v.from==='string'&&validRecords({check:{...emptyWeek(),habits:v.habits}})))) throw new Error('Formato inválido');
    setData(saved);
   } else if(legacy) {
    const parsed: unknown=JSON.parse(legacy);
    if(!validRecords(parsed))throw new Error('Formato inválido');
    setData(migrate(parsed,monday()));
   } else {
    const records=Object.fromEntries(clients.map((name,i)=>[`${name}::${monday()}`,seedWeek(i)]));
    setData(migrate(records,monday()));
   }
  } catch { setError('No se han podido recuperar los registros de este navegador. Puedes trabajar en esta sesión; el almacenamiento anterior no se sobrescribirá.'); }
  setLoaded(true);
 // The initial sample is created once; switching clients must not overwrite records.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{ if(!loaded||error)return; try { localStorage.setItem(storageKey,JSON.stringify(data)); } catch { setError('No se ha podido guardar en este navegador. Los cambios se mantienen solo mientras esta página siga abierta.'); } },[data,loaded,error]);
 function update(change: (previous: Week)=>Week) { setData(all=>({...all,records:{...all.records,[key]:change(weekFor(all,client,week))}})); setMessage(''); }
 function updateHabits(change: (habits: Habit[])=>Habit[]) { if(!canEditHabits)return; setData(all=>setDefaults(all,client,monday(),change(weekFor(all,client,week).habits))); setMessage('Hábitos actualizados para todo el acompañamiento desde esta semana. Las semanas anteriores se conservan.'); }
 function removeHabit(id: string) { if(window.confirm('¿Dejar de trabajar este hábito desde esta semana? Las semanas anteriores se conservarán.')) { updateHabits(habits=>habits.filter(h=>h.id!==id));if(editing===id)resetForm(); } }
 function move(count: number) { setWeek(v=>shift(v,count));setDay(0);setEditing(null);setMessage(''); }
 function resetForm() { setEditing(null);setCustom('');setGoal(''); }
 const emotion=entry.emotions[String(day)]||{};
 function emotional(field: keyof Emotion,value: string) { update(v=>({...v,emotions:{...v.emotions,[day]:{...v.emotions[day],[field]:value}}})); }
 const total=entry.habits.reduce((sum,h)=>sum+days.filter((_,i)=>entry.checks[`${h.id}:${i}`]).length,0);
 return <section className="victories">
  <div className="victory-intro"><span className="eyebrow">PEQUEÑOS PASOS. VICTORIAS REALES.</span><h2><Leaf size={24}/> Registro de Victorias</h2><p>{professional?'Un acompañamiento a medida: elige los hábitos que tengan sentido para cada persona.':'Este es tu camino. Reconoce lo que consigues, sin exigirte perfección.'}</p></div>
  <div className="victory-toolbar card"><label>{professional?'Cliente ficticio':'Ver como cliente ficticio'}<select aria-label={professional?'Cliente ficticio':'Ver como cliente ficticio'} value={client} onChange={e=>{setClient(e.target.value);resetForm();setMessage('')}}>{clients.map(name=><option key={name}>{name}</option>)}</select></label><div className="week-selector"><button className="secondary" aria-label="Semana anterior" onClick={()=>move(-7)}><ChevronLeft size={17}/></button><div><label htmlFor="victory-week">Semana del lunes</label><input id="victory-week" type="date" value={week} onChange={e=>{if(e.target.value){const d=new Date(e.target.value+'T12:00:00');d.setDate(d.getDate()-((d.getDay()+6)%7));setWeek(dateKey(d));setDay(0);resetForm();setMessage('')}}}/><small>{display(week)} – {display(shift(week,6))}</small></div><button className="secondary" aria-label="Semana siguiente" onClick={()=>move(7)}><ChevronRight size={17}/></button></div><button className="subtle-link" onClick={()=>{setWeek(monday());setDay(0);resetForm()}}>Semana actual</button></div>
  <p className="victory-storage">Demo con datos ficticios · {error?'Guardado local no disponible':'Guardado automático en este navegador'} · No se sincroniza entre dispositivos ni cuentas.</p>
  {error&&<p className="notice" role="alert">{error}</p>}{message&&<p className="notice" role="status">{message}</p>}
  {!loaded?<p>Cargando registro…</p>:<>
   {professional&&!canEditHabits&&<p className="notice">Estás consultando otra semana. Para cambiar los hábitos del acompañamiento, vuelve a «Semana actual». Las semanas anteriores conservan su registro.</p>}
   {canEditHabits&&<details className="card habit-editor" open><summary>Hábitos del acompañamiento</summary><p>Selecciona los hábitos una vez: se repetirán automáticamente cada semana durante el acompañamiento. Si cambia el objetivo, puedes adaptarlos aquí. Los cambios se aplican desde esta semana, sin modificar las anteriores.</p><form onSubmit={e=>{e.preventDefault();const title=(custom.trim()||choice).trim();if(!title||!goal.trim())return;updateHabits(habits=>editing?habits.map(h=>h.id===editing?{...h,title,goal:goal.trim(),category}:h):[...habits,{id:crypto.randomUUID(),title,goal:goal.trim(),category}]);resetForm()}}><div className="habit-form-grid"><label>Categoría<select value={category} onChange={e=>{setCategory(e.target.value);setChoice(catalog[e.target.value][0])}}>{Object.keys(catalog).map(c=><option key={c}>{c}</option>)}</select></label><label>Hábito del catálogo<select value={choice} onChange={e=>{setChoice(e.target.value);setCustom('')}}>{catalog[category].map(c=><option key={c}>{c}</option>)}</select></label><label>Texto personalizado (opcional)<input maxLength={200} value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Adapta el hábito a esta persona"/></label><label>Objetivo acordado<input required maxLength={250} value={goal} onChange={e=>setGoal(e.target.value)} placeholder="Para qué trabajamos este hábito"/></label></div><div className="habit-buttons"><button className="primary" type="submit"><Plus size={16}/>{editing?'Guardar hábito':'Asignar hábito'}</button>{editing&&<button className="secondary" type="button" onClick={resetForm}>Cancelar edición</button>}</div></form></details>}
   <section className="card"><div className="section-heading"><div><h2>{client} · Sus pequeñas victorias</h2><p>{total} {total===1?'victoria registrada':'victorias registradas'} · Una casilla vacía no es un fracaso.</p></div><span className="status good">{entry.habits.length} hábitos elegidos</span></div>
   {!entry.habits.length?<p className="empty">{professional?'No hay hábitos asignados para este periodo. Selecciónalos en la semana actual para todo el acompañamiento.':'No hay hábitos asignados para este periodo del acompañamiento.'}</p>:<>
    <div className="victory-day-picker" role="group" aria-label="Día del registro">{days.map((name,i)=><button key={name} className={i===day?'selected':''} aria-pressed={i===day} onClick={()=>setDay(i)}>{name.slice(0,1)}<small>{new Date(shift(week,i)+'T12:00:00').getDate()}</small></button>)}</div>
    <div className="table-wrap victory-table"><table><caption className="sr-only">Registro semanal de hábitos de {client}</caption><thead><tr><th scope="col">HÁBITO</th>{days.map(d=><th scope="col" key={d}>{d}</th>)}<th scope="col">OBJETIVO</th></tr></thead><tbody>{entry.habits.map(h=><tr key={h.id}><th scope="row"><small>{h.category}</small>{h.title}{canEditHabits&&<div className="habit-row-actions"><button onClick={()=>{setEditing(h.id);setCategory(h.category);setChoice(catalog[h.category]?.[0]||'');setCustom(h.title);setGoal(h.goal)}}>Editar</button><button onClick={()=>{removeHabit(h.id)}}>Quitar</button></div>}</th>{days.map((d,i)=><td key={d}><input type="checkbox" disabled={professional} aria-label={`${h.title} — ${d}`} checked={!!entry.checks[`${h.id}:${i}`]} onChange={e=>update(v=>({...v,checks:{...v.checks,[`${h.id}:${i}`]:e.target.checked}}))}/></td>)}<td className="habit-goal">{h.goal}</td></tr>)}</tbody></table></div>
    <div className="victory-mobile-list"><h3>{days[day]} · {display(shift(week,day))}</h3>{entry.habits.map(h=><div className="mobile-habit" key={h.id}><label><input type="checkbox" disabled={professional} aria-label={`${h.title} — ${days[day]} (móvil)`} checked={!!entry.checks[`${h.id}:${day}`]} onChange={e=>update(v=>({...v,checks:{...v.checks,[`${h.id}:${day}`]:e.target.checked}}))}/><span><small>{h.category}</small><strong>{h.title}</strong><p>{h.goal}</p></span></label>{canEditHabits&&<div className="habit-row-actions"><button onClick={()=>{setEditing(h.id);setCategory(h.category);setCustom(h.title);setGoal(h.goal);setChoice(catalog[h.category]?.[0]||'')}}>Editar hábito</button><button onClick={()=>{removeHabit(h.id)}}>Quitar</button></div>}</div>)}</div>
   </>}</section>
   <section className="card emotional-card"><div className="section-heading"><div><h2>Registro emocional diario</h2><p>{professional?'Escuchar cómo se siente también forma parte del seguimiento.':'Puedes completar los campos que te apetezca compartir.'}</p></div></div><div className="emotional-body"><label>Día<select value={day} onChange={e=>setDay(Number(e.target.value))}>{days.map((d,i)=><option value={i} key={d}>{d} · {display(shift(week,i))}</option>)}</select></label><div className="emotional-metrics">{metrics.map(([field,label])=><label key={field}>{label}<select aria-label={label} disabled={professional} value={emotion[field]||''} onChange={e=>emotional(field,e.target.value)}><option value="">Sin registrar</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} — {n===1?'Muy bajo':n===5?'Muy alto':'Intermedio'}</option>)}</select></label>)}</div><p className="scale-help">Escala de 1 (muy bajo) a 5 (muy alto). El hambre describe una sensación; no es una puntuación de éxito.</p><div className="habit-form-grid"><label>Mi mayor victoria del día<textarea disabled={professional} maxLength={1000} value={emotion.victory||''} onChange={e=>emotional('victory',e.target.value)} placeholder="Un pequeño logro que quiero reconocer…"/></label><label>Mi principal dificultad del día<textarea disabled={professional} maxLength={1000} value={emotion.difficulty||''} onChange={e=>emotional('difficulty',e.target.value)} placeholder="Algo en lo que me vendría bien apoyo…"/></label></div>{!professional&&<span className="saved-hint"><Check size={14}/>{error?'Cambios en memoria durante esta sesión':'Los cambios se guardan automáticamente en este navegador'}</span>}</div></section>
   <section className="card emotional-card"><div className="section-heading"><div><h2>Unas palabras de tu profesional</h2><p>Un comentario para acompañar esta semana.</p></div></div><div className="emotional-body">{professional?<label>Comentario semanal<textarea maxLength={2000} value={entry.comment} onChange={e=>update(v=>({...v,comment:e.target.value}))} placeholder="Reconoce sus avances y comparte una propuesta práctica…"/></label>:<p className="weekly-comment">{entry.comment||'Todavía no hay comentarios para esta semana.'}</p>}</div></section>
  </>}
 </section>;
}

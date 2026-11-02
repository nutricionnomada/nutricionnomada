import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyWeek, migrate, setDefaults, weekFor } from '../app/lib/victory-model.ts';
const habit={id:'water',title:'Mi agua',goal:'Objetivo acordado',category:'💧 Hidratación'};
const first='2026-11-02', next='2026-11-09', later='2026-11-16';
const initial=()=>migrate({'Clara::2026-11-02':{...emptyWeek(),habits:[habit],checks:{'water:0':true},emotions:{0:{energy:'4'}},comment:'Buen comienzo'}},first);

test('las semanas nuevas heredan hábitos y empiezan sin respuestas',()=>{
 const data=initial();const week=weekFor(data,'Clara',next);
 assert.deepEqual(week.habits,[habit]);assert.deepEqual(week.checks,{});assert.deepEqual(week.emotions,{});assert.equal(week.comment,'');
 assert.deepEqual(weekFor(data,'Otra persona',next).habits,[]);
});
test('cambiar un objetivo mantiene el historial anterior y las respuestas actuales',()=>{
 const data=initial();data.records[`Clara::${next}`]={...weekFor(data,'Clara',next),checks:{'water:1':true},emotions:{1:{mood:'5'}},comment:'Siguiente semana'};
 const updated=setDefaults(data,'Clara',next,[{...habit,goal:'Nuevo objetivo'}]);
 assert.equal(weekFor(updated,'Clara',first).habits[0].goal,'Objetivo acordado');
 assert.equal(weekFor(updated,'Clara',first).checks['water:0'],true);
 assert.equal(weekFor(updated,'Clara',next).habits[0].goal,'Nuevo objetivo');
 assert.equal(weekFor(updated,'Clara',next).checks['water:1'],true);
 assert.equal(weekFor(updated,'Clara',next).emotions[1].mood,'5');
 assert.equal(weekFor(updated,'Clara',later).habits[0].goal,'Nuevo objetivo');
 assert.equal(data.records[`Clara::${first}`].habits[0].goal,'Objetivo acordado');
});
test('quitar hábitos no borra semanas pasadas ni notas y no modifica otro cliente',()=>{
 const data=initial();data.records[`Clara::${next}`]={...weekFor(data,'Clara',next),checks:{'water:1':true},comment:'Conservar'};
 data.schedules.Pablo=[{from:first,habits:[habit]}];
 const updated=setDefaults(data,'Clara',next,[]);
 assert.deepEqual(weekFor(updated,'Clara',first).habits,[habit]);
 assert.deepEqual(weekFor(updated,'Clara',next).habits,[]);assert.deepEqual(weekFor(updated,'Clara',next).checks,{});
 assert.equal(weekFor(updated,'Clara',next).comment,'Conservar');
 assert.deepEqual(weekFor(updated,'Pablo',later).habits,[habit]);
});
test('la migración conserva registros y usa la última selección, incluso si está vacía',()=>{
 const records={'Clara::2026-10-26':{...emptyWeek(),habits:[habit]},'Clara::2026-11-02':emptyWeek()};
 const data=migrate(records,first);
 assert.deepEqual(data.records,records);assert.deepEqual(weekFor(data,'Clara',later).habits,[]);
 assert.deepEqual(weekFor(data,'Clara','2026-10-26').habits,[habit]);
});
test('el historial de una semana sin respuestas conserva la versión vigente en esa fecha',()=>{
 const data=setDefaults(initial(),'Clara',later,[{...habit,title:'Nuevo hábito'}]);
 assert.equal(weekFor(data,'Clara',next).habits[0].title,'Mi agua');
 assert.equal(weekFor(data,'Clara',later).habits[0].title,'Nuevo hábito');
});

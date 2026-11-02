import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

// PostgreSQL real (WASM). Auth and Storage schema stubs test the migration, not hosted Supabase services.
let db;
const u={pro:'00000000-0000-0000-0000-000000000011',otherPro:'00000000-0000-0000-0000-000000000012',cl:'00000000-0000-0000-0000-000000000021',otherCl:'00000000-0000-0000-0000-000000000022',stranger:'00000000-0000-0000-0000-000000000023'};
const c={one:'10000000-0000-0000-0000-000000000001',two:'10000000-0000-0000-0000-000000000002',other:'10000000-0000-0000-0000-000000000003'};
const plan={published:'30000000-0000-0000-0000-000000000001',draft:'30000000-0000-0000-0000-000000000002',other:'30000000-0000-0000-0000-000000000003'};
const path=id=>`${u.pro}/${c.one}/${id}.pdf`;
async function asUser(id,fn){await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);try{return await fn()}finally{await db.exec("reset role; reset request.jwt.claim.sub;")}}
async function count(table){return Number((await db.query(`select count(*)::int as n from ${table}`)).rows[0].n)}
before(async()=>{
 db=new PGlite();
 await db.exec(`create role anon nologin; create role authenticated nologin; create schema auth; create table auth.users(id uuid primary key,raw_user_meta_data jsonb default '{}'::jsonb); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth,public to authenticated,anon; grant execute on function auth.uid() to authenticated,anon; create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]); create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text); alter table storage.objects enable row level security; grant usage on schema storage to authenticated; grant select,insert,update,delete on storage.objects to authenticated;`);
 await db.exec(await readFile(new URL('../supabase/migrations/202611020001_phase2.sql',import.meta.url),'utf8'));
 for(const id of Object.values(u))await db.query("insert into auth.users(id,raw_user_meta_data) values($1,'{\"role\":\"professional\"}')",[id]);
 await db.query("update public.profiles set role='professional' where id in ($1,$2)",[u.pro,u.otherPro]);
 for(const [id,pro,profile]of [[c.one,u.pro,u.cl],[c.two,u.pro,u.otherCl],[c.other,u.otherPro,null]])await db.query("insert into public.clients(id,professional_id,profile_id,full_name) values($1,$2,$3,'Persona ficticia')",[id,pro,profile]);
 await db.query("insert into public.programs(id,professional_id,name,price_eur,included_reviews) values('20000000-0000-0000-0000-000000000001',$1,'Programa demo',160,3),('20000000-0000-0000-0000-000000000002',$2,'Programa ajeno',120,3)",[u.pro,u.otherPro]);
 await db.query("insert into public.client_programs(professional_id,client_id,program_id,starts_on,included_reviews) values($1,$2,'20000000-0000-0000-0000-000000000001','2026-11-02',3)",[u.pro,c.one]);
 await db.query("insert into public.professional_notes(client_id,professional_id,body) values($1,$2,'Nota de prueba privada')",[c.one,u.pro]);
 for(const [id,published] of [[plan.published,true],[plan.draft,false]]){
  await db.query("insert into public.meal_plans(id,client_id,professional_id,title,version,document_kind,object_path,published_at,is_current) values($1,$2,$3,'Plan de prueba',$4,'plan',$5,$6,$7)",[id,c.one,u.pro,published?1:2,path(id),published?'2026-11-02T10:00:00Z':null,published]);
  await db.query("insert into storage.objects(bucket_id,name) values('nutrition-plans',$1)",[path(id)]);
 }
 await db.query("insert into public.habit_sets(client_id,professional_id,effective_from,habits) values($1,$2,'2026-11-02','[{\"id\":\"water\",\"title\":\"Agua\",\"goal\":\"Acordado\",\"category\":\"Hidratación\"}]')",[c.one,u.pro]);
});
after(async()=>{await db.close()});

test('RLS habilitado en todas las tablas de la aplicación',async()=>{
 const rows=(await db.query("select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r'")).rows;
 assert.equal(rows.length,12);assert(rows.every(r=>r.relrowsecurity));
});
test('los metadatos de registro no conceden rol profesional',async()=>{assert.equal((await db.query('select role from public.profiles where id=$1',[u.stranger])).rows[0].role,'client')});
test('un cliente ve su ficha y perfil, no otros clientes ni notas privadas',async()=>asUser(u.cl,async()=>{
 assert.equal(await count('public.clients'),1);assert.equal(await count('public.profiles'),1);assert.equal(await count('public.professional_notes'),0);assert.equal(await count('public.checkin_reviews'),0);assert.equal(await count('public.audit_events'),0);
 assert.equal((await db.query('select id from public.clients where id=$1',[c.two])).rows.length,0);
}));
test('el profesional solo ve los clientes y programas de su consulta',async()=>asUser(u.pro,async()=>{assert.equal(await count('public.clients'),2);assert.equal(await count('public.programs'),1);assert.equal(await count('public.professional_notes'),1);assert.equal(await count('public.profiles'),3)}));
test('un cliente sin ficha vinculada no ve datos de acompañamiento',async()=>asUser(u.stranger,async()=>{assert.equal(await count('public.clients'),0);assert.equal(await count('public.programs'),0);assert.equal(await count('public.meal_plans'),0)}));
test('no se puede elevar el rol ni cambiar el seguimiento como cliente',async()=>asUser(u.cl,async()=>{
 await assert.rejects(db.query("update public.profiles set role='professional' where id=$1",[u.cl]),/permission denied/i);
 assert.equal((await db.query('update public.clients set weight_tracking=true returning id')).rows.length,0);
 await assert.rejects(db.query("insert into public.clients(professional_id,full_name) values($1,'Intruso')",[u.pro]),/row-level security/i);
}));
test('no se pueden vincular cuentas desde la API profesional ni cruzar programas ajenos',async()=>asUser(u.pro,async()=>{
 await assert.rejects(db.query('update public.clients set profile_id=$1 where id=$2',[u.stranger,c.one]),/Administrative account linking/i);
 await assert.rejects(db.query("insert into public.client_programs(professional_id,client_id,program_id,starts_on,included_reviews) values($1,$2,'20000000-0000-0000-0000-000000000002',current_date,3)",[u.pro,c.one]),/foreign key/i);
}));
test('solo los planes publicados y sus objetos privados son visibles al cliente',async()=>{
 await asUser(u.cl,async()=>{assert.equal(await count('public.meal_plans'),1);assert.equal(await count('storage.objects'),1);await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('nutrition-plans','ajeno.pdf')"),/row-level security/i);assert.equal((await db.query('update storage.objects set name=name returning id')).rows.length,0)});
 await asUser(u.otherCl,async()=>{assert.equal(await count('storage.objects'),0);assert.equal(await count('public.meal_plans'),0)});
 const bucket=(await db.query("select * from storage.buckets where id='nutrition-plans'")).rows[0];assert.equal(bucket.public,false);assert.equal(Number(bucket.file_size_limit),10485760);assert.deepEqual(bucket.allowed_mime_types,['application/pdf']);
});
test('el registro hereda hábitos, se aísla por cliente y queda bloqueado al enviarlo',async()=>{
 const record=await asUser(u.cl,async()=>{
  const r=(await db.query("insert into public.checkins(client_id,professional_id,week_start,habit_snapshot,victories) values($1,$2,'2026-11-02','[]','Un avance') returning id,habit_snapshot",[c.one,u.pro])).rows[0];assert.equal(r.habit_snapshot[0].id,'water');
  await assert.rejects(db.query("insert into public.checkins(client_id,professional_id,week_start) values($1,$2,'2026-11-09')",[c.two,u.pro]),/row-level security/i);return r;
 });
 await asUser(u.pro,async()=>assert.equal(await count('public.checkins'),0));
 await asUser(u.cl,async()=>{await db.query('update public.checkins set submitted_at=now() where id=$1',[record.id]);assert.equal((await db.query("update public.checkins set victories='Alterado' where id=$1 returning id",[record.id])).rows.length,0)});
 await asUser(u.pro,async()=>{assert.equal(await count('public.checkins'),1);await db.query("insert into public.checkin_reviews(client_id,professional_id,checkin_id,private_observation) values($1,$2,$3,'Privado')",[c.one,u.pro,record.id])});
 await asUser(u.cl,async()=>assert.equal(await count('public.checkin_reviews'),0));
});
test('peso opcional desactivado por defecto y escalas con restricciones',async()=>asUser(u.cl,async()=>{
 await assert.rejects(db.query("insert into public.measurements(client_id,professional_id,metric,value) values($1,$2,'weight',70)",[c.one,u.pro]),/Weight tracking is disabled/i);
 await assert.rejects(db.query("insert into public.measurements(client_id,professional_id,metric,value) values($1,$2,'energy',6)",[c.one,u.pro]),/check constraint/i);
 await db.query("insert into public.measurements(client_id,professional_id,metric,value) values($1,$2,'energy',4)",[c.one,u.pro]);assert.equal(await count('public.measurements'),1);
}));
test('el registro administrativo es inmutable para usuarios y no almacena notas',async()=>{
 await asUser(u.pro,async()=>{assert((await count('public.audit_events'))>0);await assert.rejects(db.query('delete from public.audit_events'),/permission denied/i);const row=(await db.query('select * from public.audit_events limit 1')).rows[0];assert(!Object.hasOwn(row,'body'))});
});
test('usuarios anónimos sin acceso a tablas personales',async()=>{await db.exec('set role anon');try{await assert.rejects(db.query('select * from public.clients'),/permission denied/i)}finally{await db.exec('reset role')}});

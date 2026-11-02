begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (length(display_name)<=120),
 role text not null default 'client' check (role in ('professional','client')),
 created_at timestamptz not null default now()
);
create table public.clients (
 id uuid primary key default gen_random_uuid(),
 professional_id uuid not null references public.profiles(id),
 profile_id uuid unique references public.profiles(id) on delete set null,
 full_name text not null check (length(trim(full_name)) between 1 and 160),
 email text check (length(email)<=254), phone text check(length(phone)<=40),
 joined_on date not null default current_date,
 status text not null default 'active' check(status in ('active','paused','finished','archived')),
 goal text not null default '' check(length(goal)<=2000),
 questionnaire jsonb not null default '{}'::jsonb check(jsonb_typeof(questionnaire)='object'),
 preferences text not null default '', avoided_foods text not null default '', allergies text not null default '',
 weight_tracking boolean not null default false,
 created_at timestamptz not null default now(),
 unique(id,professional_id)
);
create index clients_professional_idx on public.clients(professional_id,status);
create table public.programs (
 id uuid primary key default gen_random_uuid(), professional_id uuid not null references public.profiles(id),
 name text not null check(length(trim(name)) between 1 and 160),
 price_eur numeric(10,2) not null check(price_eur>=0),
 included_reviews integer not null check(included_reviews between 0 and 1000),
 cadence text not null default '' check(length(cadence)<=100),
 active boolean not null default true, created_at timestamptz not null default now(),
 unique(id,professional_id)
);
create index programs_professional_idx on public.programs(professional_id);
create table public.client_programs (
 id uuid primary key default gen_random_uuid(), professional_id uuid not null,
 client_id uuid not null, program_id uuid not null,
 starts_on date not null, ends_on date, check(ends_on is null or ends_on>=starts_on),
 included_reviews integer not null check(included_reviews between 0 and 1000),
 review_adjustment integer not null default 0 check(review_adjustment between -1000 and 1000),
 status text not null default 'active' check(status in ('active','paused','finished','cancelled')),
 payment_status text not null default 'pending' check(payment_status in ('pending','received')),
 created_at timestamptz not null default now(),
 foreign key(client_id,professional_id) references public.clients(id,professional_id) on delete cascade,
 foreign key(program_id,professional_id) references public.programs(id,professional_id),
 unique(id,client_id,professional_id)
);
create index client_programs_client_idx on public.client_programs(client_id);
create table public.appointments (
 id uuid primary key default gen_random_uuid(), client_id uuid not null, professional_id uuid not null,
 client_program_id uuid,
 starts_at timestamptz not null, duration_minutes integer not null default 20 check(duration_minutes between 5 and 240),
 kind text not null check(kind in ('initial','fortnightly','monthly','extra')),
 status text not null default 'pending' check(status in ('pending','completed','cancelled')),
 agreed_goals text not null default '' check(length(agreed_goals)<=4000),
 created_at timestamptz not null default now(),
 foreign key(client_id,professional_id) references public.clients(id,professional_id) on delete cascade,
 foreign key(client_program_id,client_id,professional_id) references public.client_programs(id,client_id,professional_id)
);
create index appointments_client_date_idx on public.appointments(client_id,starts_at);
create index appointments_professional_date_idx on public.appointments(professional_id,starts_at);
create table public.meal_plans (
 id uuid primary key default gen_random_uuid(), client_id uuid not null, professional_id uuid not null,
 title text not null check(length(trim(title)) between 1 and 200),
 version integer not null check(version>0),
 document_kind text not null check(document_kind in ('plan','menu','shopping_list')),
 object_path text unique,
 instructions text not null default '' check(length(instructions)<=10000),
 published_at timestamptz, is_current boolean not null default false,
 created_at timestamptz not null default now(),
 foreign key(client_id,professional_id) references public.clients(id,professional_id) on delete cascade,
 unique(client_id,document_kind,version),
 check(not is_current or published_at is not null),
 check(published_at is null or object_path is not null),
 check(object_path is null or object_path = professional_id::text || '/' || client_id::text || '/' || id::text || '.pdf')
);
create unique index meal_plans_current_idx on public.meal_plans(client_id,document_kind) where is_current;
create index meal_plans_client_idx on public.meal_plans(client_id);
create table public.habit_sets (
 id uuid primary key default gen_random_uuid(), client_id uuid not null, professional_id uuid not null,
 effective_from date not null check(extract(isodow from effective_from)=1),
 habits jsonb not null default '[]'::jsonb check(jsonb_typeof(habits)='array' and jsonb_array_length(habits)<=100),
 created_at timestamptz not null default now(),
 foreign key(client_id,professional_id) references public.clients(id,professional_id) on delete cascade,
 unique(client_id,effective_from)
);
create index habit_sets_client_date_idx on public.habit_sets(client_id,effective_from);
create table public.checkins (
 id uuid primary key default gen_random_uuid(), client_id uuid not null, professional_id uuid not null,
 week_start date not null check(extract(isodow from week_start)=1),
 habit_snapshot jsonb not null default '[]'::jsonb check(jsonb_typeof(habit_snapshot)='array'),
 daily_checks jsonb not null default '{}'::jsonb check(jsonb_typeof(daily_checks)='object'),
 daily_emotions jsonb not null default '{}'::jsonb check(jsonb_typeof(daily_emotions)='object'),
 victories text not null default '' check(length(victories)<=4000),
 food text check(food in ('very_well','quite_well','difficulties','need_help')),
 activity text not null default '' check(length(activity)<=2000), activity_days integer check(activity_days between 0 and 7),
 rest integer check(rest between 1 and 5), wellbeing integer check(wellbeing between 1 and 5),
 wellbeing_comment text not null default '' check(length(wellbeing_comment)<=2000),
 difficulties text not null default '' check(length(difficulties)<=4000), next_goal text not null default '' check(length(next_goal)<=2000),
 submitted_at timestamptz, created_at timestamptz not null default now(),
 foreign key(client_id,professional_id) references public.clients(id,professional_id) on delete cascade,
 unique(client_id,week_start), unique(id,client_id,professional_id)
);
create index checkins_professional_submitted_idx on public.checkins(professional_id,submitted_at);
create table public.checkin_reviews (
 id uuid primary key default gen_random_uuid(), client_id uuid not null, professional_id uuid not null, checkin_id uuid not null unique,
 reviewed_at timestamptz not null default now(), private_observation text not null default '' check(length(private_observation)<=5000),
 shared_feedback text not null default '' check(length(shared_feedback)<=5000),
 foreign key(checkin_id,client_id,professional_id) references public.checkins(id,client_id,professional_id) on delete cascade
);
create index checkin_reviews_professional_idx on public.checkin_reviews(professional_id);
create table public.measurements (
 id uuid primary key default gen_random_uuid(), client_id uuid not null, professional_id uuid not null,
 metric text not null check(metric in ('weight','energy','rest','wellbeing')),
 value numeric(7,2) not null, measured_on date not null default current_date,
 created_at timestamptz not null default now(),
 check((metric='weight' and value between 10 and 700) or (metric<>'weight' and value between 1 and 5)),
 foreign key(client_id,professional_id) references public.clients(id,professional_id) on delete cascade,
 unique(client_id,metric,measured_on)
);
create index measurements_client_date_idx on public.measurements(client_id,measured_on);
create table public.professional_notes (
 id uuid primary key default gen_random_uuid(), client_id uuid not null, professional_id uuid not null,
 body text not null check(length(body) between 1 and 10000), created_at timestamptz not null default now(),
 foreign key(client_id,professional_id) references public.clients(id,professional_id) on delete cascade
);
create index professional_notes_client_idx on public.professional_notes(client_id);
create table public.audit_events (
 id uuid primary key default gen_random_uuid(), actor_id uuid, professional_id uuid,
 resource text not null, resource_id uuid, action text not null check(action in ('INSERT','UPDATE','DELETE')),
 happened_at timestamptz not null default now()
);
create index audit_events_professional_date_idx on public.audit_events(professional_id,happened_at);

create function private.is_professional() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='professional');
$$;
create function private.can_access_client(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.clients where id=target and (profile_id=auth.uid() or (professional_id=auth.uid() and private.is_professional())));
$$;
create function private.owns_client(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select private.is_professional() and exists(select 1 from public.clients where id=target and professional_id=auth.uid());
$$;
create function private.own_client(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.clients where id=target and profile_id=auth.uid());
$$;
create function private.can_read_profile(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select target=auth.uid() or (private.is_professional() and exists(select 1 from public.clients where profile_id=target and professional_id=auth.uid()));
$$;
create function private.make_profile() returns trigger language plpgsql security definer set search_path='' as $$
 begin
  insert into public.profiles(id,display_name,role) values(new.id,'','client');
  return new;
 end;
$$;
create trigger create_user_profile after insert on auth.users for each row execute function private.make_profile();
-- Existing Auth users also start as clients. Professional bootstrap is an explicit administrative step.
insert into public.profiles(id) select id from auth.users on conflict do nothing;

create function private.validate_client_links() returns trigger language plpgsql security definer set search_path='' as $$
 begin
  if not exists(select 1 from public.profiles where id=new.professional_id and role='professional') then raise exception 'Invalid professional'; end if;
  if new.profile_id is not null and not exists(select 1 from public.profiles where id=new.profile_id and role='client') then raise exception 'Invalid client profile'; end if;
  if TG_OP='UPDATE' and (new.professional_id is distinct from old.professional_id or new.profile_id is distinct from old.profile_id) then
   -- Linking or transferring accounts requires an administrative connection, not the ordinary client API.
   if auth.uid() is not null then raise exception 'Administrative account linking required'; end if;
  end if;
  return new;
 end;
$$;
create trigger validate_client_links before insert or update on public.clients for each row execute function private.validate_client_links();
create function private.validate_measurement() returns trigger language plpgsql security definer set search_path='' as $$
 begin
  if new.metric='weight' and not exists(select 1 from public.clients where id=new.client_id and weight_tracking) then raise exception 'Weight tracking is disabled'; end if;
  return new;
 end;
$$;
create trigger validate_measurement before insert or update on public.measurements for each row execute function private.validate_measurement();
create function private.lock_checkin() returns trigger language plpgsql security definer set search_path='' as $$
 declare selected jsonb;
 begin
  if TG_OP='INSERT' then
   select habits into selected from public.habit_sets where client_id=new.client_id and effective_from<=new.week_start order by effective_from desc limit 1;
   new.habit_snapshot=coalesce(selected,'[]'::jsonb);
  else
   if new.client_id<>old.client_id or new.professional_id<>old.professional_id or new.week_start<>old.week_start then raise exception 'Cannot move a weekly record'; end if;
   new.habit_snapshot=old.habit_snapshot;
  end if;
  if new.submitted_at is not null and (TG_OP='INSERT' or old.submitted_at is null) then new.submitted_at=now(); end if;
  return new;
 end;
$$;
create trigger lock_checkin before insert or update on public.checkins for each row execute function private.lock_checkin();
create function private.audit_change() returns trigger language plpgsql security definer set search_path='' as $$
 declare row_data jsonb;
 begin
  if TG_OP='DELETE' then row_data=to_jsonb(old); else row_data=to_jsonb(new); end if;
  insert into public.audit_events(actor_id,professional_id,resource,resource_id,action)
  values(auth.uid(),(row_data->>'professional_id')::uuid,TG_TABLE_NAME,(row_data->>'id')::uuid,TG_OP);
  if TG_OP='DELETE' then return old; else return new; end if;
 end;
$$;

do $$ declare tab text; begin
 foreach tab in array array['profiles','clients','programs','client_programs','appointments','meal_plans','habit_sets','checkin_reviews','professional_notes'] loop
  execute format('create trigger audit_change after insert or update or delete on public.%I for each row execute function private.audit_change()',tab);
 end loop;
 foreach tab in array array['profiles','clients','programs','client_programs','appointments','meal_plans','habit_sets','checkins','checkin_reviews','measurements','professional_notes','audit_events'] loop
  execute format('alter table public.%I enable row level security',tab);
  execute format('revoke all on table public.%I from anon, authenticated',tab);
 end loop;
end $$;
revoke all on all functions in schema private from public;
grant execute on function private.is_professional(),private.can_access_client(uuid),private.owns_client(uuid),private.own_client(uuid),private.can_read_profile(uuid) to authenticated;
grant select on public.profiles to authenticated;
grant update(display_name) on public.profiles to authenticated;
create policy profiles_read on public.profiles for select to authenticated using(private.can_read_profile(id));
create policy profiles_rename on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());

grant select,insert,update,delete on public.clients,public.programs,public.client_programs,public.appointments,public.meal_plans,public.habit_sets,public.checkins,public.checkin_reviews,public.measurements,public.professional_notes to authenticated;
grant select on public.audit_events to authenticated;
create policy clients_read on public.clients for select to authenticated using(private.can_access_client(id));
create policy clients_create on public.clients for insert to authenticated with check(private.is_professional() and professional_id=auth.uid() and profile_id is null);
create policy clients_change on public.clients for update to authenticated using(private.owns_client(id)) with check(private.is_professional() and professional_id=auth.uid());
create policy clients_remove on public.clients for delete to authenticated using(private.owns_client(id));
create policy programs_read on public.programs for select to authenticated using((professional_id=auth.uid() and private.is_professional()) or exists(select 1 from public.client_programs cp where cp.program_id=programs.id and private.own_client(cp.client_id)));
create policy programs_write on public.programs for all to authenticated using(professional_id=auth.uid() and private.is_professional()) with check(professional_id=auth.uid() and private.is_professional());

do $$ declare tab text; begin
 foreach tab in array array['client_programs','appointments','habit_sets'] loop
  execute format('create policy client_read on public.%I for select to authenticated using(private.can_access_client(client_id))',tab);
  execute format('create policy professional_write on public.%I for all to authenticated using(private.owns_client(client_id)) with check(private.owns_client(client_id) and professional_id=auth.uid())',tab);
 end loop;
 foreach tab in array array['professional_notes','checkin_reviews'] loop
  execute format('create policy professional_only on public.%I for all to authenticated using(private.owns_client(client_id)) with check(private.owns_client(client_id) and professional_id=auth.uid())',tab);
 end loop;
end $$;
create policy meal_plan_read on public.meal_plans for select to authenticated using(private.owns_client(client_id) or (private.own_client(client_id) and published_at is not null));
create policy meal_plan_write on public.meal_plans for all to authenticated using(private.owns_client(client_id)) with check(private.owns_client(client_id) and professional_id=auth.uid());
create policy checkins_read on public.checkins for select to authenticated using(private.own_client(client_id) or (private.owns_client(client_id) and submitted_at is not null));
create policy checkins_create on public.checkins for insert to authenticated with check(private.own_client(client_id));
create policy checkins_update on public.checkins for update to authenticated using(private.own_client(client_id) and submitted_at is null) with check(private.own_client(client_id));
create policy checkins_delete on public.checkins for delete to authenticated using(private.own_client(client_id) and submitted_at is null);
create policy measurements_read on public.measurements for select to authenticated using(private.can_access_client(client_id));
create policy measurements_write on public.measurements for all to authenticated using(private.can_access_client(client_id)) with check(private.can_access_client(client_id));
create policy audit_read on public.audit_events for select to authenticated using(private.is_professional() and professional_id=auth.uid());

-- A private PDF bucket. Only canonical paths registered in meal_plans are accessible.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('nutrition-plans','nutrition-plans',false,10485760,array['application/pdf']) on conflict(id) do update set public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;
create policy nutrition_documents_read on storage.objects for select to authenticated using(
 bucket_id='nutrition-plans' and exists(select 1 from public.meal_plans p where p.object_path=name and (private.owns_client(p.client_id) or (private.own_client(p.client_id) and p.published_at is not null)))
);
create policy nutrition_documents_insert on storage.objects for insert to authenticated with check(
 bucket_id='nutrition-plans' and exists(select 1 from public.meal_plans p where p.object_path=name and private.owns_client(p.client_id))
);
create policy nutrition_documents_delete on storage.objects for delete to authenticated using(
 bucket_id='nutrition-plans' and exists(select 1 from public.meal_plans p where p.object_path=name and private.owns_client(p.client_id))
);
-- No object UPDATE policy: published versions cannot be replaced in-place via upsert.
commit;

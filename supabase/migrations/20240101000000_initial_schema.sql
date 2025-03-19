-- Create schema for task manager app

-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create a table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email varchar not null,
  full_name varchar,
  avatar_url varchar,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  constraint email_validation check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create a table for teams
create table teams (
  id uuid default gen_random_uuid() primary key,
  name varchar not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create a junction table for user-team relationships
create table team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references teams on delete cascade not null,
  user_id uuid references profiles on delete cascade not null,
  role varchar not null check (role in ('admin', 'member')),
  created_at timestamptz default now() not null,
  
  unique (team_id, user_id)
);

-- Create a table for tasks
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title varchar not null,
  description text,
  status varchar not null check (status in ('todo', 'in_progress', 'completed')),
  priority varchar not null check (priority in ('low', 'medium', 'high')),
  due_date timestamptz,
  user_id uuid references profiles on delete cascade not null,
  team_id uuid references teams on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Set up RLS policies

-- Profiles table policies
create policy "Public profiles are viewable by users in the same team"
  on profiles for select
  using (
    auth.uid() in (
      select tm.user_id from team_members tm
      where tm.team_id in (
        select team_id from team_members where user_id = profiles.id
      )
    )
  );

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Teams table policies
create policy "Teams are viewable by team members"
  on teams for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Team admins can insert teams"
  on teams for insert
  with check (
    exists (
      select 1 from team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
      and team_members.role = 'admin'
    )
  );

create policy "Team admins can update teams"
  on teams for update
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
      and team_members.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
      and team_members.role = 'admin'
    )
  );

-- Team members table policies
create policy "Team members are viewable by users in the same team"
  on team_members for select
  using (
    exists (
      select 1 from team_members as tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team admins can insert team members"
  on team_members for insert
  with check (
    exists (
      select 1 from team_members
      where team_members.team_id = team_id
      and team_members.user_id = auth.uid()
      and team_members.role = 'admin'
    )
  );

-- Tasks table policies
create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can view tasks from their teams"
  on tasks for select
  using (
    team_id in (
      select team_id from team_members
      where user_id = auth.uid()
    )
  );

create policy "Users can insert their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- Functions and triggers for automatic timestamp updates
create or replace function update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_timestamp
before update on profiles
for each row execute procedure update_timestamp();

create trigger update_teams_timestamp
before update on teams
for each row execute procedure update_timestamp();

create trigger update_tasks_timestamp
before update on tasks
for each row execute procedure update_timestamp();

-- Create index for better query performance
create index tasks_user_id_idx on tasks (user_id);
create index tasks_team_id_idx on tasks (team_id);
create index team_members_team_id_idx on team_members (team_id);
create index team_members_user_id_idx on team_members (user_id); 
# 晶核固定团本

仅保留固定团本模块的静态网页，可通过 GitHub Pages 在线访问。

默认数据保存在访问者浏览器的 `localStorage` 中。填写 `config.js` 中的 Supabase 配置后，会启用云端同步，让所有访问者共享同一份数据。

## Supabase 配置

1. 在 Supabase 建立项目。
2. 打开 SQL Editor，执行：

```sql
create table public.game_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.game_state enable row level security;
create policy "public read game state" on public.game_state for select using (true);
create policy "public insert game state" on public.game_state for insert with check (true);
create policy "public update game state" on public.game_state for update using (true) with check (true);
```

3. 将项目 URL 和 anon public key 填入 `config.js` 的 `supabase.url` 与 `supabase.anonKey`。

当前策略允许知道网页地址的人读写这一个共享数据行；如需限制编辑权限，应再接入 Supabase Auth 和更严格的 RLS 策略。

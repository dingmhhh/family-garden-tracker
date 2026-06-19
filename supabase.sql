-- ============================================================
-- 家庭菜园产量记录系统 - Supabase 建表 SQL
-- 使用方法：登录 Supabase 后台 -> 左侧菜单 SQL Editor -> New query
-- 把下面全部内容粘贴进去 -> 点击 Run
-- ============================================================

-- 1. 蔬菜品种表
create table if not exists vegetables (
  id          bigint generated always as identity primary key,
  name        text not null,
  default_unit text not null default '斤',
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. 每日收获记录表
create table if not exists harvest_records (
  id            bigint generated always as identity primary key,
  harvest_date  date not null,
  vegetable_id  bigint references vegetables(id) on delete set null,
  amount        numeric not null check (amount >= 0),
  unit          text not null,
  recorder      text,
  note          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 加快按日期 / 品种查询的速度
create index if not exists idx_harvest_records_date on harvest_records (harvest_date);
create index if not exists idx_harvest_records_vegetable on harvest_records (vegetable_id);

-- ============================================================
-- 行级安全策略（RLS）说明
-- ============================================================
-- Supabase 默认会对新建的表开启 RLS（行级安全）。
-- 开启 RLS 后，如果不添加任何策略（policy），所有通过 anon key 的请求都会被拒绝，
-- 也就是网页会显示"读取失败"或"保存失败"。
--
-- 这个项目是只给家里 2-3 个人使用的小工具，不涉及敏感隐私数据，
-- 因此最简单的做法是：允许 anon（匿名）角色对这两张表自由读写。
--
-- 【重要安全提示】
-- 这种配置意味着：只要有人拿到你的 Supabase URL 和 anon key
-- （这两个值会被打包进前端代码，理论上任何能访问你网页的人都可能看到），
-- 就可以读取和修改这两张表的数据。
-- 这只适合"家庭小项目、数据不敏感"的场景，
-- 不要用这种方式存放真正需要保密的数据（如个人隐私、财务信息等）。
-- 如果未来需要更强的安全性，建议改用 Supabase Auth 做真正的账号登录。
-- ============================================================

-- 方式一（推荐，仍保留 RLS 但放开 anon 读写）：

alter table vegetables enable row level security;
alter table harvest_records enable row level security;

create policy "allow anon read vegetables"
  on vegetables for select
  to anon
  using (true);

create policy "allow anon insert vegetables"
  on vegetables for insert
  to anon
  with check (true);

create policy "allow anon update vegetables"
  on vegetables for update
  to anon
  using (true)
  with check (true);

create policy "allow anon delete vegetables"
  on vegetables for delete
  to anon
  using (true);

create policy "allow anon read harvest_records"
  on harvest_records for select
  to anon
  using (true);

create policy "allow anon insert harvest_records"
  on harvest_records for insert
  to anon
  with check (true);

create policy "allow anon update harvest_records"
  on harvest_records for update
  to anon
  using (true)
  with check (true);

create policy "allow anon delete harvest_records"
  on harvest_records for delete
  to anon
  using (true);

-- 方式二（最简单，但更不安全，仅本地测试可考虑）：
-- 直接关闭 RLS，不需要任何 policy
-- alter table vegetables disable row level security;
-- alter table harvest_records disable row level security;

-- ============================================================
-- 可选：插入几个示例蔬菜品种，方便第一次使用时测试
-- ============================================================
insert into vegetables (name, default_unit, note) values
  ('番茄', '斤', '后院左侧'),
  ('黄瓜', '根', '阳台架子'),
  ('生菜', '把', null)
on conflict do nothing;

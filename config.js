// ========================================
//  晶核日常管理 - 配置文件
//  直接修改这里的名字和设置即可
// ========================================

const CONFIG = {

  // ---- Supabase 云端同步 ----
  // 在 Supabase 项目中创建 game_state 表后，填写项目 URL 和 anon public key。
  // 留空时网页继续使用浏览器本地保存，不影响离线使用。
  supabase: {
    url: "https://bsqnbvbnvjtjyfgzdrbd.supabase.co",
    anonKey: "sb_publishable_qWO9BSxyBSDAbrB829aLdA_bvhZG5wv",
    table: "game_state",
    rowId: "default"
  },

  // ---- 账号 & 角色 ----
  // 页面按这里或本地设置页中的实际账号、角色数量自动编队。
  accounts: [
    { name: "用户3759/per", chars: ["兵god", "兵god2", "兵god3", "兵god4"], charUids: { "兵god": "35770523" } },
    { name: "180", chars: ["我不是问号", "雷霆2", "奥布里3", "A1804"], charUids: { "我不是问号": "35770414", "雷霆2": "35777432", "奥布里3": "35777535" } },
    { name: "153", chars: ["153蓝道夫", "枪leo1", "枪leo2", "枪leo3"], charUids: { "153蓝道夫": "35777639", "枪leo1": "36286189" } },
    { name: "头条159", chars: ["枪leo8", "枪leo9", "枪leo10", "枪leo11"], charUids: {} },
    { name: "17833952955", chars: ["AAA建材", "AAA回收空调", "AAA回收冰箱"], charUids: {} },
    { name: "180冰谷", chars: ["AAA战1", "AAA战2", "AAA战3", "AAA战4"], charUids: {} },
    { name: "180静谧", chars: ["AAA战5", "AAA战6", "AAA战7", "AAA战8"], charUids: {} },
    { name: "180真知", chars: ["AAA战9", "AAA战10", "AAA战11", "AAA战12"], charUids: {} },
    { name: "180进化", chars: ["AAA战13", "AAA战14", "AAA战15", "AAA战16"], charUids: {} },
    { name: "159冰谷", chars: ["AAA枪1", "AAA枪2", "AAA枪3", "AAA枪4"], charUids: {} },
    { name: "159静谧", chars: ["AAA枪5", "AAA枪6", "AAA枪7", "AAA枪8"], charUids: {} },
    { name: "159真知", chars: ["AAA枪9", "AAA枪10", "AAA枪11", "AAA枪12"], charUids: {} },
    { name: "159进化", chars: ["AAA枪13", "AAA枪14", "AAA枪15", "AAA枪16"], charUids: {} }
  ],

  // 编号和设备仅用于显示；编队不再依赖固定槽位。
  rosterPlanVersion: 29,
  preferredRaidLeaders: ["AAA建材"],
  characterCodePlan: [
    ["用户3759/per-1", "用户3759/per-2", "用户3759/per-3", "用户3759/per-4"], ["180-1", "180-2", "180-3", "180-4"],
    ["153-1", "153-2", "153-3", "153-4"],
    ["头条159-1", "头条159-2", "头条159-3", "头条159-4"],
    ["17833952955-1", "17833952955-2", "17833952955-3"],
    ["180冰谷-1", "180冰谷-2", "180冰谷-3", "180冰谷-4"], ["180静谧-1", "180静谧-2", "180静谧-3", "180静谧-4"],
    ["180真知-1", "180真知-2", "180真知-3", "180真知-4"], ["180进化-1", "180进化-2", "180进化-3", "180进化-4"],
    ["159冰谷-1", "159冰谷-2", "159冰谷-3", "159冰谷-4"], ["159静谧-1", "159静谧-2", "159静谧-3", "159静谧-4"],
    ["159真知-1", "159真知-2", "159真知-3", "159真知-4"], ["159进化-1", "159进化-2", "159进化-3", "159进化-4"]
  ],
  accountCodePlan: ["用户3759/per", "180", "153", "头条159", "17833952955", "180冰谷", "180静谧", "180真知", "180进化", "159冰谷", "159静谧", "159真知", "159进化"],
  accountDevicePlan: ["平板", "平板", "平板", "手机2", "电脑", "电脑", "平板", "手机1", "手机2", "电脑", "平板", "手机1", "手机2"],
  characterRoleTiers: {
    "AAA建材": "large", "兵god": "medium", "兵god2": "medium", "兵god3": "medium", "兵god4": "medium",
    "我不是问号": "medium", "雷霆2": "medium", "奥布里3": "medium", "A1804": "medium",
    "153蓝道夫": "medium", "枪leo1": "medium", "枪leo2": "medium", "枪leo3": "medium",
    "AAA战1": "small", "AAA战2": "small", "AAA战3": "small", "AAA战4": "small",
    "AAA战5": "small", "AAA战6": "small", "AAA战7": "small", "AAA战8": "small",
    "AAA战9": "small", "AAA战10": "small", "AAA战11": "small", "AAA战12": "small",
    "AAA战13": "small", "AAA战14": "small", "AAA战15": "small", "AAA战16": "small",
    "AAA枪1": "small", "AAA枪2": "small", "AAA枪3": "small", "AAA枪4": "small",
    "AAA枪5": "small", "AAA枪6": "small", "AAA枪7": "small", "AAA枪8": "small",
    "AAA枪9": "small", "AAA枪10": "small", "AAA枪11": "small", "AAA枪12": "small",
    "AAA枪13": "small", "AAA枪14": "small", "AAA枪15": "small", "AAA枪16": "small",
    "枪leo8": "medium", "枪leo9": "medium", "枪leo10": "medium", "枪leo11": "medium"
  },
  // 日常按大区独立组队；未单独标注的角色默认属于1大区。
  // 团本不会读取此配置，不同大区仍可一起打团本。
  characterRegions: {},

  // ---- 统一调度约束（所有自动安排共同读取；新增规则继续追加在这里）----
  schedulingConstraints: {
    dailyRuleVersion: 2,
    deviceAccountLimit: 6,
    requiredAccountDevices: {},
    dailyPartySize: 4,
    dailyPartyDifferentAccounts: true,
    dailyPartySameRegion: true,
    dailyIgnoreRoleTiers: true,
    staminaCycleDays: 5,
    staminaRunsPerCycle: 3,
    staminaRunOffsets: [0, 2, 4],
    staminaPerDay: 140,
    dailyScheduleStartDate: "2026-08-04",
    dailyBaselineDate: "2026-08-03",
    raidWeeklyRewards: 5,
    raidDailyRewardsPerDungeon: 1,
    raidCycleDays: 7,
    raidRefreshWeekdays: [1, 3],
    raidLeaderFreeEntriesPerDungeon: 3,
    raidLeaderMaxRuns: {},
    raidLeadersOnComputer: true,
    raidLeaderDevices: ["电脑"],
    raidDefaultAutoMode: "single",
    raidDefaultSingleLeader: "AAA建材",
    raidSingleCarryAssistLeaders: [],
    raidTabletRotationCharacters: [],
    raidFixedComputerMembers: [],
    raidLeaderRequiredDevices: { "AAA建材": "电脑" },
    // 国王多号固定方案：唯一大号AAA建材重复带队；每队1中号+2区服小号。
    // 每个可用中号出场一次，用完即停止；其余小号不排队、不转单刷。
    raidPartyDifferentAccounts: true,
    raidUsePreferredLeadersFirst: true,
    raidAllowStandaloneRemainder: true,
    raidPriorityCharacters: [],
    raidPreferredStandaloneCharacter: "",
    raidMultiAccountNames: ["180冰谷", "180静谧", "180真知", "180进化", "159冰谷", "159静谧", "159真知", "159进化"],
    goldFleeceDays: [1, 3, 5, 6, 0],
    goldFleeceSolo: true,
    goldFleeceOncePerDay: true,
    achievementOncePerCharacter: true,
    raidFirstClearRotation: 4,
    eliteIntervalDays: 10
  },

  // ---- 51角色固定团本表（不再运行自动编队算法）----
  fixedRaidSquads: [
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "153蓝道夫", "手机1": "AAA枪1",  "手机2": "AAA枪5" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "枪leo1",    "手机1": "AAA枪2",  "手机2": "AAA枪6" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "枪leo2",    "手机1": "AAA枪3",  "手机2": "AAA枪7" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "枪leo3",    "手机1": "AAA枪4",  "手机2": "AAA枪8" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "我不是问号", "手机1": "AAA枪9",  "手机2": "AAA枪13" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "雷霆2",      "手机1": "AAA枪10", "手机2": "AAA枪14" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "奥布里3",    "手机1": "AAA枪11", "手机2": "AAA枪15" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "A1804",      "手机1": "AAA枪12", "手机2": "AAA枪16" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "兵god",      "手机1": "AAA战1",  "手机2": "AAA战5" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "兵god2",     "手机1": "AAA战2",  "手机2": "AAA战6" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "兵god3",     "手机1": "AAA战3",  "手机2": "AAA战7" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "兵god4",     "手机1": "AAA战4",  "手机2": "AAA战8" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "枪leo8",     "手机1": "AAA战9",  "手机2": "AAA战13" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "枪leo9",     "手机1": "AAA战10", "手机2": "AAA战14" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "枪leo10",    "手机1": "AAA战11", "手机2": "AAA战15" } },
    { leader: "AAA建材", devices: { "电脑": "AAA建材", "平板": "枪leo11",    "手机1": "AAA战12", "手机2": "AAA战16" } }
  ],
  fixedRaidStandalone: ["AAA回收空调", "AAA回收冰箱"],

  // ---- 饰品 / 防具套装名称（两套配置彼此独立，可在网页中增删）----
  accessorySets: ["套装一", "套装二", "套装三"],
  armorSets: ["套装一", "套装二", "套装三"],

  // ---- 饰品槽位 ----
  accessorySlots: ["护符", "印章", "戒指", "腕带", "项链"],

  // ---- 防具槽位 ----
  armorSlots: ["头盔", "胸甲", "手套", "裤子", "鞋子"],

  // ---- 全局任务（每天总共各做1次，与账号/角色无关）----
  globalTasks: [
    { id: "流放签到", name: "流放之路签到", icon: "📜", goal: 7, type: "check" },
    { id: "火炬签到", name: "火炬之光签到", icon: "🔥", goal: 7, type: "check" }
  ],

  // ---- 角色级任务（每个角色按各自周期完成）----
  characterTasks: [
    { id: "金羊毛",   name: "金羊毛",         icon: "🐑", goal: 5,  type: "check",  note: "周一、三、五、六、日；每角色单人1次；按设备账号容量安排", scheduleDays: [1, 3, 5, 6, 0], grouped: false, solo: true, oncePerDay: true },
    { id: "体力",     name: "清理体力",         icon: "⚡", goal: 3,  type: "check",  note: "执行页每天显示全部角色，按大区分别组队", scheduleDays: [0, 1, 2, 3, 4, 5, 6], grouped: true },
    { id: "虚空",     name: "虚空",             icon: "🌀", goal: 7,  type: "check",  note: "登录清体力时一并完成", scheduleDays: [0, 1, 2, 3, 4, 5, 6], grouped: true }
  ],

  // ---- 一次性成就任务（每个角色分别完成，永久保存）----
  achievementTasks: [
    { id: "exploration", name: "探索", icon: "🧭" },
    { id: "arena", name: "角斗场", icon: "🏟️" },
    { id: "veteran", name: "历战", icon: "⚔️" },
    { id: "equipment-build", name: "配装", icon: "🛡️" },
    { id: "raid-first-1", name: "团本首通1", icon: "①", category: "raid-first", rotation: 0 },
    { id: "raid-first-2", name: "团本首通2", icon: "②", category: "raid-first", rotation: 1 },
    { id: "raid-first-3", name: "团本首通3", icon: "③", category: "raid-first", rotation: 2 },
    { id: "raid-first-4", name: "团本首通4", icon: "④", category: "raid-first", rotation: 3 }
  ],

  // ---- 周期成就任务（每个角色每周完成，周一刷新）----
  weeklyAchievementTasks: [
    { id: "lingxiang-frenzy", name: "灵响狂潮", icon: "🔔", weekStartDay: 1 }
  ],

  // ---- 团本循环（每次开放相邻两个：遗迹→天启→国王→皇后→遗迹；全部单托）----
  raidDungeons: [
    { id: "ruins", name: "遗迹", icon: "🏛️", weeklyLimit: 5, carryMode: "single" },
    { id: "apocalypse", name: "天启", icon: "🌋", weeklyLimit: 5, carryMode: "single" },
    { id: "king", name: "国王", icon: "👑", weeklyLimit: 5, carryMode: "single" },
    { id: "queen", name: "皇后", icon: "♛", weeklyLimit: 5, carryMode: "single" }
  ],

  // ---- 每周起始日（0=周日, 1=周一）----
  weekStartDay: 1
};

// game.js 通过 window.CONFIG 读取配置；顶层 const 不会自动挂到 window。
window.CONFIG = CONFIG;

// ==========================================
//  晶核游戏管理 - 游戏逻辑
//  从 晶核管理.html 提取
// ==========================================

const STORAGE_KEY = 'jh_manager_data';
const ALL_WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6];
const STAMINA_FIRST_DATE = '2026-08-01';
const DAILY_GROUP_DEVICES = ['电脑', '平板', '手机1', '手机2'];
const RAID_TABLET_GOLD_TRANSFER_PER_MILLE = 973;
const DEFAULT_SCHEDULING_CONSTRAINTS = Object.freeze({
  dailyRuleVersion: 2,
  deviceAccountLimit: 6,
  requiredAccountDevices: Object.freeze({}),
  dailyPartySize: 4,
  dailyPartyDifferentAccounts: true,
  dailyPartySameRegion: true,
  dailyIgnoreRoleTiers: true,
  staminaCycleDays: 5,
  staminaRunsPerCycle: 3,
  staminaRunOffsets: Object.freeze([0, 2, 4]),
  staminaPerDay: 140,
  dailyScheduleStartDate: '2026-08-04',
  dailyBaselineDate: '2026-08-03',
  raidWeeklyRewards: 5,
  raidDailyRewardsPerDungeon: 1,
  raidCycleDays: 7,
  raidRefreshWeekdays: Object.freeze([1, 3]),
  raidLeaderFreeEntriesPerDungeon: 3,
  raidLeaderMaxRuns: Object.freeze({}),
  raidLeadersOnComputer: true,
  raidLeaderDevices: Object.freeze(['电脑']),
  raidDefaultAutoMode: 'single',
  raidDefaultSingleLeader: 'AAA建材',
  raidSingleCarryAssistLeaders: Object.freeze([]),
  raidTabletRotationCharacters: Object.freeze([]),
  raidFixedComputerMembers: Object.freeze([]),
  raidPartyDifferentAccounts: true,
  raidUsePreferredLeadersFirst: true,
  raidAllowStandaloneRemainder: true,
  raidPriorityCharacters: Object.freeze([]),
  raidPreferredStandaloneCharacter: '安德鲁2',
  raidMultiAccountNames: Object.freeze(['180冰谷', '180静谧', '180真知', '180进化', '159冰谷', '159静谧', '159真知', '159进化']),
  goldFleeceDays: [1, 3, 5, 6, 0],
  goldFleeceSolo: true,
  goldFleeceOncePerDay: true,
  achievementOncePerCharacter: true,
  raidFirstClearRotation: 4,
  eliteIntervalDays: 10,
});

const GAME_KNOWLEDGE_BASE_VERSION = 2;
const DEFAULT_GAME_OPTIMIZATION_PROFILE = {
  schemaVersion: 2,
  mode: 'pve',
  pve: {
    strength: 0,
    attack: 10381,
    pierceAttack: 0,
    penetration: 0,
    enemyDefense: 0,
    strengthPercent: 0,
    attackPercent: 0,
    critDamage: 172.3,
    elementStrength: 18,
    damageBonus: 12.2,
    basicAttackDamage: 0,
    skillDamage: 20.4,
    controlDamage: 20.4,
    equipmentDamage: 0,
    costumeDamage: 0,
    emblemDamage: 0,
    petDamage: 0,
    adventureDamage: 0,
    circuitDamage: 0,
    additionalDamage: 0,
    attributeDamage: 0,
    inscriptionDamage: 0,
    basicShare: 0,
    skillShare: 1,
  },
  pvp: {
    strength: 0,
    attack: 10381,
    pierceAttack: 0,
    penetration: 0,
    enemyDefense: 0,
    strengthPercent: 0,
    attackPercent: 0,
    critRate: 66.2,
    critDamage: 172.3,
    elementStrength: 18,
    enemyElementResistance: 0,
    damageBonus: 12.2,
    enemyDamageResistance: 0,
    skillDamage: 20.4,
    controlDamage: 20.4,
    emblemDamage: 0,
    adventureDamage: 0,
    circuitDamage: 0,
    attributeDamage: 0,
    ownElementResistance: 0,
    ownDamageResistance: 0,
    enemyElementStrength: 0,
    enemyDamageBonus: 0,
    baseHealth: 0,
  },
  equippedAffixes: [
    { slot: '头盔', primary: '攻坚-强压 Lv.1', secondary: '暴击率+2.2%；对Boss伤害+2.6%/+3.1%' },
    { slot: '胸甲', primary: '攻坚-独战 Lv.1', secondary: '暴击率+3.7%；对Boss伤害+3.7%；力量+0.6%' },
    { slot: '手套', primary: '连击-连环 Lv.2', secondary: '破盾后伤害+2.6%；冷却速度+0.9%；暴击伤害+6.3%/+4.4%' },
    { slot: '裤子', primary: '攻坚-清剿 Lv.1', secondary: '破盾后伤害+2.6%；暴击伤害+4.1%/+6.3%' },
    { slot: '鞋子', primary: '终断-增幅 Lv.1', secondary: '普攻技能伤害+1.8%；暴击伤害+5.0%/+5.1%' },
    { slot: '护符', primary: '技能-四号 Lv.1', secondary: '暴击率+2.3%/+3.2%；智力+24' },
    { slot: '武器', primary: '技能-辅锋 Lv.2', secondary: '暴击伤害+5.1%/+7.3%；冷却时间降低4.4%' },
    { slot: '项链', primary: '稳打-近攻 Lv.1', secondary: '物理攻击力+16；暴击伤害+5.3%/+3.2%' },
    { slot: '腕带', primary: '技能-三号 Lv.1', secondary: '暴击伤害+3.1%/+2.6%/+2.9%' },
    { slot: '戒指', primary: '光环-洞察 Lv.1', secondary: '暴击率+1.8%/+2.2%；伤害提升+2.3%' },
    { slot: '印章', primary: '攻坚-强敌 Lv.1', secondary: '暴击率+2.8%/+2.3%' },
  ],
};

let raidPriorityDragChar = '';
const collapsedExecutionSections = new Set();
const collapsedExecutionCards = new Set();

const DEFAULT_GAME_KNOWLEDGE_BASE = `# 晶核官方伤害计算知识库

## 权威来源
- 《晶核.计算器（全）》：PVE提升率6.20、PVE回路6.8、PVP提升率6.20、PVP回路6.14。
- 《赛季服拓印提升率计算》：活性拓印属性、共鸣归属和拓印独立增伤。
- 《PVE和PVP回路提升率》：PVE/PVP回路突破属性与副属性公式。
- 本知识库与上述官方工作簿冲突时，一律以工作簿公式为准。

## 总原则
- 同一乘区内先相加，不同乘区之间相乘。
- 对Boss伤害、克制异常等统一属于“克制乘区”，不存在旧版单独的“异常状态伤害乘区”。
- 共鸣期间伤害属于普攻/技伤乘区。
- 冷却、攻速、会心等未进入三份官方表的项目只标记为“官方表未量化”，不得自行固定倍率或参与排行。

## PVE官方边际公式
- 新增爆伤x：x ÷（100 + 当前爆伤）。PVE表不使用暴击率期望公式。
- 新增属强x：x ÷（220 + 当前属强）。
- 新增伤害提升x：x ÷（100 + 当前伤害提升）。
- 新增克制/Boss伤害x：x ÷（100 + 当前克制乘区）。
- 新增普攻x：x ÷（100 + 当前普攻）× 普攻占比。
- 新增技伤x：x ÷（100 + 当前技伤）× 技伤占比。
- 装备、装扮、徽记、宠物、冒险团、回路、附加伤害、属性伤害均为各自独立乘区，分别使用x ÷（100 + 当前乘区）。
- 拓印增伤为独立乘区；同一件拓印的爆伤、属强、伤害提升、普攻/技伤、克制、拓印增伤按官方公式组合。
- 普通攻击力受敌人防御与穿透影响：防御系数 = 3500 ÷［3500 + 敌人防御 ×（1 - 穿透率）］。
- 破防攻击直接加入有效攻击；总攻击部分 = 普通攻击力 × 防御系数 + 破防攻击。
- 力智、力智百分比、攻击百分比、基础力智和基础攻击力只影响普通攻击力部分，必须按普通攻击占比折算。

## PVP官方边际公式
- 暴击期望倍率 = 1 + 暴击率 × 爆伤；只有PVP使用暴击率与爆伤联合模型。
- 新增属强x：x ÷（220 + 当前属强 - 敌人属抗）。
- 新增伤害提升x：x ÷（100 + 当前伤害提升 - 敌人伤害抵抗）。
- 技伤、克制、徽记、冒险团、回路、全属性伤害仍是独立乘区。
- 攻击、破防攻击、穿透和敌人防御继续使用3500防御常数公式。
- PVP回路表直接填写完整回路属性，但回路属性算出的最终伤害提升需要乘0.5。
- PVP坦度需另外考虑己方属抗、伤害抵抗、基础生命，以及敌方属强和伤害提升。

## 使用规则
- 页面“每+1点属性收益”只比较当前面板附近的边际收益，不代表不同词条实际可获得数值相同。
- 比较具体装备、拓印或回路时，必须把该项目的全部属性变化一次性代入，不能只看单个词条。
- PVE和PVP的数据与公式严格分开；切换模式后只使用该模式的属性。
- 表格示例属性不自动视为当前角色属性；个人面板仍以页面输入为准。

## 已废弃的旧结论
- “异常状态伤害是独立乘区”。
- “物理穿透无法获得或不计分”。
- “PVE按暴击率×爆伤计算暴击期望”。
- 未经官方表验证的固定会心倍率、元素词条结论和主词条保留/替换排行。

本文档可继续编辑；重置时恢复本官方公式版本。`;

function getDefaultData() {
  const cfg = window.CONFIG || {};
  const allChars = [];
  (cfg.accounts || []).forEach(acc => {
    (acc.chars || []).forEach(ch => allChars.push({ account: acc.name, char: ch }));
  });

  return {
    config: JSON.parse(JSON.stringify(cfg)),
    dailyLog: {},
    dailyPlanner: { phases: {} },
    characterGold: {},
    characterAntiMagic: {},
    raidTabletGoldTransfers: {},
    goldTransferExecution: null,
    equipment: { unworn: {}, worn: {} },
    equipmentBuild: {},
    achievementProgress: {},
    weeklyAchievementProgress: {},
    eliteProgress: {},
    raidProgress: {},
    raidPlanner: { bigCharacters: [], leaderRuns: {}, savedSquads: [] },
    dailyStarManualSquads: null,
    knowledgeBase: DEFAULT_GAME_KNOWLEDGE_BASE,
    knowledgeBaseVersion: GAME_KNOWLEDGE_BASE_VERSION,
    optimizationProfile: JSON.parse(JSON.stringify(DEFAULT_GAME_OPTIMIZATION_PROFILE)),
  };
}

function ensureSchedulingConstraints(config) {
  if (!config || typeof config !== 'object') return DEFAULT_SCHEDULING_CONSTRAINTS;
  const existing = config.schedulingConstraints && typeof config.schedulingConstraints === 'object' && !Array.isArray(config.schedulingConstraints)
    ? config.schedulingConstraints
    : {};
  const useCurrentDailyRule = Number(existing.dailyRuleVersion) >= DEFAULT_SCHEDULING_CONSTRAINTS.dailyRuleVersion;
  const staminaCycleDays = useCurrentDailyRule
    ? Math.max(1, Math.floor(Number(existing.staminaCycleDays) || DEFAULT_SCHEDULING_CONSTRAINTS.staminaCycleDays))
    : DEFAULT_SCHEDULING_CONSTRAINTS.staminaCycleDays;
  const staminaRunsPerCycle = useCurrentDailyRule
    ? Math.max(1, Math.min(staminaCycleDays, Math.floor(Number(existing.staminaRunsPerCycle) || DEFAULT_SCHEDULING_CONSTRAINTS.staminaRunsPerCycle)))
    : DEFAULT_SCHEDULING_CONSTRAINTS.staminaRunsPerCycle;
  const configuredOffsets = useCurrentDailyRule && Array.isArray(existing.staminaRunOffsets)
    ? [...new Set(existing.staminaRunOffsets.map(Number).filter(offset => Number.isInteger(offset) && offset >= 0 && offset < staminaCycleDays))]
    : [...DEFAULT_SCHEDULING_CONSTRAINTS.staminaRunOffsets];
  const staminaRunOffsets = configuredOffsets.length === staminaRunsPerCycle
    ? configuredOffsets.sort((left, right) => left - right)
    : [...DEFAULT_SCHEDULING_CONSTRAINTS.staminaRunOffsets];
  config.schedulingConstraints = {
    ...DEFAULT_SCHEDULING_CONSTRAINTS,
    ...existing,
    dailyRuleVersion: DEFAULT_SCHEDULING_CONSTRAINTS.dailyRuleVersion,
    deviceAccountLimit: Math.max(1, Math.floor(Number(existing.deviceAccountLimit) || DEFAULT_SCHEDULING_CONSTRAINTS.deviceAccountLimit)),
    requiredAccountDevices: Object.fromEntries(Object.entries(existing.requiredAccountDevices && typeof existing.requiredAccountDevices === 'object' && !Array.isArray(existing.requiredAccountDevices)
      ? existing.requiredAccountDevices
      : DEFAULT_SCHEDULING_CONSTRAINTS.requiredAccountDevices).filter(([account, device]) => account.trim() && DAILY_GROUP_DEVICES.includes(device))),
    dailyPartySize: Math.max(1, Math.min(DAILY_GROUP_DEVICES.length, Math.floor(Number(existing.dailyPartySize) || DEFAULT_SCHEDULING_CONSTRAINTS.dailyPartySize))),
    dailyPartyDifferentAccounts: true,
    dailyPartySameRegion: true,
    dailyIgnoreRoleTiers: true,
    staminaCycleDays,
    staminaRunsPerCycle,
    staminaRunOffsets,
    dailyScheduleStartDate: useCurrentDailyRule && /^\d{4}-\d{2}-\d{2}$/.test(existing.dailyScheduleStartDate || '') ? existing.dailyScheduleStartDate : DEFAULT_SCHEDULING_CONSTRAINTS.dailyScheduleStartDate,
    dailyBaselineDate: useCurrentDailyRule && /^\d{4}-\d{2}-\d{2}$/.test(existing.dailyBaselineDate || '') ? existing.dailyBaselineDate : DEFAULT_SCHEDULING_CONSTRAINTS.dailyBaselineDate,
    raidWeeklyRewards: Math.max(1, Math.floor(Number(existing.raidWeeklyRewards) || DEFAULT_SCHEDULING_CONSTRAINTS.raidWeeklyRewards)),
    raidDailyRewardsPerDungeon: 1,
    raidCycleDays: 7,
    raidRefreshWeekdays: Array.isArray(existing.raidRefreshWeekdays) && existing.raidRefreshWeekdays.length >= 2
      ? existing.raidRefreshWeekdays.slice(0, 2).map((day, index) => Number.isInteger(Number(day)) && Number(day) >= 0 && Number(day) <= 6 ? Number(day) : DEFAULT_SCHEDULING_CONSTRAINTS.raidRefreshWeekdays[index])
      : [...DEFAULT_SCHEDULING_CONSTRAINTS.raidRefreshWeekdays],
    raidLeaderFreeEntriesPerDungeon: Math.max(0, Math.floor(Number(existing.raidLeaderFreeEntriesPerDungeon) || DEFAULT_SCHEDULING_CONSTRAINTS.raidLeaderFreeEntriesPerDungeon)),
    raidLeaderDevices: Array.isArray(existing.raidLeaderDevices)
      ? [...new Set(existing.raidLeaderDevices.filter(device => DAILY_GROUP_DEVICES.includes(device)))]
      : [...DEFAULT_SCHEDULING_CONSTRAINTS.raidLeaderDevices],
    raidSingleCarryAssistLeaders: Array.isArray(existing.raidSingleCarryAssistLeaders)
      ? [...new Set(existing.raidSingleCarryAssistLeaders.map(name => String(name || '').trim()).filter(Boolean))]
      : [...DEFAULT_SCHEDULING_CONSTRAINTS.raidSingleCarryAssistLeaders],
    raidTabletRotationCharacters: Array.isArray(existing.raidTabletRotationCharacters)
      ? [...new Set(existing.raidTabletRotationCharacters.map(name => String(name || '').trim()).filter(Boolean))]
      : [...DEFAULT_SCHEDULING_CONSTRAINTS.raidTabletRotationCharacters],
    raidFixedComputerMembers: Array.isArray(existing.raidFixedComputerMembers)
      ? existing.raidFixedComputerMembers.map(item => ({ squadIndex: Math.max(0, Math.floor(Number(item?.squadIndex) || 0)), character: String(item?.character || '').trim() })).filter(item => item.character)
      : [...DEFAULT_SCHEDULING_CONSTRAINTS.raidFixedComputerMembers],
    raidMultiAccountNames: Array.isArray(existing.raidMultiAccountNames)
      ? [...new Set(existing.raidMultiAccountNames.map(name => String(name || '').trim()).filter(Boolean))]
      : [...DEFAULT_SCHEDULING_CONSTRAINTS.raidMultiAccountNames],
    goldFleeceDays: Array.isArray(existing.goldFleeceDays) ? [...new Set(existing.goldFleeceDays.map(Number).filter(day => day >= 0 && day <= 6))] : [...DEFAULT_SCHEDULING_CONSTRAINTS.goldFleeceDays],
    eliteIntervalDays: Math.max(1, Math.floor(Number(existing.eliteIntervalDays) || DEFAULT_SCHEDULING_CONSTRAINTS.eliteIntervalDays)),
  };
  return config.schedulingConstraints;
}

function getSchedulingConstraints() {
  return ensureSchedulingConstraints(DATA.config);
}

// UID 属于角色。兼容旧版账号级 uid：只有账号仅含一个角色时才能无歧义迁移。
function normalizeCharacterUids(accounts) {
  (accounts || []).forEach(acc => {
    if (!acc.charUids || typeof acc.charUids !== 'object' || Array.isArray(acc.charUids)) acc.charUids = {};
    const chars = Array.isArray(acc.chars) ? acc.chars : [];
    if (acc.uid) {
      if (chars.length === 1 && !acc.charUids[chars[0]]) {
        acc.charUids[chars[0]] = String(acc.uid).trim();
      } else if (chars.length !== 1 && !acc.legacyAccountUid) {
        // 多角色时无法判断旧 UID 的归属，仅保留备份，不错误分配给所有角色。
        acc.legacyAccountUid = String(acc.uid).trim();
      }
    }
    delete acc.uid;
  });
}

function normalizeConfiguredRoster(config, template) {
  if (!config || !template) return false;
  const before = JSON.stringify(config);
  const storedRosterPlanVersion = Number(config.rosterPlanVersion) || 0;
  if (!Array.isArray(config.accounts)) config.accounts = [];
  // 清理旧演示/测试占位账号。仅匹配“账号1～账号N”且角色全为“角色A/角1”这类占位名，
  // 不会删除真实中文账号、手机号账号或任何真实角色。
  config.accounts = config.accounts.filter(account => {
    const placeholderAccount = /^账号\d+$/u.test(String(account?.name || '').trim());
    const chars = Array.isArray(account?.chars) ? account.chars : [];
    const placeholderChars = chars.length > 0 && chars.every(name => /^(?:角色[A-Z]|角色\d+(?:-\d+)?|角\d+(?:-\d+)?)$/u.test(String(name || '').trim()));
    return !(placeholderAccount && placeholderChars);
  });
  // 2026-08 单托名单迁移：我不是nai及其空账号已正式退出。
  const retiredCharacters = new Set(['我不是nai/1000/8624', '我不是nai']);
  config.accounts.forEach(account => {
    account.chars = (account.chars || []).filter(name => !retiredCharacters.has(name));
    retiredCharacters.forEach(name => { if (account.charUids) delete account.charUids[name]; });
  });
  config.accounts = config.accounts.filter(account => (account.chars || []).length || account.name !== '用户1000/8624');
  config.accounts.forEach((account, accountIndex) => {
    if (!Array.isArray(account.chars)) account.chars = [];
    if (!account.charUids || typeof account.charUids !== 'object' || Array.isArray(account.charUids)) account.charUids = {};
    if (!Array.isArray(config.characterCodePlan)) config.characterCodePlan = [];
    // 显示编号直接使用真实账号名，避免旧版“账号1/账号2”无法辨认。
    config.characterCodePlan[accountIndex] = account.chars.map((_, charIndex) => `${account.name}-${charIndex + 1}`);
  });
  config.characterCodePlan.length = config.accounts.length;
  config.accountCodePlan = config.accounts.map(account => account.name);
  const requiredAccountDevices = ensureSchedulingConstraints(config).requiredAccountDevices;
  config.accountDevicePlan = config.accounts.map((account, index) => requiredAccountDevices[account.name] || config.accountDevicePlan?.[index] || DAILY_GROUP_DEVICES[index % DAILY_GROUP_DEVICES.length]);
  config.preferredRaidLeaders = Array.isArray(config.preferredRaidLeaders) && config.preferredRaidLeaders.length
    ? config.preferredRaidLeaders
    : JSON.parse(JSON.stringify(template.preferredRaidLeaders || ['麻薯饼干', 'AAA建材']));
  // 新版团本规则覆盖旧本地规则，但不覆盖用户已有的进度记录。
  const templateConstraints = template.schedulingConstraints || {};
  config.preferredRaidLeaders = JSON.parse(JSON.stringify(template.preferredRaidLeaders || config.preferredRaidLeaders));
  if (storedRosterPlanVersion < 29 || !Array.isArray(config.fixedRaidSquads) || !config.fixedRaidSquads.length) {
    config.fixedRaidSquads = JSON.parse(JSON.stringify(template.fixedRaidSquads || []));
  }
  if (storedRosterPlanVersion < 25 || !Array.isArray(config.fixedRaidStandalone)) {
    config.fixedRaidStandalone = JSON.parse(JSON.stringify(template.fixedRaidStandalone || []));
  }
  config.schedulingConstraints = ensureSchedulingConstraints(config);
  if (Array.isArray(templateConstraints.raidSingleCarryAssistLeaders)) {
    config.schedulingConstraints.raidSingleCarryAssistLeaders = [...templateConstraints.raidSingleCarryAssistLeaders];
  }
  if (Array.isArray(templateConstraints.raidTabletRotationCharacters)) {
    config.schedulingConstraints.raidTabletRotationCharacters = [...templateConstraints.raidTabletRotationCharacters];
  }
  if (Array.isArray(templateConstraints.raidFixedComputerMembers)) {
    config.schedulingConstraints.raidFixedComputerMembers = JSON.parse(JSON.stringify(templateConstraints.raidFixedComputerMembers));
  }
  if (Array.isArray(templateConstraints.raidLeaderDevices)) {
    config.schedulingConstraints.raidLeaderDevices = [...templateConstraints.raidLeaderDevices];
  }
  if (templateConstraints.requiredAccountDevices && typeof templateConstraints.requiredAccountDevices === 'object') {
    config.schedulingConstraints.requiredAccountDevices = JSON.parse(JSON.stringify(templateConstraints.requiredAccountDevices));
  }
  ['raidLeaderRoundPlan', 'raidMiddleCharacters'].forEach(key => {
    if (Array.isArray(templateConstraints[key])) config.schedulingConstraints[key] = [...templateConstraints[key]];
  });
  ['raidLeaderRequiredDevices', 'raidOptimizedSquadPlan', 'raidMultiOptimizedSquadPlan'].forEach(key => {
    if (templateConstraints[key] && typeof templateConstraints[key] === 'object') config.schedulingConstraints[key] = JSON.parse(JSON.stringify(templateConstraints[key]));
  });
  if (templateConstraints.raidMiddlePreferredDevice) config.schedulingConstraints.raidMiddlePreferredDevice = templateConstraints.raidMiddlePreferredDevice;
  // v22唯一有效编队配置：按角色反查AAA建材当前所在账号，账号改名后仍强制只在电脑登录。
  const aaaAccount = config.accounts.find(account => (account.chars || []).includes('AAA建材'));
  if (aaaAccount) {
    const requiredDevices = config.schedulingConstraints.requiredAccountDevices || {};
    ['17833952955', '178'].forEach(accountName => {
      if (accountName !== aaaAccount.name) delete requiredDevices[accountName];
    });
    requiredDevices[aaaAccount.name] = '电脑';
    config.schedulingConstraints.requiredAccountDevices = requiredDevices;
    const aaaAccountIndex = config.accounts.indexOf(aaaAccount);
    if (!Array.isArray(config.accountDevicePlan)) config.accountDevicePlan = [];
    config.accountDevicePlan[aaaAccountIndex] = '电脑';
  }
  config.preferredRaidLeaders = ['AAA建材'];
  config.schedulingConstraints.raidDefaultSingleLeader = 'AAA建材';
  config.schedulingConstraints.raidSingleCarryAssistLeaders = [];
  config.schedulingConstraints.raidLeadersOnComputer = true;
  config.schedulingConstraints.raidLeaderDevices = ['电脑'];
  config.schedulingConstraints.raidLeaderRequiredDevices = { 'AAA建材': '电脑' };
  config.schedulingConstraints.raidTabletRotationCharacters = [];
  config.schedulingConstraints.raidFixedComputerMembers = [];
  delete config.schedulingConstraints.raidLeaderRoundPlan;
  delete config.schedulingConstraints.raidMiddleCharacters;
  delete config.schedulingConstraints.raidMiddlePreferredDevice;
  delete config.schedulingConstraints.raidDoubleCarryComputerLeader;
  delete config.schedulingConstraints.raidDoubleCarryTabletLeader;
  delete config.schedulingConstraints.raidOptimizedSquadPlan;
  delete config.schedulingConstraints.raidMultiOptimizedSquadPlan;
  // 默认分层只补充本地尚未设置的角色；账号管理中的选择永远优先，不能在刷新时被覆盖。
  const savedRoleTiers = config.characterRoleTiers && typeof config.characterRoleTiers === 'object' && !Array.isArray(config.characterRoleTiers)
    ? config.characterRoleTiers
    : {};
  config.characterRoleTiers = {
    ...JSON.parse(JSON.stringify(template.characterRoleTiers || {})),
    ...savedRoleTiers,
  };
  const savedRegions = config.characterRegions && typeof config.characterRegions === 'object' && !Array.isArray(config.characterRegions)
    ? config.characterRegions
    : {};
  config.characterRegions = {
    ...JSON.parse(JSON.stringify(template.characterRegions || {})),
    ...savedRegions,
  };
  Object.keys(config.characterRegions).forEach(charName => {
    if (!['region1', 'region2'].includes(config.characterRegions[charName])) config.characterRegions[charName] = 'region1';
  });
  const configuredCharacters = new Set(config.accounts.flatMap(account => account.chars || []));
  // v11 只追加本次明确新增的两个角色。不能按模板补齐整个名单，否则用户主动删除的旧角色会复活。
  if (storedRosterPlanVersion < 11) {
    const additions = ['AAA回收空调', 'AAA回收冰箱'];
    const target = config.accounts.find(account => (account.chars || []).includes('AAA建材'));
    if (target) {
      additions.forEach(charName => {
        if (configuredCharacters.has(charName)) return;
        target.chars.push(charName);
        configuredCharacters.add(charName);
      });
    }
  }
  // v15：在用户已经清理过的本地名单上，仅向现有180账号追加新角色；
  // 不从模板恢复任何已被用户主动删除的账号或旧角色。
  if (storedRosterPlanVersion < 15 && !configuredCharacters.has('A1804')) {
    const account180 = config.accounts.find(account => String(account.name || '').trim() === '180');
    if (account180) {
      account180.chars.push('A1804');
      configuredCharacters.add('A1804');
      config.characterRoleTiers.A1804 = config.characterRoleTiers.A1804 || 'small';
    }
  }
  // v16/v17：以账号与角色管理确认的现行名单为准，只永久移除1333，
  // 并一次性补入四个脚本区账号。只处理这次明确变更，不恢复其他历史账号。
  if (storedRosterPlanVersion < 17) {
    const retiredAccounts = new Set(['1333']);
    const retiredNames = config.accounts.filter(account => retiredAccounts.has(account.name)).flatMap(account => account.chars || []);
    config.accounts = config.accounts.filter(account => !retiredAccounts.has(account.name));
    // 若错误的v16迁移曾移除头条159，v17按正式模板恢复该账号及两个角色。
    const headlineTemplate = (template.accounts || []).find(account => account.name === '头条159');
    if (headlineTemplate) {
      let headline = config.accounts.find(account => account.name === '头条159');
      if (!headline) {
        headline = { name: '头条159', chars: [], charUids: {} };
        const account1599Index = config.accounts.findIndex(account => account.name === '1599');
        config.accounts.splice(account1599Index >= 0 ? account1599Index + 1 : config.accounts.length, 0, headline);
      }
      (headlineTemplate.chars || []).forEach(charName => { if (!headline.chars.includes(charName)) headline.chars.push(charName); });
    }
    const scriptAccounts = [
      { name: '脚本A区', prefix: 'A区' }, { name: '脚本B区', prefix: 'B区' },
      { name: '脚本C区', prefix: 'C区' }, { name: '脚本D区', prefix: 'D区' },
    ];
    scriptAccounts.forEach(({ name, prefix }) => {
      const chars = [1, 2, 3, 4].map(number => `${prefix}${number}`);
      let account = config.accounts.find(item => item.name === name);
      if (!account) {
        account = { name, chars: [], charUids: {} };
        config.accounts.push(account);
      }
      chars.forEach(charName => { if (!account.chars.includes(charName)) account.chars.push(charName); });
      chars.forEach(charName => { config.characterRoleTiers[charName] = 'small'; });
    });
    config.preferredRaidLeaders = ['AAA建材'];
    config.schedulingConstraints.raidDefaultSingleLeader = 'AAA建材';
    config.schedulingConstraints.raidSingleCarryAssistLeaders = [];
    config.schedulingConstraints.raidMultiAccountNames = scriptAccounts.map(item => item.name);
    config.schedulingConstraints.raidOptimizedSquadPlan = [];
    delete config.schedulingConstraints.requiredAccountDevices['1333'];
    // 数据清理由 loadData 在拿到完整 data 对象后执行；先暂存需要清理的角色名。
    config.retiredRosterCharacters = retiredNames;
  }
  // v18：1599账号及其四个角色已移除；清理旧数据后，普通模式正好9队完整1带3。
  if (storedRosterPlanVersion < 18) {
    const retired1599 = config.accounts.find(account => account.name === '1599');
    const retiredNames = retired1599?.chars || [];
    config.accounts = config.accounts.filter(account => account.name !== '1599');
    config.retiredRosterCharacters = [...new Set([...(config.retiredRosterCharacters || []), ...retiredNames])];
  }
  // v19：纠正脚本区等级，四区16个角色全部为小号；唯一大号仍是AAA建材。
  if (storedRosterPlanVersion < 19) {
    ['A区', 'B区', 'C区', 'D区'].forEach(prefix => {
      [1, 2, 3, 4].forEach(number => { config.characterRoleTiers[`${prefix}${number}`] = 'small'; });
    });
    config.characterRoleTiers['AAA建材'] = 'large';
    config.schedulingConstraints.raidMultiOptimizedSquadPlan = JSON.parse(JSON.stringify(templateConstraints.raidMultiOptimizedSquadPlan || []));
  }
  // v20：按账号管理最终截图纠正中号等级。
  if (storedRosterPlanVersion < 20) {
    ['兵god', '我不是问号', '雷霆2', '奥布里3', 'A1804', '153蓝道夫', '枪leo1', '枪leo2', '枪leo3']
      .forEach(charName => { config.characterRoleTiers[charName] = 'medium'; });
    config.characterRoleTiers['AAA建材'] = 'large';
    ['A区', 'B区', 'C区', 'D区'].forEach(prefix => [1, 2, 3, 4].forEach(number => { config.characterRoleTiers[`${prefix}${number}`] = 'small'; }));
  }
  // v21：用户3759/per账号新增中号兵god2。
  if (storedRosterPlanVersion < 21) {
    const account = config.accounts.find(item => item.name === '用户3759/per');
    if (account && !account.chars.includes('兵god2')) account.chars.push('兵god2');
    config.characterRoleTiers['兵god2'] = 'medium';
  }
  // v23：四个脚本区账号改为180区服名，16个角色统一连续编号为AAA战1～AAA战16。
  if (storedRosterPlanVersion < 23) {
    const accountRenames = [
      { oldAccount: '脚本A区', newAccount: '180冰谷', oldPrefix: 'A区', firstNumber: 1 },
      { oldAccount: '脚本B区', newAccount: '180静谧', oldPrefix: 'B区', firstNumber: 5 },
      { oldAccount: '脚本C区', newAccount: '180真知', oldPrefix: 'C区', firstNumber: 9 },
      { oldAccount: '脚本D区', newAccount: '180进化', oldPrefix: 'D区', firstNumber: 13 },
    ];
    const characterRenames = [];
    const renamedAccounts = [];
    accountRenames.forEach(({ oldAccount, newAccount, oldPrefix, firstNumber }) => {
      const account = config.accounts.find(item => item.name === oldAccount)
        || config.accounts.find(item => (item.chars || []).some(name => new RegExp(`^${oldPrefix}[1-4]$`, 'u').test(name)));
      if (!account) return;
      if (account.name !== newAccount) renamedAccounts.push({ oldName: account.name, nextName: newAccount });
      account.name = newAccount;
      if (!account.charUids || typeof account.charUids !== 'object') account.charUids = {};
      [1, 2, 3, 4].forEach((oldNumber, offset) => {
        const oldName = `${oldPrefix}${oldNumber}`;
        const nextName = `AAA战${firstNumber + offset}`;
        const charIndex = account.chars.indexOf(oldName);
        if (charIndex < 0) return;
        account.chars[charIndex] = nextName;
        if (Object.prototype.hasOwnProperty.call(account.charUids, oldName)) {
          account.charUids[nextName] = account.charUids[oldName];
          delete account.charUids[oldName];
        }
        if (Object.prototype.hasOwnProperty.call(config.characterRoleTiers, oldName)) {
          config.characterRoleTiers[nextName] = config.characterRoleTiers[oldName];
          delete config.characterRoleTiers[oldName];
        }
        if (Object.prototype.hasOwnProperty.call(config.characterRegions, oldName)) {
          config.characterRegions[nextName] = config.characterRegions[oldName];
          delete config.characterRegions[oldName];
        }
        characterRenames.push({ oldName, nextName });
      });
    });
    config.schedulingConstraints.raidMultiAccountNames = accountRenames.map(item => item.newAccount);
    config.renamedRosterCharacters = characterRenames;
    config.renamedRosterAccounts = renamedAccounts;
  }
  // v24：按四个180区服账号的结构，追加四个159区服账号和AAA枪1～AAA枪16。
  if (storedRosterPlanVersion < 24) {
    const additions = [
      { name: '159冰谷', firstNumber: 1, device: '电脑' },
      { name: '159静谧', firstNumber: 5, device: '平板' },
      { name: '159真知', firstNumber: 9, device: '手机1' },
      { name: '159进化', firstNumber: 13, device: '手机2' },
    ];
    const currentCharacters = new Set(config.accounts.flatMap(account => account.chars || []));
    additions.forEach(({ name, firstNumber, device }) => {
      let account = config.accounts.find(item => item.name === name);
      if (!account) {
        account = { name, chars: [], charUids: {} };
        config.accounts.push(account);
        if (!Array.isArray(config.accountDevicePlan)) config.accountDevicePlan = [];
        config.accountDevicePlan.push(device);
      }
      if (!Array.isArray(account.chars)) account.chars = [];
      if (!account.charUids || typeof account.charUids !== 'object') account.charUids = {};
      [0, 1, 2, 3].forEach(offset => {
        const number = firstNumber + offset;
        const charName = `AAA枪${number}`;
        if (!currentCharacters.has(charName)) {
          account.chars.push(charName);
          currentCharacters.add(charName);
        }
        config.characterRoleTiers[charName] = config.characterRoleTiers[charName] || 'small';
        config.characterRegions[charName] = config.characterRegions[`AAA战${number}`] === 'region2' ? 'region2' : 'region1';
      });
    });
    config.schedulingConstraints.raidMultiAccountNames = [
      '180冰谷', '180静谧', '180真知', '180进化',
      '159冰谷', '159静谧', '159真知', '159进化',
    ];
  }
  // v25：补齐用户已确认的51角色名单，之后团本直接读取固定表。
  if (storedRosterPlanVersion < 25) {
    [
      { accountName: '用户3759/per', names: ['兵god3', '兵god4'] },
      { accountName: '头条159', names: ['枪leo10', '枪leo11'] },
    ].forEach(({ accountName, names }) => {
      const account = config.accounts.find(item => item.name === accountName);
      if (!account) return;
      names.forEach(charName => {
        if (!account.chars.includes(charName)) account.chars.push(charName);
        config.characterRoleTiers[charName] = config.characterRoleTiers[charName] || 'small';
        config.characterRegions[charName] = config.characterRegions[charName] === 'region2' ? 'region2' : 'region1';
      });
    });
  }
  // v26：四个普通账号共16个角色全部为中号，固定16队的平板位逐队使用一个中号。
  if (storedRosterPlanVersion < 26) {
    ['兵god', '兵god2', '兵god3', '兵god4', '我不是问号', '雷霆2', '奥布里3', 'A1804',
      '153蓝道夫', '枪leo1', '枪leo2', '枪leo3', '枪leo8', '枪leo9', '枪leo10', '枪leo11']
      .forEach(charName => { config.characterRoleTiers[charName] = 'medium'; });
    config.characterRoleTiers['AAA建材'] = 'large';
  }
  const refreshedCharacters = new Set(config.accounts.flatMap(account => account.chars || []));
  config.accounts.forEach((account, accountIndex) => {
    config.characterCodePlan[accountIndex] = account.chars.map((_, charIndex) => `${account.name}-${charIndex + 1}`);
  });
  config.characterCodePlan.length = config.accounts.length;
  config.accountCodePlan = config.accounts.map(account => account.name);
  Object.keys(config.characterRoleTiers).forEach(charName => {
    if (!refreshedCharacters.has(charName)) delete config.characterRoleTiers[charName];
  });
  Object.keys(config.characterRegions).forEach(charName => {
    if (!refreshedCharacters.has(charName)) delete config.characterRegions[charName];
  });
  if (Array.isArray(config.raidDungeons)) {
    config.raidDungeons.forEach(raid => { if (raid && typeof raid === 'object') raid.carryMode = 'single'; });
  }
  config.schedulingConstraints.raidPreferredStandaloneCharacter = templateConstraints.raidPreferredStandaloneCharacter || '';
  config.rosterPlanVersion = 29;
  delete config.dailyGroupPlan;
  delete config.raidSquadPlan;
  return before !== JSON.stringify(config);
}

function purgePlaceholderCharacterData(data) {
  const placeholder = name => /^(?:角色[A-Z]|角色\d+(?:-\d+)?|角\d+(?:-\d+)?)$/u.test(String(name || '').trim());
  const purgeKeys = object => {
    if (!object || typeof object !== 'object' || Array.isArray(object)) return;
    Object.keys(object).forEach(key => { if (placeholder(key)) delete object[key]; });
  };
  purgeKeys(data.characterGold);
  purgeKeys(data.characterAntiMagic);
  purgeKeys(data.equipmentBuild);
  purgeKeys(data.achievementProgress);
  purgeKeys(data.weeklyAchievementProgress);
  purgeKeys(data.eliteProgress);
  purgeKeys(data.raidProgress);
  purgeKeys(data.equipment?.worn);
  purgeKeys(data.equipment?.unworn);
  Object.values(data.dailyLog || {}).forEach(log => purgeKeys(log?.chars));
  purgeKeys(data.dailyPlanner?.phases);
  ['我不是nai/1000/8624', '我不是nai'].forEach(name => removeCharacterDataFrom(data, name));
}

function removeCharacterDataFrom(data, charName) {
  const removeKey = container => { if (container && Object.prototype.hasOwnProperty.call(container, charName)) delete container[charName]; };
  removeKey(data.characterGold); removeKey(data.characterAntiMagic); removeKey(data.equipmentBuild); removeKey(data.raidProgress);
  removeKey(data.achievementProgress); removeKey(data.eliteProgress); removeKey(data.equipment?.worn); removeKey(data.equipment?.unworn);
  Object.values(data.weeklyAchievementProgress || {}).forEach(removeKey);
  Object.values(data.dailyLog || {}).forEach(log => removeKey(log?.chars));
  removeKey(data.dailyPlanner?.phases); removeKey(data.raidPlanner?.leaderRuns);
}

// 清理已退出固定团本名单的旧回收角色，避免旧本地/云端缓存再次显示。
function purgeRetiredFixedRaidCharacters(data) {
  const retired = new Set(['AAA回收空调', 'AAA回收冰箱']);
  if (!data || typeof data !== 'object') return;
  retired.forEach(name => removeCharacterDataFrom(data, name));
  const config = data.config;
  if (!config || typeof config !== 'object') return;
  if (Array.isArray(config.accounts)) {
    config.accounts.forEach(account => {
      if (Array.isArray(account?.chars)) account.chars = account.chars.filter(name => !retired.has(name));
      if (account?.charUids && typeof account.charUids === 'object') retired.forEach(name => delete account.charUids[name]);
    });
    config.accounts = config.accounts.filter(account => (account?.chars || []).length || account?.name !== '17833952955');
  }
  if (Array.isArray(config.fixedRaidStandalone)) config.fixedRaidStandalone = config.fixedRaidStandalone.filter(name => !retired.has(name));
  ['characterRoleTiers', 'characterRegions'].forEach(key => {
    if (config[key] && typeof config[key] === 'object') retired.forEach(name => delete config[key][name]);
  });
  normalizeConfiguredRoster(config, window.CONFIG || {});
}

function migrateCharacterDataFrom(data, oldName, nextName) {
  if (!data || !oldName || !nextName || oldName === nextName) return;
  const moveKey = container => {
    if (!container || !Object.prototype.hasOwnProperty.call(container, oldName)) return;
    if (!Object.prototype.hasOwnProperty.call(container, nextName)) container[nextName] = container[oldName];
    delete container[oldName];
  };
  moveKey(data.characterGold);
  moveKey(data.characterAntiMagic);
  moveKey(data.equipment?.worn);
  moveKey(data.equipment?.unworn);
  moveKey(data.equipmentBuild);
  moveKey(data.raidProgress);
  moveKey(data.achievementProgress);
  moveKey(data.eliteProgress);
  moveKey(data.raidPlanner?.leaderRuns);
  moveKey(data.dailyPlanner?.phases);
  Object.values(data.weeklyAchievementProgress || {}).forEach(moveKey);
  Object.values(data.dailyLog || {}).forEach(log => moveKey(log?.chars));
  Object.values(data.raidPlanner?.leaderDailyRuns || {}).forEach(raidMap => {
    Object.values(raidMap || {}).forEach(moveKey);
  });
  if (Array.isArray(data.raidPlanner?.bigCharacters)) {
    data.raidPlanner.bigCharacters = [...new Set(data.raidPlanner.bigCharacters.map(name => name === oldName ? nextName : name))];
  }
  if (data.raidPlanner?.fixedLeader === oldName) data.raidPlanner.fixedLeader = nextName;
  if (Array.isArray(data.raidPlanner?.savedSquads)) {
    data.raidPlanner.savedSquads.forEach(squad => {
      if (Array.isArray(squad.members)) squad.members = squad.members.map(name => name === oldName ? nextName : name);
    });
  }
}

function resolvePreferredRaidLeaders(data = DATA) {
  const allChars = (data.config?.accounts || []).flatMap(account => (account.chars || []).map(char => ({ account: account.name, char })));
  const preferred = data.config?.preferredRaidLeaders || ['麻薯饼干', 'AAA建材'];
  return preferred.map(keyword => {
    const normalized = String(keyword).toLocaleLowerCase('zh-CN');
    return allChars.find(item => item.char.toLocaleLowerCase('zh-CN') === normalized)
      || allChars.find(item => item.char.toLocaleLowerCase('zh-CN').includes(normalized))
      || allChars.find(item => item.account.toLocaleLowerCase('zh-CN').includes(normalized));
  }).filter(Boolean).filter((item, index, items) => items.findIndex(other => other.char === item.char) === index);
}

function resolveRaidLeaderKeyword(keyword, data = DATA) {
  const allChars = (data.config?.accounts || []).flatMap(account => (account.chars || []).map(char => ({ account: account.name, char })));
  const normalized = String(keyword || '').toLocaleLowerCase('zh-CN');
  return allChars.find(item => item.char.toLocaleLowerCase('zh-CN') === normalized)
    || allChars.find(item => item.char.toLocaleLowerCase('zh-CN').includes(normalized))
    || null;
}

function resolveSingleCarryRaidLeaders(data = DATA) {
  const constraints = ensureSchedulingConstraints(data.config);
  const keywords = [constraints.raidDefaultSingleLeader, ...(constraints.raidSingleCarryAssistLeaders || [])];
  return keywords.map(keyword => resolveRaidLeaderKeyword(keyword, data)).filter(Boolean)
    .filter((item, index, items) => items.findIndex(other => other.char === item.char) === index);
}

function ensureConfiguredRaidLeaders(data) {
  if (!data?.raidPlanner) return;
  if (!Array.isArray(data.raidPlanner.bigCharacters)) data.raidPlanner.bigCharacters = [];
  const leaders = [...resolveSingleCarryRaidLeaders(data), ...resolvePreferredRaidLeaders(data)].map(item => item.char);
  data.raidPlanner.bigCharacters = [...new Set([...data.raidPlanner.bigCharacters, ...leaders])];
}

function addIsoDays(dateStr, days) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function ensureDailyPlanner(data, baseDateStr = getTodayStr()) {
  if (!data.dailyPlanner || typeof data.dailyPlanner !== 'object' || Array.isArray(data.dailyPlanner)) data.dailyPlanner = {};
  const planner = data.dailyPlanner;
  const constraints = ensureSchedulingConstraints(data.config);
  const scheduleVersion = 4;
  const scheduleStartDate = constraints.dailyScheduleStartDate;
  const cycleDays = constraints.staminaCycleDays;
  const runsPerCycle = constraints.staminaRunsPerCycle;
  const resetSchedule = planner.scheduleVersion !== scheduleVersion || planner.scheduleStartDate !== scheduleStartDate || planner.cycleDays !== cycleDays || planner.runsPerCycle !== runsPerCycle;
  if (resetSchedule) {
    planner.phases = {};
    planner.scheduleVersion = scheduleVersion;
    planner.scheduleStartDate = scheduleStartDate;
    planner.cycleDays = cycleDays;
    planner.runsPerCycle = runsPerCycle;
  }
  if (!planner.phases || typeof planner.phases !== 'object' || Array.isArray(planner.phases)) planner.phases = {};
  const characters = (data.config?.accounts || []).flatMap((account, accountIndex) => (account.chars || []).map((char, charIndex) => ({ char, accountIndex, charIndex })));
  const validNames = new Set(characters.map(item => item.char));
  Object.keys(planner.phases).forEach(name => { if (!validNames.has(name)) delete planner.phases[name]; });
  const phaseCounts = Array.from({ length: cycleDays }, () => 0);
  Object.values(planner.phases).forEach(phase => { if (Number.isInteger(phase) && phase >= 0 && phase < phaseCounts.length) phaseCounts[phase]++; });
  characters.forEach(item => {
    if (!Number.isInteger(planner.phases[item.char]) || planner.phases[item.char] < 0 || planner.phases[item.char] >= cycleDays) {
      const preferredPhase = (item.accountIndex + item.charIndex) % cycleDays;
      const lightestPhase = phaseCounts.map((count, phase) => ({ count, phase })).sort((left, right) => left.count - right.count || Number(right.phase === preferredPhase) - Number(left.phase === preferredPhase) || left.phase - right.phase)[0].phase;
      planner.phases[item.char] = lightestPhase;
      phaseCounts[planner.phases[item.char]]++;
    }
  });
  delete planner.nextDue;
  delete planner.allCharactersDueDate;
  return planner;
}

function ensureDailyRuleMigration(data) {
  const constraints = ensureSchedulingConstraints(data.config);
  if (Number(data.dailyRuleMigrationVersion) >= constraints.dailyRuleVersion) return false;
  if (!data.dailyLog || typeof data.dailyLog !== 'object' || Array.isArray(data.dailyLog)) data.dailyLog = {};
  const dateStr = constraints.dailyBaselineDate;
  if (!data.dailyLog[dateStr]) data.dailyLog[dateStr] = { global: {}, accounts: {}, chars: {} };
  const log = data.dailyLog[dateStr];
  if (!log.chars || typeof log.chars !== 'object' || Array.isArray(log.chars)) log.chars = {};
  (data.config?.accounts || []).forEach(account => (account.chars || []).forEach(charName => {
    if (!log.chars[charName]) log.chars[charName] = {};
    log.chars[charName]['体力'] = true;
    log.chars[charName]['虚空'] = true;
  }));
  data.dailyRuleMigrationVersion = constraints.dailyRuleVersion;
  return true;
}

function syncDynamicRosterPlan() {
  const changed = normalizeConfiguredRoster(DATA.config, window.CONFIG || {});
  ensureConfiguredRaidLeaders(DATA);
  ensureDailyPlanner(DATA);
  saveData(DATA);
  // 核心版只刷新当前页面，避免重新编队时重算全部历史页面。
  renderActiveGamePage();
  toast(changed ? '已按当前账号和角色重新自动安排' : '当前自动安排已经是最新状态');
}

function syncFixedRosterPlan() { syncDynamicRosterPlan(); }

function keepOnlyLatestFormationResult(data) {
  if (!data || typeof data !== 'object') return data;
  data.dailyStarManualSquads = null;
  delete data.raidAutomaticFormationSnapshots;
  if (data.config && typeof data.config === 'object') {
    delete data.config.raidSquadPlan;
    delete data.config.dailyGroupPlan;
    if (data.config.schedulingConstraints && typeof data.config.schedulingConstraints === 'object') {
      delete data.config.schedulingConstraints.raidOptimizedSquadPlan;
      delete data.config.schedulingConstraints.raidMultiOptimizedSquadPlan;
    }
  }
  if (data.raidPlanner && typeof data.raidPlanner === 'object') {
    data.raidPlanner.savedSquads = [];
    data.raidPlanner.manualPriorityCharacters = [];
  }
  return data;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const cfg = window.CONFIG || {};
      const storedRosterPlanVersion = Number(data.config?.rosterPlanVersion) || 0;
      // 本地已有数据永远优先，版本号不能成为覆盖用户数据的理由。
      if (!data.config || typeof data.config !== 'object') data.config = JSON.parse(JSON.stringify(cfg));
      if (!Array.isArray(data.config.globalTasks) && Array.isArray(cfg.globalTasks)) data.config.globalTasks = JSON.parse(JSON.stringify(cfg.globalTasks));
      if (!Array.isArray(data.config.characterTasks) && Array.isArray(cfg.characterTasks)) data.config.characterTasks = JSON.parse(JSON.stringify(cfg.characterTasks));
      if ((!Array.isArray(data.config.raidDungeons) || data.config.raidDungeons.length < 4) && Array.isArray(cfg.raidDungeons)) data.config.raidDungeons = JSON.parse(JSON.stringify(cfg.raidDungeons));
      if (!Array.isArray(data.config.achievementTasks) && Array.isArray(cfg.achievementTasks)) data.config.achievementTasks = JSON.parse(JSON.stringify(cfg.achievementTasks));
      if (Array.isArray(cfg.achievementTasks)) {
        const existingAchievementIds = new Set((data.config.achievementTasks || []).map(task => task.id));
        cfg.achievementTasks.forEach(task => { if (!existingAchievementIds.has(task.id)) data.config.achievementTasks.push(JSON.parse(JSON.stringify(task))); });
      }
      if (!Array.isArray(data.config.weeklyAchievementTasks) && Array.isArray(cfg.weeklyAchievementTasks)) data.config.weeklyAchievementTasks = JSON.parse(JSON.stringify(cfg.weeklyAchievementTasks));
      if (Array.isArray(cfg.weeklyAchievementTasks)) {
        const existingWeeklyAchievementIds = new Set((data.config.weeklyAchievementTasks || []).map(task => task.id));
        cfg.weeklyAchievementTasks.forEach(task => { if (!existingWeeklyAchievementIds.has(task.id)) data.config.weeklyAchievementTasks.push(JSON.parse(JSON.stringify(task))); });
      }
      if (!Array.isArray(data.config.accessorySets) && Array.isArray(cfg.accessorySets)) data.config.accessorySets = JSON.parse(JSON.stringify(cfg.accessorySets));
      if (!Array.isArray(data.config.armorSets) && Array.isArray(cfg.armorSets)) data.config.armorSets = JSON.parse(JSON.stringify(cfg.armorSets));
      ensureSchedulingConstraints(data.config);
      const rosterMigrated = normalizeConfiguredRoster(data.config, cfg, data.raidPlanner?.bigCharacters || []);
      (data.config.renamedRosterCharacters || []).forEach(({ oldName, nextName }) => migrateCharacterDataFrom(data, oldName, nextName));
      (data.config.renamedRosterAccounts || []).forEach(({ oldName, nextName }) => {
        Object.values(data.dailyLog || {}).forEach(log => {
          if (!log?.accounts || !Object.prototype.hasOwnProperty.call(log.accounts, oldName)) return;
          if (!Object.prototype.hasOwnProperty.call(log.accounts, nextName)) log.accounts[nextName] = log.accounts[oldName];
          delete log.accounts[oldName];
        });
      });
      delete data.config.renamedRosterCharacters;
      delete data.config.renamedRosterAccounts;
      // 只保留最新自动编队：旧自由编队、手动团本队伍、旧固定方案和多份自动快照全部废弃。
      keepOnlyLatestFormationResult(data);
      (data.config.retiredRosterCharacters || []).forEach(name => removeCharacterDataFrom(data, name));
      delete data.config.retiredRosterCharacters;
      purgeRetiredFixedRaidCharacters(data);
      purgePlaceholderCharacterData(data);
      ensureAccountMergeGroups(data.config);
      normalizeCharacterUids(data.config.accounts);
      normalizeCharacterTaskSchedules(data.config.characterTasks, data.config.schedulingConstraints);
      if (!data.equipment || Array.isArray(data.equipment)) data.equipment = {};
      // 保留旧版 equipment[角色名] 数据，按“已穿戴”读取；旧公共库存也不丢弃。
      const legacyKeys = Object.keys(data.equipment).filter(key => !['unworn', 'worn', 'shared'].includes(key));
      if (!data.equipment.worn) data.equipment.worn = {};
      legacyKeys.forEach(key => { if (!data.equipment.worn[key]) data.equipment.worn[key] = data.equipment[key]; });
      if (!data.equipment.unworn) data.equipment.unworn = {};
      if (data.equipment.shared && !data.equipment.unworn['未指定仓库']) data.equipment.unworn['未指定仓库'] = data.equipment.shared;
      if (!data.equipment.worn) data.equipment.worn = {};
      if (!data.equipmentBuild || typeof data.equipmentBuild !== 'object' || Array.isArray(data.equipmentBuild)) data.equipmentBuild = {};
      if (!data.achievementProgress || typeof data.achievementProgress !== 'object' || Array.isArray(data.achievementProgress)) data.achievementProgress = {};
      if (!data.weeklyAchievementProgress || typeof data.weeklyAchievementProgress !== 'object' || Array.isArray(data.weeklyAchievementProgress)) data.weeklyAchievementProgress = {};
      if (!data.eliteProgress || typeof data.eliteProgress !== 'object' || Array.isArray(data.eliteProgress)) data.eliteProgress = {};
      if (!Number.isFinite(Number(data.knowledgeBaseVersion)) || Number(data.knowledgeBaseVersion) < GAME_KNOWLEDGE_BASE_VERSION) {
        if (typeof data.knowledgeBase === 'string' && data.knowledgeBase.trim()) data.legacyKnowledgeBaseBackup = data.knowledgeBase;
        data.knowledgeBase = DEFAULT_GAME_KNOWLEDGE_BASE;
        data.knowledgeBaseVersion = GAME_KNOWLEDGE_BASE_VERSION;
      } else if (typeof data.knowledgeBase !== 'string' || !data.knowledgeBase.trim()) {
        data.knowledgeBase = DEFAULT_GAME_KNOWLEDGE_BASE;
      }
      if (!data.optimizationProfile || typeof data.optimizationProfile !== 'object' || Array.isArray(data.optimizationProfile)) data.optimizationProfile = JSON.parse(JSON.stringify(DEFAULT_GAME_OPTIMIZATION_PROFILE));
      if (!data.equipmentBuildEmblemStock || typeof data.equipmentBuildEmblemStock !== 'object' || Array.isArray(data.equipmentBuildEmblemStock)) data.equipmentBuildEmblemStock = {};
      if (!data.raidProgress || typeof data.raidProgress !== 'object' || Array.isArray(data.raidProgress)) data.raidProgress = {};
      if (!data.raidPlanner || typeof data.raidPlanner !== 'object' || Array.isArray(data.raidPlanner)) data.raidPlanner = { bigCharacters: [], leaderRuns: {}, savedSquads: [] };
      keepOnlyLatestFormationResult(data);
      if (!data.dailyLog) data.dailyLog = {};
      ensureConfiguredRaidLeaders(data);
      ensureDailyPlanner(data);
      const dailyRuleMigrated = ensureDailyRuleMigration(data);
      if (!data.characterGold || typeof data.characterGold !== 'object' || Array.isArray(data.characterGold)) {
        data.characterGold = {};
        // 迁移旧版按日期保存的金币：取每个角色最后一次填写的数值作为常驻余额。
        Object.keys(data.dailyLog).sort().reverse().forEach(dateStr => {
          const chars = data.dailyLog[dateStr]?.chars || {};
          Object.entries(chars).forEach(([charName, charLog]) => {
            if (data.characterGold[charName] !== undefined) return;
            const gold = Number(charLog?.金币);
            if (Number.isFinite(gold) && gold >= 0) data.characterGold[charName] = gold;
          });
        });
      }
      if (!data.characterAntiMagic || typeof data.characterAntiMagic !== 'object' || Array.isArray(data.characterAntiMagic)) data.characterAntiMagic = {};
      if (!data.raidTabletGoldTransfers || typeof data.raidTabletGoldTransfers !== 'object' || Array.isArray(data.raidTabletGoldTransfers)) data.raidTabletGoldTransfers = {};
      saveData(data);
      return data;
    }
  } catch(e) { console.warn('数据加载失败，使用默认', e); }
  const defaults = getDefaultData();
  ensureSchedulingConstraints(defaults.config);
  normalizeConfiguredRoster(defaults.config, window.CONFIG || {});
  normalizeCharacterUids(defaults.config.accounts);
  normalizeCharacterTaskSchedules(defaults.config.characterTasks, defaults.config.schedulingConstraints);
  ensureConfiguredRaidLeaders(defaults);
  ensureDailyPlanner(defaults);
  ensureDailyRuleMigration(defaults);
  ensureAccountMergeGroups(defaults.config);
  return defaults;
}

let lastGameBackupAt = 0;
let applyingRemoteGameData = false;
function saveData(data) {
  try {
    keepOnlyLatestFormationResult(data);
    const previous = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    // 保护备份最多每30秒写一次；高频输入只写主数据，避免 localStorage 双倍同步阻塞。
    if (previous && now - lastGameBackupAt >= 30000) {
      try {
        const backup = keepOnlyLatestFormationResult(JSON.parse(previous));
        delete backup.raidAutomaticFormationSnapshot;
        localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(backup));
      } catch (_) {
        const backup = JSON.parse(JSON.stringify(data));
        delete backup.raidAutomaticFormationSnapshot;
        localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(backup));
      }
      lastGameBackupAt = now;
    }
    data.configVersion = 7;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (!applyingRemoteGameData) window.SUPABASE_SYNC?.queueSave?.(data);
  } catch(e) { toast('保存失败: ' + e.message); }
}

let queuedGameDataSaveTimer = 0;
function queueGameDataSave(delay = 250) {
  if (typeof setTimeout !== 'function') {
    saveData(DATA);
    return;
  }
  clearTimeout(queuedGameDataSaveTimer);
  queuedGameDataSaveTimer = setTimeout(() => {
    queuedGameDataSaveTimer = 0;
    saveData(DATA);
  }, delay);
}

let DATA = loadData();
let viewingDate = getTodayStr();
let equipCharFilter = null;
let pendingEquipmentPlan = [];
let lastGoldTransferPlans = DATA.goldTransferExecution && typeof DATA.goldTransferExecution === 'object' ? DATA.goldTransferExecution : null;
let selectedGoldTransferTargetChars = new Set();
let equipmentBuildSelectedChars = null;
let equipmentBuildRenderedOrder = null;
let equipmentBuildRenderTimer = 0;
let raidPlannerMode = 'quad';
let raidPlannerRaidId = 'ruins';
let raidPlannerMembers = [];
let achievementFilterMode = 'all';
const EQUIPMENT_BUILD_FILTER_KEY = 'jh_equipment_build_selected_chars';

function scheduleEquipmentBuildRender() {
  if (equipmentBuildRenderTimer) cancelAnimationFrame(equipmentBuildRenderTimer);
  equipmentBuildRenderTimer = requestAnimationFrame(() => {
    equipmentBuildRenderTimer = 0;
    renderEquipmentBuild();
  });
}

// 金币交易规则：上架押金会在成交后返还，因此不计入损耗；税按成交额向上取整，
// 避免把一笔交易拆成很多小单来规避税额。
const GOLD_TRANSFER_DEPOSIT = 10000;
const GOLD_TRANSFER_TAX_PERCENT = 3;
const GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER = 10;
const GOLD_TRANSFER_SHARED_ACCOUNTS = [
  { key: 'shared:AAA战1-16', label: 'AAA战1-16', accounts: new Set(['180冰谷', '180静谧', '180真知', '180进化']), characterPattern: /^AAA战(?:[1-9]|1[0-6])$/u },
  { key: 'shared:AAA枪1-16', label: 'AAA枪1-16', accounts: new Set(['159冰谷', '159静谧', '159真知', '159进化']), characterPattern: /^AAA枪(?:[1-9]|1[0-6])$/u },
];

// ==========================================
//  日期工具
// ==========================================
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getWeekStart(baseDateStr) {
  const cfg = DATA.config || {};
  const startDay = cfg.weekStartDay || 1;
  const now = baseDateStr ? new Date(`${baseDateStr}T00:00:00`) : new Date();
  const dow = now.getDay();
  const diff = (dow < startDay ? 7 : 0) + dow - startDay;
  const mon = new Date(now);
  mon.setDate(now.getDate() - diff);
  mon.setHours(0,0,0,0);
  return mon;
}

function getWeekDates(baseDateStr) {
  const mon = getWeekStart(baseDateStr);
  const days = [];
  const names = ['周日','周一','周二','周三','周四','周五','周六'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    days.push({
      dateStr: `${d.getMonth()+1}/${d.getDate()}`,
      iso: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
      name: names[d.getDay()],
    });
  }
  return days;
}

function getDayLog(dateStr) {
  if (!DATA.dailyLog[dateStr]) {
    DATA.dailyLog[dateStr] = { global: {}, accounts: {}, chars: {} };
  }
  return DATA.dailyLog[dateStr];
}

// ==========================================
//  辅助函数
// ==========================================
function getAllChars() {
  const cfg = DATA.config || {};
  const chars = [];
  (cfg.accounts || []).forEach(acc => {
    (acc.chars || []).forEach(ch => chars.push({ account: acc.name, char: ch }));
  });
  return chars;
}

function getRosterSlot(accountIndex, charIndex) {
  const account = DATA.config?.accounts?.[accountIndex];
  const char = account?.chars?.[charIndex];
  if (!account || !char) return null;
  return {
    account: account.name,
    char,
    accountIndex,
    charIndex,
    accountCode: DATA.config?.accountCodePlan?.[accountIndex] || `账号${accountIndex + 1}`,
    charCode: DATA.config?.characterCodePlan?.[accountIndex]?.[charIndex] || `${accountIndex + 1}-${charIndex + 1}`,
    device: DATA.config?.accountDevicePlan?.[accountIndex] || DAILY_GROUP_DEVICES[accountIndex % DAILY_GROUP_DEVICES.length],
  };
}

let rosterMetaCacheAccounts = null;
let rosterMetaCacheCharacterCount = -1;
let rosterMetaCache = new Map();
function getRosterMeta(charName) {
  const accounts = DATA.config?.accounts || [];
  const characterCount = accounts.reduce((sum, account) => sum + (account.chars || []).length, 0);
  if (accounts !== rosterMetaCacheAccounts || characterCount !== rosterMetaCacheCharacterCount) {
    rosterMetaCacheAccounts = accounts;
    rosterMetaCacheCharacterCount = characterCount;
    rosterMetaCache = new Map();
    accounts.forEach((account, accountIndex) => (account.chars || []).forEach((name, charIndex) => {
      rosterMetaCache.set(name, getRosterSlot(accountIndex, charIndex));
    }));
  }
  return rosterMetaCache.get(charName) || null;
}

function getRaidCharacterPriority(charName) {
  const meta = getRosterMeta(charName);
  const account = DATA.config?.accounts?.[meta?.accountIndex];
  const manualPriorityCharacters = getRaidPlanner().manualPriorityCharacters || [];
  const manualIndex = manualPriorityCharacters.indexOf(charName);
  const manualBonus = manualIndex >= 0 ? 10000 - manualIndex : 0;
  if (account && (account.chars || []).length === 1) return 100000 + manualBonus;
  if (manualIndex >= 0) return 90000 - manualIndex;
  return 0;
}

let deviceStoragePlanCacheAccounts = null;
let deviceStoragePlanCacheConstraints = null;
let deviceStoragePlanCacheCharacterCount = -1;
let deviceStoragePlanCacheValue = null;
function getDeviceAccountStoragePlan() {
  const accountsSource = DATA.config?.accounts || [];
  const constraintsSource = DATA.config?.schedulingConstraints || {};
  const characterCount = accountsSource.reduce((sum, account) => sum + (account.chars || []).length, 0);
  if (accountsSource === deviceStoragePlanCacheAccounts && constraintsSource === deviceStoragePlanCacheConstraints
      && characterCount === deviceStoragePlanCacheCharacterCount && deviceStoragePlanCacheValue) return deviceStoragePlanCacheValue;
  const accounts = (DATA.config?.accounts || []).map(account => account.name);
  const constraints = getSchedulingConstraints();
  const limit = constraints.deviceAccountLimit;
  const requiredAccountDevices = constraints.requiredAccountDevices || {};
  const byDevice = Object.fromEntries(DAILY_GROUP_DEVICES.map(device => [device, []]));
  const byAccount = Object.fromEntries(accounts.map(account => [account, []]));
  const add = (account, device) => {
    if (requiredAccountDevices[account] && requiredAccountDevices[account] !== device) return false;
    if (!account || !device || byAccount[account].includes(device) || byDevice[device].length >= limit) return false;
    byAccount[account].push(device);
    byDevice[device].push(account);
    return true;
  };
  accounts.forEach(account => {
    if (requiredAccountDevices[account]) add(account, requiredAccountDevices[account]);
  });
  const raidLeaderAccounts = new Set(resolveSingleCarryRaidLeaders().map(item => item.account));
  raidLeaderAccounts.forEach(account => {
    if ((byAccount[account] || []).some(device => constraints.raidLeaderDevices.includes(device))) return;
    const device = constraints.raidLeaderDevices
      .filter(candidate => DAILY_GROUP_DEVICES.includes(candidate) && byDevice[candidate].length < limit)
      .sort((left, right) => byDevice[left].length - byDevice[right].length || DAILY_GROUP_DEVICES.indexOf(left) - DAILY_GROUP_DEVICES.indexOf(right))[0];
    if (device) add(account, device);
  });
  // 先落实账号管理中配置的主设备，避免扩容后普通账号被均衡算法错误地只放到电脑。
  accounts.forEach((account, accountIndex) => {
    const homeDevice = DATA.config?.accountDevicePlan?.[accountIndex];
    if (DAILY_GROUP_DEVICES.includes(homeDevice)) add(account, homeDevice);
  });
  const tabletRotationAccounts = new Set((constraints.raidTabletRotationCharacters || [])
    .map(charName => getRosterMeta(charName)?.account)
    .filter(Boolean));
  (constraints.raidMiddleCharacters || []).forEach(charName => {
    const account = getRosterMeta(charName)?.account;
    if (account) tabletRotationAccounts.add(account);
  });
  tabletRotationAccounts.forEach(account => {
    if ((byAccount[account] || []).includes('平板')) return;
    if (byDevice['平板'].length >= limit) return;
    add(account, '平板');
  });
  if (accounts.length <= 8 && limit >= 6) {
    const excludedDevices = ['手机2', '手机2', '手机1', '手机1', '平板', '电脑', '电脑', '平板'];
    accounts.forEach((account, accountIndex) => {
      DAILY_GROUP_DEVICES.forEach(device => { if (device !== excludedDevices[accountIndex]) add(account, device); });
    });
  } else {
    accounts.forEach((account, accountIndex) => {
      const preferred = accountIndex < limit ? ['电脑', '平板', '手机1', '手机2'] : ['平板', '手机1', '手机2', '电脑'];
      preferred.sort((left, right) => byDevice[left].length - byDevice[right].length || DAILY_GROUP_DEVICES.indexOf(left) - DAILY_GROUP_DEVICES.indexOf(right));
      preferred.some(device => add(account, device));
    });
    const desiredCopies = Math.max(1, Math.min(3, Math.floor((DAILY_GROUP_DEVICES.length * limit) / Math.max(1, accounts.length))));
    for (let copy = 1; copy < desiredCopies; copy++) {
      accounts.forEach((account, accountIndex) => {
        const candidates = DAILY_GROUP_DEVICES
          .filter(device => !byAccount[account].includes(device) && byDevice[device].length < limit)
          .sort((left, right) => byDevice[left].length - byDevice[right].length || ((DAILY_GROUP_DEVICES.indexOf(left) - accountIndex + DAILY_GROUP_DEVICES.length) % DAILY_GROUP_DEVICES.length) - ((DAILY_GROUP_DEVICES.indexOf(right) - accountIndex + DAILY_GROUP_DEVICES.length) % DAILY_GROUP_DEVICES.length));
        if (candidates[0]) add(account, candidates[0]);
      });
    }
    const characterCounts = new Map((DATA.config?.accounts || []).map(account => [account.name, (account.chars || []).length]));
    for (let pass = 0; pass < DAILY_GROUP_DEVICES.length * limit; pass++) {
      const candidates = accounts.flatMap((account, accountIndex) => {
        if (requiredAccountDevices[account]) return [];
        return DAILY_GROUP_DEVICES
          .filter(device => !byAccount[account].includes(device) && byDevice[device].length < limit)
          .map(device => ({
            account,
            device,
            accountIndex,
            characterCount: characterCounts.get(account) || 0,
            copies: byAccount[account].length,
            deviceLoad: byDevice[device].length,
          }));
      }).sort((left, right) =>
        right.characterCount - left.characterCount
        || left.copies - right.copies
        || left.deviceLoad - right.deviceLoad
        || left.accountIndex - right.accountIndex
        || DAILY_GROUP_DEVICES.indexOf(left.device) - DAILY_GROUP_DEVICES.indexOf(right.device)
      );
      if (!candidates[0] || !add(candidates[0].account, candidates[0].device)) break;
    }
  }
  deviceStoragePlanCacheAccounts = accountsSource;
  deviceStoragePlanCacheConstraints = constraintsSource;
  deviceStoragePlanCacheCharacterCount = characterCount;
  deviceStoragePlanCacheValue = { limit, byDevice, byAccount, overflow: accounts.filter(account => !byAccount[account].length) };
  return deviceStoragePlanCacheValue;
}

function assignMembersToStoredDevices(members, previousAssignments = [], options = {}) {
  const storage = getDeviceAccountStoragePlan();
  const normalized = members.map(member => typeof member === 'string' ? getRosterMeta(member) : member).filter(Boolean);
  const requiredDevices = options.requiredDevices || {};
  const allowedDevices = options.allowedDevices || {};
  if (!normalized.length || normalized.length > DAILY_GROUP_DEVICES.length) return [];

  // 位掩码动态规划：成员数和设备数都最多4，固定 O(成员数 × 2^4 × 4)。
  // 不再递归生成所有排列；每个状态只保留分数最高的一条设备路径。
  let states = new Map([[0, { score: 0, assignments: [] }]]);
  normalized.forEach(member => {
    const nextStates = new Map();
    const devices = (storage.byAccount[member.account] || []).filter(device =>
      (!requiredDevices[member.char] || requiredDevices[member.char] === device)
      && (!allowedDevices[member.char] || allowedDevices[member.char].includes(device))
    );
    states.forEach((state, mask) => devices.forEach(device => {
      const deviceIndex = DAILY_GROUP_DEVICES.indexOf(device);
      if (deviceIndex < 0 || mask & (1 << deviceIndex)) return;
      const previous = previousAssignments.find(item => item.device === device);
      const continuity = previous?.account === member.account ? 100 : 0;
      const homePreference = getRosterMeta(member.char)?.device === device ? 5 : 0;
      const nextMask = mask | (1 << deviceIndex);
      const candidate = { score: state.score + continuity + homePreference, assignments: [...state.assignments, { ...member, device }] };
      const current = nextStates.get(nextMask);
      const candidateKey = candidate.assignments.map(item => `${item.device}:${item.char}`).join('|');
      const currentKey = current?.assignments.map(item => `${item.device}:${item.char}`).join('|') || '';
      if (!current || candidate.score > current.score || (candidate.score === current.score && candidateKey.localeCompare(currentKey, 'zh-CN') < 0)) nextStates.set(nextMask, candidate);
    }));
    states = nextStates;
  });
  const best = [...states.values()].sort((left, right) => right.score - left.score
    || left.assignments.map(item => `${item.device}:${item.char}`).join('|').localeCompare(right.assignments.map(item => `${item.device}:${item.char}`).join('|'), 'zh-CN'))[0];
  return (best?.assignments || []).sort((left, right) => DAILY_GROUP_DEVICES.indexOf(left.device) - DAILY_GROUP_DEVICES.indexOf(right.device));
}

function getCharEquip(charName) {
  if (!DATA.equipment.worn) DATA.equipment.worn = {};
  if (!DATA.equipment.worn[charName]) {
    DATA.equipment.worn[charName] = { acc: {}, armor: {} };
  }
  return DATA.equipment.worn[charName];
}

function getUnwornEquip(charName) {
  if (!DATA.equipment.unworn) DATA.equipment.unworn = {};
  if (!DATA.equipment.unworn[charName]) DATA.equipment.unworn[charName] = { acc: {}, armor: {} };
  return DATA.equipment.unworn[charName];
}

function getTaskVal(dateStr, charName, taskId) {
  const log = DATA.dailyLog[dateStr];
  if (!log || !log.chars[charName]) return false;
  const v = log.chars[charName][taskId];
  return v !== undefined ? v : false;
}

// 团本从普通角色任务中独立出来，避免旧版本任务与四团本循环重复计数。
function getCharacterTasks() {
  const retiredTaskIds = new Set(['团本', '虚空世界', '疲劳', '深渊', '讨伐', '临界讨伐']);
  return (DATA.config?.characterTasks || []).filter(task => !retiredTaskIds.has(task.id));
}

function normalizeCharacterTaskSchedules(tasks, providedConstraints = null) {
  if (!Array.isArray(tasks)) return;
  // 深渊和临界都属于体力消耗，旧配置退出活动列表；dailyLog 中的历史记录仍保留。
  const retiredTaskIds = new Set(['疲劳', '深渊', '讨伐', '临界讨伐']);
  for (let index = tasks.length - 1; index >= 0; index--) {
    if (retiredTaskIds.has(tasks[index]?.id)) tasks.splice(index, 1);
  }
  const constraints = providedConstraints || getSchedulingConstraints();
  const scheduledTasks = [
    { id: '金羊毛', name: '金羊毛', icon: '🐑', goal: constraints.goldFleeceDays.length, note: '周一、三、五、六、日；每角色单人1次；按设备账号容量安排', scheduleDays: constraints.goldFleeceDays, grouped: false, solo: constraints.goldFleeceSolo, oncePerDay: constraints.goldFleeceOncePerDay },
    { id: '体力', name: '清理体力', icon: '⚡', goal: constraints.staminaRunsPerCycle, note: `每天${constraints.staminaPerDay}体力可累计；每个角色${constraints.staminaCycleDays}天清理${constraints.staminaRunsPerCycle}次`, scheduleDays: ALL_WEEK_DAYS },
    { id: '虚空', name: '虚空', icon: '🌀', goal: 7, note: '登录清体力时一并完成', scheduleDays: ALL_WEEK_DAYS },
  ];
  scheduledTasks.forEach(definition => {
    let task = tasks.find(item => item.id === definition.id);
    if (!task) {
      task = { ...definition, type: 'check' };
      tasks.push(task);
    }
    Object.assign(task, definition, { type: 'check', grouped: definition.grouped !== false });
    if (definition.scheduleDays) task.scheduleDays = [...definition.scheduleDays];
    else delete task.scheduleDays;
    delete task.anchorDate;
    delete task.intervalDays;
    delete task.voidGrouped;
  });
}

function getTaskScheduleDays(task) {
  if (Array.isArray(task?.scheduleDays) && task.scheduleDays.length) return task.scheduleDays.map(Number);
  if (task?.id === '金羊毛') return getSchedulingConstraints().goldFleeceDays;
  return ALL_WEEK_DAYS;
}

function getIsoDayNumber(dateStr) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr || ''));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = Date.UTC(year, month - 1, day);
  const parsed = new Date(utc);
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
  return Math.floor(utc / 86400000);
}

function isTaskDueOnDate(task, dateStr) {
  const intervalDays = Number(task?.intervalDays);
  if (task?.anchorDate && Number.isInteger(intervalDays) && intervalDays > 0) {
    const targetDay = getIsoDayNumber(dateStr);
    const anchorDay = getIsoDayNumber(task.anchorDate);
    if (targetDay === null || anchorDay === null) return false;
    const elapsedDays = targetDay - anchorDay;
    return elapsedDays >= 0 && elapsedDays % intervalDays === 0;
  }
  const day = new Date(`${dateStr}T00:00:00`).getDay();
  return getTaskScheduleDays(task).includes(day);
}

function getTaskWeekGoal(task, baseDateStr) {
  return getWeekDates(baseDateStr).filter(day => isTaskDueOnDate(task, day.iso)).length;
}

function getTaskScheduleLabel(task) {
  const intervalDays = Number(task?.intervalDays);
  if (task?.anchorDate && Number.isInteger(intervalDays) && intervalDays > 0) {
    return `${task.anchorDate} 首次 · 每 ${intervalDays} 天 1 次`;
  }
  return task?.note || `每周目标 ${task?.goal || 0} 次`;
}

function isGroupedCharacterTask(task) {
  return !!task?.grouped || task?.id === '虚空';
}

function isGoldFleeceTask(task) {
  return task?.id === '金羊毛';
}

function getRaidCatalog() {
  const configured = DATA.config?.raidDungeons;
  if (Array.isArray(configured) && configured.length >= 4) {
    return configured.map((raid, index) => ({
      id: raid.id || `raid${index + 1}`,
      name: raid.name || `团本${index + 1}`,
      icon: raid.icon || '⚔️',
      weeklyLimit: getSchedulingConstraints().raidWeeklyRewards,
      carryMode: raid.carryMode === 'double' ? 'double' : raid.carryMode === 'single' ? 'single' : '',
    }));
  }
  return [
    { id: 'ruins', name: '遗迹', icon: '🏛️', weeklyLimit: getSchedulingConstraints().raidWeeklyRewards, carryMode: 'single' },
    { id: 'apocalypse', name: '天启', icon: '🌋', weeklyLimit: getSchedulingConstraints().raidWeeklyRewards, carryMode: 'single' },
    { id: 'king', name: '国王', icon: '👑', weeklyLimit: getSchedulingConstraints().raidWeeklyRewards, carryMode: 'single' },
    { id: 'queen', name: '皇后', icon: '♛', weeklyLimit: getSchedulingConstraints().raidWeeklyRewards, carryMode: 'single' },
  ];
}

function getLatestRaidRotationDate(dateStr = getTodayStr()) {
  const refreshDays = getSchedulingConstraints().raidRefreshWeekdays || [1, 3];
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return getTodayStr();
  for (let offset = 0; offset < 7; offset++) {
    const candidate = new Date(date);
    candidate.setDate(date.getDate() - offset);
    if (!refreshDays.includes(candidate.getDay())) continue;
    return `${candidate.getFullYear()}-${String(candidate.getMonth() + 1).padStart(2, '0')}-${String(candidate.getDate()).padStart(2, '0')}`;
  }
  return dateStr;
}

function syncRaidRotationToDate(planner, dateStr = getTodayStr()) {
  const latestRotationDate = getLatestRaidRotationDate(dateStr);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(planner.lastRotationDate || '')) {
    planner.lastRotationDate = latestRotationDate;
    return 0;
  }
  if (planner.lastRotationDate >= latestRotationDate) {
    if (planner.lastRotationDate > latestRotationDate) planner.lastRotationDate = latestRotationDate;
    return 0;
  }
  const refreshDays = getSchedulingConstraints().raidRefreshWeekdays || [1, 3];
  let rotations = 0;
  for (let checkDate = addIsoDays(planner.lastRotationDate, 1); checkDate <= latestRotationDate; checkDate = addIsoDays(checkDate, 1)) {
    if (refreshDays.includes(new Date(`${checkDate}T00:00:00`).getDay())) rotations++;
  }
  planner.lastRotationDate = latestRotationDate;
  return rotations;
}

function getRaidDungeons() {
  const catalog = getRaidCatalog();
  const planner = getRaidPlanner();
  const elapsedRotations = syncRaidRotationToDate(planner);
  const cycleIndex = ((Math.floor(Number(planner.cycleIndex) || 0) + elapsedRotations) % catalog.length + catalog.length) % catalog.length;
  planner.cycleIndex = cycleIndex;
  return [catalog[cycleIndex], catalog[(cycleIndex + 1) % catalog.length]];
}

function getRaidTaskVal(dateStr, charName, raidId) {
  return !!getRaidProgress(charName).checkins?.[dateStr]?.[raidId];
}

function getIsoDateDayNumber(dateStr) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr || ''));
  if (!match) return NaN;
  return Math.floor(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / 86400000);
}

function getRaidCycleWindow(raidId, dateStr = getTodayStr()) {
  const raids = getRaidDungeons();
  const catalog = getRaidCatalog();
  const configuredDays = getSchedulingConstraints().raidRefreshWeekdays || [1, 3];
  const activeIndex = raids.findIndex(raid => raid.id === raidId);
  const catalogIndex = catalog.findIndex(raid => raid.id === raidId);
  const slotIndex = activeIndex >= 0 ? activeIndex : Math.max(0, catalogIndex) % 2;
  const current = new Date(`${dateStr}T00:00:00`);
  const fallback = new Date(`${getTodayStr()}T00:00:00`);
  const date = Number.isNaN(current.getTime()) ? fallback : current;
  const refreshDates = [];
  for (let offset = 0; offset < 8 && refreshDates.length < 2; offset++) {
    const candidate = new Date(date);
    candidate.setDate(date.getDate() - offset);
    if (!configuredDays.includes(candidate.getDay())) continue;
    refreshDates.push(`${candidate.getFullYear()}-${String(candidate.getMonth() + 1).padStart(2, '0')}-${String(candidate.getDate()).padStart(2, '0')}`);
  }
  const startDate = slotIndex === 0 ? refreshDates[1] : refreshDates[0];
  const cycleDays = getSchedulingConstraints().raidCycleDays || 7;
  const dayIndex = Math.max(0, Math.min(cycleDays - 1, getIsoDateDayNumber(dateStr) - getIsoDateDayNumber(startDate)));
  return {
    slotIndex,
    refreshWeekday: new Date(`${startDate}T00:00:00`).getDay(),
    startDate,
    endDate: addIsoDays(startDate, cycleDays - 1),
    dayIndex,
    daysElapsed: dayIndex + 1,
    daysRemaining: cycleDays - dayIndex,
  };
}

function getRaidCycleCount(charName, raidId, dateStr = getTodayStr(), includeCurrentDate = true) {
  const window = getRaidCycleWindow(raidId, dateStr);
  const lastDate = includeCurrentDate ? dateStr : addIsoDays(dateStr, -1);
  if (lastDate < window.startDate) return 0;
  let count = 0;
  for (let offset = 0; offset < (getSchedulingConstraints().raidCycleDays || 7); offset++) {
    const checkDate = addIsoDays(window.startDate, offset);
    if (checkDate > lastDate || checkDate > window.endDate) break;
    if (getRaidTaskVal(checkDate, charName, raidId)) count++;
  }
  const adjustment = Number(getRaidProgress(charName).cycleAdjustments?.[raidId]?.[window.startDate]) || 0;
  return Math.max(0, count + adjustment);
}

function getLegacyRaidWeekSum(charName, raidId) {
  return getWeekDates().reduce((sum, day) => sum + (DATA.dailyLog?.[day.iso]?.chars?.[charName]?.raids?.[raidId] ? 1 : 0), 0);
}

function getRaidProgress(charName) {
  if (!DATA.raidProgress || typeof DATA.raidProgress !== 'object' || Array.isArray(DATA.raidProgress)) DATA.raidProgress = {};
  if (!DATA.raidProgress[charName] || typeof DATA.raidProgress[charName] !== 'object') {
    const [raid1, raid2] = getRaidDungeons();
    DATA.raidProgress[charName] = {
      counts: {
        [raid1?.id || 'raid1']: getLegacyRaidWeekSum(charName, raid1?.id || 'raid1'),
        [raid2?.id || 'raid2']: getLegacyRaidWeekSum(charName, raid2?.id || 'raid2'),
      },
      checkins: {},
    };
  }
  const progress = DATA.raidProgress[charName];
  if (!progress.counts || typeof progress.counts !== 'object') progress.counts = {};
  if (!progress.checkins || typeof progress.checkins !== 'object') progress.checkins = {};
  if (!progress.cycleAdjustments || typeof progress.cycleAdjustments !== 'object' || Array.isArray(progress.cycleAdjustments)) progress.cycleAdjustments = {};
  return progress;
}

function setRaidCycleCount(encodedCharName, encodedRaidId, value, dateStr = viewingDate) {
  const charName = decodeURIComponent(encodedCharName);
  const raidId = decodeURIComponent(encodedRaidId);
  const raid = getRaidCatalog().find(item => item.id === raidId);
  if (!raid || !getAllChars().some(item => item.char === charName)) return;
  const nextCount = Math.max(0, Math.min(raid.weeklyLimit, Math.floor(Number(value) || 0)));
  const window = getRaidCycleWindow(raidId, dateStr);
  let automaticCount = 0;
  for (let offset = 0; offset < (getSchedulingConstraints().raidCycleDays || 7); offset++) {
    const checkDate = addIsoDays(window.startDate, offset);
    if (checkDate > dateStr || checkDate > window.endDate) break;
    if (getRaidTaskVal(checkDate, charName, raidId)) automaticCount++;
  }
  const progress = getRaidProgress(charName);
  if (!progress.cycleAdjustments[raidId] || typeof progress.cycleAdjustments[raidId] !== 'object') progress.cycleAdjustments[raidId] = {};
  const adjustment = nextCount - automaticCount;
  if (adjustment) progress.cycleAdjustments[raidId][window.startDate] = adjustment;
  else delete progress.cycleAdjustments[raidId][window.startDate];
  progress.counts[raidId] = nextCount;
  dailyStarFormationCacheKey = '';
  saveData(DATA);
  renderDailyStarfield();
  toast(`${charName} · ${raid.name}已修正为 ${nextCount}/${raid.weeklyLimit}，后续继续自动累计`);
}

function getRaidCount(charName, raidId) {
  return Math.max(0, Math.floor(Number(getRaidProgress(charName).counts[raidId]) || 0));
}

function getWeekRaidSum(charName, raidId, baseDateStr = getTodayStr()) {
  return getWeekDates(baseDateStr).reduce((sum, day) => {
    return sum + (getRaidTaskVal(day.iso, charName, raidId) ? 1 : 0);
  }, 0);
}

function getRaidPlanner() {
  if (!DATA.raidPlanner || typeof DATA.raidPlanner !== 'object' || Array.isArray(DATA.raidPlanner)) DATA.raidPlanner = {};
  const planner = DATA.raidPlanner;
  if (!Array.isArray(planner.bigCharacters)) planner.bigCharacters = [];
  if (!planner.leaderRuns || typeof planner.leaderRuns !== 'object' || Array.isArray(planner.leaderRuns)) planner.leaderRuns = {};
  if (!planner.leaderDailyRuns || typeof planner.leaderDailyRuns !== 'object' || Array.isArray(planner.leaderDailyRuns)) planner.leaderDailyRuns = {};
  if (!Array.isArray(planner.savedSquads)) planner.savedSquads = [];
  if (!Array.isArray(planner.manualPriorityCharacters)) planner.manualPriorityCharacters = [];
  const validNames = new Set(getAllChars().map(item => item.char));
  planner.bigCharacters = planner.bigCharacters.filter(name => validNames.has(name));
  planner.manualPriorityCharacters = planner.manualPriorityCharacters.filter((name, index, list) => validNames.has(name) && list.indexOf(name) === index);
  Object.keys(planner.leaderRuns).forEach(name => { if (!validNames.has(name)) delete planner.leaderRuns[name]; });
  planner.savedSquads = planner.savedSquads.filter(squad => Array.isArray(squad.members) && squad.members.every(name => validNames.has(name)));
  if (!['balanced', 'single', 'double', 'multi'].includes(planner.autoMode)) planner.autoMode = getSchedulingConstraints().raidDefaultAutoMode;
  const leaderNames = [...resolvePreferredRaidLeaders().map(item => item.char), ...planner.bigCharacters].filter(name => validNames.has(name));
  if (!validNames.has(planner.fixedLeader) || !leaderNames.includes(planner.fixedLeader)) {
    const preferred = getSchedulingConstraints().raidDefaultSingleLeader.toLocaleLowerCase('zh-CN');
    planner.fixedLeader = leaderNames.find(name => name.toLocaleLowerCase('zh-CN') === preferred)
      || leaderNames.find(name => name.toLocaleLowerCase('zh-CN').includes(preferred))
      || leaderNames[0] || '';
  }
  return planner;
}

function getRaidLeaderCandidates() {
  const allChars = getAllChars();
  const names = [...resolveSingleCarryRaidLeaders().map(item => item.char), ...resolvePreferredRaidLeaders().map(item => item.char), ...getRaidPlanner().bigCharacters];
  return names.map(name => allChars.find(item => item.char === name)).filter(Boolean)
    .filter((item, index, items) => items.findIndex(other => other.char === item.char) === index);
}

function isConfiguredRosterCharacter(charName) {
  return getAllChars().some(item => item.char === charName);
}



function getRaidAccountMap() {
  return new Map(getAllChars().map(item => [item.char, item.account]));
}

function getRaidLeaderRuns(charName) {
  return Math.max(0, Math.floor(Number(getRaidPlanner().leaderRuns[charName]) || 0));
}

function getRaidLeaderDailyRuns(charName, raidId = '', dateStr = getTodayStr()) {
  const daily = getRaidPlanner().leaderDailyRuns?.[dateStr] || {};
  if (raidId) return Math.max(0, Math.floor(Number(daily[raidId]?.[charName]) || 0));
  return Object.values(daily).reduce((sum, raidRuns) => sum + Math.max(0, Math.floor(Number(raidRuns?.[charName]) || 0)), 0);
}

function getRaidLeaderMaterialRuns(charName) {
  return Math.max(0, getRaidLeaderRuns(charName) - getSchedulingConstraints().raidLeaderFreeEntriesPerDungeon);
}

function isBigRaidCharacter(charName) {
  return getRaidPlanner().bigCharacters.includes(charName);
}

function toggleBigRaidCharacter(charName) {
  const planner = getRaidPlanner();
  if (!getAllChars().some(item => item.char === charName)) return;
  planner.bigCharacters = planner.bigCharacters.includes(charName)
    ? planner.bigCharacters.filter(name => name !== charName)
    : [...planner.bigCharacters, charName];
  saveData(DATA);
  renderRaidPlanner();
}

function setRaidPlannerMode(mode) {
  if (!['duo', 'quad'].includes(mode)) return;
  raidPlannerMode = mode;
  raidPlannerMembers = [];
  renderRaidPlanner();
}

function setRaidAutoMode(mode) {
  if (!['balanced', 'single', 'double', 'multi'].includes(mode)) return;
  if (mode === 'multi' && !getRaidDungeons().some(raid => raid.id === 'king')) {
    toast('多号模式仅在当前团本包含国王时可用');
    return;
  }
  getRaidPlanner().autoMode = mode;
  DATA.dailyStarManualSquads = null;
  delete DATA.raidAutomaticFormationSnapshot;
  dailyStarFormationCacheKey = '';
  saveData(DATA);
  if (typeof document !== 'undefined') {
    renderRaidPlanner();
    renderDailyStarfield();
  }
}

function setRaidFixedLeader(encodedCharName) {
  const charName = decodeURIComponent(encodedCharName);
  if (!getRaidLeaderCandidates().some(item => item.char === charName)) return;
  const planner = getRaidPlanner();
  planner.fixedLeader = charName;
  planner.autoMode = 'single';
  saveData(DATA);
  renderRaidPlanner();
}

function setRaidPlannerDungeon(raidId) {
  if (!getRaidDungeons().some(item => item.id === raidId)) return;
  raidPlannerRaidId = raidId;
  raidPlannerMembers = [];
  renderRaidPlanner();
}

function validateRaidSquad(members, mode = raidPlannerMode) {
  const expectedSize = mode === 'quad' ? 4 : 2;
  if (!Array.isArray(members) || members.length !== expectedSize) return `需要选择 ${expectedSize} 个角色`;
  if (new Set(members).size !== members.length) return '同一角色不能重复入队';
  const accountMap = getRaidAccountMap();
  const accounts = members.map(name => accountMap.get(name));
  if (accounts.some(account => !account)) return '编队中存在无效角色';
  if (new Set(accounts).size !== accounts.length) return '同一账号下的角色不能一起进团';
  if (mode === 'quad' && !isBigRaidCharacter(members[0])) return '四人团第一个位置必须是大角色队长';
  return '';
}

function toggleRaidPlannerMember(charName) {
  const maxSize = raidPlannerMode === 'quad' ? 4 : 2;
  if (raidPlannerMembers.includes(charName)) {
    raidPlannerMembers = raidPlannerMembers.filter(name => name !== charName);
    renderRaidPlanner();
    return;
  }
  const accountMap = getRaidAccountMap();
  const account = accountMap.get(charName);
  if (!account) return;
  if (raidPlannerMembers.some(name => accountMap.get(name) === account)) {
    toast('同一账号下的角色不能一起进团');
    return;
  }
  if (raidPlannerMode === 'quad' && raidPlannerMembers.length === 0 && !isBigRaidCharacter(charName)) {
    toast('四人团请先选择一名已标记的大角色作为队长');
    return;
  }
  if (raidPlannerMembers.length >= maxSize) {
    toast(`当前是${maxSize}人编队，请先移除角色`);
    return;
  }
  raidPlannerMembers = [...raidPlannerMembers, charName];
  renderRaidPlanner();
}

function saveCurrentRaidSquad() {
  const error = validateRaidSquad(raidPlannerMembers);
  if (error) { toast(error); return; }
  const planner = getRaidPlanner();
  const signature = `${raidPlannerMode}:${raidPlannerMembers.join('|')}`;
  if (planner.savedSquads.some(squad => `${squad.mode}:${squad.members.join('|')}` === signature)) {
    toast('这个编队已经保存');
    return;
  }
  planner.savedSquads.push({ id: `squad-${Date.now()}`, mode: raidPlannerMode, members: [...raidPlannerMembers] });
  saveData(DATA);
  raidPlannerMembers = [];
  renderRaidPlanner();
  toast('编队已保存到执行表');
}

function removeRaidSquad(squadId) {
  const planner = getRaidPlanner();
  planner.savedSquads = planner.savedSquads.filter(squad => squad.id !== squadId);
  saveData(DATA);
  renderRaidPlanner();
}

function markRaidMembersDone(members, raidId, leaderName = '') {
  const raid = getRaidDungeons().find(item => item.id === raidId);
  if (!raid) return { error: '团本配置不存在' };
  const dateStr = getTodayStr();
  const changed = [];
  const full = [];
  members.forEach(charName => {
    const progress = getRaidProgress(charName);
    if (!progress.checkins[dateStr] || typeof progress.checkins[dateStr] !== 'object') progress.checkins[dateStr] = {};
    if (progress.checkins[dateStr][raidId]) return;
    const used = getRaidCount(charName, raidId);
    if (used >= raid.weeklyLimit) { full.push(charName); return; }
    progress.checkins[dateStr][raidId] = true;
    progress.counts[raidId] = used + 1;
    changed.push(charName);
  });
  const leaderNames = Array.isArray(leaderName) ? leaderName : leaderName ? [leaderName] : [];
  if (leaderNames.length && changed.length) {
    const planner = getRaidPlanner();
    if (!planner.leaderDailyRuns[dateStr]) planner.leaderDailyRuns[dateStr] = {};
    if (!planner.leaderDailyRuns[dateStr][raidId]) planner.leaderDailyRuns[dateStr][raidId] = {};
    leaderNames.forEach(name => {
      planner.leaderRuns[name] = getRaidLeaderRuns(name) + 1;
      planner.leaderDailyRuns[dateStr][raidId][name] = getRaidLeaderDailyRuns(name, raidId, dateStr) + 1;
    });
  }
  saveData(DATA);
  return { raid, changed, full };
}

function cancelRaidMembersDone(members, raidId, leaderName = '') {
  const raid = getRaidDungeons().find(item => item.id === raidId);
  if (!raid) return { error: '团本配置不存在' };
  const dateStr = getTodayStr();
  const changed = [];
  members.forEach(charName => {
    const progress = getRaidProgress(charName);
    if (!progress.checkins[dateStr] || typeof progress.checkins[dateStr] !== 'object') return;
    if (!progress.checkins[dateStr][raidId]) return;
    const used = getRaidCount(charName, raidId);
    progress.checkins[dateStr][raidId] = false;
    progress.counts[raidId] = Math.max(0, used - 1);
    changed.push(charName);
  });
  const leaderNames = Array.isArray(leaderName) ? leaderName : leaderName ? [leaderName] : [];
  if (leaderNames.length && changed.length) {
    const planner = getRaidPlanner();
    if (!planner.leaderDailyRuns[dateStr]) planner.leaderDailyRuns[dateStr] = {};
    if (!planner.leaderDailyRuns[dateStr][raidId]) planner.leaderDailyRuns[dateStr][raidId] = {};
    leaderNames.forEach(name => {
      planner.leaderRuns[name] = Math.max(0, getRaidLeaderRuns(name) - 1);
      planner.leaderDailyRuns[dateStr][raidId][name] = Math.max(0, getRaidLeaderDailyRuns(name, raidId, dateStr) - 1);
    });
  }
  saveData(DATA);
  return { raid, changed };
}

function getRaidMembersDoneToday(members, raidId) {
  const dateStr = getTodayStr();
  return members.filter(charName => getRaidTaskVal(dateStr, charName, raidId));
}

function refreshRaidPlannerAfterChange() {
  if (typeof document === 'undefined') return;
  renderRaidPlanner();
  if (document.getElementById('game-page-dashboard')?.classList.contains('active')) renderDashboard();
  if (document.getElementById('game-page-daily')?.classList.contains('active')) renderDaily();
}

function getRaidPriorityBaseOrder() {
  const validNames = new Set(getAllChars().map(item => item.char));
  const order = [];
  const push = name => {
    if (!validNames.has(name) || order.includes(name)) return;
    order.push(name);
  };
  if (typeof document !== 'undefined') {
    document.querySelectorAll('.raid-fast-member[data-raid-char]').forEach(node => push(node.dataset.raidChar || ''));
  }
  (getRaidPlanner().manualPriorityCharacters || []).forEach(push);
  (getSchedulingConstraints().raidPriorityCharacters || []).forEach(push);
  getAllChars().forEach(item => push(item.char));
  return order;
}

function saveRaidManualPriorityOrder(order) {
  const planner = getRaidPlanner();
  const validNames = new Set(getAllChars().map(item => item.char));
  planner.manualPriorityCharacters = (order || []).filter((name, index, list) => validNames.has(name) && list.indexOf(name) === index);
  saveData(DATA);
}

function swapRaidPriorityCharacters(sourceChar, targetChar) {
  if (!sourceChar || !targetChar || sourceChar === targetChar) return false;
  const order = getRaidPriorityBaseOrder();
  const sourceIndex = order.indexOf(sourceChar);
  const targetIndex = order.indexOf(targetChar);
  if (sourceIndex < 0 || targetIndex < 0) return false;
  [order[sourceIndex], order[targetIndex]] = [order[targetIndex], order[sourceIndex]];
  saveRaidManualPriorityOrder(order);
  refreshRaidPlannerAfterChange();
  toast(`已互换：${sourceChar} ⇄ ${targetChar}`);
  return true;
}

function moveRaidPriorityCharacter(encodedCharName, direction) {
  const charName = decodeURIComponent(encodedCharName);
  const order = getRaidPriorityBaseOrder();
  const index = order.indexOf(charName);
  const targetIndex = index + Number(direction || 0);
  if (index < 0 || targetIndex < 0 || targetIndex >= order.length) return;
  swapRaidPriorityCharacters(charName, order[targetIndex]);
}

function startRaidPriorityDrag(encodedCharName, event) {
  raidPriorityDragChar = decodeURIComponent(encodedCharName);
  if (event?.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', raidPriorityDragChar);
  }
}

function dropRaidPriorityOn(encodedTargetCharName, event) {
  if (event?.preventDefault) event.preventDefault();
  const targetChar = decodeURIComponent(encodedTargetCharName);
  const sourceChar = event?.dataTransfer?.getData('text/plain') || raidPriorityDragChar;
  raidPriorityDragChar = '';
  swapRaidPriorityCharacters(sourceChar, targetChar);
}

function resetRaidManualPriority() {
  getRaidPlanner().manualPriorityCharacters = [];
  saveData(DATA);
  refreshRaidPlannerAfterChange();
  toast('已恢复默认团本角色顺序');
}

function completeRaidSquad(squadId) {
  const squad = getRaidPlanner().savedSquads.find(item => item.id === squadId);
  if (!squad) return;
  const error = validateRaidSquad(squad.members, squad.mode);
  if (error) { toast(error); return; }
  const leader = squad.mode === 'quad' ? squad.members[0] : '';
  const allDone = getRaidMembersDoneToday(squad.members, raidPlannerRaidId).length === squad.members.length;
  const result = allDone
    ? cancelRaidMembersDone(squad.members, raidPlannerRaidId, leader)
    : markRaidMembersDone(squad.members, raidPlannerRaidId, leader);
  refreshRaidPlannerAfterChange();
  if (allDone) toast(result.changed.length ? `${result.raid.name}：已取消本队完成` : '本队今天还没有完成记录');
  else if (!result.changed.length) toast(result.full.length ? `未完成：${result.full.join('、')}已达到次数上限` : '本队今天已经打过该团本');
  else toast(`${result.raid.name}：${result.changed.length}个角色已完成${result.full.length ? `；${result.full.join('、')}已满` : ''}`);
}

function completePlannedRaidSquad(encodedMembers, encodedLeaderName, encodedLeaderNames = '') {
  const members = JSON.parse(decodeURIComponent(encodedMembers));
  const leaderName = decodeURIComponent(encodedLeaderName);
  const leaderNames = encodedLeaderNames ? JSON.parse(decodeURIComponent(encodedLeaderNames)) : [leaderName];
  const accounts = members.map(name => getRaidAccountMap().get(name));
  const error = !leaderName || members.length < 2 || members.length > 4 || members[0] !== leaderName || leaderNames.some(name => !members.includes(name) || !isBigRaidCharacter(name))
    ? '自动编队必须由大号带1至3名角色'
    : accounts.some(account => !account) || new Set(accounts).size !== accounts.length ? '同一账号下的角色不能一起进团' : '';
  if (error) { toast(error); return; }
  const allDone = getRaidMembersDoneToday(members, raidPlannerRaidId).length === members.length;
  const result = allDone
    ? cancelRaidMembersDone(members, raidPlannerRaidId, leaderNames)
    : markRaidMembersDone(members, raidPlannerRaidId, leaderNames);
  refreshRaidPlannerAfterChange();
  toast(allDone
    ? (result.changed.length ? `${result.raid.name}：自动方案本场已取消` : '这场今天还没有完成记录')
    : (result.changed.length ? `${result.raid.name}：自动方案本场已完成` : '这场今天已经打过'));
}

function completePlannedRaidSolo(encodedCharName) {
  const charName = decodeURIComponent(encodedCharName);
  const dateStr = getTodayStr();
  const completed = !getRaidTaskVal(dateStr, charName, raidPlannerRaidId);
  const result = setRaidCharacterCheckin(dateStr, charName, raidPlannerRaidId, completed);
  refreshRaidPlannerAfterChange();
  toast(result.error || `${result.raid.name}：${charName}${result.completed ? '已标记完成' : '已取消完成'}`);
}

function setRaidCharacterCheckin(dateStr, charName, raidId, completed) {
  const raid = getRaidDungeons().find(item => item.id === raidId);
  if (!raid || !getAllChars().some(item => item.char === charName)) return { changed: false, error: '角色或团本不存在' };
  const progress = getRaidProgress(charName);
  if (!progress.checkins[dateStr] || typeof progress.checkins[dateStr] !== 'object') progress.checkins[dateStr] = {};
  const current = !!progress.checkins[dateStr][raidId];
  if (current === completed) return { changed: false, raid, completed: current };
  const used = getRaidCount(charName, raidId);
  if (completed && used >= raid.weeklyLimit) return { changed: false, raid, completed: false, error: `${raid.name}本周已达到${raid.weeklyLimit}次` };
  progress.checkins[dateStr][raidId] = completed;
  progress.counts[raidId] = Math.max(0, used + (completed ? 1 : -1));
  saveData(DATA);
  return { changed: true, raid, completed };
}

function toggleRaidSoloCharacter(encodedCharName) {
  const charName = decodeURIComponent(encodedCharName);
  const dateStr = getTodayStr();
  const completed = !getRaidTaskVal(dateStr, charName, raidPlannerRaidId);
  const result = setRaidCharacterCheckin(dateStr, charName, raidPlannerRaidId, completed);
  refreshRaidPlannerAfterChange();
  toast(result.error || `${result.raid.name}：${charName}${result.completed ? '已标记完成' : '已取消完成'}`);
}

function getRaidSquadCompletion(squad) {
  const raid = getRaidDungeons().find(item => item.id === raidPlannerRaidId);
  if (!raid) return { done: 0, total: squad.members.length };
  return {
    done: squad.members.filter(name => getRaidTaskVal(getTodayStr(), name, raid.id)).length,
    total: squad.members.length,
  };
}

function renderSquadConstellation(squad, index, squads) {
  const encodedMembers = encodeURIComponent(JSON.stringify(squad.members));
  const encodedLeader = encodeURIComponent(squad.leader);
  const leaderNames = squad.leaders || [squad.leader];
  const encodedLeaders = encodeURIComponent(JSON.stringify(leaderNames));
  const completion = getRaidSquadCompletion(squad);
  const previous = index > 0 ? squads[index - 1] : null;
  const members = (squad.deviceAssignments || []).map((item, deviceIndex) => {
    const previousAccount = previous?.deviceAssignments?.[deviceIndex]?.account;
    const switching = previousAccount && previousAccount !== item.account;
    const isLeader = leaderNames.includes(item.char);
    const done = getRaidTaskVal(getTodayStr(), item.char, raidPlannerRaidId);
    const encodedChar = encodeURIComponent(item.char);
    return `<div class="raid-fast-member ${done ? 'complete' : ''}" draggable="true" data-raid-char="${escapeGameHtml(item.char)}" ondragstart="startRaidPriorityDrag('${encodedChar}', event)" ondragover="event.preventDefault()" ondrop="dropRaidPriorityOn('${encodedChar}', event)"><div class="raid-fast-member-top"><span>${escapeGameHtml(item.device)}</span><div class="raid-fast-swap-actions"><button type="button" title="向上互换" onclick="event.stopPropagation(); moveRaidPriorityCharacter('${encodedChar}', -1)">↑</button><button type="button" title="向下互换" onclick="event.stopPropagation(); moveRaidPriorityCharacter('${encodedChar}', 1)">↓</button></div></div><strong>${escapeGameHtml(item.charCode)} · ${escapeGameHtml(item.char)}${isLeader ? '（带队）' : ''}</strong><small>${escapeGameHtml(item.accountCode)} · ${escapeGameHtml(item.account)}</small><em>${switching ? `切换账号：${escapeGameHtml(previousAccount)} → ${escapeGameHtml(item.account)}` : index ? '保持账号，只切角色' : '首次登录'}</em></div>`;
  }).join('');
  const entryLabel = squad.material ? '继续轮带 · 超出免费次数' : '本团本免费进入';
  const leaderLabel = leaderNames.length > 1 ? `${leaderNames.join(' + ')} 双托` : `${getRosterMeta(squad.leader)?.charCode || ''} · ${squad.leader} 带队`;
  return `<section class="raid-fast-card ${completion.done === completion.total ? 'complete' : ''} ${squad.material ? 'material' : ''}"><header><div><strong>${escapeGameHtml(squad.id || `R${index + 1}`)} · ${escapeGameHtml(leaderLabel)}</strong><small>${entryLabel} · 第${squad.runNumber}次 · ${completion.done}/${completion.total}</small></div><button class="game-btn game-btn-sm ${completion.done === completion.total ? 'game-btn-green' : 'game-btn-blue'}" type="button" onclick="completePlannedRaidSquad('${encodedMembers}','${encodedLeader}','${encodedLeaders}')">${completion.done === completion.total ? '取消本场' : '完成本场'}</button></header><div class="raid-fast-members">${members}</div></section>`;
}




function resolveConfiguredRaidLeader(keyword) {
  const normalized = String(keyword || '').toLocaleLowerCase('zh-CN');
  return getRaidLeaderCandidates().find(item => item.char.toLocaleLowerCase('zh-CN') === normalized)
    || getRaidLeaderCandidates().find(item => item.char.toLocaleLowerCase('zh-CN').includes(normalized))
    || null;
}


function getCharacterRoleTier(charName) {
  return DATA.config?.characterRoleTiers?.[charName] || 'small';
}


function getRaidPlanAccountSwitchCount(plan) {
  let switches = 0;
  const previous = new Map();
  (plan?.squads || []).forEach(squad => (squad.deviceAssignments || []).forEach(item => {
    if (previous.has(item.device) && previous.get(item.device) !== item.account) switches++;
    previous.set(item.device, item.account);
  }));
  return switches;
}

function getFixedRaidDefinitionsForDate(dateStr = getTodayStr()) {
  const definitions = DATA.config?.fixedRaidSquads || [];
  const accounts = new Map((DATA.config?.accounts || []).map(account => [account.name, account]));
  const allChars = getAllChars();
  const leader = allChars.find(item => getCharacterRoleTier(item.char) === 'large')?.char || '';
  const middleCharacters = allChars.filter(item => getCharacterRoleTier(item.char) === 'medium').map(item => item.char);
  const pairings = [
    ['159冰谷', '159静谧'],
    ['159真知', '159进化'],
    ['180冰谷', '180静谧'],
    ['180真知', '180进化'],
  ];
  const pairedDefinitions = pairings.flatMap(([firstAccountName, secondAccountName]) => {
    const firstChars = accounts.get(firstAccountName)?.chars || [];
    const secondChars = accounts.get(secondAccountName)?.chars || [];
    return Array.from({ length: Math.max(firstChars.length, secondChars.length) }, (_, charIndex) => ({
      firstChar: firstChars[charIndex] || '',
      secondChar: secondChars[charIndex] || '',
    }));
  });
  // 手机位只认账号实际归属，不再假定 AAA枪/AAA战编号对应某个区服账号。
  // 电脑位取当前唯一大号，平板位按当前16个中号顺序，不依赖已经改名或删除的旧固定表角色。
  return definitions.map((definition, index) => ({
    ...definition,
    leader: leader || definition.leader,
    devices: {
      ...(definition.devices || {}),
      '电脑': leader || definition.devices?.['电脑'] || '',
      '平板': middleCharacters[index] || definition.devices?.['平板'] || '',
      '手机1': pairedDefinitions[index]?.firstChar || definition.devices?.['手机1'] || '',
      '手机2': pairedDefinitions[index]?.secondChar || definition.devices?.['手机2'] || '',
    },
  }));
}



function buildAutomaticRaidPlan(options = {}) {
  const definitions = getFixedRaidDefinitionsForDate(options.dateStr || getTodayStr());
  const fixedStandalone = (DATA.config?.fixedRaidStandalone || []).filter(name => getRosterMeta(name));
  const allNames = new Set(getAllChars().map(item => item.char));
  if (!definitions.length) return { squads: [], standalone: fixedStandalone, error: '固定团本表不存在' };
  const fixedSquads = definitions.map((definition, index) => {
    const deviceAssignments = DAILY_GROUP_DEVICES.map(device => {
      const char = definition.devices?.[device];
      const meta = getRosterMeta(char);
      return meta ? { ...meta, char, device } : null;
    }).filter(Boolean);
    const members = deviceAssignments.map(item => item.char);
    return {
      id: `R${index + 1}`,
      leader: definition.leader,
      members,
      deviceAssignments,
      runNumber: index + 1,
      material: index + 1 > getSchedulingConstraints().raidLeaderFreeEntriesPerDungeon,
      fixed: true,
    };
  });
  const invalid = fixedSquads.find(squad => squad.members.length !== 4 || !squad.members.includes(squad.leader)
    || new Set(squad.members.map(name => getRosterMeta(name)?.account)).size !== squad.members.length);
  if (invalid) {
    const definition = definitions[fixedSquads.indexOf(invalid)] || {};
    const missing = DAILY_GROUP_DEVICES.filter(device => !getRosterMeta(definition.devices?.[device]))
      .map(device => `${device}:${definition.devices?.[device] || '空'}`);
    const accountGroups = invalid.deviceAssignments.reduce((groups, item) => {
      if (!groups[item.account]) groups[item.account] = [];
      groups[item.account].push(`${item.device}:${item.char}`);
      return groups;
    }, {});
    const conflicts = Object.entries(accountGroups).filter(([, items]) => items.length > 1)
      .map(([account, items]) => `${account}(${items.join('、')})`);
    const details = [...(missing.length ? [`缺失 ${missing.join('、')}`] : []), ...(conflicts.length ? [`同账号 ${conflicts.join('、')}`] : [])];
    return { squads: [], standalone: fixedStandalone, error: `${invalid.id}固定编队无效：${details.join('；') || '队长未在队内'}` };
  }
  const covered = new Set([...fixedSquads.flatMap(squad => squad.members), ...fixedStandalone]);
  const missing = [...allNames].filter(name => !covered.has(name));
  if (missing.length) return { squads: [], standalone: fixedStandalone, error: `固定团本表未安排：${missing.join('、')}` };
  return {
    squads: fixedSquads, standalone: fixedStandalone, impossible: [], error: '', targetCount: getSchedulingConstraints().raidWeeklyRewards,
    pendingCount: allNames.size, mode: 'single', fixedLeader: fixedSquads[0]?.leader || '', singleLeaders: fixedSquads[0]?.leader ? [fixedSquads[0].leader] : [],
    requiredRuns: fixedSquads.length, standaloneCount: fixedStandalone.length, fixed: true,
  };
}

function getRaidScheduleUnits(plan) {
  const squadUnits = (plan.squads || []).map((squad, index) => ({
    key: squad.id || `R${index + 1}`,
    originalIndex: index,
    squad,
    quotaMembers: squad.members.filter(name => name !== squad.leader && getCharacterRoleTier(name) !== 'large'),
  }));
  const standaloneUnits = (plan.standalone || []).map((charName, index) => {
    const meta = getRosterMeta(charName);
    if (!meta) return null;
    const device = getDeviceAccountStoragePlan().byAccount[meta.account]?.[0] || meta.device;
    return {
      key: `S${index + 1}`,
      originalIndex: (plan.squads || []).length + index,
      squad: { id: `S${index + 1}`, leader: '', members: [charName], deviceAssignments: [{ ...meta, device }] },
      quotaMembers: [charName],
      standalone: true,
    };
  }).filter(Boolean);
  return [...squadUnits, ...standaloneUnits].filter(unit => unit.quotaMembers.length);
}

function getRaidUnitRemaining(unit, raid, dateStr, includeCurrentDate = true) {
  return unit.quotaMembers.reduce((largest, charName) => {
    const count = getRaidCycleCount(charName, raid.id, dateStr, includeCurrentDate);
    return Math.max(largest, Math.max(0, raid.weeklyLimit - count));
  }, 0);
}

function getRaidDailySchedule(raid, dateStr, plan = buildAutomaticRaidPlan({ includeCompleted: true, dateStr })) {
  const window = getRaidCycleWindow(raid.id, dateStr);
  const units = getRaidScheduleUnits(plan).map((unit, index) => {
    const remainingBeforeToday = getRaidUnitRemaining(unit, raid, dateStr, false);
    const remaining = getRaidUnitRemaining(unit, raid, dateStr, true);
    const checkedToday = unit.quotaMembers.filter(name => getRaidTaskVal(dateStr, name, raid.id)).length;
    return { ...unit, scheduleIndex: index, remainingBeforeToday, remaining, checkedToday };
  });
  const outstandingAtStart = units.reduce((sum, unit) => sum + unit.remainingBeforeToday, 0);
  const targetToday = Math.min(units.length, Math.ceil(outstandingAtStart / Math.max(1, window.daysRemaining)));
  const started = units.filter(unit => unit.checkedToday > 0);
  const startedKeys = new Set(started.map(unit => unit.key));
  const rotationOffset = (window.dayIndex * Math.max(1, targetToday)) % Math.max(1, units.length);
  const candidates = units.filter(unit => !startedKeys.has(unit.key) && unit.remaining > 0).sort((left, right) => {
    const urgencyDifference = (right.remaining - window.daysRemaining) - (left.remaining - window.daysRemaining);
    if (urgencyDifference) return urgencyDifference;
    if (right.remaining !== left.remaining) return right.remaining - left.remaining;
    const leftRotation = (left.scheduleIndex - rotationOffset + units.length) % units.length;
    const rightRotation = (right.scheduleIndex - rotationOffset + units.length) % units.length;
    return leftRotation - rightRotation;
  });
  const selected = [...started, ...candidates.slice(0, Math.max(0, targetToday - started.length))]
    .sort((left, right) => left.originalIndex - right.originalIndex);
  const completedCharacters = getAllChars().filter(item => getCharacterRoleTier(item.char) !== 'large'
    && getRaidCycleCount(item.char, raid.id, dateStr) >= raid.weeklyLimit).length;
  const targetCharacters = getAllChars().filter(item => getCharacterRoleTier(item.char) !== 'large').length;
  return {
    raid,
    window,
    units: selected,
    targetToday,
    startedToday: started.length,
    outstanding: units.reduce((sum, unit) => sum + unit.remaining, 0),
    impossible: units.filter(unit => unit.remaining > window.daysRemaining),
    completedCharacters,
    targetCharacters,
  };
}


function buildConfiguredRaidPlan() {
  const definitions = DATA.config?.raidSquadPlan;
  if (!Array.isArray(definitions) || !definitions.length) return null;
  const plannedLeaderRuns = new Map();
  const squads = [];
  for (const definition of definitions) {
    const memberSlots = (definition.members || []).map(slot => getRosterSlot(slot[0], slot[1]));
    const deviceSlots = (definition.deviceMembers || definition.members || []).map(slot => getRosterSlot(slot[0], slot[1]));
    const leaderSlot = getRosterSlot(definition.leader?.[0], definition.leader?.[1]);
    if (!leaderSlot || memberSlots.some(slot => !slot) || deviceSlots.some(slot => !slot)) return null;
    const members = memberSlots.map(slot => slot.char);
    const accounts = memberSlots.map(slot => slot.account);
    const deviceMembers = deviceSlots.map(slot => slot.char);
    if (members.length !== 4 || new Set(accounts).size !== 4 || members[0] !== leaderSlot.char || new Set(deviceMembers).size !== 4 || deviceMembers.some(name => !members.includes(name))) return null;
    const planned = plannedLeaderRuns.get(leaderSlot.char) || 0;
    const runNumber = getRaidLeaderRuns(leaderSlot.char) + planned + 1;
    plannedLeaderRuns.set(leaderSlot.char, planned + 1);
    squads.push({
      id: definition.id || `R${squads.length + 1}`,
      leader: leaderSlot.char,
      members,
      runNumber,
      material: runNumber > getSchedulingConstraints().raidLeaderFreeEntriesPerDungeon,
      configured: true,
      deviceAssignments: deviceSlots.map((slot, index) => ({ ...slot, device: DAILY_GROUP_DEVICES[index] })),
    });
  }
  return { squads, error: '', configured: true };
}

function renderRaidSoloCheckinPanel(activeRaid) {
  const dateStr = getTodayStr();
  const allChars = getAllChars();
  const completedCount = allChars.filter(item => getRaidTaskVal(dateStr, item.char, raidPlannerRaidId)).length;
  const accountGroups = (DATA.config?.accounts || []).map((account, accountIndex) => {
    const characters = (account.chars || []).map(charName => {
      const done = getRaidTaskVal(dateStr, charName, raidPlannerRaidId);
      const encoded = encodeURIComponent(charName);
      const meta = getRosterMeta(charName);
      return `<button type="button" class="raid-solo-character ${done ? 'complete' : ''}" aria-pressed="${done}" onclick="toggleRaidSoloCharacter('${encoded}')"><span>${escapeGameHtml(meta?.charCode || charName.slice(0, 1))}</span><div><strong>${escapeGameHtml(charName)}</strong><small>${escapeGameHtml(account.name)} · 本周 ${getRaidCount(charName, raidPlannerRaidId)}/${activeRaid?.weeklyLimit || 5}</small></div><em>${done ? '✓ 已完成' : '标记完成'}</em></button>`;
    }).join('');
    return `<section class="raid-solo-account"><header><span>${escapeGameHtml(DATA.config?.accountCodePlan?.[accountIndex] || `账号${accountIndex + 1}`)}</span><strong>${escapeGameHtml(account.name)}</strong></header><div>${characters}</div></section>`;
  }).join('');
  return `<section class="raid-solo-checkin-panel"><div class="constellation-plan-heading"><div><span>INDIVIDUAL CHECK-IN</span><h3>${escapeGameHtml(activeRaid?.icon || '⚔️')} ${escapeGameHtml(activeRaid?.name || '当前团本')} · 单人完成</h3><p>列出全部角色；点击标记今日完成，再点一次取消。状态与上方自动编队、日常明细共用。</p></div><strong>${completedCount}/${allChars.length} 已完成</strong></div><div class="raid-solo-account-list">${accountGroups}</div></section>`;
}

function renderRaidPlanner() {
  const wrap = document.getElementById('raidStarfieldContent');
  if (!wrap) return;
  const allChars = getAllChars();
  const raids = getRaidDungeons();
  if (!raids.some(raid => raid.id === raidPlannerRaidId)) raidPlannerRaidId = raids[0]?.id || 'raid1';
  const expectedSize = raidPlannerMode === 'quad' ? 4 : 2;
  const selectionSlots = Array.from({ length: expectedSize }, (_, index) => {
    const name = raidPlannerMembers[index];
    const item = allChars.find(char => char.char === name);
    const role = raidPlannerMode === 'quad' && index === 0 ? '大角色队长' : '队员';
    return `<div class="raid-selection-slot ${item ? 'filled' : ''}"><small>${role}</small><strong>${item ? escapeGameHtml(item.char) : '等待星球入轨'}</strong><span>${item ? escapeGameHtml(item.account) : `位置 ${index + 1}`}</span></div>`;
  }).join('');
  const automatic = buildAutomaticRaidPlan();
  const planner = getRaidPlanner();
  const leaderCandidates = getRaidLeaderCandidates();
  const activeRaid = raids.find(raid => raid.id === raidPlannerRaidId);
  const activeCarryMode = activeRaid?.carryMode || automatic.mode;
  const plannedLeaderOrder = (automatic.squads || []).map(squad => squad.leader).join(' → ');
  const singleLeaderLabel = plannedLeaderOrder ? `1托3：${plannedLeaderOrder}` : '1托3：固定麻薯带队';
  const modeLabel = activeCarryMode === 'double' ? '双托：电脑麻薯 + 平板AAA建材' : singleLeaderLabel;
  const autoModeHtml = `<section class="raid-auto-mode-deck"><div class="raid-auto-mode-buttons"><button class="active" type="button" disabled>🔥 1托3模式</button></div><div class="raid-fixed-leaders"><span>${escapeGameHtml(activeRaid?.name || '')}自动采用：${escapeGameHtml(modeLabel)}</span>${(automatic.singleLeaders || []).map(name => `<button class="active" type="button" disabled>${escapeGameHtml(name)}（大号）</button>`).join('')}</div></section>`;
  const impossibleHtml = automatic.impossible?.length
    ? `<div class="raid-auto-empty"><strong>⚠ 本周已无法补满：${automatic.impossible.length}个角色</strong><small>剩余天数不足以从当前次数达到5/5；本周继续每天安排，下周会从0/5重新规划。</small></div>`
    : '';
  const soloHtml = (automatic.standalone || []).length
    ? `<section class="raid-solo-route"><div><span>SOLO FINISH</span><strong>带队后单独完成 ${automatic.standalone.length} 个角色</strong><small>无需占用大号免费进入次数</small></div><div>${automatic.standalone.map(name => `<button type="button" class="${getRaidTaskVal(getTodayStr(), name, raidPlannerRaidId) ? 'complete' : ''}" onclick="completePlannedRaidSolo('${encodeURIComponent(name)}')">${escapeGameHtml(getRosterMeta(name)?.charCode || '')} · ${escapeGameHtml(name)}${getRaidTaskVal(getTodayStr(), name, raidPlannerRaidId) ? ' ✓' : ''}</button>`).join('')}</div></section>`
    : '';
  const routeDescription = automatic.mode === 'double'
    ? `电脑固定麻薯、平板固定AAA建材，两个手机安排其他不同账号角色；需要${automatic.requiredRuns}场，手机覆盖${automatic.groupedCharacters}个角色，剩余${automatic.standaloneCount}个单刷。`
    : automatic.mode === 'single'
      ? `固定顺序：${escapeGameHtml(plannedLeaderOrder || '麻薯饼干')}；${automatic.standalone.length}个角色单刷。`
      : `两个大号轮流带队，每个大号在当前团本前${getSchedulingConstraints().raidLeaderFreeEntriesPerDungeon}场免费。`;
  const constellationHtml = automatic.error
    ? `<section class="fixed-constellation-plan"><div class="raid-auto-empty">${escapeGameHtml(automatic.error)}</div></section>`
    : `<section class="raid-fast-section"><div class="daily-group-plan-head"><div><strong>${escapeGameHtml(activeRaid?.icon || '⚔️')} ${escapeGameHtml(activeRaid?.name || '当前团本')} · 唯一最新自动编队</strong><small>按 R1 → R${automatic.squads.length} 执行；${routeDescription}</small></div><span>需要 ${automatic.requiredRuns} 场 · ${automatic.standalone.length} 个单刷</span></div>${impossibleHtml}<div class="raid-fast-list">${automatic.squads.map((squad, index) => renderSquadConstellation(squad, index, automatic.squads)).join('')}</div>${soloHtml}</section>`;
  const individualCheckinHtml = renderRaidSoloCheckinPanel(activeRaid);
  const leaders = resolveSingleCarryRaidLeaders().map(item => `<span>${escapeGameHtml(item.char)}：本团本今日进入 ${getRaidLeaderDailyRuns(item.char, raidPlannerRaidId)} 次</span>`).join('');
  wrap.innerHTML = `
    ${autoModeHtml}
    <section class="raid-command-deck"><div class="raid-command-tabs"><button class="active" onclick="setRaidPlannerMode('quad')">🛰️ 1托3 · 四人团</button></div><div class="raid-dungeon-switch">${raids.map(raid => `<button class="${raid.id === raidPlannerRaidId ? 'active' : ''}" onclick="setRaidPlannerDungeon('${raid.id}')">${raid.icon} ${escapeGameHtml(raid.name)}</button>`).join('')}</div><div class="raid-leader-budget">${leaders || `<span>请确认麻薯饼干与AAA建材两个带队角色</span>`}</div></section>
    ${constellationHtml}
    ${individualCheckinHtml}`;
}

function getAccTaskVal(dateStr, accName, taskId) {
  const log = DATA.dailyLog[dateStr];
  if (!log || !log.accounts[accName]) return false;
  return log.accounts[accName][taskId] || false;
}

function getGlobalTaskVal(dateStr, taskId) {
  const log = DATA.dailyLog[dateStr];
  if (log && log.global && log.global[taskId] !== undefined) return !!log.global[taskId];
  // 兼容旧版本：若历史数据按账号保存，只取一次作为全局任务结果。
  if (log && log.accounts) return Object.values(log.accounts).some(tasks => tasks && tasks[taskId]);
  return false;
}

function getWeekTaskSum(charName, task, baseDateStr) {
  const taskId = typeof task === 'string' ? task : task.id;
  const weekDays = getWeekDates(baseDateStr);
  let sum = 0;
  weekDays.forEach(d => {
    if (typeof task === 'object' && !isTaskDueOnDate(task, d.iso)) return;
    if (typeof task === 'object' && isGroupedCharacterTask(task) && !isCharacterScheduledForDaily(charName, d.iso)) return;
    const v = getTaskVal(d.iso, charName, taskId);
    sum += (typeof v === 'number') ? v : (v ? 1 : 0);
  });
  return sum;
}

function isCharacterScheduledForDaily(charName, dateStr) {
  return getDailyScheduledCharacters(dateStr).some(item => item.char === charName);
}

function getCharacterTaskWeekGoal(charName, task, baseDateStr) {
  if (!isGroupedCharacterTask(task)) return getWeekDates(baseDateStr).filter(day => isTaskDueOnDate(task, day.iso)).length;
  return getWeekDates(baseDateStr).filter(day => isTaskDueOnDate(task, day.iso) && isCharacterBaseScheduledForDaily(charName, day.iso)).length;
}

function getWeekAccTaskSum(accName, taskId) {
  const weekDays = getWeekDates();
  let sum = 0;
  weekDays.forEach(d => {
    sum += getAccTaskVal(d.iso, accName, taskId) ? 1 : 0;
  });
  return sum;
}

function getWeekGlobalTaskSum(taskId) {
  return getWeekDates().reduce((sum, day) => sum + (getGlobalTaskVal(day.iso, taskId) ? 1 : 0), 0);
}

function getCharGold(charName) {
  return Math.max(0, Number(DATA.characterGold?.[charName]) || 0);
}

function getCharacterAntiMagic(charName) {
  return Math.max(0, Math.floor(Number(DATA.characterAntiMagic?.[charName]) || 0));
}

const EQUIPMENT_BUILD_SLOTS = [
  { id: 'gloves', label: '手套', icon: '🧤', emblem: '维克兄弟会徽记' },
  { id: 'bracelet', label: '腕带', icon: '⌚', emblem: '维克兄弟会徽记' },
  { id: 'chest', label: '胸甲', icon: '🦺', emblem: '重盾徽记' },
  { id: 'amulet', label: '护符', icon: '📿', emblem: '重盾徽记' },
  // 保持 clothes 数据键不变，避免旧版“衣服”词条记录丢失；界面显示为头盔。
  { id: 'clothes', label: '头盔', icon: '⛑️', emblem: '安德烈徽记' },
  { id: 'ring', label: '戒指', icon: '💍', emblem: '安德烈徽记' },
  { id: 'pants', label: '裤子', icon: '👖', emblem: '哥斯莫拉徽记' },
  { id: 'seal', label: '印章', icon: '🔖', emblem: '哥斯莫拉徽记' },
  { id: 'weapon', label: '武器', icon: '⚔️', emblem: '克拉格徽章' },
  { id: 'shoes', label: '鞋子', icon: '👢', emblem: '上古守卫魅徽记' },
  { id: 'necklace', label: '项链', icon: '💎', emblem: '发条典狱长徽记' },
];

// 每个培养角色的固定徽记需求，来自你提供的交易截图；不代表当前库存。
const EQUIPMENT_BUILD_EMBLEMS = [
  { name: '蜜丽亚徽记', perCharacter: 9 },
  { name: '树妖徽记', perCharacter: 2 },
  { name: '重盾守卫徽记', perCharacter: 4 },
];

const EQUIPMENT_BUILD_EMBLEM_PLAN_DEFAULTS = {
  miriaRequired: 2,
  treeRequired: 4,
  shieldRequired: 4,
  embryo: 7,
};

const EQUIPMENT_BUILD_REQUIRED_AFFIXES = ['技能-精研', '技能-四号', '技能-三号', '技能-二号', '技能-强攻', '技能-主锋', '技能-辅锋'];
const EQUIPMENT_BUILD_OPTIONAL_AFFIXES = ['终断-增幅', '攻坚-强敌', '连击-增伤', '攻坚-独战', '稳打-近攻', '增幅-附伤', '连击-连环', '终断-战意', '攻坚-强压', '光环-洞察'];
const EQUIPMENT_BUILD_AFFIXES = [...EQUIPMENT_BUILD_REQUIRED_AFFIXES, ...EQUIPMENT_BUILD_OPTIONAL_AFFIXES];

function getEquipmentBuildStatus(charName) {
  if (!DATA.equipmentBuild || typeof DATA.equipmentBuild !== 'object' || Array.isArray(DATA.equipmentBuild)) DATA.equipmentBuild = {};
  if (!DATA.equipmentBuild[charName] || typeof DATA.equipmentBuild[charName] !== 'object' || Array.isArray(DATA.equipmentBuild[charName])) {
    DATA.equipmentBuild[charName] = {};
  }
  return DATA.equipmentBuild[charName];
}

function getEquipmentBuildOutput60s(charName) {
  const value = Number(getEquipmentBuildStatus(charName).output60s);
  return Number.isFinite(value) && value >= 0 ? value : '';
}

function getEquipmentBuildCompleted(charName) {
  return getEquipmentBuildAffixAnalysis(charName).activeSlotIds.size;
}

function getEquipmentBuildAffixStatus(charName) {
  const status = getEquipmentBuildStatus(charName);
  if (!status.affixes || typeof status.affixes !== 'object' || Array.isArray(status.affixes)) status.affixes = {};
  return status.affixes;
}

function getEquipmentBuildAffixAnalysis(charName) {
  const affixes = getEquipmentBuildAffixStatus(charName);
  const activeSlotIds = new Set();
  const duplicateSlotIds = new Set();
  const activeAffixes = new Set();
  EQUIPMENT_BUILD_SLOTS.forEach(slot => {
    const value = affixes[slot.id];
    if (!EQUIPMENT_BUILD_AFFIXES.includes(value)) return;
    if (activeAffixes.has(value)) duplicateSlotIds.add(slot.id);
    else { activeAffixes.add(value); activeSlotIds.add(slot.id); }
  });
  return {
    activeSlotIds,
    duplicateSlotIds,
    activeAffixes,
    missingRequired: EQUIPMENT_BUILD_REQUIRED_AFFIXES.filter(name => !activeAffixes.has(name)),
  };
}

function getEquipmentBuildRemainingAffixGroups(affixAnalysis) {
  const groups = new Map();
  EQUIPMENT_BUILD_AFFIXES
    .filter(name => !affixAnalysis.activeAffixes.has(name))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
    .forEach(name => {
      const [prefix] = name.split('-');
      if (!groups.has(prefix)) groups.set(prefix, []);
      groups.get(prefix).push(name);
    });
  return [...groups.entries()];
}

function getEquipmentBuildEmblemStatus(charName) {
  const status = getEquipmentBuildStatus(charName);
  if (!status.emblems || typeof status.emblems !== 'object' || Array.isArray(status.emblems)) status.emblems = {};
  return status.emblems;
}

function getEquipmentBuildEmblemSelections(charName) {
  const status = getEquipmentBuildStatus(charName);
  if (!status.emblemChoices || typeof status.emblemChoices !== 'object' || Array.isArray(status.emblemChoices)) status.emblemChoices = {};
  return status.emblemChoices;
}

function getEquipmentBuildEmblemStock() {
  if (!DATA.equipmentBuildEmblemStock || typeof DATA.equipmentBuildEmblemStock !== 'object' || Array.isArray(DATA.equipmentBuildEmblemStock)) DATA.equipmentBuildEmblemStock = {};
  return DATA.equipmentBuildEmblemStock;
}

function getEquipmentBuildEmblemPlan() {
  if (!DATA.equipmentBuildEmblemPlan || typeof DATA.equipmentBuildEmblemPlan !== 'object' || Array.isArray(DATA.equipmentBuildEmblemPlan)) DATA.equipmentBuildEmblemPlan = {};
  const plan = DATA.equipmentBuildEmblemPlan;
  // 旧版默认树妖为 2；升级为每角色必要 4 个，但保留之后用户手动改过的数值。
  if ((Number(plan._version) || 0) < 2) {
    plan.treeRequired = 4;
    plan._version = 2;
  }
  Object.entries(EQUIPMENT_BUILD_EMBLEM_PLAN_DEFAULTS).forEach(([key, defaultValue]) => {
    const value = Number(plan[key]);
    if (!Number.isFinite(value) || value < 0) plan[key] = defaultValue;
    else plan[key] = Math.floor(value);
  });
  return plan;
}

function getEquipmentBuildCharacterEmblems(charName) {
  const status = getEquipmentBuildStatus(charName);
  if (!status.requiredEmblems || typeof status.requiredEmblems !== 'object' || Array.isArray(status.requiredEmblems)) status.requiredEmblems = {};
  return status.requiredEmblems;
}

function getEquipmentBuildCharacterEmblemCompleted(charName, plan) {
  const amounts = getEquipmentBuildCharacterEmblems(charName);
  return [
    ['miriaRequired', 'miriaRequired'],
    ['shieldRequired', 'shieldRequired'],
    ['treeRequired', 'treeRequired'],
    ['embryo', 'embryo'],
  ].reduce((sum, [amountKey, planKey]) => sum + (Math.max(0, Math.floor(Number(amounts[amountKey]) || 0)) >= plan[planKey] ? 1 : 0), 0);
}

function getEquipmentBuildEmblemQuantity(name) {
  const initial = EQUIPMENT_BUILD_EMBLEMS.find(item => item.name === name)?.initial || 0;
  const value = Number(getEquipmentBuildEmblemStock()[name]);
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : initial;
}

function getEquipmentBuildEmblemDemand(charNames) {
  const demand = Object.fromEntries(EQUIPMENT_BUILD_EMBLEMS.map(item => [item.name, 0]));
  (charNames || []).forEach(charName => {
    const selections = getEquipmentBuildEmblemSelections(charName);
    EQUIPMENT_BUILD_SLOTS.forEach(slot => {
      const name = selections[slot.id];
      if (Object.prototype.hasOwnProperty.call(demand, name)) demand[name] += 1;
    });
  });
  return demand;
}

function getEquipmentBuildEmblemCompleted(charName) {
  const emblems = getEquipmentBuildEmblemSelections(charName);
  return EQUIPMENT_BUILD_SLOTS.reduce((sum, slot) => sum + (EQUIPMENT_BUILD_EMBLEMS.some(item => item.name === emblems[slot.id]) ? 1 : 0), 0);
}

function getEquipmentBuildLoopStatus(charName) {
  const status = getEquipmentBuildStatus(charName);
  if (!status.loops || typeof status.loops !== 'object' || Array.isArray(status.loops)) status.loops = {};
  return status.loops;
}

function getEquipmentBuildLoopCompleted(charName) {
  const loops = getEquipmentBuildLoopStatus(charName);
  return EQUIPMENT_BUILD_SLOTS.reduce((sum, slot) => {
    const value = Number(loops[slot.id]);
    return sum + (Number.isInteger(value) && value >= 1 && value <= 4 ? 1 : 0);
  }, 0);
}

function getEquipmentBuildSelectedCharSet(characters) {
  const validNames = new Set(characters.map(item => item.char));
  if (equipmentBuildSelectedChars === null) {
    try {
      const saved = JSON.parse(localStorage.getItem(EQUIPMENT_BUILD_FILTER_KEY) || 'null');
      equipmentBuildSelectedChars = Array.isArray(saved) ? new Set(saved.filter(name => validNames.has(name))) : new Set(validNames);
    } catch (_) {
      equipmentBuildSelectedChars = new Set(validNames);
    }
  }
  [...equipmentBuildSelectedChars].forEach(name => {
    if (!validNames.has(name)) equipmentBuildSelectedChars.delete(name);
  });
  return equipmentBuildSelectedChars;
}

function saveEquipmentBuildSelectedChars() {
  try {
    localStorage.setItem(EQUIPMENT_BUILD_FILTER_KEY, JSON.stringify([...equipmentBuildSelectedChars || []]));
  } catch (_) { /* 仅为界面筛选偏好，保存失败不影响构造数据 */ }
}

function resetEquipmentBuildRenderedOrder() {
  equipmentBuildRenderedOrder = null;
}

function formatGameGold(value) {
  return Math.max(0, Math.floor(Number(value) || 0)).toLocaleString();
}

function getGoldTransferTax(price) {
  return Math.ceil(Math.max(0, Math.floor(price)) * GOLD_TRANSFER_TAX_PERCENT / 100);
}

function getGoldTransferAccountKey(character) {
  if (character?.transferAccount) return String(character.transferAccount);
  const charName = String(character?.char || '');
  const accountName = String(character?.account || '');
  const shared = GOLD_TRANSFER_SHARED_ACCOUNTS.find(rule => rule.characterPattern.test(charName) || rule.accounts.has(accountName));
  return shared?.key || `account:${accountName}`;
}

function getGoldTransferAccountLabel(character) {
  const accountKey = getGoldTransferAccountKey(character);
  return GOLD_TRANSFER_SHARED_ACCOUNTS.find(rule => rule.key === accountKey)?.label || String(character?.account || '');
}

function isSameGoldTransferAccount(left, right) {
  return getGoldTransferAccountKey(left) === getGoldTransferAccountKey(right);
}

function getGoldTransferCharacters() {
  return getAllChars().map(item => ({
    ...item,
    gold: Math.floor(getCharGold(item.char)),
    transferAccount: getGoldTransferAccountKey(item),
  }));
}

function renderGoldTransferTargetSelector() {
  const wrap = document.getElementById('goldTransferTargetSelector');
  if (!wrap) return;
  const characters = getGoldTransferCharacters();
  const available = new Set(characters.filter(item => item.gold >= GOLD_TRANSFER_DEPOSIT).map(item => item.char));
  [...selectedGoldTransferTargetChars].forEach(charName => {
    if (!available.has(charName)) selectedGoldTransferTargetChars.delete(charName);
  });
  const selectedCount = selectedGoldTransferTargetChars.size;
  wrap.innerHTML = `<section class="gold-transfer-target-selector"><div class="gold-transfer-target-head"><div><strong>指定汇总目标（可多选）</strong><small>已选 ${selectedCount} 名；目标角色需至少保留 ${formatGameGold(GOLD_TRANSFER_DEPOSIT)} 金币押金。</small></div><button class="game-btn game-btn-outline game-btn-sm" type="button" ${selectedCount ? '' : 'disabled'} onclick="clearGoldTransferTargets()">改为自动选择</button></div><div class="gold-transfer-target-list">${characters.map(item => {
    const availableTarget = item.gold >= GOLD_TRANSFER_DEPOSIT;
    const encodedChar = encodeURIComponent(item.char);
    return `<label class="${availableTarget ? '' : 'unavailable'}"><input type="checkbox" class="game-check" ${selectedGoldTransferTargetChars.has(item.char) ? 'checked' : ''} ${availableTarget ? '' : 'disabled'} onchange="toggleGoldTransferTarget(decodeURIComponent('${encodedChar}'),this.checked)"><span><strong>${escapeGameHtml(item.char)}</strong><small>${escapeGameHtml(item.account)} · ${formatGameGold(item.gold)} 金币${availableTarget ? '' : '（押金不足）'}</small></span></label>`;
  }).join('')}</div></section>`;
}

function renderAllCharacterGoldManager() {
  const accounts = DATA.config?.accounts || [];
  const accountSections = accounts.map((account, accountIndex) => {
    const accountTotal = (account.chars || []).reduce((sum, charName) => sum + getCharGold(charName), 0);
    const characterRows = (account.chars || []).map(charName => {
      const meta = getRosterMeta(charName);
      const encodedChar = encodeURIComponent(charName);
      return `<label class="game-gold-all-character"><span>${escapeGameHtml(meta?.charCode || charName.slice(0, 1))}</span><div><strong>${escapeGameHtml(charName)}</strong><small>${escapeGameHtml(meta?.device || '未分配设备')}</small></div><input type="number" min="0" step="1" value="${getCharGold(charName)}" onchange="setCharGold(decodeURIComponent('${encodedChar}'),this.value)" aria-label="${escapeGameAttr(charName)}全部角色金币"></label>`;
    }).join('');
    return `<section class="game-gold-account"><header><div><span>${escapeGameHtml(DATA.config?.accountCodePlan?.[accountIndex] || `账号${accountIndex + 1}`)}</span><strong>${escapeGameHtml(account.name)}</strong><small>${(account.chars || []).length} 个角色</small></div><b>${formatGameGold(accountTotal)} 金币</b></header><div class="game-gold-all-grid">${characterRows}</div></section>`;
  }).join('');
  const allChars = getAllChars();
  return `<section class="game-gold-all-manager"><div class="game-gold-all-heading"><div><span>ALL CHARACTER LEDGER</span><h3>全部角色金币管理</h3><p>按账号管理全部 ${allChars.length} 个角色；与上方当日日常队录入、金币转移共用同一份余额。</p></div><strong>${accounts.length} 个账号 · ${formatGameGold(allChars.reduce((sum, item) => sum + getCharGold(item.char), 0))} 金币</strong></div><div class="game-gold-account-list">${accountSections}</div></section>`;
}

function renderGameGoldPage() {
  const wrap = document.getElementById('gameGoldGroups');
  if (!wrap) return;
  const allChars = getAllChars();
  const total = allChars.reduce((sum, item) => sum + getCharGold(item.char), 0);
  const completed = allChars.filter(item => getUnifiedMemberCompletion(item.char, viewingDate, getDailyStarTasks(viewingDate), getRaidDungeons()).complete).length;
  wrap.innerHTML = `<section class="game-gold-summary"><div><span>EXECUTION INPUT</span><strong>${completed}/${allChars.length} 个角色已开放队内金币录入</strong></div><div><span>ALL CHARACTER TOTAL</span><strong>${total.toLocaleString()} 金币</strong></div></section><details class="game-gold-all-details"><summary><span>余额修正</span><strong>展开全部角色金币管理</strong><small>仅在需要修改未完成队伍或历史余额时使用</small></summary>${renderAllCharacterGoldManager()}</details>`;
  renderGoldTransferTargetSelector();
  renderGoldTransferPlanner();
}

function toggleGoldTransferTarget(charName, checked) {
  if (checked) selectedGoldTransferTargetChars.add(charName);
  else selectedGoldTransferTargetChars.delete(charName);
  clearGoldTransferExecution();
  saveData(DATA);
  renderGoldTransferTargetSelector();
  renderGoldTransferPlanner();
}

function clearGoldTransferTargets() {
  if (!selectedGoldTransferTargetChars.size) return;
  selectedGoldTransferTargetChars.clear();
  clearGoldTransferExecution();
  saveData(DATA);
  renderGoldTransferTargetSelector();
  renderGoldTransferPlanner();
}

function clearGoldTransferExecution() {
  lastGoldTransferPlans = null;
  DATA.goldTransferExecution = null;
}

function getGoldTransferCharacterUid(charName, accountName) {
  const accounts = DATA.config?.accounts || [];
  const account = accounts.find(item => item.name === accountName && (item.chars || []).includes(charName))
    || accounts.find(item => (item.chars || []).includes(charName));
  return String(account?.charUids?.[charName] || '').trim();
}

function renderGoldTransferSeller(seller) {
  const uid = getGoldTransferCharacterUid(seller.char, seller.account);
  const uidDisplay = uid
    ? `<span class="gold-transfer-uid"><code>${escapeGameHtml(uid)}</code><button class="game-btn game-btn-outline game-btn-sm" type="button" onclick="copyCharacterUid(decodeURIComponent('${encodeURIComponent(uid)}'))">复制</button></span>`
    : `<span class="gold-transfer-uid-editor" data-character="${escapeGameAttr(seller.char)}" data-account="${escapeGameAttr(seller.account)}"><small class="gold-transfer-uid-missing">未填写 UID</small><input type="text" inputmode="numeric" maxlength="32" autocomplete="off" placeholder="现场填写 UID" aria-label="${escapeGameAttr(seller.char)}的交易 UID" onkeydown="if(event.key==='Enter'){event.preventDefault();this.nextElementSibling.click()}"><button class="game-btn game-btn-blue game-btn-sm" type="button" onclick="saveGoldTransferCharacterUid(this)">保存</button></span>`;
  return `<strong>${escapeGameHtml(seller.char)}</strong><br><small>${escapeGameHtml(seller.account)}</small>${uidDisplay}`;
}

function setGoldTransferCharacterUid(charName, accountName, value) {
  const uid = String(value || '').trim();
  if (!uid) return { ok: false, message: '请先填写 UID' };
  const accounts = DATA.config?.accounts || [];
  const account = accounts.find(item => item.name === accountName && (item.chars || []).includes(charName))
    || accounts.find(item => (item.chars || []).includes(charName));
  if (!account) return { ok: false, message: `找不到角色 ${charName}，无法保存 UID` };
  if (!account.charUids || typeof account.charUids !== 'object' || Array.isArray(account.charUids)) account.charUids = {};
  account.charUids[charName] = uid;
  saveData(DATA);
  return { ok: true, message: `${charName} 的 UID 已保存，以后会自动使用`, uid };
}

function saveGoldTransferCharacterUid(button) {
  const editor = button?.closest?.('.gold-transfer-uid-editor');
  const input = editor?.querySelector?.('input');
  if (!editor || !input) return;
  const result = setGoldTransferCharacterUid(editor.dataset.character || '', editor.dataset.account || '', input.value);
  if (!result.ok) {
    input.focus();
    toast(result.message);
    return;
  }
  const openPlanKeys = [...document.querySelectorAll('.gold-transfer-details[open][data-plan-key]')]
    .map(item => item.dataset.planKey).filter(Boolean);
  renderGoldTransferPlanner();
  openPlanKeys.forEach(planKey => {
    const details = document.querySelector(`.gold-transfer-details[data-plan-key="${CSS.escape(planKey)}"]`);
    if (details) details.open = true;
  });
  toast(result.message);
}

function compareGoldTransferPlans(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (a.loss !== b.loss) return a.loss < b.loss ? a : b;
  const aTargets = a.targets.map(item => item.char).join('|');
  const bTargets = b.targets.map(item => item.char).join('|');
  return aTargets.localeCompare(bTargets, 'zh-CN') <= 0 ? a : b;
}

function getGoldTransferListingCounts(operations) {
  return (operations || []).reduce((counts, step) => {
    const sellerName = step?.seller?.char;
    if (sellerName) counts[sellerName] = (counts[sellerName] || 0) + 1;
    return counts;
  }, {});
}

function isGoldTransferPlanWithinListingLimit(plan) {
  return !!plan && Object.values(getGoldTransferListingCounts(plan.operations))
    .every(count => count <= GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER);
}

function isGoldTransferOperationReady(plan, operationIndex) {
  const step = plan?.operations?.[operationIndex];
  if (!step) return false;
  return plan.operations.every((candidate, index) => index >= operationIndex
    || candidate.completed
    || candidate.seller?.char !== step.buyer?.char);
}

// 从“买方”向“卖方”转金币。卖方需先持有押金，交易成功后押金返还。
function buildGoldTransferPlan(targets, bridge, lockedSources, characters) {
  const balances = Object.fromEntries(characters.map(item => [item.char, item.gold]));
  const targetNames = new Set(targets.map(item => item.char));
  const lockedNames = new Set(lockedSources.map(item => item.char));
  const operations = [];
  const listingCounts = {};

  const transfer = (buyer, seller) => {
    const price = Math.floor(balances[buyer.char] || 0);
    if (price <= 0) return true;
    if ((balances[seller.char] || 0) < GOLD_TRANSFER_DEPOSIT) return false;
    if ((listingCounts[seller.char] || 0) >= GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER) return false;
    const tax = getGoldTransferTax(price);
    const received = price - tax;
    balances[buyer.char] -= price;
    balances[seller.char] += received;
    listingCounts[seller.char] = (listingCounts[seller.char] || 0) + 1;
    operations.push({ buyer, seller, price, tax, received });
    return true;
  };

  // 同账号的来源角色先把金币交给外部中转角色；中转角色最后合并为一笔卖给目标，
  // 这样既满足交易限制，也避免中转的第二段被拆成多笔而产生额外取整税。
  if (bridge) {
    for (const source of lockedSources) {
      if (!transfer(source, bridge)) return null;
    }
    const bridgeTargets = targets.slice().sort((a, b) => balances[a.char] - balances[b.char]);
    if (!transfer(bridge, bridgeTargets[0])) return null;
  }

  const directSources = characters.filter(source =>
    !targetNames.has(source.char) && !lockedNames.has(source.char) && source.char !== bridge?.char
    && (balances[source.char] || 0) > 0
  ).sort((left, right) => {
    const leftOptions = targets.filter(target => !isSameGoldTransferAccount(target, left)).length;
    const rightOptions = targets.filter(target => !isSameGoldTransferAccount(target, right)).length;
    return leftOptions - rightOptions || left.char.localeCompare(right.char, 'zh-CN');
  });
  for (const source of directSources) {
    const eligibleTargets = targets
      .filter(target => !isSameGoldTransferAccount(target, source)
        && (listingCounts[target.char] || 0) < GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER)
      .sort((a, b) => (listingCounts[a.char] || 0) - (listingCounts[b.char] || 0)
        || balances[a.char] - balances[b.char]
        || a.char.localeCompare(b.char, 'zh-CN'));
    if (!eligibleTargets.length || !transfer(source, eligibleTargets[0])) return null;
  }

  const initialTotal = characters.reduce((sum, item) => sum + item.gold, 0);
  const finalTotal = Object.values(balances).reduce((sum, value) => sum + value, 0);
  return {
    targets,
    bridge,
    characters,
    operations,
    listingCounts,
    balances,
    initialTotal,
    finalTotal,
    loss: initialTotal - finalTotal,
  };
}

// 直接汇总受10件上限限制时，使用多层中转树继续汇总。父节点是上架卖方，
// 子节点是购买方；先执行叶子交易，再逐层转入最终目标。
function buildHierarchicalGoldTransferPlan(targets, characters) {
  const targetNames = new Set(targets.map(item => item.char));
  const nodes = new Map(characters.map(item => [item.char, {
    item,
    accountKey: getGoldTransferAccountKey(item),
    children: [],
    depth: 0,
  }]));
  const remaining = characters.filter(item => !targetNames.has(item.char) && item.gold > 0).map(item => nodes.get(item.char));
  const listingCounts = {};
  const availableParents = targets.map(target => nodes.get(target.char));

  while (remaining.length) {
    let selectedSource = null;
    let selectedParent = null;
    let selectedParentCount = Infinity;
    remaining.forEach(source => {
      let bestParent = null;
      let parentCount = 0;
      availableParents.forEach(parent => {
        if ((listingCounts[parent.item.char] || 0) >= GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER
          || parent.accountKey === source.accountKey) return;
        parentCount++;
        if (!bestParent || parent.depth < bestParent.depth
          || (parent.depth === bestParent.depth && (listingCounts[parent.item.char] || 0) < (listingCounts[bestParent.item.char] || 0))
          || (parent.depth === bestParent.depth && (listingCounts[parent.item.char] || 0) === (listingCounts[bestParent.item.char] || 0)
            && parent.item.char.localeCompare(bestParent.item.char, 'zh-CN') < 0)) bestParent = parent;
      });
      if (!bestParent) return;
      const sourceCanRelay = source.item.gold >= GOLD_TRANSFER_DEPOSIT;
      const selectedCanRelay = selectedSource?.item.gold >= GOLD_TRANSFER_DEPOSIT;
      if (!selectedSource || (sourceCanRelay && !selectedCanRelay)
        || (sourceCanRelay === selectedCanRelay && parentCount < selectedParentCount)
        || (sourceCanRelay === selectedCanRelay && parentCount === selectedParentCount && source.item.gold > selectedSource.item.gold)
        || (sourceCanRelay === selectedCanRelay && parentCount === selectedParentCount && source.item.gold === selectedSource.item.gold
          && source.item.char.localeCompare(selectedSource.item.char, 'zh-CN') < 0)) {
        selectedSource = source;
        selectedParent = bestParent;
        selectedParentCount = parentCount;
      }
    });
    if (!selectedSource || !selectedParent) return null;

    const parent = selectedParent;
    const child = selectedSource;
    child.depth = parent.depth + 1;
    child.parent = parent;
    parent.children.push(child);
    listingCounts[parent.item.char] = (listingCounts[parent.item.char] || 0) + 1;
    remaining.splice(remaining.indexOf(child), 1);
    if (child.item.gold >= GOLD_TRANSFER_DEPOSIT) availableParents.push(child);
  }

  const balances = Object.fromEntries(characters.map(item => [item.char, item.gold]));
  const operations = [];
  const appendOperations = node => {
    node.children.forEach(appendOperations);
    if (targetNames.has(node.item.char)) return;
    const parent = node.parent;
    if (!parent) return;
    const price = Math.floor(balances[node.item.char] || 0);
    if (price <= 0 || (balances[parent.item.char] || 0) < GOLD_TRANSFER_DEPOSIT) return;
    const tax = getGoldTransferTax(price);
    const received = price - tax;
    balances[node.item.char] -= price;
    balances[parent.item.char] += received;
    operations.push({ buyer: node.item, seller: parent.item, price, tax, received });
  };
  targets.forEach(target => appendOperations(nodes.get(target.char)));
  if (operations.length !== characters.filter(item => !targetNames.has(item.char) && item.gold > 0).length) return null;

  const initialTotal = characters.reduce((sum, item) => sum + item.gold, 0);
  const finalTotal = Object.values(balances).reduce((sum, value) => sum + value, 0);
  const intermediates = [...nodes.values()].filter(node => !targetNames.has(node.item.char) && node.children.length).map(node => node.item);
  const plan = {
    targets,
    bridge: intermediates[0] || null,
    intermediates,
    characters,
    operations,
    listingCounts: getGoldTransferListingCounts(operations),
    balances,
    initialTotal,
    finalTotal,
    loss: initialTotal - finalTotal,
  };
  return isGoldTransferPlanWithinListingLimit(plan) ? plan : null;
}

function calculatePlanForTargets(targets, characters) {
  // 目标角色必须有押金，才能先上架并接收第一笔金币。
  if (targets.some(target => target.gold < GOLD_TRANSFER_DEPOSIT)) return null;
  const targetNames = new Set(targets.map(item => item.char));
  const lockedSources = characters.filter(source => {
    if (targetNames.has(source.char) || source.gold <= 0) return false;
    return targets.every(target => isSameGoldTransferAccount(target, source));
  });

  if (!lockedSources.length) {
    return buildGoldTransferPlan(targets, null, [], characters)
      || buildHierarchicalGoldTransferPlan(targets, characters);
  }

  if (lockedSources.length > GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER) {
    return buildHierarchicalGoldTransferPlan(targets, characters);
  }

  const lockedAccount = getGoldTransferAccountKey(lockedSources[0]);
  const lockedNames = new Set(lockedSources.map(item => item.char));
  const lockedNet = lockedSources.reduce((sum, item) => sum + item.gold - getGoldTransferTax(item.gold), 0);
  const bridge = characters.filter(item =>
    !targetNames.has(item.char) && !lockedNames.has(item.char)
    && getGoldTransferAccountKey(item) !== lockedAccount && item.gold >= GOLD_TRANSFER_DEPOSIT
  ).sort((left, right) => {
    const leftExtraTax = getGoldTransferTax(left.gold + lockedNet) - getGoldTransferTax(left.gold);
    const rightExtraTax = getGoldTransferTax(right.gold + lockedNet) - getGoldTransferTax(right.gold);
    return leftExtraTax - rightExtraTax || left.char.localeCompare(right.char, 'zh-CN');
  })[0];
  return (bridge ? buildGoldTransferPlan(targets, bridge, lockedSources, characters) : null)
    || buildHierarchicalGoldTransferPlan(targets, characters);
}

function createGoldTransferScoreContext(characters) {
  const accountGroups = new Map();
  let totalBaseLoss = 0;
  characters.forEach(item => {
    if (item.gold > 0) totalBaseLoss += getGoldTransferTax(item.gold);
    const accountKey = getGoldTransferAccountKey(item);
    if (!accountGroups.has(accountKey)) accountGroups.set(accountKey, []);
    accountGroups.get(accountKey).push(item);
  });
  return { totalBaseLoss, accountGroups };
}

function scoreGoldTransferTargets(targets, characters, scoreContext = createGoldTransferScoreContext(characters)) {
  if (targets.some(target => target.gold < GOLD_TRANSFER_DEPOSIT)) return null;
  const targetNames = new Set(targets.map(item => item.char));
  const baseLoss = scoreContext.totalBaseLoss - targets.reduce((sum, target) => sum + getGoldTransferTax(target.gold), 0);
  const targetAccount = getGoldTransferAccountKey(targets[0]);
  if (targets.some(target => getGoldTransferAccountKey(target) !== targetAccount)) return { loss: baseLoss, bridge: null };
  const lockedSources = (scoreContext.accountGroups.get(targetAccount) || [])
    .filter(source => !targetNames.has(source.char) && source.gold > 0);
  if (!lockedSources.length) return { loss: baseLoss, bridge: null };
  const lockedNames = new Set(lockedSources.map(item => item.char));
  const lockedAccount = getGoldTransferAccountKey(lockedSources[0]);
  const lockedNet = lockedSources.reduce((sum, item) => sum + item.gold - getGoldTransferTax(item.gold), 0);
  let best = null;
  characters.forEach(bridge => {
    if (targetNames.has(bridge.char) || lockedNames.has(bridge.char)
      || getGoldTransferAccountKey(bridge) === lockedAccount || bridge.gold < GOLD_TRANSFER_DEPOSIT) return;
    const loss = baseLoss - getGoldTransferTax(bridge.gold) + getGoldTransferTax(bridge.gold + lockedNet);
    if (!best || loss < best.loss || (loss === best.loss && bridge.char.localeCompare(best.bridge.char, 'zh-CN') < 0)) best = { loss, bridge };
  });
  return best;
}

function addRankedGoldTransferCandidate(ranked, targets, score, limit) {
  if (!score) return;
  const candidate = { targets, score };
  const compare = (left, right) => left.score.loss - right.score.loss
    || left.targets.map(item => item.char).join('|').localeCompare(right.targets.map(item => item.char).join('|'), 'zh-CN');
  if (ranked.length >= limit && compare(candidate, ranked[ranked.length - 1]) >= 0) return;
  ranked.push(candidate);
  ranked.sort(compare);
  if (ranked.length > limit) ranked.pop();
}

function getBestGoldTransferPlans() {
  const characters = getGoldTransferCharacters();
  const candidates = characters.filter(item => item.gold >= GOLD_TRANSFER_DEPOSIT);
  let oneTarget = null;
  let twoTargets = null;
  const rankedOneTargets = [];
  const rankedTwoTargets = [];
  const scoreContext = createGoldTransferScoreContext(characters);

  candidates.forEach(target => {
    addRankedGoldTransferCandidate(rankedOneTargets, [target], scoreGoldTransferTargets([target], characters, scoreContext), 1);
  });
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const left = candidates[i];
      const right = candidates[j];
      addRankedGoldTransferCandidate(rankedTwoTargets, [left, right], scoreGoldTransferTargets([left, right], characters, scoreContext), 1);
    }
  }
  rankedOneTargets.forEach(candidate => {
    oneTarget = compareGoldTransferPlans(oneTarget, calculatePlanForTargets(candidate.targets, characters));
  });
  rankedTwoTargets.forEach(candidate => {
    twoTargets = compareGoldTransferPlans(twoTargets, calculatePlanForTargets(candidate.targets, characters));
  });
  return { characters, oneTarget, twoTargets };
}

function renderGoldTransferPlanCard(plan, title, planKey) {
  if (!plan) {
    return `<section class="gold-transfer-result unavailable"><h4>${title}</h4><p>当前没有可行方案。每个角色最多上架 ${GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER} 件装备；作为收款卖方的目标角色必须先保留至少 ${formatGameGold(GOLD_TRANSFER_DEPOSIT)} 金币押金，且同账号转移需要可用的外部中转角色。</p></section>`;
  }
  const targets = plan.targets.map(target => `<b>${escapeGameHtml(target.char)}</b> <small>(${escapeGameHtml(target.account)})</small>`).join('、');
  const equipmentBySeller = new Map();
  plan.operations.forEach((step, index) => {
    const sellerKey = `${step.seller.account}\u0000${step.seller.char}`;
    if (!equipmentBySeller.has(sellerKey)) equipmentBySeller.set(sellerKey, { account: step.seller.account, char: step.seller.char, count: 0 });
    const summary = equipmentBySeller.get(sellerKey);
    summary.count++;
    step.equipmentNumber = index + 1;
  });
  const equipmentSummary = plan.operations.length
    ? `<div class="gold-transfer-equipment-summary"><b>需上架装备：共 ${plan.operations.length} 件</b>${[...equipmentBySeller.values()].map(summary => `<span>${escapeGameHtml(summary.char)}：${summary.count}/${GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER} 件 <small>（${escapeGameHtml(summary.account)}）</small></span>`).join('')}</div>`
    : '';
  const activePlanKey = lastGoldTransferPlans?.activePlanKey || '';
  const planLocked = !!activePlanKey && activePlanKey !== planKey;
  const equipmentRows = plan.operations.length
    ? `<div class="game-table-wrap"><table class="game-table gold-transfer-table"><thead><tr><th>装备</th><th>上架角色 / 账号 / UID</th><th>购买角色 / 账号</th><th>上架金币</th><th>税</th><th>卖方到账</th><th>操作</th></tr></thead><tbody>${plan.operations.map((step, index) => {
      const operationReady = isGoldTransferOperationReady(plan, index);
      const canExecute = !step.completed && !planLocked && operationReady;
      const buttonLabel = step.completed ? '✓ 已转移' : planLocked ? '另一方案已选' : operationReady ? '确认转移' : '等待前置转移';
      return `<tr class="${step.completed ? 'gold-transfer-completed' : ''}"><td>第 ${step.equipmentNumber} 件</td><td>${renderGoldTransferSeller(step.seller)}</td><td>${escapeGameHtml(step.buyer.char)}<br><small>${escapeGameHtml(step.buyer.account)}</small></td><td>${formatGameGold(step.price)}</td><td>${formatGameGold(step.tax)}</td><td>${formatGameGold(step.received)}</td><td><button class="game-btn game-btn-sm ${step.completed ? 'game-btn-green' : 'game-btn-blue'} gold-transfer-execute-btn" type="button" ${canExecute ? '' : 'disabled'} onclick="completeGoldTransferOperation('${planKey}',${index})">${buttonLabel}</button></td></tr>`;
    }).join('')}</tbody></table></div>`
    : '';
  const finalBalanceRows = plan.characters
    .filter(item => plan.balances[item.char] > 0)
    .sort((a, b) => plan.balances[b.char] - plan.balances[a.char])
    .map(item => `<tr class="gold-transfer-final-target"><td>${escapeGameHtml(item.char)}</td><td>${escapeGameHtml(item.account)}</td><td><b>${formatGameGold(plan.balances[item.char])}</b></td></tr>`).join('');
  const finalBalances = `<section class="gold-transfer-final-balances"><h5>最终剩余金币</h5><div class="game-table-wrap"><table class="game-table gold-transfer-table"><thead><tr><th>角色</th><th>账号</th><th>最终金币</th></tr></thead><tbody>${finalBalanceRows}</tbody></table></div></section>`;
  const steps = plan.operations.length
    ? `<ol class="gold-transfer-steps">${plan.operations.map((step, index) => `<li><span class="gold-transfer-route">${escapeGameHtml(step.buyer.char)} <small>(${escapeGameHtml(step.buyer.account)})</small> → ${escapeGameHtml(step.seller.char)} <small>(${escapeGameHtml(step.seller.account)})</small></span><span>卖方上架 <b>${formatGameGold(step.price)}</b>，买方购买；税 <em>${formatGameGold(step.tax)}</em>，卖方到账 <b>${formatGameGold(step.received)}</b></span></li>`).join('')}</ol>`
    : '<p class="gold-transfer-noop">金币已在目标角色中，无需交易。</p>';
  const bridgeNote = plan.intermediates?.length
    ? `<p class="gold-transfer-note">分层中转：${plan.intermediates.map(item => `<b>${escapeGameHtml(item.char)}</b>`).join('、')}。请严格按表格顺序操作，确保每个角色上架不超过 ${GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER} 件。</p>`
    : plan.bridge ? `<p class="gold-transfer-note">中转角色：<b>${escapeGameHtml(plan.bridge.char)}</b>。请先完成它接收同账号来源金币的步骤，再由它购买目标角色上架的合并订单。</p>` : '';
  const executionDetails = plan.operations.length
    ? `<details class="gold-transfer-details" data-plan-key="${planKey}" ${activePlanKey === planKey ? 'open' : ''}><summary>查看转换流程与装备上架明细</summary>${bridgeNote}${equipmentRows}${steps}</details>`
    : steps;
  const executionStatus = planLocked
    ? '<p class="gold-transfer-plan-status locked">已开始执行另一套方案，本方案操作已锁定。</p>'
    : plan.operations.some(step => step.completed)
      ? `<p class="gold-transfer-plan-status">已完成 ${plan.operations.filter(step => step.completed).length}/${plan.operations.length} 笔，剩余项目可单独确认转移。</p>`
      : '';
  return `<section class="gold-transfer-result ${planLocked ? 'locked' : ''}"><h4>${title}</h4><div class="gold-transfer-metrics"><span>汇总目标：${targets}</span><span>总税损：<b>${formatGameGold(plan.loss)}</b></span><span>汇总后总金币：<b>${formatGameGold(plan.finalTotal)}</b></span></div>${executionStatus}${finalBalances}${equipmentSummary}${executionDetails}</section>`;
}

function renderGoldTransferPlanner() {
  const wrap = document.getElementById('goldTransferPlan');
  if (!wrap) return;
  if (!lastGoldTransferPlans) {
    wrap.className = 'gold-transfer-placeholder';
    wrap.textContent = selectedGoldTransferTargetChars.size
      ? `已指定 ${selectedGoldTransferTargetChars.size} 名汇总目标；点击按钮后将只向这些角色汇总。目标和中转卖方须预留 ${formatGameGold(GOLD_TRANSFER_DEPOSIT)} 金币押金。`
      : `填写各角色当前金币后，点击按钮即可比较汇总到 1 名或 2 名角色的方案；也可先勾选多个指定目标。目标和中转卖方须预留 ${formatGameGold(GOLD_TRANSFER_DEPOSIT)} 金币押金。`;
    return;
  }
  wrap.className = 'gold-transfer-results';
  const { characters, oneTarget, twoTargets, customPlan, customTargets } = lastGoldTransferPlans;
  if (!characters.length) {
    wrap.innerHTML = '<div class="gold-transfer-placeholder">请先在设置中添加角色。</div>';
    return;
  }
  const resultHtml = customTargets
    ? renderGoldTransferPlanCard(customPlan, `指定目标方案：汇总到 ${customTargets.length} 名角色`, 'customPlan')
    : `${renderGoldTransferPlanCard(oneTarget, '方案 A：汇总到 1 名角色', 'oneTarget')}${renderGoldTransferPlanCard(twoTargets, '方案 B：保留 2 名角色', 'twoTargets')}`;
  wrap.innerHTML = `<p class="gold-transfer-rule">规则：每个角色最多上架 ${GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER} 件装备；AAA战1-16视为同一账号，AAA枪1-16视为同一账号，账号内不能交易；押金成交后返还，税按每笔成交额的 3% 向上取整。箭头表示“买方 → 卖方”。</p>${resultHtml}`;
}

function applyGoldTransferOperation(planKey, operationIndex) {
  const plans = lastGoldTransferPlans;
  const plan = plans?.[planKey];
  const step = plan?.operations?.[operationIndex];
  if (!plan || !step) return { ok: false, message: '找不到这笔转移，请重新计算方案' };
  if (!isGoldTransferPlanWithinListingLimit(plan)) return { ok: false, message: `当前方案存在角色上架超过 ${GOLD_TRANSFER_MAX_LISTINGS_PER_CHARACTER} 件，请重新计算方案` };
  if (step.completed) return { ok: false, message: '这笔金币已经转移，不能重复执行' };
  if (plans.activePlanKey && plans.activePlanKey !== planKey) return { ok: false, message: '已经开始执行另一套方案，请重新计算后再操作' };
  if (!isGoldTransferOperationReady(plan, operationIndex)) return { ok: false, message: '请先完成这笔转移所依赖的前置中转' };

  const buyerGold = Math.floor(getCharGold(step.buyer.char));
  if (buyerGold < step.price) return { ok: false, message: `${step.buyer.char}当前金币不足，请重新计算方案` };
  const sellerGold = Math.floor(getCharGold(step.seller.char));
  if (!DATA.characterGold || typeof DATA.characterGold !== 'object' || Array.isArray(DATA.characterGold)) DATA.characterGold = {};
  DATA.characterGold[step.buyer.char] = buyerGold - step.price;
  DATA.characterGold[step.seller.char] = sellerGold + step.received;
  step.completed = true;
  plans.activePlanKey = planKey;
  DATA.goldTransferExecution = plans;
  saveData(DATA);
  return { ok: true, message: `已转移：${step.buyer.char}扣除${formatGameGold(step.price)}，${step.seller.char}税后到账${formatGameGold(step.received)}` };
}

function completeGoldTransferOperation(planKey, operationIndex) {
  const result = applyGoldTransferOperation(planKey, operationIndex);
  if (result.ok) renderGameGoldPage();
  toast(result.message);
}

function calculateGoldTransferPlan() {
  const characters = getGoldTransferCharacters();
  const targetByName = new Map(characters.map(item => [item.char, item]));
  const customTargets = [...selectedGoldTransferTargetChars].map(charName => targetByName.get(charName)).filter(Boolean);
  lastGoldTransferPlans = customTargets.length
    ? { characters, customTargets, customPlan: calculatePlanForTargets(customTargets, characters) }
    : getBestGoldTransferPlans();
  DATA.goldTransferExecution = lastGoldTransferPlans;
  saveData(DATA);
  renderGoldTransferPlanner();
  if (customTargets.length && !lastGoldTransferPlans.customPlan) {
    toast('指定目标当前无法完成汇总：请确认目标押金与可用中转角色');
  } else if (!customTargets.length && !lastGoldTransferPlans.oneTarget && !lastGoldTransferPlans.twoTargets) {
    toast(`没有可行路径：至少需要一名持有 ${formatGameGold(GOLD_TRANSFER_DEPOSIT)} 金币的角色作为上架卖方`);
  }
}

// ==========================================
//  Toast 提示（共用）
// ==========================================
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 2000);
}

// ==========================================
//  渲染：总览页
// ==========================================
function renderDashboard() {
  const cfg = DATA.config || {};
  const today = getTodayStr();
  const allChars = getAllChars();
  const weekDays = getWeekDates();

  const globalTasks = cfg.globalTasks || [];
  const charTasks = getCharacterTasks();

  const globalDoneToday = globalTasks.filter(t => getGlobalTaskVal(today, t.id)).length;
  const globalTotalToday = globalTasks.length;

  let charDoneToday = 0;
  let charTotalToday = 0;
  allChars.forEach(ch => {
    charTasks.forEach(t => {
      if (!isTaskDueOnDate(t, today) || (isGroupedCharacterTask(t) && !isCharacterScheduledForDaily(ch.char, today))) return;
      charTotalToday++;
      const v = getTaskVal(today, ch.char, t.id);
      if (t.type === 'check' && v) charDoneToday++;
      else if (t.type === 'number' && v > 0) charDoneToday++;
    });
  });

  let weekDone = globalTasks.reduce((sum, task) => sum + Math.min(getWeekGlobalTaskSum(task.id), task.goal), 0);
  let weekTotal = globalTasks.reduce((sum, task) => sum + task.goal, 0);
  allChars.forEach(ch => {
    charTasks.forEach(t => {
      const taskWeekGoal = getCharacterTaskWeekGoal(ch.char, t, today);
      weekTotal += taskWeekGoal;
      weekDone += Math.min(getWeekTaskSum(ch.char, t, today), taskWeekGoal);
    });
  });

  document.getElementById('gameStatsCards').innerHTML = `
    <div class="game-stat-card green"><div class="val">${globalDoneToday + charDoneToday}/${globalTotalToday + charTotalToday}</div><div class="lbl">今日任务完成</div></div>
    <div class="game-stat-card blue"><div class="val">${Math.round(weekDone/weekTotal*100) || 0}%</div><div class="lbl">本周总完成率</div></div>
    <div class="game-stat-card red"><div class="val">${allChars.length}</div><div class="lbl">角色总数</div></div>
  `;

  let accHTML = '<table class="game-table"><thead><tr><th>全局任务</th>';
  globalTasks.forEach(t => { accHTML += `<th>${t.icon} ${t.name}</th>`; });
  accHTML += '<th>今天完成</th><th>本周</th></tr></thead><tbody><tr class="acc-row"><td><strong>全部账号共用</strong></td>';
  let globalDone = 0;
  globalTasks.forEach(t => {
    const val = getGlobalTaskVal(today, t.id);
    if (val) globalDone++;
    accHTML += `<td>${val ? '<span class="game-badge game-badge-done">✓</span>' : '<span class="game-badge game-badge-none">✗</span>'}</td>`;
  });
  const globalWeekDone = globalTasks.reduce((sum, t) => sum + Math.min(getWeekGlobalTaskSum(t.id), t.goal), 0);
  const globalWeekTotal = globalTasks.reduce((sum, t) => sum + t.goal, 0);
  accHTML += `<td>${globalDone}/${globalTasks.length}</td><td>${globalWeekTotal ? Math.round(globalWeekDone / globalWeekTotal * 100) : 0}%</td></tr>`;
  accHTML += '</tbody></table>';
  document.getElementById('accTaskTable').innerHTML = accHTML;

  document.getElementById('gameAccountSummary').innerHTML = (cfg.accounts || []).flatMap(acc =>
    (acc.chars || []).map(charName => {
      const uid = (acc.charUids || {})[charName] || '';
      const meta = getRosterMeta(charName);
      return `<div class="game-account-item"><div><strong><b class="roster-code">${escapeGameHtml(meta?.charCode || '')}</b>${escapeGameHtml(charName)}</strong><small>${escapeGameHtml(meta?.accountCode || '')} · ${escapeGameHtml(acc.name)} · ${escapeGameHtml(meta?.device || '')}</small></div>
        <code>${uid ? escapeGameHtml(uid) : '未填写 UID'}</code>
        <button class="game-btn game-btn-outline game-btn-sm" ${uid ? '' : 'disabled'} onclick="copyCharacterUid(decodeURIComponent('${encodeURIComponent(uid)}'))">复制</button></div>`;
    })
  ).join('');

  let charHTML = '<table class="game-table"><thead><tr><th>账号</th><th>角色</th>';
  charTasks.forEach(t => { charHTML += `<th>${t.icon} ${t.name}</th>`; });
  charHTML += '<th>今天</th><th>本周</th></tr></thead><tbody>';

  allChars.forEach(ch => {
    charHTML += `<tr><td>${ch.account}</td><td><strong>${ch.char}</strong></td>`;
    let todayDone = 0;
    let todayPlanned = 0;
    let weekDoneSum = 0;
    let weekGoalSum = 0;
    charTasks.forEach(t => {
      const v = getTaskVal(today, ch.char, t.id);
      const taskWeekGoal = getCharacterTaskWeekGoal(ch.char, t, today);
      const ws = Math.min(getWeekTaskSum(ch.char, t, today), taskWeekGoal);
      weekDoneSum += ws;
      weekGoalSum += taskWeekGoal;
      const dueToday = isTaskDueOnDate(t, today) && (!isGroupedCharacterTask(t) || isCharacterScheduledForDaily(ch.char, today));
      if (dueToday) todayPlanned++;
      if (t.type === 'check') {
        if (dueToday && v) todayDone++;
        charHTML += `<td>${dueToday ? (v ? '<span class="game-badge game-badge-done">✓</span>' : '<span class="game-badge game-badge-none">✗</span>') : '<span style="color:#94a3b8;">—</span>'}</td>`;
      } else {
        if (dueToday && v > 0) todayDone++;
        charHTML += `<td>${dueToday ? (v || 0) : '<span style="color:#94a3b8;">—</span>'}</td>`;
      }
    });
    charHTML += `<td>${todayDone}/${todayPlanned}</td>`;
    charHTML += `<td>${weekGoalSum ? Math.round(weekDoneSum / weekGoalSum * 100) : 0}%</td>`;
    charHTML += '</tr>';
  });
  charHTML += '</tbody></table>';
  document.getElementById('charTaskTable').innerHTML = charHTML;

}

// ==========================================
//  渲染：每日打卡页
// ==========================================
function renderDaily() {
  const cfg = DATA.config || {};
  const dateStr = viewingDate;
  const d = new Date(dateStr + 'T00:00:00');
  const dayNames = ['周日','周一','周二','周三','周四','周五','周六'];
  const isToday = dateStr === getTodayStr();

  document.getElementById('gameTodayLabel').innerHTML = `📅 ${dateStr} ${dayNames[d.getDay()]}`;
  document.getElementById('gameTodayBadge').innerHTML = isToday ? '<span style="background:#fefcbf;padding:4px 12px;border-radius:12px;font-weight:600;">今天</span>' : '';

  let accHTML = '<div class="game-global-task-grid">';
  (cfg.globalTasks || []).forEach(t => {
    const checked = getGlobalTaskVal(dateStr, t.id);
    accHTML += `<label class="game-global-task"><input type="checkbox" class="game-check" ${checked ? 'checked' : ''} onchange="toggleGlobalTask('${dateStr}','${t.id}',this.checked)"><span><strong>${t.icon} ${t.name}</strong><small>全局每天 1 次</small></span></label>`;
  });
  accHTML += '</div>';
  document.getElementById('dailyAccTasks').innerHTML = accHTML;

  document.getElementById('dailyCharTasks').innerHTML = renderDailyStatusBoard(dateStr);
}

function renderDailyStatusBoard(dateStr) {
  const dailyTasks = getCharacterTasks().filter(task => isGroupedCharacterTask(task) && isTaskDueOnDate(task, dateStr));
  const raids = getRaidDungeons();
  const goldFleeceRoute = getGoldFleeceRoute(dateStr);
  const allChars = getAllChars();
  const completed = allChars.filter(item => getUnifiedMemberCompletion(item.char, dateStr, dailyTasks, raids).complete).length;
  const executionDone = completed === allChars.length && allChars.length > 0;
  const raidProgress = raids.map(raid => `${raid.icon || '⚔️'} ${escapeGameHtml(raid.name)} ${allChars.filter(item => getRaidTaskVal(dateStr, item.char, raid.id) || getRaidCount(item.char, raid.id) >= raid.weeklyLimit).length}/${allChars.length}`).join(' · ');
  const executionCard = `<button class="daily-status-card raid ${executionDone ? 'complete' : 'pending'}" type="button" onclick="switchGamePage('daily-star')"><span>R1</span><strong>统一执行 ${completed}/${allChars.length}</strong><small>${dailyTasks.map(task => `${task.icon || '✓'} ${escapeGameHtml(task.name)}`).join(' · ') || '今日无分组日常'} · ${raidProgress}</small></button>`;
  const goldFleeceCard = goldFleeceRoute.length ? `<button class="daily-status-card ${goldFleeceRoute.every(item => item.done) ? 'complete' : 'pending'}" type="button" onclick="switchGamePage('daily-star')"><span>🐑</span><strong>金羊毛 ${goldFleeceRoute.filter(item => item.done).length}/${goldFleeceRoute.length}</strong><small>全角色单人1次 · 设备每台最多${getSchedulingConstraints().deviceAccountLimit}账号</small></button>` : '';
  const allDone = executionDone && (!goldFleeceRoute.length || goldFleeceRoute.every(item => item.done));
  return `<section class="daily-status-summary"><div><span>TODAY STATUS</span><h3>今日任务状态</h3><p>团本1编队同时执行日常和两个活动团本；金羊毛按单人路线完成。</p></div><strong>${allDone ? '今日任务全部完成' : '仍有任务未完成'}</strong></section><section class="daily-status-section"><div class="daily-status-heading"><div><span>ONE ROUTE</span><h4>统一执行状态</h4></div><button type="button" onclick="switchGamePage('daily-star')">打开固定团本</button></div><div class="daily-status-grid">${executionCard}${goldFleeceCard}</div></section>`;
}

function getDailyRotationIndex(dateStr = viewingDate, intervalDays = null, anchorDate = null) {
  const dayNumber = getIsoDayNumber(dateStr);
  const interval = intervalDays || getSchedulingConstraints().staminaCycleDays;
  const anchorDay = getIsoDayNumber(anchorDate || getSchedulingConstraints().dailyScheduleStartDate);
  return dayNumber === null || anchorDay === null ? 0 : ((dayNumber - anchorDay) % interval + interval) % interval;
}

function getLastDailyCompletionDate(charName, beforeDateStr = '9999-12-31') {
  const scheduleStartDate = getSchedulingConstraints().dailyScheduleStartDate;
  return Object.keys(DATA.dailyLog || {})
    .filter(dateStr => dateStr >= scheduleStartDate && dateStr <= beforeDateStr && getTaskVal(dateStr, charName, '体力'))
    .sort()
    .at(-1) || '';
}

function isCharacterBaseScheduledForDaily(charName, dateStr) {
  const constraints = getSchedulingConstraints();
  if (dateStr < constraints.dailyScheduleStartDate) return false;
  const planner = ensureDailyPlanner(DATA, dateStr);
  const datePhase = getDailyRotationIndex(dateStr, constraints.staminaCycleDays, constraints.dailyScheduleStartDate);
  const characterPhase = planner.phases[charName];
  if (!Number.isInteger(characterPhase)) return false;
  const relativePhase = (datePhase - characterPhase + constraints.staminaCycleDays) % constraints.staminaCycleDays;
  return constraints.staminaRunOffsets.includes(relativePhase);
}

function getMostRecentDailySlot(charName, dateStr) {
  const constraints = getSchedulingConstraints();
  for (let offset = 0; offset < constraints.staminaCycleDays; offset++) {
    const candidate = addIsoDays(dateStr, -offset);
    if (isCharacterBaseScheduledForDaily(charName, candidate)) return candidate;
  }
  return '';
}

function updateDailyPlannerCompletion() {
  ensureDailyPlanner(DATA);
}

function getDailyScheduledCharacters(dateStr = viewingDate) {
  return getAllChars().sort((left, right) => {
    const leftDone = Number(getTaskVal(dateStr, left.char, '体力'));
    const rightDone = Number(getTaskVal(dateStr, right.char, '体力'));
    return leftDone - rightDone || left.account.localeCompare(right.account, 'zh-CN') || left.char.localeCompare(right.char, 'zh-CN');
  });
}

function getDailyCharacterGroups(dateStr = viewingDate) {
  const scheduled = getDailyScheduledCharacters(dateStr);
  if (!scheduled.length) return [];
  const constraints = getSchedulingConstraints();
  const regionNames = constraints.dailyPartySameRegion ? ['region1', 'region2'] : ['all'];
  const groups = [];
  regionNames.forEach(region => {
    const regionCharacters = scheduled.filter(item => region === 'all' || getCharacterRegion(item.char) === region);
    const scheduledNames = new Set(regionCharacters.map(item => item.char));
    const accounts = (DATA.config?.accounts || []).map(account => ({
      account: account.name,
      chars: (account.chars || []).filter(char => scheduledNames.has(char)),
    })).filter(account => account.chars.length);
    const totalCharacters = accounts.reduce((sum, account) => sum + account.chars.length, 0);
    if (!totalCharacters) return;
    const maxSameAccount = constraints.dailyPartyDifferentAccounts ? Math.max(...accounts.map(account => account.chars.length)) : 1;
    const targetSizes = getPreferredDailyGroupSizes(totalCharacters, maxSameAccount);
    const regionGroups = targetSizes.map(targetSize => ({ targetSize, region, members: [] }));
    accounts.sort((a, b) => b.chars.length - a.chars.length || a.account.localeCompare(b.account, 'zh-CN'));
    accounts.forEach(account => {
      account.chars.forEach(char => {
        const target = regionGroups
          .map((group, index) => ({ group, index }))
          .filter(item => item.group.members.length < item.group.targetSize
            && (!constraints.dailyPartyDifferentAccounts || !item.group.members.some(member => member.account === account.account))
            && assignMembersToStoredDevices([...item.group.members, { account: account.account, char }]).length)
          .sort((a, b) => b.group.members.length - a.group.members.length || a.index - b.index)[0];
        if (target) target.group.members.push({ account: account.account, char });
      });
    });
    groups.push(...regionGroups);
  });
  // 设备白名单较紧时，贪心分组可能找不到可交换的最后位置；剩余角色改为独立日常队，不能静默遗漏。
  const assignedNames = new Set(groups.flatMap(group => group.members.map(member => member.char)));
  scheduled.filter(item => !assignedNames.has(item.char)).forEach(item => {
    groups.push({
      targetSize: 1,
      region: getCharacterRegion(item.char),
      members: [{ account: item.account, char: item.char }],
    });
  });
  let previousAssignments = [];
  return groups.filter(group => group.members.length).map((group, index) => {
    const members = assignMembersToStoredDevices(group.members, previousAssignments);
    previousAssignments = members;
    return { ...group, index, region: group.region === 'all' ? getCharacterRegion(members[0]?.char) : group.region, members };
  });
}

function getConfiguredDailyGroups() {
  return null;
}

function getDailyStarTasks(dateStr = viewingDate) {
  return getCharacterTasks().filter(task => isGroupedCharacterTask(task) && isTaskDueOnDate(task, dateStr));
}

function getGoldFleeceTask() {
  return getCharacterTasks().find(isGoldFleeceTask) || null;
}

function getGoldFleeceRoute(dateStr = viewingDate) {
  const task = getGoldFleeceTask();
  if (!task || !isTaskDueOnDate(task, dateStr)) return [];
  const storage = getDeviceAccountStoragePlan();
  return (DATA.config?.accounts || []).flatMap((account, accountIndex) => (account.chars || []).map((charName, charIndex) => ({
    ...getRosterSlot(accountIndex, charIndex),
    device: storage.byAccount[account.name]?.includes('电脑') ? '电脑' : storage.byAccount[account.name]?.includes('平板') ? '平板' : storage.byAccount[account.name]?.[0] || '未分配',
    done: !!getTaskVal(dateStr, charName, task.id),
  }))).filter(Boolean);
}

function toggleGoldFleeceCharacter(encodedCharName, dateStr = viewingDate) {
  const charName = decodeURIComponent(encodedCharName);
  const task = getGoldFleeceTask();
  if (!task || !isTaskDueOnDate(task, dateStr) || !getAllChars().some(item => item.char === charName)) return;
  const log = getDayLog(dateStr);
  if (!log.chars[charName]) log.chars[charName] = {};
  log.chars[charName][task.id] = !log.chars[charName][task.id];
  saveData(DATA);
  renderDashboard();
  renderDaily();
  renderDailyStarfield();
}

function renderGoldFleeceRoute(dateStr = viewingDate) {
  const route = getGoldFleeceRoute(dateStr);
  if (!route.length) return '';
  const completed = route.filter(item => item.done).length;
  const cards = route.map((item, index) => {
    const previous = route[index - 1];
    const switching = previous && previous.account !== item.account;
    const encoded = encodeURIComponent(item.char);
    const deviceSwitching = previous && previous.device !== item.device;
    return `<button class="gold-fleece-character ${item.done ? 'complete' : ''}" type="button" onclick="toggleGoldFleeceCharacter('${encoded}','${dateStr}')"><span>${escapeGameHtml(item.charCode)}</span><div><strong>${escapeGameHtml(item.char)}</strong><small>${escapeGameHtml(item.accountCode)} · ${escapeGameHtml(item.account)}</small></div><em>${item.done ? '✓ 今日已完成1次' : deviceSwitching ? `转到${escapeGameHtml(item.device)} · 登录${escapeGameHtml(item.account)}` : switching ? `${escapeGameHtml(item.device)}切换账号 → ${escapeGameHtml(item.account)}` : index ? `${escapeGameHtml(item.device)}保持账号 · 切换角色` : `${escapeGameHtml(item.device)}首次登录`}</em></button>`;
  }).join('');
  const deviceSummary = DAILY_GROUP_DEVICES.map(device => `${device}${new Set(route.filter(item => item.device === device).map(item => item.account)).size}号`).filter(label => !label.endsWith('0号')).join(' · ');
  return `<section class="gold-fleece-route"><div class="constellation-plan-heading"><div><span>SOLO DEVICE ROUTE</span><h3>🐑 金羊毛 · 全角色单人路线</h3><p>仅周一、三、五、六、日；每角色当天1次。账号按设备容量连续排列，每台最多${getSchedulingConstraints().deviceAccountLimit}个账号。</p></div><strong>${completed}/${route.length} 完成 · ${escapeGameHtml(deviceSummary)}</strong></div><div class="gold-fleece-list">${cards}</div></section>`;
}

function getDailyMemberCompletion(charName, dateStr = viewingDate) {
  const tasks = getDailyStarTasks(dateStr);
  const done = tasks.filter(task => getTaskVal(dateStr, charName, task.id)).length;
  return { done, total: tasks.length, complete: tasks.length > 0 && done === tasks.length };
}

function toggleDailyStarCharacter(encodedCharName) {
  const charName = decodeURIComponent(encodedCharName);
  const tasks = getDailyStarTasks();
  if (!tasks.length) { toast('当天没有需要完成的分组任务'); return; }
  const completion = getDailyMemberCompletion(charName);
  const log = getDayLog(viewingDate);
  if (!log.chars[charName]) log.chars[charName] = {};
  tasks.forEach(task => { log.chars[charName][task.id] = !completion.complete; });
  updateDailyPlannerCompletion(charName, viewingDate, !completion.complete);
  saveData(DATA);
  renderDashboard();
  renderDaily();
  renderDailyStarfield();
}

function getUnifiedExecutionRaids() {
  const raids = getRaidDungeons();
  if (raids[0]) raidPlannerRaidId = raids[0].id;
  return raids;
}

function getUnifiedMemberCompletion(charName, dateStr, tasks, raids) {
  const dailyDone = tasks.every(task => getTaskVal(dateStr, charName, task.id));
  const raidStates = raids.map(raid => {
    const unlimited = getCharacterRoleTier(charName) === 'large';
    const checked = getRaidTaskVal(dateStr, charName, raid.id);
    const cycleCount = getRaidCycleCount(charName, raid.id, dateStr);
    const capped = !unlimited && !checked && cycleCount >= raid.weeklyLimit;
    return { raid, checked, capped, unlimited, cycleCount, done: unlimited || checked || capped };
  });
  return { dailyDone, raidStates, complete: dailyDone && raidStates.every(state => state.done) };
}

function renderUnifiedExecutionMember(member, dateStr, tasks, raids, scope = 'all') {
  const meta = getRosterMeta(member.char) || member;
  const completion = getUnifiedMemberCompletion(member.char, dateStr, tasks, raids);
  const encodedChar = encodeURIComponent(member.char);
  const dailyLabel = tasks.length ? `${tasks.map(task => task.icon || '✓').join('')} 日常${completion.dailyDone ? ' ✓' : '待完成'}` : '今日无日常';
  const dailyStatus = tasks.length ? `<span>${dailyLabel}</span>` : '';
  return `<article class="unified-execution-member ${completion.complete ? 'complete' : ''}"><div class="unified-member-main"><span>${escapeGameHtml(member.device || meta.device || '未分配')}</span><div><strong>${escapeGameHtml(meta.charCode || '')} · ${escapeGameHtml(member.char)}</strong><small>${escapeGameHtml(meta.accountCode || '')} · ${escapeGameHtml(member.account || meta.account || '')}</small></div></div><div class="unified-member-status">${dailyStatus}${completion.raidStates.map(state => state.unlimited
    ? `<span class="done">${state.raid.icon || '⚔️'} ${escapeGameHtml(state.raid.name)} · 带队不限</span>`
    : `<label class="raid-progress-editor ${state.done ? 'done' : ''}" title="自动累计；数字不对时可直接填写修正"><span>${state.raid.icon || '⚔️'} ${escapeGameHtml(state.raid.name)} ·</span><input type="number" inputmode="numeric" min="0" max="${state.raid.weeklyLimit}" step="1" value="${state.cycleCount}" aria-label="${escapeGameAttr(member.char)} ${escapeGameAttr(state.raid.name)}当前次数" onclick="event.stopPropagation();this.select()" onchange="setRaidCycleCount('${encodedChar}','${encodeURIComponent(state.raid.id)}',this.value,'${dateStr}')"><b>/${state.raid.weeklyLimit}${state.checked ? ' ✓' : ''}</b><small>自动</small></label>`).join('')}</div><label class="unified-member-anti"><span>抗魔</span><input type="number" min="0" step="1" value="${getCharacterAntiMagic(member.char)}" data-anti-magic-character="${escapeGameAttr(member.char)}" oninput="syncCharacterAntiMagicInputs(decodeURIComponent('${encodedChar}'),this.value,this)" onchange="setCharacterAntiMagic(decodeURIComponent('${encodedChar}'),this.value)" aria-label="${escapeGameAttr(member.char)}抗魔值"><small>永久保存</small></label><button class="unified-member-complete" type="button" ${completion.complete ? 'disabled' : ''} onclick="completeUnifiedExecutionCharacter('${dateStr}','${encodedChar}','${scope}')">${completion.complete ? '✓ 已完成' : '单独完成'}</button></article>`;
}

function toggleExecutionSection(encodedKey, button) {
  const key = decodeURIComponent(encodedKey);
  const section = button?.closest('.execution-route-section');
  if (!section) return;
  const collapsed = section.classList.toggle('collapsed');
  if (collapsed) collapsedExecutionSections.add(key);
  else collapsedExecutionSections.delete(key);
  button.textContent = collapsed ? '展开' : '收起';
  button.setAttribute('aria-expanded', String(!collapsed));
}

function toggleExecutionCard(encodedKey, button) {
  const key = decodeURIComponent(encodedKey);
  const card = button?.closest('.unified-execution-card');
  if (!card) return;
  const collapsed = card.classList.toggle('collapsed');
  if (collapsed) collapsedExecutionCards.add(key);
  else collapsedExecutionCards.delete(key);
  button.textContent = collapsed ? '展开' : '收起';
  button.setAttribute('aria-expanded', String(!collapsed));
}

function renderUnifiedExecutionCard(squad, index, dateStr, tasks, raids, label = '', scope = 'all') {
  const members = (squad.deviceAssignments?.length ? squad.deviceAssignments : squad.members.map(name => getRosterMeta(name)).filter(Boolean));
  const allDone = squad.members.every(name => getUnifiedMemberCompletion(name, dateStr, tasks, raids).complete);
  const encodedMembers = encodeURIComponent(JSON.stringify(squad.members));
  const encodedLeader = encodeURIComponent(squad.leader || '');
  const difficultyTwo = scope === 'raid' && squad.members.length > 1 && squad.members.every(name => getCharacterAntiMagic(name) >= 1400);
  const isDaily = scope === 'daily';
  const prefix = isDaily ? 'D' : 'R';
  const title = squad.members.length > 1 ? `${isDaily ? '日常' : '团本'}编队 ${prefix}${index + 1}` : `${isDaily ? '日常' : '团本'}单人处理`;
  const description = isDaily
    ? `${getCharacterRegionLabel(squad.members[0])} · 同账号不可同队 · 不区分大号小号`
    : `${raids.map(raid => escapeGameHtml(raid.name)).join(' + ')} · 本轮小号5次，大号带队不限`;
  const actionLabel = isDaily ? '一键完成本队日常' : `一键完成 ${raids.map(raid => escapeGameHtml(raid.name)).join(' + ')}`;
  const collapseKey = `${dateStr}|${scope}|${squad.id || label || index}`;
  const collapsed = collapsedExecutionCards.has(collapseKey);
  return `<section class="unified-execution-card ${allDone ? 'complete' : ''} ${difficultyTwo ? 'difficulty-two' : ''} ${collapsed ? 'collapsed' : ''}" data-execution-scope="${scope}"><header><div><span>${escapeGameHtml(label || squad.id || `${prefix}${index + 1}`)}</span><div><strong>${title}${allDone ? ' · ✓ 已完成' : ''}</strong><small>${description}</small></div></div><div class="unified-card-meta">${difficultyTwo ? '<em class="difficulty-two-badge">全队抗魔≥1400 · 推荐打2难度</em>' : ''}<button class="execution-collapse-btn" type="button" aria-expanded="${!collapsed}" onclick="event.stopPropagation();toggleExecutionCard('${encodeURIComponent(collapseKey)}',this)">${collapsed ? '展开' : '收起'}</button></div></header><div class="unified-execution-members">${members.map(member => renderUnifiedExecutionMember(member, dateStr, tasks, raids, scope)).join('')}</div><button class="game-btn ${allDone ? 'game-btn-green' : 'game-btn-blue'} unified-complete-btn" type="button" ${allDone ? 'disabled' : ''} onclick="completeUnifiedExecutionSquad('${dateStr}','${encodedMembers}','${encodedLeader}',${index},'${scope}')">${allDone ? '✓ 本队已完成' : actionLabel}</button></section>`;
}

function renderDailyExecutionPlan(dateStr) {
  const tasks = getDailyStarTasks(dateStr);
  const groups = getDailyCharacterGroups(dateStr);
  const scheduled = getDailyScheduledCharacters(dateStr);
  const assigned = new Set(groups.flatMap(group => group.members.map(member => member.char)));
  const missing = scheduled.filter(item => !assigned.has(item.char));
  const invalidRegionGroups = groups.filter(group => new Set(group.members.map(member => getCharacterRegion(member.char))).size > 1);
  const invalidAccountGroups = groups.filter(group => new Set(group.members.map(member => member.account)).size !== group.members.length);
  if (missing.length || invalidRegionGroups.length || invalidAccountGroups.length) {
    return `<section class="execution-route-section"><div class="formation-execution-blocked"><strong>日常编队不能执行</strong><span>${missing.length ? `未安排：${escapeGameHtml(missing.map(item => item.char).join('、'))}` : ''}${invalidRegionGroups.length ? '；存在跨大区队伍' : ''}${invalidAccountGroups.length ? '；存在同账号队伍' : ''}</span><small>请检查角色的大区标注与设备账号容量。</small></div></section>`;
  }
  const cards = groups.map((group, index) => renderUnifiedExecutionCard({
    id: `D${index + 1}`,
    leader: '',
    members: group.members.map(member => member.char),
    deviceAssignments: group.members,
  }, index, dateStr, tasks, [], '', 'daily')).join('');
  const completed = scheduled.filter(item => tasks.every(task => getTaskVal(dateStr, item.char, task.id))).length;
  const regionSummary = ['region1', 'region2'].map(region => {
    const count = scheduled.filter(item => getCharacterRegion(item.char) === region).length;
    return `${region === 'region1' ? '1大区' : '2大区'} ${count}人`;
  }).join(' · ');
  return `<section class="execution-route-section"><div class="unified-route-summary daily-route-summary"><div><span>DAILY FORMATION</span><strong>日常全部角色 · ${groups.length}队</strong><small>${regionSummary} · 每队最多 ${getSchedulingConstraints().dailyPartySize} 人 · 等级不参与日常编队</small></div><b>${completed}/${scheduled.length} 全部角色完成</b></div>${groups.length ? `<div class="unified-execution-list">${cards}</div>` : '<div class="raid-auto-empty">当前没有角色</div>'}</section>`;
}

function renderRaidExecutionPlan(dateStr) {
  const raids = getUnifiedExecutionRaids();
  const plan = buildAutomaticRaidPlan({ includeCompleted: true, dateStr, forceMode: 'single' });
  if (plan.error) return `<div class="raid-auto-empty">${escapeGameHtml(plan.error)}</div>`;
  const schedules = raids.map(raid => getRaidDailySchedule(raid, dateStr, plan));
  const scheduleMaps = schedules.map(schedule => new Map(schedule.units.map(unit => [unit.key, unit])));
  const rows = plan.squads.map((squad, index) => ({ key: squad.id || `R${index + 1}`, index, squad }));
  (plan.standalone || []).forEach((charName, index) => {
    const meta = getRosterMeta(charName);
    if (meta) rows.push({ key: `S${index + 1}`, index: plan.squads.length + index, squad: { id: `S${index + 1}`, leader: '', members: [charName], deviceAssignments: [{ ...meta, device: meta.device }] } });
  });
  const refreshLabel = schedule => schedule.window.refreshWeekday === 1 ? '周一' : schedule.window.refreshWeekday === 3 ? '周三' : `周${schedule.window.refreshWeekday}`;
  const renderButton = (raid, raidIndex, row) => {
    const scheduled = scheduleMaps[raidIndex].has(row.key);
    const done = row.squad.members.every(charName => {
      const large = getCharacterRoleTier(charName) === 'large';
      const checked = getRaidTaskVal(dateStr, charName, raid.id);
      const capped = !large && !checked && getRaidCycleCount(charName, raid.id, dateStr) >= raid.weeklyLimit;
      return large || checked || capped;
    });
    const scope = `raid:${raid.id}`;
    const encodedMembers = encodeURIComponent(JSON.stringify(row.squad.members));
    const encodedLeader = encodeURIComponent(row.squad.leader || '');
    const label = done ? `✓ ${escapeGameHtml(raid.name)}已完成` : scheduled ? `完成${escapeGameHtml(raid.name)}` : `补完成${escapeGameHtml(raid.name)}`;
    return `<button class="raid-table-action ${done ? 'complete' : ''} ${!scheduled && !done ? 'unscheduled' : ''}" type="button" ${done ? 'disabled' : ''} title="${scheduled ? `完成${escapeGameAttr(raid.name)}` : `今日未安排，可手动补记${escapeGameAttr(raid.name)}`}" onclick="completeUnifiedExecutionSquad('${dateStr}','${encodedMembers}','${encodedLeader}',${row.index},'${scope}','${escapeGameAttr(row.key)}')">${label}</button>`;
  };
  const tableRows = rows.map(row => {
    const memberHtml = row.squad.deviceAssignments.map(member => `<span class="raid-table-member"><b>${escapeGameHtml(member.device || '')}</b>${escapeGameHtml(member.char)}</span>`).join('');
    const antiMagic = row.squad.members.map(charName => `<label class="raid-table-anti"><span>${escapeGameHtml(getRosterMeta(charName)?.charCode || charName)}</span><input type="number" min="0" step="1" value="${getCharacterAntiMagic(charName)}" aria-label="${escapeGameAttr(charName)}抗魔值" oninput="syncCharacterAntiMagicInputs(decodeURIComponent('${encodeURIComponent(charName)}'),this.value,this)" onchange="setCharacterAntiMagic(decodeURIComponent('${encodeURIComponent(charName)}'),this.value)"></label>`).join('');
    const tabletTransfer = row.squad.members.length > 1
      ? renderRaidTabletGoldTransfer(row.key)
      : '<span class="raid-gold-transfer-unavailable">单刷无需转移</span>';
    return `<tr><th scope="row"><strong>${escapeGameHtml(row.key)}</strong><small>${row.squad.members.length === 1 ? '单刷' : `${row.squad.members.length}人队`}</small></th><td><div class="raid-table-members">${memberHtml}</div></td><td><div class="raid-table-anti-list">${antiMagic}</div></td>${raids.map((raid, index) => `<td>${renderButton(raid, index, row)}</td>`).join('')}<td>${tabletTransfer}</td></tr>`;
  }).join('');
  const headers = raids.map((raid, index) => `<th><div class="raid-table-raid-head"><span>${raid.icon || '⚔️'} 团本${index + 1} · ${escapeGameHtml(raid.name)}</span><small>${refreshLabel(schedules[index])}轮换 · 今日安排 ${schedules[index].units.length} 项 · ${schedules[index].completedCharacters}/${schedules[index].targetCharacters} 小号满5次</small></div></th>`).join('');
  const notes = schedules.map((schedule, index) => `<span>${raids[index].icon || '⚔️'} ${escapeGameHtml(raids[index].name)}：本轮 ${schedule.window.startDate} 至 ${schedule.window.endDate} · 剩余 ${schedule.window.daysRemaining} 天</span>`).join('');
  return `<section class="execution-route-section raid-table-section"><div class="unified-route-summary raid-route-summary"><div><span>FIXED RAID TABLE</span><strong>每日团本安排 · R1-R${plan.squads.length}</strong><small>固定队伍统一展示；每个队伍分别完成两个当前团本${plan.standalone.length ? ` · 另含 ${plan.standalone.length} 个单刷` : ''}</small></div><div class="unified-route-actions"><b>${rows.length} 行 · 两个完成入口</b></div></div><div class="raid-cycle-note"><span>按剩余次数动态均摊，未安排队伍可点击手动补记</span>${notes}</div><div class="raid-table-scroll"><table class="raid-execution-table"><thead><tr><th>队伍</th><th>成员</th><th>抗魔</th>${headers}<th><div class="raid-table-transfer-head"><span>金币转移</span><small>手机1 + 手机2 → 平板 · 到账 97.3%</small></div></th></tr></thead><tbody>${tableRows}</tbody></table></div></section>`;
}

function getRaidTabletGoldTransfer(teamKey) {
  if (!DATA.raidTabletGoldTransfers || typeof DATA.raidTabletGoldTransfers !== 'object' || Array.isArray(DATA.raidTabletGoldTransfers)) DATA.raidTabletGoldTransfers = {};
  const stored = DATA.raidTabletGoldTransfers[teamKey];
  const transfer = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  transfer.tabletId = String(transfer.tabletId || '').trim();
  transfer.tabletGold = Math.max(0, Math.floor(Number(transfer.tabletGold) || 0));
  transfer.phone1Gold = Math.max(0, Math.floor(Number(transfer.phone1Gold) || 0));
  transfer.phone2Gold = Math.max(0, Math.floor(Number(transfer.phone2Gold) || 0));
  DATA.raidTabletGoldTransfers[teamKey] = transfer;
  return transfer;
}

function getRaidTabletGoldTransferEstimate(teamKey) {
  const transfer = getRaidTabletGoldTransfer(teamKey);
  const sourceTotal = transfer.phone1Gold + transfer.phone2Gold;
  const received = Math.floor(sourceTotal * RAID_TABLET_GOLD_TRANSFER_PER_MILLE / 1000);
  return { sourceTotal, received, loss: sourceTotal - received };
}

function setRaidTabletGoldTransferField(teamKey, field, value, sourceInput = null) {
  const transfer = getRaidTabletGoldTransfer(teamKey);
  if (field === 'tabletId') transfer.tabletId = String(value || '').trim();
  else if (['tabletGold', 'phone1Gold', 'phone2Gold'].includes(field)) transfer[field] = Math.max(0, Math.floor(Number(value) || 0));
  else return;
  syncRaidTabletGoldTransferControl(teamKey, sourceInput);
  queueGameDataSave();
}

function syncRaidTabletGoldTransferControl(teamKey, sourceInput = null) {
  if (typeof document === 'undefined') return;
  const root = sourceInput?.closest?.('.raid-gold-transfer') || [...document.querySelectorAll('.raid-gold-transfer')].find(item => item.dataset.teamKey === teamKey);
  if (!root) return;
  const transfer = getRaidTabletGoldTransfer(teamKey);
  const estimate = getRaidTabletGoldTransferEstimate(teamKey);
  const preview = root.querySelector('.raid-gold-transfer-preview');
  const button = root.querySelector('.raid-gold-transfer-btn');
  if (preview) preview.textContent = `预计到账 ${formatGameGold(estimate.received)} · 损耗 ${formatGameGold(estimate.loss)}`;
  if (button) button.disabled = !transfer.tabletId || estimate.sourceTotal <= 0;
}

function applyRaidTabletGoldTransfer(teamKey, sourceButton = null) {
  const transfer = getRaidTabletGoldTransfer(teamKey);
  const estimate = getRaidTabletGoldTransferEstimate(teamKey);
  if (!transfer.tabletId) return { ok: false, message: '请先填写平板 ID' };
  if (estimate.sourceTotal <= 0) return { ok: false, message: '请先填写手机1或手机2的金币' };
  transfer.tabletGold += estimate.received;
  transfer.phone1Gold = 0;
  transfer.phone2Gold = 0;
  saveData(DATA);
  if (typeof document !== 'undefined') {
    const root = sourceButton?.closest?.('.raid-gold-transfer');
    if (root) {
      const tabletInput = root.querySelector('[data-raid-gold-field="tabletGold"]');
      const phone1Input = root.querySelector('[data-raid-gold-field="phone1Gold"]');
      const phone2Input = root.querySelector('[data-raid-gold-field="phone2Gold"]');
      if (tabletInput) tabletInput.value = transfer.tabletGold;
      if (phone1Input) phone1Input.value = 0;
      if (phone2Input) phone2Input.value = 0;
      syncRaidTabletGoldTransferControl(teamKey, sourceButton);
    }
    toast(`${teamKey} 已转入平板 ${formatGameGold(estimate.received)} 金币，损耗 ${formatGameGold(estimate.loss)}`);
  }
  return { ok: true, ...estimate, tabletGold: transfer.tabletGold };
}

function renderRaidTabletGoldTransfer(teamKey) {
  const transfer = getRaidTabletGoldTransfer(teamKey);
  const estimate = getRaidTabletGoldTransferEstimate(teamKey);
  const encodedKey = encodeURIComponent(teamKey);
  const renderGoldInput = (field, label, value) => `<label><span>${label}</span><input type="number" min="0" step="1" inputmode="numeric" value="${value}" data-raid-gold-field="${field}" aria-label="${escapeGameAttr(teamKey)} ${label}金币" oninput="setRaidTabletGoldTransferField(decodeURIComponent('${encodedKey}'),'${field}',this.value,this)"></label>`;
  return `<div class="raid-gold-transfer" data-team-key="${escapeGameAttr(teamKey)}"><label class="raid-gold-tablet-id"><span>平板 ID</span><input type="text" value="${escapeGameAttr(transfer.tabletId)}" placeholder="填写平板 ID" autocomplete="off" aria-label="${escapeGameAttr(teamKey)} 平板 ID" oninput="setRaidTabletGoldTransferField(decodeURIComponent('${encodedKey}'),'tabletId',this.value,this)"></label><div class="raid-gold-balance-grid">${renderGoldInput('tabletGold', '平板', transfer.tabletGold)}${renderGoldInput('phone1Gold', '手机1', transfer.phone1Gold)}${renderGoldInput('phone2Gold', '手机2', transfer.phone2Gold)}</div><div class="raid-gold-transfer-action"><small class="raid-gold-transfer-preview">预计到账 ${formatGameGold(estimate.received)} · 损耗 ${formatGameGold(estimate.loss)}</small><button class="raid-gold-transfer-btn" type="button" ${!transfer.tabletId || estimate.sourceTotal <= 0 ? 'disabled' : ''} onclick="applyRaidTabletGoldTransfer(decodeURIComponent('${encodedKey}'),this)">转入平板</button></div></div>`;
}

function renderUnifiedExecutionPlan(dateStr) {
  return renderRaidExecutionPlan(dateStr);
}

function completeUnifiedExecutionSquad(dateStr, encodedMembers, encodedLeader, groupIndex, scope = 'all', customLabel = '') {
  const members = JSON.parse(decodeURIComponent(encodedMembers));
  const leader = decodeURIComponent(encodedLeader || '');
  const raidScopeId = scope.startsWith('raid:') ? scope.slice(5) : '';
  const isRaidScope = scope === 'raid' || !!raidScopeId;
  const tasks = isRaidScope ? [] : getDailyStarTasks(dateStr);
  const raids = scope === 'daily' ? [] : getUnifiedExecutionRaids().filter(raid => !raidScopeId || raid.id === raidScopeId);
  const log = getDayLog(dateStr);
  let dailyChanged = 0;
  let raidChanged = 0;
  const capped = [];
  members.forEach(charName => {
    if (!log.chars[charName]) log.chars[charName] = {};
    tasks.forEach(task => {
      if (!log.chars[charName][task.id]) {
        log.chars[charName][task.id] = true;
        dailyChanged++;
      }
    });
    if (tasks.some(task => task.id === '体力')) updateDailyPlannerCompletion(charName, dateStr, true);
  });
  raids.forEach(raid => {
    let changedForRaid = 0;
    members.forEach(charName => {
      if (getCharacterRoleTier(charName) === 'large') return;
      const progress = getRaidProgress(charName);
      if (!progress.checkins[dateStr] || typeof progress.checkins[dateStr] !== 'object') progress.checkins[dateStr] = {};
      if (progress.checkins[dateStr][raid.id]) return;
      const cycleUsed = getRaidCycleCount(charName, raid.id, dateStr);
      if (cycleUsed >= raid.weeklyLimit) {
        capped.push(`${charName}·${raid.name}`);
        return;
      }
      progress.checkins[dateStr][raid.id] = true;
      progress.counts[raid.id] = getRaidCount(charName, raid.id) + 1;
      raidChanged++;
      changedForRaid++;
    });
    if (leader && changedForRaid) {
      const planner = getRaidPlanner();
      if (!planner.leaderDailyRuns[dateStr]) planner.leaderDailyRuns[dateStr] = {};
      if (!planner.leaderDailyRuns[dateStr][raid.id]) planner.leaderDailyRuns[dateStr][raid.id] = {};
      planner.leaderRuns[leader] = getRaidLeaderRuns(leader) + 1;
      planner.leaderDailyRuns[dateStr][raid.id][leader] = getRaidLeaderDailyRuns(leader, raid.id, dateStr) + 1;
    }
  });
  if (!dailyChanged && !raidChanged) {
    toast(capped.length ? '本队团本已达到本周次数上限' : '本队已经全部完成');
    return;
  }
  saveData(DATA);
  renderDailyStarfield();
  const groupLabel = customLabel || `${scope === 'daily' ? 'D' : 'R'}${groupIndex + 1}`;
  toast(`${groupLabel} 已完成：日常 ${dailyChanged} 项，团本 ${raidChanged} 项${capped.length ? `；${capped.length} 项本周已满` : ''}`);
}

function completeUnifiedExecutionCharacter(dateStr, encodedCharName, scope = 'all') {
  const charName = decodeURIComponent(encodedCharName);
  if (!getAllChars().some(item => item.char === charName)) return;
  completeUnifiedExecutionSquad(dateStr, encodeURIComponent(JSON.stringify([charName])), '', -1, scope, charName);
}

function renderDailyStarfield() {
  const wrap = document.getElementById('dailyStarfieldContent');
  if (!wrap) return;
  const dateLabel = document.getElementById('dailyStarDate');
  if (dateLabel) dateLabel.textContent = viewingDate;
  const raids = getUnifiedExecutionRaids();
  const modeControls = '<div class="raid-execution-mode" aria-label="团本安排模式"><button type="button" class="active" disabled>动态补齐 · 固定队</button></div>';
  
  let executionHtml = '';
  try { executionHtml = renderUnifiedExecutionPlan(viewingDate); } catch(e) { executionHtml = '<div class="raid-auto-empty">编队加载失败，请恢复自动编队</div>'; }
  
  wrap.innerHTML = `<section class="daily-star-command"><div><span>STAGGERED RAID ROUTE</span><strong>${raids.map((raid, index) => `团本${index + 1} ${raid.icon || '⚔️'} ${escapeGameHtml(raid.name)}`).join(' · ')}</strong></div>${modeControls}<em>周一、周三依次轮换 · 各自7天完成5次</em></section>${executionHtml}`;
}

function toggleRosterManager(force) {
  const panel = document.getElementById('coreRosterManager');
  if (!panel) return;
  const show = typeof force === 'boolean' ? force : panel.hidden;
  panel.hidden = !show;
  if (show) renderCoreRosterManager();
  else {
    invalidateRosterCaches();
    renderDailyStarfield();
  }
}

function renderCoreRosterManager() {
  const wrap = document.getElementById('coreRosterManagerContent');
  if (!wrap) return;
  const accounts = DATA.config?.accounts || [];
  const mergeGroups = ensureAccountMergeGroups(DATA.config);
  const mergeHtml = `<section class="account-merge-panel"><div class="account-merge-head"><div><strong>大账号合并显示</strong><small>例如把“159冰谷”和“159静谧”归到同一个大账号；仅影响本管理页显示，不改变团本编队。</small></div><button class="game-btn game-btn-blue game-btn-sm" type="button" onclick="addAccountMergeGroup()">＋ 新增大账号</button></div>${mergeGroups.length ? `<div class="account-merge-list">${mergeGroups.map((group, groupIndex) => `<article class="account-merge-card"><header><label><span>名称</span><input value="${escapeGameAttr(group.name)}" onchange="updateAccountMergeGroup(${groupIndex},'name',this.value)"></label><label><span>ID</span><input value="${escapeGameAttr(group.accountId)}" placeholder="填写大账号 ID" onchange="updateAccountMergeGroup(${groupIndex},'accountId',this.value)"></label><label><span>备注</span><input value="${escapeGameAttr(group.accountNote)}" placeholder="填写备注" onchange="updateAccountMergeGroup(${groupIndex},'accountNote',this.value)"></label><button class="core-account-delete" type="button" onclick="removeAccountMergeGroup(${groupIndex})">删除合并组</button></header><div class="account-merge-members">${accounts.map(account => `<label><input type="checkbox" ${group.accountNames.includes(account.name) ? 'checked' : ''} onchange="toggleAccountMergeMember(${groupIndex},decodeURIComponent('${encodeURIComponent(account.name)}'),this.checked)"><span>${escapeGameHtml(account.name)} <small>${(account.chars || []).length}个角色</small></span></label>`).join('')}</div></article>`).join('')}</div>` : '<p class="account-merge-empty">还没有合并组。点击“新增大账号”，再勾选属于同一个大账号的多个区服账号。</p>'}</section>`;
  wrap.innerHTML = `<div class="core-roster-summary"><strong>${accounts.length} 个账号 · ${getAllChars().length} 个角色</strong><span>等级仅约束团本；大区仅约束日常，合并显示只在账号管理页生效。</span></div>${mergeHtml}<div class="core-roster-account-list">${accounts.map((account, accountIndex) => `<article class="core-roster-account"><header><label><span>账号</span><input value="${escapeGameAttr(account.name)}" onchange="updateCoreAccountName(${accountIndex},this.value)"></label><small>${(account.chars || []).length}个角色</small><button class="core-account-delete" type="button" onclick="removeCoreAccount(${accountIndex})">删除账号</button></header><div>${(account.chars || []).map((charName, charIndex) => `<section><input value="${escapeGameAttr(charName)}" onchange="renameCoreCharacter(${accountIndex},${charIndex},this.value)"><select aria-label="${escapeGameAttr(charName)}团本等级" onchange="setCharacterRoleTier(decodeURIComponent('${encodeURIComponent(charName)}'),this.value)"><option value="large" ${getCharacterRoleTier(charName) === 'large' ? 'selected' : ''}>大号</option><option value="medium" ${getCharacterRoleTier(charName) === 'medium' ? 'selected' : ''}>中号</option><option value="small" ${getCharacterRoleTier(charName) === 'small' ? 'selected' : ''}>小号</option></select><select aria-label="${escapeGameAttr(charName)}大区" onchange="setCharacterRegion(decodeURIComponent('${encodeURIComponent(charName)}'),this.value)"><option value="region1" ${getCharacterRegion(charName) === 'region1' ? 'selected' : ''}>1大区</option><option value="region2" ${getCharacterRegion(charName) === 'region2' ? 'selected' : ''}>2大区</option></select><button type="button" onclick="removeCoreCharacter(${accountIndex},${charIndex})">删除</button></section>`).join('')}</div><button class="core-roster-add" type="button" onclick="addCoreCharacter(${accountIndex})">＋ 添加角色</button></article>`).join('')}</div><button class="game-btn game-btn-blue" type="button" onclick="addCoreAccount()">＋ 添加账号</button>`;
}

function invalidateRosterCaches() {
  rosterMetaCacheAccounts = null;
  deviceStoragePlanCacheAccounts = null;
  dailyStarFormationCacheKey = '';
  dailyStarFormationCacheValue = null;
}

function ensureAccountMergeGroups(config = DATA?.config) {
  if (!config || typeof config !== 'object') return [];
  if (!Array.isArray(config.accountMergeGroups)) config.accountMergeGroups = [];
  const validAccounts = new Set((config.accounts || []).map(account => account?.name).filter(Boolean));
  config.accountMergeGroups = config.accountMergeGroups.filter(group => group && typeof group === 'object');
  config.accountMergeGroups.forEach((group, index) => {
    if (!group.id) group.id = `merge-${Date.now()}-${index}`;
    if (!String(group.name || '').trim()) group.name = `大账号${index + 1}`;
    group.accountNames = [...new Set((Array.isArray(group.accountNames) ? group.accountNames : []).filter(name => validAccounts.has(name)))];
    group.accountId = String(group.accountId || '');
    group.accountNote = String(group.accountNote ?? group.accountM ?? '');
  });
  return config.accountMergeGroups;
}

function saveAccountMergeGroups() {
  ensureAccountMergeGroups(DATA.config);
  saveData(DATA);
  renderCoreRosterManager();
}

function addAccountMergeGroup() {
  const groups = ensureAccountMergeGroups(DATA.config);
  groups.push({ id: `merge-${Date.now()}`, name: `大账号${groups.length + 1}`, accountNames: [], accountId: '', accountNote: '' });
  saveAccountMergeGroups();
}

function removeAccountMergeGroup(groupIndex) {
  const groups = ensureAccountMergeGroups(DATA.config);
  if (!groups[groupIndex]) return;
  if (!confirm(`确定删除合并组“${groups[groupIndex].name}”吗？账号本身不会删除。`)) return;
  groups.splice(groupIndex, 1);
  saveAccountMergeGroups();
}

function updateAccountMergeGroup(groupIndex, field, value) {
  const groups = ensureAccountMergeGroups(DATA.config);
  const group = groups[groupIndex];
  if (!group || !['name', 'accountId', 'accountNote'].includes(field)) return;
  group[field] = String(value || '').trim();
  if (field === 'name' && !group[field]) group[field] = `大账号${groupIndex + 1}`;
  saveAccountMergeGroups();
}

function toggleAccountMergeMember(groupIndex, accountName, checked) {
  const groups = ensureAccountMergeGroups(DATA.config);
  const group = groups[groupIndex];
  if (!group || !accountName) return;
  groups.forEach((item, index) => {
    if (index !== groupIndex) item.accountNames = (item.accountNames || []).filter(name => name !== accountName);
  });
  const members = new Set(group.accountNames || []);
  if (checked) members.add(accountName); else members.delete(accountName);
  group.accountNames = [...members];
  saveAccountMergeGroups();
}

function updateCoreAccountName(index, value) {
  const account = DATA.config.accounts?.[index];
  const nextName = String(value || '').trim();
  if (!account || !nextName) { toast('账号名不能为空'); renderCoreRosterManager(); return; }
  if (DATA.config.accounts.some((item, itemIndex) => itemIndex !== index && item.name === nextName)) { toast('账号名不能重复'); renderCoreRosterManager(); return; }
  const oldName = account.name;
  account.name = nextName;
  ensureAccountMergeGroups(DATA.config).forEach(group => {
    group.accountNames = (group.accountNames || []).map(name => name === oldName ? nextName : name);
  });
  if ((account.chars || []).includes('AAA建材')) {
    if (!DATA.config.schedulingConstraints.requiredAccountDevices || typeof DATA.config.schedulingConstraints.requiredAccountDevices !== 'object') {
      DATA.config.schedulingConstraints.requiredAccountDevices = {};
    }
    delete DATA.config.schedulingConstraints.requiredAccountDevices[oldName];
    DATA.config.schedulingConstraints.requiredAccountDevices[nextName] = '电脑';
    DATA.config.schedulingConstraints.raidLeaderDevices = ['电脑'];
    DATA.config.schedulingConstraints.raidLeaderRequiredDevices = { 'AAA建材': '电脑' };
  }
  Object.values(DATA.dailyLog || {}).forEach(log => {
    if (log.accounts?.[oldName]) { log.accounts[nextName] = log.accounts[oldName]; delete log.accounts[oldName]; }
  });
  invalidateRosterCaches();
  saveData(DATA);
  renderCoreRosterManager();
}

function renameCoreCharacter(accountIndex, charIndex, value) {
  const account = DATA.config.accounts?.[accountIndex];
  const oldName = account?.chars?.[charIndex];
  const nextName = String(value || '').trim();
  if (!account || !oldName || !nextName) { toast('角色名不能为空'); renderCoreRosterManager(); return; }
  if (oldName === nextName) return;
  if (isCharacterNameUsed(nextName, oldName)) { toast('角色名不能重复'); renderCoreRosterManager(); return; }
  account.chars[charIndex] = nextName;
  if (!account.charUids || typeof account.charUids !== 'object') account.charUids = {};
  account.charUids[nextName] = account.charUids[oldName] || '';
  delete account.charUids[oldName];
  if (DATA.config.characterRoleTiers?.[oldName]) {
    DATA.config.characterRoleTiers[nextName] = DATA.config.characterRoleTiers[oldName];
    delete DATA.config.characterRoleTiers[oldName];
  }
  if (DATA.config.characterRegions?.[oldName]) {
    DATA.config.characterRegions[nextName] = DATA.config.characterRegions[oldName];
    delete DATA.config.characterRegions[oldName];
  }
  migrateCharacterData(oldName, nextName);
  invalidateRosterCaches();
  saveData(DATA);
  renderCoreRosterManager();
}

function setCharacterRoleTier(charName, tier) {
  if (!['large', 'medium', 'small'].includes(tier)) return;
  if (!DATA.config.characterRoleTiers || typeof DATA.config.characterRoleTiers !== 'object') DATA.config.characterRoleTiers = {};
  DATA.config.characterRoleTiers[charName] = tier;
  saveData(DATA);
  dailyStarFormationCacheKey = '';
  const tierLabel = tier === 'large' ? '大号' : tier === 'medium' ? '中号' : '小号';
  toast(`${charName} 已设为${tierLabel}并自动保存`);
}

function getCharacterRegion(charName) {
  return DATA.config?.characterRegions?.[charName] === 'region2' ? 'region2' : 'region1';
}

function getCharacterRegionLabel(charName) {
  return getCharacterRegion(charName) === 'region2' ? '2大区' : '1大区';
}

function setCharacterRegion(charName, region) {
  if (!['region1', 'region2'].includes(region)) return;
  if (!DATA.config.characterRegions || typeof DATA.config.characterRegions !== 'object') DATA.config.characterRegions = {};
  DATA.config.characterRegions[charName] = region;
  const pairedMatch = /^AAA(战|枪)(\d+)$/u.exec(charName);
  let pairedName = '';
  if (pairedMatch) {
    const candidate = `AAA${pairedMatch[1] === '战' ? '枪' : '战'}${pairedMatch[2]}`;
    if (getAllChars().some(item => item.char === candidate)) {
      pairedName = candidate;
      DATA.config.characterRegions[pairedName] = region;
    }
  }
  DATA.dailyStarManualSquads = null;
  invalidateRosterCaches();
  saveData(DATA);
  renderCoreRosterManager();
  toast(`${charName}${pairedName ? `、${pairedName}` : ''} 已标注为${getCharacterRegionLabel(charName)}，日常编队已更新`);
}

function removeCoreCharacter(accountIndex, charIndex) {
  const account = DATA.config.accounts?.[accountIndex];
  const charName = account?.chars?.[charIndex];
  if (!charName || !confirm(`确定删除角色“${charName}”吗？相关记录也会删除。`)) return;
  account.chars.splice(charIndex, 1);
  if (account.charUids) delete account.charUids[charName];
  if (DATA.config.characterRoleTiers) delete DATA.config.characterRoleTiers[charName];
  if (DATA.config.characterRegions) delete DATA.config.characterRegions[charName];
  removeCharacterData(charName);
  invalidateRosterCaches();
  saveData(DATA);
  renderCoreRosterManager();
  renderDailyStarfield();
  renderEquipmentBuild();
}

function addCoreCharacter(accountIndex) {
  const account = DATA.config.accounts?.[accountIndex];
  if (!account) return;
  let number = 1;
  let name = `新角色${number}`;
  while (isCharacterNameUsed(name)) name = `新角色${++number}`;
  account.chars.push(name);
  if (!account.charUids || typeof account.charUids !== 'object') account.charUids = {};
  account.charUids[name] = '';
  if (!DATA.config.characterRoleTiers) DATA.config.characterRoleTiers = {};
  DATA.config.characterRoleTiers[name] = 'small';
  if (!DATA.config.characterRegions) DATA.config.characterRegions = {};
  DATA.config.characterRegions[name] = 'region1';
  invalidateRosterCaches();
  saveData(DATA);
  renderCoreRosterManager();
  renderDailyStarfield();
}

function addCoreAccount() {
  let number = DATA.config.accounts.length + 1;
  const used = new Set(DATA.config.accounts.map(item => item.name));
  while (used.has(`新账号${number}`)) number++;
  const charName = `新角色${Date.now().toString().slice(-4)}`;
  DATA.config.accounts.push({ name: `新账号${number}`, chars: [charName], charUids: { [charName]: '' } });
  if (!DATA.config.characterRoleTiers) DATA.config.characterRoleTiers = {};
  DATA.config.characterRoleTiers[charName] = 'small';
  if (!DATA.config.characterRegions) DATA.config.characterRegions = {};
  DATA.config.characterRegions[charName] = 'region1';
  invalidateRosterCaches();
  saveData(DATA);
  renderCoreRosterManager();
  renderDailyStarfield();
}

function removeCoreAccount(accountIndex) {
  const account = DATA.config.accounts?.[accountIndex];
  if (!account) return;
  const names = (account.chars || []).join('、') || '无角色';
  if (!confirm(`确定删除账号“${account.name}”及其角色吗？\n${names}`)) return;
  (account.chars || []).forEach(charName => {
    if (DATA.config.characterRoleTiers) delete DATA.config.characterRoleTiers[charName];
    if (DATA.config.characterRegions) delete DATA.config.characterRegions[charName];
    removeCharacterData(charName);
  });
  DATA.config.accounts.splice(accountIndex, 1);
  ensureAccountMergeGroups(DATA.config).forEach(group => {
    group.accountNames = (group.accountNames || []).filter(name => name !== account.name);
  });
  invalidateRosterCaches();
  saveData(DATA);
  renderCoreRosterManager();
  renderDailyStarfield();
  renderEquipmentBuild();
}

const DAILY_STAR_DEVICES = ['电脑', '平板', '手机1', '手机2'];
let dailyStarDraggedSlot = null;
let dailyStarFormationCacheKey = '';
let dailyStarFormationCacheValue = null;

function buildAutomaticDailyStarFormation(dateStr = viewingDate) {
  const formationMode = getRaidPlanner().autoMode === 'multi' && getRaidDungeons().some(raid => raid.id === 'king') ? 'multi' : 'single';
  const rosterSignature = JSON.stringify({
    snapshotVersion: 7,
    accounts: DATA.config?.accounts || [],
    tiers: DATA.config?.characterRoleTiers || {},
    requiredAccountDevices: getSchedulingConstraints().requiredAccountDevices || {},
    leaderDevices: getSchedulingConstraints().raidLeaderDevices || [],
    mode: formationMode,
    cycle: getRaidPlanner().cycleIndex || 0,
  });
  delete DATA.raidAutomaticFormationSnapshots;
  const snapshot = DATA.raidAutomaticFormationSnapshot;
  if (snapshot?.signature === rosterSignature && snapshot.plan) return JSON.parse(JSON.stringify(snapshot.plan));
  const plan = buildAutomaticRaidPlan({ includeCompleted: true, dateStr });
  if (plan.error) return { ...plan, squads: [], standalone: [], manual: false };
  const squads = (plan.squads || []).map((squad, index) => {
      const deviceSlots = DAILY_STAR_DEVICES.map(device => (squad.deviceAssignments || []).find(item => item.device === device)?.char || '');
      const ordered = deviceSlots.filter(Boolean);
      (squad.members || []).forEach(name => { if (!ordered.includes(name)) ordered.push(name); });
      return {
        id: squad.id || `R${index + 1}`,
        leader: squad.leader || ordered[0] || '',
        members: ordered,
        deviceAssignments: deviceSlots.flatMap((char, slotIndex) => char
          ? [{ ...(getRosterMeta(char) || {}), char, device: DAILY_STAR_DEVICES[slotIndex] }]
          : []),
      };
    });
  // 旧自动算法偶尔把下一队队长排在上一队。通过跨队互换让队长回到自己队内，
  // 同时保留每个角色的总覆盖；这不限制同一大号继续出现在多支队伍。
  squads.forEach((squad, squadIndex) => {
    if (!squad.leader || squad.members.includes(squad.leader)) return;
    const sourceIndex = squads.findIndex((candidate, index) => index !== squadIndex && candidate.members.includes(squad.leader) && candidate.leader !== squad.leader);
    if (sourceIndex < 0) return;
    const source = squads[sourceIndex];
    const sourceSlot = source.members.indexOf(squad.leader);
    const canSwap = targetSlot => {
      const targetChar = squad.members[targetSlot];
      if (!targetChar || targetChar === squad.leader) return false;
      const nextSource = source.members.map((name, index) => index === sourceSlot ? targetChar : name);
      const nextTarget = squad.members.map((name, index) => index === targetSlot ? squad.leader : name);
      const uniqueAccounts = names => {
        const accounts = names.map(name => getRosterMeta(name)?.account || '');
        return accounts.every(Boolean) && new Set(accounts).size === accounts.length;
      };
      return uniqueAccounts(nextSource) && uniqueAccounts(nextTarget);
    };
    const targetSlot = squad.members.findIndex((_, index) => canSwap(index));
    if (targetSlot < 0) return;
    [source.members[sourceSlot], squad.members[targetSlot]] = [squad.members[targetSlot], source.members[sourceSlot]];
  });
  squads.forEach(squad => {
    squad.deviceAssignments = squad.members.map((char, slotIndex) => {
      const existing = squad.deviceAssignments.find(item => item.char === char);
      return { ...(getRosterMeta(char) || {}), char, device: existing?.device || DAILY_STAR_DEVICES[slotIndex] };
    });
    // 最终硬约束：当前大号所在队伍必须占用电脑位，不依赖角色名称。
    const currentLeader = squad.deviceAssignments.find(item => getCharacterRoleTier(item.char) === 'large');
    if (currentLeader && currentLeader.device !== '电脑') {
      const computerMember = squad.deviceAssignments.find(item => item.device === '电脑');
      if (computerMember) computerMember.device = currentLeader.device;
      currentLeader.device = '电脑';
    }
    squad.deviceAssignments.sort((left, right) => DAILY_STAR_DEVICES.indexOf(left.device) - DAILY_STAR_DEVICES.indexOf(right.device));
    squad.members = squad.deviceAssignments.map(item => item.char);
  });
  const automatic = {
    squads,
    standalone: [...(plan.standalone || [])],
    unscheduled: [...(plan.unscheduled || [])],
    mode: plan.mode,
    manual: false,
  };
  DATA.raidAutomaticFormationSnapshot = { signature: rosterSignature, plan: automatic };
  saveData(DATA);
  return JSON.parse(JSON.stringify(automatic));
}

function normalizeDailyStarFormation(saved, dateStr = viewingDate) {
  const automatic = buildAutomaticDailyStarFormation(dateStr);
  if (!saved || !Array.isArray(saved.squads)) return automatic;
  const currentMode = getRaidPlanner().autoMode === 'multi' && getRaidDungeons().some(raid => raid.id === 'king') ? 'multi' : 'single';
  if (saved.formationMode !== currentMode) {
    DATA.dailyStarManualSquads = null;
    saveData(DATA);
    return automatic;
  }
  const isEditableDraft = Number(saved.version) >= 3;
  const valid = new Set(getAllChars().map(item => item.char));
  const squads = saved.squads.map((savedSquad, index) => {
    const legacyMembers = Array.isArray(savedSquad.members) ? savedSquad.members : [];
    const slots = Array.isArray(savedSquad.slots)
      ? savedSquad.slots.slice(0, 4)
      : [savedSquad.leader || '', ...legacyMembers.filter(name => name !== savedSquad.leader).slice(0, 3)];
    while (slots.length < 4) slots.push('');
    const members = slots.filter(name => valid.has(name));
    return {
      id: `R${index + 1}`,
      leader: valid.has(savedSquad.leader) ? savedSquad.leader : (members[0] || ''),
      members,
      deviceAssignments: members.map((char, slotIndex) => ({ ...(getRosterMeta(char) || {}), char, device: DAILY_STAR_DEVICES[slotIndex] })),
      slots,
    };
  }).filter(squad => isEditableDraft || squad.members.length);
  const rawStandalone = Array.isArray(saved.standalone) ? saved.standalone : [saved.solo];
  const standalone = rawStandalone.filter((name, index, list) => valid.has(name) && list.indexOf(name) === index);
  const rawSavedNames = [
    ...saved.squads.flatMap(squad => Array.isArray(squad.slots) ? squad.slots : (squad.members || [])),
    ...rawStandalone,
  ].filter(Boolean);
  const rosterChanged = rawSavedNames.some(name => !valid.has(name));
  const leaderDeviceChanged = saved.squads.some(squad => {
    const slots = Array.isArray(squad.slots) ? squad.slots : [];
    return getCharacterRoleTier(squad.leader) === 'large' && slots[0] !== squad.leader;
  });
  const covered = new Set([...squads.flatMap(squad => squad.members), ...standalone]);
  const invalidSquad = squads.some(squad => {
    const accounts = squad.members.map(name => getRosterMeta(name)?.account || '');
    return squad.members.length < 2 || squad.members.length > 4 || new Set(squad.members).size !== squad.members.length
      || accounts.some(account => !account) || new Set(accounts).size !== squad.members.length
      || !squad.members.includes(squad.leader);
  });
  const incomplete = squads.length !== automatic.squads.length || standalone.length !== automatic.standalone.length
    || covered.size !== valid.size || [...valid].some(name => !covered.has(name));
  // 旧缓存仍需严格清理；新版手动草稿允许暂时不完整或账号冲突，
  // 由界面明确提示并阻止执行，避免用户刚换一个位置就被恢复成自动方案。
  if (rosterChanged || leaderDeviceChanged || (!isEditableDraft && (invalidSquad || incomplete))) {
    DATA.dailyStarManualSquads = null;
    saveData(DATA);
    return automatic;
  }
  return { squads, standalone, manual: true };
}

function getDailyStarFormation(dateStr = viewingDate) {
  if (DATA.dailyStarManualSquads) DATA.dailyStarManualSquads = null;
  const cacheKey = `${dateStr}|${JSON.stringify(DATA.config?.accounts || [])}|${getRaidPlanner().cycleIndex || 0}|${getRaidPlanner().autoMode}`;
  if (cacheKey === dailyStarFormationCacheKey && dailyStarFormationCacheValue) return dailyStarFormationCacheValue;
  dailyStarFormationCacheKey = cacheKey;
  dailyStarFormationCacheValue = buildAutomaticDailyStarFormation(dateStr);
  return dailyStarFormationCacheValue;
}

function getDailyStarFormationSlots() {
  const plan = getDailyStarFormation(viewingDate);
  const squads = plan.squads.map(squad => {
    const slots = Array.isArray(squad.slots) ? [...squad.slots] : DAILY_STAR_DEVICES.map(device => squad.deviceAssignments.find(item => item.device === device)?.char || '');
    while (slots.length < 4) slots.push('');
    return { ...squad, slots };
  });
  const standalone = [...(plan.standalone || [])];
  return { squads, standalone, solo: standalone[0] || '', manual: plan.manual };
}

function persistDailyStarFormation(squads, standalone) {
  const solos = Array.isArray(standalone) ? standalone.filter(Boolean) : [standalone].filter(Boolean);
  DATA.dailyStarManualSquads = {
    version: 4,
    formationMode: getRaidPlanner().autoMode === 'multi' && getRaidDungeons().some(raid => raid.id === 'king') ? 'multi' : 'single',
    squads: squads.map((squad, index) => ({ id: `R${index + 1}`, slots: squad.slots.slice(0, 4), leader: squad.leader || squad.slots.find(Boolean) || '', members: squad.slots.filter(Boolean) })),
    standalone: solos,
    solo: solos[0] || '',
  };
  saveData(DATA);
}

function getDailyStarFormationWarnings(squads, solo) {
  const standalone = Array.isArray(solo) ? solo : [solo].filter(Boolean);
  const locations = new Map();
  squads.forEach((squad, squadIndex) => squad.slots.forEach((name, slotIndex) => {
    if (!name) return;
    if (!locations.has(name)) locations.set(name, []);
    locations.get(name).push(`R${squadIndex + 1}-${DAILY_STAR_DEVICES[slotIndex]}`);
  }));
  standalone.forEach((name, index) => {
    if (!locations.has(name)) locations.set(name, []);
    locations.get(name).push(`单刷${index + 1}`);
  });
  const assigned = new Set(locations.keys());
  const missing = getAllChars().map(item => item.char).filter(name => !assigned.has(name));
  const duplicate = squads.flatMap((squad, index) => {
    const names = squad.slots.filter(Boolean);
    return new Set(names).size < names.length ? [`R${index + 1}`] : [];
  });
  const accountConflicts = squads.flatMap((squad, index) => {
    const accounts = squad.slots.filter(Boolean).map(name => getRosterMeta(name)?.account || '');
    return new Set(accounts).size < accounts.length ? [`R${index + 1}`] : [];
  });
  const leaderMissing = squads.flatMap((squad, index) => squad.leader && squad.slots.includes(squad.leader) ? [] : [`R${index + 1}`]);
  return { duplicate, missing, accountConflicts, leaderMissing };
}

function renderDailyStarManualEditor() {
  const allChars = getAllChars();
  const formation = getDailyStarFormationSlots();
  const warnings = getDailyStarFormationWarnings(formation.squads, formation.standalone);
  const options = selected => `<option value="">— 空位 —</option>${allChars.map(item => {
    const meta = getRosterMeta(item.char);
    const tierLabel = getCharacterRoleTier(item.char) === 'large' ? '大号' : getCharacterRoleTier(item.char) === 'medium' ? '中号' : '小号';
    return `<option value="${escapeGameAttr(item.char)}" ${item.char === selected ? 'selected' : ''}>[${tierLabel}] ${escapeGameHtml(meta?.account || '未知账号')} · ${escapeGameHtml(item.char)}</option>`;
  }).join('')}`;
  const cards = formation.squads.map((squad, squadIndex) => {
    const leaderOptions = squad.slots.filter(Boolean).map(name => `<option value="${escapeGameAttr(name)}" ${name === squad.leader ? 'selected' : ''}>${escapeGameHtml(name)}</option>`).join('');
    return `<article class="formation-squad-card"><header><strong>R${squadIndex + 1}</strong><label class="formation-leader"><span>带队大号</span><select onchange="changeDailyStarFormationLeader(${squadIndex},this.value)">${leaderOptions}</select></label><small>${squad.slots.filter(Boolean).length}/4 人</small></header><div class="formation-slot-grid">${squad.slots.map((name, slotIndex) => `<label class="formation-slot" draggable="${name ? 'true' : 'false'}" ondragstart="startDailyStarSlotDrag(${squadIndex},${slotIndex},event)" ondragover="event.preventDefault()" ondrop="dropDailyStarSlot(${squadIndex},${slotIndex},event)"><span>${DAILY_STAR_DEVICES[slotIndex]}</span><select data-formation-squad="${squadIndex}" data-formation-slot="${slotIndex}" onchange="changeDailyStarFormationSlot(${squadIndex},${slotIndex},this.value)">${options(name)}</select></label>`).join('')}</div></article>`;
  }).join('');
  const warningParts = [];
  if (warnings.duplicate.length) warningParts.push(`队内角色重复：${warnings.duplicate.join('、')}`);
  if (warnings.missing.length) warningParts.push(`未编入：${warnings.missing.join('、')}`);
  if (warnings.accountConflicts.length) warningParts.push(`同账号冲突：${warnings.accountConflicts.join('、')}`);
  if (warnings.leaderMissing.length) warningParts.push(`带队大号不在队内：${warnings.leaderMissing.join('、')}`);
  const soloEditors = formation.standalone.map((name, index) => `<label class="formation-solo"><span>单刷角色 ${index + 1}</span><select onchange="changeDailyStarSolo(this.value,${index})">${options(name)}</select></label>`).join('');
  return `<section class="formation-editor"><div class="formation-editor-heading"><div><span>FREE FORMATION</span><h2>自由编队</h2><p>下拉选择已编入的角色会自动交换两人位置，也可直接拖动互换；每次修改自动保存。</p></div><strong>${formation.manual ? '已自定义' : '自动方案'}</strong></div><div class="formation-squad-list">${cards}</div>${soloEditors}<div class="formation-validation ${warningParts.length ? 'warning' : 'ok'}">${warningParts.length ? warningParts.join('；') : '✓ 所有角色均已编入，且队内账号无冲突'}</div></section>`;
}

function findDailyStarFormationLocation(formation, charName) {
  if (!charName) return null;
  for (let squadIndex = 0; squadIndex < formation.squads.length; squadIndex++) {
    const slotIndex = formation.squads[squadIndex].slots.indexOf(charName);
    if (slotIndex >= 0) return { type: 'slot', squadIndex, slotIndex };
  }
  const soloIndex = formation.standalone.indexOf(charName);
  return soloIndex >= 0 ? { type: 'solo', soloIndex } : null;
}

function changeDailyStarFormationSlot(squadIndex, slotIndex, nextName) {
  const formation = getDailyStarFormationSlots();
  const targetSquad = formation.squads[squadIndex];
  const current = targetSquad?.slots[slotIndex] || '';
  if (!targetSquad || current === nextName) return;
  const source = findDailyStarFormationLocation(formation, nextName);
  targetSquad.slots[slotIndex] = nextName;
  if (source?.type === 'slot') {
    const sourceSquad = formation.squads[source.squadIndex];
    sourceSquad.slots[source.slotIndex] = current;
    if (sourceSquad.leader === nextName) sourceSquad.leader = current || sourceSquad.slots.find(Boolean) || '';
  } else if (source?.type === 'solo') {
    formation.standalone[source.soloIndex] = current;
  }
  if (targetSquad.leader === current) targetSquad.leader = nextName || targetSquad.slots.find(Boolean) || '';
  persistDailyStarFormation(formation.squads, formation.standalone);
  renderDailyStarfield();
  toast(source ? '两名角色已互换并自动保存' : '编队已自动保存');
}

function changeDailyStarFormationLeader(squadIndex, leader) {
  const formation = getDailyStarFormationSlots();
  const squad = formation.squads[squadIndex];
  if (!squad || !squad.slots.includes(leader)) return;
  squad.leader = leader;
  persistDailyStarFormation(formation.squads, formation.standalone);
  renderDailyStarfield();
  toast('带队大号已保存');
}

function changeDailyStarSolo(nextName, soloIndex = 0) {
  const formation = getDailyStarFormationSlots();
  const current = formation.standalone[soloIndex] || '';
  if (current === nextName) return;
  const source = findDailyStarFormationLocation(formation, nextName);
  if (source?.type === 'slot') {
    const sourceSquad = formation.squads[source.squadIndex];
    sourceSquad.slots[source.slotIndex] = current;
    if (sourceSquad.leader === nextName) sourceSquad.leader = current || sourceSquad.slots.find(Boolean) || '';
  }
  if (source?.type === 'solo' && source.soloIndex !== soloIndex) formation.standalone[source.soloIndex] = current;
  formation.standalone[soloIndex] = nextName;
  persistDailyStarFormation(formation.squads, formation.standalone);
  renderDailyStarfield();
  toast(source ? '单刷角色已与队内角色互换' : '编队已自动保存');
}

function startDailyStarSlotDrag(squadIndex, slotIndex, event) {
  dailyStarDraggedSlot = { squadIndex, slotIndex };
  event?.dataTransfer?.setData('text/plain', `${squadIndex}:${slotIndex}`);
}

function dropDailyStarSlot(targetSquadIndex, targetSlotIndex, event) {
  event?.preventDefault();
  const raw = event?.dataTransfer?.getData('text/plain');
  const [sourceSquadIndex, sourceSlotIndex] = raw ? raw.split(':').map(Number) : [dailyStarDraggedSlot?.squadIndex, dailyStarDraggedSlot?.slotIndex];
  dailyStarDraggedSlot = null;
  if (!Number.isInteger(sourceSquadIndex) || !Number.isInteger(sourceSlotIndex)) return;
  const formation = getDailyStarFormationSlots();
  const source = formation.squads[sourceSquadIndex]?.slots;
  const target = formation.squads[targetSquadIndex]?.slots;
  if (!source || !target) return;
  [source[sourceSlotIndex], target[targetSlotIndex]] = [target[targetSlotIndex], source[sourceSlotIndex]];
  persistDailyStarFormation(formation.squads, formation.standalone);
  renderDailyStarfield();
  toast('角色已互换并自动保存');
}

function resetDailyStarFormationToAutomatic() {
  DATA.dailyStarManualSquads = null;
  saveData(DATA);
  renderDailyStarfield();
  toast('已恢复自动编队');
}

// 废弃旧函数，保留兼容
function toggleDailyStarManualMode() { renderDailyStarfield(); }
function getDailyStarManualSquads() { return DATA.dailyStarManualSquads || { squads: [], solo: '' }; }
function saveManualSquadEdits() { toast('当前编队已自动保存'); }
function clearManualSquadEdits() { resetDailyStarFormationToAutomatic(); }
function saveDailyStarManualSquads() { toast('当前编队已自动保存'); }
function resetDailyStarManualSquads() { resetDailyStarFormationToAutomatic(); }
function renderDailyStarManualSquads() { return renderDailyStarManualEditor(); }
function renderManualSlotCard() { return ''; }
function renderManualSquadExecutionCards() { return ''; }
function refreshDailyStarManualSelects() {}
function updateManualSquadGold() {}

function renderWeeklyGroupSchedule(dateStr) {
  const tasks = getCharacterTasks().filter(isGroupedCharacterTask);
  return `<div class="daily-week-plan">${getWeekDates(dateStr).map(day => {
    const labels = tasks.filter(task => isTaskDueOnDate(task, day.iso)).map(task => `${task.icon || '✓'} ${task.name}`).join(' · ');
    return `<div class="${day.iso === dateStr ? 'active' : ''}"><strong>${day.name} ${day.dateStr}</strong><small>${labels}</small></div>`;
  }).join('')}</div>`;
}

function renderGroupedDailyCheckin(dateStr) {
  const groupedTasks = getCharacterTasks().filter(task => isGroupedCharacterTask(task) && isTaskDueOnDate(task, dateStr));
  const groups = getDailyCharacterGroups(dateStr);
  const todayTasks = groupedTasks.map(task => `${task.icon || '✓'} ${task.name}`).join(' · ');
  let html = `<div class="daily-group-plan-head"><div><strong>今日五天三次轮换 · ${groups.length}队</strong><small>每个角色五天清理3次；每天队伍数量尽量平均，同账号角色不会进入同一队。</small></div><span>${todayTasks || '今天没有分组任务'}</span></div>${renderWeeklyGroupSchedule(dateStr)}`;

  if (!groups.length) return html + '<div class="daily-group-empty">请先在设置页添加角色。</div>';
  html += '<div class="daily-task-groups">';
  groups.forEach(group => {
    const allDone = groupedTasks.length && group.members.every(member => groupedTasks.every(task => getTaskVal(dateStr, member.char, task.id)));
    html += `<section class="daily-task-group"><div class="daily-task-group-head"><div><strong>D${group.index + 1}</strong><small>${group.members.length} 人 · 固定日常队</small></div><button class="game-btn game-btn-sm ${allDone ? 'game-btn-green' : 'game-btn-blue'}" type="button" onclick="completeDailyGroup('${dateStr}',${group.index})">${allDone ? '✓ 本组已完成' : '一键完成本组'}</button></div>`;
    html += '<div class="daily-group-members">';
    group.members.forEach(member => {
      const encodedChar = encodeURIComponent(member.char);
      html += `<div class="daily-group-member"><div class="daily-group-member-name"><span>${escapeGameHtml(member.device)}</span><strong><b class="roster-code">${escapeGameHtml(member.charCode || '')}</b>${escapeGameHtml(member.char)}</strong><small>${escapeGameHtml(member.accountCode || '')} · ${escapeGameHtml(member.account)}</small></div><div class="daily-group-member-tasks">`;
      groupedTasks.forEach(task => {
        const checked = getTaskVal(dateStr, member.char, task.id);
        const encodedTask = encodeURIComponent(task.id);
        html += `<label><input type="checkbox" class="game-check" ${checked ? 'checked' : ''} onchange="toggleCharTask('${dateStr}',decodeURIComponent('${encodedChar}'),decodeURIComponent('${encodedTask}'),this.checked)"><span>${task.icon || '✓'} ${escapeGameHtml(task.name)}</span></label>`;
      });
      html += '</div></div>';
    });
    html += '</div></section>';
  });
  html += '</div>';
  return html + renderDailySupplementalCheckin(dateStr, groups, groupedTasks);
}

function renderDailySupplementalCheckin(dateStr, groups = getDailyCharacterGroups(dateStr), groupedTasks = getDailyStarTasks(dateStr)) {
  const groupedNames = new Set((groups || []).flatMap(group => (group.members || []).map(member => member.char)));
  const supplemental = getDailyScheduledCharacters(dateStr).filter(item => !groupedNames.has(item.char));
  if (!supplemental.length) return '';
  const taskNames = (groupedTasks || []).map(task => `${task.icon || '✓'} ${escapeGameHtml(task.name)}`).join(' · ') || '今日分组任务';
  const cards = supplemental.map(item => {
    const encodedChar = encodeURIComponent(item.char);
    const latestSlot = getMostRecentDailySlot(item.char, dateStr);
    const completion = getDailyMemberCompletion(item.char, dateStr);
    return `<button type="button" class="daily-supplement-card ${completion.complete ? 'complete' : ''}" onclick="toggleDailyStarCharacter('${encodedChar}')"><span>${escapeGameHtml(item.device || '')}</span><strong>${escapeGameHtml(item.charCode || '')} · ${escapeGameHtml(item.char)}</strong><small>${escapeGameHtml(item.accountCode || '')} · ${escapeGameHtml(item.account)}${latestSlot && latestSlot < dateStr ? ` · 补 ${latestSlot}` : ''}</small><em>${completion.complete ? '✓ 已完成' : taskNames}</em></button>`;
  }).join('');
  return `<section class="daily-supplemental"><div class="daily-group-plan-head"><div><strong>补刷角色 · ${supplemental.length}个</strong><small>只列出未进入今日队伍、但仍需要补完成的角色；点击角色格子可完成/取消。</small></div><span>${taskNames}</span></div><div class="daily-supplement-grid">${cards}</div></section>`;
}

function getPreferredDailyGroupSizes(totalCharacters, minimumGroups) {
  if (!totalCharacters) return [];
  const groupCount = Math.max(minimumGroups, Math.ceil(totalCharacters / getSchedulingConstraints().dailyPartySize));
  const baseSize = Math.floor(totalCharacters / groupCount);
  const extra = totalCharacters % groupCount;
  return Array.from({ length: groupCount }, (_, index) => baseSize + (index < extra ? 1 : 0));
}

function completeDailyGroup(dateStr, groupIndex) {
  const tasks = getCharacterTasks().filter(task => isGroupedCharacterTask(task) && isTaskDueOnDate(task, dateStr));
  const group = getDailyCharacterGroups(dateStr).find(item => item.index === groupIndex);
  if (!group || !tasks.length) return;
  const log = getDayLog(dateStr);
  let updated = 0;
  group.members.forEach(member => {
    if (!log.chars[member.char]) log.chars[member.char] = {};
    tasks.forEach(task => {
      if (!log.chars[member.char][task.id]) {
        log.chars[member.char][task.id] = true;
        updated++;
      }
    });
    updateDailyPlannerCompletion(member.char, dateStr, true);
  });
  if (!updated) { toast('本组任务已全部打卡'); return; }
  saveData(DATA);
  renderDashboard();
  renderDaily();
  renderDailyStarfield();
  toast(`第 ${groupIndex + 1} 组已完成 ${updated} 项打卡`);
}

function toggleAccTask(dateStr, accName, taskId, checked) {
  const log = getDayLog(dateStr);
  if (!log.accounts[accName]) log.accounts[accName] = {};
  log.accounts[accName][taskId] = checked;
  saveData(DATA);
  renderDashboard();
}

function toggleGlobalTask(dateStr, taskId, checked) {
  const log = getDayLog(dateStr);
  if (!log.global) log.global = {};
  log.global[taskId] = !!checked;
  saveData(DATA);
  renderDashboard();
  renderDaily();
}

function toggleRaidCheckin(dateStr, charName, raidId) {
  const raid = getRaidDungeons().find(item => item.id === raidId);
  if (!raid) return;
  const progress = getRaidProgress(charName);
  if (!progress.checkins[dateStr] || typeof progress.checkins[dateStr] !== 'object') progress.checkins[dateStr] = {};
  const checked = !!progress.checkins[dateStr][raidId];
  const used = getRaidCount(charName, raidId);
  if (!checked && used >= raid.weeklyLimit) {
    toast(`${raid.name} 当前周期已完成 ${raid.weeklyLimit} 次，请推进团本循环后再继续`);
    renderDaily();
    return;
  }
  progress.checkins[dateStr][raidId] = !checked;
  progress.counts[raidId] = Math.max(0, used + (checked ? -1 : 1));
  saveData(DATA);
  renderDashboard();
  renderDaily();
}

function refreshWeeklyRaids() {
  const currentRaids = getRaidDungeons();
  const catalog = getRaidCatalog();
  if (currentRaids.length < 2 || catalog.length < 4) {
    toast('团本配置不完整，无法刷新');
    return;
  }
  const planner = getRaidPlanner();
  const nextCycleIndex = (planner.cycleIndex + 1) % catalog.length;
  const nextRaids = [catalog[nextCycleIndex], catalog[(nextCycleIndex + 1) % catalog.length]];
  const incomingRaid = nextRaids[1];
  const allChars = getAllChars();
  const incomingBefore = allChars.reduce((sum, item) => sum + getRaidCount(item.char, incomingRaid.id), 0);
  const message = `确定推进一次团本循环吗？\n\n${currentRaids.map(raid => raid.name).join(' + ')} → ${nextRaids.map(raid => raid.name).join(' + ')}\n将保留${nextRaids[0].name}进度，并清零新进入的${incomingRaid.name}现有 ${incomingBefore} 次。`;
  if (!confirm(message)) return;
  advanceRaidCycle();
  saveData(DATA);
  renderDailyStarfield();
  toast(`团本循环已推进：${nextRaids[0].name} + ${nextRaids[1].name}`);
}

function advanceRaidCycle() {
  const catalog = getRaidCatalog();
  const planner = getRaidPlanner();
  const nextCycleIndex = (planner.cycleIndex + 1) % catalog.length;
  const nextRaids = [catalog[nextCycleIndex], catalog[(nextCycleIndex + 1) % catalog.length]];
  const incomingRaid = nextRaids[1];
  const allChars = getAllChars();
  allChars.forEach(item => {
    const progress = getRaidProgress(item.char);
    progress.counts[incomingRaid.id] = 0;
    delete progress.cycleAdjustments[incomingRaid.id];
  });
  planner.cycleIndex = nextCycleIndex;
  planner.lastRotationDate = getLatestRaidRotationDate();
  raidPlannerRaidId = nextRaids[0].id;
  return { activeRaids: nextRaids, incomingRaid };
}

function toggleCharTask(dateStr, charName, taskId, checked) {
  const log = getDayLog(dateStr);
  if (!log.chars[charName]) log.chars[charName] = {};
  log.chars[charName][taskId] = checked;
  if (taskId === '体力') updateDailyPlannerCompletion(charName, dateStr, !!checked);
  saveData(DATA);
  renderDashboard();
  renderDaily();
  renderDailyStarfield();
}

function setCharTaskNum(dateStr, charName, taskId, val) {
  const log = getDayLog(dateStr);
  if (!log.chars[charName]) log.chars[charName] = {};
  log.chars[charName][taskId] = parseInt(val) || 0;
  saveData(DATA);
  renderDashboard();
  renderDaily();
}

function setCharGold(charName, val) {
  if (!DATA.characterGold || typeof DATA.characterGold !== 'object') DATA.characterGold = {};
  const amount = Math.max(0, parseInt(val, 10) || 0);
  DATA.characterGold[charName] = amount;
  syncCharacterGoldInputs(charName, amount);
  clearGoldTransferExecution();
  queueGameDataSave();
}

function syncCharacterGoldInputs(charName, value, sourceInput = null) {
  if (typeof document === 'undefined') return;
  const amount = Math.max(0, parseInt(value, 10) || 0);
  document.querySelectorAll('input[data-gold-character]').forEach(input => {
    if (input !== sourceInput && input.dataset.goldCharacter === charName) input.value = amount;
  });
  document.querySelectorAll('.unified-execution-card').forEach(card => {
    if (![...card.querySelectorAll('input[data-gold-character]')].some(input => input.dataset.goldCharacter === charName)) return;
    const total = [...card.querySelectorAll('input[data-gold-character]')].reduce((sum, input) => sum + Math.max(0, parseInt(input.value, 10) || 0), 0);
    const totalNode = card.querySelector('.unified-card-total-gold');
    if (totalNode) totalNode.textContent = `${formatGameGold(total)} 金币`;
  });
}

function setCharacterAntiMagic(charName, val) {
  if (!DATA.characterAntiMagic || typeof DATA.characterAntiMagic !== 'object') DATA.characterAntiMagic = {};
  const amount = Math.max(0, parseInt(val, 10) || 0);
  DATA.characterAntiMagic[charName] = amount;
  syncCharacterAntiMagicInputs(charName, amount);
  queueGameDataSave();
}

function syncCharacterAntiMagicInputs(charName, value, sourceInput = null) {
  if (typeof document === 'undefined') return;
  const amount = Math.max(0, parseInt(value, 10) || 0);
  document.querySelectorAll('input[data-anti-magic-character]').forEach(input => {
    if (input !== sourceInput && input.dataset.antiMagicCharacter === charName) input.value = amount;
  });
  document.querySelectorAll('.unified-execution-card[data-execution-scope="raid"]').forEach(card => {
    if (![...card.querySelectorAll('input[data-anti-magic-character]')].some(input => input.dataset.antiMagicCharacter === charName)) return;
    const inputs = [...card.querySelectorAll('input[data-anti-magic-character]')];
    const difficultyTwo = inputs.length > 1 && inputs.every(input => Math.max(0, parseInt(input.value, 10) || 0) >= 1400);
    card.classList.toggle('difficulty-two', difficultyTwo);
    const meta = card.querySelector('.unified-card-meta');
    let badge = meta?.querySelector('.difficulty-two-badge');
    if (difficultyTwo && meta && !badge) {
      badge = document.createElement('em');
      badge.className = 'difficulty-two-badge';
      badge.textContent = '全队抗魔≥1400 · 推荐打2难度';
      meta.appendChild(badge);
    } else if (!difficultyTwo && badge) badge.remove();
  });
}

function switchDay(offset) {
  if (Number(offset) === 0) {
    viewingDate = getTodayStr();
    renderDailyStarfield();
    return;
  }
  const d = new Date(viewingDate + 'T00:00:00');
  d.setDate(d.getDate() + offset);
  viewingDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  renderDailyStarfield();
}

// ==========================================
//  渲染：装备构造页
// ==========================================
function renderEquipmentBuildAffixOptions(selected) {
  const render = name => `<option value="${escapeGameAttr(name)}" ${selected === name ? 'selected' : ''}>${escapeGameHtml(name)}</option>`;
  return `<option value="">— 未选择 —</option><optgroup label="必带（优先补齐）">${EQUIPMENT_BUILD_REQUIRED_AFFIXES.map(render).join('')}</optgroup><optgroup label="可替换（必带齐全后）">${EQUIPMENT_BUILD_OPTIONAL_AFFIXES.map(render).join('')}</optgroup>`;
}

function renderEquipmentBuildEmblemOptions(selected) {
  return `<option value="">— 未选择 —</option>${EQUIPMENT_BUILD_EMBLEMS.map(item => `<option value="${escapeGameAttr(item.name)}" ${selected === item.name ? 'selected' : ''}>${escapeGameHtml(item.name)}</option>`).join('')}`;
}

function renderEquipmentBuild() {
  const wrap = document.getElementById('equipmentBuildContent');
  if (!wrap) return;
  const allCharacters = getAllChars();
  const selectedChars = getEquipmentBuildSelectedCharSet(allCharacters);
  const filterHtml = `<section class="equipment-build-filter"><div class="equipment-build-filter-head"><div><strong>显示角色</strong><small>只显示已勾选的培养角色；每角色有 3 个必要徽记格和 2 个胚子徽记格。</small></div><div><button class="game-btn game-btn-outline game-btn-sm" type="button" onclick="setAllEquipmentBuildCharacters(true)">全选</button><button class="game-btn game-btn-outline game-btn-sm" type="button" onclick="setAllEquipmentBuildCharacters(false)">清空</button></div></div><div class="equipment-build-filter-list">${allCharacters.map(item => { const encoded = encodeURIComponent(item.char); return `<label><input type="checkbox" class="game-check" ${selectedChars.has(item.char) ? 'checked' : ''} onchange="toggleEquipmentBuildCharacter(decodeURIComponent('${encoded}'),this.checked)"><span><strong>${escapeGameHtml(item.char)}</strong><small>${escapeGameHtml(item.account)}</small></span></label>`; }).join('')}</div></section>`;
  if (!allCharacters.length) { wrap.innerHTML = '<div class="equipment-build-empty">请先在设置页添加角色。</div>'; return; }
  const characters = allCharacters.filter(item => selectedChars.has(item.char)).map(item => {
    const affixAnalysis = getEquipmentBuildAffixAnalysis(item.char);
    const completed = affixAnalysis.activeSlotIds.size;
    const loopCompleted = getEquipmentBuildLoopCompleted(item.char);
    return { ...item, affixAnalysis, completed, loopCompleted };
  });
  if (!characters.length) { wrap.innerHTML = filterHtml + '<div class="equipment-build-empty">请至少勾选一个要显示的角色。</div>'; return; }

  const totalSlots = EQUIPMENT_BUILD_SLOTS.length;
  const emblemPlan = getEquipmentBuildEmblemPlan();
  characters.forEach(item => {
    item.emblemCompleted = getEquipmentBuildCharacterEmblemCompleted(item.char, emblemPlan);
    item.totalCompleted = item.completed + item.loopCompleted + item.emblemCompleted;
  });
  if (equipmentBuildRenderedOrder === null) {
    equipmentBuildRenderedOrder = [...characters]
      .sort((a, b) => b.totalCompleted - a.totalCompleted || b.completed - a.completed || a.char.localeCompare(b.char, 'zh-CN'))
      .map(item => item.char);
  }
  const orderIndex = new Map(equipmentBuildRenderedOrder.map((charName, index) => [charName, index]));
  characters.sort((a, b) => {
    const aIndex = orderIndex.has(a.char) ? orderIndex.get(a.char) : Number.MAX_SAFE_INTEGER;
    const bIndex = orderIndex.has(b.char) ? orderIndex.get(b.char) : Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex || a.char.localeCompare(b.char, 'zh-CN');
  });
  const planInput = (key, label, group) => `<label class="${group}"><strong>${label}</strong><span>每角色 <input type="number" min="0" step="1" value="${emblemPlan[key]}" onchange="setEquipmentBuildEmblemPlan('${key}',this.value)"></span><small>共需 <b>${emblemPlan[key] * characters.length}</b> 个</small></label>`;
  const emblemNeedHtml = `<section class="equipment-emblem-stock"><div><h4>📦 当前培养角色的徽记需求</h4><p>上方填写每个角色的目标需求；下方每个角色独立填写自己的必要徽记和胚子数量，不在角色之间互通。</p></div><div class="equipment-emblem-groups"><div><h5>必要徽记（每角色目标）</h5><div class="equipment-emblem-stock-grid">${planInput('miriaRequired', '蜜丽亚徽记', 'required')}${planInput('shieldRequired', '重盾守卫徽记', 'required')}${planInput('treeRequired', '树妖徽记', 'required')}</div></div><div><h5>胚子（每角色总需求）</h5><div class="equipment-emblem-stock-grid">${planInput('embryo', '胚子总数', 'embryo')}</div><p class="equipment-embryo-total valid">所有角色合计目标：${emblemPlan.embryo * characters.length} 个胚子</p></div></div></section>`;
  const totalCompleted = characters.reduce((sum, item) => sum + item.totalCompleted, 0);
  const totalLoops = characters.reduce((sum, item) => sum + item.loopCompleted, 0);
  const totalEmblems = characters.reduce((sum, item) => sum + item.emblemCompleted, 0);
  const missingRequiredCount = characters.reduce((sum, item) => sum + item.affixAnalysis.missingRequired.length, 0);
  let html = filterHtml + emblemNeedHtml + `<div class="equipment-build-summary"><span><b>${characters.length}/${allCharacters.length}</b> 个角色显示</span><span><b>${totalCompleted}/${characters.length * (totalSlots * 2 + 4)}</b> 总完成</span><span><b>${totalEmblems}/${characters.length * 4}</b> 徽记与胚子达标</span><span><b>${totalLoops}/${characters.length * totalSlots}</b> 回路完成</span><span class="${missingRequiredCount ? 'warn' : 'good'}">必带词条${missingRequiredCount ? `缺 ${missingRequiredCount} 条` : '已齐全'}</span></div>`;
  html += '<div class="game-table-wrap"><table class="game-table equipment-build-table"><thead><tr><th>排名</th><th>角色 / 账号 / 缺词条</th><th>剩余可用词条<br><small>按词条前缀分类</small></th><th>项目</th><th>完成度</th>';
  EQUIPMENT_BUILD_SLOTS.forEach(slot => { html += `<th>${slot.icon}<br>${slot.label}</th>`; });
  html += '</tr></thead><tbody>';
  characters.forEach((item, index) => {
    const affixes = getEquipmentBuildAffixStatus(item.char);
    const emblemAmounts = getEquipmentBuildCharacterEmblems(item.char);
    const loops = getEquipmentBuildLoopStatus(item.char);
    const progress = Math.round(item.completed / totalSlots * 100);
    const loopProgress = Math.round(item.loopCompleted / totalSlots * 100);
    const encodedChar = encodeURIComponent(item.char);
    const rowClass = item.totalCompleted === totalSlots * 2 + 4 ? 'equipment-build-perfect' : '';
    const rankClass = index < 3 ? ` rank-${index + 1}` : '';
    const missing = item.affixAnalysis.missingRequired;
    const duplicateNames = [...item.affixAnalysis.duplicateSlotIds].map(slotId => affixes[slotId]);
    const missingHtml = missing.length ? `<div class="equipment-build-missing"><b>缺必带：</b>${missing.map(escapeGameHtml).join('、')}</div>` : '<div class="equipment-build-missing ready">✓ 必带词条已齐，可选可替换词条</div>';
    const duplicateHtml = duplicateNames.length ? `<div class="equipment-build-duplicate">重复无效：${duplicateNames.map(escapeGameHtml).join('、')}</div>` : '';
    const remainingAffixes = getEquipmentBuildRemainingAffixGroups(item.affixAnalysis);
    const remainingAffixesHtml = remainingAffixes.length
      ? `<div class="equipment-build-remaining-affixes">${remainingAffixes.map(([prefix, names]) => `<div><b>${escapeGameHtml(prefix)}</b><span>${names.map(escapeGameHtml).join('、')}</span></div>`).join('')}</div>`
      : '<span class="equipment-build-remaining-empty">无</span>';
    const output60s = getEquipmentBuildOutput60s(item.char);
    html += `<tr class="${rowClass}"><td rowspan="3"><span class="equipment-build-rank${rankClass}">${index + 1}</span></td><td rowspan="3"><strong>${escapeGameHtml(item.char)}</strong><br><small>${escapeGameHtml(item.account)}</small><label class="equipment-build-output"><span>60s 输出</span><input type="number" min="0" step="any" inputmode="decimal" placeholder="填写数值" value="${output60s}" aria-label="${escapeGameAttr(item.char)} 的60s输出" onchange="setEquipmentBuildOutput60s(decodeURIComponent('${encodedChar}'),this.value)"></label>${missingHtml}${duplicateHtml}</td><td rowspan="3">${remainingAffixesHtml}</td><td><span class="equipment-build-type affix">词条</span></td><td><div class="equipment-build-progress"><b>${item.completed}/${totalSlots}</b><span><i style="width:${progress}%"></i></span><small>${progress}%</small></div></td>`;
    EQUIPMENT_BUILD_SLOTS.forEach(slot => {
      const selected = affixes[slot.id] || '';
      const duplicate = item.affixAnalysis.duplicateSlotIds.has(slot.id);
      html += `<td><label class="equipment-build-affix-select ${duplicate ? 'duplicate' : ''}"><select aria-label="${escapeGameAttr(item.char)} 的${slot.label}词条" onchange="setEquipmentBuildAffixSlot(decodeURIComponent('${encodedChar}'),'${slot.id}',this.value)">${renderEquipmentBuildAffixOptions(selected)}</select>${duplicate ? '<small>重复无效</small>' : ''}</label></td>`;
    });
    html += '</tr>';
    const emblemProgress = Math.round(item.emblemCompleted / 4 * 100);
    const emblemInput = (key, label, target) => `<label><span>${label}</span><input type="number" min="0" step="1" value="${Math.max(0, Math.floor(Number(emblemAmounts[key]) || 0))}" onchange="setEquipmentBuildCharacterEmblemAmount(decodeURIComponent('${encodedChar}'),'${key}',this.value)"><small>/ ${target}</small></label>`;
    html += `<tr class="equipment-build-character-emblem-row ${rowClass}"><td><span class="equipment-build-type emblem">徽记 / 胚子</span></td><td><div class="equipment-build-progress"><b>${item.emblemCompleted}/4</b><span><i style="width:${emblemProgress}%"></i></span><small>${emblemProgress}%</small></div></td><td colspan="${totalSlots}"><div class="equipment-build-character-emblems">${emblemInput('miriaRequired', '蜜丽亚', emblemPlan.miriaRequired)}${emblemInput('shieldRequired', '重盾守卫', emblemPlan.shieldRequired)}${emblemInput('treeRequired', '树妖', emblemPlan.treeRequired)}${emblemInput('embryo', '胚子', emblemPlan.embryo)}</div></td></tr>`;
    html += `<tr class="equipment-build-loop-row ${rowClass}"><td><span class="equipment-build-type loop">回路</span></td><td><div class="equipment-build-progress"><b>${item.loopCompleted}/${totalSlots}</b><span><i style="width:${loopProgress}%"></i></span><small>${loopProgress}%</small></div></td>`;
    EQUIPMENT_BUILD_SLOTS.forEach(slot => { const value = Number(loops[slot.id]); const selected = Number.isInteger(value) && value >= 1 && value <= 4 ? value : ''; html += `<td><label class="equipment-build-loop-input"><span>${slot.label}</span><select aria-label="${escapeGameAttr(item.char)} 的${slot.label}回路" onchange="toggleEquipmentBuildLoopSlot(decodeURIComponent('${encodedChar}'),'${slot.id}',this.value)"><option value="">—</option>${[1, 2, 3, 4].map(level => `<option value="${level}" ${selected === level ? 'selected' : ''}>${level}</option>`).join('')}</select></label></td>`; });
    html += '</tr>';
  });
  wrap.innerHTML = html + '</tbody></table></div>';
}

function toggleEquipmentBuildCharacter(charName, checked) {
  const selectedChars = getEquipmentBuildSelectedCharSet(getAllChars());
  if (checked) selectedChars.add(charName);
  else selectedChars.delete(charName);
  saveEquipmentBuildSelectedChars();
  renderEquipmentBuild();
}

function setAllEquipmentBuildCharacters(checked) {
  const allCharacters = getAllChars();
  equipmentBuildSelectedChars = checked ? new Set(allCharacters.map(item => item.char)) : new Set();
  saveEquipmentBuildSelectedChars();
  renderEquipmentBuild();
}

function setEquipmentBuildAffixSlot(charName, slotId, value) {
  if (!EQUIPMENT_BUILD_SLOTS.some(slot => slot.id === slotId)) return;
  const affixes = getEquipmentBuildAffixStatus(charName);
  if (EQUIPMENT_BUILD_AFFIXES.includes(value)) affixes[slotId] = value;
  else delete affixes[slotId];
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

function setEquipmentBuildEmblemSlot(charName, slotId, value) {
  if (!EQUIPMENT_BUILD_SLOTS.some(slot => slot.id === slotId)) return;
  const emblems = getEquipmentBuildEmblemSelections(charName);
  if (EQUIPMENT_BUILD_EMBLEMS.some(item => item.name === value)) emblems[slotId] = value;
  else delete emblems[slotId];
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

function setEquipmentBuildEmblemStock(name, value) {
  if (!EQUIPMENT_BUILD_EMBLEMS.some(item => item.name === name)) return;
  const stock = getEquipmentBuildEmblemStock();
  const quantity = Math.max(0, Math.floor(Number(value) || 0));
  stock[name] = quantity;
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

function setEquipmentBuildEmblemPlan(key, value) {
  if (!Object.prototype.hasOwnProperty.call(EQUIPMENT_BUILD_EMBLEM_PLAN_DEFAULTS, key)) return;
  const plan = getEquipmentBuildEmblemPlan();
  plan[key] = Math.max(0, Math.floor(Number(value) || 0));
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

function setEquipmentBuildCharacterEmblemAmount(charName, key, value) {
  if (!['miriaRequired', 'shieldRequired', 'treeRequired', 'embryo'].includes(key)) return;
  const amounts = getEquipmentBuildCharacterEmblems(charName);
  amounts[key] = Math.max(0, Math.floor(Number(value) || 0));
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

function setEquipmentBuildOutput60s(charName, value) {
  const status = getEquipmentBuildStatus(charName);
  const output = Number(value);
  if (value !== '' && Number.isFinite(output) && output >= 0) status.output60s = output;
  else delete status.output60s;
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

function toggleEquipmentBuildSlot(charName, slotId, checked) {
  if (!EQUIPMENT_BUILD_SLOTS.some(slot => slot.id === slotId)) return;
  const status = getEquipmentBuildStatus(charName);
  status[slotId] = !!checked;
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

function toggleEquipmentBuildEmblemSlot(charName, slotId, checked) {
  if (!EQUIPMENT_BUILD_SLOTS.some(slot => slot.id === slotId)) return;
  const emblems = getEquipmentBuildEmblemStatus(charName);
  emblems[slotId] = !!checked;
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

function toggleEquipmentBuildLoopSlot(charName, slotId, value) {
  if (!EQUIPMENT_BUILD_SLOTS.some(slot => slot.id === slotId)) return;
  const loops = getEquipmentBuildLoopStatus(charName);
  const level = parseInt(value, 10);
  if (level >= 1 && level <= 4) loops[slotId] = level;
  else delete loops[slotId];
  saveData(DATA);
  scheduleEquipmentBuildRender();
}

// ==========================================
//  渲染：装备管理页
// ==========================================
function renderEquip() {
  const cfg = DATA.config || {};
  const allChars = getAllChars();
  const accessorySets = cfg.accessorySets || [];
  const armorSets = cfg.armorSets || [];
  const accSlots = cfg.accessorySlots || [];
  const armorSlots = cfg.armorSlots || [];

  let filterHTML = '<button class="game-btn ' + (equipCharFilter===null?'game-btn-blue':'game-btn-outline') + ' game-btn-sm" onclick="equipCharFilter=null;renderEquip();">全部角色</button>';
  allChars.forEach(ch => {
    filterHTML += `<button class="game-btn ${equipCharFilter===ch.char?'game-btn-blue':'game-btn-outline'} game-btn-sm" onclick="equipCharFilter='${ch.char}';renderEquip();">${ch.char}</button>`;
  });
  document.getElementById('gameCharFilter').innerHTML = filterHTML;

  const displayChars = equipCharFilter ? allChars.filter(c => c.char === equipCharFilter) : allChars;

  let html = '<p class="game-equip-note">每个角色分别记录仓库中的未穿戴装备与当前已穿戴装备。未穿戴装备可办理转移，但不会失去来源角色信息。</p>';
  displayChars.forEach(ch => {
    const worn = getCharEquip(ch.char);
    const unworn = getUnwornEquip(ch.char);
    html += `<div class="game-card" style="margin-bottom:20px;">
      <h3><span class="icon">🎮</span> ${ch.char} <span style="font-weight:400;font-size:13px;color:#888;">(${ch.account})</span></h3>
      <div class="game-equip-state-grid"><section><h4>📦 角色仓库 · 未穿戴（可办理转移）</h4>
      ${renderEquipmentTable(unworn, 'acc', '饰品', accessorySets, accSlots, `unworn:${ch.char}`)}
      ${renderEquipmentTable(unworn, 'armor', '防具', armorSets, armorSlots, `unworn:${ch.char}`)}</section>
      <section><h4>🔒 当前已穿戴（不可转移）</h4>
      ${renderEquipmentTable(worn, 'acc', '饰品', accessorySets, accSlots, `worn:${ch.char}`)}
      ${renderEquipmentTable(worn, 'armor', '防具', armorSets, armorSlots, `worn:${ch.char}`)}</section></div>`;
    html += '</div>';
  });

  document.getElementById('gameEquipContent').innerHTML = html;
}

function renderEquipmentTable(equipment, category, label, sets, slots, scope) {
  const titleIcon = category === 'acc' ? '💍' : '🛡️';
  let html = `<div class="game-equipment-table"><h4>${titleIcon} ${label}</h4><div class="game-table-wrap"><table class="game-table"><thead><tr><th>槽位</th>`;
  sets.forEach(set => { html += `<th>${set}</th>`; });
  html += '<th>合计</th></tr></thead><tbody>';
  slots.forEach(slot => {
    if (!equipment[category][slot]) equipment[category][slot] = {};
    html += `<tr><td><strong>${slot}</strong></td>`;
    let total = 0;
    sets.forEach(set => {
      const value = Number(equipment[category][slot][set]) || 0;
      total += value;
      const [state, charName] = scope.split(':');
      const handler = `updateEquipmentState('${state}','${charName}','${category}','${slot}','${set}',this.value)`;
      html += `<td><input type="number" min="0" value="${value}" onchange="${handler}" class="game-num game-num-sm"></td>`;
    });
    html += `<td><strong>${total}</strong></td></tr>`;
  });
  return html + '</tbody></table></div></div>';
}

function updateEquipmentState(state, charName, category, slot, setName, val) {
  const equipment = state === 'worn' ? getCharEquip(charName) : getUnwornEquip(charName);
  if (!equipment[category][slot]) equipment[category][slot] = {};
  equipment[category][slot][setName] = Math.max(0, parseInt(val, 10) || 0);
  saveData(DATA);
  renderDashboard();
  renderEquip();
}

function generateBalancedEquipmentPlan() {
  const cfg = DATA.config || {};
  const chars = getAllChars();
  const plan = [];
  const buildFor = (category, sets, slots) => {
    sets.forEach(setName => {
      const available = [];
      chars.forEach(source => slots.forEach(slot => {
        const count = Number((getUnwornEquip(source.char)[category][slot] || {})[setName]) || 0;
        for (let i = 0; i < count; i++) available.push({ source: source.char, category, slot, setName });
      }));
      const targets = chars.map(ch => {
        const equipment = getCharEquip(ch.char);
        const completed = slots.filter(slot => (Number((equipment[category][slot] || {})[setName]) || 0) > 0).length;
        return { ...ch, completed };
      }).sort((a, b) => b.completed - a.completed || a.char.localeCompare(b.char, 'zh-CN'));

      targets.forEach(target => {
        slots.forEach(slot => {
          const worn = Number((getCharEquip(target.char)[category][slot] || {})[setName]) || 0;
          if (worn > 0) return;
          const index = available.findIndex(item => item.slot === slot);
          if (index < 0) return;
          const item = available.splice(index, 1)[0];
          plan.push({ ...item, target: target.char });
        });
      });
    });
  };
  buildFor('acc', cfg.accessorySets || [], cfg.accessorySlots || []);
  buildFor('armor', cfg.armorSets || [], cfg.armorSlots || []);
  pendingEquipmentPlan = plan;
  renderEquipmentPlan();
}

function renderEquipmentPlan() {
  const wrap = document.getElementById('gameAllocationPlan');
  if (!pendingEquipmentPlan.length) {
    wrap.innerHTML = '<div class="game-allocation-empty">当前仓库装备无法补充新的穿戴缺口。</div>';
    return;
  }
  wrap.innerHTML = `<div class="game-allocation-plan"><div class="game-allocation-head"><strong>建议操作 ${pendingEquipmentPlan.length} 件</strong><button class="game-btn game-btn-blue game-btn-sm" onclick="applyBalancedEquipmentPlan()">确认转移并穿戴</button></div>` + pendingEquipmentPlan.map(item => `<div class="game-allocation-row"><span>${item.category === 'acc' ? '💍' : '🛡️'} ${escapeGameHtml(item.setName)} · ${escapeGameHtml(item.slot)}</span><span><b>${escapeGameHtml(item.source)}</b> 仓库 → <b>${escapeGameHtml(item.target)}</b> 穿戴</span></div>`).join('') + '</div>';
}

function applyBalancedEquipmentPlan() {
  if (!pendingEquipmentPlan.length || !confirm(`确认执行 ${pendingEquipmentPlan.length} 件装备的转移与穿戴？`)) return;
  pendingEquipmentPlan.forEach(item => {
    const source = getUnwornEquip(item.source);
    const target = getCharEquip(item.target);
    const current = Number((source[item.category][item.slot] || {})[item.setName]) || 0;
    if (current <= 0) return;
    source[item.category][item.slot][item.setName] = current - 1;
    if (!target[item.category][item.slot]) target[item.category][item.slot] = {};
    target[item.category][item.slot][item.setName] = (Number(target[item.category][item.slot][item.setName]) || 0) + 1;
  });
  pendingEquipmentPlan = [];
  saveData(DATA);
  renderDashboard();
  renderEquip();
  document.getElementById('gameAllocationPlan').innerHTML = '';
  toast('装备分配与穿戴已更新');
}

// ==========================================
//  伤害知识库与词条优化
// ==========================================
const GAME_OPTIMIZATION_FIELDS = {
  pve: [
    ['基础攻击', 'strength', '力智（数值）', 1], ['基础攻击', 'attack', '攻击力（数值）', 1], ['基础攻击', 'pierceAttack', '破防攻击（数值）', 1],
    ['基础攻击', 'penetration', '穿透（%）', 0.1], ['基础攻击', 'enemyDefense', '敌人防御', 1], ['基础攻击', 'strengthPercent', '力智（%）', 0.1], ['基础攻击', 'attackPercent', '攻击力（%）', 0.1],
    ['输出占比', 'basicShare', '普攻占比（0–1）', 0.01], ['输出占比', 'skillShare', '技伤占比（0–1）', 0.01],
    ['PVE乘区', 'critDamage', '爆伤（%）', 0.1], ['PVE乘区', 'elementStrength', '属强', 0.1], ['PVE乘区', 'damageBonus', '伤害提升（%）', 0.1],
    ['PVE乘区', 'basicAttackDamage', '普攻（%）', 0.1], ['PVE乘区', 'skillDamage', '技伤（%）', 0.1], ['PVE乘区', 'controlDamage', '克制/Boss（%）', 0.1],
    ['PVE乘区', 'equipmentDamage', '装备增伤（%）', 0.1], ['PVE乘区', 'costumeDamage', '装扮增伤（%）', 0.1], ['PVE乘区', 'emblemDamage', '徽记增伤（%）', 0.1],
    ['PVE乘区', 'petDamage', '宠物增伤（%）', 0.1], ['PVE乘区', 'adventureDamage', '冒险团增伤（%）', 0.1], ['PVE乘区', 'circuitDamage', '回路增伤（%）', 0.1],
    ['PVE乘区', 'additionalDamage', '附加伤害（%）', 0.1], ['PVE乘区', 'attributeDamage', '属性伤害（%）', 0.1], ['PVE乘区', 'inscriptionDamage', '拓印增伤（%）', 0.1],
  ],
  pvp: [
    ['基础攻击', 'strength', '力智（数值）', 1], ['基础攻击', 'attack', '攻击力（数值）', 1], ['基础攻击', 'pierceAttack', '破防攻击（数值）', 1],
    ['基础攻击', 'penetration', '穿透（%）', 0.1], ['基础攻击', 'enemyDefense', '敌人防御', 1], ['基础攻击', 'strengthPercent', '力智（%）', 0.1], ['基础攻击', 'attackPercent', '攻击力（%）', 0.1],
    ['PVP进攻', 'critRate', '暴击率（%）', 0.1], ['PVP进攻', 'critDamage', '爆伤（%）', 0.1], ['PVP进攻', 'elementStrength', '属强', 0.1], ['PVP进攻', 'enemyElementResistance', '敌人属抗', 0.1],
    ['PVP进攻', 'damageBonus', '伤害提升（%）', 0.1], ['PVP进攻', 'enemyDamageResistance', '敌人伤害抵抗（%）', 0.1], ['PVP进攻', 'skillDamage', '技伤（%）', 0.1],
    ['PVP进攻', 'controlDamage', '克制异常（%）', 0.1], ['PVP进攻', 'emblemDamage', '徽记增伤（%）', 0.1], ['PVP进攻', 'adventureDamage', '冒险团增伤（%）', 0.1],
    ['PVP进攻', 'circuitDamage', '回路增伤（%）', 0.1], ['PVP进攻', 'attributeDamage', '全属性伤害（%）', 0.1],
    ['PVP防守', 'ownElementResistance', '己方属抗', 0.1], ['PVP防守', 'ownDamageResistance', '己方伤害抵抗（%）', 0.1], ['PVP防守', 'enemyElementStrength', '敌人属强', 0.1],
    ['PVP防守', 'enemyDamageBonus', '敌人伤害提升（%）', 0.1], ['PVP防守', 'baseHealth', '基础生命（%）', 0.1],
  ],
};

const GAME_OPTIMIZATION_CANDIDATE_KEYS = {
  pve: ['strength', 'attack', 'pierceAttack', 'penetration', 'strengthPercent', 'attackPercent', 'critDamage', 'elementStrength', 'damageBonus', 'basicAttackDamage', 'skillDamage', 'controlDamage', 'equipmentDamage', 'costumeDamage', 'emblemDamage', 'petDamage', 'adventureDamage', 'circuitDamage', 'additionalDamage', 'attributeDamage', 'inscriptionDamage'],
  pvp: ['strength', 'attack', 'pierceAttack', 'penetration', 'strengthPercent', 'attackPercent', 'critRate', 'critDamage', 'elementStrength', 'damageBonus', 'skillDamage', 'controlDamage', 'emblemDamage', 'adventureDamage', 'circuitDamage', 'attributeDamage'],
};

function cloneOfficialProfile() {
  return JSON.parse(JSON.stringify(DEFAULT_GAME_OPTIMIZATION_PROFILE));
}

function migrateOptimizationProfile(profile) {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) return cloneOfficialProfile();
  if (profile.pve && profile.pvp) return profile;
  const legacy = profile.stats && typeof profile.stats === 'object' ? profile.stats : {};
  const migrated = cloneOfficialProfile();
  const mapLegacy = (target, source, key) => { if (Number.isFinite(Number(legacy[source]))) target[key] = Number(legacy[source]); };
  mapLegacy(migrated.pve, 'physicalAttack', 'attack');
  mapLegacy(migrated.pve, 'critDamage', 'critDamage');
  mapLegacy(migrated.pve, 'fireStrength', 'elementStrength');
  mapLegacy(migrated.pve, 'damageBonus', 'damageBonus');
  mapLegacy(migrated.pve, 'skillDamage', 'skillDamage');
  if (Number.isFinite(Number(legacy.bossDamage)) || Number.isFinite(Number(legacy.abnormalDamage))) migrated.pve.controlDamage = Number(legacy.bossDamage || 0) + Number(legacy.abnormalDamage || 0);
  mapLegacy(migrated.pvp, 'physicalAttack', 'attack');
  mapLegacy(migrated.pvp, 'critRate', 'critRate');
  mapLegacy(migrated.pvp, 'critDamage', 'critDamage');
  mapLegacy(migrated.pvp, 'fireStrength', 'elementStrength');
  mapLegacy(migrated.pvp, 'damageBonus', 'damageBonus');
  mapLegacy(migrated.pvp, 'skillDamage', 'skillDamage');
  if (Number.isFinite(Number(legacy.bossDamage)) || Number.isFinite(Number(legacy.abnormalDamage))) migrated.pvp.controlDamage = Number(legacy.bossDamage || 0) + Number(legacy.abnormalDamage || 0);
  if (Array.isArray(profile.equippedAffixes) && profile.equippedAffixes.length) migrated.equippedAffixes = profile.equippedAffixes;
  return migrated;
}

function getGameOptimizationProfile() {
  DATA.optimizationProfile = migrateOptimizationProfile(DATA.optimizationProfile);
  const profile = DATA.optimizationProfile;
  profile.schemaVersion = 2;
  if (!['pve', 'pvp'].includes(profile.mode)) profile.mode = 'pve';
  ['pve', 'pvp'].forEach(mode => {
    if (!profile[mode] || typeof profile[mode] !== 'object' || Array.isArray(profile[mode])) profile[mode] = {};
    const defaults = DEFAULT_GAME_OPTIMIZATION_PROFILE[mode];
    Object.entries(defaults).forEach(([key, value]) => {
      if (!Number.isFinite(Number(profile[mode][key]))) profile[mode][key] = value;
    });
  });
  if (!Array.isArray(profile.equippedAffixes) || !profile.equippedAffixes.length) profile.equippedAffixes = JSON.parse(JSON.stringify(DEFAULT_GAME_OPTIMIZATION_PROFILE.equippedAffixes));
  return profile;
}

function numeric(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function clampNumber(value, min = 0, max = Infinity) {
  return Math.min(max, Math.max(min, numeric(value)));
}

function getOfficialAttackIndex(stats, delta = {}) {
  const strengthPercent = clampNumber(stats.strengthPercent) + numeric(delta.strengthPercent);
  const attackPercent = clampNumber(stats.attackPercent) + numeric(delta.attackPercent);
  const baseStrength = numeric(stats.strength) / Math.max(0.0001, 1 + clampNumber(stats.strengthPercent) / 100);
  const strength = Math.max(0, baseStrength + numeric(delta.strength)) * (1 + strengthPercent / 100);
  const baseAttack = numeric(stats.attack) / Math.max(0.0001, 1 + clampNumber(stats.attackPercent) / 100) / Math.max(0.0001, 1 + numeric(stats.strength) * 0.001);
  const effectiveBaseAttack = Math.max(0, baseAttack + numeric(delta.attack)) * (1 + attackPercent / 100) * (1 + strength * 0.001);
  const effectivePierceAttack = Math.max(0, numeric(stats.pierceAttack) + numeric(delta.pierceAttack));
  const penetration = clampNumber(numeric(stats.penetration) + numeric(delta.penetration), 0, 100) / 100;
  const defense = Math.max(0, numeric(stats.enemyDefense));
  const normalAttack = effectiveBaseAttack * 3500 / (3500 + defense * (1 - penetration));
  return Math.max(0, normalAttack + effectivePierceAttack);
}

function getPvpCritFactor(stats, delta = {}) {
  const rate = clampNumber(numeric(stats.critRate) + numeric(delta.critRate), 0, 100) / 100;
  const damage = Math.max(0, numeric(stats.critDamage) + numeric(delta.critDamage));
  return 1 + rate * damage / 100;
}

function getPveMultiplier(stats, delta = {}) {
  const bucket = key => 1 + numeric(delta[key]) / (100 + numeric(stats[key]));
  const share = key => clampNumber(stats[key], 0, 1);
  const weightedBasicSkill = 1 + numeric(delta.basicAttackDamage) / (100 + numeric(stats.basicAttackDamage)) * share('basicShare') + numeric(delta.skillDamage) / (100 + numeric(stats.skillDamage)) * share('skillShare');
  return bucket('critDamage') * (1 + numeric(delta.elementStrength) / (220 + numeric(stats.elementStrength))) * bucket('damageBonus') * weightedBasicSkill * bucket('controlDamage') * bucket('equipmentDamage') * bucket('costumeDamage') * bucket('emblemDamage') * bucket('petDamage') * bucket('adventureDamage') * bucket('circuitDamage') * bucket('additionalDamage') * bucket('attributeDamage') * (1 + numeric(delta.inscriptionDamage) / 100);
}

function getPvpMultiplier(stats, delta = {}) {
  const bucket = key => 1 + numeric(delta[key]) / (100 + numeric(stats[key]));
  const elementBase = 1 + (numeric(stats.elementStrength) - numeric(stats.enemyElementResistance)) / 220;
  const elementNext = 1 + (numeric(stats.elementStrength) + numeric(delta.elementStrength) - numeric(stats.enemyElementResistance)) / 220;
  const damageBase = 1 + (numeric(stats.damageBonus) - numeric(stats.enemyDamageResistance)) / 100;
  const damageNext = 1 + (numeric(stats.damageBonus) + numeric(delta.damageBonus) - numeric(stats.enemyDamageResistance)) / 100;
  return getPvpCritFactor(stats, delta) / getPvpCritFactor(stats) * (elementNext / Math.max(0.0001, elementBase)) * (damageNext / Math.max(0.0001, damageBase)) * bucket('skillDamage') * bucket('controlDamage') * bucket('emblemDamage') * bucket('adventureDamage') * bucket('circuitDamage') * bucket('attributeDamage');
}

function getPvpTakenIndex(stats) {
  const elementTaken = Math.max(0.0001, 1 + (numeric(stats.enemyElementStrength) - numeric(stats.ownElementResistance)) / 220);
  const damageTaken = Math.max(0.0001, 1 + (numeric(stats.enemyDamageBonus) - numeric(stats.ownDamageResistance)) / 100);
  const health = Math.max(0.0001, 1 + numeric(stats.baseHealth) / 100);
  return elementTaken * damageTaken / health;
}

function getOfficialAttributeGain(mode, stats, key, addedValue = 1, source = 'general') {
  const delta = { [key]: numeric(addedValue) };
  const attackRatio = getOfficialAttackIndex(stats, delta) / Math.max(0.0001, getOfficialAttackIndex(stats));
  const multiplier = mode === 'pvp' ? getPvpMultiplier(stats, delta) : getPveMultiplier(stats, delta);
  const gain = (attackRatio * multiplier - 1) * 100;
  return source === 'circuit' && mode === 'pvp' ? gain * 0.5 : gain;
}

function getGameOptimizationCandidates(profile) {
  const mode = profile.mode;
  const stats = profile[mode];
  const fields = Object.fromEntries(GAME_OPTIMIZATION_FIELDS[mode].map(([, key, label]) => [key, label]));
  const candidateLabels = { strength: '基础力智 +1', attack: '基础攻击力 +1', pierceAttack: '破防攻击 +1', penetration: '穿透 +1个百分点', strengthPercent: '力智 +1个百分点', attackPercent: '攻击力 +1个百分点' };
  return GAME_OPTIMIZATION_CANDIDATE_KEYS[mode].filter(key => fields[key]).map(key => {
    const source = key === 'circuitDamage' ? 'circuit' : 'general';
    const amount = 1;
    return {
      key,
      name: candidateLabels[key] || `${fields[key]} +${amount}`,
      gain: getOfficialAttributeGain(mode, stats, key, amount, source),
      condition: source === 'circuit' && mode === 'pvp' ? 'PVP回路官方最终提升×0.5' : '按官方工作簿当前面板边际公式',
      group: source === 'circuit' ? '回路' : mode.toUpperCase(),
    };
  }).sort((left, right) => right.gain - left.gain || left.name.localeCompare(right.name, 'zh-CN'));
}

function getEquippedAffixAdvice(primary, secondary) {
  const text = `${String(primary || '')} ${String(secondary || '')}`;
  const categories = [];
  if (/Boss|克制|异常/.test(text)) categories.push('克制');
  if (/爆伤|暴击伤害/.test(text)) categories.push('爆伤');
  if (/暴击率/.test(text)) categories.push('暴击率');
  if (/普攻/.test(text)) categories.push('普攻');
  if (/技能伤害|技伤/.test(text)) categories.push('技伤');
  if (/伤害提升/.test(text)) categories.push('伤害提升');
  if (/属强/.test(text)) categories.push('属强');
  if (/属性伤害/.test(text)) categories.push('属性伤害');
  if (/攻击力|力量|智力|破防|穿透/.test(text)) categories.push('基础攻击');
  if (categories.length) return ['unverified', [...new Set(categories)].join(' / '), '各项需分别录入对应官方字段后整体计算'];
  return ['unverified', '待量化', '官方工作簿未提供该词条的固定倍率'];
}

function renderOptimizationStats(mode, stats) {
  let lastGroup = '';
  return GAME_OPTIMIZATION_FIELDS[mode].map(([group, key, label, step]) => {
    const heading = group !== lastGroup ? `<h4 class="optimization-stat-group-title">${escapeGameHtml(group)}</h4>` : '';
    lastGroup = group;
    const max = /Share/.test(key) ? 1 : '';
    return `${heading}<label><span>${escapeGameHtml(label)}</span><input type="number" step="${step}" min="0" ${max !== '' ? `max="${max}"` : ''} value="${numeric(stats[key])}" onchange="setGameOptimizationStat('${key}',this.value)"></label>`;
  }).join('');
}

function renderGameKnowledgeBase() {
  const profile = getGameOptimizationProfile();
  const mode = profile.mode;
  const stats = profile[mode];
  const candidates = getGameOptimizationCandidates(profile);
  const statsHtml = renderOptimizationStats(mode, stats);
  const affixesHtml = profile.equippedAffixes.map((item, index) => {
    const [className, label, note] = getEquippedAffixAdvice(item.primary, item.secondary);
    return `<tr><td><strong>${escapeGameHtml(item.slot)}</strong></td><td><input value="${escapeGameAttr(item.primary)}" onchange="setGameOptimizationAffix(${index},'primary',this.value)"></td><td><input value="${escapeGameAttr(item.secondary)}" onchange="setGameOptimizationAffix(${index},'secondary',this.value)"></td><td><span class="optimization-advice ${className}">${label}</span><small>${escapeGameHtml(note)}</small></td></tr>`;
  }).join('');
  const candidatesHtml = candidates.map((item, index) => `<article><span class="optimization-rank">${index + 1}</span><div><strong>${escapeGameHtml(item.name)}</strong><small>${escapeGameHtml(item.group)} · ${escapeGameHtml(item.condition)}</small></div><b>+${item.gain.toFixed(3)}%</b></article>`).join('');
  const attackIndex = getOfficialAttackIndex(stats);
  const baseAttack = Math.max(0.0001, numeric(stats.attack) * 3500 / (3500 + numeric(stats.enemyDefense) * (1 - clampNumber(stats.penetration, 0, 100) / 100)));
  const attackShare = attackIndex > 0 ? baseAttack / attackIndex * 100 : 0;
  const modeCards = mode === 'pvp'
    ? `<div><small>暴击期望倍率</small><strong>${getPvpCritFactor(stats).toFixed(4)}</strong></div><div><small>有效属强</small><strong>${(numeric(stats.elementStrength) - numeric(stats.enemyElementResistance)).toFixed(1)}</strong></div><div><small>有效伤害提升</small><strong>${(numeric(stats.damageBonus) - numeric(stats.enemyDamageResistance)).toFixed(1)}%</strong></div><div><small>承伤指数</small><strong>${getPvpTakenIndex(stats).toFixed(4)}</strong></div>`
    : `<div><small>有效攻击指数</small><strong>${attackIndex.toFixed(1)}</strong></div><div><small>普通攻击占比</small><strong>${attackShare.toFixed(1)}%</strong></div><div><small>属强</small><strong>${numeric(stats.elementStrength).toFixed(1)}</strong></div><div><small>克制乘区</small><strong>${numeric(stats.controlDamage).toFixed(1)}%</strong></div>`;
  document.getElementById('gameKnowledgeContent').innerHTML = `
    <section class="optimization-mode-switch"><strong>官方计算模式</strong><button class="game-btn ${mode === 'pve' ? 'game-btn-blue' : 'game-btn-outline'} game-btn-sm" type="button" onclick="setGameOptimizationMode('pve')">PVE 6.20</button><button class="game-btn ${mode === 'pvp' ? 'game-btn-blue' : 'game-btn-outline'} game-btn-sm" type="button" onclick="setGameOptimizationMode('pvp')">PVP 6.20</button><span>公式来自你提供的官方工作簿；PVP回路属性最终提升按50%处理。</span></section>
    <section class="optimization-overview">${modeCards}</section>
    <div class="optimization-layout"><section class="game-card"><h3>📊 ${mode.toUpperCase()} 官方输入</h3><div class="optimization-stats">${statsHtml}</div></section><section class="game-card"><h3>🧭 官方边际收益排行</h3><p class="game-setting-help">每项按“增加1点属性”计算；不同属性的实际可获得数值不同，不能只按名次跨属性兑换。</p><div class="optimization-ranking">${candidatesHtml}</div></section></div>
    <section class="game-card"><h3>🧩 当前装备词条映射</h3><p class="game-setting-help">这里只做官方乘区映射，不再使用未经官方表验证的固定保留/替换结论。</p><div class="game-table-wrap"><table class="game-table optimization-affix-table"><thead><tr><th>部位</th><th>当前主词条</th><th>当前次词条/属性摘要</th><th>官方归类</th></tr></thead><tbody>${affixesHtml}</tbody></table></div></section>
    <section class="game-card"><div class="knowledge-heading"><div><h3>📚 可编辑官方知识文档</h3><p>重置会恢复三份官方工作簿对应的公式版本。</p></div><div><button class="game-btn game-btn-blue" type="button" onclick="saveGameKnowledgeBase()">保存知识库</button><button class="game-btn game-btn-outline" type="button" onclick="resetGameKnowledgeBase()">恢复官方版本</button></div></div><textarea id="gameKnowledgeEditor" class="game-knowledge-editor">${escapeGameHtml(DATA.knowledgeBase || DEFAULT_GAME_KNOWLEDGE_BASE)}</textarea></section>`;
}

// ==========================================
//  一次性角色成就
// ==========================================
function getAchievementTasks() {
  if (!Array.isArray(DATA.config?.achievementTasks)) DATA.config.achievementTasks = [];
  DATA.config.achievementTasks = DATA.config.achievementTasks.filter(task => task?.id && task?.name);
  return DATA.config.achievementTasks;
}

function getWeeklyAchievementTasks() {
  if (!Array.isArray(DATA.config?.weeklyAchievementTasks)) DATA.config.weeklyAchievementTasks = [];
  DATA.config.weeklyAchievementTasks = DATA.config.weeklyAchievementTasks.filter(task => task?.id && task?.name);
  return DATA.config.weeklyAchievementTasks;
}

function getCharacterAchievementProgress(charName) {
  if (!DATA.achievementProgress || typeof DATA.achievementProgress !== 'object' || Array.isArray(DATA.achievementProgress)) DATA.achievementProgress = {};
  if (!DATA.achievementProgress[charName] || typeof DATA.achievementProgress[charName] !== 'object' || Array.isArray(DATA.achievementProgress[charName])) DATA.achievementProgress[charName] = {};
  return DATA.achievementProgress[charName];
}

function getAchievementWeekKey(dateStr = getTodayStr()) {
  return getWeekDates(dateStr)[0]?.iso || dateStr;
}

function getWeeklyAchievementProgress(charName, dateStr = getTodayStr()) {
  const weekKey = getAchievementWeekKey(dateStr);
  if (!DATA.weeklyAchievementProgress || typeof DATA.weeklyAchievementProgress !== 'object' || Array.isArray(DATA.weeklyAchievementProgress)) DATA.weeklyAchievementProgress = {};
  if (!DATA.weeklyAchievementProgress[weekKey] || typeof DATA.weeklyAchievementProgress[weekKey] !== 'object' || Array.isArray(DATA.weeklyAchievementProgress[weekKey])) DATA.weeklyAchievementProgress[weekKey] = {};
  if (!DATA.weeklyAchievementProgress[weekKey][charName] || typeof DATA.weeklyAchievementProgress[weekKey][charName] !== 'object' || Array.isArray(DATA.weeklyAchievementProgress[weekKey][charName])) DATA.weeklyAchievementProgress[weekKey][charName] = {};
  return DATA.weeklyAchievementProgress[weekKey][charName];
}

function getCharacterRaidFirstTasks(charName) {
  const meta = getRosterMeta(charName);
  const tasks = getAchievementTasks().filter(task => task.category === 'raid-first');
  if (!tasks.length) return [];
  const start = ((meta?.accountIndex || 0) + (meta?.charIndex || 0)) % tasks.length;
  return [...tasks.slice(start), ...tasks.slice(0, start)];
}

function getCharacterAchievementTasks(charName) {
  const regular = getAchievementTasks().filter(task => task.category !== 'raid-first');
  return [...regular, ...getCharacterRaidFirstTasks(charName)];
}

function getEliteProgress(charName) {
  if (!DATA.eliteProgress || typeof DATA.eliteProgress !== 'object' || Array.isArray(DATA.eliteProgress)) DATA.eliteProgress = {};
  if (!DATA.eliteProgress[charName] || typeof DATA.eliteProgress[charName] !== 'object' || Array.isArray(DATA.eliteProgress[charName])) DATA.eliteProgress[charName] = { lastCompleted: '' };
  return DATA.eliteProgress[charName];
}

function getEliteStatus(charName, dateStr = getTodayStr()) {
  const lastCompleted = getEliteProgress(charName).lastCompleted || '';
  const nextDue = lastCompleted ? addIsoDays(lastCompleted, getSchedulingConstraints().eliteIntervalDays) : dateStr;
  const remainingDays = Math.ceil(((new Date(`${nextDue}T00:00:00`)).getTime() - (new Date(`${dateStr}T00:00:00`)).getTime()) / 86400000);
  return { lastCompleted, nextDue, remainingDays, due: !lastCompleted || nextDue <= dateStr, overdue: !!lastCompleted && nextDue < dateStr };
}

function completeEliteProgress(encodedCharName) {
  const charName = decodeURIComponent(encodedCharName);
  if (!getAllChars().some(item => item.char === charName)) return;
  getEliteProgress(charName).lastCompleted = getTodayStr();
  saveData(DATA);
  renderAchievements();
  toast(`${charName}：精英进度已完成，下次${getSchedulingConstraints().eliteIntervalDays}天后到期`);
}

function clearEliteProgress(encodedCharName) {
  const charName = decodeURIComponent(encodedCharName);
  getEliteProgress(charName).lastCompleted = '';
  saveData(DATA);
  renderAchievements();
}

function toggleWeeklyAchievement(encodedCharName, encodedTaskId, checked) {
  const charName = decodeURIComponent(encodedCharName);
  const taskId = decodeURIComponent(encodedTaskId);
  if (!getAllChars().some(item => item.char === charName) || !getWeeklyAchievementTasks().some(task => task.id === taskId)) return;
  getWeeklyAchievementProgress(charName)[taskId] = !!checked;
  saveData(DATA);
  renderAchievements();
}

function toggleCharacterAchievement(encodedCharName, encodedTaskId, checked) {
  const charName = decodeURIComponent(encodedCharName);
  const taskId = decodeURIComponent(encodedTaskId);
  if (!getAllChars().some(item => item.char === charName) || !getAchievementTasks().some(task => task.id === taskId)) return;
  getCharacterAchievementProgress(charName)[taskId] = !!checked;
  saveData(DATA);
  renderAchievements();
}

function setAllCharacterAchievements(encodedCharName, completed) {
  const charName = decodeURIComponent(encodedCharName);
  const progress = getCharacterAchievementProgress(charName);
  getAchievementTasks().forEach(task => { progress[task.id] = !!completed; });
  saveData(DATA);
  renderAchievements();
}

function setAchievementFilter(mode) {
  achievementFilterMode = mode || 'all';
  renderAchievements();
}

function renderAchievements() {
  const wrap = document.getElementById('achievementContent');
  if (!wrap) return;
  const tasks = getAchievementTasks();
  const weeklyTasks = getWeeklyAchievementTasks();
  const allChars = getAllChars();
  const total = allChars.length * tasks.length;
  const completed = allChars.reduce((sum, item) => sum + tasks.filter(task => getCharacterAchievementProgress(item.char)[task.id]).length, 0);
  const weekKey = getAchievementWeekKey();
  const overall = document.getElementById('achievementOverallProgress');
  if (overall) overall.textContent = `${completed}/${total}`;
  if (!tasks.length) { wrap.innerHTML = '<div class="achievement-empty">请先在设置页添加成就任务。</div>'; return; }
  if (!allChars.length) { wrap.innerHTML = '<div class="achievement-empty">请先在设置页添加角色。</div>'; return; }
  const weeklySummary = weeklyTasks.map(task => {
    const count = allChars.filter(item => getWeeklyAchievementProgress(item.char)[task.id]).length;
    return `<button type="button" class="${achievementFilterMode === `weekly:${task.id}` ? 'active' : ''}" onclick="setAchievementFilter('weekly:${escapeGameAttr(task.id)}')"><span>${task.icon || '🔁'} ${escapeGameHtml(task.name)}</span><strong>${count}/${allChars.length}</strong><small>本周 · 周一刷新</small></button>`;
  }).join('');
  const summaryHtml = `<section class="achievement-summary"><button type="button" class="${achievementFilterMode === 'all' ? 'active' : ''}" onclick="setAchievementFilter('all')"><span>永久成就总完成度</span><strong>${total ? Math.round(completed / total * 100) : 0}%</strong><small>显示全部</small></button><button type="button" class="${achievementFilterMode === 'elite' ? 'active' : ''}" onclick="setAchievementFilter('elite')"><span>👑 精英进度到期</span><strong>${allChars.filter(item => getEliteStatus(item.char).due).length}/${allChars.length}</strong><small>每${getSchedulingConstraints().eliteIntervalDays}天一次</small></button>${weeklySummary}${tasks.map(task => { const count = allChars.filter(item => getCharacterAchievementProgress(item.char)[task.id]).length; return `<button type="button" class="${achievementFilterMode === `task:${task.id}` ? 'active' : ''}" onclick="setAchievementFilter('task:${escapeGameAttr(task.id)}')"><span>${task.icon || '🏆'} ${escapeGameHtml(task.name)}</span><strong>${count}/${allChars.length}</strong><small>永久一次</small></button>`; }).join('')}</section>`;
  const selectedTask = achievementFilterMode.startsWith('task:') ? tasks.find(task => task.id === achievementFilterMode.slice(5)) : null;
  const selectedWeeklyTask = achievementFilterMode.startsWith('weekly:') ? weeklyTasks.find(task => task.id === achievementFilterMode.slice(7)) : null;
  if (!['all', 'elite'].includes(achievementFilterMode) && !selectedTask && !selectedWeeklyTask) achievementFilterMode = 'all';
  const accountsHtml = (DATA.config?.accounts || []).map((account, accountIndex) => {
    const characters = (account.chars || []).map(charName => {
      const progress = getCharacterAchievementProgress(charName);
      const characterTasks = getCharacterAchievementTasks(charName);
      const done = characterTasks.filter(task => progress[task.id]).length;
      const raidFirstTasks = getCharacterRaidFirstTasks(charName);
      const nextRaidFirstId = raidFirstTasks.find(task => !progress[task.id])?.id || '';
      const elite = getEliteStatus(charName);
      const encodedChar = encodeURIComponent(charName);
      const taskHtml = (selectedTask ? [selectedTask] : characterTasks).map(task => {
        const encodedTask = encodeURIComponent(task.id);
        const current = task.id === nextRaidFirstId;
        return `<label class="achievement-task ${progress[task.id] ? 'complete' : ''} ${current ? 'current' : ''}"><input type="checkbox" class="game-check" ${progress[task.id] ? 'checked' : ''} onchange="toggleCharacterAchievement('${encodedChar}','${encodedTask}',this.checked)"><span>${task.icon || '🏆'}</span><strong>${escapeGameHtml(task.name)}</strong><small>${progress[task.id] ? '永久完成' : current ? '当前轮换' : '待完成'}</small></label>`;
      }).join('');
      const eliteText = elite.due ? (elite.overdue ? `逾期${Math.abs(elite.remainingDays)}天` : '今天到期') : `剩${elite.remainingDays}天`;
      const eliteHtml = `<section class="elite-progress ${elite.due ? 'due' : ''}"><div><span>👑 精英进度</span><strong>${eliteText}</strong><small>${elite.lastCompleted ? `上次 ${elite.lastCompleted} · 下次 ${elite.nextDue}` : '尚未记录通关'}</small></div><button type="button" onclick="completeEliteProgress('${encodedChar}')">完成本轮</button>${elite.lastCompleted ? `<button class="clear" type="button" onclick="clearEliteProgress('${encodedChar}')">清除</button>` : ''}</section>`;
      const weeklyHtml = (selectedWeeklyTask ? [selectedWeeklyTask] : weeklyTasks).map(task => {
        const encodedTask = encodeURIComponent(task.id);
        const complete = !!getWeeklyAchievementProgress(charName)[task.id];
        return `<label class="achievement-task achievement-weekly-task ${complete ? 'complete' : ''}"><input type="checkbox" class="game-check" ${complete ? 'checked' : ''} onchange="toggleWeeklyAchievement('${encodedChar}','${encodedTask}',this.checked)"><span>${task.icon || '🔁'}</span><strong>${escapeGameHtml(task.name)}</strong><small>${complete ? '本周完成' : `本周待完成 · ${weekKey}`}</small></label>`;
      }).join('');
      const bodyHtml = achievementFilterMode === 'elite'
        ? eliteHtml
        : selectedWeeklyTask
          ? `<div class="achievement-task-list achievement-filtered-list">${weeklyHtml}</div>`
          : `<div class="achievement-task-list">${taskHtml}${weeklyHtml}</div>${eliteHtml}${achievementFilterMode === 'all' ? `<button type="button" onclick="setAllCharacterAchievements('${encodedChar}',${done === tasks.length ? 'false' : 'true'})">${done === tasks.length ? '取消全部首通/成就' : '一键完成全部首通/成就'}</button>` : ''}`;
      const visibleDone = selectedTask ? Number(!!progress[selectedTask.id]) : selectedWeeklyTask ? Number(!!getWeeklyAchievementProgress(charName)[selectedWeeklyTask.id]) : achievementFilterMode === 'elite' ? Number(!elite.due) : done;
      const visibleTotal = selectedTask || selectedWeeklyTask || achievementFilterMode === 'elite' ? 1 : tasks.length;
      return `<article class="achievement-character-card ${visibleDone === visibleTotal ? 'complete' : ''}"><header><div><span>${escapeGameHtml(getRosterMeta(charName)?.charCode || '')}</span><strong>${escapeGameHtml(charName)}</strong></div><b>${visibleDone}/${visibleTotal}</b></header>${bodyHtml}</article>`;
    }).join('');
    return `<section class="achievement-account"><div class="achievement-account-head"><span>${escapeGameHtml(DATA.config?.accountCodePlan?.[accountIndex] || `账号${accountIndex + 1}`)}</span><div><strong>${escapeGameHtml(account.name)}</strong><small>${(account.chars || []).length}个角色</small></div></div><div class="achievement-character-grid">${characters}</div></section>`;
  }).join('');
  wrap.innerHTML = `${summaryHtml}${accountsHtml}`;
}

function updateAchievementTask(index, field, value) {
  const task = getAchievementTasks()[index];
  if (!task || !['name', 'icon'].includes(field)) return;
  task[field] = String(value || '').trim() || (field === 'icon' ? '🏆' : `成就${index + 1}`);
  saveData(DATA);
  renderSettings();
}

function addAchievementTask() {
  const tasks = getAchievementTasks();
  let number = tasks.length + 1;
  const usedIds = new Set(tasks.map(task => task.id));
  let id = `achievement-${number}`;
  while (usedIds.has(id)) id = `achievement-${++number}`;
  tasks.push({ id, name: `新成就${number}`, icon: '🏆' });
  saveData(DATA);
  renderSettings();
}

function removeAchievementTask(index) {
  const task = getAchievementTasks()[index];
  if (!task || !confirm(`确定删除成就“${task.name}”吗？所有角色对应的完成记录也会删除。`)) return;
  DATA.config.achievementTasks.splice(index, 1);
  Object.values(DATA.achievementProgress || {}).forEach(progress => { if (progress) delete progress[task.id]; });
  saveData(DATA);
  renderSettings();
}

function setGameOptimizationMode(mode) {
  if (!['pve', 'pvp'].includes(mode)) return;
  getGameOptimizationProfile().mode = mode;
  saveData(DATA);
  renderGameKnowledgeBase();
}

function setGameOptimizationStat(key, value) {
  const profile = getGameOptimizationProfile();
  if (!GAME_OPTIMIZATION_FIELDS[profile.mode].some(field => field[1] === key)) return;
  profile[profile.mode][key] = Math.max(0, Number(value) || 0);
  saveData(DATA);
  renderGameKnowledgeBase();
}

function setGameOptimizationAffix(index, field, value) {
  if (!['primary', 'secondary'].includes(field)) return;
  const item = getGameOptimizationProfile().equippedAffixes[index];
  if (!item) return;
  item[field] = String(value || '').trim();
  saveData(DATA);
  renderGameKnowledgeBase();
}

function saveGameKnowledgeBase() {
  const editor = document.getElementById('gameKnowledgeEditor');
  if (!editor) return;
  DATA.knowledgeBase = editor.value.trim() || DEFAULT_GAME_KNOWLEDGE_BASE;
  DATA.knowledgeBaseVersion = GAME_KNOWLEDGE_BASE_VERSION;
  saveData(DATA);
  toast('📚 游戏知识库已保存');
}

function resetGameKnowledgeBase() {
  if (!confirm('恢复官方知识库版本？你手动编辑的文档内容会被替换。')) return;
  DATA.knowledgeBase = DEFAULT_GAME_KNOWLEDGE_BASE;
  DATA.knowledgeBaseVersion = GAME_KNOWLEDGE_BASE_VERSION;
  saveData(DATA);
  renderGameKnowledgeBase();
  toast('知识库已恢复为官方版本');
}

// ==========================================
//  渲染：设置页
// ==========================================
function renderSettings() {
  const cfg = DATA.config || {};
  let accHTML = '';
  (cfg.accounts || []).forEach((acc, ai) => {
    const characterRows = (acc.chars || []).map((charName, ci) => `<div class="game-character-config-row">
      <span class="roster-code">${escapeGameHtml(cfg.characterCodePlan?.[ai]?.[ci] || '')}</span>
      <label>角色名：</label>
      <input type="text" value="${escapeGameAttr(charName)}" onchange="renameCharacter(${ai},${ci},this.value)" class="game-txt game-txt-wider" placeholder="角色名称">
      <label>大区：</label>
      <select class="game-txt" onchange="setCharacterRegion(decodeURIComponent('${encodeURIComponent(charName)}'),this.value)"><option value="region1" ${getCharacterRegion(charName) === 'region1' ? 'selected' : ''}>1大区</option><option value="region2" ${getCharacterRegion(charName) === 'region2' ? 'selected' : ''}>2大区</option></select>
      <label>UID：</label>
      <input type="text" value="${escapeGameAttr((acc.charUids || {})[charName] || '')}" onchange="updateCharUid(${ai},${ci},this.value)" class="game-txt game-txt-wider" placeholder="该角色的交易 UID">
      <button class="game-btn game-btn-danger game-btn-sm" type="button" onclick="removeCharacter(${ai},${ci})">删除角色</button>
    </div>`).join('');
    accHTML += `<section class="game-account-config">
      <div class="game-account-config-head">
        <span class="roster-code">${escapeGameHtml(cfg.accountCodePlan?.[ai] || '')}</span>
        <label>账号名：</label>
        <input type="text" value="${escapeGameAttr(acc.name)}" onchange="updateAccName(${ai},this.value)" class="game-txt game-txt-wider">
        <span class="account-device-badge">${escapeGameHtml(cfg.accountDevicePlan?.[ai] || '')}上线</span>
        <button class="game-btn game-btn-danger game-btn-sm" type="button" onclick="removeAccount(${ai})">删除账号</button>
      </div>
      <div class="game-account-characters">
        <div class="game-account-characters-title"><strong>角色清单</strong><small>修改会自动保存；角色名不能和其他账号重复。</small></div>
        ${characterRows || '<div class="game-character-empty">当前账号还没有角色。</div>'}
        <button class="game-btn game-btn-outline game-btn-sm" type="button" onclick="addCharacterToAccount(${ai})">+ 添加角色</button>
      </div>
    </section>`;
  });
  document.getElementById('accountsInput').innerHTML = accHTML;

  const constraints = getSchedulingConstraints();
  const storage = getDeviceAccountStoragePlan();
  const constraintRows = [
    ['设备容量', `每台最多存储 ${constraints.deviceAccountLimit} 个账号（同账号多角色只算1个）`],
    ['专用设备', `${Object.entries(constraints.requiredAccountDevices).map(([account, device]) => `${account}只能在${device}登录`).join('；') || '当前没有账号限定专用设备'}`],
    ['日常体力', `每天安排全部角色；每队最多 ${constraints.dailyPartySize} 人且不同账号；1大区与2大区分开组队；不区分大号小号`],
    ['团本循环', `遗迹+天启 → 天启+国王 → 国王+皇后 → 皇后+遗迹；每次推进一格，保留重叠团本进度`],
    ['团本带队', `全部团本统一1托3：${constraints.raidSingleCarryAssistLeaders.join('、')}轮换带队，均分次数；${constraints.raidPreferredStandaloneCharacter}固定单刷`],
    ['多号模式', `仅当前团本包含国王时可选择；选择后${constraints.raidMultiAccountNames.join('、')}每队严格1大号+1中号+2小号，中号缺失时不使用小号替代；其他周期强制普通1托3且不限制等级`],
    ['金羊毛', `周一、三、五、六、日；每角色单人1次；按共享设备账号白名单执行`],
    ['永久成就', `探索、角斗场、历战、配装和4个团本首通均为每角色一次；团本首通按角色错峰轮换`],
    ['精英进度', `每个角色每 ${constraints.eliteIntervalDays} 天通关1次`],
  ];
  const constraintsWrap = document.getElementById('schedulingConstraintsInput');
  if (constraintsWrap) {
    const devices = DAILY_GROUP_DEVICES.map(device => `<div class="scheduling-device-card"><strong>${escapeGameHtml(device)} · ${storage.byDevice[device].length}/${storage.limit}账号</strong><small>${storage.byDevice[device].map(account => escapeGameHtml(account)).join('、') || '未分配账号'}</small></div>`).join('');
    constraintsWrap.innerHTML = `<div class="scheduling-constraint-list">${constraintRows.map(([name, description]) => `<div><strong>${name}</strong><span>${description}</span></div>`).join('')}</div><div class="scheduling-device-grid">${devices}</div>${storage.overflow.length ? `<p class="scheduling-overflow">未能分配设备：${storage.overflow.map(escapeGameHtml).join('、')}</p>` : ''}`;
  }

  const globalTasks = cfg.globalTasks || [];
  const characterTasks = getCharacterTasks();
  let taskHTML = '<div class="game-task-config"><div class="game-setting-subtitle">🌐 全局任务（每天总共 1 次）</div>';
  globalTasks.forEach(task => {
    taskHTML += `<div class="game-task-config-row"><span>${task.icon || '✅'} ${task.name}</span><span class="game-task-meta">每周目标 ${task.goal || 0} 次 · 全局打卡</span></div>`;
  });
  taskHTML += '<div class="game-setting-subtitle">👤 角色任务（每个角色按周期分别记录）</div>';
  characterTasks.forEach(task => {
    taskHTML += `<div class="game-task-config-row"><span>${task.icon || '✅'} ${task.name}</span><span class="game-task-meta">${escapeGameHtml(getTaskScheduleLabel(task))} · ${task.type === 'number' ? '填写次数' : '打勾'}</span></div>`;
  });
  taskHTML += '</div>';
  document.getElementById('taskSettingsInput').innerHTML = taskHTML;
  const achievementSettings = document.getElementById('achievementSettingsInput');
  if (achievementSettings) {
    achievementSettings.innerHTML = getAchievementTasks().map((task, index) => `<div class="game-task-config-row achievement-setting-row"><input class="game-txt" value="${escapeGameAttr(task.icon || '🏆')}" aria-label="成就图标" onchange="updateAchievementTask(${index},'icon',this.value)"><input class="game-txt game-txt-wider" value="${escapeGameAttr(task.name)}" aria-label="成就名称" onchange="updateAchievementTask(${index},'name',this.value)"><span class="game-task-meta">每个角色永久完成1次</span><button class="game-btn game-btn-danger game-btn-sm" type="button" onclick="removeAchievementTask(${index})">删除</button></div>`).join('') || '<div class="game-character-empty">当前没有成就任务。</div>';
  }
}

function updateSetName(category, idx, val) {
  if (!Array.isArray(DATA.config[category])) DATA.config[category] = [];
  DATA.config[category][idx] = String(val || '').trim() || `套装${idx + 1}`;
  saveData(DATA);
}

function addSet(category) {
  if (!Array.isArray(DATA.config[category])) DATA.config[category] = [];
  const used = new Set(DATA.config[category]);
  let n = DATA.config[category].length + 1;
  while (used.has(`新套装${n}`)) n++;
  DATA.config[category].push(`新套装${n}`);
  saveData(DATA);
  renderSettings();
  renderDashboard();
  renderEquip();
}

function removeSet(category, idx) {
  if (!Array.isArray(DATA.config[category]) || DATA.config[category].length <= 1) {
    toast('至少保留一个套装');
    return;
  }
  const name = DATA.config[category][idx];
  if (!confirm(`确定删除${name}？对应数量记录也会从表格中隐藏。`)) return;
  DATA.config[category].splice(idx, 1);
  saveData(DATA);
  renderSettings();
  renderDashboard();
  renderEquip();
}

function updateAccName(idx, val) {
  if (!DATA.config.accounts[idx]) return;
  const oldName = DATA.config.accounts[idx].name;
  const nextName = String(val || '').trim();
  if (!nextName) { toast('账号名不能为空'); renderSettings(); return; }
  if (DATA.config.accounts.some((acc, i) => i !== idx && acc.name === nextName)) {
    toast('账号名不能重复'); renderSettings(); return;
  }
  DATA.config.accounts[idx].name = nextName;
  Object.values(DATA.dailyLog).forEach(log => {
    if (log.accounts && log.accounts[oldName]) {
      log.accounts[val] = log.accounts[oldName];
      delete log.accounts[oldName];
    }
  });
  saveData(DATA);
  renderDashboard();
  renderEquipmentBuild();
}

function isCharacterNameUsed(charName, excludedName = '') {
  return getAllChars().some(item => item.char === charName && item.char !== excludedName);
}

function migrateCharacterData(oldName, nextName) {
  const moveKey = (container) => {
    if (!container || !Object.prototype.hasOwnProperty.call(container, oldName)) return;
    container[nextName] = container[oldName];
    delete container[oldName];
  };
  moveKey(DATA.config?.characterRoleTiers);
  moveKey(DATA.config?.characterRegions);
  (DATA.config?.fixedRaidSquads || []).forEach(squad => {
    if (squad.leader === oldName) squad.leader = nextName;
    Object.keys(squad.devices || {}).forEach(device => {
      if (squad.devices[device] === oldName) squad.devices[device] = nextName;
    });
  });
  if (Array.isArray(DATA.config?.fixedRaidStandalone)) {
    DATA.config.fixedRaidStandalone = DATA.config.fixedRaidStandalone.map(name => name === oldName ? nextName : name);
  }
  moveKey(DATA.characterGold);
  moveKey(DATA.characterAntiMagic);
  moveKey(DATA.equipment?.worn);
  moveKey(DATA.equipment?.unworn);
  moveKey(DATA.equipmentBuild);
  moveKey(DATA.raidProgress);
  moveKey(DATA.achievementProgress);
  moveKey(DATA.eliteProgress);
  Object.values(DATA.weeklyAchievementProgress || {}).forEach(weekProgress => moveKey(weekProgress));
  moveKey(DATA.raidPlanner?.leaderRuns);
  moveKey(DATA.dailyPlanner?.phases);
  Object.values(DATA.raidPlanner?.leaderDailyRuns || {}).forEach(raidMap => {
    Object.values(raidMap || {}).forEach(runs => moveKey(runs));
  });
  if (Array.isArray(DATA.raidPlanner?.bigCharacters)) {
    DATA.raidPlanner.bigCharacters = [...new Set(DATA.raidPlanner.bigCharacters.map(name => name === oldName ? nextName : name))];
  }
  if (DATA.raidPlanner?.fixedLeader === oldName) DATA.raidPlanner.fixedLeader = nextName;
  if (Array.isArray(DATA.raidPlanner?.savedSquads)) {
    DATA.raidPlanner.savedSquads.forEach(squad => {
      if (Array.isArray(squad.members)) squad.members = squad.members.map(name => name === oldName ? nextName : name);
    });
  }
  Object.values(DATA.dailyLog || {}).forEach(log => moveKey(log?.chars));
}

function removeCharacterData(charName) {
  const removeKey = (container) => {
    if (container && Object.prototype.hasOwnProperty.call(container, charName)) delete container[charName];
  };
  removeKey(DATA.config?.characterRoleTiers);
  removeKey(DATA.config?.characterRegions);
  removeKey(DATA.characterGold);
  removeKey(DATA.characterAntiMagic);
  removeKey(DATA.equipment?.worn);
  removeKey(DATA.equipment?.unworn);
  removeKey(DATA.equipmentBuild);
  removeKey(DATA.raidProgress);
  removeKey(DATA.achievementProgress);
  removeKey(DATA.eliteProgress);
  Object.values(DATA.weeklyAchievementProgress || {}).forEach(weekProgress => removeKey(weekProgress));
  removeKey(DATA.raidPlanner?.leaderRuns);
  removeKey(DATA.dailyPlanner?.phases);
  Object.values(DATA.raidPlanner?.leaderDailyRuns || {}).forEach(raidMap => {
    Object.values(raidMap || {}).forEach(runs => removeKey(runs));
  });
  if (Array.isArray(DATA.raidPlanner?.bigCharacters)) {
    DATA.raidPlanner.bigCharacters = DATA.raidPlanner.bigCharacters.filter(name => name !== charName);
  }
  if (DATA.raidPlanner?.fixedLeader === charName) DATA.raidPlanner.fixedLeader = '';
  if (Array.isArray(DATA.raidPlanner?.savedSquads)) {
    DATA.raidPlanner.savedSquads = DATA.raidPlanner.savedSquads.filter(squad => !squad.members?.includes(charName));
  }
  Object.values(DATA.dailyLog || {}).forEach(log => removeKey(log?.chars));
}

function renameCharacter(accountIdx, charIdx, val) {
  const acc = DATA.config.accounts?.[accountIdx];
  const oldName = acc?.chars?.[charIdx];
  const nextName = String(val || '').trim();
  if (!acc || !oldName) return;
  if (!nextName) { toast('角色名不能为空'); renderSettings(); return; }
  if (nextName === oldName) return;
  if (isCharacterNameUsed(nextName, oldName)) {
    toast('角色名不能与其他账号重复');
    renderSettings();
    return;
  }
  if (!acc.charUids || typeof acc.charUids !== 'object') acc.charUids = {};
  const uid = acc.charUids[oldName] || '';
  acc.chars[charIdx] = nextName;
  delete acc.charUids[oldName];
  acc.charUids[nextName] = uid;
  migrateCharacterData(oldName, nextName);
  clearGoldTransferExecution();
  saveData(DATA);
  renderSettings();
  renderDashboard();
  renderEquipmentBuild();
  toast(`角色已改名为 ${nextName}`);
}

function addCharacterToAccount(accountIdx) {
  const acc = DATA.config.accounts?.[accountIdx];
  if (!acc) return;
  let number = 1;
  let charName = `新角色${number}`;
  while (isCharacterNameUsed(charName)) charName = `新角色${++number}`;
  if (!acc.charUids || typeof acc.charUids !== 'object') acc.charUids = {};
  if (!Array.isArray(acc.chars)) acc.chars = [];
  acc.chars.push(charName);
  acc.charUids[charName] = '';
  if (!DATA.config.characterRoleTiers || typeof DATA.config.characterRoleTiers !== 'object') DATA.config.characterRoleTiers = {};
  if (!DATA.config.characterRegions || typeof DATA.config.characterRegions !== 'object') DATA.config.characterRegions = {};
  DATA.config.characterRoleTiers[charName] = 'small';
  DATA.config.characterRegions[charName] = 'region1';
  getEquipmentBuildStatus(charName);
  clearGoldTransferExecution();
  saveData(DATA);
  renderSettings();
  renderDashboard();
  renderEquipmentBuild();
  toast(`已添加 ${charName}，可直接修改名称并填写 UID`);
}

function removeCharacter(accountIdx, charIdx) {
  const acc = DATA.config.accounts?.[accountIdx];
  const charName = acc?.chars?.[charIdx];
  if (!acc || !charName) return;
  if (!confirm(`确定删除角色“${charName}”吗？该角色的打卡、装备和构造记录也会删除。`)) return;
  acc.chars.splice(charIdx, 1);
  if (acc.charUids) delete acc.charUids[charName];
  removeCharacterData(charName);
  clearGoldTransferExecution();
  saveData(DATA);
  renderSettings();
  renderDashboard();
  renderEquipmentBuild();
  toast(`已删除角色 ${charName}`);
}

function updateAccChars(idx, val) {
  if (!DATA.config.accounts[idx]) return;
  const acc = DATA.config.accounts[idx];
  const oldChars = acc.chars || [];
  const oldUids = acc.charUids || {};
  const nextChars = [...new Set(String(val || '').split(',').map(s => s.trim()).filter(Boolean))];
  const nextUids = {};
  nextChars.forEach((charName, i) => {
    const previousName = oldChars[i];
    nextUids[charName] = oldUids[charName] || (oldChars.length === nextChars.length && previousName ? oldUids[previousName] : '') || '';
  });
  acc.chars = nextChars;
  acc.charUids = nextUids;
  saveData(DATA);
  renderSettings();
  renderDashboard();
}

function updateCharUid(accountIdx, charIdx, val) {
  const acc = DATA.config.accounts[accountIdx];
  if (!acc || !acc.chars || !acc.chars[charIdx]) return;
  if (!acc.charUids || typeof acc.charUids !== 'object') acc.charUids = {};
  acc.charUids[acc.chars[charIdx]] = String(val || '').trim();
  saveData(DATA);
  renderDashboard();
}

async function copyCharacterUid(uid) {
  if (!uid) return;
  try {
    await navigator.clipboard.writeText(uid);
    toast('UID 已复制');
  } catch (_) {
    const input = document.createElement('textarea');
    input.value = uid;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    toast('UID 已复制');
  }
}

function escapeGameHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escapeGameAttr(value) {
  return escapeGameHtml(value).replace(/`/g, '&#96;');
}

function addAccount() {
  if (!DATA.config || !Array.isArray(DATA.config.accounts)) DATA.config = JSON.parse(JSON.stringify(window.CONFIG || {}));
  const usedNames = new Set(DATA.config.accounts.map(acc => acc.name));
  let number = DATA.config.accounts.length + 1;
  while (usedNames.has(`新账号${number}`)) number++;
  let charNumber = 1;
  let charName = `新角色${charNumber}`;
  while (isCharacterNameUsed(charName)) charName = `新角色${++charNumber}`;
  DATA.config.accounts.push({ name: `新账号${number}`, chars: [charName], charUids: {} });
  getEquipmentBuildStatus(charName);
  saveData(DATA);
  renderSettings();
  toast('已添加新账号，记得修改名字！');
}

function removeAccount(idx) {
  if (!confirm('确定删除这个账号及其角色？')) return;
  const account = DATA.config.accounts[idx];
  (account?.chars || []).forEach(removeCharacterData);
  DATA.config.accounts.splice(idx, 1);
  saveData(DATA);
  renderSettings();
  toast('已删除');
}

function saveSettings() {
  saveData(DATA);
  toast('✅ 设置已保存！刷新总览查看效果。');
  renderDashboard();
}

function exportGameData() {
  const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `游戏管理备份_${getTodayStr()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast('已导出游戏管理数据');
}

function importGameData(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported || typeof imported !== 'object' || !imported.config) throw new Error('格式不正确');
      DATA = {
        // 导入只接受当前 config.js 的规格，避免旧版本配置污染账号体系。
        config: JSON.parse(JSON.stringify(window.CONFIG || {})),
        dailyLog: imported.dailyLog && typeof imported.dailyLog === 'object' ? imported.dailyLog : {},
        characterGold: imported.characterGold && typeof imported.characterGold === 'object' && !Array.isArray(imported.characterGold) ? imported.characterGold : {},
        equipment: imported.equipment && typeof imported.equipment === 'object' ? imported.equipment : {},
        equipmentBuild: imported.equipmentBuild && typeof imported.equipmentBuild === 'object' && !Array.isArray(imported.equipmentBuild) ? imported.equipmentBuild : {},
        achievementProgress: imported.achievementProgress && typeof imported.achievementProgress === 'object' && !Array.isArray(imported.achievementProgress) ? imported.achievementProgress : {},
        weeklyAchievementProgress: imported.weeklyAchievementProgress && typeof imported.weeklyAchievementProgress === 'object' && !Array.isArray(imported.weeklyAchievementProgress) ? imported.weeklyAchievementProgress : {},
        eliteProgress: imported.eliteProgress && typeof imported.eliteProgress === 'object' && !Array.isArray(imported.eliteProgress) ? imported.eliteProgress : {},
        raidProgress: imported.raidProgress && typeof imported.raidProgress === 'object' && !Array.isArray(imported.raidProgress) ? imported.raidProgress : {},
        raidPlanner: imported.raidPlanner && typeof imported.raidPlanner === 'object' && !Array.isArray(imported.raidPlanner) ? imported.raidPlanner : { bigCharacters: [], leaderRuns: {}, savedSquads: [] },
        knowledgeBase: Number(imported.knowledgeBaseVersion) >= GAME_KNOWLEDGE_BASE_VERSION && typeof imported.knowledgeBase === 'string' && imported.knowledgeBase.trim() ? imported.knowledgeBase : DEFAULT_GAME_KNOWLEDGE_BASE,
        knowledgeBaseVersion: GAME_KNOWLEDGE_BASE_VERSION,
        legacyKnowledgeBaseBackup: (!Number.isFinite(Number(imported.knowledgeBaseVersion)) || Number(imported.knowledgeBaseVersion) < GAME_KNOWLEDGE_BASE_VERSION) && typeof imported.knowledgeBase === 'string' ? imported.knowledgeBase : imported.legacyKnowledgeBaseBackup,
        optimizationProfile: imported.optimizationProfile && typeof imported.optimizationProfile === 'object' && !Array.isArray(imported.optimizationProfile) ? imported.optimizationProfile : JSON.parse(JSON.stringify(DEFAULT_GAME_OPTIMIZATION_PROFILE)),
        weekStart: imported.weekStart || DATA.weekStart,
      };
      saveData(DATA);
      renderSettings();
      renderDashboard();
      toast('已导入游戏管理数据');
    } catch (error) {
      toast(`导入失败：${error.message}`);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file, 'utf-8');
}

function restoreGameBackup() {
  const backup = localStorage.getItem(`${STORAGE_KEY}_backup`);
  if (!backup) { toast('暂无可恢复的备份'); return; }
  if (!confirm('恢复上次保存的数据？当前数据会被替换。')) return;
  localStorage.setItem(STORAGE_KEY, backup);
  location.reload();
}

function resetAll() {
  if (!confirm('确定要重置本周所有打卡数据？此操作不可恢复！')) return;
  const week = new Set(getWeekDates().map(d => d.iso));
  Object.keys(DATA.dailyLog || {}).forEach(date => {
    if (week.has(date)) delete DATA.dailyLog[date];
  });
  saveData(DATA);
  toast('🔄 本周数据已重置');
  renderDashboard();
  renderDaily();
}

// ==========================================
//  游戏页面切换
// ==========================================
function renderActiveGamePage() {
  const active = document.querySelector('#mode-game .game-page.active');
  const pageName = active?.id?.replace('game-page-', '') || 'daily-star';
  if (pageName === 'daily-star') renderDailyStarfield();
}

function switchGamePage(pageName) {
  pageName = 'daily-star';
  document.querySelectorAll('#mode-game .game-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('#mode-game > .game-tabs .game-tab').forEach(t => t.classList.remove('active'));

  const page = document.getElementById('game-page-' + pageName);
  if (page) page.classList.add('active');
  const tab = document.querySelector(`#mode-game [data-game-page="${pageName}"]`);
  if (tab) tab.classList.add('active');

  equipmentBuildRenderedOrder = null;
  try {
    renderDailyStarfield();
  } catch(e) { console.error('switchGamePage error', pageName, e); }
}

// ==========================================
//  游戏模块初始化
// ==========================================
function initGame() {
  // 更新顶部栏日期
  const weekDays = getWeekDates();
  const weekLabel = document.getElementById('gameWeekLabel');
  if (weekLabel) {
    weekLabel.textContent = `${weekDays[0].iso} ~ ${weekDays[6].iso}`;
  }

  // 检查是否需要重置周数据
  const weekStartDate = getWeekStart();
  const weekStart = `${weekStartDate.getFullYear()}-${String(weekStartDate.getMonth() + 1).padStart(2, '0')}-${String(weekStartDate.getDate()).padStart(2, '0')}`;
  if (DATA.weekStart && DATA.weekStart !== weekStart) {
    DATA.weekStart = weekStart;
    saveData(DATA);
  }
  if (!DATA.weekStart) {
    DATA.weekStart = weekStart;
    saveData(DATA);
  }

  viewingDate = getTodayStr();

  // 绑定游戏子Tab点击（仅限 mode-game 内的 game-tab）
  document.querySelectorAll('#mode-game .game-tabs .game-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const page = tab.dataset.gamePage;
      if (page) switchGamePage(page);
    });
  });

  renderDailyStarfield();

  // 云端同步是异步的：先立即显示本地数据，连接成功后再用云端数据刷新。
  const applyRemoteGameData = remoteData => {
    if (!remoteData || typeof remoteData !== 'object') return;
    applyingRemoteGameData = true;
    try {
      Object.keys(DATA).forEach(key => delete DATA[key]);
      Object.assign(DATA, remoteData);
      purgeRetiredFixedRaidCharacters(DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
      renderDailyStarfield();
      toast('☁️ 已同步其他设备的最新数据');
    } finally {
      applyingRemoteGameData = false;
    }
  };
  window.SUPABASE_SYNC?.init?.(DATA, applyRemoteGameData, info => {
    const label = document.getElementById('gameWeekLabel');
    if (label && info?.message) label.title = info.message;
  }).then(result => {
    // 首次打开时直接应用 Supabase 返回的数据；后续变更由实时订阅回调处理。
    if (result?.data) applyRemoteGameData(result.data);
  }).catch(error => console.warn('Supabase 首次数据应用失败', error));

  console.log('💎 晶核日常管理已就绪');
}

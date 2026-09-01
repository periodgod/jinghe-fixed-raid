/*
 * 晶核固定团本 · Supabase 云端同步
 * 依赖页面先加载 @supabase/supabase-js v2；配置为空时自动降级为本地模式。
 */
(function () {
  'use strict';

  const cfg = window.CONFIG?.supabase || {};
  const state = {
    client: null,
    enabled: false,
    ready: false,
    saveTimer: 0,
    onRemoteData: null,
    onStatus: null,
    channel: null,
    lastRemoteUpdatedAt: null,
  };

  function status(type, message) {
    try { state.onStatus?.({ type, message, enabled: state.enabled, ready: state.ready }); } catch (_) { /* ignore UI errors */ }
  }

  function validConfig() {
    return typeof cfg.url === 'string' && cfg.url.startsWith('https://') &&
      typeof cfg.anonKey === 'string' && cfg.anonKey.length > 20;
  }

  function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  async function fetchRemote() {
    if (!state.client) return null;
    const { data, error } = await state.client
      .from(cfg.table || 'game_state')
      .select('id,data,updated_at')
      .eq('id', cfg.rowId || 'default')
      .maybeSingle();
    if (error) throw error;
    if (!data || !data.data || typeof data.data !== 'object') return null;
    state.lastRemoteUpdatedAt = data.updated_at || null;
    return data.data;
  }

  async function pushNow(gameData) {
    if (!state.client || !state.ready) return;
    const payload = {
      id: cfg.rowId || 'default',
      data: cloneData(gameData),
      updated_at: new Date().toISOString(),
    };
    const { error } = await state.client.from(cfg.table || 'game_state').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    state.lastRemoteUpdatedAt = payload.updated_at;
    status('saved', '云端已同步');
  }

  function queueSave(gameData) {
    if (!state.enabled || !state.ready) return;
    clearTimeout(state.saveTimer);
    const snapshot = cloneData(gameData);
    state.saveTimer = setTimeout(async () => {
      state.saveTimer = 0;
      try { await pushNow(snapshot); }
      catch (error) { console.warn('Supabase 保存失败', error); status('error', '云端保存失败，已保留本地数据'); }
    }, 700);
  }

  function subscribeRealtime() {
    if (!state.client) return;
    state.channel = state.client.channel('game-state-sync')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: cfg.table || 'game_state', filter: `id=eq.${cfg.rowId || 'default'}`
      }, payload => {
        const remote = payload?.new?.data;
        if (!remote || typeof remote !== 'object') return;
        const updatedAt = payload?.new?.updated_at || null;
        if (updatedAt && updatedAt === state.lastRemoteUpdatedAt) return;
        state.lastRemoteUpdatedAt = updatedAt;
        try { state.onRemoteData?.(remote); status('received', '已收到其他设备的更新'); }
        catch (error) { console.warn('Supabase 远程数据应用失败', error); }
      })
      .subscribe(statusValue => {
        if (statusValue === 'SUBSCRIBED') status('online', '云端同步已连接');
      });
  }

  async function init(localData, onRemoteData, onStatus) {
    state.onRemoteData = onRemoteData;
    state.onStatus = onStatus;
    if (!validConfig()) {
      status('local', '当前为本地保存模式');
      return { enabled: false, data: null };
    }
    if (!window.supabase?.createClient) {
      status('error', 'Supabase 脚本加载失败，已使用本地模式');
      return { enabled: false, data: null };
    }
    try {
      state.client = window.supabase.createClient(cfg.url, cfg.anonKey);
      state.enabled = true;
      const remote = await fetchRemote();
      state.ready = true;
      if (!remote) await pushNow(localData);
      subscribeRealtime();
      status('online', remote ? '云端数据已加载' : '已创建云端数据');
      return { enabled: true, data: remote };
    } catch (error) {
      console.warn('Supabase 初始化失败', error);
      state.enabled = false;
      state.ready = false;
      status('error', '云端连接失败，已使用本地模式');
      return { enabled: false, data: null, error };
    }
  }

  window.SUPABASE_SYNC = { init, queueSave, get enabled() { return state.enabled; } };
})();

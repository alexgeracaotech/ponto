// Armazena em memória (reinicia ao recarregar o Snack)
const store = { punches: [] };

export function getNowISO() {
  return new Date().toISOString();
}

// tipo: 'IN' | 'BREAK_START' | 'BREAK_END' | 'OUT'
export function addPunch({ tipo }) {
  const rec = { id: String(Date.now()), tipo, tsServer: getNowISO() };
  store.punches.unshift(rec);
  return rec;
}

export function listPunches() {
  return store.punches; // já em ordem decrescente
}

// resumo do dia (mock simples)
export function summarizeToday() {
  const today = new Date().toISOString().slice(0, 10);
  const todays = store.punches.filter(p => p.tsServer.startsWith(today));
  return { totalRegistros: todays.length, registros: todays };
}

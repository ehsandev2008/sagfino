/**
 * سیستم toast سفارشی سقفینو (API مشابه react-hot-toast)
 *
 * toast(message, options) | toast.success | toast.error | toast.info | toast.loading
 * options: { duration (ms | Infinity), position }
 * toast.dismiss(id?) — بدون id همه را می‌بندد
 */

let snapshot = [];
const listeners = new Set();
let counter = 0;

function notify() {
  snapshot = [...snapshot];
  listeners.forEach((fn) => fn());
}

function push(message, options = {}) {
  const { type = "blank", duration = 4000, position, ...rest } = options;
  const id = `toast-${++counter}`;
  snapshot = [...snapshot, { id, message, type, duration, position, ...rest }];
  notify();
  return id;
}

function base(message, options) {
  return push(message, options);
}

export const toast = Object.assign(base, {
  success(message, options) {
    return push(message, { ...options, type: "success" });
  },
  error(message, options) {
    return push(message, { ...options, type: "error" });
  },
  info(message, options) {
    return push(message, { ...options, type: "info" });
  },
  loading(message, options) {
    return push(message, { ...options, type: "loading", duration: Infinity });
  },
  dismiss(id) {
    snapshot = id ? snapshot.filter((t) => t.id !== id) : [];
    notify();
  },
  _subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  _getSnapshot() {
    return snapshot;
  },
});

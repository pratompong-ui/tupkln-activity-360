/**
 * Browser storage compatibility layer for the original TUPKLN Activity 360 JSX.
 * PREVIEW ONLY: data stays in this browser/device and is not shared across users.
 */
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = window.localStorage.getItem(key);
      return value === null ? null : { value };
    },
    async set(key, value) {
      window.localStorage.setItem(key, value);
      return { value };
    },
    async delete(key) {
      window.localStorage.removeItem(key);
      return { ok: true };
    },
  };
}

/** 清理当前应用的持久化缓存。 */
export function clearNamespacedStorage(storage: Storage, namespace: string) {
  // 配置缺失时不能把空前缀当作“所有键”。
  if (!namespace) return;
  // 从后向前删除，避免删除后索引变化导致相邻缓存被跳过。
  for (let index = storage.length - 1; index >= 0; index--) {
    const key = storage.key(index);
    if (key?.startsWith(namespace)) storage.removeItem(key);
  }
}

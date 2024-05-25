import { updateQueue } from './Component'

/** 将实际事件监听转移到 document 上，将 handler 保存到 dom 上 */
export function addEvent(dom: DOM, eventType: EventType, handler: () => void) {
  let store = dom.store || (dom.store = {})
  store[eventType] = handler
  if (!document[eventType]) document[eventType] = dispatchEvent
}

/** 执行事件处理中标记为批量更新模式 */
function dispatchEvent(event: Event) {
  let { target, type } = event as { target: DOM | null, type: string }
  const eventType = `on${type}`
  updateQueue.isBatchingUpdate = true
  // QA 为什么不直接绑定到元素的 click 事件上？还需要手动再递归一次来模拟事件冒泡
  // 模拟事件冒泡
  while (target) {
    const handler = target.store?.[eventType]
    handler?.call(target, event)
    target = target.parentElement
  }
  updateQueue.isBatchingUpdate = false
  updateQueue.batchUpdate()
}

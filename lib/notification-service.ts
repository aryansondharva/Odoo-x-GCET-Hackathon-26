// Notification service for toast messages and alerts

export type NotificationType = "success" | "error" | "warning" | "info"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
}

export class NotificationService {
  private static notifications: Notification[] = []
  private static listeners: Set<(notifications: Notification[]) => void> = new Set()

  static subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  static notify(type: NotificationType, title: string, message: string, duration = 3000) {
    const id = Math.random().toString(36).substr(2, 9)
    const notification: Notification = { id, type, title, message, duration }

    this.notifications.push(notification)
    this.emit()

    if (duration) {
      setTimeout(() => this.remove(id), duration)
    }

    return id
  }

  static success(title: string, message: string) {
    return this.notify("success", title, message)
  }

  static error(title: string, message: string) {
    return this.notify("error", title, message)
  }

  static warning(title: string, message: string) {
    return this.notify("warning", title, message)
  }

  static info(title: string, message: string) {
    return this.notify("info", title, message)
  }

  static remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.emit()
  }

  static clear() {
    this.notifications = []
    this.emit()
  }

  private static emit() {
    this.listeners.forEach((listener) => listener([...this.notifications]))
  }
}

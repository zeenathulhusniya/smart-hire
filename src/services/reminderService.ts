import { Reminder } from '../types';
import { apiRequest } from './apiClient';

export type CreateReminderInput = Omit<Reminder, 'id' | 'userId' | 'createdAt'>;

export const reminderService = {
  async listReminders(): Promise<Reminder[] | null> {
    try {
      return await apiRequest<Reminder[]>('/reminders', { method: 'GET' });
    } catch {
      return null;
    }
  },

  async createReminder(input: CreateReminderInput): Promise<Reminder | null> {
    try {
      return await apiRequest<Reminder>('/reminders', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch {
      return null;
    }
  },

  async updateReminder(
    id: string,
    updates: Partial<Reminder>
  ): Promise<Reminder | null> {
    try {
      return await apiRequest<Reminder>(`/reminders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      return null;
    }
  },

  async toggleComplete(id: string, completed: boolean): Promise<Reminder | null> {
    try {
      return await apiRequest<Reminder>(`/reminders/${id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      });
    } catch {
      return null;
    }
  },

  async deleteReminder(id: string): Promise<boolean> {
    try {
      await apiRequest<void>(`/reminders/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};

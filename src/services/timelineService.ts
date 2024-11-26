import axios, { AxiosError } from 'axios';
import { TimelineItem } from '../types/timeline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class TimelineService {
  private static handleError(error: unknown, context: string) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        throw new Error(`${context}: Item not found`);
      }
      throw new Error(`${context}: ${axiosError.message}`);
    }
    throw error;
  }

  static async getTimelineItems(): Promise<TimelineItem[]> {
    try {
      const response = await axios.get<TimelineItem[]>(`${API_URL}/timeline`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch timeline items');
      return []; // Fallback empty array
    }
  }

  static async updateTimelineItem(item: TimelineItem): Promise<TimelineItem> {
    try {
      const response = await axios.put<TimelineItem>(
          `${API_URL}/timeline/${item.id}`,
          item
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update timeline item');
    }
  }

  static async createTimelineItem(item: Omit<TimelineItem, 'id'>): Promise<TimelineItem> {
    try {
      const response = await axios.post<TimelineItem>(
          `${API_URL}/timeline`,
          item
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create timeline item');
    }
  }

  static async deleteTimelineItem(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/timeline/${id}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete timeline item');
    }
  }

  static async batchUpdateTimelineItems(items: TimelineItem[]): Promise<TimelineItem[]> {
    try {
      const updatePromises = items.map(item =>
          axios.put<TimelineItem>(`${API_URL}/timeline/${item.id}`, item)
      );
      const responses = await Promise.all(updatePromises);
      return responses.map(response => response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to batch update timeline items');
    }
  }
}
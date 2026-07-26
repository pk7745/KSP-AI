import { api } from './api';
import type { FullGreetingPayload } from '../utils/greeting';
import { generateFullGreetingPayload } from '../utils/greeting';

export async function fetchOfficerGreeting(user: any): Promise<FullGreetingPayload> {
  try {
    const dashboardData = await api.getDashboardData().catch(() => null);
    return generateFullGreetingPayload(user, dashboardData);
  } catch (err) {
    return generateFullGreetingPayload(user, null);
  }
}

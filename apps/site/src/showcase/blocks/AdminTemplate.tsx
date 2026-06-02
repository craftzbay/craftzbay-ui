import { AdminDashboard } from './AdminDashboard';

/**
 * Admin dashboard template — a complete, sellable admin console: a slim icon
 * rail switches areas, each area's child menu renders in the secondary panel,
 * a workspace switcher sits up top, and pages are real and interactive
 * (Projects is full CRUD with search + filter + pagination; Team, Billing,
 * Settings and Inbox each have their own data and actions). The authentication
 * screens live in their own "Authentication" template.
 */
export function AdminTemplate() {
  return <AdminDashboard />;
}

import type { Role } from '@/lib/types';

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  badge?: 'qa' | 'none';
}

export type IconName =
  | 'home' | 'book' | 'robot' | 'certificate' | 'wallet' | 'users' | 'shield'
  | 'treasury' | 'audit' | 'sparkles' | 'review' | 'verify' | 'chart' | 'settings';

export const NAV: Record<Role, { group: string; items: NavItem[] }[]> = {
  learner: [
    {
      group: 'Learning',
      items: [
        { href: '/learn', label: 'Dashboard', icon: 'home' },
        { href: '/learn/courses', label: 'My courses', icon: 'book' },
        { href: '/catalogue', label: 'Course catalogue', icon: 'chart' },
        { href: '/learn/tutor', label: 'AI learning assistant', icon: 'robot' },
      ],
    },
    {
      group: 'Credentials & payments',
      items: [
        { href: '/learn/credentials', label: 'My credentials', icon: 'certificate' },
        { href: '/learn/payments', label: 'Payments & wallet', icon: 'wallet' },
        { href: '/verify', label: 'Verify a certificate', icon: 'verify' },
      ],
    },
  ],
  instructor: [
    {
      group: 'Authoring',
      items: [
        { href: '/studio', label: 'Studio dashboard', icon: 'home' },
        { href: '/studio/generate', label: 'AI course generator', icon: 'sparkles' },
        { href: '/studio/courses', label: 'My courses', icon: 'book' },
      ],
    },
    {
      group: 'Learners',
      items: [
        { href: '/studio/grading', label: 'AI grading queue', icon: 'robot' },
        { href: '/catalogue', label: 'Course catalogue', icon: 'chart' },
      ],
    },
  ],
  reviewer: [
    {
      group: 'Quality assurance',
      items: [
        { href: '/review', label: 'QA queue', icon: 'review', badge: 'qa' },
        { href: '/catalogue', label: 'Course catalogue', icon: 'chart' },
        { href: '/verify', label: 'Verify a certificate', icon: 'verify' },
      ],
    },
  ],
  admin: [
    {
      group: 'Oversight',
      items: [
        { href: '/admin', label: 'Command centre', icon: 'home' },
        { href: '/admin/users', label: 'Users & roles', icon: 'users' },
        { href: '/admin/courses', label: 'Course governance', icon: 'book' },
        { href: '/review', label: 'QA queue', icon: 'review', badge: 'qa' },
      ],
    },
    {
      group: 'Blockchain & money',
      items: [
        { href: '/admin/treasury', label: 'Treasury & settlement', icon: 'treasury' },
        { href: '/admin/credentials', label: 'Credential registry', icon: 'certificate' },
        { href: '/verify', label: 'Verification portal', icon: 'verify' },
      ],
    },
    {
      group: 'Platform',
      items: [
        { href: '/admin/ai', label: 'AI operations', icon: 'sparkles' },
        { href: '/admin/compliance', label: 'NDPR compliance', icon: 'shield' },
        { href: '/admin/audit', label: 'Audit trail', icon: 'audit' },
      ],
    },
  ],
};

import Link from 'next/link';
import { ngn, num } from '@/lib/format';
import type { Course, Enrollment } from '@/lib/types';
import { Badge, Progress } from './ui';

const TRACK_TONE: Record<string, string> = {
  'Blockchain & Digital Currency': 'bg-chain/10 text-chain ring-chain/20',
  'AI & Data': 'bg-nitda-50 text-nitda-700 ring-nitda-200',
  Cybersecurity: 'bg-rose-50 text-rose-700 ring-rose-200',
  'Digital Literacy': 'bg-gold-50 text-gold-700 ring-gold-300/60',
  'Policy & Compliance': 'bg-cyan-50 text-cyan-800 ring-cyan-200',
  'Cloud & Infrastructure': 'bg-ink-100 text-ink-700 ring-ink-200',
};

export function TrackTag({ track }: { track: string }) {
  return (
    <span className={`chip ring-1 ring-inset ${TRACK_TONE[track] ?? 'bg-ink-100 text-ink-700 ring-ink-200'}`}>
      {track}
    </span>
  );
}

/** Course card in "continue learning" mode (progress) or catalogue mode (price). */
export function CourseCard({ course, enrollment }: { course: Course; enrollment?: Enrollment }) {
  const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  return (
    <article className="card flex flex-col overflow-hidden transition hover:shadow-pop">
      <div className="relative h-1.5 w-full gov-band" aria-hidden="true" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-[11.5px] font-semibold text-ink-500">{course.code}</span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {course.aiAssisted ? <Badge tone="chain" glyph={false}>✨ AI-assisted</Badge> : null}
            {course.sbtEnabled ? <Badge tone="good">SBT certificate</Badge> : null}
          </div>
        </div>

        <h3 className="mt-2 text-[15px] font-semibold leading-snug text-ink-900">
          <Link href={`/catalogue/${course.code}`} className="hover:text-nitda-700 hover:underline">
            {course.title}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-500">{course.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-ink-500">
          <TrackTag track={course.track} />
          <span>{course.level}</span>
          <span aria-hidden="true">·</span>
          <span>{course.hours}h</span>
          <span aria-hidden="true">·</span>
          <span>{lessons} lessons</span>
        </div>

        <div className="mt-auto pt-4">
          {enrollment ? (
            <>
              <Progress value={enrollment.progressPct} label={`Next: ${enrollment.nextLesson}`} />
              <Link href={`/learn/courses/${course.code}`} className="btn-primary mt-3 w-full">
                {enrollment.progressPct === 100 ? 'Review course' : 'Resume learning'}
              </Link>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-ink-900">
                  {course.priceNgn === 0 ? 'Free' : ngn(course.priceNgn)}
                </p>
                <p className="text-[11.5px] text-ink-500">{num(course.enrolled, { compact: true })} enrolled</p>
              </div>
              <Link href={`/checkout/${course.code}`} className="btn-primary">
                {course.priceNgn === 0 ? 'Enrol free' : 'Enrol now'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

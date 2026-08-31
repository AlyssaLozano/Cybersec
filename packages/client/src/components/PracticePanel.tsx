/**
 * Extra drills on the same skill, offered once an exercise is passed.
 *
 * Practice never affects unlocking or the completion percentage. A student can
 * do five drills or none, and nothing about their progress changes either way --
 * which is the point: repetition should feel free, not graded.
 *
 * Only one drill is active at a time, so the terminal below always has exactly
 * one thing being graded against it and the student is never guessing which
 * question their command answers.
 */

interface PracticeItemView {
  id: string;
  prompt: string;
}

interface PracticePanelProps {
  practice: PracticeItemView[];
  state: Array<{ practiceId: string; passed: boolean; attempts: number }>;
  activeId: string | null;
  onSelect: (practiceId: string | null) => void;
}

export function PracticePanel({ practice, state, activeId, onSelect }: PracticePanelProps) {
  if (practice.length === 0) return null;

  const passedIds = new Set(state.filter((entry) => entry.passed).map((entry) => entry.practiceId));
  const passedCount = practice.filter((item) => passedIds.has(item.id)).length;

  return (
    <section className="practice">
      <header className="practice-head">
        <span className="title">More practice</span>
        <span className="count">
          {passedCount} of {practice.length} done
        </span>
        {activeId && (
          <button className="btn ghost" onClick={() => onSelect(null)}>
            Back to the exercise
          </button>
        )}
      </header>

      <p className="practice-note">
        Same skill, different target. Optional, and it never affects your progress.
      </p>

      <ol className="practice-list">
        {practice.map((item, index) => {
          const done = passedIds.has(item.id);
          const active = item.id === activeId;
          return (
            <li key={item.id} className={active ? 'active' : ''}>
              <button
                className="practice-item"
                onClick={() => onSelect(active ? null : item.id)}
                aria-pressed={active}
              >
                <span className={`mark${done ? ' done' : ''}`}>{done ? '✓' : index + 1}</span>
                <span className="practice-prompt">{item.prompt}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {activeId && (
        <div className="practice-active-note">
          The terminal below is now grading this drill. Pick another, or go back to the exercise.
        </div>
      )}
    </section>
  );
}

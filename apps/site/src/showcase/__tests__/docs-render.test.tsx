import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { componentDocs } from '../registry/components';

/**
 * Smoke test: every example preview mounts without throwing. Catches stale
 * props / removed exports in doc files, which typecheck alone misses when the
 * preview is a JSX tree built from literals.
 */
describe('component doc previews', () => {
  for (const doc of componentDocs) {
    it(`${doc.slug}: all ${doc.examples.length} previews render`, () => {
      for (const ex of doc.examples) {
        const { unmount } = render(<div>{ex.preview}</div>);
        unmount();
      }
      expect(doc.examples.length).toBeGreaterThan(0);
    });
  }
});

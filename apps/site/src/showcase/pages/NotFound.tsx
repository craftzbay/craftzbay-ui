import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';

export function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <ErrorState
        variant="404"
        title="Page not found"
        description="The page you are looking for does not exist."
        action={
          <Button asChild>
            <a href="#">Back to overview</a>
          </Button>
        }
      />
    </div>
  );
}

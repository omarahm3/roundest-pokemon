import { AppRouter } from '@/api/router';
import { createReactQueryHooks } from '@trpc/react';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}

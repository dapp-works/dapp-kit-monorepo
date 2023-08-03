import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@/server/routers/_app';
import superjson from 'superjson';
import { rootStore } from '@/store';
import { UserStore } from '@/dappkit/store/user';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server
       * @see https://trpc.io/docs/data-transformers
       **/
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server
       * @see https://trpc.io/docs/links
       * */
      links: [
        loggerLink({
          enabled: (opts) => process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      headers() {
        return {
          authorization: rootStore.get(UserStore).token ? `Bearer ${rootStore.get(UserStore).token}` : undefined,
        };
      },
    }),
  ],
  transformer: superjson,
});

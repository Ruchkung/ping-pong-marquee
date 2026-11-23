import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';

  return {
    base: isLib ? '/' : '/ping-pong-marquee/',
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: parseInt(process.env.PORT || '5173'),
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    ...(isLib
      ? {
          build: {
            lib: {
              entry: resolve(import.meta.dirname, 'src/components/SmartMarquee/index.ts'),
              name: 'PingPongMarquee',
              formats: ['es', 'cjs'] as const,
              fileName: 'ping-pong-marquee',
              cssFileName: 'style',
            },
            rollupOptions: {
              external: ['react', 'react-dom', 'react/jsx-runtime'],
              output: {
                globals: {
                  react: 'React',
                  'react-dom': 'ReactDOM',
                  'react/jsx-runtime': 'jsxRuntime',
                },
              },
            },
            cssCodeSplit: false,
          },
        }
      : {}),
  };
});

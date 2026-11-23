import { rm } from 'node:fs/promises';
import { defineConfig } from 'tsdown';

// Types only: Vite builds the JS + CSS (see `build:lib`). tsdown bundles the
// declarations into one file per format so both ESM and CJS consumers resolve
// correct types (dist/index.d.ts and dist/index.d.cts).
export default defineConfig({
  entry: { index: 'src/components/SmartMarquee/index.ts' },
  format: ['esm', 'cjs'],
  outDir: 'dist',
  clean: false,
  platform: 'neutral',
  tsconfig: 'tsconfig.lib.json',
  css: false,
  dts: { dtsOnly: true, oxc: {} },
  deps: { neverBundle: ['react', 'react-dom', 'react/jsx-runtime', /\.css$/] },
  // dtsOnly still writes a JS chunk for the CJS format; the real JS comes from Vite.
  onSuccess: () => rm('dist/index.cjs', { force: true }),
});

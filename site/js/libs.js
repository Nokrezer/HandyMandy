// build-libs.js
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
// Создаём папку dist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
    console.log('📁 Created dist folder');
}
// Список библиотек для сборки
const libs = [
    { name: 'react', entry: 'react', exports: 'named' },
    { name: 'react-dom', entry: 'react-dom', exports: 'named' },
    { name: 'react-router', entry: 'react-router', exports: 'named' },
    { name: 'react-hot-toast', entry: 'react-hot-toast', exports: 'named' }
];
async function buildLib(lib) {
    console.log(`🔨 Building ${lib.name}...`);
    try {
        const bundle = await rollup({
            input: lib.entry,
            plugins: [
                resolve({
                    browser: true,
                    preferBuiltins: false
                }),
                commonjs({
                    include: /node_modules/,
                    requireReturnsDefault: 'auto'
                })
            ],
            external: lib.name === 'react-dom' ? ['react'] : []
        });
        await bundle.write({
            file: `dist/${lib.name}.js`,
            format: 'esm',
            sourcemap: false,
            exports: lib.exports || 'auto',
            interop: 'auto'
        });
        const stats = fs.statSync(`dist/${lib.name}.js`);
        const fileSizeInKB = (stats.size / 1024).toFixed(2);
        console.log(`✅ Built ${lib.name}.js (${fileSizeInKB} KB)`);
    }
    catch (error) {
        console.error(`❌ Error building ${lib.name}:`, error);
    }
}
async function buildAll() {
    console.log('🚀 Starting build...\n');
    for (const lib of libs) {
        await buildLib(lib);
    }
    console.log('\n✨ Build complete!');
}
buildAll();

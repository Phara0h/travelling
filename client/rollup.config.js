import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
	input: ['src/index.js','src/misc.js'],
	output: {
		dir: '../dist',
		// file: 'index.html',
    format: 'es',
		sourcemap: true
	},
	plugins: [
    resolve(),
    babel()
  ]
};

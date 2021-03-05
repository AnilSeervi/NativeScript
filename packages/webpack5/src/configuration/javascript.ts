import Config from 'webpack-chain';

import { addVirtualEntry } from '../helpers/virtualModules';
import { env as _env, IWebpackEnv } from '../index';
import base from './base';

export default function (config: Config, env: IWebpackEnv = _env): Config {
	base(config, env);

	const filterRE = '/.(xml|js|s?css)$/';
	const virtualEntryPath = addVirtualEntry(
		config,
		'javascript',
		`
		// VIRTUAL ENTRY START
		require('@nativescript/core/bundle-entry-points')
		const context = require.context("~/", /* deep: */ true, /* filter: */ ${filterRE});
		global.registerWebpackModules(context);
		// VIRTUAL ENTRY END
	`
	);

	config.entry('bundle').add(virtualEntryPath);

	// config.resolve.extensions.add('.xml');

	// set up xml
	config.module
		.rule('xml')
		.test(/\.xml$/)
		.use('xml-namespace-loader')
		.loader('xml-namespace-loader');

	return config;
}
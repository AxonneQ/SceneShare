import { Injectable } from '@angular/core';
import { remote } from 'electron';
import * as fs from 'fs';
import * as path_ from 'path';

@Injectable({
	providedIn: 'root',
})
export class ConfigEditorService {
	constructor() {
		this.fs = remote.require('fs');
	}

	fs: typeof fs;

	loadConfig(configFilePath: string) {
		try {
			const data = this.fs.readFileSync(configFilePath, 'utf8');
			const obj = JSON.parse(data);
			return obj;
		} catch (err) {
			console.log(err);
		}
	}

	// getAbsoluteRoot(filePaths: string[]) {
	// 	let sortedArray = filePaths.sort();
	// 	let first = sortedArray[0];
	// 	let last = sortedArray.pop();
	// 	let length = first.length;
	// 	let index = 0;

	// 	while (index < length && first[index] === last[index]) index++;
	// 	return first.substring(0, index);
	// }

	changeDelimiter(filePath: string[], delimiter: string) {
		let arr = [];
		filePath.forEach((path) => {
			let e = path.replace(/\\/g, delimiter);
			arr.push(e);
		});
		return arr;
	}

	replaceSources(configObject: Object, filePaths: string[]) {
		const sources = Object.entries(configObject['sources']);
		let currentFilePaths = new Array<string>();
		const pathPairs = new Array<string[]>();

		// Get all source paths
		sources.forEach((source) => {
			const settings = Object.entries(source[1]['settings']);
			settings.forEach((setting) => {
				if (setting[0].includes('local_file') || setting[0].includes('file')) {
					const path = <string>setting[1];
					currentFilePaths.push(path);
				}
			});
		});

		// Get raw data as string, then replace all paths with corresponding new path
		let stringifiedConfig = JSON.stringify(configObject, null, 4);

		filePaths = this.changeDelimiter(filePaths, '/');
		currentFilePaths = this.changeDelimiter(currentFilePaths, '/');

		currentFilePaths.forEach((path) => {
			let source = currentFilePaths.find((element) => element.includes(path_.basename(path)));
			let dest = filePaths.find((element) => element.includes(path_.basename(path)));
			pathPairs.push([source, dest]);
		});

		console.log(pathPairs);

		pathPairs.forEach((pair) => {
			if (pair[0] && pair[1]) {
				stringifiedConfig = stringifiedConfig.replace(pair[0], pair[1]);
				console.log(`replacing ${pair[0]} with ${pair[1]}`);
			}
		});

		return { config: stringifiedConfig, paths: pathPairs };
	}

	updatePaths(configPath: string, filePaths: string[]): string[][] {
		let configObject = this.loadConfig(configPath);
		let result = this.replaceSources(configObject, filePaths);
		this.fs.writeFileSync(configPath, result.config);

		return result.paths;
	}
}

import { ConfigEditorService } from './config-editor.service';
import { Injectable } from '@angular/core';
import * as fs from 'fs';
import { remote } from 'electron';

@Injectable({
	providedIn: 'root',
})
export class FileManagerService {
	configEdit: ConfigEditorService;
	configFilePath: string;

	sourcePath: string;
	targetPath: string;
	fs: typeof fs;
	files: Array<string>;

	constructor() {
		this.sourcePath = '';
		this.targetPath = '';
		this.fs = remote.require('fs');
		this.files = new Array<string>();
		this.configEdit = new ConfigEditorService();
	}

	setSourcePath(path: string) {
		this.sourcePath = path;
	}

	toRelativePath(path: string) {
		if (this.sourcePath === '') {
			console.error(`sourcePath is empty.`);
			return;
		}
		return path.replace(this.sourcePath, '');
	}

	getConfigFilePath() {
		const jsonFiles = [];
		const validConfigFiles = [];
		this.files.forEach((file) => {
			if (file.search('.json') !== -1) {
				jsonFiles.push(file);
			}
		});
		jsonFiles.forEach((file) => {
			const obj = JSON.parse(this.fs.readFileSync(file, 'utf8'));
			if (obj.name && obj.sources) {
				validConfigFiles.push(file);
			}
		});
		if (validConfigFiles.length > 1) {
			return { value: 2, message: 'Found more than 1 config JSON file.' };
		} else if (validConfigFiles.length === 0) {
			return { value: 0, message: 'Could not find a config JSON file.' };
		}
		this.configFilePath = validConfigFiles[0];
		return { value: 1, message: `Found config file: ${this.configFilePath}` };
	}

	updateConfigFile() {
		return this.configEdit.updatePaths(this.configFilePath, this.files);
	}

	async copy(sourcePath: string, targetPath: string) {
		this.sourcePath = sourcePath;
		this.targetPath = targetPath;

		this.loadFiles(sourcePath);
		this.saveFiles();
	}

	readDir(path: string) {
		const files = new Array<string>();
		const folderContents = this.fs.readdirSync(path, { encoding: 'utf8' });
		folderContents.forEach((file) => {
			const p = `${path}\\${file}`;
			if (this.fs.lstatSync(p).isDirectory()) {
				this.readDir(p);
			} else {
				this.files.push(p);
			}
		});
	}

	loadFiles(path: string) {
		this.files = new Array<string>();
		this.readDir(path);
	}

	async saveFiles() {
		if (this.files.length != 0) {
			this.files.forEach((file) => {
				const path = `${this.targetPath}${this.toRelativePath(file)}`;
				const fileIndex = path.lastIndexOf('\\');
				const folderPath = path.slice(0, fileIndex);
				if (!this.fs.existsSync(folderPath)) {
					this.fs.mkdirSync(folderPath);
				}
				this.fs.copyFileSync(file, path);
			});
		}
	}
}

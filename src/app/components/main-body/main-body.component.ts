import { Component, OnInit } from '@angular/core';
import { FileManagerService } from './../../services/file-manager.service';
import { Modal } from '../../models/modal.class';
import { Button } from '../../models/button.class';
import { transition, state, style, trigger } from '@angular/animations';
import { flyIn, flyOut } from '../../animations/animations';

@Component({
	selector: 'app-main-body',
	templateUrl: './main-body.component.html',
	styleUrls: ['./main-body.component.scss'],
	animations: [
		trigger('flyInOut', [
			state('in', style({ transform: 'translateX(0)' })),
			transition(':enter', flyIn),
			transition(':leave', flyOut),
		]),
	],
})
export class MainBodyComponent implements OnInit {
	constructor(private fileManager: FileManagerService) {
		this.fileManager = new FileManagerService();
		this.modal = new Modal();
	}

	sourcePath: string;
	targetPath: string;
	modal: Modal;

	ngOnInit(): void {}

	getSourcePath(path: string) {
		this.sourcePath = path;
	}

	getTargetPath(path: string) {
		this.targetPath = path;
	}

	changePaths() {
		this.modal.visible = true;
		this.modal.title = 'Change Paths';
		this.modal.status = 'running';
		this.modal.message = '- Starting...\n';
		this.modal.message += '- Loading Files...\n';
		this.fileManager.loadFiles(this.sourcePath);
		this.modal.message += '- Files Loaded...\n';
		const { value, message } = this.fileManager.getConfigFilePath();
		switch (value) {
			case 0: {
				//this.modal.visible = true;
				this.modal.title = 'Error';
				this.modal.message = message;
				this.modal.buttons.push(new Button('Close', 'close'));
				break;
			}
			case 1: {
				this.modal.message += `- ${message}\n- Editing config file...\n`;
				const ret = this.fileManager.updateConfigFile();
				this.modal.message += `- Changing sources: \n---------------------------\n`;
				ret.forEach((pathPair) => {
					if (pathPair[0] && pathPair[1]) {
						this.modal.message += `From: ${pathPair[0]}\nTo: ${pathPair[1]}\n\n`;
					}
				});
				this.modal.message += `---------------------------\n- Done!`;
				this.modal.buttons.push(new Button('Done', 'close'));
				//this.modal.visible = true;
				break;
			}
			case 2: {
				this.modal.visible = true;
				this.modal.title = 'Error';
				this.modal.message = message;
				this.modal.buttons.push(new Button('Close', 'close'));
				break;
			}
		}
		//this.fileManager.copy(this.sourcePath, this.targetPath);
	}
}

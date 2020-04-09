import { remote } from 'electron';
import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
	selector: 'app-path-picker',
	templateUrl: './path-picker.component.html',
	styleUrls: ['./path-picker.component.scss'],
})
export class PathPickerComponent implements OnInit {
	@Output() pathEvent: EventEmitter<string> = new EventEmitter();

	@Input()
	buttonText: string;

	@Input()
	path_text: string;

	@Input()
	type: string;

	@Input()
	label: string;

	constructor() {
		this.buttonText = 'button';
		this.path_text = 'path_msg';
		this.type = 'file';
		this.label = '';
		this.pathEvent.emit('');
	}

	ngOnInit(): void {}

	openPath() {
		switch (this.type) {
			case 'file':
				break;
			case 'folder':
				remote.dialog.showOpenDialog(remote.getCurrentWindow(), { properties: ['openDirectory'] }).then((res) => {
					if (res.filePaths.length != 0) {
						this.pathEvent.emit(res.filePaths[0]);
						this.path_text = res.filePaths[0];
					}
				});
				break;
		}
	}
}

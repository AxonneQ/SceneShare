import { remote } from 'electron';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-title-bar',
	templateUrl: './title-bar.component.html',
	styleUrls: ['./title-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
	constructor() {}

	isMaximized: boolean = false;

	ngOnInit(): void {}

	minimize() {
		remote.getCurrentWindow().minimize();
	}

	maximize() {
		remote.getCurrentWindow().maximize();
		this.isMaximized = true;
	}

	unmaximize() {
		remote.getCurrentWindow().unmaximize();
		this.isMaximized = false;
	}

	quit() {
		remote.getCurrentWindow().close();
	}
}

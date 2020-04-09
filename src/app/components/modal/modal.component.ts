import { Modal } from './../../models/modal.class';
import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
	constructor() {}

	@Input()
	modal: Modal;

	buttonAction(action: string) {
		switch (action) {
			case 'close':
				this.modal.clear();
		}
	}

	ngOnInit(): void {}
}

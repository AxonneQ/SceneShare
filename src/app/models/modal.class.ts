import { Button } from './button.class';

export class Modal {
  constructor() {
    this.clear();
  }

  clear() {
    this.buttons = new Array<Button>();
    this.title = "";
    this.message = "";
    this.visible = false;
    this.status = "";
  }

  title: string;
  message: string;
  status: string;
  buttons: Array<Button>;
  visible: boolean;
}

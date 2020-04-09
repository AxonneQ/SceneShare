import { animation, trigger, animateChild, group, transition, animate, style, query } from '@angular/animations';

export const transAnimation = animation([
	style({
		height: '{{ height }}',
		opacity: '{{ opacity }}',
		backgroundColor: '{{ backgroundColor }}',
	}),
	animate('{{ time }}'),
]);

export const flyIn = animation([style({ transform: 'translateX(-100%)' }), animate(100)]);

export const flyOut = animation([animate(100, style({ transform: 'translateX(100%)' }))]);

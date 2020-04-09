import 'reflect-metadata';
import '../polyfills';

// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Router
import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Components
import { AppComponent } from './app.component';
import { MainBodyComponent } from './components/main-body/main-body.component';
import { TopBarComponent } from './components/title-bar/title-bar.component';
import { PathPickerComponent } from './components/path-picker/path-picker.component';

// Services
import { FileManagerService } from './services/file-manager.service';
import { ConfigEditorService } from './services/config-editor.service';
import { ModalComponent } from './components/modal/modal.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
	return new TranslateHttpLoader(http, '../../assets/i18n', '.json');
}

@NgModule({
	declarations: [AppComponent, MainBodyComponent, TopBarComponent, PathPickerComponent, ModalComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,
		MatIconModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),
	],
	providers: [FileManagerService, ConfigEditorService],
	bootstrap: [AppComponent],
})
export class AppModule {}

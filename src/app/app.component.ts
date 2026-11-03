import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './shared/components/app-header/app-header.component';
import { AppFooterComponent } from './shared/components/app-footer/app-footer.component';
import { FlyerGeneratorPageComponent } from './features/flyer-generator/pages/flyer-generator-page/flyer-generator-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    FlyerGeneratorPageComponent,
    AppFooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'November Blessing Conference 2026 – Personalized Flyer Generator';
}

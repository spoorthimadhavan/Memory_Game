import { Routes } from '@angular/router';

import { ADMIN_ROUTES } from './admin.routes';
import { ContactPageComponent } from './features/contact/contact-page.component';
import { ProjectOverviewPageComponent } from './features/guide/project-overview-page.component';
import { RoadmapPageComponent } from './features/guide/roadmap-page.component';
import { MemoryPageComponent } from './features/memory/memory-page.component';
import { SuggestionPageComponent } from './features/suggestion/suggestion-page.component';

const PUBLIC_ROUTES: Routes = [
  { path: '', component: MemoryPageComponent },
  { path: 'about', component: ProjectOverviewPageComponent },
  { path: 'roadmap', component: RoadmapPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'suggestion', component: SuggestionPageComponent },
];

export const routes: Routes = [...PUBLIC_ROUTES, ...ADMIN_ROUTES, { path: '**', redirectTo: '' }];

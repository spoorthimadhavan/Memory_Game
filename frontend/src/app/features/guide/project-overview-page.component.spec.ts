import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectOverviewPageComponent } from './project-overview-page.component';

describe('ProjectOverviewPageComponent', () => {
  let fixture: ComponentFixture<ProjectOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectOverviewPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectOverviewPageComponent);
    fixture.detectChanges();
  });

  it('should render main sections', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('What the game does');
    expect(text).toContain('SQLite');
    expect(text).toContain('Architecture');
    expect(text).toContain('Development tools');
    expect(text).toContain('Run locally');
  });
});

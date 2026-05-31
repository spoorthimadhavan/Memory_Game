import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TECH_STACK_ITEMS } from './tech-stack.data';
import { TechStackPanelComponent } from './tech-stack-panel.component';

describe('TechStackPanelComponent', () => {
  let fixture: ComponentFixture<TechStackPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechStackPanelComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TechStackPanelComponent);
    fixture.detectChanges();
  });

  it('should render tech stack heading', () => {
    expect(fixture.nativeElement.textContent).toContain('Tech stack');
  });

  it('should open detail view on card click', () => {
    const comp = fixture.componentInstance;
    comp.openDetail(TECH_STACK_ITEMS[0]);
    fixture.detectChanges();
    expect(comp.view()).toBe('detail');
    expect(fixture.nativeElement.textContent).toContain('Real-world scenario');
  });

  it('should start quiz from detail', async () => {
    const comp = fixture.componentInstance;
    const item = TECH_STACK_ITEMS.find((t) => t.quiz.length > 0)!;
    comp.openDetail(item);
    comp.startQuiz(item);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(comp.view()).toBe('quiz');
    expect(fixture.nativeElement.textContent).toContain('mini quiz');
  });

  it('should filter by category', () => {
    const comp = fixture.componentInstance;
    comp.activeCategory.set('frontend');
    const filtered = comp.filteredItems();
    expect(filtered.every((i) => i.category === 'frontend')).toBe(true);
  });
});

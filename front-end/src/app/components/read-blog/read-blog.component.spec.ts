import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBlogComponent } from './read-blog.component';

describe('ReadBlogComponent', () => {
  let component: ReadBlogComponent;
  let fixture: ComponentFixture<ReadBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

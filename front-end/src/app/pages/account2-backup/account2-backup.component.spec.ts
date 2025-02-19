import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Account2BackupComponent } from './account2-backup.component';

describe('Account2BackupComponent', () => {
  let component: Account2BackupComponent;
  let fixture: ComponentFixture<Account2BackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account2BackupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Account2BackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

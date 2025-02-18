import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBackupComponent } from './account-backup.component';

describe('AccountBackupComponent', () => {
  let component: AccountBackupComponent;
  let fixture: ComponentFixture<AccountBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountBackupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

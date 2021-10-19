import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TasksManagementComponent } from "./task-management.component";

describe("TaskManagementComponent", () => {
  let component: TasksManagementComponent;
  let fixture: ComponentFixture<TasksManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { DatePipe, SlicePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectsService } from '@app/core/services/projects.service';
import { IClientLocation, IControlItem, IProject } from '@app/models';
import {
  FormGroupComponent,
  InputComponent,
  SelectComponent,
  markFormGroupTouched,
  CheckboxComponent,
  regex,
  regexErrors,
  Icons,
} from '@app/shared';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { validateDateOfStart } from './validators/project.validator';

// @ts-ignore
let $ = window['$'];

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  imports: [
    DatePipe,
    SlicePipe,
    ReactiveFormsModule,
    FormGroupComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    FontAwesomeModule,
    FormsModule,
  ],
})
export class ProjectsComponent implements OnInit {
  constructor(
    public projectsService: ProjectsService,
    private fb: FormBuilder
  ) {}

  @ViewChild('modal', { static: true }) modal?: ElementRef<HTMLElement>;
  @ViewChild('addModal', { static: true }) addModal?: ElementRef<HTMLElement>;

  ngOnInit(): void {}

  searchBy = '';
  searchTerm = '';

  icons = Icons;

  regexErrors = regexErrors;

  // necessary because of the modal
  editingProject!: IProject;

  projectStatus: IControlItem[] = [
    { label: 'Support', value: 'support' },
    { label: 'In Force', value: 'in force' },
  ];

  addProjectForm = this.fb.group({
    name: ['Cool Project', [Validators.required]],
    dateOfStart: ['', [Validators.required]],
    teamSize: [
      4,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(regex.numbers),
        validateDateOfStart(),
      ],
    ],
    status: ['', [Validators.required]],
    active: [true, [Validators.required]],
    clienLocationId: ['', [Validators.required]],
  });

  editProjectForm = this.fb.group({
    name: [''],
    dateOfStart: [''],
    teamSize: [0, [Validators.min(1), Validators.pattern(regex.numbers)]],
    status: [''],
    active: [false],
    clientLocationId: [''],
  });

  onAddProject() {
    if (this.addProjectForm.valid) {
      const f = this.addProjectForm.getRawValue();
      this.projectsService.addProject$.next({
        active: Boolean(f.active),
        clientLocationId: String(f.clienLocationId),
        name: String(f.name),
        dateOfStart: new Date(f.dateOfStart as string),
        status: String(f.status),
        teamSize: Number(f.teamSize),
      });

      console.log(this.addProjectForm.controls);
    } else {
      markFormGroupTouched(this.addProjectForm);
      return;
    }

    $(this.addModal?.nativeElement).modal('hide');
  }

  onDeleteProject(project: IProject) {
    this.projectsService.deleteProject$.next(project);
  }

  openEditProjectModal(project: IProject) {
    this.editingProject = project;
    this.editProjectForm.patchValue({
      name: project.name,
      active: project.active,
      clientLocationId: project.clientLocationId,
      dateOfStart: project.dateOfStart,
      status: project.status,
      teamSize: project.teamSize,
    });
  }

  onUpdateProject() {
    if (this.editProjectForm.valid) {
      this.projectsService.updateProject$.next({
        id: this.editingProject.id,
        project: { ...(this.editProjectForm.value as unknown as IProject) },
      });
    } else {
      markFormGroupTouched(this.editProjectForm);
      return;
    }
    $(this.modal?.nativeElement).modal('hide');
  }

  onSearchProjects() {
    if (this.searchBy === '' || this.searchTerm == '') {
      return;
    }
    this.projectsService.searchProject$.next({
      searchBy: this.searchBy,
      searchTerm: this.searchTerm,
    });
  }

  transformToControl(item: IClientLocation[]) {
    return item.map((x) => Object.assign({}, { label: x.name, value: x.id }));
  }
}

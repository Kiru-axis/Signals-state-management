import { Injectable, computed, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IClientLocation, ICreateProject, IProject, IState } from '@app/models';
import { environment } from '@environments/environment';
import { Subject, concatMap, mergeMap, startWith } from 'rxjs';

interface IProjectState extends IState {
  projects: IProject[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  p_url = environment.server_url + '/projects';
  client_url = environment.server_url + '/client-locations';

  // client locations
  clientLocations: IClientLocation[] = [];
  // ################  PROJECTS #################

  // state
  private projectsState = signal<IProjectState>({
    error: '',
    loaded: false,
    projects: [],
  });

  // selectors
  projects = computed(() => this.projectsState().projects);
  loaded = computed(() => this.projectsState().loaded);
  error = computed(() => this.projectsState().error);

  // sources
  addProject$ = new Subject<ICreateProject>();
  searchProject$ = new Subject<{ searchBy: string; searchTerm: string }>();
  deleteProject$ = new Subject<IProject>();
  updateProject$ = new Subject<{ project: Partial<IProject>; id: string }>();

  constructor(private http: HttpClient) {
    // get Client Locations

    this.http
      .get<IClientLocation[]>(this.client_url)
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        if (data) this.clientLocations = data;
      });

    // get projects
    this.http
      .get<IProject[]>(this.p_url)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (res) => {
          this.projectsState.update((state) => ({
            ...state,
            loaded: true,
            projects: res,
          }));
        },
        error: (error) => {
          this.projectsState.update((state) => ({
            ...state,
            error: error.error.error,
          }));
        },
      });

    // add project
    this.addProject$
      .pipe(
        takeUntilDestroyed(),
        concatMap((project) => {
          return this.http.post<IProject>(this.p_url, project);
        })
      )
      .subscribe({
        next: (project) => {
          this.projectsState.update((state) => ({
            ...state,
            projects: [...state.projects, project],
          }));
        },
        error: (error) => {
          this.projectsState.update((state) => ({
            ...state,
            error: error.error,
          }));
        },
      });

    // delete project
    this.deleteProject$
      .pipe(
        takeUntilDestroyed(),
        mergeMap((project) => {
          return this.http.delete<IProject>(`${this.p_url}/${project.id}`);
        })
      )
      .subscribe({
        next: (project) => {
          this.projectsState.update((state) => ({
            ...state,
            projects: state.projects.filter((x) => x.id !== project.id),
          }));
        },
        error: (error) => {
          this.projectsState.update((state) => ({
            ...state,
            error: error.error,
          }));
        },
      });

    // update project
    this.updateProject$
      .pipe(
        takeUntilDestroyed(),
        concatMap(({ project, id }) => {
          return this.http.put<IProject>(`${this.p_url}/${id}`, project);
        })
      )
      .subscribe({
        next: (project) => {
          this.projectsState.update((state) => ({
            ...state,
            projects: state.projects.map((proj) =>
              proj.id === project.id ? Object.assign({}, proj, project) : proj
            ),
          }));
        },
        error: (error) => {
          this.projectsState.update((state) => ({
            ...state,
            error: error.error,
          }));
        },
      });

    // search projrct
    this.searchProject$
      .pipe(
        takeUntilDestroyed(),
        mergeMap(({ searchBy, searchTerm }) =>
          this.http.get<IProject[]>(
            `${this.p_url}/search/${searchBy}/${searchTerm}`
          )
        )
      )
      .subscribe({
        next: (res) => {
          this.projectsState.update((state) => ({
            ...state,
            loaded: true,
            projects: res,
          }));
        },
        error: (error) => {
          this.projectsState.update((state) => ({
            ...state,
            error: error.error.error,
          }));
        },
      });
  }
}

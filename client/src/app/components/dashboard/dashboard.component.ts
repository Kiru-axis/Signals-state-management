import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgStyle,
  SlicePipe,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Clients,
  Projects,
  TeamMembers,
  TeamMembersSummary,
  Years,
} from './data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [CurrencyPipe, SlicePipe, DatePipe, RouterLink, NgClass],
})
export class DashboardComponent implements OnInit {
  designation = 'Team Leader';
  username = 'Scott Smith';
  noOfTeamMembers = 67;
  totalCostOfAllProjects = 240;
  pendingTasks = 15;
  upComingProjects = 5;
  projectCost = 2113507;
  currentExpenditure = 96788;
  availableFunds = 52536;
  today = new Date();

  years = Years;
  clients = Clients;
  projects = Projects;
  teamMembersSummary = TeamMembersSummary;
  teamsMembers = TeamMembers;

  ngOnInit(): void {}

  showProjectDetails(e: Event) {
    let txt = (e.target as HTMLElement).innerHTML;
    if (txt === 'Project A') {
      this.projectCost = 100000;
      this.currentExpenditure = 20000;
      this.availableFunds = 101000;
    }
    if (txt === 'Project B') {
      this.projectCost = 75900;
      this.currentExpenditure = 88000;
      this.availableFunds = 71000;
    }
    if (txt === 'Project C') {
      this.projectCost = 1000000;
      this.currentExpenditure = 799009;
      this.availableFunds = 999999;
    }
    if (txt === 'Project D') {
      this.projectCost = 55000;
      this.currentExpenditure = 12000;
      this.availableFunds = 43000;
    }
  }
}

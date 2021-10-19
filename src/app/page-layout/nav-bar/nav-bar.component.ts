import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";

import * as _ from "lodash";
import * as moment from "moment";
import { GoogleAnalyticsService } from "ngx-google-analytics";

import { GA } from "@mna-constants";
import { CarSheetService, CookieService, UserService, MessagingService } from "@mna-services";
import { AuthService } from "@mna/auth.service";

const {
  RECOVERED,
  TO_GET_BACK,
  IN_TRANSIT,
  FINISH,
  TASKS_PENDING,
  ABANDONED,
} = CarSheetService.CAR_STATUSES;

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit {
  readyCount: string;
  onGoingCount: string;
  carRequestCount: string;
  searchingPlate: string;
  searching: boolean;
  carServiceOptions;
  ownerOptions: {
    id: string;
    name: string;
    garage: {
      id: string;
      name: string;
    };
  }[];
  owners: {}[];
  loading: boolean;
  isExperimental: boolean;
  isShown: boolean;
  items: [];
  loadingNotification: boolean;

  @ViewChild("sidenav")
  sidenav: MatSidenav;

  @ViewChild("sidenavnoti")
  sidenavNoti: MatSidenav;

  close() {
    this.sidenav.close();
    this.sidenavNoti.close();
  }

  searchPlate = _.debounce(async () => {
    this.gaService.event(GA.ACTION.SEARCH_PLATE, GA.CATEGORY.NAVIGATION_BAR);
    try {
      if (!this.searchingPlate) {
        this.carServiceOptions = [];
        return;
      }
      this.searching = true;
      this.carServiceOptions = await this.carSheetService.searchCarServices(
        this.searchingPlate
      );
    } finally {
      this.searching = false;
    }
  }, 250);

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    private carSheetService: CarSheetService,
    private userService: UserService,
    private gaService: GoogleAnalyticsService,
    private messagingService: MessagingService
  ) {
    this.userService.statusCount.subscribe((status) => {
      const readyCount = _.sum([status[FINISH.value], status[ABANDONED.value]]);
      this.readyCount = !readyCount ? undefined : `${readyCount}`;
      const onGoingSum = _.sum([
        status[RECOVERED.value],
        status[TASKS_PENDING.value],
      ]);
      this.onGoingCount = !onGoingSum ? undefined : `${onGoingSum}`;
      const requestSum = _.add(
        status[TO_GET_BACK.value],
        status[IN_TRANSIT.value]
      );
      this.carRequestCount = !requestSum ? undefined : `${requestSum}`;
    });
    this.ownerOptions = [];
    this.owners = [];
    this.router.events.subscribe((val) => {
      this.searchingPlate = "";
      this.sidenav.close();
    });
    this.authService.isLoggedIn.subscribe(async (loggedIn) => {
      if (loggedIn) {
        await this.loadOwnerFilter();
      }
    });
  }

  async onNotificationClick() {
    if (this.sidenavNoti.opened) {
      this.loadingNotification = true;
      try {
        this.items = await this.messagingService.getNotification({limit: 100});
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingNotification = false;
      }
    }
  }

  async ngOnInit() {
    this.isExperimental = await this.carSheetService.isExperimental();
  }

  async loadOwnerFilter() {
    this.loading = true;
    try {
      this.ownerOptions = await this.userService.listAllOwners();
      const cookie = CookieService.getCookie("owner-filter");
      if (!_.isNil(cookie)) {
        this.owners = !cookie ? [] : cookie.split(",");
      } else {
        // Set default to ALL owners
        this.onChangeOwners(["ALL"]);
      }
    } finally {
      this.loading = false;
    }
  }

  async logOut() {
    await this.authService.logout();
    this.userService.showSuccessPopup("Vous êtes déconnectés!");
  }

  async onCarServiceSelected(carService) {
    this.gaService.event(
      GA.ACTION.SELECT_CAR_SERVICE,
      GA.CATEGORY.NAVIGATION_BAR
    );
    await this.router.navigate(["/car-sheet/" + carService.id]);
  }

  displayCarService(carService) {
    return `${carService.plate} - ${moment(carService.createdAt).format(
      "DD/MM/YYYY"
    )}`;
  }

  onChangeOwners(owners: {}[]) {
    if (_.isEqual(_.sortBy(this.owners), _.sortBy(owners))) {
      return;
    }
    this.gaService.event(GA.ACTION.FILTER_OWNER, GA.CATEGORY.NAVIGATION_BAR);
    this.owners = owners;
    if (this.owners.length === 0) {
      this.owners.push("ALL");
    }
    CookieService.setCookie("owner-filter", this.owners.join(","), 30);
    setTimeout(() => window.location.reload(), 100);
  }
}

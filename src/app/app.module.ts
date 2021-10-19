import { DragDropModule } from "@angular/cdk/drag-drop";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { HttpClientModule } from "@angular/common/http";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  Input,
  NgModule,
  Pipe,
  PipeTransform,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule, DomSanitizer } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatCarouselModule } from "@ngbmodule/material-carousel";
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import "chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js";
import { NgMatSearchBarModule } from "ng-mat-search-bar";
import { CanvasWhiteboardModule } from "ng2-canvas-whiteboard";
import { ChartsModule } from "ng2-charts";
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
} from "ngx-google-analytics";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { NgxSpinnerModule } from "ngx-spinner";

import {
  ActiveIconComponent,
  CommentComponent,
  CommentsComponent,
  ConfirmButtonComponent,
  ConfirmDialogComponent,
  ExpansionPanelComponent,
  ExpertiseWizardComponent,
  ExpertiseWizardStepModule,
  NotificationsComponent,
  OwnerSelectComponent,
  ProcedureVeComponent,
  ProcedureVeStepsComponent,
  SavRequestTableComponent,
  TasksManagementComponent,
  TasksSelectPanelComponent,
} from "@mna-components";
import {
  ExpertiseWizardDialogComponent,
  PreviewItemListComponent,
  SavDialogComponent,
  SecondEstimationDialogComponent,
  SparePartsBoxDialogComponent,
  SparePartsOrderDialogComponent,
  SubTasksDialogV2Component,
  TasksDialogComponent,
} from "@mna-dialogs";
import {
  AccountComponent,
  EditAccountDialogComponent,
} from "@mna-pages/account/account.component";
import { ArchiveComponent } from "@mna-pages/archive/archive.component";
import {
  CarExpertisePriceRateComponent,
  EditBodyworkDialogComponent,
  EditPiecePriceRateDialogComponent,
  EditPriceRateDialogComponent,
} from "@mna-pages/car-expertise-price-rate/car-expertise-price-rate.component";
import { CarExpertiseComponent } from "@mna-pages/car-expertise/car-expertise.component";
import { CarOnGoingComponent } from "@mna-pages/car-on-going/car-on-going.component";
import { CarReadyComponent } from "@mna-pages/car-ready/car-ready.component";
import { CarRequestComponent } from "@mna-pages/car-request/car-request.component";
import {
  CarSheetComponent,
  ForTaskPipe,
  HasTwoTaskPipe,
} from "@mna-pages/car-sheet/car-sheet.component";
import { ChangePasswordComponent } from "@mna-pages/change-password/change-password.component";
import {
  CreateCarComponent,
  OscaroDialogComponent,
} from "@mna-pages/create-car/create-car.component";
import { DashboardCardComponent } from "@mna-pages/dashboard/dashboard-card.component";
import { DashboardComponent } from "@mna-pages/dashboard/dashboard.component";
import {
  EditEmployeeDialogComponent,
  EmployeeComponent,
} from "@mna-pages/employee/employee.component";
import { ExpertiseComponent } from "@mna-pages/expertise/expertise.component";
import { LoginComponent } from "@mna-pages/login/login.component";
import {
  EditOwnerDialogComponent,
  OwnerComponent,
} from "@mna-pages/owner/owner.component";
import { PicsManagementComponent } from "@mna-pages/pics-management/pics-management.component";
import { PicsUploadComponent } from "@mna-pages/pics-upload/pics-upload.component";
import { QrCodeScannerComponent } from "@mna-pages/qr-code-scanner/qr-code-scanner.component";
import {
  EditRoleDialogComponent,
  RoleComponent,
} from "@mna-pages/role/role.component";
import {
  EditSparePartRefDialogComponent,
  SparePartRefComponent,
} from "@mna-pages/spare-part-ref/spare-part-ref.component";
import { SparePartsManagementComponent } from "@mna-pages/spare-parts-management/spare-parts-management.component";
import { StatisticsComponent } from "@mna-pages/statistics/statistics.component";
import { PartRefDialogComponent } from "@mna/dialogs/part-reference-dialog/part-reference-dialog.component";

import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavBarComponent } from "./page-layout/nav-bar/nav-bar.component";

export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};

export class MatPaginatorIntlFr extends MatPaginatorIntl {
  itemsPerPageLabel = "Objets par page";
  nextPageLabel = "Page suivante";
  previousPageLabel = "Page précédente";
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 sur ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} sur ${length}`;
  };
}

@Pipe({
  name: "safeUrl",
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Directive({
  // don't use 'ng' prefix since it's reserved for Angular
  selector: "[appVar]",
})
export class VarDirective<T = unknown> {
  private context?: Context<T>;

  // https://angular.io/guide/structural-directives#typing-the-directives-context
  static ngTemplateContextGuard<T>(
    dir: VarDirective<T>,
    ctx: any
  ): ctx is Context<T> {
    return true;
  }

  constructor(
    private vcRef: ViewContainerRef,
    private templateRef: TemplateRef<Context<T>>
  ) {}

  @Input()
  set appVar(value: T) {
    if (this.context) {
      this.context.appVar = value;
    } else {
      this.context = { appVar: value };
      this.vcRef.createEmbeddedView(this.templateRef, this.context);
    }
  }
}

interface Context<T> {
  appVar: T;
}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CreateCarComponent,
    DashboardComponent,
    CarOnGoingComponent,
    CarReadyComponent,
    LoginComponent,
    AccountComponent,
    EditAccountDialogComponent,
    RoleComponent,
    EditRoleDialogComponent,
    CarSheetComponent,
    ActiveIconComponent,
    ConfirmButtonComponent,
    ConfirmDialogComponent,
    CarRequestComponent,
    OscaroDialogComponent,
    SafeUrlPipe,
    TasksDialogComponent,
    SparePartsManagementComponent,
    ExpertiseWizardDialogComponent,
    ExpertiseWizardComponent,
    DashboardCardComponent,
    ChangePasswordComponent,
    PicsManagementComponent,
    PicsUploadComponent,
    QrCodeScannerComponent,
    StatisticsComponent,
    SparePartsOrderDialogComponent,
    SparePartsBoxDialogComponent,
    OwnerComponent,
    EditOwnerDialogComponent,
    ArchiveComponent,
    CommentsComponent,
    CommentComponent,
    SparePartRefComponent,
    EditSparePartRefDialogComponent,
    PartRefDialogComponent,
    VarDirective,
    ForTaskPipe,
    HasTwoTaskPipe,
    ProcedureVeComponent,
    OwnerSelectComponent,
    SubTasksDialogV2Component,
    ProcedureVeStepsComponent,
    PreviewItemListComponent,
    CarExpertisePriceRateComponent,
    CarExpertiseComponent,
    ExpansionPanelComponent,
    SavDialogComponent,
    TasksSelectPanelComponent,
    TasksManagementComponent,
    SavRequestTableComponent,
    ExpertiseComponent,
    NotificationsComponent,
    EmployeeComponent,
    EditEmployeeDialogComponent,
    SecondEstimationDialogComponent,
    EditBodyworkDialogComponent,
    EditPriceRateDialogComponent,
    EditPiecePriceRateDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatRadioModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatCarouselModule.forRoot(),
    ChartsModule,
    NgMatSearchBarModule,
    MatStepperModule,
    NgxSpinnerModule,
    ZXingScannerModule,
    MatSlideToggleModule,
    DragDropModule,
    NgxMatSelectSearchModule,
    NgxGoogleAnalyticsModule.forRoot(environment.gaTrackingId),
    NgxGoogleAnalyticsRouterModule,
    MatTreeModule,
    ExpertiseWizardStepModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    MatSortModule,
    CanvasWhiteboardModule,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    EditAccountDialogComponent,
    EditRoleDialogComponent,
    OscaroDialogComponent,
    TasksDialogComponent,
    DashboardCardComponent,
    SparePartsOrderDialogComponent,
    SparePartsBoxDialogComponent,
    EditOwnerDialogComponent,
    EditSparePartRefDialogComponent,
    PartRefDialogComponent,
    PreviewItemListComponent,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlFr },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // For custom icon in the procedure ve stepper in car sheet
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

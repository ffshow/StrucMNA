import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuardService as AuthGuard } from "./auth-guard.service";
import { AccountComponent } from "./pages/account/account.component";
import { ArchiveComponent } from "./pages/archive/archive.component";
import { CarExpertisePriceRateComponent } from "./pages/car-expertise-price-rate/car-expertise-price-rate.component";
import { CarExpertiseComponent } from "./pages/car-expertise/car-expertise.component";
import { CarOnGoingComponent } from "./pages/car-on-going/car-on-going.component";
import { CarReadyComponent } from "./pages/car-ready/car-ready.component";
import { CarRequestComponent } from "./pages/car-request/car-request.component";
import { CarSheetComponent } from "./pages/car-sheet/car-sheet.component";
import { ChangePasswordComponent } from "./pages/change-password/change-password.component";
import { CreateCarComponent } from "./pages/create-car/create-car.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { EmployeeComponent } from "./pages/employee/employee.component";
import { ExpertiseComponent } from "./pages/expertise/expertise.component";
import { LoginComponent } from "./pages/login/login.component";
import { OwnerComponent } from "./pages/owner/owner.component";
import { PicsManagementComponent } from "./pages/pics-management/pics-management.component";
import { PicsUploadComponent } from "./pages/pics-upload/pics-upload.component";
import { QrCodeScannerComponent } from "./pages/qr-code-scanner/qr-code-scanner.component";
import { RoleComponent } from "./pages/role/role.component";
import { SparePartRefComponent } from "./pages/spare-part-ref/spare-part-ref.component";
import { SparePartsManagementComponent } from "./pages/spare-parts-management/spare-parts-management.component";
import { StatisticsComponent } from "./pages/statistics/statistics.component";
import { PermissionGuardService as PermissionGuard } from "./permission-guard.service";

export const appRouteList: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: {
      noAuth: true,
    },
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [],
    },
  },
  {
    path: "account",
    component: AccountComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN"],
    },
  },
  {
    path: "role",
    component: RoleComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN"],
    },
  },
  {
    path: "owner",
    component: OwnerComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN"],
    },
  },
  {
    path: "employee",
    component: EmployeeComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN"],
    },
  },
  {
    path: "create-car",
    component: CreateCarComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN", "READ_WRITE"],
    },
  },
  {
    path: "create-request",
    component: CarRequestComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [
        "ROOT_ADMIN",
        "READ_ONLY",
        "READ_WRITE",
        "READ_WRITE_STATUS",
      ],
    },
  },
  {
    path: "parts",
    component: SparePartsManagementComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN", "PARTS_MANAGEMENT", "STORE_KEEPER"],
    },
  },
  {
    path: "part-ref",
    component: SparePartRefComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN", "PARTS_MANAGEMENT"],
    },
  },
  {
    path: "car-sheet/:id",
    component: CarSheetComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [
        "ROOT_ADMIN",
        "READ_ONLY",
        "READ_WRITE",
        "READ_WRITE_STATUS",
      ],
    },
  },
  {
    path: "car-expertise",
    component: CarExpertiseComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [
        "ROOT_ADMIN",
        "READ_ONLY",
        "READ_WRITE",
        "READ_WRITE_STATUS",
      ],
    },
  },
  {
    path: "car-expertise/price-rate",
    component: CarExpertisePriceRateComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN"],
    },
  },
  {
    path: "car-expertise/:id",
    component: ExpertiseComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [
        "ROOT_ADMIN",
        "READ_ONLY",
        "READ_WRITE",
        "READ_WRITE_STATUS",
      ],
    },
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [],
    },
  },
  {
    path: "on-going",
    component: CarOnGoingComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [
        "ROOT_ADMIN",
        "READ_ONLY",
        "READ_WRITE",
        "READ_WRITE_STATUS",
      ],
    },
  },
  {
    path: "pics-management",
    component: PicsManagementComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["PICS_UPLOAD"],
    },
  },
  {
    path: "pics-upload/:id",
    component: PicsUploadComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["PICS_UPLOAD"],
    },
  },
  {
    path: "ready",
    component: CarReadyComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [
        "ROOT_ADMIN",
        "READ_ONLY",
        "READ_WRITE",
        "READ_WRITE_STATUS",
      ],
    },
  },
  {
    path: "qr-code-scanner",
    component: QrCodeScannerComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: [],
    },
  },
  {
    path: "archive",
    component: ArchiveComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN"],
    },
  },
  {
    path: "statistics",
    component: StatisticsComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      permissions: ["ROOT_ADMIN"],
    },
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(appRouteList, {
      useHash: true,
      relativeLinkResolution: "legacy",
    }),
  ],
})
export class AppRoutingModule {}

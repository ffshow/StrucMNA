import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import * as _ from "lodash";
import {
  CanvasWhiteboardComponent,
  CanvasWhiteboardOptions,
} from "ng2-canvas-whiteboard";
import { GoogleAnalyticsService } from "ngx-google-analytics";

import {
  CarService,
  CarSheetService,
  ExpertiseService,
  PartOrderService,
  Task,
  TaskService,
} from "@mna-services";
import { AuthService } from "@mna/auth.service";
import { GA } from "@mna/constants";
import {
  ExpertiseWizardDialogComponent,
  SparePartsBoxDialogComponent,
  SparePartsOrderDialogComponent,
  SubTasksDialogV2Component,
} from "@mna/dialogs";
import { PartRefDialogComponent } from "@mna/dialogs/part-reference-dialog/part-reference-dialog.component";

interface TaskWithName extends Task {
  name: string;
}
interface PartBox {
  id: string;
  code: string;
  receiver: string;
}

interface PartOrder {
  id: string;
  name: string;
  reference: { id; provider; barCode; reference };
  forTask: "BODYWORK" | "MECHANICS";
}
interface PartOrderByBox {
  partBox: PartBox;
  partOrders: PartOrder[];
}

@Component({
  selector: "app-tasks-management",
  viewProviders: [CanvasWhiteboardComponent],
  templateUrl: "./tasks-management.component.html",
  styleUrls: ["./tasks-management.component.scss"],
})
export class TasksManagementComponent implements OnInit, OnChanges {
  @Input()
  carServiceId: string;

  @Input()
  carService: CarService;

  @Input()
  taskService: TaskService;

  @Input()
  isEditable: boolean;

  @Input()
  secondaryTaskOrdinal: number;

  @Output()
  reloadCarSheetEvent = new EventEmitter<string>();

  public loading: boolean;
  isAbandoned: boolean;

  editPermission: boolean;
  partMngPermission: boolean;
  storeKeeperPermission: boolean;

  taskLists: Task[] = [];
  notStartedTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  finishedTasks: Task[] = [];
  inProgressTasksStatus: TaskWithName[] = [];
  finishedTasksStatus: TaskWithName[] = [];

  finishedTasksGroup: Task[] = [];
  inProgressTasksGroup: Task[] = [];

  hasPartOrderTask: boolean;
  groupedPartOrdersByBox: PartOrderByBox[] = [];
  unassignedPartOrders: PartOrder[] = [];
  returnedPartOrders: PartOrder[] = [];
  status: string;
  initLoading = true;
  canvasOptions: CanvasWhiteboardOptions = {
    shapeSelectorEnabled: false,
    drawingEnabled: true,
    drawButtonEnabled: false,
    clearButtonEnabled: true,
    clearButtonText: "Tout effacer",
    undoButtonEnabled: false,
    redoButtonEnabled: false,
    colorPickerEnabled: false,
    saveDataButtonEnabled: true,
    saveDataButtonText: "Soumettre",
    strokeColor: "rgb(0,0,0)",
    shouldDownloadDrawing: false,
  };
  isSecondEstimation: boolean;

  constructor(
    public dialog: MatDialog,
    private partOrderService: PartOrderService,
    private carSheetService: CarSheetService,
    private gaService: GoogleAnalyticsService,
    private expertiseService: ExpertiseService,
    private authService: AuthService
  ) {
    this.editPermission = this.authService.checkAuthorized([
      "READ_WRITE_STATUS",
    ]);
    this.partMngPermission = this.authService.checkAuthorized([
      "PARTS_MANAGEMENT",
    ]);
    this.storeKeeperPermission = this.authService.checkAuthorized([
      "STORE_KEEPER",
    ]);
  }

  ngOnInit(): void {}

  async ngOnChanges(changes: SimpleChanges) {
    await this.loadTasks();
  }

  async loadTasks() {
    this.loading = true;
    try {
      this.isAbandoned =
        this.taskService.status ===
        CarSheetService.CAR_STATUSES.ABANDONED.value;
      this.status = CarSheetService.getCarServiceStatus(this.carService);

      this.isSecondEstimation =
        !_.isNil(this.secondaryTaskOrdinal) &&
        !!this.taskService.secondaryTasks;
      const workingTasks = this.isSecondEstimation
        ? this.taskService.secondaryTasks[this.secondaryTaskOrdinal].tasks
        : this.taskService.tasks;

      this.taskLists = _.filter(
        workingTasks as Task[],
        (t) => t.taskType.code !== CarSheetService.TASK_CODES.PARTS_TO_ORDER
      );
      this.notStartedTasks = _.filter(
        this.taskLists,
        (t) => !t.startedAt && !t.finishedAt
      );
      this.inProgressTasks = _.orderBy(
        _.filter(this.taskLists, (t) => !!t.startedAt && !t.finishedAt),
        ["startedAt"],
        ["asc"]
      );
      this.finishedTasks = _.orderBy(
        _.filter(this.taskLists, (t) => !!t.startedAt && !!t.finishedAt),
        ["startedAt"],
        ["asc"]
      );
      const fullTaskLists = [];
      _.forEach(this.taskLists, (task) => {
        if (task.subTasks && task.subTasks.length > 0) {
          fullTaskLists.push(
            ..._.map(task.subTasks, (st) => ({
              ...st,
              name: `${task.taskType.name} - ${st.subTaskType.name}`,
            }))
          );
        } else {
          fullTaskLists.push({
            ...task,
            name: task.taskType.name,
          });
        }
      });
      this.inProgressTasksStatus = _.orderBy(
        _.filter(fullTaskLists, (t) => !!t.startedAt && !t.finishedAt),
        ["startedAt"],
        ["asc"]
      );
      this.finishedTasksStatus = _.orderBy(
        _.filter(fullTaskLists, (t) => !!t.startedAt && !!t.finishedAt),
        ["startedAt"],
        ["asc"]
      );
      this.finishedTasksGroup = [];
      _.forEach(this.taskLists, (task) => {
        if (_.isEmpty(task.subTasks) && !!task.startedAt && !!task.finishedAt) {
          this.finishedTasksGroup.push(task);
        } else {
          const subTasks = _.filter(
            task.subTasks,
            (st) => !!st.startedAt && !!st.finishedAt
          );
          if (!_.isEmpty(subTasks)) {
            this.finishedTasksGroup.push({ ...task, subTasks });
          }
        }
      });
      this.inProgressTasksGroup = [];
      _.forEach(this.taskLists, (task) => {
        if (_.isEmpty(task.subTasks) && !!task.startedAt && !task.finishedAt) {
          this.inProgressTasksGroup.push(task);
        } else {
          const subTasks = _.filter(
            task.subTasks,
            (st) => !!st.startedAt && !st.finishedAt
          );
          if (!_.isEmpty(subTasks)) {
            this.inProgressTasksGroup.push({ ...task, subTasks });
          }
        }
      });
      this.hasPartOrderTask = _.some(
        workingTasks,
        (t) => t.taskType.code === CarSheetService.TASK_CODES.PARTS_TO_ORDER
      );
      if (this.hasPartOrderTask) {
        await this.loadPartBoxes();
      }
    } finally {
      this.loading = false;
      this.initLoading = false;
    }
  }

  getFinishedTasks() {
    return _.filter(
      this.finishedTasks,
      (t) =>
        t.subTasks.length ===
        _.filter(t.subTasks, (st) => !!st.startedAt && !!st.finishedAt).length
    );
  }

  getTasksStatus() {
    if (this.initLoading) {
      return "loading";
    } else if (
      this.getFinishedTasks().length === this.taskLists.length &&
      _.isEmpty(this.unassignedPartOrders)
    ) {
      return "finished";
    } else if (
      this.notStartedTasks.length === this.taskLists.length &&
      _.isEmpty(this.groupedPartOrdersByBox)
    ) {
      return "not-started";
    } else {
      return "in-progress";
    }
  }

  onFinishTask(taskName, taskCode) {
    return async () => {
      this.gaService.event(
        GA.ACTION.FINISH_TASK,
        GA.CATEGORY.CAR_SERVICE_SHEET,
        taskCode
      );
      const id = this.carServiceId;
      if (!this.isSecondEstimation) {
        await this.carSheetService.finishTaskCarService(id, taskCode);
      } else {
        await this.carSheetService.finishSecondTaskCarService(
          id,
          taskCode,
          this.secondaryTaskOrdinal
        );
      }
      await this.loadCarSheet(id);
      this.carSheetService.showSuccessPopup(
        `La tâche '${taskName}' terminée avec succès`
      );
    };
  }

  async onOpenSubTaskDialog(task) {
    this.dialog.open(SubTasksDialogV2Component, {
      disableClose: true,
      autoFocus: false,
      data: {
        carService: this.carService,
        task: task,
        subTasks: task.subTasks,
        onUpdated: async () => {
          await this.loadCarSheet(this.carServiceId);
        },
        secondTaskOrdinal: this.secondaryTaskOrdinal,
      },
    });
  }

  onStartTask(taskName, taskCode) {
    return async () => {
      const isExperimental = await this.carSheetService.isExperimental();
      if (taskCode === "EAD" && isExperimental) {
        await this.onStartEadTask();
        return;
      }

      this.gaService.event(
        GA.ACTION.START_TASK,
        GA.CATEGORY.CAR_SERVICE_SHEET,
        taskCode
      );
      const id = this.carServiceId;
      if (!this.isSecondEstimation) {
        await this.carSheetService.startTaskCarService(id, taskCode);
      } else {
        await this.carSheetService.startSecondTaskCarService(
          id,
          taskCode,
          this.secondaryTaskOrdinal
        );
      }
      await this.loadCarSheet(id);
      this.carSheetService.showSuccessPopup(
        `La tâche '${taskName}' a démarré avec succès`
      );
    };
  }

  async onStartEadTask() {
    const eadStepData = await this.expertiseService.getEadStepData(
      this.carServiceId
    );
    this.dialog.open(ExpertiseWizardDialogComponent, {
      width: "800px",
      data: {
        carService: this.carService,
        steps: eadStepData,
        title: "EAD (Expertise à distance)",
        description: `
        <h3>
          Afin d’effectuer l’expertise à distance, il est important de fournir des photos détaillées qui permettront
          d’appuyer le devis.
          <br/>
          Veillez suivre étape par étape la procédure d’expertise à distance en respectant toutes les indications.
        </h3>
        `,
      },
    });
  }

  onRemoveStartedTask(taskName, taskCode) {
    return async () => {
      this.gaService.event(
        GA.ACTION.REMOVE_STARTED_TASK,
        GA.CATEGORY.CAR_SERVICE_SHEET,
        taskCode
      );
      const id = this.carServiceId;
      if (!this.isSecondEstimation) {
        await this.carSheetService.removeStartedTaskCarService(id, taskCode);
      } else {
        await this.carSheetService.removeStartedSecondTaskCarService(
          id,
          taskCode,
          this.secondaryTaskOrdinal
        );
      }
      await this.loadCarSheet(id);
      this.carSheetService.showSuccessPopup(
        `La tâche '${taskName}' mise à jour avec succès`
      );
    };
  }

  onRemoveFinishedTask(taskName, taskCode) {
    return async () => {
      this.gaService.event(
        GA.ACTION.REMOVE_FINISHED_TASK,
        GA.CATEGORY.CAR_SERVICE_SHEET,
        taskCode
      );
      const id = this.carServiceId;
      if (!this.isSecondEstimation) {
        await this.carSheetService.removeFinishedTaskCarService(id, taskCode);
      } else {
        await this.carSheetService.removeFinishedSecondTaskCarService(
          id,
          taskCode,
          this.secondaryTaskOrdinal
        );
      }
      await this.loadCarSheet(id);
      this.carSheetService.showSuccessPopup(
        `La tâche '${taskName}' mise à jour avec succès`
      );
    };
  }

  async loadPartBoxes() {
    const partOrders = await this.partOrderService.listAllPartOrdersByTaskService(
      this.taskService.id
    );
    this.groupedPartOrdersByBox = [];

    this.unassignedPartOrders = _.chain(partOrders as any[])
      .filter(
        (o) =>
          !o.partBox &&
          !o.isReturned &&
          (this.isSecondEstimation
            ? o.secondaryTaskOrdinal === this.secondaryTaskOrdinal
            : _.isNil(o.secondaryTaskOrdinal))
      )
      .map((o) => ({
        id: o.id,
        name: o.additionalPartName || o.part.name,
        reference: o.partReference,
        forTask: o.forTask,
        partFrom: o.partFrom,
        expectedReceiptDate: o.expectedReceiptDate,
        supplierResponse: o.supplierResponse,
        constructorTime: o.constructorTime,
        editable: this.partMngPermission,
      }))
      .value();

    this.returnedPartOrders = _.chain(partOrders as any[])
      .filter(
        (o) =>
          o.isReturned &&
          (this.isSecondEstimation
            ? o.secondaryTaskOrdinal === this.secondaryTaskOrdinal
            : _.isNil(o.secondaryTaskOrdinal))
      )
      .map((o) => ({
        id: o.id,
        name: o.additionalPartName || o.part.name,
        reference: o.partReference,
        forTask: o.forTask,
        partFrom: o.partFrom,
        expectedReceiptDate: o.expectedReceiptDate,
        supplierResponse: o.supplierResponse,
        constructorTime: o.constructorTime,
        returnReason: o.returnReason,
        editable: false,
      }))
      .value();

    const assignedPartOrders = _.chain(partOrders as any[])
      .filter(
        (o) =>
          !!o.partBox &&
          !o.isReturned &&
          (this.isSecondEstimation
            ? o.secondaryTaskOrdinal === this.secondaryTaskOrdinal
            : _.isNil(o.secondaryTaskOrdinal))
      )
      .map((o) => ({
        id: o.id,
        name: o.additionalPartName || o.part.name,
        box: o.partBox,
        reference: o.partReference,
        forTask: o.forTask,
        partFrom: o.partFrom,
        expectedReceiptDate: o.expectedReceiptDate,
        supplierResponse: o.supplierResponse,
        constructorTime: o.constructorTime,
        editable: this.partMngPermission,
      }))
      .value();
    const assignedBoxes = _.map(
      _.uniqBy(assignedPartOrders, (o) => o.box.code),
      (o) => o.box
    );
    _.forEach(assignedBoxes, (box) => {
      this.groupedPartOrdersByBox.push({
        partBox: box,
        partOrders: _.filter(
          assignedPartOrders,
          (o) => o.box.code === box.code
        ),
      } as any);
    });
  }

  async openPartRefDialog(partOrder) {
    if (!partOrder) {
      return;
    }
    this.dialog.open(PartRefDialogComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        name: partOrder.name,
        owner:
          this.carService &&
          this.carService.owner &&
          this.carService.owner.name,
        reference: partOrder.reference,
        forTask: partOrder.forTask,
        partFrom: partOrder.partFrom,
        expectedReceiptDate: partOrder.expectedReceiptDate,
        supplierResponse: partOrder.supplierResponse,
        constructorTime: partOrder.constructorTime,
        returnReason: partOrder.returnReason,
        editable: !this.isAbandoned && !this.isEditable && partOrder.editable,
        onEdit: async ({
          referenceId,
          expectedReceiptDate,
          supplierResponse,
          constructorTime,
          partFrom,
        }) => {
          await this.partOrderService.assignPartReference({
            orderIds: [partOrder.id],
            reference: referenceId,
            expectedReceiptDate,
            supplierResponse,
            constructorTime,
            partFrom,
            changeMessage: "Ajouter une référence à la pièce détachée",
          });
          await this.loadPartBoxes();
          this.carSheetService.showSuccessPopup(
            `Mettre à jour une référence à ${partOrder.name} avec succès`
          );
        },
      },
    });
  }

  onOrder() {
    this.gaService.event(
      GA.ACTION.OPEN_SPARE_PART_ORDERS_DIALOG,
      GA.CATEGORY.CAR_SERVICE_SHEET
    );
    const id = this.carServiceId;
    this.dialog.open(SparePartsOrderDialogComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: "dialog-container",
      data: {
        carServiceId: id,
        taskServiceId: this.taskService.id,
        secondaryTaskOrdinal: this.secondaryTaskOrdinal,
        onSubmitted: async ({}) => {
          await this.loadCarSheet(id);
          this.carSheetService.showSuccessPopup(
            "Pièces de rechange commandées avec succès!"
          );
        },
      },
    });
  }

  onManageBox() {
    this.gaService.event(
      GA.ACTION.OPEN_SPARE_PART_BOXES_DIALOG,
      GA.CATEGORY.CAR_SERVICE_SHEET
    );
    const id = this.carServiceId;
    this.dialog.open(SparePartsBoxDialogComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: "dialog-container",
      data: {
        carServiceId: id,
        status: this.status,
        onSubmitted: async ({}) => {
          await this.loadCarSheet(id);
          this.carSheetService.showSuccessPopup(
            "Pièces de rechange gérées avec succès!"
          );
        },
      },
    });
  }

  async onSaveSignature(signature) {
    this.gaService.event(
      GA.ACTION.SIGN_SECOND_ESTIMATION,
      GA.CATEGORY.CAR_SERVICE_SHEET
    );
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const id = this.carServiceId;
      await this.carSheetService.signSecondTaskCarService(
        id,
        signature,
        this.secondaryTaskOrdinal
      );
      await this.loadCarSheet(id);
    } finally {
      this.loading = false;
    }
  }

  onRemoveSignature() {
    return async () => {
      this.gaService.event(
        GA.ACTION.REMOVE_SIGNATURE_SECOND_ESTIMATION,
        GA.CATEGORY.CAR_SERVICE_SHEET
      );
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const id = this.carServiceId;
        await this.carSheetService.signSecondTaskCarService(
          id,
          "",
          this.secondaryTaskOrdinal
        );
        await this.loadCarSheet(id);
      } finally {
        this.loading = false;
      }
    };
  }

  private async loadCarSheet(id) {
    await this.reloadCarSheetEvent.emit(id);
  }
}

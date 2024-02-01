export interface LabInterface {
  OrderResultZPSID: number;
  OrderResultID: number;
  SequenceNumber: string;
  FacilityMnemonic: string;
  FacilityName: string;
  Director: string;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  Phone: string;
}

export interface TestResultInterface {
  OrderResultTestResultsID: number;
  OrderResultID: number;
  OrderResultTestID: number;
  ObservationCode: string;
  ObservationText: string;
  Result: string;
  Flag: string;
  UnitOfMeasure: string;
  RefInterval: string;
  LabCode: string;
  Notes: string;
  OrderNumber: number;
}

export interface TestInterface {
  OrderResultTestID: number;
  OrderResultID: number;
  TestName: string;
  TestCode: string;
  TestResults: Array<TestResultInterface>;
}

export interface ResultDataInterface {
  RequisitionNum: string;
  OrderResultID: number;
  PatientID: number;
  SpecimenNumber: string;
  AccountNumber: string;
  AccountPhoneNumber: string;
  PatientFirstName: string;
  PatientLastName: string;
  PatientMiddleInitial: string;
  PatientSSN: string;
  PatientPhone: string;
  PatientDOB: string;
  PatientAgeYMD: string;
  PatientSex: string;
  PatientFasting: string;
  PatientAddrStreet: string;
  PatientAddrCity: string;
  PatientAddrState: string;
  PatientAddrZip: string;
  DateTimeCollected: string;
  DateEntered: string;
  DateTimeReported: string;
  PhysicianName: string;
  PhysicianIdNumber: string;
  GeneralComments: string;
  AdditionalInfo: string;
  MedicalDirectorComments: string;
  IsReleased: boolean;
  EmailNotificationSent: boolean;
  CustomerSeenFlag: boolean;
  CorpReleased: boolean;
  DateTimeCreated: string;
  DateTimeApproved: string;
  EmailDateTimeSent: string;
  CustomerSeenDate: string;
  ReleasedDate: string;
  CorpReleasedDate: string;
  OrderNumber: number;
  Labs: Array<LabInterface>;
  Tests: Array<TestInterface>;
}

import PatientRepository from "./patientRepository";
import MonitorRepository from "./monitorRepository";
import WardRepository from "./wardRepository";
import TelemetryRepository from "./telemetryRepository";
import StatuscodesRepository from "./statuscodesRepository";
import AuthRepository from "./authRepository";

const repositories = {
  patient: PatientRepository,
  monitor: MonitorRepository,
  ward: WardRepository,
  telemetry: TelemetryRepository,
  statuscodes: StatuscodesRepository,
  auth: AuthRepository
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};

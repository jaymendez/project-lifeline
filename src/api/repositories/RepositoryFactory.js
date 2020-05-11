import PatientRepository from "./patientRepository";
import MonitorRepository from "./monitorRepository";
import WardRepository from "./wardRepository";
import TelemetryRepository from "./telemetryRepository";

const repositories = {
  patient: PatientRepository,
  monitor: MonitorRepository,
  ward: WardRepository,
  telemetry: TelemetryRepository
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};

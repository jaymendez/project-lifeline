import PatientRepository from "./patientRepository";
import MonitorRepository from "./monitorRepository";
import WardRepository from "./wardRepository";

const repositories = {
  patient: PatientRepository,
  monitor: MonitorRepository,
  ward: WardRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthExchange", function () {
  let HealthExchange, healthExchange;
  let patient, doctor, hospital, other;
  let patientHh = 123456, doctorHh = 234567, hospitalHh = 345678;

  beforeEach(async function () {
    [patient, doctor, hospital, other] = await ethers.getSigners();
    HealthExchange = await ethers.getContractFactory("HealthExchange");
    healthExchange = await HealthExchange.deploy();
    // await healthExchange.deployed(); // Not needed in Hardhat Ethers v6
  });

  it("should register users with correct roles and HH numbers", async function () {
    await expect(healthExchange.connect(patient).register("Alice", "alice@email.com", "123", patientHh, "Addr1", "pass", 1))
      .to.emit(healthExchange, "UserRegistered");
    await expect(healthExchange.connect(doctor).register("Dr. Bob", "bob@email.com", "456", doctorHh, "Addr2", "pass", 2))
      .to.emit(healthExchange, "UserRegistered");
    await expect(healthExchange.connect(hospital).register("Hosp", "hosp@email.com", "789", hospitalHh, "Addr3", "pass", 3))
      .to.emit(healthExchange, "UserRegistered");
  });

  it("should allow patient to upload and view their own reports", async function () {
    await healthExchange.connect(patient).register("Alice", "alice@email.com", "123", patientHh, "Addr1", "pass", 1);
    await healthExchange.connect(patient).uploadReport("cid1", "Blood Test");
    const reports = await healthExchange.connect(patient).viewMyReports();
    expect(reports.length).to.equal(1);
    expect(reports[0].cid).to.equal("cid1");
  });

  it("should allow patient to grant and revoke access to doctor using HH numbers", async function () {
    await healthExchange.connect(patient).register("Alice", "alice@email.com", "123", patientHh, "Addr1", "pass", 1);
    await healthExchange.connect(doctor).register("Dr. Bob", "bob@email.com", "456", doctorHh, "Addr2", "pass", 2);
    await healthExchange.connect(patient).grantAccess(patientHh, doctorHh);
    // Doctor should now be able to view patient's reports (even if none yet)
    await healthExchange.connect(patient).uploadReport("cid2", "X-Ray");
    const reports = await healthExchange.connect(doctor).getReports(patientHh);
    expect(reports.length).to.equal(1);
    expect(reports[0].cid).to.equal("cid2");
    // Revoke access
    await healthExchange.connect(patient).revokeAccess(patientHh, doctorHh);
    await expect(healthExchange.connect(doctor).getReports(patientHh)).to.be.revertedWith("No access to reports");
  });

  it("should allow hospital to view patient reports if access granted", async function () {
    await healthExchange.connect(patient).register("Alice", "alice@email.com", "123", patientHh, "Addr1", "pass", 1);
    await healthExchange.connect(hospital).register("Hosp", "hosp@email.com", "789", hospitalHh, "Addr3", "pass", 3);
    await healthExchange.connect(patient).grantAccess(patientHh, hospitalHh);
    await healthExchange.connect(patient).uploadReport("cid3", "MRI");
    const reports = await healthExchange.connect(hospital).viewPatientReportsByHospital(patientHh);
    expect(reports.length).to.equal(1);
    expect(reports[0].cid).to.equal("cid3");
  });

  it("should allow hospital to emergency share patient reports with another doctor", async function () {
    await healthExchange.connect(patient).register("Alice", "alice@email.com", "123", patientHh, "Addr1", "pass", 1);
    await healthExchange.connect(hospital).register("Hosp", "hosp@email.com", "789", hospitalHh, "Addr3", "pass", 3);
    await healthExchange.connect(doctor).register("Dr. Bob", "bob@email.com", "456", doctorHh, "Addr2", "pass", 2);
    await healthExchange.connect(patient).grantAccess(patientHh, hospitalHh);
    await healthExchange.connect(patient).uploadReport("cid4", "CT Scan");
    // Hospital shares with doctor
    await healthExchange.connect(hospital).emergencyShare(patientHh, doctorHh);
    const reports = await healthExchange.connect(doctor).getReports(patientHh);
    expect(reports.length).to.equal(1);
    expect(reports[0].cid).to.equal("cid4");
  });

  it("should not allow unauthorized access to reports", async function () {
    await healthExchange.connect(patient).register("Alice", "alice@email.com", "123", patientHh, "Addr1", "pass", 1);
    await healthExchange.connect(other).register("Mallory", "mallory@email.com", "000", 456789, "Addr4", "pass", 2);
    await healthExchange.connect(patient).uploadReport("cid5", "ECG");
    await expect(healthExchange.connect(other).getReports(patientHh)).to.be.revertedWith("No access to reports");
  });
}); 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HealthExchange {
    enum Role { None, Patient, Doctor, Hospital }

    struct User {
        string name;
        string email;
        string phone;
        uint256 hhNumber;
        string addr;
        Role role;
        address wallet;
        bool exists;
    }

    struct Report {
        string cid; // IPFS hash from Pinata
        address uploader;
        uint256 timestamp;
        string description;
    }

    struct AuditLog {
        address actor;
        string action;
        uint256 timestamp;
        uint256 hhNumber;
        string details;
    }

    mapping(address => User) public users;
    mapping(uint256 => address) public hhToAddress;
    mapping(address => Report[]) public patientReports;
    mapping(uint256 => mapping(address => bool)) public reportAccess; // hhNumber => (doctor/hospital => access)
    AuditLog[] public auditLogs;
    address[] public allPatients; // NEW: Track all patient addresses

    // --- Events ---
    event UserRegistered(address indexed user, uint256 hhNumber, Role role);
    event ReportUploaded(address indexed patient, string cid, address indexed uploader);
    event AccessGranted(uint256 indexed hhNumber, address indexed grantee);
    event AccessRevoked(uint256 indexed hhNumber, address indexed grantee);
    event Audit(address indexed actor, string action, uint256 indexed hhNumber, string details);

    // --- Modifiers ---
    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role, "Unauthorized role");
        _;
    }
    modifier userExists() {
        require(users[msg.sender].exists, "User not registered");
        _;
    }
    modifier hhExists(uint256 hhNumber) {
        require(hhToAddress[hhNumber] != address(0), "HH number not found");
        _;
    }

    // --- Registration ---
    function register(string memory name, string memory email, string memory phone, uint256 hhNumber, string memory addrStr, string memory password, Role role) external {
        require(!users[msg.sender].exists, "Already registered");
        require(hhNumber >= 100000 && hhNumber <= 999999, "Invalid HH number");
        require(hhToAddress[hhNumber] == address(0), "HH number already used");
        users[msg.sender] = User(name, email, phone, hhNumber, addrStr, role, msg.sender, true);
        hhToAddress[hhNumber] = msg.sender;
        if (role == Role.Patient) {
            allPatients.push(msg.sender);
        }
        emit UserRegistered(msg.sender, hhNumber, role);
        _logAudit(msg.sender, "REGISTER", hhNumber, "");
    }

    // --- Report Management ---
    function uploadReport(string memory cid, string memory description) external onlyRole(Role.Patient) userExists {
        patientReports[msg.sender].push(Report(cid, msg.sender, block.timestamp, description));
        emit ReportUploaded(msg.sender, cid, msg.sender);
        _logAudit(msg.sender, "UPLOAD_REPORT", users[msg.sender].hhNumber, cid);
    }

    function addReportToPatient(uint256 hhNumber, string memory cid, string memory description) external userExists hhExists(hhNumber) {
        require(users[msg.sender].role == Role.Doctor || users[msg.sender].role == Role.Hospital, "Only doctor or hospital");
        require(reportAccess[hhNumber][msg.sender], "No access to patient");
        address patient = hhToAddress[hhNumber];
        patientReports[patient].push(Report(cid, msg.sender, block.timestamp, description));
        emit ReportUploaded(patient, cid, msg.sender);
        _logAudit(msg.sender, "ADD_REPORT", hhNumber, cid);
    }

    function getReports(uint256 hhNumber) external view userExists hhExists(hhNumber) returns (Report[] memory) {
        require(
            users[msg.sender].role == Role.Patient && users[msg.sender].hhNumber == hhNumber ||
            reportAccess[hhNumber][msg.sender],
            "No access to reports"
        );
        address patient = hhToAddress[hhNumber];
        return patientReports[patient];
    }

    // --- Access Control ---
    function grantAccess(uint256 patientHhNumber, uint256 granteeHhNumber) external onlyRole(Role.Patient) userExists hhExists(patientHhNumber) hhExists(granteeHhNumber) {
        require(users[msg.sender].hhNumber == patientHhNumber, "Not your HH number");
        address grantee = hhToAddress[granteeHhNumber];
        require(users[grantee].role == Role.Doctor || users[grantee].role == Role.Hospital, "Invalid grantee role");
        reportAccess[patientHhNumber][grantee] = true;
        emit AccessGranted(patientHhNumber, grantee);
        _logAudit(msg.sender, "GRANT_ACCESS", patientHhNumber, _roleToString(users[grantee].role));
    }

    function revokeAccess(uint256 patientHhNumber, uint256 granteeHhNumber) external onlyRole(Role.Patient) userExists hhExists(patientHhNumber) hhExists(granteeHhNumber) {
        require(users[msg.sender].hhNumber == patientHhNumber, "Not your HH number");
        address grantee = hhToAddress[granteeHhNumber];
        reportAccess[patientHhNumber][grantee] = false;
        emit AccessRevoked(patientHhNumber, grantee);
        _logAudit(msg.sender, "REVOKE_ACCESS", patientHhNumber, _roleToString(users[grantee].role));
    }

    // --- Doctor/Hospital Actions ---
    function removePatient(uint256 hhNumber) external onlyRole(Role.Doctor) userExists hhExists(hhNumber) {
        require(reportAccess[hhNumber][msg.sender], "No access to patient");
        reportAccess[hhNumber][msg.sender] = false;
        _logAudit(msg.sender, "REMOVE_PATIENT", hhNumber, "");
    }

    function emergencyShare(uint256 patientHhNumber, uint256 recipientHhNumber) external onlyRole(Role.Hospital) userExists hhExists(patientHhNumber) hhExists(recipientHhNumber) {
        address recipient = hhToAddress[recipientHhNumber];
        reportAccess[patientHhNumber][recipient] = true;
        _logAudit(msg.sender, "EMERGENCY_SHARE", patientHhNumber, "");
    }

    // --- View Functions ---
    function viewMyReports() external view onlyRole(Role.Patient) userExists returns (Report[] memory) {
        return patientReports[msg.sender];
    }

    function viewPatientReportsByHospital(uint256 patientHhNumber) external view onlyRole(Role.Hospital) userExists hhExists(patientHhNumber) returns (Report[] memory) {
        require(reportAccess[patientHhNumber][msg.sender], "No access to patient reports");
        address patient = hhToAddress[patientHhNumber];
        return patientReports[patient];
    }

    // --- Doctor View: Get all patients who have granted access to a doctor ---
    function getPatientsWithAccess(address doctor) public view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allPatients.length; i++) {
            uint256 hhNumber = users[allPatients[i]].hhNumber;
            if (reportAccess[hhNumber][doctor]) {
                count++;
            }
        }
        address[] memory result = new address[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < allPatients.length; i++) {
            uint256 hhNumber = users[allPatients[i]].hhNumber;
            if (reportAccess[hhNumber][doctor]) {
                result[idx] = allPatients[i];
                idx++;
            }
        }
        return result;
    }

    // --- Audit Logging ---
    function getAuditLogs() external view returns (AuditLog[] memory) {
        return auditLogs;
    }

    function _logAudit(address actor, string memory action, uint256 hhNumber, string memory details) internal {
        auditLogs.push(AuditLog(actor, action, block.timestamp, hhNumber, details));
        emit Audit(actor, action, hhNumber, details);
    }

    function _roleToString(Role role) internal pure returns (string memory) {
        if (role == Role.Patient) return "Patient";
        if (role == Role.Doctor) return "Doctor";
        if (role == Role.Hospital) return "Hospital";
        return "None";
    }
} 
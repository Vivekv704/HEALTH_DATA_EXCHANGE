import { BrowserProvider, Contract } from 'ethers'
import healthExchangeAbi from '../../../../artifacts/contracts/HealthExchange.sol/HealthExchange.json'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected')
  }
  
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  return new Contract(CONTRACT_ADDRESS, healthExchangeAbi.abi, signer)
}

export const uploadReport = async (cid, description) => {
  try {
    const contract = await getContract()
    const tx = await contract.uploadReport(cid, description)
    await tx.wait()
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Upload report error:', error)
    return { success: false, error: error.message }
  }
}

export const getPatientReports = async () => {
  try {
    const contract = await getContract()
    const reports = await contract.viewMyReports()
    return { success: true, reports }
  } catch (error) {
    console.error('Get reports error:', error)
    return { success: false, error: error.message }
  }
}

export const getPatientsWithAccess = async (doctorAddress) => {
  try {
    const contract = await getContract()
    // Call the contract function to get patient addresses
    const patientAddresses = await contract.getPatientsWithAccess(doctorAddress)
    // For each address, fetch user details
    const patients = []
    for (let i = 0; i < patientAddresses.length; i++) {
      const user = await contract.users(patientAddresses[i])
      if (user.exists && user.role.toString() === '1') { // Role.Patient = 1
        patients.push({
          hhNumber: user.hhNumber.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          wallet: user.wallet
        })
      }
    }
    return { success: true, patients }
  } catch (error) {
    console.error('Get patients error:', error)
    return { success: false, error: error.message }
  }
}

export const getPatientReportsByDoctor = async (patientHhNumber) => {
  try {
    const contract = await getContract()
    const reports = await contract.getReports(parseInt(patientHhNumber))
    return { success: true, reports }
  } catch (error) {
    console.error('Get patient reports error:', error)
    return { success: false, error: error.message }
  }
}

export const addReportToPatient = async (patientHhNumber, cid, description) => {
  try {
    const contract = await getContract()
    const tx = await contract.addReportToPatient(parseInt(patientHhNumber), cid, description)
    await tx.wait()
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Add report to patient error:', error)
    return { success: false, error: error.message }
  }
}

export const grantAccess = async (patientHhNumber, granteeHhNumber) => {
  try {
    const contract = await getContract()
    const tx = await contract.grantAccess(parseInt(patientHhNumber), parseInt(granteeHhNumber))
    await tx.wait()
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Grant access error:', error)
    return { success: false, error: error.message }
  }
}

export const revokeAccess = async (patientHhNumber, granteeHhNumber) => {
  try {
    const contract = await getContract()
    const tx = await contract.revokeAccess(parseInt(patientHhNumber), parseInt(granteeHhNumber))
    await tx.wait()
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Revoke access error:', error)
    return { success: false, error: error.message }
  }
}

export const emergencyShare = async (patientHhNumber, recipientHhNumber) => {
  try {
    const contract = await getContract()
    const tx = await contract.emergencyShare(parseInt(patientHhNumber), parseInt(recipientHhNumber))
    await tx.wait()
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Emergency share error:', error)
    return { success: false, error: error.message }
  }
}

export const getUserByHhNumber = async (hhNumber) => {
  try {
    const contract = await getContract()
    const userAddress = await contract.hhToAddress(parseInt(hhNumber))
    if (userAddress === '0x0000000000000000000000000000000000000000') {
      return { success: false, error: 'User not found' }
    }
    
    const user = await contract.users(userAddress)
    const userData = {
      name: user[0],
      email: user[1],
      phone: user[2],
      hhNumber: user[3].toString(),
      addr: user[4],
      role: user[5].toString(),
      wallet: user[6],
      exists: user[7]
    }
    
    return { success: true, user: userData }
  } catch (error) {
    console.error('Get user error:', error)
    return { success: false, error: error.message }
  }
} 
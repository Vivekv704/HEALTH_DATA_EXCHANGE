const PINATA_API_KEY = '06630721928ed81db2dd'
const PINATA_API_SECRET = '205dae755f179090cb08a780bd42f0c2d791d2fa1d36d04ed05bb48e8a23e41c'
const PINATA_BASE_URL = 'https://api.pinata.cloud'

export const uploadToPinata = async (file, metadata = {}) => {
  try {
    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    
    // Add metadata if provided
    if (Object.keys(metadata).length > 0) {
      formData.append('pinataMetadata', JSON.stringify(metadata))
    }

    const response = await fetch(`${PINATA_BASE_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        'pinata_api_key': "06630721928ed81db2dd",
        'pinata_secret_api_key': "205dae755f179090cb08a780bd42f0c2d791d2fa1d36d04ed05bb48e8a23e41c",
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      ipfsHash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    }
  } catch (error) {
    console.error('Pinata upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const getPinataUrl = (ipfsHash) => {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
} 
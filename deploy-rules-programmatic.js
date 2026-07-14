const fs = require('fs');
const { GoogleAuth } = require('google-auth-library');

async function deploy() {
  try {
    // 1. Initialize Google Auth with the service account file
    const auth = new GoogleAuth({
      keyFilename: 'service-account.json',
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;
    
    if (!accessToken) {
      throw new Error('Failed to retrieve access token');
    }
    
    // 2. Read project ID and rules content
    const serviceAccount = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));
    const projectId = serviceAccount.project_id;
    if (!projectId) {
      throw new Error('Project ID not found in service-account.json');
    }
    
    const rulesContent = fs.readFileSync('firestore.rules', 'utf8');
    
    console.log(`Deploying firestore.rules to project: ${projectId}...`);
    
    // 3. Create the ruleset
    const rulesetRes = await fetch(`https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: {
          files: [
            {
              name: 'firestore.rules',
              content: rulesContent
            }
          ]
        }
      })
    });
    
    const rulesetData = await rulesetRes.json();
    if (!rulesetRes.ok) {
      console.error('Error creating ruleset:', JSON.stringify(rulesetData, null, 2));
      process.exit(1);
    }
    
    const rulesetName = rulesetData.name;
    console.log(`Created ruleset successfully: ${rulesetName}`);
    
    // 4. Update the release for cloud.firestore
    console.log(`Updating release cloud.firestore to point to ruleset...`);
    const releaseRes = await fetch(`https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        release: {
          name: `projects/${projectId}/releases/cloud.firestore`,
          rulesetName: rulesetName
        },
        updateMask: 'rulesetName'
      })
    });
    
    const releaseData = await releaseRes.json();
    if (!releaseRes.ok) {
      console.error('Error updating release:', JSON.stringify(releaseData, null, 2));
      process.exit(1);
    }
    
    console.log('Update release successfully:', JSON.stringify(releaseData, null, 2));
    console.log('Firestore Security Rules deployed successfully!');
  } catch (err) {
    console.error('Unexpected error during rules deployment:', err);
    process.exit(1);
  }
}

deploy();

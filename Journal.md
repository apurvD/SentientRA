# 1. Create the backend folder directory
mkdir backend

# 2. Move into backend and initialize Node.js
cd backend
npm init -y
cd ..

# 3. Scaffold the React frontend using Vite 
npm create vite@latest frontend -- --template react

# 4.
npm install -g @azure-devops/mcp

#5: create mcp.json
{
  "inputs": [
    {
      "id": "ado_org",
      "type": "promptString",
      "description": "Azure DevOps organization name"
    }
  ],
  "servers": {
    "ado": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "${input:ado_org}"]
    }
  }
}

#6. Set your active organization target for the Azure CLI toolchain
az devops configure --defaults organization=https://dev.azure.com/org_name

#7. verify the MCP Server :
 C:\Users\Apurv\SentinentRA> az devops project list --organization https://dev.azure.com/org_name --output table
ID                                    Name      Visibility
------------------------------------  --------  ------------
------------------------------------  Learning  Private
PS C:\Users\Apurv\SentinentRA> git init
Initialized empty Git repository in C:/Users/Apurv/SentinentRA/.git/
PS C:\Users\Apurv\SentinentRA> 
# openapi-typescript-cli

> The most elegant tool for generating TypeScript interface request layer code from OpenAPI documentation

Generate type-safe TypeScript API client code directly from OpenAPI/Swagger documentation. Compatible with Spring Boot (springdoc-openapi, springfox), FastAPI, and any framework that generates OpenAPI v3 compliant JSON.

## Features

- 🚀 **Zero Configuration** - Generate type-safe API code with a single command
- 📝 **Type Definitions** - Automatically generates TypeScript type definitions from OpenAPI schemas
- 🔧 **Axios Integration** - Built-in Axios wrapper with interceptors support
- 🎯 **Flexible Naming** - Customize module and function names with middleware
- 🔄 **Non-Destructive** - Preserves your custom `request.js` and middleware files
- ⚡ **Multiple Sources** - Support both local JSON files and remote URLs

## Installation

```bash
npm install -g openapi-typescript-cli
```

Or use with npx (no installation required):

```bash
npx openapi-typescript-cli --help
```

## Quick Start

### Step 1: Get OpenAPI Documentation from Spring Boot

If you're using Spring Boot, ensure your project has OpenAPI documentation enabled. Common endpoints:

- **springdoc-openapi**: `http://localhost:8080/v3/api-docs`
- **springfox**: `http://localhost:8080/v2/api-docs`
- **Custom path**: Check your Spring Boot configuration

### Step 2: Generate TypeScript Code

Navigate to your frontend project's API directory:

```bash
cd src/api
```

Generate code from a remote URL:

```bash
openapi-typescript-cli -u http://localhost:8080/v3/api-docs -n index
```

Or from a local JSON file:

```bash
openapi-typescript-cli -f path/to/openapi.json -n index
```

### Step 3: Use Generated Code

```typescript
import { roleManage } from '@/api/index';

// The generated function is fully typed
const result = await roleManage.deleteRole([1, 2, 3]);
console.log(result);
```

## Command Line Options

```
Usage: openapi-typescript-cli [options]

Options:
  -V, --version           Output version number
  -f, --apifile <path>    Path to OpenAPI JSON file
  -u, --url <url>         URL of OpenAPI JSON file (e.g., http://localhost:8080/v3/api-docs)
  -n, --name <name>       Output file name (default: "index")
                          Generates: <name>.ts, <name>.d.ts, request.js
  -m, --middleware <path> Middleware file for customizing module/function names
  -h, --help              Display help
```

### Examples

Generate from remote Spring Boot API:

```bash
openapi-typescript-cli -u http://localhost:8080/v3/api-docs -n api
```

Generate from local file with custom name:

```bash
openapi-typescript-cli -f ./openapi.json -n userApi
```

Generate with middleware:

```bash
openapi-typescript-cli -u http://localhost:8080/v3/api-docs -m ./middleware.js -n api
```

## Generated Code Structure

After running the command, you'll get the following files:

```
src/api/
├── index.d.ts              # TypeScript type definitions
├── index.ts                # API request methods
├── request.js              # Axios instance with interceptors
└── middleware.example.js   # Middleware template (if not exists)
```

### Generated Files

#### `index.d.ts` - Type Definitions

Contains all TypeScript interfaces and types extracted from OpenAPI schemas:

```typescript
export namespace Type {
  export interface ResponseBoolean {
    code: number;
    message: string;
    data: boolean;
  }
  // ... more types
}
```

#### `index.ts` - API Methods

Generated API methods grouped by modules:

```typescript
import request from "./request";
import { AxiosRequestConfig } from 'axios';
import * as Type from './index.d';

export let roleManage = {
  // Delete role
  deleteRole: async (
    param: number[], 
    opt: AxiosRequestConfig = {}
  ): Promise<Type.ResponseBoolean> => await request({
    url: '/system/roleManage/deleteRole',
    method: 'post',
    data: param,
    ...opt,
  }),
}
```

#### `request.js` - Axios Configuration

A pre-configured Axios instance with interceptors. This file is **never overwritten** on subsequent generations, so you can safely customize it:

```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
instance.interceptors.request.use((config) => {
  // Add auth token, logging, etc.
  return config;
});

// Response interceptor
instance.interceptors.response.use(
  (res) => {
    // Handle responses, errors, etc.
    return res.data;
  },
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default instance;
```

## Code Generation Rules

### Default Module and Function Naming

The tool extracts module and function names from the API path:

- **Path pattern**: `/system/roleManage/deleteRole`
- **Module name**: `roleManage` (second segment)
- **Function name**: `operationId` from OpenAPI (usually matches controller method name)

### API Path Convention

For best results, follow this path convention:

```
/business_prefix/module_name/function_name
```

Example:
```
/system/roleManage/deleteRole    → module: roleManage, function: deleteRole
/user/profile/getUserInfo        → module: profile, function: getUserInfo
/order/payment/processPayment    → module: payment, function: processPayment
```

## Using Middleware for Custom Naming

When your OpenAPI documentation doesn't follow the default naming convention, use middleware to customize the generated code.

### Creating Middleware

Create a `middleware.js` file:

```javascript
/**
 * Customize module and function names
 * 
 * @param {Object} options
 * @param {string} options.operationId - Usually the controller method name
 * @param {string} options.description - API description
 * @param {string} options.path - Original API path from OpenAPI spec
 * @param {string} options.method - HTTP method (get, post, put, delete, etc.)
 * @param {string} options.tag - OpenAPI tag (often used for grouping)
 * @returns {Object} {moduleName, functionName}
 */
module.exports = function ({operationId, description, path, method, tag}) {
  // Example: Extract module name from path using regex
  const pathMatch = path.match(/\/(\w+)\/(\w+)/);
  const moduleName = pathMatch ? pathMatch[2] : tag || 'default';
  
  // Example: Use operationId as function name, or transform it
  const functionName = operationId || 'default';
  
  return {
    moduleName: moduleName,
    functionName: functionName
  };
};
```

### Using Middleware

```bash
openapi-typescript-cli -u http://localhost:8080/v3/api-docs -m ./middleware.js -n index
```

### Common Middleware Use Cases

**1. Use OpenAPI tags as module names:**

```javascript
module.exports = function ({operationId, tag, path, method}) {
  return {
    moduleName: tag || 'default',
    functionName: operationId
  };
};
```

**2. Transform Chinese tags to English:**

```javascript
const tagMap = {
  '用户管理': 'userManagement',
  '角色管理': 'roleManagement',
  // ... more mappings
};

module.exports = function ({operationId, tag, path, method}) {
  return {
    moduleName: tagMap[tag] || tag,
    functionName: operationId
  };
};
```

**3. Custom path parsing:**

```javascript
module.exports = function ({operationId, path, method}) {
  // Custom regex for your path structure
  const match = path.match(/\/api\/(v\d+)\/(\w+)\/(\w+)/);
  
  return {
    moduleName: match ? match[2] : 'default',
    functionName: operationId
  };
};
```

## Advanced Usage

### Handling Query and Body Parameters

The generated code automatically handles both query parameters and request body:

```typescript
// POST with body
await roleManage.deleteRole([1, 2, 3]);

// GET with query parameters
await userApi.getUserList({ page: 1, size: 10 });

// POST with both query and body (use opt parameter)
await orderApi.createOrder(
  { productId: 123, quantity: 2 },
  {
    params: { source: 'web' },
    data: { discount: 10 }
  }
);
```

### Custom Headers

Pass custom headers through the second parameter:

```typescript
await api.getData(
  params,
  {
    headers: {
      'X-Custom-Header': 'value',
      'Authorization': 'Bearer token'
    }
  }
);
```

### Using in React Components

```typescript
import { userManagement } from '@/api/index';
import { Button } from 'antd';

function UserComponent() {
  const handleDelete = async (ids: number[]) => {
    try {
      const result = await userManagement.deleteRole(ids);
      if (result.data) {
        console.log('Deleted successfully');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Button onClick={() => handleDelete([1, 2])}>
      Delete Role
    </Button>
  );
}
```

## Best Practices

1. **Generate in dedicated directory**: Always run the command in `src/api` or similar directory
2. **Customize request.js once**: Add authentication, error handling, and logging to `request.js`
3. **Use middleware early**: If your API paths are inconsistent, create middleware from the start
4. **Version control generated files**: Include generated files in git, but mark them clearly
5. **Regenerate when API changes**: Re-run the command when backend API documentation updates

## Troubleshooting

### Common Issues

**Issue**: Generated code has incorrect module/function names  
**Solution**: Use middleware to customize naming logic

**Issue**: Request fails with CORS or authentication errors  
**Solution**: Configure baseURL and headers in `request.js`

**Issue**: Types are not imported correctly  
**Solution**: Ensure TypeScript is configured to resolve paths correctly in `tsconfig.json`

## License

MIT License

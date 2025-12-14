# User Management UI Components

Reusable React/Next.js components for user authentication.

## Components

- `LoginForm` - Login form component
- `RegisterForm` - Registration form component
- `useAuth` - Authentication hook
- `useProtectedRoute` - Protected route hook

## Installation

```bash
npm install
```

## Usage

### In your Next.js project

1. Add as a git submodule:
```bash
git submodule add <repository-url> user-management-ui
git submodule update --init --recursive
```

2. Import components:
```javascript
import { LoginForm } from './user-management-ui/components/LoginForm';
import { useAuth } from './user-management-ui/hooks/useAuth';
```

## Configuration

Set the following environment variables in your project:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## License

MIT

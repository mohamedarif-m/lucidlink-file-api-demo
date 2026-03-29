# Bob AI Developer - Rules & Governance Demo

## Overview

This demonstrates how Bob AI Developer follows business rules and blocks requests that violate policies. Bob acts as an **AI governance layer** that ensures code changes comply with organizational standards.

## 🎯 Purpose

Show how AI can:
- ✅ Follow business rules automatically
- ❌ Block policy violations
- ⚠️  Warn about potential issues
- 📋 Enforce compliance standards

## 📋 Rules Categories

### 1. Security Rules (CRITICAL)
- **SEC-001**: No hardcoded credentials
- **SEC-002**: No SQL injection vulnerabilities  
- **SEC-003**: Require authentication middleware

### 2. Data Validation Rules (HIGH)
- **VAL-001**: File size limits (1MB - 500MB)
- **VAL-002**: Input validation required
- **VAL-003**: Email format validation

### 3. Code Quality Rules (MEDIUM)
- **QUA-001**: Test coverage required (80%)
- **QUA-002**: No console.log in production
- **QUA-003**: Error handling required

### 4. Business Logic Rules (HIGH)
- **BUS-001**: No direct database access
- **BUS-002**: Rate limiting required
- **BUS-003**: API versioning required
- **BUS-004**: No breaking changes without approval

### 5. Deployment Rules (CRITICAL)
- **DEP-001**: No direct production commits
- **DEP-002**: Tests must pass
- **DEP-003**: Semantic versioning

### 6. Compliance Rules (CRITICAL)
- **COM-001**: No PII in logs
- **COM-002**: GDPR compliance
- **COM-003**: License headers required

### 7. Demo Rules (MEDIUM)
- **DEMO-001**: LucidLink branding
- **DEMO-002**: Demo data only

## 🎬 Demo Scenarios

### Scenario 1: Valid Request ✅

**Request**: "Increase file size limit to 300MB"

**Bob's Response**:
```
✅ APPROVED: Request complies with rules
   - Rule VAL-001: File size 300MB is within limits (1MB-500MB)
   - Proceeding with implementation...
```

**Action**: Bob implements the change

---

### Scenario 2: Blocked Request ❌

**Request**: "Increase file size limit to 2GB"

**Bob's Response**:
```
❌ BLOCKED by Rule VAL-001: File Size Limits
   
   Violation: Requested size (2048MB) exceeds maximum allowed (500MB)
   
   Rule Details:
   - ID: VAL-001
   - Severity: HIGH
   - Policy: File upload size must be between 1MB and 500MB
   
   Recommendation:
   - Maximum allowed: 500MB
   - Consider implementing chunked uploads for larger files
   - Or request policy exception from security team
   
   Cannot proceed with this request.
```

**Action**: Bob refuses to implement

---

### Scenario 3: Warning with Approval ⚠️

**Request**: "Add new API endpoint without authentication"

**Bob's Response**:
```
⚠️  WARNING: Rule SEC-003 violation detected

   Issue: API route missing authentication middleware
   Severity: HIGH
   
   Security Risk:
   - Unauthenticated endpoints expose data
   - Potential unauthorized access
   
   Options:
   1. Add authentication middleware (recommended)
   2. Request security exception (requires approval)
   3. Cancel request
   
   How would you like to proceed?
```

**Action**: Bob asks for clarification

---

### Scenario 4: Hardcoded Credentials ❌

**Request**: "Add database connection with password 'admin123'"

**Bob's Response**:
```
❌ BLOCKED by Rule SEC-001: No Hardcoded Credentials

   CRITICAL SECURITY VIOLATION
   
   Detected: Hardcoded password in code
   Pattern: password = "admin123"
   
   This violates:
   - Security policy SEC-001
   - Industry best practices
   - Compliance requirements
   
   Required Action:
   - Use environment variables (.env file)
   - Store credentials in secure vault
   - Never commit secrets to git
   
   Example:
   ❌ const password = "admin123"
   ✅ const password = process.env.DB_PASSWORD
   
   Request BLOCKED. Cannot proceed.
```

**Action**: Bob refuses and provides guidance

---

### Scenario 5: Breaking API Change ❌

**Request**: "Remove the /api/files endpoint"

**Bob's Response**:
```
❌ BLOCKED by Rule BUS-004: No Breaking Changes Without Approval

   Breaking Change Detected:
   - Type: remove-endpoint
   - Endpoint: /api/files
   - Impact: HIGH
   
   This change will break:
   - Existing client applications
   - Third-party integrations
   - Mobile apps
   
   Required:
   - Approval from API team
   - Deprecation notice (30 days minimum)
   - Migration guide for clients
   - Version bump (major version)
   
   Cannot proceed without approval.
   
   Alternative:
   - Deprecate endpoint in v1
   - Remove in v2 with proper notice
```

**Action**: Bob blocks and suggests alternatives

---

### Scenario 6: Missing Tests ⚠️

**Request**: "Add new feature without tests"

**Bob's Response**:
```
⚠️  WARNING: Rule QUA-001 violation

   Issue: New feature missing unit tests
   Required: 80% test coverage minimum
   
   Quality Standards:
   - All features must have tests
   - Coverage threshold: 80%
   - Test file required: tests/feature.test.js
   
   I can:
   1. Implement feature WITH tests (recommended)
   2. Implement feature, you add tests later (not recommended)
   3. Cancel request
   
   Recommendation: Let me create tests alongside the feature.
```

**Action**: Bob warns and offers options

---

### Scenario 7: PII in Logs ❌

**Request**: "Log user email addresses for debugging"

**Bob's Response**:
```
❌ BLOCKED by Rule COM-001: No PII in Logs

   COMPLIANCE VIOLATION
   
   Detected: Attempt to log Personal Identifiable Information
   PII Type: Email addresses
   
   Violations:
   - GDPR compliance
   - Privacy regulations
   - Company policy COM-001
   
   Forbidden in logs:
   - Email addresses
   - Phone numbers
   - SSN
   - Credit card numbers
   - Passwords
   
   Alternative:
   - Log user ID instead of email
   - Use anonymized identifiers
   - Implement proper audit logging
   
   Example:
   ❌ logger.info(`User ${user.email} logged in`)
   ✅ logger.info(`User ${user.id} logged in`)
   
   Request BLOCKED for compliance.
```

**Action**: Bob blocks and provides compliant alternative

---

## 🎮 Interactive Demo

### Try These Commands:

#### ✅ Valid Requests (Bob will approve):
```
"Increase file size limit to 300MB"
"Add rate limiting to API endpoints"
"Update UI colors to match LucidLink brand"
"Add error handling to async functions"
```

#### ❌ Blocked Requests (Bob will refuse):
```
"Increase file size limit to 2GB"
"Add password 'admin123' to config"
"Remove the /api/files endpoint"
"Log user email addresses"
"Commit directly to main branch"
```

#### ⚠️  Warning Requests (Bob will ask):
```
"Add API endpoint without authentication"
"Add feature without tests"
"Use console.log for debugging"
"Change API response format"
```

## 📊 Rule Enforcement Matrix

| Severity | Action | Example |
|----------|--------|---------|
| **CRITICAL** | ❌ BLOCK | Hardcoded credentials, PII in logs |
| **HIGH** | ❌ BLOCK or ⚠️ WARN | File size violations, SQL injection |
| **MEDIUM** | ⚠️ WARN | Missing tests, console.log |
| **LOW** | ℹ️ INFO | Code style, documentation |

## 🛡️ Benefits

### For Security:
- ✅ Prevents credential leaks
- ✅ Blocks SQL injection
- ✅ Enforces authentication
- ✅ Protects PII data

### For Compliance:
- ✅ GDPR compliance
- ✅ Audit trail
- ✅ Policy enforcement
- ✅ Regulatory adherence

### For Quality:
- ✅ Test coverage
- ✅ Code standards
- ✅ Error handling
- ✅ Best practices

### For Business:
- ✅ No breaking changes
- ✅ API versioning
- ✅ Rate limiting
- ✅ Brand consistency

## 🎯 Demo Flow

### Step 1: Show Valid Request
```
You: "Increase file size limit to 300MB"
Bob: ✅ Approved, implementing...
Result: Change made successfully
```

### Step 2: Show Blocked Request
```
You: "Increase file size limit to 2GB"
Bob: ❌ BLOCKED - Exceeds 500MB limit
Result: Request refused with explanation
```

### Step 3: Show Warning
```
You: "Add endpoint without auth"
Bob: ⚠️ WARNING - Security risk detected
Result: Bob asks for clarification
```

### Step 4: Show Compliance Block
```
You: "Log user emails"
Bob: ❌ BLOCKED - PII violation
Result: Alternative solution provided
```

## 📝 Rules File

All rules are defined in `.bob/rules.xml`:
- **372 lines** of governance rules
- **7 categories** of policies
- **20+ specific rules**
- **XML format** for easy parsing

## 🚀 Value Proposition

### Traditional Development:
- ❌ Developers might violate policies
- ❌ Security issues found in review
- ❌ Compliance violations discovered late
- ❌ Expensive to fix after deployment

### With Bob + Rules:
- ✅ Violations caught immediately
- ✅ Compliance enforced automatically
- ✅ Security built-in from start
- ✅ Reduced review time
- ✅ Lower risk

## 💡 Key Messages

1. **AI Governance**: Bob acts as an automated policy enforcement layer
2. **Proactive Prevention**: Blocks violations before they happen
3. **Compliance**: Ensures regulatory and security standards
4. **Developer Guidance**: Provides alternatives and best practices
5. **Audit Trail**: All decisions logged and traceable

## 🎬 Demo Script

**Opening**: 
"Let me show you how Bob follows business rules and blocks policy violations..."

**Demo 1 - Valid Request**:
"First, a valid request: 'Increase file size to 300MB'"
[Bob approves and implements]

**Demo 2 - Blocked Request**:
"Now, let's try exceeding the limit: 'Increase to 2GB'"
[Bob blocks with explanation]

**Demo 3 - Security Block**:
"What about security? 'Add password admin123'"
[Bob blocks critical security violation]

**Demo 4 - Compliance**:
"And compliance: 'Log user emails'"
[Bob blocks PII violation]

**Closing**:
"Bob ensures every change complies with your policies, automatically."

---

**Made with ❤️ by Bob AI Developer**

*Demonstrating AI-powered governance and compliance*
# Lore Repository: Threat Modeling & Security Audit

This document presents a detailed threat model and security audit of the **kynaruniverse/Lore** repository, following the STRIDE and OWASP Top 10 frameworks.

## 1. Threat Modeling (STRIDE)

| Threat | Description | Applicability to Lore |
| :--- | :--- | :--- |
| **Spoofing** | An attacker pretending to be another user. | **Medium**. Currently, there is no formal user authentication, but the presence of OAuth-related code suggests future implementation. If not properly secured, session spoofing could occur. |
| **Tampering** | Unauthorized modification of data. | **High**. Since data is stored in `localStorage`, any script running on the same origin (including malicious ones from XSS) can tamper with the user's knowledge base. |
| **Repudiation** | A user denying they performed an action. | **Low**. The current system lacks audit logs, making repudiation easy, but the impact is limited due to the local nature of the data. |
| **Information Disclosure** | Unauthorized access to sensitive information. | **Medium**. `localStorage` is not encrypted. Any person with physical or remote access to the browser can read the entire knowledge base. |
| **Denial of Service** | Making the application unavailable. | **Low**. As a client-side app, DoS would primarily affect the individual user (e.g., by filling up `localStorage`). |
| **Elevation of Privilege** | Gaining unauthorized permissions. | **Low**. Currently, there are no defined roles or permissions beyond the implicit "owner" of the local data. |

## 2. Security Audit Findings

### 2.1. Injection Vulnerabilities (OWASP A03:2021)

#### 2.1.1. Cross-Site Scripting (XSS) - **High Risk**
The application renders user-provided content in `PageView.tsx` by splitting it into paragraphs and mapping them to HTML elements. While it doesn't use `dangerouslySetInnerHTML` for the main content, it also doesn't appear to sanitize the input before rendering.
- **Vulnerable Code**: `client/src/pages/PageView.tsx`
- **Scenario**: An attacker could craft a page title or content containing malicious scripts. If this content is shared (e.g., via a future export/import feature or if the app moves to a shared database), it could execute in other users' browsers.
- **Recommendation**: Use a dedicated Markdown parsing library with built-in sanitization (e.g., `react-markdown` with `rehype-sanitize`).

#### 2.1.2. CSS Injection - **Medium Risk**
The `ChartStyle` component in `client/src/components/ui/chart.tsx` uses `dangerouslySetInnerHTML` to inject dynamic CSS based on the `config` object.
- **Vulnerable Code**: `client/src/components/ui/chart.tsx` (Line 81)
- **Scenario**: If the `config` object contains user-controlled data, an attacker could inject malicious CSS to perform data exfiltration or UI redressing.
- **Recommendation**: Sanitize the keys and values in the `config` object before injecting them into the `<style>` tag, or use a safer way to apply dynamic styles (e.g., CSS variables).

### 2.2. Broken Access Control (OWASP A01:2021)

#### 2.2.1. Insecure Data Storage - **Medium Risk**
All user-created data is stored in `localStorage` in plain text.
- **Vulnerable Code**: `client/src/lib/loreStore.ts`
- **Scenario**: Sensitive information stored in a Lore is vulnerable to any script running on the same origin and to anyone with access to the device.
- **Recommendation**: For production-grade applications, move sensitive data to a secure backend database with proper authentication and authorization.

### 2.3. Cryptographic Failures (OWASP A02:2021)

#### 2.3.1. Lack of Data Encryption - **Low Risk**
The project does not use any encryption for the data stored in `localStorage`.
- **Recommendation**: If sensitive data must be stored locally, consider using the Web Crypto API to encrypt it before saving to `localStorage`.

### 2.4. Vulnerable and Outdated Components (OWASP A06:2021)

#### 2.4.1. Dependency Risks - **Medium Risk**
The project relies on numerous third-party libraries. While no immediate critical vulnerabilities were found in the reconnaissance, the sheer number of dependencies increases the attack surface.
- **Recommendation**: Regularly run `pnpm audit` and use tools like Dependabot to keep dependencies updated.

### 2.5. Security Misconfiguration (OWASP A05:2021)

#### 2.5.1. Missing Security Headers - **Medium Risk**
The Express server in `server/index.ts` does not implement essential security headers (e.g., Content Security Policy, HSTS, X-Frame-Options).
- **Vulnerable Code**: `server/index.ts`
- **Recommendation**: Use the `helmet` middleware in Express to automatically set secure HTTP headers.

#### 2.5.2. CORS Policy - **Low Risk**
The current server configuration does not explicitly define a CORS policy, which might lead to overly permissive defaults in some environments.
- **Recommendation**: Explicitly configure CORS using the `cors` middleware in Express.

### 2.6. Identification and Authentication Failures (OWASP A07:2021)

#### 2.6.1. Incomplete Authentication Flow - **Medium Risk**
The project has placeholders for OAuth authentication but lacks a complete, secure implementation.
- **Vulnerable Code**: `client/src/const.ts`, `client/src/components/ManusDialog.tsx`
- **Recommendation**: Complete the authentication flow using a robust and well-tested library, ensuring secure token handling and session management.

## 3. Sensitive Assets & Attack Surfaces

- **Sensitive Assets**: User-created lore content, potential future user credentials/tokens.
- **Attack Surfaces**:
  - **Input Fields**: Create/Edit Lore and Page forms.
  - **URL Parameters**: Lore and Page slugs.
  - **LocalStorage**: The primary data store.
  - **External APIs**: Google Maps API integration.

## 4. Realistic Exploit Scenarios

1. **Self-XSS to Data Theft**: An attacker tricks a user into pasting a malicious script into a page's content. The script then reads all data from `localStorage` and sends it to an attacker-controlled server.
2. **UI Redressing via CSS Injection**: An attacker exploits the `ChartStyle` vulnerability to overlay a fake login form over the application, stealing the user's (future) credentials.
3. **Local Data Tampering**: A malicious browser extension or another site on the same origin modifies the `localStorage` data, leading to data corruption or misinformation within the Lore.

---

This security audit highlights several areas where the Lore project can be hardened. The most critical immediate concerns are the potential for XSS and the insecure storage of data in `localStorage`.

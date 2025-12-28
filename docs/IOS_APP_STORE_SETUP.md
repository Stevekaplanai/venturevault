# VentureVault iOS App Store Setup Guide

This guide walks you through setting up iOS App Store deployment using GitHub Actions.

## Prerequisites

- [x] Apple Developer Account ($99/year)
- [ ] App registered in App Store Connect
- [ ] Distribution certificate and provisioning profile
- [ ] App Store Connect API Key
- [ ] GitHub repository secrets configured

---

## Step 1: Register Your App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **My Apps** → **+** → **New App**
3. Fill in the details:
   - **Platforms**: iOS
   - **Name**: VentureVault
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: `space.venturevault.app`
   - **SKU**: `venturevault-ios-1` (or any unique identifier)
   - **User Access**: Full Access

---

## Step 2: Create App Store Connect API Key

The API key is used for automated uploads via Fastlane.

1. Go to [App Store Connect → Users and Access → Keys](https://appstoreconnect.apple.com/access/api)
2. Click **+** to create a new key
3. Fill in:
   - **Name**: `VentureVault CI/CD`
   - **Access**: `App Manager` (required for uploading builds)
4. Click **Generate**
5. **Download the .p8 file** (you can only download it ONCE!)
6. Note down:
   - **Key ID**: Shown in the table (e.g., `ABC123DEFG`)
   - **Issuer ID**: Shown at the top of the page (e.g., `12345678-1234-1234-1234-123456789abc`)

---

## Step 3: Create Distribution Certificate

### Option A: Using Xcode (Recommended for first-time setup)

1. Open Xcode → Preferences → Accounts
2. Select your Apple Developer account
3. Click **Manage Certificates**
4. Click **+** → **Apple Distribution**
5. The certificate is automatically installed in your Keychain

### Option B: Using Apple Developer Portal

1. Go to [Apple Developer → Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Click **+** to create a new certificate
3. Select **Apple Distribution**
4. Follow the CSR creation instructions
5. Download and install the certificate

### Export the Certificate (Required for GitHub Actions)

1. Open **Keychain Access** on your Mac
2. Find your **Apple Distribution** certificate
3. Right-click → **Export**
4. Choose **Personal Information Exchange (.p12)**
5. Set a strong password (you'll need this later)
6. Save the file

---

## Step 4: Create Provisioning Profile

1. Go to [Apple Developer → Profiles](https://developer.apple.com/account/resources/profiles/list)
2. Click **+** to create a new profile
3. Select **App Store** under Distribution
4. Select your App ID: `space.venturevault.app`
5. Select your Distribution certificate
6. Name it: `VentureVault App Store Distribution`
7. Download the `.mobileprovision` file

---

## Step 5: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add the following secrets:

### Required Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | From Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase dashboard |
| `BUILD_CERTIFICATE_BASE64` | Base64-encoded .p12 certificate | See below |
| `P12_PASSWORD` | Password for the .p12 certificate | The password you set when exporting |
| `KEYCHAIN_PASSWORD` | Any strong password | Generate a random password |
| `PROVISIONING_PROFILE_BASE64` | Base64-encoded provisioning profile | See below |
| `ASC_KEY_ID` | App Store Connect Key ID | From Step 2 |
| `ASC_ISSUER_ID` | App Store Connect Issuer ID | From Step 2 |
| `ASC_KEY_CONTENT` | Base64-encoded .p8 API key | See below |

### Encoding Files to Base64

Run these commands on your Mac:

```bash
# Encode the distribution certificate
base64 -i ~/path/to/certificate.p12 | pbcopy
# Paste into BUILD_CERTIFICATE_BASE64 secret

# Encode the provisioning profile
base64 -i ~/path/to/profile.mobileprovision | pbcopy
# Paste into PROVISIONING_PROFILE_BASE64 secret

# Encode the App Store Connect API key
base64 -i ~/path/to/AuthKey_XXXXXXXXXX.p8 | pbcopy
# Paste into ASC_KEY_CONTENT secret
```

### Optional Secrets

| Secret Name | Description |
|-------------|-------------|
| `SLACK_WEBHOOK_URL` | Slack webhook for build notifications |
| `APPLE_ID` | Your Apple Developer email |
| `TEAM_ID` | Your Apple Developer Team ID |
| `ITC_TEAM_ID` | Your App Store Connect Team ID |

---

## Step 6: Prepare App Store Metadata

Before submitting, prepare these assets:

### Required Screenshots

| Device | Size | Quantity |
|--------|------|----------|
| iPhone 6.7" | 1290 x 2796 px | 3-10 |
| iPhone 6.5" | 1284 x 2778 px | 3-10 |
| iPhone 5.5" | 1242 x 2208 px | 3-10 |
| iPad Pro 12.9" | 2048 x 2732 px | 3-10 (if supporting iPad) |

### Required Information

- **App Description** (up to 4000 characters)
- **Keywords** (up to 100 characters, comma-separated)
- **Support URL**: https://venturevault.space/support
- **Marketing URL**: https://venturevault.space
- **Privacy Policy URL**: https://venturevault.space/privacy
- **App Icon** (1024 x 1024 px, no transparency)
- **Age Rating**: Complete the questionnaire

### Suggested App Description

```
VentureVault - Discover Your Next Startup Idea

Browse 50+ validated startup opportunities with AI-powered market analysis. Get detailed insights on market size, competition, and execution strategies.

Features:
• Browse curated startup ideas with market scores
• AI-powered market research and analysis
• Customer persona insights
• 12-week execution playbooks
• Unit economics calculators
• Landing page copy templates
• Save and track your favorite ideas

Perfect for:
• Aspiring entrepreneurs looking for validated opportunities
• Product managers exploring new markets
• Investors researching emerging trends

100% Free - No hidden fees or subscriptions.
```

### Suggested Keywords

```
startup,ideas,entrepreneur,business,market research,AI,venture,innovation,saas
```

---

## Step 7: Trigger a Build

### Manual Trigger (Recommended for first build)

1. Go to your GitHub repository
2. Click **Actions** → **iOS Build & Deploy**
3. Click **Run workflow**
4. Select options:
   - **Branch**: `main`
   - **Deploy target**: `testflight` (for testing) or `none` (just build)
   - **Version**: `1.0.0`
5. Click **Run workflow**

### Automatic Trigger

Builds are automatically triggered when:
- Pushing to `main` branch with changes in `src/`, `ios/`, `package.json`, or `capacitor.config.json`
- Opening a pull request to `main`

---

## Step 8: Submit for Review

Once your TestFlight build is ready:

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app
3. Go to **App Store** tab
4. Fill in all required metadata
5. Upload screenshots
6. Select your build under **Build**
7. Click **Submit for Review**

### Review Timeline

- First submission: 24-48 hours typically
- Subsequent updates: Usually faster (24 hours)

---

## Troubleshooting

### Build Failures

**Certificate Issues**
```
error: No signing certificate "iOS Distribution" found
```
- Ensure `BUILD_CERTIFICATE_BASE64` is correctly encoded
- Verify the certificate hasn't expired
- Check that `P12_PASSWORD` is correct

**Provisioning Profile Issues**
```
error: No provisioning profile
```
- Ensure `PROVISIONING_PROFILE_BASE64` is correctly encoded
- Verify the profile matches the bundle ID `space.venturevault.app`
- Check that the profile isn't expired

**API Key Issues**
```
Could not find App Store Connect API key
```
- Verify `ASC_KEY_ID`, `ASC_ISSUER_ID`, and `ASC_KEY_CONTENT` are all set
- Ensure the .p8 key was base64 encoded correctly

### TestFlight Upload Failures

**Build Processing**
- Builds may take 15-30 minutes to process
- Check App Store Connect → TestFlight for status

**Compliance Issues**
- The app has `ITSAppUsesNonExemptEncryption = NO` set
- If using encryption, you may need to provide export compliance documentation

---

## Local Development

### Running on Simulator

```bash
npm run ios:run
```

### Opening in Xcode

```bash
npm run ios:open
```

### Syncing Web Build to iOS

```bash
npm run ios:build
```

---

## Useful Commands

```bash
# Sync Capacitor (both platforms)
npm run cap:sync

# Build and sync iOS only
npm run ios:build

# Open iOS project in Xcode
npm run ios:open

# Run on iOS simulator
npm run ios:run
```

---

## Support

If you encounter issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all secrets are correctly configured
3. Ensure certificates and profiles aren't expired
4. Contact Apple Developer Support for App Store-specific issues

# VentureVault Android Play Store Setup Guide

This guide walks you through setting up Android Play Store deployment using GitHub Actions.

## Prerequisites

- [x] Google Play Developer Account ($25 one-time)
- [ ] App registered in Google Play Console
- [ ] Signing keystore created
- [ ] Google Play API service account configured
- [ ] GitHub repository secrets configured

---

## Quick Links

| Task | Link |
|------|------|
| **GitHub Secrets** | [https://github.com/Stevekaplanai/venturevault/settings/secrets/actions](https://github.com/Stevekaplanai/venturevault/settings/secrets/actions) |
| **Google Play Console** | [https://play.google.com/console](https://play.google.com/console) |
| **Create New App** | [https://play.google.com/console/developers](https://play.google.com/console/developers) |
| **API Access** | [https://play.google.com/console/api-access](https://play.google.com/console/api-access) |
| **Run Android Workflow** | [https://github.com/Stevekaplanai/venturevault/actions/workflows/android-build.yml](https://github.com/Stevekaplanai/venturevault/actions/workflows/android-build.yml) |

---

## Step 1: Create a Signing Keystore

The keystore is used to sign your app for release. **Keep this safe - you cannot recover it!**

### Generate Keystore (Run on your machine)

```bash
keytool -genkey -v -keystore venturevault-release.keystore -alias venturevault -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for:
- **Keystore password**: Choose a strong password (save this!)
- **Key password**: Can be the same as keystore password
- **Your name, organization, etc.**: Fill in or press Enter to skip

### Save These Values

| Value | Description | GitHub Secret Name |
|-------|-------------|-------------------|
| Keystore file | `venturevault-release.keystore` | `ANDROID_KEYSTORE_BASE64` |
| Keystore password | The password you chose | `ANDROID_KEYSTORE_PASSWORD` |
| Key alias | `venturevault` | `ANDROID_KEY_ALIAS` |
| Key password | The key password | `ANDROID_KEY_PASSWORD` |

---

## Step 2: Create Google Play Service Account

This allows GitHub Actions to upload builds to Google Play.

### 2a. Go to Google Cloud Console

**Link:** [https://console.cloud.google.com/iam-admin/serviceaccounts](https://console.cloud.google.com/iam-admin/serviceaccounts)

1. Select or create a project
2. Click **"+ CREATE SERVICE ACCOUNT"**
3. Fill in:
   - **Name**: `venturevault-play-upload`
   - **Description**: `Service account for uploading builds to Google Play`
4. Click **"CREATE AND CONTINUE"**
5. Skip the optional steps, click **"DONE"**

### 2b. Create Service Account Key

1. Click on the service account you just created
2. Go to **"KEYS"** tab
3. Click **"ADD KEY"** → **"Create new key"**
4. Select **JSON** format
5. Click **"CREATE"**
6. **Save the downloaded JSON file** - you'll need this!

### 2c. Enable Google Play Android Developer API

**Link:** [https://console.cloud.google.com/apis/library/androidpublisher.googleapis.com](https://console.cloud.google.com/apis/library/androidpublisher.googleapis.com)

1. Click **"ENABLE"**

### 2d. Link Service Account to Google Play Console

**Link:** [https://play.google.com/console/api-access](https://play.google.com/console/api-access)

1. Click **"Link existing project"** or create new
2. Under **"Service accounts"**, find your service account
3. Click **"Grant access"**
4. Set permissions:
   - **App access**: Select your app (`VentureVault`)
   - **Account permissions**: None needed
   - **App permissions**:
     - ✅ Release to production, exclude devices, and use Play App Signing
     - ✅ Release apps to testing tracks
     - ✅ Manage testing tracks and edit tester lists
5. Click **"Invite user"** then **"Send invite"**

---

## Step 3: Register Your App in Google Play Console

**Link:** [https://play.google.com/console/developers](https://play.google.com/console/developers)

1. Click **"Create app"**
2. Fill in:
   - **App name**: `VentureVault`
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
3. Accept declarations
4. Click **"Create app"**

### Complete Required Setup

Before you can upload builds, complete these sections in **Dashboard → Set up your app**:

- [ ] Privacy policy URL: `https://venturevault.space/privacy`
- [ ] App access (select "All functionality is available")
- [ ] Ads (select "No ads")
- [ ] Content rating questionnaire
- [ ] Target audience (select "18 and over")
- [ ] News apps (select "No")
- [ ] COVID-19 apps (select "No")
- [ ] Data safety form
- [ ] Government apps (select "No")

---

## Step 4: Configure GitHub Secrets

**Link:** [https://github.com/Stevekaplanai/venturevault/settings/secrets/actions](https://github.com/Stevekaplanai/venturevault/settings/secrets/actions)

### Required Secrets

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded keystore | See below |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password | From Step 1 |
| `ANDROID_KEY_ALIAS` | `venturevault` | From Step 1 |
| `ANDROID_KEY_PASSWORD` | Key password | From Step 1 |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Full JSON content | From Step 2b |
| `VITE_SUPABASE_URL` | Supabase project URL | From Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | From Supabase dashboard |

### Encoding the Keystore to Base64

**On macOS/Linux:**
```bash
base64 -i venturevault-release.keystore | tr -d '\n'
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("venturevault-release.keystore"))
```

Copy the entire output and paste it as `ANDROID_KEYSTORE_BASE64`.

### Adding the Service Account JSON

1. Open the JSON file downloaded in Step 2b
2. Copy the **entire contents**
3. Paste as `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`

---

## Step 5: Trigger a Build

### Manual Trigger

**Link:** [https://github.com/Stevekaplanai/venturevault/actions/workflows/android-build.yml](https://github.com/Stevekaplanai/venturevault/actions/workflows/android-build.yml)

1. Click **"Run workflow"**
2. Select options:
   - **Branch**: `main`
   - **Deploy target**:
     - `none` - Just build, don't upload
     - `internal` - Upload to internal testing track
     - `production` - Upload to production
   - **Version name**: e.g., `1.0.0`
   - **Version code**: Must increment each release (e.g., `1`, `2`, `3`...)
3. Click **"Run workflow"**

### Automatic Trigger

Builds automatically run when:
- Pushing to `main` with changes in `src/`, `android/`, `package.json`, or `capacitor.config.json`
- Opening a pull request to `main`

---

## Step 6: First Release Checklist

Before your first production release, complete in Google Play Console:

### Store Listing
**Link:** [https://play.google.com/console/app/store-listing](https://play.google.com/console/app/store-listing)

- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Phone screenshots (min 2)
- [ ] 7-inch tablet screenshots (optional but recommended)
- [ ] 10-inch tablet screenshots (optional but recommended)

### Content Rating
**Link:** [https://play.google.com/console/app/content-rating](https://play.google.com/console/app/content-rating)

- [ ] Complete the questionnaire
- [ ] Submit for rating

### Pricing & Distribution
- [ ] Select countries/regions
- [ ] Confirm free pricing

---

## Troubleshooting

### Build Failures

**"Keystore was tampered with, or password was incorrect"**
- Verify `ANDROID_KEYSTORE_PASSWORD` is correct
- Re-encode the keystore to base64 and update the secret

**"No key with alias 'venturevault' found"**
- Verify `ANDROID_KEY_ALIAS` matches what you used in `keytool -alias`

**"Google Play API error"**
- Verify service account has correct permissions
- Check that the API is enabled
- Ensure the JSON is complete and valid

### Upload Failures

**"Package name not found"**
- Create the app in Play Console first before uploading

**"Version code already exists"**
- Increment the version code (must be higher than any previous upload)

**"APK/AAB is not signed"**
- Check that keystore secrets are configured correctly

---

## Version Management

| Field | Description | Example |
|-------|-------------|---------|
| `versionCode` | Integer, must increment each release | `1`, `2`, `3`... |
| `versionName` | User-visible version string | `1.0.0`, `1.0.1`, `1.1.0` |

**Important**: Google Play requires `versionCode` to increase for every upload. The workflow uses the GitHub run number by default, which auto-increments.

---

## Local Development

### Build debug APK locally
```bash
npm run android:build
cd android && ./gradlew assembleDebug
```

### Build release AAB locally (requires keystore)
```bash
npm run android:build
cd android && ./gradlew bundleRelease
```

### Open in Android Studio
```bash
npm run android:open
```

---

## Support

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Fastlane Supply Documentation](https://docs.fastlane.tools/actions/supply/)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)

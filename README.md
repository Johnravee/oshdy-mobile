# OSHDY Mobile

OSHDY Event Catering Services — mobile app (Expo / React Native + TypeScript)

This README explains how to set up, run, build, and reduce storage for the project.

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Expo CLI (optional for development): `npm i -g expo-cli` or use `npx expo`
- For EAS builds: an Expo account and `eas-cli` installed (`npm i -g eas-cli`)
- If you use the bare Android project locally: Java JDK, Android SDK, and Gradle

## Quick start (development)

1. Install dependencies

PowerShell:

```
cd c:\MOBILE_APP\oshdy-mobile
npm install
```

2. Start Expo dev server

PowerShell:

```
npx expo start
```

Open the app in Expo Go or run on a simulator/device from the Expo Dev Tools.

## Build (recommended: EAS)

Use EAS when possible — it handles native configuration and splits automatically.

1. Install and login to EAS:

```
npm i -g eas-cli
eas login
```

2. Build for Android (AAB recommended):

```
eas build -p android --profile production
```

After build completes, download the artifact and check its size locally.

Alternative: Local Android release (bare workflow)

```
cd android
.\gradlew assembleRelease
# artifact: android\app\build\outputs\apk\release\app-release.apk
(Get-Item .\app\build\outputs\apk\release\app-release.apk).length / 1MB
```

To create a bundle:

```
cd android
.\gradlew bundleRelease
# artifact: android\app\build\outputs\bundle\release\app-release.aab
(Get-Item .\app\build\outputs\bundle\release\app-release.aab).length / 1MB
```

If you produce an AAB and want to inspect a universal APK, use bundletool (Java required) to create APKS and check sizes.

## Reduce app size (practical recommendations)

- Enable Hermes (smaller JS runtime for Android/iOS on recent Expo versions). Add to `app.json`:

```json
"expo": {
  "jsEngine": "hermes"
}
```

- Enable code shrinking / minification for Android (R8/ProGuard) and resource shrinking. Use `expo-build-properties` plugin or set in Gradle if you have a bare project.

- Optimize images:

```
npx expo optimize
```

This compresses PNG/JPEG and can convert to WebP when beneficial.

- Remove unused assets from the repo (images/fonts/lottie) and use `git-lfs` for large files you must keep.

- Use AAB for Play Store so device-specific APKs are smaller per device.

## Housekeeping / cleanups

- Remove node_modules and reinstall to reclaim space:

```
Remove-Item -Recurse -Force node_modules
npm ci
```

- Clean npm cache:

```
npm cache clean --force
```

- Git garbage collection (shrinks repo data stores):

```
git gc --prune=now --aggressive
```

If you removed large files from the working tree and want them removed from history as well, use `git filter-repo` or BFG — this rewrites history (do this only if you understand the ramifications).

## Useful scripts (package.json)

Check your `package.json` for scripts like `start`, `android`, `ios`, `build`, and `eas` profiles. Typical commands:

```
npm run start
npm run android   # for bare workflow
npm run ios       # for bare workflow (macOS)
```

## Troubleshooting

- Metro cache issues: clear cache and restart

```
npx expo start -c
```

- Android build errors: ensure correct Android SDK versions and JDK installed and `JAVA_HOME` set.

- Hermes / JSI issues: if you enable Hermes and experience native crashes, test carefully and check `app.json`/native configs.

## Project notes

- App manifest: `app.json` contains icons, splash, and `favicon` referenced for web. If `favicon` is missing, add the file or remove the property.
- Assets directory: `assets/images` and `assets/images/lottie` contain images and animations used throughout the UI.

## Contributing

1. Create a branch: `git checkout -b feat/my-change`
2. Make changes, run app locally and tests (if any)
3. Commit and push, open a PR

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const androidDir = path.join(rootDir, 'android');
const buildsDir = path.join(rootDir, 'builds', 'android');
const outputApkDir = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release');
const sourceApkPath = path.join(outputApkDir, 'app-release.apk');
const targetApkPath = path.join(buildsDir, 'work-planner.apk');

function findJdk() {
  if (process.env.JAVA_HOME && fs.existsSync(process.env.JAVA_HOME)) {
    return process.env.JAVA_HOME;
  }

  const candidateDirs = [
    'C:\\Program Files\\Microsoft\\jdk-17.0.20.8-hotspot',
    'C:\\Program Files\\Eclipse Adoptium',
    'C:\\Program Files\\Java',
    'C:\\Program Files\\Microsoft',
    'C:\\Program Files\\Android\\Android Studio\\jbr',
  ];

  for (const dir of candidateDirs) {
    if (!fs.existsSync(dir)) continue;

    if (fs.existsSync(path.join(dir, 'bin', process.platform === 'win32' ? 'java.exe' : 'java'))) {
      return dir;
    }

    const subdirs = fs.readdirSync(dir);
    for (const sub of subdirs) {
      const fullSub = path.join(dir, sub);
      if (fs.existsSync(path.join(fullSub, 'bin', process.platform === 'win32' ? 'java.exe' : 'java'))) {
        return fullSub;
      }
    }
  }
  return null;
}

function findAndroidSdk() {
  if (process.env.ANDROID_HOME && fs.existsSync(process.env.ANDROID_HOME)) {
    return process.env.ANDROID_HOME;
  }
  if (process.env.ANDROID_SDK_ROOT && fs.existsSync(process.env.ANDROID_SDK_ROOT)) {
    return process.env.ANDROID_SDK_ROOT;
  }

  const defaultLocations = [
    path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk'),
    path.join(process.env.HOME || '', 'Library', 'Android', 'sdk'),
    path.join(process.env.HOME || '', 'Android', 'Sdk'),
  ];

  for (const loc of defaultLocations) {
    if (loc && fs.existsSync(loc)) {
      return loc;
    }
  }
  return null;
}

function ensureLocalProperties(sdkPath) {
  const localPropsPath = path.join(androidDir, 'local.properties');
  if (!fs.existsSync(localPropsPath) && sdkPath) {
    const escaped = sdkPath.replace(/\\/g, '\\\\');
    fs.writeFileSync(localPropsPath, `sdk.dir=${escaped}\n`, 'utf8');
    console.log(`[build:android] Created android/local.properties with sdk.dir`);
  }
}

function main() {
  console.log('=== [Work Planner] Building Android Standalone Release APK ===\n');

  if (!fs.existsSync(androidDir)) {
    console.error('Error: "android" directory not found. Please run "npx expo prebuild -p android" first.');
    process.exit(1);
  }

  const jdkPath = findJdk();
  if (jdkPath) {
    process.env.JAVA_HOME = jdkPath;
    const binDir = path.join(jdkPath, 'bin');
    process.env.PATH = `${binDir}${path.delimiter}${process.env.PATH || ''}`;
    console.log(`[build:android] Using JAVA_HOME: ${jdkPath}`);
  } else {
    console.log('[build:android] Using system default Java');
  }

  const sdkPath = findAndroidSdk();
  if (sdkPath) {
    process.env.ANDROID_HOME = sdkPath;
    process.env.ANDROID_SDK_ROOT = sdkPath;
    ensureLocalProperties(sdkPath);
    console.log(`[build:android] Using ANDROID_HOME: ${sdkPath}`);
  }

  if (!fs.existsSync(buildsDir)) {
    fs.mkdirSync(buildsDir, { recursive: true });
  }

  const isWin = process.platform === 'win32';
  const executable = isWin ? 'cmd.exe' : './gradlew';
  const args = isWin ? ['/c', 'gradlew.bat', 'assembleRelease'] : ['assembleRelease'];

  console.log(`\n[build:android] Running "${isWin ? 'gradlew.bat' : './gradlew'} assembleRelease" in ./android...\n`);

  const result = spawnSync(executable, args, {
    cwd: androidDir,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    console.error(`\n[build:android] Gradle build failed with exit code ${result.status}`);
    process.exit(result.status || 1);
  }

  if (!fs.existsSync(sourceApkPath)) {
    console.error(`\n[build:android] Error: Build succeeded but output APK not found at: ${sourceApkPath}`);
    process.exit(1);
  }

  fs.copyFileSync(sourceApkPath, targetApkPath);

  const stats = fs.statSync(targetApkPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n======================================================');
  console.log('✅ Android Release APK built and copied successfully!');
  console.log(`📦 Output path: ${path.relative(rootDir, targetApkPath)}`);
  console.log(`📁 Absolute path: ${targetApkPath}`);
  console.log(`⚖️  Size: ${sizeMb} MB`);
  console.log('======================================================\n');
}

main();

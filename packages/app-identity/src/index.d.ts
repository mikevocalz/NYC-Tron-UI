/** PASS fits the box; OVERFLOW is wider; FAIL is an empty label; NOT RUN was not measured. */
export type LabelStatus = "PASS" | "OVERFLOW" | "NOT RUN" | "FAIL";

/** One launcher label to check on one platform. */
export interface LabelEntry {
    source: string;
    platform: string;
    label: string;
}

/** One row per launcher target that applies to the entry's platform. */
export interface LabelRow extends LabelEntry {
    target: string;
    surface?: string;
    status: LabelStatus;
    reason?: string;
    width?: number;
    box?: number;
    unit?: string;
    lines?: number;
    font?: string;
    overflow?: number;
    spare?: number;
}

/** The two names an app declares: `expo.extra.appIdentity`, or a top-level `appIdentity` for RNW. */
export interface AppIdentity {
    fullName: string;
    launcherName: string;
}

export interface LauncherLabels {
    [platform: string]: string | undefined;
}

export interface DescribedConfig {
    source: string;
    kind: "expo" | "spark" | "rnw";
    platforms: string[];
    identity?: AppIdentity;
    labels: LauncherLabels;
}

/** Exit code and printed report of the command-line check. */
export interface CheckResult {
    code: 0 | 1 | 2 | 3;
    output: string;
}

/** Reads an Expo app.json or resolved config, a Spark desktop.config.json or an RNW app.json. */
export declare function describeConfig(path: string): DescribedConfig;

/** Measures each label against every launcher target for its platform. */
export declare function checkLabels(entries: LabelEntry[]): LabelRow[];

/** Runs the check with command-line arguments, as `nyc-tron-launcher-check` does. */
export declare function run(argv: string[]): CheckResult;

export type IconFormat = "android" | "web" | "macos" | "windows";

export declare const FORMATS: IconFormat[];

export interface DeriveOptions {
    formats?: IconFormat[];
}

export interface DeriveResult {
    problems: string[];
    files: string[];
    ground?: string;
    glyphReachPx?: number;
    safeRadiusPx?: number;
}

/** Writes every icon format of `options.formats` from one 1024 px square source. */
export declare function deriveIcons(sourcePath: string, outDir: string, options?: DeriveOptions): DeriveResult;

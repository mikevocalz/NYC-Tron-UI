// Keep failures useful even when a CLI prints its error only to stdout.
// Each stream is bounded; preserve process metadata independently of its text.
export function commandFailureDetail(result) {
  const detail = [
    `status=${result.status ?? "null"}`,
    `signal=${result.signal ?? "none"}`,
  ];
  if (result.error?.message) detail.push(`error=${result.error.message.slice(-4000)}`);
  for (const stream of ["stderr", "stdout"]) {
    const value = result[stream]?.trim();
    if (value) detail.push(`${stream}: ${value.slice(-4000)}`);
  }
  return detail.join("\n");
}

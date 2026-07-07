export async function load(url, context, nextLoad) {
  if (url.endsWith('.css') || url.endsWith('.scss')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {};'
    };
  }
  return nextLoad(url, context);
}

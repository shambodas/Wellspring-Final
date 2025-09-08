// A tiny mock LLM invoker — replace with your real implementation when ready.
export async function InvokeLLM({ prompt }) {
  await new Promise((r) => setTimeout(r, 600));
  // Return a short mock summary
  return "A gentle weekly reflection: you've been checking in — keep the habit and try a short walk each day.";
}

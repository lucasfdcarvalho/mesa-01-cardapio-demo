/**
 * Native date segments can change badInput while value remains empty, without
 * an input/change event. Observe only this control, without intercepting keys.
 */
export function observeDateValidity(dateInput, refresh) {
  const events = ['keyup', 'blur'];
  for (const event of events) dateInput.addEventListener(event, refresh);
  return () => {
    for (const event of events) dateInput.removeEventListener(event, refresh);
  };
}

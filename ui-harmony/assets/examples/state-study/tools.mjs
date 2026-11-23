const focusedName = page => page.locator('button:focus').getAttribute('aria-label');
const hint = page => page.getByRole('tooltip');
const attached = page => page.locator('button:focus').evaluate(el =>
  el.hasAttribute('aria-describedby') && document.getElementById(el.getAttribute('aria-describedby'))?.getAttribute('role') === 'tooltip');
const shows = name => [
  {name: 'Current tool', read: focusedName, expected: name},
  {name: 'Current hint', read: page => hint(page).innerText(), expected: name},
  {name: 'Hint belongs to focused tool', read: attached, expected: true},
];
async function settled(page) {
  await hint(page).evaluate(async el => {
    await new Promise(requestAnimationFrame);
    await Promise.all(el.getAnimations().map(animation => animation.finished));
  });
}

export default {
  variants: [
    {name: 'Standard', viewport: {width: 800, height: 600}},
    {name: 'Reduced motion', viewport: {width: 390, height: 700}, motion: 'reduce'},
  ],
  anchors: [{name: 'Tool strip', selector: '.tools', edge: 'left', tolerance: 0.5,
    reason: 'Showing a hint must leave the next tool in its original position.'}],
  states: [
    {name: 'First tool', enter: page => page.keyboard.press('Tab'), checks: shows('Select')},
    {name: 'Move twice and reverse', async enter(page) {
      for (const key of ['Tab', 'Tab', 'Shift+Tab']) await page.keyboard.press(key);
      await settled(page);
    }, checks: [...shows('Rectangle'), {name: 'Hint lands under the active icon', expected: true,
      async read(page) {
        const tool = await page.locator('button:focus').boundingBox();
        const bubble = await hint(page).boundingBox();
        return Math.abs(tool.x + tool.width / 2 - bubble.x - bubble.width / 2) <= 1;
      }}]},
    {name: 'Escape', enter: page => page.keyboard.press('Escape'), checks: [
      {name: 'Visible hints', read: page => hint(page).count(), expected: 0},
      {name: 'Keyboard position', read: focusedName, expected: 'Rectangle'},
      {name: 'Dismissed description removed', read: attached, expected: false},
    ]},
  ],
};

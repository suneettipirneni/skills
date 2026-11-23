// Adapt the state sequence and expected outcomes to a control in the product.
const slider = page => page.getByRole('slider', {name: 'Strength'});
const label = page => page.locator('label[for="strength"]').innerText();
const readout = page => page.locator('#readout').innerText();
const checks = value => [
  {name: 'Control value', read: page => slider(page).inputValue(), expected: String(value)},
  {name: 'Visible readout', read: readout, expected: value + '%'},
  {name: 'Visible label', read: label, expected: 'Strength'},
];

export default {
  variants: [
    {name: 'Desktop light', viewport: {width: 960, height: 700}},
    {name: 'Narrow dark with reduced motion', viewport: {width: 360, height: 740}, theme: 'dark', motion: 'reduce'},
  ],
  // Local contract for this panel. Use another edge when the reading direction changes.
  anchors: [{name: 'Value column', selector: '#readout', edge: 'right', tolerance: 0.5,
    reason: 'The eye can stay on the same value column while comparing adjustments.'}],
  states: [
    {name: 'At rest', checks: checks(60)},
    {name: 'Minimum', enter: page => slider(page).press('Home'), checks: checks(0)},
    {name: 'Maximum', enter: page => slider(page).press('End'), checks: checks(100)},
    {name: 'Rapid reversal', async enter(page) {
      for (const key of ['ArrowLeft', 'ArrowLeft', 'ArrowRight']) await slider(page).press(key);
    }, checks: checks(99)},
  ],
};

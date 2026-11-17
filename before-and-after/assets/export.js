// Shared by every entry; embedded once in the exported HTML.
const comparisonExports = (() => {
  const background = '#fafbf9';
  function canvas(width, height) {
    const node = document.createElement('canvas');
    node.width = width; node.height = height;
    const context = node.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Image export is unavailable in this browser.');
    context.fillStyle = background; context.fillRect(0, 0, width, height);
    return { node, context };
  }
  async function image(source) {
    const img = new Image(); img.src = source;
    await img.decode();
    if (!img.naturalWidth || !img.naturalHeight) throw new Error('An image could not be decoded.');
    return img;
  }
  async function snapshots(pair, maxEdge) {
    const [before, after] = await Promise.all([image(pair.before), image(pair.after)]);
    const scale = Math.min(1, maxEdge / Math.max(before.naturalWidth, before.naturalHeight));
    const width = Math.max(1, Math.round(before.naturalWidth * scale));
    const height = Math.max(1, Math.round(before.naturalHeight * scale));
    const render = img => {
      const frame = canvas(width, height);
      const ratio = (pair.fit === 'cover' ? Math.max : Math.min)(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
      frame.context.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      return frame.node;
    };
    return { before: render(before), after: render(after), width, height };
  }
  function text(context, value, x, y, maxWidth, right = false, title = false) {
    context.font = `${title ? '600 16px' : '12px'} system-ui, sans-serif`;
    context.fillStyle = title ? '#232925' : '#626b65';
    context.textAlign = right ? 'right' : 'left';
    let label = String(value);
    // Bound pathological metadata before measuring it repeatedly.
    if (label.length > 160) label = label.slice(0, 157) + '…';
    if (context.measureText(label).width > maxWidth) {
      while (label.length && context.measureText(label + '…').width > maxWidth) label = label.slice(0, -1);
      label += '…';
    }
    context.fillText(label, x, y);
  }
  function filename(pair, extension) {
    const stem = String(pair.id || pair.title || 'comparison').normalize('NFKD')
      .replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'comparison';
    return `${stem}-before-after.${extension}`;
  }
  async function png(pair) {
    const frames = await snapshots(pair, 1600);
    const margin = 20, gap = 20, top = 72;
    const panelWidth = Math.max(160, frames.width);
    const result = canvas(panelWidth * 2 + gap + margin * 2, frames.height + top + margin);
    const { context, node } = result;
    text(context, pair.title, margin, 28, node.width - margin * 2, false, true);
    text(context, pair.beforeLabel, margin, 55, panelWidth);
    text(context, pair.afterLabel, margin + panelWidth + gap, 55, panelWidth);
    context.drawImage(frames.before, margin + (panelWidth - frames.width) / 2, top);
    context.drawImage(frames.after, margin + panelWidth + gap + (panelWidth - frames.width) / 2, top);
    const blob = await new Promise(resolve => node.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('The browser could not create the PNG.');
    return blob;
  }
  async function gif(pair, { signal, onProgress = () => {} } = {}) {
    const check = () => { if (signal?.aborted) throw new DOMException('Export cancelled.', 'AbortError'); };
    check();
    const frames = await snapshots(pair, 960);
    check();
    const margin = 16, top = 68;
    const panelWidth = Math.max(280, frames.width);
    const width = panelWidth + margin * 2, height = frames.height + top + margin;
    const x = margin + Math.floor((panelWidth - frames.width) / 2);
    const result = canvas(width, height);
    const { context, node } = result;
    const draw = position => {
      context.fillStyle = background; context.fillRect(0, 0, width, height);
      text(context, pair.title, margin, 26, panelWidth, false, true);
      text(context, pair.beforeLabel, margin, 51, panelWidth / 2 - 8);
      text(context, pair.afterLabel, width - margin, 51, panelWidth / 2 - 8, true);
      context.drawImage(frames.after, x, top);
      const split = Math.round(frames.width * position);
      if (split) context.drawImage(frames.before, 0, 0, split, frames.height, x, top, split, frames.height);
      // Keep the endpoint images unobstructed during their pauses.
      if (position > 0 && position < 1) {
        const line = x + split, middle = top + frames.height / 2;
        context.fillStyle = '#ffffff'; context.fillRect(line - 1, top, 2, frames.height);
        context.fillRect(line - 12, middle - 16, 24, 32);
        context.strokeStyle = '#626b65'; context.lineWidth = 1;
        context.beginPath();
        context.moveTo(line - 4, middle - 4); context.lineTo(line - 8, middle); context.lineTo(line - 4, middle + 4);
        context.moveTo(line + 4, middle - 4); context.lineTo(line + 8, middle); context.lineTo(line + 4, middle + 4);
        context.stroke();
      }
      return context.getImageData(0, 0, width, height).data;
    };
    // One shared palette prevents color flicker between slider positions.
    const before = draw(1), after = draw(0);
    const sample = new Uint8Array(before.length + after.length);
    sample.set(before); sample.set(after, before.length);
    const palette = comparisonGifEncoder.quantize(sample, 252);
    palette.push([255, 255, 255], [98, 107, 101], [250, 251, 249]);
    const encoder = comparisonGifEncoder.GIFEncoder();
    const steps = 30, count = steps * 2;
    for (let frame = 0; frame < count; frame++) {
      check();
      const progress = frame <= steps ? frame / steps : (count - frame) / steps;
      const position = (1 + Math.cos(progress * Math.PI)) / 2;
      const rgba = draw(position);
      const indices = comparisonGifEncoder.applyPalette(rgba, palette);
      encoder.writeFrame(indices, width, height, {
        ...(frame === 0 ? { palette, repeat: 0 } : {}),
        delay: frame === 0 || frame === steps ? 700 : 70
      });
      onProgress(Math.round((frame + 1) / count * 100));
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    check(); encoder.finish();
    return new Blob([encoder.bytes()], { type: 'image/gif' });
  }
  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = name;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  return { png, gif, filename, download };
})();

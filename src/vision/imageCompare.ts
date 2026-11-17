/** Client-side look-alike score (0–1). No server — canvas only. */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load reference image'))
    img.src = src
  })
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  size: number,
  sw: number,
  sh: number,
) {
  const scale = Math.max(size / sw, size / sh)
  const dw = sw * scale
  const dh = sh * scale
  const dx = (size - dw) / 2
  const dy = (size - dh) / 2
  ctx.drawImage(source, dx, dy, dw, dh)
}

function sampleFeatures(source: CanvasImageSource, sw: number, sh: number, size = 48) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('No 2d context')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  drawCover(ctx, source, size, sw, sh)
  const { data } = ctx.getImageData(0, 0, size, size)

  const hist = new Float32Array(24) // 8 bins × RGB
  let edge = 0
  let lumSum = 0
  const gray = new Float32Array(size * size)

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const r = data[i] / 255
    const g = data[i + 1] / 255
    const b = data[i + 2] / 255
    hist[Math.min(7, (data[i] >> 5))] += 1
    hist[8 + Math.min(7, (data[i + 1] >> 5))] += 1
    hist[16 + Math.min(7, (data[i + 2] >> 5))] += 1
    const y = 0.299 * r + 0.587 * g + 0.114 * b
    gray[p] = y
    lumSum += y
  }

  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const i = y * size + x
      const gx = gray[i + 1] - gray[i]
      const gy = gray[i + size] - gray[i]
      edge += Math.hypot(gx, gy)
    }
  }

  const n = size * size
  hist.forEach((_, i) => {
    hist[i] /= n
  })
  const meanLum = lumSum / n
  return { hist, edge: edge / n, meanLum, gray }
}

function cosine(a: Float32Array, b: Float32Array) {
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

function grayCorr(a: Float32Array, b: Float32Array) {
  let meanA = 0
  let meanB = 0
  for (let i = 0; i < a.length; i++) {
    meanA += a[i]
    meanB += b[i]
  }
  meanA /= a.length
  meanB /= b.length
  let num = 0
  let da = 0
  let db = 0
  for (let i = 0; i < a.length; i++) {
    const x = a[i] - meanA
    const y = b[i] - meanB
    num += x * y
    da += x * x
    db += y * y
  }
  if (da === 0 || db === 0) return 0
  return Math.max(0, num / Math.sqrt(da * db))
}

export type CompareResult = {
  score: number
  tooDark: boolean
}

/** Compare a captured canvas/video frame to a reference image URL. */
export async function compareToReference(
  referenceUrl: string,
  shot: HTMLCanvasElement | HTMLVideoElement,
): Promise<CompareResult> {
  const ref = await loadImage(referenceUrl)
  const sw =
    'videoWidth' in shot && shot.videoWidth
      ? shot.videoWidth
      : (shot as HTMLCanvasElement).width
  const sh =
    'videoHeight' in shot && shot.videoHeight
      ? shot.videoHeight
      : (shot as HTMLCanvasElement).height

  const a = sampleFeatures(ref, ref.naturalWidth || ref.width, ref.naturalHeight || ref.height)
  const b = sampleFeatures(shot, sw || 1, sh || 1)

  const histScore = cosine(a.hist, b.hist)
  const structScore = grayCorr(a.gray, b.gray)
  const edgeScore = 1 - Math.min(1, Math.abs(a.edge - b.edge) / Math.max(0.05, a.edge))
  const score = Math.max(0, Math.min(1, histScore * 0.45 + structScore * 0.4 + edgeScore * 0.15))

  return { score, tooDark: b.meanLum < 0.08 }
}

/** Soft threshold — real-world photos vs archive plates will not be pixel-identical. */
export const MATCH_THRESHOLD = 0.42

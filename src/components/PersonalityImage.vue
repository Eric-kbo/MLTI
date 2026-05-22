<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import type { CalculatedResult } from '@/types/assessment'
import { dimensions } from '@/data/dimensions'

const props = defineProps<{
  result: CalculatedResult
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageUrl = ref('')

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.aicial.cn'

const dimensionScores = computed(() =>
  dimensions.map((dimension) => {
    const [leftLetter, rightLetter] = dimension.letters
    return {
      ...dimension,
      leftLetter,
      rightLetter,
      leftScore: props.result.scores[leftLetter],
      rightScore: props.result.scores[rightLetter],
    }
  }),
)

const detail = computed(() => props.result.resultDetail)

async function generateImage() {
  const canvas = canvasRef.value
  if (!canvas) return

  const w = 1080
  const h = 1920
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const { primary, secondary, accent } = detail.value.color
  const cnFont = '"PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Noto Sans SC", sans-serif'
  const enFont = '"Inter", "SF Pro Display", "Segoe UI", sans-serif'

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  // Top colored section
  const topH = 680
  const topGrad = ctx.createLinearGradient(0, 0, 0, topH)
  topGrad.addColorStop(0, secondary)
  topGrad.addColorStop(1, '#ffffff')
  ctx.fillStyle = topGrad
  ctx.fillRect(0, 0, w, topH)

  // Decorative circles
  ctx.globalAlpha = 0.06
  ctx.fillStyle = primary
  ctx.beginPath()
  ctx.arc(900, 200, 300, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(180, 500, 200, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  // Top badge
  ctx.fillStyle = primary
  roundRect(ctx, w / 2 - 140, 70, 280, 60, 30)
  ctx.fill()
  ctx.font = `bold 26px ${cnFont}`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText('AI时代脑力测评', w / 2, 110)

  // Emoji
  ctx.font = '100px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(detail.value.emoji, w / 2, 270)

  // Result code
  ctx.font = `900 130px ${enFont}`
  ctx.fillStyle = primary
  ctx.textAlign = 'center'
  ctx.fillText(detail.value.code, w / 2, 430)

  // Name
  ctx.font = `bold 56px ${cnFont}`
  ctx.fillStyle = '#1a1a1a'
  ctx.fillText(detail.value.name, w / 2, 520)

  // Tagline
  ctx.font = `400 30px ${enFont}`
  ctx.fillStyle = '#666666'
  ctx.fillText(detail.value.tagline, w / 2, 575)

  // Divider line
  ctx.strokeStyle = accent
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(300, 625)
  ctx.lineTo(780, 625)
  ctx.stroke()

  // Dimension bars
  const barStartY = 700
  const barHeight = 56
  const barGap = 115
  const barX = 80
  const barW = w - 160

  dimensionScores.value.forEach((dim, i) => {
    const y = barStartY + i * barGap
    const total = dim.leftScore + dim.rightScore
    const leftPct = total > 0 ? dim.leftScore / total : 0.5
    const rightPct = 1 - leftPct

    // Dimension label
    ctx.font = `600 28px ${cnFont}`
    ctx.fillStyle = '#333333'
    ctx.textAlign = 'left'
    ctx.fillText(dim.title, barX, y - 12)

    // Bar background
    ctx.fillStyle = '#f0f0f0'
    roundRect(ctx, barX, y, barW, barHeight, barHeight / 2)
    ctx.fill()

    // Left fill
    const leftW = Math.max(barW * leftPct, barHeight)
    ctx.fillStyle = leftPct >= 0.5 ? primary : '#ddd'
    roundRect(ctx, barX, y, leftW, barHeight, barHeight / 2)
    ctx.fill()

    // Right fill
    if (rightPct > 0.5) {
      const rightW = Math.max(barW * rightPct, barHeight)
      ctx.fillStyle = accent
      roundRect(ctx, barX + barW - rightW, y, rightW, barHeight, barHeight / 2)
      ctx.fill()
    }

    // Left label
    ctx.font = `bold 26px ${enFont}`
    ctx.fillStyle = leftPct >= 0.5 ? '#ffffff' : '#666'
    ctx.textAlign = 'left'
    ctx.fillText(`${dim.leftLetter} ${Math.round(leftPct * 100)}%`, barX + 22, y + 37)

    // Right label
    ctx.fillStyle = rightPct > 0.5 ? '#ffffff' : '#666'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.round(rightPct * 100)}% ${dim.rightLetter}`, barX + barW - 22, y + 37)
  })

  // Keywords
  const kwY = barStartY + 4 * barGap + 40
  ctx.textAlign = 'center'
  ctx.font = `600 28px ${cnFont}`
  ctx.fillStyle = primary
  ctx.fillText(detail.value.keywords.join('  ·  '), w / 2, kwY)

  // Summary box
  const sumY = kwY + 60
  const sumH = 240
  ctx.fillStyle = secondary
  roundRect(ctx, 60, sumY, w - 120, sumH, 24)
  ctx.fill()
  ctx.strokeStyle = accent + '60'
  ctx.lineWidth = 2
  roundRect(ctx, 60, sumY, w - 120, sumH, 24)
  ctx.stroke()

  ctx.font = `400 28px ${cnFont}`
  ctx.fillStyle = '#333333'
  ctx.textAlign = 'left'
  wrapText(ctx, detail.value.summary, 100, sumY + 55, w - 200, 44)

  // Bottom branding bar with QR code
  const bottomH = 200
  ctx.fillStyle = primary
  roundRect(ctx, 0, h - bottomH, w, bottomH, 0)
  ctx.fill()

  // QR code
  try {
    const qrCanvas = document.createElement('canvas')
    await QRCode.toCanvas(qrCanvas, siteUrl, {
      width: 130,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    })
    const qrSize = 130
    const qrX = 80
    const qrY = h - bottomH + (bottomH - qrSize) / 2
    // White background for QR
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12)
    ctx.fill()
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize)
  } catch {
    // QR generation failed, skip
  }

  // Text next to QR
  ctx.font = `bold 30px ${cnFont}`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.fillText('扫码测试你的AI时代脑力类型', 240, h - bottomH + 75)
  ctx.font = `400 22px ${cnFont}`
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText('MLTI — MBTI 看性格，MLTI 看脑力', 240, h - bottomH + 120)
  ctx.font = `400 18px ${enFont}`
  ctx.fillText(siteUrl, 240, h - bottomH + 155)

  imageUrl.value = canvas.toDataURL('image/png')
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const chars = text.split('')
  let line = ''
  let curY = y
  for (const char of chars) {
    const test = line + char
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, curY)
      line = char
      curY += lineH
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, curY)
}

function downloadImage() {
  if (!imageUrl.value) return
  const link = document.createElement('a')
  link.download = `MLTI-${detail.value.code}-${detail.value.name}.png`
  link.href = imageUrl.value
  link.click()
}

async function shareImage() {
  if (!canvasRef.value) return
  try {
    const blob = await new Promise<Blob>((resolve) =>
      canvasRef.value!.toBlob((b) => resolve(b!), 'image/png')
    )
    const file = new File([blob], `MLTI-${detail.value.code}.png`, { type: 'image/png' })
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: `我的AI脑力类型：${detail.value.name}` })
    } else {
      downloadImage()
    }
  } catch {
    downloadImage()
  }
}

onMounted(() => {
  generateImage()
})

defineExpose({ generateImage, downloadImage, shareImage })
</script>

<template>
  <div class="personality-image-wrapper">
    <canvas ref="canvasRef" class="hidden" />
    <div v-if="imageUrl" class="relative">
      <img :src="imageUrl" :alt="`${detail.name} 人格图片`" class="w-full rounded-2xl shadow-lg" />
      <div class="mt-4 flex gap-3 justify-center">
        <button @click="downloadImage" class="trend-button-secondary text-sm !px-5 !py-2.5">
          保存图片
        </button>
        <button @click="shareImage" class="trend-button text-sm !px-5 !py-2.5">
          分享结果
        </button>
      </div>
    </div>
  </div>
</template>

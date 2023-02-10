import { render_image as drmDecoder, render_image } from "./lib/cuudrm_bg.js"
import fs from "fs"
import process from "process"
import { createCanvas, loadImage } from "canvas"
const chapterId = process.argv[2]
const chapter = await fetch("https://kakarot.cuutruyen.net/api/v2/chapters/" + chapterId).then(async a => await a.json())

chapter.data.pages.forEach(pageDecoder)
if (!fs.existsSync("./out/" + chapterId)) {
  fs.mkdirSync("./out/" + chapterId)
}
async function pageDecoder(page) {
  const decodedDrm = render_image(undefined, undefined, page.drm_data)
  const base = await loadImage(page.image_url)
  const canvas = createCanvas(page.width, page.height)
  const ctx = canvas.getContext("2d")
  decodedDrm.forEach(part => {
    part[2] = page.width
    part[6] = page.width
    ctx.drawImage(base, ...part)
  })

  const out = fs.createWriteStream(`./out/${chapterId}/${page.order}.png`)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
}

//保存一些特定的工具函数
import { shapeType, props, xy } from './Interface'

const colorHex = function (color: string): string {
  // RGB颜色值的正则
  const reg = /^(rgb|RGB)/
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  if (reg.test(color)) {
    let strHex = '#'
    // 把RGB的3个数值变成数组
    const colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
    // 转成16进制
    for (let i = 0; i < colorArr.length; i++) {
      let hex = Number(colorArr[i]).toString(16)
      if (hex === '0') {
        hex += hex
      }
      if (hex.length === 1) {
        hex = '0' + hex
      }
      strHex += hex
    }
    return strHex
  } else {
    return String(color)
  }
}

const colorRgb = function (color: string): string {
  // 16进制颜色值的正则
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 把颜色值变成小写
  color = color.toLowerCase()
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      let colorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
      }
      color = colorNew
    }
    // 处理六位的颜色值，转为RGB
    const colorChange = []
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
    }
    return 'RGB(' + colorChange.join(',') + ')'
  } else {
    return color
  }
}

const getJSON = function (url: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    const handler = function () {
      if (client.readyState !== 4) {
        return
      }
      if (client.status === 200) {
        resolve(client.responseText)
      } else {
        reject(new Error(client.statusText))
      }
    }

    const client: XMLHttpRequest = new XMLHttpRequest()
    client.open('GET', 'http://www.denggy.top:8058' + url)
    client.onreadystatechange = handler
    client.send()
  })
}

const checkUrl = function (url: string): boolean {
  return /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/.test(
    url
  )
}

export function canvasICOInit(w: number, h: number, type: string, size: number) {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = w
  canvas.height = h
  if (type === 'xpc') {
    ctx.strokeRect(0, 0, w, h)
  }
  if (type === 'hb') {
    canvas.width = w * 2
    canvas.height = h * 2
    ctx.save()
    ctx.beginPath()
    ctx.arc(w, h, size, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.restore()
  }
  return canvas.toDataURL('image/png', 1)
}

const contrast = function (a: number, b: number, width: number, height: number): shapeType {
  const node: shapeType = { width: a, height: b }

  while (a > width || b > height) {
    a = a * 0.8
    b = b * 0.8
  }

  // eslint-disable-next-line prettier/prettier
  [node.width, node.height] = [Math.floor(a), Math.floor(b)]
  return node
}

const imageCreate = function (src: string, { imgFunc }: props, { width, height }: shapeType): void {
  const img: HTMLImageElement = new Image()
  img.src = src
  img.onload = function () {
    const node: shapeType = contrast(img.width, img.height, width, height)
    imgFunc({
      width: node.width,
      height: node.height,
      dWidth: img.width - node.width,
      dHeight: img.height - node.height
    })
  }
}

const lineDistance = function (beginspot: xy, endspot: xy): number {
  //点到点距离公式
  return Math.sqrt(Math.pow(beginspot.x - endspot.x, 2) + Math.pow(beginspot.y - endspot.y, 2))
}

const pointToLine = function (beginline: xy, endline: xy, node: xy): number {
  //点到线距离函数
  if (beginline.x - endline.x !== 0) {
    const k = (beginline.y - endline.y) / (beginline.x - endline.x)
    const b = beginline.y - k * beginline.x
    return Math.abs(k * node.x - node.y + b) / Math.sqrt(Math.pow(k, 2) + 1)
  } else {
    return Math.abs(node.x - beginline.x)
  }
}

export { colorHex, colorRgb, getJSON, checkUrl, contrast, imageCreate, lineDistance, pointToLine }

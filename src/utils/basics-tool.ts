//保存一些特定的工具函数

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
const ellipse = function (
  canvasCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
  anticlockwise: boolean
): void {
  const r = radiusX > radiusY ? radiusX : radiusY //用打的数为半径
  const scaleX = radiusX / r //计算缩放的x轴比例
  const scaleY = radiusY / r //计算缩放的y轴比例
  canvasCtx.save() //保存副本
  canvasCtx.translate(x, y) //移动到圆心位置
  canvasCtx.rotate(rotation) //进行旋转
  canvasCtx.scale(scaleX, scaleY) //进行缩放
  canvasCtx.arc(0, 0, r, startAngle, endAngle, anticlockwise) //绘制圆形
  canvasCtx.restore() //还原副本
}

const ellipsefill = function (
  canvasCtx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
  anticlockwise: boolean
): void {
  const r = radiusX > radiusY ? radiusX : radiusY //用打的数为半径
  const scaleX = radiusX / r //计算缩放的x轴比例
  const scaleY = radiusY / r //计算缩放的y轴比例
  canvasCtx.save() //保存副本
  canvasCtx.translate(x, y) //移动到圆心位置
  canvasCtx.rotate(rotation) //进行旋转
  canvasCtx.scale(scaleX, scaleY) //进行缩放
  canvasCtx.arc(0, 0, r, startAngle, endAngle, anticlockwise) //绘制圆形
  canvasCtx.fill()
  canvasCtx.restore() //还原副本
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

export { colorHex, colorRgb, ellipse, ellipsefill, getJSON, checkUrl }

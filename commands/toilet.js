import axios from 'axios'
import replyTemplate from '../templates/replies.js'
import { distance } from './distance.js'
// import { transform } from './transform.js' 先不用

export default async (event) => {
  try {
    console.log('AAAAAA') // 測試
    // 抓自己的位置
    // 算距離 符合某一個條件
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/IcemakerHuang/Json/main/data/Data_TPE%2BNTPC.json'
    )
    const box = []
    data
      .map((value) => {
        // 取經緯度
        value.distance = distance(event.message.latitude, event.message.longitude, value.latitude, value.longitude, 'K')
        console.log(event.message.latitude)
        console.log(value)
        return value
      })
      .filter((value) => {
        return value.distance < 10
      })
      .sort((a, b) => {
        return a.distance - b.distance
      })
      .slice(0, 5)
      .forEach((value) => {
        const template = replyTemplate()
        const bubble = template.contents[0] // 獲取 replyTemplate 中的第一個 bubble
        // bubble.hero.url = 'https://img.ltn.com.tw/Upload/news/600/2022/04/19/3898832_1_1.jpg'  // 舊版
        bubble.hero.contents[0].url = 'https://img.ltn.com.tw/Upload/news/600/2022/04/19/3898832_1_1.jpg' // 取封面圖
        bubble.hero.contents[1].contents[0].text = value.type // 廁所種類
        if (value.type === '男廁所') {
          bubble.hero.contents[1].backgroundColor = '#4682B4'
        } else if (value.type === '女廁所') {
          bubble.hero.contents[1].backgroundColor = '#CD5C5C'
        }
        bubble.body.contents[0].text = value.name // 廁所名稱
        // bubble.body.contents[1].contents[0].text = value.grade // 廁所等級
        bubble.footer.contents[0].action.uri = `https://www.google.com.tw/maps/place/${
          value.latitude + '+' + value.longitude
        }/@${event.message.latitude},${event.message.longitude},15z?entry=ttu` // 轉去google Map
        bubble.body.contents[2].contents[0].contents[0].text = value.address // 地址
        box.push(bubble) // 將 Line 的 bubble 添加到 box 陣列
        console.log(value)
        // const msg = replyTemplate()
        // msg.hero.url = 'https://img.ltn.com.tw/Upload/news/600/2022/04/19/3898832_1_1.jpg'
        // msg.body.contents[0].text = value.name
        // box.push(msg)
        // console.log(value)
      })

    const result = await event.reply({
      type: 'flex',
      altText: '查詢結果',
      contents: {
        type: 'carousel',
        contents: box
      }
    })
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}

// import fs from 'fs'
// import util from 'util'
// import replyTemplate from '../templates/replies.js'
// import { distance } from './distance.js'

// const readFile = util.promisify(fs.readFile)
// export default async (event) => {
//   try {
//     console.log('AAAAAA')
//     // 讀取 JSON 文件
//     const dataString = await readFile('../data/Data_All.json', 'utf8')
//     const data = JSON.parse(dataString)
//     const box = []

//     data
//       .map((value) => {
//         value.distance = distance(event.message.latitude, event.message.longitude, value.latitude, value.longitude, 'K')
//         console.log(event.message.latitude)
//         console.log(value)
//         return value
//       })
//       .filter((value) => {
//         return value.distance < 10
//       })
//       .sort((a, b) => {+
//         return a.distance - b.distance
//       })
//       .slice(0, 3)
//       .forEach((value) => {
//         const msg = replyTemplate()
//         msg.hero.url = 'https://img.ltn.com.tw/Upload/news/600/2022/04/19/3898832_1_1.jpg'
//         msg.body.contents[0].text = value.name
//         box.push(msg)
//         console.log(value)
//       })

//     const result = await event.reply({
//       type: 'flex',
//       altText: '查詢結果',
//       contents: {
//         type: 'carousel',
//         contents: box
//       }
//     })
//     console.log(result)
//   } catch (error) {
//     console.log(error)
//   }
// }

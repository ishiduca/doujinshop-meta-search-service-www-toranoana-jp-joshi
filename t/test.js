'use strict'
const test = require('tape')
const ToraJoshi = require('../index')
const fs = require('fs')
const path = require('path')
const {pipe, through} = require('mississippi')

test('client = new ToranoanaJoshi', t => {
  const name = 'ec.toranoana.jp/joshi'
  const searchHome = 'https://ec.toranoana.jp/joshi_r/ec/bok/app/catalog/list/'
 const c = ToraJoshi()
 t.is(c.name, name, `c.name eq "${name}"`)
 t.is(c.failAfter, 7, 'c.failAfter === 7')
 t.is(c.searchHome, searchHome, `c.searchHome eq "${searchHome}"`)
 t.end()
})

test('stream = client.scraper()', t => {
  const c = ToraJoshi()
  const html = path.join(__dirname, 'shirohata.html')
  const scraper = c.scraper()
  const buf = []
  const expected_0 = {
    urlOfTitle: 'https://ec.toranoana.jp/joshi_r/ec/item/040030597154/',
    srcOfThumbnail: 'https://ecimg.toranoana.jp/ec/img/04/0030/59/71/040030597154-1p_thumb.jpg',
    title: 'プロデューサーさんお疲れさまですっ！５',
    circle: '同人誌, 白旗, 持ち逃げ, THE IDOLM@STER CINDERELLA GIRLS, プロデューサー, 在庫：△',
    urlOfCircle: null
  }
  const expected_last = {
    urlOfTitle: 'https://ec.toranoana.jp/joshi_r/ec/item/040030197587/',
    srcOfThumbnail: 'https://ecimg.toranoana.jp/ec/img/04/0030/19/75/040030197587-1p_thumb.jpg',
    title: 'プロデューサーさんお疲れさまですっ！',
    circle: '同人誌, 白旗, 持ち逃げ, THE IDOLM@STER, プロデューサー, 在庫：×',
    urlOfCircle: null
  }

  pipe(
    fs.createReadStream(html),
    scraper,
    through.obj((d, _, done) => {
      buf.push(d)
      done()
    }),
    err => {
      t.error(err)
      t.ok(1, 'scraper emit "end"')
      t.is(buf.length, 25)
      t.deepEqual(buf[0], expected_0)
      t.deepEqual(buf[24], expected_last)
      t.end()
    }
  )
})

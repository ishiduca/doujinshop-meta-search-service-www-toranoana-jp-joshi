const url = require('url')
const xtend = require('xtend')
const {pipe, through, duplex, concat} = require('mississippi')
const trumpet = require('trumpet')

const EC_TORANOANA_JP = 'https://ec.toranoana.jp'

module.exports = function scraper () {
  const selector = '#search-result-container .list__item .search-result-inside-container'
  const ws = trumpet()
  const rs = through.obj()
  var c = 0
  var isEnded = false

  ws.selectAll(selector, node => {
    c += 1

    const tr = trumpet()
    const labels = []
    var hash = {}

    tr.once('end', () => {
      rs.write(xtend(hash, {
        circle: labels.join(', '),
        urlOfCircle: null
      }))

      if ((c -= 1) === 0 && isEnded) rs.end()
    })

    tr.select('.product_img a', link => {
      link.getAttribute('href', href => {
        hash = xtend(hash, {urlOfTitle: url.resolve(EC_TORANOANA_JP, href)})
        tr.select('.product_img a img', img => {
          img.getAttribute('src', src => {
            hash = xtend(hash, {srcOfThumbnail: src})
            img.getAttribute('alt', alt => {
              hash = xtend(hash, {title: alt})
              tr.selectAll('.product_desc p label', label => {
                pipe(
                  label.createReadStream(),
                  concat(d => labels.push(String(d))),
                  err => err && console.error(err)
                )
              })
            })
          })
        })
      })
    })

    node.createReadStream().pipe(tr)
  })

  ws.once('end', () => {
    if (c === 0) rs.end()
    else (isEnded = true)
  })

  return duplex.obj(ws, rs)
}

const inherits = require('inherits')
const xtend = require('xtend')
const Service = require('doujinshop-meta-search-service')

module.exports = ToranoanaJoshi
inherits(ToranoanaJoshi, Service)

function ToranoanaJoshi () {
  if (!(this instanceof ToranoanaJoshi)) return new ToranoanaJoshi()
  Service.call(this, 'ec.toranoana.jp/joshi', {
    searchHome: 'https://ec.toranoana.jp/joshi_r/ec/bok/app/catalog/list/'
  })
}

ToranoanaJoshi.prototype.transformQuery = function (_p) {
  const c = {
    mak: 'searchMaker',
    act: 'searchActor',
    nam: 'searchCommodityName',
    // gnr: '',
    gnr: 'searchWord',
    mch: 'searchChara',
    // com: '',
    com: 'searchWord',
    // ser: '',
    // kyw: '',
    kyw: 'searchWord'
  }
  const p = xtend(_p)
  const q = {}; q[c[p.category]] = p.value

  delete p.category
  delete p.value

  return xtend({
    detailSearch: true,
    searchDisplay: 0, // 12
    searchUsedItemFlg: 1,
    searchBackorderFlg: 0,
    searchCategoryCode: '04', // 大カテゴリ
    searchChildrenCategoryCode: 'cot' // 同人誌
  }, q, p)
}

ToranoanaJoshi.prototype._request = function (qstr, requestOpt, onResponse) {
  const opt = {headers: {
    'User-Agent': 'hyperquest/2.13',
    cookie: 'adflg=0'
  }}
  return Service.prototype._request.apply(this, [qstr, xtend(opt, requestOpt), onResponse])
}

ToranoanaJoshi.prototype.scraper = require('./lib/scraper')

#!/usr/bin/env node
'use strict'
const args = require('minimist')(process.argv.slice(2), {
  default: {
    category: 'mak'
  },
  alias: {
    c: 'category',
    h: 'help'
  }
})

if (args.help) {
  help()
  process.exit(0)
}

const {pipe, through} = require('mississippi')
const client = require('../index')
const req = client().createStream()

pipe(
  req,
  through.obj((d, _, done) => done(null, JSON.stringify(d))),
  process.stdout,
  err => err && console.error(err)
)

req.end({
  category: args.category,
  value: args._.filter(Boolean).join(' ')
})

function help () {
  console.log(`usage: > metasearch --category=act 白旗`)
}

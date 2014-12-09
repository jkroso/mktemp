var fs = require('fs')
var os = require('os')

var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)]
}

var tmpdir = os.tmpdir()

function generate(template) {
  return tmpdir + template.replace(/X/g, randomChar)
}

/**
 * create unique name file.
 *
 * @param {String} template template string for filename.
 * @param {Function} callback callback function.
 */

function createFile(template, callback) {
  var filename = generate(template)

  fs.open(filename, 'ax', 384 /*=0600*/, function(err, fd) {
    if (fd) fs.close(fd, finalize)
    else finalize(err)
  })

  function finalize(err) {
    if (err == null) return callback(null, filename)
    if (err.code != 'EEXIST') return callback(err)
    createFile(template, callback)
  }
}

/**
 * sync version createFile.
 *
 * @param {String} template template string for filename.
 * @throws {Error} error of fs.openSync or fs.closeSync.
 * @return {String} created filename.
 */

function createFileSync(template) {
  var filename = generate(template)
  if (fs.existsSync(filename)) return createFileSync(template)
  try {
    var fd = fs.openSync(filename, 'a', 384 /*=0600*/)
  } finally {
    fd && fs.closeSync(fd)
  }
  return filename
}

/**
 * create unique name dir.
 *
 * @param {String} template template string for dirname.
 * @param {Function} callback callback function.
 */

function createDir(template, callback) {
  var dirname = generate(template)
  fs.mkdir(dirname, 448 /*=0700*/, function(err) {
    if (err == null) return callback(null, dirname)
    if (err.code != 'EEXIST') return callback(err)
    createDir(template, callback)
  })
}

/**
 * sync version createDir.
 *
 * @param {String} template template string for dirname.
 * @return {String} created dirname.
 */

function createDirSync(template) {
  var dirname = generate(template)
  try {
    fs.mkdirSync(dirname, 448 /*=0700*/)
  } catch (e) {
    if (e.code != 'EEXIST') throw e
    return createDirSync(template)
  }
  return dirname
}

exports.createFileSync = createFileSync
exports.createDirSync = createDirSync
exports.createFile = createFile
exports.createDir = createDir

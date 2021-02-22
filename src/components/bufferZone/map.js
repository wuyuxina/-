let  staticUrl = process.env.NODE_ENV === 'development' ? '' : '/' + process.env.PRO_NAME
let jtyj = process.env.TARGET + '/jtyj'
export { staticUrl, jtyj }
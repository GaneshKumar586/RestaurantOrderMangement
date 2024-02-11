const fs= require('fs')
const fs_promises = require('fs').promises
const { format } = require('date-fns')
const { v4:uuid } = require('uuid')
const path = require('path')

const logEvent = async(message, logFile)=>{
    const timeDate = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const loggedSentence = `${timeDate}\t${uuid()}\t${message}\n`
    
    try{
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fs_promises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fs_promises.appendFile(path.join(__dirname, '..', 'logs', logFile), loggedSentence )
    } catch(err){
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvent(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = {logEvent, logger}